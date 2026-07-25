// 和风天气API服务
// 用一个可被测试替换的引用包装 axios，便于单元测试注入 mock
let axios = require('axios');

/**
 * 仅供单元测试使用：替换内部 axios 引用
 */
function __setAxiosForTest(mockAxios) {
  axios = mockAxios;
}

// 修复 P1-13：引入 LRU 缓存，避免对象/Map 无限增长导致内存泄漏
const LRUCache = require('../utils/lruCache');

// 和风天气API配置
// v10.9.3 修复 P0-5：专属 API 域名等价于凭证，迁移到环境变量，避免仓库公开后被滥用
// 未配置时回退到原硬编码值（保持现有部署兼容，不破坏功能）
const QWEATHER_FREE_API_URL = (process.env.QWEATHER_API_URL || 'https://kp3h2rh7ab.re.qweatherapi.com/v7').replace(/\/+$/, '');
const QWEATHER_GEO_URL = (process.env.QWEATHER_GEO_URL || 'https://kp3h2rh7ab.re.qweatherapi.com/v2').replace(/\/+$/, '');

// 修复 P1-13：天气数据缓存改为 LRU（最多 200 城市，单条 TTL 10 分钟）
// 原实现使用无上限 plain object，长期运行下 weatherCacheTime / weatherCache 会无限增长
const weatherCache = new LRUCache({ max: 200, ttl: 10 * 60 * 1000 });

// 城市 ID 缓存（城市名 → 和风 Location ID），最多 500 条
// Location ID 永不变，但仍需限制上限避免恶意输入耗尽内存
const cityIdCache = new LRUCache({ max: 500 });

// 获取城市Location ID
async function getCityLocationId(cityName) {
  const cached = cityIdCache.get(cityName);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await axios.get(`${QWEATHER_GEO_URL}/city/lookup`, {
      params: {
        location: cityName,
        adm: 'China'
      }
    });

    if (response.data.code === '200' && response.data.location && response.data.location.length > 0) {
      const locationId = response.data.location[0].id;
      cityIdCache.set(cityName, locationId);
      return locationId;
    }

    return null;
  } catch (error) {
    console.error(`获取${cityName}城市ID失败:`, error.message);
    return null;
  }
}

// 获取真实天气数据
async function getRealWeather(cityName) {
  try {
    const locationId = await getCityLocationId(cityName);
    if (!locationId) {
      return null;
    }

    // 获取实时天气 - 免费开发版域名直接使用，不需要key参数
    const weatherResponse = await axios.get(`${QWEATHER_FREE_API_URL}/weather/now`, {
      params: {
        location: locationId
      }
    });

    // 获取天气预报
    const forecastResponse = await axios.get(`${QWEATHER_FREE_API_URL}/weather/3d`, {
      params: {
        location: locationId
      }
    });

    if (weatherResponse.data.code !== '200' || !weatherResponse.data.now) {
      console.error(`和风天气API返回错误:`, weatherResponse.data);
      return null;
    }

    const now = weatherResponse.data.now;
    const forecast = forecastResponse.data.daily || [];

    return {
      city: cityName,
      current: {
        temp: `${now.temp}°C`,
        feelsLike: `${now.feelsLike}°C`,
        condition: now.text,
        humidity: `${now.humidity}%`,
        wind: `${now.windDir} ${now.windScale}级`,
        visibility: `${now.vis}公里`,
        pressure: `${now.pressure}hPa`
      },
      forecast: forecast.map(day => ({
        date: day.fxDate,
        temp: `${day.tempMin}-${day.tempMax}°C`,
        condition: day.textDay,
        wind: day.windDirDay
      })),
      updateTime: weatherResponse.data.updateTime || new Date().toISOString()
    };
  } catch (error) {
    console.error(`获取${cityName}真实天气失败:`, error.message);
    return null;
  }
}

// 获取天气数据(带缓存)
async function getCityWeather(cityName) {
  // LRU 内部处理 TTL（10 分钟）
  const cached = weatherCache.get(cityName);
  if (cached !== undefined) {
    return cached;
  }

  // 尝试获取真实天气
  const realWeather = await getRealWeather(cityName);

  if (realWeather) {
    weatherCache.set(cityName, realWeather);
    return realWeather;
  }

  // 如果真实天气获取失败,使用模拟数据
  const mockWeather = generateMockWeatherData(cityName);
  weatherCache.set(cityName, mockWeather);

  return mockWeather;
}

