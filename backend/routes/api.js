const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const authService = require('../services/authService');
const socialService = require('../services/socialService');
const storage = require('../services/storage');
const { getCityWeather, getRealWeather, startWeatherSync, clearWeatherCache } = require('../services/weatherSync');
const { getTrendingCities, getSeasonalTags } = require('../services/realTimeSync');
const { validateCityName, validateCityPayload, validateSearchQuery, validatePagination, rateLimiter,
  // v10.9 新增校验中间件
  validateIdParam, validateCommentPayload, validateTargetType, validateIdToken, validateProfilePayload, validateCitiesArray, validateCityBody,
  // v10.9.3 新增：支持中文城市名的校验中间件（修复 P1-3）
  validateCityIdParam, validateTargetIdByType
} = require('../middleware/validation');

// 加载扩展城市数据库（627个城市）
const expandedCitiesLoader = require('../data/expandedCitiesLoader');

// 应用限流中间件（修复 P1-1：收紧为 100 次/分钟）
router.use(rateLimiter(100, 60000));

// ==================== AI攻略生成接口 ====================

// 生成旅游攻略（使用AI）
router.post('/ai/generate', authService.optionalAuth, async (req, res) => {
  try {
    const { city, preferences } = req.body;

    if (!city || !city.trim()) {
      return res.status(400).json({
        success: false,
        error: '请提供城市名称'
      });
    }

    const cityName = city.trim();

    // v10.2: 输入安全校验 — 拒绝 HTML/JS 注入
    const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9·\-\s]{1,30}$/;
    if (!validPattern.test(cityName)) {
      return res.status(400).json({
        success: false,
        error: '城市名称包含非法字符或过长（最多 30 字符）'
      });
    }

    // v10.2: 天数边界限制（1-7 天）
    if (preferences && preferences.days !== undefined) {
      const d = Number(preferences.days);
      if (!Number.isFinite(d) || d < 1 || d > 7) {
        preferences.days = 3;
      } else {
        preferences.days = Math.floor(d);
      }
    }

    // 记录浏览统计
    if (req.user) {
      await socialService.recordView('cities', cityName, req.user.uid);
    }

    // 调用AI服务生成攻略
    const guideData = await aiService.generateTravelGuide(cityName, preferences || {});

    // 合并实时数据
    const weather = getCityWeather(cityName);
    if (weather) {
      guideData.currentWeather = weather;
    }

    guideData.seasonalTags = getSeasonalTags(cityName);
    guideData.lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      data: guideData,
      source: guideData.source,
      generatedAt: guideData.generatedAt,
      user: req.user ? { uid: req.user.uid, name: req.user.name } : null
    });

  } catch (error) {
    console.error('AI生成攻略失败:', error);
    res.status(500).json({
      success: false,
      error: '生成攻略失败，请稍后重试',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 批量生成多个城市的攻略
router.post('/ai/generate-batch', authService.verifyCustomToken, validateCitiesArray, async (req, res) => {
  try {
    const { cities, preferences } = req.body;

    // validateCitiesArray 已校验 cities 数组与每个城市名，这里直接使用

    // 并行生成所有城市的攻略
    const results = await Promise.all(
      cities.map(city => 
        aiService.generateTravelGuide(city.trim(), preferences || {})
          .then(data => ({ city, data, success: true }))
          .catch(error => ({ city, error: error.message, success: false }))
      )
    );

    res.json({
      success: true,
      results,
      total: cities.length,
      successful: results.filter(r => r.success).length
    });

  } catch (error) {
    console.error('批量生成失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '批量生成失败' 
    });
  }
});

// 获取AI缓存状态
router.get('/ai/cache', authService.requireAdmin, async (req, res) => {
  try {
    const stats = aiService.getCacheStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取缓存信息失败' });
  }
});

// v10.0: AI 修图建议（基于城市+季节+标签提供专业修图建议）
// v10.9.3 修复 P0-3：加管理员认证，防止匿名消耗 AI 付费配额
router.post('/ai/edit-photo', authService.verifyCustomToken, authService.requireAdmin, validateCityBody, async (req, res) => {
  try {
    const { city, photoName, guideContext } = req.body;
    // validateCityBody 已校验 city 字段
    // 调用 AI 服务获取修图建议
    const advice = await aiService.getPhotoEditAdvice(city, guideContext || {});
    res.json({ success: true, advice });
  } catch (error) {
    console.error('AI 修图建议失败:', error);
    res.status(500).json({ success: false, error: '获取修图建议失败' });
  }
});

// 清除AI缓存
router.delete('/ai/cache', authService.requireAdmin, async (req, res) => {
  try {
    aiService.clearCache();
    res.json({ success: true, message: 'AI缓存已清除' });
  } catch (error) {
    res.status(500).json({ success: false, error: '清除缓存失败' });
  }
});

// ==================== 用户认证接口 ====================

// Firebase登录/注册（获取自定义JWT）
router.post('/auth/login', validateIdToken, async (req, res) => {
  try {
    const { idToken } = req.body;
    // validateIdToken 已校验 idToken 格式

    const result = await authService.verifyAndCreateToken(idToken);

    res.json(result);

  } catch (error) {
    console.error('登录失败:', error);
    res.status(401).json({
      success: false,
      error: error.message || '认证失败'
    });
  }
});

// 获取当前用户信息
router.get('/auth/me', authService.verifyCustomToken, async (req, res) => {
  try {
    const userInfo = await authService.getUserInfo(req.user.uid);
    res.json({ success: true, user: userInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取用户信息失败' });
  }
});

// 更新用户资料
router.put('/auth/profile', authService.verifyCustomToken, validateProfilePayload, async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.uid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: '更新资料失败' });
  }
});

