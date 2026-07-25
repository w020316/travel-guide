/**
 * AI Provider 基类与具体实现（v10.8 重构）
 *
 * 目标：抽取 aiService.js 中 6 个 provider 的重复代码（messages/headers/解析逻辑）
 * 设计：
 * - BaseAIProvider 提供 chat(prompt, systemPrompt) 统一入口
 * - 子类只重写 buildRequestBody / parseResponse / buildHeaders / getTimeout
 * - 文心一言因需要先换 access_token，重写 chat 方法
 */
// 用一个可被测试替换的引用包装 axios，便于单元测试注入 mock
// 生产环境直接使用真实 axios；测试通过 __setAxiosForTest 注入 mock
let axios = require('axios');

/**
 * 仅供单元测试使用：替换内部 axios 引用
 * @param {Object} mockAxios - mock 出来的 axios 对象（需含 post/get 方法）
 */
function __setAxiosForTest(mockAxios) {
  axios = mockAxios;
}

const DEFAULT_SYSTEM_PROMPT = '你是一位拥有15年经验的资深旅游规划师，擅长根据用户需求制定个性化旅游攻略。你的攻略详细、实用、可操作性强。请始终以标准的JSON格式输出，不要添加任何markdown标记或额外说明。';

class BaseAIProvider {
  /**
   * @param {Object} config - { name, baseUrl, model, apiKey, ...extra }
   */
  constructor(config) {
    this.name = config.name;
    this.baseUrl = config.baseUrl;
    this.model = config.model;
    this.apiKey = config.apiKey || '';
    this.extra = config.extra || {};
  }

  get isAvailable() {
    return Boolean(this.apiKey);
  }

  /**
   * 统一调用入口
   * @param {string} prompt - 用户提示
   * @param {string} systemPrompt - 系统提示
   * @returns {Promise<string>} AI 返回的文本
   */
  async chat(prompt, systemPrompt = DEFAULT_SYSTEM_PROMPT) {
    const body = this.buildRequestBody(prompt, systemPrompt);
    const headers = this.buildHeaders();
    const timeout = this.getTimeout();

    console.log(`📡 调用 ${this.name} API...`);
    const response = await axios.post(this.getRequestUrl(), body, {
      headers,
      timeout,
      // 兼容 Agnes AI 的特殊配置（不使用代理、关闭 decompress）
      ...(this.extra.axiosConfig || {})
    });

    console.log(`✅ ${this.name} 响应成功`);
    return this.parseResponse(response.data);
  }

  /** 子类可重写：实际请求 URL（默认 baseUrl） */
  getRequestUrl() {
    return this.baseUrl;
  }

  /** 子类可重写：构建请求体 */
  buildRequestBody(prompt, systemPrompt) {
    return {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 8000
    };
  }

  /** 子类可重写：构建请求头 */
  buildHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /** 子类可重写：超时时间 */
  getTimeout() {
    return 60000;
  }

  /** 子类可重写：解析响应 */
  parseResponse(data) {
    return data.choices[0].message.content;
  }
}

// ============== OpenAI 兼容接口（agnes / deepseek / openai / zhipu） ==============

class AgnesProvider extends BaseAIProvider {
  constructor(config) {
    super(config);
    // Agnes 需要 decompress=false / proxy=false / User-Agent
    this.extra.axiosConfig = {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'identity',
        'User-Agent': 'travel-guide/2.0'
      },
      decompress: false,
      proxy: false
    };
  }

  buildRequestBody(prompt, systemPrompt) {
    return {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 4000
    };
  }

  getTimeout() {
    return 120000;
  }

  // buildHeaders 继承 BaseAIProvider，但需要合并 extra.axiosConfig.headers
  // axios 会合并 config 中的 headers 与 per-request headers
}

class DeepSeekProvider extends BaseAIProvider {
  buildRequestBody(prompt, systemPrompt) {
    return {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 8000
    };
  }
}

class OpenAIProvider extends BaseAIProvider {
  buildRequestBody(prompt, systemPrompt) {
    return {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 8000
    };
  }
}

class ZhipuProvider extends BaseAIProvider {
  // GLM-4 兼容 OpenAI 接口，buildRequestBody/parseResponse 用默认实现
}

