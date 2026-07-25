/**
 * weatherSync 单元测试
 *
 * 覆盖范围：
 * - LRU 缓存行为（替换原对象缓存）
 * - clearWeatherCache 清理逻辑
 * - 模拟天气数据生成（generateMockWeatherData 通过 getCityWeather 间接测试）
 *
 * 注意：getRealWeather 调用真实和风天气 API，此处通过 __setAxiosForTest 注入 mock
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import weatherSync from '../services/weatherSync';

describe('weatherSync', () => {
  let mockGet;
  let mockPost;

  beforeEach(() => {
    mockGet = vi.fn();
    mockPost = vi.fn();
    // 默认空响应
    mockGet.mockResolvedValue({ data: {} });
    mockPost.mockResolvedValue({ data: {} });
    // 注入 mock axios
    weatherSync.__setAxiosForTest({ get: mockGet, post: mockPost });
    // 清空 LRU 缓存避免测试间状态污染
    weatherSync.clearWeatherCache();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('缓存实例', () => {
    it('weatherCache 应为 LRU 实例（非 plain object）', () => {
      expect(weatherSync.weatherCache).toBeDefined();
      expect(weatherSync.weatherCache.max).toBe(200);
      expect(weatherSync.weatherCache.ttl).toBe(10 * 60 * 1000);
    });

    it('cityIdCache 应为 LRU 实例', () => {
      expect(weatherSync.cityIdCache).toBeDefined();
      expect(weatherSync.cityIdCache.max).toBe(500);
    });
  });

  describe('clearWeatherCache', () => {
    it('传城市名时应清除该城市的天气和 ID 缓存', () => {
      weatherSync.weatherCache.set('成都', { temp: '25°C' });
      weatherSync.cityIdCache.set('成都', 'CTU_001');
      expect(weatherSync.weatherCache.size).toBe(1);

      weatherSync.clearWeatherCache('成都');
      expect(weatherSync.weatherCache.size).toBe(0);
      expect(weatherSync.cityIdCache.size).toBe(0);
    });

    it('不传城市名时应清空所有缓存', () => {
      weatherSync.weatherCache.set('成都', { temp: '25°C' });
      weatherSync.weatherCache.set('北京', { temp: '15°C' });
      weatherSync.cityIdCache.set('成都', 'CTU_001');
      weatherSync.cityIdCache.set('北京', 'BJS_001');

      weatherSync.clearWeatherCache();
      expect(weatherSync.weatherCache.size).toBe(0);
      expect(weatherSync.cityIdCache.size).toBe(0);
    });
  });

  describe('getCityWeather 缓存命中', () => {
    it('已缓存的城市应直接返回缓存数据（不调用 API）', async () => {
      const cachedWeather = { city: '成都', current: { temp: '25°C' } };
      weatherSync.weatherCache.set('成都', cachedWeather);

      const result = await weatherSync.getCityWeather('成都');
      expect(result).toEqual(cachedWeather);
      // axios 不应被调用
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('缓存未命中且真实 API 失败时应回退到模拟数据', async () => {
      // 模拟所有 axios 调用都失败
      mockGet.mockRejectedValue(new Error('Network error'));

      const result = await weatherSync.getCityWeather('成都');
      expect(result).not.toBeNull();
      expect(result.city).toBe('成都');
      expect(result.current).toBeDefined();
      expect(result.current.temp).toMatch(/°C$/);
      // 结果应被缓存
      expect(weatherSync.weatherCache.get('成都')).toEqual(result);
    });

    it('缓存未命中且真实 API 成功时应返回真实数据并缓存', async () => {
      // Mock getCityLocationId 调用
      mockGet.mockResolvedValueOnce({
        data: { code: '200', location: [{ id: 'CTU_001' }] }
      });
      // Mock 实时天气
      mockGet.mockResolvedValueOnce({
        data: {
          code: '200',
          now: { temp: '22', feelsLike: '20', text: '晴', humidity: '60', windDir: '东南', windScale: '2', vis: '15', pressure: '1015' },
          updateTime: '2026-07-25T10:00:00+08:00'
        }
      });
      // Mock 预报
      mockGet.mockResolvedValueOnce({
        data: {
          daily: [{ fxDate: '2026-07-25', tempMin: '18', tempMax: '26', textDay: '晴', windDirDay: '东南' }]
        }
      });

      const result = await weatherSync.getCityWeather('成都');
      expect(result.city).toBe('成都');
      expect(result.current.temp).toBe('22°C');
      expect(result.current.condition).toBe('晴');
      // 应被缓存
      expect(weatherSync.weatherCache.get('成都')).toEqual(result);
      // cityId 也应被缓存
      expect(weatherSync.cityIdCache.get('成都')).toBe('CTU_001');
    });
  });

  describe('缓存上限保护', () => {
    it('weatherCache 最多保存 200 个城市', () => {
      for (let i = 0; i < 250; i++) {
        weatherSync.weatherCache.set(`city-${i}`, { temp: `${i}°C` });
      }
      expect(weatherSync.weatherCache.size).toBe(200);
      // 最旧的城市应被淘汰
      expect(weatherSync.weatherCache.get('city-0')).toBeUndefined();
      // 最新的城市应保留
      expect(weatherSync.weatherCache.get('city-249')).toBeDefined();
    });

    it('cityIdCache 最多保存 500 个城市', () => {
      for (let i = 0; i < 600; i++) {
        weatherSync.cityIdCache.set(`city-${i}`, `id-${i}`);
      }
      expect(weatherSync.cityIdCache.size).toBe(500);
    });
  });

  describe('TTL 过期', () => {
    it('weatherCache 条目应在 10 分钟后过期', () => {
      // 直接测试 LRU TTL 逻辑（不实际等待 10 分钟）
      const cache = weatherSync.weatherCache;
      cache.set('test', { data: 1 });

      // 模拟时间过去 11 分钟
      const entry = cache.cache.get('test');
      entry.timestamp = Date.now() - 11 * 60 * 1000;

      expect(cache.get('test')).toBeUndefined();
    });
  });
});