// 测试token（仅开发环境）
if (process.env.NODE_ENV === 'development') {
  router.post('/auth/test-token', (req, res) => {
    try {
      const testUser = {
        uid: 'test_user_123',
        email: 'test@example.com',
        name: '测试用户',
        role: 'admin'
      };

      const token = authService.createTestToken(testUser);
      res.json({ success: true, token, user: testUser });
    } catch (error) {
      // 安全修复 P0-5：createTestToken 在生产环境会抛错，这里兜底
      res.status(403).json({ success: false, error: error.message || '测试 token 不可用' });
    }
  });
}

// ==================== 社交互动接口 ====================

// 添加评论
router.post('/comments', authService.verifyCustomToken, validateCommentPayload, async (req, res) => {
  try {
    const { cityId, content, parentId } = req.body;
    // validateCommentPayload 已校验 cityId/content/parentId

    const result = await socialService.addComment(
      cityId,
      req.user.uid,
      content,
      parentId
    );

    res.json(result);

  } catch (error) {
    console.error('添加评论失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '添加评论失败'
    });
  }
});

// 获取评论列表
// v10.9.3 修复 P1-3：cityId 改用 validateCityIdParam，支持中文城市名
router.get('/comments/:cityId', authService.optionalAuth, validateCityIdParam('cityId'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const result = await socialService.getComments(req.params.cityId, page, limit);
    res.json(result);

  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ success: false, error: '获取评论失败' });
  }
});

// 删除评论
router.delete('/comments/:commentId', authService.verifyCustomToken, validateIdParam('commentId'), async (req, res) => {
  try {
    const result = await socialService.deleteComment(
      req.params.commentId, 
      req.user.uid
    );
    res.json(result);

  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || '删除评论失败' 
    });
  }
});

// 点赞/取消点赞
// v10.9.3 修复 P1-3：targetId 改用 validateTargetIdByType，cities 类型支持中文城市名
router.post('/likes/:type/:targetId', authService.verifyCustomToken, validateTargetType, validateTargetIdByType('targetId'), async (req, res) => {
  try {
    const { type, targetId } = req.params;
    // validateTargetType + validateIdParam 已校验

    const result = await socialService.toggleLike(type, targetId, req.user.uid);
    res.json(result);

  } catch (error) {
    console.error('点赞操作失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || '点赞操作失败' 
    });
  }
});

