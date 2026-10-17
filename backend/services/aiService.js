// 修复 P1-13：引入 LRU 缓存，避免 Map 无限增长导致内存泄漏
const LRUCache = require('../utils/lruCache');
// v10.8：抽取 AI provider 基类，减少 6 个 provider 重复代码
const { createProvider } = require('./aiProviders');

class AIService {
  constructor() {
    // v10.8：providers 改为 BaseAIProvider 子类实例（统一接口 chat(prompt, systemPrompt)）
    this.providers = {
      agnes: createProvider('agnes', {
        name: 'Agnes AI',
        baseUrl: 'https://apihub.agnes-ai.com/v1/chat/completions',
        model: process.env.AGNES_MODEL || 'agnes-2.0-flash',
        apiKey: process.env.AGNES_API_KEY || ''
      }),
      tongyi: createProvider('tongyi', {
        name: '通义千问',
        baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        model: 'qwen-plus',
        apiKey: process.env.TONGYI_API_KEY || ''
      }),
      zhipu: createProvider('zhipu', {
        name: '智谱AI (GLM)',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        // v11.2：默认 glm-4-flash（官方免费模型）。glm-4-plus 为付费模型，
        // 免费账户调用返回 429（余额/并发不足），作为兜底链路不可用。
        model: process.env.ZHIPU_MODEL || 'glm-4-flash',
        apiKey: process.env.ZHIPU_API_KEY || ''
      }),
      deepseek: createProvider('deepseek', {
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        apiKey: process.env.DEEPSEEK_API_KEY || ''
      }),
      wenxin: createProvider('wenxin', {
        name: '文心一言',
        baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        model: 'ernie-bot-4',
        apiKey: process.env.WENXIN_API_KEY || ''
      }),
      openai: createProvider('openai', {
        name: 'OpenAI GPT-4',
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview',
        apiKey: process.env.OPENAI_API_KEY || ''
      })
    };

    this.currentProvider = process.env.AI_PROVIDER || 'agnes';
    // 修复 P1-13：LRU 缓存，max=500 防止无限增长，TTL=30min 自动过期
    this.cache = new LRUCache({ max: 500, ttl: 30 * 60 * 1000 });
    this.cacheExpiry = 30 * 60 * 1000; // 30分钟缓存（保留兼容）

    // v11.0 修复 P1：AI 整体时间预算（time budget）
    // 从请求进入 AI 层开始计时，全链路（含多 provider 串行重试）总耗时上限，
    // 超出立即回退本地库，保证用户等待时间可预期（约 8-10s 内必返回）。
    this.totalBudgetMs = Number(process.env.AI_TOTAL_BUDGET_MS) || 9000;
    // 剩余预算低于该值时不再发起新的网络尝试（发起了也来不及完成）
    this.minAttemptMs = 1000;
  }

