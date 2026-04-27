module.exports = {
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
        { name: '东方明珠', url: 'https://www.orientalpearl.com.cn/', mustVisit: true },
        { name: '上海迪士尼', url: 'https://www.shanghaidisneyresort.com/' }
      ],
      booking: [{ name: '迪士尼门票', url: 'https://www.shanghaidisneyresort.com/tickets/' }],
      food: [{ name: '上海美食', url: 'https://www.dianping.com/shanghai/food' }]
    },
    poster: {
      title: '魔都印象',
      subtitle: '现代与传统的完美融合',
      elements: ['外滩', '东方明珠', '豫园', '迪士尼'],
      layout: '顶部东方明珠，中央外滩，底部豫园',
      colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '外滩 → 南京路' },
          { time: '12:00-14:00', afternoon: '午餐（小笼包）' },
          { time: '14:00-17:00', afternoon2: '豫园 → 城隍庙' },
          { time: '18:00-21:00', evening: '新天地 → 陆家嘴' }
        ],
        tips: ['外滩夜景很美', '豫园人多建议早去'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 外滩 → 南京路' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（小笼包）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 豫园 → 城隍庙' },
          { time: '18:00-21:00', evening: 'Day1: 新天地 → 陆家嘴' },
          { time: '09:00-18:00', morning2: 'Day2: 上海迪士尼乐园' }
        ],
        tips: ['迪士尼需要一整天时间', '建议提前购买门票'],
        budget: '800-1500元'
      }
    }
  },
  '成都': {
    tags: ['天府之国', '美食天堂', '休闲之都'],
    season: '春秋两季',
    atmosphere: '慢节奏的生活，浓郁的市井气息',
    days: '3-4天',
    routes: ['宽窄巷子 → 锦里古街', '大熊猫基地 → 杜甫草堂', '武侯祠 → 春熙路'],
    foods: [
      { name: '火锅', desc: '成都特色，麻辣鲜香', price: '100-200元/人', mustTry: true },
      { name: '龙抄手', desc: '成都特色小吃', price: '20-30元/份' },
      { name: '麻婆豆腐', desc: '川菜经典', price: '30-40元/份' },
      { name: '担担面', desc: '成都特色面食', price: '15-25元/碗' },
      { name: '串串香', desc: '成都特色美食', price: '0.5-2元/串' }
    ],
    accommodations: [
      { area: '春熙路/太古里', pros: '市中心，购物方便', cons: '价格较高' },
      { area: '宽窄巷子', pros: '近景点，环境好', cons: '价格较高' },
      { area: '武侯祠', pros: '交通便利，近景点', cons: '人流量大' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
      { type: '外部交通', info: '双流国际机场；成都站、成都东站等多个火车站' }
    ],
    budget: { low: '1000', medium: '2000', high: '3500+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.chengdu.gov.cn/',
      attractions: [
        { name: '大熊猫基地', url: 'https://www.panda.org.cn/', mustVisit: true },
        { name: '武侯祠', url: 'https://www.wuhouci.net.cn/', mustVisit: true },
        { name: '宽窄巷子', url: 'https://www.kuanzhai.com/' }
      ],
      booking: [],
      food: [{ name: '成都美食', url: 'https://www.dianping.com/chengdu/food' }]
    },
    poster: {
      title: '蓉城记忆',
      subtitle: '慢生活，慢享受',
      elements: ['大熊猫', '火锅', '宽窄巷子', '武侯祠'],
      layout: '顶部大熊猫，中央火锅，底部宽窄巷子',
      colors: ['#e67e22', '#3498db', '#27ae60', '#9b59b6', '#f39c12']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '大熊猫基地' },
          { time: '12:00-14:00', afternoon: '午餐（火锅）' },
          { time: '14:00-17:00', afternoon2: '宽窄巷子 → 锦里' },
          { time: '18:00-21:00', evening: '春熙路' }
        ],
        tips: ['看大熊猫要早去', '春熙路适合购物'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 大熊猫基地' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 宽窄巷子 → 锦里' },
          { time: '18:00-21:00', evening: 'Day1: 春熙路' },
          { time: '09:00-17:00', morning2: 'Day2: 武侯祠 → 杜甫草堂' }
        ],
        tips: ['看大熊猫要早去', '锦里适合买纪念品'],
        budget: '600-1200元'
      }
    }
  },
  '杭州': {
    tags: ['人间天堂', '西湖美景', '江南水乡'],
    season: '春秋两季',
    atmosphere: '西湖美景，江南水乡的韵味',
    days: '2-3天',
    routes: ['西湖环湖游 → 断桥残雪', '灵隐寺 → 飞来峰', '宋城 → 西溪湿地'],
    foods: [
      { name: '西湖醋鱼', desc: '杭州特色菜品', price: '50-80元/份', mustTry: true },
      { name: '东坡肉', desc: '杭州特色美食', price: '40-60元/份' },
      { name: '片儿川', desc: '杭州特色面食', price: '20-30元/碗' },
      { name: '小笼包', desc: '杭州特色点心', price: '25-35元/笼' },
      { name: '龙井虾仁', desc: '杭州特色菜品', price: '80-120元/份' }
    ],
    accommodations: [
      { area: '西湖周边', pros: '近景点，环境好', cons: '价格较高' },
      { area: '湖滨', pros: '市中心，购物方便', cons: '价格较高' },
      { area: '黄龙', pros: '交通便利，近景点', cons: '人流量大' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
      { type: '外部交通', info: '萧山国际机场；杭州站、杭州东站等多个火车站' }
    ],
    budget: { low: '800', medium: '1800', high: '3000+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.hangzhou.gov.cn/',
      attractions: [
        { name: '西湖', url: 'https://www.hzwestlake.com/', mustVisit: true },
        { name: '灵隐寺', url: 'https://www.lingyinsi.com/', mustVisit: true },
        { name: '宋城', url: 'https://www.songcn.com/' }
      ],
      booking: [],
      food: [{ name: '杭州美食', url: 'https://www.dianping.com/hangzhou/food' }]
    },
    poster: {
      title: '西湖印象',
      subtitle: '人间天堂，江南水乡',
      elements: ['西湖', '断桥', '灵隐寺', '龙井'],
      layout: '顶部西湖，中央断桥，底部灵隐寺',
      colors: ['#2ecc71', '#3498db', '#1abc9c', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '西湖环湖游' },
          { time: '12:00-14:00', afternoon: '午餐（西湖醋鱼）' },
          { time: '14:00-17:00', afternoon2: '断桥残雪 → 雷峰塔' },
          { time: '18:00-21:00', evening: '河坊街' }
        ],
        tips: ['西湖游船很惬意', '河坊街适合买纪念品'],
        budget: '250-500元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 西湖环湖游' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（西湖醋鱼）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 断桥残雪 → 雷峰塔' },
          { time: '18:00-21:00', evening: 'Day1: 河坊街' },
          { time: '09:00-17:00', morning2: 'Day2: 灵隐寺 → 飞来峰' }
        ],
        tips: ['西湖游船很惬意', '灵隐寺要提前去'],
        budget: '500-1000元'
      }
    }
  },
  '西安': {
    tags: ['十三朝古都', '历史文化名城', '兵马俑之乡'],
    season: '春秋两季',
    atmosphere: '厚重的历史文化气息',
    days: '3-4天',
    routes: ['兵马俑 → 华清池', '城墙骑行 → 大雁塔', '回民街 → 钟鼓楼'],
    foods: [
      { name: '肉夹馍', desc: '西安特色小吃', price: '10-20元/个', mustTry: true },
      { name: '羊肉泡馍', desc: '西安特色美食', price: '30-50元/份' },
      { name: '凉皮', desc: '西安特色小吃', price: '15-25元/份' },
      { name: 'biangbiang面', desc: '西安特色面食', price: '25-35元/碗' },
      { name: '甑糕', desc: '西安特色小吃', price: '10-15元/份' }
    ],
    accommodations: [
      { area: '钟鼓楼/回民街', pros: '近景点，美食多', cons: '人流量大' },
      { area: '大雁塔', pros: '环境好，交通便利', cons: '价格较高' },
      { area: '城墙周边', pros: '近景点', cons: '价格适中' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
      { type: '外部交通', info: '咸阳国际机场；西安站、西安北站等多个火车站' }
    ],
    budget: { low: '900', medium: '1800', high: '3000+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.xa.gov.cn/',
      attractions: [
        { name: '兵马俑', url: 'https://www.bmy.com.cn/', mustVisit: true },
        { name: '城墙', url: 'https://www.xacitywall.com/', mustVisit: true },
        { name: '大雁塔', url: 'https://www.xadayanta.com/' }
      ],
      booking: [{ name: '兵马俑门票', url: 'https://www.bmy.com.cn/ticket' }],
      food: [{ name: '西安美食', url: 'https://www.dianping.com/xian/food' }]
    },
    poster: {
      title: '长安记忆',
      subtitle: '十三朝古都，千年历史',
      elements: ['兵马俑', '城墙', '大雁塔', '钟鼓楼'],
      layout: '顶部兵马俑，中央城墙，底部大雁塔',
      colors: ['#95a5a6', '#34495e', '#7f8c8d', '#f39c12', '#e74c3c']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '兵马俑' },
          { time: '12:00-14:00', afternoon: '午餐（肉夹馍）' },
          { time: '14:00-17:00', afternoon2: '华清池' },
          { time: '18:00-21:00', evening: '回民街' }
        ],
        tips: ['兵马俑要提前预约', '回民街美食很多'],
        budget: '350-700元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 兵马俑' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（肉夹馍）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 华清池' },
          { time: '18:00-21:00', evening: 'Day1: 回民街' },
          { time: '09:00-17:00', morning2: 'Day2: 城墙骑行 → 大雁塔' }
        ],
        tips: ['兵马俑要提前预约', '城墙骑行很惬意'],
        budget: '700-1400元'
      }
    }
  },
  '重庆': {
    tags: ['山城', '火锅之都', '8D魔幻城市'],
    season: '春秋两季',
    atmosphere: '火辣的城市，独特的地形',
    days: '2-3天',
    routes: ['洪崖洞 → 解放碑', '磁器口古镇 → 长江索道', '武隆天生三桥'],
    foods: [
      { name: '火锅', desc: '重庆特色，麻辣鲜香', price: '80-150元/人', mustTry: true },
      { name: '小面', desc: '重庆特色面食', price: '10-20元/碗' },
      { name: '酸辣粉', desc: '重庆特色小吃', price: '8-15元/份' },
      { name: '毛血旺', desc: '重庆特色菜品', price: '50-80元/份' },
      { name: '抄手', desc: '重庆特色小吃', price: '15-25元/份' }
    ],
    accommodations: [
      { area: '解放碑/洪崖洞', pros: '市中心，近景点', cons: '价格较高' },
      { area: '江北', pros: '交通便利', cons: '价格适中' },
      { area: '南岸', pros: '环境好，近景点', cons: '价格较高' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
      { type: '外部交通', info: '江北国际机场；重庆站、重庆北站等多个火车站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.cq.gov.cn/',
      attractions: [
        { name: '洪崖洞', url: 'https://www.cqhongyadong.com/', mustVisit: true },
        { name: '长江索道', url: 'https://www.cqsuodao.com/', mustVisit: true },
        { name: '武隆天生三桥', url: 'https://www.wulongtour.com/' }
      ],
      booking: [],
      food: [{ name: '重庆美食', url: 'https://www.dianping.com/chongqing/food' }]
    },
    poster: {
      title: '山城记忆',
      subtitle: '火锅之都，8D魔幻城市',
      elements: ['洪崖洞', '火锅', '长江索道', '解放碑'],
      layout: '顶部洪崖洞，中央火锅，底部长江索道',
      colors: ['#e74c3c', '#f39c12', '#3498db', '#27ae60', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '磁器口古镇' },
          { time: '12:00-14:00', afternoon: '午餐（火锅）' },
          { time: '14:00-17:00', afternoon2: '长江索道' },
          { time: '18:00-21:00', evening: '洪崖洞 → 解放碑' }
        ],
        tips: ['磁器口古镇适合买纪念品', '洪崖洞夜景很美'],
        budget: '250-500元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 磁器口古镇' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 长江索道' },
          { time: '18:00-21:00', evening: 'Day1: 洪崖洞 → 解放碑' },
          { time: '09:00-17:00', morning2: 'Day2: 武隆天生三桥' }
        ],
        tips: ['磁器口古镇适合买纪念品', '洪崖洞夜景很美'],
        budget: '500-1000元'
      }
    }
  },
  '广州': {
    tags: ['羊城', '美食之都', '现代化都市'],
    season: '春秋两季',
    atmosphere: '早茶文化，现代化都市',
    days: '2-3天',
    routes: ['广州塔 → 珠江夜游', '沙面岛 → 上下九步行街', '白云山 → 陈家祠'],
    foods: [
      { name: '早茶', desc: '广州特色，点心多样', price: '50-100元/人', mustTry: true },
      { name: '白切鸡', desc: '广州特色菜品', price: '40-60元/份' },
      { name: '艇仔粥', desc: '广州特色粥品', price: '20-30元/份' },
      { name: '云吞面', desc: '广州特色面食', price: '25-35元/碗' },
      { name: '叉烧包', desc: '广州特色点心', price: '15-25元/份' }
    ],
    accommodations: [
      { area: '天河/珠江新城', pros: '市中心，购物方便', cons: '价格较高' },
      { area: '上下九/沙面岛', pros: '近景点，美食多', cons: '人流量大' },
      { area: '白云山', pros: '环境好，近景点', cons: '价格适中' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
      { type: '外部交通', info: '白云国际机场；广州站、广州南站等多个火车站' }
    ],
    budget: { low: '900', medium: '1800', high: '3200+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.gz.gov.cn/',
      attractions: [
        { name: '广州塔', url: 'https://www.canton-tower.com/', mustVisit: true },
        { name: '沙面岛', url: 'https://www.shamian.com/', mustVisit: true },
        { name: '白云山', url: 'https://www.baiyunshan.com/' }
      ],
      booking: [{ name: '广州塔门票', url: 'https://www.canton-tower.com/ticket' }],
      food: [{ name: '广州美食', url: 'https://www.dianping.com/guangzhou/food' }]
    },
    poster: {
      title: '羊城记忆',
      subtitle: '美食之都，现代化都市',
      elements: ['广州塔', '早茶', '沙面岛', '白云山'],
      layout: '顶部广州塔，中央早茶，底部沙面岛',
      colors: ['#3498db', '#2ecc71', '#1abc9c', '#f39c12', '#e67e22']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '沙面岛' },
          { time: '12:00-14:00', afternoon: '午餐（早茶）' },
          { time: '14:00-17:00', afternoon2: '陈家祠' },
          { time: '18:00-21:00', evening: '广州塔 → 珠江夜游' }
        ],
        tips: ['早茶要早去', '珠江夜景很美'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 沙面岛' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（早茶）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 陈家祠' },
          { time: '18:00-21:00', evening: 'Day1: 广州塔 → 珠江夜游' },
          { time: '09:00-17:00', morning2: 'Day2: 白云山' }
        ],
        tips: ['早茶要早去', '珠江夜景很美'],
        budget: '600-1200元'
      }
    }
  },
  '厦门': {
    tags: ['海上花园', '鼓浪屿', '文艺清新'],
    season: '春秋两季',
    atmosphere: '清新文艺，海风徐徐',
    days: '2-3天',
    routes: ['鼓浪屿一日游', '厦门大学 → 南普陀寺', '曾厝垵 → 中山路'],
    foods: [
      { name: '沙茶面', desc: '厦门特色面食', price: '20-30元/碗', mustTry: true },
      { name: '海蛎煎', desc: '厦门特色小吃', price: '25-35元/份' },
      { name: '土笋冻', desc: '厦门特色小吃', price: '15-25元/份' },
      { name: '花生汤', desc: '厦门特色汤品', price: '10-15元/份' },
      { name: '面线糊', desc: '厦门特色美食', price: '15-25元/份' }
    ],
    accommodations: [
      { area: '鼓浪屿', pros: '近景点，环境好', cons: '价格较高' },
      { area: '曾厝垵', pros: '美食多，近景点', cons: '人流量大' },
      { area: '中山路', pros: '市中心，购物方便', cons: '价格较高' }
    ],
    transport: [
      { type: '内部交通', info: '公交网络发达，建议使用公交出行' },
      { type: '外部交通', info: '高崎国际机场；厦门站、厦门北站等多个火车站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.xm.gov.cn/',
      attractions: [
        { name: '鼓浪屿', url: 'https://www.gulangyu.com/', mustVisit: true },
        { name: '厦门大学', url: 'https://www.xmu.edu.cn/', mustVisit: true },
        { name: '南普陀寺', url: 'https://www.nanputuo.com/' }
      ],
      booking: [{ name: '鼓浪屿门票', url: 'https://www.gulangyu.com/ticket' }],
      food: [{ name: '厦门美食', url: 'https://www.dianping.com/xiamen/food' }]
    },
    poster: {
      title: '鹭岛记忆',
      subtitle: '海上花园，文艺清新',
      elements: ['鼓浪屿', '厦门大学', '曾垵', '大海'],
      layout: '顶部鼓浪屿，中央厦门大学，底部曾垵',
      colors: ['#1abc9c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '鼓浪屿' },
          { time: '12:00-14:00', afternoon: '午餐（沙茶面）' },
          { time: '14:00-17:00', afternoon2: '厦门大学 → 南普陀寺' },
          { time: '18:00-21:00', evening: '曾厝垵' }
        ],
        tips: ['鼓浪屿要提前预约', '曾厝垵美食很多'],
        budget: '280-560元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 鼓浪屿' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（沙茶面）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 厦门大学 → 南普陀寺' },
          { time: '18:00-21:00', evening: 'Day1: 曾垵' },
          { time: '09:00-17:00', morning2: 'Day2: 中山路 → 环岛路' }
        ],
        tips: ['鼓浪屿要提前预约', '环岛路适合骑行'],
        budget: '560-1120元'
      }
    }
  },
  '南京': {
    tags: ['六朝古都', '历史文化名城', '现代都市'],
    season: '春秋两季',
    atmosphere: '厚重的历史文化，现代都市的繁华',
    days: '2-3天',
    routes: ['中山陵 → 明孝陵', '总统府 → 夫子庙', '南京博物院 → 玄武湖'],
    foods: [
      { name: '鸭血粉丝汤', desc: '南京特色汤品', price: '15-25元/份', mustTry: true },
      { name: '盐水鸭', desc: '南京特色美食', price: '40-60元/份' },
      { name: '小笼包', desc: '南京特色点心', price: '20-30元/笼' },
      { name: '牛肉锅贴', desc: '南京特色小吃', price: '15-25元/份' },
      { name: '桂花糖芋苗', desc: '南京特色小吃', price: '10-15元/份' }
    ],
    accommodations: [
      { area: '夫子庙/秦淮河', pros: '近景点，美食多', cons: '人流量大' },
      { area: '新街口', pros: '市中心，购物方便', cons: '价格较高' },
      { area: '中山陵', pros: '环境好，近景点', cons: '价格适中' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
      { type: '外部交通', info: '禄口国际机场；南京站、南京南站等多个火车站' }
    ],
    budget: { low: '700', medium: '1400', high: '2500+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
    },
    links: {
      official: 'https://www.nanjing.gov.cn/',
      attractions: [
        { name: '中山陵', url: 'https://www.zsl.com/', mustVisit: true },
        { name: '总统府', url: 'https://www.zongtongfu.com/', mustVisit: true },
        { name: '夫子庙', url: 'https://www.fuzimiao.com/' }
      ],
      booking: [],
      food: [{ name: '南京美食', url: 'https://www.dianping.com/nanjing/food' }]
    },
    poster: {
      title: '金陵记忆',
      subtitle: '六朝古都，历史文化名城',
      elements: ['中山陵', '总统府', '夫子庙', '秦淮河'],
      layout: '顶部中山陵，中央总统府，底部夫子庙',
      colors: ['#34495e', '#95a5a6', '#7f8c8d', '#f39c12', '#e74c3c']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '中山陵 → 明孝陵' },
          { time: '12:00-14:00', afternoon: '午餐（鸭血粉丝汤）' },
          { time: '14:00-17:00', afternoon2: '总统府' },
          { time: '18:00-21:00', evening: '夫子庙 → 秦淮河' }
        ],
        tips: ['中山陵免费', '夫子庙夜景很美'],
        budget: '220-440元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 中山陵 → 明孝陵' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（鸭血粉丝汤）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 总统府' },
          { time: '18:00-21:00', evening: 'Day1: 夫子庙 → 秦淮河' },
          { time: '09:00-17:00', morning2: 'Day2: 南京博物院 → 玄武湖' }
        ],
        tips: ['中山陵免费', '南京博物院很值得去'],
        budget: '440-880元'
      }
    }
  },
  '深圳': {
    tags: ['创新之都', '现代化城市', '科技中心'],
    season: '全年适宜',
    atmosphere: '年轻活力，快节奏，创新',
    days: '2-3天',
    routes: ['世界之窗 → 欢乐谷', '大梅沙海滨 → 东部华侨城', '莲花山公园 → 市民中心'],
    foods: [
      { name: '椰子鸡', desc: '深圳特色美食', price: '60-100元/份', mustTry: true },
      { name: '肠粉', desc: '广东传统美食', price: '20-30元/份' },
      { name: '煲仔饭', desc: '广东特色美食', price: '25-40元/份' },
      { name: '沙茶面', desc: '深圳特色面食', price: '25-35元/碗' },
      { name: '海鲜大排档', desc: '深圳海滨美食', price: '100-200元/人' }
    ],
    accommodations: [
      { area: '福田/罗湖', pros: '市中心，交通便利', cons: '价格较高' },
      { area: '南山', pros: '科技氛围，环境好', cons: '价格适中' },
      { area: '大梅沙', pros: '海滨度假，近景点', cons: '价格较高' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，覆盖全城' },
      { type: '外部交通', info: '宝安国际机场；深圳站、深圳北站等多个火车站' }
    ],
    budget: { low: '1200', medium: '2500', high: '4000+' },
    tips: {
      prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '充电宝'],
      avoid: ['不要乘坐黑车', '注意防晒', '避开高峰期']
    },
    links: {
      official: 'https://www.sz.gov.cn/',
      attractions: [
        { name: '世界之窗', url: 'https://www.szwwc.com/', mustVisit: true },
        { name: '欢乐谷', url: 'https://www.sz-happyvalley.com/', mustVisit: true },
        { name: '东部华侨城', url: 'https://www.octeast.com/' }
      ],
      booking: [],
      food: [{ name: '深圳美食', url: 'https://www.dianping.com/shenzhen/food' }]
    },
    poster: {
      title: '深圳速度',
      subtitle: '创新之都，活力之城',
      elements: ['世界之窗', '欢乐谷', '大梅沙', '市民中心'],
      layout: '顶部市民中心，中央世界之窗，底部大梅沙',
      colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '世界之窗' },
          { time: '12:00-14:00', afternoon: '午餐（椰子鸡）' },
          { time: '14:00-17:00', afternoon2: '欢乐谷' },
          { time: '18:00-21:00', evening: '市民中心 → 莲花山公园' }
        ],
        tips: ['世界之窗可以逛半天', '欢乐谷适合年轻人'],
        budget: '400-800元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 世界之窗' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（椰子鸡）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 欢乐谷' },
          { time: '18:00-21:00', evening: 'Day1: 市民中心 → 莲花山公园' },
          { time: '09:00-17:00', morning2: 'Day2: 大梅沙 → 东部华侨城' }
        ],
        tips: ['大梅沙适合海滨度假', '东部华侨城需要一整天'],
        budget: '800-1600元'
      }
    }
  },
  '苏州': {
    tags: ['园林之城', '江南水乡', '历史文化名城'],
    season: '春秋两季',
    atmosphere: '古典园林，水乡韵味，温婉优雅',
    days: '2-3天',
    routes: ['拙政园 → 苏州博物馆 → 狮子林', '虎丘 → 留园 → 寒山寺', '周庄古镇/同里古镇一日游'],
    foods: [
      { name: '苏式汤面', desc: '苏州特色面食', price: '20-30元/碗', mustTry: true },
      { name: '松鼠鳜鱼', desc: '苏州经典菜', price: '60-100元/份' },
      { name: '糖粥', desc: '苏州传统甜品', price: '10-15元/碗' },
      { name: '生煎', desc: '苏州特色小吃', price: '15-25元/份' },
      { name: '碧螺春茶', desc: '苏州名茶', price: '20-50元/杯' }
    ],
    accommodations: [
      { area: '观前街/平江路', pros: '市中心，近景点', cons: '价格较高' },
      { area: '拙政园周边', pros: '园林氛围，近景点', cons: '人流量大' },
      { area: '金鸡湖', pros: '现代苏州，环境好', cons: '离古镇较远' }
    ],
    transport: [
      { type: '内部交通', info: '地铁网络发达，公交覆盖全城' },
      { type: '外部交通', info: '苏州站、苏州北站；靠近上海虹桥机场' }
    ],
    budget: { low: '600', medium: '1200', high: '2000+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '雨具', '相机'],
      avoid: ['不要在景点周边买纪念品', '古镇门票可提前购买']
    },
    links: {
      official: 'https://www.suzhou.gov.cn/',
      attractions: [
        { name: '拙政园', url: 'https://www.szzyy.com/', mustVisit: true },
        { name: '虎丘', url: 'https://www.huqiu.com/', mustVisit: true },
        { name: '周庄古镇', url: 'https://www.zhouzhuang.com/' }
      ],
      booking: [],
      food: [{ name: '苏州美食', url: 'https://www.dianping.com/suzhou/food' }]
    },
    poster: {
      title: '姑苏印象',
      subtitle: '园林之城，水乡韵味',
      elements: ['拙政园', '虎丘塔', '小桥流水', '古镇石板路'],
      layout: '顶部拙政园，中央虎丘塔，底部小桥流水',
      colors: ['#7f8c8d', '#34495e', '#27ae60', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '拙政园 → 苏州博物馆' },
          { time: '12:00-14:00', afternoon: '午餐（苏式汤面）' },
          { time: '14:00-17:00', afternoon2: '狮子林 → 平江路' },
          { time: '18:00-21:00', evening: '观前街' }
        ],
        tips: ['拙政园建议早上去', '平江路适合漫步'],
        budget: '200-400元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 拙政园 → 苏州博物馆' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（苏式汤面）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 狮子林 → 平江路' },
          { time: '18:00-21:00', evening: 'Day1: 观前街' },
          { time: '09:00-17:00', morning2: 'Day2: 虎丘 → 留园 → 寒山寺' }
        ],
        tips: ['寒山寺可以敲钟祈福', '留园比拙政园人少'],
        budget: '400-800元'
      }
    }
  },
  '武汉': {
    tags: ['江城', '九省通衢', '美食之都'],
    season: '春秋两季',
    atmosphere: '大江大湖，市井烟火气',
    days: '2-3天',
    routes: ['黄鹤楼 → 户部巷 → 长江大桥', '东湖环湖 → 湖北省博物馆', '武汉大学 → 汉口江滩'],
    foods: [
      { name: '热干面', desc: '武汉最具代表性美食', price: '5-10元/碗', mustTry: true },
      { name: '鸭脖', desc: '武汉特色小吃', price: '20-30元/份' },
      { name: '豆皮', desc: '武汉传统早餐', price: '5-10元/份' },
      { name: '武昌鱼', desc: '武汉特色菜品', price: '50-80元/份' },
      { name: '糊汤粉', desc: '武汉特色小吃', price: '10-15元/份' }
    ],
    accommodations: [
      { area: '武昌/黄鹤楼', pros: '近景点，交通便利', cons: '人流量大' },
      { area: '汉口/江汉路', pros: '商业繁华，美食多', cons: '价格较高' },
      { area: '东湖周边', pros: '环境优美，适合度假', cons: '离市中心较远' }
    ],
    transport: [
      { type: '内部交通', info: '地铁覆盖全城，公交发达' },
      { type: '外部交通', info: '天河国际机场；武汉站、汉口站、武昌站' }
    ],
    budget: { low: '600', medium: '1200', high: '2000+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['热干面街边小店更好吃', '不要相信车站拉客']
    },
    links: {
      official: 'https://www.wuhan.gov.cn/',
      attractions: [
        { name: '黄鹤楼', url: 'https://www.hcl.com/', mustVisit: true },
        { name: '东湖', url: 'https://www.donghu.com/', mustVisit: true },
        { name: '湖北省博物馆', url: 'https://www.hbww.org/' }
      ],
      booking: [],
      food: [{ name: '武汉美食', url: 'https://www.dianping.com/wuhan/food' }]
    },
    poster: {
      title: '江城武汉',
      subtitle: '大江大湖，烟火人间',
      elements: ['黄鹤楼', '长江大桥', '东湖', '樱花'],
      layout: '顶部黄鹤楼，中央长江大桥，底部东湖',
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '黄鹤楼 → 户部巷' },
          { time: '12:00-14:00', afternoon: '午餐（热干面+武昌鱼）' },
          { time: '14:00-17:00', afternoon2: '长江大桥 → 汉口江滩' },
          { time: '18:00-21:00', evening: '江汉路步行街' }
        ],
        tips: ['黄鹤楼建议早上去', '长江大桥可以步行通过'],
        budget: '200-400元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 黄鹤楼 → 户部巷' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（热干面+武昌鱼）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 长江大桥 → 汉口江滩' },
          { time: '18:00-21:00', evening: 'Day1: 江汉路步行街' },
          { time: '09:00-17:00', morning2: 'Day2: 东湖环湖 → 湖北省博物馆' }
        ],
        tips: ['东湖很大建议骑行', '省博物馆免费但需预约'],
        budget: '400-800元'
      }
    }
  },
  '青岛': {
    tags: ['啤酒之城', '海滨度假', '欧式建筑'],
    season: '夏季最佳（6-9月）',
    atmosphere: '海风习习，啤酒飘香，欧式风情',
    days: '2-3天',
    routes: ['栈桥 → 八大关 → 小鱼山', '崂山一日游', '啤酒博物馆 → 五四广场 → 奥帆中心'],
    foods: [
      { name: '海鲜大排档', desc: '青岛特色海鲜', price: '80-150元/人', mustTry: true },
      { name: '青岛啤酒', desc: '青岛标志性饮品', price: '5-10元/杯' },
      { name: '鲅鱼水饺', desc: '青岛特色水饺', price: '25-35元/份' },
      { name: '辣炒蛤蜊', desc: '青岛特色小吃', price: '20-30元/份' },
      { name: '烤肉串', desc: '青岛夜市美食', price: '10-20元/串' }
    ],
    accommodations: [
      { area: '栈桥/八大关', pros: '近景点，欧式风情', cons: '价格较高' },
      { area: '五四广场', pros: '市中心，交通便利', cons: '人流量大' },
      { area: '崂山周边', pros: '环境优美，度假氛围', cons: '离市区较远' }
    ],
    transport: [
      { type: '内部交通', info: '地铁覆盖主要区域，公交发达' },
      { type: '外部交通', info: '胶东国际机场；青岛站、青岛北站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '泳衣'],
      avoid: ['不要在景区吃海鲜', '注意防晒', '避免台风季节']
    },
    links: {
      official: 'https://www.qingdao.gov.cn/',
      attractions: [
        { name: '栈桥', url: 'https://www.zhanqiao.com/', mustVisit: true },
        { name: '崂山', url: 'https://www.laoshan.com/', mustVisit: true },
        { name: '八大关', url: 'https://www.badaguan.com/' }
      ],
      booking: [],
      food: [{ name: '青岛美食', url: 'https://www.dianping.com/qingdao/food' }]
    },
    poster: {
      title: '青岛时光',
      subtitle: '啤酒之城，海风习习',
      elements: ['栈桥', '八大关', '崂山', '啤酒'],
      layout: '顶部栈桥，中央八大关，底部崂山',
      colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '栈桥 → 八大关' },
          { time: '12:00-14:00', afternoon: '午餐（海鲜+啤酒）' },
          { time: '14:00-17:00', afternoon2: '小鱼山 → 啤酒博物馆' },
          { time: '18:00-21:00', evening: '五四广场 → 奥帆中心' }
        ],
        tips: ['栈桥海鸥很多', '啤酒博物馆可以品尝鲜啤'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 栈桥 → 八大关' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（海鲜+啤酒）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 小鱼山 → 啤酒博物馆' },
          { time: '18:00-21:00', evening: 'Day1: 五四广场' },
          { time: '09:00-17:00', morning2: 'Day2: 崂山一日游' }
        ],
        tips: ['崂山需要一整天', '建议穿舒适的登山鞋'],
        budget: '600-1200元'
      }
    }
  },
  '三亚': {
    tags: ['热带天堂', '海滨度假', '天涯海角'],
    season: '全年适宜（11月-次年3月最佳）',
    atmosphere: '阳光沙滩，椰林海风，度假天堂',
    days: '3-5天',
    routes: ['亚龙湾 → 热带天堂森林公园', '天涯海角 → 南山文化旅游区', '蜈支洲岛一日游', '亚特兰蒂斯水世界'],
    foods: [
      { name: '海鲜大餐', desc: '三亚新鲜海鲜', price: '100-200元/人', mustTry: true },
      { name: '椰子饭', desc: '海南特色美食', price: '20-30元/份' },
      { name: '文昌鸡', desc: '海南四大名菜之一', price: '60-100元/份' },
      { name: '清补凉', desc: '海南特色甜品', price: '10-15元/份' },
      { name: '加积鸭', desc: '海南名菜', price: '80-120元/份' }
    ],
    accommodations: [
      { area: '亚龙湾', pros: '沙滩最美，度假区', cons: '价格较高' },
      { area: '三亚湾', pros: '离市区近，性价比高', cons: '沙滩稍逊' },
      { area: '海棠湾', pros: '新开发，酒店高端', cons: '交通不便' }
    ],
    transport: [
      { type: '内部交通', info: '公交覆盖主要区域，建议租车自驾' },
      { type: '外部交通', info: '凤凰国际机场；三亚站' }
    ],
    budget: { low: '2000', medium: '4000', high: '8000+' },
    tips: {
      prepare: ['身份证必带', '防晒霜SPF50+', '墨镜', '泳衣', '驱蚊液'],
      avoid: ['不要参加低价一日游', '海鲜市场注意比价', '避免台风季节']
    },
    links: {
      official: 'https://www.sanya.gov.cn/',
      attractions: [
        { name: '亚龙湾', url: 'https://www.yalongwan.com/', mustVisit: true },
        { name: '南山寺', url: 'https://www.nanshan.com/', mustVisit: true },
        { name: '蜈支洲岛', url: 'https://www.wuzhizhou.com/' }
      ],
      booking: [],
      food: [{ name: '三亚美食', url: 'https://www.dianping.com/sanya/food' }]
    },
    poster: {
      title: '热带三亚',
      subtitle: '阳光沙滩，度假天堂',
      elements: ['亚龙湾', '椰林', '天涯海角', '南海观音'],
      layout: '顶部南海观音，中央亚龙湾，底部天涯海角',
      colors: ['#3498db', '#f39c12', '#2ecc71', '#e74c3c', '#1abc9c']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '亚龙湾' },
          { time: '12:00-14:00', afternoon: '午餐（海鲜大餐）' },
          { time: '14:00-17:00', afternoon2: '热带天堂森林公园' },
          { time: '18:00-21:00', evening: '三亚湾日落' }
        ],
        tips: ['亚龙湾沙滩最美', '森林公园玻璃栈道值得去'],
        budget: '400-800元'
      },
      '3天2晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 亚龙湾' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（海鲜）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 热带天堂森林公园' },
          { time: '18:00-21:00', evening: 'Day1: 三亚湾日落' },
          { time: '09:00-17:00', morning2: 'Day2: 蜈支洲岛一日游' },
          { time: '09:00-17:00', morning2: 'Day3: 天涯海角 → 南山寺' }
        ],
        tips: ['蜈支洲岛水上项目多', '南山寺南海观音壮观'],
        budget: '2000-4000元'
      }
    }
  },
  '丽江': {
    tags: ['古城', '雪山', '纳西文化'],
    season: '春秋两季',
    atmosphere: '古城韵味，雪山壮观，纳西风情',
    days: '3-4天',
    routes: ['丽江古城 → 四方街 → 木府', '玉龙雪山 → 蓝月谷', '束河古镇 → 白沙古镇'],
    foods: [
      { name: '腊排骨火锅', desc: '丽江特色美食', price: '60-100元/人', mustTry: true },
      { name: '鸡豆凉粉', desc: '丽江特色小吃', price: '5-10元/份' },
      { name: '纳西烤鱼', desc: '纳西族特色美食', price: '30-50元/份' },
      { name: '酥油茶', desc: '藏族特色饮品', price: '10-15元/杯' },
      { name: '粑粑', desc: '丽江特色面食', price: '5-10元/份' }
    ],
    accommodations: [
      { area: '古城内', pros: '近景点，纳西风情', cons: '石板路拉行李不便' },
      { area: '古城外围', pros: '交通方便，价格实惠', cons: '离古城稍远' },
      { area: '束河古镇', pros: '环境清幽，适合度假', cons: '离市区较远' }
    ],
    transport: [
      { type: '内部交通', info: '古城内步行，周边公交+打车' },
      { type: '外部交通', info: '丽江三义机场；丽江站' }
    ],
    budget: { low: '1000', medium: '2000', high: '3500+' },
    tips: {
      prepare: ['身份证必带', '防晒霜', '氧气瓶（高原反应）', '舒适的鞋子'],
      avoid: ['不要在古城内买银器', '玉龙雪山门票提前买', '注意高原反应']
    },
    links: {
      official: 'https://www.lijiang.gov.cn/',
      attractions: [
        { name: '玉龙雪山', url: 'https://www.yulongxueshan.com/', mustVisit: true },
        { name: '丽江古城', url: 'https://www.lijiang.com/', mustVisit: true },
        { name: '束河古镇', url: 'https://www.shuhe.com/' }
      ],
      booking: [],
      food: [{ name: '丽江美食', url: 'https://www.dianping.com/lijiang/food' }]
    },
    poster: {
      title: '丽江印象',
      subtitle: '古城韵味，雪山壮观',
      elements: ['丽江古城', '玉龙雪山', '束河古镇', '四方街'],
      layout: '顶部玉龙雪山，中央古城全景，底部四方街',
      colors: ['#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '丽江古城 → 四方街 → 木府' },
          { time: '12:00-14:00', afternoon: '午餐（腊排骨火锅）' },
          { time: '14:00-17:00', afternoon2: '狮子山 → 万古楼' },
          { time: '18:00-21:00', evening: '古城夜景 → 酒吧街' }
        ],
        tips: ['木府是必去景点', '狮子山可以俯瞰古城'],
        budget: '250-500元'
      },
      '3天2晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 丽江古城 → 四方街 → 木府' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（腊排骨）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 狮子山 → 万古楼' },
          { time: '18:00-21:00', evening: 'Day1: 古城夜景' },
          { time: '09:00-17:00', morning2: 'Day2: 玉龙雪山 → 蓝月谷' },
          { time: '09:00-17:00', morning2: 'Day3: 束河古镇 → 白沙古镇' }
        ],
        tips: ['玉龙雪山要提前预约索道', '注意高原反应'],
        budget: '1500-3000元'
      }
    }
  },
  '大理': {
    tags: ['苍山洱海', '白族文化', '风花雪月'],
    season: '3-5月、9-11月',
    atmosphere: '苍山洱海，白族风情，悠闲自在',
    days: '2-3天',
    routes: ['洱海环湖 → 双廊古镇', '苍山索道 → 天龙八部影视城', '大理古城 → 崇圣寺三塔'],
    foods: [
      { name: '大理酸辣鱼', desc: '大理特色美食', price: '40-60元/份', mustTry: true },
      { name: '乳扇', desc: '白族特色小吃', price: '10-15元/份' },
      { name: '喜洲粑粑', desc: '喜洲特色面食', price: '5-10元/份' },
      { name: '三道茶', desc: '白族特色茶饮', price: '20-30元/套' },
      { name: '生皮', desc: '白族特色菜品', price: '30-50元/份' }
    ],
    accommodations: [
      { area: '双廊古镇', pros: '洱海边，景色美', cons: '价格较高' },
      { area: '大理古城', pros: '交通便利，美食多', cons: '人流量大' },
      { area: '才村', pros: '安静，近洱海', cons: '设施稍简' }
    ],
    transport: [
      { type: '内部交通', info: '环洱海建议骑行或包车' },
      { type: '外部交通', info: '大理机场；大理站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '相机'],
      avoid: ['不要在古城内买银器', '环洱海注意安全', '双廊住宿提前订']
    },
    links: {
      official: 'https://www.dali.gov.cn/',
      attractions: [
        { name: '洱海', url: 'https://www.erhai.com/', mustVisit: true },
        { name: '崇圣寺三塔', url: 'https://www.santa.com/', mustVisit: true },
        { name: '双廊古镇', url: 'https://www.shuanglang.com/' }
      ],
      booking: [],
      food: [{ name: '大理美食', url: 'https://www.dianping.com/dali/food' }]
    },
    poster: {
      title: '风花雪月',
      subtitle: '苍山洱海，白族风情',
      elements: ['洱海', '苍山', '崇圣寺三塔', '双廊古镇'],
      layout: '顶部苍山，中央洱海，底部崇圣寺三塔',
      colors: ['#3498db', '#2ecc71', '#1abc9c', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '大理古城 → 崇圣寺三塔' },
          { time: '12:00-14:00', afternoon: '午餐（酸辣鱼）' },
          { time: '14:00-17:00', afternoon2: '洱海环湖 → 双廊' },
          { time: '18:00-21:00', evening: '古城夜景' }
        ],
        tips: ['崇圣寺三塔是地标', '洱海骑行很惬意'],
        budget: '250-500元'
      },
      '3天2晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 大理古城 → 崇圣寺三塔' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（酸辣鱼）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 洱海 → 双廊' },
          { time: '18:00-21:00', evening: 'Day1: 古城夜景' },
          { time: '09:00-17:00', morning2: 'Day2: 苍山索道 → 天龙八部影视城' },
          { time: '09:00-17:00', morning2: 'Day3: 喜洲古镇 → 周城' }
        ],
        tips: ['苍山索道很壮观', '喜洲粑粑要尝'],
        budget: '1200-2400元'
      }
    }
  },
  '桂林': {
    tags: ['山水甲天下', '漓江', '喀斯特地貌'],
    season: '4-10月',
    atmosphere: '山水如画，田园风光',
    days: '2-3天',
    routes: ['漓江竹筏漂流 → 兴坪古镇', '象鼻山 → 两江四湖', '阳朔西街 → 十里画廊'],
    foods: [
      { name: '桂林米粉', desc: '桂林最具代表性美食', price: '10-20元/份', mustTry: true },
      { name: '啤酒鱼', desc: '阳朔特色美食', price: '40-60元/份' },
      { name: '荔浦芋扣肉', desc: '桂林名菜', price: '50-80元/份' },
      { name: '马蹄糕', desc: '桂林特色小吃', price: '5-10元/份' },
      { name: '田螺酿', desc: '桂林特色菜品', price: '30-50元/份' }
    ],
    accommodations: [
      { area: '象鼻山周边', pros: '近景点，交通便利', cons: '价格较高' },
      { area: '阳朔西街', pros: '夜生活丰富', cons: '人流量大' },
      { area: '遇龙河周边', pros: '田园风光，环境好', cons: '离市区较远' }
    ],
    transport: [
      { type: '内部交通', info: '公交+打车，漓江游船' },
      { type: '外部交通', info: '两江国际机场；桂林站、桂林北站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '雨具', '舒适的鞋子', '相机'],
      avoid: ['漓江游船提前订票', '不要在景区买特产', '阳朔住宿提前订']
    },
    links: {
      official: 'https://www.guilin.gov.cn/',
      attractions: [
        { name: '漓江', url: 'https://www.lijiang.com/', mustVisit: true },
        { name: '象鼻山', url: 'https://www.elephant-trunk.com/', mustVisit: true },
        { name: '阳朔西街', url: 'https://www.yangshuo.com/' }
      ],
      booking: [],
      food: [{ name: '桂林美食', url: 'https://www.dianping.com/guilin/food' }]
    },
    poster: {
      title: '桂林山水',
      subtitle: '山水甲天下，漓江如画',
      elements: ['漓江', '象鼻山', '阳朔', '喀斯特山峰'],
      layout: '顶部喀斯特山峰，中央漓江竹筏，底部象鼻山',
      colors: ['#2ecc71', '#3498db', '#1abc9c', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '象鼻山 → 两江四湖' },
          { time: '12:00-14:00', afternoon: '午餐（桂林米粉）' },
          { time: '14:00-17:00', afternoon2: '七星公园 → 叠彩山' },
          { time: '18:00-21:00', evening: '东西巷 → 正阳步行街' }
        ],
        tips: ['象鼻山是桂林地标', '两江四湖夜景很美'],
        budget: '250-500元'
      },
      '3天2晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 象鼻山 → 两江四湖' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（桂林米粉）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 七星公园' },
          { time: '18:00-21:00', evening: 'Day1: 东西巷' },
          { time: '09:00-17:00', morning2: 'Day2: 漓江竹筏 → 兴坪古镇 → 阳朔' },
          { time: '09:00-17:00', morning2: 'Day3: 遇龙河漂流 → 十里画廊' }
        ],
        tips: ['漓江竹筏很惬意', '阳朔西街夜生活丰富'],
        budget: '1200-2400元'
      }
    }
  },
  '天津': {
    tags: ['津门故里', '近代历史', '美食之城'],
    season: '春秋两季',
    atmosphere: '中西合璧，近代历史名城',
    days: '2-3天',
    routes: ['五大道 → 民园体育场', '古文化街 → 天津之眼', '意式风情区 → 海河夜景'],
    foods: [
      { name: '狗不理包子', desc: '天津著名小吃', price: '30-50元/份', mustTry: true },
      { name: '十八街麻花', desc: '天津传统小吃', price: '20-30元/份' },
      { name: '耳朵眼炸糕', desc: '天津特色小吃', price: '10-15元/份' },
      { name: '煎饼果子', desc: '天津早餐代表', price: '10-15元/套' },
      { name: '锅巴菜', desc: '天津特色早餐', price: '10-15元/份' }
    ],
    accommodations: [
      { area: '五大道', pros: '历史建筑，环境好', cons: '价格较高' },
      { area: '天津站', pros: '交通便利', cons: '人流量大' },
      { area: '海河周边', pros: '夜景美', cons: '价格适中' }
    ],
    transport: [
      { type: '内部交通', info: '地铁覆盖全城，公交发达' },
      { type: '外部交通', info: '滨海国际机场；天津站、天津西站' }
    ],
    budget: { low: '700', medium: '1400', high: '2500+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['不要在景区买特产', '天津之眼提前订票']
    },
    links: {
      official: 'https://www.tj.gov.cn/',
      attractions: [
        { name: '天津之眼', url: 'https://www.tjeye.com/', mustVisit: true },
        { name: '五大道', url: 'https://www.wudadao.com/', mustVisit: true },
        { name: '古文化街', url: 'https://www.guwenhuajie.com/' }
      ],
      booking: [],
      food: [{ name: '天津美食', url: 'https://www.dianping.com/tianjin/food' }]
    },
    poster: {
      title: '津门印象',
      subtitle: '中西合璧，近代名城',
      elements: ['天津之眼', '五大道', '意式风情区', '海河'],
      layout: '顶部天津之眼，中央五大道，底部意式风情区',
      colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '五大道 → 民园体育场' },
          { time: '12:00-14:00', afternoon: '午餐（狗不理包子）' },
          { time: '14:00-17:00', afternoon2: '古文化街 → 天津之眼' },
          { time: '18:00-21:00', evening: '意式风情区 → 海河夜景' }
        ],
        tips: ['五大道适合拍照', '天津之眼夜景很美'],
        budget: '250-500元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 五大道 → 民园体育场' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（狗不理）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 古文化街 → 天津之眼' },
          { time: '18:00-21:00', evening: 'Day1: 意式风情区' },
          { time: '09:00-17:00', morning2: 'Day2: 盘山一日游' }
        ],
        tips: ['盘山是乾隆去过32次的地方', '煎饼果子要趁热吃'],
        budget: '500-1000元'
      }
    }
  },
  '大连': {
    tags: ['浪漫之都', '海滨城市', '足球城'],
    season: '5-10月',
    atmosphere: '海风习习，浪漫海滨',
    days: '2-3天',
    routes: ['星海广场 → 滨海路', '老虎滩海洋公园 → 傅家庄', '金石滩 → 发现王国'],
    foods: [
      { name: '海鲜', desc: '大连新鲜海鲜', price: '80-150元/人', mustTry: true },
      { name: '大连焖子', desc: '大连特色小吃', price: '10-15元/份' },
      { name: '烤冷面', desc: '大连夜市美食', price: '10-15元/份' },
      { name: '咸鱼饼子', desc: '大连特色小吃', price: '15-25元/份' },
      { name: '海胆水饺', desc: '大连特色水饺', price: '30-50元/份' }
    ],
    accommodations: [
      { area: '星海广场', pros: '近景点，海景好', cons: '价格较高' },
      { area: '中山广场', pros: '市中心，交通便利', cons: '人流量大' },
      { area: '金石滩', pros: '度假区，环境好', cons: '离市区较远' }
    ],
    transport: [
      { type: '内部交通', info: '有轨电车特色，公交+地铁' },
      { type: '外部交通', info: '周水子国际机场；大连站、大连北站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '泳衣'],
      avoid: ['不要在景区吃海鲜', '注意防晒', '滨海路注意安全']
    },
    links: {
      official: 'https://www.dl.gov.cn/',
      attractions: [
        { name: '星海广场', url: 'https://www.xinghai.com/', mustVisit: true },
        { name: '老虎滩', url: 'https://www.laohutan.com/', mustVisit: true },
        { name: '金石滩', url: 'https://www.jinshitan.com/' }
      ],
      booking: [],
      food: [{ name: '大连美食', url: 'https://www.dianping.com/dalian/food' }]
    },
    poster: {
      title: '浪漫大连',
      subtitle: '海滨城市，浪漫之都',
      elements: ['星海广场', '滨海路', '老虎滩', '有轨电车'],
      layout: '顶部星海广场，中央滨海路，底部老虎滩',
      colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '星海广场 → 滨海路' },
          { time: '12:00-14:00', afternoon: '午餐（海鲜）' },
          { time: '14:00-17:00', afternoon2: '老虎滩海洋公园' },
          { time: '18:00-21:00', evening: '傅家庄 → 星海公园' }
        ],
        tips: ['滨海路适合散步', '老虎滩海洋公园很大'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 星海广场 → 滨海路' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（海鲜）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 老虎滩' },
          { time: '18:00-21:00', evening: 'Day1: 傅家庄' },
          { time: '09:00-17:00', morning2: 'Day2: 金石滩 → 发现王国' }
        ],
        tips: ['金石滩地质奇观', '发现王国适合年轻人'],
        budget: '600-1200元'
      }
    }
  },
  '昆明': {
    tags: ['春城', '花都', '少数民族风情'],
    season: '全年适宜',
    atmosphere: '四季如春，鲜花盛开',
    days: '2-3天',
    routes: ['石林 → 彝族村', '滇池 → 西山', '翠湖公园 → 云南民族村'],
    foods: [
      { name: '过桥米线', desc: '昆明最具代表性美食', price: '30-50元/份', mustTry: true },
      { name: '汽锅鸡', desc: '云南名菜', price: '60-100元/份' },
      { name: '野生菌火锅', desc: '云南特色', price: '100-200元/人' },
      { name: '鲜花饼', desc: '云南特色糕点', price: '10-20元/盒' },
      { name: '烧饵块', desc: '昆明特色早餐', price: '5-10元/份' }
    ],
    accommodations: [
      { area: '翠湖周边', pros: '市中心，近景点', cons: '价格较高' },
      { area: '滇池周边', pros: '环境优美', cons: '离市区较远' },
      { area: '南屏街', pros: '购物方便', cons: '人流量大' }
    ],
    transport: [
      { type: '内部交通', info: '地铁+公交，石林有直通车' },
      { type: '外部交通', info: '长水国际机场；昆明站、昆明南站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '防晒霜', '舒适的鞋子', '雨具'],
      avoid: ['石林门票提前买', '野生菌要煮熟', '注意高原反应']
    },
    links: {
      official: 'https://www.km.gov.cn/',
      attractions: [
        { name: '石林', url: 'https://www.shilin.com/', mustVisit: true },
        { name: '滇池', url: 'https://www.dianchi.com/', mustVisit: true },
        { name: '云南民族村', url: 'https://www.ynmzc.com/' }
      ],
      booking: [],
      food: [{ name: '昆明美食', url: 'https://www.dianping.com/kunming/food' }]
    },
    poster: {
      title: '春城昆明',
      subtitle: '四季如春，花都昆明',
      elements: ['石林', '滇池', '翠湖', '鲜花'],
      layout: '顶部石林，中央滇池，底部翠湖',
      colors: ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '石林 → 彝族村' },
          { time: '12:00-14:00', afternoon: '午餐（过桥米线）' },
          { time: '14:00-17:00', afternoon2: '滇池 → 西山' },
          { time: '18:00-21:00', evening: '翠湖公园' }
        ],
        tips: ['石林需要一整天', '滇池冬天有海鸥'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 石林 → 彝族村' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（过桥米线）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 滇池 → 西山' },
          { time: '18:00-21:00', evening: 'Day1: 翠湖公园' },
          { time: '09:00-17:00', morning2: 'Day2: 云南民族村 → 金殿' }
        ],
        tips: ['石林奇观值得看', '民族村可以了解少数民族'],
        budget: '600-1200元'
      }
    }
  },
  '长沙': {
    tags: ['星城', '美食之都', '娱乐之都'],
    season: '春秋两季',
    atmosphere: '火辣的城市，娱乐之都',
    days: '2-3天',
    routes: ['岳麓山 → 岳麓书院 → 橘子洲', '湖南省博物馆 → 烈士公园', '太平老街 → 坡子街'],
    foods: [
      { name: '臭豆腐', desc: '长沙最具代表性小吃', price: '10-15元/份', mustTry: true },
      { name: '口味虾', desc: '长沙特色菜品', price: '60-100元/份' },
      { name: '糖油粑粑', desc: '长沙特色小吃', price: '10-15元/份' },
      { name: '剁椒鱼头', desc: '湘菜代表', price: '50-80元/份' },
      { name: '米粉', desc: '长沙特色早餐', price: '15-25元/碗' }
    ],
    accommodations: [
      { area: '五一广场', pros: '市中心，购物方便', cons: '人流量大' },
      { area: '岳麓山', pros: '环境好，近景点', cons: '价格适中' },
      { area: '湘江边', pros: '江景美', cons: '价格较高' }
    ],
    transport: [
      { type: '内部交通', info: '地铁覆盖主要区域，公交发达' },
      { type: '外部交通', info: '黄花国际机场；长沙站、长沙南站' }
    ],
    budget: { low: '700', medium: '1400', high: '2500+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['太平老街人多注意财物', '口味虾很辣量力而行']
    },
    links: {
      official: 'https://www.changsha.gov.cn/',
      attractions: [
        { name: '岳麓山', url: 'https://www.yuelushan.com/', mustVisit: true },
        { name: '橘子洲', url: 'https://www.juzizhou.com/', mustVisit: true },
        { name: '湖南省博物馆', url: 'https://www.hnmuseum.com/' }
      ],
      booking: [],
      food: [{ name: '长沙美食', url: 'https://www.dianping.com/changsha/food' }]
    },
    poster: {
      title: '星城长沙',
      subtitle: '美食之都，娱乐之都',
      elements: ['岳麓山', '橘子洲', '太平老街', '臭豆腐'],
      layout: '顶部橘子洲头，中央岳麓山，底部太平老街',
      colors: ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '岳麓山 → 岳麓书院' },
          { time: '12:00-14:00', afternoon: '午餐（口味虾）' },
          { time: '14:00-17:00', afternoon2: '橘子洲 → 太平老街' },
          { time: '18:00-21:00', evening: '坡子街 → 解放西路' }
        ],
        tips: ['岳麓书院文化底蕴深厚', '橘子洲头毛泽东青年艺术雕塑是地标'],
        budget: '250-500元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 岳麓山 → 岳麓书院' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（口味虾）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 橘子洲 → 太平老街' },
          { time: '18:00-21:00', evening: 'Day1: 坡子街' },
          { time: '09:00-17:00', morning2: 'Day2: 湖南省博物馆 → 烈士公园' }
        ],
        tips: ['省博物馆马王堆汉墓值得看', '臭豆腐要趁热吃'],
        budget: '500-1000元'
      }
    }
  },
  '哈尔滨': {
    tags: ['冰城', '东方莫斯科', '俄式风情'],
    season: '冬季最佳（12月-次年2月）',
    atmosphere: '冰雪世界，俄式建筑，欧陆风情',
    days: '2-3天',
    routes: ['中央大街 → 圣索菲亚教堂', '太阳岛 → 冰雪大世界', '防洪纪念塔 → 松花江'],
    foods: [
      { name: '马迭尔冰棍', desc: '哈尔滨标志性小吃', price: '5-10元/根', mustTry: true },
      { name: '锅包肉', desc: '东北名菜', price: '40-60元/份' },
      { name: '红肠', desc: '哈尔滨特色', price: '30-50元/份' },
      { name: '杀猪菜', desc: '东北特色', price: '60-100元/份' },
      { name: '格瓦斯', desc: '俄式饮品', price: '5-10元/瓶' }
    ],
    accommodations: [
      { area: '中央大街', pros: '近景点，俄式风情', cons: '价格较高' },
      { area: '防洪纪念塔', pros: '江边风景好', cons: '价格适中' },
      { area: '太阳岛', pros: '度假区，环境好', cons: '离市区较远' }
    ],
    transport: [
      { type: '内部交通', info: '地铁+公交，中央大街步行' },
      { type: '外部交通', info: '太平国际机场；哈尔滨站、哈尔滨西站' }
    ],
    budget: { low: '800', medium: '1600', high: '2800+' },
    tips: {
      prepare: ['身份证必带', '羽绒服', '防滑鞋', '暖宝宝'],
      avoid: ['冬季注意保暖', '中央大街石板路滑', '冰雪大世界门票提前买']
    },
    links: {
      official: 'https://www.harbin.gov.cn/',
      attractions: [
        { name: '冰雪大世界', url: 'https://www.bingxue.com/', mustVisit: true },
        { name: '圣索菲亚教堂', url: 'https://www.sofia.com/', mustVisit: true },
        { name: '中央大街', url: 'https://www.zongyangdajie.com/' }
      ],
      booking: [],
      food: [{ name: '哈尔滨美食', url: 'https://www.dianping.com/harbin/food' }]
    },
    poster: {
      title: '冰城哈尔滨',
      subtitle: '冰雪世界，俄式风情',
      elements: ['冰雪大世界', '圣索菲亚教堂', '中央大街', '松花江'],
      layout: '顶部圣索菲亚教堂，中央冰雪大世界，底部中央大街',
      colors: ['#3498db', '#ecf0f1', '#bdc3c7', '#f39c12', '#e74c3c']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '中央大街 → 圣索菲亚教堂' },
          { time: '12:00-14:00', afternoon: '午餐（锅包肉）' },
          { time: '14:00-17:00', afternoon2: '防洪纪念塔 → 松花江' },
          { time: '18:00-21:00', evening: '冰雪大世界' }
        ],
        tips: ['中央大街面包石路很有特色', '冰雪大世界晚上开灯最美'],
        budget: '300-600元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 中央大街 → 圣索菲亚教堂' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（锅包肉）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 防洪纪念塔 → 松花江' },
          { time: '18:00-21:00', evening: 'Day1: 冰雪大世界' },
          { time: '09:00-17:00', morning2: 'Day2: 太阳岛 → 东北虎林园' }
        ],
        tips: ['太阳岛雪博会很壮观', '虎林园可以看到东北虎'],
        budget: '600-1200元'
      }
    }
  },
  '郑州': {
    tags: ['中原腹地', '商都', '交通枢纽'],
    season: '春秋两季',
    atmosphere: '中原文化，历史名城',
    days: '2-3天',
    routes: ['少林寺 → 塔林', '河南博物院 → 二七广场', '黄河风景名胜区'],
    foods: [
      { name: '烩面', desc: '郑州最具代表性美食', price: '20-30元/份', mustTry: true },
      { name: '胡辣汤', desc: '河南特色早餐', price: '5-10元/份' },
      { name: '道口烧鸡', desc: '河南名吃', price: '30-50元/份' },
      { name: '开封灌汤包', desc: '河南特色点心', price: '20-30元/笼' },
      { name: '炒凉粉', desc: '河南特色小吃', price: '10-15元/份' }
    ],
    accommodations: [
      { area: '二七广场', pros: '市中心，交通便利', cons: '人流量大' },
      { area: '郑东新区', pros: '现代化，环境好', cons: '价格较高' },
      { area: '金水区', pros: '近景点，美食多', cons: '价格适中' }
    ],
    transport: [
      { type: '内部交通', info: '地铁+公交，覆盖全城' },
      { type: '外部交通', info: '新郑国际机场；郑州站、郑州东站' }
    ],
    budget: { low: '600', medium: '1200', high: '2000+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['少林寺门票提前买', '烩面街边小店更好吃']
    },
    links: {
      official: 'https://www.zz.gov.cn/',
      attractions: [
        { name: '少林寺', url: 'https://www.shaolin.org.cn/', mustVisit: true },
        { name: '河南博物院', url: 'https://www.chnmuseum.cn/', mustVisit: true },
        { name: '黄河风景名胜区', url: 'https://www.huanghe.com/' }
      ],
      booking: [],
      food: [{ name: '郑州美食', url: 'https://www.dianping.com/zhengzhou/food' }]
    },
    poster: {
      title: '中原郑州',
      subtitle: '中原腹地，商都郑州',
      elements: ['少林寺', '二七塔', '黄河', '商都遗址'],
      layout: '顶部二七塔，中央少林寺，底部黄河',
      colors: ['#e67e22', '#34495e', '#27ae60', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '少林寺 → 塔林' },
          { time: '12:00-14:00', afternoon: '午餐（烩面）' },
          { time: '14:00-17:00', afternoon2: '河南博物院 → 二七广场' },
          { time: '18:00-21:00', evening: '德化街' }
        ],
        tips: ['少林寺功夫表演精彩', '河南博物院文物丰富'],
        budget: '250-500元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 少林寺 → 塔林' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（烩面）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 河南博物院 → 二七广场' },
          { time: '18:00-21:00', evening: 'Day1: 德化街' },
          { time: '09:00-17:00', morning2: 'Day2: 黄河风景名胜区 → 炎黄二帝' }
        ],
        tips: ['少林寺要早去', '黄河边可以远眺'],
        budget: '500-1000元'
      }
    }
  },
  '济南': {
    tags: ['泉城', '历史文化名城', '山水城市'],
    season: '春秋两季',
    atmosphere: '泉水叮咚，山水相依',
    days: '2-3天',
    routes: ['趵突泉 → 大明湖 → 千佛山', '黑虎泉 → 解放阁', '曲水亭街 → 芙蓉街'],
    foods: [
      { name: '把子肉', desc: '济南特色菜品', price: '30-50元/份', mustTry: true },
      { name: '油旋', desc: '济南传统小吃', price: '5-10元/个' },
      { name: '甜沫', desc: '济南特色早餐', price: '5-10元/碗' },
      { name: '九转大肠', desc: '鲁菜经典', price: '50-80元/份' },
      { name: '奶汤蒲菜', desc: '济南名菜', price: '40-60元/份' }
    ],
    accommodations: [
      { area: '泉城广场', pros: '市中心，近景点', cons: '价格较高' },
      { area: '大明湖', pros: '环境优美', cons: '价格适中' },
      { area: '千佛山', pros: '近景点', cons: '离市区稍远' }
    ],
    transport: [
      { type: '内部交通', info: '公交+打车，景点集中' },
      { type: '外部交通', info: '遥墙国际机场；济南站、济南西站' }
    ],
    budget: { low: '600', medium: '1200', high: '2000+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['趵突泉门票提前买', '芙蓉街小吃注意卫生']
    },
    links: {
      official: 'https://www.jinan.gov.cn/',
      attractions: [
        { name: '趵突泉', url: 'https://www.baotuquan.com/', mustVisit: true },
        { name: '大明湖', url: 'https://www.daminghu.com/', mustVisit: true },
        { name: '千佛山', url: 'https://www.qianfoshan.com/' }
      ],
      booking: [],
      food: [{ name: '济南美食', url: 'https://www.dianping.com/jinan/food' }]
    },
    poster: {
      title: '泉城济南',
      subtitle: '泉水叮咚，山水相依',
      elements: ['趵突泉', '大明湖', '千佛山', '黑虎泉'],
      layout: '顶部趵突泉，中央大明湖，底部千佛山',
      colors: ['#2ecc71', '#3498db', '#1abc9c', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '趵突泉 → 大明湖' },
          { time: '12:00-14:00', afternoon: '午餐（把子肉）' },
          { time: '14:00-17:00', afternoon2: '千佛山 → 黑虎泉' },
          { time: '18:00-21:00', evening: '芙蓉街 → 曲水亭街' }
        ],
        tips: ['趵突泉是济南地标', '大明湖免费开放'],
        budget: '200-400元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 趵突泉 → 大明湖' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（把子肉）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 千佛山 → 黑虎泉' },
          { time: '18:00-21:00', evening: 'Day1: 芙蓉街' },
          { time: '09:00-17:00', morning2: 'Day2: 灵岩寺 → 五峰山' }
        ],
        tips: ['灵岩寺是四大名刹之一', '曲水亭街很有韵味'],
        budget: '400-800元'
      }
    }
  },
  '福州': {
    tags: ['有福之州', '海滨城市', '闽都文化'],
    season: '全年适宜',
    atmosphere: '闽都文化，海滨城市',
    days: '2-3天',
    routes: ['三坊七巷 → 林则徐纪念馆', '鼓山 → 涌泉寺', '平潭岛一日游'],
    foods: [
      { name: '佛跳墙', desc: '闽菜之王', price: '100-200元/份', mustTry: true },
      { name: '鱼丸', desc: '福州特色小吃', price: '15-25元/份' },
      { name: '肉燕', desc: '福州特色小吃', price: '15-25元/份' },
      { name: '荔枝肉', desc: '福州名菜', price: '40-60元/份' },
      { name: '锅边糊', desc: '福州特色早餐', price: '10-15元/份' }
    ],
    accommodations: [
      { area: '三坊七巷', pros: '近景点，文化氛围', cons: '价格较高' },
      { area: '东街口', pros: '市中心，购物方便', cons: '人流量大' },
      { area: '鼓山', pros: '环境好，近景点', cons: '离市区较远' }
    ],
    transport: [
      { type: '内部交通', info: '地铁+公交，覆盖全城' },
      { type: '外部交通', info: '长乐国际机场；福州站、福州南站' }
    ],
    budget: { low: '700', medium: '1400', high: '2500+' },
    tips: {
      prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
      avoid: ['三坊七巷门票提前买', '佛跳墙价格较高量力而行']
    },
    links: {
      official: 'https://www.fuzhou.gov.cn/',
      attractions: [
        { name: '三坊七巷', url: 'https://www.sanfangqixiang.com/', mustVisit: true },
        { name: '鼓山', url: 'https://www.gushan.com/', mustVisit: true },
        { name: '林则徐纪念馆', url: 'https://www.lzx.com/' }
      ],
      booking: [],
      food: [{ name: '福州美食', url: 'https://www.dianping.com/fuzhou/food' }]
    },
    poster: {
      title: '有福福州',
      subtitle: '闽都文化，有福之州',
      elements: ['三坊七巷', '鼓山', '林则徐纪念馆', '平潭岛'],
      layout: '顶部三坊七巷，中央鼓山，底部林则徐纪念馆',
      colors: ['#2ecc71', '#3498db', '#1abc9c', '#f39c12', '#9b59b6']
    },
    itineraries: {
      '1天': {
        routes: [
          { time: '09:00-12:00', morning: '三坊七巷 → 林则徐纪念馆' },
          { time: '12:00-14:00', afternoon: '午餐（佛跳墙/鱼丸）' },
          { time: '14:00-17:00', afternoon2: '鼓山 → 涌泉寺' },
          { time: '18:00-21:00', evening: '上下杭历史文化街区' }
        ],
        tips: ['三坊七巷是福州名片', '鼓山可以俯瞰福州'],
        budget: '250-500元'
      },
      '2天1晚': {
        routes: [
          { time: '09:00-12:00', morning: 'Day1: 三坊七巷 → 林则徐纪念馆' },
          { time: '12:00-14:00', afternoon: 'Day1: 午餐（鱼丸）' },
          { time: '14:00-17:00', afternoon2: 'Day1: 鼓山 → 涌泉寺' },
          { time: '18:00-21:00', evening: 'Day1: 上下杭' },
          { time: '09:00-17:00', morning2: 'Day2: 平潭岛一日游' }
        ],
        tips: ['平潭岛蓝眼泪季节最美', '鱼丸要趁热吃'],
        budget: '500-1000元'
      }
    }
  }
};
