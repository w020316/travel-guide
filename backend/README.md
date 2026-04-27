# 旅游攻略后端服务

实时数据同步的城市旅游攻略API服务

## 功能特性

- ✅ 城市数据管理（添加、查询、更新、删除）
- ✅ 实时天气数据同步（集成和风天气API）
- ✅ 热门城市排行榜
- ✅ 季节性推荐标签
- ✅ 手动/自动数据同步

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（可选）:

```env
# 和风天气API Key (可选，不提供则使用模拟数据)
QWEATHER_API_KEY=your-api-key-here

# 端口号
PORT=3001

# 存储模式 (memory | mongodb)
STORAGE_MODE=memory
```

### 3. 启动服务

```bash
npm start
```

服务将运行在 `http://localhost:3001`

## API接口

### 城市数据

| 接口 | 方法 | 描述 |
|------|------|------|
| `GET /api/cities` | GET | 获取所有城市列表 |
| `GET /api/cities/all` | GET | 获取所有城市详细数据（含实时信息） |
| `GET /api/cities/:name` | GET | 获取指定城市详情 |
| `POST /api/cities` | POST | 添加新城市 |
| `PUT /api/cities/:name` | PUT | 更新城市数据 |
| `DELETE /api/cities/:name` | DELETE | 删除城市 |

### 实时数据

| 接口 | 方法 | 描述 |
|------|------|------|
| `GET /api/weather/:name` | GET | 获取城市实时天气 |
| `GET /api/trending` | GET | 获取热门城市排行榜 |
| `POST /api/sync-weather/:name?` | POST | 手动同步天气数据 |
| `POST /api/sync/:name` | POST | 同步单个城市数据 |
| `POST /api/sync-all` | POST | 同步所有城市数据 |

### 统计信息

| 接口 | 方法 | 描述 |
|------|------|------|
| `GET /api/stats` | GET | 获取系统统计信息 |

## 使用示例

### 获取所有城市列表

```bash
curl http://localhost:3001/api/cities
```

### 获取北京城市数据

```bash
curl http://localhost:3001/api/cities/北京
```

### 获取实时天气

```bash
curl http://localhost:3001/api/weather/北京
```

### 手动同步天气

```bash
curl -X POST http://localhost:3001/api/sync-weather/北京
```

### 添加新城市

```bash
curl -X POST http://localhost:3001/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "深圳",
    "tags": ["创新之都", "现代化城市"],
    "season": "全年",
    "atmosphere": "年轻活力，快节奏",
    "days": "2-3天"
  }'
```

## 和风天气API集成

1. 访问 [和风天气开发平台](https://dev.qweather.com/) 注册账号
2. 创建应用并获取API Key
3. 将API Key配置到 `.env` 文件中

如果不配置API Key，系统将使用模拟天气数据。

## 数据存储

### 内存存储（默认）

数据存储在服务器内存中，重启后丢失。适合开发和测试。

### MongoDB存储

配置环境变量:
```env
STORAGE_MODE=mongodb
MONGODB_URI=mongodb://localhost:27017/travel
```

数据将持久化到MongoDB。

## 自动同步

系统启动后会自动同步天气数据，默认每10分钟更新一次。

## 技术栈

- Node.js + Express
- Axios (HTTP请求)
- Mongoose (MongoDB ORM, 可选)
- 和风天气API (可选)

## 开发

```bash
# 开发模式（自动重启）
npm run dev
```

## 许可证

MIT
