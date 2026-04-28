# 旅游攻略生成器 - 企业级后端服务

## 📋 项目概述

这是一个功能完整的旅游攻略生成后端服务，集成真实AI API、Firebase认证、社交互动等企业级功能。

## ✨ 核心特性

### 🤖 AI智能攻略生成
- **通义千问**（阿里云）：qwen-plus模型
- **文心一言**（百度）：ernie-bot-4模型
- **OpenAI GPT-4**：最新GPT-4-turbo-preview
- 智能回退机制：API不可用时自动使用本地数据
- 30分钟缓存：避免重复调用节省成本

### 👤 用户认证系统
- **Firebase Auth**集成
  - 邮箱/密码登录
  - Google登录
  - GitHub登录
- JWT Token管理
- 用户资料管理
- 测试Token支持（开发环境）

### ☁️ 云端数据同步
- **Firestore**数据库
  - 评论数据存储
  - 点赞记录
  - 关注关系
  - 浏览统计
- 内存存储回退（无需Firebase也可运行）
- 实时数据同步

### 💬 社交互动功能
- **评论系统**
  - 发表评论/回复
  - 评论列表（分页）
  - 删除评论
- **点赞功能**
  - 点赞/取消点赞
  - 点赞列表查询
- **关注系统**
  - 关注/取关用户
  - 粉丝列表
  - 关注列表
- **浏览统计**
  - 记录浏览行为
  - 统计分析（24h/7d/30d）
  - 热门内容排行

### 🌍 国际化支持
- 中文（简体）
- English
- 日本語
- 한국어
- 自动语言检测

### 🥽 AR增强现实
- AR.js集成
- 海报实景预览
- 移动端优化

### 🎤 语音助手
- Web Speech API
- 语音输入城市名
- 攻略语音朗读
- 多语言支持

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 5.0（可选，用于城市数据存储）
- Firebase项目（可选，用于认证和云数据库）

### 安装步骤

1. **克隆或下载项目**

```bash
cd backend
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的API密钥：

```env
# 必填：至少配置一个AI API
TONGYI_API_KEY=your_tongyi_api_key_here
# 或
OPENAI_API_KEY=your_openai_api_key_here

# 可选：Firebase认证
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your-project-id

# 可选：MongoDB
MONGODB_URI=mongodb://localhost:27017/travel_guide
```

4. **启动服务**

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

5. **验证服务**

访问 http://localhost:3001/health 查看服务状态

## 📡 API接口文档

### 基础信息

- **Base URL**: `http://localhost:3001/api`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

### AI攻略生成

#### POST `/ai/generate`
生成单个城市的旅游攻略

**请求体**:
```json
{
  "city": "成都",
  "preferences": {
    "days": 3,
    "travelType": "foodie",
    "budgetRange": "medium",
    "companionType": "couple",
    "interests": ["美食", "文化"],
    "language": "zh-CN"
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "city": "成都",
    "title": "成都·慢生活美食之旅",
    "season": "四季皆宜",
    "days": 3,
    "routes": [...],
    "foods": [...],
    "source": "ai"
  }
}
```

#### POST `/ai/generate-batch`
批量生成多个城市的攻略（最多5个）

**请求体**:
```json
{
  "cities": ["成都", "重庆", "西安"],
  "preferences": {
    "days": 2,
    "travelType": "culture"
  }
}
```

### 用户认证

#### POST `/auth/login`
使用Firebase ID Token登录

**请求体**:
```json
{
  "idToken": "firebase_id_token_here"
}
```

