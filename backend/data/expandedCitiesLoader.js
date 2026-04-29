const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let cachedCities = null;
let lastLoadTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 数据版本控制
const DATA_VERSION = '2.0.0';
const DATA_LAST_UPDATED = new Date().toISOString();

/**
 * 城市数据验证规则
 */
const validationRules = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 20,
        pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/
    },
    title: {
        type: 'string',
        required: true,
        minLength: 4,
        maxLength: 50
    },
    season: {
        type: 'string',
        allowedValues: ['春季最佳', '夏季最佳', '秋季最佳', '冬季最佳', '春秋最佳', '夏秋最佳', '春夏最佳', '秋冬最佳', '全年适宜', '夏冬两季']
    },
    days: {
        type: 'string',
        pattern: /^\d+(-\d+)?(天|日)$/
    },
    tags: {
        type: 'array',
        maxItems: 10,
        itemType: {
            type: 'string',
            minLength: 2,
            maxLength: 15
        }
    },
    poster: {
        type: 'object',
        requiredFields: ['style', 'subtitle'],
        optionalFields: ['title', 'elements', 'layout', 'colors', 'gradient'],
        style: {
            allowedValues: ['vintage', 'fresh', 'minimal', 'modern', 'artistic', 'nature', 'urban']
        }
    },
    routes: {
        type: 'array',
        minItems: 1,
        maxItems: 8,
        itemType: {
            type: 'string',
            minLength: 5,
            maxLength: 100
        }
    },
    foods: {
        type: 'array',
        minItems: 1,
        maxItems: 15,
        itemSchema: {
            name: { type: 'string', required: true, minLength: 1, maxLength: 20 },
            description: { type: 'string', maxLength: 50 },
            price: { type: 'string', pattern: /^\d+-\d+(元\/.*)?$/ },
            mustTry: { type: 'boolean' },
            location: { type: 'string', maxLength: 30 }
        }
    }
};

/**
 * 验证单个城市数据
 */
