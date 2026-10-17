/**
 * server.js 集成测试（v11.4 新增）
 *
 * 背景（Q-4）：server.js 长期 0% 行覆盖 —— 原 apiRoutes.test.js 自建 express app
 * 并直挂 router，永久绕过了 server.js 的静态托管 / CORS / helmet / 健康检查等中间件，
 * 这正是 SEC-1（根目录静态信息泄露）长期无回归保护的根因。
 *
 * 本文件通过 require 真实 server.js 导出实例（server.js 已做最小可测化：
 * 仅 `node server.js` 直接运行时才 app.listen），用 app.listen(0) 起真实服务 + fetch 发请求，
 * 零新增依赖（不引入 supertest）。
 *
 * 环境隔离：server.js 的 CORS / 静态 maxAge 等在模块加载时即读取 NODE_ENV，
 * 故 production 场景通过「清空 require 缓存 → 重设 env → 重新 require」取得独立实例；
 * 其余场景共用一个 test 环境实例。
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
const path = requireCjs('node:path');

// 固定 JWT_SECRET：避免「测试 createTestToken 的实例」与「被测路由 authService 实例」
// 因未配置密钥而各自生成随机密钥 → token 无法跨实例验证（401）。须在任何模块加载前设置。
process.env.JWT_SECRET = 'xingji-fixed-test-secret-000000000000000000000000';

// 仓库根目录（backend 的上一级）——清缓存时按此根定位，覆盖 backend/** 与 data/** 全部模块
const REPO_ROOT = path.join(path.dirname(requireCjs.resolve('../server.js')), '..');

const WHITELIST = [
  '/index.html',
  '/app.js',
  '/style.css',
  '/pwa.js',
  '/sw.js',
  '/offline.js',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/data/expandedCities.js'
];

/**
 * 清空 backend / data 目录下的 require 缓存并重新加载 server.js
 * （用于在切换 NODE_ENV 后取得独立实例；server.js 的 CORS/静态缓存策略在加载时读取 env）
 * @returns {import('express').Express} express app 实例
 */
function loadApp() {
  for (const key of Object.keys(requireCjs.cache)) {
    if (key.startsWith(REPO_ROOT) && !key.includes('node_modules')) {
      delete requireCjs.cache[key];
    }
  }
  return requireCjs('../server.js');
}

/** 起一个真实 HTTP 服务，返回 { server, baseUrl } */
async function startServer(app) {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}` };
}

// ==================== 默认（test 环境）实例 ====================
let server;
let baseUrl;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  // 关闭所有真实 AI provider：避免测试触发外网请求（慢/不稳定），强制走本地降级快速返回。
  // 注意用空串而非 delete —— server.js 加载时会 dotenv.config()，会把「已删除」的键从 .env 重新填充，
  // 而空串属「已定义」，dotenv 不会覆盖；provider.isAvailable = Boolean(apiKey) 为空即判定不可用。
  for (const k of ['AGNES_API_KEY', 'TONGYI_API_KEY', 'ZHIPU_API_KEY', 'DEEPSEEK_API_KEY', 'WENXIN_API_KEY', 'WENXIN_CLIENT_ID', 'WENXIN_CLIENT_SECRET', 'OPENAI_API_KEY']) {
    process.env[k] = '';
  }
  // 避免 storage/social 未初始化导致的噪音；static 与健康检查无需真实数据
  const app = loadApp();
  ({ server, baseUrl } = await startServer(app));
}, 60000);

afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
});

async function statusOf(path) {
  const res = await fetch(baseUrl + path, { redirect: 'manual' });
  return res.status;
}

describe('SEC-1：静态资源白名单（放行前端必需资源）', () => {
  it.each(WHITELIST)('白名单资源 %s 应返回 200', async (path) => {
    const res = await fetch(baseUrl + path, { redirect: 'manual' });
    expect(res.status).toBe(200);
  }, 15000);

  it('根路径 / 应返回首页（200）', async () => {
    const res = await fetch(baseUrl + '/', { redirect: 'manual' });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('行纪');
  }, 15000);

  it('白名单资源应带有正确的内容类型（app.js 为 JS）', async () => {
    const res = await fetch(baseUrl + '/app.js', { redirect: 'manual' });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/javascript/);
  }, 15000);
});

describe('SEC-1：非白名单资源一律 404（防探测，杜绝信息泄露）', () => {
  const FORBIDDEN_404 = [
    '/API_DOCUMENTATION.md',
    '/DESIGN.md',
    '/PROJECT_DELIVERY_REPORT.md',
    '/FIREBASE_SETUP.md',
    '/DOCKER_DEPLOY.md',
    '/NGINX_DOMAIN_GUIDE.md',
    '/start.bat',
    '/README.md',
    '/deliverables/software-company/quality-review/01-code-review.md',
    '/deliverables/gstack/ux-walkthrough-timing.json'
  ];

  it.each(FORBIDDEN_404)('未列入白名单的 %s 应返回 404', async (path) => {
    const res = await fetch(baseUrl + path, { redirect: 'manual' });
    expect(res.status).toBe(404);
  }, 15000);

  it('黑名单敏感路径应返回 403（纵深防御保留）', async () => {
    for (const p of ['/render.yaml', '/package.json', '/package-lock.json', '/backend/server.js']) {
      const res = await fetch(baseUrl + p, { redirect: 'manual' });
      expect(res.status).toBe(403);
    }
  }, 15000);

  it('点文件 / 点目录应不可访问（serve-static dotfiles:ignore → 非 200）', async () => {
    for (const p of ['/.env', '/.git/config', '/.trae']) {
      const res = await fetch(baseUrl + p, { redirect: 'manual' });
      expect(res.status).not.toBe(200);
    }
  }, 15000);

  it('不存在的路径应返回 404', async () => {
    expect(await statusOf('/definitely-not-here-xyz')).toBe(404);
  }, 15000);
});

describe('SEC-2：/api/ai/generate-batch 需管理员权限（v11.4）', () => {
  // 关键：本文件所有模块均通过 requireCjs（Node 真实 require.cache）加载，
  // 故 server.js→routes/api.js 内部的 authService 与此处 requireCjs 得到的实例为同一个，
  // createTestToken 与 verifyCustomToken 共享同一 jwtSecret，token 可被正确验证。
  function authServiceInstance() {
    return requireCjs('../services/authService.js');
  }

  async function postBatch(token, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(baseUrl + '/api/ai/generate-batch', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    let json = null;
    try { json = await res.json(); } catch { json = null; }
    return { status: res.status, body: json };
  }

  it('无 token 应 401（认证前置）', async () => {
    const { status } = await postBatch(null, { cities: ['北京'], preferences: {} });
    expect(status).toBe(401);
  }, 20000);

  it('普通用户 token 应 403「需要管理员权限」（修复前为可执行）', async () => {
    const token = authServiceInstance().createTestToken({ uid: 'batch-user', role: 'user' });
    const { status, body } = await postBatch(token, { cities: ['北京'], preferences: {} });
    expect(status).toBe(403);
    expect(body.error).toBe('需要管理员权限');
  }, 20000);

  it('管理员 token 应通过 requireAdmin（不被 403 拦截）', async () => {
    const token = authServiceInstance().createTestToken({ uid: 'batch-admin', role: 'admin' });
    const { status } = await postBatch(token, { cities: ['北京'], preferences: { days: 1 } });
    expect(status).not.toBe(403);
  }, 30000);
});
