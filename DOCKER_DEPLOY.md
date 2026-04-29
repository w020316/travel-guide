# Docker 部署方案 - 旅游攻略生成器

## 🐳 Dockerfile（后端服务）

```dockerfile
# ==========================================
# 旅游攻略生成器 - 后端服务 Dockerfile
# 基于 Node.js 18 Alpine（轻量级）
# ==========================================

# 阶段1：构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 先复制 package 文件以利用 Docker 缓存
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# ==========================================
# 阶段2：运行阶段
# ==========================================

FROM node:18-alpine AS runner

# 安装必要的系统依赖
RUN apk add --no-cache \
    tini \
    curl \
    && rm -rf /var/cache/apk/*

# 创建非 root 用户
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -d /app nodejs

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001
NODE_TLS_REJECT_UNAUTHORIZED=0

# 从构建阶段复制依赖和代码
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 使用 tini 作为 PID 1 进程管理器（处理僵尸进程）
ENTRYPOINT ["tini", "--"]

# 启动命令
CMD ["node", "server.js"]
```

## 🐳 Dockerfile（前端静态文件）

```dockerfile
# 前端静态文件 Dockerfile
FROM nginx:alpine

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制前端文件
COPY index.html style.css apiClient.js app_backup.js manifest.json sw.js /usr/share/nginx/html/

# 复制城市数据文件
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Nginx 配置（前端）

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|woff|woff2|ttf|eot|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # SPA 路由支持（所有未匹配的请求返回 index.html）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PWA Service Worker
    location = /sw.js {
        expires off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://www.gstatic.com https://aframe.io https://raw.githack.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:;" always;
}
```

## 🐳 docker-compose.yml（完整编排）

```yaml
version: '3.8'

services:
  # ==================== 后端 API 服务 ====================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: travel-guide-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      # AI 配置（从 .env 加载）
      - AI_PROVIDER=${AI_PROVIDER:-tongyi}
      - TONGYI_API_KEY=${TONGYI_API_KEY}
      - ZHIPU_API_KEY=${ZHIPU_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      # Firebase 配置
      - FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
    volumes:
      - ./backend/.env:/app/.env:ro
      - ./backend/service-account.json:/app/service-account.json:ro
      - backend_logs:/app/logs
    networks:
      - travel-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # ==================== 前端静态服务 ====================
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: travel-guide-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"  # 如果启用 HTTPS
    depends_on:
      - backend
    networks:
      - travel-network
    volumes:
      - ./ssl:/etc/nginx/ssl:ro  # SSL 证书（可选）
      - frontend_cache:/var/cache/nginx
    logging:
      driver: json-file
      options:
        max-size: "5m"
        max-file: "2"

  # ==================== MongoDB 数据库（可选）====================
  mongodb:
    image: mongo:6.0
    container_name: travel-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=travel_guide
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD:-changeme123}
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    networks:
      - travel-network
    command: mongod --auth

  # ==================== Redis 缓存（可选，用于会话存储）====================
  redis:
    image: redis:7-alpine
    container_name: travel-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis123}
    volumes:
      - redis_data:/data
    networks:
      - travel-network

# ==================== 网络配置 ====================
networks:
  travel-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16

# ==================== 数据卷配置 ====================
volumes:
  backend_logs:
    driver: local
  frontend_cache:
    driver: local
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local
  redis_data:
    driver: local
```

## 🚀 快速启动命令

### 1. 开发环境启动（仅后端）
```bash
# 构建并启动后端
docker-compose up -d backend

# 查看日志
docker-compose logs -f backend

# 进入容器调试
docker exec -it travel-guide-backend sh
```

### 2. 完整环境启动（前后端+数据库）
```bash
# 一键启动所有服务
docker-compose up -d

# 查看所有服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 仅查看后端日志
docker-compose logs -f backend
```

### 3. 生产环境部署
```bash
# 使用 production 配置
docker-compose -f docker-compose.prod.yml up -d

# 或者设置环境变量后启动
export NODE_ENV=production
export TONGYI_API_KEY="your_key"
docker-compose up -d --build
```

## 📊 监控和管理

### 查看资源使用情况
```bash
# 查看 CPU 和内存使用
docker stats

# 查看特定容器详情
docker inspect travel-guide-backend

# 查看容器网络
docker network inspect travel_travel-network
```

### 备份和恢复
```bash
# 备份 MongoDB 数据
docker exec travel-mongodb mongodump --archive=/data/db/archive.gz

# 恢复 MongoDB 数据
docker exec -i travel-mongodb mongorestore --archive=/data/db/archive.gz < backup.gz

# 备份数据卷
docker run --rm -v travel_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data/db
```

### 更新部署
```bash
# 重新构建并更新
docker-compose up -d --build

# 平滑重启（无停机）
docker-compose up -d --no-deps backend

# 清理旧镜像
docker image prune -f
```

## 🔒 安全加固建议

### 1. 使用非 root 用户运行
✅ 已在 Dockerfile 中实现

### 2. 限制容器权限
```yaml
# 在 docker-compose.yml 中添加
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
cap_add:
  - NET_BIND_SERVICE
```

### 3. 网络隔离
```yaml
# 仅允许必要端口
ports:
  - "127.0.0.1:3001:3001"  # 仅本地访问后端
  - "80:80"                  # 对外开放前端
```

### 4. 只读文件系统（生产环境）
```dockerfile
# 在运行时添加只读挂载
volumes:
  - ./backend/service-account.json:/app/service-account.json:ro
```

## 📈 性能优化

### 1. 多阶段构建减小镜像大小
✅ 已实现（最终镜像约 150MB vs 800MB+）

### 2. 使用 .dockerignore
```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
docs
coverage
.vscode
.idea
*.log
.DS_Store
Thumbs.db
service-account.json
```

### 3. 启用 Nginx Gzip 压缩
✅ 已在 nginx.conf 中配置

---

**🎯 推荐的生产环境配置：**
- CPU：2核+
- 内存：512MB-1GB
- 存储：20GB SSD（用于日志和数据）
- 网络：100Mbps+

**💰 云服务器推荐：**
- 阿里云 ECS（2核4G）：约 200元/月
- 腾讯云 CVM（2核4G）：约 180元/月
- 华为云 ECS（2核4G）：约 190元/月