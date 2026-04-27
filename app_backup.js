// 城市数据库 - 从后端API加载
let cityDatabase = {};
let searchHistory = [];
let selectedDays = 3;

// 异步初始化城市数据
async function initCityDatabase() {
    try {
        console.log('正在从后端加载城市数据...');
        const response = await fetch('http://localhost:3001/api/cities/all');
        if (response.ok) {
            const data = await response.json();
            cityDatabase = data;
            console.log('城市数据加载成功，共', Object.keys(cityDatabase).length, '个城市');
            initApp();
        } else {
            console.error('城市数据加载失败');
            initApp();
        }
    } catch (error) {
        console.error('无法连接到后端服务器:', error);
        initApp();
    }
}

// 城市别名
const cityAliases = {
    '北京': ['beijing', 'bj', '京城', '帝都', '北平'],
    '上海': ['shanghai', 'sh', '魔都', '申城', '沪上'],
    '成都': ['chengdu', 'cd', '蓉城', '天府之国', '蜀都'],
    '杭州': ['hangzhou', 'hz', '临安', '钱塘'],
    '西安': ['xian', 'xa', '长安', '古都'],
    '重庆': ['chongqing', 'cq', '山城', '雾都', '渝州'],
    '广州': ['guangzhou', 'gz', '羊城', '花城'],
    '厦门': ['xiamen', 'xm', '鹭岛', '海上花园'],
    '南京': ['nanjing', 'nj', '金陵', '江宁'],
    '青岛': ['qingdao', 'qd', '岛城', '琴岛'],
    '苏州': ['suzhou', '姑苏', '吴中', '水乡'],
    '丽江': ['lijiang', 'lj', '大研', '丽江古城'],
    '三亚': ['sanya', 'sy', '天涯海角', '鹿城'],
    '哈尔滨': ['harbin', 'hrb', '冰城', '东方莫斯科'],
    '武汉': ['wuhan', 'wh', '江城'],
    '长沙': ['changsha', 'cs', '星城'],
    '天津': ['tianjin', 'tj', '津门', '天津卫'],
    '大理': ['dali', 'dl', '风花雪月'],
    '桂林': ['guilin', 'gl', '漓江', '阳朔'],
    '深圳': ['shenzhen', '鹏城'],
    '珠海': ['zhuhai', 'zh', '百岛之城'],
    '昆明': ['kunming', 'km', '春城', '花都'],
    '拉萨': ['lasa', 'ls', '日光城'],
    '乌鲁木齐': ['wulumuqi', 'wlmq', '天山'],
    '兰州': ['lanzhou', 'lz', '黄河之都'],
    '沈阳': ['shenyang', '盛京'],
    '郑州': ['zhengzhou', 'zz', '中原', '商都'],
    '贵阳': ['guiyang', 'gy', '林城'],
    '济南': ['jinan', 'jn', '泉城', '齐鲁'],
    '太原': ['taiyuan', 'ty', '龙城'],
    '南宁': ['nanning', 'nn', '绿城'],
    '西宁': ['xining', 'xn', '夏都'],
    '银川': ['yinchuan', 'yc', '塞上江南'],
    '海口': ['haikou', 'hk', '椰城'],
    '福州': ['fuzhou', 'fz', '榕城', '闽都'],
    '大连': ['dalian', '滨城', '浪漫之都'],
    '宁波': ['ningbo', 'nb', '甬城'],
    '黄山': ['huangshan', 'hs', '徽州'],
    '敦煌': ['dunhuang', 'dh', '丝路']
};

