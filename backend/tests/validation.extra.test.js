/**
 * middleware/validation.js 补充测试（v11.7）
 *
 * 定位：validation.js 是所有 API 的入参边界，原测试仅覆盖 5 个校验器的
 * 「少量合法/非法」组合（行覆盖 37.5%），大量导出校验器与限流/错误处理
 * 分支完全无测试。本文件补齐：
 *   - 每个导出校验器的合法放行 + 非法拒绝双向断言（含具体错误文案）
 *   - 边界值：空串 / null / undefined / 数组冒充字符串 / 超长 / 负数 /
 *     __proto__ 原型污染 / JWT 段数与长度
 *   - rateLimiter：429 + Retry-After、窗口滑动重置、bucket 隔离、
 *     默认桶共享、无 req.ip 时回退 socket.remoteAddress、计数 Map 上限清理
 *   - errorHandler：错误类型 → 状态码映射、统一响应结构、开发环境 details、
 *     日志脱敏（不得包含 stack / body）
 *
 * 纪律：每个用例断言具体值或具体错误文案，不使用 toBeDefined / toBe(true) 充数。
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRequire } from 'node:module';

// 用 createRequire 而非 ESM import 加载被测模块：
// routes/api.js 内部是 CJS require，若测试用 ESM import，vitest 会生成两个模块实例，
// 覆盖率按两个不同的模块 ID 统计，导致「测试跑到了但 lcov 显示未覆盖」。
// 统一走 CJS require 可让覆盖率合并到同一份记录。
const requireCjs = createRequire(import.meta.url);
const {
  validateCityName,
  validateCityPayload,
  validateSearchQuery,
  validatePagination,
  rateLimiter,
  errorHandler,
  validateIdParam,
  validateCommentPayload,
  validateTargetType,
  validateIdToken,
  validateProfilePayload,
  validateCitiesArray,
  validateCityBody,
  validateCityIdParam,
  validateTargetIdByType,
  VALID_TARGET_TYPES
} = requireCjs('../middleware/validation.js');

/** 构造最小 res 替身：记录 status / json / setHeader */
function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    }
  };
  return res;
}

/** 断言被拒绝：next 未调用、状态码与统一错误结构正确 */
function expectRejected(res, next, status, errorIncludes) {
  expect(next).not.toHaveBeenCalled();
  expect(res.statusCode).toBe(status);
  expect(res.body.success).toBe(false);
  expect(res.body.error).toContain(errorIncludes);
}

