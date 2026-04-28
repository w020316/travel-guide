// ==========================================
// 旅游攻略海报生成器 - 纯前端版本
// 适用于GitHub Pages静态托管
// ==========================================

let cityDatabase = {};
let selectedDays = 3;

// ==========================================
// localStorage 数据持久化
// ==========================================
const STORAGE_KEY = 'travel_guide_stats';

function loadStatsFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                totalSearches: parsed.totalSearches || 0,
                citySearches: parsed.citySearches || {},
                topCities: [],
                lastUpdated: parsed.lastUpdated || new Date().toISOString()
            };
        }
    } catch (e) {
        console.warn('读取localStorage失败:', e);
    }
    return {
        totalSearches: 0,
        citySearches: {},
        topCities: [],
        lastUpdated: new Date().toISOString()
    };
}

function saveStatsToStorage() {
    try {
        const data = {
            totalSearches: searchStats.totalSearches,
            citySearches: searchStats.citySearches,
            lastUpdated: searchStats.lastUpdated
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('写入localStorage失败:', e);
    }
}

let searchStats = loadStatsFromStorage();

// ==========================================
// 城市别名映射
// ==========================================
const cityAliases = {
    '北京': ['beijing', 'bj', '京城', '帝都', '北平'],
    '上海': ['shanghai', 'sh', '魔都', '申城', '沪上'],
    '成都': ['chengdu', 'cd', '蓉城', '天府之国', '蜀都'],
    '杭州': ['hangzhou', 'hz', '临安', '钱塘'],
    '西安': ['xian', 'xa', '长安', '古都'],
    '厦门': ['xiamen', 'xm', '鹭岛', '海上花园'],
    '三亚': ['sanya', 'sy', '鹿城'],
    '重庆': ['chongqing', 'cq', '山城', '雾都', '巴渝'],
    '广州': ['guangzhou', 'gz', '羊城', '花城', '穗'],
    '深圳': ['shenzhen', 'sz', '鹏城'],
    '南京': ['nanjing', 'nj', '金陵', '宁'],
    '苏州': ['suzhou', 'sz', '姑苏'],
    '青岛': ['qingdao', 'qd', '琴岛', '岛城'],
    '大连': ['dalian', 'dl', '滨城'],
    '丽江': ['lijiang', 'lj'],
    '桂林': ['guilin', 'gl'],
    '张家界': ['zhangjiajie', 'zjj'],
    '哈尔滨': ['harbin', 'heb', '冰城'],
    '大理': ['dali', 'dl'],
    '敦煌': ['dunhuang', 'dh']
};

// ==========================================
// 拼音首字母映射
// ==========================================
const pinyinMap = {
    '北': 'B', '上': 'S', '成': 'C', '杭': 'H', '西': 'X', '安': 'A',
    '重': 'C', '广': 'G', '厦': 'X', '南': 'N', '青': 'Q', '苏': 'S',
    '丽': 'L', '三': 'S', '哈': 'H', '武': 'W', '长': 'C', '天': 'T',
    '大': 'D', '桂': 'G', '深': 'S', '珠': 'Z', '昆': 'K', '拉': 'L',
    '乌': 'W', '兰': 'L', '沈': 'S', '郑': 'Z', '贵': 'G', '济': 'J',
    '太': 'T', '宁': 'N', '银': 'Y', '海': 'H', '福': 'F', '连': 'L',
    '波': 'B', '黄': 'H', '敦': 'D'
};

function getPinyinInitials(city) {
    let result = '';
    for (const char of city) {
        result += pinyinMap[char] || char;
    }
    return result;
}

// ==========================================
// 省份城市映射
// ==========================================
const provinceCityMap = {
    '北京': ['北京'], '上海': ['上海'], '天津': ['天津'], '重庆': ['重庆'],
    '河北': ['石家庄', '保定', '张家口', '承德', '秦皇岛', '唐山', '廊坊'],
    '山西': ['太原', '大同', '平遥'], '辽宁': ['沈阳', '大连'],
    '吉林': ['长春', '吉林', '长白山'], '黑龙江': ['哈尔滨'],
    '江苏': ['南京', '苏州', '无锡'], '浙江': ['杭州', '宁波', '温州', '嘉兴'],
    '安徽': ['黄山', '合肥'], '福建': ['福州', '厦门'],
    '江西': ['南昌', '九江', '景德镇'], '山东': ['青岛', '济南', '烟台'],
    '河南': ['郑州', '洛阳'], '湖北': ['武汉'], '湖南': ['长沙', '张家界'],
    '广东': ['广州', '深圳', '珠海'], '广西': ['南宁', '桂林'],
    '海南': ['三亚', '海口'], '四川': ['成都'], '贵州': ['贵阳'],
    '云南': ['昆明', '丽江', '大理'], '西藏': ['拉萨'], '陕西': ['西安'],
    '甘肃': ['兰州', '敦煌'], '青海': ['西宁'], '宁夏': ['银川'],
    '新疆': ['乌鲁木齐'], '内蒙古': ['呼和浩特']
};

// ==========================================
// 模拟天气数据（基于季节和城市）
// ==========================================
function generateMockWeather(cityName) {
    const now = new Date();
    const month = now.getMonth() + 1;
    
    // 基础天气模板
    const weatherTemplates = {
        '北京': {
            baseTemp: month >= 6 && month <= 8 ? 30 : month >= 3 && month <= 5 ? 20 : month >= 9 && month <= 11 ? 15 : -5,
            conditions: ['晴天', '多云', '阴天'],
            humidity: '45%',
            wind: '3级',
            visibility: '10km'
        },
        '上海': {
            baseTemp: month >= 6 && month <= 8 ? 32 : month >= 3 && month <= 5 ? 18 : month >= 9 && month <= 11 ? 20 : 5,
            conditions: ['多云', '小雨', '晴天'],
            humidity: '70%',
            wind: '2级',
            visibility: '8km'
        },
        '成都': {
            baseTemp: month >= 6 && month <= 8 ? 30 : month >= 3 && month <= 5 ? 22 : month >= 9 && month <= 11 ? 18 : 8,
            conditions: ['阴天', '小雨', '多云'],
            humidity: '80%',
            wind: '1级',
            visibility: '6km'
        },
        '杭州': {
            baseTemp: month >= 6 && month <= 8 ? 33 : month >= 3 && month <= 5 ? 20 : month >= 9 && month <= 11 ? 18 : 5,
            conditions: ['晴天', '小雨', '多云'],
            humidity: '65%',
            wind: '2级',
            visibility: '9km'
        },
        '西安': {
            baseTemp: month >= 6 && month <= 8 ? 32 : month >= 3 && month <= 5 ? 22 : month >= 9 && month <= 11 ? 16 : 0,
            conditions: ['晴天', '多云', '沙尘'],
            humidity: '50%',
            wind: '3级',
            visibility: '7km'
        },
        '厦门': {
            baseTemp: month >= 6 && month <= 8 ? 32 : month >= 3 && month <= 5 ? 22 : month >= 9 && month <= 11 ? 25 : 15,
            conditions: ['晴天', '多云', '阵雨'],
            humidity: '75%',
            wind: '4级',
            visibility: '12km'
        },
        '三亚': {
            baseTemp: month >= 6 && month <= 8 ? 33 : month >= 3 && month <= 5 ? 28 : month >= 9 && month <= 11 ? 28 : 25,
            conditions: ['晴天', '多云', '雷阵雨'],
            humidity: '78%',
            wind: '3级',
            visibility: '15km'
        },
        '重庆': {
            baseTemp: month >= 6 && month <= 8 ? 35 : month >= 3 && month <= 5 ? 24 : month >= 9 && month <= 11 ? 20 : 10,
            conditions: ['阴天', '多云', '雾'],
            humidity: '75%',
            wind: '1级',
            visibility: '5km'
        },
        '广州': {
            baseTemp: month >= 6 && month <= 8 ? 34 : month >= 3 && month <= 5 ? 26 : month >= 9 && month <= 11 ? 27 : 16,
            conditions: ['多云', '晴天', '雷阵雨'],
            humidity: '72%',
            wind: '2级',
            visibility: '10km'
        },
        '深圳': {
            baseTemp: month >= 6 && month <= 8 ? 33 : month >= 3 && month <= 5 ? 26 : month >= 9 && month <= 11 ? 28 : 17,
            conditions: ['晴天', '多云', '阵雨'],
            humidity: '70%',
            wind: '3级',
            visibility: '11km'
        },
        '南京': {
            baseTemp: month >= 6 && month <= 8 ? 33 : month >= 3 && month <= 5 ? 22 : month >= 9 && month <= 11 ? 19 : 4,
            conditions: ['晴天', '多云', '阴天'],
            humidity: '68%',
            wind: '2级',
            visibility: '9km'
        },
        '苏州': {
            baseTemp: month >= 6 && month <= 8 ? 32 : month >= 3 && month <= 5 ? 21 : month >= 9 && month <= 11 ? 19 : 5,
            conditions: ['多云', '晴天', '小雨'],
            humidity: '70%',
            wind: '2级',
            visibility: '8km'
        },
        '青岛': {
            baseTemp: month >= 6 && month <= 8 ? 27 : month >= 3 && month <= 5 ? 16 : month >= 9 && month <= 11 ? 19 : 0,
            conditions: ['晴天', '多云', '海雾'],
            humidity: '65%',
            wind: '4级',
            visibility: '14km'
        },
        '大连': {
            baseTemp: month >= 6 && month <= 8 ? 26 : month >= 3 && month <= 5 ? 14 : month >= 9 && month <= 11 ? 16 : -3,
            conditions: ['晴天', '多云', '海风'],
            humidity: '60%',
            wind: '5级',
            visibility: '13km'
        },
        '丽江': {
            baseTemp: month >= 6 && month <= 8 ? 24 : month >= 3 && month <= 5 ? 16 : month >= 9 && month <= 11 ? 15 : 6,
            conditions: ['晴天', '多云', '阵雨'],
            humidity: '55%',
            wind: '2级',
            visibility: '20km'
        },
        '桂林': {
            baseTemp: month >= 6 && month <= 8 ? 32 : month >= 3 && month <= 5 ? 22 : month >= 9 && month <= 11 ? 23 : 10,
            conditions: ['多云', '小雨', '晴天'],
            humidity: '78%',
            wind: '1级',
            visibility: '8km'
        },
        '张家界': {
            baseTemp: month >= 6 && month <= 8 ? 30 : month >= 3 && month <= 5 ? 20 : month >= 9 && month <= 11 ? 18 : 6,
            conditions: ['多云', '雾', '晴天'],
            humidity: '80%',
            wind: '2级',
            visibility: '6km'
        },
        '哈尔滨': {
            baseTemp: month >= 6 && month <= 8 ? 28 : month >= 3 && month <= 5 ? 14 : month >= 9 && month <= 11 ? 10 : -18,
            conditions: ['晴天', '多云', '雪'],
            humidity: '55%',
            wind: '3级',
            visibility: '8km'
        },
        '大理': {
            baseTemp: month >= 6 && month <= 8 ? 24 : month >= 3 && month <= 5 ? 18 : month >= 9 && month <= 11 ? 16 : 8,
            conditions: ['晴天', '多云', '风'],
            humidity: '58%',
            wind: '3级',
            visibility: '18km'
        },
        '敦煌': {
            baseTemp: month >= 6 && month <= 8 ? 32 : month >= 3 && month <= 5 ? 18 : month >= 9 && month <= 11 ? 12 : -8,
            conditions: ['晴天', '沙尘', '多云'],
            humidity: '35%',
            wind: '4级',
            visibility: '15km'
        }
    };
    
    const template = weatherTemplates[cityName] || weatherTemplates['北京'];
    const condition = template.conditions[Math.floor(Math.random() * template.conditions.length)];
    const tempVar = Math.floor(Math.random() * 5) - 2;
    const temp = template.baseTemp + tempVar;
    
    return {
        current: {
            temp: `${temp}°C`,
            condition: condition,
            humidity: template.humidity,
            wind: template.wind,
            visibility: template.visibility
        },
        forecast: [
            { date: new Date(now.getTime() + 86400000).toISOString(), condition: template.conditions[Math.floor(Math.random() * template.conditions.length)], temp: `${temp + 1}°C` },
            { date: new Date(now.getTime() + 172800000).toISOString(), condition: template.conditions[Math.floor(Math.random() * template.conditions.length)], temp: `${temp - 1}°C` },
            { date: new Date(now.getTime() + 259200000).toISOString(), condition: template.conditions[Math.floor(Math.random() * template.conditions.length)], temp: `${temp + 2}°C` }
        ],
        updateTime: now.toISOString()
    };
}

// ==========================================
// 城市数据 - 内嵌（GitHub Pages静态部署）
// ==========================================
const EMBEDDED_CITIES = {
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
            booking: [{ name: '故宫门票', url: 'https://gugong.228.com.cn/' }],
            food: [{ name: '北京美食', url: 'https://www.dianping.com/beijing/food' }]
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
                    { time: '09:00-12:00', morning: '天安门广场 → 故宫' },
                    { time: '12:00-14:00', afternoon: '午餐（北京烤鸭）' },
                    { time: '14:00-17:00', afternoon2: '景山公园 → 北海公园' },
                    { time: '18:00-21:00', evening: '王府井步行街' }
                ],
                tips: ['故宫需要提前预约', '王府井是购物天堂'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 天安门广场 → 故宫' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（北京烤鸭）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 景山公园 → 北海公园' },
                    { time: '18:00-21:00', evening: 'Day1: 王府井步行街' },
                    { time: '09:00-17:00', morning2: 'Day2: 八达岭长城 → 明十三陵' }
                ],
                tips: ['长城需要一整天时间', '建议穿舒适的鞋子'],
                budget: '800-1500元'
            }
        }
    },
    '上海': {
        tags: ['国际大都市', '现代化', '时尚之都'],
        season: '春秋两季',
        atmosphere: '国际化大都市，现代与传统交融',
        days: '3-4天',
        routes: ['外滩 → 南京路 → 人民广场', '豫园 → 城隍庙 → 新天地', '迪士尼乐园一日游', '东方明珠 → 陆家嘴金融区'],
        foods: [
            { name: '小笼包', desc: '上海特色点心，皮薄馅多', price: '30-50元/笼', mustTry: true },
            { name: '生煎包', desc: '上海传统小吃，底部焦脆', price: '20-30元/份' },
            { name: '葱油拌面', desc: '上海特色面食', price: '15-25元/碗' },
            { name: '排骨年糕', desc: '上海传统小吃', price: '25-35元/份' },
            { name: '蟹粉豆腐', desc: '上海特色菜品', price: '40-60元/份' }
        ],
        accommodations: [
            { area: '外滩/南京路', pros: '地理位置优越，交通便利', cons: '价格较高，人流量大' },
            { area: '陆家嘴', pros: '现代化，景观好', cons: '价格昂贵，商业氛围浓' },
            { area: '徐家汇', pros: '交通便利，购物方便', cons: '价格较高，车流量大' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '虹桥国际机场、浦东国际机场；上海站、上海南站、虹桥站等多个火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.shanghai.gov.cn/',
            attractions: [
                { name: '外滩', url: 'https://www.thebund.cn/', mustVisit: true },
                { name: '东方明珠', url: 'https://www.shanghaiorientalpearl.com/', mustVisit: true },
                { name: '豫园', url: 'https://www.yugarden.com.cn/' }
            ],
            booking: [{ name: '迪士尼门票', url: 'https://www.shanghaidisneyresort.com/' }],
            food: [{ name: '上海美食', url: 'https://www.dianping.com/shanghai/food' }]
        },
        poster: {
            title: '魔都印象',
            subtitle: '东方巴黎，繁华之都',
            elements: ['外滩', '东方明珠', '陆家嘴', '豫园'],
            layout: '顶部东方明珠，中央外滩，底部豫园',
            colors: ['#2980b9', '#8e44ad', '#f39c12', '#27ae60', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '外滩 → 南京路步行街' },
                    { time: '12:00-14:00', afternoon: '午餐（小笼包）' },
                    { time: '14:00-17:00', afternoon2: '豫园 → 城隍庙' },
                    { time: '18:00-21:00', evening: '陆家嘴夜景' }
                ],
                tips: ['外滩夜景很美，建议傍晚去', '南京路是购物天堂'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 外滩 → 南京路步行街' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（小笼包）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 豫园 → 城隍庙' },
                    { time: '18:00-21:00', evening: 'Day1: 陆家嘴夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 迪士尼乐园' }
                ],
                tips: ['迪士尼建议买早享卡', '建议提前下载迪士尼APP'],
                budget: '800-1500元'
            }
        }
    },
    '成都': {
        tags: ['美食之都', '天府之国', '大熊猫故乡'],
        season: '春秋两季',
        atmosphere: '悠闲自在，美食天堂',
        days: '3-4天',
        routes: ['宽窄巷子 → 锦里 → 武侯祠', '大熊猫繁育研究基地', '都江堰 → 青城山', '春熙路 → 太古里'],
        foods: [
            { name: '火锅', desc: '成都特色，麻辣鲜香', price: '80-150元/人', mustTry: true },
            { name: '串串香', desc: '成都特色小吃', price: '40-80元/人' },
            { name: '担担面', desc: '成都传统面食', price: '10-20元/碗' },
            { name: '龙抄手', desc: '成都特色馄饨', price: '15-25元/份' },
            { name: '钟水饺', desc: '成都传统小吃', price: '10-20元/份' }
        ],
        accommodations: [
            { area: '春熙路/太古里', pros: '商业中心，交通便利', cons: '价格较高，人流量大' },
            { area: '宽窄巷子附近', pros: '文化氛围浓，步行游览方便', cons: '价格较高，周边嘈杂' },
            { area: '武侯祠附近', pros: '历史文化氛围，周边美食多', cons: '交通稍远，周边设施一般' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '双流国际机场；成都东站、成都南站等多个火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.cdgov.cn/',
            attractions: [
                { name: '大熊猫基地', url: 'https://www.panda.org.cn/', mustVisit: true },
                { name: '武侯祠', url: 'https://www.wuhouci.net.cn/', mustVisit: true },
                { name: '都江堰', url: 'https://www.dujiangyan.gov.cn/' }
            ],
            booking: [{ name: '大熊猫基地门票', url: 'https://www.panda.org.cn/' }],
            food: [{ name: '成都美食', url: 'https://www.dianping.com/chengdu/food' }]
        },
        poster: {
            title: '天府印象',
            subtitle: '悠闲时光，美食天堂',
            elements: ['大熊猫', '宽窄巷子', '武侯祠', '都江堰'],
            layout: '顶部大熊猫，中央宽窄巷子，底部武侯祠',
            colors: ['#27ae60', '#8e44ad', '#f39c12', '#2980b9', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '宽窄巷子 → 锦里' },
                    { time: '12:00-14:00', afternoon: '午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: '武侯祠' },
                    { time: '18:00-21:00', evening: '春熙路 → 太古里' }
                ],
                tips: ['宽窄巷子适合慢慢逛', '火锅建议去当地人推荐的店'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 宽窄巷子 → 锦里' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 武侯祠' },
                    { time: '18:00-21:00', evening: 'Day1: 春熙路 → 太古里' },
                    { time: '09:00-17:00', morning2: 'Day2: 大熊猫繁育研究基地' }
                ],
                tips: ['大熊猫基地建议早上去', '建议穿舒适的鞋子'],
                budget: '600-1200元'
            }
        }
    },
    '杭州': {
        tags: ['人间天堂', '西湖美景', '江南水乡'],
        season: '春秋两季',
        atmosphere: '山水交融，诗意江南',
        days: '3-4天',
        routes: ['西湖十景环湖游', '灵隐寺 → 飞来峰', '千岛湖一日游', '宋城 → 西溪湿地'],
        foods: [
            { name: '西湖醋鱼', desc: '杭州特色菜，酸甜可口', price: '60-120元/份', mustTry: true },
            { name: '龙井虾仁', desc: '杭州名菜，茶香四溢', price: '80-150元/份' },
            { name: '东坡肉', desc: '杭州传统名菜', price: '40-80元/份' },
            { name: '叫化鸡', desc: '杭州特色菜', price: '80-150元/份' },
            { name: '片儿川', desc: '杭州特色面食', price: '15-25元/碗' }
        ],
        accommodations: [
            { area: '西湖附近', pros: '风景优美，步行游览方便', cons: '价格较高，旺季人多' },
            { area: '武林广场', pros: '商业中心，交通便利', cons: '距离西湖稍远' },
            { area: '钱江新城', pros: '现代化，景观好', cons: '距离景区远，价格高' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '萧山国际机场；杭州东站、杭州站等火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.hangzhou.gov.cn/',
            attractions: [
                { name: '西湖', url: 'https://www.westlake.com.cn/', mustVisit: true },
                { name: '灵隐寺', url: 'https://www.lingyinsi.org/', mustVisit: true },
                { name: '千岛湖', url: 'https://www.qiandaohu.gov.cn/' }
            ],
            booking: [{ name: '西湖游船', url: 'https://www.westlake.com.cn/' }],
            food: [{ name: '杭州美食', url: 'https://www.dianping.com/hangzhou/food' }]
        },
        poster: {
            title: '西湖印象',
            subtitle: '人间天堂，诗意江南',
            elements: ['西湖', '灵隐寺', '千岛湖', '龙井茶园'],
            layout: '顶部西湖全景，中央灵隐寺，底部千岛湖',
            colors: ['#27ae60', '#3498db', '#f39c12', '#8e44ad', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '西湖十景环湖游' },
                    { time: '12:00-14:00', afternoon: '午餐（西湖醋鱼）' },
                    { time: '14:00-17:00', afternoon2: '灵隐寺 → 飞来峰' },
                    { time: '18:00-21:00', evening: '河坊街 → 南宋御街' }
                ],
                tips: ['西湖适合骑行或步行', '灵隐寺门票含飞来峰'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 西湖十景环湖游' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（西湖醋鱼）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 灵隐寺 → 飞来峰' },
                    { time: '18:00-21:00', evening: 'Day1: 河坊街 → 南宋御街' },
                    { time: '09:00-17:00', morning2: 'Day2: 千岛湖一日游' }
                ],
                tips: ['千岛湖建议提前订票', '建议穿舒适的鞋子'],
                budget: '600-1200元'
            }
        }
    },
    '西安': {
        tags: ['历史古都', '兵马俑', '丝绸之路起点'],
        season: '春秋两季',
        atmosphere: '千年古都，文化底蕴深厚',
        days: '3-4天',
        routes: ['兵马俑 → 华清池', '大雁塔 → 大唐不夜城', '城墙骑行 → 钟鼓楼', '回民街 → 书院门'],
        foods: [
            { name: '羊肉泡馍', desc: '西安特色，汤鲜馍香', price: '20-40元/碗', mustTry: true },
            { name: '肉夹馍', desc: '西安传统小吃', price: '10-20元/个' },
            { name: '凉皮', desc: '西安特色面食', price: '8-15元/份' },
            { name: 'biangbiang面', desc: '西安特色面食', price: '12-20元/碗' },
            { name: '胡辣汤', desc: '西安传统早餐', price: '5-10元/碗' }
        ],
        accommodations: [
            { area: '钟楼/鼓楼附近', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '大雁塔附近', pros: '文化氛围浓，周边景点多', cons: '距离市中心稍远' },
            { area: '回民街附近', pros: '美食集中，夜生活丰富', cons: '周边嘈杂，价格较高' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '咸阳国际机场；西安北站、西安站等火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.xa.gov.cn/',
            attractions: [
                { name: '兵马俑', url: 'https://www.bmy.com.cn/', mustVisit: true },
                { name: '大雁塔', url: 'https://www.dayanta.com/', mustVisit: true },
                { name: '城墙', url: 'https://www.xacitywall.com/' }
            ],
            booking: [{ name: '兵马俑门票', url: 'https://www.bmy.com.cn/' }],
            food: [{ name: '西安美食', url: 'https://www.dianping.com/xian/food' }]
        },
        poster: {
            title: '长安印象',
            subtitle: '千年古都，历史长河',
            elements: ['兵马俑', '大雁塔', '城墙', '钟鼓楼'],
            layout: '顶部兵马俑，中央大雁塔，底部城墙',
            colors: ['#c0392b', '#8e44ad', '#f39c12', '#27ae60', '#2980b9']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '兵马俑 → 华清池' },
                    { time: '12:00-14:00', afternoon: '午餐（羊肉泡馍）' },
                    { time: '14:00-17:00', afternoon2: '大雁塔 → 大唐不夜城' },
                    { time: '18:00-21:00', evening: '回民街 → 钟鼓楼' }
                ],
                tips: ['兵马俑建议请导游', '回民街美食众多'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 兵马俑 → 华清池' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（羊肉泡馍）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 大雁塔 → 大唐不夜城' },
                    { time: '18:00-21:00', evening: 'Day1: 回民街 → 钟鼓楼' },
                    { time: '09:00-17:00', morning2: 'Day2: 城墙骑行 → 书院门' }
                ],
                tips: ['城墙骑行约需2小时', '建议穿舒适的鞋子'],
                budget: '600-1200元'
            }
        }
    },
    '厦门': {
        tags: ['海上花园', '鼓浪屿', '闽南风情'],
        season: '春秋两季（4-6月，9-11月）',
        atmosphere: '海风轻拂，文艺清新，慢生活',
        days: '3-4天',
        routes: ['鼓浪屿一日游 → 日光岩 → 菽庄花园', '南普陀寺 → 厦门大学 → 白城沙滩', '环岛路骑行 → 曾厝垵 → 沙坡尾', '集美学村 → 鳌园'],
        foods: [
            { name: '沙茶面', desc: '厦门特色面食，沙茶酱浓郁', price: '20-35元/碗', mustTry: true },
            { name: '海蛎煎', desc: '闽南特色小吃，鲜香可口', price: '25-40元/份' },
            { name: '土笋冻', desc: '厦门传统小吃，Q弹爽滑', price: '20-30元/份' },
            { name: '花生汤', desc: '厦门甜品，香甜可口', price: '8-12元/碗' },
            { name: '烧肉粽', desc: '厦门特色粽子，馅料丰富', price: '10-18元/个' }
        ],
        accommodations: [
            { area: '鼓浪屿', pros: '风景优美，步行游览方便', cons: '价格较高，需提前预订，行李搬运不便' },
            { area: '曾厝垵/环岛路', pros: '海边民宿，文艺氛围浓', cons: '旺季价格高，周边较吵闹' },
            { area: '中山路附近', pros: '市中心，交通便利，美食集中', cons: '人流量大，价格较高' }
        ],
        transport: [
            { type: '内部交通', info: '公交、BRT快速公交、出租车；鼓轮渡往返鼓浪屿' },
            { type: '外部交通', info: '高崎国际机场；厦门站、厦门北站等火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在鼓浪屿买高价海鲜', '不要乘坐黑车', '避开台风季节']
        },
        links: {
            official: 'https://www.xm.gov.cn/',
            attractions: [
                { name: '鼓浪屿', url: 'https://www.gly.cn/', mustVisit: true },
                { name: '南普陀寺', url: 'https://www.nanputuo.com/', mustVisit: true },
                { name: '厦门大学', url: 'https://www.xmu.edu.cn/' }
            ],
            booking: [{ name: '鼓浪屿船票', url: 'https://www.xmferry.com/' }],
            food: [{ name: '厦门美食', url: 'https://www.dianping.com/xiamen/food' }]
        },
        poster: {
            title: '鹭岛时光',
            subtitle: '海上花园，文艺厦门',
            elements: ['鼓浪屿', '日光岩', '环岛路', '曾厝垵'],
            layout: '顶部鼓浪屿全景，中央日光岩，底部环岛路',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-17:00', morning: '鼓浪屿一日游（日光岩→菽庄花园→钢琴博物馆）' },
                    { time: '17:30-19:00', afternoon: '返回市区，晚餐（沙茶面+海蛎煎）' },
                    { time: '19:00-21:00', evening: '中山路步行街 → 夜游鹭江' }
                ],
                tips: ['鼓浪屿船票提前预订', '建议穿舒适鞋子'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 鼓浪屿一日游' },
                    { time: '19:00-21:00', evening: 'Day1: 中山路步行街' },
                    { time: '09:00-12:00', morning2: 'Day2: 南普陀寺 → 厦门大学 → 白城沙滩' },
                    { time: '14:00-18:00', afternoon2: 'Day2: 环岛路骑行 → 曾厝垵 → 沙坡尾' }
                ],
                tips: ['厦大需预约入校', '环岛路适合骑行'],
                budget: '800-1500元'
            }
        }
    },
    '三亚': {
        tags: ['热带天堂', '阳光海滩', '度假胜地'],
        season: '冬季（11月-次年3月）',
        atmosphere: '椰风海韵，热带风情，悠闲假期',
        days: '4-5天',
        routes: ['亚龙湾海滩一日游', '天涯海角 → 南山文化旅游区', '蜈支洲岛潜水一日游', '三亚湾日落 → 第一市场海鲜'],
        foods: [
            { name: '海南鸡饭', desc: '三亚特色，鸡肉嫩滑', price: '30-50元/份', mustTry: true },
            { name: '清补凉', desc: '海南特色甜品', price: '8-15元/份' },
            { name: '椰子饭', desc: '三亚特色主食', price: '15-25元/份' },
            { name: '抱罗粉', desc: '海南特色米粉', price: '12-20元/碗' },
            { name: '海鲜', desc: '第一市场现捞现做', price: '100-200元/人' }
        ],
        accommodations: [
            { area: '亚龙湾', pros: '高端酒店群，海滩优质', cons: '价格昂贵，距离市区远' },
            { area: '三亚湾', pros: '交通便利，性价比高，看日落方便', cons: '海水质量一般' },
            { area: '海棠湾', pros: '新兴度假区，设施完善', cons: '距离景点较远' }
        ],
        transport: [
            { type: '内部交通', info: '出租车、公交车、租车自驾；景区间距离较远' },
            { type: '外部交通', info: '凤凰国际机场；三亚站火车站' }
        ],
        budget: { low: '1500', medium: '3500', high: '8000+' },
        tips: {
            prepare: ['身份证必带', '防晒霜（SPF50+）', '泳衣', '墨镜', '遮阳帽'],
            avoid: ['不要在景区买高价海鲜', '不要租黑车', '注意防暑降温']
        },
        links: {
            official: 'https://www.sanya.gov.cn/',
            attractions: [
                { name: '亚龙湾', url: 'http://www.yalongbay.com/', mustVisit: true },
                { name: '蜈支洲岛', url: 'http://www.wuzhizhou.com/', mustVisit: true },
                { name: '天涯海角', url: 'http://www.tianyahaijiao.com/' }
            ],
            booking: [{ name: '蜈支洲岛门票', url: 'http://www.wuzhizhou.com/' }],
            food: [{ name: '三亚美食', url: 'https://www.dianping.com/sanya/food' }]
        },
        poster: {
            title: '鹿城假日',
            subtitle: '热带天堂，阳光海岸',
            elements: ['亚龙湾', '天涯海角', '蜈支洲岛', '椰梦长廊'],
            layout: '顶部亚龙湾海滩，中央椰林，底部夕阳',
            colors: ['#27ae60', '#f39c12', '#3498db', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-16:00', morning: '亚龙湾海滩休闲游泳' },
                    { time: '17:00-19:00', afternoon: '三亚湾看日落' },
                    { time: '19:00-21:00', evening: '第一市场吃海鲜' }
                ],
                tips: ['亚龙湾免费进入', '海鲜要砍价'],
                budget: '400-800元'
            },
            '3天2晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 亚龙湾海滩' },
                    { time: '08:00-17:00', morning2: 'Day2: 蜈支洲岛一日游（潜水+水上项目）' },
                    { time: '09:00-16:00', afternoon2: 'Day3: 天涯海角 → 南山寺' }
                ],
                tips: ['蜈支洲岛提前订票', '南山寺穿长裤'],
                budget: '2000-4000元'
            }
        }
    },
    '重庆': {
        tags: ['山城', '火锅之都', '8D魔幻城市'],
        season: '春秋两季（3-5月，9-11月）',
        atmosphere: '立体交通，麻辣美食，夜景璀璨',
        days: '3-4天',
        routes: ['解放碑 → 洪崖洞 → 千厮门大桥', '磁器口古镇 → 李子坝轻轨穿楼', '长江索道 → 南山一棵树观景台', '武隆天生三桥（一日游）'],
        foods: [
            { name: '重庆火锅', desc: '正宗九宫格，麻辣鲜香', price: '80-120元/人', mustTry: true },
            { name: '小面', desc: '重庆早餐标配', price: '8-15元/碗' },
            { name: '酸辣粉', desc: '重庆街头小吃', price: '8-12元/份' },
            { name: '毛血旺', desc: '重庆江湖菜', price: '50-80元/份' },
            { name: '陈麻花', desc: '磁器口特产', price: '15-25元/袋' }
        ],
        accommodations: [
            { area: '解放碑/洪崖洞', pros: '市中心，交通便利，夜景好', cons: '人流量大，价格较高' },
            { area: '观音桥', pros: '商圈繁华，交通便利', cons: '距离主要景点稍远' },
            { area: '南滨路', pros: '江景房，环境优美', cons: '价格较高' }
        ],
        transport: [
            { type: '内部交通', info: '轻轨网络发达，出租车便宜；注意重庆是山城，走路很累' },
            { type: '外部交通', info: '江北国际机场；重庆北站、重庆西站等火车站' }
        ],
        budget: { low: '1200', medium: '2200', high: '3800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子（重要！）', '充电宝', '肠胃药'],
            avoid: ['不要在景区吃火锅（贵且不正宗）', '不要相信低价旅游团', '夏季注意防暑']
        },
        links: {
            official: 'https://www.cq.gov.cn/',
            attractions: [
                { name: '洪崖洞', url: 'http://www.cqhhds.com/', mustVisit: true },
                { name: '武隆天生三桥', url: 'http://www.wlstsg.com/', mustVisit: true },
                { name: '磁器口古镇', url: 'http://www.cqcgc.com/' }
            ],
            booking: [{ name: '长江索道票', url: 'http://www.cqcdjt.cn/' }],
            food: [{ name: '重庆美食', url: 'https://www.dianping.com/chongqing/food' }]
        },
        poster: {
            title: '山城印象',
            subtitle: '8D魔幻城市，火辣之都',
            elements: ['洪崖洞', '李子坝', '长江索道', '解放碑'],
            layout: '顶部洪崖洞夜景，中央轻轨穿楼，底部火锅',
            colors: ['#e74c3c', '#f39c12', '#2980b9', '#27ae60', '#8e44ad']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '解放碑 → 八一好吃街' },
                    { time: '13:00-17:00', afternoon: '磁器口古镇 → 李子坝轻轨站' },
                    { time: '18:00-22:00', evening: '洪崖洞夜景 → 千厮门大桥拍夜景' }
                ],
                tips: ['洪崖洞晚上开灯才好看', '磁器口麻花可以试吃'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 解放碑 → 磁器口 → 李子坝 → 洪崖洞夜景' },
                    { time: '08:00-17:00', morning2: 'Day2: 武隆天生三桥一日游（需早起）' }
                ],
                tips: ['武隆距市区2.5小时车程', '建议报一日游或包车'],
                budget: '800-1500元'
            }
        }
    },
    '广州': {
        tags: ['美食之都', '千年商都', '岭南文化'],
        season: '秋冬两季（10月-次年3月）',
        atmosphere: '早茶文化，岭南建筑，现代与传统交融',
        days: '3-4天',
        routes: ['广州塔 → 珠江夜游', '沙面 → 陈家祠 → 上下九步行街', '白云山 → 越秀公园 → 中山纪念堂', '长隆野生动物世界（一日游）'],
        foods: [
            { name: '早茶点心', desc: '虾饺、烧卖、肠粉等', price: '60-100元/人', mustTry: true },
            { name: '白切鸡', desc: '粤菜经典', price: '50-80元/只' },
            { name: '煲仔饭', desc: '广州特色米饭', price: '25-45元/煲' },
            { name: '双皮奶', desc: '顺德甜品', price: '10-15元/碗' },
            { name: '艇仔粥', desc: '广州传统粥品', price: '15-25元/碗' }
        ],
        accommodations: [
            { area: '北京路/上下九', pros: '老城区，美食多，地铁便利', cons: '住宿条件一般' },
            { area: '珠江新城/天河', pros: '现代化，商务中心', cons: '价格较高' },
            { area: '长隆附近', pros: '游玩方便', cons: '距离市中心远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络非常发达，覆盖全市主要景点' },
            { type: '外部交通', info: '白云国际机场；广州南站、广州东站等火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在广州塔下买高价纪念品', '不要乘坐黑车', '早茶店排队时间长']
        },
        links: {
            official: 'https://www.gz.gov.cn/',
            attractions: [
                { name: '广州塔', url: 'http://www.cantontower.com/', mustVisit: true },
                { name: '长隆野生动物世界', url: 'http://www.chimelong.com/', mustVisit: true },
                { name: '陈家祠', url: 'http://www.chenjiaci.com.cn/' }
            ],
            booking: [{ name: '广州塔门票', url: 'http://www.cantontower.com/' }],
            food: [{ name: '广州美食', url: 'https://www.dianping.com/guangzhou/food' }]
        },
        poster: {
            title: '羊城风味',
            subtitle: '千年商都，食在广州',
            elements: ['广州塔', '珠江', '陈家祠', '早茶'],
            layout: '顶部广州塔，中央珠江，底部早茶点心',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-11:00', morning: '喝早茶（点都德/陶陶居）' },
                    { time: '11:30-15:00', afternoon: '沙面 → 陈家祠 → 上下九步行街' },
                    { time: '17:00-21:00', evening: '广州塔 → 珠江夜游' }
                ],
                tips: ['早茶要早点去排队', '珠江夜游提前购票'],
                budget: '400-700元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 早茶 → 沙面 → 陈家祠 → 广州塔夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 长隆野生动物世界' }
                ],
                tips: ['长隆建议买两日票', '动物表演时间表提前查'],
                budget: '1000-1800元'
            }
        }
    },
    '深圳': {
        tags: ['科技之城', '设计之都', '年轻活力'],
        season: '秋冬两季（10月-次年3月）',
        atmosphere: '现代化都市，创新氛围浓厚，滨海城市',
        days: '2-3天',
        routes: ['世界之窗 → 锦绣中华民俗村', '欢乐谷主题公园', '大梅沙海滨公园 → 东部华侨城', '莲花山公园 → 市民中心 → 深圳湾公园'],
        foods: [
            { name: '广式早茶', desc: '深圳也有正宗早茶', price: '60-100元/人', mustTry: true },
            { name: '潮汕牛肉火锅', desc: '新鲜牛肉，汤底清淡', price: '80-130元/人' },
            { name: '椰子鸡', desc: '深圳特色火锅', price: '90-140元/人' },
            { name: '乳鸽', desc: '光明乳鸽有名', price: '50-80元/只' },
            { name: '肠粉', desc: '广东经典早餐', price: '10-18元/份' }
        ],
        accommodations: [
            { area: '福田/市民中心', pros: '市中心，交通便利', cons: '价格较高' },
            { area: '南山/蛇口', pros: '滨海区域，环境好', cons: '距离部分景点稍远' },
            { area: '罗湖/东门', pros: '老城区，购物方便', cons: '相对老旧' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，出租车/网约车便利' },
            { type: '外部交通', info: '宝安国际机场；深圳北站、深圳站等火车站' }
        ],
        budget: { low: '1000', medium: '2200', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒霜'],
            avoid: ['不要在世界之窗内买高价商品', '不要乘坐黑车', '周末人多']
        },
        links: {
            official: 'https://www.sz.gov.cn/',
            attractions: [
                { name: '世界之窗', url: 'http://www.szwwco.com/', mustVisit: true },
                { name: '欢乐谷', url: 'http://www.happyvalley.cn/', mustVisit: true },
                { name: '东部华侨城', url: 'http://www.octeast.com/' }
            ],
            booking: [{ name: '欢乐谷门票', url: 'http://www.happyvalley.cn/' }],
            food: [{ name: '深圳美食', url: 'https://www.dianping.com/shenzhen/food' }]
        },
        poster: {
            title: '鹏城风采',
            subtitle: '科技之都，创新之城',
            elements: ['世界之窗', '平安大厦', '深圳湾', '欢乐谷'],
            layout: '顶部地标建筑，中央主题乐园，底部滨海风光',
            colors: ['#2980b9', '#27ae60', '#e74c3c', '#f39c12', '#8e44ad']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-15:00', morning: '世界之窗 → 锦绣中华' },
                    { time: '16:00-19:00', afternoon: '莲花山公园（登顶俯瞰深圳）' },
                    { time: '19:00-21:00', evening: '深圳湾公园夜景 → 椰子鸡晚餐' }
                ],
                tips: ['世界之窗需要半天以上', '莲花山免费'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 世界之窗或欢乐谷' },
                    { time: '09:00-17:00', morning2: 'Day2: 大梅沙 → 东部华侨城或深圳湾公园' }
                ],
                tips: ['东部华侨城很大，预留一天', '大梅沙免费'],
                budget: '700-1400元'
            }
        }
    },
    '南京': {
        tags: ['六朝古都', '民国文化', '梧桐大道'],
        season: '春秋两季（3-5月，9-11月）',
        atmosphere: '历史厚重，文化底蕴深厚，梧桐成荫',
        days: '3-4天',
        routes: ['中山陵 → 明孝陵 → 美龄宫', '夫子庙 → 秦淮河 → 乌衣巷', '总统府 → 1912街区', '玄武湖 → 鸡鸣寺 → 南京博物院'],
        foods: [
            { name: '鸭血粉丝汤', desc: '南京特色，鲜美爽滑', price: '15-25元/碗', mustTry: true },
            { name: '盐水鸭', desc: '南京特产，皮白肉嫩', price: '30-50元/半只' },
            { name: '小笼包', desc: '南京口味偏甜', price: '20-35元/笼' },
            { name: '梅花糕', desc: '南京传统小吃', price: '5-8元/个' },
            { name: '鸭油酥烧饼', desc: '南京特色点心', price: '3-5元/个' }
        ],
        accommodations: [
            { area: '新街口/夫子庙', pros: '市中心，交通便利，美食多', cons: '人流量大，价格较高' },
            { area: '玄武湖附近', pros: '环境优美，靠近景区', cons: '距离商业区稍远' },
            { area: '鼓楼/湖南路', pros: '老城区，性价比高', cons: '设施一般' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，公交线路密集' },
            { type: '外部交通', info: '禄口国际机场；南京南站、南京站等火车站' }
        ],
        budget: { low: '1100', medium: '2300', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '学生证（部分景点优惠）'],
            avoid: ['不要在夫子庙买高价工艺品', '不要乘坐黑车', '节假日人多']
        },
        links: {
            official: 'https://www.nanjing.gov.cn/',
            attractions: [
                { name: '中山陵', url: 'http://www.zsun.org.cn/', mustVisit: true },
                { name: '总统府', url: 'http://www.ztjf.org.cn/', mustVisit: true },
                { name: '南京博物院', url: 'http://www.njmuseum.com/' }
            ],
            booking: [{ name: '中山陵预约', url: 'http://www.zsun.org.cn/' }],
            food: [{ name: '南京美食', url: 'https://www.dianping.com/nanjing/food' }]
        },
        poster: {
            title: '金陵古韵',
            subtitle: '六朝古都，梧桐之城',
            elements: ['中山陵', '秦淮河', '总统府', '明城墙'],
            layout: '顶部中山陵，中央秦淮河夜景，底部梧桐大道',
            colors: ['#8e44ad', '#c0392b', '#f39c12', '#27ae60', '#2980b9']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:30-12:30', morning: '中山陵 → 明孝陵 → 美龄宫' },
                    { time: '13:30-17:00', afternoon: '总统府 → 1912街区' },
                    { time: '18:00-21:00', evening: '夫子庙 → 秦淮河画舫夜游' }
                ],
                tips: ['中山陵需预约', '秦淮河夜游很美'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:30-17:00', morning: 'Day1: 中山陵 → 明孝陵 → 总统府 → 夫子庙夜景' },
                    { time: '09:00-16:00', morning2: 'Day2: 南京博物院 → 玄武湖 → 鸡鸣寺' }
                ],
                tips: ['南京博物院免费但需预约', '鸡鸣寺求签很有名'],
                budget: '600-1200元'
            }
        }
    },
    '苏州': {
        tags: ['园林之城', '江南水乡', '丝绸之乡'],
        season: '春秋两季（3-5月，9-11月）',
        atmosphere: '小桥流水，粉墙黛瓦，诗意江南',
        days: '2-3天',
        routes: ['拙政园 → 狮子林 → 苏州博物馆', '虎丘 → 寒山寺 → 山塘街', '周庄古镇一日游', '平江路历史街区 → 诚品书店'],
        foods: [
            { name: '松鼠桂鱼', desc: '苏帮菜代表，酸甜可口', price: '88-138元/条', mustTry: true },
            { name: '阳澄湖大闸蟹', desc: '秋季限定，蟹黄肥美', price: '50-100元/只（季节性）' },
            { name: '生煎馒头', desc: '苏州特色小笼', price: '15-25元/份' },
            { name: '桂花糖藕', desc: '苏州甜品', price: '18-28元/份' },
            { name: '奥灶面', desc: '昆山特色面食', price: '15-25元/碗' }
        ],
        accommodations: [
            { area: '平江路/观前街', pros: '老城区，步行游览方便，美食多', cons: '住宿条件一般' },
            { area: '金鸡湖/园区', pros: '现代化，环境优美', cons: '距离老城区稍远' },
            { area: '周庄/同里', pros: '住在水乡，体验古镇生活', cons: '距离苏州市区远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁、公交、人力三轮车；老城区适合步行' },
            { type: '外部交通', info: '苏南硕放机场（无锡）；苏州站、苏州北站等火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3200+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具（江南多雨）'],
            avoid: ['不要在景区买丝绸制品', '不要坐黑三轮', '周庄商业化严重']
        },
        links: {
            official: 'https://www.suzhou.gov.cn/',
            attractions: [
                { name: '拙政园', url: 'http://www.szzm.cn/', mustVisit: true },
                { name: '苏州博物馆', url: 'http://www.szmuseum.com/', mustVisit: true },
                { name: '周庄', url: 'http://www.zhouzhuang.com/' }
            ],
            booking: [{ name: '拙政园门票', url: 'http://www.szzm.cn/' }],
            food: [{ name: '苏州美食', url: 'https://www.dianping.com/suzhou/food' }]
        },
        poster: {
            title: '姑苏烟雨',
            subtitle: '园林之城，梦里水乡',
            elements: ['拙政园', '平江路', '寒山寺', '周庄'],
            layout: '顶部园林景观，中央小桥流水，底部古镇夜景',
            colors: ['#27ae60', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '07:30-11:30', morning: '拙政园 → 狮子林 → 苏州博物馆（贝聿铭设计）' },
                    { time: '13:00-17:00', afternoon: '虎丘 → 寒山寺 → 山塘街' },
                    { time: '18:00-21:00', evening: '平江路漫步 → 听评弹' }
                ],
                tips: ['拙政园早上人少', '苏州博物馆免费需预约'],
                budget: '280-550元'
            },
            '2天1晚': {
                routes: [
                    { time: '07:30-17:00', morning: 'Day1: 拙政园 → 苏博 → 平江路' },
                    { time: '08:30-17:00', morning2: 'Day2: 周庄古镇一日游' }
                ],
                tips: ['周庄门票100元左右', '清晨去游客少'],
                budget: '600-1100元'
            }
        }
    },
    '青岛': {
        tags: ['海滨城市', '啤酒之城', '欧式建筑'],
        season: '夏季（6-9月）',
        atmosphere: '红瓦绿树，碧海蓝天，德式风情',
        days: '3-4天',
        routes: ['栈桥 → 天主教堂 → 信号山公园', '八大关 → 第二海水浴场 → 花石楼', '崂山风景区一日游', '青岛啤酒博物馆 → 台东步行街'],
        foods: [
            { name: '海鲜', desc: '青岛靠海，海鲜新鲜', price: '80-150元/人', mustTry: true },
            { name: '青岛啤酒', desc: '原浆啤酒，口感醇厚', price: '15-25元/杯' },
            { name: '鲅鱼水饺', desc: '青岛特色饺子', price: '30-50元/份' },
            { name: '烤鱿鱼', desc: '台东夜市必吃', price: '10-20元/串' },
            { name: '蛤蜊', desc: '青岛特产贝类', price: '20-40元/斤' }
        ],
        accommodations: [
            { area: '市南区/栈桥附近', pros: '老城区，景点集中，有特色民宿', cons: '住宿条件一般' },
            { area: '八大关/太平角', pros: '欧式别墅区，环境优雅', cons: '价格较高' },
            { area: '崂山区', pros: '新区，设施好，近崂山', cons: '距离老城区远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁、公交、出租车；沿海适合骑行' },
            { type: '外部交通', info: '流亭国际机场；青岛站、青岛北站等火车站' }
        ],
        budget: { low: '1200', medium: '2400', high: '4200+' },
        tips: {
            prepare: ['身份证必带', '防晒霜', '泳衣', '舒适的鞋子', '外套（海边早晚凉）'],
            avoid: ['不要在景区吃高价海鲜', '不要买假珍珠项链', '7-8月是旺季']
        },
        links: {
            official: 'https://www.qingdao.gov.cn/',
            attractions: [
                { name: '八大关', url: 'http://www.badaguan.gov.cn/', mustVisit: true },
                { name: '崂山', url: 'http://www.laoshan.cn/', mustVisit: true },
                { name: '栈桥', url: 'http://www.zhanqiao.gov.cn/' }
            ],
            booking: [{ name: '崂山门票', url: 'http://www.laoshan.cn/' }],
            food: [{ name: '青岛美食', url: 'https://www.dianping.com/qingdao/food' }]
        },
        poster: {
            title: '琴岛风情',
            subtitle: '红瓦绿树，碧海蓝天',
            elements: ['栈桥', '八大关', '崂山', '啤酒节'],
            layout: '顶部海滨全景，中央德式建筑，底部啤酒广场',
            colors: ['#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '栈桥 → 天主教堂 → 信号山公园（俯瞰青岛）' },
                    { time: '13:00-17:00', afternoon: '八大关漫步 → 第二海水浴场' },
                    { time: '18:00-21:00', evening: '台东步行街 → 啤酒屋喝原浆' }
                ],
                tips: ['信号山门票5元，值得去', '八大关免费'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 栈桥 → 八大关 → 啤酒博物馆' },
                    { time: '07:30-17:00', morning2: 'Day2: 崂山一日游（太清宫→仰口→北九水）' }
                ],
                tips: ['崂山很大，选择1-2条线路', '太清宫道教文化浓厚'],
                budget: '700-1400元'
            }
        }
    },
    '大连': {
        tags: ['浪漫之都', '海滨城市', '广场之城'],
        season: '夏季（6-9月）',
        atmosphere: '欧式建筑，海滨风光，广场众多',
        days: '3-4天',
        routes: ['星海广场 → 滨海路 → 金石滩', '俄罗斯风情街 → 中山广场 → 人民广场', '棒棰岛 → 老虎滩海洋公园', '旅顺口历史遗迹一日游'],
        foods: [
            { name: '海鲜', desc: '渤海黄海交汇处，海鲜丰富', price: '80-150元/人', mustTry: true },
            { name: '焖子', desc: '大连特色小吃', price: '8-12元/份' },
            { name: '咸鱼饼子', desc: '大连传统食品', price: '5-8元/个' },
            { name: '海鲜焖子', desc: '大连特色', price: '15-25元/份' },
            { name: '樱桃', desc: '大连特产水果（6月上市）', price: '30-60元/斤（季节性）' }
        ],
        accommodations: [
            { area: '星海广场/滨海路', pros: '海景房，位置优越', cons: '价格较高' },
            { area: '中山广场/青泥洼桥', pros: '市中心，交通便利', cons: '住宿较老旧' },
            { area: '金石滩', pros: '度假区，环境好', cons: '距离市区远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁、公交、有轨电车；沿海公路风景美' },
            { type: '外部交通', info: '周水子国际机场；大连站、大连北站等火车站' }
        ],
        budget: { low: '1100', medium: '2300', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '防晒霜', '外套（海边风大）', '舒适的鞋子'],
            avoid: ['不要在老虎滩买高价海鲜', '不要乘坐黑车', '7-8月旺季人多价高']
        },
        links: {
            official: 'https://www.dl.gov.cn/',
            attractions: [
                { name: '星海广场', url: 'http://www.xinghai.gov.cn/', mustVisit: true },
                { name: '老虎滩海洋公园', url: 'http://www.laohutan.cn/', mustVisit: true },
                { name: '金石滩', url: 'http://www.jinshitan.gov.cn/' }
            ],
            booking: [{ name: '老虎滩门票', url: 'http://www.laohutan.cn/' }],
            food: [{ name: '大连美食', url: 'https://www.dianping.com/dalian/food' }]
        },
        poster: {
            title: '滨城浪漫',
            subtitle: '北方明珠，广场之都',
            elements: ['星海广场', '滨海路', '有轨电车', '跨海大桥'],
            layout: '顶部跨海大桥，中央广场，底部海滨',
            colors: ['#2980b9', '#27ae60', '#e74c3c', '#f39c12', '#8e44ad']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:30-12:00', morning: '星海广场 → 滨海路（最美公路）' },
                    { time: '13:00-17:00', afternoon: '俄罗斯风情街 → 中山广场 → 有轨电车体验' },
                    { time: '17:30-20:00', evening: '渔人码头看日落 → 海鲜晚餐' }
                ],
                tips: ['滨海路适合自驾或骑行', '有轨电车复古感十足'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:30-17:00', morning: 'Day1: 星海广场 → 滨海路 → 渔人码头' },
                    { time: '08:30-17:00', morning2: 'Day2: 老虎滩海洋公园 或 金石滩' }
                ],
                tips: ['老虎滩适合带孩子', '金石滩地质奇观'],
                budget: '700-1400元'
            }
        }
    },
    '丽江': {
        tags: ['艳遇之都', '纳西古城', '玉龙雪山'],
        season: '春秋两季（3-5月，9-11月）',
        atmosphere: '高原古城，民族风情，慢节奏生活',
        days: '3-4天',
        routes: ['丽江古城（大研古镇）一日游', '玉龙雪山 → 蓝月谷 → 冰川公园', '束河古镇 → 白沙古镇', '泸沽湖（2日游，可选）'],
        foods: [
            { name: '腊排骨火锅', desc: '丽江特色，咸香入味', price: '60-100元/锅', mustTry: true },
            { name: '丽江粑粑', desc: '纳西族传统食品', price: '8-15元/个' },
            { name: '鸡豆凉粉', desc: '丽江特色小吃', price: '8-12元/份' },
            { name: '三文鱼', desc: '高原淡水三文鱼', price: '80-120元/斤' },
            { name: '酥油茶', desc: '藏族饮品', price: '10-15元/壶' }
        ],
        accommodations: [
            { area: '大研古城内', pros: '体验古城氛围，出行方便', cons: '行李搬运不便，隔音差，价格高' },
            { area: '束河古镇', pros: '安静，更有古城原味', cons: '距离大研稍远' },
            { area: '古城外', pros: '交通便利，性价比高', cons: '缺少古城氛围' }
        ],
        transport: [
            { type: '内部交通', info: '古城内步行为主；包车去雪山、泸沽湖' },
            { type: '外部交通', info: '三义机场（距市区28km）；丽江站火车站' }
        ],
        budget: { low: '1500', medium: '2800', high: '5000+' },
        tips: {
            prepare: ['身份证必带', '防晒霜（高原紫外线强）', '保暖衣物（早晚温差大）', '红景天（预防高反）', '舒适的鞋子'],
            avoid: ['不要在古城买银饰（贵且真假难辨）', '不要参加低价团', '尊重当地民族文化']
        },
        links: {
            official: 'https://www.lijiang.gov.cn/',
            attractions: [
                { name: '丽江古城', url: 'http://www.lijiangoldtown.com/', mustVisit: true },
                { name: '玉龙雪山', url: 'http://www.jadesnowmountain.com/', mustVisit: true },
                { name: '泸沽湖', url: 'http://www.luguhu.com/' }
            ],
            booking: [{ name: '玉龙雪山索道票', url: 'http://www.jadesnowmountain.com/' }],
            food: [{ name: '丽江美食', url: 'https://www.dianping.com/lijiang/food' }]
        },
        poster: {
            title: '丽江时光',
            subtitle: '艳遇之都，梦幻古城',
            elements: ['丽江古城', '玉龙雪山', '蓝月谷', '泸沽湖'],
            layout: '顶部雪山背景，中央古城街道，底部蓝月谷',
            colors: ['#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-13:00', morning: '丽江古城漫步（四方街→木府→狮子山）' },
                    { time: '14:00-18:00', afternoon: '束河古镇 → 白沙壁画' },
                    { time: '19:00-22:00', evening: '古城酒吧街听歌 → 吃腊排骨' }
                ],
                tips: ['古城维护费50元', '木府值得一看'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 丽江古城 → 束河古镇' },
                    { time: '06:30-17:00', morning2: 'Day2: 玉龙雪山（大索道→冰川公园→蓝月谷）' }
                ],
                tips: ['雪山索道票紧张需提前抢', '备好氧气瓶和羽绒服'],
                budget: '1000-1800元'
            }
        }
    },
    '桂林': {
        tags: ['山水甲天下', '漓江风光', '喀斯特地貌'],
        season: '4-10月（最佳：4月、9-10月）',
        atmosphere: '山青水秀，田园诗画，民族风情',
        days: '3-4天',
        routes: ['漓江漂流（兴坪-阳朔）→ 十里画廊', '象鼻山 → 两江四湖 → 日月双塔', '龙脊梯田（一日游）', '银子岩 → 遇龙河竹筏漂流'],
        foods: [
            { name: '桂林米粉', desc: '桂林特色，卤水香浓', price: '10-20元/碗', mustTry: true },
            { name: '啤酒鱼', desc: '阳朔特色菜', price: '60-100元/份' },
            { name: '荔浦芋头扣肉', desc: '桂林传统菜', price: '38-58元/份' },
            { name: '恭城油茶', desc: '瑶族特色饮品', price: '10-15元/壶' },
            { name: '马蹄糕', desc: '桂林甜品', price: '5-8元/块' }
        ],
        accommodations: [
            { area: '阳朔西街', pros: '热闹，酒吧餐厅多，出行方便', cons: '吵闹，商业化重' },
            { area: '桂林市区', pros: '交通便利，设施完善', cons: '距离漓江景区远' },
            { area: '兴坪/杨堤', pros: '漓江边，安静惬意', cons: '设施简单' }
        ],
        transport: [
            { type: '内部交通', info: '漓江游船、竹筏、电动车；阳朔适合骑电动车' },
            { type: '外部交通', info: '两江国际机场；桂林站、桂林北站等火车站' }
        ],
        budget: { low: '1200', medium: '2400', high: '4200+' },
        tips: {
            prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '雨具（多雨）', '晕车药（漓江游船）'],
            avoid: ['不要在西街买高价珠宝', '不要坐野导游的竹筏', '雨季注意安全']
        },
        links: {
            official: 'https://www.guilin.gov.cn/',
            attractions: [
                { name: '漓江', url: 'http://www.liriver.com/', mustVisit: true },
                { name: '阳朔西街', url: 'http://www.yangshuoxijie.com/', mustVisit: true },
                { name: '龙脊梯田', url: 'http://www.longji.com.cn/' }
            ],
            booking: [{ name: '漓江游船票', url: 'http://www.liriver.com/' }],
            food: [{ name: '桂林美食', url: 'https://www.dianping.com/guilin/food' }]
        },
        poster: {
            title: '山水画卷',
            subtitle: '桂林山水甲天下',
            elements: ['漓江', '象鼻山', '阳朔', '龙脊梯田'],
            layout: '顶部漓江山水，中央喀斯特峰林，底部梯田',
            colors: ['#27ae60', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-14:00', morning: '漓江游船（桂林→阳朔，4小时）' },
                    { time: '15:00-18:00', afternoon: '阳朔十里画廊骑行 → 西街' },
                    { time: '19:00-21:00', evening: '西街晚餐（啤酒鱼）→ 印象刘三姐演出' }
                ],
                tips: ['漓江游船提前预订', '十里画廊适合骑行'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 漓江游船 → 阳朔 → 西街' },
                    { time: '07:00-18:00', morning2: 'Day2: 龙脊梯田一日游（需早起）' }
                ],
                tips: ['龙脊距阳朔3小时车程', '梯田四季景色不同'],
                budget: '800-1600元'
            }
        }
    },
    '张家界': {
        tags: ['阿凡达取景地', '石英砂岩峰林', '玻璃栈道'],
        season: '4-10月（最佳：4-6月，9-10月）',
        atmosphere: '峰林奇观，云海仙境，自然鬼斧神工',
        days: '3-4天',
        routes: ['张家界国家森林公园（黄石寨→金鞭溪→袁家界）', '天子山 → 杨家界 → 天门山（玻璃栈道）', '大峡谷玻璃桥 → 黄龙洞', '凤凰古城（可搭配2日游）'],
        foods: [
            { name: '土家三下锅', desc: '张家界特色菜', price: '50-80元/份', mustTry: true },
            { name: '葛根粉', desc: '张家界特产', price: '10-15元/碗' },
            { name: '社饭', desc: '土家族传统食品', price: '15-25元/份' },
            { name: '岩耳炖鸡', desc: '山珍美味', price: '80-120元/份' },
            { name: '板栗炖鸡', desc: '湘西特色', price: '60-90元/份' }
        ],
        accommodations: [
            { area: '武陵源标志门附近', pros: '进景区方便，餐饮多', cons: '价格较高' },
            { area: '张家界市区', pros: '交通便利，性价比高', cons: '距离景区远（需乘车1小时）' },
            { area: '山顶客栈', pros: '看日出方便，省时间', cons: '条件简陋，价格贵' }
        ],
        transport: [
            { type: '内部交通', info: '景区环保车、索道、电梯；景区面积大，体力消耗大' },
            { type: '外部交通', info: '荷花国际机场；张家界西站火车站' }
        ],
        budget: { low: '1300', medium: '2600', high: '4500+' },
        tips: {
            prepare: ['身份证必带', '登山鞋（重要！）', '登山杖', '防晒霜', '雨具', '少量现金'],
            avoid: ['不要在景区买高价药材', '不要相信"免费导游"', '雨天路滑小心行走']
        },
        links: {
            official: 'https://www.zhangjiajie.gov.cn/',
            attractions: [
                { name: '张家界国家森林公园', url: 'http://www.zjjpark.com/', mustVisit: true },
                { name: '天门山', url: 'http://www.tianmenshan.com/', mustVisit: true },
                { name: '大峡谷玻璃桥', url: 'http://www.zjjdxg.com/' }
            ],
            booking: [{ name: '张家界门票', url: 'http://www.zjjpark.com/' }],
            food: [{ name: '张家界美食', url: 'https://www.dianping.com/zhangjiajie/food' }]
        },
        poster: {
            title: '峰林奇境',
            subtitle: '阿凡达世界，人间仙境',
            elements: ['袁家界', '天门山', '金鞭溪', '玻璃桥'],
            layout: '顶部峰林全景，中央玻璃栈道，底部溪流',
            colors: ['#27ae60', '#3498db', '#e74c3c', '#f39c12', '#8e44ad']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '07:00-12:00', morning: '张家界国家森林公园（袁家界→迷魂台→乾坤柱）' },
                    { time: '13:00-17:00', afternoon: '金鞭溪徒步 → 水绕四门' }
                ],
                tips: ['景区很大，选精华路线', '袁家界是核心景区'],
                budget: '350-650元'
            },
            '2天1晚': {
                routes: [
                    { time: '07:00-17:00', morning: 'Day1: 张家界国家森林公园（袁家界→天子山→十里画廊）' },
                    { time: '07:30-16:00', morning2: 'Day2: 天门山（玻璃栈道→天门洞→索道）' }
                ],
                tips: ['天门山分A/B线，提前选好', '玻璃栈道另收费'],
                budget: '900-1700元'
            }
        }
    },
    '哈尔滨': {
        tags: ['冰城', '东方莫斯科', '冰雪大世界'],
        season: '冬季（12月-次年2月）',
        atmosphere: '俄式建筑，冰雪童话，东北热情',
        days: '3-4天',
        routes: ['中央大街 → 圣索菲亚教堂 → 松花江', '冰雪大世界（冬季）→ 极地馆', '太阳岛雪博会 → 东北虎林园', '伏尔加庄园（俄式风情）'],
        foods: [
            { name: '锅包肉', desc: '东北名菜，酸甜酥脆', price: '38-58元/份', mustTry: true },
            { name: '红肠', desc: '哈尔滨特产', price: '25-40元/斤' },
            { name: '马迭尔冰棍', desc: '中央大街必吃', price: '5-10元/根' },
            { name: '铁锅炖', desc: '东北特色', price: '80-150元/锅' },
            { name: '酸菜白肉血肠', desc: '东北传统菜', price: '50-80元/份' }
        ],
        accommodations: [
            { area: '中央大街附近', pros: '市中心，步行游览方便', cons: '冬季价格贵' },
            { area: '防洪纪念塔/松花江畔', pros: '江景房，看冰雪大世界方便', cons: '距离地铁站稍远' },
            { area: '道里区其他区域', pros: '性价比高', cons: '距离景点稍远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁、公交、出租车；冬季路面结冰注意安全' },
            { type: '外部交通', info: '太平国际机场；哈尔滨站、哈尔滨西站等火车站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5500+' },
        tips: {
            prepare: ['身份证必带', '保暖衣物（羽绒服、帽子、手套、围巾）', '暖宝宝', '防滑鞋', '保湿霜（室内干燥）'],
            avoid: ['不要在中央大街买高价俄货', '不要相信低价冰雪大世界门票', '室外活动注意防冻']
        },
        links: {
            official: 'https://www.harbin.gov.cn/',
            attractions: [
                { name: '冰雪大世界', url: 'http://www.hrbicesnow.com/', mustVisit: true },
                { name: '圣索菲亚教堂', url: 'http://www.sofiachurch.com/', mustVisit: true },
                { name: '中央大街', url: 'http://www.centralstreet-harbin.com/' }
            ],
            booking: [{ name: '冰雪大世界门票', url: 'http://www.hrbicesnow.com/' }],
            food: [{ name: '哈尔滨美食', url: 'https://www.dianping.com/harbin/food' }]
        },
        poster: {
            title: '冰城童话',
            subtitle: '东方莫斯科，冰雪之都',
            elements: ['冰雪大世界', '圣索菲亚教堂', '中央大街', '松花江'],
            layout: '顶部冰雪城堡，中央教堂圆顶，底部中央大街',
            colors: ['#3498db', '#ecf0f1', '#2980b9', '#e74c3c', '#f39c12']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '中央大街漫步 → 圣索菲亚教堂拍照' },
                    { time: '13:00-17:00', afternoon: '松花江面活动 → 抗洪纪念塔' },
                    { time: '18:00-22:00', evening: '冰雪大世界（冬季）或 中央大街夜景 → 铁锅炖' }
                ],
                tips: ['马迭尔冰棍全年都有', '圣索菲亚教堂内部需购票'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 中央大街 → 圣索菲亚 → 松花江 → 冰雪大世界' },
                    { time: '09:00-17:00', morning2: 'Day2: 太阳岛雪博会 → 东北虎林园 → 极地馆' }
                ],
                tips: ['冰雪大世界下午去晚上看灯', '东北虎林园可以喂老虎'],
                budget: '1000-2000元'
            }
        }
    },
    '大理': {
        tags: ['风花雪月', '苍山洱海', '白族风情'],
        season: '春秋两季（3-5月，9-11月）',
        atmosphere: '苍山洱海，慢生活，文艺青年聚集地',
        days: '3-4天',
        routes: ['洱海环湖（吉普车/自行车）→ 双廊古镇', '大理古城 → 崇圣寺三塔 → 苍山', '喜洲古镇 → 海舌公园 → 周城扎染', '沙溪古镇（深度游）'],
        foods: [
            { name: '酸辣鱼', desc: '大理特色，酸辣开胃', price: '50-80元/份', mustTry: true },
            { name: '乳扇', desc: '白族特色奶酪', price: '5-10元/片' },
            { name: '喜洲粑粑', desc: '喜洲特色烤饼', price: '5-8元/个' },
            { name: '生皮', desc: '白族特色菜（生猪肉）', price: '40-70元/份' },
            { name: '饵丝', desc: '云南特色米线', price: '10-15元/碗' }
        ],
        accommodations: [
            { area: '大理古城', pros: '餐饮娱乐多，交通便利', cons: '旺季吵闹，价格高' },
            { area: '双廊/挖色', pros: '洱海边，海景房', cons: '距离古城远' },
            { area: '喜洲/海西', pros: '安静，田园风光', cons: '设施较少' }
        ],
        transport: [
            { type: '内部交通', info: '洱海环湖建议租车/包车；古城内步行/电动车' },
            { type: '外部交通', info: '凤仪机场（距古城13km）；大理站火车站' }
        ],
        budget: { low: '1200', medium: '2400', high: '4200+' },
        tips: {
            prepare: ['身份证必带', '防晒霜（高原紫外线强）', '舒适的鞋子', '墨镜', '外套（早晚温差大）'],
            avoid: ['不要在古城买高价银饰', '不要租无证车辆', '尊重白族风俗']
        },
        links: {
            official: 'https://www.dali.gov.cn/',
            attractions: [
                { name: '洱海', url: 'http://www.erhai.org/', mustVisit: true },
                { name: '崇圣寺三塔', url: 'http://www.chongshengsi.com/', mustVisit: true },
                { name: '大理古城', url: 'http://www.dalioldtown.com/' }
            ],
            booking: [{ name: '崇圣寺三塔门票', url: 'http://www.chongshengsi.com/' }],
            food: [{ name: '大理美食', url: 'https://www.dianping.com/dali/food' }]
        },
        poster: {
            title: '风花雪月',
            subtitle: '苍山洱海，理想国',
            elements: ['洱海', '苍山', '崇圣寺三塔', '双廊'],
            layout: '顶部苍山背景，中央洱海全景，底部古城街道',
            colors: ['#27ae60', '#3498db', '#e74c3c', '#f39c12', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '大理古城（人民路→洋人街→五华楼）' },
                    { time: '13:00-17:00', afternoon: '崇圣寺三塔 → 才村码头看洱海' },
                    { time: '17:30-21:00', evening: '洱海生态廊道骑行 → 古城晚餐' }
                ],
                tips: ['三塔倒影拍照最佳', '洱海日出很美'],
                budget: '280-550元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 大理古城 → 崇圣寺三塔 → 洱海生态廊道' },
                    { time: '08:00-18:00', morning2: 'Day2: 洱海环湖（双廊→喜洲→海舌→周城）' }
                ],
                tips: ['环湖约130公里，预留一天', '双廊适合住一晚'],
                budget: '700-1300元'
            }
        }
    },
    '敦煌': {
        tags: ['丝绸之路', '莫高窟', '沙漠绿洲'],
        season: '5-10月（最佳：9-10月）',
        atmosphere: '大漠孤烟，千年佛国，丝路文明',
        days: '2-3天',
        routes: ['莫高窟 → 鸣沙山月牙泉', '敦煌古城 → 西千佛洞 → 玉门关 → 雅丹魔鬼城', '榆林窟（可选）'],
        foods: [
            { name: '驴肉黄面', desc: '敦煌特色', price: '25-40元/份', mustTry: true },
            { name: '杏皮水', desc: '敦煌特色饮料', price: '5-8元/杯' },
            { name: '羊肉粉汤', desc: '西北特色早餐', price: '15-25元/碗' },
            { name: '胡羊焖饼', desc: '敦煌特色菜', price: '40-60元/份' },
            { name: '酿皮', desc: '西北特色小吃', price: '8-12元/份' }
        ],
        accommodations: [
            { area: '敦煌市区', pros: '餐饮购物方便，交通便利', cons: '距离鸣沙山需打车' },
            { area: '鸣沙山附近', pros: '看日出日落方便', cons: '选择少，价格高' }
        ],
        transport: [
            { type: '内部交通', info: '出租车、包车；景点分散，建议包车' },
            { type: '外部交通', info: '敦煌机场；敦煌站火车站' }
        ],
        budget: { low: '1500', medium: '2800', high: '4800+' },
        tips: {
            prepare: ['身份证必带', '防晒霜（沙漠紫外线极强）', '围巾/头巾（防风沙）', '墨镜', '润唇膏', '舒适的鞋子'],
            avoid: ['不要在景区买高价玉石', '莫高窟门票需提前1个月预订', '沙漠活动注意防暑脱水']
        },
        links: {
            official: 'https://www.dunhuang.gov.cn/',
            attractions: [
                { name: '莫高窟', url: 'http://www.mogaoku.net/', mustVisit: true },
                { name: '鸣沙山月牙泉', url: 'http://www.mssyyq.com/', mustVisit: true },
                { name: '雅丹魔鬼城', url: 'http://www.yadan.gov.cn/' }
            ],
            booking: [{ name: '莫高窟门票', url: 'http://www.mogaoku.net/' }],
            food: [{ name: '敦煌美食', url: 'https://www.dianping.com/dunhuang/food' }]
        },
        poster: {
            title: '丝路传奇',
            subtitle: '大漠孤烟，千年佛国',
            elements: ['莫高窟', '鸣沙山', '月牙泉', '雅丹地貌'],
            layout: '顶部莫高窟九层楼，中央鸣沙山驼队，底部月牙泉',
            colors: ['#f39c12', '#e67e22', '#d35400', '#c0392b', '#8e44ad']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:30', morning: '莫高窟（需提前预约，参观约4小时）' },
                    { time: '14:00-18:00', afternoon: '鸣沙山月牙泉（骑骆驼→滑沙→看日落）' },
                    { time: '19:00-21:00', evening: '沙洲夜市 → 驴肉黄面' }
                ],
                tips: ['莫高窟必须提前网上预约', '鸣沙山傍晚去不晒且看日落'],
                budget: '400-750元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-13:00', morning: 'Day1: 莫高窟 → 鸣沙山月牙泉' },
                    { time: '06:00-19:00', morning2: 'Day2: 西线一日游（敦煌古城→西千佛洞→玉门关→雅丹魔鬼城）' }
                ],
                tips: ['西线全程约350公里，需包车', '雅丹日落壮观'],
                budget: '1000-1800元'
            }
        }
    }
};

