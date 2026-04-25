const cityDatabase = {
    '北京': {
        tags: ['历史古都', '文化名城', '现代化大都市'],
        season: '春秋两季',
        atmosphere: '历史与现代交融，文化底蕴深厚',
        days: '4-5天',
        routes: ['天安门广场 → 故宫 → 景山公园', '颐和园 → 圆明园', '八达岭长城 → 明十三陵'],
        foods: [
            { name: '北京烤鸭', desc: '北京特色，皮脆肉嫩', price: '150-300元/只', mustTry: true },
            { name: '炸酱面', desc: '老北京特色面食', price: '20-40元/碗' },
            { name: '豆汁', desc: '老北京传统饮品', price: '5-10元/碗' },
            { name: '焦圈', desc: '油炸面食，香脆可口', price: '5-10元/份' },
            { name: '炒肝', desc: '老北京传统小吃', price: '10-20元/碗' }
        ],
        accommodations: [
            { area: '天安门/王府井', pros: '地理位置优越，交通便利', cons: '价格较高，人流量大' },
            { area: '西单/金融街', pros: '商业中心，购物方便', cons: '交通拥堵，价格较高' },
            { area: '三里屯/国贸', pros: '现代化，国际化氛围', cons: '价格昂贵，消费较高' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '首都国际机场；北京南站、北京西站等多个火车站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.ebeijing.gov.cn/',
            attractions: [
                { name: '故宫', url: 'https://www.dpm.org.cn/', mustVisit: true },
                { name: '长城', url: 'https://www.badaling.gov.cn/', mustVisit: true },
                { name: '颐和园', url: 'https://www.summerpalace-china.com/' }
            ],
            booking: [
                { name: '故宫门票', url: 'https://gugong.228.com.cn/' }
            ],
            food: [
                { name: '北京美食', url: 'https://www.dianping.com/beijing/food' }
            ]
        },
        poster: {
            title: '京城时光',
            subtitle: '穿越千年，遇见北京',
            elements: ['故宫', '长城', '天安门', '颐和园'],
            layout: '顶部故宫剪影，中央长城，底部天安门',
            colors: ['#c0392b', '#34495e', '#f39c12', '#27ae60', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '天安门广场 → 故宫' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-17:00', afternoon2: '景山公园' },
                    { time: '18:00-21:00', evening: '王府井步行街' }
                ],
                tips: ['故宫需要提前预约', '建议早上开门就去'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 天安门广场 → 故宫' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 景山公园' },
                    { time: '18:00-21:00', evening: 'Day1: 王府井步行街' },
                    { time: '08:00-12:00', morning2: 'Day2: 颐和园' },
                    { time: '12:00-14:00', afternoon3: 'Day2: 午餐' },
                    { time: '14:00-17:00', afternoon4: 'Day2: 圆明园' }
                ],
                tips: ['颐和园和圆明园可以安排在一天', '建议购买联票'],
                budget: '600-1000元'
            }
        }
    },
    '上海': {
        tags: ['现代魔都', '国际大都市', '金融中心'],
        season: '3-5月，9-11月',
        atmosphere: '现代化，国际化，快节奏',
        days: '3-4天',
        routes: ['外滩 → 南京路步行街', '豫园 → 城隍庙', '上海迪士尼乐园'],
        foods: [
            { name: '生煎包', desc: '上海特色，底部焦脆', price: '15-30元/份', mustTry: true },
            { name: '小笼包', desc: '皮薄馅多，汤汁鲜美', price: '20-40元/份', mustTry: true },
            { name: '葱油拌面', desc: '上海传统面食', price: '15-25元/碗' },
            { name: '排骨年糕', desc: '上海特色小吃', price: '20-35元/份' },
            { name: '白斩鸡', desc: '上海传统名菜', price: '50-80元/份' }
        ],
        accommodations: [
            { area: '外滩', pros: '江景房，地理位置优越', cons: '价格较高' },
            { area: '南京路', pros: '购物方便，交通便利', cons: '人流量大，噪音大' },
            { area: '徐家汇', pros: '商业中心，交通便利', cons: '价格较高' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '浦东国际机场；虹桥国际机场；上海站、上海南站等多个火车站' }
        ],
        budget: { low: '2000', medium: '4000', high: '6000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开早晚高峰']
        },
        links: {
            official: 'https://www.shanghai.gov.cn/',
            attractions: [
                { name: '外滩', url: 'https://www.thebund.cn/', mustVisit: true },
                { name: '上海迪士尼', url: 'https://www.shanghaidisneyresort.com/', mustVisit: true },
                { name: '豫园', url: 'https://www.yuyuan-garden.com/' }
            ],
            booking: [
                { name: '迪士尼门票', url: 'https://www.shanghaidisneyresort.com/' }
            ],
            food: [
                { name: '上海美食', url: 'https://www.dianping.com/shanghai/food' }
            ]
        },
        poster: {
            title: '魔都掠影',
            subtitle: '东方巴黎，不夜之城',
            elements: ['外滩', '东方明珠', '迪士尼', '豫园'],
            layout: '顶部东方明珠，中央外滩，底部迪士尼',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '外滩 → 南京路步行街' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-17:00', afternoon2: '豫园 → 城隍庙' },
                    { time: '18:00-21:00', evening: '外滩夜景' }
                ],
                tips: ['外滩夜景很美，建议傍晚去', '南京路步行街人很多'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 外滩 → 南京路步行街' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 豫园 → 城隍庙' },
                    { time: '18:00-21:00', evening: 'Day1: 外滩夜景' },
                    { time: '08:00-18:00', morning2: 'Day2: 上海迪士尼乐园' }
                ],
                tips: ['迪士尼需要一整天时间', '建议提前购买门票'],
                budget: '800-1500元'
            }
        }
    }
};