  /**
   * 生成旅游攻略
   * v11.0 时间控制层（只改时序，不改对外行为）：
   * - 整体预算：从本次调用开始算，AI 全链路总耗时 ≤ totalBudgetMs（默认 9s），超时立即回退本地库；
   *   预算通过 _budget 参数在递归（切换备选 API）间传递，不会因递归重置
   * - 单次请求上限：min(provider.getTimeout()=8s, 剩余预算)，双重裁剪
   * - 熔断冷却：连续失败的 provider 冷却期内直接跳过（不发网络请求），
   *   消除「第二次请求仍等满全程」的耗时波动
   * 对外行为保持不变：响应结构 / source 字段 / 缓存逻辑 / 回退 local-adjusted 均与原版一致
   *
   * @param {string} city - 城市名
   * @param {Object} [preferences] - 用户偏好
   * @param {Object|null} [_budget] - 内部参数：递归间传递的预算上下文 { deadline }
   * @returns {Promise<Object>} 攻略数据
   */
  async generateTravelGuide(city, preferences = {}, _budget = null) {
    const cacheKey = `${city}-${JSON.stringify(preferences)}`;
    // v11.5 UX-8：refresh 时跳过缓存，强制重新请求 AI（规避 30 分钟内反复拿回坏结果）
    const skipCache = Boolean(_budget && _budget.skipCache);

    // 检查缓存（LRU 内部处理 TTL）
    if (!skipCache) {
      const cached = this.cache.get(cacheKey);
      if (cached !== undefined) {
        console.log(`✅ 命中缓存: ${city}`);
        return cached;
      }
    }

    // v11.0：整体预算锚点 —— 仅在最外层调用时创建，递归复用同一 deadline
    const deadline = (_budget && _budget.deadline) || (Date.now() + this.totalBudgetMs);
    // v11.4 修复 Q-3（降级方案）：透传「客户端断开」信号。客户端提前断开时，
    // 尽快终止上游等待并跳过缓存写入（见下方 catch 与 cache.set 守卫）。
    const signal = (_budget && _budget.signal) || null;
    const budget = { deadline, signal, skipCache };

    try {
      const provider = this.providers[this.currentProvider];

      // v11.0：eligibility = 已配置 key 且不在熔断冷却期
      if (!this._isProviderEligible(provider)) {
        console.warn(`⚠️ ${provider.name} 不可用或熔断冷却中，尝试其他可用API`);

        // 尝试查找可用的API Key
        for (const [key, value] of Object.entries(this.providers)) {
          if (value.isAvailable && key !== this.currentProvider && this._isProviderEligible(value)) {
            console.log(`🔄 切换到备用AI: ${value.name}`);
            this.currentProvider = key;
            return this.generateTravelGuide(city, preferences, budget);
          }
        }

        console.warn('❌ 所有AI API均不可用（未配置或冷却中），使用本地数据生成');
        return this.generateLocalGuide(city, preferences);
      }

      // v11.0：预算检查 —— 剩余时间不足以发起有效请求时立即回退
      const remaining = deadline - Date.now();
      if (remaining < this.minAttemptMs) {
        console.warn(`⏱️ AI整体预算已耗尽（剩余 ${remaining}ms），回退本地数据`);
        return this.generateLocalGuide(city, preferences);
      }

      console.log(`🤖 使用${provider.name}生成${city}攻略...`);

      const prompt = this.buildPrompt(city, preferences);

      // v11.0：单次请求超时 = min(单 provider 上限 8s, 剩余预算)，禁止超长超时叠加
      const attemptTimeout = Math.min(provider.getTimeout(), remaining);

      // v10.8：统一调用 provider.chat()；v11.0：外包预算竞速裁剪；v11.4：透传断开信号
      const response = await this._chatWithBudget(provider, prompt, attemptTimeout, signal);

      // v11.0：成功即重置该 provider 的熔断计数
      provider.recordSuccess();

      console.log(`✅ ${provider.name}响应成功`);

      // 解析AI响应为结构化攻略数据
      const guideData = this.parseAIResponse(response, city, preferences);

      // v11.4 Q-3：客户端已断开则不写缓存；v11.5 UX-8：仅结构合格才写缓存（避免缓存坏结果）
      if (!(signal && signal.aborted)) {
        if (this._isCacheableGuide(guideData)) {
          this.cache.set(cacheKey, guideData);
        } else {
          console.warn(`⚠️ 攻略结构不合格（routes/foods 缺失），跳过缓存写入：${city}`);
        }
      }

      return guideData;

    } catch (error) {
      // v11.4 Q-3：客户端已断开 → 不再尝试其它 provider、不记录熔断、不写缓存，直接回退本地
      if (signal && signal.aborted) {
        console.warn('⏹️ 客户端已断开，取消上游等待并回退本地（不写缓存）');
        return this.generateLocalGuide(city, preferences);
      }

      // v11.0：记录失败（可能触发熔断冷却）
      this._recordProviderFailure(this.providers[this.currentProvider], error);
      console.error('❌ AI生成失败:', error.message);

      // 尝试切换到下一个可用的API
      const providers = Object.keys(this.providers);
      const currentIndex = providers.indexOf(this.currentProvider);

      for (let i = currentIndex + 1; i < providers.length; i++) {
        const nextProvider = providers[i];
        if (this._isProviderEligible(this.providers[nextProvider])) {
          console.log(`🔄 切换到备选API: ${this.providers[nextProvider].name}`);
          this.currentProvider = nextProvider;
          try {
            // v11.0：递归传递同一预算上下文，总耗时仍受 deadline 约束
            return await this.generateTravelGuide(city, preferences, budget);
          } catch (e) {
            // 递归内部已记录该 provider 的失败；此处仅继续尝试下一个
            continue;
          }
        }
      }

      // 最终回退到本地数据
      console.log('⚠️ 所有AI API失败，使用本地数据');
      return this.generateLocalGuide(city, preferences);
    }
  }

  /**
   * v11.0：provider 是否允许发起真实网络请求
   * 已配置 API Key 且不在熔断冷却期
   * @param {Object|null} provider
   * @returns {boolean}
   */
  _isProviderEligible(provider) {
    return Boolean(provider && provider.isAvailable && provider.canAttempt());
  }