// 生成模拟天气数据(备用)
function generateMockWeatherData(cityName) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const hour = now.getHours();

  const weatherData = {
    '北京': {
      tempRange: [[-5, 5], [0, 10], [5, 18], [12, 25], [18, 30], [22, 33], [24, 32], [22, 30], [15, 25], [8, 18], [0, 10], [-3, 5]],
      condition: ['晴', '多云', '晴转多云', '多云转晴', '晴', '雷阵雨', '晴', '晴', '多云', '晴', '多云', '晴']
    },
    '上海': {
      tempRange: [[2, 8], [4, 11], [7, 15], [12, 21], [17, 26], [22, 29], [26, 33], [26, 33], [21, 27], [15, 22], [9, 16], [3, 10]],
      condition: ['多云', '多云', '多云转晴', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云']
    },
    '广州': {
      tempRange: [[13, 20], [14, 21], [17, 24], [21, 27], [24, 30], [26, 32], [26, 33], [26, 33], [25, 32], [22, 29], [18, 25], [14, 21]],
      condition: ['多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云']
    },
    '成都': {
      tempRange: [[4, 10], [6, 13], [10, 17], [15, 23], [19, 27], [22, 29], [24, 31], [23, 31], [20, 26], [15, 21], [10, 16], [5, 11]],
      condition: ['多云', '多云', '多云', '多云', '多云', '阴', '阴', '阴', '阴', '多云', '多云', '多云']
    },
    '杭州': {
      tempRange: [[2, 9], [4, 12], [8, 17], [13, 22], [18, 28], [23, 30], [26, 35], [25, 34], [20, 28], [14, 22], [8, 16], [3, 11]],
      condition: ['多云', '多云', '多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云']
    },
    '西安': {
      tempRange: [[-2, 7], [1, 11], [6, 17], [12, 24], [17, 30], [21, 34], [23, 35], [22, 32], [16, 26], [10, 20], [4, 13], [0, 8]],
      condition: ['晴', '多云', '多云', '多云', '多云', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云', '晴']
    },
    '重庆': {
      tempRange: [[7, 12], [9, 15], [13, 20], [18, 26], [22, 30], [25, 33], [27, 36], [27, 36], [22, 29], [17, 23], [12, 18], [7, 13]],
      condition: ['多云', '多云', '多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云']
    },
    '南京': {
      tempRange: [[0, 7], [2, 10], [6, 16], [12, 22], [17, 27], [22, 30], [25, 34], [25, 33], [19, 27], [13, 22], [6, 15], [1, 9]],
      condition: ['多云', '多云', '多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云']
    },
    '武汉': {
      tempRange: [[2, 9], [4, 12], [8, 17], [14, 24], [19, 29], [23, 31], [26, 34], [25, 33], [20, 28], [14, 23], [7, 17], [2, 11]],
      condition: ['多云', '多云', '多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云']
    },
    '深圳': {
      tempRange: [[14, 21], [15, 21], [18, 25], [22, 28], [25, 31], [26, 32], [26, 32], [26, 32], [25, 31], [23, 29], [19, 26], [15, 22]],
      condition: ['多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云']
    }
  };

  const cityData = weatherData[cityName] || {
    tempRange: [[10, 20], [12, 22], [15, 25], [18, 28], [20, 30], [24, 34], [26, 35], [25, 34], [21, 29], [16, 24], [13, 20], [11, 18]],
    condition: ['多云', '多云', '多云', '多云', '多云', '雷阵雨', '雷阵雨', '雷阵雨', '多云', '多云', '多云', '多云']
  };

  const monthIndex = month - 1;
  const temps = cityData.tempRange[monthIndex];
  const cond = cityData.condition[monthIndex];

  const hourAdjustment = hour < 6 ? -3 : hour < 12 ? -1 : hour < 18 ? 1 : 0;
  const currentTemp = Math.round((temps[0] + temps[1]) / 2 + hourAdjustment);

  return {
    city: cityName,
    current: {
      temp: `${currentTemp}°C`,
      feelsLike: `${currentTemp - 2}°C`,
      condition: cond,
      humidity: `${50 + Math.floor(Math.random() * 30)}%`,
      wind: `微风 ${1 + Math.floor(Math.random() * 3)}级`,
      visibility: `${10 + Math.floor(Math.random() * 10)}公里`,
      pressure: `${1000 + Math.floor(Math.random() * 30)}hPa`
    },
    forecast: [
      { date: new Date().toISOString().split('T')[0], temp: `${temps[0]}-${temps[1]}°C`, condition: cond, wind: '微风' },
      { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], temp: `${temps[0]-2}-${temps[1]-1}°C`, condition: cityData.condition[(monthIndex + 1) % 12], wind: '微风' },
      { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], temp: `${temps[0]+1}-${temps[1]+2}°C`, condition: cityData.condition[(monthIndex + 2) % 12], wind: '微风' }
    ],
    updateTime: new Date().toISOString()
  };
}

// 定时刷新天气数据
function startWeatherSync(intervalMinutes = 10) {
  console.log(`启动天气定时同步服务, 间隔: ${intervalMinutes}分钟`);

  // P0 修复：async 回调最外层包 try/catch，避免 unhandledRejection；
  // 并调用 .unref() 使定时器不阻止进程优雅退出（与 middleware/validation.js 一致）
  const timer = setInterval(async () => {
    try {
      console.log('开始同步天气数据...');
      // LRU 的 keys() 返回当前所有缓存的城市名快照
      const cities = weatherCache.keys();

      for (const city of cities) {
        const realWeather = await getRealWeather(city);
        if (realWeather) {
          weatherCache.set(city, realWeather);
          console.log(`已更新${city}天气数据`);
        }
      }

      // 清理过期条目（LRU 内部在 get 时也会清理，这里显式调用一次）
      const purged = weatherCache.purgeExpired();
      if (purged > 0) {
        console.log(`已清理 ${purged} 个过期天气缓存`);
      }
    } catch (err) {
      // 定时任务出错不应崩溃进程，仅记录
      console.error('[weatherSync] 定时同步失败:', err && err.message ? err.message : String(err));
    }
  }, intervalMinutes * 60 * 1000);

  // P0 修复：unref 避免定时器持有事件循环引用，允许 gracefulShutdown 正常退出
  timer.unref();
  return timer;
}

// 清除缓存
function clearWeatherCache(cityName) {
  if (cityName) {
    weatherCache.delete(cityName);
    cityIdCache.delete(cityName);
  } else {
    weatherCache.clear();
    cityIdCache.clear();
  }
}

module.exports = {
  getCityWeather,
  getRealWeather,
  startWeatherSync,
  clearWeatherCache,
  // 暴露缓存实例以便监控/测试（只读访问）
  weatherCache,
  cityIdCache,
  __setAxiosForTest
};
