# 旅游攻略生成系统 - API 文档

**版本**: 2.0.0  
**更新时间**: 2026-04-29  
**数据版本**: 2.0.0 (627个城市)  

---

## 📋 目录

1. [基础信息](#基础信息)
2. [扩展城市数据库API](#扩展城市数据库api)
3. [核心功能API](#核心功能api)
4. [数据验证规则](#数据验证规则)
5. [错误处理](#错误处理)
6. [使用示例](#使用示例)
7. [性能优化](#性能优化)
8. [部署指南](#部署指南)

---

## 🌟 基础信息

### 服务器地址
- **开发环境**: `http://localhost:3000`
- **生产环境**: `https://your-domain.com`

### 认证方式
- 部分接口需要 Firebase Token 认证
- Header: `Authorization: Bearer <token>`

### 数据格式
- **请求**: JSON / Query Parameters
- **响应**: JSON
- **编码**: UTF-8

---

## 🏙️ 扩展城市数据库 API (v2.0)

### 1. 获取数据库统计信息

**GET** `/api/expanded/stats`

获取城市数据库的完整统计信息。

#### 响应示例:
```json
{
  "success": true,
  "data": {
    "version": "2.0.0",
    "lastUpdated": "2026-04-29T12:00:00.000Z",
    "totalCities": 627,
    "regionCount": 9,
    
    "seasons": {
      "春秋最佳": 245,
      "全年适宜": 156,
      "夏季最佳": 89,
      "冬季最佳": 67,
      ...
    },
    
    "tags": {
      "历史文化": 89,
      "自然风光": 76,
      "美食之都": 54,
      ...
    },
    
    "topTags": [
      { "tag": "历史文化", "count": 89 },
      { "tag": "自然风光", "count": 76 },
      ...
    ],
    
    "scores": {
      "excellent": 234,
      "good": 289,
      "average": 78,
      "pooor": 26
    },
    
    "quality": {
      "completeData": 615,
      "withFoods": 620,
      "withRoutes": 625,
      "withTags": 627
    },
    
    "performance": {
      "avgTagsPerCity": "4.2",
      "avgFoodsPerCity": "3.8",
      "avgRoutesPerCity": "2.9"
    }
  }
}
```

---

### 2. 获取热门城市排行

**GET** `/api/expanded/trending`

获取当前热门城市排行榜。

#### 参数:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | Number | 否 | 10 | 返回数量限制 (1-50) |

#### 示例请求:
```
GET /api/expanded/trending?limit=10
```

#### 响应示例:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "rank": 1,
      "name": "北京",
      "data": {
        "title": "北京·皇城古韵",
        "season": "春秋最佳",
        "days": "4-6",
        "tags": ["历史文化", "皇家园林"],
        "poster": { "style": "vintage", "subtitle": "..." }
      },
      "popularity": 97,
      "recommendationScore": 95
    },
    {
      "rank": 2,
      "name": "上海",
      "data": { ... },
      "popularity": 95,
      "recommendationScore": 92
    },
    ...
  ]
}
```

---

### 3. 智能搜索城市

**GET** `/api/expanded/search`

支持多种匹配方式的智能搜索。

#### 参数:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| q | String | 是 | - | 搜索关键词 |
| limit | Number | 否 | 15 | 返回数量 (1-50) |

#### 匹配优先级:
1. **精确匹配** (100分): 城市名称完全一致
2. **包含匹配** (85分): 城市名称包含关键词
3. **模糊匹配** (70分): 部分匹配或简称
4. **标题匹配** (40分): 匹配城市标题
5. **标签匹配** (25分/个): 匹配标签关键词
6. **副标题匹配** (30分): 匹配海报副标题
7. **拼音匹配** (60分): 支持首字母搜索

#### 示例请求:
```
# 精确搜索
GET /api/expanded/search?q=北京

# 标签搜索
GET /api/expanded/search?q=美食

# 模糊搜索
GET /api/expanded/search?q=北&limit=8

# 多关键词
GET /api/expanded/search?q=历史 文化
```

#### 响应示例:
```json
{
  "success": true,
  "query": "北京",
  "count": 5,
  "data": [
    {
      "name": "北京",
      "score": 100,
      "matchType": "exact",
      "matchDetails": ["exact"],
      "title": "北京·皇城古韵",
      "season": "春秋最佳",
      "days": "4-6",
      "tags": ["历史文化", "皇家园林", "首都风貌"],
      "subtitle": "三千年的历史沉淀"
    },
    {
      "name": "北京周边",
      "score": 85,
      "matchType": "contains",
      "matchDetails": ["contains"],
      ...
    },
    ...
  ]
}
```

---

### 4. 按区域获取城市列表

**GET** `/api/expanded/provinces/:province?`

按省份/区域分组获取城市列表。

#### 参数:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| province | String | 否 | 区域名称（华北、华东、华南等） |

#### 可用区域:
- 华北（北京、天津、河北、山西、内蒙古）
- 东北（辽宁、吉林、黑龙江）
- 华东（上海、江苏、浙江、安徽、福建、江西、山东）
- 华中（河南、湖北、湖南）
- 华南（广东、广西、海南）
- 西南（重庆、四川、贵州、云南、西藏）
- 西北（陕西、甘肃、青海、宁夏、新疆）

#### 示例请求:
```
# 获取所有区域
GET /api/expanded/provinces

# 获取特定区域
GET /api/expanded/provinces/华东
```

#### 响应示例:
```json
{
  "success": true,
  "province": "华东",
  "count": 98,
  "data": [
    {
      "name": "上海",
      "data": { ... }
    },
    {
      "name": "杭州",
      "data": { ... }
    },
    ...
  ]
}
```

---

### 5. 清除缓存

**POST** `/api/expanded/cache/clear`

清除服务器端的城市数据缓存。

#### 响应:
```json
{
  "success": true,
  "message": "缓存已清除"
}
```

---

## 🔧 核心 API

### 生成旅游攻略

**POST** `/api/generate`

使用AI引擎生成个性化旅游攻略。

#### 请求体:
```json
{
  "city": "成都",
  "days": "3天",
  "budget": "medium",
  "preferences": ["美食", "文化", "自然"],
  "aiEngine": "glm4",
  "style": "vintage"
}
```

#### 参数说明:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | String | ✅ | 目标城市名称 |
| days | String | ❌ | 游玩天数 (默认: 3天) |
| budget | String | ❌ | 预算等级: low/medium/high |
| preferences | Array | ❌ | 兴趣偏好标签 |
| aiEngine | String | ❌ | AI引擎: glm4/deepseek/qwen |
| style | String | ❌ | 海报风格 |

#### 响应:
```json
{
  "success": true,
  "guideId": "guide_20260429_001",
  "city": "成都",
  "poster": {
    "title": "成都·天府之国",
    "subtitle": "一座来了就不想走的城市",
    "style": "fresh"
  },
  "sections": [...],
  "foods": [...],
  "routes": [...],
  "budget": {...},
  "generatedAt": "2026-04-29T..."
}
```

---

## ✅ 数据验证规则

### 城市名称验证
- **类型**: String
- **长度**: 2-20字符
- **格式**: 中文、英文或空格
- **正则**: `/^[\u4e00-\u9fa5a-zA-Z\s]+$/`

### 必填字段
1. `title` - 城市标题 (4-50字符)
2. `season` - 最佳季节
   - 允许值: 春季最佳, 夏季最佳, 秋季最佳, 冬季最佳, 春秋最佳, 夏秋最佳, 全年适宜, 夏冬两季
3. `days` - 推荐天数
   - 格式: `/^\d+(-\d+)?(天|日)$/`
4. `tags` - 特色标签 (数组)
   - 数量: 1-10个
   - 每个标签: 2-15字符

### 可选字段验证
- **routes**: 路线数组 (1-8条，每条5-100字符)
- **foods**: 美食数组 (1-15项)
  - `name`: 必填，1-20字符
  - `description`: 可选，最多50字符
  - `price`: 格式 `数字-数字(元/单位)`
  - `mustTry`: Boolean
  - `location`: 最多30字符
- **poster**: 海报对象
  - `style`: vintage/fresh/minimal/modern/artistic/nature/urban
  - `subtitle`: 必填

### 数据质量评分
- **100分**: 完全符合规范
- **80-99分**: 有少量警告
- **60-79分**: 有多个警告
- **<60分**: 存在错误（自动修复后降级使用）

---

## ⚠️ 错误处理

### 标准错误响应格式:
```json
{
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2026-04-29T...",
  "requestId": "req_123456"
}
```

### HTTP状态码:
| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求成功完成 |
| 400 | 请求参数错误 | 缺少必填参数或格式不正确 |
| 401 | 未认证 | 缺少或无效的认证Token |
| 403 | 无权限 | 权限不足 |
| 404 | 资源不存在 | 城市或资源未找到 |
| 422 | 数据验证失败 | 提交的数据不符合规范 |
| 429 | 请求过于频繁 | 触发限流 |
| 500 | 服务器内部错误 | 后端处理异常 |
| 503 | 服务不可用 | 维护中或过载 |

### 常见错误代码:
- `CITY_NOT_FOUND` - 城市不存在
- `INVALID_CITY_NAME` - 城市名称无效
- `MISSING_REQUIRED_FIELD` - 缺少必填字段
- `VALIDATION_FAILED` - 数据验证失败
- `RATE_LIMIT_EXCEEDED` - 请求频率超限
- `AI_SERVICE_ERROR` - AI服务调用失败
- `CACHE_ERROR` - 缓存操作失败

---

## 💡 使用示例

### JavaScript (浏览器)
```javascript
// 1. 获取热门城市
async function getTrendingCities() {
    const response = await fetch('/api/expanded/trending?limit=10');
    const data = await response.json();
    console.log('热门城市:', data.data);
}

// 2. 搜索城市
async function searchCities(keyword) {
    const response = await fetch(`/api/expanded/search?q=${encodeURIComponent(keyword)}&limit=8`);
    const result = await response.json();
    
    if (result.success && result.count > 0) {
        return result.data; // 返回匹配的城市列表
    } else {
        return []; // 无匹配结果
    }
}

// 3. 生成攻略
async function generateGuide(cityName) {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            city: cityName,
            days: '3天',
            budget: 'medium',
            aiEngine: 'glm4'
        })
    });
    
    const guide = await response.json();
    if (guide.success) {
        renderGuide(guide); // 渲染攻略
    }
}

// 4. 获取统计数据
async function getStats() {
    const response = await fetch('/api/expanded/stats');
    const stats = await response.json();
    console.log(`总计 ${stats.data.totalCities} 个城市`);
}
```

### cURL 命令行
```bash
# 获取统计信息
curl -X GET http://localhost:3000/api/expanded/stats

# 搜索城市
curl -X GET "http://localhost:3000/api/expanded/search?q=成都&limit=5"

# 获取热门城市
curl -X GET http://localhost:3000/api/expanded/trending?limit=10

# 按区域查询
curl -X GET http://localhost:3000/api/expanded/provinces/西南

# 清除缓存
curl -X POST http://localhost:3000/api/expanded/cache/clear

# 生成攻略
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"city":"西安","days":"3天","budget":"medium"}'
```

### Python requests
```python
import requests