// 获取用户的点赞列表
router.get('/likes/user', authService.verifyCustomToken, async (req, res) => {
  try {
    const type = req.query.type || null;
    const result = await socialService.getUserLikes(req.user.uid, type);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '获取点赞列表失败' });
  }
});

// 关注/取消关注用户
router.post('/follow/:userId', authService.verifyCustomToken, validateIdParam('userId'), async (req, res) => {
  try {
    const result = await socialService.followUser(req.user.uid, req.params.userId);
    res.json(result);

  } catch (error) {
    console.error('关注操作失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || '关注操作失败' 
    });
  }
});

// 获取粉丝列表
router.get('/followers', authService.verifyCustomToken, async (req, res) => {
  try {
    const result = await socialService.getFollowers(req.user.uid);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '获取粉丝列表失败' });
  }
});

// 获取关注列表
router.get('/following', authService.verifyCustomToken, async (req, res) => {
  try {
    const result = await socialService.getFollowing(req.user.uid);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '获取关注列表失败' });
  }
});

// 记录浏览
// v10.9.3 修复 P1-3：targetId 改用 validateTargetIdByType，cities 类型支持中文城市名
router.post('/views/:type/:targetId', authService.optionalAuth, validateTargetType, validateTargetIdByType('targetId'), async (req, res) => {
  try {
    const { type, targetId } = req.params;
    // validateTargetType + validateIdParam 已校验
    const result = await socialService.recordView(type, targetId, req.user?.uid);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '记录浏览失败' });
  }
});

// 获取浏览统计
// v10.9.3 修复 P1-3：targetId 改用 validateTargetIdByType，cities 类型支持中文城市名
router.get('/stats/views/:type/:targetId', validateTargetType, validateTargetIdByType('targetId'), async (req, res) => {
  try {
    const timeRange = req.query.range || '7d';
    const result = await socialService.getViewStats(
      req.params.type,
      req.params.targetId,
      timeRange
    );
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '获取统计数据失败' });
  }
});

// 获取用户活动时间线
router.get('/activity/timeline', authService.verifyCustomToken, async (req, res) => {
  try {
    // P2 修复 4.13：限制 limit 上限，避免恶意请求拖垮内存
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const result = await socialService.getUserActivityTimeline(req.user.uid, limit);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '获取活动记录失败' });
  }
});

// 获取热门内容排行
router.get('/trending/social', async (req, res) => {
  try {
    const type = req.query.type || 'cities';
    // P1 修复 4.14：白名单校验 type，防止注入 Firestore 集合名
    if (!['cities', 'comments', 'guides'].includes(type)) {
      return res.status(400).json({ success: false, error: '无效的 type 参数' });
    }
    // P2 修复：限制 limit 上限
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const result = await socialService.getTrendingContent(type, limit);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '获取热门内容失败' });
  }
});

// 获取社交系统统计
router.get('/social/stats', authService.requireAdmin, async (req, res) => {
  try {
    const stats = socialService.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取统计信息失败' });
  }
});

// ==================== 城市数据接口（保留原有功能）====================

// 合并实时数据（使用weatherSync的天气服务）
function mergeWithWeather(cityData, cityName) {
  if (!cityData) return cityData;
  
  const updatedData = { ...cityData };
  
  // 添加实时天气
  const weather = getCityWeather(cityName);
  if (weather) {
    updatedData.currentWeather = weather;
  }
  
  // 添加季节性标签
  updatedData.seasonalTags = getSeasonalTags(cityName);
  
  // 最后更新时间
  updatedData.lastUpdated = new Date().toISOString();
  
  return updatedData;
}

