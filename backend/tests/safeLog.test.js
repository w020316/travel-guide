/**
 * safeLog 工具单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sanitizeError, logError, logWarn } from '../utils/safeLog';

describe('safeLog', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sanitizeError', () => {
    it('应从 Error 对象提取 message / name / code', () => {
      const err = new Error('test message');
      err.name = 'ValidationError';
      err.code = 'ECONNREFUSED';
      const safe = sanitizeError(err);
      expect(safe.msg).toBe('test message');
      expect(safe.name).toBe('ValidationError');
      expect(safe.code).toBe('ECONNREFUSED');
    });

    it('对字符串输入应转为 msg 字段', () => {
      const safe = sanitizeError('plain string');
      expect(safe.msg).toBe('plain string');
    });

    it('对 null/undefined 应返回 msg 字段', () => {
      expect(sanitizeError(null).msg).toBe('null');
      expect(sanitizeError(undefined).msg).toBe('undefined');
    });

    it('应附加 context 字段', () => {
      const err = new Error('x');
      const safe = sanitizeError(err, { path: '/api/test', method: 'POST', userId: 'u123' });
      expect(safe.path).toBe('/api/test');
      expect(safe.method).toBe('POST');
      expect(safe.userId).toBe('u123');
    });

    it('生产环境不应包含 stack', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const err = new Error('x');
      err.stack = 'sensitive stack trace';
      const safe = sanitizeError(err);
      expect(safe.stack).toBeUndefined();
      process.env.NODE_ENV = originalEnv;
    });

    it('开发环境应包含 stack', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const err = new Error('x');
      err.stack = 'debug stack trace';
      const safe = sanitizeError(err);
      expect(safe.stack).toBe('debug stack trace');
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logError', () => {
    it('应调用 console.error 并输出 JSON 格式', () => {
      const err = new Error('test');
      logError('AuthService', err, { path: '/login' });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0];
      expect(output[0]).toBe('[AuthService]');
      expect(output[1]).toContain('"msg":"test"');
      expect(output[1]).toContain('"path":"/login"');
    });
  });

  describe('logWarn', () => {
    it('应调用 console.warn 并输出 JSON 格式', () => {
      logWarn('Storage', 'cache miss', { city: '成都' });
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0];
      expect(output[0]).toBe('[Storage]');
      expect(output[1]).toContain('"msg":"cache miss"');
      expect(output[1]).toContain('"city":"成都"');
    });
  });
});
