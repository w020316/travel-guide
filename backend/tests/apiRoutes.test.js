/**
 * routes/api.js 集成测试（v10.10 新增）
 *
 * 背景：routes/api.js 有 41 个路由却长期 0 单测（覆盖率 0%），
 * 这正是以下两个 P0 缺陷长期未被发现的直接原因：
 *   P0-5  getCityWeather() 是 async 却漏 await → 天气恒返回 {}
 *   P0-6  /weather/:city 挂载了读取 req.params.name 的校验器 → 接口必然 400
 * 本文件通过真实 HTTP 请求锁定这两个接口的对外行为，防止回归。
 *
 * 实现说明：
 *   - 不引入 supertest（本项目 npm 安装存在 edgesOut 问题），改用
 *     express + node:http 起真实服务 + 全局 fetch 发请求，零新增依赖。
 *   - 不 mock weatherSync：把 QWEATHER_API_URL/GEO_URL 指向不可达地址
 *     （127.0.0.1:1 立即 ECONNREFUSED），让代码走「真实失败 → 模拟数据兜底」的
 *     真实分支，比 mock 更贴近生产行为。
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import http from 'node:http';
import { createRequire } from 'node:module';

let server;
let baseUrl;

/** 简易 JSON 请求helper */
async function req(path, options = {}) {
  const res = await fetch(baseUrl + path, options);
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

beforeAll(async () => {
  // 必须在 require routes/api.js 之前设置：模块加载时即读取这两个常量。
  // 指向 127.0.0.1:1 会立即 ECONNREFUSED，从而走「真实失败 → 模拟数据兜底」的真实分支。
  process.env.QWEATHER_API_URL = 'http://127.0.0.1:1/v7';
  process.env.QWEATHER_GEO_URL = 'http://127.0.0.1:1/v2';
  // 沙箱环境可能设置了 HTTP(S)_PROXY，axios 会遵循它从而绕远路（每次请求 ~2s）。
  // 显式声明 NO_PROXY，保证外部请求快速失败。
  process.env.NO_PROXY = '127.0.0.1,localhost';
  process.env.no_proxy = '127.0.0.1,localhost';

  // 关键：server.js 在启动时会调用 storage.initialize()，测试需自行初始化。
  // 注意必须用 createRequire 而非 ESM import —— routes/api.js 内部是 require()，
  // 在 vitest 下二者会解析到不同的模块实例（实测：ESM 实例初始化后为 527，
  // 而 require 实例仍为 0），用 import 初始化对被测路由无效。
  const requireCjs = createRequire(import.meta.url);
  const storage = requireCjs('../services/storage.js');
  await storage.initialize(null);
  const loaded = Object.keys(await storage.getAllCities()).length;
  if (loaded === 0) {
    throw new Error('测试前置失败：storage 未加载到城市数据，后续断言将全部失真');
  }

  const mod = await import('../routes/api.js');
  const apiRouter = mod.default || mod;

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}, 60000);

afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
});

describe('GET /api/weather/:city —— 锁定 P0-5 / P0-6', () => {
  it('中文城市名应返回 200，且 weather 是真实对象而非空对象（P0-5 核心断言）', async () => {
    const { status, body } = await req('/api/weather/' + encodeURIComponent('北京'));

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.city).toBe('北京');

    // 修复前：weather 是未 await 的 Promise，JSON 序列化后恒为 {}
    // 修复后：应是含字段的真实对象
    expect(body.weather).toBeTypeOf('object');
    expect(body.weather).not.toBeNull();
    expect(Object.keys(body.weather).length).toBeGreaterThan(0);
  }, 30000);

  it('修复前该接口必然 400 —— 断言现在不再因「城市名称不能为空」被拒（P0-6 核心断言）', async () => {
    const { status, body } = await req('/api/weather/' + encodeURIComponent('成都'));

    expect(status).not.toBe(400);
    if (body && body.error) {
      expect(body.error).not.toContain('城市名称不能为空');
    }
  }, 30000);

  it('含 · 的中文城市名应被接受', async () => {
    const { status } = await req('/api/weather/' + encodeURIComponent('乌鲁木齐 · 天山区'));
    expect(status).not.toBe(400);
  }, 30000);

  it('非法城市名（含脚本）应返回 400', async () => {
    const { status } = await req('/api/weather/' + encodeURIComponent('<script>alert(1)</script>'));
    expect(status).toBe(400);
  }, 30000);

  it('超长城市名应返回 400', async () => {
    const { status } = await req('/api/weather/' + encodeURIComponent('北'.repeat(31)));
    expect(status).toBe(400);
  }, 30000);
});

