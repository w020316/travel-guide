/**
 * 安全日志工具（v10.9 新增）
 *
 * 背景：项目中大量 `console.error('xxx失败:', error)` 直接打印整个 error 对象，
 * 可能泄露：req.body（含用户输入）、req.headers（含 authorization token）、
 * Firestore 错误的 request 字段（含 URL/payload）、stack trace（含部署路径）等。
 *
 * 设计：参考 middleware/validation.js errorHandler 的 safeLog 模式，统一抽取为工具函数。
 * 仅输出 message / name / code / path / method / ip，避免打印完整对象。
 */

/**
 * 将 error 对象脱敏为可安全打印的日志结构
 * @param {Error|unknown} err - 错误对象
 * @param {Object} [context] - 可选上下文（如 req 信息）
 * @param {string} [context.path] - 请求路径
 * @param {string} [context.method] - HTTP 方法
 * @param {string} [context.userId] - 用户 ID（已脱敏，uid 是公开标识）
 * @returns {Object} 脱敏后的日志对象
 */
function sanitizeError(err, context = {}) {
  const safe = {
    msg: err && err.message ? err.message : String(err),
    name: err && err.name,
    code: err && err.code
  };

  if (context.path) safe.path = context.path;
  if (context.method) safe.method = context.method;
  if (context.userId) safe.userId = context.userId;

  // 开发环境额外打印 stack，便于调试；生产环境不打印避免泄露部署路径
  if (process.env.NODE_ENV === 'development' && err && err.stack) {
    safe.stack = err.stack;
  }

  return safe;
}

/**
 * 安全打印 error 级别日志（脱敏后）
 * @param {string} tag - 日志标签，如 'AI生成失败'、'AuthService'
 * @param {Error|unknown} err - 错误对象
 * @param {Object} [context] - 上下文信息
 */
function logError(tag, err, context = {}) {
  const safe = sanitizeError(err, context);
  console.error(`[${tag}]`, JSON.stringify(safe));
}

/**
 * 安全打印 warn 级别日志
 * @param {string} tag - 日志标签
 * @param {string} message - 警告信息
 * @param {Object} [extra] - 额外字段
 */
function logWarn(tag, message, extra = {}) {
  const safe = { msg: message, ...extra };
  console.warn(`[${tag}]`, JSON.stringify(safe));
}

module.exports = {
  sanitizeError,
  logError,
  logWarn
};
