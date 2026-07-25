/**
 * 行纪 MCP (Model Context Protocol) Server
 *
 * v10.8 新增：让 AI 助手（如 Claude）能够通过 MCP 调用行纪的核心能力
 *
 * 协议规范：https://spec.modelcontextprotocol.io/
 * 传输方式：JSON-RPC 2.0 over stdio（newline-delimited）
 *
 * 暴露的工具（tools）：
 *   1. generate_travel_guide - AI 生成城市旅游攻略
 *   2. get_city_info         - 获取城市基础数据（含景点/美食/住宿）
 *   3. search_cities         - 关键字搜索城市
 *   4. get_city_weather      - 获取城市实时天气与预报
 *
 * 启动方式：
 *   node backend/mcp/server.js
 *
 * Claude Desktop / Cline 等客户端配置示例（claude_desktop_config.json）：
 *   {
 *     "mcpServers": {
 *       "travel-guide": {
 *         "command": "node",
 *         "args": ["D:/xm/wz/travel-guide/backend/mcp/server.js"]
 *       }
 *     }
 *   }
 *
 * 设计目标：
 * - 零新依赖（纯 Node.js 内置模块 + 既有 backend 服务）
 * - 完整 MCP lifecycle：initialize → initialized → tools/list → tools/call
 * - 错误处理：tool 执行失败时返回标准 JSON-RPC error，不崩溃进程
 * - 输入校验：所有工具均校验必填参数，缺失时返回 -32602 invalid params
 */
'use strict';

const readline = require('readline');
const path = require('path');

// 引入既有 backend 服务（共享业务逻辑，避免重复实现）
const aiService = require('../services/aiService');
const storage = require('../services/storage');
const weatherSync = require('../services/weatherSync');

// MCP 协议版本（2024-11-05 是当前 stable）
const PROTOCOL_VERSION = '2024-11-05';
const SERVER_NAME = 'travel-guide';
const SERVER_VERSION = '1.0.0';

// ==================== 工具定义 ====================

const TOOLS = [
  {
    name: 'generate_travel_guide',
    description: '为指定中国城市生成 AI 定制旅游攻略，包含每日路线、特色美食、住宿建议、交通、预算、避坑提示、海报配置等。支持出发地、出行人数、旅行天数、预算偏好等参数。生成结果会缓存 30 分钟。',
    inputSchema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: '中国城市名（中文），例如：成都、杭州、丽江。最多 30 个字符，禁止 HTML/JS 注入。'
        },
        days: {
          type: 'integer',
          description: '旅行天数，1-7 之间，默认 3。',
          minimum: 1,
          maximum: 7,
          default: 3
        },
        origin: {
          type: 'string',
          description: '出发城市（可选），用于计算外部交通。例如：广州。'
        },
        travelers: {
          type: 'string',
          description: '出行人数（字符串形式），默认 "2"。影响预算分摊系数（2-3 人 ×0.92，4+ 人 ×0.85）。',
          default: '2'
        },
        travelType: {
          type: 'string',
          description: '旅行类型（可选）：foodie / culture / nature / family 等。',
          enum: ['foodie', 'culture', 'nature', 'family', 'photography', 'budget']
        },
        budgetRange: {
          type: 'string',
          description: '预算偏好（可选）：low / medium / high。',
          enum: ['low', 'medium', 'high']
        }
      },
      required: ['city']
    }
  },
  {
    name: 'get_city_info',
    description: '获取城市基础数据（来自 527 城扩展数据库），包含标签、季节、氛围、行程路线、美食、住宿、交通、预算、提示等完整结构。',
    inputSchema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: '中国城市名（中文），例如：北京。'
        }
      },
      required: ['city']
    }
  },
  {
    name: 'search_cities',
    description: '按关键字搜索城市（匹配城市名/标签/季节/氛围）。返回匹配的城市列表。',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: '搜索关键字，例如：海滩、古城、美食。'
        }
      },
      required: ['keyword']
    }
  },
  {
    name: 'get_city_weather',
    description: '获取城市实时天气与 3 天预报（含温度、湿度、风力、能见度、气压）。优先返回和风天气 API 真实数据，失败时回退到模拟数据。10 分钟缓存。',
    inputSchema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: '中国城市名（中文），例如：上海。'
        }
      },
      required: ['city']
    }
  }
];