// 查找城市
function findCity(cityName) {
    const normalized = cityName.trim().toLowerCase();
    
    for (const city of Object.keys(cityDatabase)) {
        if (city.toLowerCase() === normalized) return city;
    }
    
    for (const [city, aliases] of Object.entries(cityAliases)) {
        for (const alias of aliases) {
            if (alias.toLowerCase() === normalized) return city;
            if (alias.toLowerCase().includes(normalized) || normalized.includes(alias.toLowerCase())) return city;
        }
    }
    
    for (const city of Object.keys(cityDatabase)) {
        if (city.includes(normalized) || normalized.includes(city)) return city;
        const pinyinMatch = getPinyinInitials(city).toLowerCase().includes(normalized);
        if (pinyinMatch) return city;
    }
    
    let bestMatch = null;
    let bestScore = 0;
    for (const city of Object.keys(cityDatabase)) {
        const score = fuzzyMatchScore(normalized, city.toLowerCase());
        if (score > bestScore && score > 0.5) {
            bestScore = score;
            bestMatch = city;
        }
    }
    return bestMatch;
}

function getPinyinInitials(city) {
    const pinyinMap = {
        '北': 'B', '上': 'S', '成': 'C', '杭': 'H', '西': 'X', '安': 'A',
        '重': 'C', '广': 'G', '厦': 'X', '南': 'N', '青': 'Q', '苏': 'S',
        '丽': 'L', '三': 'S', '哈': 'H', '武': 'W', '长': 'C', '天': 'T',
        '大': 'D', '桂': 'G', '深': 'S', '珠': 'Z', '昆': 'K', '拉': 'L',
        '乌': 'W', '兰': 'L', '沈': 'S', '郑': 'Z', '贵': 'G', '济': 'J',
        '太': 'T', '宁': 'N', '银': 'Y', '海': 'H', '福': 'F', '连': 'L',
        '波': 'B', '黄': 'H', '敦': 'D'
    };
    let result = '';
    for (const char of city) {
        result += pinyinMap[char] || char;
    }
    return result;
}

function fuzzyMatchScore(s1, s2) {
    if (s1 === s2) return 1;
    if (s2.includes(s1)) return 0.9;
    if (s1.includes(s2)) return 0.8;
    let matchCount = 0;
    let s1Index = 0;
    for (let i = 0; i < s2.length && s1Index < s1.length; i++) {
        if (s1[s1Index] === s2[i]) matchCount++;
        s1Index++;
    }
    return matchCount / s1.length * 0.6;
}

// 搜索统计
let searchStats = {
    totalSearches: 0,
    citySearches: {},
    topCities: [],
    lastUpdated: new Date().toISOString()
};

// 显示搜索建议
function showSearchSuggestions(keyword) {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (!suggestionsDiv || !keyword.trim()) {
        hideSearchSuggestions();
        return;
    }

    const normalized = keyword.trim().toLowerCase();
    const suggestions = [];
    
    for (const city of Object.keys(cityDatabase)) {
        if (city.toLowerCase().includes(normalized) || 
            normalized.includes(city.toLowerCase()) ||
            getPinyinInitials(city).toLowerCase().includes(normalized)) {
            suggestions.push(city);
        }
        
        if (suggestions.length >= 8) break;
    }
    
    for (const [city, aliases] of Object.entries(cityAliases)) {
        for (const alias of aliases) {
            if (alias.toLowerCase().includes(normalized) && !suggestions.includes(city)) {
                suggestions.push(city);
                break;
            }
        }
        
        if (suggestions.length >= 8) break;
    }

    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }

    suggestionsDiv.innerHTML = suggestions.map(city => `
        <div class="suggestion-item" data-city="${city}">
            <span class="suggestion-icon">📍</span>
            <span class="suggestion-name">${city}</span>
            <span class="suggestion-tags">${cityDatabase[city]?.tags?.slice(0, 2).join(' · ') || ''}</span>
        </div>
    `).join('');
    
    suggestionsDiv.classList.remove('hidden');
    
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const city = item.dataset.city;
            document.getElementById('cityInput').value = city;
            hideSearchSuggestions();
            generateCityGuide(city);
        });
    });
}

function hideSearchSuggestions() {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (suggestionsDiv) {
        suggestionsDiv.classList.add('hidden');
    }
}

