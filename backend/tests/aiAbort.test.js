/**
 * Q-3：客户端断开 → 取消上游等待并跳过缓存写入（v11.4 新增）
 *
 * 背景（45s/60s 预算错配竞态）：前端先 abort 而后端仍在生成，导致付费额度照常消耗、
 * 结果因连接已断被丢弃，且可能把结果写入 30min 缓存造成「同一输入两次结果不一致」。
 * v11.4 后端在 /ai/generate 入口监听 res 'close'，客户端断开即经 AbortController 让
 * aiService 尽早终止等待并跳过缓存写入（降级方案）。
 *
 * 本测试用真实 HTTP + fetch，让某个 provider 的 chat 永不 resolve，随后客户端 abort，
 * 断言：① 上游已被发起（chat 被调用过）；② 断开后没有写入 AI 缓存。
 */
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import express from 'express';
import http from 'node:http';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);

let server;
let baseUrl;
let aiService;
let storage;
let agnesOriginalChat;

beforeAll(async () => {
  // 让天气/外网请求快速失败，避免测试挂起
  process.env.QWEATHER_API_URL = 'http://127.0.0.1:1/v7';
  process.env.QWEATHER_GEO_URL = 'http://127.0.0.1:1/v2';
  process.env.NO_PROXY = '127.0.0.1,localhost';
  process.env.no_proxy = '127.0.0.1,localhost';

  storage = requireCjs('../services/storage.js');
  await storage.initialize(null);

  aiService = requireCjs('../services/aiService.js');
  const router = requireCjs('../routes/api.js');

  const app = express();
  app.use(express.json());
  app.use('/api', router);

  server = http.createServer(app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}, 30000);

afterAll(async () => {
  if (server) await new Promise(r => server.close(r));
});

afterEach(() => {
  // 复原 provider 状态，避免污染其它测试
  if (aiService && agnesOriginalChat) {
    aiService.providers.agnes.chat = agnesOriginalChat;
    aiService.providers.agnes.apiKey = '';
    aiService.providers.agnes.recordSuccess();
    aiService.currentProvider = 'agnes';
    agnesOriginalChat = null;
  }
  vi.restoreAllMocks();
});

describe('Q-3：客户端提前断开', () => {
  it('断开后不再写入 AI 缓存（上游已发起但结果被丢弃）', async () => {
    const agnes = aiService.providers.agnes;
    agnesOriginalChat = agnes.chat;
    agnes.apiKey = 'test-key';
    agnes.recordSuccess();
    aiService.currentProvider = 'agnes';
    aiService.cache.clear();
    // 上游永不 resolve，模拟真实长耗时的付费生成
    agnes.chat = vi.fn(() => new Promise(() => {}));

    const setSpy = vi.spyOn(aiService.cache, 'set');

    const ctrl = new AbortController();
    const requestPromise = fetch(baseUrl + '/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: '测试断连城', preferences: { days: 1, budgetRange: 'medium' } }),
      signal: ctrl.signal
    }).catch(e => e); // 客户端 abort → fetch 拒绝，吞掉

    // 给请求一点时间抵达服务端并发起上游
    await new Promise(r => setTimeout(r, 200));
    ctrl.abort(); // 客户端提前断开

    await requestPromise;
    // 再等服务端完成收尾（detect close → abort → 回退本地）
    await new Promise(r => setTimeout(r, 400));

    // ① 上游确实被发起过
    expect(agnes.chat).toHaveBeenCalledTimes(1);
    // ② 关键断言：客户端断开后没有写入 AI 缓存
    expect(setSpy).not.toHaveBeenCalled();
  }, 20000);

  it('正常完成（未断开）时应写入缓存（对照，确保守卫不致误伤）', async () => {
    const agnes = aiService.providers.agnes;
    agnesOriginalChat = agnes.chat;
    agnes.apiKey = 'test-key';
    agnes.recordSuccess();
    aiService.currentProvider = 'agnes';
    aiService.cache.clear();
    // v11.5：结构合格才写缓存（V-6 守卫），故这里用「含 routes+foods 的合格数据」作为正常完成样本
    agnes.chat = vi.fn(() => Promise.resolve('{"routes":[{"routeLine":"A→B"}],"foods":[{"name":"小吃"}]}'));

    const setSpy = vi.spyOn(aiService.cache, 'set');

    const res = await fetch(baseUrl + '/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: '测试正常城', preferences: { days: 1, budgetRange: 'medium' } })
    });

    expect(res.status).toBe(200);
    expect(setSpy).toHaveBeenCalledTimes(1);
  }, 20000);
});
