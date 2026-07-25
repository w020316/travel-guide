/**
 * 轻量级 LRU 缓存实现（无外部依赖）
 * 用于修复 P1：aiService / weatherSync / socialService 的 Map 无上限内存泄漏问题
 *
 * 特性：
 * - 最大条目数限制，超出时淘汰最久未访问
 * - 可选 TTL 自动过期
 * - get 时刷新访问顺序
 * - 提供 size / clear / has / delete 等标准 Map 接口子集
 */
class LRUCache {
  /**
   * @param {Object} options
   * @param {number} options.max - 最大条目数（必填）
   * @param {number} [options.ttl] - 过期时间（毫秒），0 表示永不过期
   */
  constructor({ max, ttl = 0 }) {
    if (!max || max <= 0) throw new Error('LRUCache: max 必须为正整数');
    this.max = max;
    this.ttl = ttl;
    this.cache = new Map();
  }

  /**
   * 读取缓存，命中时刷新访问顺序并检查 TTL
   * @returns {any} 命中返回值，未命中或已过期返回 undefined
   */
  get(key) {
    if (!this.cache.has(key)) return undefined;
    const entry = this.cache.get(key);
    // TTL 检查
    if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    // 刷新访问顺序：删除后重新插入（Map 保持插入顺序）
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  /**
   * 写入缓存，超出 max 时淘汰最旧条目
   */
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.max) {
      // 淘汰最旧（Map 迭代器首位）
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  has(key) {
    if (!this.cache.has(key)) return false;
    const entry = this.cache.get(key);
    if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }

  /**
   * 清理所有过期条目（手动触发）
   * @returns {number} 清理的条目数
   */
  purgeExpired() {
    if (this.ttl <= 0) return 0;
    let purged = 0;
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        purged++;
      }
    }
    return purged;
  }

  /**
   * 导出所有 keys（用于统计/调试，慎用 — 可能泄露信息）
   * 注意：返回的是当前快照数组，不进行 TTL 过滤
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * 导出所有 values（用于遍历场景，如 Array.from(map.values())）
   * 注意：会触发 TTL 过期检查
   */
  values() {
    const result = [];
    for (const key of Array.from(this.cache.keys())) {
      const value = this.get(key);
      if (value !== undefined) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * 导出所有 [key, value] 对（用于遍历场景，如 Array.from(map.entries())）
   * 注意：会触发 TTL 过期检查
   */
  entries() {
    const result = [];
    for (const key of Array.from(this.cache.keys())) {
      const value = this.get(key);
      if (value !== undefined) {
        result.push([key, value]);
      }
    }
    return result;
  }

  /**
   * 兼容 for...of 迭代（Map 语义）
   */
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}

module.exports = LRUCache;