describe('validateCityName —— 入参为空 / 类型错误 / 来源优先级', () => {
  it('params.name 与 body.name 均缺失时返回 400 且文案为「城市名称不能为空」', () => {
    const req = { params: {}, body: {} };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expectRejected(res, next, 400, '城市名称不能为空');
  });

  it('空字符串应被拒绝（falsy 分支）', () => {
    const req = { params: { name: '' }, body: {} };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expectRejected(res, next, 400, '城市名称不能为空');
  });

  it('数组冒充字符串应被拒绝（typeof !== string）', () => {
    const req = { params: { name: ['北京'] }, body: {} };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expectRejected(res, next, 400, '城市名称不能为空');
  });

  it('params 无值时回退读取 body.name，并同步回写 params.name', () => {
    const req = { params: {}, body: { name: ' 西安 ' } };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.params.name).toBe('西安');
    expect(req.body.name).toBe('西安');
  });

  it('params.name 两端空白应被 trim', () => {
    const req = { params: { name: '  杭州  ' }, body: {} };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.params.name).toBe('杭州');
  });

  it('恰好 50 字符应放行（边界内）', () => {
    const name = '城'.repeat(50);
    const req = { params: { name }, body: {} };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.params.name).toHaveLength(50);
  });

  it('含 ·、连字符与空格的中文名应放行', () => {
    const req = { params: { name: '乌鲁木齐-天山区 A' }, body: {} };
    const res = mockRes();
    const next = vi.fn();

    validateCityName(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('反斜杠 / 引号 / 斜杠等非法字符应被拒绝', () => {
    for (const bad of ['北京\\成都', '北京"成都', '北京/成都']) {
      const req = { params: { name: bad }, body: {} };
      const res = mockRes();
      const next = vi.fn();

      validateCityName(req, res, next);

      expectRejected(res, next, 400, '城市名称包含非法字符');
    }
  });
});

describe('validateCityPayload —— 字段白名单 / 必填 / 名称边界', () => {
  it('GET 请求不强制 name，且未授权字段被剔除', () => {
    const req = { method: 'GET', body: { tags: ['a'], evil: 1 } };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ tags: ['a'] });
  });

  it('body 缺失时 POST 返回 400（不抛 TypeError）', () => {
    const req = { method: 'POST' };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expectRejected(res, next, 400, '城市名称不能为空');
  });

  it('body 缺失时 GET 放行并归一化为空对象', () => {
    const req = { method: 'GET' };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({});
  });

  it('白名单字段（budget/weather/image/popularity）应原样保留', () => {
    const body = {
      name: '成都',
      budget: { low: 300 },
      weather: { temp: '20°C' },
      image: '/img/cd.jpg',
      popularity: 99
    };
    const req = { method: 'POST', body };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual(body);
  });

  it('未授权字段被剔除时应输出告警日志（便于审计注入尝试）', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const req = { method: 'POST', body: { name: '成都', evil: 1, admin: true } };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('evil');
    expect(warnSpy.mock.calls[0][0]).toContain('admin');
    warnSpy.mockRestore();
  });

  it('name 为数字时返回 400（类型分支，而非崩溃）', () => {
    const req = { method: 'POST', body: { name: 123 } };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expectRejected(res, next, 400, '城市名称过长');
  });

  it('name 恰好 50 字符应放行，51 字符应拒绝', () => {
    const ok = { method: 'POST', body: { name: '城'.repeat(50) } };
    const okRes = mockRes();
    const okNext = vi.fn();
    validateCityPayload(ok, okRes, okNext);
    expect(okNext).toHaveBeenCalledTimes(1);

    const bad = { method: 'POST', body: { name: '城'.repeat(51) } };
    const badRes = mockRes();
    const badNext = vi.fn();
    validateCityPayload(bad, badRes, badNext);
    expectRejected(badRes, badNext, 400, '城市名称过长');
  });

  it('prototype 字段与 __proto__ / constructor 一并被剔除', () => {
    const body = JSON.parse('{"name":"成都","prototype":{"x":1},"__proto__":{"polluted":1}}');
    const req = { method: 'POST', body };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(Object.keys(req.body)).toEqual(['name']);
    expect({}.polluted).toBeUndefined();
  });

  it('仅空白的 name 会通过字符校验但被 trim 为空（记录现状，路由层需二次判空）', () => {
    const req = { method: 'POST', body: { name: '   ' } };
    const res = mockRes();
    const next = vi.fn();

    validateCityPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.name).toBe('');
  });
});

