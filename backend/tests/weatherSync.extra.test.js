/**
 * weatherSync 补充测试（v11.7）
 *
 * 原有 weatherSync.test.js 已覆盖「缓存实例 / 清除 / 真实成功 / 降级」主路径，
 * 但以下分支此前无断言（行覆盖 49.4%）：
 *   - cityId 缓存命中后不再请求 geo（Location ID 永不变）
 *   - geo 返回 200 但 location 为空 / 返回非 200 → 提前返回 null
 *   - weather/now 返回非 200、请求抛错 → 降级为 null
 *   - getCityWeather 缓存命中短路
 *   - 模拟数据：未知城市走通用温度表、小时偏移（凌晨/下午）
 *   - startWeatherSync：定时刷新、过期清理、回调内部异常不崩溃进程
 *
 * 全部通过 __setAxiosForTest 注入 mock axios，不发起真实网络请求；
 * 定时器用 vi.useFakeTimers 推进，避免真实等待 10 分钟。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
const weatherSync = requireCjs('../services/weatherSync.js');

/** 构造一份成功的 geo/now/3d 响应序列 */
function successSequence(cityId = 'CTU_001') {
  return [
    { data: { code: '200', location: [{ id: cityId }] } },
    {
      data: {
        code: '200',
        now: {
          temp: '22',
          feelsLike: '20',
          text: '晴',
          humidity: '60',
          windDir: '东南',
          windScale: '2',
          vis: '15',
          pressure: '1015'
        },
        updateTime: '2026-10-17T12:00:00+08:00'
      }
    },
    {
      data: {
        daily: [
          { fxDate: '2026-10-17', tempMin: '18', tempMax: '26', textDay: '晴', windDirDay: '东南' }
        ]
      }
    }
  ];
}