// 获取所有城市列表（基础信息，支持分页）
router.get('/cities', validatePagination, async (req, res) => {
  try {
    const cities = await storage.getAllCities();
    const cityList = Object.entries(cities).map(([name, data]) => ({
      name,
      tags: data.tags || [],
      season: data.season || '',
      days: data.days || '',
      poster: data.poster ? { title: data.poster.title, subtitle: data.poster.subtitle } : null
    }));
    
    // 应用分页
    const { page, limit } = req.pagination;
    const start = (page - 1) * limit;
    const paginatedCities = cityList.slice(start, start + limit);
    
    res.json({
      total: cityList.length,
      page,
      limit,
      data: paginatedCities
    });
  } catch (error) {
    console.error('获取城市列表失败:', error);
    res.status(500).json({ error: '获取城市列表失败' });
  }
});

// 获取所有城市详细数据(含实时信息)
// v10.8: 增加可选分页（?page=1&limit=20），避免一次返回 527 城全量数据导致带宽/内存压力
// - 不传分页参数时：返回 legacy 扁平对象 {城市名: 数据}（向后兼容）
// - 传任意 page 或 limit 参数时：返回分页信封 {total, page, limit, data}
router.get('/cities/all', async (req, res) => {
  try {
    const cities = await storage.getAllCities();
    const allEntries = Object.entries(cities);

    // 检测是否为 opt-in 分页模式
    const hasPaginationParam = 'page' in req.query || 'limit' in req.query;
    if (!hasPaginationParam) {
      // 向后兼容：返回扁平对象
      const cityMap = {};
      for (const [name, data] of allEntries) {
        cityMap[name] = mergeWithWeather(data, name);
      }
      return res.json(cityMap);
    }

    // 分页模式
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: '分页参数无效（page>=1, 1<=limit<=100）' });
    }

    const start = (page - 1) * limit;
    const paginatedEntries = allEntries.slice(start, start + limit);
    const cityMap = {};
    for (const [name, data] of paginatedEntries) {
      cityMap[name] = mergeWithWeather(data, name);
    }
    res.json({
      total: allEntries.length,
      page,
      limit,
      data: cityMap
    });
  } catch (error) {
    console.error('获取所有城市数据失败:', error);
    res.status(500).json({ error: '获取所有城市数据失败' });
  }
});

// v10.6: 修复路由顺序 bug — 静态路径必须在 /cities/:name 之前定义
// 否则 /cities/search 会被 :name 参数匹配为 city="search"

// 根据标签搜索城市
router.get('/cities/search/tags', async (req, res) => {
  try {
    const tags = req.query.tags ? req.query.tags.split(',') : [];
    const cities = await storage.getCitiesByTags(tags);
    const cityList = cities.map(city => mergeWithWeather(city, city.name));
    res.json(cityList);
  } catch (error) {
    console.error('标签搜索失败:', error);
    res.status(500).json({ error: '标签搜索失败' });
  }
});

// 关键字搜索城市
router.get('/cities/search', validateSearchQuery, async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    if (!keyword.trim()) {
      return res.status(400).json({ error: '请提供搜索关键字' });
    }
    const cities = await storage.searchCities(keyword);
    const cityList = cities.map(city => mergeWithWeather(city, city.name));
    res.json(cityList);
  } catch (error) {
    console.error('搜索城市失败:', error);
    res.status(500).json({ error: '搜索城市失败' });
  }
});

// 获取城市详情(含实时信息)
router.get('/cities/:name', validateCityName, async (req, res) => {
  try {
    const city = await storage.getCity(req.params.name);

    if (city) {
      const cityWithRealTime = mergeWithWeather(city, req.params.name);

      // 记录浏览
      if (req.user) {
        await socialService.recordView('cities', req.params.name, req.user.uid);
      }

      res.json(cityWithRealTime);
    } else {
      res.status(404).json({ error: '城市不存在' });
    }
  } catch (error) {
    console.error('获取城市详情失败:', error);
    res.status(500).json({ error: '获取城市详情失败' });
  }
});

