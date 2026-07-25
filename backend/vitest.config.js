import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试文件命名约定：*.test.js 或 *.spec.js
    include: ['tests/**/*.test.js', 'tests/**/*.spec.js'],
    // 排除 e2e 测试（如有）
    exclude: ['tests/e2e/**', 'node_modules/**'],
    // 测试环境：node（不依赖 DOM）
    environment: 'node',
    // 超时：单测 5s，AI 集成测试 30s
    testTimeout: 5000,
    // 全局设置文件（mock dotenv、避免环境变量污染）
    setupFiles: ['tests/setup.js'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov'],
      include: [
        'utils/**/*.js',
        'services/lruCache.js',
        'services/aiProviders.js',
        // v10.9.1 新增：authService 纳入覆盖率统计（含 Firebase 降级路径）
        'services/authService.js'
      ],
      exclude: ['node_modules/**', 'tests/**']
    }
  }
});
