/**
 * 测试环境全局 setup
 * - 加载 dotenv（避免因缺失环境变量导致模块初始化失败）
 * - 抑制 console.log（保留 console.error/warn 用于调试）
 */
require('dotenv').config({ silent: true });

// 固定 AI 时间控制层的测试默认值（v11.1）：
// .env 里的部署配置（如 AI_TOTAL_BUDGET_MS=60000）会覆盖断言默认行为的用例
// （「超时统一 8000ms」「预算约束 9s」），dotenv 又不覆盖已存在的进程环境变量，
// 故在此显式 pin；需要测试覆盖行为的用例可在用例内自行改写并恢复。
process.env.AI_TOTAL_BUDGET_MS = '9000';
process.env.AI_PROVIDER_TIMEOUT_MS = '8000';

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