// ==================== 扩展城市数据库接口（627个城市） ====================

// 获取扩展数据库统计信息
router.get('/expanded/stats', (req, res) => {
  try {
    const stats = expandedCitiesLoader.getStatistics();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

// 获取热门城市排行
router.get('/expanded/trending', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const trending = expandedCitiesLoader.getTrendingCities(limit);

    res.json({
      success: true,
      count: trending.length,
      data: trending
    });
  } catch (error) {
    console.error('获取热门城市失败:', error);
    res.status(500).json({ error: '获取热门城市失败' });
  }
});

// 智能搜索（支持模糊匹配、标签、标题）
router.get('/expanded/search', (req, res) => {
  try {
    const { q, limit } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        error: '请提供搜索关键词'
      });
    }

    const searchLimit = Math.min(parseInt(limit) || 15, 50);
    const results = expandedCitiesLoader.searchCities(q, searchLimit);

    res.json({
      success: true,
      query: q,
      count: results.length,
      data: results.map(r => ({
        name: r.name,
        score: r.score,
        title: r.data.title,
        season: r.data.season,
        tags: r.data.tags || [],
        subtitle: r.data.poster?.subtitle
      }))
    });
  } catch (error) {
    console.error('智能搜索失败:', error);
    res.status(500).json({ error: '搜索失败' });
  }
});

// 获取省份城市列表
router.get('/expanded/provinces/:province?', (req, res) => {
  try {
    const { province } = req.params;
    const citiesByProvince = expandedCitiesLoader.getCitiesByProvince(province);

    if (province && citiesByProvince.length === 0) {
      return res.status(404).json({
        success: false,
        error: `未找到 ${province} 省份的城市数据`
      });
    }

    res.json({
      success: true,
      province: province || '全部',
      count: Array.isArray(citiesByProvince)
        ? citiesByProvince.length
        : Object.keys(citiesByProvince).length,
      data: citiesByProvince
    });
  } catch (error) {
    console.error('获取省份数据失败:', error);
    res.status(500).json({ error: '获取省份数据失败' });
  }
});

// 清除缓存（v10.9.3 修复 P0-3：加管理员认证）
router.post('/expanded/cache/clear', authService.verifyCustomToken, authService.requireAdmin, (req, res) => {
  try {
    expandedCitiesLoader.clearCache();
    res.json({
      success: true,
      message: '缓存已清除'
    });
  } catch (error) {
    console.error('清除缓存失败:', error);
    res.status(500).json({ error: '清除缓存失败' });
  }
});

// ==================== 天气相关接口 ====================

// 获取城市天气信息
router.get('/weather/:city', validateCityName, async (req, res) => {
  try {
    const cityData = await storage.getCity(req.params.city);
    const weather = getCityWeather(req.params.city);
    
    if (weather) {
      res.json({
        success: true,
        city: req.params.city,
        weather,
        cityInfo: cityData ? { tags: cityData.tags, season: cityData.season } : null
      });
    } else {
      res.status(404).json({ error: '无法获取天气信息' });
    }
  } catch (error) {
    console.error('获取天气信息失败:', error);
    res.status(500).json({ error: '获取天气信息失败' });
  }
});

// ==================== 统计与排行榜接口 ====================

// 获取热门城市排行榜
router.get('/trending', async (req, res) => {
  try {
    const trendingCities = await getTrendingCities();
    res.json(trendingCities);
  } catch (error) {
    console.error('获取热门城市失败:', error);
    res.status(500).json({ error: '获取热门城市失败' });
  }
});

// ==================== 数据同步接口 ====================

