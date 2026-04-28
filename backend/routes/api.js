const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const authService = require('../services/authService');
const socialService = require('../services/socialService');
const storage = require('../services/storage');
const { getCityWeather, getRealWeather, startWeatherSync, clearWeatherCache } = require('../services/weatherSync');
const { getTrendingCities, getSeasonalTags } = require('../services/realTimeSync');
const { validateCityName, validateSearchQuery, validatePagination, rateLimiter } = require('../middleware/validation');

// 应用限流中间件
router.use(rateLimiter(200, 60000));

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

    // 记录浏览统计
    if (req.user) {
      await socialService.recordView('cities', city.trim(), req.user.uid);
    }

    // 调用AI服务生成攻略
    const guideData = await aiService.generateTravelGuide(city.trim(), preferences || {});
    
    // 合并实时数据
    const weather = getCityWeather(city.trim());
    if (weather) {
      guideData.currentWeather = weather;
    }
    
    guideData.seasonalTags = getSeasonalTags(city.trim());
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
router.post('/ai/generate-batch', authService.verifyCustomToken, async (req, res) => {
  try {
    const { cities, preferences } = req.body;
    
    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供城市列表' 
      });
    }

    if (cities.length > 5) {
      return res.status(400).json({ 
        success: false, 
        error: '单次最多生成5个城市的攻略' 
      });
    }

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
router.post('/auth/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供Firebase ID Token' 
      });
    }

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
router.put('/auth/profile', authService.verifyCustomToken, async (req, res) => {
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
    const testUser = {
      uid: 'test_user_123',
      email: 'test@example.com',
      name: '测试用户',
      role: 'admin'
    };
    
    const token = authService.createTestToken(testUser);
    res.json({ success: true, token, user: testUser });
  });
}

// ==================== 社交互动接口 ====================

// 添加评论
router.post('/comments', authService.verifyCustomToken, async (req, res) => {
  try {
    const { cityId, content, parentId } = req.body;
    
    if (!cityId || !content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供城市ID和评论内容' 
      });
    }

    const result = await socialService.addComment(
      cityId, 
      req.user.uid, 
      content.trim(), 
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
router.get('/comments/:cityId', authService.optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await socialService.getComments(req.params.cityId, page, limit);
    res.json(result);

  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ success: false, error: '获取评论失败' });
  }
});

// 删除评论
router.delete('/comments/:commentId', authService.verifyCustomToken, async (req, res) => {
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
router.post('/likes/:type/:targetId', authService.verifyCustomToken, async (req, res) => {
  try {
    const { type, targetId } = req.params;
    const validTypes = ['cities', 'comments', 'guides'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: '无效的目标类型' 
      });
    }

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
router.post('/follow/:userId', authService.verifyCustomToken, async (req, res) => {
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
router.post('/views/:type/:targetId', authService.optionalAuth, async (req, res) => {
  try {
    const { type, targetId } = req.params;
    const result = await socialService.recordView(type, targetId, req.user?.uid);
    res.json(result);

  } catch (error) {
    res.status(500).json({ success: false, error: '记录浏览失败' });
  }
});

// 获取浏览统计
router.get('/stats/views/:type/:targetId', async (req, res) => {
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
    const limit = parseInt(req.query.limit) || 20;
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
    const limit = parseInt(req.query.limit) || 10;
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
router.get('/cities/all', async (req, res) => {
  try {
    const cities = await storage.getAllCities();
    const cityMap = {};
    for (const [name, data] of Object.entries(cities)) {
      cityMap[name] = mergeWithWeather(data, name);
    }
    res.json(cityMap);
  } catch (error) {
    console.error('获取所有城市数据失败:', error);
    res.status(500).json({ error: '获取所有城市数据失败' });
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

// ==================== 天气相关接口 ====================

// 获取城市天气信息
router.get('/weather/:city', async (req, res) => {
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

// 同步单个城市数据
router.post('/cities/sync/:name', validateCityName, async (req, res) => {
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

// 同步所有城市数据
router.post('/cities/sync', async (req, res) => {
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

// 立即同步天气数据
router.post('/weather/sync', async (req, res) => {
  try {
    const weatherData = await getRealWeather(req.body.city || '北京');
    if (weatherData) {
      res.json({ success: true, city: req.body.city || '北京', data: weatherData });
    } else {
      res.status(500).json({ error: '天气数据获取失败' });
    }
  } catch (error) {
    console.error('同步天气数据失败:', error);
    res.status(500).json({ error: '同步天气数据失败' });
  }
});

// 清除天气缓存
router.post('/weather/clear-cache', async (req, res) => {
  try {
    clearWeatherCache();
    res.json({ success: true, message: '天气缓存已清除' });
  } catch (error) {
    console.error('清除缓存失败:', error);
    res.status(500).json({ error: '清除缓存失败' });
  }
});

// ==================== 城市管理接口 ====================

// 添加新城市
router.post('/cities', authService.verifyCustomToken, async (req, res) => {
  try {
    const { name, ...data } = req.body;
    if (!name) {
      return res.status(400).json({ error: '城市名称不能为空' });
    }
    
    if (name.length > 50) {
      return res.status(400).json({ error: '城市名称过长' });
    }
    
    const existing = await storage.getCity(name);
    if (existing) {
      return res.status(409).json({ error: '城市已存在' });
    }
    
    const city = await storage.addCity(name.trim(), data);
    res.status(201).json({ success: true, city });
  } catch (error) {
    console.error('添加城市失败:', error);
    res.status(500).json({ error: '添加城市失败' });
  }
});

// 更新城市信息
router.put('/cities/:name', validateCityName, authService.verifyCustomToken, async (req, res) => {
  try {
    const updates = req.body;
    const city = await storage.updateCity(req.params.name, updates);
    
    if (city) {
      res.json({ success: true, city });
    } else {
      res.status(404).json({ error: '城市不存在' });
    }
  } catch (error) {
    console.error('更新城市信息失败:', error);
    res.status(500).json({ error: '更新城市信息失败' });
  }
});

// 删除城市
router.delete('/cities/:name', validateCityName, authService.requireAdmin, async (req, res) => {
  try {
    const city = await storage.deleteCity(req.params.name);
    
    if (city) {
      res.json({ success: true, message: '城市已删除' });
    } else {
      res.status(404).json({ error: '城市不存在' });
    }
  } catch (error) {
    console.error('删除城市失败:', error);
    res.status(500).json({ error: '删除城市失败' });
  }
});

module.exports = router;