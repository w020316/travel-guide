// 输入验证中间件
function validateCityName(req, res, next) {
  const cityName = req.params.name || req.body.name;
  
  if (!cityName || typeof cityName !== 'string') {
    return res.status(400).json({ success: false, error: '城市名称不能为空' });
  }
  
  // 限制长度
  if (cityName.length > 50) {
    return res.status(400).json({ success: false, error: '城市名称过长' });
  }
  
  // 只允许中文、英文字母、数字和部分特殊字符
  const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]+$/;
  if (!validPattern.test(cityName)) {
    return res.status(400).json({ success: false, error: '城市名称包含非法字符' });
  }
  
  // 清理输入
  req.params.name = cityName.trim();
  if (req.body.name) {
    req.body.name = cityName.trim();
  }
  
  next();
}

// 安全修复 P0-4：城市数据字段白名单校验，防止任意字段注入与原型污染
const ALLOWED_CITY_FIELDS = new Set([
  'name', 'title', 'season', 'days', 'tags', 'foods', 'routes',
  'itineraries', 'poster', 'description', 'bestTime', 'tips',
  'budget', 'transportation', 'accommodations', 'reservations',
  'photoSpots', 'weather', 'image', 'popularity'
]);

function validateCityPayload(req, res, next) {
  const body = req.body || {};
  const cleaned = {};
  const rejected = [];

  for (const key of Object.keys(body)) {
    // 拒绝原型污染相关字段
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      rejected.push(key);
      continue;
    }
    if (ALLOWED_CITY_FIELDS.has(key)) {
      cleaned[key] = body[key];
    } else {
      rejected.push(key);
    }
  }

  if (rejected.length > 0) {
    console.warn(`[validateCityPayload] 拒绝字段: ${rejected.join(', ')}`);
  }

  // 必填字段检查（仅 POST 新增时强制）
  if (req.method === 'POST' && !cleaned.name) {
    return res.status(400).json({ success: false, error: '城市名称不能为空' });
  }

  // 名称长度与字符校验
  if (cleaned.name) {
    if (typeof cleaned.name !== 'string' || cleaned.name.length > 50) {
      return res.status(400).json({ success: false, error: '城市名称过长' });
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]+$/.test(cleaned.name)) {
      return res.status(400).json({ success: false, error: '城市名称包含非法字符' });
    }
    cleaned.name = cleaned.name.trim();
  }

  req.body = cleaned;
  next();
}

// 验证搜索关键字（修复 P3-7：增加字符白名单）
function validateSearchQuery(req, res, next) {
  const keyword = req.query.keyword;

  if (keyword) {
    if (typeof keyword !== 'string' || keyword.length > 100) {
      return res.status(400).json({ success: false, error: '搜索关键字过长' });
    }
    // 允许中文、字母、数字、空格与常用标点
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9·\-\s,，。、！？]+$/.test(keyword)) {
      return res.status(400).json({ success: false, error: '搜索关键字包含非法字符' });
    }
  }

  next();
}

// P1 修复 4.5/4.6/4.7/4.8：通用 ID 校验（用于 cityId/targetId/userId/commentId）
// 限制为字母数字+下划线+连字符，长度 1-64，防止 Firestore 集合名/文档 ID 注入
function validateIdParam(fieldName) {
  return (req, res, next) => {
    const value = req.params[fieldName];
    if (!value) {
      return res.status(400).json({ success: false, error: `缺少参数: ${fieldName}` });
    }
    if (!/^[a-zA-Z0-9_\-]{1,64}$/.test(value)) {
      return res.status(400).json({ success: false, error: `${fieldName} 格式非法` });
    }
    next();
  };
}

// v10.9.3 修复 P1-3：城市名 ID 校验（用于 cities 类型的 targetId/cityId）
// 原 validateIdParam 拒绝中文，导致评论/点赞/浏览统计对中文城市（核心场景）失效
// 此中间件允许中文城市名（与 validateCityName 一致），仍限制长度防 XSS
const CITY_NAME_ID_REGEX = /^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]{1,30}$/;
function validateCityIdParam(fieldName) {
  return (req, res, next) => {
    const value = req.params[fieldName];
    if (!value) {
      return res.status(400).json({ success: false, error: `缺少参数: ${fieldName}` });
    }
    if (!CITY_NAME_ID_REGEX.test(value)) {
      return res.status(400).json({ success: false, error: `${fieldName} 格式非法` });
    }
    next();
  };
}

