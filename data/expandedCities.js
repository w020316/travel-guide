// ==========================================
// 超大规模城市数据库 - 120个中国主要城市
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
    ],
    accommodations: [
      { name: '王府井商圈酒店', area: '市中心', priceRange: '400-800元', features: ['核心地段', '购物便利'] },
      { name: '南锣鼓巷胡同民宿', area: '东城区', priceRange: '200-500元', features: ['老北京风情'] }
    ]
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
      { name: '生煎包', description: '底脆汤多', price: '15-25元', mustTry: true, location: '小杨生煎' },
      { name: '小笼包', description: '皮薄馅美汤汁足', price: '20-40元', mustTry: true, location: '南翔馒头店' },
      { name: '白切鸡', description: '本帮菜经典', price: '50-80元', mustTry: false, location: '光明邨' }
    ]
  },

  '天津': {
    title: '天津·津门故里',
    season: '春秋最佳',
    days: '2-3',
    tags: ['相声之乡', '欧式建筑', '民间艺术'],
    atmosphere: '幽默、实在、中西合璧',
    poster: { style: 'vintage', subtitle: '九河下梢 三会海口' },
    routes: [
      '意大利风情区→瓷房子→西开教堂→五大道',
      '古文化街→天后宫→意风区→海河',
      '天津之眼→世纪钟→津湾广场'
    ],
    foods: [
      { name: '狗不理包子', description: '天津三绝之一', price: '20-40元', mustTry: true, location: '狗不理总店' },
      { name: '煎饼果子', description: '早餐标配', price: '8-12元', mustTry: true, location: '街头摊/南楼煎饼' },
      { name: '麻花', description: '十八街桂发祥', price: '15-25元/盒', mustTry: true, location: '桂发祥' }
    ]
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
      '武隆天生三桥→仙女山'
    ],
    foods: [
      { name: '重庆火锅', description: '牛油麻辣', price: '80-130元/人', mustTry: true, location: '佩姐/秦妈' },
      { name: '小面', description: '麻辣鲜拌', price: '10-15元', mustTry: true, location: '花市豌杂面' }
    ]
  },

  // ==================== 省会城市 (27) ====================
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
      { name: '火锅', description: '麻辣鲜香', price: '80-120元/人', mustTry: true, location: '蜀九香/小龙坎' },
      { name: '串串香', description: '街头烟火气', price: '40-70元/人', mustTry: true, location: '钢管厂五区' },
      { name: '担担面', description: '经典川味', price: '15-20元', mustTry: false, location: '老字号面馆' }
    ]
  },

  '广州': {
    title: '广州·羊城魅力',
    season: '秋冬最佳',
    days: '2-3',
    tags: ['美食天堂', '岭南文化', '商贸中心'],
    atmosphere: '包容、务实、早茶文化',
    poster: { style: 'fresh', subtitle: '食在广州 第一家' },
    routes: [
      '沙面岛→陈家祠→上下九步行街',
      '白云山→越秀公园→中山纪念堂',
      '珠江夜游→广州塔→花城广场',
      '长隆野生动物世界（一日）'
    ],
    foods: [
      { name: '早茶点心', description: '虾饺/烧卖/叉烧包', price: '60-100元/人', mustTry: true, location: '点都德/陶陶居' },
      { name: '肠粉', description: '滑嫩爽口', price: '8-12元', mustTry: true, location: '银记肠粉' },
      { name: '白切鸡', description: '粤菜经典', price: '50-80元', mustTry: false, location: '清平鸡' }
    ]
  },

  '深圳': {
    title: '深圳·鹏城科技',
    season: '秋冬最佳',
    days: '2-3',
    tags: ['科技创新', '主题公园', '海滨城市'],
    atmosphere: '年轻、活力、创新前沿',
    poster: { style: 'minimal', subtitle: '设计之城 创新之都' },
    routes: [
      '深圳湾公园→人才公园→春笋大厦',
      '世界之窗→欢乐谷→锦绣中华',
      '大梅沙海滨栈道→东部华侨城',
      '华强北电子市场→福田CBD'
    ],
    foods: [
      { name: '广式烧腊', description: '烧鹅/烧肉/叉烧', price: '50-90元', mustTry: true, location: '深井村烧腊' },
      { name: '椰子鸡', description: '清淡鲜美', price: '80-120元/人', mustTry: true, location: '润园四季' }
    ]
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
      '西溪湿地→宋城→千岛湖（可选）'
    ],
    foods: [
      { name: '西湖醋鱼', description: '酸甜鲜美', price: '60-100元', mustTry: true, location: '楼外楼' },
      { name: '东坡肉', description: '肥而不腻', price: '50-80元', mustTry: true, location: '知味观' },
      { name: '龙井虾仁', description: '清香淡雅', price: '60-90元', mustTry: false, location: '山外山' }
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
      '侵华日军遇难同胞纪念馆'
    ],
    foods: [
      { name: '盐水鸭', description: '金陵特产', price: '30-50元/半只', mustTry: true, location: '韩复兴/章云板鸭' },
      { name: '鸭血粉丝汤', description: '鲜美暖胃', price: '15-25元', mustTry: true, location: '回味鸭血粉丝' },
      { name: '小笼包', description: '汤汁鲜美', price: '15-25元', mustTry: false, location: '鸡鸣汤包' }
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
      { name: '豆皮', description: '外皮金黄', price: '8-12元', mustTry: true, location: '老通城' }
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
      { name: '糖油粑粑', description: '外脆内糯', price: '5-8元', mustTry: true, location: '李公庙' }
    ]
  },

  '郑州': {
    title: '郑州·中原之心',
    season: '春秋最佳',
    days: '2-3',
    tags: ['华夏文明', '交通枢纽', '少林功夫'],
    atmosphere: '古朴、厚重、中原文化发源地',
    poster: { style: 'vintage', subtitle: '天地之中 华夏之源' },
    routes: [
      '河南博物院→二七纪念塔→德化街',
      '嵩山少林寺→三皇寨→塔林（一日游）',
      '黄河风景名胜区→花园口',
      '开封（清明上河园/龙亭）一日游'
    ],
    foods: [
      { name: '烩面', description: '河南特色面食', price: '15-25元', mustTry: true, location: '合记烩面' },
      { name: '胡辣汤', description: '早餐必备', price: '6-10元', mustTry: true, location: '方中山胡辣汤' }
    ]
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
      { name: '羊肉泡馍', description: '掰馍讲究', price: '25-40元', mustTry: true, location: '同盛祥' },
      { name: '凉皮', description: '酸辣爽口', price: '8-12元', mustTry: true, location: '魏家凉皮' }
    ]
  },

  '兰州': {
    title: '兰州·黄河明珠',
    season: '夏秋最佳',
    days: '2-3',
    tags: ['黄河风情', '牛肉拉面', '丝路重镇'],
    atmosphere: '粗犷、豪迈、西北风情',
    poster: { style: 'fresh', subtitle: '黄河之滨也很美' },
    routes: [
      '中山桥→白塔山公园→黄河母亲雕像',
      '甘肃省博物馆→五泉山公园',
      '兰州水车博览园→黄河风情线',
      '敦煌/张掖（延伸线路）'
    ],
    foods: [
      { name: '牛肉拉面', description: '一清二白三红四绿五黄', price: '8-15元', mustTry: true, location: '马子禄/磨沟沿' },
      { name: '手抓羊肉', description: '西北风味', price: '60-100元', mustTry: true, location: '阿西娅' }
    ]
  },

  '西宁': {
    title: '西宁·夏都',
    season: '夏季最佳',
    days: '2-3',
    tags: ['青藏门户', '避暑胜地', '多民族文化'],
    atmosphere: '清凉、多元、高原风光',
    poster: { style: 'minimal', subtitle: '中国夏都 凉爽宜人' },
    routes: [
      '塔尔寺→东关清真大寺',
      '青海湖→日月山（一日游）',
      '莫家街→水井巷品尝小吃',
      '贵德/互助土族（可选）'
    ],
    foods: [
      { name: '手抓羊肉', description: '原汁原味', price: '50-80元', mustTry: true, location: '益鑫手抓' },
      { name: '酿皮', description: '西北特色', price: '8-12元', mustTry: true, location: '莫家街' }
    ]
  },

  '拉萨': {
    title: '拉萨·圣城之光',
    season: '5-10月最佳',
    days: '4-6',
    tags: ['布达拉宫', '宗教圣地', '高原明珠'],
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
      { name: '牦牛肉火锅', description: '高原美味', price: '80-120元/人', mustTry: true, location: '吉祥圣雪' },
      { name: '糌粑', description: '藏族主食', price: '8-12元', mustTry: false, location: '藏餐厅' }
    ]
  },

  '乌鲁木齐': {
    title: '乌鲁木齐·亚心之都',
    season: '夏秋最佳',
    days: '3-4',
    tags: ['西域风情', '瓜果之乡', '多民族融合'],
    atmosphere: '热情、多元、异域风情浓厚',
    poster: { style: 'fresh', subtitle: '亚洲地理中心城市' },
    routes: [
      '新疆国际大巴扎→二道桥清真寺',
      '天山天池→博格达峰（一日游）',
      '红山公园→新疆博物馆',
      '吐鲁番→火焰山→葡萄沟（一日游）'
    ],
    foods: [
      { name: '大盘鸡', description: '新疆招牌菜', price: '68-128元', mustTry: true, location: '小李子血站' },
      { name: '烤羊肉串', description: '正宗新疆味', price: '3-5元/串', mustTry: true, location: '大巴扎' },
      { name: '馕', description: '新疆主食', price: '2-5元', mustTry: true, location: '街头摊' }
    ]
  },

  '呼和浩特': {
    title: '呼和浩特·青城',
    season: '夏秋最佳',
    days: '2-3',
    tags: ['草原文化', '蒙古风情', '乳都'],
    atmosphere: '辽阔、豪放、草原风情',
    poster: { style: 'fresh', subtitle: '中国乳都 草原明珠' },
    routes: [
      '大召寺→塞上老街→伊斯兰风情街',
      '内蒙古博物院→昭君墓',
      '希拉穆仁草原（一日游）→响沙湾',
      '格根塔拉草原（可选）'
    ],
    foods: [
      { name: '手把肉', description: '蒙古族传统美食', price: '60-100元', mustTry: true, location: '格日勒阿妈' },
      { name: '奶茶', description: '咸奶茶配炒米', price: '10-15元', mustTry: true, location: '蒙古包餐厅' },
      { name: '烤全羊', description: '盛宴级美食', price: '800-1500元', mustTry: false, location: '草原度假村' }
    ]
  },

  '银川': {
    title: '银川·塞上江南',
    season: '夏秋最佳',
    days: '2-3',
    tags: ['西夏文化', '回族风情', '沙漠景观'],
    atmosphere: '神秘、独特、大漠孤烟',
    poster: { style: 'vintage', subtitle: '塞上江南 鱼米之乡' },
    routes: [
      '西夏王陵→贺兰山岩画→镇北堡西部影城',
      '沙湖→沙坡头→腾格里沙漠',
      '承天寺塔→宁夏博物馆→鼓楼',
      '水洞沟遗址（可选）'
    ],
    foods: [
      { name: '手抓羊肉', description: '宁夏特色', price: '50-80元', mustTry: true, location: '国强手抓' },
      { name: '羊杂碎', description: '回族风味', price: '15-25元', mustTry: true, location: '老城区' }
    ]
  },

  '太原': {
    title: '太原·龙城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['晋商文化', '煤炭之都', '面食之乡'],
    atmosphere: '厚重、朴实、晋商遗风',
    poster: { style: 'vintage', subtitle: '锦绣太原城 晋商发源地' },
    routes: [
      '晋祠→天龙山石窟→龙山道教石窟',
      '山西博物院→双塔寺→迎泽公园',
      '平遥古城→乔家大院（一日游）',
      '云冈石窟（大同方向）'
    ],
    foods: [
      { name: '刀削面', description: '山西面食之王', price: '15-25元', mustTry: true, location: '顺溜削面' },
      { name: '过油肉', description: '晋菜代表', price: '30-50元', mustTry: true, location: '老太原菜馆' },
      { name: '老陈醋', description: '山西特产', price: '5-10元', mustTry: true, location: '东湖醋厂' }
    ]
  },

  '石家庄': {
    title: '石家庄·国际庄',
    season: '春秋最佳',
    days: '2-3',
    tags: ['红色旅游', '医药之都', '交通枢纽'],
    atmosphere: '务实、便捷、新兴城市',
    poster: { style: 'minimal', subtitle: '北方粮仓 红色圣地' },
    routes: [
      '西柏坡纪念馆→中共中央旧址',
      '正定古城→隆兴寺→荣国府',
      '赵州桥→柏林禅寺',
      '苍岩山（可选）'
    ],
    foods: [
      { name: '驴肉火烧', description: '保定名吃', price: '15-25元', mustTry: true, location: '郝家' },
      { name: '缸炉烧饼', description: '传统面点', price: '3-5元', mustTry: true, location: '街头' }
    ]
  },

  '沈阳': {
    title: '沈阳·盛京',
    season: '四季皆宜',
    days: '2-3',
    tags: ['清朝发祥地', '工业基地', '东北文化'],
    atmosphere: '豪爽、热情、满清遗风',
    poster: { style: 'vintage', subtitle: '一朝发祥地 两代帝王都' },
    routes: [
      '沈阳故宫→张氏帅府→中街步行街',
      '北陵公园（昭陵）→东陵公园（福陵）',
      '辽宁省博物馆→九一八历史博物馆',
      '棋盘山风景区（可选）'
    ],
    foods: [
      { name: '老边饺子', description: '百年老字号', price: '30-50元', mustTry: true, location: '老边饺子馆' },
      { name: '李连贵熏肉大饼', description: '东北名菜', price: '30-50元', mustTry: true, location: '总店' },
      { name: '东北烧烤', description: '撸串文化', price: '50-80元/人', mustTry: true, location: '铁西烧烤街' }
    ]
  },

  '长春': {
    title: '长春·北春城',
    season: '夏冬两季',
    days: '2-3',
    tags: ['电影城', '汽车城', '冰雪之都'],
    atmosphere: '现代、活力、北国春城',
    poster: { style: 'fresh', subtitle: '电影之城 汽车摇篮' },
    routes: [
      '伪满皇宫博物院→八大部→人民广场',
      '长影世纪城→净月潭国家森林公园',
      '南湖公园→桂林路美食街',
      '吉林雾凇（冬季）'
    ],
    foods: [
      { name: '锅包肉', description: '东北名菜', price: '38-58元', mustTry: true, location: '老厨家' },
      { name: '朝鲜冷面', description: '延边风味', price: '15-25元', mustTry: true, location: '金家' }
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
      { name: '红肠', description: '俄式香肠', price: '20-30元/根', mustTry: true, location: '哈肉联/秋林' }
    ]
  },

  '福州': {
    title: '福州·榕城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['温泉之都', '闽菜发源地', '三坊七巷'],
    atmosphere: '温润、悠闲、闽都文化',
    poster: { style: 'fresh', subtitle: '有福之州 有福之人' },
    routes: [
      '三坊七巷→林则徐纪念馆→西湖公园',
      '鼓山→涌泉寺→摩崖石刻',
      '平潭岛（蓝眼泪/石牌洋）（一日游）',
      '马尾船政文化区（可选）'
    ],
    foods: [
      { name: '佛跳墙', description: '闽菜之首', price: '188-388元', mustTry: true, location: '聚春园' },
      { name: '鱼丸', description: 'Q弹爽滑', price: '15-25元', mustTry: true, location: '永和鱼丸' },
      { name: '肉燕', description: '福州特色', price: '15-20元', mustTry: true, location: '同利肉燕' }
    ]
  },

  '南昌': {
    title: '南昌·洪城',
   季节: '春秋最佳',
    days: '2-3',
    tags: ['英雄城', '滕王阁', '鄱阳湖'],
    atmosphere: '革命、现代、赣鄱文化',
    poster: { style: 'vintage', subtitle: '物华天宝 人杰地灵' },
    routes: [
      '滕王阁→秋水广场→赣江夜景',
      '八一南昌起义纪念馆→八一起义纪念塔',
      '江西省博物馆→绳金塔',
      '庐山（一日游）'
    ],
    foods: [
      { name: '南昌拌粉', description: '辣得过瘾', price: '10-15元', mustTry: true, location: '万方圆' },
      { name: '瓦罐汤', description: '滋补养生', price: '15-25元', mustTry: true, location: '章记' }
    ]
  },

  '合肥': {
    title: '合肥·庐州',
    season: '春秋最佳',
    days: '2-3',
    tags: ['科教之城', '三国故地', '包公故乡'],
    atmosphere: '宁静、学术、徽派文化',
    poster: { style: 'minimal', subtitle: '三国故地 包拯家乡' },
    routes: [
      '包公园→清风阁→包公墓',
      '三河古镇（一日游）→庐江',
      '安徽省博物馆→逍遥津公园',
      '黄山方向（延伸线路）'
    ],
    foods: [
      { name: '曹操鸡', description: '合肥名菜', price: '48-78元', mustTry: true, location: '逍遥酒家' },
      { name: '庐州烤鸭', description: '安徽风味', price: '50-80元', mustTry: true, location: '吴山' }
    ]
  },

  '济南': {
    title: '济南·泉城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['泉水之都', '趵突泉', '大明湖'],
    atmosphere: '温润、灵动、泉城韵味',
    poster: { style: 'fresh', subtitle: '家家泉水 户户垂杨' },
    routes: [
      '趵突泉→五龙潭→黑虎泉→护城河',
      '大明湖→超然楼→曲水亭街',
      '千佛山→泉城广场→芙蓉街',
      '泰安泰山（一日游）'
    ],
    foods: [
      { name: '糖醋鲤鱼', description: '鲁菜经典', price: '58-88元', mustTry: true, location: '汇泉饭店' },
      { name: '油旋', description: '济南特色', price: '3-5元', mustTry: true, location: '街头' },
      { name: '把子肉', description: '肥而不腻', price: '25-40元', mustTry: true, location: '老济南' }
    ]
  },

  '海口': {
    title: '海口·椰城',
    season: '11-次年4月',
    days: '2-3',
    tags: ['热带滨海', '椰风海韵', '免税购物'],
    atmosphere: '悠闲、温暖、南国风情',
    poster: { style: 'fresh', subtitle: '椰风海韵 美丽海口' },
    routes: [
      '骑楼老街→海口钟楼→人民公园',
      '假日海滩→观澜湖度假区',
      '海南省博物馆→火山群地质公园',
      '三亚方向（延伸线路）'
    ],
    foods: [
      { name: '文昌鸡', description: '海南四大名菜之一', price: '60-100元', mustTry: true, location: '龙泉人' },
      { name: '海南粉', description: '早餐必备', price: '10-15元', mustTry: true, location: '抱罗粉店' },
      { name: '清补凉', description: '消暑甜品', price: '8-12元', mustTry: true, location: '街头' }
    ]
  },

  '贵阳': {
    title: '贵阳·林城',
    season: '春夏秋最佳',
    days: '2-3',
    tags: ['避暑之都', '酸辣美食', '喀斯特地貌'],
    atmosphere: '清凉、多彩、民族风情',
    poster: { style: 'fresh', subtitle: '中国避暑之都 多彩贵州' },
    routes: [
      '甲秀楼→黔灵山公园→弘福寺',
      '青岩古镇→天河潭（一日游）',
      '花溪公园→夜郎谷',
      '黄果树瀑布（一日游）'
    ],
    foods: [
      { name: '酸汤鱼', description: '苗族特色', price: '60-100元', mustTry: true, location: '亮欢寨' },
      { name: '肠旺面', description: '贵阳早餐', price: '10-15元', mustTry: true, location: '蔡家' },
      { name: '丝娃娃', description: '素菜卷饼', price: '15-25元', mustTry: true, location: '思飨季' }
    ]
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
      { name: '野生菌火锅', description: '鲜美无比', price: '80-150元/人', mustTry: true, location: '菌子火锅店' },
      { name: '鲜花饼', description: '伴手礼首选', price: '5-10元/个', mustTry: true, location: '嘉华/潘祥记' }
    ]
  },

  // ==================== 重要地级市 (89) ====================
  
  // === 华东地区 (江苏/浙江/安徽/福建/江西/山东) ===
  '苏州': {
    title: '苏州·人间天堂',
    season: '四季皆宜',
    days: '2-3',
    tags: ['古典园林', '江南水乡', '吴侬软语'],
    poster: { style: 'vintage', subtitle: '君到姑苏见 人家尽枕河' },
    routes: ['拙政园→苏州博物馆→狮子林→平江路', '虎丘→寒寺→山塘街→留园', '同里古镇→退思园→三桥'],
    foods: [{ name: '松鼠桂鱼', price: '88-138元', mustTry: true, location: '得月楼' }, { name: '生煎馒头', price: '12-20元', mustTry: true, location: '哑巴生煎' }]
  },

  '无锡': {
    title: '无锡·太湖明珠',
    season: '春秋最佳',
    days: '2-3',
    tags: ['太湖风光', '鼋头渚', '影视基地'],
    poster: { style: 'fresh', subtitle: '太湖佳绝处 毕竟在无锡' },
    routes: ['鼋头渚→太湖仙岛→三山岛', '灵山大佛→拈花湾小镇', '水浒城→三国城→唐城'],
    foods: [{ name: '酱排骨', price: '35-55元', mustTry: true, location: '三凤桥' }, { name: '小笼包', price: '15-25元', mustTry: true, location: '熙盛源' }]
  },

  '宁波': {
    title: '宁波·甬城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['港口城市', '海鲜美食', '书藏古今'],
    poster: { style: 'minimal', subtitle: '书藏古今 港通天下' },
    routes: ['天一阁→月湖公园→鼓楼', '东钱湖→南宋石刻公园', '普陀山（一日游）→朱家尖'],
    foods: [{ name: '汤圆', price: '15-25元', mustTry: true, location: '缸鸭狗' }, { name: '海鲜', price: '80-150元/人', mustTry: true, location: '石浦' }]
  },

  '温州': {
    title: '温州·鹿城',
    season: '四季皆宜',
    days: '2-3',
    tags: ['民营经济', '山水奇秀', '瓯越文化'],
    poster: { style: 'fresh', subtitle: '东南山水甲天下' },
    routes: ['雁荡山→大龙湫→灵峰景区', '楠溪江→永嘉书院→丽水街', '江心屿→五马街→朔门街'],
    foods: [{ name: '鱼丸', price: '20-30元', mustTry: true, location: '县前头' }, { name: '糯米饭', price: '8-12元', mustTry: true, location: '长人' }]
  },

  '嘉兴': {
    title: '嘉兴·禾城',
    season: '春夏最佳',
    days: '2天',
    tags: ['南湖红船', '乌镇古镇', '粽子之乡'],
    poster: { style: 'vintage', subtitle: '烟雨江南 水乡嘉兴' },
    routes: ['南湖景区→中共一大会址→月河历史街区', '乌镇东西栅（一日游）→西塘'],
    foods: [{ name: '嘉兴粽子', price: '10-20元', mustTry: true, location: '五芳斋' }, { name: '南湖菱角', price: '15-25元', mustTry: true, location: '南湖' }]
  },

  '绍兴': {
    title: '绍兴·越州',
    season: '春秋最佳',
    days: '2-3',
    tags: ['鲁迅故乡', '黄酒文化', '水乡桥乡'],
    poster: { style: 'vintage', subtitle: '鉴湖水清 绍兴酒醇' },
    routes: ['鲁迅故居→沈园→周恩来祖居', '东湖→兰亭→柯岩', '安昌古镇→诸暨西施故里'],
    foods: [{ name: '茴香豆', price: '10-15元', mustTry: true, location: '咸亨酒店' }, { name: '绍兴醉鸡', price: '48-78元', mustTry: true, location: '咸亨' }]
  },

  '湖州': {
    title: '湖州·菰城',
    season: '四季皆宜',
    days: '2天',
    tags: ['太湖之滨', '丝绸之府', '茶文化'],
    poster: { style: 'fresh', subtitle: '太湖明珠 丝绸之府' },
    routes: ['南浔古镇→小莲庄→百间楼', '莫干山→庾村→裸心谷', '太湖月亮湾→图影湿地公园'],
    foods: [{ name: '太湖蟹', price: '50-80元/只', mustTry: true, location: '太湖边' }, { name: '双交面', price: '15-20元', mustTry: true, location: '丁莲芳' }]
  },

  '金华': {
    title: '金华·婺州',
    season: '春秋最佳',
    days: '2-3',
    tags: ['金华火腿', '横店影视城', '婺州文化'],
    poster: { style: 'vintage', subtitle: '婺州古城 影视之都' },
    routes: ['横店影视城（秦王宫/明清宫苑/梦幻谷）', '双龙洞→金华山', '义乌国际商贸城（购物）→东阳木雕城'],
    foods: [{ name: '金华火腿', price: '50-100元/斤', mustTry: true, location: '金字' }, { name: '酥饼', price: '5-8元/个', mustTry: true, location: '默香' }]
  },

  '台州': {
    title: '台州·山海水城',
    season: '春夏最佳',
    days: '2-3',
    tags: ['天台山', '神仙居', '海鲜美食'],
    poster: { style: 'fresh', subtitle: '佛宗道源 山海水城' },
    routes: ['天台山→国清寺→石梁飞瀑', '神仙居→皤滩古镇→高迁古民居', '长屿硐天→温岭石塘'],
    foods: [{ name: '嵌糕', price: '10-15元', mustTry: true, location: '临海' }, { name: '海鲜', price: '60-100元/人', mustTry: true, location: '三门' }]
  },

  '丽水': {
    title: '丽水·浙江绿谷',
    season: '全年适宜',
    days: '2-3',
    tags: ['绿水青山', '畲族风情', '摄影天堂'],
    poster: { style: 'fresh', subtitle: '浙江绿谷 秀山丽水' },
    routes: ['缙云仙都→鼎湖峰→朱潭山', '古堰画乡→通济堰→大港头', '云和梯田→龙泉青瓷小镇→遂昌金矿'],
    foods: [{ name: '缙云烧饼', price: '8-12元', mustTry: true, location: '缙云' }, { name: '黄米果', price: '5-8元', mustTry: true, location: '庆元' }]
  },

  '黄山': {
    title: '黄山·天下第一奇山',
    season: '四季皆宜',
    days: '2-3',
    tags: ['迎客松', '云海日出', '徽派建筑'],
    poster: { style: 'fresh', subtitle: '五岳归来不看山 黄山归来不看岳' },
    routes: ['云谷寺→始信峰→猴子观海→梦笔生花→北海宾馆', '光明顶→鳌鱼峰→一线天→百步云梯→迎客松→玉屏楼', '宏村→西递（徽派古村落）→屯溪老街'],
    foods: [{ name: '臭鳜鱼', price: '60-100元', mustTry: true, location: '屯溪老街' }, { name: '毛豆腐', price: '15-25元', mustTry: true, location: '宏村' }]
  },

  '安庆': {
    title: '安庆·宜城',
    season: '春秋最佳',
    days: '2天',
    tags: ['黄梅戏', '天柱山', '桐城派'],
    poster: { style: 'vintage', subtitle: '文化名城 宜人之都' },
    routes: ['天柱山→山谷流泉→炼丹湖', '迎江寺→振风塔→菱湖公园', '桐城文庙→六尺巷'],
    foods: [{ name: '胡玉美蚕豆酱', price: '10-15元', mustTry: true, location: '超市' }, { name: '江毛水饺', price: '15-20元', mustTry: true, location: '人民路' }]
  },

  '泉州': {
    title: '泉州·半城烟火半城仙',
    season: '秋冬最佳',
    days: '2-3',
    tags: ['世界遗产', '海上丝绸之路起点', '众神之城'],
    poster: { style: 'vintage', subtitle: '此地古称佛国 满街都是圣人' },
    routes: ['开元寺（东西塔）→清净寺→关岳庙', '泉州海外交通史博物馆→天后宫→德济门遗址', '西街→钟楼→中山中路→文庙'],
    foods: [{ name: '面线糊', price: '10-15元', mustTry: true, location: '水门国仔' }, { name: '土笋冻', price: '15-25元', mustTry: true, location: '东石' }]
  },

  '厦门': {
    title: '厦门·海上花园',
    season: '春秋最佳',
    days: '3-4',
    tags: ['鼓浪屿', '闽南风情', '文艺小资'],
    poster: { style: 'fresh', subtitle: '城在海上 海在城中' },
    routes: ['鼓浪屿一日游（日光岩→菽庄花园→钢琴博物馆）', '厦门大学→南普陀寺→白城沙滩→环岛路', '曾厝垵→沙坡尾→猫街→中山路'],
    foods: [{ name: '沙茶面', price: '20-35元', mustTry: true, location: '乌糖沙茶面' }, { name: '海蛎煎', price: '15-25元', mustTry: true, location: '莲欢海蛎煎' }]
  },

  '漳州': {
    title: '漳州·水仙花之乡',
    season: '全年适宜',
    days: '2-3',
    tags: ['土楼群', '海峡两岸', '闽南文化'],
    poster: { style: 'fresh', subtitle: '闽南金三角 花果鱼米乡' },
    routes: ['南靖土楼（四菜一汤）→云水谣古镇', '东山岛→风动石→马銮湾', '漳州古城→南山寺→荔枝海'],
    foods: [{ name: '卤面', price: '10-15元', mustTry: true, location: '阿芬' }, { name: '五香卷', price: '15-25元', mustTry: true, location: '老国' }]
  },

  '九江': {
    title: '九江·浔阳城',
    season: '春夏最佳',
    days: '2-3',
    tags: ['庐山', '鄱阳湖', '浔阳楼'],
    poster: { style: 'vintage', subtitle: '匡庐奇秀甲天下' },
    routes: ['庐山（牯岭镇→花径→锦绣谷→仙人洞→含鄱口→五老峰→三叠泉）', '浔阳楼→琵琶亭→烟水亭', '鄱阳湖候鸟保护区（冬季）'],
    foods: [{ name: '庐山三石', price: '30-50元', mustTry: true, location: '庐山' }, { name: '九江茶饼', price: '10-15元', mustTry: true, location: '浔阳区' }]
  },

  '赣州': {
    title: '赣州·客家摇篮',
    season: '春秋最佳',
    days: '2-3',
    tags: ['客家文化', '宋城', '脐橙之乡'],
    poster: { style: 'fresh', subtitle: '客家摇篮 宋城赣州' },
    routes: ['通天岩→古城墙→八境台→郁孤台', '瑞金（红色故都）→叶坪旧址', '龙南客家围屋群（关西新围→燕翼围）'],
    foods: [{ name: '赣州脐橙', price: '8-15元/斤', mustTry: true, location: '果园' }, { name: '客家酿豆腐', price: '20-30元', mustTry: true, location: '于都' }]
  },

  '景德镇': {
    title: '景德镇·瓷都',
    season: '春秋最佳',
    days: '2-3',
    tags: ['陶瓷之都', '千年窑火', '艺术天堂'],
    poster: { style: 'minimal', subtitle: '千年瓷都 世界瓷都' },
    routes: ['古窑民俗博览区→陶瓷博物馆→御窑厂遗址', '雕塑瓷厂→陶溪川文创街区→三宝村', '瑶里古镇→浮梁古县衙'],
    foods: [{ name: '冷粉', price: '8-12元', mustTry: true, location: '抚州弄' }, { name: '牛骨粉', price: '15-20元', mustTry: true, location: '抚州弄' }]
  },

  '烟台': {
    title: '烟台·仙境海岸',
    season: '夏秋最佳',
    days: '2-3',
    tags: ['海滨度假', '葡萄酒之乡', '蓬莱仙境'],
    poster: { style: 'fresh', subtitle: '人间仙境 最美海岸' },
    routes: ['蓬莱阁→八仙过海景区→三仙山', '烟台山→月亮湾→东炮台→渔人码头', '养马岛→昆嵛山（可选）'],
    foods: [{ name: '蓬莱小面', price: '10-15元', mustTry: true, location: '蓬莱' }, { name: '海鲜', price: '80-150元/人', mustTry: true, location: '码头市场' }]
  },

  '青岛': {
    title: '青岛·啤酒之城',
    season: '夏季最佳',
    days: '3-4',
    tags: ['海滨城市', '德式建筑', '啤酒文化'],
    poster: { style: 'fresh', subtitle: '红瓦绿树 碧海蓝天' },
    routes: ['栈桥→八大关→第二海水浴场→五四广场', '崂山一日游（太清宫→仰口→北九水）', '金沙滩→啤酒博物馆→台东步行街'],
    foods: [{ name: '辣炒蛤蜊', price: '30-50元', mustTry: true, location: '云霄路' }, { name: '鲅鱼水饺', price: '40-60元', mustTry: true, location: '船歌鱼水饺' }]
  },

  '威海': {
    title: '威海·最干净的海滨城市',
    season: '夏季最佳',
    days: '2-3',
    tags: ['海滨度假', '韩式风情', '宜居城市'],
    poster: { style: 'fresh', subtitle: '蓝色硅谷 最美海岸线' },
    routes: ['刘公岛→甲午战争博物馆→定远舰', '幸福公园→悦海公园→海源公园', '成山头（天尽头）→神龙野生动物园'],
    foods: [{ name: '韩国料理', price: '50-100元/人', mustTry: true, location: '韩乐坊' }, { name: '无花果', price: '10-20元/斤', mustTry: true, location: '果园' }]
  },

  '潍坊': {
    title: '潍坊·鸢都',
    season: '春季最佳（4月风筝节）',
    days: '2天',
    tags: ['风筝之都', '年画之乡', '蔬菜之乡'],
    poster: { style: 'fresh', subtitle: '世界风筝都 潍坊欢迎您' },
    routes: ['潍坊世界风筝博物馆→风筝广场→杨家埠民间艺术大观园', '十笏园→郑板桥纪念馆→青州古城'],
    foods: [{ name: '朝天锅', price: '30-50元', mustTry: true, location: '老潍县' }, { name: '肉火烧', price: '3-5元', mustTry: true, location: '老字号' }]
  },

  '淄博': {
    title: '淄博·齐国故都',
    season: '春秋最佳',
    days: '2-3',
    tags: ['齐文化', '烧烤之城', '陶瓷琉璃'],
    poster: { style: 'vintage', subtitle: '齐国故都 烧烤圣地' },
    routes: ['齐国故城遗址博物馆→管仲纪念馆→殉马坑', '蒲松龄故居→聊斋城→周村古商城', '博山陶瓷琉璃艺术中心→原山森林公园'],
    foods: [{ name: '淄博烧烤', price: '50-80元/人', mustTry: true, location: '牧羊村/小寒羊' }, { name: '周村烧饼', price: '3-5元', mustTry: true, location: '周村' }]
  },

  '泰安': {
    title: '泰安·国泰民安',
    season: '春夏秋最佳',
    days: '1-2',
    tags: ['泰山', '五岳独尊', '封禅之地'],
    poster: { style: 'vintage', subtitle: '五岳独尊 泰山安则四海安' },
    routes: ['泰山（红门→中天门→十八盘→南天门→玉皇顶→日观峰）', '岱庙→普照寺→冯玉祥墓', '灵应宫→天外村'],
    foods: [{ name: '泰山豆腐宴', price: '50-80元/人', mustTry: true, location: '泰山脚下' }, { name: '煎饼卷大葱', price: '5-8元', mustTry: true, location: '泰安市' }]
  },

  '济宁': {
    title: '济宁·孔孟之乡',
    season: '春秋最佳',
    days: '2-3',
    tags: ['儒家文化', '孔府孔庙', '运河之都'],
    poster: { style: 'vintage', subtitle: '孔孟之乡 礼仪之邦' },
    routes: ['孔庙→孔府→孔林（三孔）', '微山湖→铁道游击队纪念馆', '水泊梁山（水浒传发源地）'],
    foods: [{ name: '孔府宴', price: '200-500元/桌', mustTry: true, location: '孔府' }, { name: '甏肉干饭', price: '10-15元', mustTry: true, location: '济宁市区' }]
  },

  '临沂': {
    title: '临沂·琅琊',
    season: '春秋最佳',
    days: '2-3',
    tags: ['沂蒙山区', '书法之乡', '物流之都'],
    poster: { style: 'fresh', subtitle: '沂蒙精神 书圣故里' },
    routes: ['沂蒙山龟蒙景区→云蒙景区', '王羲之故居→银雀山汉墓竹简博物馆', '地下大峡谷→萤火虫水洞'],
    foods: [{ name: '煎饼', price: '3-5元', mustTry: true, location: '沂蒙山区' }, { name: '糁汤', price: '6-10元', mustTry: true, location: '临沂市区' }]
  },

  '洛阳': {
    title: '洛阳·十三朝古都',
    season: '4月牡丹花会',
    days: '2-3',
    tags: ['龙门石窟', '牡丹花城', '佛教圣地'],
    poster: { style: 'vintage', subtitle: '若问古今兴废事 请君只看洛阳城' },
    routes: ['龙门石窟→白园→香山寺', '白马寺→神州牡丹园→洛阳博物馆', '老君山（一日游）→鸡冠洞'],
    foods: [{ name: '洛阳水席', price: '50-100元/人', mustTry: true, location: '真不同饭店' }, { name: '不翻汤', price: '10-15元', mustTry: true, location: '老城区' }]
  },

  '开封': {
    title: '开封·汴梁古城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['清明上河图', '汴梁古城', '菊花之乡'],
    poster: { style: 'vintage', subtitle: '一朝步入画卷 一日梦回千年' },
    routes: ['清明上河园→开封府→大相国寺', '龙亭公园→天波杨府→中国翰园', '开封铁塔→禹王台→繁塔'],
    foods: [{ name: '灌汤包', price: '15-25元', mustTry: true, location: '第一楼' }, { name: '鲤鱼焙面', price: '60-90元', mustTry: true, location: '豫菜馆' }]
  },

  '南阳': {
    title: '南阳·宛城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['医圣故里', '诸葛亮躬耕地', '恐龙蛋之乡'],
    poster: { style: 'fresh', subtitle: '医圣故里 智圣家乡' },
    routes: ['医圣祠→卧龙岗（武侯祠）→汉画馆', '内乡县衙→宝天曼自然保护区', '西峡恐龙遗迹园→老界岭'],
    foods: [{ name: '牛肉汤', price: '15-25元', mustTry: true, location: '方城' }, { name: '浆面条', price: '5-8元', mustTry: true, location: '南阳' }]
  },

  '新乡': {
    title: '新乡·牧野',
    season: '四季皆宜',
    days: '2天',
    tags: ['太行山南麓', '比干故里', '郭亮村挂壁公路'],
    poster: { style: 'fresh', subtitle: '太行之魂 牧野新乡' },
    routes: ['八里沟→回龙天界→天界山', '郭亮村→挂壁公路→昆山挂壁公路', '比干庙→潞王陵'],
    foods: [{ name: '原阳大米', price: '5-8元/斤', mustTry: true, location: '原阳' }, { name: '延津火烧', price: '3-5元', mustTry: true, location: '延津' }]
  },

  '安阳': {
    title: '安阳·殷商古都',
    season: '春秋最佳',
    days: '2-3',
    tags: ['殷墟', '甲骨文', '红旗渠'],
    poster: { style: 'vintage', subtitle: '甲骨文的故乡 中华文明的源头' },
    routes: ['殷墟宫殿宗庙遗址→殷墟王陵遗址→殷墟博物馆', '红旗渠→青年洞→络丝潭', '羑里城→岳飞庙→袁林'],
    foods: [{ name: '扁粉菜', price: '8-12元', mustTry: true, location: '安阳县' }, { name: '道口烧鸡', price: '50-80元', mustTry: true, location: '滑县' }]
  },

  '许昌': {
    title: '许昌·莲城',
    season: '春秋最佳',
    days: '2天',
    tags: ['曹魏故都', '钧瓷之乡', '花木之乡'],
    poster: { style: 'vintage', subtitle: '曹魏故都 莲城许昌' },
    routes: ['曹丞相府→春秋楼→灞陵桥→神垕古镇', '鄢陵花博园→禹州钧官窑址', '襄城县首山'],
    foods: [{ name: '禹州焖子', price: '10-15元', mustTry: true, location: '禹州' }, { name: '许昌腐竹', price: '8-12元', mustTry: true, location: '建安区' }]
  },

  '漯河': {
    title: '漯河·食品名城',
    season: '春秋最佳',
    days: '1-2天',
    tags: ['双汇火腿', '南街村', '贾湖遗址'],
    poster: { style: 'minimal', subtitle: '食品名城 字圣故里' },
    routes: ['南街村→临颍县→小商桥', '许慎文化园→贾湖遗址→沙澧河风景区', '开源森林公园'],
    foods: [{ name: '北舞渡牛肉', price: '50-80元', mustTry: true, location: '北舞渡' }, { name:漯河麻鸡', price: '30-50元', mustTry: true, location: '郾城区' }]
  },

  '三门峡': {
    title: '三门峡·天鹅之城',
    season: '冬季（看天鹅）',
    days: '2天',
    tags: ['天鹅湖', '函谷关', '陕州地坑院'],
    poster: { style: 'fresh', subtitle: '黄河明珠 天鹅之城' },
    routes: ['三门峡大坝→黄河公园→天鹅湖国家城市湿地公园', '陕州地坑院→函谷关历史文化旅游区', '虢国博物馆→灵宝函谷关'],
    foods: [{ name: '灵宝苹果', price: '5-10元/斤', mustTry: true, location: '灵宝' }, { name: '观音堂牛肉', price: '30-50元', mustTry: true, location: '陕州区' }]
  },

  '平顶山': {
    title: '平顶山·鹰城',
    season: '春秋最佳',
    days: '2天',
    tags: ['尧山', '温泉', '汝瓷'],
    poster: { style: 'fresh', subtitle: '鹰城古韵 尧山胜境' },
    routes: ['尧山（石人山）→画眉谷→好运谷', '中原大佛→香山寺→风穴寺', '苏味道墓→三苏园'],
    foods: [{ name: '郏县饸饹面', price: '10-15元', mustTry: true, location: '郏县' }, { name: '舞钢热豆腐', price: '8-12元', mustTry: true, location: '舞钢' }]
  },

  '商丘': {
    title: '商丘·归德',
    season: '春秋最佳',
    days: '2天',
    tags: ['商祖故里', '火神台', '芒砀山'],
    poster: { style: 'vintage', subtitle: '华商之源 火神故里' },
    routes: ['商丘古城→阏伯台→燧皇陵→商祖祠', '芒砀山→汉高祖斩蛇处→陈胜墓→夫子山', '黄河故道森林公园'],
    foods: [{ name: '垛子羊肉', price: '40-70元', mustTry: true, location: '夏邑' }, { name: '商丘水煎包', price: '8-12元', mustTry: true, location: '睢阳区' }]
  },

  '信阳': {
    title: '信阳·申城',
    season: '春夏最佳',
    days: '2-3',
    tags: ['毛尖茶', '鸡公山', '南湾湖'],
    poster: { style: 'fresh', subtitle: '北国江南 茶都信阳' },
    routes: ['鸡公山→波尔登森林公园→桃花寨', '南湾湖→贤岭→灵山寺', '新县鄂豫皖苏区首府革命博物馆→许世友将军故里'],
    foods: [{ name: '信阳毛尖', price: '100-500元/斤', mustTry: true, location: '浉河区' }, { name: '南湾鱼', price: '50-80元', mustTry: true, location: '南湾湖' }]
  },

  '驻马店': {
    title: '驻马店·天中',
    season: '春秋最佳',
    days: '2天',
    tags: ['嵖岈山', '南海禅寺', '梁祝故里'],
    poster: { style: 'fresh', subtitle: '天中之城 嵖岈仙境' },
    routes: ['嵖岈山（《西游记》取景地）→南海禅寺→《西游记》拍摄地', '梁祝故里→梁山伯与祝英台墓→梁山伯墓', '杨靖宇将军纪念馆→竹沟革命纪念馆'],
    foods: [{ name: '确山凉粉', price: '8-12元', mustTry: true, location: '确山' }, { name: '汝南鸡肉丸子', price: '15-25元', mustTry: true, location: '汝南' }]
  },

  '周口': {
    title: '周口·陈州',
    season: '春秋最佳',
    days: '2天',
    tags: ['老子故里', '伏羲太昊陵', '淮阳龙湖'],
    poster: { style: 'vintage', subtitle: '华夏先驱 九州圣迹' },
    routes: ['太昊陵→龙湖→弦歌台→画卦台', '老子故里（鹿邑）→明道宫→升仙台', '关帝庙→袁世凯行宫'],
    foods: [{ name: '逍遥镇胡辣汤', price: '6-10元', mustTry: true, location: '西华' }, { name: '邓城叶猪蹄', price: '30-50元', mustTry: true, location: '商水' }]
  },

  '焦作': {
    title: '焦作·山阳',
    seasons: '夏秋最佳',
    days: '2-3',
    tags: ['云台山', '太极拳发源地', '四大怀药'],
    poster: { style: 'fresh', subtitle: '太极故里 山水焦作' },
    routes: ['云台山（红石峡→潭瀑峡→猕猴谷→茱萸峰→子房湖→百家岩）', '青天河→靳家岭→月山寺', '陈家沟太极拳发源地→嘉应观'],
    foods: [{ name: '武陟油茶', price: '8-12元', mustTry: true, location: '武陟' }, { name: '闹汤驴肉', price: '50-80元', mustTry: true, location: '沁阳' }]
  },

  '濮阳': {
    title: '濮阳·龙都',
    season: '春秋最佳',
    days: '1-2天',
    tags: ['中华龙乡', '杂技之乡', '石油之城'],
    poster: { style: 'fresh', subtitle: '中华龙乡 杂技之都' },
    routes: ['戚城文物景区→仓颉陵→子路墓祠', '单拐革命旧址→冀鲁豫边区革命根据地旧址', '濮上园→绿色庄园'],
    foods: [{ name: '裹凉皮', price: '5-8元', mustTry: true, location: '市区' }, { name: '壮馍', price: '3-5元', mustTry: true, location: '范县' }]
  },

  // === 华中地区 (湖北/湖南/河南部分) ===
  '宜昌': {
    title: '宜昌·三峡门户',
    season: '春秋最佳',
    days: '2-3',
    tags: ['长江三峡', '葛洲坝', '屈原故里'],
    poster: { style: 'fresh', subtitle: '水电之都 三峡门户' },
    routes: ['三峡大坝→坛子岭→185平台→截流纪念园→升船机', '三峡人家→龙进溪', '屈原祠→秭归县城→链子崖'],
    foods: [{ name: '凉虾', price: '8-12元', mustTry: true, location: '市区' }, { name: '萝卜饺子', price: '5-8元', mustTry: true, location: '市区' }]
  },

  '襄阳': {
    title: '襄阳·襄阳城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['三国文化', '襄阳古城', '隆中对'],
    poster: { style: 'vintage', subtitle: '华夏第一城池 汉水中游' },
    routes: ['襄阳古城墙→夫人城→仲宣楼→米公祠→襄阳博物馆', '古隆中（诸葛亮隐居地）→草庐', '唐城影视基地→中国唐城'],
    foods: [{ name: '襄阳牛肉面', price: '10-15元', mustTry: true, location: '市区' }, { name: '宜城大虾', price: '50-80元', mustTry: true, location: '宜城' }]
  },

  '十堰': {
    title: '十堰·车城',
    season: '春秋最佳',
    days: '2-3',
    tags: ['武当山', '丹江口水库', '汽车城'],
    poster: { style: 'vintage', subtitle: '仙山武当 武当问道' },
    routes: ['武当山（太子坡→紫霄宫→南岩宫→金顶→龙头香）', '丹江口水库→沧浪海', '野人谷→野人洞→太极峡'],
    foods: [{ name: '武当道斋', price: '30-50元/人', mustTry: true, location: '武当山' }, { name: '丹江口全鱼宴', price: '80-120元/人', mustTry: true, location: '丹江口' }]
  },

  '荆州': {
    title: '荆州·江陵',
    season: '春秋最佳',
    days: '2天',
    tags: ['荆州古城', '三国文化', '楚文化'],
    poster: { style: 'vintage', subtitle: '大意失荆州 三国风云地' },
    routes: ['荆州古城墙→宾阳楼→关帝庙→张居正故居', '荆州博物馆→楚王车马阵→熊家冢', '洪湖（红色之旅）'],
    foods: [{ name: '鱼糕', price: '20-30元', mustTry: true, location: '市区' }, { name: '公安锅盔', price: '3-5元', mustTry: true, location: '公安' }]
  },

  '黄石': {
    title: '黄石·矿冶之都',
    season: '春秋最佳',
    days: '2天',
    tags: ['矿冶文化', '磁湖', '东方山'],
    poster: { style: 'minimal', subtitle: '矿冶之都 青铜故里' },
    routes: ['黄石国家矿山公园→铜绿山古铜矿遗址', '磁湖风景区→团城山公园', '东方山风景区→大冶雷山风景区'],
    foods: [{ name: '黄石港饼', price: '5-8元', mustTry: true, location: '港区' }, { name: '阳新屯鸟', price: '30-50元', mustTry: true, location: '阳新' }]
  },

  '株洲': {
    title: '株洲·火车拉来的城市',
    season: '春秋最佳',
    days: '2天',
    tags:['工业城市','炎帝陵','醴陵瓷城'],
    poster:{style:'fresh',subtitle:'炎帝神农 瓷城株洲'},
    routes:['炎帝陵→炎帝广场→神农公园','醴陵瓷器口→渌江书院','方特欢乐世界'],
    foods:[{name:'醴陵炒粉',price:'10-15元',mustTry:true,location:'醴陵'},{name:'攸县香干',price:'8-12元',mustTry:true,location:'攸县'}]
  },

  '湘潭':{
    title:'湘潭·莲城',
    season:'春秋最佳',
    days:'2天',
    tags:['毛泽东故乡','韶山','莲城'],
    poster:{style:'vintage',subtitle:'伟人故里 红色湘潭'},
    routes:['韶山毛泽东同志故居→毛泽东铜像广场→毛泽东纪念馆→滴水洞','彭德怀纪念馆→乌石峰','昭山→盘龙大观园'],
    foods:[{name:'毛氏红烧肉',price:'38-58元',mustTry:true,location:'韶山'},{name:'剁辣椒鱼头',price:'48-78元',mustTry:true,location:'市区'}]
  },

  '衡阳':{
    title:'衡阳·雁城',
    season:'春秋最佳',
    days:'2-3',
    tags:['南岳衡山','抗战名城','蔡伦故里'],
    poster:{style:'fresh',subtitle:'寿岳衡山 雁城衡阳'},
    routes:['南岳衡山（祝融峰→藏经殿→南台寺→磨镜台→忠烈祠）','石鼓书院→回雁峰→衡阳保卫战纪念馆','耒阳蔡伦竹海纸博物馆'],
    foods:[{name:'衡阳鱼粉',price:'10-15元',mustTry:true,location:'市区'},{name:'渣江米粉',price:'8-12元',mustTry:true,location:'衡山'}]
  },

  '岳阳':{
    title:'岳阳·巴陵',
    season:'春夏秋最佳',
    days:'2天',
    tags:['洞庭湖','岳阳楼','君山岛'],
    poster:{style:'vintage',subtitle:'洞庭天下水 岳阳天下楼'},
    routes:['岳阳楼→洞庭湖→君山岛→君山野生荷花世界','屈子祠→汨罗江→屈子祠','张谷英古村→左宗棠故居'],
    foods:[{name:'岳阳烧烤',price:'30-50元/人',mustTry:true,location:'市区'},{name:'洞庭银鱼',price:'50-80元',mustTry:true,location:'洞庭湖'}]
  },

  '常德':{
    title:'常德·柳城',
    season:'春秋最佳',
    days:'2天',
    tags:['桃花源','柳叶湖','常德米粉'],
    poster:{style:'fresh',subtitle:'桃花源里 世外桃源'},
    routes:['桃花源（桃花山→桃源山→秦人村→桃仙岭）','柳叶湖→德国风情街→诗墙','壶瓶山→花岩溪'],
    foods:[{name:'常德米粉',price:'10-15元',mustTry:true,location:'市区'},{name:'酱板鸭',price:'30-50元',mustTry:true,location:'武陵'}]
  },

  '张家界':{
    title:'张家界·阿凡达仙境',
    season:'4-10月最佳',
    days:'3-4',
    tags:['石英砂岩峰林','玻璃栈道','自然奇观'],
    poster:{style:'fresh',subtitle:'缩小的仙境 扩大的盆景'},
    routes:['张家界国家森林公园→金鞭溪→袁家界（阿凡达取景地）','天子山→十里画廊→黄石寨','天门山→玻璃栈道→天门洞→999级台阶','大峡谷玻璃桥→黄龙洞→宝峰湖'],
    foods:[{name:'三下锅',price:'40-70元',mustTry:true,location:'胡师傅'},{name:'土家腊肉',price:'50-80元',mustTry:true,location:'土家菜馆'}]
  },

  '益阳':{
    title:'益阳·银城',
    season:'春秋最佳',
    days:'2天',
    tags:['洞庭湖畔','黑茶之乡','周立波故里'],
    poster:{style:'fresh',subtitle:'洞庭明珠 黑茶之乡'},
    routes:['安化黑茶博物馆→中国黑茶博物馆→云台山','周立波故居→山乡巨变第一村','柘溪国家森林公园'],
    foods:[{name:'安化黑茶',price:'100-500元/斤',mustTry:true,location:'安化'},{name:'益阳松花蛋',price:'3-5元',mustTry:true,location:'资阳区'}]
  },

  '娄底':{
    title:'娄底·星城',
    season:'春秋最佳',
    days:'2天',
    tags:['曾国藩故里','紫鹊界梯田','梅山龙宫'],
    poster:{style:'fresh',subtitle:'湘军故里 梅山龙城'},
    routes:['曾国藩故居→富厚堂→白玉堂→黄金堂','紫鹊界梯田→正龙古村','梅山龙宫→大熊山国家森林公园'],
    foods:[{name:'新化牛肉面',price:'10-15元',mustTry:true,location:'新化'},{name:'永丰辣酱',price:'5-8元',mustTry:true,location:'双峰'}]
  },

  '湘西州(吉首)':{
    title:'吉首·神秘湘西',
    season:'春秋最佳',
    days:'2-3',
    tags:['凤凰古城','矮寨大桥','德夯苗寨'],
    poster:{style:'vintage',subtitle:'神秘湘西 凤凰于飞'},
    routes:['凤凰古城→沱江泛舟→虹桥→沈从文故居','矮寨奇观旅游区→矮寨大桥→德夯苗寨','芙蓉镇（王村）→猛洞河漂流'],
    foods:[{name:'血粑鸭',price:'50-80元',mustTry:true,location:'古城'},{name:'姜糖',price:'10-15元',mustTry:true,location:'古城店铺'}]
  },

  '怀化':{
    title:'怀化·鹤城',
    season:'春秋最佳',
    days:'2-3',
    tags:['和平之城','侗族风情','芷江受降'],
    poster:{style:'fresh',subtitle:'和平之城 侗乡怀化'},
    routes:['芷江受降纪念坊→受降纪念馆→飞虎队纪念馆','通道侗寨→芋头侗寨→皇都侗寨','洪江古商城→黔阳古城'],
    foods:[{name:'芷江鸭',price:'30-50元',mustTry:true,location:'芷江'},{name:'侗族腌鱼',price:'20-30元',mustTry:true,location:'通道'}]
  },

  '永州':{
    title:'永州·零陵',
    season:'春秋最佳',
    days:'2-3',
    tags:['柳宗元故里','九嶷山','瑶族文化'],
    poster:{style:'vintage',subtitle:'潇湘之源 柳宗元谪居地'},
    routes:['零陵古城→柳子庙→愚溪→朝阳岩','九嶷山舜帝陵→舜帝庙→紫霞岩','江永女书文化园→上甘棠古村'],
    foods:[{name:'永州血鸭',price:'40-60元',mustTry:true,location:'零陵'},{name:'东安鸡',price:'30-50元',mustTry:true,location:'东安'}]
  },

  // === 华南地区 (广东/广西/海南) ===
  '珠海':{
    title:'珠海·百岛之市',
    season:'秋冬最佳',
    days:'2-3',
    tags:['情侣路','长隆海洋王国','澳门对望'],
    poster:{style:'fresh',subtitle:'浪漫之城 百岛之市'},
    routes:['情侣路→珠海渔女像→珠海大剧院→城市客厅','长隆海洋王国→横琴长隆国际海洋度假区','东澳岛→外伶仃岛（可选）'],
    foods:[{name:'横琴蚝',price:'50-80元',mustTry:true,location:'横琴'},{name:'珠海膏蟹',price:'80-150元/只',mustTry:true,location:'海边'}]
  },

  '东莞':{
    title:'东莞·莞城',
    season:'全年适宜',
    days:'2天',
    tags:['制造业名城','可园','篮球文化'],
    poster:{style:'minimal',subtitle:'世界工厂 活力东莞'},
    routes:['可园→莞城街道→迎恩门城楼','松山湖高新技术产业园→华为欧洲小镇','虎门销烟池→威远炮台→海战博物馆'],
    foods:[{name:'东莞烧鹅',price:'50-80元',mustTry:true,location:'厚街'},{ name:'道滘粽',price:'5-8元',mustTry:true,location:'道滘'}]
  },

  '佛山':{
    title:'佛山·禅城',
    season:'全年适宜',
    days:'2-3',
    tags:['武术之乡','陶瓷之都','顺德美食'],
    poster:{style:'fresh',subtitle:'功夫佛山 美食顺德'},
    routes:['祖庙→黄飞鸿纪念馆→叶问堂→岭南天地','西樵山→国艺影视城','顺德清晖园→逢简水乡→顺峰山公园'],
    foods:[{name:'顺德双皮奶',price:'8-12元',mustTry:true,location:'民信'},{name:'均安蒸猪',price:'60-100元',mustTry:true,location:'均安'}]
  },

  '惠州':{
    title:'惠州·鹅城',
    season:'全年适宜',
    days:'2-3',
    tags:['西湖','罗浮山','巽寮湾'],
    poster:{style:'fresh',subtitle:'半城山色半城湖'},
    routes:['惠州西湖→泗洲塔→王朝云墓','罗浮山→冲虚古观→酥醪观','巽寮湾→双月湾→海龟湾'],
    foods:[{name:'梅菜扣肉',price:'30-50元',mustTry:true,location:'梅菜产地'},{name:'东江酿豆腐',price:'15-25元',mustTry:true,location:'惠城区'}]
  },

  '中山':{
    title:'中山·香山',
    season:'全年适宜',
    days:'2天',
    tags:['孙中山故里','灯都','侨乡'],
    poster:{style:'vintage',subtitle:'伟人故里 博爱中山'},
    routes:['孙中山故居纪念馆→翠亨村民俗展示馆→中山影视城','岐江公园→孙文纪念公园→兴中广场','詹园→逍遥谷'],
    foods:[{name:'石岐乳鸽',price:'30-50元/只',mustTry:true,location:'石岐'},{name:'菊花肉',price:'20-30元',mustTry:true,location:'中山'}]
  },

  '江门':{
    title:'江门·五邑侨乡',
    season:'全年适宜',
    days:'2-3',
    tags:['碉楼','侨乡文化','小鸟天堂'],
    poster:{style:'fresh',subtitle:'中国侨都 五邑江门'},
    routes:['开平碉楼（自力村碉楼群→马降龙碉楼群）','小鸟天堂→梁启超故居','上下川岛（可选）'],
    foods:[{name:'陈皮骨',price:'50-80元',mustTry:true,location:'新会'},{name:'恩平濑粉',price:'10-15元',mustTry:true,location:'恩平'}]
  },

  '肇庆':{
    title:'肇庆·端州',
    season:'春秋最佳',
    days:'2-3',
    tags:['七星岩','鼎湖山','端砚'],
    poster:{style:'fresh',subtitle:'山水砚都 端州肇庆'},
    routes:['七星岩→星湖湿地公园→牌坊广场','鼎湖山→庆云寺→飞水潭→蝴蝶谷','端砚文化村→紫云谷'],
    foods:[{name:'肇庆裹蒸',price:'15-25元',mustTry:true,location:'市区'},{name:'山水豆腐花',price:'10-15元',mustTry:true,location:'鼎湖'}]
  },

  '湛江':{
    title:'湛江·港城',
    season:'冬春最佳',
    days:'2-3',
    tags:['大陆最南端','海鲜','火山岛'],
    poster:{style:'fresh',subtitle:'南国港城 热带湛江'},
    routes:['湖光岩→玛珥湖→楞严寺','东海岛→龙海天沙滩→中国第一长滩','徐闻菠萝的海→中国大陆南极村'],
    foods:[{name:'白切鸡',price:'50-80元',mustTry:true,location:'安铺'},{name:'生蚝',price:'3-5元/个',mustTry:true,location:'海边'}]
  },

  '茂名':{
    title:'茂名·油城',
    season:'全年适宜',
    days:'2天',
    tags:['南方油城','荔枝之乡','露天矿生态'],
    poster:{style:'fresh',subtitle:'南方油城 荔枝之乡'},
    routes:['茂名露天矿生态公园→好心湖→博物馆','放鸡岛→浪漫海岸','高州冼太庙→根子贡园'],
    foods:[{name:'茂名荔枝',price:'10-30元/斤',mustTry:true,location:'高州'},{name:'化州橘红',price:'5-8元/斤',mustTry:true,location:'化州'}]
  },

  '阳江':{
    title:'阳江·鼍城',
    season:'全年适宜',
    days:'2-3',
    tags:['海陵岛','刀具之都','风筝之乡'],
    poster:{style:'fresh',subtitle:'南海Ⅰ号 刀具之乡'},
    routes:['海陵岛→十里银滩→大角湾→马尾岛','凌霄岩→玉溪三洞','阳春春湾→龙宫岩'],
    foods:[{name:'阳江豆豉',price:'10-15元',mustTry:true,location:'市区'},{name:'一夜情',price:'8-12元',mustTry:true,location:'阳西'}]
  },

  '清远':{
    title:'清远·凤城',
    season:'全年适宜',
    days:'2-3',
    tags:['漂流','溶洞','少数民族'],
    poster:{style:'fresh',subtitle:'漂流之乡 清远山水'},
    routes:['黄腾峡漂流→牛鱼嘴原始生态风景区','连州地下河→湟川三峡→擎天玻璃桥','英西峰林走廊→洞天仙境'],
    foods:[{name:'清远鸡',price:'60-100元',mustTry:true,location:'市区'},{name:'北江河鲜',price:'50-80元/人',mustTry:true,location:'英德'}]
  },

  '韶关':{
    title:'韶关·韶城',
    season:'春秋最佳',
    days:'2-3',
    tags:['丹霞山','南华寺','珠玑巷'],
    poster:{style:'vintage',subtitle:'禅宗祖庭 丹霞地貌'},
    routes:['丹霞山（长老峰→翔龙湖→阴元石→阳元石→通泰桥）','南华寺→曹溪温泉→马坝人遗址','珠玑古巷→梅关古道'],
    foods:[{name:'丹霞山豆腐',price:'10-15元',mustTry:true,location:'仁化'},{name:'北江香菇宴',price:'50-80元/人',mustTry:true,location:'曲江'}]
  },

  '河源':{
    title:'河源·槎城',
    season:'全年适宜',
    days:'2天',
    tags:['万绿湖','恐龙之乡','客家古邑'],
    poster:{style:'fresh',subtitle:'客家古邑 绿色河源'},
    routes:['万绿湖风景区→水月湾→镜花缘','恐龙文博园→恐龙蛋遗址','苏家围客家乡村旅游区'],
    foods:[{name:'客家酿豆腐',price:'15-25元',mustTry:true,location:'市区'},{name:'东江盐焗鸡',price:'50-80元',mustTry:true,location:'东源'}]
  },

  '汕尾':{
    title:'汕尾·海陆丰',
    season:'秋冬最佳',
    days:'2天',
    tags:['红海湾','玄武山','妈祖文化'],
    poster:{style:'fresh',subtitle:'粤东黄金海岸'},
    routes:['红海湾遮浪半岛→南海观音','玄武山旅游区→元山寺','凤山祖庙→汕尾渔港'],
    foods:[{name:'海鲜粥',price:'15-25元',mustTry:true,location:'市区'},{name:'层糕粿',price:'5-8元',mustTry:true,location:'海陆丰'}]
 },

  '潮州':{
    title:'潮州·潮汕故里',
    season:'秋冬最佳',
    days:'2-3',
    tags:['潮州古城','广济桥','潮汕美食'],
    poster:{style:'vintage',subtitle:'岭海名邦 潮人故里'},
    routes:['潮州古城墙→广济桥→牌坊街→开元寺→许驸马府→己略黄公祠','韩文公祠→葫芦山→淡浮院','饶平青岚地质公园→汛洲岛'],
    foods:[{name:'潮州牛肉丸',price:'20-30元',mustTry:true,location:'牌坊街'},{name:'潮汕砂锅粥',price:'15-25元',mustTry:true,location:'西马路'}]
  },

  '揭阳':{
    title:'揭阳·莲城',
    season:'秋冬最佳',
    days:'2天',
    tags:['揭阳古城','黄旭华故居','潮汕文化'],
    poster:{style:'vintage',subtitle:'古邑揭阳 潮汕明珠'},
    routes:['揭阳学宫→进贤门→城隍庙→双峰寺','黄旭华故居→博览园','普宁德安里→洪阳古镇'],
    foods:[{name:'普宁豆干',price:'5-8元',mustTry:true,location:'普宁'},{name:'隆江猪脚饭',price:'10-15元',mustTry:true,location:'惠来'}]
  },

  '北海':{
    title:'北海·珠城',
    season:'10月-次年4月',
    days:'2-3',
    tags:['银滩','涠洲岛','珍珠之乡'],
    poster:{style:'fresh',subtitle:'南珠故郡 北海银滩'},
    routes:['北海银滩→北海老街→北部湾广场','涠洲岛（鳄鱼山火山公园→五彩滩→滴水丹屏→天主教堂）','海底世界→冠头岭'],
    foods:[{name:'海鲜',price:'60-100元/人',mustTry:true,location:'外沙/侨港'},{name:'虾饼',price:'5-8元',mustTry:true,location:'老街'}]
  },

  '桂林':{
    title:'桂林·山水甲天下',
    season:'4-10月最佳',
    days:'4-5',
    tags:['漓江风光','喀斯特地貌','民族风情'],
    poster:{style:'fresh',subtitle:'舟行碧波上 人在画中游'},
    routes:['漓江竹筏漂流（兴坪→阳朔）→十里画廊→西街','象鼻山→七星公园→芦笛岩→两江四湖','龙脊梯田（1-2日）→黄洛瑶寨长发村','遇龙河漂流→月亮山→印象刘三姐'],
    foods:[{name:'桂林米粉',price:'10-15元',mustTry:true,location:'崇善米粉'},{name:'阳朔啤酒鱼',price:'60-100元',mustTry:true,location:'谢三姐'}]
  },

  '柳州':{
    title:'柳州·龙城',
    season:'春秋最佳',
    days:'2-3',
    tags:['螺蛳粉','工业城市','百里柳江'],
    poster:{style:'fresh',subtitle:'螺蛳粉之都 工业柳州'},
    routes:['马鞍山公园→立鱼峰公园→柳侯祠','百里柳江画廊→蟠龙山→文庙','三江程阳风雨桥→侗寨→丹洲古城'],
    foods:[{name:'螺蛳粉',price:'10-15元',mustTry:true,location:'西环肥仔/娇姐'},{name:'柳州螺狮粉',price:'10-15元',mustTry:true,location:'西环路口'}]
  },

  '梧州':{
    title:'梧州·鸳江',
    season:'春秋最佳',
    days:'2天',
    tags:['岭南古都','六堡茶','龟苓膏'],
    poster:{style:'vintage',subtitle:'岭南古都 六堡茶乡'},
    routes:['骑楼城→龙母庙→中山公园','六堡茶生态旅游区→李家庄','白云山→太平天国永安王城'],
    foods:[{name:'梧州龟苓膏',price:'8-12元',mustTry:true,location:'市区'},{name:'纸包鸡',price:'50-80元',mustTry:true,location:'藤县'}]
  },

  '防城港':{
    title:'防城港·边关',
    season:'秋冬最佳',
    days:'2-3',
    tags:['十万大山','京族三岛','边境口岸'],
    poster:{style:'fresh',subtitle:'西南门户 边海之城'},
    routes:['十万大山国家森林公园→金滩','东兴口岸→中越友谊大桥→越南芒街','京族三岛→万尾金滩→簕山古战场'],
    foods:[{name:'海鲜',price:'60-100元/人',mustTry:true,location:'港口'},{name:'京族风味',price:'30-50元/人',mustTry:true,location:'东兴'}]
  },

  '崇左':{
    title:'崇左·骆越',
    season:'秋冬最佳',
    days:'2-3',
    tags:['德天瀑布','跨国瀑布','花山岩画'],
    poster:{style:'fresh',subtitle:'跨国瀑布 边关崇左'},
    routes:['德天跨国瀑布→明仕田园→归春河','花山岩画→左江斜塔→崇左起义纪念馆','凭祥友谊关→浦寨'],
    foods:[{name:'壮族美食',price:'30-50元/人',mustTry:true,location:'市区'},{name:'越南风味',price:'20-30元/人',mustTry:true,location:'凭祥'}]
  },

  '百色':{
    title:'百色·鹅城',
    season:'秋冬最佳',
    days:'2-3',
    tags:['百色起义','乐业天坑','壮族风情'],
    poster:{style:'vintage',subtitle:'红色福地 天坑之都'},
    routes:['百色起义纪念馆→粤东会馆→百色起义纪念碑','乐业大石围天坑群→布柳河峡谷→仙人桥','靖西通灵大峡谷→旧州古镇'],
    foods:[{name:'隆林黑粽子',price:'5-8元',mustTry:true,location:'隆林'},{name:'德保猪血肠',price:'15-25元',mustTry:true,location:'德保'}]
  },

  '河池':{
    title:'河池·刘三姐故乡',
    season:'全年适宜',
    days:'2-3',
    tags:['刘三姐','长寿之乡','有色金属'],
    poster:{style:'fresh',subtitle:'三姐故里 长寿河池'},
    routes:['刘三姐故里景区→下枧河壮寨→刘三姐水上公园','巴马长寿村→百魔洞→命河→水晶宫','南丹白裤瑶寨→歌娅思谷'],
    foods:[{name:'巴马香猪',price:'50-80元',mustTry:true,location:'巴马'},{name:'环江香猪',price:'50-80元',mustTry:true,location:'环江'}]
  },

  '来宾':{
    title:'来宾·桂中',
    season:'全年适宜',
    days:'2天',
    tags:['圣堂山','金秀瑶族','红水河'],
    poster:{style:'fresh',subtitle:'桂中来宾 圣堂奇观'},
    routes:['圣堂山→莲花山→大瑶山','金秀瑶族自治县→莲花山→圣堂山','忻城莫土司衙→翠屏山'],
    foods:[{name:'金秀瑶族美食',price:'30-50元/人',mustTry:true,location:'金秀'},{name:'来宾米粉',price:'8-12元',mustTry:true,location:'市区'}]
  },

  '贺州':{
    title:'贺州·长寿',
    season:'全年适宜',
    days:'2天',
    tags:['黄姚古镇','姑婆山','长寿之乡'],
    poster:{style:'vintage',subtitle:'世界长寿市 桂东门户'},
    routes:['黄姚古镇→带龙桥→文明阁','姑婆山→姑婆山国家森林公园','十八水→玉石林'],
    foods:[{name:'黄姚豆豉',price:'10-15元',mustTry:true,location:'黄姚'},{name:'贺州牛肠',price:'15-25元',mustTry:true,location:'市区'}]
  },

  '三亚':{
    title:'三亚·热带天堂',
    seasons:'10月-次年4月',
    days:'4-6',
    tags:['海滨度假','热带风光','海鲜盛宴'],
    poster:{style:'fresh',subtitle:'东方夏威夷'},
    routes:['亚龙湾海滩→热带天堂森林公园→蜈支洲岛','天涯海角→南山寺→大小洞天','海棠湾免税店→亚特兰蒂斯水世界','西岛→椰梦长廊→第一市场吃海鲜'],
    foods:[{name:'海南鸡饭',price:'25-40元',mustTry:true,location:'沿江海南鸡饭'},{name:'清补凉',price:'10-15元',mustTry:true,location:'街头小店'},{name:'椰子鸡',price:'80-120元/人',mustTry:true,location:'嗲嗲的椰子鸡'},{name:'海鲜大餐',price:'100-200元/人',mustTry:true,location:'第一市场'}]
  },

  '儋州':{
    title:'儋州·千年古郡',
    season:'冬春最佳',
    days:'2-3',
    tags:['东坡书院','海花岛','千年盐田'],
    poster:{style:'vintage',subtitle:'千年古郡 东坡遗风'},
    routes:['东坡书院→中和古镇→东坡井','海花岛（全球最大人工岛）','千年古盐田→洋浦经济开发区'],
    foods:[{name:'儋州米烂',price:'8-12元',mustTry:true,location:'市区'},{name:'光村沙虫',price:'30-50元',mustTry:true,location:'光村'}]
  },

  '琼海':{
    title:'琼海·田园城市',
    season:'全年适宜',
    days:'2天',
    tags:['博鳌论坛','万泉河','红色娘子军'],
    poster:{style:'fresh',subtitle:'田园城市 博鳌之都'},
    routes:['博鳌亚洲论坛永久会址→玉带滩→博鳌禅寺','万泉河→红色娘子军纪念园→白石岭','兴隆热带植物园→咖啡谷'],
    foods:[{name:'加积鸭',price:'50-80元',mustTry:true,location:'加积'},{name:'温泉鹅',price:'60-100元',mustTry:true,location:'兴隆'}]
  },

  '三沙':{
    title:'三沙·祖国南疆',
    season:'冬春最佳',
    days:'需报备',
    tags:['南海诸岛','珊瑚礁','热带海洋'],
    poster:{style:'fresh',subtitle:'祖国南疆 热带天堂'},
    routes:['永兴岛→七连屿→赵述岛','西沙群岛（需特别许可）','南沙群岛（需特别许可）'],
    foods:[{name:'海鲜',price:'100-200元/人',mustTry:true,location:'岛上'}]  // 特殊地区
  },

  // === 西南地区 (四川/云南/贵州/西藏部分) ===

  '绵阳':{
    title:'绵阳·科技城',
    season:'全年适宜',
    days:'2-3',
    tags:['李白故里','北川羌城','科技城'],
    poster:{style:'fresh',subtitle:'李白故里 科技绵阳'},
    routes:['李白故里→太白碑→陇西院→海灯武馆','北川羌城地震遗址→5.12汶川特大地震纪念馆','窦圌山→罗浮山→佛爷洞'],
    foods:[{name:'绵阳米粉',price:'10-15元',mustTry:true,location:'马家巷'},{name:'江油肥肠',price:'15-25元',mustTry:true,location:'江油'}]
  },

  '乐山':{
    title:'乐山·佛国仙山',
    season:'全年适宜',
    days:'2-3',
    tags:['乐山大佛','峨眉山','美食之都'],
    poster:{style:'vintage',subtitle:'佛国仙山 乐山乐水'},
    routes:['乐山大佛→东方佛都→乌尤寺→麻浩崖','峨眉山（报国寺→万年寺→清音阁→一线天→金顶）','东风堰→千佛岩'],
    foods:[{name:'甜皮鸭',price:'25-40元',mustTry:true,location:'赵鸭子'},{name:'钵钵鸡',price:'30-50元',mustTry:true,location:'纪六孃'}]
  },

  '宜宾':{
    title:'宜宾·万里长江第一城',
    season:'全年适宜',
    days:'2-3',
    tags:['五粮液','蜀南竹海','长江零公里'],
    poster:{style:'fresh',subtitle:'长江首城 酒都宜宾'},
    routes:['五粮液工业园→流杯池公园→丞相祠','蜀南竹海→忘忧谷→翡翠长廊','李庄古镇→同济工学院旧址'],
    foods:[{name:'宜宾燃面',price:'8-12元',mustTry:true,location:'市区'},{name:'李庄白肉',price:'30-50元',mustTry:true,location:'李庄'}]
  },

  '泸州':{
    title:'泸州·酒城',
    season:'全年适宜',
    days:'2天',
    tags:['泸州老窖','国窖1573','长江上游'],
    poster:{style:'vintage',subtitle:'中国酒城 浓香泸州'},
    routes:['泸州老窖旅游景区→国窖1573广场→酒文化博物馆','张坝桂圆林→方山','尧坝古镇→郎酒生产基地'],
    foods:[{name:'泸州白糕',price:'5-8元',mustTry:true,location:'市区'},{name:'古蔺麻辣鸡',price:'50-80元',mustTry:true,location:'古蔺'}]
  },

  '自贡':{
    title:'自贡·千年盐都',
    season:'全年适宜',
    days:'2天',
    tags:['恐龙博物馆','盐业历史','彩灯'],
    poster:{style:'fresh',subtitle:'千年盐都 恐龙之乡'},
    routes:['自贡恐龙博物馆→盐业历史博物馆→西秦会馆','彩灯公园→自贡灯会（春节期间）','仙市古镇→艾叶古镇'],
    foods:[{name:'冷吃兔',price:'40-60元',mustTry:true,location:'市区'},{name:'鲜锅兔',price:'60-100元',mustTry:true,location:'市区'}]
  },

  '内江':{
    title:'内江·甜城',
    season:'全年适宜',
    days:'1-2天',
    tags:['张大千故里','甜城','成渝之心'],
    poster:{style:'minimal',subtitle:'成渝之心 甜城内江'},
    routes:['张大千纪念馆→西林寺→圣水寺','隆昌石牌坊群→古宇湖'],
    foods:[{name:'内江牛肉面',price:'10-15元',mustTry:true,location:'市区'},{name:'蜜饯',price:'10-20元/斤',mustTry:true,location:'市区'}]
  },

  '南充':{
    title:'南充·绸都',
    season:'全年适宜',
    days:'2天',
    tags:['嘉陵江','阆中古城','三国文化'],
    poster:{style:'vintage',subtitle:'绸都南充 阆苑仙境'},
    routes:['阆中古城（贡院→川北道署→汉桓侯祠→张飞庙→中天楼）','朱德故里纪念馆→琳琅山','凌云山→白塔公园'],
    foods:[{name:'川北凉粉',price:'8-12元',mustTry:true,location:'市区'},{name:'方酥',price:'5-8元',mustTry:true,location:'南部'}]
  },

  '达州':{
    title:'达州·巴人故里',
    season:'全年适宜',
    days:'2天',
    tags:['元九铁路','巴山夜雨','天然气之都'],
    poster:{style:'fresh',subtitle:'巴人故里 元九达州'},
    routes:['真佛山→賨人谷→九龙山','巴山大峡谷→鱼泉山','宣汉马渡关石林'],
    foods:[{name:'达州灯影牛肉',price:'40-60元',mustTry:true,location:'市区'},{name:'大风羊肉',price:'50-80元',mustTry:true,location:'宣汉'}]
  },

  '大理':{
    title:'大理·风花雪月',
    season:'全年适宜',
    days:'3-5',
    tags:['苍山洱海','白族风情','慢生活'],
    poster:{style:'minimal',subtitle:'下关风 上关花 苍山雪 洱海月'},
    routes:['洱海环湖（吉普车旅拍）→喜洲古镇→双廊','苍山索道→崇圣寺三塔→大理古城','沙溪古镇→石宝山（深度游）','丽江→玉龙雪山（延伸线路）'],
    foods:[{name:'酸辣鱼',price:'50-80元',mustTry:true,location:'双廊海边餐厅'},{name:'乳扇',price:'10-15元',mustTry:true,location:'大理古城'},{name:'饵丝',price:'8-12元',mustTry:false,location:'巍山'}]
  },

  '丽江':{
    title:'丽江·柔软时光',
    season:'全年适宜',
    days:'3-5',
    tags:['古城韵味','纳西文化','艳遇之都'],
    poster:{style:'vintage',subtitle:'一米阳光的传说'},
    routes:['丽江古城→木府→四方街→狮子山','束河古镇→白沙壁画→玉湖村','玉龙雪山→蓝月谷→印象丽江演出','泸沽湖（2日游）→摩梭人家访'],
    foods:[{name:'腊排骨火锅',price:'60-100元',mustTry:true,location:'古城阿安'},{name:'鸡豆凉粉',price:'8-12元',mustTry:true,location:'古城小巷'},{name:'纳西烤鱼',price:'40-60元',mustTry:false,location:'七一街'}]
  },

  '迪庆(香格里拉)':{
    title:'香格里拉·心中的日月',
    season:'5-10月最佳',
    days:'3-4',
    tags:['梅里雪山','藏族文化','香巴拉'],
    poster:{style:'fresh',subtitle:'心中的日月 接近天堂'},
    routes:['普达措国家公园→属都湖→碧塔海','松赞林寺→噶丹·松赞林寺','梅里雪山（飞来寺→明永冰川→雨崩村）','虎跳峡→白水台'],
    foods:[{name:'牦牛肉火锅',price:'80-120元/人',mustTry:true,location:'香格里拉'},{name:'酥油茶',price:'10-15元',mustTry:true,location:'藏餐吧'}]
  },

  '普洱':{
    title:'普洱·茶马古道',
    season:'全年适宜',
    days:'2-3',
    tags:['普洱茶','茶马古道','哈尼族'],
    poster:{style:'fresh',subtitle:'世界茶源 普洱茶香'},
    routes:['普洱茶马古道旅游景区→那柯里茶马驿站→普洱国家公园','景迈山古茶园→翁基布朗族古寨','墨江北回归线标志园→墨江双胞胎文化园'],
    foods:[{name:'普洱茶',price:'100-500元/斤',mustTry:true,location:'茶园'},{name:'哈尼族美食',price:'30-50元/人',mustTry:true,location:'墨江'}]
  },

  '曲靖':{
    title:'曲靖·爨文化',
    season:'全年适宜',
    days:'2天',
    tags:['珠江源','爨文化','美食之都'],
    poster:{style:'fresh',subtitle:'珠江源头 爨乡曲靖'},
    routes:['珠江源风景区→爨宝雄古镇→彩色沙林','师宗凤凰谷→菌子山','罗平油菜花海（春季）→金鸡峰丛'],
    foods:[{name:'宣威火腿',price:'50-100元/斤',mustTry:true,location:'宣威'},{name:'沾益辣子鸡',price:'50-80元',mustTry:true,location:'沾益'}]
  },

  '楚雄':{
    title:'楚雄·彝州',
    season:'全年适宜',
    days:'2天',
    tags:['彝族文化','恐龙谷','元谋土林'],
    poster:{style:'fresh',subtitle:'彝州楚雄 东方人类故乡'},
    routes:['彝族十月太阳历文化园→彝族博物馆','元谋土林→元谋猿人遗址','武定狮子山→己衣大裂谷'],
    foods:[{name:'彝族坨坨肉',price:'30-50元',mustTry:true,location:'楚雄'},{name:'野生菌',price:'80-150元/人',mustTry:true,location:'南华'}]
  },

  '玉溪':{
    title:'玉溪·聂耳故乡',
    season:'全年适宜',
    days:'2天',
    tags:['抚仙湖','聂耳','褚橙之乡'],
    poster:{style:'minimal',subtitle:'云烟之乡 聂耳故里'},
    routes:['抚仙湖→禄充风景区→明星鱼洞','聂耳故居→聂耳音乐广场','澄江帽天山→寒武山'],
    foods:[{name:'鳝鱼米线',price:'15-25元',mustTry:true,location:'市区'},{name:'冰稀饭',price:'5-8元',mustTry:true,location:'易门'}]
  },

  '保山':{
    title:'保山·永昌',
    season:'全年适宜',
    days:'2-3',
    tags:['腾冲','和顺古镇','滇西抗战'],
    poster:{style:'fresh',subtitle:'极边之城 温润保山'},
    routes:['腾冲热海→和顺古镇→火山地质公园','国殇墓园（滇西抗战纪念馆）→叠水河瀑布','高黎贡山→百花岭'],
    foods:[{name:'大救驾',price:'80-120元',mustTry:true,location:'腾冲'},{ name:'土锅子',price:'30-50元',mustTry:true,location:'腾冲'}]
  },

  '昭通':{
    title:'昭通·秋城',
    season:'全年适宜',
    days:'2天',
    tags:['黑颈鹤','苹果之乡','乌蒙山'],
    poster:{style:'fresh',subtitle:'鹤乡昭通 苹果之城'},
    routes:['大山包黑颈鹤自然保护区→鸡公山','念湖→草海','乌蒙山国家级自然保护区'],
    foods:[{name:'昭通苹果',price:'5-10元/斤',mustTry:true,location:'昭通'},{name:'天麻炖鸡',price:'60-100元',mustTry:true,location:'彝良'}]
  },

  '临沧':{
    title:'临沧·恒春',
    season:'全年适宜',
    days:'2-3',
    tags:['普洱茶','佤族风情','边境口岸'],
    poster:{style:'fresh',subtitle:'恒春临沧 世界佤乡'},
    routes:['沧源崖画谷→勐来董寨→翁丁原始部落','勐懂口岸→中缅边境','澜沧景迈山茶山→冰岛湖'],
    foods:[{name:'佤族鸡肉烂饭',price:'20-30元',mustTry:true,location:'沧源'},{name:'普洱茶',price:'50-100元/斤',mustTry:true,location:'临沧'}]
  },

  '日喀则':{
    title:'日喀则·后藏',
    season:'5-10月最佳',
    days:'3-4',
    tags:['珠峰大本营','扎什伦布寺','后藏文化'],
    poster:{style:'vintage',subtitle:'珠峰门户 后藏圣地'},
    routes:['扎什伦布寺→班禅新宫→后藏民俗博览园','珠峰大本营（绒布寺）→珠峰观景台','萨迦寺→岗巴冰川'],
    foods:[{name:'藏式美食',price:'30-50元/人',mustTry:true,location:'日喀则'}]
  },

  '林芝':{
    title:'林芝·西藏江南',
    season:'5-10月最佳',
    days:'3-4',
    tags:['雅鲁藏布大峡谷','南迦巴瓦峰','林芝桃花'],
    poster:{style:'fresh',subtitle:'西藏江南 雪域桃源'},
    routes:['巴松措→卡定沟→措木及日','雅鲁藏布大峡谷→南迦巴瓦峰（远观）','鲁朗林海→色季拉山→南伊沟','林芝桃花沟（春季）'],
    foods:[{name:'石锅鸡',price:'80-120元',mustTry:true,location:'鲁朗'},{name:'藏香猪',price:'50-80元',mustTry:true,location:'林芝'}]
  },

  '昌都':{
    title:'昌都·藏东明珠',
    season:'5-10月最佳',
    days:'2-3',
    tags:['强巴林寺','康巴服饰','茶马古道',
    poster:{style:'vintage',subtitle:'藏东明珠 康巴故里'},
    routes:['强巴林寺→昌都地区博物馆','类乌齐寺→查杰玛大殿','孜珠寺→三色湖'],
    foods:[{name:'藏东美食',price:'30-50元/人',mustTry:true,location:'昌都'}]
  },

  '阿里':{
    title:'阿里·世界屋脊',
    season:'5-10月最佳',
    days:'7-10',
    tags:['冈仁波齐峰','古格王朝','神山圣湖'],
    poster:{style:'vintage',subtitle:'世界屋脊 阿里朝圣之路'},
    routes:['冈仁波齐峰转山→玛旁雍错→拉昂错','札达土林→古格王朝遗址','班公错→日土岩画'],
    foods:[{name:'藏式食物',price:'50-80元/人',mustTry:true,location:'沿途'}]
  },

  // === 西北地区 (陕西/甘肃/宁夏/青海/新疆部分) ===

  '延安':{
    title:'延安·革命圣地',
    season:'春夏秋最佳',
    days:'2-3',
    tags:['黄帝陵','宝塔山','壶口瀑布'],
    poster:{style:'vintage',subtitle:'革命圣地 红色延安'},
    routes:['黄帝陵→轩辕庙→壶口瀑布','宝塔山→清凉山→革命纪念馆','枣园革命旧址→杨家岭革命旧址'],
    foods:[{name:'延安红枣',price:'10-20元/斤',mustTry:true,location:'延川'},{name:'子长煎饼',price:'5-8元',mustTry:true,location:'子长'}]
  },

  '榆林':{
    title:'榆林·驼城',
    season:'夏秋最佳',
    days:'2-3',
    tags:['镇北台','红石峡','陕北民歌'],
    poster:{style:'fresh',subtitle:'塞上驼城 陕北榆林'},
    routes:['镇北台→红石峡→统万城遗址','榆林古城→红石峡生态公园','神木二郎山→红碱淖'],
    foods:[{name:'榆林豆腐',price:'8-12元',mustTry:true,location:'绥德'},{name:'羊杂碎',price:'15-25元',mustTry:true,location:'市区'}]
  },

  '咸阳':{
    title:'咸阳·秦都',
    season:'全年适宜',
    days:'1-2天',
    tags:['秦始皇陵','茂陵','乾陵'],
    poster:{style:'vintage',subtitle:'第一帝都 秦都咸阳'},
    routes:['秦始皇陵（丽山园）→茂陵（汉武帝）→霍去病墓','乾陵（武则天与高宗合葬墓）→懿德太子墓','汉阳陵→阳陵'],
    foods:[{name:'biangbiang面',price:'15-20元',mustTry:true,location:'秦都区'},{name:'泡泡油糕',price:'5-8元',mustTry:true,location:'渭城区'}]
  },

  '宝鸡':{
    title:'宝鸡·陈仓',
    season:'全年适宜',
    days:'2-3',
    tags:['法门寺','青铜器之乡','炎帝故里'],
    poster:{style:'fresh',subtitle:'陈仓故里 青铜之乡'},
    routes:['法门寺（珍宝馆→合十舍利塔）→茂陵','太白山→青峰峡→红河谷','炎帝陵→青铜器博物馆'],
    foods:[{name:'宝鸡擀面皮',price:'8-12元',mustTry:true,location:'岐山'},{name:'臊子面',price:'10-15元',mustTry:true,location:'宝鸡'}]
  },

  '渭南':{
    title:'渭南·东府',
    season:'全年适宜',
    days:'1-2天',
    tags:['华山','司马迁故里','洽川'],
    poster:{style:'fresh',subtitle:'华山险峻 史圣故里'},
    routes:['华山（西峰→南峰→东峰→北峰→中峰→长空栈道）','韩城司马迁祠→党家村→黄河龙门','洽川处女泉→福山'],
    foods:[{name:'时辰包子',price:'5-8元',mustTry:true,location:'大荔'},{name:'潼关肉夹馍',price:'15-25元',mustTry:true,location:'潼关'}]
  },

  '汉中':{
    title:'汉中·天府之国',
    season:'全年适宜',
    days:'2-3',
    tags:['汉中油菜花海','武侯墓','栈道'],
    poster:{style:'fresh',subtitle:'西北小江南 汉中天府'},
    routes:['武侯墓→勉县武侯祠→马超墓','汉中油菜花海（春季）→朱鹮自然保护区','石门栈道→张良庙'],
    foods:[{name:'热面皮',price:'8-12元',mustTry:true,location:'市区'},{name:'菜豆腐',price:'10-15元',mustTry:true,location:'洋县'}]
  },

  '安康':{
    title:'安康·秦巴明珠',
    season:'全年适宜',
    days:'2天',
    tags:['瀛湖','南宫山','秦岭腹地'],
    poster:{style:'fresh',subtitle:'秦巴明珠 秦头楚尾'},
    routes:['瀛湖风景区→南宫山→香溪洞','中坝大峡谷→天书峡','岚皋南宫山→千层河'],
    foods:[{name:'蒸面',price:'8-12元',mustTry:true,location:'市区'},{name:'八大件',price:'30-50元',mustTry:true,location:'市区'}]
  },

  '商洛':{
    title:'商洛·秦岭最美',
    season:'全年适宜',
    days:'2天',
    tags:['秦岭','金丝大峡谷','核桃之乡'],
    poster:{style:'fresh',subtitle:'秦岭最美 商於古道'},
    routes:['金丝大峡谷→柞水漂流→秦岭洞天福地','牛背梁自然保护区→终南山寨','棣花古镇→贾平故居'],
    foods:[{name:'商洛核桃',price:'15-25元/斤',mustTry:true,location:'商州'},{name:'橡子凉粉',price:'10-15元',mustTry:true,location:'商州'}]
  },

  '天水':{
    title:'天水·陇上江南',
    season:'春夏秋最佳',
    days:'2-3',
    tags:['麦积山石窟','伏羲庙','大地湾'],
    poster:{style:'vintage',subtitle:'陇上江南 伏羲故里'},
    routes:['麦积山石窟→仙人崖→净土寺→麦积烟雨','伏羲庙→南郭寺→玉泉观→李广墓','大地湾遗址→水帘洞'],
    foods:[{name:'呱呱',price:'15-25元',mustTry:true,location:'秦州'},{name:'天水杂烩',price:'20-30元',mustTry:true,location:'市区'}]
  },

  '酒泉':{
    title:'酒泉·肃州',
    season:'夏秋最佳',
    days:'2-3',
    tags:['卫星发射中心','锁阳城','敦煌门户'],
    poster:{style:'vintage',subtitle:'航天之城 敦煌门户'},
    routes:['酒泉卫星发射中心→西汉酒泉胜迹','锁阳城→榆林窟','敦煌方向（莫高窟/鸣沙山/月牙泉）'],
    foods:[{name:'驴肉黄面',price:'15-25元',mustTry:true,location:'市区'},{ name:'糊锅',price:'8-12元',mustTry:true,location:'市区'}]
  },

  '嘉峪关':{
    title:'嘉峪关·天下第一雄关',
    season:'夏秋最佳',
    days:'1-2天',
    tags:['嘉峪关关城','悬壁长城','魏晋墓群'],
    poster:{style:'vintage',subtitle:'天下第一雄关 边陲锁钥'},
    routes:['嘉峪关关城→悬臂长城→长城第一墩','新城魏晋壁画墓→讨赖古城'],
    foods:[{name:'烤羊排',price:'40-60元',mustTry:true,location:'市区'},{name:'搓鱼面',price:'10-15元',mustTry:true,location:'市区'}]
  },

  '张掖':{
    title:'张掖·甘州',
    season:'夏秋最佳',
    days:'2-3',
    tags:['七彩丹霞','大佛寺','马蹄寺'],
    poster:{style:'fresh',subtitle:'七彩丹霞 张掖不夜天'},
    routes:['张掖七彩丹霞→冰沟丹霞→平山湖大峡谷','大佛寺→山西会馆→马蹄寺','山丹军马场'],
    foods:[{name:'搓鱼子',price:'10-15元',mustTry:true,location:'市区'},{name:'炒炮仗',price:'8-12元',mustTry:true,location:'市区'}]
  },

  '武威':{
    title:'武威·凉州',
    season:'夏秋最佳',
    days:'2天',
    tags:['雷台汉墓','文庙','天梯山'],
    poster:{style:'vintage',subtitle:'马踏飞燕出凉州'},
    routes:['雷台汉墓→雷台观→文庙→西夏博物馆','天梯山石窟→海藏寺','神州荒漠野生动物园'],
    foods:[{name:'三套车',price:'15-25元',mustTry:true,location:'市区'},{name:'凉州羊羔肉',price:'50-80元',mustTry:true,location:'市区'}]
  },

  '金昌':{
    title:'金昌·镍都',
    season:'夏秋最佳',
    days:'1-2天',
    tags:['镍都','骊靬古城','巴丹吉林沙漠'],
    poster:{style:'minimal',subtitle:'中国镍都 西部花城'},
    routes:['金川国家矿山公园→露天镍矿','骊靬古城→巴丹吉林沙漠（可选）','紫金花海'],
    foods:[{name:'羊肉垫卷子',price:'20-30元',mustTry:true,location:'市区'},{name:'糖花子',price:'5-8元',mustTry:true,location:'市区'}]
  },

  '白银':{
    title:'白银·铜城',
    season:'夏秋最佳',
    days:'1-2天',
    tags:['黄河石林','会宁红军会师','铜城'],
    poster:{style:'fresh',subtitle:'黄河明珠 铜城白银'},
    routes:['黄河石林→饮马沟大峡谷','会宁红军会师旧址→红军长征胜利景园','法泉寺→寿鹿山'],
    foods:[[name:'靖远羊羔肉',price:'50-80元',mustTry:true,location:'靖远'}, {name:'酸烂肉',price:'20-30元',mustTry:true,location:'市区'}]
  },

  '固原':{
    title:'固原·萧关',
    season:'夏秋最佳',
    days:'2天',
    tags:['须弥山石窟','六盘山','萧关'],
    poster:{style:'vintage',subtitle:'萧关故道 固原风光'},
    routes:['须弥山石窟→火石寨→老龙潭','六盘山→红军长征纪念馆','萧关遗址→战国秦长城'],
    foods:[{name:'固原暖锅',price:'30-50元',mustTry:true,location:'市区'},{name:'莜面',price:'8-12元',mustTry:true,location:'市区'}]
  },

  '中卫':{
    title:'中卫·沙坡头',
    season:'夏秋最佳',
    days:'2-3',
    tags:['沙坡头','沙坡鸣钟','腾格里沙漠'],
    poster:{style:'fresh',subtitle:'沙坡鸣钟 大漠孤烟'},
    routes:['沙坡头→腾格里沙漠→金沙岛→通湖草原','高庙→寺口子黄河大峡谷','南华山→海原大地震遗址'],
    foods:[{name:'蒿子面',price:'10-15元',mustTry:true,location:'市区'},{name:'硒沙瓜',price:'5-8元',mustTry:true,location:'中宁'}]
  },

  '吐鲁番':{
    title:'吐鲁番·火洲',
    season:'夏秋最佳',
    days:'2-3',
    tags:['火焰山','葡萄沟','坎儿井'],
    poster:{style:'fresh',subtitle:'火洲吐鲁 葡萄之乡'},
    routes:['火焰山→柏孜克里克千佛洞→葡萄沟→坎儿井民俗园','交河故城→高昌故城→阿斯塔那古墓群','库木塔格沙漠'],
    foods:[{name:'葡萄',price:'10-30元/斤',mustTry:true,location:'葡萄沟'},{name:'哈密瓜',price:'5-10元/斤',mustTry:true,location:'市区'}]
  },

  '哈密':{
    title:'哈密·甜蜜之城',
    season:'夏秋最佳',
    days:'2-3',
    tags:['哈密瓜','魔鬼城','回王陵'],
    poster:{style:'fresh',subtitle:'甜蜜之城 瓜果之乡'},
    routes:['魔鬼城（雅丹地貌）→哈密回王陵→哈密瓜园','巴里坤草原→巴里坤古城→怪石山','五堡魔鬼城'],
    foods:[{name:'哈密瓜',price:'5-10元/斤',mustTry:true,location:'果园'},{name:'烤全羊',price:'300-500元',mustTry:true,location:'巴里坤'}]
  },

  '克拉玛依':{
    title:'克拉玛依·油城',
    season:'夏秋最佳',
    days:'2-3',
    tags:['乌尔禾魔鬼城','黑油山','石油之城'],
    poster:{style:'minimal',subtitle:'石油之城 魔鬼之城'},
    routes:['乌尔禾魔鬼城（世界魔鬼城）→五彩滩→白杨河大峡谷','黑油山→一号井→石油纪念广场','克拉玛依大油田'],
    foods:[{name:'克拉玛依凉皮',price:'8-12元',mustTry:true,location:'市区'},{name:'羊肉串',price:'3-5元/串',mustTry:true,location:'市区'}]
  },

  '伊犁':{
    title:'伊犁·塞外江南',
    season:'6-9月最佳',
    days:'3-5',
    tags:['那拉提草原','赛里木湖','薰衣草'],
    poster:{style:'fresh',subtitle:'塞外江南 杏花伊犁'},
    routes:['那拉提草原→空中草原→河谷草原→雪莲谷','赛里木湖→果子沟大桥→点将台','霍尔果斯口岸→惠远古城','薰衣草庄园（6-7月）'],
    foods:[{name:'马肉纳仁',price:'30-50元',mustTry:true,location:'昭苏'},{name:'手工冰淇淋',price:'5-10元',mustTry:true,location:'伊宁市'}]
  },

  '阿勒泰':{
    title:'阿勒泰·金山',
    season:'冬季（滑雪）/夏季（避暑）',
    days:'3-4',
    tags:['喀纳斯','可可托海','禾木村'],
    poster:{style:'fresh',subtitle:'人间净土 神的后花园'},
    routes:['喀纳斯湖→观鱼台→月亮湾→神仙湾→卧龙湾','禾木村→禾木河→白桦林','可可托海→额尔齐斯大峡谷','五彩滩'],
    foods:[{name:'冷水鱼',price:'50-80元',mustTry:true,location:'喀纳斯'},{name:'烤狗鱼',price:'30-50元',mustTry:true,location:'布尔津'}]
  },

  '喀什':{
    title:'喀什·丝路明珠',
    season:'9-11月最佳',
    days:'2-3',
    tags:['艾提尕尔清真寺','高台民居','维吾尔风情'],
    poster:{style:'vintage',subtitle:'不到喀什不算到过新疆'},
    routes:['艾提尕尔清真寺→喀什老城→高台民居→香妃墓','卡拉库里湖→慕士塔格峰（远观）','达瓦昆沙漠'],
    foods:[{name:'抓饭',price:'10-15元',mustTry:true,location:'老城'},{name:'烤包子',price:'3-5元',mustTry:true,location:'老城'}]
  },

  '和田':{
    title:'和田·玉都',
    season:'9-11月最佳',
    days:'2-3',
    tags:['和田玉','千里葡萄长廊','昆仑山'],
    poster:{style:'fresh',subtitle:'玉石之都 昆仑山下'},
    routes:['和田玉龙喀什河→玉石巴扎→玉石交易市场','千里葡萄长廊→无花果王','尼雅遗址→昆仑山'],
    foods:[{name:'和田玉枣',price:'15-25元/斤',mustTry:true,location:'市区'},{name:'烤全羊',price:'300-500元',mustTry:true,location:'市区'}]
  },

  '库尔勒':{
    title:'库尔勒·梨城',
    season:'夏秋最佳',
    days:'2-3',
    tags:['博斯腾湖','罗布人村寨','孔雀河'],
    poster:{style:'fresh',subtitle:'梨城库尔勒 塞外江南'},
    routes:['博斯腾湖→芦苇荡→白鹭洲','罗布人村寨→阿不旦旅游公路','金沙滩→孔雀河'],
    foods:[{name:'博湖鱼',price:'50-80元',mustTry:true,location:'博斯腾湖'},{name:'库尔勒香梨',price:'5-10元/斤',mustTry:true,location:'市区'}]
  },

  '阿克苏':{
    title:'阿克苏·白水城',
    season:'夏秋最佳',
    days:'2-3',
    tags:['天山托木尔峰','克孜尔千佛洞','苹果之乡'],
    poster:{style:'fresh',subtitle:'白水城 龟兹故里'},
    routes:['天山托木尔峰→温宿大峡谷','克孜尔千佛洞→天山神秘大峡谷','塔克拉玛干沙漠（边缘）'],
    foods:[{name:'阿克苏苹果',price:'5-10元/斤',mustTry:true,location:'阿克苏'},{name:'库车大馕',price:'3-5元',mustTry:true,location:'库车'}]
  },

  '石河子':{
    title:'石河子·军垦名城',
    season:'夏秋最佳',
    days:'1-2天',
    tags:['军垦博物馆','驼铃梦坡','军垦第一连'],
    poster:{style:'minimal',subtitle:'戈壁明珠 军垦新城'},
    routes:['军垦博物馆→军垦第一连→周总理纪念碑','驼铃梦坡→驼铃酒庄→北泉镇'],
    foods:[{name:'凉皮',price:'8-12元',mustTry:true,location:'市区'},{name:'大盘鸡',price:'50-80元',mustTry:true,location:'市区'}]
  },

  '昌吉':{
    title:'昌吉·回族自治州',
    season:'夏秋最佳',
    days:'2天',
    tags:['天山天池','江布拉克','回民风情'],
    poster:{style:'fresh',subtitle:'天山脚下 回民家园'},
    routes:['天山天池→西小天池→马牙山→灯杆山','江布拉克→天山牧场','回民小吃街'],
    foods:[[name:'九碗三行子',price:'20-30元',mustTry:true,location:'市区'}, {name:'椒麻鸡',price:'40-60元',mustTry:true,location:'市区'}]
  },

  '五家渠':{
    title:'五家渠·兵城',
    season:'夏秋最佳',
    days:'1-2天',
    tags:['军垦博物馆','怪石林','鸣沙山'],
    poster:{style:'minimal',subtitle:'兵团之城 兵团风采'},
    routes:['军垦博物馆→军垦第一犁','怪石林→鸣沙山','101团→艾青诗歌馆'],
    foods:[{name:'凉皮',price:'8-12元',mustTry:true,location:'市区'},{name:'大盘鸡',price:'50-80元',mustTry:true,location:'市区'}]
  }

};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXPANDED_CITIES;
}