const cityAliases = {
    '北京': ['beijing', 'bj', '京城', '帝都', '北平'],
    '上海': ['shanghai', 'sh', '魔都', '申城', '沪上']
};

function findCity(cityName) {
    cityName = cityName.trim();
    
    if (cityDatabase[cityName]) {
        return cityName;
    }
    
    for (const [city, aliases] of Object.entries(cityAliases)) {
        if (aliases.includes(cityName.toLowerCase())) {
            return city;
        }
    }
    
    return null;
}

function generatePosterHTML(cityData, cityName) {
    const { poster } = cityData;
    return `
        <div class="poster-container">
            <div class="poster">
                <div class="poster-header">
                    <h2>${poster.title}</h2>
                    <p>${poster.subtitle}</p>
                </div>
                <div class="poster-content">
                    <div class="poster-elements">
                        ${poster.elements.map(element => `<div class="poster-element">${element}</div>`).join('')}
                    </div>
                </div>
                <div class="poster-footer">
                    <p>© 2026 旅游攻略</p>
                </div>
            </div>
        </div>
    `;
}

let selectedDays = 2;

function generateItinerary(cityData, days) {
    const itinerary = cityData.itineraries[`${days}天`] || cityData.itineraries[`${days}天${days-1}晚`] || cityData.itineraries['2天1晚'];
    return itinerary;
}

