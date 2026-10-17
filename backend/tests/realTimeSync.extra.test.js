/**
 * realTimeSync 补充测试（v11.7）
 *
 * 原覆盖率 34.5%，仅因 api 测试调用了 getSeasonalTags；热门城市缓存与
 * mergeRealTimeData 完全没有测试。本文件覆盖：
 *   - getTrendingCities 首次生成 / 5 分钟缓存命中 / 过期重算 / 生成异常降级 []
 *   - getSeasonalTags 四季分支（用假时钟固定月份，避免随真实日期漂移）
 *   - mergeRealTimeData：null 短路、不可变合并、seasonalTags 与 lastUpdated
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
const realTimeSync = requireCjs('../services/realTimeSync.js');

describe('realTimeSync 补充分支', () => {
  beforeEach(() => {
    // 清空热门城市缓存，避免用例间互相污染
    delete realTimeSync.trendingCache.cities;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    delete realTimeSync.trendingCache.cities;
  });

  describe('getTrendingCities —— 缓存与降级', () => {
    it('首次调用生成 10 个城市，按分数降序，并写入缓存', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));

      const result = await realTimeSync.getTrendingCities();

      expect(result).toHaveLength(10);
      const scores = result.map(c => c.score);
      expect(scores).toEqual([...scores].sort((a, b) => b - a));
      expect(result[0]).toMatchObject({
        name: expect.any(String),
        trend: expect.any(String),
        tags: expect.any(Array)
      });
      // 返回值应就是缓存中的同一引用
      expect(realTimeSync.trendingCache.cities).toBe(result);
    });

    it('5 分钟内重复调用命中缓存，不重新计算随机分数', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));

      const first = await realTimeSync.getTrendingCities();
      const randomSpy = vi.spyOn(Math, 'random');
      const second = await realTimeSync.getTrendingCities();

      expect(second).toBe(first);
      expect(randomSpy).not.toHaveBeenCalled();
    });

    it('超过 5 分钟后重新生成（返回新数组）', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));

      const first = await realTimeSync.getTrendingCities();

      vi.setSystemTime(new Date('2026-10-17T12:05:00.001'));
      const second = await realTimeSync.getTrendingCities();

      expect(second).not.toBe(first);
      expect(second).toHaveLength(10);
    });

    it('生成过程抛错时返回空数组并记录日志', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Math, 'random').mockImplementation(() => {
        throw new Error('rng broken');
      });

      const result = await realTimeSync.getTrendingCities();

      expect(result).toEqual([]);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(String(errorSpy.mock.calls[0][0])).toContain('获取热门城市数据失败');
    });
  });

  describe('getSeasonalTags —— 四季分支', () => {
    const cases = [
      ['2026-04-15T12:00:00', ['赏花', '春游', '踏青']],
      ['2026-07-15T12:00:00', ['避暑', '海滨', '漂流']],
      ['2026-10-17T12:00:00', ['赏秋', '红叶', '丰收']],
      ['2026-01-15T12:00:00', ['冰雪', '温泉', '滑雪']]
    ];

    it('3-5 月为春、6-8 月为夏、9-11 月为秋、12-2 月为冬', () => {
      vi.useFakeTimers();
      for (const [iso, expected] of cases) {
        vi.setSystemTime(new Date(iso));
        expect(realTimeSync.getSeasonalTags('北京')).toEqual(expected);
      }
    });

    it('城市名不影响季节标签（当前实现按全局月份）', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));

      expect(realTimeSync.getSeasonalTags('三亚')).toEqual(
        realTimeSync.getSeasonalTags('哈尔滨')
      );
    });
  });

  describe('mergeRealTimeData —— 不可变合并', () => {
    it('cityData 为空时原样返回（null / undefined）', () => {
      expect(realTimeSync.mergeRealTimeData(null, '北京')).toBeNull();
      expect(realTimeSync.mergeRealTimeData(undefined, '北京')).toBeUndefined();
    });

    it('返回新对象并追加 seasonalTags / lastUpdated，不修改入参', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));
      const original = { name: '北京', tags: ['古都'] };

      const merged = realTimeSync.mergeRealTimeData(original, '北京');

      expect(merged).not.toBe(original);
      expect(merged.name).toBe('北京');
      expect(merged.tags).toEqual(['古都']);
      expect(merged.seasonalTags).toEqual(['赏秋', '红叶', '丰收']);
      expect(merged.lastUpdated).toBe(new Date('2026-10-17T12:00:00').toISOString());
      expect(original).not.toHaveProperty('seasonalTags');
      expect(original).not.toHaveProperty('lastUpdated');
    });
  });
});