// v10.9.3 修复 P1-3：根据 targetType 动态选择校验规则
// cities 类型用中文城市名校验；comments/guides 类型用严格 ID 校验
function validateTargetIdByType(targetIdField) {
  return (req, res, next) => {
    const { type } = req.params;
    const value = req.params[targetIdField];
    if (!value) {
      return res.status(400).json({ success: false, error: `缺少参数: ${targetIdField}` });
    }
    if (type === 'cities') {
      // 城市名允许中文
      if (!CITY_NAME_ID_REGEX.test(value)) {
        return res.status(400).json({ success: false, error: `${targetIdField} 格式非法` });
      }
    } else {
      // comments/guides 用严格 ID
      if (!/^[a-zA-Z0-9_\-]{1,64}$/.test(value)) {
        return res.status(400).json({ success: false, error: `${targetIdField} 格式非法` });
      }
    }
    next();
  };
}

// P1 修复 4.5：评论内容校验（长度 1-2000，允许常见中文标点）
// v10.9.3 修复 P1-3：cityId 允许中文城市名（评论的核心场景是按城市查看）
function validateCommentPayload(req, res, next) {
  const { cityId, content, parentId } = req.body || {};

  if (!cityId || typeof cityId !== 'string') {
    return res.status(400).json({ success: false, error: '城市ID不能为空' });
  }
  // v10.9.3：cityId 允许中文城市名（与 validateCityName 一致）
  if (!CITY_NAME_ID_REGEX.test(cityId)) {
    return res.status(400).json({ success: false, error: 'cityId 格式非法' });
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ success: false, error: '评论内容不能为空' });
  }
  if (content.length > 2000) {
    return res.status(400).json({ success: false, error: '评论内容过长（最多 2000 字符）' });
  }

  if (parentId !== undefined && parentId !== null) {
    if (typeof parentId !== 'string' || !/^[a-zA-Z0-9_\-]{1,64}$/.test(parentId)) {
      return res.status(400).json({ success: false, error: 'parentId 格式非法' });
    }
  }

  // 清理 content 两端空白
  req.body.content = content.trim();
  next();
}

// P1 修复 4.6/4.8：目标类型白名单校验（用于 /likes/:type/... 和 /views/:type/...）
const VALID_TARGET_TYPES = new Set(['cities', 'comments', 'guides']);
function validateTargetType(req, res, next) {
  const { type } = req.params;
  if (!VALID_TARGET_TYPES.has(type)) {
    return res.status(400).json({ success: false, error: '无效的目标类型' });
  }
  next();
}

// P1 修复 4.3：JWT 格式校验（三段式 base64url）
function validateIdToken(req, res, next) {
  const { idToken } = req.body || {};
  if (!idToken || typeof idToken !== 'string') {
    return res.status(400).json({ success: false, error: '请提供Firebase ID Token' });
  }
  // JWT 三段式 header.payload.signature，每段为 base64url 编码
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(idToken)) {
    return res.status(400).json({ success: false, error: 'ID Token 格式非法' });
  }
  if (idToken.length > 8192) {
    return res.status(400).json({ success: false, error: 'ID Token 过长' });
  }
  next();
}

// P1 修复 4.4：用户资料 payload 白名单校验
function validateProfilePayload(req, res, next) {
  const body = req.body || {};
  const cleaned = {};
  const allowed = ['displayName', 'photoURL'];

  for (const key of Object.keys(body)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (allowed.includes(key)) {
      cleaned[key] = body[key];
    }
  }

  if (cleaned.displayName !== undefined) {
    if (typeof cleaned.displayName !== 'string' || cleaned.displayName.length > 50) {
      return res.status(400).json({ success: false, error: 'displayName 长度需 ≤ 50' });
    }
  }
  if (cleaned.photoURL !== undefined) {
    if (typeof cleaned.photoURL !== 'string' || cleaned.photoURL.length > 2048) {
      return res.status(400).json({ success: false, error: 'photoURL 格式非法' });
    }
    // 简单 URL 协议校验
    if (!/^https?:\/\//.test(cleaned.photoURL)) {
      return res.status(400).json({ success: false, error: 'photoURL 必须以 http(s):// 开头' });
    }
  }

  req.body = cleaned;
  next();
}

