/**
 * LRUCache 单元测试
 *
 * 覆盖范围：
 * - 基本读写（get/set/has/delete/clear）
 * - LRU 淘汰策略（超出 max 时淘汰最旧）
 * - TTL 过期机制（手动 purgeExpired + 自动 get 时检查）
 * - 边界条件（max=1、TTL=0 永不过期、null/undefined 值）
 * - Map API 兼容性（keys/values/entries/Symbol.iterator）
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LRUCache from '../utils/lruCache';

describe('LRUCache', () => {
  describe('构造函数', () => {
    it('应该接受 max 和 ttl 参数', () => {
      const cache = new LRUCache({ max: 10, ttl: 1000 });
      expect(cache.max).toBe(10);
      expect(cache.ttl).toBe(1000);
      expect(cache.size).toBe(0);
    });

    it('ttl 默认为 0（永不过期）', () => {
      const cache = new LRUCache({ max: 10 });
      expect(cache.ttl).toBe(0);
    });

    it('max 为非正数时应抛错', () => {
      expect(() => new LRUCache({ max: 0 })).toThrow(/max 必须为正整数/);
      expect(() => new LRUCache({ max: -1 })).toThrow(/max 必须为正整数/);
      expect(() => new LRUCache({ max: undefined })).toThrow(/max 必须为正整数/);
    });
  });

  describe('基本读写', () => {
    let cache;
    beforeEach(() => {
      cache = new LRUCache({ max: 5 });
    });

    it('set/get 应正确存取值', () => {
      cache.set('a', 1);
      cache.set('b', 'hello');
      cache.set('c', { nested: true });

      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBe('hello');
      expect(cache.get('c')).toEqual({ nested: true });
    });

    it('get 不存在的 key 应返回 undefined', () => {
      expect(cache.get('missing')).toBeUndefined();
    });

    it('has 应正确判断存在性', () => {
      cache.set('a', 1);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('missing')).toBe(false);
    });

    it('重复 set 同一 key 应更新值不增加 size', () => {
      cache.set('a', 1);
      cache.set('a', 2);
      expect(cache.size).toBe(1);
      expect(cache.get('a')).toBe(2);
    });

    it('delete 应删除条目并返回 true/false', () => {
      cache.set('a', 1);
      expect(cache.delete('a')).toBe(true);
      expect(cache.delete('a')).toBe(false);
      expect(cache.size).toBe(0);
      expect(cache.get('a')).toBeUndefined();
    });

    it('clear 应清空所有条目', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get('a')).toBeUndefined();
    });

    it('应支持 null 和 undefined 值', () => {
      cache.set('null', null);
      cache.set('undef', undefined);
      expect(cache.get('null')).toBeNull();
      expect(cache.get('undef')).toBeUndefined();
      // 注意：undefined 值与"未命中"无法区分，这是已知限制
      expect(cache.has('undef')).toBe(true);
    });
  });

  describe('LRU 淘汰策略', () => {
    it('超出 max 时应淘汰最久未访问的条目', () => {
      const cache = new LRUCache({ max: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4); // 应淘汰 'a'

      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
      expect(cache.size).toBe(3);
    });

    it('get 应刷新访问顺序，避免被淘汰', () => {
      const cache = new LRUCache({ max: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      cache.get('a'); // 访问 'a'，使其变为最新

      cache.set('d', 4); // 应淘汰 'b'（最久未访问），而不是 'a'
      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('max=1 时只保留最后一个条目', () => {
      const cache = new LRUCache({ max: 1 });
      cache.set('a', 1);
      cache.set('b', 2);

      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe(2);
      expect(cache.size).toBe(1);
    });

    it('set 已存在的 key 应刷新访问顺序', () => {
      const cache = new LRUCache({ max: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      cache.set('a', 100); // 刷新 'a' 的访问顺序

      cache.set('d', 4); // 应淘汰 'b'
      expect(cache.get('a')).toBe(100);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });
  });

  describe('TTL 过期机制', () => {
    it('ttl 过期后 get 应返回 undefined', () => {
      const cache = new LRUCache({ max: 5, ttl: 50 }); // 50ms 过期
      cache.set('a', 1);
      expect(cache.get('a')).toBe(1);

      return new Promise(resolve => {
        setTimeout(() => {
          expect(cache.get('a')).toBeUndefined();
          resolve();
        }, 60);
      });
    });

    it('ttl 过期后 has 应返回 false', () => {
      const cache = new LRUCache({ max: 5, ttl: 50 });
      cache.set('a', 1);
      expect(cache.has('a')).toBe(true);

      return new Promise(resolve => {
        setTimeout(() => {
          expect(cache.has('a')).toBe(false);
          resolve();
        }, 60);
      });
    });

    it('ttl=0 时永不过期', () => {
      const cache = new LRUCache({ max: 5, ttl: 0 });
      cache.set('a', 1);
      return new Promise(resolve => {
        setTimeout(() => {
          expect(cache.get('a')).toBe(1);
          resolve();
        }, 30);
      });
    });

    it('purgeExpired 应清理所有过期条目并返回清理数量', () => {
      const cache = new LRUCache({ max: 5, ttl: 50 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      return new Promise(resolve => {
        setTimeout(() => {
          const purged = cache.purgeExpired();
          expect(purged).toBe(3);
          expect(cache.size).toBe(0);
          resolve();
        }, 60);
      });
    });

    it('purgeExpired 在 ttl=0 时返回 0', () => {
      const cache = new LRUCache({ max: 5 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.purgeExpired()).toBe(0);
    });
  });

  describe('Map API 兼容性', () => {
    it('keys() 返回所有 key 数组', () => {
      const cache = new LRUCache({ max: 5 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      expect(cache.keys()).toEqual(['a', 'b', 'c']);
    });

    it('values() 返回所有 value 数组', () => {
      const cache = new LRUCache({ max: 5 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.values()).toEqual([1, 2]);
    });

    it('entries() 返回 [key, value] 数组', () => {
      const cache = new LRUCache({ max: 5 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.entries()).toEqual([['a', 1], ['b', 2]]);
    });

    it('Symbol.iterator 支持 for...of', () => {
      const cache = new LRUCache({ max: 5 });
      cache.set('a', 1);
      cache.set('b', 2);
      const pairs = [];
      for (const [key, value] of cache) {
        pairs.push([key, value]);
      }
      expect(pairs).toEqual([['a', 1], ['b', 2]]);
    });

    it('values() 在有过期条目时应跳过', () => {
      const cache = new LRUCache({ max: 5, ttl: 50 });
      cache.set('a', 1);
      cache.set('b', 2);

      return new Promise(resolve => {
        setTimeout(() => {
          // 过期后 values() 应返回空数组
          expect(cache.values()).toEqual([]);
          resolve();
        }, 60);
      });
    });
  });

  describe('集成场景', () => {
    it('模拟 aiService 缓存场景：500 条上限 + 30min TTL', () => {
      const cache = new LRUCache({ max: 500, ttl: 30 * 60 * 1000 });

      // 填充 500 条
      for (let i = 0; i < 500; i++) {
        cache.set(`city-${i}`, { routes: [`route-${i}`] });
      }
      expect(cache.size).toBe(500);

      // 第 501 条应淘汰 city-0
      cache.set('city-500', { routes: ['new'] });
      expect(cache.size).toBe(500);
      expect(cache.get('city-0')).toBeUndefined();
      expect(cache.get('city-500')).toEqual({ routes: ['new'] });

      // 旧条目仍可访问
      expect(cache.get('city-100')).toEqual({ routes: ['route-100'] });
    });

    it('模拟 weatherSync 缓存场景：200 城上限 + 10min TTL', () => {
      const cache = new LRUCache({ max: 200, ttl: 10 * 60 * 1000 });
      for (let i = 0; i < 200; i++) {
        cache.set(`city-${i}`, { temp: `${i}°C` });
      }
      cache.set('city-200', { temp: '20°C' });
      expect(cache.get('city-0')).toBeUndefined();
      expect(cache.size).toBe(200);
    });
  });
});