BASE_URL = "http://localhost:3000"

def search_cities(query):
    """搜索城市"""
    response = requests.get(f"{BASE_URL}/api/expanded/search", 
                         params={"q": query, "limit": 10})
    return response.json()

def get_trending(limit=10):
    """获取热门城市"""
    response = requests.get(f"{BASE_URL}/api/expanded/trending",
                         params={"limit": limit})
    return response.json()

def generate_guide(city):
    """生成攻略"""
    payload = {
        "city": city,
        "days": "3天",
        "budget": "medium",
        "aiEngine": "glm4"
    }
    response = requests.post(f"{BASE_URL}/api/generate", json=payload)
    return response.json()
```

---

## ⚡ 性能优化

### 缓存策略
- **内存缓存**: 5分钟TTL
- **自动刷新**: 过期时重新加载数据
- **手动清除**: 支持`POST /cache/clear`强制刷新

### 性能指标
- **加载时间**: <100ms (首次), <10ms (缓存命中)
- **搜索响应**: <50ms (627个城市)
- **并发支持**: 200 QPM (每分钟请求数)

### 限流配置
- **全局限流**: 200次/分钟
- **单IP限流**: 50次/分钟
- **搜索接口**: 30次/分钟

---

## 🚀 部署指南

### 开发环境
```bash
cd backend
npm install
npm run dev
# 访问: http://localhost:3000
```

### 生产环境 (Docker)
```bash
# 构建镜像
docker build -t travel-guide-api .

# 运行容器
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://mongo:27017/travel \
  travel-guide-api
```

### 环境变量
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travel-guide
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
CACHE_TTL=300000  # 5分钟 (毫秒)
RATE_LIMIT_MAX=200
RATE_LIMIT_WINDOW_MS=60000
```

---

## 📊 版本更新日志

### v2.0.0 (2026-04-29)
✨ **新功能**:
- 扩展至627个城市数据库
- 智能搜索引擎（7种匹配模式）
- 数据验证和清理机制
- 推荐分数和热门度计算
- 区域分组和统计分析
- 数据导出功能

🔧 **改进**:
- 性能提升300%+
- 缓存机制优化
- 错误处理增强
- API文档完善

🐛 **修复**:
- 前端点击城市无反应问题
- 移动端适配优化
- 搜索建议功能添加

---

## 📞 技术支持

- **文档**: https://docs.your-domain.com
- **GitHub Issues**: https://github.com/your-repo/issues
- **邮箱**: support@your-domain.com

---

**© 2026 旅游攻略生成系统. All rights reserved.**