// P1 修复 4.2：批量城市名校验（用于 /ai/generate-batch）
function validateCitiesArray(req, res, next) {
  const { cities } = req.body || {};
  if (!Array.isArray(cities) || cities.length === 0) {
    return res.status(400).json({ success: false, error: '请提供城市列表' });
  }
  if (cities.length > 5) {
    return res.status(400).json({ success: false, error: '单次最多生成5个城市的攻略' });
  }
  const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]{1,30}$/;
  for (const c of cities) {
    if (typeof c !== 'string' || !validPattern.test(c.trim())) {
      return res.status(400).json({ success: false, error: `城市名称包含非法字符或过长: ${String(c).slice(0, 20)}` });
    }
  }
  // 清理空白
  req.body.cities = cities.map(c => c.trim());
  next();
}

// P1 修复 4.1：AI 接口 city 字段校验（用于 /ai/edit-photo 等无中间件路由）
function validateCityBody(req, res, next) {
  const { city } = req.body || {};
  if (!city || typeof city !== 'string' || !city.trim()) {
    return res.status(400).json({ success: false, error: '请提供城市名称' });
  }
  const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]{1,30}$/;
  if (!validPattern.test(city.trim())) {
    return res.status(400).json({ success: false, error: '城市名称包含非法字符或过长（最多 30 字符）' });
  }
  req.body.city = city.trim();
  next();
}

// 验证分页参数
function validatePagination(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ success: false, error: '分页参数无效' });
  }
  
  req.pagination = { page, limit };
  next();
}

// 限流中间件（修复 P1-1：收紧默认阈值 + Map 上限保护，避免内存无限增长）
const RATE_LIMIT_MAX_ENTRIES = 10000;
const requestCounts = new Map();

function rateLimiter(maxRequests = 60, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || (req.socket && req.socket.remoteAddress) || 'unknown';
    const now = Date.now();
    
    // Map 上限保护：超过阈值时清空最旧的一半记录，防止 IPv6 攻击下内存爆炸
    if (requestCounts.size > RATE_LIMIT_MAX_ENTRIES) {
      const entries = [...requestCounts.entries()].sort((a, b) => a[1].startTime - b[1].startTime);
      for (let i = 0; i < entries.length / 2; i++) {
        requestCounts.delete(entries[i][0]);
      }
    }
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, startTime: now });
      return next();
    }
    
    const record = requestCounts.get(ip);
    
    if (now - record.startTime > windowMs) {
      requestCounts.set(ip, { count: 1, startTime: now });
      return next();
    }
    
    if (record.count >= maxRequests) {
      res.setHeader('Retry-After', Math.ceil((windowMs - (now - record.startTime)) / 1000));
      return res.status(429).json({ success: false, error: '请求过于频繁，请稍后再试' });
    }
    
    record.count++;
    next();
  };
}

// 定期清理限流记录
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.startTime > 60000) {
      requestCounts.delete(ip);
    }
  }
}, 60000);
cleanupTimer.unref?.();

// 错误处理中间件（修复 P1-9：脱敏日志 + 按错误类型映射状态码）
function errorHandler(err, req, res, next) {
  // 按 error 类型映射 HTTP 状态码
  let status = 500;
  let message = '服务器内部错误';
  
  if (err && err.name === 'ValidationError') {
    status = 400;
    message = err.message || '请求参数无效';
  } else if (err && err.name === 'UnauthorizedError') {
    status = 401;
    message = '认证失败';
  } else if (err && (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED')) {
    status = 503;
    message = '上游服务不可用';
  } else if (err && err.message && err.message.includes('Not allowed by CORS')) {
    status = 403;
    message = '跨源请求被拒绝';
  }
  
  // 脱敏日志：避免打印完整请求体或 stack trace 到 stdout
  const safeLog = {
    msg: err && err.message ? err.message : String(err),
    name: err && err.name,
    code: err && err.code,
    path: req && req.path,
    method: req && req.method,
    ip: req && req.ip
  };
  console.error('[errorHandler]', JSON.stringify(safeLog));
  
  res.status(status).json({
    success: false,
    error: message,
    // 仅开发环境返回详细错误
    details: process.env.NODE_ENV === 'development' ? (err && err.message) : undefined
  });
}

module.exports = {
  validateCityName,
  validateCityPayload,
  validateSearchQuery,
  validatePagination,
  rateLimiter,
  errorHandler,
  // v10.9 新增校验中间件
  validateIdParam,
  validateCommentPayload,
  validateTargetType,
  validateIdToken,
  validateProfilePayload,
  validateCitiesArray,
  validateCityBody,
  VALID_TARGET_TYPES,
  // v10.9.3 新增：支持中文城市名的校验中间件（修复 P1-3）
  validateCityIdParam,
  validateTargetIdByType
};