function recordSearch(cityName) {
    searchStats.totalSearches++;
    searchStats.citySearches[cityName] = (searchStats.citySearches[cityName] || 0) + 1;
    searchStats.lastUpdated = new Date().toISOString();
    searchStats.topCities = Object.entries(searchStats.citySearches)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([city, count]) => ({ city, count }));
    updateRankingDisplay();
    updateTotalSearches();
}

function updateRankingDisplay() {
    const rankingList = document.getElementById('rankingList');
    if (!rankingList || searchStats.topCities.length === 0) return;
    
    const medals = ['🥇', '🥈', '🥉'];
    const top10 = searchStats.topCities.slice(0, 10);
    
    rankingList.innerHTML = top10.map((item, index) => `
        <div class="rank-item">
            <div class="rank-left">
                <span class="rank-badge ${index < 3 ? 'medal' : ''}">${index < 3 ? medals[index] : index + 1}</span>
                <span class="rank-city">${item.city}</span>
            </div>
            <div class="rank-right">
                <span class="rank-views">👁 ${item.count.toLocaleString()}</span>
                <div class="rank-bar" style="width: ${Math.max(5, (item.count / top10[0].count) * 100)}%;"></div>
            </div>
        </div>
    `).join('');
}

function updateTotalSearches() {
    const totalEl = document.getElementById('totalSearches');
    if (totalEl) {
        totalEl.textContent = searchStats.totalSearches.toLocaleString();
    }
}

// 应用初始化
function initApp() {
    updateTotalSearches();
    updateRankingDisplay();
}

