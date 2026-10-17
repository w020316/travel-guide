/**
 * SEC-3：管理员角色闭环（ADMIN_UIDS）单元测试（v11.4 新增）
 *
 * 背景：verifyAndCreateToken 原恒定写入 role:'user'，导致全站 requireAdmin 端点在生产
 * 永远 403（权限模型名存实亡）。v11.4 改为按环境变量 ADMIN_UIDS 判定角色。
 *
 * 通过 __setAuthForTest 注入假 firebase auth，验证「真实签发路径」产出的 role 归属，
 * 补上 Q-5③ 指出的缺口（原测试仅用 createTestToken 假造 admin token，制造假信心）。
 */
import { describe, it, expect, afterEach } from 'vitest';
import authService from '../services/authService';
import jwt from 'jsonwebtoken';

/** 构造一个可返回指定 uid 的假 firebase auth（仅实现 verifyIdToken） */
function fakeAuth(uid) {
  return {
    verifyIdToken: async () => ({
      uid,
      email: `${uid}@example.com`,
      email_verified: true,
      name: uid,
      picture: '',
      firebase: { sign_in_provider: 'custom' }
    })
  };
}

describe('SEC-3：ADMIN_UIDS 管理员角色闭环', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    // 复位内部 auth，避免污染本文件其它用例 / 其它断言
    authService.__setAuthForTest(null);
  });

  it('未配置 ADMIN_UIDS 时，签发 role 为 user', async () => {
    delete process.env.ADMIN_UIDS;
    authService.__setAuthForTest(fakeAuth('uid-plain'));

    const result = await authService.verifyAndCreateToken('id-token');
    const decoded = jwt.verify(result.token, authService.jwtSecret);
    expect(decoded.uid).toBe('uid-plain');
    expect(decoded.role).toBe('user');
  });

  it('ADMIN_UIDS 命中 uid 时，签发 role 为 admin', async () => {
    process.env.ADMIN_UIDS = 'uid-a, uid-b , uid-c';
    authService.__setAuthForTest(fakeAuth('uid-b'));

    const result = await authService.verifyAndCreateToken('id-token');
    const decoded = jwt.verify(result.token, authService.jwtSecret);
    expect(decoded.role).toBe('admin');
  });

  it('ADMIN_UIDS 未命中 uid 时，签发 role 仍为 user', async () => {
    process.env.ADMIN_UIDS = 'uid-a,uid-b';
    authService.__setAuthForTest(fakeAuth('uid-zzz'));

    const result = await authService.verifyAndCreateToken('id-token');
    const decoded = jwt.verify(result.token, authService.jwtSecret);
    expect(decoded.role).toBe('user');
  });

  it('Q-5③：生产签发路径不会凭空产出 admin —— 未在 ADMIN_UIDS 中的 uid 恒为 user', async () => {
    delete process.env.ADMIN_UIDS;
    authService.__setAuthForTest(fakeAuth('random-uid-not-admin'));

    const result = await authService.verifyAndCreateToken('id-token');
    const decoded = jwt.verify(result.token, authService.jwtSecret);
    expect(decoded.role).not.toBe('admin');
    expect(decoded.role).toBe('user');
  });

  it('_resolveRole 解析：空 ADMIN_UIDS / 逗号带空格 均正确处理', () => {
    delete process.env.ADMIN_UIDS;
    expect(authService._resolveRole('any')).toBe('user');

    process.env.ADMIN_UIDS = ' x , y ';
    expect(authService._resolveRole('x')).toBe('admin');
    expect(authService._resolveRole('y')).toBe('admin');
    expect(authService._resolveRole('z')).toBe('user');
  });
});
