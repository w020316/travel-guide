const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { logError } = require('../utils/safeLog');

// P1 修复 5.1：移除所有 Firebase 默认占位配置，避免泄露项目命名约定
// 必须通过环境变量配置；未配置时不初始化 Firebase，auth 操作会走 catch 分支返回错误
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || ''
};

// P1 修复 5.1（续）：仅当 apiKey 配置完整时才初始化 Firebase
// 空字符串会导致 Firebase 抛出 auth/invalid-api-key 错误，阻止进程启动
let auth = null;
let firebaseInitialized = false;
if (!firebase.apps.length && firebaseConfig.apiKey) {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    firebaseInitialized = true;
  } catch (err) {
    console.error('Firebase 初始化失败（请检查 FIREBASE_* 环境变量）:', err.message);
  }
} else if (!firebaseConfig.apiKey) {
  console.warn('⚠️ FIREBASE_API_KEY 未配置，认证功能将不可用（其他功能正常）');
}

class AuthService {
  constructor() {
    // 安全修复 P0-1：生产环境强制要求显式配置 JWT_SECRET
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ JWT_SECRET 未配置或长度不足 32 字符，拒绝在生产环境启动');
        process.exit(1);
      } else {
        // P1 修复 5.2：开发环境用随机密钥（每次重启变化），避免固定字符串被复用至生产
        // 随机密钥无法跨进程复用，但开发环境单进程可接受
        this.jwtSecret = crypto.randomBytes(32).toString('hex');
        console.warn('⚠️ JWT_SECRET 未配置，使用本次启动随机密钥。生产环境必须显式配置！');
      }
    } else {
      this.jwtSecret = secret;
    }
    this.tokenExpiry = process.env.JWT_TOKEN_EXPIRY || '7d';
  }

  // 验证Firebase ID Token并生成自定义JWT
  async verifyAndCreateToken(idToken) {
    try {
      // P1 修复 5.1：Firebase 未配置时直接返回错误，不崩溃
      if (!auth) {
        throw new Error('认证服务未配置（FIREBASE_API_KEY 缺失）');
      }
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
      // P1 修复 8.1：日志脱敏，避免打印 Firebase Admin 完整错误对象
      logError('AuthService.verifyAndCreateToken', error);
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
    // P1 修复 5.1：Firebase 未配置时返回错误
    if (!auth) {
      return Promise.reject(new Error('认证服务未配置（FIREBASE_API_KEY 缺失）'));
    }
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
        // P1 修复 8.2：日志脱敏
        logError('AuthService.getUserInfo', error, { userId: uid });
        throw error;
      });
  }

  // 更新用户资料
  async updateProfile(uid, updates) {
    try {
      // P1 修复 5.1：Firebase 未配置时返回错误
      if (!auth) {
        throw new Error('认证服务未配置（FIREBASE_API_KEY 缺失）');
      }
      await auth.updateUser(uid, {
        displayName: updates.displayName || undefined,
        photoURL: updates.photoURL || undefined
      });

      return { success: true, message: '用户资料更新成功' };
    } catch (error) {
      // P1 修复 8.3：日志脱敏
      logError('AuthService.updateProfile', error, { userId: uid });
      throw error;
    }
  }

  // 创建自定义JWT（仅限开发/测试场景，生产环境禁用）
  createTestToken(userData) {
    // 安全修复 P0-5：纵深防御，即便误配 NODE_ENV 也拒绝在生产生成测试 token
    if (process.env.NODE_ENV === 'production') {
      throw new Error('测试 token 在生产环境被禁用');
    }
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