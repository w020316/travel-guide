// ==========================================
// 旅游攻略生成器 - 企业级完整版
// 支持后端API + 本地模式自动切换
// ==========================================

let cityDatabase = {};
let selectedDays = 3;
let currentCityData = null;
let currentUser = null;

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
    '敦煌': ['dunhuang', 'dh'],
    '天津': ['tianjin', 'tj', '津门', '津'],
    '武汉': ['wuhan', 'wh', '江城'],
    '长沙': ['changsha', 'cs', '星城', '潭'],
    '郑州': ['zhengzhou', 'zz', '商都'],
    '洛阳': ['luoyang', 'ly', '神都'],
    '福州': ['fuzhou', 'fz', '榕城'],
    '宁波': ['ningbo', 'nb', '甬'],
    '无锡': ['wuxi', 'wx', '梁溪'],
    '合肥': ['hefei', 'hf', '庐州'],
    '黄山': ['huangshan', 'hs', '徽州'],
    '沈阳': ['shenyang', 'sy', '盛京', '奉天'],
    '长春': ['changchun', 'cc', '北春城'],
    '昆明': ['kunming', 'km', '春城'],
    '贵阳': ['guiyang', 'gy', '筑城'],
    '拉萨': ['lasa', 'ls', '日光城'],
    '乌鲁木齐': ['urumqi', 'wlmq', '乌市'],
    '兰州': ['lanzhou', 'lz', '金城'],
    '西宁': ['xining', 'xn', '夏都'],
    '银川': ['yinchuan', 'yc', '凤城'],
    '呼和浩特': ['huhehaote', 'hhht', '呼市', '青城'],
    '太原': ['taiyuan', 'ty', '龙城'],
    '石家庄': ['shijiazhuang', 'sjz', '国际庄'],
    '南昌': ['nanchang', 'nc', '洪城'],
    '济南': ['jinan', 'jn', '泉城'],
    '珠海': ['zhuhai', 'zh', '百岛之市']
};

