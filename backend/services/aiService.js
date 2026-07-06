const axios = require('axios');

class AIService {
  constructor() {
    this.providers = {
      agnes: {
        name: 'Agnes AI',
        baseUrl: 'https://apihub.agnes-ai.com/v1/chat/completions',
        model: process.env.AGNES_MODEL || 'agnes-2.0-flash',
        apiKey: process.env.AGNES_API_KEY || ''
      },
      tongyi: {
        name: '通义千问',
        baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        model: 'qwen-plus',
        apiKey: process.env.TONGYI_API_KEY || ''
      },
      zhipu: {
        name: '智谱AI (GLM-4)',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4-plus',
        apiKey: process.env.ZHIPU_API_KEY || ''
      },
      deepseek: {
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        apiKey: process.env.DEEPSEEK_API_KEY || ''
      },
      wenxin: {
        name: '文心一言',
        baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        model: 'ernie-bot-4',
        apiKey: process.env.WENXIN_API_KEY || ''
      },
      openai: {
        name: 'OpenAI GPT-4',
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview',
        apiKey: process.env.OPENAI_API_KEY || ''
      }
    };
    
    this.currentProvider = process.env.AI_PROVIDER || 'agnes';
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30分钟缓存
  }

  async generateTravelGuide(city, preferences = {}) {
    const cacheKey = `${city}-${JSON.stringify(preferences)}`;
    
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log(`✅ 命中缓存: ${city}`);
        return cached.data;
      }
    }

    try {
      const provider = this.providers[this.currentProvider];
      
      if (!provider.apiKey) {
        console.warn(`⚠️ ${provider.name} API Key未配置，尝试其他可用API`);
        
        // 尝试查找可用的API Key
        for (const [key, value] of Object.entries(this.providers)) {
          if (value.apiKey && key !== this.currentProvider) {
            console.log(`🔄 切换到备用AI: ${value.name}`);
            this.currentProvider = key;
            return this.generateTravelGuide(city, preferences);
          }
        }
        
        console.warn('❌ 所有AI API均未配置，使用本地数据生成');
        return this.generateLocalGuide(city, preferences);
      }

      console.log(`🤖 使用${provider.name}生成${city}攻略...`);
      
      const prompt = this.buildPrompt(city, preferences);
      let response;

      switch (this.currentProvider) {
        case 'agnes':
          response = await this.callAgnesAPI(prompt, provider);
          break;
        case 'tongyi':
          response = await this.callTongyiAPI(prompt, provider);
          break;
        case 'zhipu':
          response = await this.callZhipuAPI(prompt, provider);
          break;
        case 'deepseek':
          response = await this.callDeepSeekAPI(prompt, provider);
          break;
        case 'wenxin':
          response = await this.callWenxinAPI(prompt, provider);
          break;
        case 'openai':
          response = await this.callOpenAIAPI(prompt, provider);
          break;
        default:
          throw new Error(`不支持的AI提供商: ${this.currentProvider}`);
      }

      console.log(`✅ ${provider.name}响应成功`);
      
      // 解析AI响应为结构化攻略数据
      const guideData = this.parseAIResponse(response, city, preferences);
      
      // 缓存结果
      this.cache.set(cacheKey, { data: guideData, timestamp: Date.now() });
      
      return guideData;

    } catch (error) {
      console.error('❌ AI生成失败:', error.message);
      
      // 尝试切换到下一个可用的API
      const providers = Object.keys(this.providers);
      const currentIndex = providers.indexOf(this.currentProvider);
      
      for (let i = currentIndex + 1; i < providers.length; i++) {
        const nextProvider = providers[i];
        if (this.providers[nextProvider].apiKey) {
          console.log(`🔄 切换到备选API: ${this.providers[nextProvider].name}`);
          this.currentProvider = nextProvider;
          try {
            return await this.generateTravelGuide(city, preferences);
          } catch (e) {
            continue;
          }
        }
      }
      
      // 最终回退到本地数据
      console.log('⚠️ 所有AI API失败，使用本地数据');
      return this.generateLocalGuide(city, preferences);
    }
  }

  buildPrompt(city, preferences) {
    const days = Math.min(Math.max(preferences.days || 3, 1), 7);

    // 精简版 prompt：要求 AI 输出与本地数据结构兼容的紧凑 JSON
    // 避免过长 prompt 导致 AI 后端 502 或超时
    const prompt = `请为【${city}】生成一份${days}日旅游攻略，以严格 JSON 格式输出（不要 markdown 标记、不要额外说明）。

JSON 结构如下（字段名保持一致，值用中文）：
{
  "tags": ["标签1", "标签2", "标签3"],
  "season": "最佳旅游季节",
  "atmosphere": "城市氛围一句话描述",
  "days": "${days}-${days + 1}天",
  "routes": [
    "Day1: 景点A → 景点B → 景点C",
    "Day2: 景点D → 景点E → 景点F"
  ],
  "foods": [
    {"name": "美食名", "desc": "简短描述", "price": "XX-XX元", "mustTry": true}
  ],
  "accommodations": [
    {"area": "区域名", "pros": "优点", "cons": "缺点"}
  ],
  "transport": [
    {"type": "内部交通", "info": "简述"},
    {"type": "外部交通", "info": "简述"}
  ],
  "budget": {"low": "XX", "medium": "XX", "high": "XX+"},
  "tips": {
    "prepare": ["必备物品1", "必备物品2", "必备物品3", "必备物品4"],
    "avoid": ["避坑提示1", "避坑提示2", "避坑提示3"]
  },
  "poster": {
    "title": "海报主标题",
    "subtitle": "海报副标题",
    "elements": ["元素1", "元素2", "元素3", "元素4"],
    "layout": "布局描述",
    "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]
  },
  "itineraries": {
    "1天": {
      "routes": [
        {"time": "09:00-12:00", "morning": "行程"},
        {"time": "12:00-14:00", "afternoon": "午餐"},
        {"time": "14:00-17:00", "afternoon2": "行程"},
        {"time": "18:00-21:00", "evening": "晚餐/夜景"}
      ],
      "tips": ["提示1", "提示2"],
      "budget": "XX-XX元"
    }
  }
}

要求：
1. routes 数组提供 ${days} 条路线，每条一行
2. foods 提供 4-6 道当地特色美食
3. accommodations 提供 2-3 个区域建议
4. transport 提供内部+外部交通
5. budget 给出低/中/高三档人均预算（元/天）
6. tips.prepare 至少 4 项，avoid 至少 3 项
7. poster.colors 提供 5 个十六进制颜色
8. itineraries 至少提供 "1天" 的行程，如有空间可提供 "2天1晚"
9. 所有内容必须真实合理，符合 ${city} 的实际情况
10. 重要：所有内容必须严格围绕【${city}】生成，transport 中不得出现其他城市的机场/高铁站，foods 必须是 ${city} 的本地美食
11. 如果不确定 ${city} 的信息，请基于该城市的省份和地理特征合理推测，但绝不能返回其他城市的数据`;

    return prompt;
  }

  // ==================== 各AI提供商调用方法 ====================

  // Agnes AI (OpenAI 兼容接口，支持文本/多模态，免费额度)
  async callAgnesAPI(prompt, provider) {
    console.log('📡 调用 Agnes AI API...');

    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: '你是一位拥有15年经验的资深旅游规划师，擅长根据用户需求制定个性化旅游攻略。你的攻略详细、实用、可操作性强。请始终以标准的JSON格式输出，不要添加任何markdown标记或额外说明。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 4000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'Accept': 'application/json',
        'Accept-Encoding': 'identity',
        'User-Agent': 'travel-guide/2.0'
      },
      timeout: 120000,
      decompress: false,
      // 不使用代理
      proxy: false
    });

    console.log('✅ Agnes AI 响应成功');
    return response.data.choices[0].message.content;
  }

  async callTongyiAPI(prompt, provider) {
    console.log('📡 调用通义千问API...');
    
    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      input: {
        messages: [
          {
            role: 'system',
            content: '你是一位拥有15年经验的资深旅游规划师，擅长根据用户需求制定个性化旅游攻略。你的攻略详细、实用、可操作性强。请始终以标准的JSON格式输出，不要添加任何markdown标记或额外说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      parameters: {
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: 8000,
        result_format: 'message'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'X-DashScope-SSE': 'disable'
      },
      timeout: 60000
    });

    console.log('✅ 通义千问响应成功');
    return response.data.output.choices[0].message.content;
  }

  async callZhipuAPI(prompt, provider) {
    console.log('📡 调用智谱GLM-4 API...');
    
    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: '你是一位拥有15年经验的资深旅游规划师，擅长根据用户需求制定个性化旅游攻略。你的攻略详细、实用、可操作性强。请始终以标准的JSON格式输出，不要添加任何markdown标记或额外说明。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 8000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      timeout: 60000
    });

    console.log('✅ 智谱GLM-4响应成功');
    return response.data.choices[0].message.content;
  }

  async callDeepSeekAPI(prompt, provider) {
    console.log('📡 调用DeepSeek API...');
    
    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: '你是一位拥有15年经验的资深旅游规划师，擅长根据用户需求制定个性化旅游攻略。你的攻略详细、实用、可操作性强。请始终以标准的JSON格式输出，不要添加任何markdown标记或额外说明。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      timeout: 60000
    });

    console.log('✅ DeepSeek响应成功');
    return response.data.choices[0].message.content;
  }

  async callWenxinAPI(prompt, provider) {
    console.log('📡 调用文心一言API...');
    
    const tokenResponse = await axios.post(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.WENXIN_CLIENT_ID}&client_secret=${process.env.WENXIN_CLIENT_SECRET}`
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    const response = await axios.post(
      `${provider.baseUrl}?access_token=${accessToken}`,
      {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        top_p: 0.8,
        penalty_score: 1.0
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    console.log('✅ 文心一言响应成功');
    return response.data.result;
  }

  async callOpenAIAPI(prompt, provider) {
    console.log('📡 调用OpenAI GPT-4 API...');
    
    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: '你是一位拥有15年经验的资深旅游规划师，擅长根据用户需求制定个性化旅游攻略。你的攻略详细、实用、可操作性强。请始终以标准的JSON格式输出，不要添加任何markdown标记或额外说明。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      timeout: 60000
    });

    console.log('✅ OpenAI GPT-4响应成功');
    return response.data.choices[0].message.content;
  }

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
        provider: this.providers[this.currentProvider]?.name || 'unknown'
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

    // 完全生成模拟数据
    return this.generateMockGuide(city, preferences);
  }

  adjustLocalGuide(baseData, preferences) {
    const adjusted = JSON.parse(JSON.stringify(baseData));
    
    // 根据天数调整行程
    if (preferences.days && adjusted.routes) {
      adjusted.routes = adjusted.routes.slice(0, preferences.days);
    }
    
    // 根据旅行类型调整内容权重
    if (preferences.travelType === 'foodie' && adjusted.foods) {
      adjusted.foods = [...adjusted.foods, ...this.generateExtraFoods(adjusted.tags)];
    }
    
    // 根据预算筛选住宿
    if (preferences.budgetRange && adjusted.accommodations) {
      const budgetFilters = {
        low: acc => acc.priceRange && parseInt(acc.priceRange) < 300,
        high: acc => acc.priceRange && parseInt(acc.priceRange) > 500
      };
      const filter = budgetFilters[preferences.budgetRange];
      if (filter) {
        adjusted.accommodations = adjusted.accommodations.filter(filter);
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
    const days = preferences.days || 3;
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
      keys: Array.from(this.cache.keys()),
      currentProvider: this.currentProvider,
      availableProviders: Object.keys(this.providers).filter(key => 
        this.providers[key].apiKey
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
      .filter(([key, value]) => value.apiKey)
      .map(([key, value]) => ({
        id: key,
        name: value.name,
        model: value.model,
        current: key === this.currentProvider
      }));
  }
}

module.exports = new AIService();