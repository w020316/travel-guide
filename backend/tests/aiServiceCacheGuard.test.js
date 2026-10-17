/**
 * V-6 / UX-8：AI 缓存守卫 + skipCache（refresh）回归测试（v11.5 新增）
 *
 * 背景：
 *  - V-6(b)：aiService 仅当攻略结构合格（routes/foods 均非空且有效）才写缓存，避免缓存空壳结果。
 *  - UX-8：前端「再次生成」置 refresh=true → skipCache，即使缓存存在也强制重新请求 AI，
 *    规避 30 分钟内反复拿回坏结果的死循环。
 *
 * 实现说明：与 aiServiceTiming.test.js 一致——aiService 为单例，直接替换 providers[key].chat。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import aiService from '../services/aiService';

const ALL_PROVIDER_KEYS = ['agnes', 'tongyi', 'zhipu', 'deepseek', 'wenxin', 'openai'];
const VALID_JSON = '{"title":"X","routes":[{"routeLine":"A→B"}],"foods":[{"name":"小吃"}]}';

describe('V-6/UX-8 缓存守卫 + skipCache', () => {
  const originalChat = {};

  beforeEach(() => {
    for (const key of ALL_PROVIDER_KEYS) {
      const provider = aiService.providers[key];
      originalChat[key] = provider.chat;
      provider.apiKey = '';
      provider.chat = vi.fn();
      provider.recordSuccess();
    }
    delete process.env.WENXIN_CLIENT_ID;
    delete process.env.WENXIN_CLIENT_SECRET;
    aiService.currentProvider = 'agnes';
    aiService.totalBudgetMs = 9000;
    aiService.cache.clear();
  });

  afterEach(() => {
    for (const key of ALL_PROVIDER_KEYS) {
      if (originalChat[key]) {
        aiService.providers[key].chat = originalChat[key];
        aiService.providers[key].apiKey = '';
      }
    }
    vi.clearAllMocks();
  });

  function enableAgnes(impl) {
    const agnes = aiService.providers.agnes;
    agnes.apiKey = 'test-key';
    agnes.recordSuccess();
    aiService.currentProvider = 'agnes';
    agnes.chat = vi.fn(impl);
    return agnes;
  }

  describe('skipCache（refresh）', () => {
    it('skipCache=true 时即使缓存存在也重新调用 provider', async () => {
      const agnes = enableAgnes(() => Promise.resolve(VALID_JSON));
      const prefs = { days: 1 };
      const city = '缓存城';
      const cacheKey = `${city}-${JSON.stringify(prefs)}`;
      const sentinel = { source: 'cached', __sentinel: true };
      aiService.cache.set(cacheKey, sentinel);

      const result = await aiService.generateTravelGuide(city, prefs, { skipCache: true });

      expect(agnes.chat).toHaveBeenCalledTimes(1);
      expect(result).not.toBe(sentinel);
    });

    it('未设 skipCache 时命中缓存直接返回（不调用 provider）——对照', async () => {
      const agnes = enableAgnes(() => Promise.resolve(VALID_JSON));
      const prefs = { days: 1 };
      const city = '缓存城2';
      const cacheKey = `${city}-${JSON.stringify(prefs)}`;
      const sentinel = { source: 'cached', __sentinel: true };
      aiService.cache.set(cacheKey, sentinel);

      const result = await aiService.generateTravelGuide(city, prefs, {});

      expect(result).toBe(sentinel);
      expect(agnes.chat).not.toHaveBeenCalled();
    });
  });

  describe('_isCacheableGuide 结构校验', () => {
    it('拒绝空 routes', () => {
      expect(aiService._isCacheableGuide({ routes: [], foods: [{ name: '小吃' }] })).toBe(false);
    });

    it('拒绝空 foods', () => {
      expect(aiService._isCacheableGuide({ routes: [{ routeLine: 'A→B' }], foods: [] })).toBe(false);
    });

    it('拒绝占位/空字符串路线', () => {
      expect(aiService._isCacheableGuide({ routes: ['', '   '], foods: [{ name: '小吃' }] })).toBe(false);
    });

    it('接受合格结构（routes 含 routeLine + foods 含 name）', () => {
      expect(aiService._isCacheableGuide({ routes: [{ routeLine: 'A→B' }], foods: [{ name: '小吃' }] })).toBe(true);
    });

    it('接受字符串路线 + spots 数组路线', () => {
      expect(aiService._isCacheableGuide({ routes: ['Day1: A→B'], foods: [{ name: '小吃' }] })).toBe(true);
      expect(aiService._isCacheableGuide({ routes: [{ spots: [{ name: 'A' }] }], foods: [{ name: '小吃' }] })).toBe(true);
    });
  });

  describe('端到端：空壳结果不写缓存', () => {
    it('AI 返回空 routes/foods 时不写入缓存', async () => {
      const agnes = enableAgnes(() => Promise.resolve('{"title":"X","routes":[],"foods":[]}'));
      const prefs = { days: 1 };
      const city = '空壳城';
      const cacheKey = `${city}-${JSON.stringify(prefs)}`;

      const guide = await aiService.generateTravelGuide(city, prefs, {});

      expect(Array.isArray(guide.routes)).toBe(true);
      expect(guide.routes.length).toBe(0);
      // 关键断言：结构不合格 → 未写缓存
      expect(aiService.cache.get(cacheKey)).toBeUndefined();
      expect(agnes.chat).toHaveBeenCalledTimes(1);
    });

    it('AI 返回合格结构时写入缓存', async () => {
      enableAgnes(() => Promise.resolve(VALID_JSON));
      const prefs = { days: 1 };
      const city = '合格城';
      const cacheKey = `${city}-${JSON.stringify(prefs)}`;

      await aiService.generateTravelGuide(city, prefs, {});

      expect(aiService.cache.get(cacheKey)).toBeDefined();
    });
  });
});
