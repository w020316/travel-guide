{
  "apps": [{
    "name": "travel-guide-api",
    "script": "server.js",
    "cwd": "./backend",
    "instances": 2,  // 集群模式，启动2个实例
    "exec_mode": "cluster",  // 使用 cluster 模式提高性能
    
    // 环境变量
    "env": {
      "NODE_ENV": "production",
      "PORT": 3001,
      "AI_PROVIDER": "tongyi"
    },
    
    // 日志配置
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "error_file": "./logs/error.log",
    "out_file": "./logs/out.log",
    "merge_logs": true,
    
    // 自动重启配置
    "autorestart": true,  // 崩溃后自动重启
    "max_restarts": 10,   // 最大重启次数（10次/分钟）
    "restart_delay": 4000, // 重启延迟4秒
    
    // 内存和CPU限制
    "max_memory_restart": '500M',  // 内存超过500MB自动重启
    
    // 监控配置
    "watch": false,  // 生产环境不使用 watch 模式
    
    // 启动时序
    "wait_ready": true,
    "listen_timeout": 10000,
    
    // 健康检查
    "health_check_grace_period": 5000,
    
    // 集群模式配置
    "instance_var": "INSTANCE_ID",
    
    // 优雅关闭
    "kill_timeout": 5000,
    "kill_signal": "SIGINT",
    
    // 开发环境配置（覆盖）
    "env_production": {
      "NODE_ENV": "production",
      "AI_PROVIDER": "tongyi",
      "TONGYI_API_KEY": "${TONGYI_API_KEY}",
      "ZHIPU_API_KEY": "${ZHIPU_API_KEY}",
      "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}",
      "FIREBASE_API_KEY": "${FIREBASE_API_KEY}",
      "FIREBASE_PROJECT_ID": "${FIREBASE_PROJECT_ID}"
    }
  }],
  
  // PM2 部署配置
  "deploy": {
    "production": {
      "user": "nodejs",
      "host": "your-server-ip",
      "ref": "origin/main",
      "repo": "https://github.com/w020316/travel-guide.git",
      "path": "/var/www/travel-guide",
      "pre-deploy-local": "",
      "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}