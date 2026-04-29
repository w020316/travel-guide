const axios = require('axios');

class AIService {
  constructor() {
    this.providers = {
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
    
    this.currentProvider = process.env.AI_PROVIDER || 'tongyi';
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
    const days = preferences.days || 3;
    const travelType = preferences.travelType || 'general';
    const budgetRange = preferences.budgetRange || 'medium';
    const companionType = preferences.companionType || 'solo';
    const interests = preferences.interests || [];
    const language = preferences.language || 'zh-CN';

    const travelTypeMap = {
      general: '综合观光（景点+美食+文化）',
      foodie: '美食探索（深度挖掘当地特色小吃和老字号）',
      culture: '文化历史（博物馆、古迹、非遗体验）',
      nature: '自然风光（山水、公园、生态景观）',
      adventure: '户外探险（徒步、登山、极限运动）',
      shopping: '购物休闲（商圈、特产、夜市）',
      photography: '摄影采风（最佳拍摄点、光线建议、构图指导）'
    };

    const budgetMap = {
      low: '经济实惠（人均<200元/天，主打性价比）',
      medium: '中等预算（人均200-500元/天，品质与价格平衡）',
      high: '高端品质（人均>500元/天，追求舒适体验）'
    };

    const companionMap = {
      solo: '独自旅行（注重安全+自由度+社交机会）',
      couple: '情侣/夫妻（浪漫氛围+二人世界+拍照打卡点）',
      family: '家庭出游（带儿童：亲子互动+教育意义+便利设施）',
      friends: '朋友结伴（热闹有趣+集体活动+平摊费用）',
      elderly: '陪伴老人（节奏缓慢+无障碍设施+舒适交通）'
    };

    let prompt = `你是一位拥有15年经验的资深旅游规划师，曾为超过10万名游客定制行程。请为【${city}】制定一份超详细的${days}日旅游攻略。

## 用户画像分析：
- **旅行类型**：${travelTypeMap[travelType] || '综合观光'}
- **预算范围**：${budgetMap[budgetRange] || '中等预算'}
- **同行人员**：${companionMap[companionType] || '独自旅行'}
- **兴趣爱好**：${interests.length > 0 ? interests.join('、') : '广泛涉猎'}
- **语言偏好**：${language === 'en' ? 'English' : language === 'ja' ? '日本語' : language === 'ko' ? '한국어' : '中文'}

## 攻略要求（必须严格遵守）：

### 📍 每日行程规划（Day 1-${days}）
每天包含3-5个景点，每个景点必须提供：
- **景点名称**（中文名+英文名）
- **推荐理由**（50字以内，突出独特性）
- **建议游玩时长**（精确到小时）
- **门票参考价**（成人票/学生票/优惠票）
- **游览贴士**（最佳时间/避坑指南/拍照角度）
- **交通方式**（如何到达+预计耗时）

### 🍜 美食推荐（5-8道）
每道菜必须包含：
- **菜品名称**（本地叫法）
- **口味描述**（口感+味道层次）
- **参考价格**（具体到元）
- **必吃指数**（⭐⭐⭐⭐⭐ 五星制）
- **推荐店铺**（2-3家老字号或网红店+地址）
- **用餐建议**（最佳时段/排队技巧）

### 🏨 住宿推荐（3-5家）
每家酒店必须包含：
- **酒店名称**
- **所在区域**（标注距离主要景点的距离）
- **价格区间**（淡季/旺季价格）
- **核心优势**（3个卖点）
- **适合人群**（家庭/情侣/商务/背包客）
- **预订渠道**（官网/平台优惠码）

### 🚗 交通指南
- **如何到达${city}**（飞机/高铁/自驾的详细方案）
- **市内交通**（地铁线路图+公交+出租车起步价）
- **景点间交通**（最优路线+费用预估）
- **交通卡/APP推荐**

### 💡 实用贴士（分类整理）
**行前准备清单**（10项以上）：
- 必带物品（根据季节和当地气候）
- 证件要求
- APP下载建议

**避坑指南**（5条以上）：
- 当地常见骗局
- 旅游陷阱预警
- 省钱妙招

**最佳游览时间**：
- 一年四季优劣势对比
- 每月特色活动/节庆
- 人流高峰期预警

### 💰 费用预算明细
必须提供：
- **总预算**（${days}天总计）
- **分项明细**：
  - 交通费（往返+市内）：XX元
  - 住宿费（${days}晚）：XX元  
  - 餐饮费（${days}天）：XX元
  - 门票费（所有景点合计）：XX元
  - 其他杂费（购物/应急）：XX元
- **省钱攻略**（3-5条实用建议）

### 📱 实用信息
- **紧急电话**（报警/医疗/旅游投诉）
- **大使馆/领事馆信息**（如适用）
- **当地习俗禁忌**（避免冒犯当地人）
- **网络通讯**（SIM卡/WiFi方案）
- **货币支付**（支付宝/微信/现金使用情况）

## 输出格式要求：
请以严格的JSON格式输出，确保所有字段完整：

\`\`\`json
{
  "city": "${city}",
  "title": "吸引人的标题（体现城市特色）",
  "subtitle": "副标题（一句话概括行程亮点）",
  "season": "最佳旅游季节及原因",
  "duration": "${days}天",
  "overallBudget": "总预算范围",
  "difficulty": "行程强度（轻松/适中/较累）",
  "routes": [
    {
      "day": 1,
      "theme": "今日主题",
      "highlights": ["亮点1", "亮点2"],
      "spots": [
        {
          "name": "景点名",
          "nameEn": "English Name",
          "reason": "推荐理由（50字内）",
          "duration": "X小时",
          "ticket": {"adult": "XX元", "student": "XX元", "free": "是否免费"},
          "tips": ["贴士1", "贴士2"],
          "transportation": "如何到达",
          "bestTimeToVisit": "最佳游览时间",
          "photoSpots": ["拍照点1", "拍照点2"],
          "rating": "⭐⭐⭐⭐⭐"
        }
      ],
      "lunch": {"restaurant": "餐厅名", "dishes": ["菜1", "菜2"], "budget": "XX元"},
      "dinner": {"restaurant": "餐厅名", "dishes": ["菜1", "菜2"], "budget": "XX元"}
    }
  ],
  "foods": [
    {
      "name": "菜名",
      "description": "详细描述（味道+历史+特色）",
      "price": "XX元",
      "mustTry": true,
      "rating": 5,
      "whereToEat": [
        {"name": "店名", "address": "地址", "priceRange": "XX-XX元", "specialty": "招牌菜", "hours": "营业时间"}
      ],
      "bestTime": "品尝时机"
    }
  ],
  "accommodations": [
    {
      "name": "酒店名",
      "area": "区域",
      "distance": "距市中心/景区距离",
      "priceRange": {"lowSeason": "XX元", "peakSeason": "XX元"},
      "features": ["特色1", "特色2", "特色3"],
      "suitableFor": ["人群"],
      "bookingTips": "预订建议",
      "rating": "⭐⭐⭐⭐⭐"
    }
  ],
  "transportation": {
    "arrival": {
      "byAir": {"details": "...", "cost": "XX元", "time": "X小时"},
      "byTrain": {"details": "...", "cost": "XX元", "time": "X小时"},
      "byCar": {"details": "...", "cost": "XX元", "time": "X小时"}
    },
    "localTransport": {
      "metro": "地铁线路...",
      "bus": "公交...",
      "taxi": "出租车...",
      "recommendedApps": ["APP1", "APP2"]
    },
    "interCity": "景点间交通方案"
  },
  "tips": {
    "prepare": ["准备事项1", "准备事项2"],
    "avoid": ["避坑1", "避坑2"],
    "bestTime": ["时间建议1", "时间建议2"],
    "emergencyContacts": {"police": "110", "medical": "120", "tourism": "12301"}
  },
  "budget": {
    "total": "总金额",
    "breakdown": {
      "transportation": "交通费",
      "accommodation": "住宿费",
      "food": "餐饮费",
      "tickets": "门票费",
      "shopping": "购物费",
      "other": "其他费用"
    },
    "moneySavingTips": ["省钱技巧1", "省钱技巧2"]
  },
  "practicalInfo": {
    "customs": ["习俗1", "习俗2"],
    "network": "网络方案",
    "payment": "支付方式",
    "language": "语言沟通",
    "weather": "天气特点"
  },
  "source": "ai-generated",
  "generatedAt": "ISO时间戳",
  "provider": "AI提供商名称"
}
\`\`\`

⚠️ 重要提示：
1. 所有价格必须是2024年最新实际价格（可根据经验估算合理范围）
2. 餐厅和酒店名称必须是真实存在的（如果不确定，标注"推荐类型"即可）
3. 提供的信息要具体、可操作，不要空洞的建议
4. 根据用户偏好（${travelType}/${budgetRange}/${companionType}）量身定制内容
5. 如果是美食之旅，增加美食占比；如果是文化游，增加博物馆和历史遗迹`;

    return prompt;
  }

  // ==================== 各AI提供商调用方法 ====================

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
      
      // 确保必要字段存在并补充默认值
      return {
        city: data.city || city,
        title: data.title || `${city}·深度定制之旅`,
        subtitle: data.subtitle || `发现${city}的独特魅力`,
        season: data.season || '四季皆宜',
        duration: data.duration || `${preferences.days || 3}天`,
        overallBudget: data.overallBudget || '待估算',
        difficulty: data.difficulty || '适中',
        routes: data.routes || [],
        foods: data.foods || [],
        accommodations: data.accommodations || [],
        transportation: data.transportation || {},
        tips: data.tips || {},
        budget: data.budget || {},
        practicalInfo: data.practicalInfo || {},
        tags: this.extractTags(data),
        poster: this.generatePosterConfig(data),
        generatedAt: new Date().toISOString(),
        source: 'ai',
        provider: this.providers[this.currentProvider]?.name || 'unknown'
      };
      
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
    const styleIndex = Math.abs(this.hashCode(data.city)) % styles.length;
    
    return {
      style: styles[styleIndex],
      title: data.title || '',
      subtitle: data.subtitle || '',
      colorScheme: this.getColorScheme(data.city)
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