describe('weatherSync 补充分支', () => {
  let mockGet;

  beforeEach(() => {
    mockGet = vi.fn().mockResolvedValue({ data: {} });
    weatherSync.__setAxiosForTest({ get: mockGet, post: vi.fn() });
    weatherSync.clearWeatherCache();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    weatherSync.clearWeatherCache();
  });

  describe('getRealWeather 上游响应分支', () => {
    it('cityId 缓存命中后第二次请求不再调用 geo（仅 now + 3d）', async () => {
      const seq = successSequence('CTU_001');
      mockGet
        .mockResolvedValueOnce(seq[0])
        .mockResolvedValueOnce(seq[1])
        .mockResolvedValueOnce(seq[2])
        .mockResolvedValueOnce(seq[1])
        .mockResolvedValueOnce(seq[2]);

      const first = await weatherSync.getRealWeather('成都');
      const second = await weatherSync.getRealWeather('成都');

      expect(first.source).toBe('qweather');
      expect(second.city).toBe('成都');
      expect(mockGet).toHaveBeenCalledTimes(5);
      // 第 4 次调用应直接是天气接口，而不是再次 geo lookup
      expect(mockGet.mock.calls[3][0]).toContain('/weather/now');
      expect(weatherSync.cityIdCache.get('成都')).toBe('CTU_001');
    });

    it('geo 返回 200 但 location 为空时返回 null，且不请求天气接口', async () => {
      mockGet.mockResolvedValueOnce({ data: { code: '200', location: [] } });

      const result = await weatherSync.getRealWeather('成都');

      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('geo 返回非 200 时返回 null', async () => {
      mockGet.mockResolvedValueOnce({ data: { code: '400', location: [{ id: 'X' }] } });

      const result = await weatherSync.getRealWeather('成都');

      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('weather/now 返回非 200 时返回 null（已拉取的 3d 预报被丢弃）', async () => {
      mockGet
        .mockResolvedValueOnce({ data: { code: '200', location: [{ id: 'CTU_001' }] } })
        .mockResolvedValueOnce({ data: { code: '500', now: null } })
        .mockResolvedValueOnce({ data: { daily: [] } });

      const result = await weatherSync.getRealWeather('成都');

      expect(result).toBeNull();
      // 实现顺序为 geo → now → 3d，之后才校验 code，故三次请求均会发出
      expect(mockGet).toHaveBeenCalledTimes(3);
      expect(mockGet.mock.calls[2][0]).toContain('/weather/3d');
    });

    it('weather/now 请求抛错时捕获并返回 null', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockGet
        .mockResolvedValueOnce({ data: { code: '200', location: [{ id: 'CTU_001' }] } })
        .mockRejectedValueOnce(new Error('socket hang up'));

      const result = await weatherSync.getRealWeather('成都');

      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it('getCityWeather 命中缓存时直接返回，不触发任何上游请求', async () => {
      const cached = { city: '成都', source: 'simulated', current: { temp: '20°C' } };
      weatherSync.weatherCache.set('成都', cached);

      const result = await weatherSync.getCityWeather('成都');

      expect(result).toBe(cached);
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('模拟天气数据 —— 未知城市与小时偏移', () => {
    it('未知城市使用通用温度表，预报为连续 3 天', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-15T12:00:00'));
      mockGet.mockRejectedValue(new Error('offline'));

      const result = await weatherSync.getCityWeather('未知城');

      expect(result.source).toBe('simulated');
      expect(result.city).toBe('未知城');
      // 1 月通用表 [10,20]，12 点档 +1 → 16
      expect(result.current.temp).toBe('16°C');
      expect(result.forecast).toHaveLength(3);
      expect(result.forecast[0].date).toBe('2026-01-15');
      expect(result.forecast[1].date).toBe('2026-01-16');
      expect(result.forecast[2].date).toBe('2026-01-17');
    });

    it('同一城市凌晨与下午的温度应相差 4°C（小时偏移 -3 / +1）', async () => {
      vi.useFakeTimers();
      mockGet.mockRejectedValue(new Error('offline'));

      vi.setSystemTime(new Date('2026-01-15T03:00:00'));
      const dawn = await weatherSync.getCityWeather('北京');
      weatherSync.clearWeatherCache();

      vi.setSystemTime(new Date('2026-01-15T15:00:00'));
      const afternoon = await weatherSync.getCityWeather('北京');

      expect(dawn.current.temp).toBe('-3°C');
      expect(afternoon.current.temp).toBe('1°C');
      expect(parseInt(afternoon.current.temp) - parseInt(dawn.current.temp)).toBe(4);
    });
  });

  describe('startWeatherSync 定时任务', () => {
    it('到期后刷新缓存城市的真实天气', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));
      weatherSync.weatherCache.set('成都', { city: '成都', source: 'simulated' });

      const seq = successSequence('CTU_001');
      mockGet
        .mockResolvedValueOnce(seq[0])
        .mockResolvedValueOnce(seq[1])
        .mockResolvedValueOnce(seq[2]);

      const timer = weatherSync.startWeatherSync(10);
      await vi.advanceTimersByTimeAsync(10 * 60 * 1000);

      expect(mockGet).toHaveBeenCalledTimes(3);
      expect(weatherSync.weatherCache.get('成都').source).toBe('qweather');
      clearInterval(timer);
    });

    it('刷新失败时清理已过期的缓存条目', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-17T12:00:00'));
      weatherSync.weatherCache.set('过期城', { city: '过期城', source: 'simulated' });
      // 手动把时间戳改到 11 分钟前，使其超过 10 分钟 TTL
      weatherSync.weatherCache.cache.get('过期城').timestamp = Date.now() - 11 * 60 * 1000;

      // geo 无结果 → getRealWeather 返回 null → 不刷新，随后被 purgeExpired 清掉
      mockGet.mockResolvedValue({ data: { code: '200', location: [] } });

      const timer = weatherSync.startWeatherSync(10);
      await vi.advanceTimersByTimeAsync(10 * 60 * 1000);

      expect(weatherSync.weatherCache.size).toBe(0);
      clearInterval(timer);
    });

    it('回调内部抛错时只记录日志，不产生未捕获异常', async () => {
      vi.useFakeTimers();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(weatherSync.weatherCache, 'keys').mockImplementation(() => {
        throw new Error('cache corrupted');
      });

      const timer = weatherSync.startWeatherSync(1);
      await vi.advanceTimersByTimeAsync(60 * 1000);

      const logged = errorSpy.mock.calls
        .map(args => args.map(a => String(a)).join(' '))
        .join('\n');
      expect(logged).toContain('[weatherSync] 定时同步失败');
      expect(logged).toContain('cache corrupted');
      clearInterval(timer);
    });
  });
});