  /**
   * v11.0：带预算竞速的 provider 调用
   * 双保险：axios 自身 timeout（裁剪到剩余预算）+ Promise.race 硬性定时器，
   * 即使底层请求悬挂（如 DNS 卡死、axios 未生效超时）也能在预算点切断
   * @param {Object} provider - BaseAIProvider 实例
   * @param {string} prompt - 提示词
   * @param {number} timeoutMs - 本次尝试的超时上限（毫秒）
   * @param {AbortSignal|null} [signal] - v11.4 Q-3：客户端断开信号，触发即提前终止等待
   * @returns {Promise<string>} AI 返回文本
   */
  _chatWithBudget(provider, prompt, timeoutMs, signal = null) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        clearTimeout(timer);
        if (signal && typeof signal.removeEventListener === 'function') {
          signal.removeEventListener('abort', onAbort);
        }
      };
      const finish = (fn, arg) => {
        if (settled) return;
        settled = true;
        cleanup();
        fn(arg);
      };

      const timer = setTimeout(() => {
        finish(reject, new Error(`${provider.name} 请求超出时间上限 ${timeoutMs}ms`));
      }, timeoutMs);
      if (typeof timer.unref === 'function') {
        timer.unref(); // 不阻止进程退出
      }

      // v11.4 Q-3：客户端断开 → 立即终止等待（降级方案：无法真正 abort 底层 axios，
      // 但可让调用方尽早返回、跳过后续 provider 尝试与缓存写入）。
      const onAbort = () => {
        const err = new Error('客户端已断开，取消上游等待');
        err.name = 'AbortError';
        finish(reject, err);
      };
      if (signal) {
        if (signal.aborted) {
          onAbort();
          return;
        }
        if (typeof signal.addEventListener === 'function') {
          signal.addEventListener('abort', onAbort, { once: true });
        }
      }

      provider.chat(prompt, undefined, timeoutMs, signal).then(
        result => finish(resolve, result),
        err => finish(reject, err)
      );
    });
  }

  /**
   * v11.0：记录 provider 失败并在触发熔断时输出日志
   * @param {Object|null} provider
   * @param {Error|null} error
   */
  _recordProviderFailure(provider, error) {
    if (!provider || typeof provider.recordFailure !== 'function') {
      return;
    }
    provider.recordFailure(error);
    const cooldownMs = provider.cooldownRemainingMs();
    if (cooldownMs > 0) {
      console.warn(
        `🚫 ${provider.name} 连续失败已达 ${provider.breakerThreshold} 次，` +
        `熔断进入冷却 ${Math.round(cooldownMs / 1000)}s，冷却期内跳过该 provider`
      );
    }
  }

  /**
   * v11.5 UX-8：攻略结构是否「值得缓存」
   * 仅当 routes 为非空且至少 1 条非空（字符串或含 routeLine/route/spots）、
   * foods 为非空且至少 1 个有有效 name 时，才允许写入缓存，避免缓存空壳结果。
   * @param {Object} g - 解析后的攻略数据
   * @returns {boolean}
   */
  _isCacheableGuide(g) {
    if (!g || typeof g !== 'object') return false;
    const routes = Array.isArray(g.routes) ? g.routes : [];
    const hasRoute = routes.some(r => {
      if (typeof r === 'string') return r.trim().length > 0;
      if (!r || typeof r !== 'object') return false;
      if ((r.routeLine && String(r.routeLine).trim()) || (r.route && String(r.route).trim())) return true;
      return Array.isArray(r.spots) && r.spots.length > 0;
    });
    const foods = Array.isArray(g.foods) ? g.foods : [];
    const hasFood = foods.some(f => f && typeof f.name === 'string' && f.name.trim().length > 0);
    return hasRoute && hasFood;
  }

  buildPrompt(city, preferences) {
    const days = Math.min(Math.max(preferences.days || 3, 1), 7);
    const origin = preferences.origin || '';        // v9.0 出发地
    const travelers = preferences.travelers || '2'; // v9.0 人数

    // 精简版 prompt：要求 AI 输出与本地数据结构兼容的紧凑 JSON
    // 避免过长 prompt 导致 AI 后端 502 或超时
    // 关键：在 prompt 开头和结尾都强烈强调城市名，防止 AI 混淆城市
    const prompt = `【重要：本次任务是为「${city}」生成攻略，所有内容必须严格属于${city}，禁止返回其他城市的数据】
${origin ? `游客从【${origin}】出发前往【${city}】，` : ''}出行人数 ${travelers} 人。

请为【${city}】生成一份${days}日旅游攻略，以严格 JSON 格式输出（不要 markdown 标记、不要额外说明）。

JSON 结构如下（字段名保持一致，值用中文）：
{
  "tags": ["标签1", "标签2", "标签3"],
  "season": "最佳旅游季节",
  "atmosphere": "${city}的城市氛围一句话描述",
  "days": "${days}-${days + 1}天",
  "routes": [
    "Day1: ${city}景点A → ${city}景点B → ${city}景点C",
    "Day2: ${city}景点D → ${city}景点E → ${city}景点F"
  ],
  "foods": [
    {"name": "${city}特色美食名", "desc": "简短描述", "price": "XX-XX元", "mustTry": true}
  ],
  "accommodations": [
    {"area": "${city}区域名", "pros": "优点", "cons": "缺点"}
  ],
  "transport": [
    {"type": "内部交通", "info": "${city}市内交通简述"},
    {"type": "外部交通", "info": "${origin ? '从' + origin + '到' + city + '的交通方式（仅' + city + '本地机场/高铁站）' : '如何到达' + city + '（仅' + city + '本地机场/高铁站）'}"}
  ],
  "budget": {"low": "XX", "medium": "XX", "high": "XX+"},
  "tips": {
    "prepare": ["必备物品1", "必备物品2", "必备物品3", "必备物品4"],
    "avoid": ["${city}避坑提示1", "避坑提示2", "避坑提示3"]
  },
  "poster": {
    "title": "${city}海报主标题",
    "subtitle": "${city}海报副标题",
    "elements": ["元素1", "元素2", "元素3", "元素4"],
    "layout": "布局描述",
    "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]
  },
  "itineraries": {
    "1天": {
      "routes": [
        {"time": "09:00-12:00", "period": "上午", "spots": ["${city}景点A", "${city}景点B"]},
        {"time": "14:00-17:00", "period": "下午", "spots": ["${city}景点C", "${city}景点D"]},
        {"time": "18:00-21:00", "period": "晚上", "spots": ["${city}景点E"]}
      ],
      "tips": ["提示1", "提示2"],
      "budget": "XX-XX元"
    }
  }
}

要求：
1. routes 数组提供 ${days} 条路线，每条一行，所有景点必须位于${city}市内
2. foods 提供 4-6 道当地特色美食，必须是${city}本地美食
3. accommodations 提供 2-3 个区域建议，区域必须是${city}的行政区或地标
4. transport 提供内部+外部交通，外部交通中的机场/高铁站必须服务于${city}${origin ? '，需包含从' + origin + '出发的具体建议' : ''}
5. budget 给出低/中/高三档人均预算（元/天），考虑 ${travelers} 人出行的分摊效应
6. tips.prepare 至少 4 项，avoid 至少 3 项
7. poster.colors 提供 5 个十六进制颜色
8. itineraries 至少提供 "1天" 的行程，包含时间段（上午/下午/晚上）
9. 所有内容必须真实合理，符合 ${city} 的实际情况
10. 【最高优先级】所有内容必须严格围绕【${city}】生成：
    - 不得出现其他城市的景点、美食、机场、高铁站
    - 如果不确定 ${city} 的信息，请基于该城市所属省份和地理特征合理推测
    - 绝不能返回其他城市的数据（这是严重错误）
11. 请再次确认：你正在为「${city}」生成攻略，不是其他任何城市`;

    return prompt;
  }

  // v10.8：6 个 callXxxAPI 方法已迁移至 backend/services/aiProviders.js
  // 统一通过 provider.chat(prompt) 调用，减少约 200 行重复代码

  parseAIResponse(responseText, city, preferences) {
    try {
      console.log('🔍 开始解析AI响应...');

      let jsonStr = responseText;

      // 移除可能的markdown代码块标记
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      jsonStr = jsonStr.replace(/```\n?/g, '');

      // 提取JSON对象
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const data = JSON.parse(jsonStr);

      console.log('✅ JSON解析成功');

      // 城市混淆检测：检查 AI 返回的内容是否明显属于其他城市
      // 已知的热门城市列表（用于检测 AI 是否返回了错误城市的内容）
      const knownCities = ['北京','上海','广州','深圳','成都','杭州','西安','重庆','南京','苏州',
        '厦门','青岛','大连','武汉','长沙','天津','丽江','三亚','哈尔滨','昆明','桂林','拉萨',
        '乌鲁木齐','敦煌','大理','沈阳','长春','济南','郑州','合肥','南昌','福州','贵阳',
        '兰州','西宁','银川','太原','石家庄','呼和浩特','海口','南宁','珠海','汕头'];
      const otherCities = knownCities.filter(c => c !== city);

      // 只检测核心字段（routes/title/foods.name），避免误报
      // 如果核心字段中出现任何其他城市名，强烈怀疑 AI 混淆了城市
      const routesStr = JSON.stringify(data.routes || []);
      const titleStr = JSON.stringify(data.title || '') + JSON.stringify(data.subtitle || '') + JSON.stringify(data.poster?.title || '') + JSON.stringify(data.poster?.subtitle || '');
      const foodsStr = JSON.stringify((data.foods || []).map(f => f.name).join(' '));
      const coreContent = routesStr + titleStr + foodsStr;

      const detectedCities = otherCities.filter(c => coreContent.includes(c));
      if (detectedCities.length >= 1) {
        // 核心字段中出现 1 个及以上其他城市名，强烈怀疑 AI 混淆了城市
        console.warn(`⚠️ 检测到 AI 可能混淆城市：请求「${city}」，但核心内容中出现了其他城市：${detectedCities.join('、')}`);
        console.warn('⚠️ 将标记为需前端回退本地数据');
        // 在返回数据中添加警告标记，前端可据此回退到本地数据
        data._cityMismatch = true;
        data._detectedCities = detectedCities;
      }

      // 兼容 AI 返回的精简格式与完整格式
      // AI 精简格式: tags/season/atmosphere/days/routes/foods/accommodations/transport/budget/tips/poster/itineraries
      // 完整格式:   city/title/subtitle/season/duration/routes/foods/accommodations/transportation/tips/budget
      const normalized = {
        city: city, // 强制使用请求的城市名，不信任 AI 返回的 city 字段（防止 AI 混淆城市）
        title: data.title || data.poster?.title || `${city}·AI定制之旅`,
        subtitle: data.subtitle || data.poster?.subtitle || data.atmosphere || `发现${city}的独特魅力`,
        season: data.season || '四季皆宜',
        atmosphere: data.atmosphere || '',
        duration: data.duration || data.days || `${preferences.days || 3}天`,
        days: data.days || `${preferences.days || 3}天`,
        overallBudget: data.overallBudget || (data.budget ? `低${data.budget.low}/中${data.budget.medium}/高${data.budget.high}元` : '待估算'),
        difficulty: data.difficulty || '适中',
        routes: data.routes || [],
        foods: data.foods || [],
        accommodations: data.accommodations || [],
        transport: data.transport || data.transportation || [],
        transportation: data.transportation || data.transport || {},
        budget: data.budget || {},
        tips: data.tips || {},
        practicalInfo: data.practicalInfo || {},
        itineraries: data.itineraries || {},
        poster: data.poster || this.generatePosterConfig(data),
        tags: (Array.isArray(data.tags) && data.tags.length > 0) ? data.tags : this.extractTags(data),
        generatedAt: new Date().toISOString(),
        source: 'ai',
        provider: this.providers[this.currentProvider]?.name || 'unknown',
        // 城市混淆标记（前端可据此回退到本地数据）
        cityMismatch: data._cityMismatch || false
      };

      return normalized;

    } catch (error) {
      console.error('❌ JSON解析失败:', error.message);
      console.error('原始响应长度:', responseText.length);

      // 如果JSON解析失败，尝试从文本中提取关键信息
      return this.extractFromText(responseText, city, preferences);
    }
  }

  extractFromText(text, city, preferences) {
    console.log('⚠️ 使用文本解析回退方案');
    
    // 简单的文本解析回退方案
    return {
      city: city,
      title: `${city}·AI定制之旅`,
      subtitle: '由AI智能生成的专属攻略',
      season: '四季皆宜',
      duration: `${preferences.days || 3}天`,
      overallBudget: '待计算',
      difficulty: '适中',
      routes: [{
        day: 1,
        theme: '精选行程',
        highlights: ['AI推荐'],
        spots: [{
          name: '主要景点',
          reason: text.substring(0, 150) + '...',
          duration: '2-3小时',
          ticket: { adult: '待查询', student: '待查询' },
          tips: ['建议提前预约'],
          rating: '⭐⭐⭐⭐⭐'
        }]
      }],
      foods: [{
        name: '当地特色',
        description: text.substring(0, 80) + '...',
        price: '待查询',
        mustTry: true,
        rating: 5,
        whereToEat: [{ name: '推荐店铺', address: '市区' }]
      }],
      accommodations: [{
        name: '推荐住宿',
        area: '市中心',
        distance: '交通便利',
        priceRange: { lowSeason: '200元', peakSeason: '500元' },
        features: ['干净卫生', '服务好'],
        suitableFor: ['所有旅客'],
        rating: '⭐⭐⭐⭐'
      }],
      transportation: { arrival: {}, localTransport: {} },
      tips: { prepare: [], avoid: [], bestTime: [] },
      budget: { total: '待计算', breakdown: {} },
      tags: ['AI生成', 'custom'],
      poster: { style: 'fresh' },
      generatedAt: new Date().toISOString(),
      source: 'ai-text',
      provider: this.providers[this.currentProvider]?.name || 'unknown'
    };
  }

  extractTags(data) {
    const tags = ['AI智能生成', '个性化定制'];
    
    if (data.routes && data.routes.length > 0) {
      const spotNames = data.routes.flatMap(r => 
        (r.spots || []).map(s => s.name)
      );
      
      if (spotNames.some(n => n.includes('博物馆') || n.includes('故宫') || n.includes('历史') || n.includes('寺庙'))) {
        tags.push('历史文化');
      }
      if (spotNames.some(n => n.includes('山') || n.includes('湖') || n.includes('公园') || n.includes('海'))) {
        tags.push('自然风光');
      }
      if (data.foods && data.foods.length >= 5) {
        tags.push('美食天堂');
      }
      if (data.difficulty === '较累') {
        tags.push('深度游');
      }
    }
    
    return tags.slice(0, 6); // 限制标签数量
  }

  generatePosterConfig(data) {
    const styles = ['fresh', 'vintage', 'minimal'];
    const city = data.city || data.title || 'travel';
    const styleIndex = Math.abs(this.hashCode(city)) % styles.length;

    return {
      style: styles[styleIndex],
      title: data.title || data.poster?.title || '',
      subtitle: data.subtitle || data.poster?.subtitle || '',
      colorScheme: this.getColorScheme(city)
    };
  }

  generateSubtitle(data) {
    const subtitles = [
      `发现${data.city}的${data.duration || '3'}天精彩`,
      `${data.city}深度游攻略`,
      `${data.city}·不负好时光`
    ];
    return subtitles[Math.floor(Math.random() * subtitles.length)];
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  getColorScheme(city) {
    const schemes = {
      '北京': { primary: '#C41E3A', secondary: '#FFD700', bg: '#FFF8DC' },
      '上海': { primary: '#FF6B6B', secondary: '#4ECDC4', bg: '#F7F9FC' },
      '成都': { primary: '#2ECC71', secondary: '#F39C12', bg: '#E8F5E9' },
      '西安': { primary: '#8B4513', secondary: '#DAA520', bg: '#FAEBD7' },
      '杭州': { primary: '#3498DB', secondary: '#E74C3C', bg: '#EBF5FB' },
      '重庆': { primary: '#E74C3C', secondary: '#F39C12', bg: '#FEF9E7' },
      'default': { primary: '#FF6B6B', secondary: '#4ECDC4', bg: '#F8F9FA' }
    };
    
    return schemes[city] || schemes['default'];
  }

  // 本地数据生成（当AI不可用时的回退方案）
  generateLocalGuide(city, preferences) {
    console.log('📦 使用本地数据生成攻略');

    const storage = require('./storage');

    // 尝试从本地数据库获取基础数据
    let baseData = null;
    try {
      baseData = storage.getCitySync ? storage.getCitySync(city) : null;
    } catch (e) {
      console.warn('无法获取本地数据:', e.message);
    }

    // 如果有本地数据，基于它进行调整
    if (baseData) {
      return this.adjustLocalGuide(baseData, preferences);
    }

    // v10.2: 完全生成模拟数据，标记为未知城市
    const guide = this.generateMockGuide(city, preferences);
    guide.isUnknownCity = true;
    return guide;
  }

  adjustLocalGuide(baseData, preferences) {
    const adjusted = JSON.parse(JSON.stringify(baseData));

    // v10.2: 天数边界限制
    const rawDays = Number(preferences.days) || 3;
    const days = Math.min(Math.max(rawDays, 1), 7);

    // 根据天数调整行程
    if (adjusted.routes) {
      adjusted.routes = adjusted.routes.slice(0, days);
    }
    
    // 根据旅行类型调整内容权重
    if (preferences.travelType === 'foodie' && adjusted.foods) {
      adjusted.foods = [...adjusted.foods, ...this.generateExtraFoods(adjusted.tags)];
    }
    
    // 根据预算筛选住宿
    // v11.4 修复 LOG-1（P2）：原实现用 parseInt(acc.priceRange)，而 priceRange 多为对象
    // （{lowSeason,peakSeason}）或缺失 → NaN → 比较恒 false → 选 low/high 时 accommodations
    // 被清空、结果页「住宿推荐」整块消失（本地降级是 AI 不可用时最常见路径）。
    // 改为：字符串取数字前缀、对象解析 lowSeason/peakSeason、缺失则视为「无价格数据」保留不过滤；
    // 并对「筛选后为空」做兜底（保留全部），杜绝整块消失。
    if (preferences.budgetRange && Array.isArray(adjusted.accommodations)) {
      const parsePrice = (priceRange) => {
        if (priceRange == null) return NaN;
        if (typeof priceRange === 'number') return priceRange;
        if (typeof priceRange === 'string') {
          const m = priceRange.match(/\d+/);
          return m ? parseInt(m[0], 10) : NaN;
        }
        if (typeof priceRange === 'object') {
          for (const raw of [priceRange.lowSeason, priceRange.peakSeason]) {
            const m = raw != null ? String(raw).match(/\d+/) : null;
            if (m) return parseInt(m[0], 10);
          }
        }
        return NaN;
      };

      let predicate = null;
      if (preferences.budgetRange === 'low') {
        // 无价格数据（NaN）时保留，不因信息缺失而丢弃
        predicate = acc => { const p = parsePrice(acc && acc.priceRange); return Number.isNaN(p) ? true : p < 300; };
      } else if (preferences.budgetRange === 'high') {
        predicate = acc => { const p = parsePrice(acc && acc.priceRange); return Number.isNaN(p) ? true : p > 500; };
      }

      if (predicate) {
        const filtered = adjusted.accommodations.filter(predicate);
        // 兜底：若筛选结果为空则保留全部，避免住宿推荐整块消失
        adjusted.accommodations = filtered.length > 0 ? filtered : adjusted.accommodations;
      }
    }
    
    adjusted.generatedAt = new Date().toISOString();
    adjusted.source = 'local-adjusted';
    
    return adjusted;
  }

  generateExtraFoods(tags) {
    const extraFoodTemplates = [
      { name: '地方小吃', description: '当地特色街头美食', price: '15-25元', mustTry: true, location: '老城区' },
      { name: '传统甜品', description: '祖传配方制作', price: '10-20元', mustTry: false, location: '步行街' },
      { name: '夜市烧烤', description: '夜晚必吃美食', price: '30-50元', mustTry: true, location: '夜市' }
    ];
    
    return extraFoodTemplates.slice(0, Math.min(2, extraFoodTemplates.length));
  }

  generateMockGuide(city, preferences) {
    // v10.2: 天数边界限制（与前端一致）
    const rawDays = Number(preferences.days) || 3;
    const days = Math.min(Math.max(rawDays, 1), 7);
    const routes = [];
    
    for (let i = 1; i <= days; i++) {
      routes.push({
        day: i,
        theme: `第${i}天：${city}精华游`,
        highlights: ['精选景点', '深度体验'],
        spots: [
          { 
            name: `${city}地标景点`, 
            reason: '城市标志性建筑，必打卡之地', 
            duration: '2-3小时', 
            ticket: { adult: '免费', student: '免费' }, 
            tips: ['建议上午前往', '携带相机'], 
            rating: '⭐⭐⭐⭐⭐'
          },
          { 
            name: '历史文化街区', 
            reason: '感受当地文化底蕴', 
            duration: '1-2小时', 
            ticket: { adult: '免费', student: '免费' }, 
            tips: ['适合拍照', '品尝小吃'], 
            rating: '⭐⭐⭐⭐'
          },
          { 
            name: '特色美食街', 
            reason: '汇集当地最正宗的美味', 
            duration: '1-2小时', 
            ticket: { adult: '免费', student: '免费' }, 
            tips: ['午餐推荐地点', '人多需排队'], 
            rating: '⭐⭐⭐⭐⭐'
          }
        ]
      });
    }
    
    return {
      city: city,
      title: `${city}·发现之旅`,
      subtitle: '探索这座城市的独特魅力',
      season: '四季皆宜',
      duration: `${days}天`,
      overallBudget: `${days * 500}-${days * 1500}元`,
      difficulty: '适中',
      routes: routes,
      foods: [
        { 
          name: `${city}特色菜`, 
          description: '当地招牌美食，不容错过', 
          price: '38-68元', 
          mustTry: true, 
          rating: 5,
          whereToEat: [{ name: '老字号餐厅', address: '市中心' }]
        },
        { 
          name: '传统小吃', 
          description: '百年老店出品，传承经典', 
          price: '15-30元', 
          mustTry: true, 
          rating: 5,
          whereToEat: [{ name: '知名小店', address: '老街' }]
        }
      ],
      accommodations: [
        {
          name: `${city}快捷酒店`,
          area: '市中心',
          distance: '距主要景点10分钟',
          priceRange: { lowSeason: '200元', peakSeason: '400元' },
          features: ['交通便利', '干净卫生', '性价比高'],
          suitableFor: ['所有旅客'],
          rating: '⭐⭐⭐⭐'
        }
      ],
      transportation: {
        arrival: { byAir: {}, byTrain: {} },
        localTransport: { metro: '', bus: '' }
      },
      tips: {
        prepare: ['身份证', '舒适鞋子', '充电宝', '相机'],
        avoid: ['避免高峰期出行', '注意天气变化', '不要相信黑导游'],
        bestTime: ['春秋两季最佳', '避开节假日']
      },
      budget: {
        total: `${days * 500}-${days * 1500}元`,
        breakdown: {
          transportation: '500-1000元',
          accommodation: `${days * 200}-${days * 600}元`,
          food: `${days * 150}-${days * 400}元`,
          tickets: '200-500元',
          other: '200-500元'
        },
        moneySavingTips: ['提前预订酒店', '使用学生证', '避开旺季']
      },
      practicalInfo: {
        customs: ['尊重当地风俗'],
        network: '',
        payment: '支持支付宝/微信'
      },
      tags: ['热门目的地', '本地数据'],
      poster: { style: 'fresh' },
      generatedAt: new Date().toISOString(),
      source: 'local-mock',
      provider: 'Local Database'
    };
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
    console.log('🗑️ AI缓存已清除');
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: this.cache.keys(),
      currentProvider: this.currentProvider,
      // v10.8：使用 provider.isAvailable 替代直接访问 apiKey
      availableProviders: Object.keys(this.providers).filter(key =>
        this.providers[key].isAvailable
      )
    };
  }

  // 切换AI提供商
  switchProvider(providerName) {
    if (this.providers[providerName]) {
      this.currentProvider = providerName;
      console.log(`🔄 AI提供商已切换至: ${this.providers[providerName].name}`);
      return true;
    }
    return false;
  }

  // 获取所有可用提供商列表
  getAvailableProviders() {
    return Object.entries(this.providers)
      .filter(([key, value]) => value.isAvailable)
      .map(([key, value]) => ({
        id: key,
        name: value.name,
        model: value.model,
        current: key === this.currentProvider
      }));
  }

  // v10.0: 获取 AI 修图建议
  // v10.8: 改用统一的 provider.chat() 接口，移除内联 axios 调用
  async getPhotoEditAdvice(city, guideContext) {
    const provider = this.providers[this.currentProvider];
    if (!provider.isAvailable) {
      throw new Error('AI API 未配置');
    }
    const season = guideContext.season || '四季皆宜';
    const tags = (guideContext.tags || []).join('、') || '通用';
    const prompt = `你是一位专业旅行摄影师，请为【${city}】的旅行照片提供修图建议。
照片季节：${season}
城市标签：${tags}

请基于该城市的特色，给出 3-5 条具体的修图建议，包括：
1. 色调方向（暖色/冷色/复古/清新等）
2. 曝光与对比度调整
3. 饱和度建议
4. 构图裁剪建议
5. 特殊效果（如暗角、柔光、胶片感等）

请直接输出建议文字，不要 markdown 标记，200 字以内。`;

    const systemPrompt = '你是一位拥有10年经验的专业旅行摄影师，擅长后期修图。';
    try {
      const text = await provider.chat(prompt, systemPrompt);
      return text.trim();
    } catch (error) {
      console.error('AI 修图建议失败:', error.message);
      throw error;
    }
  }
}

module.exports = new AIService();