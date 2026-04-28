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
    '西安': ['xian', 'xa', '长安', '古都']
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
                    <span class="rank-city">搜索城市后将显示排行榜</span>
                </div>
            </div>
        `;
        return;
    }
    const medals = ['🥇', '🥈', ''];
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
