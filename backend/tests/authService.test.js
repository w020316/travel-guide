/**
 * AuthService 单元测试
 *
 * 覆盖范围：
 * - v10.9.1 修复的 Firebase 未配置降级路径（auth === null）
 * - JWT 中间件 verifyCustomToken / optionalAuth / requireAdmin
 * - createTestToken 的生产环境安全防御
 * - 构造函数对 JWT_SECRET 的处理
 *
 * 实现说明：
 * - 测试环境默认不配置 FIREBASE_API_KEY，模块加载后 auth === null
 *   这恰好覆盖 v10.9.1 修复的降级场景，无需 mock firebase
 * - JWT 中间件测试使用 createTestToken 生成的真实 token（开发环境可用）
 * - authService 是单例，jwtSecret 在构造时固定，测试间共享实例
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import authService from '../services/authService';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  // 保存并恢复环境变量，避免测试间污染
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // 确保测试环境为开发模式（createTestToken 可用）
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    // 恢复环境变量
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  describe('v10.9.1 降级模式（Firebase 未配置）', () => {
    // 测试环境默认未配置 FIREBASE_API_KEY，auth 应为 null
    // 这是 v10.9.1 修复的核心场景：进程不崩溃，方法返回明确错误

    it('verifyAndCreateToken 应抛出「无效的认证令牌」（内部脱敏后对外消息）', async () => {
      // v10.9.1 修复：auth === null 时抛 "认证服务未配置（FIREBASE_API_KEY 缺失）"
      // authService 内部 try/catch 捕获后对外脱敏为 "无效的认证令牌"（安全设计）
      // 这里验证对外消息，内部原始错误已通过 logError 记录
      await expect(authService.verifyAndCreateToken('any-id-token'))
        .rejects.toThrow('无效的认证令牌');
    });

    it('getUserInfo 应 reject「认证服务未配置」错误', async () => {
      await expect(authService.getUserInfo('uid-123'))
        .rejects.toThrow('认证服务未配置（FIREBASE_API_KEY 缺失）');
    });

    it('updateProfile 应抛出「认证服务未配置」错误', async () => {
      await expect(authService.updateProfile('uid-123', { displayName: 'test' }))
        .rejects.toThrow('认证服务未配置（FIREBASE_API_KEY 缺失）');
    });

    it('进程未崩溃：authService 实例方法可正常调用（返回错误而非 throw 同步异常）', () => {
      // 验证修复后进程持续在线的关键：方法是 function（可调用）
      // 不实际调用方法体，避免产生 unhandled rejection
      expect(typeof authService.verifyAndCreateToken).toBe('function');
      expect(typeof authService.getUserInfo).toBe('function');
      expect(typeof authService.updateProfile).toBe('function');
      // 上面的 rejects.toThrow 测试已验证调用后返回 rejected Promise（而非同步抛错）
    });
  });

  describe('verifyCustomToken 中间件', () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
      };
      next = vi.fn();
    });

    it('无 Authorization header 应返回 401「未提供认证令牌」', () => {
      authService.verifyCustomToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: '未提供认证令牌'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('Authorization 非 Bearer 前缀应返回 401', () => {
      req.headers.authorization = 'Basic abc123';
      authService.verifyCustomToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('无效 token 应返回 401「无效的认证令牌」', () => {
      req.headers.authorization = 'Bearer invalid.token.here';
      authService.verifyCustomToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: '无效的认证令牌'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('有效 token 应调用 next 并设置 req.user', () => {
      const token = authService.createTestToken({
        uid: 'user-1',
        email: 'test@example.com',
        role: 'user'
      });
      req.headers.authorization = `Bearer ${token}`;

      authService.verifyCustomToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.uid).toBe('user-1');
      expect(req.user.email).toBe('test@example.com');
      expect(res.status).not.toHaveBeenCalled();
    });

    it('过期 token 应返回 401「认证令牌已过期」', () => {
      // 使用 jwt 直接生成已过期的 token（exp 设为过去时间）
      const expiredToken = jwt.sign(
        { uid: 'expired-user', iat: Math.floor(Date.now() / 1000) - 100 },
        authService.jwtSecret,
        { expiresIn: '1s' }
      );
      // 等待 1.1s 确保过期
      // 注意：此测试会增加约 1.2s，但覆盖过期路径值得
      return new Promise(resolve => {
        setTimeout(() => {
          req.headers.authorization = `Bearer ${expiredToken}`;
          authService.verifyCustomToken(req, res, next);
          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: '认证令牌已过期，请重新登录'
          }));
          expect(next).not.toHaveBeenCalled();
          resolve();
        }, 1100);
      });
    });
  });

  describe('optionalAuth 中间件', () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
      next = vi.fn();
    });

    it('无 Authorization header 应设置 req.user=null 并调用 next', () => {
      authService.optionalAuth(req, res, next);
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('有效 token 应设置 req.user 并调用 next', () => {
      const token = authService.createTestToken({ uid: 'opt-user', role: 'user' });
      req.headers.authorization = `Bearer ${token}`;

      authService.optionalAuth(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.uid).toBe('opt-user');
      expect(next).toHaveBeenCalled();
    });

    it('无效 token 应设置 req.user=null 并调用 next（不阻塞请求）', () => {
      req.headers.authorization = 'Bearer invalid.token';
      authService.optionalAuth(req, res, next);
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAdmin 中间件', () => {
    let req, res, next;

    beforeEach(() => {
      req = {};
      res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
      next = vi.fn();
    });

    it('req.user 不存在应返回 403「需要管理员权限」', () => {
      authService.requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: '需要管理员权限'
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('req.user.role 非 admin 应返回 403', () => {
      req.user = { uid: 'u1', role: 'user' };
      authService.requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('req.user.role 为 admin 应调用 next', () => {
      req.user = { uid: 'admin-1', role: 'admin' };
      authService.requireAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('createTestToken', () => {
    it('开发环境应成功生成 JWT token', () => {
      process.env.NODE_ENV = 'development';
      const token = authService.createTestToken({ uid: 't1', email: 't@e.com' });
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT 三段式

      // 解码验证内容
      const decoded = jwt.verify(token, authService.jwtSecret);
      expect(decoded.uid).toBe('t1');
      expect(decoded.email).toBe('t@e.com');
    });

    it('生产环境应抛错「测试 token 在生产环境被禁用」', () => {
      process.env.NODE_ENV = 'production';
      expect(() => authService.createTestToken({ uid: 't1' }))
        .toThrow('测试 token 在生产环境被禁用');
    });
  });

  describe('构造函数 JWT_SECRET 处理', () => {
    // authService 单例在模块加载时已构造，jwtSecret 已固定
    // 这里验证构造后的状态而非重新构造

    it('jwtSecret 应已设置（非空字符串）', () => {
      expect(authService.jwtSecret).toBeDefined();
      expect(typeof authService.jwtSecret).toBe('string');
      expect(authService.jwtSecret.length).toBeGreaterThanOrEqual(32);
    });

    it('tokenExpiry 应有默认值 7d', () => {
      expect(authService.tokenExpiry).toBe('7d');
    });
  });

  describe('JWT token 完整性', () => {
    it('createTestToken 生成的 token 应可被 verifyCustomToken 验证', () => {
      // 端到端：生成 → 验证
      const token = authService.createTestToken({
        uid: 'e2e-user',
        email: 'e2e@test.com',
        role: 'admin',
        name: 'E2E测试用户'
      });

      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      authService.verifyCustomToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.uid).toBe('e2e-user');
      expect(req.user.role).toBe('admin');
      expect(req.user.name).toBe('E2E测试用户');
    });

    it('token 应包含 iat 与 exp 声明', () => {
      const token = authService.createTestToken({ uid: 'claims-test' });
      const decoded = jwt.verify(token, authService.jwtSecret);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });
});
