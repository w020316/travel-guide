// 优先加载 627 城扩展数据库，回退到内置 25 城
let citiesData = {};
try {
    citiesData = require('../../data/expandedCities.js');
    console.log(`📂 已加载扩展城市数据库: ${Object.keys(citiesData).length} 个城市`);
} catch (e) {
    console.warn('⚠️ 扩展城市数据库加载失败，回退到内置数据:', e.message);
    citiesData = require('../data/cities');
}

class StorageService {
  constructor() {
    this.useMemoryStorage = true;
    this.db = null;
    this.citiesCache = new Map();
    this.lastCacheTime = 0;
    this.cacheTTL = 10 * 60 * 1000; // 10分钟缓存
    // 修复 P2：刷新缓存的 in-flight Promise，避免惊群效应
    // 多个并发请求触发 refreshCache 时，复用同一个 Promise，避免重复扫描数据库
    this._refreshPromise = null;
  }

  async initialize(mongooseInstance) {
    try {
      this.useMemoryStorage = true;
      this.citiesCache = new Map();
      
      for (const [name, data] of Object.entries(citiesData)) {
        this.citiesCache.set(name, { ...data, lastUpdated: new Date().toISOString() });
      }
      
      this.lastCacheTime = Date.now();
      
      if (mongooseInstance) {
        try {
          await mongooseInstance.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-guide', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
          });
          
          const City = require('../models/City');
          const count = await City.countDocuments();
          
          if (count === 0) {
            for (const [name, data] of Object.entries(citiesData)) {
              await City.create({ name, ...data });
            }
          } else {
            const cities = await City.find({});
            for (const city of cities) {
              this.citiesCache.set(city.name, { ...city.toObject() });
            }
          }
          
          this.useMemoryStorage = false;
          this.db = mongooseInstance;
        } catch (dbError) {
          console.log('MongoDB连接失败，使用内存存储模式:', dbError.message);
        }
      }
      
      console.log(`存储服务初始化完成，使用${this.useMemoryStorage ? '内存' : '数据库'}存储模式，已加载${this.citiesCache.size}个城市数据`);
    } catch (error) {
      console.error('存储服务初始化失败:', error);
      throw error;
    }
  }

  async getAllCities() {
    if (this.isCacheExpired()) {
      await this.refreshCache();
    }
    
    const result = {};
    for (const [name, data] of this.citiesCache.entries()) {
      result[name] = data;
    }
    return result;
  }

  async getCity(name) {
    if (this.isCacheExpired()) {
      await this.refreshCache();
    }
    return this.citiesCache.get(name) || null;
  }

  async getCitiesByTags(tags) {
    if (this.isCacheExpired()) {
      await this.refreshCache();
    }
    
    const result = [];
    for (const [name, data] of this.citiesCache.entries()) {
      if (tags.some(tag => data.tags && data.tags.includes(tag))) {
        result.push({ name, ...data });
      }
    }
    return result;
  }

  async searchCities(keyword) {
    if (this.isCacheExpired()) {
      await this.refreshCache();
    }
    
    const normalizedKeyword = keyword.toLowerCase().trim();
    const results = [];
    
    for (const [name, data] of this.citiesCache.entries()) {
      const matchName = name.toLowerCase().includes(normalizedKeyword);
      const matchTags = data.tags && data.tags.some(tag => tag.toLowerCase().includes(normalizedKeyword));
      const matchSeason = data.season && data.season.toLowerCase().includes(normalizedKeyword);
      const matchAtmosphere = data.atmosphere && data.atmosphere.toLowerCase().includes(normalizedKeyword);
      
      if (matchName || matchTags || matchSeason || matchAtmosphere) {
        results.push({ name, ...data });
      }
    }
    
    return results;
  }

  async addCity(name, data) {
    // P1 修复 7.4：service 层内置原型污染防御，不依赖路由中间件
    this._assertSafePayload(data);
    this.citiesCache.set(name, { ...data, lastUpdated: new Date().toISOString() });
    return this.citiesCache.get(name);
  }

  async updateCity(name, updates) {
    // P1 修复 7.1：service 层内置原型污染防御，不依赖路由中间件
    this._assertSafePayload(updates);
    const existing = this.citiesCache.get(name);
    if (!existing) return null;

    const updated = { ...existing, ...updates, lastUpdated: new Date().toISOString() };
    this.citiesCache.set(name, updated);
    return updated;
  }

  /**
   * 原型污染防御：拒绝 __proto__ / constructor / prototype 字段
   * 即使路由层中间件被绕过，service 层仍能自我保护
   * @param {Object} payload - 待校验的对象
   * @throws {Error} 当检测到危险字段时
   */
  _assertSafePayload(payload) {
    if (!payload || typeof payload !== 'object') return;
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    for (const key of Object.keys(payload)) {
      if (dangerous.includes(key)) {
        const err = new Error(`非法字段: ${key}`);
        err.name = 'ValidationError';
        throw err;
      }
    }
  }

  async deleteCity(name) {
    const deleted = this.citiesCache.get(name);
    if (deleted) {
      this.citiesCache.delete(name);
    }
    return deleted;
  }

  async syncCityFromDatabase(name) {
    if (this.db) {
      try {
        const City = require('../models/City');
        const city = await City.findOne({ name }).lean();
        if (city) {
          this.citiesCache.set(name, { ...city, lastUpdated: new Date().toISOString() });
          return city;
        }
      } catch (error) {
        console.error(`从数据库同步城市${name}失败:`, error);
      }
    }
    return null;
  }

  async syncAllCitiesFromDatabase() {
    if (this.db) {
      try {
        const City = require('../models/City');
        const cities = await City.find({}).lean();
        
        for (const city of cities) {
          this.citiesCache.set(city.name, { ...city, lastUpdated: new Date().toISOString() });
        }
        
        this.lastCacheTime = Date.now();
        return cities;
      } catch (error) {
        console.error('从数据库同步所有城市失败:', error);
      }
    }
    return [];
  }

  isCacheExpired() {
    return Date.now() - this.lastCacheTime > this.cacheTTL;
  }

  /**
   * 刷新缓存（修复 P2：惊群效应）
   * - 多个并发请求触发 refreshCache 时，复用同一个 in-flight Promise
   * - 避免对数据库执行 N 次相同的全表扫描
   * - 失败时清空 _refreshPromise，允许下次请求重试
   */
  async refreshCache() {
    // 内存存储模式无需刷新（数据来自本地 expandedCities.js）
    if (this.useMemoryStorage) {
      this.lastCacheTime = Date.now();
      return;
    }

    // 已有进行中的刷新，复用其 Promise
    if (this._refreshPromise) {
      return this._refreshPromise;
    }

    this._refreshPromise = (async () => {
      try {
        await this.syncAllCitiesFromDatabase();
      } finally {
        // 无论成功失败都清空，下次请求可重新触发
        this._refreshPromise = null;
      }
    })();

    return this._refreshPromise;
  }

  getCityCount() {
    return this.citiesCache.size;
  }

  getCityNames() {
    return Array.from(this.citiesCache.keys());
  }

  getCitySync(name) {
    return this.citiesCache.get(name) || null;
  }
}

const storage = new StorageService();

module.exports = storage;
