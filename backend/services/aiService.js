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
        return cached.data;
      }
    }

    try {
      const provider = this.providers[this.currentProvider];
      
      if (!provider.apiKey) {
        console.warn(`${provider.name} API Key未配置，使用本地数据生成`);
        return this.generateLocalGuide(city, preferences);
      }

      const prompt = this.buildPrompt(city, preferences);
      let response;

      switch (this.currentProvider) {
        case 'tongyi':
          response = await this.callTongyiAPI(prompt, provider);
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

      // 解析AI响应为结构化攻略数据
      const guideData = this.parseAIResponse(response, city, preferences);
      
      // 缓存结果
      this.cache.set(cacheKey, { data: guideData, timestamp: Date.now() });
      
      return guideData;

    } catch (error) {
      console.error('AI生成失败:', error.message);
      // 回退到本地数据生成
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
      general: '综合观光',
      foodie: '美食探索',
      culture: '文化历史',
      nature: '自然风光',
      adventure: '户外探险',
      shopping: '购物休闲',
      photography: '摄影采风'
    };

    const budgetMap = {
      low: '经济实惠（人均<200元/天）',
      medium: '中等预算（人均200-500元/天）',
      high: '高端品质（人均>500元/天）'
    };

    const companionMap = {
      solo: '独自旅行',
      couple: '情侣/夫妻',
      family: '家庭出游（带儿童）',
      friends: '朋友结伴',
      elderly: '陪伴老人'
    };

    let prompt = `作为资深旅游规划师，请为${city}制定一份${days}天的详细旅游攻略。

**用户偏好：**
- 旅行类型：${travelTypeMap[travelType] || '综合观光'}
- 预算范围：${budgetMap[budgetRange] || '中等预算'}
- 同行人员：${companionMap[companionType] || '独自旅行'}
- 兴趣爱好：${interests.length > 0 ? interests.join('、') : '无特殊要求'}

**要求：**
1. 每天安排3-5个景点，包含景点名称、推荐理由、建议游玩时长、门票价格
2. 推荐当地特色美食3-5道，标注是否必吃及参考价格
3. 根据预算推荐2-3家不同档次的住宿
4. 提供详细的交通指南（市内交通+如何到达）
5. 给出实用贴士（最佳游览时间、避坑指南、必备物品）
6. 估算总费用明细

请以JSON格式返回，结构如下：
{
  "city": "${city}",
  "title": "城市主题标语",
  "season": "最佳旅游季节",
  "days": ${days},
  "routes": [
    {
      "day": 1,
      "title": "Day1主题",
      "spots": [
        {"name": "景点名", "reason": "推荐理由", "duration": "游玩时长", "ticket": "门票价格", "tips": "游览贴士"}
      ]
    }
  ],
  "foods": [
    {"name": "美食名", "description": "描述", "price": "价格", "mustTry": true, "location": "推荐地点"}
  ],
  "accommodations": [
    {"name": "酒店/民宿名", "area": "区域", "priceRange": "价格范围", "features": ["特色1", "特色2"]}
  ],
  "transportation": {
    "arrival": "如何到达该城市",
    "local": "市内交通方式"
  },
  "tips": {
    "prepare": ["准备事项"],
    "avoid": ["避坑指南"],
    "bestTime": ["最佳时间"]
  },
  "budget": {
    "total": "总预算",
    "breakdown": {
      "transportation": "交通费",
      "accommodation": "住宿费",
      "food": "餐饮费",
      "tickets": "门票费",
      "other": "其他费用"
    }
  }
}`;

    if (language !== 'zh-CN') {
      prompt += `\n\n请用${language === 'en' ? 'English' : language === 'ja' ? '日本語' : '한국어'}回复。`;
    }

    return prompt;
  }

  async callTongyiAPI(prompt, provider) {
    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      input: {
        messages: [
          {
            role: 'system',
            content: '你是一位专业的旅游规划师，擅长根据用户需求制定个性化旅游攻略。请始终以JSON格式输出。'
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
        max_tokens: 4096,
        result_format: 'message'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'X-DashScope-SSE': 'disable'
      },
      timeout: 30000
    });

    return response.data.output.choices[0].message.content;
  }

  async callWenxinAPI(prompt, provider) {
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
        timeout: 30000
      }
    );

    return response.data.result;
  }

  async callOpenAIAPI(prompt, provider) {
    const response = await axios.post(provider.baseUrl, {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的旅游规划师，擅长根据用户需求制定个性化旅游攻略。请始终以JSON格式输出。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      timeout: 30000
    });

    return response.data.choices[0].message.content;
  }

  parseAIResponse(responseText, city, preferences) {
    try {
      // 尝试提取JSON
      let jsonStr = responseText;
      
      // 移除可能的markdown代码块标记
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // 提取JSON对象
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const data = JSON.parse(jsonStr);
      
      // 确保必要字段存在
      return {
        city: data.city || city,
        title: data.title || `${city}·深度之旅`,
        season: data.season || '四季皆宜',
        days: data.days || preferences.days || 3,
        routes: data.routes || [],
        foods: data.foods || [],
        accommodations: data.accommodations || [],
        transportation: data.transportation || {},
        tips: data.tips || {},
        budget: data.budget || {},
        tags: this.extractTags(data),
        poster: this.generatePosterConfig(data),
        generatedAt: new Date().toISOString(),
        source: 'ai'
      };
      
    } catch (error) {
      console.error('解析AI响应失败:', error);
      // 如果JSON解析失败，尝试从文本中提取关键信息
      return this.extractFromText(responseText, city, preferences);
    }
  }

  extractFromText(text, city, preferences) {
    // 简单的文本解析回退方案
    return {
      city: city,
      title: `${city}·定制之旅`,
      season: '四季皆宜',
      days: preferences.days || 3,
      routes: [{
        day: 1,
        title: '精选行程',
        spots: [{name: '主要景点', reason: text.substring(0, 100), duration: '2-3小时', ticket: '待查询', tips: ''}]
      }],
      foods: [{name: '当地特色', description: text.substring(0, 50), price: '待查询', mustTry: true, location: '市区'}],
      accommodations: [{name: '推荐住宿', area: '市中心', priceRange: '200-500元', features: ['交通便利']}],
      transportation: {arrival: '', local: ''},
      tips: {prepare: [], avoid: [], bestTime: []},
      budget: {total: '待计算', breakdown: {}},
      tags: ['custom'],
      poster: {style: 'fresh'},
      generatedAt: new Date().toISOString(),
      source: 'ai-text'
    };
  }

  extractTags(data) {
    const tags = [];
    
    if (data.routes && data.routes.length > 0) {
      const spotNames = data.routes.flatMap(r => r.spots.map(s => s.name));
      if (spotNames.some(n => n.includes('博物馆') || n.includes('故宫') || n.includes('历史'))) {
        tags.push('历史文化');
      }
      if (spotNames.some(n => n.includes('山') || n.includes('湖') || n.includes('公园'))) {
        tags.push('自然风光');
      }
      if (data.foods && data.foods.length > 3) {
        tags.push('美食之都');
      }
    }
    
    return tags.length > 0 ? tags : ['热门目的地'];
  }

  generatePosterConfig(data) {
    // 根据城市特点生成海报配置
    const styles = ['fresh', 'vintage', 'minimal'];
    const styleIndex = Math.abs(this.hashCode(data.city)) % styles.length;
    
    return {
      style: styles[styleIndex],
      title: data.title || '',
      subtitle: this.generateSubtitle(data),
      colorScheme: this.getColorScheme(data.city)
    };
  }

  generateSubtitle(data) {
    const subtitles = [
      `发现${data.city}的${data.days}天精彩`,
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
        title: `第${i}天：${city}精华游`,
        spots: [
          { name: `${city}地标景点`, reason: '城市标志性建筑', duration: '2-3小时', ticket: '免费', tips: '建议上午前往' },
          { name: '历史文化街区', reason: '感受当地文化', duration: '1-2小时', ticket: '免费', tips: '适合拍照' },
          { name: '特色美食街', reason: '品尝地道美食', duration: '1-2小时', ticket: '免费', tips: '午餐推荐地点' }
        ]
      });
    }
    
    return {
      city: city,
      title: `${city}·发现之旅`,
      season: '四季皆宜',
      days: days,
      routes: routes,
      foods: [
        { name: `${city}特色菜`, description: '当地招牌美食', price: '38-68元', mustTry: true, location: '市中心' },
        { name: '传统小吃', description: '百年老店出品', price: '15-30元', mustTry: true, location: '老街' }
      ],
      accommodations: [
        { name: `${city}快捷酒店`, area: '市中心', priceRange: '200-400元', features: ['交通便利', '干净卫生'] }
      ],
      transportation: {
        arrival: `可乘坐飞机/高铁到达${city}`,
        local: '地铁/公交/出租车'
      },
      tips: {
        prepare: ['身份证', '舒适鞋子', '充电宝'],
        avoid: ['避免高峰期出行', '注意天气变化'],
        bestTime: ['春秋两季最佳']
      },
      budget: {
        total: `${days * 500}-${days * 1500}元`,
        breakdown: {
          transportation: '500-1000元',
          accommodation: `${days * 200}-${days * 600}元`,
          food: `${days * 150}-${days * 400}元`,
          tickets: '200-500元',
          other: '200-500元'
        }
      },
      tags: ['热门目的地'],
      poster: { style: 'fresh' },
      generatedAt: new Date().toISOString(),
      source: 'local-mock'
    };
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = new AIService();