// 同步单个城市数据（v10.9.3 修复 P0-3：加管理员认证，防止匿名触发数据同步）
router.post('/cities/sync/:name', authService.verifyCustomToken, authService.requireAdmin, validateCityName, async (req, res) => {
  try {
    const updatedCity = await storage.syncCityFromDatabase(req.params.name);

    if (updatedCity) {
      const cityWithRealTime = mergeWithWeather(updatedCity, req.params.name);
      res.json({ success: true, city: cityWithRealTime });
    } else {
      res.status(404).json({ error: '城市不存在' });
    }
  } catch (error) {
    console.error('同步城市数据失败:', error);
    res.status(500).json({ error: '同步城市数据失败' });
  }
});

// 同步所有城市数据（v10.9.3 修复 P0-3：加管理员认证）
router.post('/cities/sync', authService.verifyCustomToken, authService.requireAdmin, async (req, res) => {
  try {
    const cities = await storage.syncAllCitiesFromDatabase();
    const syncCount = cities.length;
    res.json({ success: true, count: syncCount, message: `成功同步${syncCount}个城市` });
  } catch (error) {
    console.error('同步所有城市数据失败:', error);
    res.status(500).json({ error: '同步所有城市数据失败' });
  }
});

// ==================== 天气服务控制接口 ====================

// 立即同步天气数据（v10.9.3 修复 P0-3：加管理员认证 + 城市名校验，防止匿名消耗和风 API 配额）
router.post('/weather/sync', authService.verifyCustomToken, authService.requireAdmin, validateCityBody, async (req, res) => {
  try {
    const city = req.body.city || '北京';
    const weatherData = await getRealWeather(city);
    if (weatherData) {
      res.json({ success: true, city, data: weatherData });
    } else {
      res.status(500).json({ error: '天气数据获取失败' });
    }
  } catch (error) {
    console.error('同步天气数据失败:', error);
    res.status(500).json({ error: '同步天气数据失败' });
  }
});

// 清除天气缓存（v10.9.3 修复 P0-3：加管理员认证）
router.post('/weather/clear-cache', authService.verifyCustomToken, authService.requireAdmin, async (req, res) => {
  try {
    clearWeatherCache();
    res.json({ success: true, message: '天气缓存已清除' });
  } catch (error) {
    console.error('清除缓存失败:', error);
    res.status(500).json({ error: '清除缓存失败' });
  }
});

// ==================== 城市管理接口 ====================

// 添加新城市（安全修复 P0-4：仅管理员可新增 + 字段白名单校验）
router.post('/cities', authService.verifyCustomToken, authService.requireAdmin, validateCityPayload, async (req, res) => {
  try {
    const { name, ...data } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: '城市名称不能为空' });
    }

    const existing = await storage.getCity(name);
    if (existing) {
      return res.status(409).json({ success: false, error: '城市已存在' });
    }

    const city = await storage.addCity(name.trim(), data);
    res.status(201).json({ success: true, city });
  } catch (error) {
    console.error('添加城市失败:', error);
    res.status(500).json({ success: false, error: '添加城市失败' });
  }
});

// 更新城市信息（安全修复 P0-4：先认证 → 后校验参数 → 白名单清洗 → 处理）
router.put('/cities/:name', authService.verifyCustomToken, authService.requireAdmin, validateCityName, validateCityPayload, async (req, res) => {
  try {
    const updates = req.body;
    const city = await storage.updateCity(req.params.name, updates);

    if (city) {
      res.json({ success: true, city });
    } else {
      res.status(404).json({ success: false, error: '城市不存在' });
    }
  } catch (error) {
    console.error('更新城市信息失败:', error);
    res.status(500).json({ success: false, error: '更新城市信息失败' });
  }
});

// 删除城市
router.delete('/cities/:name', authService.verifyCustomToken, authService.requireAdmin, validateCityName, async (req, res) => {
  try {
    const city = await storage.deleteCity(req.params.name);

    if (city) {
      res.json({ success: true, message: '城市已删除' });
    } else {
      res.status(404).json({ success: false, error: '城市不存在' });
    }
  } catch (error) {
    console.error('删除城市失败:', error);
    res.status(500).json({ success: false, error: '删除城市失败' });
  }
});

module.exports = router;