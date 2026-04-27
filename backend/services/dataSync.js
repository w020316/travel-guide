const axios = require('axios');
const City = require('../models/City');

// 从网络API获取城市数据
async function fetchCityDataFromNetwork(cityName) {
  try {
    // 这里可以替换为真实的API调用
    // 示例：从模拟API获取数据
    const response = await axios.get(`https://api.example.com/cities/${encodeURIComponent(cityName)}`);
    return response.data;
  } catch (error) {
    console.error(`获取城市${cityName}数据失败:`, error);
    return null;
  }
}

// 同步单个城市数据
async function syncCityData(cityName) {
  try {
    const networkData = await fetchCityDataFromNetwork(cityName);
    
    if (networkData) {
      // 查找数据库中是否已有该城市
      let city = await City.findOne({ name: cityName });
      
      if (city) {
        // 更新现有城市数据
        city = Object.assign(city, networkData);
        city.updatedAt = new Date();
      } else {
        // 创建新城市数据
        city = new City(networkData);
      }
      
      await city.save();
      console.log(`城市${cityName}数据同步成功`);
      return city;
    }
    
    return null;
  } catch (error) {
    console.error(`同步城市${cityName}数据失败:`, error);
    return null;
  }
}

// 同步所有城市数据
async function syncAllCitiesData() {
  // 城市列表
  const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆', '南京', '武汉', '天津', '苏州', '厦门', '青岛'];
  
  const results = [];
  for (const city of cities) {
    const result = await syncCityData(city);
    if (result) {
      results.push(result);
    }
  }
  
  return results;
}

module.exports = {
  syncCityData,
  syncAllCitiesData
};