// ============== 通义千问（DashScope 接口） ==============

class TongyiProvider extends BaseAIProvider {
  buildRequestBody(prompt, systemPrompt) {
    return {
      model: this.model,
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      },
      parameters: {
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: 8000,
        result_format: 'message'
      }
    };
  }

  buildHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-DashScope-SSE': 'disable'
    };
  }

  parseResponse(data) {
    return data.output.choices[0].message.content;
  }
}

// ============== 文心一言（需要 OAuth 换 token） ==============

class WenxinProvider extends BaseAIProvider {
  constructor(config) {
    super(config);
    this.clientId = process.env.WENXIN_CLIENT_ID || '';
    this.clientSecret = process.env.WENXIN_CLIENT_SECRET || '';
    // v10.9.3 修复 P1-6：access_token 缓存（百度 token 有效期通常 30 天）
    // 避免每次 chat 都重新 OAuth，减少网络往返与配额消耗
    this._cachedAccessToken = null;
    this._tokenExpiresAt = 0;
  }

  get isAvailable() {
    return Boolean(this.apiKey) || (Boolean(this.clientId) && Boolean(this.clientSecret));
  }

  /**
   * 获取 access_token（带缓存，到期前 5 分钟刷新）
   * v10.9.3 修复 P0-4：client_secret 改为 POST body 传递，避免出现在 URL query
   * 避免 URL query 被代理日志/错误对象记录导致密钥泄露
   */
  async _getAccessToken() {
    const now = Date.now();
    // 缓存有效且距过期 >5 分钟则复用
    if (this._cachedAccessToken && now < this._tokenExpiresAt - 5 * 60 * 1000) {
      return this._cachedAccessToken;
    }

    // 用 application/x-www-form-urlencoded body 传递凭证，不出现在 URL
    const tokenResponse = await axios.post(
      'https://aip.baidubce.com/oauth/2.0/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000
      }
    );

    this._cachedAccessToken = tokenResponse.data.access_token;
    // expires_in 单位秒，通常 2592000（30 天）
    const expiresIn = tokenResponse.data.expires_in || 2592000;
    this._tokenExpiresAt = now + expiresIn * 1000;

    return this._cachedAccessToken;
  }

  async chat(prompt, systemPrompt = DEFAULT_SYSTEM_PROMPT) {
    console.log('📡 调用文心一言API...');

    // Step 1: 获取 access_token（带缓存）
    const accessToken = await this._getAccessToken();

    // Step 2: 调用补全接口（文心不支持 system role，把 system prompt 拼到 user 前面）
    // v10.9.3 修复 P0-4：access_token 仍需通过 query 传递（百度 API 限制），
    // 但 access_token 是短期凭证（30 天），泄露风险远低于 client_secret
    const mergedPrompt = `${systemPrompt}\n\n${prompt}`;
    const response = await axios.post(
      `${this.baseUrl}?access_token=${accessToken}`,
      {
        messages: [{ role: 'user', content: mergedPrompt }],
        temperature: 0.7,
        top_p: 0.8,
        penalty_score: 1.0
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    );

    console.log('✅ 文心一言响应成功');
    return response.data.result;
  }
}

/**
 * Provider 工厂
 * @param {string} providerKey - agnes/tongyi/zhipu/deepseek/wenxin/openai
 * @param {Object} envConfig - { baseUrl, model, apiKey }
 */
function createProvider(providerKey, envConfig) {
  const config = { ...envConfig };
  switch (providerKey) {
    case 'agnes':
      return new AgnesProvider(config);
    case 'tongyi':
      return new TongyiProvider(config);
    case 'zhipu':
      return new ZhipuProvider(config);
    case 'deepseek':
      return new DeepSeekProvider(config);
    case 'wenxin':
      return new WenxinProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    default:
      throw new Error(`不支持的AI提供商: ${providerKey}`);
  }
}

module.exports = {
  BaseAIProvider,
  AgnesProvider,
  TongyiProvider,
  ZhipuProvider,
  DeepSeekProvider,
  WenxinProvider,
  OpenAIProvider,
  createProvider,
  DEFAULT_SYSTEM_PROMPT,
  __setAxiosForTest
};
