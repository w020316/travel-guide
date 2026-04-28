const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const storage = require('./services/storage');
const socialService = require('./services/socialService');
const { startWeatherSync } = require('./services/weatherSync');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 请求解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// 启动天气定时同步服务
startWeatherSync(10);

// API路由
app.use('/api', require('./routes/api'));

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cityCount: storage.getCityCount ? storage.getCityCount() : 0,
    services: {
      storage: 'active',
      ai: process.env.TONGYI_API_KEY || process.env.WENXIN_API_KEY || process.env.OPENAI_API_KEY ? 'configured' : 'local-mode',
      auth: process.env.FIREBASE_API_KEY ? 'configured' : 'local-mode',
      social: socialService.getStats().mode
    }
  });
});

// 根路径
app.get('/', (req, res) => {
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
    documentation: 'https://github.com/your-repo/travel-guide'
  });
});

// 错误处理中间件
const { errorHandler } = require('./middleware/validation');
app.use(errorHandler);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.path
  });
});

// 初始化并启动服务器
async function initializeServer() {
  try {
    console.log('🚀 正在初始化服务器...');
    
    // 初始化存储服务
    await storage.initialize(mongoose);
    console.log('✅ 存储服务初始化完成');
    
    // 初始化社交服务
    await socialService.initialize();
    console.log('✅ 社交服务初始化完成');
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('  旅游攻略生成器 API 服务已启动');
      console.log('═══════════════════════════════════════');
      console.log(`  端口: ${PORT}`);
      console.log(`  环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  城市数据: ${storage.getCityCount ? storage.getCityCount() : 0} 个`);
      console.log(`  AI服务: ${process.env.TONGYI_API_KEY || process.env.WENXIN_API_KEY || process.env.OPENAI_API_KEY ? '已配置' : '本地模式'}`);
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

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  mongoose.connection.close(false).then(() => {
    console.log('MongoDB连接已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭服务器...');
  mongoose.connection.close(false).then(() => {
    console.log('MongoDB连接已关闭');
    process.exit(0);
  });
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

initializeServer();

module.exports = app;