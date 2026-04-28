const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
const jwt = require('jsonwebtoken');

// Firebase配置（从环境变量读取）
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "travel-guide-app.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "travel-guide-app",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "travel-guide-app.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// 初始化Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.tokenExpiry = '7d';
  }

  // 验证Firebase ID Token并生成自定义JWT
  async verifyAndCreateToken(idToken) {
    try {
      // 验证Firebase token
      const decodedToken = await auth.verifyIdToken(idToken);
      
      // 创建自定义JWT（包含额外信息）
      const customToken = jwt.sign(
        {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          name: decodedToken.name || '',
          photoURL: decodedToken.picture || '',
          provider: decodedToken.firebase.sign_in_provider,
          role: 'user', // 默认角色
          iat: Math.floor(Date.now() / 1000)
        },
        this.jwtSecret,
        { expiresIn: this.tokenExpiry }
      );

      return {
        success: true,
        token: customToken,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || '',
          photoURL: decodedToken.picture || ''
        }
      };

    } catch (error) {
      console.error('Token验证失败:', error);
      throw new Error('无效的认证令牌');
    }
  }

  // 验证自定义JWT中间件
  verifyCustomToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: '未提供认证令牌' 
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          error: '认证令牌已过期，请重新登录' 
        });
      }
      return res.status(401).json({ 
        success: false, 
        error: '无效的认证令牌' 
      });
    }
  }

  // 可选认证中间件（不强制要求登录）
  optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, this.jwtSecret);
        req.user = decoded;
      } catch (error) {
        // 忽略错误，继续执行
        req.user = null;
      }
    } else {
      req.user = null;
    }
    
    next();
  }

  // 管理员权限检查
  requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: '需要管理员权限' 
      });
    }
    next();
  }

  // 获取用户信息
  getUserInfo(uid) {
    return auth.getUser(uid)
      .then(userRecord => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime
      }))
      .catch(error => {
        console.error('获取用户信息失败:', error);
        throw error;
      });
  }

  // 更新用户资料
  async updateProfile(uid, updates) {
    try {
      await auth.updateUser(uid, {
        displayName: updates.displayName || undefined,
        photoURL: updates.photoURL || undefined
      });
      
      return { success: true, message: '用户资料更新成功' };
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  }

  // 创建自定义JWT（用于测试或特殊场景）
  createTestToken(userData) {
    return jwt.sign(
      {
        ...userData,
        iat: Math.floor(Date.now() / 1000)
      },
      this.jwtSecret,
      { expiresIn: this.tokenExpiry }
    );
  }
}

module.exports = new AuthService();