// 生成城市攻略
async function generateCityGuide(cityName) {
    if (!cityName) {
        showError('请输入城市名称！');
        return;
    }

    recordSearch(cityName);

    document.getElementById('result').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    await new Promise(resolve => setTimeout(resolve, 800));

    const matchedCity = findCity(cityName);
    const resultDiv = document.getElementById('result');

    if (matchedCity && cityDatabase[matchedCity]) {
        resultDiv.innerHTML = generatePosterHTML(cityDatabase[matchedCity], matchedCity);
        document.getElementById('loading').classList.add('hidden');
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        document.getElementById('loading').classList.add('hidden');
        resultDiv.innerHTML = `
            <div class="poster">
                <div class="poster-header">
                    <h2 class="poster-city">${cityName}</h2>
                    <p class="poster-slogan">待探索城市</p>
                </div>
                <div class="poster-body">
                    <p style="text-align: center; padding: 40px;">该城市数据正在收集中，敬请期待...</p>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showError(message) {
    showToast(message, 'error');
}

// 省份城市映射
const provinceCityMap = {
    '北京': ['北京'],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆'],
    '河北': ['石家庄', '保定', '张家口', '承德', '秦皇岛', '唐山', '廊坊'],
    '山西': ['太原', '大同', '平遥'],
    '辽宁': ['沈阳', '大连'],
    '吉林': ['长春', '吉林', '长白山'],
    '黑龙江': ['哈尔滨'],
    '江苏': ['南京', '苏州', '无锡'],
    '浙江': ['杭州', '宁波', '温州', '嘉兴'],
    '安徽': ['黄山', '合肥'],
    '福建': ['福州', '厦门'],
    '江西': ['南昌', '九江', '景德镇'],
    '山东': ['青岛', '济南', '烟台'],
    '河南': ['郑州', '洛阳'],
    '湖北': ['武汉'],
    '湖南': ['长沙', '张家界'],
    '广东': ['广州', '深圳', '珠海'],
    '广西': ['南宁', '桂林'],
    '海南': ['三亚', '海口'],
    '四川': ['成都'],
    '贵州': ['贵阳'],
    '云南': ['昆明', '丽江', '大理'],
    '西藏': ['拉萨'],
    '陕西': ['西安'],
    '甘肃': ['兰州', '敦煌'],
    '青海': ['西宁'],
    '宁夏': ['银川'],
    '新疆': ['乌鲁木齐'],
    '内蒙古': ['呼和浩特']
};

// 生成海报HTML
function generatePosterHTML(cityData, cityName) {
    let itineraryTypes = cityData.itineraries ? Object.keys(cityData.itineraries) : [];
    
    let selectedItinerary = itineraryTypes[0] || '1天';
    
    const routeItems = cityData.routes.map((route, i) => `
        <div class="route-item">
            <span class="route-day">第${i + 1}天</span>
            <div class="route-spots">
                ${route.split('→').map((spot, idx) => `
                    <span class="route-spot">${spot.trim()}</span>
                    ${idx < route.split('→').length - 1 ? '<span class="route-arrow">→</span>' : ''}
                `).join('')}
            </div>
        </div>
    `).join('');

    const foodCards = cityData.foods.map(food => `
        <div class="food-card">
            <div class="food-icon">🍜</div>
            <div class="food-name">${food.name} ${food.mustTry ? '<span class="badge-must">必尝</span>' : ''}</div>
            <div class="food-desc">${food.desc}</div>
            <span class="food-price">${food.price}</span>
        </div>
    `).join('');

    const hotelCards = cityData.accommodations.map(hotel => `
        <div class="hotel-card">
            <div class="hotel-name">🏨 ${hotel.area}</div>
            <div class="hotel-info"><strong>优点：</strong>${hotel.pros}</div>
            <div class="hotel-info"><strong>缺点：</strong>${hotel.cons}</div>
        </div>
    `).join('');

    const transportCards = cityData.transport.map(t => `
        <div class="transport-card">
            <div class="transport-type">${t.type}</div>
            <div class="transport-info">${t.info}</div>
        </div>
    `).join('');

    const colorDots = cityData.poster.colors.map(c => `
        <div class="color-dot" style="background-color: ${c};"></div>
    `).join('');

    const elementTags = cityData.poster.elements.map(el => `
        <span class="design-tag">${el}</span>
    `).join('');

    const linksHTML = cityData.links ? `
        <div class="links-section">
            <h3 class="section-title">🔗 实用链接</h3>
            <div class="links-grid">
                <div class="link-group">
                    <div class="link-group-title">🏛️ 官方网站</div>
                    <a href="${cityData.links.official}" target="_blank" class="link-item official-link">
                        <span class="link-icon">🌐</span>
                        <span class="link-text">${cityName}旅游网</span>
                        <span class="link-arrow">↗</span>
                    </a>
                </div>
                <div class="link-group">
                    <div class="link-group-title">🎯 景点门票</div>
                    ${cityData.links.attractions.map(attr => `
                        <a href="${attr.url}" target="_blank" class="link-item">
                            <span class="link-icon">📍</span>
                            <span class="link-text">${attr.name} ${attr.mustVisit ? '<span class="badge-must">必去</span>' : ''}</span>
                            <span class="link-arrow">↗</span>
                        </a>
                    `).join('')}
                </div>
                <div class="link-group">
                    <div class="link-group-title">🎟️ 预约购票</div>
                    ${cityData.links.booking.map(b => `
                        <a href="${b.url}" target="_blank" class="link-item booking-link">
                            <span class="link-icon">🎫</span>
                            <span class="link-text">${b.name}</span>
                            <span class="link-arrow">↗</span>
                        </a>
                    `).join('')}
                </div>
                <div class="link-group">
                    <div class="link-group-title">🍜 美食推荐</div>
                    ${cityData.links.food.map(f => `
                        <a href="${f.url}" target="_blank" class="link-item food-link">
                            <span class="link-icon">🍽️</span>
                            <span class="link-text">${f.name}</span>
                            <span class="link-arrow">↗</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
    ` : '';

    const itinerarySelectorHTML = itineraryTypes.length > 0 ? `
        <div class="itinerary-selector">
            <div class="itinerary-tabs">
                ${itineraryTypes.map(type => `
                    <button class="itinerary-tab ${type === selectedItinerary ? 'active' : ''}" data-itinerary="${type}">
                        ${type}
                    </button>
                `).join('')}
            </div>
            <div class="itinerary-content">
                ${itineraryTypes.map(type => {
                    const itinerary = cityData.itineraries[type];
                    return `
                        <div class="itinerary-panel ${type === selectedItinerary ? 'active' : ''}" data-panel="${type}">
                            <div class="itinerary-routes">
                                ${itinerary.routes.map(route => `
                                    <div class="itinerary-route-item">
                                        ${route.time ? `<div class="route-time"><span class="time-icon">🕐</span><span>${route.time}</span></div>` : ''}
                                        ${route.morning ? `<div class="route-period"><span class="period-icon">🌅</span><span>${route.morning}</span></div>` : ''}
                                        ${route.afternoon ? `<div class="route-period"><span class="period-icon">☀️</span><span>${route.afternoon}</span></div>` : ''}
                                        ${route.evening ? `<div class="route-period"><span class="period-icon">🌙</span><span>${route.evening}</span></div>` : ''}
                                        ${route.morning2 ? `<div class="route-period"><span class="period-icon">🌅</span><span>${route.morning2}</span></div>` : ''}
                                        ${route.afternoon2 ? `<div class="route-period"><span class="period-icon">☀️</span><span>${route.afternoon2}</span></div>` : ''}
                                        ${route.evening2 ? `<div class="route-period"><span class="period-icon">🌙</span><span>${route.evening2}</span></div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="itinerary-tips">
                                <h4> 行程小贴士</h4>
                                <ul>
                                    ${itinerary.tips.map(tip => `<li>${tip}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="itinerary-budget">
                                <span class="budget-label">💰 预算参考：</span>
                                <span class="budget-value">${itinerary.budget}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    ` : '';

    // 天气信息HTML
    const weatherHTML = cityData.currentWeather ? `
        <div class="weather-card">
            <div class="weather-header">
                <h3 class="weather-city">🌤️ ${cityName}实时天气</h3>
                <span class="weather-time">更新于 ${new Date(cityData.currentWeather.updateTime).toLocaleString('zh-CN')}</span>
            </div>
            <div class="weather-main">
                <div class="weather-temp">${cityData.currentWeather.current.temp}</div>
                <div class="weather-info">
                    <div class="weather-condition">${cityData.currentWeather.current.condition}</div>
                    <div class="weather-details-row">
                        <span>💧 湿度: ${cityData.currentWeather.current.humidity}</span>
                        <span>💨 风力: ${cityData.currentWeather.current.wind}</span>
                        <span>👁️ 能见度: ${cityData.currentWeather.current.visibility}</span>
                    </div>
                </div>
            </div>
            ${cityData.currentWeather.forecast && cityData.currentWeather.forecast.length > 0 ? `
                <div class="weather-forecast">
                    <h4>未来预报</h4>
                    <div class="forecast-days">
                        ${cityData.currentWeather.forecast.slice(0, 3).map(day => `
                            <div class="forecast-day">
                                <div class="forecast-date">${new Date(day.date).toLocaleDateString('zh-CN', {month: 'short', day: 'numeric'})}</div>
                                <div class="forecast-condition">${day.condition}</div>
                                <div class="forecast-temp">${day.temp}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    ` : '';

    return `
        <div class="poster">
            <div class="poster-header">
                <h2 class="poster-city">${cityName}</h2>
                <p class="poster-slogan">${cityData.poster.subtitle}</p>
                <div class="poster-tags">
                    ${cityData.tags.map(tag => `<span class="poster-tag">${tag}</span>`).join('')}
                    <span class="poster-tag">${cityData.season}</span>
                    <span class="poster-tag">建议${cityData.days}</span>
                </div>
            </div>

            <div class="poster-body">
                ${weatherHTML}
                
                ${itinerarySelectorHTML}
                
                <h3 class="section-title" style="margin-top: 30px;">🗺️ 经典路线</h3>
                <div class="route-list">${routeItems}</div>

                <h3 class="section-title" style="margin-top: 30px;">🍜 美食推荐</h3>
                <div class="food-grid">${foodCards}</div>

                <h3 class="section-title" style="margin-top: 30px;"> 住宿推荐</h3>
                <div class="hotel-grid">${hotelCards}</div>

                <div class="transport-section">
                    <h3 class="section-title">🚗 交通指南</h3>
                    <div class="transport-grid">${transportCards}</div>
                </div>

                <div class="budget-section">
                    <h3 class="section-title">💰 预算估算</h3>
                    <div class="budget-grid">
                        <div class="budget-card">
                            <div class="budget-level">经济型</div>
                            <div class="budget-amount">¥${cityData.budget.low}</div>
                        </div>
                        <div class="budget-card">
                            <div class="budget-level">舒适型</div>
                            <div class="budget-amount">¥${cityData.budget.medium}</div>
                        </div>
                        <div class="budget-card">
                            <div class="budget-level">豪华型</div>
                            <div class="budget-amount">¥${cityData.budget.high}</div>
                        </div>
                    </div>
                </div>

                <div class="tips-grid">
                    <div class="tip-card">
                        <div class="tip-title">🎒 行前准备</div>
                        <ul class="tip-list">
                            ${cityData.tips.prepare.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="tip-card">
                        <div class="tip-title">️ 避坑指南</div>
                        <ul class="tip-list avoid">
                            ${cityData.tips.avoid.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                ${linksHTML}
            </div>

            <div class="poster-design">
                <h3 class="section-title">🎨 海报视觉设计</h3>
                <div class="design-main">
                    <div class="design-title">${cityData.poster.title}</div>
                    <div class="design-subtitle">${cityData.poster.subtitle}</div>
                </div>
                <div class="design-grid">
                    <div class="design-item">
                        <div class="design-label">视觉元素</div>
                        <div class="design-tags">${elementTags}</div>
                    </div>
                    <div class="design-item">
                        <div class="design-label">构图布局</div>
                        <div class="design-content">${cityData.poster.layout}</div>
                    </div>
                    <div class="design-item">
                        <div class="design-label">配色方案</div>
                        <div class="color-list">${colorDots}</div>
                    </div>
                </div>
            </div>

            <div class="poster-footer">
                <div class="footer-text">由 AI 智能生成 | 仅供参考</div>
                <div class="footer-actions">
                    <button class="action-btn save-btn" onclick="savePoster()">💾 保存攻略</button>
                    <button class="action-btn share-btn" onclick="sharePoster()">📤 分享攻略</button>
                </div>
            </div>
        </div>
    `;
}

// 保存海报
function savePoster() {
    const poster = document.querySelector('.poster');
    if (!poster) {
        showError('请先生成攻略！');
        return;
    }

    const cityName = document.getElementById('cityInput').value || '旅游攻略';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    // 使用浏览器打印功能保存
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${cityName}旅游攻略</title>
            <link rel="stylesheet" href="http://localhost:8080/style.css">
            <style>
                @media print {
                    body { margin: 0; }
                    .poster { box-shadow: none; margin: 0; }
                    .footer-actions { display: none !important; }
                }
            </style>
        </head>
        <body>
            ${poster.innerHTML}
            <script>
                setTimeout(() => {
                    window.print();
                    window.close();
                }, 500);
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
    showSuccess('正在打开打印对话框，您可以选择"另存为PDF"');
}

// 分享攻略
function sharePoster() {
    const url = window.location.href;
    const text = '分享一个旅游攻略，快来看看吧！';
    
    if (navigator.share) {
        navigator.share({
            title: '旅游攻略分享',
            text: text,
            url: url
        }).catch(err => console.log('分享失败:', err));
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showSuccess('链接已复制到剪贴板！');
        }).catch(() => {
            showError('复制失败，请手动复制链接');
        });
    } else {
        showError('您的浏览器不支持分享功能');
    }
}

// DOM加载完成后初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const generateBtn = document.getElementById('generateBtn');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    let selectedIndex = -1;

    // 输入框事件 - 搜索建议
    if (cityInput) {
        cityInput.addEventListener('input', function() {
            const keyword = this.value;
            if (keyword.trim().length > 0) {
                showSearchSuggestions(keyword);
            } else {
                hideSearchSuggestions();
            }
        });

        cityInput.addEventListener('focus', function() {
            if (this.value.trim().length > 0) {
                showSearchSuggestions(this.value);
            }
        });

        cityInput.addEventListener('blur', function() {
            setTimeout(() => hideSearchSuggestions(), 200);
        });

        cityInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                hideSearchSuggestions();
                generateCityGuide(this.value.trim());
                return;
            }

            const items = suggestionsDiv?.querySelectorAll('.suggestion-item');
            if (!items || items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSuggestionSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSuggestionSelection(items);
            } else if (e.key === 'Escape') {
                hideSearchSuggestions();
            }
        });
    }

    function updateSuggestionSelection(items) {
        items.forEach((item, idx) => {
            item.classList.toggle('selected', idx === selectedIndex);
        });
        
        if (selectedIndex >= 0 && selectedIndex < items.length) {
            cityInput.value = items[selectedIndex].dataset.city;
        }
    }

    // 行程标签切换
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('itinerary-tab')) {
            const tabs = document.querySelectorAll('.itinerary-tab');
            const panels = document.querySelectorAll('.itinerary-panel');
            const selectedItinerary = e.target.dataset.itinerary;
            
            tabs.forEach(tab => tab.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            
            e.target.classList.add('active');
            document.querySelector(`.itinerary-panel[data-panel="${selectedItinerary}"]`)?.classList.add('active');
        }
    });

    // 生成按钮事件
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const cityName = cityInput?.value.trim();
            generateCityGuide(cityName);
        });
    }

    // 快速选择按钮事件
    document.querySelectorAll('.quick-city-btn, .quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cityName = this.dataset.city;
            if (cityInput) cityInput.value = cityName;
            generateCityGuide(cityName);
        });
    });

    // 省份城市选择器
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');
    
    if (provinceSelect) {
        for (const province of Object.keys(provinceCityMap)) {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        }
        
        provinceSelect.addEventListener('change', function() {
            const selectedProvince = this.value;
            citySelect.innerHTML = '<option value="">选择城市</option>';
            
            if (selectedProvince && provinceCityMap[selectedProvince]) {
                citySelect.disabled = false;
                for (const city of provinceCityMap[selectedProvince]) {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                }
            } else {
                citySelect.disabled = true;
            }
        });
        
        citySelect.addEventListener('change', function() {
            if (this.value) {
                if (cityInput) cityInput.value = this.value;
                generateCityGuide(this.value);
            }
        });
    }

    // 同步按钮事件
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            try {
                syncBtn.disabled = true;
                syncBtn.textContent = '同步中...';
                
                const response = await fetch('http://localhost:3001/api/cities/all');
                if (response.ok) {
                    cityDatabase = await response.json();
                    console.log('城市数据已同步，共', Object.keys(cityDatabase).length, '个城市');
                    showSuccess('数据同步成功！');
                }
            } catch (error) {
                console.error('同步失败:', error);
                showError('同步失败，请检查后端服务');
            } finally {
                syncBtn.disabled = false;
                syncBtn.textContent = '同步数据';
            }
        });
    }
});

function showSuccess(message) {
    showToast(message, 'success');
}

function showInfo(message) {
    showToast(message, 'info');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 启动应用
initCityDatabase();