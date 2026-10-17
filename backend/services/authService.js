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

    // v11.4 修复（严重，随 SEC-2 集成测试发现）：中间件方法以「裸函数引用」传给 express
    // （如 router.post(path, authService.verifyCustomToken)），express 以 fn(req,res,next)
    // 调用，this 不再指向实例 → this.jwtSecret 为 undefined → jwt.verify 抛
    // 「secret or public key must be provided」→ 所有携带有效 token 的请求被判「无效」401。
    // 由于生产未配置 Firebase（无法签发 token），该缺陷长期被掩盖（auth 整体不可用）。
    // 绑定实例上下文后，认证与管理员角色在真实请求中方可生效（SEC-2/SEC-3 闭环的前提）。
    this.verifyCustomToken = this.verifyCustomToken.bind(this);
    this.optionalAuth = this.optionalAuth.bind(this);
    this.requireAdmin = this.requireAdmin.bind(this);
  }

  /**
   * v11.4（SEC-3）：按环境变量 ADMIN_UIDS 解析用户角色
   * ADMIN_UIDS 为逗号分隔的 Firebase UID 白名单；命中 → 'admin'，否则 → 'user'。
   * 实时读取 process.env（而非构造期缓存），便于测试注入与运行时配置。
   * @param {string} uid - Firebase 用户 UID
   * @returns {'admin'|'user'}
   */
  _resolveRole(uid) {
    const adminUids = (process.env.ADMIN_UIDS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    return adminUids.includes(String(uid)) ? 'admin' : 'user';
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
          // v11.4 修复 SEC-3（P2）：原恒定写入 role:'user'，导致全站 requireAdmin 端点在
          // 生产永远 403（权限模型名存实亡）。改为按环境变量 ADMIN_UIDS（逗号分隔 UID 白名单）
          // 判定：命中 → admin，否则 user。函数内实时读取 process.env，便于测试注入。
          role: this._resolveRole(decodedToken.uid),
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
      // v10.9.3 修复 P1-4：显式限制 JWT 算法为 HS256，避免 alg=none 降级攻击
      const decoded = jwt.verify(token, this.jwtSecret, { algorithms: ['HS256'] });
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
        // v10.9.3 修复 P1-4：与 verifyCustomToken 一致，限制算法为 HS256
        const decoded = jwt.verify(token, this.jwtSecret, { algorithms: ['HS256'] });
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

/**
 * 仅供单元测试使用：注入/替换内部 firebase auth 实例（生产不使用）
 * 用于验证 verifyAndCreateToken 的真实签发路径（role 归属）。
 * @param {Object|null} fakeAuth - 需提供 verifyIdToken(idToken)；传 null 复位
 */
function __setAuthForTest(fakeAuth) {
  auth = fakeAuth;
}

module.exports = new AuthService();
module.exports.__setAuthForTest = __setAuthForTest;