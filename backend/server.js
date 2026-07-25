const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const storage = require('./services/storage');
const socialService = require('./services/socialService');
const { startWeatherSync } = require('./services/weatherSync');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全修复 P0-2：信任反代，使 req.ip 与限流在 Render/Nginx/Cloudflare 后正确工作
// 单层反代用 1，多层用具体数量或 'loopback, linklocal, uniquelocal'
app.set('trust proxy', process.env.TRUST_PROXY_HOPS ? Number(process.env.TRUST_PROXY_HOPS) : 1);

// 安全中间件
app.use(helmet({
  // 修复 P1-2：启用 CSP（允许同源 + 已知外部资源）
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://html2canvas.hertzen.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS配置（v10.9.3 修复 P0-2：生产环境未配置 CORS_ORIGIN 时拒绝所有跨源请求，避免凭证泄露）
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const isProd = process.env.NODE_ENV === 'production';
if (isProd && allowedOrigins.length === 0) {
  console.error('❌ 生产环境必须显式配置 CORS_ORIGIN 白名单，当前未配置 → 拒绝所有跨源请求');
}
app.use(cors({
  origin: (origin, cb) => {
    // 允许无 origin 的请求（服务端调用、Postman、同源浏览器请求）
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0) {
      // v10.9.3：未配置时，开发环境允许所有，生产环境拒绝所有跨源
      if (isProd) {
        return cb(new Error('Not allowed by CORS (production requires explicit whitelist)'));
      }
      return cb(null, true);
    }
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// 请求解析（v10.9.3 修复 P2-6：限制 body 大小为 1mb，避免大 body DoS）
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 日志中间件
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// 启动天气定时同步服务
startWeatherSync(10);

// API路由
app.use('/api', require('./routes/api'));

// 托管前端静态资源（统一部署：后端同时提供 API 与前端页面）
// 修复 P0 安全漏洞：原代码暴露整个项目根目录（含 .env、backend/、node_modules/）
const frontendRoot = path.join(__dirname, '..');

// 安全防护：禁止访问敏感路径（放行前端所需的 data/expandedCities.js）
app.use((req, res, next) => {
  const sensitivePaths = ['/backend', '/node_modules', '/.env', '/.git', '/.trae', '/package.json', '/package-lock.json', '/render.yaml'];
  // /data 目录只允许访问 expandedCities.js（前端城市数据库）
  if (req.path === '/data' || req.path.startsWith('/data/')) {
    if (req.path !== '/data/expandedCities.js') {
      return res.status(403).json({ success: false, error: '访问被禁止' });
    }
    return next();
  }
  if (sensitivePaths.some(p => req.path === p || req.path.startsWith(p + '/'))) {
    return res.status(403).json({ success: false, error: '访问被禁止' });
  }
  next();
});

app.use(express.static(frontendRoot, {
  index: 'index.html',
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
  // 限制可访问的扩展名
  setHeaders: (res, filePath) => {
    // 阻止 .env、.js（非前端）等敏感文件被直接访问
    if (/\.(env|md|log|txt)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// 健康检查接口（修复 P1-7：生产环境仅返回最小化状态，避免暴露服务配置指纹）
app.get('/health', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const base = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
  if (isProd) {
    // 生产环境：仅返回基础状态，详细状态需通过认证接口访问
    return res.json(base);
  }
  res.json({
    ...base,
    cityCount: storage.getCityCount ? storage.getCityCount() : 0,
    services: {
      storage: 'active',
      ai: process.env.AGNES_API_KEY || process.env.TONGYI_API_KEY || process.env.WENXIN_API_KEY || process.env.OPENAI_API_KEY ? 'configured' : 'local-mode',
      auth: process.env.FIREBASE_API_KEY ? 'configured' : 'local-mode',
      social: socialService.getStats().mode
    }
  });
});

// 根路径 - 返回前端首页（API 信息可通过 /health 与 /api 查看）
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

// API 元信息接口
app.get('/api-info', (req, res) => {
  res.json({
    name: '旅游攻略生成器 API',
    version: '2.0.0',
    description: '企业级旅游攻略生成服务',
    endpoints: {
      cities: '/api/cities',
      ai: '/api/ai/generate',
      auth: '/api/auth/login',
      comments: '/api/comments',
      likes: '/api/likes',
      trending: '/api/trending',
      health: '/health'
    },
    documentation: 'https://github.com/w020316/travel-guide'
  });
});

// 错误处理中间件顺序修复：业务路由 → 404 → errorHandler
// 404处理（必须在 errorHandler 之前）
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.path
  });
});

// 错误处理中间件（最后注册）
const { errorHandler } = require('./middleware/validation');
app.use(errorHandler);

// 初始化并启动服务器
let httpServer;
async function initializeServer() {
  try {
    console.log('🚀 正在初始化服务器...');

    // 初始化存储服务
    await storage.initialize(mongoose);
    console.log('✅ 存储服务初始化完成');

    // 初始化社交服务
    await socialService.initialize();
    console.log('✅ 社交服务初始化完成');

    // 启动服务器（保存实例用于优雅关闭）
    httpServer = app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('  旅游攻略生成器 API 服务已启动');
      console.log('═══════════════════════════════════════');
      console.log(`  端口: ${PORT}`);
      console.log(`  环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  城市数据: ${storage.getCityCount ? storage.getCityCount() : 0} 个`);
      console.log(`  AI服务: ${process.env.AGNES_API_KEY || process.env.TONGYI_API_KEY || process.env.WENXIN_API_KEY || process.env.OPENAI_API_KEY ? '已配置' : '本地模式'}`);
      console.log(`  认证服务: ${process.env.FIREBASE_API_KEY ? '已配置' : '本地模式'}`);
      console.log(`  社交服务: ${socialService.getStats().mode}`);
      console.log('───────────────────────────────────────');
      console.log(`  测试接口: http://localhost:${PORT}/health`);
      console.log(`  API文档: http://localhost:${PORT}/`);
      console.log('═══════════════════════════════════════');
      console.log('');
    });

  } catch (error) {
    console.error('❌ 服务器初始化失败:', error);
    process.exit(1);
  }
}

// 优雅关闭（修复：先关闭 HTTP 服务器让现有请求完成，再关闭数据库）
function gracefulShutdown(signal) {
  console.log(`收到${signal}信号，正在优雅关闭服务器...`);
  if (httpServer) {
    httpServer.close(() => {
      console.log('HTTP 服务器已关闭');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB 连接已关闭');
        process.exit(0);
      }).catch(err => {
        console.error('关闭 MongoDB 连接失败:', err);
        process.exit(1);
      });
    });
    // 5秒超时强制退出
    setTimeout(() => {
      console.error('优雅关闭超时，强制退出');
      process.exit(1);
    }, 5000);
  } else {
    process.exit(0);
  }
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  // 修复 P1-10：记录后退出，避免进程进入不确定状态；由 PM2 自动重启
  console.error('[unhandledRejection]', reason instanceof Error ? reason.message : String(reason));
  process.exit(1);
});

initializeServer();

module.exports = app;