function renderCityContent(cityData, cityName) {
    const contentSection = document.getElementById('content');
    const loading = document.getElementById('loading');
    
    loading.classList.remove('hidden');
    
    setTimeout(() => {
        const itinerary = generateItinerary(cityData, selectedDays);
        
        contentSection.innerHTML = `
            <div class="city-header">
                <h1>${cityName}旅游攻略</h1>
                <div class="city-tags">
                    ${cityData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="city-info">
                <div class="info-item">
                    <span class="info-label">最佳季节：</span>
                    <span class="info-value">${cityData.season}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">建议天数：</span>
                    <span class="info-value">${cityData.days}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">城市氛围：</span>
                    <span class="info-value">${cityData.atmosphere}</span>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🧳 行程规划</h3>
                <div class="itinerary">
                    ${itinerary.routes.map(route => `
                        <div class="route-item">
                            <div class="route-time">${route.time}</div>
                            <div class="route-content">${route.morning || route.afternoon || route.evening || route.morning2 || route.afternoon2 || route.afternoon3 || route.afternoon4}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="itinerary-tips">
                    <h4>小贴士：</h4>
                    <ul>
                        ${itinerary.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                <div class="itinerary-budget">
                    <h4>预算参考：</h4>
                    <p>${itinerary.budget}</p>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🗺️ 经典路线</h3>
                <div class="routes">
                    ${cityData.routes.map(route => `<div class="route">${route}</div>`).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🍜 特色美食</h3>
                <div class="foods">
                    ${cityData.foods.map(food => `
                        <div class="food-item">
                            <div class="food-name">${food.name}${food.mustTry ? ' 🎯' : ''}</div>
                            <div class="food-desc">${food.desc}</div>
                            <div class="food-price">${food.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🏨 住宿推荐</h3>
                <div class="accommodations">
                    ${cityData.accommodations.map(acc => `
                        <div class="accommodation-item">
                            <div class="accommodation-area">${acc.area}</div>
                            <div class="accommodation-pros">✅ ${acc.pros}</div>
                            <div class="accommodation-cons">❌ ${acc.cons}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🚗 交通指南</h3>
                <div class="transport">
                    ${cityData.transport.map(t => `
                        <div class="transport-item">
                            <div class="transport-type">${t.type}：</div>
                            <div class="transport-info">${t.info}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">💰 预算参考</h3>
                <div class="budget">
                    <div class="budget-item">
                        <span class="budget-label">经济型：</span>
                        <span class="budget-value">${cityData.budget.low}元</span>
                    </div>
                    <div class="budget-item">
                        <span class="budget-label">舒适型：</span>
                        <span class="budget-value">${cityData.budget.medium}元</span>
                    </div>
                    <div class="budget-item">
                        <span class="budget-label">豪华型：</span>
                        <span class="budget-value">${cityData.budget.high}元</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">💡 旅行贴士</h3>
                <div class="tips">
                    <div class="tips-prepare">
                        <h4>准备事项：</h4>
                        <ul>
                            ${cityData.tips.prepare.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="tips-avoid">
                        <h4>避免事项：</h4>
                        <ul>
                            ${cityData.tips.avoid.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🔗 实用链接</h3>
                <div class="links">
                    <div class="link-item">
                        <span class="link-label">官方网站：</span>
                        <a href="${cityData.links.official}" target="_blank">${cityData.links.official}</a>
                    </div>
                    ${cityData.links.attractions.map(attraction => `
                        <div class="link-item">
                            <span class="link-label">${attraction.name}${attraction.mustVisit ? ' 🎯' : ''}：</span>
                            <a href="${attraction.url}" target="_blank">${attraction.url}</a>
                        </div>
                    `).join('')}
                    ${cityData.links.booking.map(booking => `
                        <div class="link-item">
                            <span class="link-label">${booking.name}：</span>
                            <a href="${booking.url}" target="_blank">${booking.url}</a>
                        </div>
                    `).join('')}
                    ${cityData.links.food.map(food => `
                        <div class="link-item">
                            <span class="link-label">${food.name}：</span>
                            <a href="${food.url}" target="_blank">${food.url}</a>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🎨 旅行海报</h3>
                ${generatePosterHTML(cityData, cityName)}
            </div>
        `;
        
        loading.classList.add('hidden');
    }, 500);
}

document.getElementById('generateBtn').addEventListener('click', function() {
    const cityName = document.getElementById('cityInput').value;
    const matchedCity = findCity(cityName);
    
    if (matchedCity) {
        const cityData = cityDatabase[matchedCity];
        renderCityContent(cityData, matchedCity);
        recordSearch(matchedCity);
    } else {
        alert('未找到该城市，请尝试其他城市');
    }
});

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') document.getElementById('generateBtn').click();
});

document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('cityInput').value = this.dataset.city;
        document.getElementById('generateBtn').click();
    });
});

let searchStats = {
    totalSearches: 0,
    citySearches: {},
    lastRanking: [],
    lastUpdate: new Date()
};

function loadSearchStats() {
    const saved = localStorage.getItem('travelSearchStats');
    if (saved) {
        searchStats = JSON.parse(saved);
        searchStats.lastUpdate = new Date(searchStats.lastUpdate);
    } else {
        initializeSearchStats();
    }
    renderRanking();
}

function initializeSearchStats() {
    const initialCities = ['北京', '上海', '成都', '杭州', '西安', '重庆', '广州', '厦门', '南京', '青岛'];
    initialCities.forEach(city => {
        searchStats.citySearches[city] = Math.floor(Math.random() * 1000) + 500;
        searchStats.totalSearches += searchStats.citySearches[city];
    });
    searchStats.lastRanking = initialCities.slice(0, 10);
    saveSearchStats();
}

function saveSearchStats() {
    localStorage.setItem('travelSearchStats', JSON.stringify(searchStats));
}

function recordSearch(cityName) {
    const matchedCity = findCity(cityName);
    if (matchedCity) {
        searchStats.citySearches[matchedCity] = (searchStats.citySearches[matchedCity] || 0) + 1;
        searchStats.totalSearches++;
        searchStats.lastUpdate = new Date();
        saveSearchStats();
        renderRanking();
    }
}

function getRankingData() {
    const ranking = Object.entries(searchStats.citySearches)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    const maxCount = ranking[0]?.count || 1;
    
    return ranking.map((item, index) => ({
        city: item.city,
        count: item.count,
        rank: index + 1,
        progress: (item.count / maxCount) * 100,
        trend: index < searchStats.lastRanking.indexOf(item.city) ? 'up' : 
               index > searchStats.lastRanking.indexOf(item.city) ? 'down' : 'stable',
        hot: index < 3
    }));
}

function renderRanking() {
    const rankingList = document.getElementById('rankingList');
    const totalSearchesEl = document.getElementById('totalSearches');
    const rankingData = getRankingData();
    
    totalSearchesEl.textContent = searchStats.totalSearches.toLocaleString();
    
    const rankingFooter = document.querySelector('.ranking-footer');
    const timeText = rankingFooter.querySelector('.ranking-update-time');
    timeText.textContent = `最后更新：${searchStats.lastUpdate.toLocaleTimeString()}`;
    
    searchStats.lastRanking = rankingData.map(item => item.city);
    
    rankingList.innerHTML = rankingData.map(item => `
        <div class="ranking-item ${item.hot ? 'hot' : ''} ${item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : ''}" data-city="${item.city}">
            <div class="ranking-number">${item.rank}</div>
            <div class="ranking-city">${item.city}</div>
            <div class="ranking-info">
                <div class="ranking-trend">${item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}</div>
                <div class="ranking-count">👁 ${item.count.toLocaleString()}</div>
                <div class="ranking-progress">
                    <div class="ranking-progress-bar" style="width: ${item.progress}%;"></div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('cityInput').value = this.dataset.city;
            document.getElementById('generateBtn').click();
        });
    });
}

const seasonTrends = {
    spring: ['武汉', '南京', '杭州', '无锡', '扬州', '苏州', '洛阳', '桂林'],
    summer: ['青岛', '大连', '厦门', '三亚', '秦皇岛', '威海', '日照', '北海'],
    autumn: ['北京', '西安', '九寨沟', '稻城', '喀纳斯', '额济纳旗', '南京'],
    winter: ['哈尔滨', '雪乡', '长白山', '三亚', '昆明', '大理', '西双版纳', '香港']
};

const holidayTrends = {
    '春节': ['三亚', '厦门', '丽江', '大理', '成都', '西安', '北京'],
    '清明节': ['杭州', '苏州', '南京', '武汉', '成都', '西安'],
    '劳动节': ['北京', '上海', '成都', '杭州', '西安', '重庆'],
    '端午节': ['汨罗', '武汉', '南京', '杭州', '成都'],
    '中秋节': ['北京', '上海', '广州', '深圳', '成都'],
    '国庆节': ['北京', '上海', '成都', '杭州', '西安', '重庆', '广州', '深圳']
};

function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

function getCurrentHoliday() {
    const today = new Date();
    const holidays = [
        { name: '春节', date: '2026-01-28' },
        { name: '清明节', date: '2026-04-04' },
        { name: '劳动节', date: '2026-05-01' },
        { name: '端午节', date: '2026-06-19' },
        { name: '中秋节', date: '2026-09-25' },
        { name: '国庆节', date: '2026-10-01' }
    ];
    
    const todayStr = today.toISOString().split('T')[0];
    return holidays.find(holiday => holiday.date === todayStr)?.name;
}

function updateSeasonBadge() {
    const seasonBadge = document.getElementById('seasonBadge');
    const currentSeason = getCurrentSeason();
    const seasonEmojis = {
        spring: '🌸',
        summer: '☀️',
        autumn: '🍂',
        winter: '❄️'
    };
    
    let badgeText = `${seasonEmojis[currentSeason]} ${getSeasonName(currentSeason)}推荐`;
    
    const currentHoliday = getCurrentHoliday();
    if (currentHoliday) {
        badgeText = `🎉 ${currentHoliday}热门 | ` + badgeText;
    }
    
    badgeText.textContent = badgeText;
}

function getSeasonName(season) {
    const seasonNames = {
        spring: '春季',
        summer: '夏季',
        autumn: '秋季',
        winter: '冬季'
    };
    return seasonNames[season] || season;
}

function simulateRealTimeUpdate() {
    const cities = Object.keys(cityDatabase);
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    searchStats.citySearches[randomCity] = (searchStats.citySearches[randomCity] || 0) + 1;
    searchStats.totalSearches++;
    searchStats.lastUpdate = new Date();
    saveSearchStats();
    renderRanking();
}

loadSearchStats();
updateSeasonBadge();
setInterval(simulateRealTimeUpdate, 30000);

const dayButtons = document.querySelectorAll('.day-btn');
dayButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        dayButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedDays = parseInt(this.dataset.days);
    });
});

document.getElementById('applyCustomDays').addEventListener('click', function() {
    const customDaysInput = document.getElementById('customDays');
    const customDays = parseInt(customDaysInput.value);
    
    if (customDays && customDays >= 1 && customDays <= 30) {
        selectedDays = customDays;
        dayButtons.forEach(b => b.classList.remove('active'));
        alert(`已设置为${customDays}天行程`);
    } else {
        alert('请输入有效的天数（1-30天）');
    }
});
