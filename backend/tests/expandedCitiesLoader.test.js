/**
 * PERF-1 / Q-7：expandedCitiesLoader 回归测试（v11.4 新增）
 *
 * 背景：原 getAllCities 每 5 分钟 delete require.cache 后重载 249KB 模块并对 527 城全量
 * validate+sanitize（请求路径上的周期性重活，且与 storage 双份常驻）。v11.4 改为
 * 「单份常驻 + 内容哈希」：require 由 Node 模块缓存托管（不再 delete），仅哈希不一致才重建。
 *
 * 用 CJS require 加载被测模块，保证与本文件读取的 require.cache 为同一实例/同一路径解析。
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
const loader = requireCjs('../data/expandedCitiesLoader.js');

describe('PERF-1：expandedCitiesLoader 单份常驻 + 内容哈希', () => {
  it('getAllCities 返回全部城市，且结构已标准化（含 _meta.hash）', () => {
    const cities = loader.getAllCities();
    const keys = Object.keys(cities);
    expect(keys.length).toBe(527);

    const sample = cities[keys[0]];
    expect(sample).toHaveProperty('title');
    expect(sample).toHaveProperty('season');
    expect(Array.isArray(sample.tags)).toBe(true);
    expect(sample._meta).toBeTruthy();
    expect(typeof sample._meta.hash).toBe('string');
    expect(sample._meta.hash.length).toBeGreaterThan(0);
  });

  it('连续两次 getAllCities 返回同一引用（缓存命中，未重建）', () => {
    const a = loader.getAllCities();
    const b = loader.getAllCities();
    expect(a).toBe(b);
  });

  it('不再 delete require.cache 重载数据模块（模块引用保持不变）', () => {
    const key = requireCjs.resolve('../../data/expandedCities.js');

    loader.getAllCities(); // 确保已加载并缓存
    const refBefore = requireCjs.cache[key];
    expect(refBefore).toBeTruthy();

    loader.clearCache(); // 清缓存后下次 getAllCities 会真正走重载逻辑
    loader.getAllCities();

    const refAfter = requireCjs.cache[key];
    // 若仍 delete require.cache[...] 再 require，会生成新的模块对象（引用不同）；
    // 修复后依赖 Node 模块缓存，引用必须保持不变。
    expect(refAfter).toBe(refBefore);
  });

  it('内容哈希稳定：同数据同哈希，不同数据不同哈希（generateDataHash）', () => {
    const h1 = loader.generateDataHash({ a: 1, b: 2 });
    const h2 = loader.generateDataHash({ a: 1, b: 2 });
    const h3 = loader.generateDataHash({ a: 1, b: 3 });
    expect(h1).toBe(h2);
    expect(h1).not.toBe(h3);
  });

  it('CACHE_DURATION 为预期的 5 分钟', () => {
    expect(loader.CACHE_DURATION).toBe(5 * 60 * 1000);
  });

  it('clearCache 后重新 getAllCities 仍返回完整数据（可刷新，管理端点语义保留）', () => {
    loader.clearCache();
    const cities = loader.getAllCities();
    expect(Object.keys(cities).length).toBe(527);
  });
});