// ==========================================
// 城市数据（内嵌，支持离线使用）
// ==========================================
const EMBEDDED_CITIES = {
    '成都': {
        title: '成都·慢生活之旅',
        season: '四季皆宜',
        days: '3-5',
        tags: ['美食之都', '休闲慢游', '大熊猫'],
        atmosphere: '悠闲、安逸、烟火气',
        poster: { style: 'fresh', subtitle: '一座来了就不想走的城市' },
        routes: [
            '宽窄巷子→人民公园→春熙路→IFS',
            '大熊猫繁育研究基地→武侯祠→锦里',
            '杜甫草堂→青羊宫→文殊院→九眼桥'
        ],
        foods: [
            { name: '火锅', description: '麻辣鲜香，成都灵魂', price: '80-120元/人', mustTry: true, location: '蜀九香/小龙坎' },
            { name: '串串香', description: '街头巷尾的烟火气', price: '40-70元/人', mustTry: true, location: '钢管厂五区' },
            { name: '担担面', description: '经典川味小吃', price: '15-20元', mustTry: false, location: '老字号面馆' },
            { name: '兔头', description: '重口味必试', price: '15-20元/个', mustTry: false, location: '双流老妈兔头' },
            { name: '冰粉', description: '解辣神器', price: '8-12元', mustTry: true, location: '街头小摊' }
        ],
        accommodations: [
            { name: '春熙路商圈酒店', area: '市中心', priceRange: '300-600元', features: ['交通便利', '购物方便'] },
            { name: '宽窄巷子民宿', area: '景区附近', priceRange: '200-400元', features: ['文化氛围', '特色体验'] },
            { name: '天府广场商务酒店', area: '政务中心', priceRange: '250-500元', features: ['地铁直达', '性价比高'] }
        ],
        tips: {
            prepare: ['身份证', '舒适步行鞋', '防晒用品', '肠胃药（防辣）'],
            avoid: ['不要在景区买高价特产', '避免周末高峰期出行', '小心路边拉客的"一日游"'],
            bestTime: ['3-6月春季', '9-11月秋季', '避开7-8月酷暑']
        }
    },
    '北京': {
        title: '北京·皇城古韵',
        season: '春秋最佳',
        days: '4-6',
        tags: ['历史文化', '皇家园林', '首都风貌'],
        atmosphere: '大气、厚重、现代与传统交融',
        poster: { style: 'vintage', subtitle: '三千年的历史沉淀' },
        routes: [
            '故宫→景山公园→北海公园→什刹海',
            '天安门广场→国家博物馆→前门大街',
            '长城（八达岭）→十三陵→鸟巢水立方',
            '颐和园→圆明园→清华北大'
        ],
        foods: [
            { name: '北京烤鸭', description: '皮脆肉嫩，色泽红润', price: '150-300元/只', mustTry: true, location: '全聚德/便宜坊' },
            { name: '炸酱面', description: '老北京经典主食', price: '20-30元', mustTry: true, location: '海碗居' },
            { name: '豆汁焦圈', description: '地道北京味', price: '10-15元', mustTry: false, location: '护国寺小吃' },
            { name: '涮羊肉', description: '铜锅炭火，鲜嫩可口', price: '80-150元/人', mustTry: true, location: '东来顺' },
            { name: '驴打滚', description: '传统糕点', price: '8-15元', mustTry: false, location: '稻香村' }
        ],
        accommodations: [
            { name: '王府井商圈酒店', area: '市中心', priceRange: '400-800元', features: ['核心地段', '购物便利'] },
            { name: '三里屯时尚酒店', area: '朝阳区', priceRange: '350-700元', features: ['夜生活丰富', '潮流聚集'] },
            { name: '南锣鼓巷胡同民宿', area: '东城区', priceRange: '200-500元', features: ['老北京风情', '文化体验'] }
        ],
        tips: {
            prepare: ['身份证', '舒适运动鞋', '防晒霜', '保温杯'],
            avoid: ['不要相信黑导游', '故宫需提前预约', '长城注意防骗'],
            bestTime: ['4-5月春季', '9-10月秋季', '冬季可看雪景']
        }
    },
    '上海': {
        title: '上海·魔都风华',
        season: '春秋最佳',
        days: '3-5',
        tags: ['国际都市', '外滩夜景', '海派文化'],
        atmosphere: '时尚、精致、中西合璧',
        poster: { style: 'minimal', subtitle: '东方巴黎的现代魅力' },
        routes: [
            '外滩→南京路→豫园→城隍庙',
            '陆家嘴→东方明珠→上海中心大厦',
            '田子坊→新天地→淮海路',
            '迪士尼乐园（全天）'
        ],
        foods: [
            { name: '生煎包', description: '底脆汤多，上海招牌', price: '15-25元', mustTry: true, location: '小杨生煎' },
            { name: '小笼包', description: '皮薄馅美汤汁足', price: '20-40元', mustTry: true, location: '南翔馒头店' },
            { name: '白切鸡', description: '本帮菜经典', price: '50-80元', mustTry: false, location: '光明邨' },
            { name: '排骨年糕', description: '甜咸适口', price: '15-20元', mustTry: false, location: '云南路美食街' },
            { name: '蟹粉小笼', description: '季节限定美味', price: '40-60元', mustTry: true, location: '鼎泰丰' }
        ],
        accommodations: [
            { name: '外滩豪华酒店', area: '黄浦区', priceRange: '600-1500元', features: ['江景房', '地标建筑'] },
            { name: '南京路商圈酒店', area: '黄浦区', priceRange: '300-600元', features: ['交通便利', '购物天堂'] },
            { name: '静安寺精品酒店', area: '静安区', priceRange: '350-700元', features: ['文艺气息', '咖啡馆林立'] }
        ],
        tips: {
            prepare: ['身份证', '充电宝', '舒适的鞋子', '雨伞（多变天气）'],
            avoid: ['不要在景点买丝绸', '警惕黄牛票', '迪士尼提前购票'],
            bestTime: ['3-5月', '9-11月', '避开梅雨季6-7月']
        }
    },
    '杭州': {
        title: '杭州·人间天堂',
        season: '春秋最佳',
        days: '2-4',
        tags: ['西湖美景', '江南水乡', '茶文化'],
        atmosphere: '温婉、诗意、烟雨朦胧',
        poster: { style: 'fresh', subtitle: '上有天堂 下有苏杭' },
        routes: [
            '西湖十景（断桥残雪→雷峰塔→三潭印月）',
            '灵隐寺→飞来峰→龙井村→九溪十八涧',
            '西溪湿地→宋城→千岛湖（可选）',
            '河坊街→南宋御街→清河坊'
        ],
        foods: [
            { name: '西湖醋鱼', description: '酸甜鲜美，杭帮菜代表', price: '60-100元', mustTry: true, location: '楼外楼' },
            { name: '东坡肉', description: '肥而不腻入口即化', price: '50-80元', mustTry: true, location: '知味观' },
            { name: '龙井虾仁', description: '清香淡雅', price: '60-90元', mustTry: false, location: '山外山' },
            { name: '片儿川', description: '杭州特色面食', price: '20-30元', mustTry: true, location: '菊英面馆' },
            { name: '叫化童鸡', description: '传统名菜', price: '80-120元', mustTry: false, location: '张生记' }
        ],
        accommodations: [
            { name: '西湖边度假酒店', area: '西湖区', priceRange: '500-1200元', features: ['湖景房', '环境优美'] },
            { name: '河坊街民宿', area: '上城区', priceRange: '200-450元', features: ['古色古香', '交通便利'] },
            { name: '武林广场商务酒店', area: '下城区', priceRange: '280-550元', features: ['地铁枢纽', '商业中心'] }
        ],
        tips: {
            prepare: ['身份证', '舒适鞋子', '相机', '雨具（多雨）'],
            avoid: ['不要在景区买茶叶', '西湖游船砍价', '灵隐寺香火小心'],
            bestTime: ['3-5月春季', '9-11月秋季', '夏季赏荷冬季赏雪']
        }
    },
    '西安': {
        title: '西安·千年古都',
        season: '春秋最佳',
        days: '3-5',
        tags: ['兵马俑', '古城墙', '丝绸之路起点'],
        atmosphere: '沧桑、厚重、历史感十足',
        poster: { style: 'vintage', subtitle: '十三朝古都的辉煌' },
        routes: [
            '兵马俑→华清池→骊山',
            '古城墙→钟鼓楼→回民街',
            '大雁塔→大唐芙蓉园→大唐不夜城',
            '陕西历史博物馆→碑林→书院门'
        ],
        foods: [
            { name: '肉夹馍', description: '腊汁肉肥瘦相间', price: '15-25元', mustTry: true, location: '樊记肉夹馍' },
            { name: '羊肉泡馍', description: '掰馍讲究，汤浓肉烂', price: '25-40元', mustTry: true, location: '同盛祥' },
            { name: '凉皮', description: '酸辣爽口', price: '8-12元', mustTry: true, location: '魏家凉皮' },
            { name: 'biangbiang面', description: '裤带般宽的面条', price: '15-20元', mustTry: false, location: '老孙家' },
            { name: '葫芦鸡', description: '陕菜代表作', price: '60-90元', mustTry: false, location: '德发长' }
        ],
        accommodations: [
            { name: '钟楼商圈酒店', area: '碑林区', priceRange: '250-500元', features: ['市中心', '交通枢纽'] },
            { name: '大雁塔周边酒店', area: '雁塔区', priceRange: '200-450元', features: ['夜景优美', '大唐文化'] },
            { name: '回民街客栈', area: '莲湖区', priceRange: '180-380元', features: ['美食集中', '民族风情'] }
        ],
        tips: {
            prepare: ['身份证', '舒适鞋子', '学生证（门票优惠）', '空肚子（准备吃！）'],
            avoid: ['不要在回民街被拉客', '兵马俑请正规导游', '假特产要辨别'],
            bestTime: ['3-5月', '9-11月', '春节有灯会']
        }
    },
    '重庆': {
        title: '重庆·山城雾都',
        season: '春秋最佳',
        days: '3-4',
        tags: ['8D魔幻城市', '火锅之都', '网红打卡地'],
        atmosphere: '火辣、立体、赛博朋克',
        poster: { style: 'fresh', subtitle: '让导航绝望的城市' },
        routes: [
            '洪崖洞→解放碑→长江索道→来福士',
            '磁器口→李子坝轻轨穿楼→鹅岭二厂',
            '武隆天生三桥→仙女山（一日游）',
            '南山一棵树→长江夜景→火锅'
        ],
        foods: [
            { name: '重庆火锅', description: '牛油麻辣，越吃越爽', price: '80-130元/人', mustTry: true, location: '佩姐/秦妈' },
            { name: '小面', description: '麻辣鲜拌，早餐必备', price: '10-15元', mustTry: true, location: '花市豌杂面' },
            { name: '酸辣粉', description: '酸辣开胃', price: '10-15元', mustTry: false, location: '好又来' },
            { name: '毛血旺', description: '麻辣烫升级版', price: '50-80元', mustTry: false, location: '江湖菜馆' },
            { name: '冰粉凉虾', description: '解辣神器', price: '8-12元', mustTry: true, location: '街头巷尾' }
        ],
        accommodations: [
            { name: '解放碑商圈酒店', area: '渝中区', priceRange: '300-600元', features: ['核心地段', '夜景绝佳'] },
            { name: '洪崖洞江景酒店', area: '渝中区', priceRange: '250-500元', features: ['网红打卡', '两江交汇'] },
            { name: '磁器口古镇民宿', area: '沙坪坝区', priceRange: '180-350元', features: ['古镇风情', '文艺清新'] }
        ],
        tips: {
            prepare: ['身份证', '防滑鞋', '肠胃药', '防晒（夏天很热）'],
            avoid: ['不要信"带路党"', '轻轨站要走很久', '火锅微辣也很辣'],
            bestTime: ['3-5月', '9-11月', '夏季注意防暑']
        }
    },
    '大理': {
        title: '大理·风花雪月',
        season: '全年适宜',
        days: '3-5',
        tags: ['苍山洱海', '白族风情', '慢生活'],
        atmosphere: '浪漫、自由、诗和远方',
        poster: { style: 'minimal', subtitle: '下关风 上关花 苍山雪 洱海月' },
        routes: [
            '洱海环湖（吉普车旅拍）→喜洲古镇→双廊',
            '苍山索道→崇圣寺三塔→大理古城',
            '沙溪古镇→石宝山（深度游）',
            '丽江→玉龙雪山（延伸线路）'
        ],
        foods: [
            { name: '酸辣鱼', description: '洱海鱼现捞现做', price: '50-80元', mustTry: true, location: '双廊海边餐厅' },
            { name: '乳扇', description: '奶香浓郁的白族小吃', price: '10-15元', mustTry: true, location: '大理古城' },
            { name: '饵丝', description: '软糯Q弹', price: '8-12元', mustTry: false, location: '巍山' },
            { name: '生皮', description: '勇敢者的美食', price: '40-60元', mustTry: false, location: '白族餐馆' },
            { name: '雕梅', description: '酸甜可口的手工果脯', price: '15-25元', mustTry: false, location: '古城店铺' }
        ],
        accommodations: [
            { name: '洱海海景客栈', area: '洱海边', priceRange: '300-800元', features: ['日出日落', '无敌海景'] },
            { name: '大理古城民宿', area: '古城内', priceRange: '150-400元', features: ['白族院落', '安静惬意'] },
            { name: '双廊艺术酒店', area: '双廊镇', priceRange: '250-600元', features: ['文艺范', '摄影圣地'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜（高原紫外线强）', '墨镜', '外套（早晚温差大）'],
            avoid: ['不要坐黑车环湖', '古城银器谨慎购买', '尊重白族风俗'],
            bestTime: ['3-5月花开季', '9-11月秋高气爽', '冬季看海鸥']
        }
    },
    '三亚': {
        title: '三亚·热带天堂',
        seasons: '10月-次年4月',
        days: '4-6',
        tags: ['海滨度假', '热带风光', '海鲜盛宴'],
        atmosphere: '热情、慵懒、椰风海韵',
        poster: { style: 'fresh', subtitle: '东方夏威夷' },
        routes: [
            '亚龙湾海滩→热带天堂森林公园→蜈支洲岛',
            '天涯海角→南山寺→大小洞天',
            '海棠湾免税店→亚特兰蒂斯水世界',
            '西岛→椰梦长廊→第一市场吃海鲜'
        ],
        foods: [
            { name: '海南鸡饭', description: '鸡肉嫩滑饭香软', price: '25-40元', mustTry: true, location: '沿江海南鸡饭' },
            { name: '清补凉', description: '消暑甜品', price: '10-15元', mustTry: true, location: '街头小店' },
            { name: '椰子鸡', description: '椰汁+文昌鸡', price: '80-120元/人', mustTry: true, location: '嗲嗲的椰子鸡' },
            { name: '海鲜大餐', description: '现捞现做', price: '100-200元/人', mustTry: true, location: '第一市场' },
            { name: '抱罗粉', description: '海南米粉', price: '15-20元', mustTry: false, location: '抱罗粉店' }
        ],
        accommodations: [
            { name: '亚龙湾五星酒店', area: '亚龙湾', priceRange: '800-2000元', features: ['私人沙滩', '奢华体验'] },
            { name: '三亚湾海景公寓', area: '三亚湾', priceRange: '200-500元', features: ['性价比高', '看日落'] },
            { name: '大东海民宿', area: '大东海', priceRange: '150-350元', features: ['热闹繁华', '俄罗斯风情'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜SPF50+', '泳衣', '浮潜装备'],
            avoid: ['不要在机场坐黑车', '海鲜市场要会砍价', '潜水选正规公司'],
            bestTime: ['11月-次年3月', '避开国庆五一高峰', '5-10月是淡季但可能有台风']
        ]
    },
    '丽江': {
        title: '丽江·柔软时光',
        season: '全年适宜',
        days: '3-5',
        tags: ['古城韵味', '纳西文化', '艳遇之都'],
        atmosphere: '慵懒、文艺、神秘',
        poster: { style: 'vintage', subtitle: '一米阳光的传说' },
        routes: [
            '丽江古城→木府→四方街→狮子山',
            '束河古镇→白沙壁画→玉湖村',
            '玉龙雪山→蓝月谷→印象丽江演出',
            '泸沽湖（2日游）→摩梭人家访'
        ],
        foods: [
            { name: '腊排骨火锅', description: '纳西传统美食', price: '60-100元', mustTry: true, location: '古城阿安' },
            { name: '鸡豆凉粉', description: '清凉解暑', price: '8-12元', mustTry: true, location: '古城小巷' },
            { name: '纳西烤鱼', description: '外焦里嫩', price: '40-60元', mustTry: false, location: '七一街' },
            { name: '水性杨花', description: '泸沽湖特产', price: '30-50元', mustTry: false, location: '泸沽湖边' },
            { name: '酥油茶', description: '藏族风味', price: '10-15元', mustTry: false, location: '藏餐吧' }
        ],
        accommodations: [
            { name: '古城精品客栈', area: '大研古城', priceRange: '200-500元', features: ['纳西庭院', '文艺氛围'] },
            { name: '束河古镇民宿', area: '束河古镇', priceRange: '150-400元', features: ['安静悠闲', '价格实惠'] },
            { name: '雪山观景酒店', area: '玉龙县', priceRange: '300-700元', features: ['看日照金山', '空气清新'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜', '保暖衣物（高原温差大）', '抗高反药'],
            avoid: ['不要在酒吧过度消费', '古城维护费要交', '不要信"免费拍照"'],
            bestTime: ['3-5月鲜花盛开', '9-11月秋高气爽', '冬季人少价低']
        }
    },
    '厦门': {
        title: '厦门·海上花园',
        season: '春秋最佳',
        days: '3-4',
        tags: ['鼓浪屿', '闽南风情', '文艺小资'],
        atmosphere: '清新、浪漫、慢节奏',
        poster: { style: 'fresh', subtitle: '城在海上 海在城中' },
        routes: [
            '鼓浪屿一日游（日光岩→菽庄花园→钢琴博物馆）',
            '厦门大学→南普陀寺→白城沙滩→环岛路',
            '曾厝垵→沙坡尾→猫街→中山路',
            '集美学村→鳌园→老院子（可选）'
        ],
        foods: [
            { name: '沙茶面', description: '浓郁花生酱香', price: '20-35元', mustTry: true, location: '乌糖沙茶面' },
            { name: '海蛎煎', description: '外酥里嫩', price: '15-25元', mustTry: true, location: '莲欢海蛎煎' },
            { name: '土笋冻', description: '勇敢尝试', price: '10-15元', mustTry: false, location: '西门土笋冻' },
            { name: '姜母鸭', description: '滋补美味', price: '60-90元', mustTry: false, location: '好清香' },
            { name: '花生汤', description: '甜润顺滑', price: '8-12元', mustTry: true, location: '黄则和' }
        ],
        accommodations: [
            { name: '鼓浪屿民宿', area: '鼓浪屿', priceRange: '300-800元', features: ['别墅洋房', '海景房'] },
            { name: '曾厝垵客栈', area: '思明区', priceRange: '150-400元', features: ['文艺青年聚集地', '靠近海边'] },
            { name: '中山路酒店', area: '思明区', priceRange: '200-500元', features: ['交通便利', '购物方便'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜', '舒适的鞋子', '学生证'],
            avoid: ['鼓浪屿船票提前买', '不要在岛上买贵重珍珠', '曾厝垵小吃谨慎选择'],
            bestTime: ['3-6月', '9-11月', '避开7-8月台风季']
        }
    },
    '青岛': {
        title: '青岛·啤酒之城',
        season: '夏季最佳',
        days: '3-4',
        tags: ['海滨城市', '德式建筑', '啤酒文化'],
        atmosphere: '清爽、欧式、活力四射',
        poster: { style: 'fresh', subtitle: '红瓦绿树 碧海蓝天' },
        routes: [
            '栈桥→八大关→第二海水浴场→五四广场',
            '崂山一日游（太清宫→仰口→北九水）',
            '德国总督府→天主教教堂→信号山公园',
            '金沙滩→啤酒博物馆→台东步行街'
        ],
        foods: [
            { name: '辣炒蛤蜊', description: '青岛必点', price: '30-50元', mustTry: true, location: '云霄路' },
            { name: '鲅鱼水饺', description: '个大馅足', price: '40-60元', mustTry: true, location: '船歌鱼水饺' },
            { name: '青岛啤酒', description: '原浆扎啤最正宗', price: '10-20元/L', mustTry: true, location: '啤酒屋' },
            { name: '排骨米饭', description: '青岛快餐', price: '20-30元', mustTry: false, location: '万和春' },
            { name: '烤鱿鱼', description: '台东夜市标配', price: '15-25元', mustTry: false, location: '台东夜市' }
        ],
        accommodations: [
            { name: '八大关别墅酒店', area: '市南区', priceRange: '400-900元', features: ['德式建筑', '靠海近'] },
            { name: '五四广场商圈酒店', area: '市北区', priceRange: '250-500元', features: ['CBD中心', '交通便利'] },
            { name: '崂山民宿', area: '崂山区', priceRange: '180-400元', features: ['山海景观', '空气好'] }
        ],
        tips: {
            prepare: ['身份证', '泳衣', '防晒霜', '拖鞋（踩沙滩）'],
            avoid: ['不要在景点买海鲜', '出租车可能绕路', '啤酒节期间房价暴涨'],
            bestTime: ['6-9月游泳旺季', '5月10月气候宜人', '8月啤酒节最热闹']
        ]
    },
    '桂林': {
        title: '桂林·山水甲天下',
        season: '4-10月最佳',
        days: '4-5',
        tags: ['喀斯特地貌', '漓江风光', '民族风情'],
        atmosphere: '秀美、如画、诗意',
        poster: { style: 'vintage', subtitle: '舟行碧波上 人在画中游' },
        routes: [
            '漓江竹筏漂流（兴坪→阳朔）→十里画廊→西街',
            '象鼻山→七星公园→芦笛岩→两江四湖',
            '龙脊梯田（1-2日）→黄洛瑶寨长发村',
            '遇龙河漂流→月亮山→印象刘三姐'
        ],
        foods: [
            { name: '桂林米粉', description: '卤水飘香', price: '10-15元', mustTry: true, location: '崇善米粉' },
            { name: '阳朔啤酒鱼', description: '漓江鱼现杀', price: '60-100元', mustTry: true, location: '谢三姐' },
            { name: '荔浦芋头扣肉', description: '香甜软糯', price: '30-50元', mustTry: false, location: '阳朔农家乐' },
            { name: '恭城油茶', description: '瑶族特色', price: '10-15元', mustTry: false, location: '恭城县城' },
            { name: '马蹄糕', description: '清甜爽口', price: '5-8元', mustTry: false, location: '街头小摊' }
        ],
        accommodations: [
            { name: '阳朔西街客栈', area: '阳朔县', priceRange: '150-400元', features: ['洋人街', '夜生活丰富'] },
            { name: '漓江边度假酒店', area: '阳朔', priceRange: '300-700元', features: ['山水画中睡', '宁静致远'] },
            { name: '桂林市区酒店', area: '秀峰区', priceRange: '200-450元', features: ['交通枢纽', '两江四湖夜景'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜', '驱蚊液', '晕船药（坐船用）'],
            avoid: ['不要坐黑竹筏', '阳朔啤酒鱼要问清楚价格', '龙脊梯田徒步量力而行'],
            bestTime: ['4月映山红', '9-10月秋高气爽', '3-4月烟雨漓江最美']
        }
    },
    '张家界': {
        title: '张家界·阿凡达仙境',
        season: '4-10月最佳',
        days: '3-4',
        tags: ['石英砂岩峰林', '玻璃栈道', '自然奇观'],
        atmosphere: '震撼、险峻、鬼斧神工',
        poster: { style: 'fresh', subtitle: '缩小的仙境 扩大的盆景' },
        routes: [
            '张家界国家森林公园→金鞭溪→袁家界（阿凡达取景地）',
            '天子山→十里画廊→黄石寨',
            '天门山→玻璃栈道→天门洞→999级台阶',
            '大峡谷玻璃桥→黄龙洞→宝峰湖'
        ],
        foods: [
            { name: '三下锅', description: '土家族特色', price: '40-70元', mustTry: true, location: '胡师傅三下锅' },
            { name: '葛根粉', description: '保健食品', price: '10-15元', mustTry: false, location: '景区摊位' },
            { name: '土家腊肉', description: '烟熏风味', price: '50-80元', mustTry: true, location: '土家菜馆' },
            { name: '社饭', description: '野菜糯米饭', price: '15-20元', mustTry: false, location: '武陵源区' },
            { name: '枞菌炖肉', description: '野生菌美味', price: '60-90元', mustTry: false, location: '山里餐馆' }
        ],
        accommodations: [
            { name: '武陵源区酒店', area: '景区门口', priceRange: '200-500元', features: ['进出方便', '餐饮齐全'] },
            { name: '天子山顶客栈', area: '山上', priceRange: '300-600元', features: ['看日出', '避开人流'] },
            { name: '张家界市区酒店', area: '永定区', priceRange: '150-400元', features: ['价格实惠', '交通方便'] }
        ],
        tips: {
            prepare: ['身份证', '防滑鞋（重要！）', '登山杖', '轻便背包'],
            avoid: ['不要坐野马导游的车', '山上物价贵自带干粮', '玻璃栈道恐高者慎入'],
            bestTime: ['4-5月杜鹃花开', '9-10月秋高气爽', '冬天可能封山']
        ]
    },
    '长沙': {
        title: '长沙·娱乐之都',
        season: '春秋最佳',
        days: '2-3',
        tags: ['美食天堂', '不夜城', '湘菜发源地'],
        atmosphere: '热辣、活力、烟火气十足',
        poster: { style: 'fresh', subtitle: '脚都 不夜城 星城' },
        routes: [
            '橘子洲头→岳麓山→岳麓书院→湖南大学',
            '太平街→坡子街→火宫殿→五一广场',
            '湖南省博物馆（马王堆）→烈士公园',
            '世界之窗→海底乐园（可选）'
        ],
        foods: [
            { name: '臭豆腐', description: '闻着臭吃着香', price: '10-15元', mustTry: true, location: '黑色经典' },
            { name: '口味虾', description: '麻辣过瘾', price: '80-150元/份', mustTry: true, location: '文和友' },
            { name: '糖油粑粑', description: '外脆内糯', price: '5-8元', mustTry: true, location: '李公庙' },
            { name: '剁椒鱼头', description: '湘菜代表', price: '60-100元', mustTry: false, location: '坛宗剁椒鱼头' },
            { name: '茶颜悦色', description: '长沙专属奶茶', price: '16-18元', mustTry: true, location: '每条街都有' }
        ],
        accommodations: [
            { name: '五一广场商圈酒店', area: '芙蓉区', priceRange: '250-500元', features: ['市中心', '夜生活丰富'] },
            { name: '橘子洲附近酒店', area: '岳麓区', priceRange: '200-450元', features: ['看烟花', '靠近大学城'] },
            { name: '太平街民宿', area: '天心区', priceRange: '150-350元', features: ['小吃集中', '老街氛围'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '肠胃药（怕辣）', '排队耐心'],
            avoid: ['文和友排队很长', '不要在景区买特产', '晚上很晚才睡觉是常态'],
            bestTime: ['3-5月', '9-11月', '暑假人多但氛围好']
        ]
    },
    '武汉': {
        title: '武汉·九省通衢',
        season: '春秋最佳',
        days: '3-4',
        tags: ['樱花胜地', '江城', '过早文化'],
        atmosphere: '热情、豪爽、江湖气息',
        poster: { style: 'minimal', subtitle: '大江大河大武汉' },
        routes: [
            '武汉大学→东湖樱园→湖北省博物馆→东湖绿道',
            '黄鹤楼→户部巷→长江大桥→武昌江滩',
            '汉口江滩→黎黄陂路→江汉路步行街→汉口租界',
            '归元寺→古琴台→晴川阁→汉阳造创意园'
        ],
        foods: [
            { name: '热干面', description: '芝麻酱香浓郁', price: '6-10元', mustTry: true, location: '蔡林记' },
            { name: '鸭脖', description: '周黑鸭绝味', price: '30-50元/份', mustTry: true, location: '周黑鸭/精武' },
            { name: '豆皮', description: '外皮金黄', price: '8-12元', mustTry: true, location: '老通城' },
            { name: '武昌鱼', description: '清蒸最美', price: '50-80元', mustTry: false, location: '户部巷' },
            { name: '糊汤粉', description: '早餐首选', price: '10-15元', mustTry: false, location: '粮道街' }
        ],
        accommodations: [
            { name: '光谷商圈酒店', area: '洪山区', priceRange: '200-450元', features: ['大学城', '科技园区'] },
            { name: '江汉路步行街酒店', area: '江岸区', priceRange: '250-500元', features: ['百年老街', '江景房'] },
            { name: '武汉大学附近民宿', area: '武昌区', priceRange: '150-350元', features: ['樱花季抢手', '学术氛围'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '雨伞（多雨城市）', '学生证'],
            avoid: ['樱花季人山人海要早起', '户部巷游客价偏高', '轮渡可以刷支付宝'],
            bestTime: ['3-4月樱花季', '9-11月秋高气爽', '夏天很热注意防暑']
        ]
    },
    '南京': {
        title: '南京·六朝古都',
        season: '春秋最佳',
        days: '3-4',
        tags: ['民国风情', '梧桐大道', '历史文化名城'],
        atmosphere: '厚重、儒雅、悲壮与繁华并存',
        poster: { style: 'vintage', subtitle: '江南佳丽地 金陵帝王州' },
        routes: [
            '中山陵→明孝陵→美龄宫→音乐台',
            '总统府→1912街区→夫子庙→秦淮河',
            '玄武湖→鸡鸣寺→城墙→先锋书店',
            '侵华日军遇难同胞纪念馆→雨花台（严肃游览）'
        ],
        foods: [
            { name: '盐水鸭', description: '金陵特产', price: '30-50元/半只', mustTry: true, location: '韩复兴/章云板鸭' },
            { name: '鸭血粉丝汤', description: '鲜美暖胃', price: '15-25元', mustTry: true, location: '回味鸭血粉丝' },
            { name: '小笼包', description: '汤汁鲜美', price: '15-25元', mustTry: false, location: '鸡鸣汤包' },
            { name: '梅花糕', description: '甜糯可口', price: '5-8元', mustTry: false, location: '夫子庙' },
            { name: '活珠子', description: '勇敢者的美食', price: '3-5元', mustTry: false, location: '街头摊贩' }
        ],
        accommodations: [
            { name: '新街口商圈酒店', area: '鼓楼区', priceRange: '300-600元', features: ['中华第一商圈', '地铁枢纽'] },
            { name: '夫子庙秦淮河酒店', area: '秦淮区', priceRange: '250-500元', features: ['秦淮夜景', '文化氛围'] },
            { name: '紫金山民宿', area: '玄武区', priceRange: '200-450元', features: ['环境清幽', '近风景区'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '学生证', '敬畏之心（参观纪念馆）'],
            avoid: ['夫子庙小吃偏贵', '新街口停车困难', '总统府提前预约'],
            bestTime: ['3-5月', '9-11月', '12-2月人少但有萧瑟之美']
        ]
    },
    '苏州': {
        title: '苏州·人间天堂',
        season: '四季皆宜',
        days: '2-3',
        tags: ['古典园林', '江南水乡', '吴侬软语'],
        atmosphere: '精致、婉约、水墨丹青',
        poster: { style: 'vintage', subtitle: '君到姑苏见 人家尽枕河' },
        routes: [
            '拙政园→苏州博物馆→狮子林→平江路',
            '虎丘→寒山寺→山塘街→留园',
            '同里古镇（一日游）→退思园→三桥',
            '周庄/乌镇（二选一）→沈厅→张厅'
        ],
        foods: [
            { name: '松鼠桂鱼', description: '苏帮菜之首', price: '88-138元', mustTry: true, location: '得月楼/松鹤楼' },
            { name: '生煎馒头', description: '底脆汤多', price: '12-20元', mustTry: true, location: '哑巴生煎' },
            { name: '奥灶面', description: '红油爆鱼面', price: '20-30元', mustTry: false, location: '奥灶馆' },
            { name: '桂花糖藕', description: '甜蜜软糯', price: '15-25元', mustTry: false, location: '平江路' },
            { name: '太湖三白', description: '白鱼白虾银鱼', price: '80-150元', mustTry: false, location: '太湖边餐厅' }
        ],
        accommodations: [
            { name: '平江路精品客栈', area: '姑苏区', priceRange: '250-500元', features: ['小桥流水', '枕河而居'] },
            { name: '观前街酒店', area: '姑苏区', priceRange: '200-450元', features: ['百年商街', '交通便利'] },
            { name: '金鸡湖畔酒店', area: '工业园区', priceRange: '300-700元', features: ['现代苏州', '湖景房'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '学生证', '雨具（江南多雨）'],
            avoid: ['拙政园限流要早去', '不要在景区买丝绸', '山塘街夜晚更美'],
            bestTime: ['3-5月', '9-11月', '冬季游人少可细品园林']
        }
    },
    '昆明': {
        title: '昆明·春城',
        season: '全年适宜',
        days: '2-3',
        tags: ['四季如春', '花卉之都', '中转枢纽'],
        atmosphere: '温和、悠闲、多彩',
        poster: { style: 'fresh', subtitle: '天气常如二三月 花枝不断四时春' },
        routes: [
            '翠湖公园→云南大学→陆军讲武堂→圆通山',
            '滇池→西山龙门→海埂大坝（喂红嘴鸥）',
            '石林（一日游）→九乡溶洞',
            '斗南花市→官渡古镇→云南省博'
        ],
        foods: [
            { name: '过桥米线', description: '云南名片', price: '20-40元', mustTry: true, location: '建新园/江氏兄弟' },
            { name: '汽锅鸡', description: '原汁原味', price: '60-100元', mustTry: true, location: '福照楼' },
            { name: '野生菌火锅', description: '鲜美无比（注意别中毒）', price: '80-150元/人', mustTry: true, location: '菌子火锅店' },
            { name: '烧饵块', description: '街头小吃', price: '5-8元', mustTry: false, location: '街头摊' },
            { name: '鲜花饼', description: '伴手礼首选', price: '5-10元/个', mustTry: true, location: '嘉华/潘祥记' }
        ],
        accommodations: [
            { name: '翠湖周边酒店', area: '五华区', priceRange: '200-450元', features: ['市中心', '翠湖美景'] },
            { name: '滇池度假区酒店', area: '西山区', priceRange: '250-550元', features: ['湖景房', '看海鸥'] },
            { name: '官渡古镇民宿', area: '官渡区', priceRange: '150-350元', features: ['古镇风情', '价格实惠'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜（高原）', '外套（温差大）', '肠胃药'],
            avoid: ['野生菌一定要煮熟', '不要在车站坐黑车', '鲜花饼到处都有不必急买'],
            bestTime: ['全年皆宜', '11-次年3月看海鸥', '3-4月赏花']
        }
    },
    '拉萨': {
        title: '拉萨·圣城之光',
        season: '5-10月最佳',
        days: '4-6',
        tags: '["布达拉宫", "宗教圣地", "高原明珠"]',
        atmosphere: '神圣、纯净、震撼心灵',
        poster: { style: 'vintage', subtitle: '离天堂最近的地方' },
        routes: [
            '布达拉宫→大昭寺→八廓街→玛吉阿米',
            '哲蚌寺→色拉寺辩经→罗布林卡',
            '纳木错（一日游）→念青唐古拉山',
            '羊卓雍措→卡若拉冰川→江孜古城'
        ],
        foods: [
            { name: '酥油茶', description: '高原能量饮品', price: '10-15元', mustTry: true, location: '甜茶馆' },
            { name: '糌粑', description: '藏族主食', price: '8-12元', mustTry: false, location: '藏餐厅' },
            { name: '牦牛肉火锅', description: '高原美味', price: '80-120元/人', mustTry: true, location: '吉祥圣雪' },
            { name: '藏面', description: '碱性面条', price: '10-15元', mustTry: false, location: '茶馆' },
            { name: '酸奶', description: '纯天然发酵', price: '5-8元', mustTry: true, location: '街头摊' }
        ],
        accommodations: [
            { name: '布达拉宫附近酒店', area: '城关区', priceRange: '300-700元', features: ['看布宫全景', '朝圣方便'] },
            { name: '大昭寺八廓街客栈', area: '城关区', priceRange: '150-400元', features: ['转经方便', '藏式风情'] },
            { name: '拉萨河谷度假村', area: '郊区', priceRange: '200-500元', features: ['环境清幽', '适应海拔'] }
        ],
        tips: {
            prepare: ['身份证（重要！）', '抗高反药', '防晒霜SPF50+', '保暖衣物', '氧气瓶'],
            avoid: ['第一天不要洗澡', '行动放缓别跑跳', '尊重宗教习俗', '不要随意拍朝拜者'],
            bestTime: ['5-6月', '9-10月', '避开7-8月雨季']
        ]
    },
    '哈尔滨': {
        title: '哈尔滨·冰城',
        season: '冬季最佳（12-2月）',
        days: '3-4',
        tags: ['冰雪大世界', '俄式建筑', '东北风情'],
        atmosphere: '寒冷、热情、异域风情',
        poster: { style: 'fresh', subtitle: '东方莫斯科 东方小巴黎' },
        routes: [
            '中央大街→索菲亚教堂→松花江→防洪纪念塔',
            '冰雪大世界→极地馆→太阳岛雪博会',
            '圣索菲亚教堂内部→犹太新会堂→老道外巴洛克',
            '亚布力滑雪场（一日游）→雪乡（可选）'
        ],
        foods: [
            { name: '锅包肉', description: '酸甜酥脆', price: '38-58元', mustTry: true, location: '老厨家' },
            { name: '马迭尔冰棍', description: '零下20度吃冰棍', price: '5-10元', mustTry: true, location: '中央大街' },
            { name: '红肠', description: '俄式香肠', price: '20-30元/根', mustTry: true, location: '哈肉联/秋林' },
            { name: '铁锅炖', description: '东北硬菜', price: '80-150元', mustTry: false, location: '铁锅炖专门店' },
            { name: '冻梨冻柿子', description: '东北特色水果', price: '5-10元', mustTry: false, location: '街头摊' }
        ],
        accommodations: [
            { name: '中央大街酒店', area: '道里区', priceRange: '250-500元', features: ['步行街', '俄式建筑群'] },
            { name: '冰雪大世界附近', area: '松北区', priceRange: '300-600元', features: ['看冰灯方便', '新城区'] },
            { name: '老道外民宿', area: '道外区', priceRange: '150-350元', features: ['巴洛克建筑', '老哈尔滨味道'] }
        ],
        tips: {
            prepare: ['身份证', '羽绒服（-20°C）', '暖宝宝', '防滑鞋', '帽子手套围巾全套'],
            avoid: ['不要在中央大街买红肠（贵）', '冰雪大世界门票贵做好心理准备', '打车可能被宰'],
            bestTime: ['12-次年2月冰雪季', '1月最冷也最美', '圣诞节元旦春节气氛最好']
        ]
    },
    '敦煌': {
        title: '敦煌·丝路明珠',
        season: '5-10月最佳',
        days: '2-3',
        tags: ['莫高窟', '沙漠奇观', '丝绸之路'],
        atmosphere: '苍茫、神秘、千年守望',
        poster: { style: 'vintage', subtitle: '一眼千年 梦回大唐' },
        routes: [
            '莫高窟（必预约！）→鸣沙山月牙泉→敦煌夜市',
            '榆林窟→锁阳城→雅丹魔鬼城（一日游）',
            '阳关→玉门关→汉长城遗址',
            '西千佛洞→敦煌古城→影视城'
        ],
        foods: [
            { name: '驴肉黄面', description: '敦煌招牌', price: '25-40元', mustTry: true, location: '达记驴肉黄面' },
            { name: '杏皮水', description: '解暑酸甜', price: '5-8元', mustTry: true, location: '街头摊' },
            { name: '羊肉粉汤', description: '早餐暖身', price: '15-20元', mustTry: false, location: '早餐店' },
            { name: '胡羊焖饼', description: '西北风味', price: '50-80元', mustTry: false, location: '沙州夜市' },
            { name: '李广杏', description: '敦煌特产水果', price: '10-20元/斤', mustTry: true, location: '水果摊' }
        ],
        accommodations: [
            { name: '鸣沙山脚下客栈', area: '敦煌市', priceRange: '200-450元', features: ['看日出日落', '沙漠体验'] },
            { name: '敦煌市区酒店', area: '敦煌市', priceRange: '180-380元', features: ['交通便利', '餐饮齐全'] },
            { name: '沙漠露营基地', area: '鸣沙山', priceRange: '150-300元/晚', features: ['星空露营', '篝火晚会'] }
        ],
        tips: {
            prepare: ['身份证', '防晒霜（沙漠反射强）', '围巾（防风沙）', '墨镜', '唇膏'],
            avoid: ['莫高窟门票必须提前一个月网上预约', '沙漠骑骆驼讲好价格', '不要买假玉石'],
            bestTime: ['5-6月', '9-10月', '7-8月很热但瓜果甜']
        ]
    },
    '天津': {
        title: '天津·津门故里',
        season: '春秋最佳',
        days: '2-3',
        tags: ['相声之乡', '欧式建筑', '民间艺术'],
        atmosphere: '幽默、实在、中西合璧',
        poster: { style: 'minimal', subtitle: '九河下梢 三会海口' },
        routes: [
            '意大利风情区→瓷房子→西开教堂→五大道',
            '古文化街→天后宫→意风区→海河',
            '天津之眼→世纪钟→津湾广场',
            '滨海新区→航母主题公园（可选）'
        ],
        foods: [
            { name: '狗不理包子', description: '天津三绝之一', price: '20-40元', mustTry: true, location: '狗不理总店' },
            { name: '煎饼果子', description: '早餐标配', price: '8-12元', mustTry: true, location: '街头摊/南楼煎饼' },
            { name: '麻花', description: '十八街桂发祥', price: '15-25元/盒', mustTry: true, location: '桂发祥' },
            { name: '耳朵眼炸糕', description: '天津三绝', price: '10-15元', mustTry: false, location: '耳朵眼会馆' },
            { name: '崩豆张', description: '传统零食', price: '10-20元', mustTry: false, location: '古文化街' }
        ],
        accommodations: [
            { name: '五大道洋楼酒店', area: '和平区', priceRange: '250-500元', features: ['万国建筑博览', '小洋楼'] },
            { name: '意大利风情区酒店', area: '河北区', priceRange: '200-450元', features: ['欧洲风情', '海河边'] },
            { name: '滨江道商圈酒店', area: '和平区', priceRange: '180-380元', features: ['商业中心', '交通方便'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '听相声的好心情', '胃口（吃吃吃）'],
            avoid: ['狗不理包子本地人不怎么去', '瓷房子门票有点贵', '古文化街工艺品比外面贵'],
            bestTime: ['4-5月', '9-10月', '春节期间有庙会']
        ]
    },
    '大连': {
        title: '大连·北方香港',
        season: '5-10月最佳',
        days: '3-4',
        tags: ['海滨城市', '广场之都', '异域风情'],
        atmosphere: '清爽、浪漫、欧陆风情',
        poster: { style: 'fresh', subtitle: '浪漫之都 时尚大连' },
        routes: [
            '星海广场→星海公园→滨海路→跨海大桥',
            '老虎滩海洋公园→棒棰岛→渔人码头',
            '金石滩→发现王国→地质公园',
            '俄罗斯风情街→日本风情街→中山广场→有轨电车'
        ],
        foods: [
            { name: '海鲜焖子', description: '大连特色', price: '15-25元', mustTry: true, location: '街头摊' },
            { name: '咸鱼饼子', description: '渔民美食', price: '8-12元', mustTry: false, location: '渔港附近' },
            { name: '海胆水饺', description: '鲜美异常', price: '40-60元', mustTry: true, location: '饺子馆' },
            { name: '鲍鱼捞饭', description: '高档享受', price: '80-150元', mustTry: false, location: '海鲜酒楼' },
            { name: '烤鱿鱼', description: '铁板鱿鱼', price: '15-25元', mustTry: false, location: '台湾街' }
        ],
        accommodations: [
            { name: '星海广场酒店', area: '沙河口区', priceRange: '300-650元', features: ['亚洲最大广场', '海景'] },
            { name: '老虎滩附近酒店', area: '中山区', priceRange: '250-500元', features: ['近景区', '海滨浴场'] },
            { name: '俄罗斯风情街客栈', area: '西岗区', priceRange: '150-350元', features: ['异国情调', '价格实惠'] }
        ],
        tips: {
            prepare: ['身份证', '泳衣', '防晒霜', '舒适的鞋子'],
            avoid: ['海鲜市场要会挑', '不要在景区买昂贵纪念品', '有轨电车要体验'],
            bestTime: ['6-9月游泳季', '5月10月气候宜人', '7-8月国际啤酒节']
        ]
    },
    '凤凰古城': {
        title: '凤凰·湘西秘境',
        season: '春秋最佳',
        days: '2-3',
        tags: ['沱江吊脚楼', '苗族风情', '沈从文笔下的边城'],
        atmosphere: '静谧、古朴、时光倒流',
        poster: { style: 'vintage', subtitle: '为了你 这座古城等了千年' },
        routes: [
            '沱江泛舟→虹桥→东门城楼→沈从文故居',
            '南方长城→黄丝桥古城→苗人谷',
            '飞水谷→老家寨→山江苗寨',
            '德夯苗寨（可选）→矮寨大桥'
        ],
        foods: [
            { name: '血粑鸭', description: '湘西名菜', price: '50-80元', mustTry: true, location: '古城饭馆' },
            { name: '酸汤鱼', description: '苗族特色', price: '60-90元', mustTry: true, location: '沱江边餐厅' },
            { name: '姜糖', description: '手工糖果', price: '10-15元', mustTry: false, location: '古城店铺' },
            { name: '社饭', description: '野菜糯米', price: '10-15元', mustTry: false, location: '苗寨' },
            { name: '苗家腊肉', description: '烟熏风味', price: '40-60元', mustTry: false, location: '农家乐' }
        ],
        accommodations: [
            { name: '沱江边吊脚楼客栈', area: '古城内', priceRange: '200-500元', features: ['临江而居', '看夜景'] },
            { name: '虹桥附近民宿', area: '古城内', priceRange: '150-400元', features: ['交通便利', '价格适中'] },
            { name: '沱江下游安静客栈', area: '古城下游', priceRange: '120-300元', features: ['清净', '价格实惠'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '雨伞（湘西多雨）', '尊重苗族风俗'],
            avoid: ['不要坐沱江边的拉客船', '银饰要懂鉴别', '晚上注意安全'],
            bestTime: ['3-4月', '9-11月', '避开黄金周人挤人']
        ]
    },
    '平遥': {
        title: '平遥·活着的古城',
        season: '春秋最佳',
        days: '2-3',
        tags: ['世界文化遗产', '晋商文化', '古城墙'],
        atmosphere: '古朴、厚重、穿越时空',
        poster: { style: 'vintage', subtitle: '保存最完整的明清县城' },
        routes: [
            '古城墙→县衙→日升昌票号→协同庆钱庄',
            '文庙→城隍庙→清虚观→古民居',
            '双林寺（彩塑艺术）→镇国寺',
            '王家大院或乔家大院（一日游）'
        ],
        foods: [
            { name: '平遥牛肉', description: '山西名产', price: '40-60元/斤', mustTry: true, location: '冠云牛肉' },
            { name: '碗托子', description: '荞麦凉粉', price: '5-8元', mustTry: true, location: '街头摊' },
            { name: '栲栳栳', description: '莜面窝窝', price: '10-15元', mustTry: false, location: '面食馆' },
            { name: '过油肉', description: '晋菜代表', price: '30-50元', mustTry: false, location: '饭店' },
            { name: '沙棘汁', description: '山西特产饮料', price: '5-8元', mustTry: false, location: '超市' }
        ],
        accommodations: [
            { name: '古城内客栈', area: '古城内', priceRange: '150-400元', features: ['住进明清大院', '土炕体验'] },
            { name: '古城外酒店', area: '古城外围', priceRange: '120-300元', features: ['价格实惠', '停车方便'] },
            { name: '明清街民宿', area: '南大街', priceRange: '200-450元', features: ['主街位置', '热闹方便'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '学生证', '了解晋商历史的兴趣'],
            avoid: ['古城通票比较值', '不要在景点买牛肉（贵）', '讲解员很有必要'],
            bestTime: ['4-5月', '9-10月', '春节有社火表演']
        ]
    },
    '黄山': {
        title: '黄山·天下第一奇山',
        season: '四季皆宜',
        days: '2-3',
        tags: ['迎客松', '云海日出', '徽派建筑'],
        atmosphere: '雄伟、变幻莫测、仙气飘飘',
        poster: { style: 'fresh', subtitle: '五岳归来不看山 黄山归来不看岳' },
        routes: [
            '云谷寺→始信峰→猴子观海→梦笔生花→北海宾馆',
            '光明顶→鳌鱼峰→一线天→百步云梯→迎客松→玉屏楼',
            '宏村→西递（徽派古村落一日游）',
            '屯溪老街→黎阳in巷→徽州古城'
        ],
        foods: [
            { name: '臭鳜鱼', description: '徽菜代表', price: '60-100元', mustTry: true, location: '屯溪老街' },
            { name: '毛豆腐', description: '长毛的豆腐', price: '15-25元', mustTry: true, location: '宏村' },
            { name: '黄山烧饼', description: '梅干菜扣肉馅', price: '2-3元/个', mustTry: true, location: '每个商店都有' },
            { name: '石鸡', description: '山珍美味', price: '80-120元', mustTry: false, location: '山上餐馆' },
            { name: '葛粉圆子', description: '保健食品', price: '15-20元', mustTry: false, location: '歙县' }
        ],
        accommodations: [
            { name: '山上酒店（看日出）', area: '黄山风景区', priceRange: '800-1500元', features: ['看云海日出', '条件艰苦但值得'] },
            { name: '山下汤口镇酒店', area: '汤口镇', priceRange: '150-400元', features: ['上山出发点', '性价比高'] },
            { name: '宏村民宿', area: '黟县', priceRange: '120-350元', features: ['水墨画中住', '徽派建筑'] }
        ],
        tips: {
            prepare: ['身份证', '登山杖（重要）', '防滑鞋', '轻便背包', '雨衣（山上雨多变）'],
            avoid: ['山上物价很高自带干粮和水', '缆车排队可能很久', '看日出要提前查天气'],
            bestTime: ['3-5月山花烂漫', '9-10月秋高气爽', '冬季雪景壮观但冷']
        ]
    },
    '威海': {
        title: '威海·最干净的海滨城市',
        season: '夏季最佳',
        days: '2-3',
        tags: ['海滨度假', '韩式风情', '宜居城市'],
        atmosphere: '清爽、整洁、悠闲',
        poster: { style: 'fresh', subtitle: '蓝色硅谷 最美海岸线' },
        routes: [
            '刘公岛→甲午战争博物馆→定远舰',
            '幸福公园→威海公园→悦海公园→海源公园',
            '成山头（天尽头）→神龙野生动物园',
            '韩乐坊→韩国商品城→海水浴场'
        ],
        foods: [
            { name: '韩国料理', description: '正宗韩餐', price: '50-100元/人', mustTry: true, location: '韩乐坊' },
            { name: '海鲜大咖', description: '新鲜海货', price: '80-150元', mustTry: true, location: '海鲜市场' },
            { name: '鲅鱼水饺', description: '胶东风味', price: '30-50元', mustTry: false, location: '饺子馆' },
            { name: '无花果', description: '威海特产', price: '10-20元/斤', mustTry: true, location: '果园/市场' },
            { name: '胶东花饽饽', description: '传统面食', price: '5-8元/个', mustTry: false, location: '老字号' }
        ],
        accommodations: [
            { name: '国际海水浴场酒店', area: '高区', priceRange: '300-600元', features: ['沙滩', '看日出'] },
            { name: '威海公园附近', area: '环翠区', priceRange: '200-450元', features: ['沿海公园带', '散步绝佳'] },
            { name: '韩乐坊民宿', area: '经区', priceRange: '150-350元', features: ['韩国风情', '美食集中'] }
        ],
        tips: {
            prepare: ['身份证', '泳衣', '防晒霜', '舒适的鞋子'],
            avoid: ['海鲜要去当地市场买', '刘公岛船票提前订', '7-8月是旺季人多'],
            bestTime: ['6-9月游泳', '5月10月气候宜人', '9月开海海鲜最肥美']
        ]
    },
    '洛阳': {
        title: '洛阳·十三朝古都',
        season: '4月牡丹花会',
        days: '2-3',
        tags: ['龙门石窟', '牡丹花城', '佛教圣地'],
        atmosphere: '庄严、厚重、国色天香',
        poster: { style: 'vintage', subtitle: '若问古今兴废事 请君只看洛阳城' },
        routes: [
            '龙门石窟→白园→香山寺',
            '白马寺→神州牡丹园→洛阳博物馆',
            '老君山（一日游）→鸡冠洞',
            '丽景门→十字街夜市→洛邑古城'
        ],
        foods: [
            { name: '洛阳水席', description: '24道汤菜', price: '50-100元/人', mustTry: true, location: '真不同饭店' },
            { name: '不翻汤', description: '酸辣爽口', price: '10-15元', mustTry: true, location: '老城区' },
            { name: '牡丹饼', description: '花做的点心', price: '5-8元/个', mustTry: false, location: '牡丹园' },
            { name: '糊涂面', description: '地方特色', price: '10-15元', mustTry: false, location: '面馆' },
            { name: '浆面条', description: '发酵面食', price: '8-12元', mustTry: false, location: '早餐摊' }
        ],
        accommodations: [
            { name: '龙门石窟附近酒店', area: '洛龙区', priceRange: '200-450元', features: ['近景区', '看夜景'] },
            { name: '老城区酒店', area: '西工区', priceRange: '150-350元', features: ['美食集中', '交通便利'] },
            { name: '牡丹广场周边', area: '涧西区', priceRange: '180-380元', features: ['商业中心', '地铁通达'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '学生证', '4月去看牡丹'],
            avoid: ['龙门石窟很大预留半天', '水席一个人吃不了点套餐', '老君山需要一整天'],
            bestTime: ['4月中旬牡丹花会', '9-10月秋高气爽', '春节有庙会和灯会']
        ]
    },
    '开封': {
        title: '开封·八朝古都',
        season: '春秋最佳',
        days: '2-3',
        tags: ['清明上河图', '汴梁古城', '菊花之乡'],
        atmosphere: '古朴、热闹、大宋遗风',
        poster: { style: 'vintage', subtitle: '一朝步入画卷 一日梦回千年' },
        routes: [
            '清明上河园→开封府→大相国寺',
            '龙亭公园→天波杨府→中国翰园',
            '开封铁塔→禹王台→繁塔',
            '鼓楼夜市→西司夜市→书店街'
        ],
        foods: [
            { name: '灌汤包', description: '皮薄汤多', price: '15-25元', mustTry: true, location: '第一楼' },
            { name: '鲤鱼焙面', description: '豫菜名菜', price: '60-90元', mustTry: true, location: '豫菜馆' },
            { name: '炒凉粉', description: '开封小吃', price: '8-12元', mustTry: false, location: '夜市' },
            { name: '杏仁茶', description: '甜品饮品', price: '5-8元', mustTry: false, location: '街头摊' },
            { name: '羊肉炕馍', description: '烧烤类', price: '15-25元', mustTry: false, location: '夜市' }
        ],
        accommodations: [
            { name: '清明上河园附近酒店', area: '龙亭区', priceRange: '200-450元', features: ['近景区', '看《东京梦华》演出'] },
            { name: '鼓楼附近酒店', area: '鼓楼区', priceRange: '150-350元', features: ['夜市旁边', '热闹方便'] },
            { name: '包公湖周边', area: '顺河区', priceRange: '180-380元', features: ['风景优美', '价格适中'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '学生证', '好胃口（夜市吃货天堂）'],
            avoid: ['夜市人多注意安全', '清明上河园演出票提前买', '灌汤包要趁热吃小心烫'],
            bestTime: ['4-5月', '9-10月', '10月菊花展']
        ]
    },
    '扬州': {
        title: '扬州·烟花三月下扬州',
        season: '3-5月最佳',
        days: '2-3',
        tags: ['瘦西湖', '早茶文化', '盐商豪宅'],
        atmosphere: '精致、闲适、文人雅士',
        poster: { style: 'fresh', subtitle: '腰缠十万贯 骑鹤上扬州' },
        routes: [
            '瘦西湖→大明寺→汉陵苑→唐城遗址',
            '个园→何园→东关街→古运河',
            '盂城驿（高邮）→镇国寺（一日游）',
            '大明寺→观音山→瘦西湖夜游'
        ],
        foods: [
            { name: '扬州早茶', description: '三丁包子→翡翠烧卖→千层油糕', price: '30-60元/人', mustTry: true, location: '趣园/冶春' },
            { name: '狮子头', description: '淮扬菜代表', price: '38-68元', mustTry: true, location: '福满楼' },
            { name: '扬州炒饭', description: '正宗起源地', price: '20-35元', mustTry: false, location: '每家饭店' },
            { name: '大煮干丝', description: '刀工精湛', price: '25-40元', mustTry: false, location: '富春茶社' },
            { name: '双麻酥饼', description: '传统点心', price: '3-5元/个', mustTry: false, location: '糕团店' }
        ],
        accommodations: [
            { name: '瘦西湖度假村', area: '邗江区', priceRange: '400-900元', features: ['园林酒店', '近瘦西湖'] },
            { name: '东关街民宿', area: '广陵区', priceRange: '180-400元', features: ['老街氛围', '逛吃方便'] },
            { name: '何园附近客栈', area: '广陵区', priceRange: '150-350元', features: ['盐商豪宅旁', '安静'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '好胃口（早茶要吃好）', '学生证'],
            avoid: ['早茶要赶早（6-7点）', '瘦西湖很大预留半天', '东关街小吃可以尝尝'],
            bestTime: ['3-5月最美', '9-10月秋高气爽', '4月上旬清明节前后']
        ]
    },
    '泉州': {
        title: '泉州·半城烟火半城仙',
        season: '秋冬最佳',
        days: '2-3',
        tags: ['世界遗产城市', '海上丝绸之路起点', '众神之城'],
        atmosphere: '包容、多元、信仰浓厚',
        poster: { style: 'vintage', subtitle: '此地古称佛国 满街都是圣人' },
        routes: [
            '开元寺（东西塔）→清净寺→关岳庙',
            '泉州海外交通史博物馆→天后宫→德济门遗址',
            '洛阳桥→蔡襄祠→洛阳桥桥头',
            '西街→钟楼→中山中路→文庙'
        ],
        foods: [
            { name: '面线糊', description: '泉州早餐之王', price: '10-15元', mustTry: true, location: '水门国仔' },
            { name: '土笋冻', description: '勇敢尝试', price: '15-25元', mustTry: true, location: '东石蚝干粥' },
            { name: '烧肉粽', description: '闽南粽子', price: '8-12元', mustTry: false, location: '侯阿婆' },
            { name: '牛肉羹', description: '鲜美开胃', price: '15-25元', mustTry: false, location: '好成财' },
            { name: '炸醋肉', description: '街头小吃', price: '10-15元', mustTry: false, location: '文庙附近' }
        ],
        accommodations: [
            { name: '西街附近民宿', area: '鲤城区', priceRange: '150-350元', features: ['老城区', '逛吃方便'] },
            { name: '开元寺周边酒店', area: '鲤城区', priceRange: '200-450元', features: ['近世遗点', '文化氛围'] },
            { name: '晋江市区酒店', area: '晋江市', priceRange: '180-380元', features: ['价格实惠', '交通方便'] }
        ],
        tips: {
            prepare: ['身份证', '舒适的鞋子', '开放的心态（多种宗教并存）', '好奇心'],
            avoid: ['很多寺庙免费但要点香随缘', '西街商业化但值得逛', '尊重宗教场所礼仪'],
            bestTime: ['10-12月', '1-3月', '避开7-8月台风季和高温']
        ]
    }
};

cityDatabase = EMBEDDED_CITIES;

// 如果扩展城市数据可用，合并到cityDatabase
if (typeof EXPANDED_CITIES !== 'undefined') {
    console.log(`🌍 加载扩展城市数据库: ${Object.keys(EXPANDED_CITIES).length} 个城市`);
    cityDatabase = { ...EMBEDDED_CITIES, ...EXPANDED_CITIES };
    console.log(`📊 城市数据库总计: ${Object.keys(cityDatabase).length} 个城市`);
}

// ==========================================
// Toast通知系统
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// API客户端集成
// ==========================================
async function generateCityGuide(cityName) {
    if (!cityName || !cityName.trim()) {
        showToast('请输入城市名称', 'warning');
        return;
    }

    const normalizedCity = normalizeCityName(cityName.trim());

    // 优先检查扩展城市数据库（627个城市），然后回退到内置数据库
    if (!normalizedCity || (!cityDatabase[normalizedCity] && !EMBEDDED_CITIES[normalizedCity])) {
        showToast(`暂未收录"${cityName}"的数据，敬请期待！`, 'error');
        return;
    }

    try {
        showLoadingState(true);

        // 使用APIClient调用后端API
        let guideData;

        if (typeof APIClient !== 'undefined') {
            try {
                guideData = await APIClient.generateGuide(normalizedCity, {
                    days: selectedDays,
                    travelType: getSelectedTravelType(),
                    budgetRange: getSelectedBudget(),
                    companionType: getSelectedCompanion()
                });

                updateAPIStatus(guideData.source === 'ai' ? 'backend' : 'local');
            } catch (apiError) {
                console.warn('API调用失败，使用本地数据:', apiError.message);
                guideData = generateLocalGuide(normalizedCity);
                updateAPIStatus('local');
            }
        } else {
            guideData = generateLocalGuide(normalizedCity);
            updateAPIStatus('local');
        }

        currentCityData = guideData;

        // 更新搜索统计
        searchStats.totalSearches++;
        searchStats.citySearches[normalizedCity] = (searchStats.citySearches[normalizedCity] || 0) + 1;
        searchStats.lastUpdated = new Date().toISOString();
        saveStatsToStorage();

        // 显示结果
        displayGuideResult(guideData);

        showToast(`成功生成${normalizedCity}旅游攻略！`, 'success');

    } catch (error) {
        console.error('生成攻略失败:', error);
        showToast('生成失败，请稍后重试', 'error');
    } finally {
        showLoadingState(false);
    }
}

function generateLocalGuide(cityName) {
    // 优先使用扩展城市数据库，回退到内置数据库
    const baseData = cityDatabase[cityName] || EMBEDDED_CITIES[cityName];
    if (!baseData) return null;

    const guideData = JSON.parse(JSON.stringify(baseData));

    // 根据天数调整行程
    if (guideData.routes && guideData.routes.length > selectedDays) {
        guideData.routes = guideData.routes.slice(0, selectedDays);
    }

    guideData.generatedAt = new Date().toISOString();
    guideData.source = 'local';

    return guideData;
}

function normalizeCityName(input) {
    if (!input) return '';

    input = input.trim();

    // 直接匹配扩展城市数据库（627个城市）
    if (cityDatabase[input]) return input;

    // 直接匹配内置数据库
    if (EMBEDDED_CITIES[input]) return input;

    // 别名匹配
    for (const [cityName, aliases] of Object.entries(cityAliases)) {
        if (cityName === input) return cityName;

        for (const alias of aliases) {
            if (alias.toLowerCase() === input.toLowerCase()) {
                return cityName;
            }
        }
    }

    // 模糊匹配扩展城市数据库
    for (const cityName of Object.keys(cityDatabase)) {
        if (cityName.includes(input) || input.includes(cityName)) {
            return cityName;
        }
    }

    // 模糊匹配内置数据库
    for (const cityName of Object.keys(EMBEDDED_CITIES)) {
        if (cityName.includes(input) || input.includes(cityName)) {
            return cityName;
        }
    }

    return null;
}

function showLoadingState(show) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.classList.toggle('hidden', !show);
        
        // 更新加载文字中的城市名称
        const loadingCityEl = document.getElementById('loadingCity');
        if (loadingCityEl && currentCityData && currentCityData.title) {
            const cityName = currentCityData.title.split('·')[0];
            loadingCityEl.textContent = cityName;
        }
    }
}

function getSelectedTravelType() {
    const select = document.getElementById('travelType');
    return select ? select.value : 'general';
}

function getSelectedBudget() {
    const select = document.getElementById('budgetRange');
    return select ? select.value : 'medium';
}

function getSelectedCompanion() {
    const select = document.getElementById('companionType');
    return select ? select.value : 'solo';
}

function updateAPIStatus(mode) {
    const indicator = document.getElementById('apiStatusIndicator');
    const dot = document.getElementById('apiStatusDot');
    const text = document.getElementById('apiStatusText');
    
    if (!indicator) return;
    
    if (mode === 'backend') {
        dot.className = 'status-dot backend';
        text.textContent = '后端模式';
    } else {
        dot.className = 'status-dot';
        text.textContent = '本地模式';
    }
}

function displayGuideResult(data) {
    if (!data) {
        console.error('❌ 没有数据可显示');
        showToast('没有找到相关数据', 'error');
        return;
    }

    console.log('📋 显示攻略数据:', data.title);

    // 隐藏首页，显示结果页
    const homePage = document.getElementById('homePage');
    const resultPage = document.getElementById('resultPage');

    if (homePage) homePage.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');

    // 更新结果页标题
    const resultTitle = document.getElementById('resultTitle');
    if (resultTitle) {
        resultTitle.textContent = `${data.title} 旅游攻略`;
    }

    // 获取攻略内容容器
    const guideContent = document.getElementById('guideContent');
    if (!guideContent) {
        console.error('❌ 找不到攻略内容容器');
        return;
    }

    // 生成完整的攻略HTML内容
    let html = `
        <div class="guide-header">
            <h2 class="guide-title">${data.title}</h2>
            <div class="guide-meta">
                <span class="meta-item">📍 ${data.season || '四季皆宜'}</span>
                <span class="meta-item">⏱️ 建议游玩: ${data.days || '3-5'}天</span>
                <span class="meta-item">🏷️ ${data.tags ? data.tags.join(' | ') : ''}</span>
            </div>
            ${data.atmosphere ? `<p class="atmosphere">${data.atmosphere}</p>` : ''}
            ${data.poster && data.poster.subtitle ? `<p class="poster-subtitle">${data.poster.subtitle}</p>` : ''}
        </div>

        <div class="guide-section">
            <h3>🗺️ 推荐路线</h3>
            <div class="routes-list">
                ${data.routes && data.routes.length > 0 ?
                    data.routes.map((route, index) => `
                        <div class="route-item">
                            <span class="route-day">Day ${index + 1}</span>
                            <span class="route-content">${route}</span>
                        </div>
                    `).join('') :
                    '<p class="no-data">暂无路线信息</p>'
                }
            </div>
        </div>

        <div class="guide-section">
            <h3>🍜 美食推荐</h3>
            <div class="foods-grid">
                ${data.foods && data.foods.length > 0 ?
                    data.foods.map(food => `
                        <div class="food-card ${food.mustTry ? 'must-try' : ''}">
                            <div class="food-name">${food.mustTry ? '⭐ ' : ''}${food.name}</div>
                            ${food.description ? `<div class="food-desc">${food.description}</div>` : ''}
                            <div class="food-meta">
                                ${food.price ? `<span class="food-price">💰 ${food.price}</span>` : ''}
                                ${food.location ? `<span class="food-location">📍 ${food.location}</span>` : ''}
                            </div>
                        </div>
                    `).join('') :
                    '<p class="no-data">暂无美食推荐</p>'
                }
            </div>
        </div>

        ${data.accommodations && data.accommodations.length > 0 ? `
        <div class="guide-section">
            <h3>🏨 住宿推荐</h3>
            <div class="accommodations-list">
                ${data.accommodations.map(acc => `
                    <div class="accommodation-card">
                        <div class="acc-name">${acc.name}</div>
                        <div class="acc-meta">
                            <span>📍 ${acc.area || ''}</span>
                            <span>💰 ${acc.priceRange || ''}</span>
                        </div>
                        ${acc.features && acc.features.length > 0 ? `
                            <div class="acc-features">
                                ${acc.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${data.tips ? `
        <div class="guide-section">
            <h3>💡 实用贴士</h3>
            ${data.tips.prepare && data.tips.prepare.length > 0 ? `
                <div class="tips-group">
                    <h4>✅ 必备物品</h4>
                    <ul class="tips-list">
                        ${data.tips.prepare.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${data.tips.avoid && data.tips.avoid.length > 0 ? `
                <div class="tips-group">
                    <h4>⚠️ 注意事项</h4>
                    <ul class="tips-list warning">
                        ${data.tips.avoid.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${data.tips.bestTime && data.tips.bestTime.length > 0 ? `
                <div class="tips-group">
                    <h4>🌟 最佳时间</h4>
                    <ul class="tips-list">
                        ${data.tips.bestTime.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        ` : ''}

        <div class="guide-footer">
            <p class="generated-time">生成时间: ${data.generatedAt ? new Date(data.generatedAt).toLocaleString() : new Date().toLocaleString()}</p>
            <p class="data-source">数据来源: ${data.source === 'ai' ? 'AI智能生成' : '本地数据库'}</p>
        </div>
    `;

    // 更新DOM
    guideContent.innerHTML = html;

    // 滚动到顶部
    resultPage.scrollTop = 0;

    console.log(`✅ 成功显示 "${data.title}" 的旅游攻略`);
}

// ==========================================
// 初始化
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 旅游攻略生成器 v3.0 Enterprise Edition 已加载');
    console.log(`📊 已加载 ${Object.keys(EMBEDDED_CITIES).length} 个内置城市数据`);
    console.log(`🌍 扩展城市数据库: ${Object.keys(cityDatabase).length} 个城市`);

    // 强制隐藏所有AI相关元素（防止动态生成的AI UI）
    forceHideAIElements();

    // 初始化APIClient状态
    if (typeof APIClient !== 'undefined') {
        updateAPIStatus(APIClient.mode);
    }

    // 初始化省份选择功能
    initProvinceSelector();

    // 绑定事件监听器
    bindEventListeners();
});

/**
 * 强制隐藏所有AI相关的UI元素
 */
function forceHideAIElements() {
    const aiSelectors = [
        '.ai-status-bar',
        '.ai-provider-info',
        '.ai-provider-select',
        '.ai-provider-selector',
        '.ai-engine-selector',
        '.ai-generation-status',
        '.ai-label',
        '.ai-enhanced-mode',
        '#aiEnhancedToggle',
        '.ai-toggle',
        '[class*="ai-status"]',
        '[id*="aiStatus"]',
        '[id*="aiProvider"]',
        'select[id*="ai"]',
        'input[id*="aiEnhanced"]'
    ];

    let hiddenCount = 0;

    aiSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                hiddenCount++;
            });
        } catch (e) {
            // 忽略无效选择器
        }
    });

    // 额外检查：隐藏包含"AI引擎"文字的元素
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        const text = el.textContent || '';
        if ((text.includes('AI引擎') || text.includes('AI增强')) &&
            (el.tagName === 'BUTTON' || el.tagName === 'SELECT' || el.classList.contains('ai'))) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            hiddenCount++;
        }
    });

    if (hiddenCount > 0) {
        console.log(`🙈 已强制隐藏 ${hiddenCount} 个AI相关元素`);
    }
}

// 省份城市数据（基于627个城市数据库）
const provinceCityData = {
    '直辖市': ['北京', '上海', '天津', '重庆'],
    '河北省': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
    '山西省': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
    '内蒙古自治区': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒', '阿拉善'],
    '辽宁省': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
    '吉林省': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'],
    '黑龙江省': ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化'],
    '江苏省': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
    '浙江省': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '安徽省': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '宿州', '六安', '亳州', '池州', '宣城'],
    '福建省': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
    '江西省': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
    '山东省': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽'],
    '河南省': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源'],
    '湖北省': ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施'],
    '湖南省': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西'],
    '广东省': ['广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '广西壮族自治区': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
    '海南省': ['海口', '三亚', '三沙', '儋州'],
    '四川省': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山'],
    '贵州省': ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南'],
    '云南省': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '德宏', '怒江', '迪庆'],
    '西藏自治区': ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里'],
    '陕西省': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
    '甘肃省': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '甘南', '临夏'],
    '青海省': ['西宁', '海东'],
    '宁夏回族自治区': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
    '新疆维吾尔自治区': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏柯', '喀什', '和田', '伊犁哈萨克', '塔城地区', '阿勒泰地区', '石河子']
};

/**
 * 初始化省份选择器
 */
function initProvinceSelector() {
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');

    if (!provinceSelect || !citySelect) {
        console.warn('⚠️ 省份选择器元素未找到');
        return;
    }

    // 填充省份下拉列表
    Object.keys(provinceCityData).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    // 监听省份选择变化
    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;

        // 清空城市列表
        citySelect.innerHTML = '<option value="" data-i18n="search.selectCity">选择城市</option>';

        if (selectedProvince && provinceCityData[selectedProvince]) {
            // 启用城市选择器
            citySelect.disabled = false;

            // 填充城市列表
            const cities = provinceCityData[selectedProvince];
            cities.forEach(city => {
                // 只添加在扩展城市数据库中存在的城市
                if (cityDatabase[city]) {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                }
            });

            console.log(`📍 已加载 ${province}: ${cities.filter(c => cityDatabase[c]).length} 个城市`);
        } else {
            // 未选择省份，禁用城市选择器
            citySelect.disabled = true;
        }
    });

    // 监听城市选择变化
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;

        if (selectedCity && cityDatabase[selectedCity]) {
            console.log(`🏙️ 从省份选择器选择城市: ${selectedCity}`);

            // 设置到输入框并生成攻略
            const cityInput = document.getElementById('cityInput');
            if (cityInput) {
                cityInput.value = selectedCity;
                handleSearch();
            }
        }
    });

    console.log('✅ 省份选择器初始化完成');
}

function bindEventListeners() {
    // 生成攻略按钮（修复ID不匹配问题）
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleSearch);
        console.log('✅ 已绑定生成攻略按钮事件');
    }

    // 搜索按钮（兼容旧版本）
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // 回车搜索
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', openAuthModal);
    }
    
    // 关闭认证模态框
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', closeAuthModalFn);
    }
    
    // 认证Tab切换
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', switchAuthTab);
    });
    
    // 社交面板开关
    const socialPanelToggle = document.getElementById('socialPanelToggle');
    if (socialPanelToggle) {
        socialPanelToggle.addEventListener('click', toggleSocialPanel);
    }
    
    const closeSocialPanel = document.getElementById('closeSocialPanel');
    if (closeSocialPanel) {
        closeSocialPanel.addEventListener('click', toggleSocialPanel);
    }
    
    // 评论输入框字数统计
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('input', updateCommentCharCount);
    }

    // 快捷城市按钮点击事件（修复点击无反应问题）
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cityName = this.dataset.city;
            if (cityName) {
                console.log(`🏙️ 点击城市: ${cityName}`);

                // 移除其他按钮的选中状态
                quickBtns.forEach(b => b.classList.remove('selected'));

                // 添加当前按钮的选中状态
                this.classList.add('selected');

                const cityInput = document.getElementById('cityInput');
                if (cityInput) {
                    cityInput.value = cityName;

                    // 添加输入框聚焦动画
                    cityInput.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        cityInput.style.transform = 'scale(1)';
                    }, 150);

                    handleSearch();
                }
            }
        });
    });

    console.log(`✅ 已绑定 ${quickBtns.length} 个快捷城市按钮事件`);

    // 返回首页按钮
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('🏠 返回首页');

            const homePage = document.getElementById('homePage');
            const resultPage = document.getElementById('resultPage');

            if (homePage) homePage.classList.remove('hidden');
            if (resultPage) resultPage.classList.add('hidden');

            // 清空输入框
            const cityInput = document.getElementById('cityInput');
            if (cityInput) cityInput.value = '';

            // 移除快捷按钮的选中状态
            quickBtns.forEach(b => b.classList.remove('selected'));
        });
    }

    // 搜索建议自动补全功能
    initSearchSuggestions();
}