function validateCityData(cityName, cityData) {
    const errors = [];
    const warnings = [];

    // 验证城市名称
    if (!cityName || typeof cityName !== 'string') {
        errors.push({ field: 'name', message: '城市名称不能为空' });
    } else if (cityName.length < 2) {
        errors.push({ field: 'name', message: '城市名称太短（最少2个字符）' });
    } else if (cityName.length > 20) {
        warnings.push({ field: 'name', message: '城市名称超过20个字符' });
    }

    // 验证必填字段
    const requiredFields = ['title', 'season', 'days', 'tags'];
    for (const field of requiredFields) {
        if (!cityData[field]) {
            errors.push({ field, message: `缺少必填字段: ${field}` });
        } else if (typeof cityData[field] === 'string' && cityData[field].trim() === '') {
            errors.push({ field, message: `${field} 不能为空字符串` });
        }
    }

    // 验证标签
    if (cityData.tags && Array.isArray(cityData.tags)) {
        if (cityData.tags.length === 0) {
            errors.push({ field: 'tags', message: '至少需要一个标签' });
        } else if (cityData.tags.length > 10) {
            warnings.push({ field: 'tags', message: `标签数量过多（${cityData.tags.length}/10）` });
        } else {
            for (let i = 0; i < cityData.tags.length; i++) {
                if (typeof cityData.tags[i] !== 'string') {
                    errors.push({ field: `tags[${i}]`, message: '标签必须是字符串' });
                } else if (cityData.tags[i].length < 2) {
                    warnings.push({ field: `tags[${i}]`, message: `标签"${cityData.tags[i]}"太短` });
                }
            }
        }
    }

    // 验证路线
    if (cityData.routes && Array.isArray(cityData.routes)) {
        if (cityData.routes.length === 0) {
            warnings.push({ field: 'routes', message: '没有推荐路线' });
        } else if (cityData.routes.length > 8) {
            warnings.push({ field: 'routes', message: `路线数量过多（${cityData.routes.length}/8）` });
        }
    }

    // 验证美食
    if (cityData.foods && Array.isArray(cityData.foods)) {
        let hasMustTry = false;
        for (let i = 0; i < cityData.foods.length; i++) {
            const food = cityData.foods[i];
            if (!food.name) {
                errors.push({ field: `foods[${i}]`, message: '美食项缺少名称' });
            }
            if (food.mustTry === true) {
                hasMustTry = true;
            }
            if (food.price && !/^\d+-\d+(元\/.*)?$/.test(food.price)) {
                warnings.push({
                    field: `foods[${i}].price`,
                    message: `价格格式可能不正确: ${food.price}`
                });
            }
        }
        if (!hasMustTry && cityData.foods.length > 0) {
            warnings.push({ field: 'foods', message: '没有标记必吃美食' });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        score: Math.max(0, 100 - errors.length * 20 - warnings.length * 5)
    };
}

/**
 * 清理和标准化城市数据
 */
function sanitizeCityData(rawData) {
    const sanitized = {};

    // 复制基本字段
    sanitized.title = rawData.title ? rawData.title.trim() : '';
    sanitized.season = rawData.season ? rawData.season.trim() : '';
    sanitized.days = rawData.days ? rawData.days.trim() : '';

    // 标准化标签（去重、排序）
    if (Array.isArray(rawData.tags)) {
        sanitized.tags = [...new Set(rawData.tags.map(t => t.trim()))].sort();
    } else {
        sanitized.tags = [];
    }

    // 标准化海报数据
    if (rawData.poster && typeof rawData.poster === 'object') {
        sanitized.poster = {
            style: rawData.poster.style || 'fresh',
            subtitle: rawData.poster.subtitle || ''
        };
        if (rawData.poster.title) sanitized.poster.title = rawData.poster.title;
    }

    // 标准化路线
    if (Array.isArray(rawData.routes)) {
        sanitized.routes = rawData.routes.filter(r => r && r.trim()).map(r => r.trim());
    } else {
        sanitized.routes = [];
    }

    // 标准化美食
    if (Array.isArray(rawData.foods)) {
        sanitized.foods = rawData.foods.map(food => ({
            name: food.name || '',
            description: food.description || '',
            price: food.price || '',
            mustTry: Boolean(food.mustTry),
            location: food.location || ''
        })).filter(f => f.name);
    } else {
        sanitized.foods = [];
    }

    // 添加元数据
    sanitized._meta = {
        version: DATA_VERSION,
        validatedAt: new Date().toISOString(),
        hash: generateDataHash(sanitized)
    };

    return sanitized;
}

/**
 * 生成数据哈希值（用于缓存失效检测）
 */
function generateDataHash(data) {
    const dataStr = JSON.stringify(data);
    return crypto.createHash('md5').update(dataStr).digest('hex').substring(0, 16);
}

/**
 * 加载扩展城市数据库（627个城市）
 */
function loadExpandedCities() {
    try {
        const expandedPath = path.join(__dirname, '../../data/expandedCities.js');

        if (fs.existsSync(expandedPath)) {
            console.log(`📂 正在加载扩展城市数据库...`);
            const startTime = Date.now();

            const fileContent = fs.readFileSync(expandedPath, 'utf8');

            // 提取EXPANDED_CITIES对象
            const match = fileContent.match(/const EXPANDED_CITIES = (\{[\s\S]*?\});\s*$/);

            if (match) {
                const citiesData = eval(`(${match[1]})`);
                const loadTime = Date.now() - startTime;

                // 数据统计和验证
                const stats = {
                    totalCities: Object.keys(citiesData).length,
                    validCities: 0,
                    invalidCities: 0,
                    totalWarnings: 0,
                    tagsCount: {},
                    seasonDistribution: {}
                };

                // 验证每个城市数据
                for (const [cityName, rawCityData] of Object.entries(citiesData)) {
                    const validation = validateCityData(cityName, rawCityData);

                    if (validation.valid) {
                        stats.validCities++;
                        citiesData[cityName] = sanitizeCityData(rawCityData);
                    } else {
                        stats.invalidCities++;
                        console.warn(`⚠️ 城市 "${cityName}" 数据验证失败:`, validation.errors);
                        // 尝试修复数据
                        citiesData[cityName] = sanitizeCityData(rawCityData);
                    }

                    stats.totalWarnings += validation.warnings.length;

                    // 统计标签分布
                    if (citiesData[cityName]?.tags) {
                        for (const tag of citiesData[cityName].tags) {
                            stats.tagsCount[tag] = (stats.tagsCount[tag] || 0) + 1;
                        }
                    }

                    // 统计季节分布
                    const season = citiesData[cityName]?.season || '未知';
                    stats.seasonDistribution[season] = (stats.seasonDistribution[season] || 0) + 1;
                }

                console.log(`✅ 扩展城市数据库加载成功:`);
                console.log(`   📊 总计: ${stats.totalCities} 个城市`);
                console.log(`   ✅ 有效: ${stats.validCities} 个`);
                console.log(`   ⚠️ 警告: ${stats.totalWarnings} 条`);
                console.log(`   ⏱️ 加载时间: ${loadTime}ms`);
                console.log(`   🏷️ 标签种类: ${Object.keys(stats.tagsCount).length}`);
                console.log(`   📦 版本: ${DATA_VERSION}`);

                return citiesData;
            } else {
                throw new Error('无法解析EXPANDED_CITIES对象');
            }
        } else {
            console.log('⚠️ 未找到扩展城市数据库文件，使用内置数据');
            return require('./cities');
        }
    } catch (error) {
        console.error('❌ 加载扩展城市数据失败:', error.message);
        console.error(error.stack);

        // 回退到内置数据
        try {
            const fallbackData = require('./cities');
            console.log(`⚠️ 已回退到内置数据: ${Object.keys(fallbackData).length} 个城市`);
            return fallbackData;
        } catch (fallbackError) {
            console.error('❌ 加载内置数据也失败:', fallbackError.message);
            return {};
        }
    }
}

/**
 * 获取所有城市数据（带缓存）
 */
function getAllCities() {
    const now = Date.now();

    if (!cachedCities || !lastLoadTime || (now - lastLoadTime) > CACHE_DURATION) {
        cachedCities = loadExpandedCities();
        lastLoadTime = now;
    }

    return cachedCities;
}

/**
 * 获取单个城市数据（带增强信息）
 */
function getCityData(cityName) {
    const cities = getAllCities();

    if (!cityName) {
        return null;
    }

    // 精确匹配
    if (cities[cityName]) {
        return enhanceCityData(cityName, cities[cityName]);
    }

    // 模糊匹配（支持别名、简称等）
    const lowerCityName = cityName.toLowerCase().trim();
    for (const [name, data] of Object.entries(cities)) {
        if (
            name.toLowerCase().includes(lowerCityName) ||
            lowerCityName.includes(name.toLowerCase()) ||
            name.replace(/[市县区]/g, '').includes(lowerCityName)
        ) {
            return enhanceCityData(name, data, cityName);
        }
    }

    return null;
}

/**
 * 增强城市数据（添加额外信息）
 */
function enhanceCityData(originalName, data, queryName = null) {
    const enhanced = {
        ...data,
        originalName,
        matchedName: queryName || originalName,
        _enhanced: {
            retrievedAt: new Date().toISOString(),
            source: 'expanded-cities-database',
            version: DATA_VERSION
        }
    };

    // 添加推荐指数
    enhanced.recommendationScore = calculateRecommendationScore(data);

    // 添加热门度（模拟，实际应从用户行为数据获取）
    enhanced.popularity = calculatePopularity(originalName);

    return enhanced;
}

/**
 * 计算城市推荐指数（0-100）
 */
function calculateRecommendationScore(cityData) {
    let score = 50; // 基础分

    // 标签丰富度加分
    if (cityData.tags && cityData.tags.length > 3) {
        score += Math.min(20, cityData.tags.length * 4);
    }

    // 美食多样性加分
    if (cityData.foods && cityData.foods.length > 3) {
        score += Math.min(15, cityData.foods.length * 3);
    }

    // 必吃美食加分
    if (cityData.foods) {
        const mustTryCount = cityData.foods.filter(f => f.mustTry).length;
        score += Math.min(10, mustTryCount * 5);
    }

    // 路线完整性加分
    if (cityData.routes && cityData.routes.length >= 2) {
        score += 5;
    }

    return Math.min(100, score);
}

/**
 * 计算城市热门度（基于预设权重）
 */
function calculatePopularity(cityName) {
    // 热门城市列表（实际应从访问日志、搜索频率等计算）
    const popularCities = [
        '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
        '南京', '苏州', '厦门', '青岛', '大连', '武汉', '长沙', '天津',
        '丽江', '三亚', '哈尔滨', '昆明', '桂林', '拉萨', '乌鲁木齐'
    ];

    if (popularCities.includes(cityName)) {
        return 90 + Math.floor(Math.random() * 10); // 90-99
    }

    return Math.floor(Math.random() * 80 + 20); // 20-99
}

/**
 * 智能搜索城市（支持多种匹配方式）
 */
function searchCities(query, limit = 10) {
    const cities = getAllCities();
    const results = [];

    if (!query || typeof query !== 'string') {
        return results;
    }

    const lowerQuery = query.toLowerCase().trim();
    const keywords = lowerQuery.split(/\s+/).filter(k => k.length >= 1);

    for (const [cityName, cityData] of Object.entries(cities)) {
        let score = 0;
        const matchDetails = [];

        // 1. 精确匹配（最高优先级）
        if (cityName === query || cityName.toLowerCase() === lowerQuery) {
            score += 100;
            matchDetails.push('exact');
        }
        // 2. 包含匹配
        else if (cityName.includes(query) || cityName.toLowerCase().includes(lowerQuery)) {
            score += 85;
            matchDetails.push('contains');
        }
        // 3. 模糊包含
        else if (lowerQuery.includes(cityName.toLowerCase()) ||
                 cityName.replace(/[市县区]/g, '').includes(lowerQuery)) {
            score += 70;
            matchDetails.push('fuzzy');
        }

        // 4. 关键词匹配（标题、标签、副标题）
        if (cityData.title && cityData.title.toLowerCase().includes(lowerQuery)) {
            score += 40;
            matchDetails.push('title');
        }

        if (cityData.tags && Array.isArray(cityData.tags)) {
            for (const tag of cityData.tags) {
                if (tag.toLowerCase().includes(lowerQuery)) {
                    score += 25;
                    matchDetails.push(`tag:${tag}`);
                }
                // 多关键词匹配加分
                for (const keyword of keywords) {
                    if (tag.toLowerCase().includes(keyword) && keyword !== lowerQuery) {
                        score += 10;
                    }
                }
            }
        }

        if (cityData.poster?.subtitle &&
            cityData.poster.subtitle.toLowerCase().includes(lowerQuery)) {
            score += 30;
            matchDetails.push('subtitle');
        }

        // 5. 拼音首字母匹配（简化版）
        const pinyinMatch = checkPinyinMatch(cityName, lowerQuery);
        if (pinyinMatch) {
            score += pinyinMatch.score;
            matchDetails.push('pinyin');
        }

        // 记录结果
        if (score > 0) {
            results.push({
                name: cityName,
                score: Math.round(score),
                matchType: matchDetails[0],
                matchDetails,
                data: cityData
            });
        }
    }

    // 按分数降序排序
    results.sort((a, b) => b.score - a.score);

    // 限制返回数量
    return results.slice(0, limit);
}

/**
 * 简化的拼音首字母匹配
 */
function checkPinyinMatch(chineseText, query) {
    // 常见城市的拼音映射表（简化版）
    const pinyinMap = {
        '北京': 'bj', '上海': 'sh', '广州': 'gz', '深圳': 'sz',
        '成都': 'cd', '杭州': 'hz', '西安': 'xa', '重庆': 'cq',
        '南京': 'nj', '苏州': 'sz', '厦门': 'xm', '青岛': 'qd',
        '大连': 'dl', '武汉': 'wh', '长沙': 'cs', '天津': 'tj',
        '丽江': 'lj', '三亚': 'sy', '哈尔滨': 'heb', '昆明': 'km',
        '桂林': 'gl', '拉萨': 'ls', '乌鲁木齐': 'wlmq'
    };

    const pinyin = pinyinMap[chineseText];
    if (pinyin && (pinyin.includes(query) || query.includes(pinyin))) {
        return { score: 60 };
    }

    return null;
}

/**
 * 获取热门城市排行
 */
function getTrendingCities(limit = 10) {
    const cities = getAllCities();

    // 热门城市列表（可配置）
    const trendingList = [
        '北京', '上海', '成都', '杭州', '西安', '重庆', '广州', '厦门',
        '南京', '青岛', '苏州', '丽江', '三亚', '哈尔滨', '武汉', '长沙',
        '天津', '大理', '桂林', '深圳', '昆明', '拉萨', '乌鲁木齐', '敦煌',
        '张家界', '黄山', '九寨沟', '凤凰古城', '乌镇', '周庄'
    ].filter(city => cities[city]);

    const result = trendingList.slice(0, limit).map((cityName, index) => ({
        rank: index + 1,
        name: cityName,
        data: cities[cityName],
        popularity: calculatePopularity(cityName),
        recommendationScore: calculateRecommendationScore(cities[cityName])
    }));

    return result;
}

/**
 * 按省份/区域分组获取城市
 */
function getCitiesByRegion(regionType = 'province') {
    const cities = getAllCities();
    const regions = {};

    for (const [cityName, cityData] of Object.entries(cities)) {
        // 从标签推断省份/区域
        let region = '其他';

        // 常见的省份关键词
        const regionKeywords = {
            '华北': ['北京', '天津', '河北', '山西', '内蒙古'],
            '东北': ['辽宁', '吉林', '黑龙江'],
            '华东': ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东'],
            '华中': ['河南', '湖北', '湖南'],
            '华南': ['广东', '广西', '海南'],
            '西南': ['重庆', '四川', '贵州', '云南', '西藏'],
            '西北': ['陕西', '甘肃', '青海', '宁夏', '新疆'],
            '港澳台': ['香港', '澳门', '台湾']
        };

        // 尝试从标签或名称推断
        for (const [regionName, provinces] of Object.entries(regionKeywords)) {
            for (const province of provinces) {
                if (cityName.includes(province) ||
                    (cityData.tags && cityData.tags.some(tag => tag.includes(province)))) {
                    region = regionName;
                    break;
                }
            }
            if (region !== '其他') break;
        }

        if (!regions[region]) {
            regions[region] = [];
        }

        regions[region].push({
            name: cityName,
            data: cityData
        });
    }

    // 对每个区域的城市按推荐分数排序
    for (const region of Object.keys(regions)) {
        regions[region].sort((a, b) =>
            calculateRecommendationScore(b.data) - calculateRecommendationScore(a.data)
        );
    }

    return regions;
}

/**
 * 获取统计数据
 */
function getStatistics() {
    const cities = getAllCities();
    const stats = {
        version: DATA_VERSION,
        lastUpdated: DATA_LAST_UPDATED,
        totalCities: Object.keys(cities).length,

        // 区域分布
        regions: {},
        regionCount: 0,

        // 季节分布
        seasons: {},

        // 标签统计
        tags: {},
        topTags: [],

        // 推荐分数分布
        scores: {
            excellent: 0,  // 90-100
            good: 0,       // 70-89
            average: 0,    // 50-69
            poor: 0        // <50
        },

        // 数据质量
        quality: {
            completeData: 0,
            withFoods: 0,
            withRoutes: 0,
            withTags: 0
        },

        // 性能指标
        performance: {
            avgTagsPerCity: 0,
            avgFoodsPerCity: 0,
            avgRoutesPerCity: 0
        }
    };

    let totalTags = 0;
    let totalFoods = 0;
    let totalRoutes = 0;

    for (const [cityName, cityData] of Object.entries(cities)) {
        // 统计季节
        const season = cityData.season || '未知';
        stats.seasons[season] = (stats.seasons[season] || 0) + 1;

        // 统计标签
        if (cityData.tags && Array.isArray(cityData.tags)) {
            stats.quality.withTags++;
            totalTags += cityData.tags.length;

            for (const tag of cityData.tags) {
                stats.tags[tag] = (stats.tags[tag] || 0) + 1;
            }
        }

        // 统计美食
        if (cityData.foods && cityData.foods.length > 0) {
            stats.quality.withFoods++;
            totalFoods += cityData.foods.length;
        }

        // 统计路线
        if (cityData.routes && cityData.routes.length > 0) {
            stats.quality.withRoutes++;
            totalRoutes += cityData.routes.length;
        }

        // 完整性检查
        if (cityData.title && cityData.season && cityData.tags?.length > 0) {
            stats.quality.completeData++;
        }

        // 推荐分数分布
        const score = calculateRecommendationScore(cityData);
        if (score >= 90) stats.scores.excellent++;
        else if (score >= 70) stats.scores.good++;
        else if (score >= 50) stats.scores.average++;
        else stats.scores.poor++;
    }

    // 计算平均值
    stats.performance.avgTagsPerCity = (totalTags / stats.totalCities).toFixed(1);
    stats.performance.avgFoodsPerCity = (totalFoods / stats.totalCities).toFixed(1);
    stats.performance.avgRoutesPerCity = (totalRoutes / stats.totalCities).toFixed(1);

    // 获取Top 10标签
    stats.topTags = Object.entries(stats.tags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

    // 区域分组
    stats.regions = getCitiesByRegion();
    stats.regionCount = Object.keys(stats.regions).length;

    return stats;
}

/**
 * 导出城市数据（支持JSON格式）
 */
function exportCities(format = 'json', options = {}) {
    const cities = getAllCities();

    if (format === 'json') {
        const exportData = {
            version: DATA_VERSION,
            exportedAt: new Date().toISOString(),
            totalCount: Object.keys(cities).length,
            data: options.full ? cities : Object.fromEntries(
                Object.entries(cities).map(([name, data]) => [
                    name,
                    {
                        title: data.title,
                        season: data.season,
                        days: data.days,
                        tags: data.tags,
                        subtitle: data.poster?.subtitle
                    }
                ])
            )
        };

        return JSON.stringify(exportData, null, 2);
    }

    throw new Error(`不支持的导出格式: ${format}`);
}

/**
 * 清除缓存
 */
function clearCache() {
    cachedCities = null;
    lastLoadTime = null;
    console.log('🗑️ 城市数据缓存已清除');
}

module.exports = {
    getAllCities,
    getCityData,
    searchCities,
    getTrendingCities,
    getCitiesByRegion,
    getStatistics,
    exportCities,
    clearCache,
    loadExpandedCities,
    validateCityData,
    sanitizeCityData,
    generateDataHash,
    calculateRecommendationScore,
    calculatePopularity,

    // 常量
    DATA_VERSION,
    DATA_LAST_UPDATED,
    CACHE_DURATION
};
