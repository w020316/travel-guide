/**
 * middleware/validation.js 单元测试（v10.10 新增）
 *
 * 背景：routes/api.js 有 41 个路由却长期 0 单测，vitest 覆盖率口径也未纳入
 * middleware/，导致两个真实缺陷长期漏网：
 *   P0-5  getCityWeather() 是 async 却漏 await → 天气恒返回 {}
 *   P0-6  /weather/:city 挂载了读取 req.params.name 的校验器 → 接口必然 400
 * 本文件锁定校验中间件的对外契约，尤其是「校验器读取的字段名必须与路由参数名一致」
 * 这一导致 P0-6 的根因，防止回归。
 */

import { describe, it, expect, vi } from 'vitest';
import { createRequire } from 'node:module';

// 与 routes/api.js 保持一致，用 CJS require 加载被测模块。
// 若用 ESM import，vitest 会为同一文件生成第二个模块实例，覆盖率按不同模块 ID 统计，
// 与 routes 内部 require 的实例合并时会互相覆盖（实测导致本文件覆盖率被低估）。
const requireCjs = createRequire(import.meta.url);
const {
  validateCityIdParam,
  validateCityName,
  validatePagination,
  validateSearchQuery,
  validateCityPayload
} = requireCjs('../middleware/validation.js');

/** 构造最小可用的 res 替身，记录 status / json 调用 */
function mockRes() {
  const res = { statusCode: 200, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (payload) => { res.body = payload; return res; };
  return res;
}

describe('middleware/validation', () => {
  describe('validateCityIdParam —— /weather/:city 所依赖的校验器（修复 P0-6）', () => {
    it('应按传入的字段名读取路由参数，中文城市名放行', () => {
      const mw = validateCityIdParam('city');
      const req = { params: { city: '北京' } };
      const res = mockRes();
      const next = vi.fn();

      mw(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
    });

    it('字段名与路由参数名不一致时必须拦截 —— 这正是 P0-6 的根因', () => {
      // 复现修复前的错误组合：路由参数是 :city，校验器却读 name
      const wrongMw = validateCityIdParam('name');
      const req = { params: { city: '北京' } };
      const res = mockRes();
      const next = vi.fn();

      wrongMw(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });

    it('缺少参数应返回 400', () => {
      const mw = validateCityIdParam('city');
      const req = { params: {} };
      const res = mockRes();
      const next = vi.fn();

      mw(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });

    it('应接受含 · 与空格的中文城市名', () => {
      const mw = validateCityIdParam('city');
      const req = { params: { city: '乌鲁木齐 · 天山区' } };
      const res = mockRes();
      const next = vi.fn();

      mw(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('应拒绝含 HTML / 脚本 / 路径穿越的非法输入', () => {
      const mw = validateCityIdParam('city');
      const badInputs = [
        '<script>alert(1)</script>',
        '北京"><img src=x onerror=alert(1)>',
        '../../../etc/passwd',
        '北京;DROP TABLE'
      ];

      for (const bad of badInputs) {
        const req = { params: { city: bad } };
        const res = mockRes();
        const next = vi.fn();

        mw(req, res, next);

        expect(next, `应拦截: ${bad}`).not.toHaveBeenCalled();
        expect(res.statusCode, `应返回 400: ${bad}`).toBe(400);
      }
    });

    it('应拒绝超过 30 字符的城市名（上限对齐路由侧校验）', () => {
      const mw = validateCityIdParam('city');
      const req = { params: { city: '北'.repeat(31) } };
      const res = mockRes();
      const next = vi.fn();

      mw(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });
  });

  describe('validateCityName —— 读取 req.params.name 的既有契约', () => {
    it('应从 params.name 取值并放行合法城市名', () => {
      const req = { params: { name: '成都' }, body: {} };
      const res = mockRes();
      const next = vi.fn();

      validateCityName(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('非法字符应返回 400', () => {
      const req = { params: { name: '<img src=x onerror=alert(1)>' }, body: {} };
      const res = mockRes();
      const next = vi.fn();

      validateCityName(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });

    it('超过 50 字符应返回 400', () => {
      const req = { params: { name: '城'.repeat(51) }, body: {} };
      const res = mockRes();
      const next = vi.fn();

      validateCityName(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });
  });

  describe('validatePagination —— 分页边界', () => {
    it('缺省时应给出 page=1 且 limit=20', () => {
      const req = { query: {} };
      const res = mockRes();
      const next = vi.fn();

      validatePagination(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.pagination).toEqual({ page: 1, limit: 20 });
    });

    it('负数 page 应返回 400', () => {
      // 注意：page=0 会被 `parseInt(...) || 1` 兜底为 1（0 属 falsy，视为未传），
      // 故此处用 -5 验证真正的越界分支
      const req = { query: { page: '-5' } };
      const res = mockRes();
      const next = vi.fn();

      validatePagination(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });

    it('page=0 应被兜底为 1（记录当前行为，防止无意变更）', () => {
      const req = { query: { page: '0' } };
      const res = mockRes();
      const next = vi.fn();

      validatePagination(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.pagination.page).toBe(1);
    });

    it('limit > 100 应返回 400（防止一次拉取全量 527 城）', () => {
      const req = { query: { limit: '99999' } };
      const res = mockRes();
      const next = vi.fn();

      validatePagination(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });
  });

  describe('validateSearchQuery —— 搜索关键字白名单', () => {
    it('合法中文关键字应放行', () => {
      const req = { query: { keyword: '成都 美食' } };
      const res = mockRes();
      const next = vi.fn();

      validateSearchQuery(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('含脚本的关键字应返回 400', () => {
      const req = { query: { keyword: '<script>alert(1)</script>' } };
      const res = mockRes();
      const next = vi.fn();

      validateSearchQuery(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });

    it('超过 100 字符应返回 400', () => {
      const req = { query: { keyword: 'a'.repeat(101) } };
      const res = mockRes();
      const next = vi.fn();

      validateSearchQuery(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });
  });

  describe('validateCityPayload —— 字段白名单与原型污染防御', () => {
    it('应剔除未授权字段与 __proto__ / constructor', () => {
      // 用 JSON.parse 构造真正的自有属性 __proto__（对象字面量中的 __proto__ 只会改原型）
      const body = JSON.parse(
        '{"name":"测试城","tags":["a"],"__proto__":{"polluted":true},"constructor":"x","evil":"y"}'
      );
      const req = { method: 'POST', body };
      const res = mockRes();
      const next = vi.fn();

      validateCityPayload(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.body.name).toBe('测试城');
      expect(req.body.tags).toEqual(['a']);
      expect(req.body).not.toHaveProperty('evil');
      expect(req.body).not.toHaveProperty('__proto__');
      // 全局原型未被污染
      expect({}.polluted).toBeUndefined();
    });

    it('POST 缺少 name 应返回 400', () => {
      const req = { method: 'POST', body: { tags: ['a'] } };
      const res = mockRes();
      const next = vi.fn();

      validateCityPayload(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });

    it('name 含非法字符应返回 400', () => {
      const req = { method: 'POST', body: { name: '<b>城</b>' } };
      const res = mockRes();
      const next = vi.fn();

      validateCityPayload(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
    });
  });
});