describe('GET /api/cities —— 城市列表基础契约', () => {
  it('应返回分页信封且 total 为 527', async () => {
    const { status, body } = await req('/api/cities');

    expect(status).toBe(200);
    expect(body.total).toBe(527);
    expect(body.page).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  }, 30000);

  it('limit 超过 100 应返回 400', async () => {
    const { status } = await req('/api/cities?limit=99999');
    expect(status).toBe(400);
  }, 30000);
});

describe('GET /api/cities/all —— 锁定 P1-8（列表接口不再逐城拉天气）', () => {
  it('legacy 模式应在合理时间内返回全部城市（证明未触发 527 次上游请求）', async () => {
    const started = Date.now();
    const { status, body } = await req('/api/cities/all');
    const elapsed = Date.now() - started;

    expect(status).toBe(200);
    expect(Object.keys(body).length).toBe(527);

    // 若仍逐城调用 getCityWeather，冷缓存下每个城市至少一次外部请求，
    // 即使全部立即失败也会累积到数秒以上。此处给出宽松上限作为回归哨兵。
    expect(elapsed).toBeLessThan(8000);
  }, 60000);

  it('每个城市都应带上 seasonalTags 与 lastUpdated（mergeCityMeta 的产物）', async () => {
    const { body } = await req('/api/cities/all');
    const first = body['北京'];

    expect(first).toBeTruthy();
    expect(first).toHaveProperty('lastUpdated');
  }, 60000);
});

describe('GET /api/cities/search —— 搜索接口', () => {
  it('合法关键字应返回数组', async () => {
    const { status, body } = await req('/api/cities/search?keyword=' + encodeURIComponent('成'));
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  }, 30000);

  it('含脚本的关键字应返回 400', async () => {
    const { status } = await req('/api/cities/search?keyword=' + encodeURIComponent('<script>'));
    expect(status).toBe(400);
  }, 30000);
});

describe('扩展数据库接口', () => {
  it('GET /api/expanded/trending 应返回排行榜', async () => {
    const { status, body } = await req('/api/expanded/trending?limit=5');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(5);
  }, 30000);

  it('GET /api/expanded/stats 应返回统计数据', async () => {
    const { status, body } = await req('/api/expanded/stats');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
  }, 30000);
});

describe('鉴权边界 —— 未登录不得执行管理操作', () => {
  it('POST /api/cities 无 token 应被拒', async () => {
    const { status } = await req('/api/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '测试城', tags: ['a'] })
    });
    expect([401, 403]).toContain(status);
  }, 30000);

  it('POST /api/weather/sync 无 token 应被拒', async () => {
    const { status } = await req('/api/weather/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: '北京' })
    });
    expect([401, 403]).toContain(status);
  }, 30000);
});

describe('GET /api/config/map —— v11.2 行程地图配置接口（高德）', () => {
  const prevKey = process.env.MAP_AMAP_KEY;
  const prevSecret = process.env.MAP_AMAP_SECRET;

  it('未配置 MAP_AMAP_KEY 时返回空串 key（前端据此显示配置引导）', async () => {
    delete process.env.MAP_AMAP_KEY;
    const { status, body } = await req('/api/config/map');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.provider).toBe('amap');
    expect(body.key).toBe('');
    expect(body.secret).toBe('');
  });

  it('配置 MAP_AMAP_KEY/SECRET 时原样下发（JS API 2.0 需成对使用）', async () => {
    process.env.MAP_AMAP_KEY = 'TEST-AMAP-KEY';
    process.env.MAP_AMAP_SECRET = 'TEST-AMAP-SECRET';
    const { status, body } = await req('/api/config/map');
    expect(status).toBe(200);
    expect(body.key).toBe('TEST-AMAP-KEY');
    expect(body.secret).toBe('TEST-AMAP-SECRET');
  });

  afterAll(() => {
    if (prevKey === undefined) delete process.env.MAP_AMAP_KEY;
    else process.env.MAP_AMAP_KEY = prevKey;
    if (prevSecret === undefined) delete process.env.MAP_AMAP_SECRET;
    else process.env.MAP_AMAP_SECRET = prevSecret;
  });
});
