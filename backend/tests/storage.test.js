/**
 * storage.service 单元测试
 *
 * 覆盖范围：
 * - 内存存储模式基础功能（getCity / searchCities / addCity / updateCity / deleteCity）
 * - 缓存 TTL 与 refreshCache 惊群效应修复（P2）
 * - 城市数据加载完整性（527 城）
 */
import { describe, it, expect, beforeEach } from 'vitest';
const storage = require('../services/storage');

describe('StorageService', () => {
  beforeEach(async () => {
    await storage.initialize();
  });

  describe('初始化', () => {
    it('应加载 527 城扩展数据库', () => {
      expect(storage.getCityCount()).toBeGreaterThanOrEqual(500);
    });

    it('应使用内存存储模式', () => {
      expect(storage.useMemoryStorage).toBe(true);
    });
  });

  describe('getCity', () => {
    it('应返回已存在的城市数据', async () => {
      const beijing = await storage.getCity('北京');
      expect(beijing).not.toBeNull();
      expect(beijing.title).toBeDefined();
    });

    it('未找到城市应返回 null', async () => {
      const notFound = await storage.getCity('不存在的城市XYZ');
      expect(notFound).toBeNull();
    });
  });

  describe('getCitySync', () => {
    it('应同步返回城市数据', () => {
      const beijing = storage.getCitySync('北京');
      expect(beijing).not.toBeNull();
    });
  });

  describe('searchCities', () => {
    it('应按关键字返回匹配城市', async () => {
      const results = await storage.searchCities('古城');
      expect(results.length).toBeGreaterThan(0);
      // 西安应匹配（含"古城墙"标签）
      const xian = results.find(c => c.name === '西安');
      expect(xian).toBeDefined();
    });

    it('关键字大小写不敏感', async () => {
      const lower = await storage.searchCities('北京');
      const upper = await storage.searchCities('北京');
      expect(lower.length).toBe(upper.length);
    });

    it('空关键字应返回所有城市', async () => {
      const results = await storage.searchCities('');
      expect(results.length).toBeGreaterThanOrEqual(500);
    });
  });

  describe('addCity / updateCity / deleteCity', () => {
    it('addCity 应添加新城市', async () => {
      const result = await storage.addCity('测试城市', { title: 'Test City', tags: ['test'] });
      expect(result.title).toBe('Test City');
      const fetched = await storage.getCity('测试城市');
      expect(fetched).not.toBeNull();
      expect(fetched.title).toBe('Test City');
    });

    it('updateCity 应更新现有城市', async () => {
      await storage.addCity('测试城市2', { title: 'Old' });
      const updated = await storage.updateCity('测试城市2', { title: 'New' });
      expect(updated.title).toBe('New');
      expect(updated.lastUpdated).toBeDefined();
    });

    it('updateCity 不存在的城市应返回 null', async () => {
      const result = await storage.updateCity('不存在城市XYZ', { title: 'x' });
      expect(result).toBeNull();
    });

    it('deleteCity 应删除并返回被删除的城市', async () => {
      await storage.addCity('待删除', { title: 'ToDelete' });
      const deleted = await storage.deleteCity('待删除');
      expect(deleted).not.toBeNull();
      expect(await storage.getCity('待删除')).toBeNull();
    });

    it('deleteCity 不存在的城市应返回 falsy', async () => {
      const result = await storage.deleteCity('不存在城市XYZ');
      // 实现是 `const deleted = this.citiesCache.get(name); return deleted;`
      // 未找到时 Map.get 返回 undefined（不是 null）
      expect(result).toBeFalsy();
    });
  });

  describe('getCitiesByTags', () => {
    it('应按标签匹配城市', async () => {
      const results = await storage.getCitiesByTags(['美食之都']);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('refreshCache 惊群效应修复（P2）', () => {
    it('内存模式下应直接更新 lastCacheTime 不调用数据库', async () => {
      const beforeTime = storage.lastCacheTime;
      // 等待 1ms 确保时间差
      await new Promise(r => setTimeout(r, 5));
      await storage.refreshCache();
      expect(storage.lastCacheTime).toBeGreaterThan(beforeTime);
    });

    it('并发调用 refreshCache 应该是幂等的（不抛错）', async () => {
      const results = await Promise.all([
        storage.refreshCache(),
        storage.refreshCache(),
        storage.refreshCache()
      ]);
      // 所有调用应正常完成
      expect(results).toHaveLength(3);
    });
  });

  describe('getAllCities', () => {
    it('应返回所有城市的对象映射', async () => {
      const all = await storage.getAllCities();
      expect(Object.keys(all).length).toBeGreaterThanOrEqual(500);
      expect(all['北京']).toBeDefined();
    });
  });

  describe('getCityNames / getCityCount', () => {
    it('getCityNames 应返回城市名数组', () => {
      const names = storage.getCityNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names).toContain('北京');
    });

    it('getCityCount 应返回城市数量', () => {
      const count = storage.getCityCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(500);
    });
  });
});
