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

  // v10.11 新增：认证参数与路径构造（全部走 mock axios，不发起真实网络请求）
  describe('认证参数与路径构造（v10.11）', () => {
    const ORIGINAL_KEY = process.env.QWEATHER_API_KEY;

    afterEach(() => {
      // 恢复环境变量，避免污染其他用例
      if (ORIGINAL_KEY === undefined) {
        delete process.env.QWEATHER_API_KEY;
      } else {
        process.env.QWEATHER_API_KEY = ORIGINAL_KEY;
      }
    });

    it('三个请求均应走正确路径（/geo/v2/city/lookup、/v7/weather/now、/v7/weather/3d）并附带 X-QW-Api-Key 认证头', async () => {
      process.env.QWEATHER_API_KEY = 'test-key-123';

      // geo lookup → weather/now → weather/3d 依次 mock
      mockGet.mockResolvedValueOnce({ data: { code: '200', location: [{ id: 'CTU_001' }] } });
      mockGet.mockResolvedValueOnce({
        data: {
          code: '200',
          now: { temp: '22', feelsLike: '20', text: '晴', humidity: '60', windDir: '东南', windScale: '2', vis: '15', pressure: '1015' },
          updateTime: '2026-07-25T10:00:00+08:00'
        }
      });
      mockGet.mockResolvedValueOnce({ data: { daily: [] } });

      const result = await weatherSync.getRealWeather('成都');
      expect(result).not.toBeNull();
      expect(mockGet).toHaveBeenCalledTimes(3);

      const [geoUrl, geoCfg] = mockGet.mock.calls[0];
      const [nowUrl, nowCfg] = mockGet.mock.calls[1];
      const [fcUrl, fcCfg] = mockGet.mock.calls[2];

      // 路径：geo 必须是 /geo/v2/city/lookup（修复前误拼 /v2/city/lookup → 404）
      expect(geoUrl).toMatch(/\/geo\/v2\/city\/lookup$/);
      expect(nowUrl).toContain('/v7/weather/now');
      expect(fcUrl).toContain('/v7/weather/3d');

      // 认证：和风 2024 改版后 key 查询参数已废弃，认证统一放请求头
      // X-QW-Api-Key（key 参数方式即使 key 有效也返回 401/403）
      expect(geoCfg.headers['X-QW-Api-Key']).toBe('test-key-123');
      expect(nowCfg.headers['X-QW-Api-Key']).toBe('test-key-123');
      expect(fcCfg.headers['X-QW-Api-Key']).toBe('test-key-123');
      // 不应再使用废弃的 key 查询参数
      expect(geoCfg.params.key).toBeUndefined();
      expect(nowCfg.params.key).toBeUndefined();
      expect(fcCfg.params.key).toBeUndefined();

      // 业务参数仍应完整（v11.1：adm 已移除 —— GeoAPI 的 adm 期望省级名称，
      // 传 "China" 会过滤掉全部候选 → 400 "No Such Location"）
      expect(geoCfg.params.location).toBe('成都');
      expect(geoCfg.params.adm).toBeUndefined();
      expect(nowCfg.params.location).toBe('CTU_001');
      expect(fcCfg.params.location).toBe('CTU_001');

      // 来源标记：真实数据
      expect(result.source).toBe('qweather');
    });

    it('未配置 QWEATHER_API_KEY 时不应附加 X-QW-Api-Key 认证头', async () => {
      delete process.env.QWEATHER_API_KEY;

      mockGet.mockResolvedValueOnce({ data: { code: '200', location: [{ id: 'CTU_001' }] } });
      mockGet.mockResolvedValueOnce({
        data: {
          code: '200',
          now: { temp: '22', feelsLike: '20', text: '晴', humidity: '60', windDir: '东南', windScale: '2', vis: '15', pressure: '1015' }
        }
      });
      mockGet.mockResolvedValueOnce({ data: { daily: [] } });

      await weatherSync.getRealWeather('成都');

      for (const [, cfg] of mockGet.mock.calls) {
        expect(cfg.headers['X-QW-Api-Key']).toBeUndefined();
        expect(cfg.params.key).toBeUndefined();
      }
    });

    it('真实 API 失败回退模拟数据时应标记 source: simulated', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      const result = await weatherSync.getCityWeather('成都');
      expect(result.source).toBe('simulated');
    });

    it('QWEATHER_API_VERSION 应可配置天气 API 版本段（便于 v7 停服后无代码切换）', async () => {
      const originalVersion = process.env.QWEATHER_API_VERSION;
      const originalApiUrl = process.env.QWEATHER_API_URL;
      vi.resetModules();
      try {
        // 版本段只在模块加载时读取，需重新导入以生效
        delete process.env.QWEATHER_API_URL; // 确保走「host + 版本段」默认拼接
        process.env.QWEATHER_API_VERSION = 'v9';
        const fresh = (await import('../services/weatherSync')).default;

        const localGet = vi.fn();
        localGet.mockResolvedValueOnce({ data: { code: '200', location: [{ id: 'X_001' }] } });
        localGet.mockResolvedValueOnce({
          data: {
            code: '200',
            now: { temp: '20', feelsLike: '18', text: '晴', humidity: '50', windDir: '东', windScale: '2', vis: '10', pressure: '1010' }
          }
        });
        localGet.mockResolvedValueOnce({ data: { daily: [] } });
        fresh.__setAxiosForTest({ get: localGet, post: vi.fn() });

        const result = await fresh.getRealWeather('成都');
        expect(result).not.toBeNull();
        expect(localGet.mock.calls[1][0]).toContain('/v9/weather/now');
        expect(localGet.mock.calls[2][0]).toContain('/v9/weather/3d');
      } finally {
        if (originalVersion === undefined) delete process.env.QWEATHER_API_VERSION;
        else process.env.QWEATHER_API_VERSION = originalVersion;
        if (originalApiUrl === undefined) delete process.env.QWEATHER_API_URL;
        else process.env.QWEATHER_API_URL = originalApiUrl;
        vi.resetModules();
      }
    });
  });
});
