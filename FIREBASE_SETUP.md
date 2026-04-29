# Firebase 配置指南

## 📋 前置条件
1. 创建 Firebase 项目：https://console.firebase.google.com/
2. 启用 Authentication（Email/Google/GitHub）
3. 启用 Cloud Firestore 数据库
4. 获取 API 密钥和服务账户 JSON 文件

## 🔧 步骤 1：创建 Firebase 项目

1. 访问 https://console.firebase.google.com/
2. 点击 "添加项目"
3. 输入项目名称：`travel-guide-app`
4. 启用 Google Analytics（可选）
5. 点击 "创建项目"

## 🔧 步骤 2：启用 Authentication

1. 在左侧菜单选择 "Authentication"（身份验证）
2. 点击 "开始使用"
3. 选择登录方式：
   - ✅ 电子邮件/密码（启用）
   - ✅ Google（启用）
   - ✅ GitHub（启用）
4. 对于 OAuth 提供商，需要在对应平台创建 OAuth 客户端 ID

### Google 登录配置：
1. 访问 https://console.cloud.google.com/apis/credentials
2. 创建 OAuth 2.0 客户端 ID
3. 添加授权的重定向 URI：`http://localhost:3001/auth/callback`
4. 复制客户端 ID 和密钥

### GitHub 登录配置：
1. 访问 GitHub → Settings → Developer settings → OAuth Apps
2. 创建新的 OAuth App
3. 设置回调 URL：`http://localhost:3001/auth/github/callback`
4. 复制 Client ID 和 Client Secret

## 🔧 步骤 3：设置 Cloud Firestore

1. 在左侧菜单选择 "Firestore Database"（数据库）
2. 点击 "创建数据库"
3. 选择安全规则（开发模式）：
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       allow read, write: if true;
     }
   }
   ```
4. 选择数据库位置（建议选择离用户近的区域）

## 🔧 步骤 4：获取配置信息

1. 点击项目设置 ⚙️（齿轮图标）
2. 在 "常规" 标签页向下滚动找到 "您的应用"
3. 点击 Web 应用（`</>` 图标）
4. 注册应用并获取配置对象：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "travel-guide-app.firebaseapp.com",
  projectId: "travel-guide-app",
  storageBucket: "travel-guide-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 🔧 步骤 5：生成服务账户密钥

1. 点击项目设置 ⚙️
2. 选择 "服务账号" 标签页
3. 点击 "生成新的私钥"
4. 选择 "JSON" 格式
5. 下载文件并保存为 `service-account.json`（**不要提交到 Git！**）
6. 将此文件放到 `backend/` 目录下

## 📝 更新 .env 文件

将以下内容添加到 `backend/.env`:

```env
# Firebase 配置（从 Firebase 控制台获取）
FIREBASE_API_KEY=your_actual_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# 服务账户路径（相对路径）
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

## 🚀 验证 Firebase 连接

启动服务器后访问：
```
GET http://localhost:3001/health
```

查看输出中的 `auth` 和 `social` 字段：
```json
{
  "services": {
    "storage": "active",
    "ai": "configured",
    "auth": "firebase",      // ✅ 表示 Firebase 已连接
    "social": "firestore"     // ✅ 表示 Firestore 已连接
  }
}
```

## 🎯 Firestore 数据库结构

系统会自动创建以下集合（Collections）：

### users 集合
```json
{
  "uid": "user_123",
  "email": "user@example.com",
  "displayName": "用户名",
  "photoURL": "",
  "provider": "google",
  "role": "user",
  "createdAt": "2026-04-29T00:00:00.000Z",
  "lastLoginAt": "2026-04-29T12:00:00.000Z",
  "preferences": {
    "language": "zh-CN",
    "theme": "light",
    "notifications": true
  },
  "stats": {
    "totalSearches": 0,
    "totalLikes": 0,
    "totalComments": 0
  }
}
```

### comments 集合
```json
{
  "id": "comment_123",
  "cityId": "成都",
  "userId": "user_123",
  "content": "这座城市太美了！强烈推荐春熙路",
  "parentId": null,
  "likes": 5,
  "replies": [],
  "createdAt": "2026-04-29T12:00:00.000Z",
  "updatedAt": "2026-04-29T12:00:00.000Z"
}
```

### likes 集合
```json
{
  "id": "likes_cities_chengdu_user123",
  "targetType": "cities",
  "targetId": "成都",
  "userId": "user_123",
  "createdAt": "2026-04-29T12:00:00.000Z"
}
```

### follows 集合
```json
{
  "id": "follow_user123_user456",
  "followerId": "user_123",
  "followingId": "user_456",
  "createdAt": "2026-04-29T12:00:00.000Z"
}
```

### views 集合
```json
{
  "targetType": "cities",
  "targetId": "成都",
  "userId": "user_123",  // 可选，匿名时为 null
  "timestamp": "2026-04-29T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.100"
}
```

## 🔒 生产环境安全规则

当部署到生产环境时，务必更新 Firestore 安全规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户数据：只能读写自己的
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 评论：认证用户可读写，所有人可读
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }

    // 点赞：认证用户可操作
    match /likes/{likeId} {
      allow read, write: if request.auth != null;
    }

    // 关注：认证用户可操作
    match /follows/{followId} {
      allow read, write: if request.auth != null;
    }

    // 浏览记录：允许写入（用于统计）
    match /views/{viewId} {
      allow create: if true;
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📚 更多资源

- [Firebase Authentication 文档](https://firebase.google.com/docs/auth)
- [Cloud Firestore 文档](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**⏰ 预计配置时间：15-30分钟**
**💰 费用：Firebase 免费层足够个人项目使用**

完成以上步骤后，你的应用将拥有：
✅ 用户注册/登录功能（邮箱+Google+GitHub）
✅ 云端数据持久化（评论/点赞/关注/浏览统计）
✅ 实时数据同步（多设备间自动同步）
✅ 企业级安全保障