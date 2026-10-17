/**
 * routes/api.js 鉴权与错误分支补充测试（v11.7）
 *
 * 定位：routes/api.js 原有测试只覆盖公开查询接口与「无 token 被拒」，
 * 鉴权矩阵（401 vs 403）、过期/伪造 token、服务层抛错后的 500 分支
 * 基本没有断言（行覆盖 20.2%）。本文件锁定：
 *   - 无 token / 非 Bearer / 过期 / 签名错误 → 401，且文案可区分
 *   - 已登录但非管理员 → 403「需要管理员权限」
 *   - 管理员 token 可通过 requireAdmin，进入参数校验（400）
 *   - storage / socialService / aiService 抛错时路由返回 500，
 *     响应体不包含 stack，非开发环境不返回 details
 *   - AI 生成接口的入参收敛（城市名、days 边界、枚举白名单、refresh）
 *   - 路由与服务层之间的调用契约（recordView 的 uid、skipCache 透传）
 *
 * 实现沿用 tests/apiRoutes.test.js 的「express + node:http + fetch」模式，
 * 不新增 supertest 依赖；通过 createRequire 拿到与路由内部同一份 CJS 模块实例，
 * 从而能用 vi.spyOn 替换服务层方法（ESM import 会得到不同实例）。
 */

import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import express from 'express';
import http from 'node:http';
import { createRequire } from 'node:module';
import jwt from 'jsonwebtoken';

const requireCjs = createRequire(import.meta.url);
const storage = requireCjs('../services/storage.js');
const socialService = requireCjs('../services/socialService.js');
const aiService = requireCjs('../services/aiService.js');
const authService = requireCjs('../services/authService.js');

let server;
let baseUrl;
let adminToken;
let userToken;

/** 发请求并解析 JSON */
async function api(path, { method = 'GET', token, body, headers = {} } = {}) {
  const options = { method, headers: { ...headers } };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  if (token) options.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(baseUrl + path, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, body: json, text, headers: res.headers };
}

beforeAll(async () => {
  // 让天气相关调用快速失败（ECONNREFUSED），走真实降级分支而非 mock
  process.env.QWEATHER_API_URL = 'http://127.0.0.1:1/v7';
  process.env.QWEATHER_GEO_URL = 'http://127.0.0.1:1/v2';
  process.env.NO_PROXY = '127.0.0.1,localhost';
  process.env.no_proxy = '127.0.0.1,localhost';

  await storage.initialize(null);

  const apiRouter = requireCjs('../routes/api.js');

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  adminToken = authService.createTestToken({ uid: 'admin-1', role: 'admin', name: '管理员' });
  userToken = authService.createTestToken({ uid: 'user-1', role: 'user', name: '普通用户' });
}, 60000);

afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('鉴权矩阵 —— 401 与 403 必须可区分', () => {
  it('无 Authorization 头返回 401「未提供认证令牌」', async () => {
    const { status, body } = await api('/api/auth/me');

    expect(status).toBe(401);
    expect(body).toEqual({ success: false, error: '未提供认证令牌' });
  });

  it('Authorization 不是 Bearer 方案返回 401', async () => {
    const { status, body } = await api('/api/auth/me', {
      headers: { Authorization: `Basic ${userToken}` }
    });

    expect(status).toBe(401);
    expect(body.error).toBe('未提供认证令牌');
  });

  it('过期 token 返回 401「认证令牌已过期，请重新登录」', async () => {
    const expired = jwt.sign(
      { uid: 'user-1', role: 'user' },
      authService.jwtSecret,
      { expiresIn: '-10s' }
    );

    const { status, body } = await api('/api/auth/me', { token: expired });

    expect(status).toBe(401);
    expect(body.error).toBe('认证令牌已过期，请重新登录');
  });

  it('签名错误的 token 返回 401「无效的认证令牌」', async () => {
    const forged = jwt.sign(
      { uid: 'admin-1', role: 'admin' },
      'a-wrong-secret-that-is-long-enough-32chars',
      { expiresIn: '1h' }
    );

    const { status, body } = await api('/api/auth/me', { token: forged });

    expect(status).toBe(401);
    expect(body.error).toBe('无效的认证令牌');
  });

  it('已登录但非管理员访问 requireAdmin 路由返回 403（而非 401）', async () => {
    const cases = [
      ['GET', '/api/ai/cache'],
      ['GET', '/api/social/stats'],
      ['POST', '/api/weather/clear-cache'],
      ['POST', '/api/expanded/cache/clear'],
      ['DELETE', '/api/cities/%E5%8C%97%E4%BA%AC']
    ];

    for (const [method, path] of cases) {
      const { status, body } = await api(path, { method, token: userToken });
      expect(status, `${method} ${path} 应为 403`).toBe(403);
      expect(body).toEqual({ success: false, error: '需要管理员权限' });
    }
  });

  it('管理员 token 可通过 requireAdmin 并进入参数校验（400 而非 403）', async () => {
    const cases = [
      ['POST', '/api/ai/generate-batch', { cities: [] }, '请提供城市列表'],
      ['POST', '/api/ai/edit-photo', {}, '请提供城市名称'],
      ['POST', '/api/weather/sync', {}, '请提供城市名称']
    ];

    for (const [method, path, body, expected] of cases) {
      const res = await api(path, { method, token: adminToken, body });
      expect(res.status, `${method} ${path}`).toBe(400);
      expect(res.body.error).toBe(expected);
    }
  });

  it('过期 token 访问管理员路由先返回 401（鉴权优先于角色判断）', async () => {
    const expired = jwt.sign({ uid: 'admin-1', role: 'admin' }, authService.jwtSecret, {
      expiresIn: '-1s'
    });

    const { status } = await api('/api/cities', {
      method: 'POST',
      token: expired,
      body: { name: '测试城' }
    });

    expect(status).toBe(401);
  });

  it('公开路由上的无效 token 由 optionalAuth 静默忽略（不返回 401）', async () => {
    const { status } = await api('/api/cities/%E5%8C%97%E4%BA%AC', { token: 'not-a-jwt' });
    expect(status).toBe(200);
  });
});

describe('服务层抛错 —— 500 且不泄漏堆栈', () => {
  it('GET /cities 在 storage 抛错时返回 500 与通用文案', async () => {
    const err = new Error('MongoDB connection lost at /srv/db.js:42');
    err.stack = 'SECRET_STACK_TRACE';
    vi.spyOn(storage, 'getAllCities').mockRejectedValue(err);

    const { status, body, text } = await api('/api/cities');

    expect(status).toBe(500);
    expect(body).toEqual({ error: '获取城市列表失败' });
    expect(text).not.toContain('SECRET_STACK_TRACE');
    expect(text).not.toContain('MongoDB connection lost');
  });

  it('GET /cities/all 在 storage 抛错时返回 500', async () => {
    vi.spyOn(storage, 'getAllCities').mockRejectedValue(new Error('boom'));

    const { status, body } = await api('/api/cities/all');

    expect(status).toBe(500);
    expect(body.error).toBe('获取所有城市数据失败');
  });

  it('GET /comments/:cityId 在 socialService 抛错时返回 500', async () => {
    vi.spyOn(socialService, 'getComments').mockRejectedValue(new Error('firestore down'));

    const { status, body, text } = await api('/api/comments/%E5%8C%97%E4%BA%AC');

    expect(status).toBe(500);
    expect(body.error).toBe('获取评论失败');
    expect(text).not.toContain('firestore down');
  });

  it('POST /comments 在服务层抛错时返回 500，且不泄漏 stack', async () => {
    const err = new Error('写入失败');
    err.stack = 'SECRET_STACK_TRACE';
    vi.spyOn(socialService, 'addComment').mockRejectedValue(err);

    const { status, body, text } = await api('/api/comments', {
      method: 'POST',
      token: userToken,
      body: { cityId: '北京', content: 'hello' }
    });

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe('写入失败');
    expect(text).not.toContain('SECRET_STACK_TRACE');
  });

  it('POST /ai/generate 在 AI 服务抛错时返回 500，测试环境不返回 details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(aiService, 'generateTravelGuide').mockRejectedValue(
      new Error('upstream 502 with api-key=sk-secret')
    );

    const { status, body, text } = await api('/api/ai/generate', {
      method: 'POST',
      token: userToken,
      body: { city: '成都' }
    });

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe('生成攻略失败，请稍后重试');
    expect(body.details).toBeUndefined();
    expect(text).not.toContain('sk-secret');
  });

  it('POST /weather/sync 在上游失败时返回 500（getRealWeather 返回 null）', async () => {
    const { status, body } = await api('/api/weather/sync', {
      method: 'POST',
      token: adminToken,
      body: { city: '北京' }
    });

    expect(status).toBe(500);
    expect(body.error).toBe('天气数据获取失败');
  });

  it('POST /follow/:userId 关注自己时服务层抛错 → 500 并透出业务文案', async () => {
    const { status, body } = await api('/api/follow/user-1', {
      method: 'POST',
      token: userToken
    });

    expect(status).toBe(500);
    expect(body.error).toBe('不能关注自己');
  });
});

