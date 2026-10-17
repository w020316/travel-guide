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
// v11.2：CSP 指令必须与 index.html 的 meta CSP 保持一致 —— 浏览器对
// 响应头 CSP 与 meta CSP 取交集执行，只改一边会导致另一边被静默拦截
// （实测：meta 放行 map.qq.com 后 SDK 仍被 helmet 头的 CSP 拦截，报 csp）。
app.use(helmet({
  // 修复 P1-2：启用 CSP（允许同源 + 已知外部资源）
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // v11.2 高德 JS API 2.0 运行时需求：restapi.amap.com（日志/服务脚本）、
      // 'unsafe-eval'（引擎内部 eval）、worker-src blob:（矢量渲染 Worker）
      // v11.3 修复线上底图不渲染：jsapi-service.amap.com 是高德 JS API 2.0 的 WebGL 渲染器模块宿主，
      // 被 script-src 拦截会导致底图全灰、画布 0×0。script-src 属最高风险资源类型，故用精确域名而非通配。
      scriptSrc: ["'self'", 'https://html2canvas.hertzen.com', 'https://webapi.amap.com', 'https://restapi.amap.com', 'https://jsapi-service.amap.com', "'unsafe-eval'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      // v11.3：logo@2x.png 在 webapi.amap.com、POI 图标在 o4.amap.com 等子域，img-src 放行高德图片子域。
      imgSrc: ["'self'", 'data:', 'blob:', 'https://*.is.autonavi.com', 'https://autnapi.amap.com', 'https://vdata.amap.com', 'https://webapi.amap.com', 'https://*.amap.com'],
      connectSrc: ["'self'", 'https://restapi.amap.com', 'https://*.amap.com'],
      workerSrc: ["'self'", 'blob:'],
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
const rawOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
// v10.10 修复 P1-14：剔除通配符 "*"。
// 本服务对白名单做精确匹配（allowedOrigins.includes(origin)），"*" 永不命中真实 Origin，
// 效果与配置意图完全相反 —— 会拒绝所有携带 Origin 的请求（含同源 POST）。
// 此处显式剔除并告警；切勿为其补上通配符支持，否则将变成「* + credentials:true」的高危组合。
if (rawOrigins.includes('*')) {
  console.error('❌ CORS_ORIGIN 不允许使用通配符 "*"（精确匹配下无效且危险），已忽略该项，请配置明确的域名白名单');
}
const allowedOrigins = rawOrigins.filter(o => o !== '*');
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

// 健康检查接口（修复 P1-7：生产环境仅返回最小化状态，避免暴露服务配置指纹）
// 注意：注册顺序须在「静态资源白名单网关」之前，否则会被白名单网关拦截为 404。
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

// 托管前端静态资源（统一部署：后端同时提供 API 与前端页面）
const frontendRoot = path.join(__dirname, '..');

// 修复 SEC-1（P1）：原实现以仓库根目录为静态根，仅靠「敏感路径黑名单」防护，而黑名单
// 未覆盖根目录其余文档（*.md）与过程产物（deliverables/**、start.bat、render.yaml 等），
// 实测可被匿名下载，造成信息泄露。改为「显式白名单托管」：仅放行前端页面/PWA 真实引用的
// 根级资源，其余路径一律返回 404（而非 403，避免通过状态码差异探测文件是否存在）。
// 下方 sensitivePaths 黑名单保留，作为纵深防御（对明确敏感路径显式拒绝）。
const STATIC_ASSET_WHITELIST = new Set([
  '/index.html',            // 首页文档
  '/app.js',                // 主应用脚本（index.html 引用）
  '/style.css',             // 样式（index.html 引用）
  '/pwa.js',                // SW 注册与网络状态（index.html 引用）
  '/sw.js',                 // Service Worker（pwa.js 注册）
  '/offline.js',            // 离线页脚本（offline.html 引用）
  '/offline.html',          // 离线回退页
  '/manifest.json',         // PWA 清单（index.html 引用）
  '/icon.svg',              // 站点图标（index.html 引用）
  '/data/expandedCities.js' // 前端城市数据库（index.html / sw.js CORE_ASSETS 引用）
]);

// 敏感路径黑名单（纵深防御：显式拒绝并返回 403）
const SENSITIVE_PATHS = ['/backend', '/node_modules', '/.env', '/.git', '/.trae', '/package.json', '/package-lock.json', '/render.yaml'];
app.use((req, res, next) => {
  if (SENSITIVE_PATHS.some(p => req.path === p || req.path.startsWith(p + '/'))) {
    return res.status(403).json({ success: false, error: '访问被禁止' });
  }
  next();
});

// 静态资源白名单网关：仅放行白名单资源与根路径，其余一律 404（杜绝文件存在性探测）
app.use((req, res, next) => {
  if (req.path === '/' || STATIC_ASSET_WHITELIST.has(req.path)) {
    return next();
  }
  return res.status(404).json({ success: false, error: '资源不存在' });
});

app.use(express.static(frontendRoot, {
  index: 'index.html',
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
  // 修复 SEC-1：原注释称此处「阻止 .env/.md 等被直接访问」，但 setHeaders 只负责设置
  // 响应头，不具备拦截语义（无法阻止文件被访问）。真正的访问控制已上移为「白名单网关」。
  // 此处仅作为纵深防御：若未来白名单误加敏感扩展名文件，对其禁用缓存，降低泄露窗口。
  setHeaders: (res, filePath) => {
    if (/\.(env|md|log|txt|bat)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// 根路径 - 返回前端首页（API 信息可通过 /health 与 /api 查看）
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
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

// 修复 SEC-1 可测化：仅当以 `node server.js` 直接运行时才启动监听，
// 被测试 require 时只导出 app（不启动 HTTP 服务、不连库），便于针对 server.js
// 静态托管/中间件做集成测试。生产启动行为完全不变。
if (require.main === module) {
  initializeServer();
}

module.exports = app;