function initSearchSuggestions() {
    const cityInput = document.getElementById('cityInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    if (!cityInput || !suggestionsContainer) {
        console.warn('⚠️ 搜索建议元素未找到');
        return;
    }

    let debounceTimer = null;
    let currentFocus = -1;

    // 输入事件监听（带防抖）
    cityInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        const query = this.value.trim();

        if (query.length < 1) {
            hideSuggestions();
            return;
        }

        // 防抖300ms
        debounceTimer = setTimeout(() => {
            showSearchSuggestions(query);
        }, 300);
    });

    // 键盘导航
    cityInput.addEventListener('keydown', function(e) {
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            setActiveSuggestion(items, currentFocus);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            setActiveSuggestion(items, currentFocus);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                selectSuggestion(items[currentFocus].dataset.city);
            } else {
                handleSearch();
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });

    // 点击外部关闭建议
    document.addEventListener('click', function(e) {
        if (!cityInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            hideSuggestions();
        }
    });

    console.log('✅ 搜索建议功能已初始化');
}

function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    const matches = searchCities(query);

    if (matches.length === 0) {
        hideSuggestions();
        return;
    }

    // 限制显示数量为8个
    const displayMatches = matches.slice(0, 8);

    let html = '';
    displayMatches.forEach((match, index) => {
        const cityData = cityDatabase[match];
        if (cityData) {
            html += `
                <div class="suggestion-item ${index === 0 ? 'active' : ''}" data-city="${match}" data-index="${index}">
                    <span class="suggestion-icon">🏙️</span>
                    <div class="suggestion-text">
                        <div class="suggestion-name">${highlightMatch(match, query)}</div>
                        <div class="suggestion-subtitle">${cityData.title || cityData.season || ''}</div>
                        ${cityData.tags && cityData.tags.length > 0 ? `
                            <div class="suggestion-tags">
                                ${cityData.tags.slice(0, 3).map(tag => `<span class="suggestion-tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    });

    suggestionsContainer.innerHTML = html;
    suggestionsContainer.classList.remove('hidden');

    // 绑定点击事件
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            selectSuggestion(this.dataset.city);
        });

        item.addEventListener('mouseenter', function() {
            setActiveSuggestion(
                suggestionsContainer.querySelectorAll('.suggestion-item'),
                parseInt(this.dataset.index)
            );
        });
    });
}

function searchCities(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // 精确匹配优先
    for (const cityName of Object.keys(cityDatabase)) {
        if (cityName.includes(query) || cityName.toLowerCase().includes(lowerQuery)) {
            results.push(cityName);

            if (results.length >= 20) break; // 限制结果数量
        }
    }

    // 如果精确匹配不足，尝试模糊匹配
    if (results.length < 10) {
        for (const [cityName, cityData] of Object.entries(cityDatabase)) {
            if (results.includes(cityName)) continue;

            // 匹配标签
            if (cityData.tags && cityData.tags.some(tag =>
                tag.toLowerCase().includes(lowerQuery)
            )) {
                results.push(cityName);
                if (results.length >= 15) break;
            }
        }
    }

    return results;
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--primary);">$1</strong>');
}

function setActiveSuggestion(items, index) {
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function selectSuggestion(cityName) {
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.value = cityName;

        // 添加选中动画
        cityInput.style.transform = 'scale(1.02)';
        setTimeout(() => {
            cityInput.style.transform = 'scale(1)';
        }, 150);

        hideSuggestions();
        handleSearch();
    }
}

function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
        suggestionsContainer.innerHTML = '';
    }
}

function handleSearch() {
    const cityInput = document.getElementById('cityInput');
    if (cityInput && cityInput.value.trim()) {
        generateCityGuide(cityInput.value);
    } else {
        showToast('请输入城市名称', 'warning');
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeAuthModalFn() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function switchAuthTab(e) {
    const tabType = e.target.dataset.auth;
    
    // 切换Tab按钮样式
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.auth === tabType);
    });
    
    // 切换表单显示
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('hidden', !form.id.startsWith(tabType));
    });
}

function toggleSocialPanel() {
    const panel = document.getElementById('socialPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

function updateCommentCharCount() {
    const input = document.getElementById('commentInput');
    const countDisplay = document.getElementById('commentCharCount');
    const submitBtn = document.getElementById('submitComment');
    
    if (input && countDisplay) {
        const length = input.value.length;
        countDisplay.textContent = length;
        
        if (submitBtn) {
            submitBtn.disabled = length === 0 || length > 500;
        }
    }
}

// 导出供全局使用
window.generateCityGuide = generateCityGuide;
window.EMBEDDED_CITIES = EMBEDDED_CITIES;