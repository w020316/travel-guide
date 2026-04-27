const express = require('express');
const router = express.Router();
const storage = require('../services/storage');
const { getCityWeather, getRealWeather, startWeatherSync, clearWeatherCache } = require('../services/weatherSync');
const { getTrendingCities, getSeasonalTags } = require('../services/realTimeSync');
const { validateCityName, validateSearchQuery, validatePagination, rateLimiter } = require('../middleware/validation');

// 应用限流中间件
router.use(rateLimiter(200, 60000));

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

// ==================== 城市数据接口 ====================

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
router.post('/cities', async (req, res) => {
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
router.put('/cities/:name', validateCityName, async (req, res) => {
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
router.delete('/cities/:name', validateCityName, async (req, res) => {
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
