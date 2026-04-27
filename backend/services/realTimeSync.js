// 实时数据同步服务 - 热门城市和季节性标签
// 天气相关功能已迁移到 weatherSync.js

// 热门城市数据缓存
let trendingCache = {};
let trendingCacheTime = {};

// 获取热门城市排行榜
async function getTrendingCities() {
  const now = Date.now();
  
  // 如果缓存存在且未过期(5分钟)
  if (trendingCache.cities && (now - trendingCacheTime) < 5 * 60 * 1000) {
    return trendingCache.cities;
  }
  
  try {
    // 模拟从数据统计API获取
    const trendingData = generateMockTrendingData();
    
    // 更新缓存
    trendingCache.cities = trendingData;
    trendingCacheTime = now;
    
    return trendingData;
  } catch (error) {
    console.error('获取热门城市数据失败:', error);
    return [];
  }
}

// 生成模拟热门城市数据(实际项目中替换为真实统计)
function generateMockTrendingData() {
  const cities = [
    { name: '成都', score: 9500, trend: 'up', tags: ['美食之都', '大熊猫'] },
    { name: '重庆', score: 9200, trend: 'up', tags: ['火锅', '山城'] },
    { name: '西安', score: 8800, trend: 'stable', tags: ['兵马俑', '古都'] },
    { name: '杭州', score: 8500, trend: 'up', tags: ['西湖', '江南'] },
    { name: '北京', score: 8300, trend: 'stable', tags: ['故宫', '首都'] },
    { name: '上海', score: 8100, trend: 'down', tags: ['外滩', '魔都'] },
    { name: '厦门', score: 7800, trend: 'up', tags: ['鼓浪屿', '海滨'] },
    { name: '丽江', score: 7500, trend: 'stable', tags: ['古城', '雪山'] },
    { name: '大理', score: 7200, trend: 'up', tags: ['苍山洱海', '白族'] },
    { name: '青岛', score: 6900, trend: 'stable', tags: ['啤酒', '海滨'] }
  ];
  
  // 添加一些随机波动
  return cities.map(city => ({
    ...city,
    score: city.score + Math.floor(Math.random() * 200 - 100)
  })).sort((a, b) => b.score - a.score);
}

// 获取季节性推荐标签
function getSeasonalTags(cityName) {
  const now = new Date();
  const month = now.getMonth() + 1;
  
  const seasonalTags = {
    spring: ['赏花', '春游', '踏青'],
    summer: ['避暑', '海滨', '漂流'],
    autumn: ['赏秋', '红叶', '丰收'],
    winter: ['冰雪', '温泉', '滑雪']
  };
  
  let season;
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';
  
  return seasonalTags[season] || [];
}

// 合并实时更新数据到城市数据
function mergeRealTimeData(cityData, cityName) {
  if (!cityData) return cityData;
  
  const updatedData = { ...cityData };
  
  // 添加季节性标签
  updatedData.seasonalTags = getSeasonalTags(cityName);
  
  // 最后更新时间
  updatedData.lastUpdated = new Date().toISOString();
  
  return updatedData;
}

module.exports = {
  getTrendingCities,
  getSeasonalTags,
  mergeRealTimeData,
  trendingCache
};
