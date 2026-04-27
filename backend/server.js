// 城市旅游指南生成器 - 后端API服务（优化版）

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 加载环境变量
require('dotenv').config();

// 导入存储服务
const storage = require('./services/storage');
const { startWeatherSync } = require('./services/weatherSync');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 启动天气定时同步服务
startWeatherSync(10);

// API路由
app.use('/api', require('./routes/api'));

// 错误处理中间件
const { errorHandler } = require('./middleware/validation');
app.use(errorHandler);

// 测试接口
app.get('/api/test', (req, res) => {
  res.json({ status: 'OK', message: '城市旅游指南API服务运行中', cityCount: storage.getCityCount() });
});

// 初始化并启动服务器
async function initializeServer() {
  try {
    // 初始化存储服务
    await storage.initialize(mongoose);
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`城市旅游指南API服务启动在端口 ${PORT}`);
      console.log(`已加载 ${storage.getCityCount()} 个城市数据`);
      console.log(`访问 http://localhost:${PORT}/api/test 测试服务`);
    });
  } catch (error) {
    console.error('服务器初始化失败:', error);
    process.exit(1);
  }
}

initializeServer();

module.exports = app;