// ==================== 工具执行器 ====================

// 城市名校验：与 backend/middleware/validation.js 保持一致（防 XSS）
const CITY_NAME_REGEX = /^[一-龥a-zA-Z0-9·\-\s]{1,30}$/;

function validateCityName(city) {
  if (typeof city !== 'string' || !CITY_NAME_REGEX.test(city)) {
    throw new Error(`城市名格式无效：${city}（仅允许中文/英文/数字/连字符，1-30 字符）`);
  }
}

const TOOL_HANDLERS = {
  async generate_travel_guide(args) {
    validateCityName(args.city);

    // 与前端约束一致：天数限制 1-7
    const days = Math.min(Math.max(parseInt(args.days) || 3, 1), 7);
    const preferences = {
      days,
      origin: args.origin || '',
      travelers: args.travelers || '2',
      travelType: args.travelType || '',
      budgetRange: args.budgetRange || ''
    };

    const guide = await aiService.generateTravelGuide(args.city, preferences);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(guide, null, 2)
      }],
      // 提示调用方该结果来自缓存还是新生成
      _meta: {
        source: guide.source || 'ai',
        provider: guide.provider || 'unknown',
        cached: false
      }
    };
  },

  async get_city_info(args) {
    validateCityName(args.city);
    const city = await storage.getCity(args.city);
    if (!city) {
      return {
        content: [{
          type: 'text',
          text: `未找到城市「${args.city}」的数据。可调用 search_cities 工具查询支持的城市列表。`
        }],
        isError: true
      };
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(city, null, 2)
      }]
    };
  },

  async search_cities(args) {
    if (typeof args.keyword !== 'string' || args.keyword.trim().length === 0) {
      throw new Error('keyword 不能为空');
    }
    if (args.keyword.length > 50) {
      throw new Error('keyword 过长（最多 50 字符）');
    }
    const results = await storage.searchCities(args.keyword);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          keyword: args.keyword,
          total: results.length,
          cities: results.map(c => ({
            name: c.name,
            tags: c.tags || [],
            season: c.season || '',
            atmosphere: c.atmosphere || ''
          }))
        }, null, 2)
      }]
    };
  },

  async get_city_weather(args) {
    validateCityName(args.city);
    const weather = await weatherSync.getCityWeather(args.city);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(weather, null, 2)
      }]
    };
  }
};

// ==================== JSON-RPC 处理 ====================

function makeResponse(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function makeError(id, code, message, data) {
  const err = { code, message };
  if (data !== undefined) err.data = data;
  return { jsonrpc: '2.0', id, error: err };
}

// JSON-RPC 标准错误码
const ERRORS = {
  PARSE_ERROR: { code: -32700, message: 'Parse error' },
  INVALID_REQUEST: { code: -32600, message: 'Invalid Request' },
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found' },
  INVALID_PARAMS: { code: -32602, message: 'Invalid params' },
  INTERNAL_ERROR: { code: -32603, message: 'Internal error' }
};

let initialized = false;

async function handleRequest(message) {
  const { id, method, params } = message;

  switch (method) {
    case 'initialize': {
      return makeResponse(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          // 行纪 MCP 暂不实现 resources/prompts，专注 tools
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      });
    }

    case 'notifications/initialized': {
      // 通知：客户端已完成 initialize 握手
      initialized = true;
      return null; // 通知不需要响应
    }

    case 'tools/list': {
      return makeResponse(id, { tools: TOOLS });
    }

    case 'tools/call': {
      if (!initialized) {
        return makeError(id, ERRORS.INVALID_REQUEST.code, 'Server not initialized');
      }
      const { name, arguments: args } = params || {};
      const handler = TOOL_HANDLERS[name];
      if (!handler) {
        return makeError(id, ERRORS.METHOD_NOT_FOUND.code, `Unknown tool: ${name}`);
      }
      try {
        const result = await handler(args || {});
        return makeResponse(id, result);
      } catch (err) {
        // 区分参数错误与内部错误
        const isParamError = err.message.includes('无效') || err.message.includes('不能为空') || err.message.includes('过长');
        if (isParamError) {
          return makeError(id, ERRORS.INVALID_PARAMS.code, err.message);
        }
        console.error(`[MCP] Tool ${name} execution failed:`, err);
        return makeError(id, ERRORS.INTERNAL_ERROR.code, err.message);
      }
    }

    case 'ping': {
      // MCP 健康检查
      return makeResponse(id, {});
    }

    default:
      return makeError(id, ERRORS.METHOD_NOT_FOUND.code, `Unknown method: ${method}`);
  }
}

