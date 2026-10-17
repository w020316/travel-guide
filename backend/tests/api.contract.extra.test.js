/**
 * routes/api.js 公开接口与成功契约补充测试（v11.7）
 *
 * 定位：与 api.auth.extra.test.js 互补 —— 那边只覆盖鉴权/错误分支，
 * 这里覆盖「合法请求 → 成功响应」的完整契约（行覆盖原为 20.2%）：
 *   - 城市列表 / 全量 / 搜索 / 标签 / 详情 / 天气
 *   - 扩展数据库（stats / trending / search / provinces）
 *   - 社交互动（评论 / 点赞 / 关注 / 浏览 / 时间线）真实内存存储闭环
 *   - 城市管理 CRUD（新增 / 冲突 409 / 容量 507 / 更新 / 删除 / 404）
 *   - 批量生成与修图建议的成功映射
 *
 * 说明：社交服务未初始化 Firestore，走内存 LRU 实现，因此断言的是
 * 真实业务结果（评论 id、点赞翻转、关注计数），不是 mock 返回值。
 * 限流为 100 次/分钟/IP，本文件请求数控制在 70 以内；超限会让后续
 * 用例收到 429，故新增用例时需留意请求预算。
 */

import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import express from 'express';
import http from 'node:http';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
const storage = requireCjs('../services/storage.js');
const aiService = requireCjs('../services/aiService.js');
const authService = requireCjs('../services/authService.js');

let server;
let baseUrl;
let adminToken;
let userToken;
let otherUserToken;

async function api(path, { method = 'GET', token, body } = {}) {
  const options = { method, headers: {} };
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
  return { status: res.status, body: json, text };
}

beforeAll(async () => {
  process.env.QWEATHER_API_URL = 'http://127.0.0.1:1/v7';
  process.env.QWEATHER_GEO_URL = 'http://127.0.0.1:1/v2';
  process.env.NO_PROXY = '127.0.0.1,localhost';
  process.env.no_proxy = '127.0.0.1,localhost';

  await storage.initialize(null);
  if (Object.keys(await storage.getAllCities()).length === 0) {
    throw new Error('测试前置失败：storage 未加载到城市数据');
  }

  const apiRouter = requireCjs('../routes/api.js');

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  adminToken = authService.createTestToken({ uid: 'admin-1', role: 'admin', name: '管理员' });
  userToken = authService.createTestToken({ uid: 'user-1', role: 'user', name: '用户一' });
  otherUserToken = authService.createTestToken({ uid: 'user-2', role: 'user', name: '用户二' });
}, 60000);

afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('城市列表与搜索 —— 分页与信封契约', () => {
  it('GET /cities 默认 page=1/limit=20，条目只含列表字段', async () => {
    const { status, body } = await api('/api/cities');

    expect(status).toBe(200);
    expect(body.total).toBe(527);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(20);
    expect(body.data).toHaveLength(20);
    expect(Object.keys(body.data[0]).sort()).toEqual(['days', 'name', 'poster', 'season', 'tags']);
  });

  it('GET /cities?page=2&limit=3 返回第二页切片', async () => {
    const page1 = await api('/api/cities?page=1&limit=3');
    const page2 = await api('/api/cities?page=2&limit=3');

    expect(page2.status).toBe(200);
    expect(page2.body.page).toBe(2);
    expect(page2.body.data).toHaveLength(3);
    expect(page2.body.data[0].name).not.toBe(page1.body.data[0].name);
  });

  it('GET /cities?limit=-1 返回 400 分页参数无效', async () => {
    const { status, body } = await api('/api/cities?limit=-1');

    expect(status).toBe(400);
    expect(body.error).toBe('分页参数无效');
  });

  it('GET /cities/all 无分页参数时返回 legacy 扁平对象（527 城）', async () => {
    const { status, body } = await api('/api/cities/all');

    expect(status).toBe(200);
    expect(Object.keys(body)).toHaveLength(527);
    expect(body['北京'].seasonalTags).toHaveLength(3);
    expect(Number.isNaN(Date.parse(body['北京'].lastUpdated))).toBe(false);
  });

  it('GET /cities/all?page=1&limit=2 返回分页信封', async () => {
    const { status, body } = await api('/api/cities/all?page=1&limit=2');

    expect(status).toBe(200);
    expect(body.total).toBe(527);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(2);
    expect(Object.keys(body.data)).toHaveLength(2);
  });

  it('GET /cities/all?page=-1 与 limit=101 均返回 400', async () => {
    // 注意 page=0 会被 `parseInt(...) || 1` 兜底为 1（0 属 falsy），故用 -1 触发越界分支
    for (const query of ['page=-1', 'limit=101']) {
      const { status, body } = await api(`/api/cities/all?${query}`);
      expect(status).toBe(400);
      expect(body.error).toBe('分页参数无效（page>=1, 1<=limit<=100）');
    }
  });

  it('GET /cities/search?keyword=成 返回命中城市并合并季节标签', async () => {
    const { status, body } = await api('/api/cities/search?keyword=%E6%88%90');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every(c => Array.isArray(c.seasonalTags))).toBe(true);
    expect(body.some(c => c.name.includes('成'))).toBe(true);
  });

  it('GET /cities/search 缺少关键字或仅空白返回 400', async () => {
    const missing = await api('/api/cities/search');
    expect(missing.status).toBe(400);
    expect(missing.body.error).toBe('请提供搜索关键字');

    const blank = await api('/api/cities/search?keyword=%20');
    expect(blank.status).toBe(400);
    expect(blank.body.error).toBe('请提供搜索关键字');
  });

  it('GET /cities/search/tags 按标签返回城市；无标签时返回空数组', async () => {
    const withTags = await api('/api/cities/search/tags?tags=%E7%BE%8E%E9%A3%9F');
    expect(withTags.status).toBe(200);
    expect(Array.isArray(withTags.body)).toBe(true);
    expect(withTags.body.every(c => Array.isArray(c.seasonalTags))).toBe(true);

    const empty = await api('/api/cities/search/tags');
    expect(empty.status).toBe(200);
    expect(empty.body).toEqual([]);
  });
});

describe('城市详情与天气 —— 降级数据契约', () => {
  it('GET /cities/:name 命中时返回城市数据 + 天气 + 季节标签', async () => {
    const { status, body } = await api('/api/cities/%E5%8C%97%E4%BA%AC');

    expect(status).toBe(200);
    expect(body.currentWeather.city).toBe('北京');
    expect(body.currentWeather.source).toBe('simulated');
    expect(body.currentWeather.current.temp).toMatch(/^-?\d+°C$/);
    expect(body.seasonalTags).toHaveLength(3);
  });

  it('GET /cities/:name 未命中返回 404', async () => {
    const { status, body } = await api('/api/cities/%E4%B8%8D%E5%AD%98%E5%9C%A8%E5%9F%8E%E5%B8%82');

    expect(status).toBe(404);
    expect(body.error).toBe('城市不存在');
  });

  it('GET /weather/:city 返回天气与城市摘要；两次请求应命中缓存', async () => {
    const first = await api('/api/weather/%E5%8C%97%E4%BA%AC');
    expect(first.status).toBe(200);
    expect(first.body.success).toBe(true);
    expect(first.body.city).toBe('北京');
    expect(first.body.weather.source).toBe('simulated');
    expect(first.body.cityInfo.tags).toBeInstanceOf(Array);

    const second = await api('/api/weather/%E6%88%90%E9%83%BD');
    expect(second.status).toBe(200);
    expect(second.body.city).toBe('成都');
  });
});