// ==========================================
// 城市搜索
// ==========================================
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
    return null;
}

// ==========================================
// 搜索建议
// ==========================================
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
            <span class="suggestion-icon"></span>
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

// ==========================================
// 搜索统计与排行榜
// ==========================================
function recordSearch(cityName) {
    searchStats.totalSearches++;
    searchStats.citySearches[cityName] = (searchStats.citySearches[cityName] || 0) + 1;
    searchStats.lastUpdated = new Date().toISOString();
    searchStats.topCities = Object.entries(searchStats.citySearches)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([city, count]) => ({ city, count }));
    saveStatsToStorage();
    updateRankingDisplay();
    updateTotalSearches();
}

function updateRankingDisplay() {
    const rankingList = document.getElementById('rankingList');
    if (!rankingList) return;
    if (searchStats.topCities.length === 0) {
        rankingList.innerHTML = `
            <div class="rank-item">
                <div class="rank-left">
                    <span class="rank-badge"></span>
                    <span class="rank-city">🔍 搜索城市后将显示排行榜</span>
                </div>
            </div>
        `;
        return;
    }
    const medals = ['🥇', '🥈', '🥉'];
    const top10 = searchStats.topCities.slice(0, 10);
    const maxCount = top10[0]?.count || 1;
    
    rankingList.innerHTML = top10.map((item, index) => {
        const cityData = cityDatabase[item.city];
        const tags = cityData?.tags?.slice(0, 2) || [];
        const percentage = Math.max(5, (item.count / maxCount) * 100);
        const badge = index < 3 ? medals[index] : `<span class="rank-number">${index + 1}</span>`;
        
        return `
            <div class="rank-item" style="animation: slideIn 0.3s ease-out ${index * 0.05}s both;">
                <div class="rank-left">
                    <span class="rank-badge ${index < 3 ? 'medal' : ''}">${badge}</span>
                    <div class="rank-city-info">
                        <span class="rank-city">${item.city}</span>
                        ${tags.length > 0 ? `<span class="rank-tags">${tags.join(' · ')}</span>` : ''}
                    </div>
                </div>
                <div class="rank-right">
                    <span class="rank-views">👁 ${item.count.toLocaleString()}次</span>
                    <div class="rank-bar" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }).join('');
    
    if (!document.getElementById('rankingStyle')) {
        const style = document.createElement('style');
        style.id = 'rankingStyle';
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .rank-city-info { display: flex; flex-direction: column; gap: 2px; }
            .rank-tags { font-size: 11px; color: #999; }
            .rank-number { font-size: 13px; font-weight: 600; color: #666; width: 20px; text-align: center; }
        `;
        document.head.appendChild(style);
    }
}

function updateTotalSearches() {
    const totalEl = document.getElementById('totalSearches');
    if (totalEl) {
        totalEl.textContent = searchStats.totalSearches.toLocaleString();
    }
}

// ==========================================
// Toast通知
// ==========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function showError(message) { showToast(message, 'error'); }
function showSuccess(message) { showToast(message, 'success'); }
function showInfo(message) { showToast(message, 'info'); }

// ==========================================
// 初始化
// ==========================================
function initApp() {
    cityDatabase = EMBEDDED_CITIES;
    console.log('城市数据已加载，共', Object.keys(cityDatabase).length, '个城市');
    updateTotalSearches();
    updateRankingDisplay();
}

// ==========================================
// 生成攻略
// ==========================================
async function generateCityGuide(cityName) {
    if (!cityName) {
        showError('请输入城市名称！');
        return;
    }
    recordSearch(cityName);
    document.getElementById('result').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const matchedCity = findCity(cityName);
    const resultDiv = document.getElementById('result');
    
    if (matchedCity && cityDatabase[matchedCity]) {
        resultDiv.innerHTML = generatePosterHTML(cityDatabase[matchedCity], matchedCity);
    } else {
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
    }
    
    document.getElementById('loading').classList.add('hidden');
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// 生成海报HTML
// ==========================================
function generatePosterHTML(cityData, cityName) {
    let itineraryTypes = cityData.itineraries ? Object.keys(cityData.itineraries) : [];
    let selectedItinerary = itineraryTypes[0] || '1天';
    
    const weatherData = generateMockWeather(cityName);
    
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
                    <div class="link-group-title">️ 官方网站</div>
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
                    <button class="itinerary-tab ${type === selectedItinerary ? 'active' : ''}" data-itinerary="${type}">${type}</button>
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
                                <h4>📝 行程小贴士</h4>
                                <ul>${itinerary.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>
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

    const weatherHTML = weatherData ? `
        <div class="weather-card">
            <div class="weather-header">
                <h3 class="weather-city">️ ${cityName}天气</h3>
                <span class="weather-time">更新于 ${new Date(weatherData.updateTime).toLocaleString('zh-CN')}</span>
            </div>
            <div class="weather-main">
                <div class="weather-temp">${weatherData.current.temp}</div>
                <div class="weather-info">
                    <div class="weather-condition">${weatherData.current.condition}</div>
                    <div class="weather-details-row">
                        <span>💧 湿度: ${weatherData.current.humidity}</span>
                        <span>💨 风力: ${weatherData.current.wind}</span>
                        <span>👁️ 能见度: ${weatherData.current.visibility}</span>
                    </div>
                </div>
            </div>
            ${weatherData.forecast && weatherData.forecast.length > 0 ? `
                <div class="weather-forecast">
                    <h4>📅 未来预报</h4>
                    <div class="forecast-days">
                        ${weatherData.forecast.slice(0, 3).map(day => `
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
                <h3 class="section-title" style="margin-top: 30px;">🏨 住宿推荐</h3>
                <div class="hotel-grid">${hotelCards}</div>
                <div class="transport-section">
                    <h3 class="section-title">🚗 交通指南</h3>
                    <div class="transport-grid">${transportCards}</div>
                </div>
                <div class="budget-section">
                    <h3 class="section-title">💰 预算估算</h3>
                    <div class="budget-grid">
                        <div class="budget-card"><div class="budget-level">经济型</div><div class="budget-amount">¥${cityData.budget.low}</div></div>
                        <div class="budget-card"><div class="budget-level">舒适型</div><div class="budget-amount">¥${cityData.budget.medium}</div></div>
                        <div class="budget-card"><div class="budget-level">豪华型</div><div class="budget-amount">¥${cityData.budget.high}</div></div>
                    </div>
                </div>
                <div class="tips-grid">
                    <div class="tip-card"><div class="tip-title">🎒 行前准备</div><ul class="tip-list">${cityData.tips.prepare.map(t => `<li>${t}</li>`).join('')}</ul></div>
                    <div class="tip-card"><div class="tip-title">⚠️ 避坑指南</div><ul class="tip-list avoid">${cityData.tips.avoid.map(t => `<li>${t}</li>`).join('')}</ul></div>
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
                    <div class="design-item"><div class="design-label">视觉元素</div><div class="design-tags">${elementTags}</div></div>
                    <div class="design-item"><div class="design-label">构图布局</div><div class="design-content">${cityData.poster.layout}</div></div>
                    <div class="design-item"><div class="design-label">配色方案</div><div class="color-list">${colorDots}</div></div>
                </div>
            </div>
            <div class="poster-footer">
                <div class="footer-text">由 AI 智能生成 | 仅供参考</div>
                <div class="footer-actions">
                    <button class="action-btn save-btn" onclick="savePoster()">💾 保存攻略</button>
                    <button class="action-btn share-btn" onclick="sharePoster()"> 分享攻略</button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 保存与分享
// ==========================================
function savePoster() {
    const poster = document.querySelector('.poster');
    if (!poster) { showError('请先生成攻略！'); return; }
    const cityName = document.getElementById('cityInput').value || '旅游攻略';
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${cityName}旅游攻略</title><style>body{margin:0;font-family:-apple-system,sans-serif;} .poster{box-shadow:none;margin:0;max-width:800px;margin:0 auto;padding:20px;} .footer-actions{display:none!important;}</style></head><body>${poster.innerHTML}<script>setTimeout(()=>{window.print();window.close();},500);<\/script></body></html>`);
    printWindow.document.close();
    showSuccess('正在打开打印对话框，您可以选择"另存为PDF"');
}

function sharePoster() {
    const url = window.location.href;
    const text = '分享一个旅游攻略，快来看看吧！';
    if (navigator.share) {
        navigator.share({ title: '旅游攻略分享', text, url }).catch(err => console.log('分享失败:', err));
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => { showSuccess('链接已复制到剪贴板！'); }).catch(() => { showError('复制失败，请手动复制链接'); });
    } else { showError('您的浏览器不支持分享功能'); }
}

// ==========================================
// 事件监听
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const generateBtn = document.getElementById('generateBtn');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    let selectedIndex = -1;

    if (cityInput) {
        cityInput.addEventListener('input', function() {
            const keyword = this.value;
            if (keyword.trim().length > 0) { showSearchSuggestions(keyword); } else { hideSearchSuggestions(); }
        });
        cityInput.addEventListener('focus', function() {
            if (this.value.trim().length > 0) { showSearchSuggestions(this.value); }
        });
        cityInput.addEventListener('blur', function() { setTimeout(() => hideSearchSuggestions(), 200); });
        cityInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); hideSearchSuggestions(); generateCityGuide(this.value.trim()); return; }
            const items = suggestionsDiv?.querySelectorAll('.suggestion-item');
            if (!items || items.length === 0) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); updateSuggestionSelection(items); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); updateSuggestionSelection(items); }
            else if (e.key === 'Escape') { hideSearchSuggestions(); }
        });
    }

    function updateSuggestionSelection(items) {
        items.forEach((item, idx) => { item.classList.toggle('selected', idx === selectedIndex); });
        if (selectedIndex >= 0 && selectedIndex < items.length) { cityInput.value = items[selectedIndex].dataset.city; }
    }

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

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const cityName = cityInput?.value.trim();
            generateCityGuide(cityName);
        });
    }

    document.querySelectorAll('.quick-city-btn, .quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cityName = this.dataset.city;
            if (cityInput) cityInput.value = cityName;
            generateCityGuide(cityName);
        });
    });

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
            } else { citySelect.disabled = true; }
        });
        citySelect.addEventListener('change', function() {
            if (this.value) { if (cityInput) cityInput.value = this.value; generateCityGuide(this.value); }
        });
    }

    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', function() {
            location.reload();
        });
    }
});

// ==========================================
// 启动应用
// ==========================================
initApp();
