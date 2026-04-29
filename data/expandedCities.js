// ==========================================
// 超大规模城市数据库 - 600个中国主要城市
// 完整的旅游攻略数据
// ==========================================

const EXPANDED_CITIES = {
  // ==================== 直辖市 (4) ====================
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
      { name: '涮羊肉', description: '铜锅炭火，鲜嫩可口', price: '80-150元/人', mustTry: true, location: '东来顺' }
    ]
  },

  // ==================== 省会城市 (27) ====================
  '上海': { title: '上海·魔都风华', season: '春秋最佳', days: '3-5', tags: ['国际都市', '外滩夜景', '海派文化'], poster: { style: 'minimal', subtitle: '东方巴黎的现代魅力' }, routes: ['外滩→南京路→豫园→城隍庙', '陆家嘴→东方明珠→上海中心大厦'], foods: [{ name: '生煎包', price: '15-25元', mustTry: true, location: '小杨生煎' }] },
  
  '天津': { title: '天津·津门故里', season: '春秋最佳', days: '2-3', tags: ['相声之乡', '欧式建筑', '民间艺术'], poster: { style: 'vintage', subtitle: '九河下梢 三会海口' }, routes: ['意大利风情区→瓷房子→五大道', '古文化街→天后宫→意风区→海河'], foods: [{ name: '狗不理包子', price: '20-40元', mustTry: true, location: '狗不理总店' }] },
  
  '重庆': { title: '重庆·山城雾都', season: '春秋最佳', days: '3-4', tags: ['8D魔幻城市', '火锅之都', '网红打卡地'], poster: { style: 'fresh', subtitle: '让导航绝望的城市' }, routes: ['洪崖洞→解放碑→长江索道→来福士', '磁器口→李子坝轻轨穿楼→鹅岭二厂'], foods: [{ name: '重庆火锅', price: '80-130元/人', mustTry: true, location: '佩姐/秦妈' }] },
  
  '成都': { title: '成都·慢生活之旅', season: '四季皆宜', days: '3-5', tags: ['美食之都', '休闲慢游', '大熊猫'], poster: { style: 'fresh', subtitle: '一座来了就不想走的城市' }, routes: ['宽窄巷子→人民公园→春熙路→IFS', '大熊猫繁育研究基地→武侯祠→锦里'], foods: [{ name: '火锅', price: '80-120元/人', mustTry: true, location: '蜀九香/小龙坎' }] },
  
  '广州': { title: '广州·羊城魅力', season: '秋冬最佳', days: '2-3', tags: ['美食天堂', '岭南文化', '商贸中心'], poster: { style: 'fresh', subtitle: '食在广州 第一家' }, routes: ['沙面岛→陈家祠→上下九步行街', '白云山→越秀公园→中山纪念堂'], foods: [{ name: '早茶点心', price: '60-100元/人', mustTry: true, location: '点都德/陶陶居' }] },
  
  '深圳': { title: '深圳·鹏城科技', season: '秋冬最佳', days: '2-3', tags: ['科技创新', '主题公园', '海滨城市'], poster: { style: 'minimal', subtitle: '设计之城 创新之都' }, routes: ['深圳湾公园→人才公园→春笋大厦', '世界之窗→欢乐谷→锦绣中华'], foods: [{ name: '广式烧腊', price: '50-90元', mustTry: true, location: '深井村烧腊' }] },
  
  '杭州': { title: '杭州·人间天堂', season: '春秋最佳', days: '2-4', tags: ['西湖美景', '江南水乡', '茶文化'], poster: { style: 'fresh', subtitle: '上有天堂 下有苏杭' }, routes: ['西湖十景（断桥残雪→雷峰塔→三潭印月）', '灵隐寺→飞来峰→龙井村→九溪十八涧'], foods: [{ name: '西湖醋鱼', price: '60-100元', mustTry: true, location: '楼外楼' }] },
  
  '南京': { title: '南京·六朝古都', season: '春秋最佳', days: '3-4', tags: ['民国风情', '梧桐大道', '历史文化名城'], poster: { style: 'vintage', subtitle: '江南佳丽地 金陵帝王州' }, routes: ['中山陵→明孝陵→美龄宫→音乐台', '总统府→1912街区→夫子庙→秦淮河'], foods: [{ name: '盐水鸭', price: '30-50元/半只', mustTry: true, location: '韩复兴/章云板鸭' }] },
  
  '武汉': { title: '武汉·九省通衢', season: '春秋最佳', days: '3-4', tags: ['樱花胜地', '江城', '过早文化'], poster: { style: 'minimal', subtitle: '大江大河大武汉' }, routes: ['武汉大学→东湖樱园→湖北省博物馆→东湖绿道', '黄鹤楼→户部巷→长江大桥→武昌江滩'], foods: [{ name: '热干面', price: '6-10元', mustTry: true, location: '蔡林记' }] },
  
  '长沙': { title: '长沙·娱乐之都', season: '春秋最佳', days: '2-3', tags: ['美食天堂', '不夜城', '湘菜发源地'], poster: { style: 'fresh', subtitle: '脚都 不夜城 星城' }, routes: ['橘子洲头→岳麓山→岳麓书院→湖南大学', '太平街→坡子街→火宫殿→五一广场'], foods: [{ name: '臭豆腐', price: '10-15元', mustTry: true, location: '黑色经典' }] },
  
  '郑州': { title: '郑州·中原之心', season: '春秋最佳', days: '2-3', tags: ['华夏文明', '交通枢纽', '少林功夫'], poster: { style: 'vintage', subtitle: '天地之中 华夏之源' }, routes: ['河南博物院→二七纪念塔→德化街', '嵩山少林寺→三皇寨→塔林（一日游）'], foods: [{ name: '烩面', price: '15-25元', mustTry: true, location: '合记烩面' }] },
  
  '西安': { title: '西安·千年古都', season: '春秋最佳', days: '3-5', tags: ['兵马俑', '古城墙', '丝绸之路起点'], poster: { style: 'vintage', subtitle: '十三朝古都的辉煌' }, routes: ['兵马俑→华清池→骊山', '古城墙→钟鼓楼→回民街', '大雁塔→大唐芙蓉园→大唐不夜城'], foods: [{ name: '肉夹馍', price: '15-25元', mustTry: true, location: '樊记肉夹馍' }] },
  
  '兰州': { title: '兰州·黄河明珠', season: '夏秋最佳', days: '2-3', tags: ['黄河风情', '牛肉拉面', '丝路重镇'], poster: { style: 'fresh', subtitle: '黄河之滨也很美' }, routes: ['中山桥→白塔山公园→黄河母亲雕像', '甘肃省博物馆→五泉山公园'], foods: [{ name: '牛肉拉面', price: '8-15元', mustTry: true, location: '马子禄/磨沟沿' }] },
  
  '西宁': { title: '西宁·夏都', season: '夏季最佳', days: '2-3', tags: ['青藏门户', '避暑胜地', '多民族文化'], poster: { style: 'minimal', subtitle: '中国夏都 凉爽宜人' }, routes: ['塔尔寺→东关清真大寺', '青海湖→日月山（一日游）'], foods: [{ name: '手抓羊肉', price: '50-80元', mustTry: true, location: '益鑫手抓' }] },
  
  '拉萨': { title: '拉萨·圣城之光', season: '5-10月最佳', days: '4-6', tags: ['布达拉宫', '宗教圣地', '高原明珠'], poster: { style: 'vintage', subtitle: '离天堂最近的地方' }, routes: ['布达拉宫→大昭寺→八廓街→玛吉阿米', '哲蚌寺→色拉寺辩经→罗布林卡'], foods: [{ name: '酥油茶', price: '10-15元', mustTry: true, location: '甜茶馆' }] },
  
  '乌鲁木齐': { title: '乌鲁木齐·亚心之都', season: '夏秋最佳', days: '3-4', tags: ['西域风情', '瓜果之乡', '多民族融合'], poster: { style: 'fresh', subtitle: '亚洲地理中心城市' }, routes: ['新疆国际大巴扎→二道桥清真寺', '天山天池→博格达峰（一日游）'], foods: [{ name: '大盘鸡', price: '68-128元', mustTry: true, location: '小李子血站' }] },
  
  '呼和浩特': { title: '呼和浩特·青城', season: '夏秋最佳', days: '2-3', tags: ['草原文化', '蒙古风情', '乳都'], poster: { style: 'fresh', subtitle: '中国乳都 草原明珠' }, routes: ['大召寺→塞上老街→伊斯兰风情街', '内蒙古博物院→昭君墓'], foods: [{ name: '手把肉', price: '60-100元', mustTry: true, location: '格日勒阿妈' }] },
  
  '银川': { title: '银川·塞上江南', season: '夏秋最佳', days: '2-3', tags: ['西夏文化', '回族风情', '沙漠景观'], poster: { style: 'vintage', subtitle: '塞上江南 鱼米之乡' }, routes: ['西夏王陵→贺兰山岩画→镇北堡西部影城', '沙湖→沙坡头→腾格里沙漠'], foods: [{ name: '手抓羊肉', price: '50-80元', mustTry: true, location: '国强手抓' }] },
  
  '太原': { title: '太原·龙城', season: '春秋最佳', days: '2-3', tags: ['晋商文化', '煤炭之都', '面食之乡'], poster: { style: 'vintage', subtitle: '锦绣太原城 晋商发源地' }, routes: ['晋祠→天龙山石窟→龙山道教石窟', '山西博物院→双塔寺→迎泽公园'], foods: [{ name: '刀削面', price: '15-25元', mustTry: true, location: '顺溜削面' }] },
  
  '石家庄': { title: '石家庄·国际庄', season: '春秋最佳', days: '2-3', tags: ['红色旅游', '医药之都', '交通枢纽'], poster: { style: 'minimal', subtitle: '北方粮仓 红色圣地' }, routes: ['西柏坡纪念馆→中共中央旧址', '正定古城→隆兴寺→荣国府'], foods: [{ name: '驴肉火烧', price: '15-25元', mustTry: true, location: '郝家' }] },
  
  '沈阳': { title: '沈阳·盛京', season: '四季皆宜', days: '2-3', tags: ['清朝发祥地', '工业基地', '东北文化'], poster: { style: 'vintage', subtitle: '一朝发祥地 两代帝王都' }, routes: ['沈阳故宫→张氏帅府→中街步行街', '北陵公园（昭陵）→东陵公园（福陵）'], foods: [{ name: '老边饺子', price: '30-50元', mustTry: true, location: '老边饺子馆' }] },
  
  '长春': { title: '长春·北春城', season: '夏冬两季', days: '2-3', tags: ['电影城', '汽车城', '冰雪之都'], poster: { style: 'fresh', subtitle: '电影之城 汽车摇篮' }, routes: ['伪满皇宫博物院→八大部→人民广场', '长影世纪城→净月潭国家森林公园'], foods: [{ name: '锅包肉', price: '38-58元', mustTry: true, location: '老厨家' }] },
  
  '哈尔滨': { title: '哈尔滨·冰城', season: '冬季最佳（12-2月）', days: '3-4', tags: ['冰雪大世界', '俄式建筑', '东北风情'], poster: { style: 'fresh', subtitle: '东方莫斯科 东方小巴黎' }, routes: ['中央大街→索菲亚教堂→松花江→防洪纪念塔', '冰雪大世界→极地馆→太阳岛雪博会'], foods: [{ name: '锅包肉', price: '38-58元', mustTry: true, location: '老厨家' }] },
  
  '福州': { title: '福州·榕城', season: '春秋最佳', days: '2-3', tags: ['温泉之都', '闽菜发源地', '三坊七巷'], poster: { style: 'fresh', subtitle: '有福之州 有福之人' }, routes: ['三坊七巷→林则徐纪念馆→西湖公园', '鼓山→涌泉寺→摩崖石刻'], foods: [{ name: '佛跳墙', price: '188-388元', mustTry: true, location: '聚春园' }] },
  
  '南昌': { title: '南昌·洪城', season: '春秋最佳', days: '2-3', tags: ['英雄城', '滕王阁', '鄱阳湖'], poster: { style: 'vintage', subtitle: '物华天宝 人杰地灵' }, routes: ['滕王阁→秋水广场→赣江夜景', '八一南昌起义纪念馆→八一起义纪念塔'], foods: [{ name: '南昌拌粉', price: '10-15元', mustTry: true, location: '万方圆' }] },
  
  '合肥': { title: '合肥·庐州', season: '春秋最佳', days: '2-3', tags: ['科教之城', '三国故地', '包公故乡'], poster: { style: 'minimal', subtitle: '三国故地 包拯家乡' }, routes: ['包公园→清风阁→包公墓', '三河古镇（一日游）→庐江'], foods: [{ name: '曹操鸡', price: '48-78元', mustTry: true, location: '逍遥酒家' }] },
  
  '济南': { title: '济南·泉城', season: '春秋最佳', days: '2-3', tags: ['泉水之都', '趵突泉', '大明湖'], poster: { style: 'fresh', subtitle: '家家泉水 户户垂杨' }, routes: ['趵突泉→五龙潭→黑虎泉→护城河', '大明湖→超然楼→曲水亭街'], foods: [{ name: '糖醋鲤鱼', price: '58-88元', mustTry: true, location: '汇泉饭店' }] },
  
  '海口': { title: '海口·椰城', season: '11-次年4月', days: '2-3', tags: ['热带滨海', '椰风海韵', '免税购物'], poster: { style: 'fresh', subtitle: '椰风海韵 美丽海口' }, routes: ['骑楼老街→海口钟楼→人民公园', '假日海滩→观澜湖度假区'], foods: [{ name: '文昌鸡', price: '60-100元', mustTry: true, location: '龙泉人' }] },
  
  '贵阳': { title: '贵阳·林城', season: '春夏秋最佳', days: '2-3', tags: ['避暑之都', '酸辣美食', '喀斯特地貌'], poster: { style: 'fresh', subtitle: '中国避暑之都 多彩贵州' }, routes: ['甲秀楼→黔灵山公园→弘福寺', '青岩古镇→天河潭（一日游）'], foods: [{ name: '酸汤鱼', price: '60-100元', mustTry: true, location: '亮欢寨' }] },
  
  '昆明': { title: '昆明·春城', season: '全年适宜', days: '2-3', tags: ['四季如春', '花卉之都', '中转枢纽'], poster: { style: 'fresh', subtitle: '天气常如二三月 花枝不断四时春' }, routes: ['翠湖公园→云南大学→陆军讲武堂→圆通山', '滇池→西山龙门→海埂大坝（喂红嘴鸥）'], foods: [{ name: '过桥米线', price: '20-40元', mustTry: true, location: '建新园/江氏兄弟' }] },

  // ==================== 重要地级市 (120个) ====================
  
  // === 华东地区 ===
  '苏州': { title: '苏州·人间天堂', season: '四季皆宜', days: '2-3', tags: ['古典园林', '江南水乡', '吴侬软语'], poster: { style: 'vintage', subtitle: '君到姑苏见 人家尽枕河' }, routes: ['拙政园→苏州博物馆→狮子林→平江路', '虎丘→寒山寺→山塘街→留园'], foods: [{ name: '松鼠桂鱼', price: '88-138元', mustTry: true, location: '得月楼' }] },
  
  '无锡': { title: '无锡·太湖明珠', season: '春秋最佳', days: '2-3', tags: ['太湖风光', '鼋头渚', '影视基地'], poster: { style: 'fresh', subtitle: '太湖佳绝处 毕竟在无锡' }, routes: ['鼋头渚→太湖仙岛→三山岛', '灵山大佛→拈花湾小镇'], foods: [{ name: '酱排骨', price: '35-55元', mustTry: true, location: '三凤桥' }] },
  
  '宁波': { title: '宁波·甬城', season: '春秋最佳', days: '2-3', tags: ['港口城市', '海鲜美食', '书藏古今'], poster: { style: 'minimal', subtitle: '书藏古今 港通天下' }, routes: ['天一阁→月湖公园→鼓楼', '东钱湖→南宋石刻公园'], foods: [{ name: '汤圆', price: '15-25元', mustTry: true, location: '缸鸭狗' }] },
  
  '温州': { title: '温州·鹿城', season: '四季皆宜', days: '2-3', tags: ['民营经济', '山水奇秀', '瓯越文化'], poster: { style: 'fresh', subtitle: '东南山水甲天下' }, routes: ['雁荡山→大龙湫→灵峰景区', '楠溪江→永嘉书院→丽水街'], foods: [{ name: '鱼丸', price: '20-30元', mustTry: true, location: '县前头' }] },
  
  '嘉兴': { title: '嘉兴·禾城', season: '春夏最佳', days: '2天', tags: ['南湖红船', '乌镇古镇', '粽子之乡'], poster: { style: 'vintage', subtitle: '烟雨江南 水乡嘉兴' }, routes: ['南湖景区→中共一大会址→月河历史街区', '乌镇东西栅（一日游）→西塘'], foods: [{ name: '嘉兴粽子', price: '10-20元', mustTry: true, location: '五芳斋' }] },
  
  '绍兴': { title: '绍兴·越州', season: '春秋最佳', days: '2-3', tags: ['鲁迅故乡', '黄酒文化', '水乡桥乡'], poster: { style: 'vintage', subtitle: '鉴湖水清 绍兴酒醇' }, routes: ['鲁迅故居→沈园→周恩来祖居', '东湖→兰亭→柯岩'], foods: [{ name: '茴香豆', price: '10-15元', mustTry: true, location: '咸亨酒店' }] },
  
  '湖州': { title: '湖州·菰城', season: '四季皆宜', days: '2天', tags: ['太湖之滨', '丝绸之府', '茶文化'], poster: { style: 'fresh', subtitle: '太湖明珠 丝绸之府' }, routes: ['南浔古镇→小莲庄→百间楼', '莫干山→庾村→裸心谷'], foods: [{ name: '太湖蟹', price: '50-80元/只', mustTry: true, location: '太湖边' }] },
  
  '金华': { title: '金华·婺州', season: '春秋最佳', days: '2-3', tags: ['金华火腿', '横店影视城', '婺州文化'], poster: { style: 'vintage', subtitle: '婺州古城 影视之都' }, routes: ['横店影视城（秦王宫/明清宫苑/梦幻谷）', '双龙洞→金华山'], foods: [{ name: '金华火腿', price: '50-100元/斤', mustTry: true, location: '金字' }] },
  
  '台州': { title: '台州·山海水城', season: '春夏最佳', days: '2-3', tags: ['天台山', '神仙居', '海鲜美食'], poster: { style: 'fresh', subtitle: '佛宗道源 山海水城' }, routes: ['天台山→国清寺→石梁飞瀑', '神仙居→皤滩古镇→高迁古民居'], foods: [{ name: '嵌糕', price: '10-15元', mustTry: true, location: '临海' }] },
  
  '丽水': { title: '丽水·浙江绿谷', season: '全年适宜', days: '2-3', tags: ['绿水青山', '畲族风情', '摄影天堂'], poster: { style: 'fresh', subtitle: '浙江绿谷 秀山丽水' }, routes: ['缙云仙都→鼎湖峰→朱潭山', '古堰画乡→通济堰→大港头'], foods: [{ name: '缙云烧饼', price: '8-12元', mustTry: true, location: '缙云' }] },
  
  '黄山': { title: '黄山·天下第一奇山', season: '四季皆宜', days: '2-3', tags: ['迎客松', '云海日出', '徽派建筑'], poster: { style: 'fresh', subtitle: '五岳归来不看山 黄山归来不看岳' }, routes: ['云谷寺→始信峰→猴子观海→梦笔生花→北海宾馆', '光明顶→鳌鱼峰→一线天→百步云梯→迎客松→玉屏楼'], foods: [{ name: '臭鳜鱼', price: '60-100元', mustTry: true, location: '屯溪老街' }] },
  
  '安庆': { title: '安庆·宜城', season: '春秋最佳', days: '2天', tags: ['黄梅戏', '天柱山', '桐城派'], poster: { style: 'vintage', subtitle: '文化名城 宜人之都' }, routes: ['天柱山→山谷流泉→炼丹湖', '迎江寺→振风塔→菱湖公园'], foods: [{ name: '胡玉美蚕豆酱', price: '10-15元', mustTry: true, location: '超市' }] },
  
  '泉州': { title: '泉州·半城烟火半城仙', season: '秋冬最佳', days: '2-3', tags: ['世界遗产', '海上丝绸之路起点', '众神之城'], poster: { style: 'vintage', subtitle: '此地古称佛国 满街都是圣人' }, routes: ['开元寺（东西塔）→清净寺→关岳庙', '泉州海外交通史博物馆→天后宫→德济门遗址'], foods: [{ name: '面线糊', price: '10-15元', mustTry: true, location: '水门国仔' }] },
  
  '厦门': { title: '厦门·海上花园', season: '春秋最佳', days: '3-4', tags: ['鼓浪屿', '闽南风情', '文艺小资'], poster: { style: 'fresh', subtitle: '城在海上 海在城中' }, routes: ['鼓浪屿一日游（日光岩→菽庄花园→钢琴博物馆）', '厦门大学→南普陀寺→白城沙滩→环岛路'], foods: [{ name: '沙茶面', price: '20-35元', mustTry: true, location: '乌糖沙茶面' }] },
  
  '漳州': { title: '漳州·水仙花之乡', season: '全年适宜', days: '2-3', tags: ['土楼群', '海峡两岸', '闽南文化'], poster: { style: 'fresh', subtitle: '闽南金三角 花果鱼米乡' }, routes: ['南靖土楼（四菜一汤）→云水谣古镇', '东山岛→风动石→马銮湾'], foods: [{ name: '卤面', price: '10-15元', mustTry: true, location: '阿芬' }] },
  
  '九江': { title: '九江·浔阳城', season: '春夏最佳', days: '2-3', tags: ['庐山', '鄱阳湖', '浔阳楼'], poster: { style: 'vintage', subtitle: '匡庐奇秀甲天下' }, routes: ['庐山（牯岭镇→花径→锦绣谷→仙人洞→含鄱口→五老峰→三叠泉）', '浔阳楼→琵琶亭→烟水亭'], foods: [{ name: '庐山三石', price: '30-50元', mustTry: true, location: '庐山' }] },
  
  '赣州': { title: '赣州·客家摇篮', season: '春秋最佳', days: '2-3', tags: ['客家文化', '宋城', '脐橙之乡'], poster: { style: 'fresh', subtitle: '客家摇篮 宋城赣州' }, routes: ['通天岩→古城墙→八境台→郁孤台', '瑞金（红色故都）→叶坪旧址'], foods: [{ name: '赣州脐橙', price: '8-15元/斤', mustTry: true, location: '果园' }] },
  
  '景德镇': { title: '景德镇·瓷都', season: '春秋最佳', days: '2-3', tags: ['陶瓷之都', '千年窑火', '艺术天堂'], poster: { style: 'minimal', subtitle: '千年瓷都 世界瓷都' }, routes: ['古窑民俗博览区→陶瓷博物馆→御窑厂遗址', '雕塑瓷厂→陶溪川文创街区→三宝村'], foods: [{ name: '冷粉', price: '8-12元', mustTry: true, location: '抚州弄' }] },
  
  '烟台': { title: '烟台·仙境海岸', season: '夏秋最佳', days: '2-3', tags: ['海滨度假', '葡萄酒之乡', '蓬莱仙境'], poster: { style: 'fresh', subtitle: '人间仙境 最美海岸' }, routes: ['蓬莱阁→八仙过海景区→三仙山', '烟台山→月亮湾→东炮台→渔人码头'], foods: [{ name: '蓬莱小面', price: '10-15元', mustTry: true, location: '蓬莱' }] },
  
  '青岛': { title: '青岛·啤酒之城', season: '夏季最佳', days: '3-4', tags: ['海滨城市', '德式建筑', '啤酒文化'], poster: { style: 'fresh', subtitle: '红瓦绿树 碧海蓝天' }, routes: ['栈桥→八大关→第二海水浴场→五四广场', '崂山一日游（太清宫→仰口→北九水）'], foods: [{ name: '辣炒蛤蜊', price: '30-50元', mustTry: true, location: '云霄路' }] },
  
  '威海': { title: '威海·最干净的海滨城市', season: '夏季最佳', days: '2-3', tags: ['海滨度假', '韩式风情', '宜居城市'], poster: { style: 'fresh', subtitle: '蓝色硅谷 最美海岸线' }, routes: ['刘公岛→甲午战争博物馆→定远舰', '幸福公园→悦海公园→海源公园'], foods: [{ name: '韩国料理', price: '50-100元/人', mustTry: true, location: '韩乐坊' }] },
  
  '潍坊': { title: '潍坊·鸢都', season: '春季最佳（4月风筝节）', days: '2天', tags: ['风筝之都', '年画之乡', '蔬菜之乡'], poster: { style: 'fresh', subtitle: '世界风筝都 潍坊欢迎您' }, routes: ['潍坊世界风筝博物馆→风筝广场→杨家埠民间艺术大观园', '十笏园→郑板桥纪念馆→青州古城'], foods: [{ name: '朝天锅', price: '30-50元', mustTry: true, location: '老潍县' }] },
  
  '淄博': { title: '淄博·齐国故都', season: '春秋最佳', days: '2-3', tags: ['齐文化', '烧烤之城', '陶瓷琉璃'], poster: { style: 'vintage', subtitle: '齐国故都 烧烤圣地' }, routes: ['齐国故城遗址博物馆→管仲纪念馆→殉马坑', '蒲松龄故居→聊斋城→周村古商城'], foods: [{ name: '淄博烧烤', price: '50-80元/人', mustTry: true, location: '牧羊村/小寒羊' }] },
  
  '泰安': { title: '泰安·国泰民安', season: '春夏秋最佳', days: '1-2', tags: ['泰山', '五岳独尊', '封禅之地'], poster: { style: 'vintage', subtitle: '五岳独尊 泰山安则四海安' }, routes: ['泰山（红门→中天门→十八盘→南天门→玉皇顶→日观峰）', '岱庙→普照寺→冯玉祥墓'], foods: [{ name: '泰山豆腐宴', price: '50-80元/人', mustTry: true, location: '泰山脚下' }] },
  
  '济宁': { title: '济宁·孔孟之乡', season: '春秋最佳', days: '2-3', tags: ['儒家文化', '孔府孔庙', '运河之都'], poster: { style: 'vintage', subtitle: '孔孟之乡 礼仪之邦' }, routes: ['孔庙→孔府→孔林（三孔）', '微山湖→铁道游击队纪念馆'], foods: [{ name: '孔府宴', price: '200-500元/桌', mustTry: true, location: '孔府' }] },
  
  '临沂': { title: '临沂·琅琊', season: '春秋最佳', days: '2-3', tags: ['沂蒙山区', '书法之乡', '物流之都'], poster: { style: 'fresh', subtitle: '沂蒙精神 书圣故里' }, routes: ['沂蒙山龟蒙景区→云蒙景区', '王羲之故居→银雀山汉墓竹简博物馆'], foods: [{ name: '煎饼', price: '3-5元', mustTry: true, location: '沂蒙山区' }] },
  
  '洛阳': { title: '洛阳·十三朝古都', season: '4月牡丹花会', days: '2-3', tags: ['龙门石窟', '牡丹花城', '佛教圣地'], poster: { style: 'vintage', subtitle: '若问古今兴废事 请君只看洛阳城' }, routes: ['龙门石窟→白园→香山寺', '白马寺→神州牡丹园→洛阳博物馆'], foods: [{ name: '洛阳水席', price: '50-100元/人', mustTry: true, location: '真不同饭店' }] },
  
  '开封': { title: '开封·汴梁古城', season: '春秋最佳', days: '2-3', tags: ['清明上河图', '汴梁古城', '菊花之乡'], poster: { style: 'vintage', subtitle: '一朝步入画卷 一日梦回千年' }, routes: ['清明上河园→开封府→大相国寺', '龙亭公园→天波杨府→中国翰园'], foods: [{ name: '灌汤包', price: '15-25元', mustTry: true, location: '第一楼' }] },
  
  '南阳': { title: '南阳·宛城', season: '春秋最佳', days: '2-3', tags: ['医圣故里', '诸葛亮躬耕地', '恐龙蛋之乡'], poster: { style: 'fresh', subtitle: '医圣故里 智圣家乡' }, routes: ['医圣祠→卧龙岗（武侯祠）→汉画馆', '内乡县衙→宝天曼自然保护区'], foods: [{ name: '牛肉汤', price: '15-25元', mustTry: true, location: '方城' }] },
  
  '新乡': { title: '新乡·牧野', season: '四季皆宜', days: '2天', tags: ['太行山南麓', '比干故里', '郭亮村挂壁公路'], poster: { style: 'fresh', subtitle: '太行之魂 牧野新乡' }, routes: ['八里沟→回龙天界→天界山', '郭亮村→挂壁公路→昆山挂壁公路'], foods: [{ name: '原阳大米', price: '5-8元/斤', mustTry: true, location: '原阳' }] },
  
  '安阳': { title: '安阳·殷商古都', season: '春秋最佳', days: '2-3', tags: ['殷墟', '甲骨文', '红旗渠'], poster: { style: 'vintage', subtitle: '甲骨文的故乡 中华文明的源头' }, routes: ['殷墟宫殿宗庙遗址→殷墟王陵遗址→殷墟博物馆', '红旗渠→青年洞→络丝潭'], foods: [{ name: '扁粉菜', price: '8-12元', mustTry: true, location: '安阳县' }] },
  
  '许昌': { title: '许昌·莲城', season: '春秋最佳', days: '2天', tags: ['曹魏故都', '钧瓷之乡', '花木之乡'], poster: { style: 'vintage', subtitle: '曹魏故都 莲城许昌' }, routes: ['曹丞相府→春秋楼→灞陵桥→神垕古镇', '鄢陵花博园→禹州钧官窑址'], foods: [{ name: '禹州焖子', price: '10-15元', mustTry: true, location: '禹州' }] },
  
  '漯河': { title: '漯河·食品名城', season: '春秋最佳', days: '1-2天', tags: ['双汇火腿', '南街村', '贾湖遗址'], poster: { style: 'minimal', subtitle: '食品名城 字圣故里' }, routes: ['南街村→临颍县→小商桥', '许慎文化园→贾湖遗址→沙澧河风景区'], foods: [{ name: '北舞渡牛肉', price: '50-80元', mustTry: true, location: '北舞渡' }] },
  
  '三门峡': { title: '三门峡·天鹅之城', season: '冬季（看天鹅）', days: '2天', tags: ['天鹅湖', '函谷关', '陕州地坑院'], poster: { style: 'fresh', subtitle: '黄河明珠 天鹅之城' }, routes: ['三门峡大坝→黄河公园→天鹅湖国家城市湿地公园', '陕州地坑院→函谷关历史文化旅游区'], foods: [{ name: '灵宝苹果', price: '5-10元/斤', mustTry: true, location: '灵宝' }] },
  
  '平顶山': { title: '平顶山·鹰城', season: '春秋最佳', days: '2天', tags: ['尧山', '温泉', '汝瓷'], poster: { style: 'fresh', subtitle: '鹰城古韵 尧山胜境' }, routes: ['尧山（石人山）→画眉谷→好运谷', '中原大佛→香山寺→风穴寺'], foods: [{ name: '郏县饸饹面', price: '10-15元', mustTry: true, location: '郏县' }] },
  
  '商丘': { title: '商丘·归德', season: '春秋最佳', days: '2天', tags: ['商祖故里', '火神台', '芒砀山'], poster: { style: 'vintage', subtitle: '华商之源 火神故里' }, routes: ['商丘古城→阏伯台→燧皇陵→商祖祠', '芒砀山→汉高祖斩蛇处→陈胜墓→夫子山'], foods: [{ name: '垛子羊肉', price: '40-70元', mustTry: true, location: '夏邑' }] },
  
  '信阳': { title: '信阳·申城', season: '春夏最佳', days: '2-3', tags: ['毛尖茶', '鸡公山', '南湾湖'], poster: { style: 'fresh', subtitle: '北国江南 茶都信阳' }, routes: ['鸡公山→波尔登森林公园→桃花寨', '南湾湖→贤岭→灵山寺'], foods: [{ name: '信阳毛尖', price: '100-500元/斤', mustTry: true, location: '浉河区' }] },
  
  '驻马店': { title: '驻马店·天中', season: '春秋最佳', days: '2天', tags: ['嵖岈山', '南海禅寺', '梁祝故里'], poster: { style: 'fresh', subtitle: '天中之城 嵯岈仙境' }, routes: ['嵖岈山（《西游记》取景地）→南海禅寺→《西游记》拍摄地', '梁祝故里→梁山伯与祝英台墓→梁山伯墓'], foods: [{ name: '确山凉粉', price: '8-12元', mustTry: true, location: '确山' }] },
  
  '周口': { title: '周口·陈州', season: '春秋最佳', days: '2天', tags: ['老子故里', '伏羲太昊陵', '淮阳龙湖'], poster: { style: 'vintage', subtitle: '华夏先驱 九州圣迹' }, routes: ['太昊陵→龙湖→弦歌台→画卦台', '老子故里（鹿邑）→明道宫→升仙台'], foods: [{ name: '逍遥镇胡辣汤', price: '6-10元', mustTry: true, location: '西华' }] },
  
  '焦作': { title: '焦作·山阳', seasons: '夏秋最佳', days: '2-3', tags: ['云台山', '太极拳发源地', '四大怀药'], poster: { style: 'fresh', subtitle: '太极故里 山水焦作' }, routes: ['云台山（红石峡→潭瀑峡→猕猴谷→茱萸峰→子房湖→百家岩）', '青天河→靳家岭→月山寺'], foods: [{ name: '武陟油茶', price: '8-12元', mustTry: true, location: '武陟' }] },
  
  '濮阳': { title: '濮阳·龙都', season: '春秋最佳', days: '1-2天', tags: ['中华龙乡', '杂技之乡', '石油之城'], poster: { style: 'fresh', subtitle: '中华龙乡 杂技之都' }, routes: ['戚城文物景区→仓颉陵→子路墓祠', '单拐革命旧址→冀鲁豫边区革命根据地旧址'], foods: [{ name: '裹凉皮', price: '5-8元', mustTry: true, location: '市区' }] },

  // === 华中地区 ===
  '宜昌': { title: '宜昌·三峡门户', season: '春秋最佳', days: '2-3', tags: ['长江三峡', '葛洲坝', '屈原故里'], poster: { style: 'fresh', subtitle: '水电之都 三峡门户' }, routes: ['三峡大坝→坛子岭→185平台→截流纪念园→升船机', '三峡人家→龙进溪'], foods: [{ name: '凉虾', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '襄阳': { title: '襄阳·襄阳城', season: '春秋最佳', days: '2-3', tags: ['三国文化', '襄阳古城', '隆中对'], poster: { style: 'vintage', subtitle: '华夏第一城池 汉水中游' }, routes: ['襄阳古城墙→夫人城→仲宣楼→米公祠→襄阳博物馆', '古隆中（诸葛亮隐居地）→草庐'], foods: [{ name: '襄阳牛肉面', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '十堰': { title: '十堰·车城', season: '春秋最佳', days: '2-3', tags: ['武当山', '丹江口水库', '汽车城'], poster: { style: 'vintage', subtitle: '仙山武当 武当问道' }, routes: ['武当山（太子坡→紫霄宫→南岩宫→金顶→龙头香）', '丹江口水库→沧浪海'], foods: [{ name: '武当道斋', price: '30-50元/人', mustTry: true, location: '武当山' }] },
  
  '荆州': { title: '荆州·江陵', season: '春秋最佳', days: '2天', tags: ['荆州古城', '三国文化', '楚文化'], poster: { style: 'vintage', subtitle: '大意失荆州 三国风云地' }, routes: ['荆州古城墙→宾阳楼→关帝庙→张居正故居', '荆州博物馆→楚王车马阵→熊家冢'], foods: [{ name: '鱼糕', price: '20-30元', mustTry: true, location: '市区' }] },
  
  '黄石': { title: '黄石·矿冶之都', season: '春秋最佳', days: '2天', tags: ['矿冶文化', '磁湖', '东方山'], poster: { style: 'minimal', subtitle: '矿冶之都 青铜故里' }, routes: ['黄石国家矿山公园→铜绿山古铜矿遗址', '磁湖风景区→团城山公园'], foods: [{ name: '黄石港饼', price: '5-8元', mustTry: true, location: '港区' }] },
  
  '株洲': { title: '株洲·火车拉来的城市', season: '春秋最佳', days: '2天', tags: ['工业城市','炎帝陵','醴陵瓷城'], poster: { style: 'fresh', subtitle: '炎帝神农 瓷城株洲' }, routes: ['炎帝陵→炎帝广场→神农公园', '醴陵瓷器口→渌江书院'], foods: [{ name: '醴陵炒粉', price: '10-15元', mustTry: true, location: '醴陵' }] },
  
  '湘潭': { title: '湘潭·莲城', season: '春秋最佳', days: '2天', tags: ['毛泽东故乡','韶山','莲城'], poster: { style: 'vintage', subtitle: '伟人故里 红色湘潭' }, routes: ['韶山毛泽东同志故居→毛泽东铜像广场→毛泽东纪念馆→滴水洞', '彭德怀纪念馆→乌石峰'], foods: [{ name: '毛氏红烧肉', price: '38-58元', mustTry: true, location: '韶山' }] },
  
  '衡阳': { title: '衡阳·雁城', season: '春秋最佳', days: '2-3', tags: ['南岳衡山','抗战名城','蔡伦故里'], poster: { style: 'fresh', subtitle: '寿岳衡山 雁城衡阳' }, routes: ['南岳衡山（祝融峰→藏经殿→南台寺→磨镜台→忠烈祠）', '石鼓书院→回雁峰→衡阳保卫战纪念馆'], foods: [{ name: '衡阳鱼粉', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '岳阳': { title: '岳阳·巴陵', season: '春夏秋最佳', days: '2天', tags: ['洞庭湖','岳阳楼','君山岛'], poster: { style: 'vintage', subtitle: '洞庭天下水 岳阳天下楼' }, routes: ['岳阳楼→洞庭湖→君山岛→君山野生荷花世界', '屈子祠→汨罗江→屈子祠'], foods: [{ name: '岳阳烧烤', price: '30-50元/人', mustTry: true, location: '市区' }] },
  
  '常德': { title: '常德·柳城', season: '春秋最佳', days: '2天', tags: ['桃花源','柳叶湖','常德米粉'], poster: { style: 'fresh', subtitle: '桃花源里 世外桃源' }, routes: ['桃花源（桃花山→桃源山→秦人村→桃仙岭）', '柳叶湖→德国风情街→诗墙'], foods: [{ name: '常德米粉', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '张家界': { title: '张家界·阿凡达仙境', season: '4-10月最佳', days: '3-4', tags: ['石英砂岩峰林','玻璃栈道','自然奇观'], poster: { style: 'fresh', subtitle: '缩小的仙境 扩大的盆景' }, routes: ['张家界国家森林公园→金鞭溪→袁家界（阿凡达取景地）', '天子山→十里画廊→黄石寨'], foods: [{ name: '三下锅', price: '40-70元', mustTry: true, location: '胡师傅' }] },
  
  '益阳': { title: '益阳·银城', season: '春秋最佳', days: '2天', tags: ['洞庭湖畔','黑茶之乡','周立波故里'], poster: { style: 'fresh', subtitle: '洞庭明珠 黑茶之乡' }, routes: ['安化黑茶博物馆→中国黑茶博物馆→云台山', '周立波故居→山乡巨变第一村'], foods: [{ name: '安化黑茶', price: '100-500元/斤', mustTry: true, location: '安化' }] },
  
  '娄底': { title: '娄底·星城', season: '春秋最佳', days: '2天', tags: ['曾国藩故里','紫鹊界梯田','梅山龙宫'], poster: { style: 'fresh', subtitle: '湘军故里 梅山龙城' }, routes: ['曾国藩故居→富厚堂→白玉堂→黄金堂', '紫鹊界梯田→正龙古村'], foods: [{ name: '新化牛肉面', price: '10-15元', mustTry: true, location: '新化' }] },
  
  '湘西州(吉首)': { title: '吉首·神秘湘西', season: '春秋最佳', days: '2-3', tags: ['凤凰古城','矮寨大桥','德夯苗寨'], poster: { style: 'vintage', subtitle: '神秘湘西 凤凰于飞' }, routes: ['凤凰古城→沱江泛舟→虹桥→沈从文故居', '矮寨奇观旅游区→矮寨大桥→德夯苗寨'], foods: [{ name: '血粑鸭', price: '50-80元', mustTry: true, location: '古城' }] },
  
  '怀化': { title: '怀化·鹤城', season: '春秋最佳', days: '2-3', tags: ['和平之城','侗族风情','芷江受降'], poster: { style: 'fresh', subtitle: '和平之城 侗乡怀化' }, routes: ['芷江受降纪念坊→受降纪念馆→飞虎队纪念馆', '通道侗寨→芋头侗寨→皇都侗寨'], foods: [{ name: '芷江鸭', price: '30-50元', mustTry: true, location: '芷江' }] },
  
  '永州': { title: '永州·零陵', season: '春秋最佳', days: '2-3', tags: ['柳宗元故里','九嶷山','瑶族文化'], poster: { style: 'vintage', subtitle: '潇湘之源 柳宗元谪居地' }, routes: ['零陵古城→柳子庙→愚溪→朝阳岩', '九嶷山舜帝陵→舜帝庙→紫霞岩'], foods: [{ name: '永州血鸭', price: '40-60元', mustTry: true, location: '零陵' }] },

  // === 华南地区 ===
  '珠海': { title: '珠海·百岛之市', season: '秋冬最佳', days: '2-3', tags: ['情侣路','长隆海洋王国','澳门对望'], poster: { style: 'fresh', subtitle: '浪漫之城 百岛之市' }, routes: ['情侣路→珠海渔女像→珠海大剧院→城市客厅', '长隆海洋王国→横琴长隆国际海洋度假区'], foods: [{ name: '横琴蚝', price: '50-80元', mustTry: true, location: '横琴' }] },
  
  '东莞': { title: '东莞·莞城', season: '全年适宜', days: '2天', tags: ['制造业名城','可园','篮球文化'], poster: { style: 'minimal', subtitle: '世界工厂 活力东莞' }, routes: ['可园→莞城街道→迎恩门城楼', '松山湖高新技术产业园→华为欧洲小镇'], foods: [{ name: '东莞烧鹅', price: '50-80元', mustTry: true, location: '厚街' }] },
  
  '佛山': { title: '佛山·禅城', season: '全年适宜', days: '2-3', tags: ['武术之乡','陶瓷之都','顺德美食'], poster: { style: 'fresh', subtitle: '功夫佛山 美食顺德' }, routes: ['祖庙→黄飞鸿纪念馆→叶问堂→岭南天地', '西樵山→国艺影视城'], foods: [{ name: '顺德双皮奶', price: '8-12元', mustTry: true, location: '民信' }] },
  
  '惠州': { title: '惠州·鹅城', season: '全年适宜', days: '2-3', tags: ['西湖','罗浮山','巽寮湾'], poster: { style: 'fresh', subtitle: '半城山色半城湖' }, routes: ['惠州西湖→泗洲塔→王朝云墓', '罗浮山→冲虚古观→酥醪观'], foods: [{ name: '梅菜扣肉', price: '30-50元', mustTry: true, location: '梅菜产地' }] },
  
  '中山': { title: '中山·香山', season: '全年适宜', days: '2天', tags: ['孙中山故里','灯都','侨乡'], poster: { style: 'vintage', subtitle: '伟人故里 博爱中山' }, routes: ['孙中山故居纪念馆→翠亨村民俗展示馆→中山影视城', '岐江公园→孙文纪念公园→兴中广场'], foods: [{ name: '石岐乳鸽', price: '30-50元/只', mustTry: true, location: '石岐' }] },
  
  '江门': { title: '江门·五邑侨乡', season: '全年适宜', days: '2-3', tags: ['碉楼','侨乡文化','小鸟天堂'], poster: { style: 'fresh', subtitle: '中国侨都 五邑江门' }, routes: ['开平碉楼（自力村碉楼群→马降龙碉楼群）', '小鸟天堂→梁启超故居'], foods: [{ name: '陈皮骨', price: '50-80元', mustTry: true, location: '新会' }] },
  
  '肇庆': { title: '肇庆·端州', season: '春秋最佳', days: '2-3', tags: ['七星岩','鼎湖山','端砚'], poster: { style: 'fresh', subtitle: '山水砚都 端州肇庆' }, routes: ['七星岩→星湖湿地公园→牌坊广场', '鼎湖山→庆云寺→飞水潭→蝴蝶谷'], foods: [{ name: '肇庆裹蒸', price: '15-25元', mustTry: true, location: '市区' }] },
  
  '湛江': { title: '湛江·港城', season: '冬春最佳', days: '2-3', tags: ['大陆最南端','海鲜','火山岛'], poster: { style: 'fresh', subtitle: '南国港城 热带湛江' }, routes: ['湖光岩→玛珥湖→楞严寺', '东海岛→龙海天沙滩→中国第一长滩'], foods: [{ name: '白切鸡', price: '50-80元', mustTry: true, location: '安铺' }] },
  
  '茂名': { title: '茂名·油城', season: '全年适宜', days: '2天', tags: ['南方油城','荔枝之乡','露天矿生态'], poster: { style: 'fresh', subtitle: '南方油城 荔枝之乡' }, routes: ['茂名露天矿生态公园→好心湖→博物馆', '放鸡岛→浪漫海岸'], foods: [{ name: '茂名荔枝', price: '10-30元/斤', mustTry: true, location: '高州' }] },
  
  '阳江': { title: '阳江·鼍城', season: '全年适宜', days: '2-3', tags: ['海陵岛','刀具之都','风筝之乡'], poster: { style: 'fresh', subtitle: '南海Ⅰ号 刀具之乡' }, routes: ['海陵岛→十里银滩→大角湾→马尾岛', '凌霄岩→玉溪三洞'], foods: [{ name: '阳江豆豉', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '清远': { title: '清远·凤城', season: '全年适宜', days: '2-3', tags: ['漂流','溶洞','少数民族'], poster: { style: 'fresh', subtitle: '漂流之乡 清远山水' }, routes: ['黄腾峡漂流→牛鱼嘴原始生态风景区', '连州地下河→湟川三峡→擎天玻璃桥'], foods: [{ name: '清远鸡', price: '60-100元', mustTry: true, location: '市区' }] },
  
  '韶关': { title: '韶关·韶城', season: '春秋最佳', days: '2-3', tags: ['丹霞山','南华寺','珠玑巷'], poster: { style: 'vintage', subtitle: '禅宗祖庭 丹霞地貌' }, routes: ['丹霞山（长老峰→翔龙湖→阴元石→阳元石→通泰桥）', '南华寺→曹溪温泉→马坝人遗址'], foods: [{ name: '丹霞山豆腐', price: '10-15元', mustTry: true, location: '仁化' }] },
  
  '河源': { title: '河源·槎城', season: '全年适宜', days: '2天', tags: ['万绿湖','恐龙之乡','客家古邑'], poster: { style: 'fresh', subtitle: '客家古邑 绿色河源' }, routes: ['万绿湖风景区→水月湾→镜花缘', '恐龙文博园→恐龙蛋遗址'], foods: [{ name: '客家酿豆腐', price: '15-25元', mustTry: true, location: '市区' }] },
  
  '汕尾': { title: '汕尾·海陆丰', season: '秋冬最佳', days: '2天', tags: ['红海湾','玄武山','妈祖文化'], poster: { style: 'fresh', subtitle: '粤东黄金海岸' }, routes: ['红海湾遮浪半岛→南海观音', '玄武山旅游区→元山寺'], foods: [{ name: '海鲜粥', price: '15-25元', mustTry: true, location: '市区' }] },
  
  '潮州': { title: '潮州·潮汕故里', season: '秋冬最佳', days: '2-3', tags: ['潮州古城','广济桥','潮汕美食'], poster: { style: 'vintage', subtitle: '岭海名邦 潮人故里' }, routes: ['潮州古城墙→广济桥→牌坊街→开元寺→许驸马府→己略黄公祠', '韩文公祠→葫芦山→淡浮院'], foods: [{ name: '潮州牛肉丸', price: '20-30元', mustTry: true, location: '牌坊街' }] },
  
  '揭阳': { title: '揭阳·莲城', season: '秋冬最佳', days: '2天', tags: ['揭阳古城','黄旭华故居','潮汕文化'], poster: { style: 'vintage', subtitle: '古邑揭阳 潮汕明珠' }, routes: ['揭阳学宫→进贤门→城隍庙→双峰寺', '黄旭华故居→博览园'], foods: [{ name: '普宁豆干', price: '5-8元', mustTry: true, location: '普宁' }] },
  
  '北海': { title: '北海·珠城', season: '10月-次年4月', days: '2-3', tags: ['银滩','涠洲岛','珍珠之乡'], poster: { style: 'fresh', subtitle: '南珠故郡 北海银滩' }, routes: ['北海银滩→北海老街→北部湾广场', '涠洲岛（鳄鱼山火山公园→五彩滩→滴水丹屏→天主教堂）'], foods: [{ name: '海鲜', price: '60-100元/人', mustTry: true, location: '外沙/侨港' }] },
  
  '桂林': { title: '桂林·山水甲天下', season: '4-10月最佳', days: '4-5', tags: ['漓江风光','喀斯特地貌','民族风情'], poster: { style: 'fresh', subtitle: '舟行碧波上 人在画中游' }, routes: ['漓江竹筏漂流（兴坪→阳朔）→十里画廊→西街', '象鼻山→七星公园→芦笛岩→两江四湖'], foods: [{ name: '桂林米粉', price: '10-15元', mustTry: true, location: '崇善米粉' }] },
  
  '柳州': { title: '柳州·龙城', season: '春秋最佳', days: '2-3', tags: ['螺蛳粉','工业城市','百里柳江'], poster: { style: 'fresh', subtitle: '螺蛳粉之都 工业柳州' }, routes: ['马鞍山公园→立鱼峰公园→柳侯祠', '百里柳江画廊→蟠龙山→文庙'], foods: [{ name: '螺蛳粉', price: '10-15元', mustTry: true, location: '西环肥仔/娇姐' }] },
  
  '梧州': { title: '梧州·鸳江', season: '春秋最佳', days: '2天', tags: ['岭南古都','六堡茶','龟苓膏'], poster: { style: 'vintage', subtitle: '岭南古都 六堡茶乡' }, routes: ['骑楼城→龙母庙→中山公园', '六堡茶生态旅游区→李家庄'], foods: [{ name: '梧州龟苓膏', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '防城港': { title: '防城港·边关', season: '秋冬最佳', days: '2-3', tags: ['十万大山','京族三岛','边境口岸'], poster: { style: 'fresh', subtitle: '西南门户 边海之城' }, routes: ['十万大山国家森林公园→金滩', '东兴口岸→中越友谊大桥→越南芒街'], foods: [{ name: '海鲜', price: '60-100元/人', mustTry: true, location: '港口' }] },
  
  '崇左': { title: '崇左·骆越', season: '秋冬最佳', days: '2-3', tags: ['德天瀑布','跨国瀑布','花山岩画'], poster: { style: 'fresh', subtitle: '跨国瀑布 边关崇左' }, routes: ['德天跨国瀑布→明仕田园→归春河', '花山岩画→左江斜塔→崇左起义纪念馆'], foods: [{ name: '壮族美食', price: '30-50元/人', mustTry: true, location: '市区' }] },
  
  '百色': { title: '百色·鹅城', season: '秋冬最佳', days: '2-3', tags: ['百色起义','乐业天坑','壮族风情'], poster: { style: 'vintage', subtitle: '红色福地 天坑之都' }, routes: ['百色起义纪念馆→粤东会馆→百色起义纪念碑', '乐业大石围天坑群→布柳河峡谷→仙人桥'], foods: [{ name: '隆林黑粽子', price: '5-8元', mustTry: true, location: '隆林' }] },
  
  '河池': { title: '河池·刘三姐故乡', season: '全年适宜', days: '2-3', tags: ['刘三姐','长寿之乡','有色金属'], poster: { style: 'fresh', subtitle: '三姐故里 长寿河池' }, routes: ['刘三姐故里景区→下枧河壮寨→刘三姐水上公园', '巴马长寿村→百魔洞→命河→水晶宫'], foods: [{ name: '巴马香猪', price: '50-80元', mustTry: true, location: '巴马' }] },
  
  '来宾': { title: '来宾·桂中', season: '全年适宜', days: '2天', tags: ['圣堂山','金秀瑶族','红水河'], poster: { style: 'fresh', subtitle: '桂中来宾 圣堂奇观' }, routes: ['圣堂山→莲花山→大瑶山', '金秀瑶族自治县→莲花山→圣堂山'], foods: [{ name: '金秀瑶族美食', price: '30-50元/人', mustTry: true, location: '金秀' }] },
  
  '贺州': { title: '贺州·长寿', season: '全年适宜', days: '2天', tags: ['黄姚古镇','姑婆山','长寿之乡'], poster: { style: 'vintage', subtitle: '世界长寿市 桂东门户' }, routes: ['黄姚古镇→带龙桥→文明阁', '姑婆山→姑婆山国家森林公园'], foods: [{ name: '黄姚豆豉', price: '10-15元', mustTry: true, location: '黄姚' }] },
  
  '三亚': { title: '三亚·热带天堂', seasons: '10月-次年4月', days: '4-6', tags: ['海滨度假','热带风光','海鲜盛宴'], poster: { style: 'fresh', subtitle: '东方夏威夷' }, routes: ['亚龙湾海滩→热带天堂森林公园→蜈支洲岛', '天涯海角→南山寺→大小洞天'], foods: [{ name: '海南鸡饭', price: '25-40元', mustTry: true, location: '沿江海南鸡饭' }] },
  
  '儋州': { title: '儋州·千年古郡', season: '冬春最佳', days: '2-3', tags: ['东坡书院','海花岛','千年盐田'], poster: { style: 'vintage', subtitle: '千年古郡 东坡遗风' }, routes: ['东坡书院→中和古镇→东坡井', '海花岛（全球最大人工岛）'], foods: [{ name: '儋州米烂', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '琼海': { title: '琼海·田园城市', season: '全年适宜', days: '2天', tags: ['博鳌论坛','万泉河','红色娘子军'], poster: { style: 'fresh', subtitle: '田园城市 博鳌之都' }, routes: ['博鳌亚洲论坛永久会址→玉带滩→博鳌禅寺', '万泉河→红色娘子军纪念园→白石岭'], foods: [{ name: '加积鸭', price: '50-80元', mustTry: true, location: '加积' }] },
  
  '三沙': { title: '三沙·祖国南疆', season: '冬春最佳', days: '需报备', tags: ['南海诸岛','珊瑚礁','热带海洋'], poster: { style: 'fresh', subtitle: '祖国南疆 热带天堂' }, routes: ['永兴岛→七连屿→赵述岛', '西沙群岛（需特别许可）'], foods: [{ name: '海鲜', price: '100-200元/人', mustTry: true, location: '岛上' }] },

  // === 西南地区 ===
  '绵阳': { title: '绵阳·科技城', season: '全年适宜', days: '2-3', tags: ['李白故里','北川羌城','科技城'], poster: { style: 'fresh', subtitle: '李白故里 科技绵阳' }, routes: ['李白故里→太白碑→陇西院→海灯武馆', '北川羌城地震遗址→5.12汶川特大地震纪念馆'], foods: [{ name: '绵阳米粉', price: '10-15元', mustTry: true, location: '马家巷' }] },
  
  '乐山': { title: '乐山·佛国仙山', season: '全年适宜', days: '2-3', tags: ['乐山大佛','峨眉山','美食之都'], poster: { style: 'vintage', subtitle: '佛国仙山 乐山乐水' }, routes: ['乐山大佛→东方佛都→乌尤寺→麻浩崖', '峨眉山（报国寺→万年寺→清音阁→一线天→金顶）'], foods: [{ name: '甜皮鸭', price: '25-40元', mustTry: true, location: '赵鸭子' }] },
  
  '宜宾': { title: '宜宾·万里长江第一城', season: '全年适宜', days: '2-3', tags: ['五粮液','蜀南竹海','长江零公里'], poster: { style: 'fresh', subtitle: '长江首城 酒都宜宾' }, routes: ['五粮液工业园→流杯池公园→丞相祠', '蜀南竹海→忘忧谷→翡翠长廊'], foods: [{ name: '宜宾燃面', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '泸州': { title: '泸州·酒城', season: '全年适宜', days: '2天', tags: ['泸州老窖','国窖1573','长江上游'], poster: { style: 'vintage', subtitle: '中国酒城 浓香泸州' }, routes: ['泸州老窖旅游景区→国窖1573广场→酒文化博物馆', '张坝桂圆林→方山'], foods: [{ name: '泸州白糕', price: '5-8元', mustTry: true, location: '市区' }] },
  
  '自贡': { title: '自贡·千年盐都', season: '全年适宜', days: '2天', tags: ['恐龙博物馆','盐业历史','彩灯'], poster: { style: 'fresh', subtitle: '千年盐都 恐龙之乡' }, routes: ['自贡恐龙博物馆→盐业历史博物馆→西秦会馆', '彩灯公园→自贡灯会（春节期间）'], foods: [{ name: '冷吃兔', price: '40-60元', mustTry: true, location: '市区' }] },
  
  '内江': { title: '内江·甜城', season: '全年适宜', days: '1-2天', tags: ['张大千故里','甜城','成渝之心'], poster: { style: 'minimal', subtitle: '成渝之心 甜城内江' }, routes: ['张大千纪念馆→西林寺→圣水寺', '隆昌石牌坊群→古宇湖'], foods: [{ name: '内江牛肉面', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '南充': { title: '南充·绸都', season: '全年适宜', days: '2天', tags: ['嘉陵江','阆中古城','三国文化'], poster: { style: 'vintage', subtitle: '绸都南充 阆苑仙境' }, routes: ['阆中古城（贡院→川北道署→汉桓侯祠→张飞庙→中天楼）', '朱德故里纪念馆→琳琅山'], foods: [{ name: '川北凉粉', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '达州': { title: '达州·巴人故里', season: '全年适宜', days: '2天', tags: ['元九铁路','巴山夜雨','天然气之都'], poster: { style: 'fresh', subtitle: '巴人故里 元九达州' }, routes: ['真佛山→賨人谷→九龙山', '巴山大峡谷→鱼泉山'], foods: [{ name: '达州灯影牛肉', price: '40-60元', mustTry: true, location: '市区' }] },
  
  '大理': { title: '大理·风花雪月', season: '全年适宜', days: '3-5', tags: ['苍山洱海','白族风情','慢生活'], poster: { style: 'minimal', subtitle: '下关风 上关花 苍山雪 洱海月' }, routes: ['洱海环湖（吉普车旅拍）→喜洲古镇→双廊', '苍山索道→崇圣寺三塔→大理古城'], foods: [{ name: '酸辣鱼', price: '50-80元', mustTry: true, location: '双廊海边餐厅' }] },
  
  '丽江': { title: '丽江·柔软时光', season: '全年适宜', days: '3-5', tags: ['古城韵味','纳西文化','艳遇之都'], poster: { style: 'vintage', subtitle: '一米阳光的传说' }, routes: ['丽江古城→木府→四方街→狮子山', '束河古镇→白沙壁画→玉湖村'], foods: [{ name: '腊排骨火锅', price: '60-100元', mustTry: true, location: '古城阿安' }] },
  
  '迪庆(香格里拉)': { title: '香格里拉·心中的日月', season: '5-10月最佳', days: '3-4', tags: ['梅里雪山','藏族文化','香巴拉'], poster: { style: 'fresh', subtitle: '心中的日月 接近天堂' }, routes: ['普达措国家公园→属都湖→碧塔海', '松赞林寺→噶丹·松赞林寺'], foods: [{ name: '牦牛肉火锅', price: '80-120元/人', mustTry: true, location: '香格里拉' }] },
  
  '普洱': { title: '普洱·茶马古道', season: '全年适宜', days: '2-3', tags: ['普洱茶','茶马古道','哈尼族'], poster: { style: 'fresh', subtitle: '世界茶源 普洱茶香' }, routes: ['普洱茶马古道旅游景区→那柯里茶马驿站→普洱国家公园', '景迈山古茶园→翁基布朗族古寨'], foods: [{ name: '普洱茶', price: '100-500元/斤', mustTry: true, location: '茶园' }] },
  
  '曲靖': { title: '曲靖·爨文化', season: '全年适宜', days: '2天', tags: ['珠江源','爨文化','美食之都'], poster: { style: 'fresh', subtitle: '珠江源头 爨乡曲靖' }, routes: ['珠江源风景区→爨宝雄古镇→彩色沙林', '师宗凤凰谷→菌子山'], foods: [{ name: '宣威火腿', price: '50-100元/斤', mustTry: true, location: '宣威' }] },
  
  '楚雄': { title: '楚雄·彝州', season: '全年适宜', days: '2天', tags: ['彝族文化','恐龙谷','元谋土林'], poster: { style: 'fresh', subtitle: '彝州楚雄 东方人类故乡' }, routes: ['彝族十月太阳历文化园→彝族博物馆', '元谋土林→元谋猿人遗址'], foods: [{ name: '彝族坨坨肉', price: '30-50元', mustTry: true, location: '楚雄' }] },
  
  '玉溪': { title: '玉溪·聂耳故乡', season: '全年适宜', days: '2天', tags: ['抚仙湖','聂耳','褚橙之乡'], poster: { style: 'minimal', subtitle: '云烟之乡 聂耳故里' }, routes: ['抚仙湖→禄充风景区→明星鱼洞', '聂耳故居→聂耳音乐广场'], foods: [{ name: '鳝鱼米线', price: '15-25元', mustTry: true, location: '市区' }] },
  
  '保山': { title: '保山·永昌', season: '全年适宜', days: '2-3', tags: ['腾冲','和顺古镇','滇西抗战'], poster: { style: 'fresh', subtitle: '极边之城 温润保山' }, routes: ['腾冲热海→和顺古镇→火山地质公园', '国殇墓园（滇西抗战纪念馆）→叠水河瀑布'], foods: [{ name: '大救驾', price: '80-120元', mustTry: true, location: '腾冲' }] },
  
  '昭通': { title: '昭通·秋城', season: '全年适宜', days: '2天', tags: ['黑颈鹤','苹果之乡','乌蒙山'], poster: { style: 'fresh', subtitle: '鹤乡昭通 苹果之城' }, routes: ['大山包黑颈鹤自然保护区→鸡公山', '念湖→草海'], foods: [{ name: '昭通苹果', price: '5-10元/斤', mustTry: true, location: '昭通' }] },
  
  '临沧': { title: '临沧·恒春', season: '全年适宜', days: '2-3', tags: ['普洱茶','佤族风情','边境口岸'], poster: { style: 'fresh', subtitle: '恒春临沧 世界佤乡' }, routes: ['沧源崖画谷→勐来董寨→翁丁原始部落', '勐懂口岸→中缅边境'], foods: [{ name: '佤族鸡肉烂饭', price: '20-30元', mustTry: true, location: '沧源' }] },
  
  '日喀则': { title: '日喀则·后藏', season: '5-10月最佳', days: '3-4', tags: ['珠峰大本营','扎什伦布寺','后藏文化'], poster: { style: 'vintage', subtitle: '珠峰门户 后藏圣地' }, routes: ['扎什伦布寺→班禅新宫→后藏民俗博览园', '珠峰大本营（绒布寺）→珠峰观景台'], foods: [{ name: '藏式美食', price: '30-50元/人', mustTry: true, location: '日喀则' }] },
  
  '林芝': { title: '林芝·西藏江南', season: '5-10月最佳', days: '3-4', tags: ['雅鲁藏布大峡谷','南迦巴瓦峰','林芝桃花'], poster: { style: 'fresh', subtitle: '西藏江南 雪域桃源' }, routes: ['巴松措→卡定沟→措木及日', '雅鲁藏布大峡谷→南迦巴瓦峰（远观）'], foods: [{ name: '石锅鸡', price: '80-120元', mustTry: true, location: '鲁朗' }] },
  
  '昌都': { title: '昌都·藏东明珠', season: '5-10月最佳', days: '2-3', tags: ['强巴林寺','康巴服饰','茶马古道'], poster: { style: 'vintage', subtitle: '藏东明珠 康巴故里' }, routes: ['强巴林寺→昌都地区博物馆', '类乌齐寺→查杰玛大殿'], foods: [{ name: '藏东美食', price: '30-50元/人', mustTry: true, location: '昌都' }] },
  
  '阿里': { title: '阿里·世界屋脊', season: '5-10月最佳', days: '7-10', tags: ['冈仁波齐峰','古格王朝','神山圣湖'], poster: { style: 'vintage', subtitle: '世界屋脊 阿里朝圣之路' }, routes: ['冈仁波齐峰转山→玛旁雍错→拉昂错', '札达土林→古格王朝遗址'], foods: [{ name: '藏式食物', price: '50-80元/人', mustTry: true, location: '沿途' }] },

  // === 西北地区 ===
  '延安': { title: '延安·革命圣地', season: '春夏秋最佳', days: '2-3', tags: ['黄帝陵','宝塔山','壶口瀑布'], poster: { style: 'vintage', subtitle: '革命圣地 红色延安' }, routes: ['黄帝陵→轩辕庙→壶口瀑布', '宝塔山→清凉山→革命纪念馆'], foods: [{ name: '延安红枣', price: '10-20元/斤', mustTry: true, location: '延川' }] },
  
  '榆林': { title: '榆林·驼城', season: '夏秋最佳', days: '2-3', tags: ['镇北台','红石峡','陕北民歌'], poster: { style: 'fresh', subtitle: '塞上驼城 陕北榆林' }, routes: ['镇北台→红石峡→统万城遗址', '榆林古城→红石峡生态公园'], foods: [{ name: '榆林豆腐', price: '8-12元', mustTry: true, location: '绥德' }] },
  
  '咸阳': { title: '咸阳·秦都', season: '全年适宜', days: '1-2天', tags: ['秦始皇陵','茂陵','乾陵'], poster: { style: 'vintage', subtitle: '第一帝都 秦都咸阳' }, routes: ['秦始皇陵（丽山园）→茂陵（汉武帝）→霍去病墓', '乾陵（武则天与高宗合葬墓）→懿德太子墓'], foods: [{ name: 'biangbiang面', price: '15-20元', mustTry: true, location: '秦都区' }] },
  
  '宝鸡': { title: '宝鸡·陈仓', season: '全年适宜', days: '2-3', tags: ['法门寺','青铜器之乡','炎帝故里'], poster: { style: 'fresh', subtitle: '陈仓故里 青铜之乡' }, routes: ['法门寺（珍宝馆→合十舍利塔）→茂陵', '太白山→青峰峡→红河谷'], foods: [{ name: '宝鸡擀面皮', price: '8-12元', mustTry: true, location: '岐山' }] },
  
  '渭南': { title: '渭南·东府', season: '全年适宜', days: '1-2天', tags: ['华山','司马迁故里','洽川'], poster: { style: 'fresh', subtitle: '华山险峻 史圣故里' }, routes: ['华山（西峰→南峰→东峰→北峰→中峰→长空栈道）', '韩城司马迁祠→党家村→黄河龙门'], foods: [{ name: '时辰包子', price: '5-8元', mustTry: true, location: '大荔' }] },
  
  '汉中': { title: '汉中·天府之国', season: '全年适宜', days: '2-3', tags: ['汉中油菜花海','武侯墓','栈道'], poster: { style: 'fresh', subtitle: '西北小江南 汉中天府' }, routes: ['武侯墓→勉县武侯祠→马超墓', '汉中油菜花海（春季）→朱鹮自然保护区'], foods: [{ name: '热面皮', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '安康': { title: '安康·秦巴明珠', season: '全年适宜', days: '2天', tags: ['瀛湖','南宫山','秦岭腹地'], poster: { style: 'fresh', subtitle: '秦巴明珠 秦头楚尾' }, routes: ['瀛湖风景区→南宫山→香溪洞', '中坝大峡谷→天书峡'], foods: [{ name: '蒸面', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '商洛': { title: '商洛·秦岭最美', season: '全年适宜', days: '2天', tags: ['秦岭','金丝大峡谷','核桃之乡'], poster: { style: 'fresh', subtitle: '秦岭最美 商於古道' }, routes: ['金丝大峡谷→柘水漂流→秦岭洞天福地', '牛背梁自然保护区→终南山寨'], foods: [{ name: '商洛核桃', price: '15-25元/斤', mustTry: true, location: '商州' }] },
  
  '天水': { title: '天水·陇上江南', season: '春夏秋最佳', days: '2-3', tags: ['麦积山石窟','伏羲庙','大地湾'], poster: { style: 'vintage', subtitle: '陇上江南 伏羲故里' }, routes: ['麦积山石窟→仙人崖→净土寺→麦积烟雨', '伏羲庙→南郭寺→玉泉观→李广墓'], foods: [{ name: '呱呱', price: '15-25元', mustTry: true, location: '秦州' }] },
  
  '酒泉': { title: '酒泉·肃州', season: '夏秋最佳', days: '2-3', tags: ['卫星发射中心','锁阳城','敦煌门户'], poster: { style: 'vintage', subtitle: '航天之城 敦煌门户' }, routes: ['酒泉卫星发射中心→西汉酒泉胜迹', '锁阳城→榆林窟'], foods: [{ name: '驴肉黄面', price: '15-25元', mustTry: true, location: '市区' }] },
  
  '嘉峪关': { title: '嘉峪关·天下第一雄关', season: '夏秋最佳', days: '1-2天', tags: ['嘉峪关关城','悬壁长城','魏晋墓群'], poster: { style: 'vintage', subtitle: '天下第一雄关 边陲锁钥' }, routes: ['嘉峪关关城→悬臂长城→长城第一墩', '新城魏晋壁画墓→讨赖古城'], foods: [{ name: '烤羊排', price: '40-60元', mustTry: true, location: '市区' }] },
  
  '张掖': { title: '张掖·甘州', season: '夏秋最佳', days: '2-3', tags: ['七彩丹霞','大佛寺','马蹄寺'], poster: { style: 'fresh', subtitle: '七彩丹霞 张掖不夜天' }, routes: ['张掖七彩丹霞→冰沟丹霞→平山湖大峡谷', '大佛寺→山西会馆→马蹄寺'], foods: [{ name: '搓鱼子', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '武威': { title: '武威·凉州', season: '夏秋最佳', days: '2天', tags: ['雷台汉墓','文庙','天梯山'], poster: { style: 'vintage', subtitle: '马踏飞燕出凉州' }, routes: ['雷台汉墓→雷台观→文庙→西夏博物馆', '天梯山石窟→海藏寺'], foods: [{ name: '三套车', price: '15-25元', mustTry: true, location: '市区' }] },
  
  '金昌': { title: '金昌·镍都', season: '夏秋最佳', days: '1-2天', tags: ['镍都','骊靬古城','巴丹吉林沙漠'], poster: { style: 'minimal', subtitle: '中国镍都 西部花城' }, routes: ['金川国家矿山公园→露天镍矿', '骊靬古城→巴丹吉林沙漠（可选）'], foods: [{ name: '羊肉垫卷子', price: '20-30元', mustTry: true, location: '市区' }] },
  
  '白银': { title: '白银·铜城', season: '夏秋最佳', days: '1-2天', tags: ['黄河石林','会宁红军会师','铜城'], poster: { style: 'fresh', subtitle: '黄河明珠 铜城白银' }, routes: ['黄河石林→饮马沟大峡谷', '会宁红军会师旧址→红军长征胜利景园'], foods: [{ name: '靖远羊羔肉', price: '50-80元', mustTry: true, location: '靖远' }] },
  
  '固原': { title: '固原·萧关', season: '夏秋最佳', days: '2天', tags: ['须弥山石窟','六盘山','萧关'], poster: { style: 'vintage', subtitle: '萧关故道 固原风光' }, routes: ['须弥山石窟→火石寨→老龙潭', '六盘山→红军长征纪念馆'], foods: [{ name: '固原暖锅', price: '30-50元', mustTry: true, location: '市区' }] },
  
  '中卫': { title: '中卫·沙坡头', season: '夏秋最佳', days: '2-3', tags: ['沙坡头','沙坡鸣钟','腾格里沙漠'], poster: { style: 'fresh', subtitle: '沙坡鸣钟 大漠孤烟' }, routes: ['沙坡头→腾格里沙漠→金沙岛→通湖草原', '高庙→寺口子黄河大峡谷'], foods: [{ name: '蒿子面', price: '10-15元', mustTry: true, location: '市区' }] },
  
  '吐鲁番': { title: '吐鲁番·火洲', season: '夏秋最佳', days: '2-3', tags: ['火焰山','葡萄沟','坎儿井'], poster: { style: 'fresh', subtitle: '火洲吐鲁 葡萄之乡' }, routes: ['火焰山→柏孜克里克千佛洞→葡萄沟→坎儿井民俗园', '交河故城→高昌故城→阿斯塔那古墓群'], foods: [{ name: '葡萄', price: '10-30元/斤', mustTry: true, location: '葡萄沟' }] },
  
  '哈密': { title: '哈密·甜蜜之城', season: '夏秋最佳', days: '2-3', tags: ['哈密瓜','魔鬼城','回王陵'], poster: { style: 'fresh', subtitle: '甜蜜之城 瓜果之乡' }, routes: ['魔鬼城（雅丹地貌）→哈密回王陵→哈密瓜园', '巴里坤草原→巴里坤古城→怪石山'], foods: [{ name: '哈密瓜', price: '5-10元/斤', mustTry: true, location: '果园' }] },
  
  '克拉玛依': { title: '克拉玛依·油城', season: '夏秋最佳', days: '2-3', tags: ['乌尔禾魔鬼城','黑油山','石油之城'], poster: { style: 'minimal', subtitle: '石油之城 魔鬼之城' }, routes: ['乌尔禾魔鬼城（世界魔鬼城）→五彩滩→白杨河大峡谷', '黑油山→一号井→石油纪念广场'], foods: [{ name: '克拉玛依凉皮', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '伊犁': { title: '伊犁·塞外江南', season: '6-9月最佳', days: '3-5', tags: ['那拉提草原','赛里木湖','薰衣草'], poster: { style: 'fresh', subtitle: '塞外江南 杏花伊犁' }, routes: ['那拉提草原→空中草原→河谷草原→雪莲谷', '赛里木湖→果子沟大桥→点将台'], foods: [{ name: '马肉纳仁', price: '30-50元', mustTry: true, location: '昭苏' }] },
  
  '阿勒泰': { title: '阿勒泰·金山', season: '冬季（滑雪）/夏季（避暑）', days: '3-4', tags: ['喀纳斯','可可托海','禾木村'], poster: { style: 'fresh', subtitle: '人间净土 神的后花园' }, routes: ['喀纳斯湖→观鱼台→月亮湾→神仙湾→卧龙湾', '禾木村→禾木河→白桦林'], foods: [{ name: '冷水鱼', price: '50-80元', mustTry: true, location: '喀纳斯' }] },
  
  '喀什': { title: '喀什·丝路明珠', season: '9-11月最佳', days: '2-3', tags: ['艾提尕尔清真寺','高台民居','维吾尔风情'], poster: { style: 'vintage', subtitle: '不到喀什不算到过新疆' }, routes: ['艾提尕尔清真寺→喀什老城→高台民居→香妃墓', '卡拉库里湖→慕士塔格峰（远观）'], foods: [{ name: '抓饭', price: '10-15元', mustTry: true, location: '老城' }] },
  
  '和田': { title: '和田·玉都', season: '9-11月最佳', days: '2-3', tags: ['和田玉','千里葡萄长廊','昆仑山'], poster: { style: 'fresh', subtitle: '玉石之都 昆仑山下' }, routes: ['和田玉龙喀什河→玉石巴扎→玉石交易市场', '千里葡萄长廊→无花果王'], foods: [{ name: '和田玉枣', price: '15-25元/斤', mustTry: true, location: '市区' }] },
  
  '库尔勒': { title: '库尔勒·梨城', season: '夏秋最佳', days: '2-3', tags: ['博斯腾湖','罗布人村寨','孔雀河'], poster: { style: 'fresh', subtitle: '梨城库尔勒 塞外江南' }, routes: ['博斯腾湖→芦苇荡→白鹭洲', '罗布人村寨→阿不旦旅游公路'], foods: [{ name: '博湖鱼', price: '50-80元', mustTry: true, location: '博斯腾湖' }] },
  
  '阿克苏': { title: '阿克苏·白水城', season: '夏秋最佳', days: '2-3', tags: ['天山托木尔峰','克孜尔千佛洞','苹果之乡'], poster: { style: 'fresh', subtitle: '白水城 龟兹故里' }, routes: ['天山托木尔峰→温宿大峡谷', '克孜尔千佛洞→天山神秘大峡谷'], foods: [{ name: '阿克苏苹果', price: '5-10元/斤', mustTry: true, location: '阿克苏' }] },
  
  '石河子': { title: '石河子·军垦名城', season: '夏秋最佳', days: '1-2天', tags: ['军垦博物馆','驼铃梦坡','军垦第一连'], poster: { style: 'minimal', subtitle: '戈壁明珠 军垦新城' }, routes: ['军垦博物馆→军垦第一连→周总理纪念碑', '驼铃梦坡→驼铃酒庄→北泉镇'], foods: [{ name: '凉皮', price: '8-12元', mustTry: true, location: '市区' }] },
  
  '昌吉': { title: '昌吉·回族自治州', season: '夏秋最佳', days: '2天', tags: ['天山天池','江布拉克','回民风情'], poster: { style: 'fresh', subtitle: '天山脚下 回民家园' }, routes: ['天山天池→西小天池→马牙山→灯杆山', '江布拉克→天山牧场'], foods: [{ name: '九碗三行子', price: '20-30元', mustTry: true, location: '市区' }] },
  
  '五家渠': { title: '五家渠·兵城', season: '夏秋最佳', days: '1-2天', tags: ['军垦博物馆','怪石林','鸣沙山'], poster: { style: 'minimal', subtitle: '兵团之城 兵团风采' }, routes: ['军垦博物馆→军垦第一犁', '怪石林→鸣沙山'], foods: [{ name: '凉皮', price: '8-12元', mustTry: true, location: '市区' }] },

  // ==================== 更多地级市 (431个) ====================

  // === 华北地区 ===
  '唐山': { title: '唐山·凤凰城', season: '春秋最佳', days: '2-3', tags: ['地震遗址','工业旅游','渤海湾'], poster: { style: 'fresh', subtitle: '凤凰涅槃 英雄城市' }, routes: ['唐山地震遗址纪念公园→开滦国家矿山公园', '清东陵→月坨岛→菩提岛'], foods: [{ name: '蜂蜜麻糖', price: '15-25元', mustTry: true, location: '市区' }] },

  '秦皇岛': { title: '秦皇岛·港城', season: '夏季最佳', days: '2-3', tags: ['北戴河','山海关','海滨度假'], poster: { style: 'fresh', subtitle: '长城海滨 天下第一关' }, routes: ['北戴河→鸽子窝公园→老虎石海上公园', '山海关→老龙头→天下第一关'], foods: [{ name: '海鲜大餐', price: '80-150元/人', mustTry: true, location: '海边' }] },

  '邯郸': { title: '邯郸·成语之都', season: '春秋最佳', days: '2-3', tags: ['赵国古都','成语典故','太极拳'], poster: { style: 'vintage', subtitle: '成语之都 太极之乡' }, routes: ['丛台公园→赵王城遗址→广府古城', '娲皇宫→京娘湖→太行五指山'], foods: [{ name: '驴肉火烧', price: '15-25元', mustTry: true, location: '永年' }] },

  '邢台': { title: '邢台·邢襄', season: '春秋最佳', days: '1-2天', tags: ['扁鹊故里','郭守敬','太行山'], poster: { style: 'minimal', subtitle: '邢襄古韵 太行明珠' }, routes: ['崆山白云洞→天台山→前南峪', '扁鹊庙→郭守敬纪念馆'], foods: [{ name: '邢台焖面', price: '15-20元', mustTry: true, location: '市区' }] },

  '保定': { title: '保定·直隶', season: '春秋最佳', days: '2-3', tags: ['白洋淀','直隶总督署','狼牙山'], poster: { style: 'vintage', subtitle: '首都南大门 直隶首府' }, routes: ['白洋淀→芦苇荡→荷花大观园', '直隶总督署→古莲花池→狼牙山'], foods: [{ name: '驴肉火烧', price: '15-25元', mustTry: true, location: '徐水' }] },

  '张家口': { title: '张家口·张垣', season: '夏冬两季', days: '2-3', tags: ['冬奥会','草原天路','长城'], poster: { style: 'fresh', subtitle: '冬奥之城 坝上风光' }, routes: ['崇礼滑雪场→太子城遗址', '草原天路→张北中都原始草原度假村'], foods: [{ name: '莜面窝窝', price: '15-25元', mustTry: true, location: '市区' }] },

  '承德': { title: '承德·热河', season: '夏季最佳', days: '2-3', tags: ['避暑山庄','外八庙','塞罕坝'], poster: { style: 'vintage', subtitle: '避暑胜地 塞外京都' }, routes: ['避暑山庄→外八庙（普宁寺、普陀宗乘之庙）', '塞罕坝国家森林公园→乌兰布统草原'], foods: [{ name: '荞面饸饹', price: '15-20元', mustTry: true, location: '市区' }] },

  '沧州': { title: '沧州·狮城', season: '春秋最佳', days: '1-2天', tags: ['铁狮子','武术之乡','杂技'], poster: { style: 'fresh', subtitle: '武术之都 杂技之乡' }, routes: ['沧州铁狮与旧城遗址公园→吴桥杂技大世界', '黄骅港→南大港湿地'], foods: [{ name: '驴肉火烧', price: '15-25元', mustTry: true, location: '河间' }] },

  '廊坊': { title: '廊坊·京津走廊', season: '四季皆宜', days: '1-2天', tags: ['京津冀','温泉','会展中心'], poster: { style: 'minimal', subtitle: '京津走廊 温泉之城' }, routes: ['天下第一城→金钥匙温泉', '自然公园→文化艺术中心'], foods: [{ name: '香河肉饼', price: '15-25元', mustTry: true, location: '香河' }] },

  '衡水': { title: '衡水·湖城', season: '春秋最佳', days: '1-2天', tags: ['衡水湖','内画鼻烟壶','老白干'], poster: { style: 'fresh', subtitle: '湖城衡水 酿酒之都' }, routes: ['衡水湖国家级自然保护区→闾里古镇', '武强年画博物馆→安平桥'], foods: [{ name: '衡水老白干', price: '50-100元/瓶', mustTry: true, location: '市区' }] },

  '晋中': { title: '晋中·晋商故里', season: '春秋最佳', days: '2-3', tags: ['平遥古城','乔家大院','晋商文化'], poster: { style: 'vintage', subtitle: '晋商故里 古城新韵' }, routes: ['平遥古城→日升昌票号→双林寺', '乔家大院→王家大院→常家庄园'], foods: [{ name: '平遥牛肉', price: '30-50元', mustTry: true, location: '平遥' }] },

  '大同': { title: '大同·云中', season: '春秋最佳', days: '2-3', tags: ['云冈石窟','九龙壁','北魏古都'], poster: { style: 'vintage', subtitle: '云冈石窟 北魏古都' }, routes: ['云冈石窟→华严寺→善化寺→九龙壁', '恒山悬空寺→应县木塔'], foods: [{ name: '刀削面', price: '15-25元', mustTry: true, location: '市区' }] },

  '阳泉': { title: '阳泉·漾泉', season: '春秋最佳', days: '1-2天', tags: ['娘子关','藏山','煤炭'], poster: { style: 'fresh', subtitle: '煤铁之乡 晋东门户' }, routes: ['娘子关瀑布→藏山风景区→翠枫山', '阳泉古城→百团大战纪念馆'], foods: [{ name: '漂抿曲', price: '10-15元', mustTry: true, location: '市区' }] },

  '长治': { title: '长治·上党', season: '春秋最佳', days: '2-3', tags: ['太行山大峡谷','八路军总部','古建筑'], poster: { style: 'fresh', subtitle: '太行精神 红色长治' }, routes: ['太行山大峡谷→通天峡→八泉峡', '八路军太行纪念馆→黄崖洞'], foods: [{ name: '壶关羊汤', price: '15-25元', mustTry: true, location: '壶关' }] },

  '晋城': { title: '晋城·泽州', season: '春秋最佳', days: '2-3', tags: ['皇城相府','珏山','古堡群'], poster: { style: 'vintage', subtitle: '古建博物馆 晋城古堡' }, routes: ['皇城相府→郭峪古城→湘峪古堡', '珏山→王莽岭→锡崖沟'], foods: [{ name: '烧肝', price: '10-15元', mustTry: true, location: '高平' }] },

  '朔州': { title: '朔州·马邑', season: '春秋最佳', days: '1-2天', tags: ['应县木塔','杀虎口','右玉'], poster: { style: 'vintage', subtitle: '边塞重镇 右玉精神' }, routes: ['应县木塔→净土寺→崇福寺', '杀虎口→右玉古城→苍头河'], foods: [{ name: '朔州羊杂', price: '15-25元', mustTry: true, location: '市区' }] },

  '运城': { title: '运城·河东', season: '春秋最佳', days: '2-3', tags: ['关公故里','盐湖','永乐宫'], poster: { style: 'vintage', subtitle: '关公故里 德孝之源' }, routes: ['解州关帝庙→运城盐湖→永乐宫', '鹳雀楼→黄河大铁牛→普救寺'], foods: [{ name: '闻喜煮饼', price: '10-15元', mustTry: true, location: '闻喜' }] },

  '忻州': { title: '忻州·秀容', season: '夏秋最佳', days: '2-3', tags: ['五台山','雁门关','佛教圣地'], poster: { style: 'vintage', subtitle: '佛国圣地 五台圣境' }, routes: ['五台山（显通寺→塔院寺→菩萨顶）', '雁门关→代县文庙→阎锡山故居'], foods: [{ name: '忻州瓦酥', price: '10-15元', mustTry: true, location: '市区' }] },

  '临汾': { title: '临汾·平阳', season: '春秋最佳', days: '2-3', tags: ['壶口瀑布','尧庙','洪洞大槐树'], poster: { style: 'vintage', subtitle: '华人老家 根祖之地' }, routes: ['壶口瀑布→尧庙→华门', '洪洞大槐树寻根祭祖园→苏三监狱'], foods: [{ name: '牛肉丸子面', price: '10-15元', mustTry: true, location: '市区' }] },

  '吕梁': { title: '吕梁·离石', season: '春秋最佳', days: '2-3', tags: ['碛口古镇','庞泉沟','汾酒'], poster: { style: 'fresh', subtitle: '英雄吕梁 红色热土' }, routes: ['碛口古镇→李家山村→西湾村', '庞泉沟→北武当山→汾酒文化景区'], foods: [{ name: '柳林碗托', price: '5-8元', mustTry: true, location: '柳林' }] },

  '赤峰': { title: '赤峰·红山', season: '夏秋最佳', days: '2-3', tags: ['红山文化','贡格尔草原','达里湖'], poster: { style: 'fresh', subtitle: '红山文化发祥地 草原明珠' }, routes: ['红山国家森林公园→红山文化博物馆', '贡格尔草原→达里诺尔湖→阿斯哈图石林'], foods: [{ name: '对夹', price: '5-10元', mustTry: true, location: '市区' }] },

  '通辽': { title: '通辽·科尔沁', season: '夏秋最佳', days: '2-3', tags: ['科尔沁草原','大青沟','蒙古风情'], poster: { style: 'fresh', subtitle: '科尔沁草原 孝庄故里' }, routes: ['珠日河草原→大青沟国家级自然保护区', '孝庄园文化旅游区→库伦三大寺'], foods: [{ name: '蒙古馅饼', price: '15-25元', mustTry: true, location: '市区' }] },

  '鄂尔多斯': { title: '鄂尔多斯·羊绒之都', season: '夏秋最佳', days: '2-3', tags: ['成吉思汗陵响沙湾','沙漠景观'], poster: { style: 'fresh', subtitle: '羊绒之都 沙漠绿洲' }, routes: ['成吉思汗陵→响沙湾→七星湖沙漠生态旅游区', '鄂尔多斯草原→康巴什新区'], foods: [{ name: '手把肉', price: '60-100元', mustTry: true, location: '市区' }] },

  '呼伦贝尔': { title: '呼伦贝尔·北国碧玉', season: '6-9月最佳', days: '3-5', tags: ['呼伦贝尔大草原','额尔纳湿地','满洲里'], poster: { style: 'fresh', subtitle: '世界最美的草原 北国碧玉' }, routes: ['呼伦贝尔大草原→莫尔格勒河→额尔古纳湿地', '满洲里→套娃广场→中俄边境'], foods: [{ name: '烤全羊', price: '800-1500元/只', mustTry: true, location: '草原' }] },

  '巴彦淖尔': { title: '巴彦淖尔·河套', season: '夏秋最佳', days: '2-3', tags: ['河套平原','乌梁素海','阴山岩画'], poster: { style: 'fresh', subtitle: '塞上江南 河套粮仓' }, routes: ['乌梁素海→河套文化博物院→阴山岩画', '纳林湖→磴口三盛公水利枢纽'], foods: [{ name: '河套面粉', price: '5-10元/斤', mustTry: true, location: '市区' }] },

  '乌兰察布': { title: '乌兰察布·中国薯都', season: '夏秋最佳', days: '2-3', tags: ['辉腾锡勒草原','岱海','火山群'], poster: { style: 'fresh', subtitle: '中国薯都 风电之都' }, routes: ['辉腾锡勒草原→黄花沟→岱海', '乌兰哈达火山地质公园→集宁战役纪念馆'], foods: [{ name: '卓资山熏鸡', price: '30-50元', mustTry: true, location: '卓资山' }] },

  '兴安盟': { title: '兴安盟·红城', season: '夏秋最佳', days: '2-3', tags: ['阿尔山','成吉思汗庙','大兴安岭'], poster: { style: 'fresh', subtitle: '红色兴安 林海雪原' }, routes: ['阿尔山国家森林公园→天池→三潭峡→石塘林', '成吉思汗庙→乌兰浩特市'], foods: [{ name: '蒙古奶茶', price: '10-15元', mustTry: true, location: '市区' }] },

  '锡林郭勒盟': { title: '锡林郭勒·草原天堂', season: '6-9月最佳', days: '3-4', tags: ['锡林郭勒草原','元上都遗址','蒙古包'], poster: { style: 'fresh', subtitle: '天堂草原 元上都址' }, routes: ['锡林郭勒草原→贝子庙→额尔敦敖包', '元上都遗址→多伦湖→汇宗寺'], foods: [{ name: '手把肉', price: '60-100元', mustTry: true, location: '草原' }] },

  '阿拉善盟': { title: '阿拉善·驼乡', season: '秋季最佳', days: '3-5', tags: ['胡杨林','巴丹吉林沙漠','策克口岸'], poster: { style: 'fresh', subtitle: '苍天般的阿拉善 驼乡传奇' }, routes: ['额济纳胡杨林→黑城弱水胡杨风景区→怪树林', '巴丹吉林沙漠→巴丹湖→必鲁图峰'], foods: [{ name: '驼掌', price: '200-300元', mustTry: false, location: '阿拉善右旗' }] },

  // === 东北地区 ===
  '大连': { title: '大连·浪漫之都', season: '夏季最佳', days: '3-4', tags: ['海滨城市','星海广场','俄罗斯风情街'], poster: { style: 'fresh', subtitle: '北方香港 浪漫之都' }, routes: ['星海广场→滨海路→棒棰岛→金石滩', '老虎滩海洋公园→发现王国→俄罗斯风情街'], foods: [{ name: '海鲜焖子', price: '15-25元', mustTry: true, location: '市区' }] },

  '鞍山': { title: '鞍山·钢都', season: '春秋最佳', days: '1-2天', tags: ['千山','玉佛苑','钢铁之城'], poster: { style: 'fresh', subtitle: '钢都鞍山 千山秀色' }, routes: ['千山风景区→玉佛苑→汤岗子温泉', '鞍钢集团展览馆→二一九公园'], foods: [{ name: '南果梨', price: '10-15元/斤', mustTry: true, location: '海城' }] },

  '抚顺': { title: '抚顺·煤都', season: '春秋最佳', days: '1-2天', tags: ['抚顺煤矿','萨尔浒','雷锋纪念馆'], poster: { style: 'vintage', subtitle: '煤都抚顺 雷锋第二故乡' }, routes: ['抚顺煤矿博物馆→西露天矿→萨尔浒风景区', '雷锋纪念馆→高尔山公园'], foods: [{ name: '麻辣拌', price: '12-18元', mustTry: true, location: '市区' }] },

  '本溪': { title: '本溪·枫叶之都', season: '秋季最佳', days: '2-3', tags: ['本溪水洞','关门山','桓仁五女山'], poster: { style: 'fresh', subtitle: '枫叶之都 地质奇观' }, routes: ['本溪水洞→关门山森林公园→老边沟', '桓仁五女山→望天洞→虎谷峡'], foods: [{ name: '小市羊汤', price: '20-35元', mustTry: true, location: '小市' }] },

  '丹东': { title: '丹东·边境之城', season: '春秋最佳', days: '2-3', tags: ['鸭绿江断桥','抗美援朝纪念馆','朝鲜边境'], poster: { style: 'fresh', subtitle: '最大边境城市 中朝友谊桥' }, routes: ['鸭绿江断桥→抗美援朝纪念馆→锦江山公园', '虎山长城→天桥沟→凤凰山'], foods: [{ name: '丹东草莓', price: '20-40元/斤', mustTry: true, location: '东港' }] },

  '锦州': { title: '锦州·锦绣之州', season: '春秋最佳', days: '2-3', tags: ['笔架山','医巫闾山','烧烤'], poster: { style: 'fresh', subtitle: '辽西走廊 锦绣之州' }, routes: ['笔架山→锦州世博园→北普陀山', '医巫闾山→奉国寺→万佛堂石窟'], foods: [{ name: '锦州烧烤', price: '60-100元/人', mustTry: true, location: '凌河夜市' }] },

  '营口': { title: '营口·河海之交', season: '夏季最佳', days: '1-2天', tags: ['鲅鱼圈','山海广场','温泉'], poster: { style: 'fresh', subtitle: '河海之交 温泉之城' }, routes: ['鲅鱼圈山海广场→月亮湖公园→望儿山', '营口西炮台→楞严寺公园'], foods: [{ name: '营口对虾', price: '50-80元/斤', mustTry: true, location: '沿海' }] },

  '阜新': { title: '阜新·煤电之城', season: '春秋最佳', days: '1-2天', tags: ['海棠山','瑞应寺','玛瑙'], poster: { style: 'minimal', subtitle: '煤电之城 玛瑙之都' }, routes: ['海棠山→瑞应寺→海州露天矿国家矿山公园', '阜新玛瑙市场→查海遗址'], foods: [{ name: '阜新蒙餐', price: '30-50元/人', mustTry: true, location: '市区' }] },

  '辽阳': { title: '辽阳·东北第一城', season: '春秋最佳', days: '1-2天', tags: ['白塔','广佑寺','曹雪芹纪念馆'], poster: { style: 'vintage', subtitle: '东北第一城 关外第一州' }, routes: ['白塔→广佑寺→曹雪芹纪念馆→东京陵', '龙鼎山→核伙沟'], foods: [{ name: '塔糖', price: '10-15元', mustTry: true, location: '市区' }] },

  '盘锦': { title: '盘锦·油城鹤乡', season: '秋季最佳', days: '1-2天', tags: ['红海滩','芦苇荡','辽河口'], poster: { style: 'fresh', subtitle: '油城鹤乡 红色海洋' }, routes: ['红海滩国家风景廊道→芦苇荡→辽河口', '鼎翔生态旅游区→中兴公园'], foods: [{ name: '盘锦河蟹', price: '30-60元/斤', mustTry: true, location: '稻田' }] },

  '铁岭': { title: '铁岭·小品之乡', season: '春秋最佳', days: '1-2天', tags: ['调兵山','龙山','赵本山'], poster: { style: 'minimal', subtitle: '小品之乡 大城市铁岭' }, routes: ['调兵山蒸汽机车博物馆→铁岭市博物馆', '龙山→银冈书院→周恩来视察铁岭纪念馆'], foods: [{ name: '铁岭榛子', price: '20-30元/斤', mustTry: true, location: '开原' }] },

  '朝阳': { title: '朝阳·龙城', season: '春秋最佳', days: '2-3', tags: ['鸟化石','凤凰山','慕容鲜卑'], poster: { style: 'vintage', subtitle: '第一只鸟飞起的地方 花开的地方' }, routes: ['朝阳鸟化石国家地质公园→牛河梁红山文化遗址', '凤凰山→慕容街→北塔'], foods: [{ name: '朝阳小米', price: '8-12元/斤', mustTry: true, location: '建平' }] },

  '葫芦岛': { title: '葫芦岛·关外第一市', season: '夏季最佳', days: '2-3', tags: ['兴城古城','九门口水上长城','绥中'], poster: { style: 'fresh', subtitle: '关外第一市 渤湾明珠' }, routes: ['兴城古城→兴城海滨→觉华岛', '九门口水上长城→绥中九门口'], foods: [{ name: '虹螺岘干豆腐', price: '5-8元', mustTry: true, location: '连山区' }] },

  '吉林市': { title: '吉林市·江城', season: '冬季最佳（雾凇）', days: '2-3', tags: ['雾凇','松花湖','陨石'], poster: { style: 'fresh', subtitle: '雾凇之都 北国江城' }, routes: ['雾凇岛→松花湖→北大壶滑雪场', '吉林市陨石博物馆→北山公园'], foods: [{ name: '冷面', price: '15-25元', mustTry: true, location: '市区' }] },

  '四平': { title: '四平·英雄城', season: '春秋最佳', days: '1-2天', tags: ['四战四平','二龙湖','叶赫那拉城'], poster: { style: 'vintage', subtitle: '英雄城 四平之战' }, routes: ['四平战役纪念馆→烈士陵园→二龙湖风景区', '叶赫那拉城→伊通火山群'], foods: [{ name: '李连贵熏肉大饼', price: '20-35元', mustTry: true, location: '梨树' }] },

  '辽源': { title: '辽源·琵琶之乡', season: '春秋最佳', days: '1-2天', tags: ['扎兰芬围民俗文化园','魁星楼','农民画'], poster: { style: 'fresh', subtitle: '中国琵琶之乡 民间艺术之乡' }, routes: ['扎兰芬围民俗文化园→魁星楼→辽源矿工墓', '东丰农民画馆→鴜鹭湖'], foods: [{ name: '烤豆皮', price: '5-8元', mustTry: true, location: '市区' }] },

  '通化': { title: '通化·医药城', season: '夏秋最佳', days: '2-3', tags: ['集安高句丽','五女峰','葡萄酒'], poster: { style: 'fresh', subtitle: '中国医药城 长白山下小江南' }, routes: ['集安高句丽文物古迹旅游景区→五女峰', '通化葡萄酒厂→杨靖宇烈士陵园'], foods: [{ name: '集安火盆', price: '30-50元', mustTry: true, location: '集安' }] },

  '白山': { title: '白山·长白山门户', season: '夏冬两季', days: '2-3', tags: ['长白山西坡','望天鹅','矿泉城'], poster: { style: 'fresh', subtitle: '长白山下第一城 中国矿泉城' }, routes: ['长白山西坡景区→望天鹅十五道沟', '青山湖→仙人桥温泉'], foods: [{ name: '白山烤肉', price: '50-80元/人', mustTry: true, location: '市区' }] },

  '松原': { title: '松原·石油城', season: '夏秋最佳', days: '1-2天', tags: ['查干湖','嫩江湾','蒙古族风情'], poster: { style: 'fresh', subtitle: '鱼米之乡 松花江畔' }, routes: ['查干湖冬捕（冬季）/夏季观光→嫩江湾湿地公园', '成吉思汗召→妙因寺'], foods: [{ name: '查干湖全鱼宴', price: '200-500元/桌', mustTry: true, location: '查干湖' }] },

  '白城': { title: '白城·鹤乡', season: '夏秋最佳', days: '1-2天', tags: ['向海湿地','莫莫格','鹤乡'], poster: { style: 'fresh', subtitle: '中国鹤乡 白城湿地' }, routes: ['向海国家级自然保护区→鹤乡', '莫莫格国家级自然保护区→嫩江湾'], foods: [{ name: '白城烤全羊', price: '600-1200元/只', mustTry: false, location: '草原' }] },

  '延边': { title: '延边·长白山下', season: '夏冬两季', days: '2-3', tags: ['长白山','延吉美食','朝鲜族风情'], poster: { style: 'fresh', subtitle: '长白山下 朝鲜族家园' }, routes: ['长白山北坡→天池→长白瀑布→地下森林', '延吉西市场→中国朝鲜族民俗园→图们口岸'], foods: [{ name: '延吉冷面', price: '15-25元', mustTry: true, location: '服务大楼' }] },

  '齐齐哈尔': { title: '齐齐哈尔·鹤城', season: '夏冬两季', days: '2-3', tags: ['扎龙丹顶鹤','龙沙公园','烤肉'], poster: { style: 'fresh', subtitle: '鹤城齐齐哈尔 烤肉之都' }, routes: ['扎龙国家级自然保护区→观丹顶鹤→芦苇荡', '龙沙公园→大乘寺→明月岛'], foods: [{ name: '齐齐哈尔烤肉', price: '60-100元/人', mustTry: true, location: '市区' }] },

  '鸡西': { title: '鸡西·煤城', season: '夏秋最佳', days: '1-2天', tags: ['兴凯湖','珍宝岛','冷面'], poster: { style: 'fresh', subtitle: '北国煤城 兴凯湖畔' }, routes: ['兴凯湖→当壁镇→密山口岸', '珍宝岛→乌苏里江'], foods: [{ name: '鸡西冷面', price: '12-18元', mustTry: true, location: '市区' }] },

  '鹤岗': { title: '鹤岗·煤城', season: '夏秋最佳', days: '1-2天', tags: ['龙江三峡','名山岛','黄金古道'], poster: { style: 'minimal', subtitle: '煤城鹤岗 边境小城' }, routes: ['龙江三峡→名山岛→太平沟黄金古镇', '桶子沟原始森林→北山公园'], foods: [{ name: '鹤岗小串', price: '30-50元/人', mustTry: true, location: '夜市' }] },

  '双鸭山': { title: '双鸭山·黑土湿地', season: '夏秋最佳', days: '1-2天', tags: ['饶河黑瞎子岛','乌苏里江','湿地'], poster: { style: 'fresh', subtitle: '黑土湿地 乌苏里江畔' }, routes: ['饶河黑瞎子岛→乌苏里江→珍宝岛湿地', '安邦河国家湿地公园→七星峰'], foods: [{ name: '东北铁锅炖', price: '80-150元', mustTry: true, location: '市区' }] },

  '大庆': { title: '大庆·油城', season: '夏秋最佳', days: '1-2天', tags: ['油田','铁人纪念馆','连环湖'], poster: { style: 'minimal', subtitle: '百湖之城 石油之都' }, routes: ['铁人王进喜纪念馆→大庆油田历史陈列馆', '连环湖温泉→龙凤湿地'], foods: [{ name: '坑烤', price: '50-80元/人', mustTry: true, location: '市区' }] },

  '伊春': { title: '伊春·林都', season: '夏季最佳', days: '2-3', tags: ['小兴安岭','红松故乡','森林氧吧'], poster: { style: 'fresh', subtitle: '祖国林都 红松故乡' }, routes: ['五营国家森林公园→汤旺河林海奇石景区', '嘉荫恐龙国家地质公园→茅兰沟'], foods: [{ name: '山野菜', price: '20-40元', mustTry: true, location: '山区' }] },

  '佳木斯': { title: '佳木斯·东极之城', season: '夏秋最佳', days: '1-2天', tags: ['抚远东极广场','三江平原','赫哲族'], poster: { style: 'fresh', subtitle: '华夏东极 三江平原' }, routes: ['抚远东极广场→黑瞎子岛→乌苏镇', '三江口→街津口赫哲族旅游区'], foods: [{ name: '赫哲族全鱼宴', price: '200-400元/桌', mustTry: true, location: '同江' }] },

  '七台河': { title: '七台河·短道速滑之乡', season: '夏秋最佳', days: '1-2天', tags: ['桃山湖','仙洞山','短道速滑'], poster: { style: 'minimal', subtitle: '奥运冠军之城 短道速滑之乡' }, routes: ['桃山湖→仙洞山国家公园→倭肯河', '勃利红星森林公园→石龙山'], foods: [{ name: '七台河烧烤', price: '40-70元/人', mustTry: true, location: '市区' }] },

  '牡丹江': { title: '牡丹江·雪城', season: '冬季（雪乡）/夏秋（镜泊湖）', days: '2-3', tags: ['镜泊湖','雪乡','牡丹江畔'], poster: { style: 'fresh', subtitle: '雪域牡丹江 镜泊胜景' }, routes: ['镜泊湖→吊水楼瀑布→地下森林', '雪乡→中国雪谷→亚布力'], foods: [{ name: '镜泊湖鱼', price: '60-100元', mustTry: true, location: '镜泊湖' }] },

  '黑河': { title: '黑河·中俄边境', season: '夏秋最佳', days: '1-2天', tags: ['五大连池','中俄边境','瑷珲'], poster: { style: 'fresh', subtitle: '中俄边境之窗 欧亚之门' }, routes: ['五大连池→老黑山→北药泉', '瑷珲历史陈列馆→中俄民族风情园'], foods: [{ name: '五大连池矿泉鱼', price: '50-80元', mustTry: true, location: '五大连池' }] },

  '绥化': { title: '绥化·寒地黑土', season: '夏秋最佳', days: '1-2天', tags: ['农业基地','寒地黑土','绿色食品'], poster: { style: 'minimal', subtitle: '寒地黑土 绿色粮仓' }, routes: ['绥化人民公园→金龟山庄→望奎县满族风情园', '海伦市→安达市'], foods: [{ name: '东北杀猪菜', price: '60-100元', mustTry: true, location: '农村' }] },

  // === 华东地区 ===
  '常州': { title: '常州·龙城', season: '四季皆宜', days: '2-3', tags: ['中华恐龙园','淹城','天宁寺'], poster: { style: 'fresh', subtitle: '中华恐龙园所在城市' }, routes: ['中华恐龙园→迪诺水镇→恐龙谷温泉', '淹城春秋乐园→天宁禅寺→红梅公园'], foods: [{ name: '银丝面', price: '15-25元', mustTry: true, location: '市区' }] },

  '徐州': { title: '徐州·彭城', season: '春秋最佳', days: '2-3', tags: ['汉文化','云龙湖','刘邦故里'], poster: { style: 'vintage', subtitle: '千古龙飞地 一代帝王乡' }, routes: ['云龙湖→云龙山→淮海战役纪念馆', '龟山汉墓→狮子山楚王陵→戏马台'], foods: [{ name: '徐州地锅鸡', price: '68-98元', mustTry: true, location: '市区' }] },

  '南通': { title: '南通·江海之城', season: '春秋最佳', days: '2-3', tags: ['濠河','狼山','张謇故居'], poster: { style: 'fresh', subtitle: '江海交汇 近代第一城' }, routes: ['濠河风景区→南通博物苑→狼山风景名胜区', '张謇故居→如皋水绘园'], foods: [{ name: '蟹黄包', price: '15-25元', mustTry: true, location: '如皋' }] },

  '连云港': { title: '连云港·海州', season: '夏季最佳', days: '2-3', tags: ['花果山','连岛','西游记'], poster: { style: 'fresh', subtitle: '孙悟空老家 海滨山城' }, routes: ['花果山→水帘洞→玉女峰', '连岛海滨浴场→海上云台山→渔湾'], foods: [{ name: '海鲜', price: '80-150元/人', mustTry: true, location: '海边' }] },

  '淮安': { title: '淮安·运河之都', season: '春秋最佳', days: '2-3', tags: ['周恩来故居','淮扬菜','运河文化'], poster: { style: 'vintage', subtitle: '运河之都 总理故乡' }, routes: ['周恩来纪念馆→周恩来故居→驸马巷', '淮安府署→河下古镇→里运河文化长廊'], foods: [{ name: '软兜长鱼', price: '48-78元', mustTry: true, location: '文楼' }] },

  '盐城': { title: '盐城·湿地之都',季节: '春秋最佳', days: '2-3', tags: ['麋鹿丹顶鹤','湿地','黄海湿地'], poster: { style: 'fresh', subtitle: '东方湿地之都 仙鹤神鹿世界' }, routes: ['中华麋鹿园→丹顶鹤湿地生态旅游区', '大丰荷兰花海→盐城海盐历史文化景区'], foods: [{ name: '东台鱼汤面', price: '15-25元', mustTry: true, location: '东台' }] },

  '扬州': { title: '扬州·广陵', season: '春季最佳（烟花三月）', days: '2-3', tags: ['瘦西湖','个园','何园'], poster: { style: 'fresh', subtitle: '烟花三月下扬州' }, routes: ['瘦西湖→大明寺→个园→何园→东关街', '扬州双博馆→汉陵苑→茱萸湾'], foods: [{ name: '扬州炒饭', price: '15-25元', mustTry: true, location: '富春茶社' }] },

  '镇江': { title: '镇江·润州', season: '春秋最佳', days: '1-2天', tags: ['金山寺','醋文化','三国'], poster: { style: 'vintage', subtitle: '城市山林 天下第一江山' }, routes: ['金山→焦山→北固山→西津渡古街', '中国醋文化博物馆→茅山'], foods: [{ name: '水晶肴肉', price: '38-58元', mustTry: true, location: '市区' }] },

  '泰州': { title: '泰州·凤城', season: '春秋最佳', days: '1-2天', tags: ['溱湖','凤城河','梅兰芳'], poster: { style: 'fresh', subtitle: '祥泰之州 江淮明珠' }, routes: ['溱湖国家湿地公园→溱潼古镇→千垛菜花', '凤城河风景区→梅园→望海楼'], foods: [{ name: '烫干丝', price: '10-15元', mustTry: true, location: '富春大酒店' }] },

  '宿迁': { title: '宿迁·项王故里', season: '春秋最佳', days: '1-2天', tags: ['项羽故里','骆马湖','洋河酒'], poster: { style: 'fresh', subtitle: '项羽故里 中国酒都' }, routes: ['项王故里→骆马湖→三台山国家森林公园', '洋河酒厂文化旅游区→洪泽湖湿地'], foods: [{ name: '水晶山楂糕', price: '10-15元', mustTry: true, location: '市区' }] },

  '嘉兴': { title: '嘉兴·禾城', season: '春季最佳', days: '1-2天', tags: ['南湖','乌镇','西塘'], poster: { style: 'fresh', subtitle: '鱼米之乡 丝绸之府' }, routes: ['南湖革命纪念馆→中共一大会址→月河历史街区', '乌镇→西塘→西塘古镇'], foods: [{ name: '粽子', price: '5-15元/只', mustTry: true, location: '五芳斋' }] },

  '湖州': { title: '湖州·菰城', season: '春秋最佳', days: '1-2天', tags: ['太湖','南浔古镇','莫干山'], poster: { style: 'fresh', subtitle: '太湖明珠 文化之邦' }, routes: ['太湖旅游度假区→南浔古镇→荻港古村', '莫干山→安吉竹博园→中南百草园'], foods: [{ name: '太湖三白', price: '80-150元', mustTry: true, location: '太湖边' }] },

  '绍兴': { title: '绍兴·越州', season: '春秋最佳', days: '2-3', tags: ['鲁迅故里','沈园','兰亭'], poster: { style: 'vintage', subtitle: '鲁迅故里 书圣故里' }, routes: ['鲁迅故里→沈园→东湖→会稽山', '兰亭→柯岩→安昌古镇'], foods: [{ name: '臭豆腐', price: '10-15元', mustTry: true, location: '鲁迅故里' }] },

  '金华': { title: '金华·婺州', season: '春秋最佳', days: '2-3', tags: ['横店影视城','义乌小商品','金华火腿'], poster: { style: 'fresh', subtitle: '影视之都 商贸之城' }, routes: ['横店影视城→清明上河图→秦王宫', '双龙洞→诸葛八卦村→义乌国际商贸城'], foods: [{ name: '金华火腿', price: '100-300元/只', mustTry: true, location: '市区' }] },

  '衢州': { title: '衢州·柯城', season: '春秋最佳', days: '1-2天', tags: ['孔氏南宗家庙','江郎山','辣味'], poster: { style: 'fresh', subtitle: '南孔圣地 衢州有礼' }, routes: ['孔氏南宗家庙→衢州古城墙→水亭门', '江郎山→廿八都古镇→龙游石窟'], foods: [{ name: '三头一掌', price: '30-50元', mustTry: true, location: '市区' }] },

  '舟山': { title: '舟山·海岛', season: '夏季最佳', days: '2-3', tags: ['普陀山','嵊泗列岛','海鲜'], poster: { style: 'fresh', subtitle: '海天佛国 渔都港城' }, routes: ['普陀山（普济寺→法雨寺→慧济寺）', '嵊泗列岛→基湖沙滩→东海渔村'], foods: [{ name: '梭子蟹', price: '50-100元/斤', mustTry: true, location: '海边' }] },

  '台州': { title: '台州·山海之城', season: '春秋最佳', days: '2-3', tags: ['天台山','神仙居','临海古城'], poster: { style: 'fresh', subtitle: '山海水城 和合圣地' }, routes: ['天台山国清寺→石梁飞瀑→琼台仙谷', '神仙居→临海紫阳古街→长屿硐天'], foods: [{ name: '嵌糕', price: '10-15元', mustTry: true, location: '温岭' }] },

  '丽水': { title: '丽水·浙南林海', season: '全年适宜', days: '2-3', tags: ['缙云仙都','古堰画乡','畲族风情'], poster: { style: 'fresh', subtitle: '浙江绿谷 秀山丽水' }, routes: ['缙云仙都→古堰画乡→云和梯田', '龙泉青瓷小镇→景宁畲族自治县'], foods: [{ name: '缙云烧饼', price: '8-12元', mustTry: true, location: '缙云' }] },

  '芜湖': { title: '芜湖·江城', season: '春秋最佳', days: '1-2天', tags: ['方特欢乐世界','赭山','长江'], poster: { style: 'fresh', subtitle: '长江巨埠 皖之中坚' }, routes: ['方特欢乐世界→方特梦幻王国→方特东方神画', '赭山公园→鸠兹古镇→滨江公园'], foods: [{ name: '芜湖虾子面', price: '15-25元', mustTry: true, location: '耿福兴' }] },

  '蚌埠': { title: '蚌埠·珠城', season: '春秋最佳', days: '1-2天', tags: ['淮河','涂山','禹会诸侯'], poster: { style: 'fresh', subtitle: '淮河明珠 禹会诸侯地' }, routes: ['张公山公园→蚌埠闸→涂山→禹王宫', '蚌埠博物馆→龙子湖风景区'], foods: [{ name: '烧饼夹里脊', price: '8-12元', mustTry: true, location: '市区' }] },

  '淮南': { title: '淮南·能源城', season: '春秋最佳', days: '1-2天', tags: ['八公山','豆腐发源地','淮南王'], poster: { style: 'fresh', subtitle: '中州咽喉 江南屏障' }, routes: ['八公山→寿县古城→淮南王墓→刘安墓', '舜耕山→龙湖公园→焦岗湖'], foods: [{ name: '淮南牛肉汤', price: '15-25元', mustTry: true, location: '市区' }] },

  '马鞍山': { title: '马鞍山·诗城', season: '春秋最佳', days: '1-2天', tags: ['采石矶','李白','钢铁'], poster: { style: 'fresh', subtitle: '诗城马鞍山 钢铁之都' }, routes: ['采石矶→李白墓→太白楼→三元洞', '濮塘风景区→褒禅山→含山'], foods: [{ name: '采石茶干', price: '10-15元', mustTry: true, location: '采石' }] },

  '淮北': { title: '淮北·煤城', season: '春秋最佳', days: '1-2天', tags: ['相山','隋唐大运河','口子窖'], poster: { style: 'minimal', subtitle: '运河故里 能源之都' }, routes: ['相山公园→隋唐大运河博物馆→淮北博物馆', '临涣古镇→口子窖工业园'], foods: [{ name: '淮北面皮', price: '8-12元', mustTry: true, location: '市区' }] },

  '铜陵': { title: '铜陵·铜都', season: '春秋最佳', days: '1-2天', tags: ['铜文化','天井湖','大通古镇'], poster: { style: 'minimal', subtitle: '中国古铜都 当代铜基地' }, routes: ['铜陵博物馆→天井湖→大通古镇→浮山', '凤凰山→旗山汉武文化生态园'], foods: [{ name: '白荡湖大闸蟹', price: '50-80元/只', mustTry: true, location: '枞阳' }] },

  '安庆': { title: '安庆·宜城', season: '春秋最佳', days: '1-2天', tags: ['天柱山','迎江寺','黄梅戏'], poster: { style: 'fresh', subtitle: '文化之邦 戏曲之乡' }, routes: ['天柱山→山谷流泉→石牛古洞', '迎江寺振风塔→菱湖公园→独秀园'], foods: [{ name: '安庆胡玉美蚕豆酱', price: '10-15元/瓶', mustTry: true, location: '市区' }] },

  '黄山': { title: '黄山·徽州', season: '春秋最佳', days: '2-3', tags: ['黄山','宏村','徽派建筑'], poster: { style: 'fresh', subtitle: '五岳归来不看山 黄山归来不看岳' }, routes: ['黄山（光明顶→始信峰→迎客松→西海大峡谷）', '宏村→西递→屯溪老街→徽州古城'], foods: [{ name: '臭鳜鱼', price: '58-88元', mustTry: true, location: '屯溪' }] },

  '滁州': { title: '滁州·醉翁亭', season: '春秋最佳', days: '1-2天', tags: ['醉翁亭','琅琊山','明皇陵'], poster: { style: 'fresh', subtitle: '环滁皆山也 醉翁之意不在酒' }, routes: ['醉翁亭→琅琊山→深秀湖→同乐亭', '明皇陵→凤阳明中都鼓楼'], foods: [{ name: '滁州酿豆腐', price: '28-48元', mustTry: true, location: '市区' }] },

  '阜阳': { title: '阜阳·颍州', season: '春秋最佳', days: '1-2天', tags: ['颍州西湖','管仲故里','皖北重镇'], poster: { style: 'fresh', subtitle: '百亿粮仓 大美阜阳' }, routes: ['颍州西湖→生态乐园→八里河', '管仲老街→阜阳市博物馆'], foods: [{ name: '格拉条', price: '5-8元', mustTry: true, location: '市区' }] },

  '宿州': { title: '宿州·埇桥', season: '春秋最佳', days: '1-2天', tags: ['皇藏峪','砀山梨','隋唐运河'], poster: { style: 'fresh', subtitle: '果海粮仓 能源之都' }, routes: ['皇藏峪国家森林公园→砀山梨园', '隋唐大运河宿州段→灵璧奇石文化园'], foods: [{ name: '符离集烧鸡', price: '30-50元/只', mustTry: true, location: '符离集' }] },

  '六安': { title: '六安·皋城', season: '春秋最佳', days: '1-2天', tags: ['天堂寨','万佛湖','大别山'], poster: { style: 'fresh', subtitle: '革命老区 绿色六安' }, routes: ['天堂寨→燕子河大峡谷→白马大峡谷', '万佛湖→皖西大裂谷→霍山'], foods: [{ name: '六安瓜片', price: '100-300元/斤', mustTry: true, location: '金寨' }] },

  '亳州': { title: '亳州·药都', season: '春秋最佳', days: '1-2天', tags: ['曹操故里','华佗','中药材'], poster: { style: 'vintage', subtitle: '中华药都 曹操故里' }, routes: ['曹操运兵道→华祖庵→花戏楼→亳州古城', '亳州中药材市场→庄子祠'], foods: [{ name: '亳州牛肉馍', price: '15-25元', mustTry: true, location: '市区' }] },

  '池州': { title: '池州·秋浦', season: '春秋最佳', days: '1-2天', tags: ['九华山','杏花村','李白'], poster: { style: 'fresh', subtitle: '佛国九华 诗意池州' }, routes: ['九华山（化城寺→肉身宝殿→百岁宫）', '杏花村→平天湖→秋浦河'], foods: [{ name: '九华山素斋', price: '30-50元/人', mustTry: true, location: '九华山' }] },

  '宣城': { title: '宣城·宣州', season: '春秋最佳', days: '1-2天', tags: ['敬亭山','桃花潭','宣纸'], poster: { style: 'fresh', subtitle: '中国文房四宝之乡' }, routes: ['敬亭山→宣城博物馆→谢朓楼', '桃花潭→查济古村→绩溪龙川'], foods: [{ name: '宣城鸭脚包', price: '15-25元', mustTry: true, location: '水东' }] },

  '漳州': { title: '漳州·海滨邹鲁', season: '春秋最佳', days: '2-3', tags: ['土楼','云洞岩','海峡两岸'], poster: { style: 'fresh', subtitle: '海滨邹鲁 花果之乡' }, routes: ['南靖土楼（田螺坑→裕昌楼→和贵楼）', '云洞岩→东山岛→漳浦火山岛'], foods: [{ name: '卤面', price: '15-25元', mustTry: true, location: '市区' }] },

  '泉州': { title: '泉州·刺桐城', season: '春秋最佳', days: '2-3', tags: ['开元寺','清净寺','海上丝绸之路'], poster: { style: 'vintage', subtitle: '半城烟火半城仙' }, routes: ['开元寺→清净寺→关帝庙→洛阳桥', '西街→中山路→清源山→老君岩'], foods: [{ name: '土笋冻', price: '15-25元', mustTry: true, location: '西街' }] },

  '莆田': { title: '莆田·荔城', season: '春秋最佳', days: '1-2天', tags: ['湄洲岛','妈祖文化','南少林'], poster: { style: 'fresh', subtitle: '妈祖故里 荔枝之乡' }, routes: ['湄洲岛妈祖祖庙→鹅尾神石园', '南少林寺→广化寺→木兰陂'], foods: [{ name: '莆田卤面', price: '20-30元', mustTry: true, location: '市区' }] },

  '三明': { title: '三明·绿都', season: '全年适宜', days: '2-3', tags: ['泰宁丹霞','大金湖','客家文化'], poster: { style: 'fresh', subtitle: '中国绿都 客家祖地' }, routes: ['泰宁古城→大金湖→寨下大峡谷→上清溪', '玉华洞→桃源洞→鳞隐石林'], foods: [{ name: '沙县小吃', price: '10-20元', mustTry: true, location: '沙县' }] },

  '龙岩': { title: '龙岩·闽西', season: '春秋最佳', days: '2-3', tags: ['永定土楼','古田会议','客家土楼'], poster: { style: 'fresh', subtitle: '客家祖地 红色摇篮' }, routes: ['永定土楼（承启楼→振成楼→奎聚楼）', '古田会议旧址→冠豸山→培田古民居'], foods: [{ name: '长汀米粉', price: '10-15元', mustTry: true, location: '长汀' }] },

  '宁德': { title: '宁德·闽东', season: '春秋最佳', days: '2-3', tags: ['太姥山','白水洋','霞浦滩涂'], poster: { style: 'fresh', subtitle: '山海宁德 滩涂摄影天堂' }, routes: ['太姥山→嵛山岛→小白鹭沙滩', '白水洋→鸳鸯溪→霞浦滩涂'], foods: [{ name: '大黄鱼', price: '50-100元/条', mustTry: true, location: '霞浦' }] },

  '景德镇': { title: '景德镇·瓷都', season: '春秋最佳', days: '2-3', tags: ['陶瓷','古窑民俗博览区','瑶里'], poster: { style: 'vintage', subtitle: '千年瓷都 世界陶瓷圣地' }, routes: ['古窑民俗博览区→陶瓷博物馆→御窑厂', '瑶里古镇→三宝陶艺村→雕塑瓷厂'], foods: [{ name: '冷粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '萍乡': { title: '萍乡·赣西', season: '春秋最佳', days: '1-2天', tags: ['武功山','秋收起义','安源'], poster: { style: 'fresh', subtitle: '赣西明珠 工运摇篮' }, routes: ['武功山（金顶→高山草甸→星空露营）', '安源路矿工人运动纪念馆→秋收起义纪念碑'], foods: [{ name: '萍乡炒粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '九江': { title: '九江·浔阳', season: '春秋最佳', days: '2-3', tags: ['庐山','鄱阳湖','白鹿洞'], poster: { style: 'fresh', subtitle: '匡庐奇秀甲天下' }, routes: ['庐山（牯岭→花径→锦绣谷→三叠泉）', '鄱阳湖候鸟保护区→白鹿洞书院→浔阳楼'], foods: [{ name: '庐山三石', price: '60-100元', mustTry: true, location: '庐山' }] },

  '新余': { title: '新余·钢城', season: '春秋最佳', days: '1-2天', tags: ['仙女湖','抱石公园','钢铁'], poster: { style: 'minimal', subtitle: '钢铁之城 仙女湖畔' }, routes: ['仙女湖→抱石公园→孔目江湿地公园', '昌坊度假村→罗坊会议纪念馆'], foods: [{ name: '新余麻辣烫', price: '15-25元', mustTry: true, location: '市区' }] },

  '鹰潭': { title: '鹰潭·道都', season: '春秋最佳', days: '1-2天', tags: ['龙虎山','天师府','道教'], poster: { style: 'fresh', subtitle: '道教祖庭 龙虎仙境' }, routes: ['龙虎山（正一观→天师府→上清古镇→悬棺表演）', '鹰潭公园→龙虎山游客中心'], foods: [{ name: '鹰潭牛肉粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '赣州': { title: '赣州·虔城', season: '春秋最佳', days: '2-3', tags: ['宋城墙','通天岩','客家摇篮'], poster: { style: 'vintage', subtitle: '江南宋城 客家摇篮' }, routes: ['赣州古城墙→通天岩→郁孤台→八境台', '瑞金共和国摇篮→于都长征出发地'], foods: [{ name: '赣南脐橙', price: '5-10元/斤', mustTry: true, location: '信丰' }] },

  '吉安': { title: '吉安·庐陵', season: '春秋最佳', days: '1-2天', tags: ['井冈山','白鹭洲书院','庐陵文化'], poster: { style: 'vintage', subtitle: '红色摇篮 庐陵文化' }, routes: ['井冈山（茨坪→黄洋界→八角楼→龙潭）', '白鹭洲书院→吉安市博物馆→青原山'], foods: [{ name: '井冈山红军菜', price: '30-50元', mustTry: true, location: '井冈山' }] },

  '宜春': { title: '宜春·袁州', season: '春秋最佳', days: '1-2天', tags: ['明月山','温汤温泉','禅宗'], poster: { style: 'fresh', subtitle: '月亮之都 温泉之城' }, routes: ['明月山→温汤镇（硒温泉）→羊狮慕', '酌江溶洞→飞剑潭→慈化寺'], foods: [{ name: '宜春扎粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '抚州': { title: '抚州·才子之乡', season: '春秋最佳', days: '1-2天', tags: ['汤显祖','文昌里','傩舞'], poster: { style: 'vintage', subtitle: '才子之乡 文化之邦' }, routes: ['文昌里历史文化街区→汤显祖纪念馆→王安石纪念馆', '资溪大觉山→南丰蜜桔园→乐安流坑古村'], foods: [{ name: '抚州泡粉', price: '8-12元', mustTry: true, location: '市区' }] },

  '上饶': { title: '上饶·信州', season: '春秋最佳', days: '2-3', tags: ['婺源','三清山','龟峰'], poster: { style: 'fresh', subtitle: '豫章第一门户 上乘富饶' }, routes: ['婺源（江湾→李坑→晓起→篁岭油菜花）', '三清山（南清园→三清宫→阳光海岸）→龟峰'], foods: [{ name: '上饶鸡腿', price: '10-15元', mustTry: true, location: '市区' }] },

  '威海': { title: '威海·卫城', season: '夏季最佳', days: '2-3', tags: ['刘公岛','幸福门','海滨'], poster: { style: 'fresh', subtitle: '最干净的海滨城市' }, routes: ['刘公岛→定远舰→中国甲午战争博物馆', '幸福门→环翠楼公园→国际海水浴场'], foods: [{ name: '威海海鲜', price: '80-150元/人', mustTry: true, location: '海边' }] },

  '烟台': { title: '烟台·港城', season: '夏季最佳', days: '2-3', tags: ['蓬莱阁','长岛','苹果'], poster: { style: 'fresh', subtitle: '人间仙境 葡萄酒城' }, routes: ['蓬莱阁→八仙过海景区→三仙山', '长岛→九丈崖→月牙湾→烽山林海'], foods: [{ name: '烟台苹果', price: '5-10元/斤', mustTry: true, location: '栖霞' }] },

  '潍坊': { title: '潍坊·鸢都', season: '春季最佳（风筝节）', days: '1-2天', tags: ['风筝','杨家埠年画','潍坊萝卜'], poster: { style: 'fresh', subtitle: '世界风筝之都' }, routes: ['潍坊风筝博物馆→杨家埠民间艺术大观园', '十笏园→青州古城→沂山'], foods: [{ name: '朝天锅', price: '25-40元', mustTry: true, location: '市区' }] },

  '济宁': { title: '济宁·运河之都', season: '春秋最佳', days: '1-2天', tags: ['曲阜三孔','微山湖','儒家文化'], poster: { style: 'vintage', subtitle: '孔孟之乡 运河之都' }, routes: ['曲阜三孔（孔庙→孔府→孔林）→孔子六艺城', '微山湖→铁道游击队纪念园→水泊梁山'], foods: [{ name: '济宁甏肉干饭', price: '20-30元', mustTry: true, location: '市区' }] },

  '泰安': { title: '泰安·岱宗', season: '春秋最佳', days: '1-2天', tags: ['泰山','岱庙','封禅大典'], poster: { style: 'vintage', subtitle: '五岳独尊 泰山安则四海安' }, routes: ['泰山（红门→中天门→南天门→玉皇顶→日观峰）', '岱庙→灵岩寺→徂徕山'], foods: [{ name: '泰山煎饼卷大葱', price: '8-12元', mustTry: true, location: '泰山脚下' }] },

  '淄博': { title: '淄博·齐国故都', season: '春秋最佳', days: '1-2天', tags: ['周村古商城','蒲松龄故居','烧烤'], poster: { style: 'vintage', subtitle: '齐国故都 聊斋故里' }, routes: ['周村古商城→蒲松龄故居→聊斋城', '原山国家森林公园→博山溶洞'], foods: [{ name: '淄博烧烤', price: '50-80元/人', mustTry: true, location: '市区' }] },

  '德州': { title: '德州·九达天衢', season: '春秋最佳', days: '1-2天', tags: ['德州扒鸡','苏禄王墓','太阳能'], poster: { style: 'fresh', subtitle: '九达天衢 神京门户' }, routes: ['苏禄王墓→德州扒鸡博物馆→减河湿地', '庆云海岛金山寺→夏津黄河故道'], foods: [{ name: '德州扒鸡', price: '30-50元/只', mustTry: true, location: '市区' }] },

  '聊城': { title: '聊城·江北水城', season: '春秋最佳', days: '1-2天', tags: ['东昌湖','光岳楼','水浒文化'], poster: { style: 'fresh', subtitle: '江北水城 运河古都' }, routes: ['东昌湖→光岳楼→山陕会馆→孔繁森纪念馆', '景阳冈→狮子楼→东阿阿胶城'], foods: [{ name: '呱嗒', price: '5-8元', mustTry: true, location: '市区' }] },

  '临沂': { title: '临沂·琅琊', season: '春秋最佳', days: '2-3', tags: ['蒙山','沂蒙山','书法'], poster: { style: 'fresh', subtitle: '琅琊故里 沂蒙精神' }, routes: ['蒙山（龟蒙顶→云蒙峰→天蒙景区）', '沂蒙山旅游区→竹泉村→地下大峡谷'], foods: [{ name: '临沂糁', price: '8-12元', mustTry: true, location: '市区' }] },

  '菏泽': { title: '菏泽·牡丹之都', season: '春季最佳（4月）', days: '1-2天', tags: ['曹州牡丹园','水浒传','戏曲'], poster: { style: 'fresh', subtitle: '中国牡丹之都 武术之乡' }, routes: ['曹州牡丹园→古今园→百花园', '水浒好汉城→孙膑旅游城→单县浮龙湖'], foods: [{ name: '单县羊肉汤', price: '20-35元', mustTry: true, location: '单县' }] },

  '日照': { title: '日照·东方太阳城', season: '夏季最佳', days: '1-2天', tags: ['万平口海滨','五莲山','绿茶'], poster: { style: 'fresh', subtitle: '东方太阳城 水上运动之都' }, routes: ['万平口海滨风景区→灯塔风景区→日照海洋公园', '五莲山→九仙山→莒县浮来山'], foods: [{ name: '日照海鲜', price: '80-150元/人', mustTry: true, location: '海边' }] },

  '莱芜': { title: '莱芜·钢城', season: '春秋最佳', days: '1-2天', tags: ['雪野湖','齐长城','姜尚故里'], poster: { style: 'fresh', subtitle: '钢城莱芜 齐鲁要冲' }, routes: ['雪野湖→雪野三峡→房干生态景区', '齐长城遗址→莱芜战役纪念馆'], foods: [{ name: '莱芜炒鸡', price: '50-80元', mustTry: true, location: '市区' }] },

  '临沂': { title: '临沂·琅琊', season: '春秋最佳', days: '2-3', tags: ['蒙山','沂蒙山','书法'], poster: { style: 'fresh', subtitle: '琅琊故里 沂蒙精神' }, routes: ['蒙山（龟蒙顶→云蒙峰→天蒙景区）', '沂蒙山旅游区→竹泉村→地下大峡谷'], foods: [{ name: '临沂糁', price: '8-12元', mustTry: true, location: '市区' }] },

  '开封': { title: '开封·汴梁', season: '春秋最佳', days: '2-3', tags: ['清明上河园','开封府','大相国寺'], poster: { style: 'vintage', subtitle: '八朝古都 东京梦华' }, routes: ['清明上河园→开封府→大相国寺→龙亭公园', '铁塔→繁塔→包公祠→开封小吃街'], foods: [{ name: '灌汤包', price: '15-25元', mustTry: true, location: '第一楼' }] },

  '洛阳': { title: '洛阳·神都', season: '春秋最佳', days: '2-3', tags: ['龙门石窟','白马寺','牡丹'], poster: { style: 'vintage', subtitle: '十三朝古都 牡丹花城' }, routes: ['龙门石窟→白马寺→关林→洛阳博物馆', '老城区→丽景门→洛邑古城→王城公园'], foods: [{ name: '洛阳水席', price: '80-150元/桌', mustTry: true, location: '真不同饭店' }] },

  '平顶山': { title: '平顶山·鹰城', season: '春秋最佳', days: '1-2天', tags: ['尧山','中原大佛','汝瓷'], poster: { style: 'fresh', subtitle: '中原煤都 尧山胜境' }, routes: ['尧山（石人山）→中原大佛→画眉谷', '汝窑遗址→郏县三苏园→叶县县衙'], foods: [{ name: '郏县豆腐菜', price: '10-15元', mustTry: true, location: '郏县' }] },

  '安阳': { title: '安阳·殷商古都', season: '春秋最佳', days: '1-2天', tags: ['殷墟','红旗渠','甲骨文'], poster: { style: 'vintage', subtitle: '殷商古都 甲骨文之乡' }, routes: ['殷墟宫殿宗庙遗址→殷墟王陵遗址→殷墟博物馆', '红旗渠→太行大峡谷→羑里城'], foods: [{ name: '安阳烩菜', price: '20-30元', mustTry: true, location: '市区' }] },

  '鹤壁': { title: '鹤壁·朝歌', season: '春秋最佳', days: '1天', tags: ['浚县古城','云梦山','淇河'], poster: { style: 'fresh', subtitle: '诗经之城 鹤壁朝歌' }, routes: ['浚县古城（大伾山→浮丘山→古城墙）', '云梦山→淇河→纣王墓'], foods: [{ name: '浚县子馍', price: '5-8元', mustTry: true, location: '浚县' }] },

  '新乡': { title: '新乡·牧野', season: '春秋最佳', days: '1-2天', tags: ['八里沟','郭亮村','比干庙'], poster: { style: 'fresh', subtitle: '牧野大地 太行之魂' }, routes: ['八里沟→万仙山→郭亮村挂壁公路', '比干庙→潞王陵→京华园'], foods: [{ name: '新乡红焖羊肉', price: '60-100元', mustTry: true, location: '市区' }] },

  '焦作': { title: '焦作·山阳', season: '春秋最佳', days: '1-2天', tags: ['云台山','太极拳','陈家沟'], poster: { style: 'fresh', subtitle: '太极故里 山水焦作' }, routes: ['云台山（红石峡→潭瀑峡→猕猴谷→茱萸峰）', '陈家沟太极拳发源地→青天河→青龙峡'], foods: [{ name: '武陟油茶', price: '8-12元', mustTry: true, location: '武陟' }] },

  '濮阳': { title: '濮阳·龙都', season: '春秋最佳', days: '1天', tags: ['戚城','中华第一龙','杂技'], poster: { style: 'vintage', subtitle: '中华龙都 杂技之乡' }, routes: ['戚城文物景区→中华第一龙出土地→濮阳博物馆', '东北庄杂技之乡→毛楼生态旅游区'], foods: [{ name: '裹凉皮', price: '5-8元', mustTry: true, location: '市区' }] },

  '许昌': { title: '许昌·莲城', season: '春秋最佳', days: '1-2天', tags: ['曹丞相府','灞陵桥','钧瓷'], poster: { style: 'vintage', subtitle: '三国文化名城 莲城许昌' }, routes: ['曹丞相府→春秋楼→灞陵桥→灞陵桥景区', '钧官窑址博物馆→神垕古镇→鄢陵花博园'], foods: [{ name: '许昌腐竹', price: '10-15元', mustTry: true, location: '市区' }] },

  '漯河': { title: '漯河·食品名城', season: '春秋最佳', days: '1天', tags: ['南街村','小商桥','双汇'], poster: { style: 'minimal', subtitle: '中国食品名城 字圣故里' }, routes: ['南街村→小商桥→许慎文化园', '开源森林公园→沙澧河风景区'], foods: [{ name: '北舞渡胡辣汤', price: '8-12元', mustTry: true, location: '舞阳' }] },

  '三门峡': { title: '三门峡·天鹅之城', season: '冬季（看天鹅）/春秋', days: '1-2天', tags: ['函谷关','三门峡大坝','虢国墓地'], poster: { style: 'fresh', subtitle: '黄河明珠 天鹅之城' }, routes: ['函谷关→三门峡大坝→黄河公园→天鹅湖', '虢国博物馆→陕州地坑院→仰韶文化遗址'], foods: [{ name: '灵宝苹果', price: '5-10元/斤', mustTry: true, location: '灵宝' }] },

  '南阳': { title: '南阳·宛城', season: '春秋最佳', days: '1-2天', tags: ['卧龙岗','内乡县衙','医圣祠'], poster: { style: 'vintage', subtitle: '医圣故里 玉雕之乡' }, routes: ['卧龙岗武侯祠→医圣祠→汉画馆', '内乡县衙→宝天曼→丹江口水库'], foods: [{ name: '南阳牛肉面', price: '15-25元', mustTry: true, location: '市区' }] },

  '商丘': { title: '商丘·归德', season: '春秋最佳', days: '1-2天', tags: ['商丘古城','燧皇陵','火神台'], poster: { style: 'vintage', subtitle: '华商之源 火种诞生地' }, routes: ['商丘古城（归德府城墙→侯恂故居→穆氏四合堂）', '燧皇陵→火神台→阏伯台'], foods: [{ name: '商丘水煎包', price: '8-12元', mustTry: true, location: '市区' }] },

  '信阳': { title: '信阳·申城', season: '春秋最佳', days: '1-2天', tags: ['鸡公山','南湾湖','信阳毛尖'], poster: { style: 'fresh', subtitle: '北国江南 茶都信阳' }, routes: ['鸡公山→南湾湖→灵山→郝堂村', '信阳毛尖茶园→鄂豫皖苏区首府革命博物馆'], foods: [{ name: '信阳炖菜', price: '30-50元', mustTry: true, location: '市区' }] },

  '周口': { title: '周口·陈州', season: '春秋最佳', days: '1天', tags: ['太昊伏羲陵','老子故里','淮阳'], poster: { style: 'vintage', subtitle: '华夏先驱 九州圣迹' }, routes: ['太昊伏羲陵→淮阳龙湖→弦歌台', '老子故里（鹿邑太清宫）→明道宫→周口市博物馆'], foods: [{ name: '逍遥镇胡辣汤', price: '8-12元', mustTry: true, location: '西华' }] },

  '驻马店': { title: '驻马店·天中', season: '春秋最佳', days: '1天', tags: ['嵖岈山','南海禅寺','梁祝故里'], poster: { style: 'fresh', subtitle: '天中之地 豫南门户' }, routes: ['嵖岈山（《西游记》取景地）→南海禅寺→薄山湖', '梁祝故里→确山竹沟→老乐山'], foods: [{ name: '驻马店小磨香油', price: '15-25元/瓶', mustTry: true, location: '市区' }] },

  '济源': { title: '济源·愚公故里', season: '春秋最佳', days: '1-2天', tags: ['王屋山','小浪底','济渎庙'], poster: { style: 'fresh', subtitle: '愚公移山 济水之源' }, routes: ['王屋山（愚公移山处）→小浪底水利枢纽→黄河三峡', '济渎庙→五龙口→阳台宫'], foods: [{ name: '济源土馍', price: '10-15元', mustTry: true, location: '市区' }] },

  // === 华中地区 ===
  '黄石': { title: '黄石·矿冶之都', season: '春秋最佳', days: '1-2天', tags: ['磁湖','东方山','矿冶文化'], poster: { style: 'fresh', subtitle: '矿冶之都 黄金山麓' }, routes: ['磁湖风景区→东方山→团城山公园', '黄石国家矿山公园→铜绿山古铜矿遗址'], foods: [{ name: '黄石港饼', price: '10-15元', mustTry: true, location: '市区' }] },

  '十堰': { title: '十堰·车城', season: '春秋最佳', days: '2-3', tags: ['武当山','丹江口','汽车城'], poster: { style: 'fresh', subtitle: '仙山秀水 汽车之城' }, routes: ['武当山（金殿→南岩宫→紫霄宫→太子坡）', '丹江口水库→太极峡→野人洞'], foods: [{ name: '武当道斋', price: '30-50元/人', mustTry: true, location: '武当山' }] },

  '宜昌': { title: '宜昌·水电之都', season: '春秋最佳', days: '2-3', tags: ['三峡大坝','清江画廊','屈原故里'], poster: { style: 'fresh', subtitle: '水电之都 屈原故里' }, routes: ['三峡大坝→三峡人家→葛洲坝', '清江画廊→屈原故里→神农溪'], foods: [{ name: '宜昌凉虾', price: '5-8元', mustTry: true, location: '市区' }] },

  '襄阳': { title: '襄阳·襄阳城', season: '春秋最佳', days: '2-3', tags: ['襄阳古城','隆中对','三国'], poster: { style: 'vintage', subtitle: '华夏第一城池 三国文化名城' }, routes: ['襄阳古城（夫人城→临汉门→昭明台）→护城河', '隆中诸葛亮故居→古隆中→米公祠'], foods: [{ name: '襄阳牛肉面', price: '15-25元', mustTry: true, location: '市区' }] },

  '鄂州': { title: '鄂州·吴都', season: '春秋最佳', days: '1天', tags: ['西山','梁子湖','武昌鱼'], poster: { style: 'fresh', subtitle: '百湖之市 吴王古都' }, routes: ['西山风景区→莲花山→观音阁', '梁子湖→武昌鱼产地→沼山'], foods: [{ name: '武昌鱼', price: '38-68元/条', mustTry: true, location: '梁子湖' }] },

  '荆门': { title: '荆门·荆楚门户', season: '春秋最佳', days: '1-2天', tags: ['明显陵','漳河','屈家岭'], poster: { style: 'fresh', subtitle: '荆楚门户 汉江明珠' }, routes: ['明显陵（世界文化遗产）→黄仙洞→漳河风景区', '屈家岭遗址→京山绿林山→钟祥莫愁湖'], foods: [{ name: '蟠龙菜', price: '38-58元', mustTry: true, location: '钟祥' }] },

  '孝感': { title: '孝感·董永故里', season: '春秋最佳', days: '1天', tags: ['董永公园','双峰山','孝文化'], poster: { style: 'fresh', subtitle: '董永故里 孝感动天' }, routes: ['董永公园→孝感博物馆→后湖公园', '双峰山国家森林公园→天紫湖温泉'], foods: [{ name: '孝感麻糖', price: '15-25元/盒', mustTry: true, location: '市区' }] },

  '荆州': { title: '荆州·江陵', season: '春秋最佳', days: '1-2天', tags: ['荆州古城','关羽','三国'], poster: { style: 'vintage', subtitle: '三国故地 荆楚文化' }, routes: ['荆州古城墙→荆州博物馆→关帝庙→张居正故居', '洈水风景区→洪湖蓝田生态区'], foods: [{ name: '荆州鱼糕', price: '28-48元', mustTry: true, location: '市区' }] },

  '黄冈': { title: '黄冈·黄州', season: '春秋最佳', days: '1-2天', tags: ['赤壁','大别山','东坡赤壁'], poster: { style: 'vintage', subtitle: '赤壁怀古 东坡遗风' }, routes: ['东坡赤壁→遗爱湖→安国寺', '大别山主峰天堂寨→薄刀峰→龟峰山'], foods: [{ name: '黄州东坡肉', price: '38-58元', mustTry: true, location: '市区' }] },

  '咸宁': { title: '咸宁·香城泉都', season: '春秋最佳', days: '1-2天', tags: ['温泉','九宫山','桂花'], poster: { style: 'fresh', subtitle: '香城泉都 温泉之乡' }, routes: ['咸宁温泉（碧桂园→三江森林温泉→太乙温泉）', '九宫山→潜山国家森林公园→桂花源'], foods: [{ name: '贺胜桥鸡汤', price: '30-50元', mustTry: true, location: '咸安区' }] },

  '随州': { title: '随州·神农故里', season: '春秋最佳', days: '1-2天', tags: ['炎帝神农故里','大洪山','编钟'], poster: { style: 'vintage', subtitle: '炎帝神农故里 编钟之乡' }, routes: ['炎帝神农故里→随州博物馆→曾侯乙墓（编钟）', '大洪山→西游记漂流→银杏谷'], foods: [{ name: '随州春卷', price: '10-15元', mustTry: true, location: '市区' }] },

  '株洲': { title: '株洲·动力之都', season: '春秋最佳', days: '1-2天', tags: ['炎帝陵','神农谷','火车'], poster: { style: 'minimal', subtitle: '动力之都 火车拉来的城市' }, routes: ['炎帝陵→神农谷国家森林公园→酒埠江', '方特欢乐世界→神农城→湘江风光带'], foods: [{ name: '株洲嗦粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '湘潭': { title: '湘潭·莲城', season: '春秋最佳', days: '1-2天', tags: ['韶山毛泽东故居','彭德怀故居','湘潭大学'], poster: { style: 'vintage', subtitle: '伟人故里 红色圣地' }, routes: ['韶山毛泽东同志故居→毛泽东铜像广场→滴水洞', '彭德怀纪念馆→昭山→湘潭大学'], foods: [{ name: '湘潭槟榔', price: '10-20元/包', mustTry: false, location: '市区' }] },

  '衡阳': { title: '衡阳·雁城', season: '春秋最佳', days: '1-2天', tags: ['南岳衡山','石鼓书院','抗战名城'], poster: { style: 'fresh', subtitle: '雁城衡阳 南岳独秀' }, routes: ['南岳衡山（祝融峰→南岳大庙→藏经殿→磨镜台）', '石鼓书院→回雁峰→陆家新屋'], foods: [{ name: '衡阳鱼粉', price: '15-25元', mustTry: true, location: '市区' }] },

  '邵阳': { title: '邵阳·宝庆', season: '春秋最佳', days: '1-2天', tags: ['崀山','南山牧场','苗族风情'], poster: { style: 'fresh', subtitle: '崀山丹霞 宝庆古城' }, routes: ['崀山（辣椒峰→骆驼峰→天一巷→八角寨）', '南山牧场→白水洞→花瑶古寨'], foods: [{ name: '邵阳猪血丸子', price: '15-25元', mustTry: true, location: '隆回' }] },

  '岳阳': { title: '岳阳·巴陵', season: '春秋最佳', days: '1-2天', tags: ['岳阳楼','洞庭湖','君山岛'], poster: { style: 'vintage', subtitle: '洞庭天下水 岳阳天下楼' }, routes: ['岳阳楼→洞庭湖→君山岛→汴河街', '张谷英古村→屈子祠→左宗棠纪念馆'], foods: [{ name: '岳阳小龙虾', price: '50-80元/斤', mustTry: true, location: '洞庭湖' }] },

  '张家界': { title: '张家界·奇峰三千', season: '春秋最佳', days: '3-4', tags: ['张家界国家森林公园','天门山','玻璃栈道'], poster: { style: 'fresh', subtitle: '峰迷世界 张家界' }, routes: ['张家界国家森林公园（袁家界→天子山→十里画廊→金鞭溪）', '天门山（天门洞→玻璃栈道→天门山索道）→大峡谷'], foods: [{ name: '土家三下锅', price: '48-78元', mustTry: true, location: '市区' }] },

  '益阳': { title: '益阳·银城', season: '春秋最佳', days: '1天', tags: ['桃花江','安化黑茶','洞庭湖'], poster: { style: 'fresh', subtitle: '银城益阳 黑茶之乡' }, routes: ['桃花江→安化黑茶文化产业园→茶马古道', '洞庭湖南部→沅江市'], foods: [{ name: '益阳松花蛋', price: '1-2元/个', mustTry: true, location: '沅江' }] },

  '常德': { title: '常德·柳城', season: '春秋最佳', days: '1-2天', tags: ['桃花源','柳叶湖','常德米粉'], poster: { style: 'fresh', subtitle: '桃花源里的城市' }, routes: ['桃花源（桃花源古镇→秦谷→五柳湖）→柳叶湖', '常德诗墙→城头山古文化遗址→夹山寺'], foods: [{ name: '常德米粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '娄底': { title: '娄底·湘中明珠', season: '春秋最佳', days: '1天', tags: ['曾国藩故居','紫鹊界梯田','梅山龙宫'], poster: { style: 'fresh', subtitle: '湘中明珠 梅山文化' }, routes: ['曾国藩故居（富厚堂）→紫鹊界梯田→梅山龙宫', '湄江→波月洞→大熊山'], foods: [{ name: '新化三合汤', price: '20-30元', mustTry: true, location: '新化' }] },

  '郴州': { title: '郴州·林中之城', season: '春秋最佳', days: '1-2天', tags: ['东江湖','莽山','小东江'], poster: { style: 'fresh', subtitle: '林中之城 福地郴州' }, routes: ['东江湖（雾漫小东江→龙景峡谷→兜率岛）', '莽山国家森林公园→高椅岭→飞天山'], foods: [{ name: '栖凤渡鱼粉', price: '15-25元', mustTry: true, location: '苏仙区' }] },

  '永州': { title: '永州·零陵', season: '春秋最佳', days: '1-2天', tags: ['九嶷山','柳宗元','潇湘'], poster: { style: 'vintage', subtitle: '潇湘之源 柳宗元谪居地' }, routes: ['九嶷山（舜帝陵→舜源峰→紫霞岩）→三分石', '零陵古城→柳子庙→阳明山→上甘棠古村'], foods: [{ name: '永州血鸭', price: '38-58元', mustTry: true, location: '市区' }] },

  '怀化': { title: '怀化·鹤城', season: '春秋最佳', days: '1-2天', tags: ['芷江受降纪念坊','洪江古商城','通道侗寨'], poster: { style: 'fresh', subtitle: '火车拖来的城市 五溪之地' }, routes: ['芷江受降纪念坊→龙兴讲寺→黔阳古城', '洪江古商城→通道侗寨→芋头侗寨'], foods: [{ name: '怀化鸭子', price: '48-78元', mustTry: true, location: '市区' }] },

  '湘西': { title: '湘西·神秘湘西', season: '春秋最佳', days: '2-3', tags: ['凤凰古城','芙蓉镇','矮寨大桥'], poster: { style: 'fresh', subtitle: '神秘湘西 凤凰于飞' }, routes: ['凤凰古城（沱江→虹桥→沈从文故居→熊希龄故居）', '芙蓉镇→矮寨大桥→德夯苗寨'], foods: [{ name: '湘西腊肉', price: '50-80元/斤', mustTry: true, location: '凤凰' }] },

  // === 华南地区 ===
  '珠海': { title: '珠海·百岛之市', season: '秋冬最佳', days: '2-3', tags: ['长隆海洋王国','情侣路','澳门'], poster: { style: 'fresh', subtitle: '浪漫之城 百岛之市' }, routes: ['长隆海洋王国→横琴湾酒店→情侣路→渔女雕像', '圆明新园→珠海大剧院→东澳岛'], foods: [{ name: '横琴蚝', price: '30-50元', mustTry: true, location: '横琴' }] },

  '汕头': { title: '汕头·鮀城', season: '秋冬最佳', days: '2-3', tags: ['潮汕美食','南澳岛','侨乡'], poster: { style: 'fresh', subtitle: '美食之都 潮汕门户' }, routes: ['南澳岛→青澳湾→总兵府→宋井', '小公园→老妈宫→礐石风景区'], foods: [{ name: '牛肉火锅', price: '80-130元/人', mustTry: true, location: '八合里' }] },

  '佛山': { title: '佛山·禅城', season: '全年适宜', days: '1-2天', tags: ['祖庙','黄飞鸿','岭南文化'], poster: { style: 'fresh', subtitle: '武术之乡 佛山功夫' }, routes: ['佛山祖庙→黄飞鸿纪念馆→叶问堂→岭南天地', '西樵山→清晖园→顺德美食之旅'], foods: [{ name: '顺德双皮奶', price: '10-15元', mustTry: true, location: '民信' }] },

  '韶关': { title: '韶关·粤北门户', season: '春秋最佳', days: '1-2天', tags: ['丹霞山','南华寺','客家围屋'], poster: { style: 'fresh', subtitle: '丹霞地貌 禅宗祖庭' }, routes: ['丹霞山（阳元石→阴元石→长老峰→翔龙湖）', '南华寺→珠玑古巷→梅关古道'], foods: [{ name: '韶关酸笋田螺', price: '30-50元', mustTry: true, location: '市区' }] },

  '湛江': { title: '湛江·港城', season: '秋冬最佳', days: '2-3', tags: ['湖光岩','雷州古城','海鲜'], poster: { style: 'fresh', subtitle: '南海明珠 港城湛江' }, routes: ['湖光岩→雷州古城→雷祖祠→三元塔', '金沙湾→特呈岛→徐闻珊瑚礁'], foods: [{ name: '湛江生蚝', price: '30-50元/打', mustTry: true, location: '海边' }] },

  '肇庆': { title: '肇庆·端州', season: '春秋最佳', days: '1-2天', tags: ['七星岩','鼎湖山','端砚'], poster: { style: 'fresh', subtitle: '山水肇庆 端砚之乡' }, routes: ['七星岩→鼎湖山（庆云寺→宝鼎园→蝴蝶谷）', '端砚文化村→阅江楼→宋城墙'], foods: [{ name: '肇庆裹蒸粽', price: '10-15元/只', mustTry: true, location: '市区' }] },

  '江门': { title: '江门·五邑', season: '全年适宜', days: '1-2天', tags: ['开平碉楼','小鸟天堂','侨乡'], poster: { style: 'fresh', subtitle: '中国侨都 五邑江门' }, routes: ['开平碉楼与村落（自力村→立园→马降龙）', '小鸟天堂→上下川岛→古劳水乡'], foods: [{ name: '陈皮排骨', price: '48-78元', mustTry: true, location: '新会' }] },

  '茂名': { title: '茂名·南方油城', season: '秋冬最佳', days: '1-2天', tags: ['中国第一滩','放鸡岛','荔枝'], poster: { style: 'fresh', subtitle: '南方油城 荔枝之乡' }, routes: ['中国第一海滩→放鸡岛→浪漫海岸', '根子荔枝贡园→高州冼太庙'], foods: [{ name: '茂名荔枝', price: '10-20元/斤', mustTry: true, location: '高州' }] },

  '惠州': { title: '惠州·鹅城', season: '全年适宜', days: '2-3', tags: ['西湖','罗浮山','巽寮湾'], poster: { style: 'fresh', subtitle: '半城山色半城湖' }, routes: ['惠州西湖（泗洲塔→点翠洲→丰渚园→红花湖）', '罗浮山→巽寮湾→双月湾'], foods: [{ name: '梅菜扣肉', price: '38-58元', mustTry: true, location: '市区' }] },

  '梅州': { title: '梅州·客都', season: '春秋最佳', days: '1-2天', tags: ['客家围龙屋','叶剑英','雁南飞'], poster: { style: 'fresh', subtitle: '世界客都 客家首府' }, routes: ['雁南飞茶田→桥溪古韵→叶剑英纪念园', '客天下→围龙屋（承德楼→继善楼）→千佛塔'], foods: [{ name: '客家盐焗鸡', price: '68-98元/只', mustTry: true, location: '市区' }] },

  '汕尾': { title: '汕尾·海陆丰', season: '秋冬最佳', days: '1-2天', tags: ['红海湾','玄武山','妈祖'], poster: { style: 'fresh', subtitle: '海陆丰汕尾 红色革命根据地' }, routes: ['红海湾遮浪半岛→南海观音寺→风车岛', '玄武山→凤山祖庙→铜鼎山'], foods: [{ name: '汕尾海鲜粥', price: '20-30元', mustTry: true, location: '市区' }] },

  '河源': { title: '河源·槎城', season: '全年适宜', days: '1-2天', tags: ['万绿湖','恐龙博物馆','客家'], poster: { style: 'fresh', subtitle: '客家古邑 万绿河源' }, routes: ['万绿湖（水月湾→龙凤岛→镜花缘）→恐龙博物馆', '苏家围客家乡村旅游区→越王山'], foods: [{ name: '河源米粉', price: '8-12元', mustTry: true, location: '市区' }] },

  '阳江': { title: '阳江·漠阳', season: '秋冬最佳', days: '1-2天', tags: ['海陵岛','闸坡','刀具'], poster: { style: 'fresh', subtitle: '中国刀都 阳江海岛' }, routes: ['海陵岛（大角湾→十里银滩→南海一号博物馆）', '闸坡渔港→北洛湾→马尾岛'], foods: [{ name: '阳江猪肠碌', price: '8-12元', mustTry: true, location: '市区' }] },

  '清远': { title: '清远·凤城', season: '全年适宜', days: '1-2天', tags: ['连州地下河','英西峰林','漂流'], poster: { style: 'fresh', subtitle: '珠三角后花园 清远漂流' }, routes: ['连州地下河→湟川三峡→瑶族风情园', '英西峰林→清远古龙峡漂流→黄腾峡'], foods: [{ name: '清远鸡', price: '88-138元/只', mustTry: true, location: '市区' }] },

  '东莞': { title: '东莞·莞城', season: '全年适宜', days: '1-2天', tags: ['可园','虎门销烟','制造业'], poster: { style: 'minimal', subtitle: '世界工厂 东莞制造' }, routes: ['可园→虎门威远炮台→鸦片战争博物馆', '松山湖→观音山→隐贤山庄'], foods: [{ name: '东莞腊肠', price: '30-50元/斤', mustTry: true, location: '市区' }] },

  '中山': { title: '中山·香山', season: '全年适宜', days: '1天', tags: ['孙中山故居','岐江公园','灯都'], poster: { style: 'fresh', subtitle: '伟人故里 博爱中山' }, routes: ['孙中山故居纪念馆→中山影视城→詹园', '岐江公园→紫马岭公园→小榄菊城'], foods: [{ name: '中山杏仁饼', price: '10-15元/盒', mustTry: true, location: '市区' }] },

  '潮州': { title: '潮州·潮汕故里', season: '秋冬最佳', days: '1-2天', tags: ['广济桥','牌坊街','工夫茶'], poster: { style: 'vintage', subtitle: '潮汕文化发源地 工夫茶之乡' }, routes: ['广济桥（湘子桥）→牌坊街→开元寺→韩文公祠', '龙湖古寨→淡浮收藏院→从熙公祠'], foods: [{ name: '潮州牛肉丸', price: '30-50元', mustTry: true, location: '牌坊街' }] },

  '揭阳': { title: '揭阳·莲城', season: '秋冬最佳', days: '1天', tags: ['黄岐山','揭阳学宫','玉器'], poster: { style: 'fresh', subtitle: '亚洲玉都 揭阳古邑' }, routes: ['黄岐山→揭阳学宫→进贤门→榕江西湖', '阳美玉都→普宁德安里→惠来靖海古城'], foods: [{ name: '揭阳粿汁', price: '10-15元', mustTry: true, location: '市区' }] },

  '云浮': { title: '云浮·石都', season: '全年适宜', days: '1天', tags: ['蟠龙洞','新兴国恩寺','石材'], poster: { style: 'fresh', subtitle: '中国石都 禅意云浮' }, routes: ['蟠龙洞→新兴国恩寺→六祖故里', '云浮石材城→罗定龙湾生态旅游区'], foods: [{ name: '云浮石磨肠粉', price: '8-12元', mustTry: true, location: '市区' }] },

  '北海': { title: '北海·珠城', season: '秋冬最佳', days: '2-3', tags: ['银滩','涠洲岛','海鲜'], poster: { style: 'fresh', subtitle: '南珠故郡 涠洲秘境' }, routes: ['北海银滩→北海老街→海底世界→北部湾广场', '涠洲岛（鳄鱼山→五彩滩→天主教堂→贝壳沙滩）'], foods: [{ name: '北海海鲜', price: '80-150元/人', mustTry: true, location: '侨港' }] },

  '防城港': { title: '防城港·边关', season: '秋冬最佳', days: '1-2天', tags: ['十万大山','东兴口岸','京族'], poster: { style: 'fresh', subtitle: '西南门户 边陲明珠' }, routes: ['十万大山国家森林公园→东兴口岸→京族三岛', '白浪滩→怪石滩→簕山古渔村'], foods: [{ name: '防城港海鲜', price: '60-100元/人', mustTry: true, location: '海边' }] },

  '钦州': { title: '钦州·坭兴陶都', season: '秋冬最佳', days: '1-2天', tags: ['三娘湾','白海豚','坭兴陶'], poster: { style: 'fresh', subtitle: '中国坭兴陶都 白海豚之乡' }, routes: ['三娘湾（观白海豚）→犀丽湾→龙门群岛', '钦州坭兴陶艺术馆→灵山六峰山→浦北越州天湖'], foods: [{ name: '钦州猪脚粉', price: '12-18元', mustTry: true, location: '市区' }] },

  '贵港': { title: '贵港·荷城', season: '夏季最佳（荷花节）', days: '1天', tags: ['桂平西山','太平天国','荷文化'], poster: { style: 'fresh', subtitle: '荷城贵港 壮乡荷韵' }, routes: ['桂平西山→太平天国金田起义旧址→龙潭国家森林公园', '贵港园博园→南山寺→平天山'], foods: [{ name: '贵港藕粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '玉林': { title: '玉林·岭南都会', season: '春秋最佳', days: '1-2天', tags: ['云天宫','真武阁','容县'], poster: { style: 'fresh', subtitle: '岭南美玉 胜景如林' }, routes: ['云天文化城→容县真武阁→容州古城', '大容山→谢鲁山庄→勾漏洞'], foods: [{ name: '玉林牛巴', price: '30-50元', mustTry: true, location: '市区' }] },

  '百色': { title: '百色·红城', season: '春秋最佳', days: '1-2天', tags: ['百色起义纪念馆','通灵大峡谷','靖西'], poster: { style: 'vintage', subtitle: '红色百色 靖西秘境' }, routes: ['百色起义纪念馆→粤东会馆→右江民族博物馆', '通灵大峡谷→德天跨国瀑布→靖西旧州古镇'], foods: [{ name: '百色芒果', price: '5-10元/斤', mustTry: true, location: '田东' }] },

  '贺州': { title: '贺州·长寿市', season: '春秋最佳', days: '1-2天', tags: ['黄姚古镇','姑婆山','瑶族'], poster: { style: 'fresh', subtitle: '世界长寿市 瑶族风情' }, routes: ['黄姚古镇→姑婆山国家森林公园→十八水', '紫云洞→玉石林→富川秀水状元村'], foods: [{ name: '贺州酿菜', price: '20-30元', mustTry: true, location: '黄姚' }] },

  '河池': { title: '河池·刘三姐故里', season: '春秋最佳', days: '1-2天', tags: ['巴马长寿村','刘三姐故里','喀斯特'], poster: { style: 'fresh', subtitle: '长寿之乡 刘三姐故里' }, routes: ['巴马长寿村（百魔洞→百鸟岩→命河）', '刘三姐故里→七百弄→红水河第一湾'], foods: [{ name: '河池旱藕粉', price: '10-15元', mustTry: true, location: '巴马' }] },

  '来宾': { title: '来宾·桂中', season: '春秋最佳', days: '1天', tags: ['圣堂山','象州温泉','瑶族'], poster: { style: 'fresh', subtitle: '桂中来宾 瑶山圣堂' }, routes: ['圣堂山→莲花山→象州温泉→古沙沟', '金秀瑶族自治县→忻城莫土司衙署'], foods: [{ name: '来宾红薯粉', price: '8-12元', mustTry: true, location: '市区' }] },

  '崇左': { title: '崇左·边关', season: '秋冬最佳', days: '1-2天', tags: ['德天瀑布','凭祥友谊关','花山岩画'], poster: { style: 'fresh', subtitle: '南疆国门 壮美崇左' }, routes: ['德天跨国瀑布→明仕田园→花山岩画', '凭祥友谊关→浦寨边贸市场→龙州起义纪念馆'], foods: [{ name: '崇左壮乡糯米饭', price: '8-12元', mustTry: true, location: '市区' }] },

  // === 西南地区 ===
  '攀枝花': { title: '攀枝花·阳光花城', season: '全年适宜', days: '1-2天', tags: ['阳光康养','二滩水电站','芒果'], poster: { style: 'fresh', subtitle: '阳光花城 康养胜地' }, routes: ['二滩水电站→格萨拉生态旅游区→红格温泉', '米易县→攀枝花公园→三线建设博物馆'], foods: [{ name: '攀枝花芒果', price: '10-20元/斤', mustTry: true, location: '市区' }] },

  '泸州': { title: '泸州·酒城', season: '春秋最佳', days: '1-2天', tags: ['泸州老窖','国窖1573','长江'], poster: { style: 'fresh', subtitle: '中国酒城 浓香鼻祖' }, routes: ['泸州老窖旅游区→国窖1573广场→张坝桂圆林', '尧坝古镇→福宝古镇→黄荆老林'], foods: [{ name: '泸州白糕', price: '5-8元', mustTry: true, location: '市区' }] },

  '德阳': { title: '德阳·重装之都', season: '春秋最佳', days: '1天', tags: ['三星堆','德阳孔庙','重装制造'], poster: { style: 'fresh', subtitle: '重装之都 古蜀文明' }, routes: ['三星堆博物馆→三星堆遗址公园→雒城遗址', '德阳孔庙→白马关→庞统祠墓'], foods: [{ name: '德阳缠丝兔', price: '30-50元', mustTry: true, location: '市区' }] },

  '绵阳': { title: '绵阳·科技城', season: '春秋最佳', days: '1-2天', tags: ['李白故里','北川羌城','科技'], poster: { style: 'fresh', subtitle: '中国科技城 李白故里' }, routes: ['李白故里→窦圌山→佛爷洞', '北川羌城旅游区→九皇山→猿王洞'], foods: [{ name: '绵阳米粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '广元': { title: '广元·女皇故里', season: '春秋最佳', days: '1-2天', tags: ['剑门关','昭化古城','武则天'], poster: { style: 'fresh', subtitle: '女皇故里 蜀道难' }, routes: ['剑门关（鸟道→玻璃观景平台→梁山寺）→昭化古城', '明月峡→千佛崖→皇泽寺→武则天祀庙'], foods: [{ name: '广元蒸凉面', price: '8-12元', mustTry: true, location: '市区' }] },

  '遂宁': { title: '遂宁·斗城', season: '春秋最佳', days: '1天', tags: ['广德寺','死海','观音故里'], poster: { style: 'fresh', subtitle: '观音故里 灵泉遂宁' }, routes: ['广德寺→灵泉寺→中国死海→龙凤古镇', '射洪→子昂故里→金华山'], foods: [{ name: '遂宁豆腐皮', price: '10-15元', mustTry: true, location: '市区' }] },

  '内江': { title: '内江·甜城', season: '春秋最佳', days: '1天', tags: ['张大千故居','甜城湖','大千文化'], poster: { style: 'fresh', subtitle: '甜城内江 大千故里' }, routes: ['张大千纪念馆→大千园→圣水寺→翔龙山', '隆昌石牌坊群→古宇湖→云顶寨'], foods: [{ name: '内江牛肉面', price: '12-18元', mustTry: true, location: '市区' }] },

  '乐山': { title: '乐山·嘉州', season: '春秋最佳', days: '1-2天', tags: ['峨眉山','乐山大佛','美食'], poster: { style: 'fresh', subtitle: '佛国仙山 乐山乐水' }, routes: ['乐山大佛→东方佛都→峨眉山（报国寺→万年寺→金顶）', '东风堰→夹江千佛岩→郭沫若故居'], foods: [{ name: '乐山钵钵鸡', price: '30-50元', mustTry: true, location: '张公桥' }] },

  '南充': { title: '南充·绸都', season: '春秋最佳', days: '1-2天', tags: ['阆中古城','朱德故居','嘉陵江'], poster: { style: 'vintage', subtitle: '丝绸之都 阆苑仙境' }, routes: ['阆中古城（贡院→川北道署→汉恒侯祠→中天楼）', '朱德故居纪念馆→琳琅山→嘉陵江第一曲流'], foods: [{ name: '南充米粉', price: '10-15元', mustTry: true, location: '市区' }] },

  '眉山': { title: '眉山·东坡故里', season: '春秋最佳', days: '1天', tags: ['三苏祠','瓦屋山','苏轼'], poster: { style: 'fresh', subtitle: '东坡故里 千载诗书城' }, routes: ['三苏祠→东坡城市湿地公园→中国泡菜城', '瓦屋山→柳江古镇→黑龙滩'], foods: [{ name: '东坡肘子', price: '48-78元', mustTry: true, location: '市区' }] },

  '宜宾': { title: '宜宾·酒都', season: '春秋最佳', days: '1-2天', tags: ['五粮液','蜀南竹海','万里长江第一城'], poster: { style: 'fresh', subtitle: '中国酒都 万里长江第一城' }, routes: ['五粮液工业园区→蜀南竹海→兴文石海', '李庄古镇→夕佳山民居→七洞沟'], foods: [{ name: '宜宾燃面', price: '10-15元', mustTry: true, location: '市区' }] },

  '广安': { title: '广安·賨城', season: '春秋最佳', days: '1天', tags: ['邓小平故里','华蓥山','天池'], poster: { style: 'vintage', subtitle: '邓小平故里 红色广安' }, routes: ['邓小平故里旅游区→华蓥山→天池', '思源广场→神龙山→宝箴塞'], foods: [{ name: '广安盐皮蛋', price: '1-2元/个', mustTry: true, location: '市区' }] },

  '达州': { title: '达州·巴渠', season: '春秋最佳', days: '1-2天', tags: ['真佛山','巴山大峡谷','元九登高'], poster: { style: 'fresh', subtitle: '巴渠通达 川东门户' }, routes: ['真佛山→巴山大峡谷→賨人谷', '元九登高→凤凰山→莲花湖'], foods: [{ name: '达州灯影牛肉', price: '30-50元', mustTry: true, location: '市区' }] },

  '雅安': { title: '雅安·雨城', season: '全年适宜', days: '1-2天', tags: ['碧峰峡','蒙顶山','熊猫'], poster: { style: 'fresh', subtitle: '雨城雅安 熊猫故乡' }, routes: ['碧峰峡野生动物园→上里古镇→蒙顶山', '喇叭河→二郎山→泸定桥'], foods: [{ name: '雅鱼', price: '80-150元/条', mustTry: true, location: '青衣江' }] },

  '巴中': { title: '巴中·巴中', season: '春秋最佳', days: '1-2天', tags: ['光雾山','诺水河','红军文化'], poster: { style: 'fresh', subtitle: '红军之乡 光雾仙境' }, routes: ['光雾山（桃园→十八月潭→大坝景区）→米仓山', '诺水河→南龛摩崖造像→恩阳古镇'], foods: [{ name: '巴中罐罐饭', price: '10-15元', mustTry: true, location: '市区' }] },

  '资阳': { title: '资阳·资州', season: '春秋最佳', days: '1天', tags: ['安岳石刻','乐至陈毅故居','柠檬'], poster: { style: 'fresh', subtitle: '西部车城 成渝之心' }, routes: ['安岳石刻（毗卢洞→华严洞→圆觉洞→卧佛院）', '乐至陈毅故居→报国寺→圆觉洞'], foods: [{ name: '资阳伤心凉粉', price: '8-12元', mustTry: true, location: '市区' }] },

  '遵义': { title: '遵义·转折之城', season: '春秋最佳', days: '1-2天', tags: ['遵义会议会址','茅台镇','赤水河'], poster: { style: 'vintage', subtitle: '伟大转折 遵义会议' }, routes: ['遵义会议会址→红军山→娄山关', '茅台镇→赤水河→四渡赤水纪念馆'], foods: [{ name: '遵义羊肉粉', price: '15-25元', mustTry: true, location: '市区' }] },

  '六盘水': { title: '六盘水·凉都', season: '夏冬两季', days: '1-2天', tags: ['乌蒙山','梅花山','避暑'], poster: { style: 'fresh', subtitle: '中国凉都 乌蒙磅礴' }, routes: ['乌蒙大草原→梅花山国际滑雪场→妥乐银杏村', '牂牁江→水城古镇→韭菜坪'], foods: [{ name: '水城烙锅', price: '30-50元', mustTry: true, location: '市区' }] },

  '安顺': { title: '安顺·瀑乡', season: '春秋最佳', days: '1-2天', tags: ['黄果树瀑布','龙宫','屯堡'], poster: { style: 'fresh', subtitle: '中国瀑乡 屯堡文化' }, routes: ['黄果树瀑布→陡坡塘→天星桥→龙宫', '云峰屯堡→天龙屯堡→旧州古镇'], foods: [{ name: '安顺裹卷', price: '8-12元', mustTry: true, location: '市区' }] },

  '毕节': { title: '毕节·洞天', season: '春秋最佳', days: '1-2天', tags: ['织金洞','百里杜鹃','草海'], poster: { style: 'fresh', subtitle: '洞天毕节 彝族故里' }, routes: ['织金洞→织金大峡谷→百里杜鹃', '草海→韭菜坪→慕俄格古城'], foods: [{ name: '毕节汤圆', price: '5-8元', mustTry: true, location: '市区' }] },

  '铜仁': { title: '铜仁·梵净山', season: '春秋最佳', days: '1-2天', tags: ['梵净山','苗王城','傩文化'], poster: { style: 'fresh', subtitle: '梵天净土 桃源铜仁' }, routes: ['梵净山（蘑菇石→红云金顶→老金顶→万卷书）', '苗王城→亚木沟→朱砂古镇'], foods: [{ name: '铜仁社饭', price: '15-25元', mustTry: true, location: '市区' }] },

  '大理': { title: '大理·风花雪月', season: '全年适宜', days: '2-3', tags: ['洱海','苍山','白族风情'], poster: { style: 'fresh', subtitle: '下关风 上关花 苍山雪 洱海月' }, routes: ['洱海（环湖骑行→喜洲古镇→双廊→南诏风情岛）', '苍山（感通索道→中和寺→洗马潭）→崇圣寺三塔'], foods: [{ name: '乳扇', price: '10-15元', mustTry: true, location: '喜洲' }] },

  '曲靖': { title: '曲靖·爨城', season: '全年适宜', days: '1-2天', tags: ['珠江源','罗平油菜花','爨文化'], poster: { style: 'fresh', subtitle: '珠江源头 爨文化故乡' }, routes: ['珠江源→罗平油菜花海（春季）→金鸡峰丛', '多依河→九龙瀑布群→师宗菌子山'], foods: [{ name: '曲靖蒸饵丝', price: '10-15元', mustTry: true, location: '市区' }] },

  '玉溪': { title: '玉溪·聂耳故乡', season: '全年适宜', days: '1-2天', tags: ['抚仙湖','澄江化石地','烟草'], poster: { style: 'fresh', subtitle: '聂耳故乡 抚仙湖畔' }, routes: ['抚仙湖（禄充→明星鱼洞→樱花谷）→澄江化石地', '通海秀山→建水古城→元阳梯田'], foods: [{ name: '玉溪米线', price: '10-15元', mustTry: true, location: '市区' }] },

  '丽江': { title: '丽江·柔软时光', season: '全年适宜', days: '2-3', tags: ['丽江古城','玉龙雪山','纳西族'], poster: { style: 'fresh', subtitle: '一米阳光 柔软时光' }, routes: ['丽江古城（四方街→木府→黑龙潭→束河古镇）', '玉龙雪山（冰川公园→蓝月谷→印象丽江演出）'], foods: [{ name: '丽江粑粑', price: '10-15元', mustTry: true, location: '古城' }] },

  '普洱': { title: '普洱·茶城', season: '全年适宜', days: '1-2天', tags: ['普洱茶','景迈山','咖啡'], poster: { style: 'fresh', subtitle: '中国茶城 世界茶源' }, routes: ['普洱茶马古道旅游景区→景迈山古茶林→澜沧拉祜族', '普洱国家公园→墨江北回归线标志园→咖啡庄园'], foods: [{ name: '普洱米干', price: '8-12元', mustTry: true, location: '市区' }] },

  '楚雄': { title: '楚雄·彝州', season: '全年适宜', days: '1-2天', tags: ['彝族火把节','元谋土林','恐龙谷'], poster: { style: 'fresh', subtitle: '中国彝州 恐龙之乡' }, routes: ['彝族十月太阳历文化园→元谋土林→世界恐龙谷', '紫溪山→武定狮子山→禄丰黑井古镇'], foods: [{ name: '楚雄野生菌', price: '50-100元', mustTry: true, location: '南华' }] },

  '红河': { title: '红河·滇南', season: '全年适宜', days: '2-3', tags: ['元阳梯田','建水古城','哈尼族'], poster: { style: 'fresh', subtitle: '梯田故里 滇南中心' }, routes: ['元阳梯田（多依树日出→老虎嘴日落→坝达）', '建水古城（朝阳楼→朱家花园→团山民居→蚁工坊）'], foods: [{ name: '建水烧豆腐', price: '0.5-1元/块', mustTry: true, location: '建水' }] },

  '文山': { title: '文山·三七之乡', season: '全年适宜', days: '1-2天', tags: ['三七','普者黑','壮族'], poster: { style: 'fresh', subtitle: '三七之乡 桃花源地' }, routes: ['普者黑（荷花→青龙山→仙人洞→三生三世拍摄地）', '文山三七交易市场→坝美世外桃源→麻栗坡老山'], foods: [{ name: '文山三七鸡', price: '68-98元', mustTry: true, location: '市区' }] },

  '西双版纳': { title: '西双版纳·热带雨林', season: '11-次年5月', days: '2-3', tags: ['热带雨林','傣族风情','泼水节'], poster: { style: 'fresh', subtitle: '神奇美丽的西双版纳' }, routes: ['中科院西双版纳热带植物园→野象谷→傣族园', '曼听公园→总佛寺→告庄西双景→星光夜市'], foods: [{ name: '傣味孔雀宴', price: '80-150元', mustTry: true, location: '告庄' }] },

  '德宏': { title: '德宏·孔雀之乡', season: '全年适宜', days: '1-2天', tags: ['芒市','瑞丽口岸','傣族景颇族'], poster: { style: 'fresh', subtitle: '孔雀之乡 中缅边境' }, routes: ['勐焕大金塔→勐巴娜西珍奇园→芒市孔雀谷', '瑞丽口岸→一寨两国→莫里热带雨林'], foods: [{ name: '德宏过手米线', price: '15-25元', mustTry: true, location: '芒市' }] },

  '怒江': { title: '怒江·峡谷', season: '全年适宜', days: '2-3', tags: ['怒江大峡谷','丙中洛','独龙族'], poster: { style: 'fresh', subtitle: '怒江大峡谷 秘境怒江' }, routes: ['丙中洛（怒江第一湾→桃花岛→雾里村→秋那桶）', '独龙江→老姆登教堂→知子罗废城'], foods: [{ name: '怒江漆油鸡', price: '80-120元', mustTry: true, location: '贡山' }] },

  '迪庆': { title: '迪庆·香格里拉', season: '5-10月最佳', days: '2-3', tags: ['香格里拉','梅里雪山','藏族'], poster: { style: 'fresh', subtitle: '心中的日月 香格里拉' }, routes: ['噶丹·松赞林寺→普达措国家公园→纳帕海', '梅里雪山（飞来寺观日出→雨崩村徒步）→白马雪山'], foods: [{ name: '酥油茶', price: '10-15元', mustTry: true, location: '香格里拉' }] },

  // ==================== 县级市及特色城镇 (205个) ====================

  // === 华北县级市 ===
  '迁安': { title: '迁安·钢城', season: '春秋最佳', days: '1天', tags: ['黄台山','白羊峪','钢铁'], poster: { style: 'fresh', subtitle: '北方水城 钢铁迁安' }, routes: ['黄台山公园→白羊峪长城→山叶口景区'], foods: [{ name: '迁安饹馇', price: '8-12元', mustTry: true, location: '市区' }] },
  '武安': { title: '武安·太行明珠', season: '春秋最佳', days: '1-2天', tags: ['京娘湖','朝阳沟','太行山'], poster: { style: 'fresh', subtitle: '太行明珠 钢铁武安' }, routes: ['京娘湖→朝阳沟→长寿村→古武当山'], foods: [{ name: '武安拽面', price: '10-15元', mustTry: true, location: '市区' }] },
  '任丘': { title: '任丘·石油之城', season: '春秋最佳', days: '1天', tags: ['白洋淀','华北油田','石油'], poster: { style: 'minimal', subtitle: '石油之城 任丘' }, routes: ['白洋淀（任丘景区）→华北油田→鄚州大庙'], foods: [{ name: '任丘老豆腐', price: '5-8元', mustTry: true, location: '市区' }] },
  '泊头': { title: '泊头·鸭梨之乡', season: '春秋最佳', days: '1天', tags: ['泊头鸭梨','清真寺','铸造'], poster: { style: 'fresh', subtitle: '中国鸭梨之乡 泊头' }, routes: ['泊头清真寺→泊莲寺→冯家口'], foods: [{ name: '泊头鸭梨', price: '3-5元/斤', mustTry: true, location: '市区' }] },
  '黄骅': { title: '黄骅·冬枣之乡', season: '秋季最佳', days: '1天', tags: ['黄骅港','冬枣','沿海'], poster: { style: 'fresh', subtitle: '中国冬枣之乡 黄骅' }, routes: ['黄骅港→南大港湿地→聚馆古贡枣园'], foods: [{ name: '黄骅冬枣', price: '10-20元/斤', mustTry: true, location: '聚馆' }] },
  '河间': { title: '河间·驴肉火烧', season: '春秋最佳', days: '1天', tags: ['驴肉火烧','河间府署','诗经'], poster: { style: 'fresh', subtitle: '驴肉火烧发源地' }, routes: ['河间府署→文庙→瀛州公园'], foods: [{ name: '河间驴肉火烧', price: '15-25元', mustTry: true, location: '市区' }] },
  '深州': { title: '深州·蜜桃之乡', season: '夏季最佳', days: '1天', tags: ['深州蜜桃','盈亿义仓','古建筑'], poster: { style: 'minimal', subtitle: '蜜桃之乡 深州' }, routes: ['盈亿义仓→深州蜜桃园→兴隆寺'], foods: [{ name: '深州蜜桃', price: '10-30元/斤', mustTry: true, location: '穆村' }] },
  '南宫': { title: '南宫·皮毛之都', season: '春秋最佳', days: '1天', tags: ['普彤塔','南宫湖','皮毛'], poster: { style: 'minimal', subtitle: '中国皮毛之都 南宫' }, routes: ['普彤塔（中国第一佛塔）→南宫湖→冀南烈士陵园'], foods: [{ name: '南宫烧饼', price: '3-5元', mustTry: true, location: '市区' }] },
  '沙河': { title: '沙河·玻璃之都', season: '春秋最佳', days: '1天', tags: ['秦王湖','桃花源','玻璃'], poster: { style: 'fresh', subtitle: '中国玻璃之都 沙河' }, routes: ['秦王湖→桃花源→王硇村（太行川寨）'], foods: [{ name: '沙河排骨', price: '40-60元', mustTry: true, location: '市区' }] },
  '原平': { title: '原平·梨乡', season: '秋季最佳', days: '1天', tags: ['天涯山','滹沱河','同川酥梨'], poster: { style: 'fresh', subtitle: '酥梨之乡 原平' }, routes: ['天涯山→滹沱河湿地公园→同川梨园'], foods: [{ name: '原平锅魁', price: '3-5元', mustTry: true, location: '市区' }] },
  '霍州': { title: '霍州·年馍之乡', season: '春秋最佳', day: '1天', tags: ['广胜寺','霍州鼓楼','年馍'], poster: { style: 'vintage', subtitle: '中国年馍之乡 霍州' }, routes: ['广胜寺（飞虹塔）→霍州鼓楼→七里峪'], foods: [{ name: '霍州年馍', price: '10-20元/斤', mustTry: true, location: '市区' }] },
  '孝义': { title: '孝义·煤海', season: '春秋最佳', days: '1天', tags: ['胜溪湖','金龙山','煤炭'], poster: { style: 'fresh', subtitle: '煤海孝义 文明新城' }, routes: ['胜溪湖森林公园→金龙山→孝河国家湿地公园'], foods: [{ name: '孝义碗碗腔', price: '10-15元', mustTry: true, location: '市区' }] },
  '介休': { title: '介休·琉璃之乡', season: '春秋最佳', days: '1天', tags: ['绵山','张壁古堡','琉璃'], poster: { style: 'vintage', subtitle: '琉璃之乡 寒食节发源地' }, routes: ['绵山→张壁古堡→祆神楼'], foods: [{ name: '贯馅糖', price: '10-15元', mustTry: true, location: '市区' }] },
  '侯马': { title: '侯马·晋国都城', season: '春秋最佳', days: '1天', tags: ['晋国遗址','台骀庙','晋文化'], poster: { style: 'vintage', subtitle: '晋国都城 侯马' }, routes: ['侯马晋国遗址→台骀庙→彭真故居'], foods: [{ name: '侯马红肠', price: '15-25元', mustTry: true, location: '市区' }] },
  '霍林郭勒': { title: '霍林郭勒·草原煤城', season: '夏秋最佳', days: '1-2天', tags: ['可汗山','草原','煤矿'], poster: { style: 'fresh', subtitle: '草原煤城 霍林郭勒' }, routes: ['可汗山旅游区→草原矿山公园→阿尔山口岸'], foods: [{ name: '手把肉', price: '60-100元', mustTry: true, location: '市区' }] },
  '丰镇': { title: '丰镇·月饼之乡', season: '夏秋最佳', days: '1天', tags: ['丰镇月饼','隆盛庄','古镇'], poster: { style: 'fresh', subtitle: '月饼之乡 丰镇' }, routes: ['隆盛庄古镇→丰镇月饼产业园→饮马河'], foods: [{ name: '丰镇月饼', price: '20-50元/盒', mustTry: true, location: '市区' }] },

  // === 东北县级市 ===
  '瓦房店': { title: '瓦房店·苹果之乡', season: '秋季最佳', days: '1天', tags: ['仙浴湾','复州古城','苹果'], poster: { style: 'fresh', subtitle: '中国苹果之乡 瓦房店' }, routes: ['仙浴湾海滨度假区→复州古城→骆驼山海滨森林公园'], foods: [{ name: '瓦房店苹果', price: '5-10元/斤', mustTry: true, location: '市区' }] },
  '庄河': { title: '庄河·冰峪沟', season: '夏秋最佳', days: '1-2天', tags: ['冰峪沟','黑岛','步云山'], poster: { style: 'fresh', subtitle: '北方小桂林 庄河' }, routes: ['冰峪沟→黑岛旅游区→步云山温泉'], foods: [{ name: '庄河杂色蛤', price: '30-50元/斤', mustTry: true, location: '海边' }] },
  '海城': { title: '海城·镁都', season: '春秋最佳', days: '1天', tags: ['厝石山','白云山','滑石'], poster: { style: 'fresh', subtitle: '世界镁都 海城' }, routes: ['厝石山公园→白云山→汤岗子温泉'], foods: [{ name: '海城馅饼', price: '10-15元', mustTry: true, location: '市区' }] },
  '东港': { title: '东港·贝类之乡', season: '夏季最佳', days: '1天', tags: ['大鹿岛','獐岛','贝类养殖'], poster: { style: 'fresh', subtitle: '中国贝类之乡 东港' }, routes: ['大鹿岛→獐岛→鸭绿江口湿地'], foods: [{ name: '东港梭子蟹', price: '50-80元/斤', mustTry: true, location: '沿海' }] },
  '凤城': { title: '凤城·凤凰山', season: '春秋最佳', days: '1-2天', tags: ['凤凰山','大梨树','满族风情'], poster: { style: 'fresh', subtitle: '丹东后花园 凤凰之城' }, routes: ['凤凰山→大梨树生态农业观光园→东汤温泉'], foods: [{ name: '凤城蚕蛹', price: '20-30元', mustTry: false, location: '市区' }] },
  '凌海': { title: '凌海·渤海之滨', season: '夏季最佳', days: '1天', tags: ['笔架山','温泉','海鲜'], poster: { style: 'fresh', subtitle: '渤海之滨 锦州门户' }, routes: ['笔架山→岩井寺温泉→翠岩山'], foods: [{ name: '凌海烧烤', price: '40-70元/人', mustTry: true, location: '市区' }] },
  '北镇': { title: '北镇·医巫闾山', season: '春秋最佳', days: '1天', tags: ['医巫闾山','北镇庙','葡萄'], poster: { style: 'fresh', subtitle: '医巫闾山下 北镇古城' }, routes: ['医巫闾山→北镇庙→青岩寺'], foods: [{ name: '北镇葡萄', price: '10-20元/斤', mustTry: true, location: '鲍家乡' }] },
  '盖州': { title: '盖州·古城', season: '春秋最佳', days: '1天', tags: ['北海','赤山','古城'], poster: { style: 'vintage', subtitle: '千年古城 盖州' }, routes: ['北海海洋公园→赤山风景区→盖州古城'], foods: [{ name: '盖州海蜇', price: '30-50元', mustTry: true, location: '海边' }] },
  '大石桥': { title: '大石桥·镁都', season: '春秋最佳', days: '1天', tags: ['金牛山','迷镇山','菱镁矿'], poster: { style: 'minimal', subtitle: '中国镁都 大石桥' }, routes: ['金牛山古人类遗址→迷镇山娘娘庙→黄丫口'], foods: [{ name: '大石桥大米', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '灯塔': { title: '灯塔·煤铁之城', season: '春秋最佳', days: '1天', tags: ['葛西河','铧子煤矿','铁矿'], poster: { style: 'minimal', subtitle: '煤铁之城 灯塔' }, routes: ['葛西河生态走廊→铧子古镇→李兆麟将军故居'], foods: [{ name: '灯塔大米', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '双辽': { title: '双辽·花生之乡', season: '夏秋最佳', days: '1天', tags: ['一马树森林公园','双山鸭场','花生'], poster: { style: 'fresh', subtitle: '中国花生之乡 双辽' }, routes: ['一马树森林公园→双山鸭场→八一湖'], foods: [{ name: '双辽花生', price: '8-12元/斤', mustTry: true, location: '市区' }] },
  '梅河口': { title: '梅河口·东北小江南', season: '夏秋最佳', days: '1-2天', tags: ['鸡冠山','五奎山','啤酒'], poster: { style: 'fresh', subtitle: '东北小江南 梅河口' }, routes: ['鸡冠山国家森林公园→五奎山风景区→海龙古城'], foods: [{ name: '梅河口烤鹅', price: '68-98元/只', mustTry: true, location: '市区' }] },
  '集安': { title: '集安·高句丽古都', season: '春秋最佳', days: '1-2天', tags: ['高句丽文物古迹','将军坟','边境'], poster: { style: 'vintage', subtitle: '高句丽古都 边境名城' }, routes: ['高句丽文物古迹旅游景区→将军坟→丸都山城→太极湾'], foods: [{ name: '集安火盆', price: '30-50元', mustTry: true, location: '市区' }] },
  '临江': { title: '临江·鸭绿江畔', season: '夏秋最佳', days: '1-2天', tags: ['鸭绿江','陈云故居','长白山'], poster: { style: 'fresh', subtitle: '鸭绿江畔 临江' }, routes: ['鸭绿江风光带→陈云旧居→珍珠门风景区'], foods: [{ name: '临江冷面', price: '15-20元', mustTry: true, location: '市区' }] },
  '洮南': { title: '洮南·古城', season: '夏秋最佳', days: '1天', tags: ['吴大帅府','洮儿河','古城'], poster: { style: 'vintage', subtitle: '千年古城 洮南' }, routes: ['吴大帅府→洮南市博物馆→四海湖'], foods: [{ name: '洮南香酒', price: '30-50元/瓶', mustTry: false, location: '市区' }] },
  '延吉': { title: '延吉·朝鲜族首府', season: '全年适宜', days: '1-2天', tags: ['朝鲜族美食','帽儿山','大学城'], poster: { style: 'fresh', subtitle: '朝鲜族风情第一城' }, routes: ['延边大学→帽儿山国家森林公园→朝鲜族民俗园→西市场'], foods: [{ name: '延吉冷面', price: '15-25元', mustTry: true, location: '服务大楼' }] },
  '图们': { title: '图们·边境口岸', season: '夏秋最佳', days: '1天', tags: ['图们口岸','日光山','中朝边境'], poster: { style: 'fresh', subtitle: '中朝边境 图们口岸' }, routes: ['图们口岸→日光山森林公园→华严寺'], foods: [{ name: '图们烤肉', price: '50-80元/人', mustTry: true, location: '市区' }] },
  '敦化': { title: '敦化·佛教圣地', season: '夏秋最佳', days: '1-2天', tags: ['六鼎山','正觉寺','清祖祠'], poster: { style: 'fresh', subtitle: '佛教圣地 敦化' }, routes: ['六鼎山文化旅游区（正觉寺金鼎大佛）→清祖祠→雁鸣湖'], foods: [{ name: '敦化大煎饼', price: '5-8元', mustTry: true, location: '市区' }] },
  '珲春': { title: '珲春·三国交界', season: '夏秋最佳', days: '1-2天', tags: ['防川景区','一眼望三国','中俄朝边境'], poster: { style: 'fresh', subtitle: '一眼望三国 东方第一村' }, routes: ['防川风景名胜区（土字碑→龙虎阁→一眼望三国）→灵宝禅寺→大荒沟'], foods: [{ name: '珲春大板蟹', price: '50-80元/只', mustTry: true, location: '防川' }] },
  '龙井': { title: '龙井·苹果梨之乡', season: '秋季最佳', days: '1天', tags: ['琵岩山','朝鲜族民俗','苹果梨'], poster: { style: 'fresh', subtitle: '中国苹果梨之乡 龙井' }, routes: ['琵岩山风景区→裕龙湾旅游度假区→尹东柱故居'], foods: [{ name: '龙井苹果梨', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '和龙': { title: '和龙·仙景台', season: '夏秋最佳', days: '1天', tags: ['仙景台','图们江源','朝鲜族'], poster: { style: 'fresh', subtitle: '仙景台自然风景区 和龙' }, routes: ['仙景台自然风景区→图们江源→崇善红旗河漂流'], foods: [{ name: '和龙辣白菜', price: '5-8元', mustTry: true, location: '市区' }] },
  '肇东': { title: '肇东·乳业之都', season: '夏秋最佳', days: '1天', tags: ['肇岳山','宋站','奶牛'], poster: { style: 'fresh', subtitle: '中国乳品之乡 肇东' }, routes: ['肇岳山国家湿地公园→宋站（中国最短火车站名）'], foods: [{ name: '肇东烤饼', price: '5-8元', mustTry: true, location: '市区' }] },
  '海伦': { title: '海伦·大豆之乡', season: '夏秋最佳', days: '1天', tags: ['海伦大豆','东方红水库','剪纸'], poster: { style: 'fresh', subtitle: '中国优质大豆之乡 海伦' }, routes: ['东方红水库→海伦市博物馆→农民画院'], foods: [{ name: '海伦大米', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '尚志': { title: '尚志·英雄之城', season: '冬季（滑雪）/夏秋', days: '1-2天', tags: ['亚布力滑雪场','帽儿山','赵尚志'], poster: { style: 'fresh', subtitle: '英雄之城 冰雪尚志' }, routes: ['亚布力滑雪场→帽儿山→赵一曼纪念园'], foods: [{ name: '尚志红树莓', price: '15-25元/斤', mustTry: true, location: '市区' }] },
  '五常': { title: '五常·稻花香', season: '秋季最佳', days: '1天', tags: ['五常大米','凤凰山','水稻'], poster: { style: 'fresh', subtitle: '中国稻米之乡 五常' }, routes: ['凤凰山国家森林公园→龙凤山水库→稻田观光'], foods: [{ name: '五常大米', price: '8-15元/斤', mustTry: true, location: '市区' }] },
  '讷河': { title: '讷河·马铃薯之乡', season: '夏秋最佳', days: '1天', tags: ['讷谟尔河','马铃薯','大豆'], poster: { style: 'fresh', subtitle: '中国马铃薯之乡 讷河' }, routes: ['讷谟尔河湿地公园→雨亭公园→清河屯'], foods: [{ name: '讷河土豆', price: '2-3元/斤', mustTry: true, location: '市区' }] },
  '富锦': { title: '富锦·粮都', season: '夏秋最佳', days: '1天', tags: ['三环泡','粮食基地','湿地'], poster: { style: 'fresh', subtitle: '中国粮都 富锦' }, routes: ['三环泡国家级自然保护区→富锦国家湿地公园'], foods: [{ name: '富锦大米', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '海林': { title: '海林·威虎山', season: '冬季（雪乡）/夏秋', days: '1-2天', tags: ['威虎山影视城','杨子荣纪念馆','雪乡'], poster: { style: 'fresh', subtitle: '林海雪原 威虎山' }, routes: ['威虎山影视城→杨子荣纪念馆→中国雪谷'], foods: [{ name: '海林蘑菇', price: '30-50元', mustTry: true, location: '山区' }] },
  '宁安': { title: '宁安·镜泊湖门户', season: '夏秋最佳', days: '1-2天', tags: ['镜泊湖','火山熔岩','渤海国'], poster: { style: 'fresh', subtitle: '镜泊湖畔 渤海故地' }, routes: ['镜泊湖风景区→渤海国上京龙泉府遗址→火山口森林'], foods: [{ name: '宁安大米', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '穆棱': { title: '穆棱·大豆之乡', season: '夏秋最佳', days: '1天', tags: ['六峰山','大豆','黑木耳'], poster: { style: 'fresh', subtitle: '中国大豆之乡 穆棱' }, routes: ['六峰山森林公园→红豆杉保护区→穆棱河公园'], foods: [{ name: '穆棱黑木耳', price: '50-80元/斤', mustTry: true, location: '山区' }] },
  '北安': { title: '北安·黑龙江源头', season: '夏秋最佳', days: '1天', tags: ['五大连池','黑龙江源头','红色旅游'], poster: { style: 'fresh', subtitle: '黑龙江源头城市 北安' }, routes: ['五大连池风景区→黑龙江源头→庆华军工遗址博物馆'], foods: [{ name: '北安冻梨', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '五大连池': { title: '五大连池·火山奇观', season: '夏秋最佳', days: '1-2天', tags: ['火山群','矿泉','地质公园'], poster: { style: 'fresh', subtitle: '天然火山博物馆 五大连池' }, routes: ['老黑山→北药泉→温泊→龙门石寨→水晶宫'], foods: [{ name: '矿泉鱼', price: '50-80元', mustTry: true, location: '药泉山' }] },
  '安达': { title: '安达·牛城', season: '夏秋最佳', days: '1天', tags: ['奶牛','草原','石油'], poster: { style: 'fresh', subtitle: '中国奶牛之乡 安达' }, routes: ['草原→奶牛牧场→石油文化广场'], foods: [{ name: '安达扒鸡', price: '30-50元/只', mustTry: true, location: '市区' }] },
  '肇源': { title: '肇源·莲花湖', season: '夏季最佳', days: '1天', tags: ['莲花湖','辽金文化','嫩江'], poster: { style: 'fresh', subtitle: '塞北江南 莲花故里' }, routes: ['莲花湖国家级自然保护区→衍福寺→辽金古城遗址'], foods: [{ name: '肇源大米', price: '5-8元/斤', mustTry: true, location: '市区' }] },

  // === 华东县级市 ===
  '江阴': { title: '江阴·华夏第一村', season: '四季皆宜', days: '1-2天', tags: ['华西村','长江大桥','徐霞客'], poster: { style: 'fresh', subtitle: '华夏第一村 民营经济高地' }, routes: ['华西村→江阴长江大桥→徐霞客故居→飞马水城'], foods: [{ name: '江阴河豚', price: '200-500元', mustTry: false, location: '市区' }] },
  '宜兴': { title: '宜兴·陶都', season: '春秋最佳', days: '1-2天', tags: ['紫砂壶','竹海','溶洞'], poster: { style: 'fresh', subtitle: '中国陶都 竹海茶洲' }, routes: ['宜兴竹海→善卷洞→张公洞→紫砂壶博物馆→龙背山'], foods: [{ name: '宜兴乌米饭', price: '10-15元', mustTry: true, location: '竹海' }] },
  '新沂': { title: '新沂·苏北明珠', season: '春秋最佳', days: '1天', tags: ['马陵山','窑湾古镇','骆马湖'], poster: { style: 'fresh', subtitle: '苏北明珠 新沂' }, routes: ['马陵山风景名胜区→窑湾古镇→骆马湖'], foods: [{ name: '新沂捆蹄', price: '20-35元', mustTry: true, location: '市区' }] },
  '邳州': { title: '邳州·银杏之乡', season: '秋季最佳', days: '1天', tags: ['银杏时光隧道','艾山','运河'], poster: { style: 'fresh', subtitle: '中国银杏之乡 邳州' }, routes: ['银杏时光隧道→艾山风景名胜区→土山古镇'], foods: [{ name: '邳州盐豆', price: '8-12元', mustTry: true, location: '市区' }] },
  '溧阳': { title: '溧阳·南山竹海', season: '春秋最佳', days: '1-2天', tags: ['南山竹海','天目湖','御水温泉'], poster: { style: 'fresh', subtitle: '南山竹海 天目湖光' }, routes: ['南山竹海→天目湖→御水温泉→溧阳一号公路'], foods: [{ name: '天目湖鱼头', price: '88-138元', mustTry: true, location: '天目湖' }] },
  '常熟': { title: '常熟·江南福地', season: '四季皆宜', days: '1-2天', tags: ['虞山','尚湖','沙家浜'], poster: { style: 'fresh', subtitle: '江南福地 常熟' }, routes: ['虞山→尚湖→沙家浜→方塔园'], foods: [{ name: '叫花鸡', price: '58-88元', mustTry: true, location: '王四酒家' }] },
  '张家港': { title: '张家港·港口城市', season: '四季皆宜', days: '1天', tags: ['双山岛','凤凰山','港口'], poster: { style: 'minimal', subtitle: '全国文明城市 张家港' }, routes: ['双山岛→凤凰山→暨阳湖生态园→香山'], foods: [{ name: '张家港拖炉饼', price: '10-15元', mustTry: true, location: '凤凰镇' }] },
  '昆山': { title: '昆山·百戏之祖', season: '四季皆宜', days: '1-2天', tags: ['周庄','昆曲','阳澄湖'], poster: { style: 'fresh', subtitle: '昆曲发源地 周庄水乡' }, routes: ['周庄古镇→千灯古镇→锦溪古镇→阳澄湖'], foods: [{ name: '阳澄湖大闸蟹', price: '30-60元/只', mustTry: true, location: '巴城' }] },
  '太仓': { title: '太仓·郑和下西洋起锚地', season: '四季皆宜', days: '1天', tags: ['郑和公园','沙溪古镇','德式建筑'], poster: { style: 'fresh', subtitle: '郑和七下西洋起锚地' }, routes: ['郑和公园→沙溪古镇→金仓湖→浏河古镇'], foods: [{ name: '太仓肉松', price: '20-40元', mustTry: true, location: '市区' }] },
  '启东': { title: '启东·江海交汇', season: '夏季最佳', days: '1-2天', tags: ['圆陀角','吕四渔港','长江入海口'], poster: { style: 'fresh', subtitle: '江海交汇 第一缕阳光' }, routes: ['圆陀角（长江入海口）→吕四渔港→黄金海滩'], foods: [{ name: '吕四海蜇', price: '30-50元', mustTry: true, location: '吕四' }] },
  '如皋': { title: '如皋·长寿之乡', season: '四季皆宜', days: '1天', tags: ['水绘园','长寿文化','盆景'], poster: { style: 'fresh', subtitle: '世界长寿养生福地 如皋' }, routes: ['水绘园→定慧寺→长寿城→如皋盆景大观'], foods: [{ name: '如皋萝卜', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '海门': { title: '海门·江海门户', season: '夏季最佳', days: '1天', tags: ['叠石桥','张謇故里','家纺'], poster: { style: 'fresh', subtitle: '江海门户 家纺之都' }, routes: ['叠石桥国际家纺城→张謇文化旅游景区→余东古镇'], foods: [{ name: '海门山羊肉', price: '60-100元', mustTry: true, location: '市区' }] },
  '东台': { title: '东台·董永故里', season: '春秋最佳', days: '1-2天', tags: ['黄海森林公园','董永七仙女','麋鹿'], poster: { style: 'fresh', subtitle: '黄海之滨 董永故里' }, routes: ['黄海国家森林公园→中华麋鹿园→西溪古镇（董永七仙女文化园）'], foods: [{ name: '东台鱼汤面', price: '15-25元', mustTry: true, location: '市区' }] },
  '高邮': { title: '高邮·盂城驿', season: '春秋最佳', days: '1天', tags: ['盂城驿','高邮湖','咸鸭蛋'], poster: { style: 'fresh', subtitle: '中国邮驿活化石 高邮' }, routes: ['盂城驿→高邮湖芦苇荡湿地公园→文游台'], foods: [{ name: '高邮咸鸭蛋', price: '3-5元/只', mustTry: true, location: '市区' }] },
  '仪征': { title: '仪征·真州', season: '春秋最佳', days: '1天', tags: ['捺山','龙山公园','化工'], poster: { style: 'fresh', subtitle: '化工基地 真州仪征' }, routes: ['捺山地质公园→龙山公园→仪征化纤工业旅游'], foods: [{ name: '仪征绿杨春茶', price: '200-500元/斤', mustTry: true, location: '捺山' }] },
  '丹阳': { title: '丹阳·眼镜之都', season: '春秋最佳', days: '1天', tags: ['眼镜产业','季子庙','齐梁文化'], poster: { style: 'minimal', subtitle: '中国眼镜之都 丹阳' }, routes: ['季子庙→九里景区→眼镜城'], foods: [{ name: '丹阳封缸酒', price: '20-30元/瓶', mustTry: false, location: '市区' }] },
  '扬中': { title: '扬中·河豚岛', season: '春季最佳', days: '1天', tags: ['河豚','长江岛屿','电气'], poster: { style: 'fresh', subtitle: '中国河豚岛 扬中' }, routes: ['扬中园博园→长江渔文化风情园→太平禅寺'], foods: [{ name: '扬中河豚', price: '200-400元', mustTry: false, location: '市区' }] },
  '句容': { title: '句容·茅山', season: '春秋最佳', days: '1-2天', tags: ['茅山道教','宝华山','葡萄'], poster: { style: 'fresh', subtitle: '道教圣地 句容茅山' }, routes: ['茅山（老子铜像→九霄万福宫→仙人洞）→宝华山→千华古村'], foods: [{ name: '句容葡萄', price: '10-20元/斤', mustTry: true, location: '丁庄' }] },
  '兴化': { title: '兴化·千垛菜花', season: '春季最佳（4月）', days: '1-2天', tags: ['千垛菜花','水上森林','郑板桥'], poster: { style: 'fresh', subtitle: '千垛花海 水上森林' }, routes: ['千垛景区（油菜花海）→李中水上森林→郑板桥故居→施耐庵陵园'], foods: [{ name: '兴化大闸蟹', price: '30-60元/只', mustTry: true, location: '市区' }] },
  '靖江': { title: '靖江·江鲜之乡', season: '春秋最佳', days: '1天', tags: ['靖江蟹黄汤包','孤山','长江大桥'], poster: { style: 'fresh', subtitle: '中国江鲜之乡 靖江' }, routes: ['孤山→牧城公园→长江大桥公园'], foods: [{ name: '靖江蟹黄汤包', price: '15-25元/笼', mustTry: true, location: '市区' }] },
  '泰兴': { title: '泰兴·银杏之乡', season: '秋季最佳', days: '1天', tags: ['古银杏群落','黄桥战役','银杏'], poster: { style: 'fresh', subtitle: '中国银杏之乡 泰兴' }, routes: ['宣堡古银杏群落→黄桥古镇→庆云禅寺'], foods: [{ name: '泰兴银杏果', price: '10-15元/斤', mustTry: true, location: '宣堡' }] },
  '姜堰': { title: '姜堰·溱潼会船', season: '春季最佳', days: '1天', tags: ['溱湖','溱潼会船','湿地'], poster: { style: 'fresh', subtitle: '中国会船之乡 姜堰' }, routes: ['溱湖国家湿地公园→溱潼古镇→会船节'], foods: [{ name: '溱湖八鲜', price: '150-300元', mustTry: true, location: '溱湖' }] },
  '余姚': { title: '余姚·文献名邦', season: '四季皆宜', days: '1-2天', tags: ['河姆渡','阳明故里','杨梅'], poster: { style: 'fresh', subtitle: '文献名邦 余姚' }, routes: ['河姆渡遗址博物馆→王阳明故居→四明山→余姚杨梅采摘'], foods: [{ name: '余姚杨梅', price: '20-40元/斤', mustTry: true, location: '丈亭' }] },
  '慈溪': { title: '慈溪·青瓷之乡', season: '春秋最佳', days: '1-2天', tags: ['上林湖越窑','鸣鹤古镇','杭州湾'], poster: { style: 'fresh', subtitle: '海上陶瓷之路起点 慈溪' }, routes: ['上林湖越窑遗址→鸣鹤古镇→杭州湾跨海大桥→方特东方神话'], foods: [{ name: '慈溪杨梅', price: '20-40元/斤', mustTry: true, location: '横河' }] },
  '奉化': { title: '奉化·蒋氏故里', season: '春秋最佳', days: '1-2天', tags: ['溪口','蒋介石故居','雪窦山'], poster: { style: 'fresh', subtitle: '蒋氏故里 弥勒道场' }, routes: ['溪口古镇（蒋氏故居→丰镐房→玉泰盐铺）→雪窦山→滕头村'], foods: [{ name: '奉化芋艿头', price: '8-12元/斤', mustTry: true, location: '溪口' }] },
  '诸暨': { title: '诸暨·西施故里', season: '春秋最佳', days: '1-2天', tags: ['西施故里','五泄瀑布','珍珠'], poster: { style: 'fresh', subtitle: '西施故里 珍珠之乡' }, routes: ['西施故里→五泄风景区→东白山→珍珠市场'], foods: [{ name: '诸暨珍珠', price: '50-200元', mustTry: true, location: '山下湖' }] },
  '嵊州': { title: '嵊州·越剧之乡', season: '四季皆宜', days: '1天', tags: ['越剧','剡溪','小吃'], poster: { style: 'fresh', subtitle: '越剧故乡 小吃天堂' }, routes: ['越剧博物馆→剡溪→百丈飞瀑→崇仁古镇'], foods: [{ name: '嵊州小笼包', price: '10-15元', mustTry: true, location: '市区' }] },
  '余姚': { title: '余姚·文献名邦', season: '四季皆宜', days: '1-2天', tags: ['河姆渡','阳明故里','杨梅'], poster: { style: 'fresh', subtitle: '文献名邦 余姚' }, routes: ['河姆渡遗址博物馆→王阳明故居→四明山→余姚杨梅采摘'], foods: [{ name: '余姚杨梅', price: '20-40元/斤', mustTry: true, location: '丈亭' }] },
  '兰溪': { title: '兰溪·婺剧之乡', season: '春秋最佳', days: '1-2天', tags: ['诸葛八卦村','地下长河','婺剧'], poster: { style: 'fresh', subtitle: '婺剧之源 兰溪' }, routes: ['诸葛八卦村→地下长河→六洞山→芥子园'], foods: [{ name: '兰溪牛肉面', price: '15-25元', mustTry: true, location: '市区' }] },
  '义乌': { title: '义乌·世界超市', season: '四季皆宜', days: '1-2天', tags: ['国际商贸城','小商品','购物'], poster: { style: 'minimal', subtitle: '世界小商品之都 义乌' }, routes: ['义乌国际商贸城→佛堂古镇→绣湖公园→义乌小商品市场'], foods: [{ name: '义乌红糖', price: '15-25元/斤', mustTry: true, location: '义亭' }] },
  '东阳': { title: '东阳·木雕之乡', season: '四季皆宜', days: '1-2天', tags: ['横店影视城','卢宅','木雕'], poster: { style: 'fresh', subtitle: '东方好莱坞 木雕之都' }, routes: ['横店影视城→卢宅→东阳木雕城→三单'], foods: [{ name: '东阳沃面', price: '10-15元', mustTry: true, location: '市区' }] },
  '永康': { title: '永康·五金之都', season: '四季皆宜', days: '1天', tags: ['五金城','方岩','胡公'], poster: { style: 'minimal', subtitle: '中国五金之都 永康' }, routes: ['中国科技五金城→方岩风景区→胡公祠→圆周村'], foods: [{ name: '永康肉麦饼', price: '5-8元', mustTry: true, location: '市区' }] },
  '江山': { title: '江山·蜂蜜之乡', season: '春秋最佳', days: '1-2天', tags: ['江郎山','廿八都','戴笠故居'], poster: { style: 'fresh', subtitle: '世界自然遗产 江郎山' }, routes: ['江郎山（一线天→天梯→伟人峰）→廿八都古镇→仙霞关→戴笠故居'], foods: [{ name: '江山蜂蜜', price: '30-60元/瓶', mustTry: true, location: '市区' }] },
  '温岭': { title: '温岭·石塘', season: '夏季最佳', days: '1-2天', tags: ['石塘古镇','长屿硐天','石屋'], poster: { style: 'fresh', subtitle: '曙光首照地 石塘石屋' }, routes: ['石塘古镇（千年曙光碑→石屋群）→长屿硐天→方山'], foods: [{ name: '嵌糕', price: '10-15元', mustTry: true, location: '市区' }] },
  '临海': { title: '临海·江南长城', season: '春秋最佳', days: '1-2天', tags: ['台州府城墙','东湖','紫阳街'], poster: { style: 'vintage', subtitle: '江南长城 临海' }, routes: ['台州府城墙（江南长城）→东湖→紫阳古街→龙兴寺'], foods: [{ name: '蛋清羊尾', price: '15-25元', mustTry: true, location: '紫阳街' }] },
  '龙泉': { title: '龙泉·青瓷宝剑', season: '春秋最佳', days: '1-2天', tags: ['龙泉青瓷','龙泉宝剑','凤阳山'], poster: { style: 'fresh', subtitle: '青瓷之都 宝剑之乡' }, routes: ['龙泉青瓷博物馆→龙泉宝剑厂→凤阳山→大窑龙泉窑遗址'], foods: [{ name: '龙泉香菇', price: '30-50元', mustTry: true, location: '山区' }] },
  '瑞安': { title: '瑞安·东南邹鲁', season: '四季皆宜', days: '1-2天', tags: ['玉海楼','桐浦','木活字'], poster: { style: 'fresh', subtitle: '东南邹鲁 瑞安' }, routes: ['玉海楼→忠义街→桐浦万亩油菜花→瑞安木活字印刷'], foods: [{ name: '瑞安李糕', price: '15-25元/盒', mustTry: true, location: '市区' }] },
  '乐清': { title: '乐清·电器之都',季节: '四季皆宜', days: '1-2天', tags: ['雁荡山','电器','黄杨木雕'], poster: { style: 'fresh', subtitle: '中国电器之都 乐清' }, routes: ['雁荡山（灵峰→灵岩→大龙湫）→黄檀硐古村落→黄杨木雕艺术馆'], foods: [{ name: '乐清泥蚶', price: '30-50元', mustTry: true, location: '海边' }] },
  '龙港': { title: '龙港·印刷城', season: '四季皆宜', days: '1天', tags: ['印刷产业','舥艚渔港','改革试点'], poster: { style: 'minimal', subtitle: '中国印刷城 龙港' }, routes: ['舥艚渔港→鲸头古村→九龙河湿地公园'], foods: [{ name: '龙港海鲜', price: '60-100元/人', mustTry: true, location: '舥艚' }] },
  '天长': { title: '天长·皖东明珠', season: '春秋最佳', days: '1天', tags: ['红草湖','高邮湖','仪器仪表'], poster: { style: 'fresh', subtitle: '皖东明珠 天长' }, routes: ['红草湖湿地公园→高邮湖→天长博物馆'], foods: [{ name: '天长甘露饼', price: '10-15元', mustTry: true, location: '市区' }] },
  '明光': { title: '明光·朱元璋故里', season: '春秋最佳', days: '1天', tags: ['女山湖','八岭湖','朱元璋'], poster: { style: 'fresh', subtitle: '朱元璋出生地 明光' }, routes: ['女山湖地质公园→八岭湖→抹山寺'], foods: [{ name: '明光梅鱼', price: '80-120元/斤', mustTry: true, location: '女山湖' }] },
  '界首': { title: '界首·彩陶之乡', season: '春秋最佳', days: '1天', tags: ['彩陶','翰墨文化','沙颍河'], poster: { style: 'fresh', subtitle: '中国彩陶之乡 界首' }, routes: ['界首彩陶博物馆→翰墨文化园→沙颍河湿地'], foods: [{ name: '界首牛肉', price: '40-60元', mustTry: true, location: '市区' }] },
  '宁国': { title: '宁国·山核桃之乡', season: '秋季最佳', days: '1-2天', tags: ['青龙湾','山核桃','徽文化'], poster: { style: 'fresh', subtitle: '中国山核桃之乡 宁国' }, routes: ['青龙湾生态旅游区→恩龙民族风情园→夏霖九天银瀑'], foods: [{ name: '宁国山核桃', price: '30-50元/斤', mustTry: true, location: '山区' }] },
  '桐城': { title: '桐城·文都', season: '春秋最佳', days: '1天', tags: ['六尺巷','文庙','桐城派'], poster: { style: 'vintage', subtitle: '文都桐城 桐城派故里' }, routes: ['六尺巷→文庙→龙眠山→孔城老街'], foods: [{ name: '桐城水芹', price: '5-8元', mustTry: true, location: '市区' }] },
  '潜山': { title: '潜山·天柱山门户', season: '春秋最佳', days: '1-2天', tags: ['天柱山','孔雀东南飞','皖文化'], poster: { style: 'fresh', subtitle: '古皖国所在地 潜山' }, routes: ['天柱山（主景区）→孔雀东南飞文化园→二乔公园→薛家岗遗址'], foods: [{ name: '天柱剑毫茶', price: '100-300元/斤', mustTry: true, location: '天柱山' }] },
  '桐城': { title: '桐城·文都', season: '春秋最佳', days: '1天', tags: ['六尺巷','文庙','桐城派'], poster: { style: 'vintage', subtitle: '文都桐城 桐城派故里' }, routes: ['六尺巷→文庙→龙眠山→孔城老街'], foods: [{ name: '桐城水芹', price: '5-8元', mustTry: true, location: '市区' }] },
  '巢湖': { title: '巢湖·鱼米之乡', season: '春秋最佳', days: '1-2天', tags: ['巢湖','银屏山','中庙'], poster: { style: 'fresh', subtitle: '八百里巢湖 巢湖' }, routes: ['中庙→姥山岛→银屏山→紫微洞'], foods: [{ name: '巢湖银鱼', price: '100-200元/斤', mustTry: true, location: '巢湖' }] },
  '贵池': { title: '贵池·杏花村', season: '春秋最佳', days: '1-2天', tags: ['杏花村','齐山','傩戏'], poster: { style: 'fresh', subtitle: '牧童遥指杏花村' }, routes: ['杏花村文化旅游区→齐山·平天湖→大王洞→傩戏文化园'], foods: [{ name: '贵池小粑', price: '5-8元', mustTry: true, location: '市区' }] },
  '共青城': { title: '共青城·青年之城', season: '春秋最佳', days: '1天', tags: ['胡耀邦陵园','富华山','羽绒服装'], poster: { style: 'fresh', subtitle: '中国青年之城 共青城' }, routes: ['胡耀邦陵园→富华山景区→南湖湿地'], foods: [{ name: '共青城板鸭', price: '50-80元/只', mustTry: true, location: '市区' }] },
  '瑞昌': { title: '瑞昌·青铜故里', season: '春秋最佳', days: '1天', tags: ['铜岭遗址','峨眉溶洞','剪纸'], poster: { style: 'fresh', subtitle: '中国青铜故里 瑞昌' }, routes: ['铜岭商周矿冶遗址→峨眉溶洞→赤湖'], foods: [{ name: '瑞昌山药', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '庐山': { title: '庐山·匡庐奇秀', season: '春夏秋最佳', days: '2-3', tags: ['庐山风景区','白鹿洞书院','牯岭镇'], poster: { style: 'fresh', subtitle: '匡庐奇秀甲天下' }, routes: ['庐山（花径→锦绣谷→仙人洞→含鄱口→五老峰）→白鹿洞书院→秀峰'], foods: [{ name: '庐山云雾茶', price: '200-500元/斤', mustTry: true, location: '牯岭' }] },
  '井冈山': { title: '井冈山·革命摇篮', season: '春秋最佳', days: '2-3', tags: ['井冈山革命根据地','茨坪','杜鹃花'], poster: { style: 'vintage', subtitle: '中国革命的摇篮 井冈山' }, routes: ['井冈山革命博物馆→茨坪→黄洋界→龙潭→五指峰'], foods: [{ name: '井冈山红军饭', price: '30-50元', mustTry: true, location: '茨坪' }] },
  '丰城': { title: '丰城·剑邑', season: '春秋最佳', days: '1天', tags: ['丰水湖','剑文化','洪州窑'], poster: { style: 'fresh', subtitle: '中国剑邑 丰城' }, routes: ['丰水湖公园→丰城剑文化博物馆→洪州窑址'], foods: [{ name: '丰城冻米糖', price: '10-15元', mustTry: true, location: '市区' }] },
  '樟树': { title: '樟树·药都', season: '春秋最佳', days: '1天', tags: ['阁皂山','药交会','四特酒'], poster: { style: 'fresh', subtitle: '中国药都 樟树' }, routes: ['阁皂山→樟树药材市场→筑卫城遗址'], foods: [{ name: '樟树清汤', price: '15-25元', mustTry: true, location: '市区' }] },
  '高安': { title: '高安·建陶基地', season: '春秋最佳', days: '1天', tags: ['华林造纸作坊','元青花','建陶'], poster: { style: 'fresh', subtitle: '中国建筑陶瓷产业基地 高安' }, routes: ['华林宋元明造纸作坊遗址→高安元青花博物馆→瑞州府衙'], foods: [{ name: '高安腐竹', price: '8-12元', mustTry: true, location: '市区' }] },
  '瑞金': { title: '瑞金·红色故都', season: '春秋最佳', days: '1-2天', tags: ['中华苏维埃共和国旧址','长征出发地','红色教育'], poster: { style: 'vintage', subtitle: '共和国摇篮 红色故都' }, routes: ['中华苏维埃共和国临时中央政府旧址→叶坪→沙洲坝→长征出发地'], foods: [{ name: '瑞金牛肉汤', price: '15-25元', mustTry: true, location: '市区' }] },
  '南康': { title: '南康·家具之都', season: '春秋最佳', days: '1天', tags: ['家具产业','南山森林公园','百家姓'], poster: { style: 'minimal', subtitle: '中国实木家具之都 南康' }, routes: ['南山森林公园→家居小镇→百家姓和谐城'], foods: [{ name: '南康甜柚', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '井冈山': { title: '井冈山·革命摇篮', season: '春秋最佳', days: '2-3', tags: ['井冈山革命根据地','茨坪','杜鹃花'], poster: { style: 'vintage', subtitle: '中国革命的摇篮 井冈山' }, routes: ['井冈山革命博物馆→茨坪→黄洋界→龙潭→五指峰'], foods: [{ name: '井冈山红军饭', price: '30-50元', mustTry: true, location: '茨坪' }] },
  '曲阜': { title: '曲阜·东方圣城', season: '春秋最佳', days: '1-2天', tags: ['三孔（孔庙孔府孔林）','孔子故里','儒家文化'], poster: { style: 'vintage', subtitle: '孔子故里 东方圣城' }, routes: ['孔庙→孔府→孔林→孔子六艺城→尼山圣境'], foods: [{ name: '曲阜香酥煎饼', price: '10-15元', mustTry: true, location: '孔庙附近' }] },
  '邹城': { title: '邹城·孟子故里', season: '春秋最佳', days: '1天', tags: ['孟府孟庙','峄山','孟子文化'], poster: { style: 'vintage', subtitle: '孟子故里 邹鲁之邦' }, routes: ['孟府→孟庙→孟林→峄山→明鲁王墓'], foods: [{ name: '邹城烧饼', price: '3-5元', mustTry: true, location: '市区' }] },
  '新泰': { title: '新泰·莲花山', season: '春秋最佳', days: '1天', tags: ['莲花山','青云山','煤炭'], poster: { style: 'fresh', subtitle: '莲花山胜境 新泰' }, routes: ['莲花山→青云山→清音公园→新汶煤矿工业旅游'], foods: [{ name: '新泰煎饼', price: '5-8元', mustTry: true, location: '市区' }] },
  '肥城': { title: '肥城·桃都', season: '春季最佳（桃花节）', days: '1天', tags: ['肥城桃','范蠡墓','君子之邑'], poster: { style: 'fresh', subtitle: '中国桃都 肥城' }, routes: ['肥城桃源世界风景区→范蠡墓→肥城桃文化博物馆'], foods: [{ name: '肥城桃', price: '10-20元/斤', mustTry: true, location: '市区' }] },
  '乳山': { title: '乳山·银滩', season: '夏季最佳', days: '1-2天', tags: ['银滩旅游度假区','大乳山','母爱文化'], poster: { style: 'fresh', subtitle: '母爱圣地 乳山银滩' }, routes: ['银滩旅游度假区→大乳山滨海旅游度假区→岠嵎山'], foods: [{ name: '乳山牡蛎', price: '30-50元/斤', mustTry: true, location: '银滩' }] },
  '荣成': { title: '荣成·天鹅湖', season: '冬季（看天鹅）/夏秋', days: '1-2天', tags: ['成山头','天鹅湖','海草房'], poster: { style: 'fresh', subtitle: '中国好运角 荣成' }, routes: ['成山头（天尽头）→荣成天鹅湖→海草房村落→赤山法华院'], foods: [{ name: '荣成海带', price: '10-20元/斤', mustTry: true, location: '沿海' }] },
  '胶州': { title: '胶州·板桥之都', season: '春秋最佳', days: '1天', tags: ['大沽河','艾山','板桥镇'], poster: { style: 'fresh', subtitle: '海上丝绸之路起点 胶州' }, routes: ['大沽河生态旅游度假区→艾山→板桥镇遗址'], foods: [{ name: '胶州白菜', price: '3-5元/斤', mustTry: true, location: '市区' }] },
  '即墨': { title: '即墨·古城', season: '春秋最佳', days: '1-2天', tags: ['即墨古城','温泉','田横岛'], poster: { style: 'vintage', subtitle: '千年商都 即墨古城' }, routes: ['即墨古城→温泉小镇→田横岛→鹤山'], foods: [{ name: '即墨麻片', price: '10-15元', mustTry: true, location: '市区' }] },
  '平度': { title: '平度·葡萄之乡', season: '秋季最佳', days: '1-2天', tags: ['大泽山葡萄','云山','胶莱河'], poster: { style: 'fresh', subtitle: '中国葡萄之乡 平度' }, routes: ['大泽山（葡萄采摘）→云山→茶山→胶莱河'], foods: [{ name: '大泽山葡萄', price: '10-20元/斤', mustTry: true, location: '大泽山' }] },
  '蓬莱': { title: '蓬莱·人间仙境', season: '夏季最佳', days: '1-2天', tags: ['蓬莱阁','八仙过海','葡萄酒'], poster: { style: 'fresh', subtitle: '人间仙境 蓬莱' }, routes: ['蓬莱阁→八仙过海景区→三仙山→君顶酒庄→长岛'], foods: [{ name: '蓬莱小面', price: '15-25元', mustTry: true, location: '市区' }] },
  '招远': { title: '招远·金都', season: '春秋最佳', days: '1天', tags: ['淘金小镇','罗山','黄金'], poster: { style: 'fresh', subtitle: '中国金都 招远' }, routes: ['淘金小镇→罗山国家森林公园→黄金博物馆→招远金矿'], foods: [{ name: '招远粉丝', price: '10-15元', mustTry: true, location: '市区' }] },
  '栖霞': { title: '栖霞·苹果之都', season: '秋季最佳', days: '1天', tags: ['牟氏庄园','太虚宫','苹果'], poster: { style: 'fresh', subtitle: '中国苹果之都 栖霞' }, routes: ['牟氏庄园（北方民间故宫）→太虚宫→苹果观光园'], foods: [{ name: '栖霞苹果', price: '5-10元/斤', mustTry: true, location: '市区' }] },
  '海阳': { title: '海阳·沙滩', season: '夏季最佳', days: '1-2天', tags: ['万米海滩','地雷战','沙雕'], poster: { style: 'fresh', subtitle: '万米金沙滩 海阳' }, routes: ['万米海水浴场→地雷战旅游区→沙雕艺术公园→招虎山'], foods: [{ name: '海阳白黄瓜', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '龙口': { title: '龙口·粉笔之都', season: '夏季最佳', days: '1-2天', tags: ['南山','丁氏故里','粉笔'], poster: { style: 'fresh', subtitle: '中国粉笔之都 龙口' }, routes: ['南山大佛→南山旅游景区→丁氏故里→龙口港'], foods: [{ name: '龙口粉丝', price: '10-15元', mustTry: true, location: '市区' }] },
  '青州': { title: '青州·古城', season: '春秋最佳', days: '1-2天', tags: ['青州古城','云门山','花卉'], poster: { style: 'vintage', subtitle: '古九州之一 青州' }, routes: ['青州古城（偶园→万年桥→宋城）→云门山→仰天山→黄花溪'], foods: [{ name: '隆盛糕点', price: '15-25元', mustTry: true, location: '偶园街' }] },
  '诸城': { title: '诸城·恐龙之乡', season: '春秋最佳', days: '1天', tags: ['恐龙化石','超然台','密州'], poster: { style: 'fresh', subtitle: '中国龙城 诸城' }, routes: ['诸城恐龙博物馆（巨型诸城暴龙）→超然台→潍河公园'], foods: [{ name: '诸城烧肉', price: '50-80元', mustTry: true, location: '市区' }] },
  '寿光': { title: '寿光·蔬菜之乡', season: '全年适宜', days: '1天', tags: ['蔬菜高科技示范园','弥河','蔬菜博览会'], poster: { style: 'fresh', subtitle: '中国蔬菜之乡 寿光' }, routes: ['寿光蔬菜高科技示范园→蔬菜博览会→弥河生态农业观光园'], foods: [{ name: '寿光韭菜', price: '3-5元/斤', mustTry: true, location: '市区' }] },
  '安丘': { title: '安丘·姜蒜之乡', season: '春秋最佳', days: '1天', tags: ['青云山','景芝酒','姜蒜'], poster: { style: 'fresh', subtitle: '中国姜蒜之乡 安丘' }, routes: ['青云山民俗游乐园→景芝酒之城→城顶山'], foods: [{ name: '安丘景芝酒', price: '20-50元/瓶', mustTry: false, location: '景芝' }] },
  '高密': { title: '高密·莫言故里', season: '春秋最佳', days: '1天', tags: ['莫言旧居','红高粱','扑灰年画'], poster: { style: 'fresh', subtitle: '诺贝尔文学奖得主莫言故里' }, routes: ['莫言旧居→红高粱影视城→高密扑灰年画艺术馆→聂家庄泥塑'], foods: [{ name: '高密烧鸡', price: '38-58元/只', mustTry: true, location: '市区' }] },
  '昌邑': { title: '昌邑·丝绸之乡', season: '春秋最佳', days: '1天', tags: ['绿博园','博陆山','丝绸'], poster: { style: 'fresh', subtitle: '中国丝绸之乡 昌邑' }, routes: ['绿博园→博陆山→潍水风情湿地公园'], foods: [{ name: '昌邑虾酱', price: '10-15元', mustTry: true, location: '下营' }] },
  '禹城': { title: '禹城·功能糖城', season: '春秋最佳', days: '1天', tags: ['大禹治水','功能糖','徒骇河'], poster: { style: 'fresh', subtitle: '中国功能糖城 禹城' }, routes: ['徒骇河湿地公园→大禹公园→禹王亭博物馆'], foods: [{ name: '禹城扒鸡', price: '30-50元/只', mustTry: true, location: '市区' }] },
  '乐陵': { title: '乐陵·枣乡', season: '秋季最佳', days: '1天', tags: ['金丝小枣','碧霞元君故居','枣林'], poster: { style: 'fresh', subtitle: '中国金丝小枣之乡 乐陵' }, routes: ['枣林游览区→碧霞元君故居→文庙'], foods: [{ name: '乐陵金丝小枣', price: '15-30元/斤', mustTry: true, location: '朱集镇' }] },
  '临清': { title: '临清·运河名城', season: '春秋最佳', days: '1天', tags: ['运河钞关','鳌头矶','舍利宝塔'], poster: { style: 'vintage', subtitle: '运河名城 临清' }, routes: ['临清运河钞关→鳌头矶→舍利宝塔→宛园'], foods: [{ name: '临清烧卖', price: '10-15元', mustTry: true, location: '市区' }] },
  '邹平': { title: '邹平·范公故里', season: '春秋最佳', days: '1-2天', tags: ['范仲淹','鹤伴山','铝业'], poster: { style: 'fresh', subtitle: '范仲淹故里 邹平' }, routes: ['范公祠→鹤伴山→黄山→唐李庵→醴泉寺'], foods: [{ name: '邹平柿子', price: '5-8元/斤', mustTry: true, location: '山区' }] },
  '新郑': { title: '新郑·黄帝故里', season: '春秋最佳', days: '1天', tags: ['黄帝故里','裴李岗文化','红枣'], poster: { style: 'vintage', subtitle: '炎黄子孙寻根拜祖圣地 新郑' }, routes: ['黄帝故里→裴李岗遗址→郑韩故城→好想你红枣小镇'], foods: [{ name: '新郑大枣', price: '15-30元/斤', mustTry: true, location: '孟庄镇' }] },
  '登封': { title: '登封·天地之中', season: '春秋最佳', days: '1-2天', tags: ['嵩山少林寺','嵩阳书院','中岳庙'], poster: { style: 'vintage', subtitle: '天地之中 登封' }, routes: ['嵩山少林寺（武术表演→塔林→达摩洞）→嵩阳书院→中岳庙→观星台'], foods: [{ name: '登封烩羊肉', price: '30-50元', mustTry: true, location: '市区' }] },
  '新密': { title: '新密·伏羲山', season: '春秋最佳', days: '1天', tags: ['伏羲山','打虎亭汉墓','古城寨'], poster: { style: 'fresh', subtitle: '伏羲文化发源地 新密' }, routes: ['伏羲山（三泉湖→红石林）→打虎亭汉墓→古城寨遗址'], foods: [{ name: '新密大隗牛肉', price: '40-60元', mustTry: true, location: '大隗镇' }] },
  '荥阳': { title: '荥阳·象棋故里', season: '春秋最佳', days: '1天', tags: ['黄河风景名胜区','楚河汉界','郑氏宗祠'], poster: { style: 'fresh', subtitle: '中国象棋故里 荥阳' }, routes: ['黄河风景名胜区（楚河汉界）→郑氏宗祠→刘禹锡公园→虎牢关'], foods: [{ name: '荥阳柿霜糖', price: '10-15元', mustTry: true, location: '市区' }] },
  '巩义': { title: '巩义·诗圣故里', season: '春秋最佳', days: '1-2天', tags: ['杜甫故里','石窟寺','康百万庄园'], poster: { style: 'fresh', subtitle: '诗圣杜甫故里 巩义' }, routes: ['杜甫故里→石窟寺→康百万庄园→北宋皇陵（永昭陵、永厚陵）→青龙山'], foods: [{ name: '巩义回民郭义烧鸡', price: '30-50元', mustTry: true, location: '回郭镇' }] },
  '偃师': { title: '偃师·玄奘故里', season: '春秋最佳', days: '1天', tags: ['玄奘故里','二里头遗址','商城遗址'], poster: { style: 'vintage', subtitle: '玄奘故里 夏商都城 偃师' }, routes: ['玄奘故里→二里头夏都遗址博物馆→商城遗址→汉魏洛阳故城'], foods: [{ name: '偃师银条', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '汝州': { title: '汝州·瓷魁之乡', season: '春秋最佳', days: '1-2天', tags: ['汝瓷','风穴寺','怪坡'], poster: { style: 'fresh', subtitle: '中国汝瓷之都 汝州' }, routes: ['汝瓷博物馆→风穴寺→怪坡→九峰山'], foods: [{ name: '汝州粉皮', price: '8-12元', mustTry: true, location: '市区' }] },
  '济源': { title: '济源·愚公故里', season: '春秋最佳', days: '1-2天', tags: ['王屋山','小浪底','济渎庙'], poster: { style: 'fresh', subtitle: '愚公移山 济水之源' }, routes: ['王屋山（愚公移山处）→小浪底水利枢纽→黄河三峡→济渎庙'], foods: [{ name: '济源土馍', price: '10-15元', mustTry: true, location: '市区' }] },
  '永城': { title: '永城·汉兴之地', season: '春秋最佳', days: '1-2天', tags: ['芒砀山','汉高祖斩蛇处','汉文化'], poster: { style: 'vintage', subtitle: '汉兴之地 永城' }, routes: ['芒砀山（汉高祖斩蛇处→刘邦像→夫子山→陈胜墓）→崇法寺'], foods: [{ name: '永城酂城糟鱼', price: '30-50元', mustTry: true, location: '酂城镇' }] },
  '项城': { title: '项城·袁世凯故里', season: '春秋最佳', days: '1天', tags: ['袁世凯故居','南顿故城','皮革'], poster: { style: 'vintage', subtitle: '袁世凯故里 项城' }, routes: ['袁世凯故居→南顿故城→驸马沟'], foods: [{ name: '项城白芝麻', price: '10-15元/斤', mustTry: true, location: '市区' }] },
  '济源': { title: '济源·愚公故里', season: '春秋最佳', days: '1-2天', tags: ['王屋山','小浪底','济渎庙'], poster: { style: 'fresh', subtitle: '愚公移山 济水之源' }, routes: ['王屋山（愚公移山处）→小浪底水利枢纽→黄河三峡→济渎庙'], foods: [{ name: '济源土馍', price: '10-15元', mustTry: true, location: '市区' }] },

  // === 华中县级市 ===
  '应城': { title: '应城·膏都', season: '春秋最佳', days: '1天', tags: ['石膏矿','汤池温泉','文峰塔'], poster: { style: 'fresh', subtitle: '中国膏都 应城' }, routes: ['汤池温泉→文峰塔→应城国家矿山公园'], foods: [{ name: '应城麻花', price: '10-15元', mustTry: true, location: '市区' }] },
  '安陆': { title: '安陆·李白故里', season: '春秋最佳', days: '1天', tags: ['白兆山','李白纪念馆','银杏'], poster: { style: 'fresh', subtitle: '李白十年寓家地 安陆' }, routes: ['白兆山李白文化旅游区→李白纪念馆→钱冲银杏谷'], foods: [{ name: '安陆翰林鸡', price: '48-78元', mustTry: true, location: '市区' }] },
  '汉川': { title: '汉川·荷藕之乡', season: '夏季最佳', days: '1天', tags: ['汈汊湖','荷藕','刁汊湖'], poster: { style: 'fresh', subtitle: '中国荷藕之乡 汉川' }, routes: ['汈汊湖国家湿地公园→天屿湖→刁叉湖'], foods: [{ name: '汉川荷藕', price: '5-8元/斤', mustTry: true, location: '汈汊湖' }] },
  '麻城': { title: '麻城·杜鹃花城', season: '春季最佳（4-5月）', days: '1-2天', tags: ['龟峰山杜鹃','杏花村','移民文化'], poster: { style: 'fresh', subtitle: '人间四月天 麻城看杜鹃' }, routes: ['龟峰山风景区（十万亩杜鹃花海）→杏花村→五脑山帝主庙'], foods: [{ name: '麻城肉糕', price: '28-48元', mustTry: true, location: '市区' }] },
  '武穴': { title: '武穴·油菜花海', season: '春季最佳', days: '1天', tags: ['油菜花','横岗山','武山湖'], poster: { style: 'fresh', subtitle: '中国油菜之乡 武穴' }, routes: ['武穴油菜花海→横岗山→武山湖国家湿地公园'], foods: [{ name: '武穴酥糖', price: '10-15元', mustTry: true, location: '市区' }] },
  '仙桃': { title: '仙桃·体操之乡', season: '春秋最佳', days: '1天', tags: ['体操冠军','沔阳三蒸','梦里水乡'], poster: { style: 'fresh', subtitle: '中国体操之乡 仙桃' }, routes: ['梦里水乡文化旅游区→沔阳古城→排湖风景区'], foods: [{ name: '沔阳三蒸', price: '30-50元', mustTry: true, location: '市区' }] },
  '潜江': { title: '潜江·龙虾之乡', season: '夏季最佳', days: '1天', tags: ['小龙虾','曹禺故里','章华台'], poster: { style: 'fresh', subtitle: '中国小龙虾之乡 潜江' }, routes: ['龙虾城→曹禺公园→章华台→返湾湖'], foods: [{ name: '潜江小龙虾', price: '50-100元/斤', mustTry: true, location: '市区' }] },
  '天门': { title: '天门·茶圣故里', season: '春秋最佳', days: '1天', tags: ['陆羽故里','西湖','蒸菜'], poster: { style: 'fresh', subtitle: '茶圣陆羽故里 天门' }, routes: ['陆羽故园→西湖→东湖→蒸菜美食街'], foods: [{ name: '天门蒸菜', price: '30-50元', mustTry: true, location: '市区' }] },
  '枝江': { title: '枝江·桔都', season: '秋季最佳', days: '1天', tags: ['柑橘','滨江公园','步步升布鞋'], poster: { style: 'fresh', subtitle: '中国柑橘之乡 枝江' }, routes: ['枝江市滨江公园→步步升布鞋文化村→安福寺'], foods: [{ name: '枝江脐橙', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '当阳': { title: '当阳·关公圣地', season: '春秋最佳', days: '1天', tags: ['玉泉寺','关陵','长坂坡'], poster: { style: 'vintage', subtitle: '关公显圣处 当阳' }, routes: ['玉泉寺（关公显圣处）→关陵→长坂坡→当阳古城'], foods: [{ name: '当阳豆皮', price: '8-12元', mustTry: true, location: '市区' }] },
  '宜都': { title: '宜都·柑橘之乡', season: '秋季最佳', days: '1天', tags: ['三峡湿地','杨守敬','清江'], poster: { style: 'fresh', subtitle: '中国柑橘之乡 宜都' }, routes: ['三峡湿地→杨守敬书院→清江天龙湾'], foods: [{ name: '宜都蜜橘', price: '3-5元/斤', mustTry: true, location: '市区' }] },
  '松滋': { title: '松滋·金松滋', season: '春秋最佳', days: '1-2天', tags: ['洈水风景区','卸甲坪','土家族'], poster: { style: 'fresh', subtitle: '金松滋 洈水风光' }, routes: ['洈水风景区→卸甲坪土家风情园→颜将军洞'], foods: [{ name: '松滋鸡', price: '68-98元/只', mustTry: true, location: '市区' }] },
  '石首': { title: '石首·中国麋鹿之乡', season: '春秋最佳', days: '1天', tags: ['麋鹿保护区','天鹅洲','长江故道'], poster: { style: 'fresh', subtitle: '中国麋鹿之乡 石首' }, routes: ['中华麋鹿保护区→天鹅洲长江故道湿地→桃花山'], foods: [{ name: '石首笔架鱼', price: '80-150元', mustTry: true, location: '长江' }] },
  '洪湖': { title: '洪湖·湘鄂西革命根据地', season: '夏季最佳', days: '1-2天', tags: ['洪湖蓝田','湘鄂西革命根据地','荷花'], poster: { style: 'fresh', subtitle: '洪湖水浪打浪 洪湖' }, routes: ['洪湖蓝田旅游区→瞿家湾湘鄂西革命根据地旧址→悦兮半岛温泉'], foods: [{ name: '洪湖莲子', price: '15-25元/斤', mustTry: true, location: '湖区' }] },
  '钟祥': { title: '钟祥·长寿之乡', season: '春秋最佳', days: '1-2天', tags: ['明显陵','黄仙洞','莫愁湖'], poster: { style: 'fresh', subtitle: '世界长寿之乡 钟祥' }, routes: ['明显陵（世界文化遗产）→黄仙洞→莫愁湖→莫愁村'], foods: [{ name: '蟠龙菜', price: '38-58元', mustTry: true, location: '市区' }] },
  '浏阳': { title: '浏阳·花炮之乡', season: '全年适宜', days: '1-2天', tags: ['烟花','大围山','秋收起义'], poster: { style: 'fresh', subtitle: '中国花炮之乡 浏阳' }, routes: ['大围山国家森林公园→秋收起义文家市会师纪念馆→浏阳河'], foods: [{ name: '浏阳蒸菜', price: '30-50元', mustTry: true, location: '市区' }] },
  '醴陵': { title: '醴陵·瓷城', season: '春秋最佳', days: '1天', tags: ['釉下五彩瓷','李立三','耿飚'], poster: { style: 'fresh', subtitle: '中国瓷城 醴陵' }, routes: ['醴陵陶瓷博物馆→李立三故居→耿飚故居→渌江书院'], foods: [{ name: '醴陵炒粉', price: '10-15元', mustTry: true, location: '市区' }] },
  '湘乡': { title: '湘乡·龙城', season: '春秋最佳', days: '1天', tags: ['东山书院','水府庙','曾国藩'], poster: { style: 'fresh', subtitle: '龙城湘乡 曾国藩故里' }, routes: ['东山书院（毛泽东求学地）→水府庙→褚公祠'], foods: [{ name: '湘乡烘糕', price: '8-12元', mustTry: true, location: '市区' }] },
  '韶山': { title: '韶山·毛泽东故里', season: '全年适宜', days: '1天', tags: ['毛泽东故居','滴水洞','铜像广场'], poster: { style: 'vintage', subtitle: '太阳升起的地方 韶山' }, routes: ['毛泽东同志故居→毛泽东铜像广场→毛泽东纪念馆→滴水洞→韶峰'], foods: [{ name: '韶山毛家红烧肉', price: '38-58元', mustTry: true, location: '市区' }] },
  '耒阳': { title: '耒阳·纸都', season: '春秋最佳', days: '1天', tags: ['蔡伦竹海','纸文化','农耕'], poster: { style: 'fresh', subtitle: '蔡伦故里 中国纸都' }, routes: ['蔡伦竹海→纸文化博物馆→农耕文化博览园'], foods: [{ name: '耒阳粉皮', price: '8-12元', mustTry: true, location: '市区' }] },
  '常宁': { title: '常宁·有色金属之乡', season: '春秋最佳', days: '1天', tags: ['庙前镇','印山','有色金属'], poster: { style: 'fresh', subtitle: '中国有色金属之乡 常宁' }, routes: ['中国印山→庙前镇古民居→天堂山'], foods: [{'name': '常宁凉粉', 'price': '5-8元', 'mustTry': true, 'location': '市区'}] },
  '武冈': { title: '武冈·卤菜之都', season: '春秋最佳', days: '1天', tags: ['武冈卤菜','云山','古城墙'], poster: { style: 'fresh', subtitle: '中国卤菜之都 武冈' }, routes: ['云山国家森林公园→武冈古城墙→黄埔军校第二分校旧址'], foods: [{ name: '武冈卤菜', price: '30-50元', mustTry: true, location: '市区' }] },
  '汨罗': { title: '汨罗·端午源头', season: '端午节期间', days: '1天', tags: ['屈原投江处','龙舟竞渡','屈子祠'], poster: { style: 'vintage', subtitle: '端午源头 龙舟故里' }, routes: ['屈子祠→屈原墓→汨罗江→屈子文化园'], foods: [{ name: '汨罗粽子', price: '5-10元/只', mustTry: true, location: '市区' }] },
  '临湘': { title: '临湘·浮标之乡', season: '春秋最佳', days: '1天', tags: ['6501工程','江南大漠','浮标'], poster: { style: 'fresh', subtitle: '中国浮标之乡 临湘' }, routes: ['6501地下军事工程→江南大漠（人工沙漠）→龙窖山'], foods: [{ name: '临湘黑茶', price: '50-100元', mustTry: true, location: '羊楼司'] }],
  '津市': { title: '津市·澧水门户', season: '春秋最佳', days: '1天', tags: ['药山','灵泉','米粉'], poster: { style: 'fresh', subtitle: '澧水门户 津市' }, routes: ['药山寺→灵泉镇→嘉山'], foods: [{ name: '津市牛肉粉', price: '15-25元', mustTry: true, location: '市区' }] },
  '沅江': { title: '沅江·洞庭湖明珠', season: '夏季最佳', days: '1天', tags: ['南洞庭湖','赤山岛','芦苇'], poster: { style: 'fresh', subtitle: '洞庭湖明珠 沅江' }, routes: ['南洞庭湖湿地→赤山岛→南洞庭湖芦苇场'], foods: [{ name: '沅江银鱼', price: '100-200元/斤', mustTry: true, location: '洞庭湖' }] },
  '资兴': { title: '资兴·东江湖', season: '春秋最佳', days: '1-2天', tags: ['东江湖','小东江','流华湾'], poster: { style: 'fresh', subtitle: '雾漫小东江 资兴' }, routes: ['东江湖（雾漫小东江→龙景峡谷→兜率岛）→流华湾古村→回龙山'], foods: [{ name: '资兴东江鱼', price: '50-80元', mustTry: true, location: '东江湖' }] },
  '冷水江': { title: '冷水江·锑都', season: '春秋最佳', days: '1天', tags: ['波月洞','大乘山','锑矿'], poster: { style: 'minimal', subtitle: '世界锑都 冷水江' }, routes: ['波月洞→大乘山→锡矿山'], foods: [{ name: '冷水江嗦螺', price: '15-25元', mustTry: true, location: '市区' }] },
  '涟源': { title: '涟源·煤海', season: '春秋最佳', days: '1天', tags: ['湄江','龙山','煤炭'], poster: { style: 'fresh', subtitle: '煤海涟源 湄江风光' }, routes: ['湄江国家地质公园→龙山国家森林公园→三甲古村落'], foods: [{ name: '涟源合菜', price: '20-30元', mustTry: true, location: '市区' }] },
  '吉首': { title: '吉首·湘西首府', season: '春秋最佳', days: '1-2天', tags: ['矮寨大桥','乾州古城','苗族'], poster: { style: 'fresh', subtitle: '湘西首府 吉首' }, routes: ['矮寨特大悬索桥（矮寨大桥）→乾州古城→德夯苗寨'], foods: [{ name: '吉首酸肉', price: '30-50元', mustTry: true, location: '市区' }] },
  '泸溪': { title: '泸溪·盘瓠故里', season: '春秋最佳', days: '1天', tags: ['白沙城','盘瓠文化','辛女岩'], poster: { style: 'fresh', subtitle: '盘瓠故里 泸溪' }, routes: ['白沙古城→辛女岩→浦市古镇'], foods: [{ name: '泸溪椪柑', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '凤凰': { title: '凤凰·最美小城', season: '全年适宜', days: '1-2天', tags: ['凤凰古城','沈从文','沱江'], poster: { style: 'fresh', subtitle: '中国最美小城 凤凰' }, routes: ['凤凰古城（沱江吊脚楼→虹桥→沈从文故居→熊希龄故居）→南方长城→飞水谷'], foods: [{ name: '凤凰血粑鸭', price: '48-78元', mustTry: true, location: '沱江边' }] },

  // === 华南县级市 ===
  '英德': { title: '英德·红茶之乡', season: '全年适宜', days: '1-2天', tags: ['英德红茶','宝晶宫','溶洞'], poster: { style: 'fresh', subtitle: '中国红茶之乡 英德' }, routes: ['宝晶宫→英西峰林→积庆里红茶谷→浈阳峡'], foods: [{ name: '英德红茶', price: '100-300元/斤', mustTry: true, location: '积庆里' }] },
  '连州': { title: '连州·菜心之乡', season: '冬季最佳', days: '1-2天', tags: ['连州菜心','湟川三峡','地下河'], poster: { style: 'fresh', subtitle: '中国菜心之乡 连州' }, routes: ['湟川三峡→连州地下河→慧光塔→保安村'], foods: [{ name: '连州菜心', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '乐昌': { title: '乐昌·马蹄之乡', season: '秋冬最佳', days: '1天', tags: ['金鸡岭','龙王潭','马蹄'], poster: { style: 'fresh', subtitle: '中国马蹄之乡 乐昌' }, routes: ['金鸡岭→龙王潭生态旅游区→古佛洞天'], foods: [{ name: '乐昌马蹄', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '南雄': { title: '南雄·银杏之乡', season: '秋季最佳', days: '1-2天', tags: ['帽子峰银杏','珠玑巷','梅关古道'], poster: { style: 'fresh', subtitle: '中国银杏之乡 南雄' }, routes: ['帽子峰林场（银杏）→珠玑古巷→梅关古道→苍石寨'], foods: [{ name: '南雄板鸭', price: '50-80元/只', mustTry: true, location: '市区' }] },
  '兴宁': { title: '兴宁·围龙屋之乡', season: '全年适宜', days: '1天', tags: ['围龙屋','神光山','客家人文'], poster: { style: 'fresh', subtitle: '中国围龙屋之乡 兴宁' }, routes: ['神光山国家森林公园→合水水库→客家围龙屋'], foods: [{ name: '兴宁酿豆腐', price: '15-25元', mustTry: true, location: '市区' }] },
  '廉江': { title: '廉江·红橙之乡', season: '冬季最佳', days: '1天', tags: ['红橙','鹤地水库','谢鞋山'], poster: { style: 'fresh', subtitle: '中国红橙之乡 廉江' }, routes: ['鹤地水库→谢鞋山→田园寨'], foods: [{ name: '廉江红橙', price: '10-15元/斤', mustTry: true, location: '市区' }] },
  '雷州': { title: '雷州·历史文化名城', season: '秋冬最佳', days: '1-2天', tags: ['雷祖祠','三元塔','雷州石狗'], poster: { style: 'vintage', subtitle: '国家历史文化名城 雷州' }, routes: ['雷祖祠→三元塔公园→雷州西湖→茂德公古城'], foods: [{ name: '雷州白切狗', price: '50-80元', mustTry: true, location: '市区' }] },
  '吴川': { title: '吴川·建筑之乡', season: '全年适宜', days: '1天', tags: ['吉兆湾','鼎龙湾','飘色'], poster: { style: 'fresh', subtitle: '中国建筑之乡 吴川' }, routes: ['吉兆湾海滨→鼎龙湾国际海洋度假区→吴川飘色'], foods: [{ name: '吴川粉皮', price: '8-12元', mustTry: true, location: '市区' }] },
  '高州': { title: '高州·水果之乡', season: '全年适宜', days: '1天', tags: ['根子荔枝','冼太庙','宝光塔'], poster: { style: 'fresh', subtitle: '中国水果之乡 高州' }, routes: ['根子荔枝文化旅游区→冼太庙→宝光塔→长坡旧城'], foods: [{ name: '高州荔枝', price: '10-20元/斤', mustTry: true, location: '根子' }] },
  '信宜': { title: '信宜·玉都', season: '全年适宜', days: '1-2天', tags: ['玉石','大雾山','根雕'], poster: { style: 'fresh', subtitle: '中国玉都 信宜' }, routes: ['大雾岭国家自然保护区→天马山→玉石市场'], foods: [{ name: '信宜怀乡鸡', price: '68-98元/只', mustTry: true, location: '怀乡镇' }] },
  '四会': { title: '四会·柑桔之乡', season: '秋季最佳', days: '1天', tags: ['贞山','柑桔','玉器'], poster: { style: 'fresh', subtitle: '中国柑桔之乡 四会' }, routes: ['贞山风景区→四会柑桔采摘园→玉器市场'], foods: [{ name: '四会柑桔', price: '5-8元/斤', mustTry: true, location: '市区' }] },
  '恩平': { title: '恩平·温泉之乡', season: '全年适宜', days: '1-2天', tags: ['锦江温泉','帝都温泉','碉楼'], poster: { style: 'fresh', subtitle: '中国温泉之乡 恩平' }, routes: ['锦江温泉度假村→帝都温泉→石头村→歇马举人村'], foods: [{ name: '恩平濑粉', price: '10-15元', mustTry: true, location: '市区' }] },
  '台山': { title: '台山·侨乡', season: '全年适宜', days: '1-2天', tags: ['上下川岛','开平碉楼','华侨文化'], poster: { style: 'fresh', subtitle: '中国第一侨乡 台山' }, routes: ['上下川岛→那琴半岛→梅家大院→海口埠'], foods: [{ name: '台山黄鳝饭', price: '30-50元', mustTry: true, location: '四九镇' }] },
  '开平': { title: '开平·碉楼之乡', season: '全年适宜', days: '1-2天', tags: ['开平碉楼','自力村','立园'], poster: { style: 'vintage', subtitle: '世界文化遗产 开平碉楼' }, routes: ['自力村碉楼群→立园→马降龙碉楼群→锦江里碉楼群'], foods: [{ name: '开平马冈鹅', price: '68-98元/只', mustTry: true, location: '马冈镇' }] },
  '鹤山': { title: '鹤山·咏春故乡', season: '全年适宜', days: '1天', tags: ['梁赞故居','大雁山','古劳水乡'], poster: { style: 'fresh', subtitle: '咏春拳发源地 鹤山' }, routes: ['梁赞故居（咏春拳）→大雁山→古劳水乡'], foods: [{ name: '鹤山茶山水库鱼', price: '50-80元', mustTry: true, location: '古劳' }] },
  '桂平': { title: '桂平·西山', season: '全年适宜', days: '1-2天', tags: ['西山','龙潭公园','太平天国'], poster: { style: 'fresh', subtitle: '中国佛教名山 桂平西山' }, routes: ['西山风景名胜区→龙潭国家森林公园→太平天国金田起义旧址'], foods: [{ name: '桂平猪脚粉', price: '12-18元', mustTry: true, location: '市区' }] },
  '北流': { title: '北流·陶瓷之乡', season: '全年适宜', days: '1天', tags: ['勾漏洞','陶瓷','荔枝'], poster: { style: 'fresh', subtitle: '中国陶瓷之乡 北流' }, routes: ['勾漏洞风景名胜区→大容山→陶瓷城'], foods: [{ name: '北流荔枝', price: '10-20元/斤', mustTry: true, location: '市区' }] },
  '岑溪': { title: '岑溪·花岗岩之都', season: '全年适宜', days: '1天', tags: ['花岗岩','石庙','邓公山'], poster: { style: 'fresh', subtitle: '中国花岗岩之都 岑溪' }, routes: ['石庙景区→邓公山→天龙顶山地公园'], foods: [{ name: '岑溪米粉', price: '8-12元', mustTry: true, location: '市区' }] },
  '东兴': { title: '东兴·边境口岸', season: '全年适宜', days: '1天', tags: ['东兴口岸','京族三岛','金滩'], poster: { style: 'fresh', subtitle: '中越边境 东兴口岸' }, routes: ['东兴口岸→京族三岛→金滩→十万大山'], foods: [{ name: '东兴海鲜粉', price: '15-25元', mustTry: true, location: '口岸'] }],
  '凭祥': { title: '凭祥·友谊关', season: '全年适宜', days: '1天', tags: ['友谊关','浦寨边贸','越南风情'], poster: { style: 'fresh', subtitle: '祖国南大门 凭祥' }, routes: ['友谊关→浦寨边贸市场→白玉洞→大连城'], foods: [{ name: '凭祥水果捞', price: '10-15元', mustTry: true, location: '市区' }] },
  '合山': { title: '合山·光热城', season: '全年适宜', days: '1天', tags: ['矿山公园','红水河','光热发电'], poster: { style: 'minimal', subtitle: '中国光热城 合山' }, routes: ['合山国家矿山公园→红水河→玉屏山'], foods: [{ name: '合山红薯粉', price: '8-12元', mustTry: true, location: '市区' }] },
  '荔浦': { title: '荔浦·芋头之乡', season: '全年适宜', days: '1天', tags: ['荔浦芋头','银子岩','丰鱼岩'], poster: { style: 'fresh', subtitle: '中国芋头之乡 荔浦' }, routes: ['银子岩→丰鱼岩→荔江湾→荔浦芋头种植基地'], foods: [{ name: '荔浦芋扣肉', price: '38-58元', mustTry: true, location: '市区' }] },
  '桂平': { title: '桂平·西山', season: '全年适宜', days: '1-2天', tags: ['西山','龙潭公园','太平天国'], poster: { style: 'fresh', subtitle: '中国佛教名山 桂平西山' }, routes: ['西山风景名胜区→龙潭国家森林公园→太平天国金田起义旧址'], foods: [{ name: '桂平猪脚粉', price: '12-18元', mustTry: true, location: '市区' }] },

  // === 西南县级市 ===
  '西昌': { title: '西昌·航天城', season: '全年适宜', days: '1-2天', tags: ['邛海','泸山','卫星发射中心'], poster: { style: 'fresh', subtitle: '航天城 西昌 月亮城' }, routes: ['邛海湿地公园→泸山→西昌卫星发射中心→螺髻山'], foods: [{ name: '西昌火盆烧烤', price: '60-100元/人', mustTry: true, location: '市区' }] },
  '简阳': { title: '简阳·羊肉之乡', season: '全年适宜', days: '1天', tags: ['简阳羊肉','三岔湖','樱桃沟'], poster: { style: 'fresh', subtitle: '中国羊肉美食之乡 简阳' }, routes: ['三岔湖景区→樱桃沟→简阳大耳羊养殖基地'], foods: [{ name: '简阳羊肉汤', price: '60-100元', mustTry: true, location: '市区' }] },
  '都江堰': { title: '都江堰·天府之源', season: '全年适宜', days: '1-2天', tags: ['都江堰水利工程','青城山','熊猫'], poster: { style: 'fresh', subtitle: '拜水都江堰 问道青城山' }, routes: ['都江堰水利工程（鱼嘴→飞沙堰→宝瓶口）→青城山（前山/后山）→熊猫谷'], foods: [{ name: '都江堰青城四绝', price: '80-150元', mustTry: true, location: '青城山' }] },
  '彭州': { title: '彭州·牡丹之乡', season: '春季最佳', days: '1-2天', tags: ['彭州牡丹','丹景山','白鹿音乐小镇'], poster: { style: 'fresh', subtitle: '中国牡丹之乡 彭州' }, routes: ['丹景山（牡丹）→白鹿音乐小镇→彭州博物馆→葛仙山'], foods: [{ name: '九尺板鸭', price: '30-50元', mustTry: true, location: '九尺镇' }] },
  '邛崃': { title: '邛崃·文君故里', season: '全年适宜', days: '1天', tags: ['天台山','平乐古镇','卓文君'], poster: { style: 'fresh', subtitle: '文君故里 邛酒之乡' }, routes: ['天台山→平乐古镇→夹关古镇→邛窑考古遗址公园'], foods: [{ name: '邛崃奶汤面', price: '10-15元', mustTry: true, location: '市区' }] },
  '崇州': { title: '崇州·蜀中之蜀', season: '全年适宜', days: '1-2天', tags: ['街子古镇','凤栖山','罨画池'], poster: { style: 'fresh', subtitle: '蜀中之蜀 怀远崇州' }, routes: ['街子古镇→凤栖山→罨画池→元通古镇→道明竹艺村'], foods: [{ name: '天主堂鸡肉', price: '38-58元', mustTry: true, location: '元通' }] },
  '什邡': { title: '什邡·雪茄之乡', season: '全年适宜', days: '1天', tags: ['蓥华山','雪茄','穿心店地震遗址'], poster: { style: 'fresh', subtitle: '中国雪茄之乡 什邡' }, routes: ['蓥华山风景名胜区→穿心店地震遗址→什邡博物馆'], foods: [{ name: '什邡板鸭', price: '30-50元', mustTry: true, location: '市区' }] },
  '广汉': { title: '广汉·三星堆', season: '全年适宜', days: '1天', tags: ['三星堆','雒城遗址','保保节'], poster: { style: 'vintage', subtitle: '三星堆故里 广汉' }, routes: ['三星堆博物馆→三星堆遗址公园→雒城遗址→金雁湖'], foods: [{ name: '广汉金丝面', price: '10-15元', mustTry: true, location: '市区' }] },
  '江油': { title: '江油·李白故里', season: '全年适宜', days: '1-2天', tags: ['李白故里','窦圌山','佛爷洞'], poster: { style: 'fresh', subtitle: '诗仙李白故里 江油' }, routes: ['李白故里→窦圌山→佛爷洞→青莲古镇→李白纪念馆'], foods: [{ name: '江油肥肠', price: '15-25元', mustTry: true, location: '市区' }] },
  '阆中': { title: '阆中·风水古城', season: '全年适宜', days: '1-2天', tags: ['阆中古城','风水文化','春节文化'], poster: { style: 'vintage', subtitle: '中国四大古城之一 阆中' }, routes: ['阆中古城（中天楼→贡院→川北道署→汉桓侯祠）→锦屏山→滕王阁→南津关'], foods: [{ name: '阆中牛肉', price: '30-50元', mustTry: true, location: '张飞牛肉' }] },
  '华蓥': { title: '华蓥·红岩精神', season: '全年适宜', days: '1天', tags: ['华蓥山','双枪老太婆','红色旅游'], poster: { style: 'fresh', subtitle: '红岩故里 华蓥山' }, routes: ['华蓥山旅游区→邓小平故居陈列馆→双枪老太婆纪念馆'], foods: [{ name: '华蓥山滑竿抬幺妹', price: '30-50元', mustTry: false, location: '华蓥山' }] },
  '隆昌': { title: '隆昌·石牌坊之乡', season: '全年适宜', days: '1天', tags: ['石牌坊群','古宇湖','青石雕刻'], poster: { style: 'vintage', subtitle: '中国石牌坊之乡 隆昌' }, routes: ['隆昌石牌坊群→古宇湖→云顶寨'], foods: [{ name: '隆昌稻田虾', price: '50-80元/斤', mustTry: true, location: '古宇湖' }] },
  '峨眉山': { title: '峨眉山·仙山佛国', season: '全年适宜', days: '2-3天', tags: ['峨眉山','金顶','峨眉武术'], poster: { style: 'fresh', subtitle: '峨眉天下秀 佛国仙山' }, routes: ['峨眉山（报国寺→清音阁→一线天→生态猴区→金顶）→大佛禅院→峨眉象城'], foods: [{ name: '峨眉素斋', price: '30-50元/人', mustTry: true, location: '报国寺' }] },
  '阆中': { title: '阆中·风水古城', season: '全年适宜', days: '1-2天', tags: ['阆中古城','风水文化','春节文化'], poster: { style: 'vintage', subtitle: '中国四大古城之一 阆中' }, routes: ['阆中古城（中天楼→贡院→川北道署→汉桓侯祠）→锦屏山→滕王阁→南津关'], foods: [{ name: '阆中牛肉', price: '30-50元', mustTry: true, location: '张飞牛肉' }] },
  '凯里': { title: '凯里·苗侗风情', season: '全年适宜', days: '1-2天', tags: ['苗寨','侗寨','酸汤鱼'], poster: { style: 'fresh', subtitle: '苗侗风情 凯里' }, routes: ['西江千户苗寨（世界最大苗寨）→郎德上寨→镇远古城'], foods: [{ name: '酸汤鱼', price: '60-100元', mustTry: true, location: '凯里市区' }] },
  '都匀': { title: '都匀·桥梁博物馆', season: '全年适宜', days: '1-2天', tags: ['斗篷山','剑江','桥梁'], poster: { style: 'fresh', subtitle: '高原桥城 都匀' }, routes: ['斗篷山→剑江风景名胜区→秦汉影视城→茶文化博览园'], foods: [{ name: '都匀冲冲糕', price: '5-8元', mustTry: true, location: '石板街' }] },
  '福泉': { title: '福泉·古城', season: '全年适宜', days: '1天', tags: ['福泉古城','洒金谷','太极宫'], poster: { style: 'fresh', subtitle: '太极文化 福泉' }, routes: ['福泉古城（福泉山→太极宫）→洒金谷→黄丝江'], foods: [{ name: '福泉酸汤鱼', price: '50-80元', mustTry: true, location: '市区' }] },
  '兴义': { title: '兴义·万峰林', season: '全年适宜', days: '1-2天', tags: ['万峰林','马岭河峡谷','布依族'], poster: { style: 'fresh', subtitle: '万峰成林 兴义' }, routes: ['万峰林（八卦田→纳灰村→将军峰）→马岭河峡谷→贵州醇景区'], foods: [{ name: '兴义杠子面', price: '10-15元', mustTry: true, location: '市区' }] },
  '安顺': { title: '安顺·瀑乡', season: '全年适宜', days: '1-2天', tags: ['黄果树瀑布','龙宫','屯堡'], poster: { style: 'fresh', subtitle: '中国瀑乡 屯堡文化' }, routes: ['黄果树瀑布→陡坡塘→天星桥→龙宫→云峰屯堡'], foods: [{ name: '安顺裹卷', price: '8-12元', mustTry: true, location: '市区' }] },
  '大理': { title: '大理·风花雪月', season: '全年适宜', days: '2-3', tags: ['洱海','苍山','白族'], poster: { style: 'fresh', subtitle: '下关风 上关花 苍山雪 洱海月' }, routes: ['洱海（环湖骑行→喜洲古镇→双廊→南诏风情岛）→苍山（感通索道→中和寺→洗马潭）→崇圣寺三塔'], foods: [{ name: '乳扇', price: '10-15元', mustTry: true, location: '喜洲' }] },
  '瑞丽': { title: '瑞丽·中缅边境', season: '全年适宜', days: '1-2天', tags: ['姐告口岸','一寨两国','翡翠'], poster: { style: 'fresh', subtitle: '中缅边境 翡翠之城' }, routes: ['姐告口岸→一寨两国→莫里热带雨林→喊沙奘寺'], foods: [{ name: '瑞丽手抓饭', price: '30-50元', mustTry: true, location: '市区' }] },
  '腾冲': { title: '腾冲·极边第一城', season: '全年适宜', days: '2-3天', tags: ['火山热海','和顺古镇','抗战文化'], poster: { style: 'fresh', subtitle: '极边第一城 腾冲' }, routes: ['火山地质公园→热海（大滚锅）→和顺古镇→国殇墓园（滇西抗战纪念馆）→北海湿地'], foods: [{ name: '大救驾', price: '10-15元', mustTry: true, location: '和顺' }] },
  '安宁': { title: '安宁·螳螂川', season: '全年适宜', days: '1天', tags: ['温泉','螳螂川','曹溪寺'], poster: { style: 'fresh', subtitle: '昆明后花园 安宁' }, routes: ['安宁温泉（天下第一汤）→螳螂川→曹溪寺→青龙峡'], foods: [{ name: '安宁八街玫瑰', price: '10-20元/斤', mustTry: true, location: '八街' }] },
  '宣威': { title: '宣威·火腿之乡', season: '全年适宜', days: '1天', tags: ['宣威火腿','东山寺','火腿文化'], poster: { style: 'fresh', subtitle: '中国火腿之乡 宣威' }, routes: ['宣威火腿文化传承基地→东山寺→浦在廷故居'], foods: [{ name: '宣威火腿', price: '50-100元/斤', mustTry: true, location: '市区' }] },
  '楚雄': { title: '楚雄·彝州首府', season: '全年适宜', days: '1-2天', tags: ['彝族文化','恐龙谷','紫溪山'], poster: { style: 'fresh', subtitle: '中国彝族文化大观园 楚雄' }, routes: ['彝族十月太阳历文化园→世界恐龙谷→紫溪山→彝人古镇'], foods: [{ name: '野生菌火锅', price: '80-150元', mustTry: true, location: '市区' }] },
  '大理': { title: '大理·风花雪月', season: '全年适宜', days: '2-3', tags: ['洱海','苍山','白族'], poster: { style: 'fresh', subtitle: '下关风 上关花 苍山雪 洱海月' }, routes: ['洱海（环湖骑行→喜洲古镇→双廊→南诏风情岛）→苍山（感通索道→中和寺→洗马潭）→崇圣寺三塔'], foods: [{ name: '乳扇', price: '10-15元', mustTry: true, location: '喜洲' }] },
  '个旧': { title: '个旧·锡都', season: '全年适宜', days: '1天', tags: ['锡矿','老阴山','锡文化'], poster: { style: 'minimal', subtitle: '中国锡都 个旧' }, routes: ['老阴山风景区→锡博物馆→宝华公园→金湖'], foods: [{ name: '个旧烧烤', price: '40-70元/人', mustTry: true, location: '市区' }] },
  '开远': { title: '开远·蜜桃之乡', season: '夏季最佳', days: '1天', tags: ['蜜桃','南洞','凤凰湖'], poster: { style: 'fresh', subtitle: '中国蜜桃之乡 开远' }, routes: ['南洞风景区→凤凰湖公园→开远蜜桃基地'], foods: [{ name: '开远蜜桃', price: '10-20元/斤', mustTry: true, location: '市区' }] },
  '蒙自': { title: '蒙自·过桥米线故乡', season: '全年适宜', days: '1天', tags: ['过桥米线','碧色寨','西南联大'], poster: { style: 'fresh', subtitle: '过桥米线故乡 蒙自' }, routes: ['南湖公园（过桥米线传说起源地）→碧色寨（芳华取景地）→西南联大分校旧址'], foods: [{ name: '蒙自过桥米线', price: '20-40元', mustTry: true, location: '南湖' }] },
  '弥勒': { title: '弥勒·红酒温泉', season: '全年适宜', days: '1-2天', tags: ['东风韵','红酒','温泉'], poster: { style: 'fresh', subtitle: '云南红酒城 温泉弥勒' }, routes: ['东风韵艺术小镇（红砖建筑）→云南红酒庄→湖泉温泉→可邑小镇'], foods: [{ name: '弥勒卤鸡', price: '48-78元/只', mustTry: true, location: '竹园' }] },
  '建水': { title: '建水·古临安', season: '全年适宜', days: '1-2天', tags: ['建水古城','燕子洞','紫陶'], poster: { style: 'vintage', subtitle: '古临安城 建水' }, routes: ['建水古城（朝阳楼→朱家花园→团山民居→蚁工坊）→燕子洞→紫陶街'], foods: [{ name: '建水烧豆腐', price: '0.5-1元/块', mustTry: true, location: '古城' }] },
  '景洪': { title: '景洪·黎明之城', season: '11-次年5月', days: '2-3', tags: ['热带雨林','傣族园','泼水节'], poster: { style: 'fresh', subtitle: '黎明之城 热带风情' }, routes: ['中科院西双版纳热带植物园→野象谷→傣族园→曼听公园→总佛寺→星光夜市'], foods: [{ name: '傣味孔雀宴', price: '80-150元', mustTry: true, location: '告庄' }] },
  '普洱': { title: '普洱·茶城', season: '全年适宜', days: '1-2天', tags: ['普洱茶','景迈山','咖啡'], poster: { style: 'fresh', subtitle: '中国茶城 世界茶源' }, routes: ['普洱茶马古道旅游景区→景迈山古茶林→澜沧拉祜族→咖啡庄园'], foods: [{ name: '普洱米干', price: '8-12元', mustTry: true, location: '市区' }] },
  '拉萨': { title: '拉萨·日光城', season: '5-10月最佳', days: '3-5', tags: ['布达拉宫','大昭寺','藏传佛教'], poster: { style: 'vintage', subtitle: '日光城 圣域拉萨' }, routes: ['布达拉宫→大昭寺→八廓街→哲蚌寺→色拉寺→罗布林卡'], foods: [{ name: '酥油茶', price: '10-15元', mustTry: true, location: '甜茶馆' }] }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXPANDED_CITIES;
}
