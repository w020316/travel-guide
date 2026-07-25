/**
 * 测试环境全局 setup
 * - 加载 dotenv（避免因缺失环境变量导致模块初始化失败）
 * - 抑制 console.log（保留 console.error/warn 用于调试）
 */
require('dotenv').config({ silent: true });

// 测试中抑制大量 console.log（保留 error/warn）
const originalLog = console.log;
console.log = (...args) => {
  // 仅在 DEBUG 测试模式下打印
  if (process.env.TEST_DEBUG === '1') {
    originalLog(...args);
  }
};

// 全局 teardown：所有测试完成后恢复 console
process.on('exit', () => {
  console.log = originalLog;
});