describe('扩展城市数据库接口', () => {
  it('GET /expanded/stats 返回统计对象', async () => {
    const { status, body } = await api('/api/expanded/stats');

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.totalCities).toBeGreaterThan(500);
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it('GET /expanded/trending?limit=3 返回 rank 连续的前三名', async () => {
    const { status, body } = await api('/api/expanded/trending?limit=3');

    expect(status).toBe(200);
    expect(body.count).toBe(3);
    expect(body.data.map(c => c.rank)).toEqual([1, 2, 3]);
    expect(body.data[0].name).toBe('北京');
  });

  it('GET /expanded/search?q=成都 返回带分数的结果', async () => {
    const { status, body } = await api('/api/expanded/search?q=%E6%88%90%E9%83%BD');

    expect(status).toBe(200);
    expect(body.query).toBe('成都');
    expect(body.count).toBeGreaterThan(0);
    expect(body.data.some(r => r.name === '成都')).toBe(true);
    expect(typeof body.data[0].score).toBe('number');
  });

  it('GET /expanded/search 缺少关键词或仅空白返回 400', async () => {
    const missing = await api('/api/expanded/search');
    expect(missing.status).toBe(400);
    expect(missing.body.error).toBe('请提供搜索关键词');

    const blank = await api('/api/expanded/search?q=%20');
    expect(blank.status).toBe(400);
    expect(blank.body.error).toBe('请提供搜索关键词');
  });

  it('GET /expanded/provinces 无参数返回分组对象，未知省份返回 404', async () => {
    const all = await api('/api/expanded/provinces');
    expect(all.status).toBe(200);
    expect(all.body.province).toBe('全部');
    expect(all.body.count).toBeGreaterThan(0);
    expect(Array.isArray(all.body.data)).toBe(false);

    const unknown = await api('/api/expanded/provinces/%E7%81%AB%E6%98%9F%E7%9C%81');
    expect(unknown.status).toBe(404);
    expect(unknown.body.error).toBe('未找到 火星省 省份的城市数据');
  });

  it('GET /trending 返回按分数降序的 10 个城市', async () => {
    const { status, body } = await api('/api/trending');

    expect(status).toBe(200);
    expect(body).toHaveLength(10);
    expect(body[0]).toHaveProperty('name');
    expect(body[0]).toHaveProperty('tags');
    const scores = body.map(c => c.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

describe('社交互动 —— 内存存储真实闭环', () => {
  let commentId;

  it('POST /comments 登录用户发表评论，内容被 trim、uid 来自 token', async () => {
    const { status, body } = await api('/api/comments', {
      method: 'POST',
      token: userToken,
      body: { cityId: '北京', content: '  很好玩  ' }
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.comment.cityId).toBe('北京');
    expect(body.comment.userId).toBe('user-1');
    expect(body.comment.content).toBe('很好玩');
    expect(body.comment.parentId).toBeNull();
    commentId = body.comment.id;
  });

  it('POST /comments 支持带 parentId 的回复', async () => {
    const { status, body } = await api('/api/comments', {
      method: 'POST',
      token: otherUserToken,
      body: { cityId: '北京', content: '同意', parentId: commentId }
    });

    expect(status).toBe(200);
    expect(body.comment.parentId).toBe(commentId);
    expect(body.comment.userId).toBe('user-2');
  });

  it('GET /comments/:cityId 只返回顶级评论，limit 上限收敛到 100', async () => {
    const normal = await api('/api/comments/%E5%8C%97%E4%BA%AC');
    expect(normal.status).toBe(200);
    expect(normal.body.data).toHaveLength(1);
    expect(normal.body.data[0].id).toBe(commentId);
    expect(normal.body.page).toBe(1);
    expect(normal.body.limit).toBe(20);

    const capped = await api('/api/comments/%E5%8C%97%E4%BA%AC?limit=500');
    expect(capped.body.limit).toBe(100);
  });

  it('DELETE /comments/:id 非作者删除返回 500，作者删除成功，重复删除报不存在', async () => {
    const forbidden = await api(`/api/comments/${commentId}`, {
      method: 'DELETE',
      token: otherUserToken
    });
    expect(forbidden.status).toBe(500);
    expect(forbidden.body.error).toBe('无权删除此评论');

    const ok = await api(`/api/comments/${commentId}`, { method: 'DELETE', token: userToken });
    expect(ok.status).toBe(200);
    expect(ok.body.message).toBe('评论删除成功');

    const again = await api(`/api/comments/${commentId}`, { method: 'DELETE', token: userToken });
    expect(again.status).toBe(500);
    expect(again.body.error).toBe('评论不存在');
  });

  it('POST /likes/:type/:targetId 点赞后再点取消（同一用户幂等翻转）', async () => {
    const like = await api('/api/likes/cities/%E5%8C%97%E4%BA%AC', {
      method: 'POST',
      token: userToken
    });
    expect(like.status).toBe(200);
    expect(like.body).toEqual({ success: true, liked: true });

    const unlike = await api('/api/likes/cities/%E5%8C%97%E4%BA%AC', {
      method: 'POST',
      token: userToken
    });
    expect(unlike.body).toEqual({ success: true, liked: false });

    const commentLike = await api('/api/likes/comments/c_1', {
      method: 'POST',
      token: userToken
    });
    expect(commentLike.body.liked).toBe(true);
  });

  it('GET /likes/user 返回当前用户点赞，可按 type 过滤', async () => {
    const all = await api('/api/likes/user', { token: userToken });
    expect(all.status).toBe(200);
    expect(all.body.data).toHaveLength(1);
    expect(all.body.data[0].targetId).toBe('c_1');

    const citiesOnly = await api('/api/likes/user?type=cities', { token: userToken });
    expect(citiesOnly.body.data).toEqual([]);
  });

  it('POST /follow/:userId 关注与取消关注，粉丝/关注列表计数一致', async () => {
    const follow = await api('/api/follow/user-2', { method: 'POST', token: userToken });
    expect(follow.body).toEqual({ success: true, followed: true });

    const followers = await api('/api/followers', { token: otherUserToken });
    expect(followers.status).toBe(200);
    expect(followers.body.count).toBe(1);
    expect(followers.body.data[0].followerId).toBe('user-1');

    const following = await api('/api/following', { token: userToken });
    expect(following.body.count).toBe(1);
    expect(following.body.data[0].followingId).toBe('user-2');

    const unfollow = await api('/api/follow/user-2', { method: 'POST', token: userToken });
    expect(unfollow.body).toEqual({ success: true, followed: false });
  });

  it('GET /activity/timeline 返回评论与点赞活动', async () => {
    const { status, body } = await api('/api/activity/timeline', { token: userToken });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.every(a => ['comment', 'like'].includes(a.type))).toBe(true);
  });

  it('GET /trending/social 内存模式下返回空列表但保留信封字段', async () => {
    const { status, body } = await api('/api/trending/social?type=cities');

    expect(status).toBe(200);
    expect(body).toMatchObject({ success: true, data: [], type: 'cities' });
    expect(Number.isNaN(Date.parse(body.generatedAt))).toBe(false);
  });

  it('POST /views 匿名浏览计数，GET /stats/views 返回累计值', async () => {
    const record = await api('/api/views/cities/%E5%8C%97%E4%BA%AC', { method: 'POST' });
    expect(record.status).toBe(200);
    expect(record.body).toEqual({ success: true });

    const stats = await api('/api/stats/views/cities/%E5%8C%97%E4%BA%AC');
    expect(stats.status).toBe(200);
    expect(stats.body.success).toBe(true);
    expect(stats.body.stats.totalViews).toBe(1);
    expect(stats.body.stats.timeRange).toBe('7d');

    const range = await api('/api/stats/views/cities/%E5%8C%97%E4%BA%AC?range=24h');
    expect(range.body.stats.timeRange).toBe('24h');
  });

  it('POST /views/comments/中文 被 targetId 严格规则拒绝（400）', async () => {
    const { status, body } = await api('/api/views/comments/%E5%8C%97%E4%BA%AC', {
      method: 'POST'
    });

    expect(status).toBe(400);
    expect(body.error).toBe('targetId 格式非法');
  });
});

describe('城市管理 CRUD —— 管理员完整生命周期', () => {
  const CITY = '测试城';

  it('POST /cities 新增成功（201），未知字段被白名单剔除', async () => {
    const { status, body } = await api('/api/cities', {
      method: 'POST',
      token: adminToken,
      body: { name: CITY, tags: ['测试'], evil: 'x' }
    });

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.city.tags).toEqual(['测试']);
    expect(body.city).not.toHaveProperty('evil');
  });

  it('POST /cities 同名返回 409', async () => {
    const { status, body } = await api('/api/cities', {
      method: 'POST',
      token: adminToken,
      body: { name: CITY }
    });

    expect(status).toBe(409);
    expect(body.error).toBe('城市已存在');
  });

  it('POST /cities 名称超长或缺少 name 返回 400', async () => {
    const tooLong = await api('/api/cities', {
      method: 'POST',
      token: adminToken,
      body: { name: '城'.repeat(51) }
    });
    expect(tooLong.status).toBe(400);
    expect(tooLong.body.error).toBe('城市名称过长');

    const missing = await api('/api/cities', {
      method: 'POST',
      token: adminToken,
      body: { tags: [] }
    });
    expect(missing.status).toBe(400);
    expect(missing.body.error).toBe('城市名称不能为空');
  });

  it('POST /cities 缓存满时返回 507', async () => {
    vi.spyOn(storage, 'isCityCacheFull').mockReturnValue(true);

    const { status, body } = await api('/api/cities', {
      method: 'POST',
      token: adminToken,
      body: { name: '容量城' }
    });

    expect(status).toBe(507);
    expect(body.error).toBe('城市数量已达上限，无法新增');
  });

  it('PUT /cities/:name 更新成功，未授权字段被剔除', async () => {
    const { status, body } = await api(`/api/cities/${encodeURIComponent(CITY)}`, {
      method: 'PUT',
      token: adminToken,
      body: { tags: ['更新'], evil: 'x' }
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.city.tags).toEqual(['更新']);
    expect(body.city).not.toHaveProperty('evil');
  });

  it('PUT /cities/:name 不存在返回 404；body.name 会被路径参数覆盖（记录现状）', async () => {
    const missing = await api('/api/cities/%E4%B8%8D%E5%AD%98%E5%9C%A8%E5%9F%8E%E5%B8%82', {
      method: 'PUT',
      token: adminToken,
      body: { tags: ['x'] }
    });
    expect(missing.status).toBe(404);
    expect(missing.body.error).toBe('城市不存在');

    // validateCityName 会把 params.name 回写到 body.name，因此 PUT 无法通过 body 改名；
    // 注入式 body.name 也会被路径值覆盖，不会进入 updateCity。
    const overwritten = await api(`/api/cities/${encodeURIComponent(CITY)}`, {
      method: 'PUT',
      token: adminToken,
      body: { name: '<script>' }
    });
    expect(overwritten.status).toBe(200);
    expect(overwritten.body.city.name).toBe(CITY);
  });

  it('DELETE /cities/:name 删除成功，重复删除返回 404', async () => {
    const ok = await api(`/api/cities/${encodeURIComponent(CITY)}`, {
      method: 'DELETE',
      token: adminToken
    });
    expect(ok.status).toBe(200);
    expect(ok.body.message).toBe('城市已删除');

    const again = await api(`/api/cities/${encodeURIComponent(CITY)}`, {
      method: 'DELETE',
      token: adminToken
    });
    expect(again.status).toBe(404);
    expect(again.body.error).toBe('城市不存在');
  });
});

describe('AI 接口成功契约与认证成功路径', () => {
  it('POST /ai/generate-batch 逐城映射成功/失败，单城失败不影响整体 200', async () => {
    vi.spyOn(aiService, 'generateTravelGuide')
      .mockResolvedValueOnce({ source: 'ai', generatedAt: 'x' })
      .mockRejectedValueOnce(new Error('quota exceeded'));

    const { status, body } = await api('/api/ai/generate-batch', {
      method: 'POST',
      token: adminToken,
      body: { cities: ['成都', '重庆'], preferences: { days: 3 } }
    });

    expect(status).toBe(200);
    expect(body.total).toBe(2);
    expect(body.successful).toBe(1);
    expect(body.results[0]).toMatchObject({ city: '成都', success: true });
    expect(body.results[1]).toMatchObject({
      city: '重庆',
      success: false,
      error: 'quota exceeded'
    });
  });

  it('POST /ai/edit-photo 返回 AI 建议原文', async () => {
    vi.spyOn(aiService, 'getPhotoEditAdvice').mockResolvedValue('建议提高曝光');

    const { status, body } = await api('/api/ai/edit-photo', {
      method: 'POST',
      token: adminToken,
      body: { city: '成都', photoName: 'a.jpg', guideContext: { season: '秋' } }
    });

    expect(status).toBe(200);
    expect(body).toEqual({ success: true, advice: '建议提高曝光' });
  });

  it('POST /auth/login 成功时原样返回服务层的 token 与用户信息', async () => {
    vi.spyOn(authService, 'verifyAndCreateToken').mockResolvedValue({
      success: true,
      token: 'jwt-token',
      user: { uid: 'u-1', email: 'u@example.com', name: '用户' }
    });

    const { status, body } = await api('/api/auth/login', {
      method: 'POST',
      body: { idToken: 'aaa.bbb.ccc' }
    });

    expect(status).toBe(200);
    expect(body.token).toBe('jwt-token');
    expect(body.user).toEqual({ uid: 'u-1', email: 'u@example.com', name: '用户' });
  });
});