describe('AI 生成入参收敛与调用契约', () => {
  it('缺少城市 / 含非法字符 / 空串均返回 400', async () => {
    const cases = [
      [{}, '请提供城市名称'],
      [{ city: '   ' }, '请提供城市名称'],
      [{ city: '<script>alert(1)</script>' }, '城市名称包含非法字符或过长（最多 30 字符）'],
      [{ city: '北'.repeat(31) }, '城市名称包含非法字符或过长（最多 30 字符）']
    ];

    for (const [body, expected] of cases) {
      const { status, body: resBody } = await api('/api/ai/generate', {
        method: 'POST',
        token: userToken,
        body
      });
      expect(status).toBe(400);
      expect(resBody.error).toBe(expected);
    }
  });

  it('preferences 越界值与非法枚举会被收敛为默认值后再传给 AI 服务', async () => {
    const spy = vi.spyOn(aiService, 'generateTravelGuide').mockResolvedValue({
      source: 'ai',
      generatedAt: '2026-10-17T00:00:00.000Z'
    });

    const { status } = await api('/api/ai/generate', {
      method: 'POST',
      token: userToken,
      body: {
        city: ' 成都 ',
        preferences: {
          days: 99,
          origin: '<script>',
          destination: ' 重庆 ',
          travelType: 'hack',
          budgetRange: 'ultra',
          travelers: '99'
        }
      }
    });

    expect(status).toBe(200);
    expect(spy).toHaveBeenCalledTimes(1);
    const [cityArg, prefArg] = spy.mock.calls[0];
    expect(cityArg).toBe('成都');
    expect(prefArg).toEqual({
      days: 3,
      origin: '',
      destination: '重庆',
      travelType: 'balanced',
      budgetRange: 'medium',
      travelers: '2'
    });
  });

  it('refresh=true 会以 skipCache=true 透传给 AI 服务（「再次生成」强制刷新）', async () => {
    const spy = vi.spyOn(aiService, 'generateTravelGuide').mockResolvedValue({
      source: 'ai',
      generatedAt: '2026-10-17T00:00:00.000Z'
    });

    await api('/api/ai/generate', {
      method: 'POST',
      token: userToken,
      body: { city: '成都', refresh: true }
    });

    const [, , opts] = spy.mock.calls[0];
    expect(opts.skipCache).toBe(true);
    expect(opts.signal).toBeDefined();
  });

  it('登录用户生成攻略时会记录一次城市浏览（uid 来自 token）', async () => {
    vi.spyOn(aiService, 'generateTravelGuide').mockResolvedValue({
      source: 'ai',
      generatedAt: '2026-10-17T00:00:00.000Z'
    });
    const viewSpy = vi.spyOn(socialService, 'recordView').mockResolvedValue({ success: true });

    const { status } = await api('/api/ai/generate', {
      method: 'POST',
      token: userToken,
      body: { city: '杭州' }
    });

    expect(status).toBe(200);
    expect(viewSpy).toHaveBeenCalledWith('cities', '杭州', 'user-1');
  });

  it('生成成功时合并天气（真实上游失败 → simulated）与季节标签', async () => {
    vi.spyOn(aiService, 'generateTravelGuide').mockResolvedValue({
      source: 'ai',
      generatedAt: '2026-10-17T00:00:00.000Z'
    });

    const { status, body } = await api('/api/ai/generate', {
      method: 'POST',
      token: userToken,
      body: { city: '成都' }
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.source).toBe('ai');
    expect(body.data.currentWeather.source).toBe('simulated');
    expect(body.data.currentWeather.city).toBe('成都');
    expect(body.data.seasonalTags).toHaveLength(3);
    expect(Number.isNaN(Date.parse(body.data.lastUpdated))).toBe(false);
    expect(body.user).toEqual({ uid: 'user-1', name: '普通用户' });
  });

  it('批量生成：管理员可调用，逐个城市返回 success 标记', async () => {
    vi.spyOn(aiService, 'generateTravelGuide')
      .mockResolvedValueOnce({ source: 'ai', generatedAt: 'x' })
      .mockRejectedValueOnce(new Error('quota exceeded'));

    const { status, body } = await api('/api/ai/generate-batch', {
      method: 'POST',
      token: adminToken,
      body: { cities: ['成都', '重庆'] }
    });

    expect(status).toBe(200);
    expect(body.total).toBe(2);
    expect(body.successful).toBe(1);
    expect(body.results[0]).toMatchObject({ city: '成都', success: true });
    expect(body.results[1]).toMatchObject({ city: '重庆', success: false, error: 'quota exceeded' });
  });

  it('修图建议：管理员调用成功时返回 advice', async () => {
    vi.spyOn(aiService, 'getPhotoEditAdvice').mockResolvedValue('提高对比度');

    const { status, body } = await api('/api/ai/edit-photo', {
      method: 'POST',
      token: adminToken,
      body: { city: '成都', photoName: 'a.jpg' }
    });

    expect(status).toBe(200);
    expect(body).toEqual({ success: true, advice: '提高对比度' });
  });

  it('GET/DELETE /ai/cache：无 token 401、非管理员 403、管理员 200', async () => {
    // 回归 v11.7 修复：此前两条路由只挂 requireAdmin、缺 verifyCustomToken，
    // req.user 恒 undefined → 管理员也恒 403（功能死锁）。补齐后三层鉴权应逐级放行。
    const noToken = await api('/api/ai/cache');
    expect(noToken.status).toBe(401);
    expect(noToken.body.error).toBe('未提供认证令牌');

    const forbidden = await api('/api/ai/cache', { token: userToken });
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.error).toBe('需要管理员权限');

    const cacheSpy = vi.spyOn(aiService, 'getCacheStats').mockReturnValue({ size: 3, max: 100 });
    const view = await api('/api/ai/cache', { token: adminToken });
    expect(view.status).toBe(200);
    expect(view.body).toEqual({ success: true, stats: { size: 3, max: 100 } });
    expect(cacheSpy).toHaveBeenCalledTimes(1);

    const noTokenDelete = await api('/api/ai/cache', { method: 'DELETE' });
    expect(noTokenDelete.status).toBe(401);

    const forbiddenDelete = await api('/api/ai/cache', { method: 'DELETE', token: userToken });
    expect(forbiddenDelete.status).toBe(403);

    const clearSpy = vi.spyOn(aiService, 'clearCache').mockImplementation(() => {});
    const cleared = await api('/api/ai/cache', { method: 'DELETE', token: adminToken });
    expect(cleared.status).toBe(200);
    expect(cleared.body).toEqual({ success: true, message: 'AI缓存已清除' });
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});

describe('认证与资料接口', () => {
  it('POST /auth/login：缺少 / 格式非法的 idToken 返回 400', async () => {
    const missing = await api('/api/auth/login', { method: 'POST', body: {} });
    expect(missing.status).toBe(400);
    expect(missing.body.error).toBe('请提供Firebase ID Token');

    const malformed = await api('/api/auth/login', {
      method: 'POST',
      body: { idToken: 'only.two' }
    });
    expect(malformed.status).toBe(400);
    expect(malformed.body.error).toBe('ID Token 格式非法');
  });

  it('POST /auth/login：Firebase 未配置时合法格式 token 也返回 401', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { status, body } = await api('/api/auth/login', {
      method: 'POST',
      body: { idToken: 'aaa.bbb.ccc' }
    });

    expect(status).toBe(401);
    expect(body.error).toBe('无效的认证令牌');
  });

  it('GET /auth/me：Firebase 未配置时返回 500，注入成功后返回用户信息', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const failed = await api('/api/auth/me', { token: userToken });
    expect(failed.status).toBe(500);
    expect(failed.body.error).toBe('获取用户信息失败');

    vi.spyOn(authService, 'getUserInfo').mockResolvedValue({
      uid: 'user-1',
      email: 'u@example.com',
      displayName: '普通用户'
    });
    const ok = await api('/api/auth/me', { token: userToken });
    expect(ok.status).toBe(200);
    expect(ok.body.user).toEqual({
      uid: 'user-1',
      email: 'u@example.com',
      displayName: '普通用户'
    });
  });

  it('PUT /auth/profile：非法 photoURL 返回 400，合法 payload 交给服务层', async () => {
    const bad = await api('/api/auth/profile', {
      method: 'PUT',
      token: userToken,
      body: { photoURL: 'javascript:alert(1)' }
    });
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('photoURL 必须以 http(s):// 开头');

    const spy = vi.spyOn(authService, 'updateProfile').mockResolvedValue({
      success: true,
      message: '用户资料更新成功'
    });
    const ok = await api('/api/auth/profile', {
      method: 'PUT',
      token: userToken,
      body: { displayName: '小明', photoURL: 'https://cdn.example.com/a.png' }
    });
    expect(ok.status).toBe(200);
    expect(ok.body.message).toBe('用户资料更新成功');
    expect(spy).toHaveBeenCalledWith('user-1', {
      displayName: '小明',
      photoURL: 'https://cdn.example.com/a.png'
    });
  });
});