describe('validateSearchQuery —— 关键字类型 / 长度 / 字符集', () => {
  it('未传 keyword 时直接放行', () => {
    const req = { query: {} };
    const res = mockRes();
    const next = vi.fn();

    validateSearchQuery(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('恰好 100 字符应放行', () => {
    const req = { query: { keyword: 'a'.repeat(100) } };
    const res = mockRes();
    const next = vi.fn();

    validateSearchQuery(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('数组形式的 keyword 应返回 400（类型分支）', () => {
    const req = { query: { keyword: ['成都', '重庆'] } };
    const res = mockRes();
    const next = vi.fn();

    validateSearchQuery(req, res, next);

    expectRejected(res, next, 400, '搜索关键字过长');
  });

  it('允许中文标点（，。、！？）与空格', () => {
    const req = { query: { keyword: '成都，美食。不错！真的？' } };
    const res = mockRes();
    const next = vi.fn();

    validateSearchQuery(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('emoji / 引号 / 分号等未列入白名单的字符应被拒绝', () => {
    for (const bad of ['成都😀', "成都';DROP", '成都<script>']) {
      const req = { query: { keyword: bad } };
      const res = mockRes();
      const next = vi.fn();

      validateSearchQuery(req, res, next);

      expectRejected(res, next, 400, '搜索关键字包含非法字符');
    }
  });
});

describe('validateIdParam —— 通用 ID 格式与长度', () => {
  it('合法 ID（字母数字下划线连字符）应放行', () => {
    const mw = validateIdParam('commentId');
    const req = { params: { commentId: 'abc_123-XYZ' } };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('缺失参数时返回 400 且文案包含字段名', () => {
    const mw = validateIdParam('userId');
    const req = { params: {} };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expectRejected(res, next, 400, '缺少参数: userId');
  });

  it('64 字符应放行，65 字符应拒绝', () => {
    const mw = validateIdParam('userId');
    const okReq = { params: { userId: 'a'.repeat(64) } };
    const okNext = vi.fn();
    mw(okReq, mockRes(), okNext);
    expect(okNext).toHaveBeenCalledTimes(1);

    const badReq = { params: { userId: 'a'.repeat(65) } };
    const badRes = mockRes();
    const badNext = vi.fn();
    mw(badReq, badRes, badNext);
    expectRejected(badRes, badNext, 400, 'userId 格式非法');
  });

  it('中文 / 空格 / 点 / 斜杠 / 路径穿越均被拒绝', () => {
    const mw = validateIdParam('targetId');
    for (const bad of ['北京', 'a b', 'a.b', 'a/b', '../etc/passwd', 'a\nb']) {
      const req = { params: { targetId: bad } };
      const res = mockRes();
      const next = vi.fn();

      mw(req, res, next);

      expectRejected(res, next, 400, 'targetId 格式非法');
    }
  });
});

describe('validateCityIdParam —— 中文城市名 ID', () => {
  it('30 字符中文名应放行，31 字符应拒绝', () => {
    const mw = validateCityIdParam('city');
    const okReq = { params: { city: '北'.repeat(30) } };
    const okNext = vi.fn();
    mw(okReq, mockRes(), okNext);
    expect(okNext).toHaveBeenCalledTimes(1);

    const badReq = { params: { city: '北'.repeat(31) } };
    const badRes = mockRes();
    const badNext = vi.fn();
    mw(badReq, badRes, badNext);
    expectRejected(badRes, badNext, 400, 'city 格式非法');
  });

  it('缺失参数时返回 400', () => {
    const mw = validateCityIdParam('city');
    const res = mockRes();
    const next = vi.fn();

    mw({ params: {} }, res, next);

    expectRejected(res, next, 400, '缺少参数: city');
  });
});

describe('validateTargetIdByType —— 按 targetType 切换严格/宽松规则', () => {
  it('cities 类型允许中文城市名', () => {
    const mw = validateTargetIdByType('targetId');
    const req = { params: { type: 'cities', targetId: '乌鲁木齐·天山区' } };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('comments 类型拒绝中文（严格 ID 规则）', () => {
    const mw = validateTargetIdByType('targetId');
    const req = { params: { type: 'comments', targetId: '北京' } };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expectRejected(res, next, 400, 'targetId 格式非法');
  });

  it('guides 类型放行合法英文 ID', () => {
    const mw = validateTargetIdByType('targetId');
    const req = { params: { type: 'guides', targetId: 'guide_2026-01' } };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('type 缺失时走严格分支（避免绕过）', () => {
    const mw = validateTargetIdByType('targetId');
    const req = { params: { targetId: '北京' } };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expectRejected(res, next, 400, 'targetId 格式非法');
  });

  it('targetId 缺失时返回 400（即使 type 合法）', () => {
    const mw = validateTargetIdByType('targetId');
    const req = { params: { type: 'cities' } };
    const res = mockRes();
    const next = vi.fn();

    mw(req, res, next);

    expectRejected(res, next, 400, '缺少参数: targetId');
  });
});

describe('validateCommentPayload —— 评论内容与父评论', () => {
  it('合法评论应放行并 trim 内容', () => {
    const req = { body: { cityId: '北京', content: '  很好玩  ', parentId: 'c_1' } };
    const res = mockRes();
    const next = vi.fn();

    validateCommentPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.content).toBe('很好玩');
  });

  it('parentId 为 null / undefined 时不校验', () => {
    for (const parentId of [null, undefined]) {
      const req = { body: { cityId: '北京', content: 'ok', parentId } };
      const next = vi.fn();
      validateCommentPayload(req, mockRes(), next);
      expect(next).toHaveBeenCalledTimes(1);
    }
  });

  it('cityId 缺失 / 非字符串 / 非法字符均返回 400', () => {
    const cases = [
      [{ content: 'ok' }, '城市ID不能为空'],
      [{ cityId: 123, content: 'ok' }, '城市ID不能为空'],
      [{ cityId: '<script>', content: 'ok' }, 'cityId 格式非法']
    ];
    for (const [body, msg] of cases) {
      const res = mockRes();
      const next = vi.fn();
      validateCommentPayload({ body }, res, next);
      expectRejected(res, next, 400, msg);
    }
  });

  it('content 缺失 / 纯空白 / 非字符串均返回 400', () => {
    const cases = [
      { cityId: '北京' },
      { cityId: '北京', content: '   ' },
      { cityId: '北京', content: 123 }
    ];
    for (const body of cases) {
      const res = mockRes();
      const next = vi.fn();
      validateCommentPayload({ body }, res, next);
      expectRejected(res, next, 400, '评论内容不能为空');
    }
  });

  it('content 恰好 2000 字符放行，2001 字符拒绝', () => {
    const okReq = { body: { cityId: '北京', content: '好'.repeat(2000) } };
    const okNext = vi.fn();
    validateCommentPayload(okReq, mockRes(), okNext);
    expect(okNext).toHaveBeenCalledTimes(1);

    const badReq = { body: { cityId: '北京', content: '好'.repeat(2001) } };
    const badRes = mockRes();
    const badNext = vi.fn();
    validateCommentPayload(badReq, badRes, badNext);
    expectRejected(badRes, badNext, 400, '评论内容过长（最多 2000 字符）');
  });

  it('parentId 非字符串或含非法字符应返回 400', () => {
    for (const parentId of [123, '北京', 'a/b', 'a'.repeat(65)]) {
      const req = { body: { cityId: '北京', content: 'ok', parentId } };
      const res = mockRes();
      const next = vi.fn();

      validateCommentPayload(req, res, next);

      expectRejected(res, next, 400, 'parentId 格式非法');
    }
  });

  it('body 缺失时返回 400（不抛 TypeError）', () => {
    const res = mockRes();
    const next = vi.fn();

    validateCommentPayload({}, res, next);

    expectRejected(res, next, 400, '城市ID不能为空');
  });
});

describe('validateTargetType —— 目标类型白名单', () => {
  it('cities / comments / guides 全部放行', () => {
    for (const type of ['cities', 'comments', 'guides']) {
      const res = mockRes();
      const next = vi.fn();
      validateTargetType({ params: { type } }, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    }
  });

  it('白名单外的类型返回 400', () => {
    for (const type of ['users', 'Cities', '', undefined]) {
      const res = mockRes();
      const next = vi.fn();
      validateTargetType({ params: { type } }, res, next);
      expectRejected(res, next, 400, '无效的目标类型');
    }
  });

  it('导出的 VALID_TARGET_TYPES 应与校验行为一致', () => {
    expect([...VALID_TARGET_TYPES].sort()).toEqual(['cities', 'comments', 'guides']);
  });
});

describe('validateIdToken —— JWT 三段式格式', () => {
  it('标准三段式 base64url 应放行', () => {
    const req = { body: { idToken: 'aaa-bb_1.ccc-dd_2.eee-ff_3' } };
    const res = mockRes();
    const next = vi.fn();

    validateIdToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('缺失 / 非字符串返回 400', () => {
    for (const body of [{}, { idToken: 123 }, { idToken: '' }]) {
      const res = mockRes();
      const next = vi.fn();
      validateIdToken({ body }, res, next);
      expectRejected(res, next, 400, '请提供Firebase ID Token');
    }
  });

  it('段数不为 3（2 段 / 4 段 / 空段）返回 400', () => {
    for (const idToken of ['aaa.bbb', 'a.b.c.d', 'a..c', '.b.c']) {
      const res = mockRes();
      const next = vi.fn();
      validateIdToken({ body: { idToken } }, res, next);
      expectRejected(res, next, 400, 'ID Token 格式非法');
    }
  });

  it('包含非 base64url 字符（+/=）返回 400', () => {
    const res = mockRes();
    const next = vi.fn();

    validateIdToken({ body: { idToken: 'aa+a.bb/b.cc==' } }, res, next);

    expectRejected(res, next, 400, 'ID Token 格式非法');
  });

  it('长度超过 8192 返回 400（先过格式再判长度）', () => {
    const idToken = `${'a'.repeat(4100)}.${'b'.repeat(4100)}.c`;
    expect(idToken.length).toBeGreaterThan(8192);

    const res = mockRes();
    const next = vi.fn();

    validateIdToken({ body: { idToken } }, res, next);

    expectRejected(res, next, 400, 'ID Token 过长');
  });

  it('body 缺失时返回 400', () => {
    const res = mockRes();
    const next = vi.fn();

    validateIdToken({}, res, next);

    expectRejected(res, next, 400, '请提供Firebase ID Token');
  });
});

describe('validateProfilePayload —— 资料字段白名单与长度', () => {
  it('合法 displayName + https photoURL 应保留，未知字段被剔除', () => {
    const req = {
      body: { displayName: '小明', photoURL: 'https://cdn.example.com/a.png', role: 'admin' }
    };
    const res = mockRes();
    const next = vi.fn();

    validateProfilePayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({
      displayName: '小明',
      photoURL: 'https://cdn.example.com/a.png'
    });
  });

  it('body 缺失时放行并归一化为空对象', () => {
    const req = {};
    const res = mockRes();
    const next = vi.fn();

    validateProfilePayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({});
  });

  it('displayName 恰好 50 字符放行，51 字符拒绝', () => {
    const okReq = { body: { displayName: '名'.repeat(50) } };
    const okNext = vi.fn();
    validateProfilePayload(okReq, mockRes(), okNext);
    expect(okNext).toHaveBeenCalledTimes(1);

    const badRes = mockRes();
    const badNext = vi.fn();
    validateProfilePayload({ body: { displayName: '名'.repeat(51) } }, badRes, badNext);
    expectRejected(badRes, badNext, 400, 'displayName 长度需 ≤ 50');
  });

  it('displayName 非字符串返回 400', () => {
    const res = mockRes();
    const next = vi.fn();

    validateProfilePayload({ body: { displayName: 123 } }, res, next);

    expectRejected(res, next, 400, 'displayName 长度需 ≤ 50');
  });

  it('photoURL 非 http(s) 协议返回 400', () => {
    for (const photoURL of ['ftp://x/a.png', 'javascript:alert(1)', '/relative/a.png']) {
      const res = mockRes();
      const next = vi.fn();
      validateProfilePayload({ body: { photoURL } }, res, next);
      expectRejected(res, next, 400, 'photoURL 必须以 http(s):// 开头');
    }
  });

  it('photoURL 超过 2048 字符返回 400', () => {
    const photoURL = 'https://x/' + 'a'.repeat(2049);
    const res = mockRes();
    const next = vi.fn();

    validateProfilePayload({ body: { photoURL } }, res, next);

    expectRejected(res, next, 400, 'photoURL 格式非法');
  });

  it('__proto__ / constructor / prototype 被静默剔除，不污染原型', () => {
    const body = JSON.parse(
      '{"displayName":"小明","__proto__":{"polluted":1},"constructor":"x","prototype":"y"}'
    );
    const req = { body };
    const res = mockRes();
    const next = vi.fn();

    validateProfilePayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ displayName: '小明' });
    expect({}.polluted).toBeUndefined();
  });
});

describe('validateCitiesArray —— 批量城市列表', () => {
  it('合法列表应放行并逐个 trim', () => {
    const req = { body: { cities: [' 成都 ', '重庆'] } };
    const res = mockRes();
    const next = vi.fn();

    validateCitiesArray(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.cities).toEqual(['成都', '重庆']);
  });

  it('非数组 / 空数组返回 400', () => {
    for (const cities of [undefined, null, '成都', []]) {
      const res = mockRes();
      const next = vi.fn();
      validateCitiesArray({ body: { cities } }, res, next);
      expectRejected(res, next, 400, '请提供城市列表');
    }
  });

  it('超过 5 个城市返回 400', () => {
    const res = mockRes();
    const next = vi.fn();

    validateCitiesArray({ body: { cities: ['a', 'b', 'c', 'd', 'e', 'f'] } }, res, next);

    expectRejected(res, next, 400, '单次最多生成5个城市的攻略');
  });

  it('数组元素非字符串 / 含非法字符 / 超 30 字符均返回 400', () => {
    for (const cities of [[123], ['<script>'], ['北'.repeat(31)]]) {
      const res = mockRes();
      const next = vi.fn();
      validateCitiesArray({ body: { cities } }, res, next);
      expectRejected(res, next, 400, '城市名称包含非法字符或过长');
    }
  });

  it('错误文案会截断超长输入，避免日志注入放大', () => {
    const res = mockRes();
    const next = vi.fn();

    validateCitiesArray({ body: { cities: ['<'.repeat(200)] } }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.body.error.length).toBeLessThan(60);
  });
});

describe('validateCityBody —— AI 接口 city 字段', () => {
  it('合法城市名应 trim 后回写', () => {
    const req = { body: { city: ' 成都 ' } };
    const res = mockRes();
    const next = vi.fn();

    validateCityBody(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.city).toBe('成都');
  });

  it('缺失 / 纯空白 / 非字符串返回 400', () => {
    for (const body of [{}, { city: '   ' }, { city: 123 }]) {
      const res = mockRes();
      const next = vi.fn();
      validateCityBody({ body }, res, next);
      expectRejected(res, next, 400, '请提供城市名称');
    }
  });

  it('31 字符或含非法字符返回 400', () => {
    for (const city of ['北'.repeat(31), '<img src=x>']) {
      const res = mockRes();
      const next = vi.fn();
      validateCityBody({ body: { city } }, res, next);
      expectRejected(res, next, 400, '城市名称包含非法字符或过长（最多 30 字符）');
    }
  });
});

describe('validatePagination —— 分页解析边界', () => {
  it('非数字字符串回退默认值', () => {
    const req = { query: { page: 'abc', limit: 'xyz' } };
    const res = mockRes();
    const next = vi.fn();

    validatePagination(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.pagination).toEqual({ page: 1, limit: 20 });
  });

  it('limit=100 放行（上界内）', () => {
    const req = { query: { page: '2', limit: '100' } };
    const res = mockRes();
    const next = vi.fn();

    validatePagination(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.pagination).toEqual({ page: 2, limit: 100 });
  });

  it('limit=0 被兜底为 20（0 为 falsy，记录现状）', () => {
    const req = { query: { limit: '0' } };
    const res = mockRes();
    const next = vi.fn();

    validatePagination(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.pagination.limit).toBe(20);
  });

  it('负数 limit 返回 400', () => {
    const res = mockRes();
    const next = vi.fn();

    validatePagination({ query: { limit: '-1' } }, res, next);

    expectRejected(res, next, 400, '分页参数无效');
  });
});

describe('rateLimiter —— 阈值 / 窗口 / 隔离 / 计数上限', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('未超限时放行，达到阈值后返回 429 并带 Retry-After', () => {
    const mw = rateLimiter(2, 60000, { bucket: 'rl-basic' });
    const ip = '203.0.113.1';

    for (let i = 0; i < 2; i++) {
      const next = vi.fn();
      mw({ ip }, mockRes(), next);
      expect(next).toHaveBeenCalledTimes(1);
    }

    const res = mockRes();
    const next = vi.fn();
    mw({ ip }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ success: false, error: '请求过于频繁，请稍后再试' });
    expect(Number(res.headers['Retry-After'])).toBe(60);
  });

  it('不同 IP 计数独立', () => {
    const mw = rateLimiter(1, 60000, { bucket: 'rl-ip' });

    const first = vi.fn();
    mw({ ip: '203.0.113.2' }, mockRes(), first);
    expect(first).toHaveBeenCalledTimes(1);

    const second = vi.fn();
    mw({ ip: '203.0.113.3' }, mockRes(), second);
    expect(second).toHaveBeenCalledTimes(1);

    const blocked = vi.fn();
    const res = mockRes();
    mw({ ip: '203.0.113.2' }, res, blocked);
    expect(blocked).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(429);
  });

  it('窗口过期后计数重置', () => {
    const nowSpy = vi.spyOn(Date, 'now');
    const mw = rateLimiter(1, 1000, { bucket: 'rl-window' });
    const ip = '203.0.113.4';

    nowSpy.mockReturnValue(1_000_000);
    const first = vi.fn();
    mw({ ip }, mockRes(), first);
    expect(first).toHaveBeenCalledTimes(1);

    // 窗口内第二次：拒绝
    nowSpy.mockReturnValue(1_000_500);
    const blocked = vi.fn();
    const blockedRes = mockRes();
    mw({ ip }, blockedRes, blocked);
    expect(blocked).not.toHaveBeenCalled();
    expect(blockedRes.statusCode).toBe(429);

    // 超过窗口：重置为 count=1，放行
    nowSpy.mockReturnValue(1_001_001);
    const again = vi.fn();
    mw({ ip }, mockRes(), again);
    expect(again).toHaveBeenCalledTimes(1);
  });

  it('bucket 隔离：不同 bucket 的同 IP 互不消耗额度', () => {
    const bucketA = rateLimiter(1, 60000, { bucket: 'rl-iso-a' });
    const bucketB = rateLimiter(1, 60000, { bucket: 'rl-iso-b' });
    const ip = '203.0.113.5';

    const a1 = vi.fn();
    bucketA({ ip }, mockRes(), a1);
    expect(a1).toHaveBeenCalledTimes(1);

    const a2 = vi.fn();
    const a2Res = mockRes();
    bucketA({ ip }, a2Res, a2);
    expect(a2).not.toHaveBeenCalled();
    expect(a2Res.statusCode).toBe(429);

    // 同 IP 在另一个 bucket 仍应放行
    const b1 = vi.fn();
    bucketB({ ip }, mockRes(), b1);
    expect(b1).toHaveBeenCalledTimes(1);
  });

  it('未指定 bucket 时共用默认存储（记录现状：全局限流会互相消耗）', () => {
    const limiterA = rateLimiter(1, 60000);
    const limiterB = rateLimiter(1, 60000);
    const ip = '203.0.113.6';

    const a1 = vi.fn();
    limiterA({ ip }, mockRes(), a1);
    expect(a1).toHaveBeenCalledTimes(1);

    const b1 = vi.fn();
    const b1Res = mockRes();
    limiterB({ ip }, b1Res, b1);
    expect(b1).not.toHaveBeenCalled();
    expect(b1Res.statusCode).toBe(429);
  });

  it('req.ip 缺失时回退 socket.remoteAddress', () => {
    const mw = rateLimiter(1, 60000, { bucket: 'rl-socket' });

    const first = vi.fn();
    mw({ socket: { remoteAddress: '198.51.100.7' } }, mockRes(), first);
    expect(first).toHaveBeenCalledTimes(1);

    const blocked = vi.fn();
    const res = mockRes();
    mw({ socket: { remoteAddress: '198.51.100.7' } }, res, blocked);
    expect(blocked).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(429);
  });

  it('计数条目超过 10000 时清理最旧一半（防 IPv6 攻击下内存爆炸）', () => {
    const nowSpy = vi.spyOn(Date, 'now');
    let tick = 1_000_000;
    nowSpy.mockImplementation(() => tick++);

    const mw = rateLimiter(1, 600000, { bucket: 'rl-overflow' });
    const oldestIp = '198.51.100.0';

    // 先占用 oldestIp 的唯一一次额度
    const first = vi.fn();
    mw({ ip: oldestIp }, mockRes(), first);
    expect(first).toHaveBeenCalledTimes(1);

    // 再灌入 10001 个不同 IP，使 store.size 超过上限
    for (let i = 0; i < 10001; i++) {
      const next = vi.fn();
      mw({ ip: `10.1.${Math.floor(i / 256)}.${i % 256}` }, mockRes(), next);
      expect(next).toHaveBeenCalledTimes(1);
    }

    // 下一次请求触发清理：最旧的 oldestIp 记录被删除 → 视为新请求放行
    const afterCleanup = vi.fn();
    mw({ ip: oldestIp }, mockRes(), afterCleanup);
    expect(afterCleanup).toHaveBeenCalledTimes(1);
  });
});

describe('errorHandler —— 错误类型映射 / 响应结构 / 日志脱敏', () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    vi.restoreAllMocks();
    // 恢复而非删除：vitest 依赖 NODE_ENV=test，删除会污染同进程内其它测试文件
    if (ORIGINAL_NODE_ENV === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  /** 调用 errorHandler 并返回 {res, logEntry} */
  function runError(err) {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = mockRes();
    const next = vi.fn();

    errorHandler(err, { path: '/api/test', method: 'POST', ip: '127.0.0.1' }, res, next);

    const logArg = errorSpy.mock.calls[0][1];
    return { res, logEntry: JSON.parse(logArg) };
  }

  it('普通 Error 返回 500 与通用文案，且不泄漏堆栈', () => {
    const err = new Error('数据库密码错误 password=123456');
    err.stack = 'Error: secret stack at /srv/app/secret.js:10';

    const { res } = runError(err);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: '服务器内部错误',
      details: undefined
    });
    expect(JSON.stringify(res.body)).not.toContain('secret.js');
    expect(JSON.stringify(res.body)).not.toContain('password');
  });

  it('ValidationError 映射为 400 并透出错误信息', () => {
    const err = new Error('城市名称非法');
    err.name = 'ValidationError';

    const { res } = runError(err);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('城市名称非法');
  });

  it('ValidationError 无 message 时使用默认文案', () => {
    const err = new Error('');
    err.name = 'ValidationError';

    const { res } = runError(err);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('请求参数无效');
  });

  it('UnauthorizedError 映射为 401', () => {
    const err = new Error('token bad');
    err.name = 'UnauthorizedError';

    const { res } = runError(err);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('认证失败');
  });

  it('ENOTFOUND / ECONNREFUSED 映射为 503', () => {
    for (const code of ['ENOTFOUND', 'ECONNREFUSED']) {
      const err = new Error('dns fail');
      err.code = code;

      const { res } = runError(err);

      expect(res.statusCode).toBe(503);
      expect(res.body.error).toBe('上游服务不可用');
    }
  });

  it('CORS 拒绝信息映射为 403', () => {
    const err = new Error('Not allowed by CORS');

    const { res } = runError(err);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('跨源请求被拒绝');
  });

  it('开发环境附带 details，生产/测试环境不附带', () => {
    process.env.NODE_ENV = 'development';
    const dev = runError(new Error('boom'));
    expect(dev.res.body.details).toBe('boom');

    process.env.NODE_ENV = 'production';
    const prod = runError(new Error('boom'));
    expect(prod.res.body.details).toBeUndefined();
  });

  it('日志只含白名单字段，不含 stack / body / 用户内容', () => {
    const err = new Error('boom');
    err.stack = 'SECRET_STACK';
    err.body = { password: 'p@ss' };

    const { logEntry } = runError(err);

    // 普通 Error 无 code，JSON 序列化后该字段被省略
    expect(Object.keys(logEntry).sort()).toEqual(
      ['ip', 'method', 'msg', 'name', 'path'].sort()
    );
    expect(JSON.stringify(logEntry)).not.toContain('SECRET_STACK');
    expect(JSON.stringify(logEntry)).not.toContain('p@ss');
  });

  it('非 Error 值（字符串/undefined）也能安全处理并返回 500', () => {
    for (const err of ['string error', undefined, null]) {
      const { res } = runError(err);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('服务器内部错误');
    }
  });
});
