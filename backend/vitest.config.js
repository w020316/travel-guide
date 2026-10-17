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
        // v10.10 修复 P1-8：原口径仅含 5 个文件，导致核心模块完全未纳入统计 ——
        //   routes/api.js(833行)、middleware/validation.js(396行)、services/aiService.js(671行)、
        //   server.js、storage.js、weatherSync.js 全部缺失，41 个路由 0 单测。
        //   这正是「天气接口漏 await」「/weather/:city 参数名不匹配」长期漏网的根因。
        // 同时修正死配置：原 services/lruCache.js 路径不存在（真实文件在 utils/lruCache.js，
        //   已由 utils/**/*.js 覆盖），且 storage/weatherSync 有测试却不计入，等于白测。
        'server.js',
        'utils/**/*.js',
        'services/**/*.js',
        'middleware/**/*.js',
        'routes/**/*.js',
        // v11.4 修复 Q-7：补齐覆盖率口径缺口 —— models/（City.js）、data/（expandedCitiesLoader.js
        // 即 PERF-1/PERF-2 所在）、mcp/（mcp/server.js）此前完全未纳入统计，缺陷即便有测试也不计入。
        'models/**/*.js',
        'data/**/*.js',
        'mcp/**/*.js'
      ],
      exclude: ['node_modules/**', 'tests/**']
    }
  }
});