describe('数据同步接口 —— 成功与 404 分支', () => {
  it('POST /cities/sync：返回同步数量', async () => {
    vi.spyOn(storage, 'syncAllCitiesFromDatabase').mockResolvedValue([
      { name: '成都' },
      { name: '重庆' }
    ]);

    const { status, body } = await api('/api/cities/sync', {
      method: 'POST',
      token: adminToken
    });

    expect(status).toBe(200);
    expect(body).toEqual({ success: true, count: 2, message: '成功同步2个城市' });
  });

  it('POST /cities/sync/:name：命中时合并天气，未命中返回 404', async () => {
    const syncSpy = vi
      .spyOn(storage, 'syncCityFromDatabase')
      .mockResolvedValueOnce({ name: '北京', tags: ['古都'] })
      .mockResolvedValueOnce(null);

    const ok = await api('/api/cities/sync/%E5%8C%97%E4%BA%AC', {
      method: 'POST',
      token: adminToken
    });
    expect(ok.status).toBe(200);
    expect(ok.body.success).toBe(true);
    expect(ok.body.city.currentWeather.source).toBe('simulated');
    expect(ok.body.city.tags).toEqual(['古都']);

    const missing = await api('/api/cities/sync/%E5%8C%97%E4%BA%AC', {
      method: 'POST',
      token: adminToken
    });
    expect(missing.status).toBe(404);
    expect(missing.body.error).toBe('城市不存在');
    expect(syncSpy).toHaveBeenCalledTimes(2);
  });

  it('POST /weather/clear-cache 与 /expanded/cache/clear：管理员调用成功', async () => {
    const weather = await api('/api/weather/clear-cache', {
      method: 'POST',
      token: adminToken
    });
    expect(weather.status).toBe(200);
    expect(weather.body.message).toBe('天气缓存已清除');

    const expanded = await api('/api/expanded/cache/clear', {
      method: 'POST',
      token: adminToken
    });
    expect(expanded.status).toBe(200);
    expect(expanded.body.message).toBe('缓存已清除');
  });

  it('GET /social/stats：无 token 401、非管理员 403、管理员 200', async () => {
    // 回归 v11.7 修复：此前只挂 requireAdmin、缺 verifyCustomToken，管理员也恒 403。
    const noToken = await api('/api/social/stats');
    expect(noToken.status).toBe(401);
    expect(noToken.body.error).toBe('未提供认证令牌');

    const forbidden = await api('/api/social/stats', { token: userToken });
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.error).toBe('需要管理员权限');

    const ok = await api('/api/social/stats', { token: adminToken });
    expect(ok.status).toBe(200);
    expect(ok.body.success).toBe(true);
    expect(ok.body.stats.mode).toBe('memory');
    expect(ok.body.stats.initialized).toBe(false);
  });
});

describe('GET /config/map —— 凭证响应禁止缓存', () => {
  it('应返回 amap 配置并设置 no-store, private', async () => {
    const { status, body, headers } = await api('/api/config/map');

    expect(status).toBe(200);
    expect(body.provider).toBe('amap');
    expect(typeof body.key).toBe('string');
    expect(typeof body.secret).toBe('string');
    expect(headers.get('cache-control')).toBe('no-store, private');
  });
});
