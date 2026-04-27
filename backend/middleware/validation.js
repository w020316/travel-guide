// 输入验证中间件
function validateCityName(req, res, next) {
  const cityName = req.params.name || req.body.name;
  
  if (!cityName || typeof cityName !== 'string') {
    return res.status(400).json({ error: '城市名称不能为空' });
  }
  
  // 限制长度
  if (cityName.length > 50) {
    return res.status(400).json({ error: '城市名称过长' });
  }
  
  // 只允许中文、英文字母、数字和部分特殊字符
  const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]+$/;
  if (!validPattern.test(cityName)) {
    return res.status(400).json({ error: '城市名称包含非法字符' });
  }
  
  // 清理输入
  req.params.name = cityName.trim();
  if (req.body.name) {
    req.body.name = cityName.trim();
  }
  
  next();
}

// 验证搜索关键字
function validateSearchQuery(req, res, next) {
  const keyword = req.query.keyword;
  
  if (keyword && (typeof keyword !== 'string' || keyword.length > 100)) {
    return res.status(400).json({ error: '搜索关键字过长' });
  }
  
  next();
}

// 验证分页参数
function validatePagination(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ error: '分页参数无效' });
  }
  
  req.pagination = { page, limit };
  next();
}

// 限流中间件
const requestCounts = new Map();

function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
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
      return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
    }
    
    record.count++;
    next();
  };
}

// 定期清理限流记录
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.startTime > 60000) {
      requestCounts.delete(ip);
    }
  }
}, 60000);

// 错误处理中间件
function errorHandler(err, req, res, next) {
  console.error('未捕获的错误:', err);
  
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = {
  validateCityName,
  validateSearchQuery,
  validatePagination,
  rateLimiter,
  errorHandler
};