**响应**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "用户名"
  }
}
```

#### GET `/auth/me`
获取当前用户信息（需认证）

#### PUT `/auth/profile`
更新用户资料（需认证）

### 社交功能

#### 评论相关
- `POST /comments` - 发表评论（需认证）
- `GET /comments/:cityId` - 获取评论列表
- `DELETE /comments/:commentId` - 删除评论（需认证）

#### 点赞相关
- `POST /likes/:type/:targetId` - 点赞/取消点赞（需认证）
  - type: cities | comments | guides
- `GET /likes/user` - 获取我的点赞列表（需认证）

#### 关注相关
- `POST /follow/:userId` - 关注/取关用户（需认证）
- `GET /followers` - 获取粉丝列表（需认证）
- `GET /following` - 获取关注列表（需认证）

#### 统计相关
- `POST /views/:type/:targetId` - 记录浏览
- `GET /stats/views/:type/:targetId?range=7d` - 获取浏览统计
- `GET /activity/timeline` - 获取活动时间线（需认证）
- `GET /trending/social?type=cities&limit=10` - 热门内容排行

### 城市数据

- `GET /cities?page=1&limit=50` - 城市列表（分页）
- `GET /cities/all` - 所有城市详细数据
- `GET /cities/:name` - 城市详情
- `GET /cities/search?keyword=成都` - 搜索城市
- `GET /cities/search?tags=美食,历史` - 标签搜索
- `POST /cities` - 添加城市（需认证）
- `PUT /cities/:name` - 更新城市信息（需认证）
- `DELETE /cities/:name` - 删除城市（管理员权限）

### 天气服务

- `GET /weather/:city` - 获取天气信息
- `POST /weather/sync` - 手动同步天气
- `POST /weather/clear-cache` - 清除天气缓存

### 其他

- `GET /trending` - 热门城市排行榜
- `GET /health` - 服务健康检查
- `GET /` - API文档和端点列表

## 🔧 配置说明

### AI提供商选择

在 `.env` 文件中设置：

```env
# 选择默认AI提供商
AI_PROVIDER=tongyi  # 可选: tongyi | wenxin | openai
```

### Firebase配置

1. 创建Firebase项目
2. 启用Authentication（Email/Google/GitHub）
3. 启用Cloud Firestore
4. 获取API密钥和服务账户JSON文件
5. 配置环境变量

### MongoDB配置（可选）

如果需要持久化城市数据：

1. 安装并启动MongoDB
2. 创建数据库和集合
3. 配置MONGODB_URI

## 🛠️ 开发指南

### 项目结构

```
backend/
├── server.js              # 主服务器入口
├── package.json           # 依赖配置
├── .env.example           # 环境变量模板
├── .gitignore             # Git忽略规则
├── routes/
│   └── api.js            # API路由定义
├── services/
│   ├── aiService.js      # AI服务（通义千问/文心一言/OpenAI）
│   ├── authService.js    # 认证服务（Firebase Auth + JWT）
│   ├── socialService.js  # 社交服务（评论/点赞/关注）
│   ├── storage.js        # 数据存储服务
│   ├── weatherSync.js    # 天气同步服务
│   └── realTimeSync.js   # 实时数据同步
├── middleware/
│   └── validation.js     # 验证中间件
├── models/
│   └── City.js          # 数据模型
├── data/
│   └── cities.js        # 城市数据
└── initData.js          # 初始化脚本
```

### 添加新的AI提供商

编辑 `services/aiService.js`:

```javascript
// 1. 在构造函数中添加新provider
this.providers.newProvider = {
  name: '新AI',
  baseUrl: 'https://api.example.com/v1/chat',
  model: 'model-name',
  apiKey: process.env.NEW_PROVIDER_API_KEY || ''
};

// 2. 添加调用方法
async callNewProviderAPI(prompt, provider) {
  const response = await axios.post(provider.baseUrl, {
    model: provider.model,
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: { ... },
    timeout: 30000
  });
  
  return response.data.choices[0].message.content;
}

// 3. 在generateTravelGuide的switch中添加case
case 'newProvider':
  response = await this.callNewProviderAPI(prompt, provider);
  break;
```

### 自定义认证方式

编辑 `services/authService.js`:

```javascript
// 可以添加OAuth2、微信登录等其他认证方式
async loginWithWechat(code) {
  // 实现微信登录逻辑
}
```

## 📊 性能优化

### AI缓存策略
- 默认30分钟缓存
- 相同城市+相同偏好命中缓存
- 管理员可手动清除缓存

### 限流保护
- 全局限流：200请求/分钟
- 单IP限制可自定义

### 数据库优化
- Firestore索引优化
- 批量操作减少网络往返
- 内存缓存热点数据

## 🔒 安全说明

### JWT安全
- 使用强密钥（生产环境必须更改）
- 7天有效期
- 自动刷新机制

### 输入验证
- 所有输入经过验证中间件
- SQL注入防护
- XSS攻击防护

### CORS配置
- 仅允许信任的域名
- 生产环境严格限制origin

## 🐛 故障排查

### 后端无法启动
```bash
# 检查端口占用
netstat -tlnp | grep 3001

# 查看详细日志
DEBUG=* npm start
```

### AI API调用失败
1. 检查API Key是否正确
2. 查看账户余额
3. 检查网络连接
4. 查看后端日志中的错误信息

### Firebase认证失败
1. 检查Firebase配置
2. 验证项目设置
3. 检查API Key权限

### MongoDB连接失败
1. 确认MongoDB服务已启动
2. 检查连接字符串格式
3. 验证用户名密码

## 📈 监控与日志

### 日志级别
- 开发环境：combined格式（详细）
- 生产环境：建议使用winston等库

### 健康检查
定期访问 `/health` 接口监控服务状态

### 关键指标
- AI API调用成功率
- 响应时间（P50/P95/P99）
- 错误率
- 缓存命中率

## 🚢 部署指南

### Docker部署（推荐）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

构建和运行：
```bash
docker build -t travel-api .
docker run -p 3001:3001 --env-file .env travel-api
```

### 传统部署

```bash
# 安装PM2进程管理器
npm install -g pm2

# 启动服务
pm2 start server.js --name travel-api

# 设置开机自启
pm2 startup
pm2 save
```

### Nginx反向代理

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📝 许可证

MIT License

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📞 技术支持

如有问题，请查看：
- [常见问题](docs/FAQ.md)
- [API文档](docs/API.md)
- [更新日志](CHANGELOG.md)

---

**版本**: 2.0.0  
**最后更新**: 2026-04-28  
**作者**: Travel Guide Team