// ==================== stdio 入口 ====================

async function main() {
  // 确保 storage 已初始化（使用内存存储模式，不依赖 MongoDB）
  try {
    await storage.initialize();
    console.error(`[MCP] storage initialized, ${storage.getCityCount()} cities loaded`);
  } catch (err) {
    console.error('[MCP] storage init failed:', err.message);
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, terminal: false });

  rl.on('line', async (line) => {
    if (!line.trim()) return;

    let message;
    try {
      message = JSON.parse(line);
    } catch (err) {
      // JSON 解析失败：返回 parse error（id 设为 null，因为无法识别）
      process.stdout.write(JSON.stringify(makeError(null, ERRORS.PARSE_ERROR.code, ERRORS.PARSE_ERROR.message)) + '\n');
      return;
    }

    // 批量请求支持（JSON-RPC 2.0 spec）
    if (Array.isArray(message)) {
      const responses = [];
      for (const item of message) {
        // P1 修复：每条请求独立 try/catch，单条失败不影响其他条
        try {
          const resp = await handleRequest(item);
          if (resp !== null) responses.push(resp);
        } catch (err) {
          const itemId = item && typeof item.id !== 'undefined' ? item.id : null;
          console.error('[MCP] Batch request item failed:', err && err.message ? err.message : String(err));
          responses.push(makeError(itemId, ERRORS.INTERNAL_ERROR.code, err && err.message ? err.message : 'Internal error'));
        }
      }
      if (responses.length > 0) {
        process.stdout.write(JSON.stringify(responses) + '\n');
      }
      return;
    }

    // 单请求
    try {
      const response = await handleRequest(message);
      if (response !== null) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      console.error('[MCP] Unexpected error:', err);
      const id = message && typeof message.id !== 'undefined' ? message.id : null;
      process.stdout.write(JSON.stringify(makeError(id, ERRORS.INTERNAL_ERROR.code, err.message)) + '\n');
    }
  });

  rl.on('close', () => {
    console.error('[MCP] stdin closed, exiting');
    process.exit(0);
  });

  console.error(`[MCP] ${SERVER_NAME} v${SERVER_VERSION} server started (protocol ${PROTOCOL_VERSION})`);
  console.error('[MCP] Waiting for JSON-RPC messages on stdin...');
}

// 启动并捕获未处理异常
main().catch(err => {
  console.error('[MCP] Fatal startup error:', err);
  process.exit(1);
});

// P0 修复：unhandledRejection 必须退出进程，与 server.js 行为一致
// 否则进程会继续运行于不确定状态（await 的 Promise 已 reject 但无人处理）
// 进程退出后由 MCP 客户端或 PM2 自动重启
process.on('unhandledRejection', (reason) => {
  console.error('[MCP] UnhandledRejection:', reason && reason.message ? reason.message : String(reason));
  process.exit(1);
});
