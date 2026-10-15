/**
 * AI 时间控制层单元测试（v11.0 P1 修复：AI 攻略生成耗时不可预测）
 *
 * 覆盖范围：
 * - 整体 AI 预算（AI_TOTAL_BUDGET_MS，默认 9s）：预算耗尽立即回退本地库
 * - 单次请求超时 = min(provider 8s, 剩余预算)，禁止超长超时串行叠加
 * - 熔断/冷却：连续失败达阈值的 provider 冷却期内跳过（不发网络请求）
 * - 401/403 致命凭证错误一次即熔断；普通错误需连续 2 次
 * - 成功后重置熔断计数；冷却结束放行一次探测（half-open）
 *
 * 实现说明：
 * - aiService 为单例，直接替换 providers[key].chat 为 vi.fn（服务层 mock 边界）。
 *   不使用 __setAxiosForTest：ESM import 与 aiService 内部 require 拿到的
 *   aiProviders 模块实例可能不同，axios 注入对服务层不生效。
 * - 预算裁剪测试使用 vi.useFakeTimers() 驱动定时器
 * - beforeEach 中重置各 provider 的 key、chat 方法与熔断状态
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import aiProviders from '../services/aiProviders';
import aiService from '../services/aiService';

const ALL_PROVIDER_KEYS = ['agnes', 'tongyi', 'zhipu', 'deepseek', 'wenxin', 'openai'];

describe('AI 时间控制层（预算 + 熔断）', () => {
  const originalChat = {};

  beforeEach(() => {
    // 重置单例状态：清空所有 key、备份并替换 chat 方法、清零熔断状态
    for (const key of ALL_PROVIDER_KEYS) {
      const provider = aiService.providers[key];
      originalChat[key] = provider.chat;
      provider.apiKey = '';
      provider.chat = vi.fn();
      provider.recordSuccess(); // 清零熔断计数与冷却
    }
    delete process.env.WENXIN_CLIENT_ID;
    delete process.env.WENXIN_CLIENT_SECRET;

    aiService.currentProvider = 'agnes';
    aiService.totalBudgetMs = 9000;
    aiService.cache.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    // 恢复原始 chat 方法，避免污染其他测试文件共享的模块状态
    for (const key of ALL_PROVIDER_KEYS) {
      if (originalChat[key]) {
        aiService.providers[key].chat = originalChat[key];
      }
    }
    vi.clearAllMocks();
  });

  /** 启用指定 provider（注入测试 key，默认挂到 agnes） */
  function enableProviders(...keys) {
    for (const key of keys) {
      aiService.providers[key].apiKey = 'test-key-' + key;
    }
    aiService.currentProvider = keys[0];
  }

  describe('整体 AI 预算', () => {
    it('单个 provider 悬挂时应被 8s 上限切断并回退本地库', async () => {
      vi.useFakeTimers();
      enableProviders('agnes');
      // 永不 resolve 的悬挂请求（模拟 DNS 卡死/无响应死链路）
      aiService.providers.agnes.chat.mockImplementation(() => new Promise(() => {}));

      const pending = aiService.generateTravelGuide('测试城', { days: 2 });
      await vi.advanceTimersByTimeAsync(8100);
      const result = await pending;

      // 只发起 1 次请求，未无限等待
      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(1);
      // 传给 chat 的超时被裁剪为单 provider 上限 8s
      expect(aiService.providers.agnes.chat.mock.calls[0][2]).toBe(8000);
      expect(String(result.source)).toMatch(/^local/);
    });

    it('多 provider 串行时总耗时受整体预算约束（9s）', async () => {
      vi.useFakeTimers();
      enableProviders('agnes', 'openai');
      aiService.providers.agnes.chat.mockImplementation(() => new Promise(() => {}));
      aiService.providers.openai.chat.mockImplementation(() => new Promise(() => {}));

      const pending = aiService.generateTravelGuide('测试城', { days: 2 });
      await vi.advanceTimersByTimeAsync(8100); // 第 1 次尝试 8s 超时
      await vi.advanceTimersByTimeAsync(1100); // 第 2 次尝试用剩余预算（~1s）
      const result = await pending;

      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(1);
      expect(aiService.providers.openai.chat).toHaveBeenCalledTimes(1);
      // 第 2 次尝试的超时被裁剪到剩余预算（9000 - 8000 = 1000ms）
      expect(aiService.providers.openai.chat.mock.calls[0][2]).toBe(1000);
      expect(String(result.source)).toMatch(/^local/);
    });

    it('预算已耗尽时应跳过网络请求立即回退本地库', async () => {
      enableProviders('agnes');
      aiService.totalBudgetMs = 200; // 剩余 200ms < minAttemptMs(1000ms)

      const result = await aiService.generateTravelGuide('测试城', { days: 2 });

      expect(aiService.providers.agnes.chat).not.toHaveBeenCalled();
      expect(String(result.source)).toMatch(/^local/);
    });
  });

  describe('熔断/冷却', () => {
    it('401/403 致命错误应一次熔断，冷却期内后续请求不发网络请求', async () => {
      enableProviders('agnes', 'openai');
      aiService.providers.agnes.chat.mockRejectedValue({
        message: 'Request failed with status code 401',
        response: { status: 401 }
      });
      aiService.providers.openai.chat.mockRejectedValue({
        message: 'Request failed with status code 403',
        response: { status: 403 }
      });

      // 第 1 次请求：agnes(401) + openai(403) 串行失败 → 回退本地
      const r1 = await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(r1.source).toMatch(/^local/);
      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(1);
      expect(aiService.providers.openai.chat).toHaveBeenCalledTimes(1);

      // 第 2 次请求：两个 provider 均已熔断冷却 → 0 次网络请求，秒级回退
      const r2 = await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(1); // 未增长
      expect(aiService.providers.openai.chat).toHaveBeenCalledTimes(1); // 未增长
      expect(r2.source).toMatch(/^local/);
      expect(aiService.providers.agnes.cooldownRemainingMs()).toBeGreaterThan(0);
      expect(aiService.providers.openai.cooldownRemainingMs()).toBeGreaterThan(0);
    });

    it('普通错误需连续失败 2 次才熔断', async () => {
      enableProviders('agnes');
      aiService.providers.agnes.chat.mockRejectedValue(new Error('boom'));

      // 第 1 次请求：失败 1 次（未达阈值），正常发起
      await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(1);

      // 第 2 次请求：仍会尝试（连续失败 1 < 阈值 2）
      await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(2);

      // 第 3 次请求：已达阈值 → 冷却，跳过
      await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(aiService.providers.agnes.chat).toHaveBeenCalledTimes(2);
      expect(aiService.providers.agnes.cooldownRemainingMs()).toBeGreaterThan(0);
    });

    it('成功后应重置熔断计数', async () => {
      enableProviders('agnes');
      const agnesChat = aiService.providers.agnes.chat;

      // 失败 1 次（计数 1，未熔断）；失败结果不入缓存
      agnesChat.mockRejectedValueOnce(new Error('boom'));
      await aiService.generateTravelGuide('测试城', { days: 2 });

      // 第 2 次成功 → source=ai，计数重置；成功结果入缓存，后续需清缓存以复测
      agnesChat.mockResolvedValueOnce('{"routes":[]}');
      const ok = await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(ok.source).toBe('ai');
      expect(aiService.providers.agnes._consecutiveFailures).toBe(0);
      aiService.cache.clear();

      // 再失败 1 次：因计数已重置，下一次请求仍会尝试（未被旧失败计入）
      agnesChat.mockRejectedValueOnce(new Error('boom2'));
      await aiService.generateTravelGuide('测试城', { days: 2 });
      agnesChat.mockResolvedValueOnce('{"routes":[]}');
      const ok2 = await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(ok2.source).toBe('ai');
      expect(agnesChat).toHaveBeenCalledTimes(4);
    });

    it('冷却结束后应放行一次探测（half-open），再失败立即重新冷却', async () => {
      enableProviders('agnes');
      const agnesChat = aiService.providers.agnes.chat;
      agnesChat.mockRejectedValue(new Error('boom'));

      await aiService.generateTravelGuide('测试城', { days: 2 });
      await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(agnesChat).toHaveBeenCalledTimes(2);
      expect(aiService.providers.agnes.canAttempt()).toBe(false);

      // 模拟冷却期结束
      aiService.providers.agnes._cooldownUntil = Date.now() - 1;
      expect(aiService.providers.agnes.canAttempt()).toBe(true);

      // 探测失败 → 立即重新进入冷却
      await aiService.generateTravelGuide('测试城', { days: 2 });
      expect(agnesChat).toHaveBeenCalledTimes(3);
      expect(aiService.providers.agnes.canAttempt()).toBe(false);
    });
  });

  describe('BaseAIProvider 熔断原语', () => {
    it('canAttempt / recordFailure / recordSuccess / cooldownRemainingMs 状态机', () => {
      const provider = new aiProviders.BaseAIProvider({
        name: 'T', baseUrl: 'x', model: 'm', apiKey: 'k'
      });
      expect(provider.breakerThreshold).toBe(2);
      expect(provider.breakerCooldownMs).toBe(5 * 60 * 1000);

      // 未失败时可尝试
      expect(provider.canAttempt()).toBe(true);
      expect(provider.cooldownRemainingMs()).toBe(0);

      // 失败 1 次：未达阈值，可尝试，无冷却
      provider.recordFailure(new Error('t'));
      expect(provider._consecutiveFailures).toBe(1);
      expect(provider.canAttempt()).toBe(true);
      expect(provider.cooldownRemainingMs()).toBe(0);

      // 失败 2 次：达到阈值，进入冷却
      provider.recordFailure(new Error('t'));
      expect(provider.canAttempt()).toBe(false);
      expect(provider.cooldownRemainingMs()).toBeGreaterThan(0);

      // 冷却结束：放行探测
      provider._cooldownUntil = Date.now() - 1;
      expect(provider.canAttempt()).toBe(true);

      // 成功：完全重置
      provider.recordSuccess();
      expect(provider.canAttempt()).toBe(true);
      expect(provider.cooldownRemainingMs()).toBe(0);
      expect(provider._consecutiveFailures).toBe(0);
    });

    it('401/403 一次失败即达到熔断阈值', () => {
      const provider = new aiProviders.BaseAIProvider({
        name: 'T', baseUrl: 'x', model: 'm', apiKey: 'k'
      });
      provider.recordFailure({ response: { status: 401 } });
      expect(provider._consecutiveFailures).toBe(2); // 直接拉满阈值
      expect(provider.canAttempt()).toBe(false);

      const provider2 = new aiProviders.BaseAIProvider({
        name: 'T', baseUrl: 'x', model: 'm', apiKey: 'k'
      });
      provider2.recordFailure({ response: { status: 403 } });
      expect(provider2.canAttempt()).toBe(false);
    });
  });
});
