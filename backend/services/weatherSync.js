// 和风天气API服务
const axios = require('axios');

// 和风天气API配置 - 使用免费开发版自定义域名
// kp3h2rh7ab.re.qweatherapi.com 是专属API端点，不需要额外的key参数
const QWEATHER_FREE_API_URL = 'https://kp3h2rh7ab.re.qweatherapi.com/v7';
const QWEATHER_GEO_URL = 'https://kp3h2rh7ab.re.qweatherapi.com/v2';

// 天气数据缓存
let weatherCache = {};
let weatherCacheTime = {};

// 城市ID缓存(用于将城市名转换为和风天气Location ID)
let cityIdCache = {};

// 获取城市Location ID
async function getCityLocationId(cityName) {
  if (cityIdCache[cityName]) {
    return cityIdCache[cityName];
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
      cityIdCache[cityName] = locationId;
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
  const now = Date.now();
  
  // 如果缓存存在且未过期(10分钟)
  if (weatherCache[cityName] && (now - weatherCacheTime[cityName]) < 10 * 60 * 1000) {
    return weatherCache[cityName];
  }

  // 尝试获取真实天气
  const realWeather = await getRealWeather(cityName);
  
  if (realWeather) {
    weatherCache[cityName] = realWeather;
    weatherCacheTime[cityName] = now;
    return realWeather;
  }

  // 如果真实天气获取失败,使用模拟数据
  const mockWeather = generateMockWeatherData(cityName);
  weatherCache[cityName] = mockWeather;
  weatherCacheTime[cityName] = now;
  
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
  
  setInterval(async () => {
    console.log('开始同步天气数据...');
    const cities = Object.keys(weatherCache);
    
    for (const city of cities) {
      const realWeather = await getRealWeather(city);
      if (realWeather) {
        weatherCache[city] = realWeather;
        weatherCacheTime[city] = Date.now();
        console.log(`已更新${city}天气数据`);
      }
    }
    
    // 清除过期缓存(超过1小时未访问的)
    const now = Date.now();
    for (const city of Object.keys(weatherCacheTime)) {
      if (now - weatherCacheTime[city] > 60 * 60 * 1000) {
        delete weatherCache[city];
        delete weatherCacheTime[city];
      }
    }
  }, intervalMinutes * 60 * 1000);
}

// 清除缓存
function clearWeatherCache(cityName) {
  if (cityName) {
    delete weatherCache[cityName];
    delete weatherCacheTime[cityName];
  } else {
    weatherCache = {};
    weatherCacheTime = {};
  }
}

module.exports = {
  getCityWeather,
  getRealWeather,
  startWeatherSync,
  clearWeatherCache,
  weatherCache,
  weatherCacheTime
};
