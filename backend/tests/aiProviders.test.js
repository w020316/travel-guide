/**
 * AI Provider 抽象层单元测试
 *
 * 覆盖范围：
 * - 工厂函数 createProvider 返回正确类型的实例
 * - isAvailable getter 反映 apiKey 配置
 * - buildRequestBody 各 provider 的差异化实现
 * - parseResponse 各 provider 的响应解析
 * - chat() 端到端调用（通过 __setAxiosForTest 注入 mock）
 * - 文心一言的特殊 OAuth 流程
 *
 * 实现说明：
 * - vitest 4.x 对 CJS require 的 vi.mock 拦截有限制
 * - 改用生产代码暴露的 __setAxiosForTest 钩子直接替换 axios 引用
 * - 该钩子仅用于测试，生产代码无副作用
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import aiProviders from '../services/aiProviders';

describe('AI Providers', () => {
  let mockPost;
  let mockGet;

  beforeEach(() => {
    mockPost = vi.fn();
    mockGet = vi.fn();
    // 默认空响应，避免未配置时抛错
    mockPost.mockResolvedValue({ data: {} });
    mockGet.mockResolvedValue({ data: {} });
    // 注入 mock axios
    aiProviders.__setAxiosForTest({ post: mockPost, get: mockGet });
    // 清理文心环境变量
    delete process.env.WENXIN_CLIENT_ID;
    delete process.env.WENXIN_CLIENT_SECRET;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createProvider 工厂', () => {
    it('应返回正确类型的 provider 实例', () => {
      const config = { name: 'Test', baseUrl: 'http://x', model: 'm', apiKey: 'k' };
      expect(aiProviders.createProvider('agnes', config)).toBeInstanceOf(aiProviders.AgnesProvider);
      expect(aiProviders.createProvider('tongyi', config)).toBeInstanceOf(aiProviders.TongyiProvider);
      expect(aiProviders.createProvider('zhipu', config)).toBeInstanceOf(aiProviders.ZhipuProvider);
      expect(aiProviders.createProvider('deepseek', config)).toBeInstanceOf(aiProviders.DeepSeekProvider);
      expect(aiProviders.createProvider('wenxin', config)).toBeInstanceOf(aiProviders.WenxinProvider);
      expect(aiProviders.createProvider('openai', config)).toBeInstanceOf(aiProviders.OpenAIProvider);
    });

    it('所有 provider 应继承 BaseAIProvider', () => {
      const config = { name: 'Test', baseUrl: 'http://x', model: 'm', apiKey: 'k' };
      ['agnes', 'tongyi', 'zhipu', 'deepseek', 'wenxin', 'openai'].forEach(key => {
        const provider = aiProviders.createProvider(key, config);
        expect(provider).toBeInstanceOf(aiProviders.BaseAIProvider);
      });
    });

    it('不支持的 provider key 应抛错', () => {
      expect(() => aiProviders.createProvider('unknown', {})).toThrow(/不支持的AI提供商/);
    });
  });

  describe('isAvailable', () => {
    it('有 apiKey 时应返回 true', () => {
      const provider = new aiProviders.AgnesProvider({ name: 'A', baseUrl: 'x', model: 'm', apiKey: 'key' });
      expect(provider.isAvailable).toBe(true);
    });

    it('无 apiKey 时应返回 false', () => {
      const provider = new aiProviders.AgnesProvider({ name: 'A', baseUrl: 'x', model: 'm', apiKey: '' });
      expect(provider.isAvailable).toBe(false);
    });

    it('文心一言有 clientId + clientSecret 时应可用', () => {
      process.env.WENXIN_CLIENT_ID = 'cid';
      process.env.WENXIN_CLIENT_SECRET = 'csecret';
      const provider = new aiProviders.WenxinProvider({ name: 'W', baseUrl: 'x', model: 'm', apiKey: '' });
      expect(provider.isAvailable).toBe(true);
    });

    it('文心一言无任何凭证时不可用', () => {
      const provider = new aiProviders.WenxinProvider({ name: 'W', baseUrl: 'x', model: 'm', apiKey: '' });
      expect(provider.isAvailable).toBe(false);
    });
  });

  describe('buildRequestBody 差异化', () => {
    it('OpenAI 兼容接口（agnes/deepseek/zhipu/openai）应使用 messages 数组', () => {
      const config = { name: 'X', baseUrl: 'x', model: 'm', apiKey: 'k' };
      [new aiProviders.AgnesProvider(config), new aiProviders.DeepSeekProvider(config), new aiProviders.ZhipuProvider(config), new aiProviders.OpenAIProvider(config)].forEach(provider => {
        const body = provider.buildRequestBody('hello', 'sys');
        expect(body.messages).toEqual([
          { role: 'system', content: 'sys' },
          { role: 'user', content: 'hello' }
        ]);
        expect(body.model).toBe('m');
      });
    });

    it('通义千问应使用 input.messages + parameters 结构', () => {
      const provider = new aiProviders.TongyiProvider({ name: 'T', baseUrl: 'x', model: 'm', apiKey: 'k' });
      const body = provider.buildRequestBody('hello', 'sys');
      expect(body.input).toBeDefined();
      expect(body.input.messages).toEqual([
        { role: 'system', content: 'sys' },
        { role: 'user', content: 'hello' }
      ]);
      expect(body.parameters.result_format).toBe('message');
    });

    it('Agnes 应使用 max_tokens=4000', () => {
      const provider = new aiProviders.AgnesProvider({ name: 'A', baseUrl: 'x', model: 'm', apiKey: 'k' });
      const body = provider.buildRequestBody('hello', 'sys');
      expect(body.max_tokens).toBe(4000);
    });

    it('DeepSeek 应使用 max_tokens=8000', () => {
      const provider = new aiProviders.DeepSeekProvider({ name: 'D', baseUrl: 'x', model: 'm', apiKey: 'k' });
      const body = provider.buildRequestBody('hello', 'sys');
      expect(body.max_tokens).toBe(8000);
    });
  });

  describe('buildHeaders 差异化', () => {
    it('默认应包含 Bearer Authorization', () => {
      const provider = new aiProviders.DeepSeekProvider({ name: 'D', baseUrl: 'x', model: 'm', apiKey: 'mykey' });
      const headers = provider.buildHeaders();
      expect(headers['Authorization']).toBe('Bearer mykey');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('通义千问应包含 X-DashScope-SSE: disable', () => {
      const provider = new aiProviders.TongyiProvider({ name: 'T', baseUrl: 'x', model: 'm', apiKey: 'k' });
      const headers = provider.buildHeaders();
      expect(headers['X-DashScope-SSE']).toBe('disable');
    });
  });

  describe('getTimeout', () => {
    it('Agnes 超时应为 120000ms', () => {
      const provider = new aiProviders.AgnesProvider({ name: 'A', baseUrl: 'x', model: 'm', apiKey: 'k' });
      expect(provider.getTimeout()).toBe(120000);
    });

    it('其他 provider 默认 60000ms', () => {
      const provider = new aiProviders.DeepSeekProvider({ name: 'D', baseUrl: 'x', model: 'm', apiKey: 'k' });
      expect(provider.getTimeout()).toBe(60000);
    });
  });

  describe('parseResponse', () => {
    it('OpenAI 兼容接口应从 choices[0].message.content 提取', () => {
      const provider = new aiProviders.DeepSeekProvider({ name: 'D', baseUrl: 'x', model: 'm', apiKey: 'k' });
      const data = { choices: [{ message: { content: 'hello world' } }] };
      expect(provider.parseResponse(data)).toBe('hello world');
    });

    it('通义千问应从 output.choices[0].message.content 提取', () => {
      const provider = new aiProviders.TongyiProvider({ name: 'T', baseUrl: 'x', model: 'm', apiKey: 'k' });
      const data = { output: { choices: [{ message: { content: 'tongyi response' } }] } };
      expect(provider.parseResponse(data)).toBe('tongyi response');
    });
  });

  describe('chat() 端到端', () => {
    it('DeepSeek chat 应调用 axios.post 并返回解析后的文本', async () => {
      mockPost.mockResolvedValueOnce({
        data: { choices: [{ message: { content: 'AI response' } }] }
      });

      const provider = new aiProviders.DeepSeekProvider({
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        apiKey: 'test-key'
      });

      const result = await provider.chat('hello');
      expect(result).toBe('AI response');
      expect(mockPost).toHaveBeenCalledWith(
        'https://api.deepseek.com/v1/chat/completions',
        expect.objectContaining({
          model: 'deepseek-chat',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'user', content: 'hello' })
          ])
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key'
          }),
          timeout: 60000
        })
      );
    });

    it('Agnes chat 应包含 decompress=false 和 proxy=false', async () => {
      mockPost.mockResolvedValueOnce({
        data: { choices: [{ message: { content: 'agnes' } }] }
      });

      const provider = new aiProviders.AgnesProvider({
        name: 'Agnes',
        baseUrl: 'https://apihub.agnes-ai.com/v1/chat/completions',
        model: 'agnes-2.0-flash',
        apiKey: 'k'
      });

      await provider.chat('hi');
      const callArgs = mockPost.mock.calls[0];
      expect(callArgs[2]).toMatchObject({
        decompress: false,
        proxy: false,
        timeout: 120000
      });
    });

    it('chat 失败时应抛出原始错误', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network timeout'));
      const provider = new aiProviders.DeepSeekProvider({
        name: 'D',
        baseUrl: 'https://api.example.com/v1',
        model: 'm',
        apiKey: 'k'
      });
      await expect(provider.chat('hello')).rejects.toThrow('Network timeout');
    });
  });

  describe('WenxinProvider 特殊流程', () => {
    it('chat 应先换 access_token 再调用补全接口', async () => {
      // Mock OAuth token 接口
      mockPost.mockResolvedValueOnce({ data: { access_token: 'fake-token' } });
      // Mock 补全接口
      mockPost.mockResolvedValueOnce({ data: { result: '文心响应' } });

      process.env.WENXIN_CLIENT_ID = 'cid';
      process.env.WENXIN_CLIENT_SECRET = 'csecret';
      const provider = new aiProviders.WenxinProvider({
        name: '文心一言',
        baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        model: 'ernie-bot-4',
        apiKey: ''
      });

      const result = await provider.chat('你好');
      expect(result).toBe('文心响应');

      // 验证第一次调用是 OAuth 接口
      const oauthCall = mockPost.mock.calls[0];
      expect(oauthCall[0]).toContain('oauth/2.0/token');
      expect(oauthCall[0]).toContain('client_id=cid');
      expect(oauthCall[0]).toContain('client_secret=csecret');

      // 验证第二次调用是补全接口
      const completionCall = mockPost.mock.calls[1];
      expect(completionCall[0]).toContain('access_token=fake-token');
    });

    it('chat 应将 system prompt 合并到 user prompt（文心不支持 system role）', async () => {
      mockPost.mockResolvedValueOnce({ data: { access_token: 't' } });
      mockPost.mockResolvedValueOnce({ data: { result: 'r' } });

      process.env.WENXIN_CLIENT_ID = 'cid';
      process.env.WENXIN_CLIENT_SECRET = 'csecret';
      const provider = new aiProviders.WenxinProvider({ name: 'W', baseUrl: 'x', model: 'm', apiKey: '' });

      await provider.chat('用户问题', '系统提示');
      const completionCall = mockPost.mock.calls[1];
      const body = completionCall[1];
      expect(body.messages).toEqual([
        { role: 'user', content: '系统提示\n\n用户问题' }
      ]);
    });

    it('chat 在 OAuth 失败时应抛错', async () => {
      mockPost.mockRejectedValueOnce(new Error('OAuth failed'));

      process.env.WENXIN_CLIENT_ID = 'cid';
      process.env.WENXIN_CLIENT_SECRET = 'csecret';
      const provider = new aiProviders.WenxinProvider({ name: 'W', baseUrl: 'x', model: 'm', apiKey: '' });

      await expect(provider.chat('hi')).rejects.toThrow('OAuth failed');
    });
  });

  describe('DEFAULT_SYSTEM_PROMPT', () => {
    it('应包含旅游规划师角色设定', () => {
      expect(aiProviders.DEFAULT_SYSTEM_PROMPT).toContain('旅游规划师');
      expect(aiProviders.DEFAULT_SYSTEM_PROMPT).toContain('JSON');
    });
  });
});
