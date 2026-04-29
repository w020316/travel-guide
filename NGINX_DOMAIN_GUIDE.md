# Nginx 反向代理 + 自定义域名绑定完整指南

## 🌐 方案一：Nginx 反向代理（推荐）

### 1. 安装 Nginx

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

**CentOS/RHEL:**
```bash
sudo yum install epel-release -y
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. 配置反向代理

创建配置文件：
```bash
sudo nano /etc/nginx/sites-available/travel-guide
```

粘贴以下内容（根据你的域名修改）：

```nginx
# 旅游攻略生成器 - 生产环境 Nginx 配置
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # 替换为你的域名

    # 重定向到 HTTPS（可选，如果配置了 SSL）
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书路径（使用 Let's Encrypt 免费证书）
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 安全配置
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # 现代 SSL 协议
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS（强制 HTTPS）
    add_header Strict-Transport-Security "max-age=63072000" always;

    # 根目录指向前端静态文件
    root /var/www/travel-guide/frontend;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        text/plain
        text/css
        text/xml
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 静态资源缓存策略
    location ~* \.(jpg|jpeg|png|gif|ico|webp|svg|woff|woff2|ttf|eot)$ {
        expires 90d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }

    # API 代理到后端 Node.js 服务
    location /api/ {
        proxy_pass http://127.0.0.1:3001;  # 后端服务地址
        
        # 传递真实 IP
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如果需要实时功能）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时设置（AI 生成可能需要较长时间）
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;

        # 缓冲区设置（适合大响应）
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Firebase 认证回调（如果使用）
    location /auth/callback {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SPA 路由支持（所有未匹配的请求返回 index.html）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PWA Service Worker（不缓存）
    location = /sw.js {
        expires off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://www.gstatic.com https://aframe.io https://raw.githack.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:;" always;

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 日志配置
    access_log /var/log/nginx/travel-guide.access.log;
    error_log /var/log/nginx/travel-guide.error.log;
}
```

### 3. 启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/travel-guide /etc/nginx/sites-enabled/

# 测试配置语法
sudo nginx -t

# 重载 Nginx 使配置生效
sudo systemctl reload nginx
```

## 🔒 方案二：Let's Encrypt 免费 SSL 证书（强烈推荐）

### 安装 Certbot

**Ubuntu/Debian:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**CentOS/RHEL:**
```bash
sudo yum install certbot python3-certbot-nginx -y
```

### 申请免费 SSL 证书

```bash
# 自动申请并配置证书（会自动修改 Nginx 配置）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按提示输入：
# 1. 输入邮箱地址
# 2. 同意服务条款 (Y)
# 3. 选择是否重定向 HTTP 到 HTTPS (推荐选 2 - 强制重定向)

# 测试自动续期
sudo certbot renew --dry-run
```

Certbot 会自动：
✅ 修改 Nginx 配置添加 SSL 设置
✅ 创建定时任务自动续期证书（每 90 天）
✅ 配置 HTTP 到 HTTPS 的 301 重定向

## 🌍 方案三：自定义域名 DNS 配置

### 步骤 1：购买域名

推荐域名注册商：
- **国内**: 阿里云、腾讯云、新网、万网
- **国际**: Namecheap、GoDaddy、Cloudflare

价格参考：
- .com 域名：约 50-70 元/年
- .cn 域名：约 30 元/年
- .top/.xyz：首年通常 1 元起

### 步骤 2：配置 DNS 解析记录

登录你的域名注册商控制台，添加以下记录：

#### A 记录（将域名解析到服务器 IP）
```
类型: A
主机记录: @
记录值: 你的服务器公网IP（如 123.45.67.89）
TTL: 600

类型: A
主机记录: www
记录值: 你的服务器公网IP（如 123.45.67.89）
TTL: 600
```

#### CNAME 记录（可选，用于 CDN 加速）
```
类型: CNAME
主机记录: cdn
记录值: your-cdn-provider.com
TTL: 3600
```

#### MX 记录（如果需要企业邮箱）
```
类型: MX
主机记录: @
记录值: mail.your-email-provider.com
优先级: 10
TTL: 3600
```

### 步骤 3：DNS 生效验证

```bash
# 在本地测试 DNS 解析
nslookup your-domain.com
ping your-domain.com

# 或使用在线工具检测
# https://dnschecker.org/
# https://whatsmydns.net/

# DNS 通常需要几分钟到 24 小时全球生效
```

## 🚀 完整部署流程（从零开始）

### 阶段 1：准备云服务器

1. **购买云服务器**（推荐配置）:
   - CPU：2核
   - 内存：4GB
   - 存储：40GB SSD
   - 带宽：5Mbps
   - 系统：Ubuntu 22.04 LTS
   
   **推荐厂商及价格**：
   - 阿里云 ECS（2核4G）：约 200元/月
   - 腾讯云 CVM（2核4G）：约 180元/月
   - 华为云 ECS（2核4G）：约 190元/月
   - DigitalOcean（2GB）：$12/月（海外访问快）

2. **安全组/防火墙规则**：
   ```
   入站规则：
   - TCP 80    HTTP（前端）
   - TCP 443   HTTPS（SSL）
   - TCP 22    SSH（管理用）
   
   出站规则：
   - 全部允许
   ```

### 阶段 2：安装环境依赖

SSH 登录到你的服务器后执行：

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装必要软件
sudo apt install -y nginx git curl wget build-essential

# 3. 安装 Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. 验证安装
node -v   # 应显示 v18.x.x
npm -v    # 应显示 9.x.x
nginx -v  # 应显示版本号
```

### 阶段 3：克隆项目代码

```bash
# 克隆项目
cd /var/www
sudo git clone https://github.com/w020316/travel-guide.git
cd travel-guide

# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑环境变量（填入真实 API Key）
nano backend/.env
```

### 阶段 4：安装后端依赖并启动

```bash
# 进入后端目录
cd backend

# 安装生产依赖
npm ci --production

# 使用 PM2 启动（推荐）或直接启动
sudo npm install -g pm2
pm2 start ecosystem.config.js --env production

# 或者直接运行（简单方式）
# NODE_ENV=production nohup node server.js > ../logs/app.log 2>&1 &

# 验证服务是否正常
curl http://localhost:3001/health
```

### 阶段 5：配置 Nginx 和域名

```bash
# 复制 Nginx 配置文件
sudo cp /var/www/travel-guide/nginx.conf /etc/nginx/sites-available/travel-guide

# 编辑配置文件，替换域名为你的实际域名
sudo nano /etc/nginx/sites-available/travel-guide

# 启用站点
sudo ln -s /etc/nginx/sites-available/travel-guide /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # 删除默认站点

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 阶段 6：申请 SSL 证书

```bash
# 确保 80 端口已开放且域名已解析到服务器 IP

# 申请 Let's Encrypt 免费证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按照提示操作即可
```

### 阶段 7：设置 PM2 开机自启

```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成开机自启脚本
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# 执行生成的命令（复制输出并执行）
# 例如：sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

## 📊 监控和维护

### PM2 监控命令

```bash
# 查看进程状态
pm2 status

# 查看日志
pm2 logs travel-guide-api

# 监控面板（Web界面）
pm2 plus

# 重启应用
pm2 restart all

# 查看 CPU/内存使用
pm2 monit
```

### Nginx 日志查看

```bash
# 实时查看访问日志
tail -f /var/log/nginx/travel-guide.access.log

# 查看错误日志
tail -f /var/log/nginx/travel-guide.error.log

# 统计访问量
awk '{print $1}' /var/log/nginx/travel-guide.access.log | sort | uniq -c | sort -nr | head
```

### 性能优化建议

1. **启用 Gzip 压缩** ✅ 已在 Nginx 配置中实现
2. **启用 HTTP/2** ✅ 已在 Nginx 配置中实现
3. **启用 Brotli 压缩**（可选，需要编译支持）
4. **配置 CDN**（如 Cloudflare，可加速全球访问）
5. **启用缓存头** ✅ 已在 Nginx 配置中实现

## ⚠️ 常见问题排查

### 问题 1：502 Bad Gateway
**原因**：后端 Node.js 服务未启动或崩溃
**解决**：
```bash
# 检查后端服务状态
curl http://localhost:3001/health

# 如果无响应，重启后端
pm2 restart travel-guide-api

# 查看 PM2 日志排查错误
pm2 logs travel-guide-api --lines 100
```

### 问题 2：域名无法访问
**原因**：DNS 未生效或防火墙未开放端口
**解决**：
```bash
# 检查 DNS 是否解析正确
nslookup your-domain.com

# 检查防火墙
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 问题 3：SSL 证书错误
**原因**：证书过期或配置错误
**解决**：
```bash
# 手动续期证书
sudo certbot renew

# 强制更新证书
sudo certbot certonly --force-renewal -d your-domain.com

# 检查证书有效期
openssl s_client -connect your-domain.com:443 -servername your-domain.com | openssl x509 -dates -noout
```

---

## 💡 高级优化（可选）

### 1. Cloudflare CDN 加速（推荐）
1. 注册 Cloudflare 账号（免费版即可）
2. 添加你的域名
3. 按照 Cloudflare 提示修改 NS 服务器
4. 开启以下功能：
   - Auto Minify（压缩 HTML/CSS/JS）
   - Brotli 压缩
   - Rocket Loader（加速 JS 加载）
   - Always Online™（源站宕机时提供缓存版本）
   - HSTS

### 2. 负载均衡（多服务器部署）
```nginx
upstream backend_servers {
    server 127.0.0.1:3001 weight=3;  # 主服务器权重高
    server 127.0.0.1:3002 weight=1;  # 备用服务器
    keepalive 32;
}

server {
    location /api/ {
        proxy_pass http://backend_servers;
        ...
    }
}
```

### 3. 限流保护（防止 DDoS）
```nginx
# 在 http {} 块中添加
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    ...
}
```

---

## 🎉 部署完成检查清单

完成以下步骤后，你的应用就可以通过自定义域名访问了：

- [ ] 购买域名并完成实名认证
- [ ] 配置 DNS A 记录指向服务器 IP
- [ ] 云服务器安全组开放 80、443 端口
- [ ] SSH 登录服务器并安装 Node.js/Nginx/PM2
- [ ] 克隆项目代码并配置 .env 文件
- [ ] 启动后端服务（PM2 或直接运行）
- [ ] 配置 Nginx 反向代理
- [ ] 申请 SSL 证书（Let's Encrypt）
- [ ] 通过浏览器访问 `https://your-domain.com` 测试
- [ ] 配置 PM2 开机自启
- [ ] （可选）配置 Cloudflare CDN

**预计总耗时：1-3 小时（首次部署）**

**后续维护：**
- 每月检查一次 SSL 证书续期情况
- 定期更新系统包和安全补丁
- 监控服务器资源使用率
- 定期备份数据库和重要文件

🎊 **恭喜！你的旅游攻略生成器现在已经是一个真正的企业级 Web 应用了！**