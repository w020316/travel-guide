// 修复后的app.js文件

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
            booking: [
                { name: '迪士尼门票', url: 'https://www.shanghaidisneyresort.com/tickets/' }
            ],
            food: [
                { name: '上海美食', url: 'https://www.dianping.com/shanghai/food' }
            ]
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
    '广州': {
        tags: ['花城', '美食之都', '历史文化名城'],
        season: '秋季',
        atmosphere: '开放包容，岭南文化浓厚',
        days: '3-4天',
        routes: ['广州塔 → 珠江夜游', '陈家祠 → 上下九 → 沙面', '白云山 → 云台花园', '黄埔古港 → 琶洲'],
        foods: [
            { name: '早茶', desc: '广州特色，种类丰富', price: '50-100元/人', mustTry: true },
            { name: '烧鹅', desc: '广州传统名菜', price: '60-100元/份' },
            { name: '肠粉', desc: '广州特色小吃', price: '10-20元/份' },
            { name: '煲仔饭', desc: '广州传统美食', price: '20-30元/份' },
            { name: '双皮奶', desc: '广州传统甜品', price: '10-15元/份' }
        ],
        accommodations: [
            { area: '天河区', pros: '商业中心，交通便利', cons: '价格较高，人流量大' },
            { area: '越秀区', pros: '历史文化区，景点集中', cons: '交通拥堵，老城区环境' },
            { area: '海珠区', pros: '珠江边，环境优美', cons: '部分区域交通不便' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '白云国际机场；广州站、广州南站、广州东站等多个火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.gz.gov.cn/',
            attractions: [
                { name: '广州塔', url: 'https://www.cantontower.com/', mustVisit: true },
                { name: '陈家祠', url: 'https://www.chens.com.cn/', mustVisit: true },
                { name: '白云山', url: 'https://www.baiyunshan.com.cn/' }
            ],
            booking: [
                { name: '广州塔门票', url: 'https://www.cantontower.com/tickets/' }
            ],
            food: [
                { name: '广州美食', url: 'https://www.dianping.com/guangzhou/food' }
            ]
        },
        poster: {
            title: '花城广州',
            subtitle: '食在广州，味在岭南',
            elements: ['广州塔', '陈家祠', '白云山', '珠江'],
            layout: '顶部广州塔，中央珠江，底部陈家祠',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '陈家祠 → 上下九' },
                    { time: '12:00-14:00', afternoon: '午餐（早茶）' },
                    { time: '14:00-17:00', afternoon2: '沙面 → 广州塔' },
                    { time: '18:00-21:00', evening: '珠江夜游' }
                ],
                tips: ['早茶建议早去', '珠江夜游建议提前预订'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 陈家祠 → 上下九' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（早茶）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 沙面 → 广州塔' },
                    { time: '18:00-21:00', evening: 'Day1: 珠江夜游' },
                    { time: '09:00-17:00', morning2: 'Day2: 白云山 → 云台花园' }
                ],
                tips: ['白云山需要一整天时间', '建议穿舒适的鞋子'],
                budget: '600-1200元'
            }
        }
    },
    '深圳': {
        tags: ['现代化城市', '科技之都', '海滨城市'],
        season: '春秋两季',
        atmosphere: '年轻活力，创新包容',
        days: '3-4天',
        routes: ['世界之窗 → 锦绣中华', '东部华侨城 → 大梅沙', '莲花山 → 市民中心', '深圳湾公园 → 欢乐海岸'],
        foods: [
            { name: '烧腊', desc: '深圳特色美食', price: '30-50元/份', mustTry: true },
            { name: '海鲜', desc: '深圳海滨特色', price: '80-150元/人' },
            { name: '早茶', desc: '广式早茶', price: '50-100元/人' },
            { name: '肠粉', desc: '深圳特色小吃', price: '10-20元/份' },
            { name: '椰子鸡', desc: '深圳特色火锅', price: '80-120元/人' }
        ],
        accommodations: [
            { area: '福田区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '南山区', pros: '科技园区，环境优美', cons: '价格较高，商业氛围浓' },
            { area: '盐田区', pros: '海滨区域，环境优美', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '宝安国际机场；深圳站、深圳北站、深圳东站等多个火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.sz.gov.cn/',
            attractions: [
                { name: '世界之窗', url: 'https://www.szwwco.com/', mustVisit: true },
                { name: '东部华侨城', url: 'https://www.octeast.com/', mustVisit: true },
                { name: '莲花山', url: 'https://www.sz-stadium.com/lianhua/' }
            ],
            booking: [
                { name: '世界之窗门票', url: 'https://www.szwwco.com/tickets/' }
            ],
            food: [
                { name: '深圳美食', url: 'https://www.dianping.com/shenzhen/food' }
            ]
        },
        poster: {
            title: '创新之城',
            subtitle: '科技与自然的完美融合',
            elements: ['世界之窗', '东部华侨城', '深圳湾', '莲花山'],
            layout: '顶部世界之窗，中央深圳湾，底部莲花山',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '世界之窗' },
                    { time: '12:00-14:00', afternoon: '午餐（烧腊）' },
                    { time: '14:00-17:00', afternoon2: '锦绣中华' },
                    { time: '18:00-21:00', evening: '深圳湾公园 → 欢乐海岸' }
                ],
                tips: ['世界之窗需要大半天时间', '欢乐海岸夜景很美'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 世界之窗 → 锦绣中华' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（烧腊）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 莲花山 → 市民中心' },
                    { time: '18:00-21:00', evening: 'Day1: 深圳湾公园 → 欢乐海岸' },
                    { time: '09:00-17:00', morning2: 'Day2: 东部华侨城 → 大梅沙' }
                ],
                tips: ['东部华侨城需要一整天时间', '建议带泳衣去大梅沙'],
                budget: '800-1500元'
            }
        }
    },
    '成都': {
        tags: ['休闲之都', '美食天堂', '熊猫之乡'],
        season: '春秋两季',
        atmosphere: '悠闲自在，烟火气息浓厚',
        days: '3-4天',
        routes: ['大熊猫基地 → 宽窄巷子', '武侯祠 → 锦里', '都江堰一日游', '青羊宫 → 杜甫草堂'],
        foods: [
            { name: '火锅', desc: '成都特色，麻辣鲜香', price: '80-150元/人', mustTry: true },
            { name: '串串香', desc: '成都特色小吃', price: '50-100元/人' },
            { name: '担担面', desc: '成都传统面食', price: '15-25元/碗' },
            { name: '龙抄手', desc: '成都传统小吃', price: '15-25元/份' },
            { name: '三大炮', desc: '成都传统小吃', price: '15-25元/份' }
        ],
        accommodations: [
            { area: '锦江区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '青羊区', pros: '文化区，环境优美', cons: '交通拥堵，老城区环境' },
            { area: '武侯区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '双流国际机场；成都站、成都东站、成都南站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '肠胃药'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.chengdu.gov.cn/',
            attractions: [
                { name: '大熊猫基地', url: 'https://www.panda.org.cn/', mustVisit: true },
                { name: '武侯祠', url: 'https://www.wuhouci.net.cn/', mustVisit: true },
                { name: '都江堰', url: 'https://www.dujiangyan.gov.cn/' }
            ],
            booking: [
                { name: '大熊猫基地门票', url: 'https://www.panda.org.cn/tickets/' }
            ],
            food: [
                { name: '成都美食', url: 'https://www.dianping.com/chengdu/food' }
            ]
        },
        poster: {
            title: '天府之国',
            subtitle: '休闲成都，美食之都',
            elements: ['大熊猫', '火锅', '武侯祠', '都江堰'],
            layout: '顶部大熊猫，中央火锅，底部武侯祠',
            colors: ['#27ae60', '#e74c3c', '#f39c12', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '大熊猫基地' },
                    { time: '12:00-14:00', afternoon: '午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: '宽窄巷子 → 青羊宫' },
                    { time: '18:00-21:00', evening: '锦里 → 武侯祠' }
                ],
                tips: ['大熊猫基地建议早去', '锦里夜景很美'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 大熊猫基地' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 宽窄巷子 → 青羊宫' },
                    { time: '18:00-21:00', evening: 'Day1: 锦里 → 武侯祠' },
                    { time: '09:00-17:00', morning2: 'Day2: 都江堰一日游' }
                ],
                tips: ['都江堰需要一整天时间', '建议跟团或自驾'],
                budget: '600-1200元'
            }
        }
    },
    '杭州': {
        tags: ['人间天堂', '西湖风光', '历史文化名城'],
        season: '春季',
        atmosphere: '温婉秀丽，江南水乡韵味',
        days: '3-4天',
        routes: ['西湖 → 断桥 → 雷峰塔', '灵隐寺 → 飞来峰', '西溪湿地一日游', '宋城 → 六和塔'],
        foods: [
            { name: '西湖醋鱼', desc: '杭州特色名菜', price: '60-100元/份', mustTry: true },
            { name: '龙井虾仁', desc: '杭州特色菜品', price: '80-120元/份' },
            { name: '叫花鸡', desc: '杭州传统名菜', price: '50-80元/份' },
            { name: '东坡肉', desc: '杭州传统名菜', price: '40-60元/份' },
            { name: '杭州小笼包', desc: '杭州特色点心', price: '20-30元/笼' }
        ],
        accommodations: [
            { area: '西湖区', pros: '靠近西湖，风景优美', cons: '价格较高，人流量大' },
            { area: '上城区', pros: '市中心，交通便利', cons: '价格较高，车流量大' },
            { area: '余杭区', pros: '价格实惠，环境安静', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '萧山国际机场；杭州站、杭州东站、杭州南站等多个火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.hangzhou.gov.cn/',
            attractions: [
                { name: '西湖', url: 'https://www.westlake-china.com/', mustVisit: true },
                { name: '灵隐寺', url: 'https://www.lingyinsi.org/', mustVisit: true },
                { name: '西溪湿地', url: 'https://www.xixiwetland.com/' }
            ],
            booking: [
                { name: '灵隐寺门票', url: 'https://www.lingyinsi.org/tickets/' }
            ],
            food: [
                { name: '杭州美食', url: 'https://www.dianping.com/hangzhou/food' }
            ]
        },
        poster: {
            title: '人间天堂',
            subtitle: '西湖风光，江南韵味',
            elements: ['西湖', '断桥', '雷峰塔', '灵隐寺'],
            layout: '顶部西湖，中央断桥，底部雷峰塔',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '西湖 → 断桥' },
                    { time: '12:00-14:00', afternoon: '午餐（西湖醋鱼）' },
                    { time: '14:00-17:00', afternoon2: '雷峰塔 → 灵隐寺' },
                    { time: '18:00-21:00', evening: '宋城' }
                ],
                tips: ['西湖建议租自行车', '宋城演出值得一看'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 西湖 → 断桥' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（西湖醋鱼）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 雷峰塔 → 灵隐寺' },
                    { time: '18:00-21:00', evening: 'Day1: 宋城' },
                    { time: '09:00-17:00', morning2: 'Day2: 西溪湿地一日游' }
                ],
                tips: ['西溪湿地需要一整天时间', '建议坐船游览'],
                budget: '700-1400元'
            }
        }
    },
    '西安': {
        tags: ['古都', '历史文化名城', '兵马俑'],
        season: '春秋两季',
        atmosphere: '历史厚重，文化底蕴深厚',
        days: '3-4天',
        routes: ['兵马俑 → 华清池', '大雁塔 → 大唐芙蓉园', '明城墙 → 钟鼓楼', '陕西历史博物馆 → 小雁塔'],
        foods: [
            { name: '肉夹馍', desc: '西安特色美食', price: '15-25元/个', mustTry: true },
            { name: '凉皮', desc: '西安传统小吃', price: '10-15元/份' },
            { name: '羊肉泡馍', desc: '西安传统美食', price: '30-50元/碗' },
            { name: '臊子面', desc: '西安特色面食', price: '15-25元/碗' },
            { name: '油泼面', desc: '西安特色面食', price: '15-25元/碗' }
        ],
        accommodations: [
            { area: '碑林区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '雁塔区', pros: '靠近大雁塔，环境优美', cons: '价格较高，车流量大' },
            { area: '未央区', pros: '价格实惠，交通便利', cons: '距离市中心较远' }
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
            official: 'https://www.xian.gov.cn/',
            attractions: [
                { name: '兵马俑', url: 'https://www.bmy.com.cn/', mustVisit: true },
                { name: '大雁塔', url: 'https://www.dayanta.org/', mustVisit: true },
                { name: '明城墙', url: 'https://www.xiancitywall.com/' }
            ],
            booking: [
                { name: '兵马俑门票', url: 'https://www.bmy.com.cn/tickets/' }
            ],
            food: [
                { name: '西安美食', url: 'https://www.dianping.com/xian/food' }
            ]
        },
        poster: {
            title: '古都西安',
            subtitle: '穿越千年，梦回长安',
            elements: ['兵马俑', '大雁塔', '明城墙', '钟鼓楼'],
            layout: '顶部兵马俑，中央大雁塔，底部明城墙',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '兵马俑' },
                    { time: '12:00-14:00', afternoon: '午餐（肉夹馍）' },
                    { time: '14:00-17:00', afternoon2: '华清池 → 大雁塔' },
                    { time: '18:00-21:00', evening: '大唐芙蓉园' }
                ],
                tips: ['兵马俑需要大半天时间', '大唐芙蓉园夜景很美'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 兵马俑 → 华清池' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（肉夹馍）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 大雁塔 → 大唐芙蓉园' },
                    { time: '18:00-21:00', evening: 'Day1: 钟鼓楼 → 回民街' },
                    { time: '09:00-17:00', morning2: 'Day2: 明城墙 → 陕西历史博物馆 → 小雁塔' }
                ],
                tips: ['陕西历史博物馆需要提前预约', '明城墙建议骑自行车'],
                budget: '600-1200元'
            }
        }
    },
    '重庆': {
        tags: ['山城', '火锅之都', '雾都'],
        season: '春秋两季',
        atmosphere: '热情豪爽，山城特色浓郁',
        days: '3-4天',
        routes: ['解放碑 → 洪崖洞 → 千厮门大桥', '长江索道 → 南山一棵树', '磁器口古镇 → 渣滓洞', '武隆天坑一日游'],
        foods: [
            { name: '火锅', desc: '重庆特色，麻辣鲜香', price: '80-150元/人', mustTry: true },
            { name: '小面', desc: '重庆特色面食', price: '10-15元/碗' },
            { name: '酸辣粉', desc: '重庆传统小吃', price: '10-15元/份' },
            { name: '抄手', desc: '重庆传统小吃', price: '15-25元/份' },
            { name: '烤鱼', desc: '重庆特色美食', price: '60-100元/份' }
        ],
        accommodations: [
            { area: '渝中区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '江北区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '南岸区', pros: '环境优美，视野开阔', cons: '部分区域交通不便' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行，注意山城地形' },
            { type: '外部交通', info: '江北国际机场；重庆站、重庆北站、重庆西站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.cq.gov.cn/',
            attractions: [
                { name: '洪崖洞', url: 'https://www.hongyadong.com/', mustVisit: true },
                { name: '长江索道', url: 'https://www.cq-cableway.com/', mustVisit: true },
                { name: '磁器口', url: 'https://www.cqciqikou.com/' }
            ],
            booking: [
                { name: '长江索道门票', url: 'https://www.cq-cableway.com/tickets/' }
            ],
            food: [
                { name: '重庆美食', url: 'https://www.dianping.com/chongqing/food' }
            ]
        },
        poster: {
            title: '山城重庆',
            subtitle: '火锅之都，雾都魅力',
            elements: ['洪崖洞', '长江索道', '解放碑', '火锅'],
            layout: '顶部洪崖洞，中央长江索道，底部火锅',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '解放碑 → 洪崖洞' },
                    { time: '12:00-14:00', afternoon: '午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: '长江索道 → 南山一棵树' },
                    { time: '18:00-21:00', evening: '千厮门大桥夜景' }
                ],
                tips: ['洪崖洞夜景很美', '长江索道建议避开高峰期'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 解放碑 → 洪崖洞' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 长江索道 → 南山一棵树' },
                    { time: '18:00-21:00', evening: 'Day1: 千厮门大桥夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 磁器口古镇 → 渣滓洞 → 武隆天坑' }
                ],
                tips: ['武隆天坑需要一整天时间', '建议跟团或自驾'],
                budget: '600-1200元'
            }
        }
    },
    '南京': {
        tags: ['古都', '历史文化名城', '六朝古都'],
        season: '春季',
        atmosphere: '历史厚重，文化底蕴深厚',
        days: '2-3天',
        routes: ['中山陵 → 明孝陵', '夫子庙 → 秦淮河', '总统府 → 玄武湖', '雨花台 → 南京博物院'],
        foods: [
            { name: '盐水鸭', desc: '南京特色美食', price: '40-60元/份', mustTry: true },
            { name: '鸭血粉丝汤', desc: '南京传统小吃', price: '15-25元/碗' },
            { name: '南京小笼包', desc: '南京特色点心', price: '20-30元/笼' },
            { name: '桂花糖芋苗', desc: '南京传统甜品', price: '10-15元/份' },
            { name: '鸡汁汤包', desc: '南京特色点心', price: '20-30元/份' }
        ],
        accommodations: [
            { area: '玄武区', pros: '靠近中山陵，环境优美', cons: '价格较高，人流量大' },
            { area: '秦淮区', pros: '靠近夫子庙，景点集中', cons: '价格较高，车流量大' },
            { area: '鼓楼区', pros: '市中心，交通便利', cons: '价格较高，人流量大' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '禄口国际机场；南京站、南京南站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.nanjing.gov.cn/',
            attractions: [
                { name: '中山陵', url: 'https://www.zsling.cn/', mustVisit: true },
                { name: '夫子庙', url: 'https://www.fuzimiao.com/', mustVisit: true },
                { name: '总统府', url: 'https://www.president府.gov.cn/' }
            ],
            booking: [
                { name: '中山陵门票', url: 'https://www.zsling.cn/tickets/' }
            ],
            food: [
                { name: '南京美食', url: 'https://www.dianping.com/nanjing/food' }
            ]
        },
        poster: {
            title: '六朝古都',
            subtitle: '历史南京，文化名城',
            elements: ['中山陵', '夫子庙', '秦淮河', '总统府'],
            layout: '顶部中山陵，中央秦淮河，底部夫子庙',
            colors: ['#27ae60', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '中山陵 → 明孝陵' },
                    { time: '12:00-14:00', afternoon: '午餐（盐水鸭）' },
                    { time: '14:00-17:00', afternoon2: '总统府 → 玄武湖' },
                    { time: '18:00-21:00', evening: '夫子庙 → 秦淮河' }
                ],
                tips: ['中山陵需要大半天时间', '秦淮河夜景很美'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 中山陵 → 明孝陵' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（盐水鸭）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 总统府 → 玄武湖' },
                    { time: '18:00-21:00', evening: 'Day1: 夫子庙 → 秦淮河' },
                    { time: '09:00-17:00', morning2: 'Day2: 雨花台 → 南京博物院 → 莫愁湖' }
                ],
                tips: ['南京博物院需要提前预约', '雨花台建议早去'],
                budget: '500-1000元'
            }
        }
    },
    '武汉': {
        tags: ['江城', '历史文化名城', '黄鹤楼'],
        season: '春季',
        atmosphere: '热情豪爽，江城特色浓郁',
        days: '2-3天',
        routes: ['黄鹤楼 → 长江大桥', '东湖 → 武汉大学', '户部巷 → 昙华林', '归元寺 → 古琴台'],
        foods: [
            { name: '热干面', desc: '武汉特色面食', price: '10-15元/碗', mustTry: true },
            { name: '鸭脖', desc: '武汉特色小吃', price: '20-30元/份' },
            { name: '三鲜豆皮', desc: '武汉传统小吃', price: '15-25元/份' },
            { name: '面窝', desc: '武汉传统小吃', price: '3-5元/个' },
            { name: '排骨藕汤', desc: '武汉特色汤品', price: '30-50元/份' }
        ],
        accommodations: [
            { area: '武昌区', pros: '靠近黄鹤楼，景点集中', cons: '价格较高，人流量大' },
            { area: '江汉区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '汉阳区', pros: '价格实惠，环境安静', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '天河国际机场；武汉站、汉口站、武昌站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.wuhan.gov.cn/',
            attractions: [
                { name: '黄鹤楼', url: 'https://www.cnhhl.com/', mustVisit: true },
                { name: '东湖', url: 'https://www.donghu.com.cn/', mustVisit: true },
                { name: '武汉大学', url: 'https://www.whu.edu.cn/' }
            ],
            booking: [
                { name: '黄鹤楼门票', url: 'https://www.cnhhl.com/tickets/' }
            ],
            food: [
                { name: '武汉美食', url: 'https://www.dianping.com/wuhan/food' }
            ]
        },
        poster: {
            title: '江城武汉',
            subtitle: '黄鹤楼上，长江之滨',
            elements: ['黄鹤楼', '长江大桥', '东湖', '武汉大学'],
            layout: '顶部黄鹤楼，中央长江大桥，底部东湖',
            colors: ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '黄鹤楼 → 长江大桥' },
                    { time: '12:00-14:00', afternoon: '午餐（热干面）' },
                    { time: '14:00-17:00', afternoon2: '东湖 → 武汉大学' },
                    { time: '18:00-21:00', evening: '户部巷 → 昙华林' }
                ],
                tips: ['黄鹤楼需要半天时间', '户部巷是美食街'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 黄鹤楼 → 长江大桥' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（热干面）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 东湖 → 武汉大学' },
                    { time: '18:00-21:00', evening: 'Day1: 户部巷 → 昙华林' },
                    { time: '09:00-17:00', morning2: 'Day2: 归元寺 → 古琴台 → 汉口江滩' }
                ],
                tips: ['归元寺香火旺盛', '汉口江滩夜景很美'],
                budget: '500-1000元'
            }
        }
    },
    '天津': {
        tags: ['直辖市', '历史文化名城', '滨海城市'],
        season: '春秋两季',
        atmosphere: '中西合璧，近代历史韵味',
        days: '2-3天',
        routes: ['天津之眼 → 古文化街', '五大道 → 意式风情街', '海河夜游', '滨海新区一日游'],
        foods: [
            { name: '狗不理包子', desc: '天津特色美食', price: '30-50元/笼', mustTry: true },
            { name: '天津麻花', desc: '天津传统小吃', price: '20-40元/份' },
            { name: '煎饼果子', desc: '天津特色早餐', price: '8-15元/份' },
            { name: '锅巴菜', desc: '天津传统小吃', price: '10-15元/份' },
            { name: '耳朵眼炸糕', desc: '天津传统小吃', price: '5-10元/个' }
        ],
        accommodations: [
            { area: '和平区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '河西区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '滨海新区', pros: '环境优美，视野开阔', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '滨海国际机场；天津站、天津西站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.tj.gov.cn/',
            attractions: [
                { name: '天津之眼', url: 'https://www.tianjin-eye.com/', mustVisit: true },
                { name: '古文化街', url: 'https://www.guwenhuajie.com/', mustVisit: true },
                { name: '五大道', url: 'https://www.wudadao.com/' }
            ],
            booking: [
                { name: '天津之眼门票', url: 'https://www.tianjin-eye.com/tickets/' }
            ],
            food: [
                { name: '天津美食', url: 'https://www.dianping.com/tianjin/food' }
            ]
        },
        poster: {
            title: '津门故里',
            subtitle: '中西合璧，海河之滨',
            elements: ['天津之眼', '古文化街', '五大道', '海河'],
            layout: '顶部天津之眼，中央海河，底部五大道',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '天津之眼 → 古文化街' },
                    { time: '12:00-14:00', afternoon: '午餐（狗不理包子）' },
                    { time: '14:00-17:00', afternoon2: '五大道 → 意式风情街' },
                    { time: '18:00-21:00', evening: '海河夜游' }
                ],
                tips: ['天津之眼需要提前预约', '海河夜景很美'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 天津之眼 → 古文化街' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（狗不理包子）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 五大道 → 意式风情街' },
                    { time: '18:00-21:00', evening: 'Day1: 海河夜游' },
                    { time: '09:00-17:00', morning2: 'Day2: 滨海新区 → 大沽口炮台' }
                ],
                tips: ['滨海新区需要一整天时间', '建议自驾或乘坐轻轨'],
                budget: '500-1000元'
            }
        }
    },
    '苏州': {
        tags: ['园林城市', '历史文化名城', '江南水乡'],
        season: '春季',
        atmosphere: '温婉秀丽，江南水乡韵味',
        days: '2-3天',
        routes: ['拙政园 → 狮子林', '留园 → 寒山寺', '周庄古镇一日游', '平江路 → 观前街'],
        foods: [
            { name: '松鼠桂鱼', desc: '苏州特色名菜', price: '80-120元/份', mustTry: true },
            { name: '苏州评弹', desc: '苏州传统表演', price: '50-100元/人' },
            { name: '苏式汤面', desc: '苏州特色面食', price: '15-25元/碗' },
            { name: '青团', desc: '苏州传统点心', price: '5-10元/个' },
            { name: '碧螺春茶', desc: '苏州特产茶叶', price: '100-300元/斤' }
        ],
        accommodations: [
            { area: '姑苏区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '工业园区', pros: '现代化，环境优美', cons: '价格较高，距离老城区较远' },
            { area: '吴中区', pros: '价格实惠，环境安静', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '苏南硕放国际机场；苏州站、苏州北站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.suzhou.gov.cn/',
            attractions: [
                { name: '拙政园', url: 'https://www.zhuozheng-yuan.com/', mustVisit: true },
                { name: '周庄', url: 'https://www.zhouzhuang.com/', mustVisit: true },
                { name: '寒山寺', url: 'https://www.hanshansi.com/' }
            ],
            booking: [
                { name: '拙政园门票', url: 'https://www.zhuozheng-yuan.com/tickets/' }
            ],
            food: [
                { name: '苏州美食', url: 'https://www.dianping.com/suzhou/food' }
            ]
        },
        poster: {
            title: '园林之城',
            subtitle: '江南水乡，园林甲天下',
            elements: ['拙政园', '周庄', '平江路', '寒山寺'],
            layout: '顶部拙政园，中央周庄，底部平江路',
            colors: ['#27ae60', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '拙政园 → 狮子林' },
                    { time: '12:00-14:00', afternoon: '午餐（松鼠桂鱼）' },
                    { time: '14:00-17:00', afternoon2: '留园 → 寒山寺' },
                    { time: '18:00-21:00', evening: '平江路 → 观前街' }
                ],
                tips: ['拙政园需要半天时间', '平江路夜景很美'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 拙政园 → 狮子林' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（松鼠桂鱼）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 留园 → 寒山寺' },
                    { time: '18:00-21:00', evening: 'Day1: 平江路 → 观前街' },
                    { time: '09:00-17:00', morning2: 'Day2: 周庄古镇一日游' }
                ],
                tips: ['周庄需要一整天时间', '建议早去避开人流'],
                budget: '600-1200元'
            }
        }
    },
    '厦门': {
        tags: ['海滨城市', '海岛风光', '文艺小清新'],
        season: '春秋两季',
        atmosphere: '文艺小清新，海滨风情',
        days: '2-3天',
        routes: ['鼓浪屿一日游', '曾厝垵 → 环岛路', '厦门大学 → 南普陀寺', '沙坡尾 → 中山路'],
        foods: [
            { name: '沙茶面', desc: '厦门特色美食', price: '20-30元/碗', mustTry: true },
            { name: '烧肉粽', desc: '厦门传统小吃', price: '15-25元/个' },
            { name: '土笋冻', desc: '厦门特色小吃', price: '10-20元/份' },
            { name: '海蛎煎', desc: '厦门特色美食', price: '20-30元/份' },
            { name: '花生汤', desc: '厦门传统甜品', price: '8-15元/碗' }
        ],
        accommodations: [
            { area: '思明区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '湖里区', pros: '交通便利，价格实惠', cons: '距离景点较远' },
            { area: '鼓浪屿', pros: '环境优美，文艺氛围', cons: '价格昂贵，交通不便' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '高崎国际机场；厦门站、厦门北站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.xm.gov.cn/',
            attractions: [
                { name: '鼓浪屿', url: 'https://www.gulangyu.com/', mustVisit: true },
                { name: '厦门大学', url: 'https://www.xmu.edu.cn/', mustVisit: true },
                { name: '南普陀寺', url: 'https://www.nanputuo.com/' }
            ],
            booking: [
                { name: '鼓浪屿船票', url: 'https://www.gulangyu.com/tickets/' }
            ],
            food: [
                { name: '厦门美食', url: 'https://www.dianping.com/xiamen/food' }
            ]
        },
        poster: {
            title: '海上花园',
            subtitle: '文艺厦门，海岛风情',
            elements: ['鼓浪屿', '环岛路', '厦门大学', '曾厝垵'],
            layout: '顶部鼓浪屿，中央环岛路，底部厦门大学',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '鼓浪屿' },
                    { time: '12:00-14:00', afternoon: '午餐（沙茶面）' },
                    { time: '14:00-17:00', afternoon2: '曾厝垵 → 环岛路' },
                    { time: '18:00-21:00', evening: '中山路' }
                ],
                tips: ['鼓浪屿需要大半天时间', '环岛路建议骑自行车'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 鼓浪屿' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（沙茶面）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 曾厝垵 → 环岛路' },
                    { time: '18:00-21:00', evening: 'Day1: 中山路' },
                    { time: '09:00-17:00', morning2: 'Day2: 厦门大学 → 南普陀寺 → 沙坡尾' }
                ],
                tips: ['厦门大学需要提前预约', '南普陀寺香火旺盛'],
                budget: '600-1200元'
            }
        }
    },
    '青岛': {
        tags: ['海滨城市', '啤酒之都', '历史文化名城'],
        season: '夏季',
        atmosphere: '海滨风情，啤酒文化',
        days: '2-3天',
        routes: ['栈桥 → 八大关', '崂山一日游', '啤酒博物馆 → 五四广场', '金沙滩 → 银沙滩'],
        foods: [
            { name: '青岛啤酒', desc: '青岛特产', price: '10-20元/瓶', mustTry: true },
            { name: '海鲜', desc: '青岛海滨特色', price: '80-150元/人' },
            { name: '鲅鱼水饺', desc: '青岛特色美食', price: '30-50元/份' },
            { name: '烤鱿鱼', desc: '青岛特色小吃', price: '15-25元/串' },
            { name: '蛤蜊', desc: '青岛特色美食', price: '30-50元/份' }
        ],
        accommodations: [
            { area: '市南区', pros: '靠近海边，景点集中', cons: '价格较高，人流量大' },
            { area: '市北区', pros: '交通便利，价格实惠', cons: '距离海边较远' },
            { area: '黄岛区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '流亭国际机场；青岛站、青岛北站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.qingdao.gov.cn/',
            attractions: [
                { name: '崂山', url: 'https://www.laoshan.net.cn/', mustVisit: true },
                { name: '栈桥', url: 'https://www.zhanqiao.com/', mustVisit: true },
                { name: '啤酒博物馆', url: 'https://www.qdbeer.com/' }
            ],
            booking: [
                { name: '崂山门票', url: 'https://www.laoshan.net.cn/tickets/' }
            ],
            food: [
                { name: '青岛美食', url: 'https://www.dianping.com/qingdao/food' }
            ]
        },
        poster: {
            title: '啤酒之城',
            subtitle: '海滨青岛，啤酒文化',
            elements: ['栈桥', '崂山', '啤酒博物馆', '金沙滩'],
            layout: '顶部崂山，中央栈桥，底部啤酒博物馆',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '栈桥 → 八大关' },
                    { time: '12:00-14:00', afternoon: '午餐（海鲜）' },
                    { time: '14:00-17:00', afternoon2: '啤酒博物馆 → 五四广场' },
                    { time: '18:00-21:00', evening: '金沙滩' }
                ],
                tips: ['八大关建议步行', '啤酒博物馆可以品尝啤酒'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 栈桥 → 八大关' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（海鲜）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 啤酒博物馆 → 五四广场' },
                    { time: '18:00-21:00', evening: 'Day1: 金沙滩' },
                    { time: '09:00-17:00', morning2: 'Day2: 崂山一日游' }
                ],
                tips: ['崂山需要一整天时间', '建议跟团或自驾'],
                budget: '600-1200元'
            }
        }
    },
    '昆明': {
        tags: ['春城', '花卉之都', '历史文化名城'],
        season: '全年',
        atmosphere: '四季如春，民族风情浓郁',
        days: '2-3天',
        routes: ['滇池 → 海埂公园', '石林一日游', '翠湖公园 → 云南大学', '民族村 → 西山'],
        foods: [
            { name: '过桥米线', desc: '云南特色美食', price: '20-40元/碗', mustTry: true },
            { name: '汽锅鸡', desc: '云南特色美食', price: '60-100元/份' },
            { name: '云南小锅米线', desc: '云南特色面食', price: '15-25元/碗' },
            { name: '鲜花饼', desc: '云南特色点心', price: '10-15元/个' },
            { name: '宣威火腿', desc: '云南特产', price: '80-150元/斤' }
        ],
        accommodations: [
            { area: '五华区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '盘龙区', pros: '环境优美，交通便利', cons: '价格较高，车流量大' },
            { area: '西山区', pros: '靠近滇池，环境优美', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '长水国际机场；昆明站、昆明南站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.km.gov.cn/',
            attractions: [
                { name: '石林', url: 'https://www.shilin.com.cn/', mustVisit: true },
                { name: '滇池', url: 'https://www.dianchi.com.cn/', mustVisit: true },
                { name: '民族村', url: 'https://www.ynmzc.com/' }
            ],
            booking: [
                { name: '石林门票', url: 'https://www.shilin.com.cn/tickets/' }
            ],
            food: [
                { name: '昆明美食', url: 'https://www.dianping.com/kunming/food' }
            ]
        },
        poster: {
            title: '春城昆明',
            subtitle: '四季如春，花卉之都',
            elements: ['滇池', '石林', '民族村', '翠湖'],
            layout: '顶部滇池，中央石林，底部民族村',
            colors: ['#27ae60', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '滇池 → 海埂公园' },
                    { time: '12:00-14:00', afternoon: '午餐（过桥米线）' },
                    { time: '14:00-17:00', afternoon2: '翠湖公园 → 云南大学' },
                    { time: '18:00-21:00', evening: '民族村' }
                ],
                tips: ['滇池建议早去', '云南大学需要身份证进入'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 滇池 → 海埂公园' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（过桥米线）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 翠湖公园 → 云南大学' },
                    { time: '18:00-21:00', evening: 'Day1: 民族村' },
                    { time: '09:00-17:00', morning2: 'Day2: 石林一日游' }
                ],
                tips: ['石林需要一整天时间', '建议跟团或自驾'],
                budget: '500-1000元'
            }
        }
    },
    '丽江': {
        tags: ['古城', '纳西族', '高原风光'],
        season: '春秋两季',
        atmosphere: '浪漫文艺，民族风情浓郁',
        days: '2-3天',
        routes: ['丽江古城 → 四方街', '玉龙雪山一日游', '束河古镇 → 黑龙潭', '拉市海 → 茶马古道'],
        foods: [
            { name: '纳西烤鱼', desc: '纳西族特色美食', price: '50-80元/份', mustTry: true },
            { name: '丽江粑粑', desc: '丽江传统小吃', price: '10-15元/个' },
            { name: '鸡豆凉粉', desc: '丽江特色小吃', price: '10-15元/份' },
            { name: '酥油茶', desc: '藏族特色饮品', price: '15-25元/壶' },
            { name: '牦牛肉', desc: '高原特色美食', price: '60-100元/份' }
        ],
        accommodations: [
            { area: '古城区', pros: '靠近古城，环境优美', cons: '价格较高，人流量大' },
            { area: '束河古镇', pros: '环境安静，文艺氛围', cons: '距离市中心较远' },
            { area: '新城区', pros: '价格实惠，交通便利', cons: '距离景点较远' }
        ],
        transport: [
            { type: '内部交通', info: '古城内步行，建议使用公交或出租车' },
            { type: '外部交通', info: '丽江三义国际机场；丽江站等火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '高原反应药品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.lijiang.gov.cn/',
            attractions: [
                { name: '丽江古城', url: 'https://www.lijianggucheng.com/', mustVisit: true },
                { name: '玉龙雪山', url: 'https://www.yulongxueshan.com/', mustVisit: true },
                { name: '束河古镇', url: 'https://www.shuhe.com/' }
            ],
            booking: [
                { name: '玉龙雪山门票', url: 'https://www.yulongxueshan.com/tickets/' }
            ],
            food: [
                { name: '丽江美食', url: 'https://www.dianping.com/lijiang/food' }
            ]
        },
        poster: {
            title: '丽江古城',
            subtitle: '浪漫文艺，纳西风情',
            elements: ['丽江古城', '玉龙雪山', '束河古镇', '四方街'],
            layout: '顶部玉龙雪山，中央丽江古城，底部四方街',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '丽江古城 → 四方街' },
                    { time: '12:00-14:00', afternoon: '午餐（纳西烤鱼）' },
                    { time: '14:00-17:00', afternoon2: '束河古镇 → 黑龙潭' },
                    { time: '18:00-21:00', evening: '丽江古城夜景' }
                ],
                tips: ['丽江古城建议步行', '古城夜景很美'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 丽江古城 → 四方街' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（纳西烤鱼）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 束河古镇 → 黑龙潭' },
                    { time: '18:00-21:00', evening: 'Day1: 丽江古城夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 玉龙雪山一日游' }
                ],
                tips: ['玉龙雪山需要一整天时间', '建议提前购买氧气'],
                budget: '600-1200元'
            }
        }
    },
    '大理': {
        tags: ['古城', '白族', '洱海风光'],
        season: '春秋两季',
        atmosphere: '风花雪月，白族风情',
        days: '2-3天',
        routes: ['大理古城 → 洋人街', '洱海环海游', '崇圣寺三塔 → 蝴蝶泉', '双廊古镇 → 南诏风情岛'],
        foods: [
            { name: '大理砂锅鱼', desc: '大理特色美食', price: '60-100元/份', mustTry: true },
            { name: '白族三道茶', desc: '白族传统饮品', price: '30-50元/人' },
            { name: '乳扇', desc: '白族特色小吃', price: '10-15元/份' },
            { name: '喜洲粑粑', desc: '大理传统小吃', price: '10-15元/个' },
            { name: '饵丝', desc: '大理特色面食', price: '15-25元/碗' }
        ],
        accommodations: [
            { area: '大理古城', pros: '靠近景点，环境优美', cons: '价格较高，人流量大' },
            { area: '双廊古镇', pros: '洱海风光，环境优美', cons: '价格较高，交通不便' },
            { area: '下关', pros: '交通便利，价格实惠', cons: '距离景点较远' }
        ],
        transport: [
            { type: '内部交通', info: '古城内步行，洱海建议租车环行' },
            { type: '外部交通', info: '大理机场；大理站等火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.dali.gov.cn/',
            attractions: [
                { name: '大理古城', url: 'https://www.daligucheng.com/', mustVisit: true },
                { name: '洱海', url: 'https://www.erhai.com/', mustVisit: true },
                { name: '崇圣寺三塔', url: 'https://www.chongsheng.com/' }
            ],
            booking: [
                { name: '崇圣寺三塔门票', url: 'https://www.chongsheng.com/tickets/' }
            ],
            food: [
                { name: '大理美食', url: 'https://www.dianping.com/dali/food' }
            ]
        },
        poster: {
            title: '风花雪月',
            subtitle: '大理古城，洱海风光',
            elements: ['大理古城', '洱海', '崇圣寺三塔', '双廊古镇'],
            layout: '顶部苍山，中央洱海，底部大理古城',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '大理古城 → 洋人街' },
                    { time: '12:00-14:00', afternoon: '午餐（大理砂锅鱼）' },
                    { time: '14:00-17:00', afternoon2: '崇圣寺三塔 → 蝴蝶泉' },
                    { time: '18:00-21:00', evening: '大理古城夜景' }
                ],
                tips: ['大理古城建议步行', '古城夜景很美'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 大理古城 → 洋人街' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（大理砂锅鱼）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 崇圣寺三塔 → 蝴蝶泉' },
                    { time: '18:00-21:00', evening: 'Day1: 大理古城夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 洱海环海游 → 双廊古镇' }
                ],
                tips: ['洱海环海需要一整天时间', '建议租车或包车'],
                budget: '600-1200元'
            }
        }
    },
    '郑州': {
        tags: ['历史文化名城', '中原腹地', '交通枢纽'],
        season: '春秋两季',
        atmosphere: '历史厚重，中原文化',
        days: '2-3天',
        routes: ['少林寺一日游', '河南博物院 → 二七纪念塔', '黄河游览区 → 花园口', '康百万庄园 → 北宋皇陵'],
        foods: [
            { name: '烩面', desc: '郑州特色面食', price: '15-25元/碗', mustTry: true },
            { name: '胡辣汤', desc: '河南特色早餐', price: '8-15元/碗' },
            { name: '道口烧鸡', desc: '河南特产', price: '50-80元/只' },
            { name: '开封灌汤包', desc: '河南特色点心', price: '20-30元/笼' },
            { name: '桶子鸡', desc: '河南传统美食', price: '40-60元/份' }
        ],
        accommodations: [
            { area: '二七区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '金水区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '中原区', pros: '价格实惠，环境安静', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '新郑国际机场；郑州站、郑州东站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.zhengzhou.gov.cn/',
            attractions: [
                { name: '少林寺', url: 'https://www.shaolin.org.cn/', mustVisit: true },
                { name: '河南博物院', url: 'https://www.chnmus.net/', mustVisit: true },
                { name: '黄河游览区', url: 'https://www.huanghe.com.cn/' }
            ],
            booking: [
                { name: '少林寺门票', url: 'https://www.shaolin.org.cn/tickets/' }
            ],
            food: [
                { name: '郑州美食', url: 'https://www.dianping.com/zhengzhou/food' }
            ]
        },
        poster: {
            title: '中原古都',
            subtitle: '历史郑州，中原文化',
            elements: ['少林寺', '河南博物院', '黄河', '二七纪念塔'],
            layout: '顶部少林寺，中央黄河，底部二七纪念塔',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '河南博物院 → 二七纪念塔' },
                    { time: '12:00-14:00', afternoon: '午餐（烩面）' },
                    { time: '14:00-17:00', afternoon2: '黄河游览区 → 花园口' },
                    { time: '18:00-21:00', evening: '郑州夜景' }
                ],
                tips: ['河南博物院需要提前预约', '黄河游览区建议早去'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 河南博物院 → 二七纪念塔' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（烩面）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 黄河游览区 → 花园口' },
                    { time: '18:00-21:00', evening: 'Day1: 郑州夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 少林寺一日游' }
                ],
                tips: ['少林寺需要一整天时间', '建议跟团或自驾'],
                budget: '500-1000元'
            }
        }
    },
    '石家庄': {
        tags: ['河北省会', '历史文化名城', '华北重镇'],
        season: '春秋两季',
        atmosphere: '历史悠久，文化底蕴深厚',
        days: '2-3天',
        routes: ['赵州桥 → 柏林禅寺', '西柏坡一日游', '正定古城 → 隆兴寺', '石家庄市区游'],
        foods: [
            { name: '正定八大碗', desc: '石家庄特色美食', price: '80-120元/份', mustTry: true },
            { name: '石家庄扒鸡', desc: '石家庄传统美食', price: '40-60元/只' },
            { name: '藁城宫面', desc: '石家庄特色面食', price: '15-25元/斤' },
            { name: '西河肉糕', desc: '石家庄传统小吃', price: '20-30元/份' },
            { name: '马家卤鸡', desc: '石家庄特色美食', price: '50-80元/只' }
        ],
        accommodations: [
            { area: '长安区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '桥西区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '裕华区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '正定国际机场；石家庄站、石家庄北站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.sjz.gov.cn/',
            attractions: [
                { name: '赵州桥', url: 'https://www.zhaozhouqiao.com/', mustVisit: true },
                { name: '西柏坡', url: 'https://www.xibaipo.gov.cn/', mustVisit: true },
                { name: '正定古城', url: 'https://www.zhengding.gov.cn/' }
            ],
            booking: [
                { name: '西柏坡门票', url: 'https://www.xibaipo.gov.cn/tickets/' }
            ],
            food: [
                { name: '石家庄美食', url: 'https://www.dianping.com/shijiazhuang/food' }
            ]
        },
        poster: {
            title: '华北重镇',
            subtitle: '历史石家庄，文化名城',
            elements: ['赵州桥', '西柏坡', '正定古城', '隆兴寺'],
            layout: '顶部赵州桥，中央西柏坡，底部正定古城',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '赵州桥 → 柏林禅寺' },
                    { time: '12:00-14:00', afternoon: '午餐（正定八大碗）' },
                    { time: '14:00-17:00', afternoon2: '正定古城 → 隆兴寺' },
                    { time: '18:00-21:00', evening: '石家庄市区' }
                ],
                tips: ['赵州桥需要半天时间', '正定古城建议步行'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 赵州桥 → 柏林禅寺' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（正定八大碗）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 正定古城 → 隆兴寺' },
                    { time: '18:00-21:00', evening: 'Day1: 石家庄市区' },
                    { time: '09:00-17:00', morning2: 'Day2: 西柏坡一日游' }
                ],
                tips: ['西柏坡需要一整天时间', '建议跟团或自驾'],
                budget: '500-1000元'
            }
        }
    },
    '太原': {
        tags: ['山西省会', '历史文化名城', '晋商故里'],
        season: '春秋两季',
        atmosphere: '历史悠久，晋商文化',
        days: '2-3天',
        routes: ['晋祠 → 天龙山石窟', '平遥古城一日游', '太原市区 → 纯阳宫', '五台山一日游'],
        foods: [
            { name: '刀削面', desc: '山西特色面食', price: '15-25元/碗', mustTry: true },
            { name: '老陈醋', desc: '山西特产', price: '20-40元/瓶' },
            { name: '平遥牛肉', desc: '山西特色美食', price: '60-100元/斤' },
            { name: '过油肉', desc: '山西传统名菜', price: '40-60元/份' },
            { name: '碗托', desc: '山西特色小吃', price: '10-15元/份' }
        ],
        accommodations: [
            { area: '迎泽区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '小店区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '杏花岭区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '武宿国际机场；太原站、太原南站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.taiyuan.gov.cn/',
            attractions: [
                { name: '晋祠', url: 'https://www.jinci.com/', mustVisit: true },
                { name: '平遥古城', url: 'https://www.pingyaogucheng.com/', mustVisit: true },
                { name: '五台山', url: 'https://www.wutaishan.com/' }
            ],
            booking: [
                { name: '晋祠门票', url: 'https://www.jinci.com/tickets/' }
            ],
            food: [
                { name: '太原美食', url: 'https://www.dianping.com/taiyuan/food' }
            ]
        },
        poster: {
            title: '晋商故里',
            subtitle: '历史太原，文化名城',
            elements: ['晋祠', '平遥古城', '五台山', '纯阳宫'],
            layout: '顶部晋祠，中央平遥古城，底部五台山',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '晋祠 → 天龙山石窟' },
                    { time: '12:00-14:00', afternoon: '午餐（刀削面）' },
                    { time: '14:00-17:00', afternoon2: '太原市区 → 纯阳宫' },
                    { time: '18:00-21:00', evening: '太原夜景' }
                ],
                tips: ['晋祠需要半天时间', '纯阳宫建议早去'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 晋祠 → 天龙山石窟' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（刀削面）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 太原市区 → 纯阳宫' },
                    { time: '18:00-21:00', evening: 'Day1: 太原夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 平遥古城一日游' }
                ],
                tips: ['平遥古城需要一整天时间', '建议跟团或自驾'],
                budget: '500-1000元'
            }
        }
    },
    '沈阳': {
        tags: ['辽宁省会', '历史文化名城', '工业重镇'],
        season: '春秋两季',
        atmosphere: '历史悠久，工业文化',
        days: '2-3天',
        routes: ['沈阳故宫 → 张氏帅府', '棋盘山一日游', '九一八历史博物馆 → 北陵公园', '沈阳植物园 → 东陵公园'],
        foods: [
            { name: '沈阳老边饺子', desc: '沈阳特色美食', price: '40-60元/份', mustTry: true },
            { name: '沈阳李连贵熏肉大饼', desc: '沈阳传统美食', price: '20-30元/份' },
            { name: '沈阳回头', desc: '沈阳特色小吃', price: '15-25元/份' },
            { name: '沈阳西塔大冷面', desc: '沈阳特色面食', price: '15-25元/碗' },
            { name: '沈阳锅包肉', desc: '沈阳传统名菜', price: '30-50元/份' }
        ],
        accommodations: [
            { area: '沈河区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '和平区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '皇姑区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '桃仙国际机场；沈阳站、沈阳北站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.shenyang.gov.cn/',
            attractions: [
                { name: '沈阳故宫', url: 'https://www.shenyang-palace.com/', mustVisit: true },
                { name: '张氏帅府', url: 'https://www.zhangshuaifu.com/', mustVisit: true },
                { name: '九一八历史博物馆', url: 'https://www.918museum.com/' }
            ],
            booking: [
                { name: '沈阳故宫门票', url: 'https://www.shenyang-palace.com/tickets/' }
            ],
            food: [
                { name: '沈阳美食', url: 'https://www.dianping.com/shenyang/food' }
            ]
        },
        poster: {
            title: '工业重镇',
            subtitle: '历史沈阳，文化名城',
            elements: ['沈阳故宫', '张氏帅府', '北陵公园', '棋盘山'],
            layout: '顶部沈阳故宫，中央张氏帅府，底部北陵公园',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '沈阳故宫 → 张氏帅府' },
                    { time: '12:00-14:00', afternoon: '午餐（老边饺子）' },
                    { time: '14:00-17:00', afternoon2: '九一八历史博物馆 → 北陵公园' },
                    { time: '18:00-21:00', evening: '沈阳夜景' }
                ],
                tips: ['沈阳故宫需要半天时间', '张氏帅府建议早去'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 沈阳故宫 → 张氏帅府' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（老边饺子）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 九一八历史博物馆 → 北陵公园' },
                    { time: '18:00-21:00', evening: 'Day1: 沈阳夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 棋盘山一日游' }
                ],
                tips: ['棋盘山需要一整天时间', '建议自驾或乘坐旅游专线'],
                budget: '500-1000元'
            }
        }
    },
    '长春': {
        tags: ['吉林省会', '历史文化名城', '汽车城'],
        season: '春秋两季',
        atmosphere: '历史悠久，汽车文化',
        days: '2-3天',
        routes: ['伪满皇宫 → 长影世纪城', '净月潭一日游', '长春电影制片厂 → 文化广场', '南湖公园 → 动植物园'],
        foods: [
            { name: '长春酱骨头', desc: '长春特色美食', price: '50-80元/份', mustTry: true },
            { name: '长春炒粉', desc: '长春特色小吃', price: '10-15元/份' },
            { name: '长春锅包肉', desc: '长春传统名菜', price: '30-50元/份' },
            { name: '长春冷面', desc: '长春特色面食', price: '15-25元/碗' },
            { name: '长春打糕', desc: '长春传统小吃', price: '10-15元/份' }
        ],
        accommodations: [
            { area: '朝阳区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '南关区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '绿园区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '龙嘉国际机场；长春站、长春西站等多个火车站' }
        ],
        budget: { low: '800', medium: '1600', high: '2800+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.changchun.gov.cn/',
            attractions: [
                { name: '伪满皇宫', url: 'https://www.weiman-huanggong.com/', mustVisit: true },
                { name: '净月潭', url: 'https://www.jingyuetan.com/', mustVisit: true },
                { name: '长影世纪城', url: 'https://www.changying.com/' }
            ],
            booking: [
                { name: '伪满皇宫门票', url: 'https://www.weiman-huanggong.com/tickets/' }
            ],
            food: [
                { name: '长春美食', url: 'https://www.dianping.com/changchun/food' }
            ]
        },
        poster: {
            title: '汽车之城',
            subtitle: '历史长春，文化名城',
            elements: ['伪满皇宫', '净月潭', '长影世纪城', '文化广场'],
            layout: '顶部伪满皇宫，中央净月潭，底部长影世纪城',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '伪满皇宫 → 长影世纪城' },
                    { time: '12:00-14:00', afternoon: '午餐（酱骨头）' },
                    { time: '14:00-17:00', afternoon2: '长春电影制片厂 → 文化广场' },
                    { time: '18:00-21:00', evening: '长春夜景' }
                ],
                tips: ['伪满皇宫需要半天时间', '长影世纪城建议早去'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 伪满皇宫 → 长影世纪城' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（酱骨头）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 长春电影制片厂 → 文化广场' },
                    { time: '18:00-21:00', evening: 'Day1: 长春夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 净月潭一日游' }
                ],
                tips: ['净月潭需要一整天时间', '建议自驾或乘坐旅游专线'],
                budget: '500-1000元'
            }
        }
    },
    '哈尔滨': {
        tags: ['黑龙江省会', '历史文化名城', '冰城'],
        season: '冬季',
        atmosphere: '冰雪文化，俄式风情',
        days: '2-3天',
        routes: ['冰雪大世界 → 太阳岛', '中央大街 → 圣索菲亚教堂', '松花江 → 防洪纪念塔', '伏尔加庄园一日游'],
        foods: [
            { name: '哈尔滨红肠', desc: '哈尔滨特色美食', price: '30-50元/斤', mustTry: true },
            { name: '哈尔滨啤酒', desc: '哈尔滨特产', price: '10-15元/瓶' },
            { name: '锅包肉', desc: '哈尔滨传统名菜', price: '30-50元/份' },
            { name: '哈尔滨大列巴', desc: '哈尔滨特色面包', price: '20-30元/个' },
            { name: '哈尔滨酸奶', desc: '哈尔滨特色饮品', price: '10-15元/瓶' }
        ],
        accommodations: [
            { area: '道里区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '南岗区', pros: '商业中心，交通便利', cons: '价格较高，车流量大' },
            { area: '香坊区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '太平国际机场；哈尔滨站、哈尔滨西站等多个火车站' }
        ],
        budget: { low: '900', medium: '1800', high: '3000+' },
        tips: {
            prepare: ['身份证必带', '保暖衣物', '充电宝', '防滑鞋'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.harbin.gov.cn/',
            attractions: [
                { name: '冰雪大世界', url: 'https://www.ice-snow.com/', mustVisit: true },
                { name: '中央大街', url: 'https://www.zhongyangdajie.com/', mustVisit: true },
                { name: '圣索菲亚教堂', url: 'https://www.suofeia.com/' }
            ],
            booking: [
                { name: '冰雪大世界门票', url: 'https://www.ice-snow.com/tickets/' }
            ],
            food: [
                { name: '哈尔滨美食', url: 'https://www.dianping.com/harbin/food' }
            ]
        },
        poster: {
            title: '冰城哈尔滨',
            subtitle: '冰雪世界，俄式风情',
            elements: ['冰雪大世界', '中央大街', '圣索菲亚教堂', '太阳岛'],
            layout: '顶部冰雪大世界，中央中央大街，底部圣索菲亚教堂',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '中央大街 → 圣索菲亚教堂' },
                    { time: '12:00-14:00', afternoon: '午餐（锅包肉）' },
                    { time: '14:00-17:00', afternoon2: '松花江 → 防洪纪念塔' },
                    { time: '18:00-21:00', evening: '冰雪大世界' }
                ],
                tips: ['中央大街建议步行', '冰雪大世界建议晚上去'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 中央大街 → 圣索菲亚教堂' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（锅包肉）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 松花江 → 防洪纪念塔' },
                    { time: '18:00-21:00', evening: 'Day1: 冰雪大世界' },
                    { time: '09:00-17:00', morning2: 'Day2: 太阳岛 → 伏尔加庄园' }
                ],
                tips: ['太阳岛需要大半天时间', '伏尔加庄园建议自驾或乘坐旅游专线'],
                budget: '600-1200元'
            }
        }
    },
    '南京': {
        tags: ['历史古都', '文化名城', '江南水乡'],
        season: '春秋两季',
        atmosphere: '历史悠久，文化底蕴深厚',
        days: '3-4天',
        routes: ['中山陵 → 明孝陵 → 灵谷寺', '夫子庙 → 秦淮河 → 中华门', '总统府 → 玄武湖', '雨花台 → 莫愁湖'],
        foods: [
            { name: '南京盐水鸭', desc: '南京特色美食', price: '50-80元/只', mustTry: true },
            { name: '鸭血粉丝汤', desc: '南京特色小吃', price: '15-25元/碗' },
            { name: '南京小笼包', desc: '南京传统点心', price: '20-30元/笼' },
            { name: '南京糕团', desc: '南京传统小吃', price: '10-15元/份' },
            { name: '南京板鸭', desc: '南京特色美食', price: '60-100元/只' }
        ],
        accommodations: [
            { area: '秦淮区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '玄武区', pros: '环境优美，交通便利', cons: '价格较高' },
            { area: '建邺区', pros: '现代化，交通便利', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '禄口国际机场；南京站、南京南站等多个火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.nanjing.gov.cn/',
            attractions: [
                { name: '中山陵', url: 'https://www.z钟山-中山陵', mustVisit: true },
                { name: '夫子庙', url: 'https://www.fuzimiao.com/', mustVisit: true },
                { name: '总统府', url: 'https://www.njztf.gov.cn/' }
            ],
            booking: [
                { name: '中山陵门票', url: 'https://www.z钟山-中山陵/tickets/' }
            ],
            food: [
                { name: '南京美食', url: 'https://www.dianping.com/nanjing/food' }
            ]
        },
        poster: {
            title: '金陵古都',
            subtitle: '历史南京，文化名城',
            elements: ['中山陵', '夫子庙', '秦淮河', '总统府'],
            layout: '顶部中山陵，中央秦淮河，底部夫子庙',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '中山陵 → 明孝陵' },
                    { time: '12:00-14:00', afternoon: '午餐（南京盐水鸭）' },
                    { time: '14:00-17:00', afternoon2: '夫子庙 → 秦淮河' },
                    { time: '18:00-21:00', evening: '秦淮河夜景' }
                ],
                tips: ['中山陵需要半天时间', '秦淮河夜景很美'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 中山陵 → 明孝陵 → 灵谷寺' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（南京盐水鸭）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 夫子庙 → 秦淮河 → 中华门' },
                    { time: '18:00-21:00', evening: 'Day1: 秦淮河夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 总统府 → 玄武湖 → 雨花台' }
                ],
                tips: ['总统府需要半天时间', '玄武湖建议步行或骑行'],
                budget: '600-1200元'
            }
        }
    },
    '杭州': {
        tags: ['人间天堂', '西湖风光', '江南水乡'],
        season: '春秋两季',
        atmosphere: '山水如画，人文荟萃',
        days: '3-4天',
        routes: ['西湖环游', '灵隐寺 → 飞来峰', '千岛湖一日游', '宋城 → 西溪湿地'],
        foods: [
            { name: '西湖醋鱼', desc: '杭州特色美食', price: '50-80元/份', mustTry: true },
            { name: '龙井虾仁', desc: '杭州传统名菜', price: '80-120元/份' },
            { name: '叫花鸡', desc: '杭州特色美食', price: '60-100元/只' },
            { name: '杭州小笼包', desc: '杭州传统点心', price: '20-30元/笼' },
            { name: '西湖莼菜汤', desc: '杭州特色汤品', price: '30-50元/份' }
        ],
        accommodations: [
            { area: '西湖区', pros: '靠近西湖，环境优美', cons: '价格较高，人流量大' },
            { area: '上城区', pros: '市中心，交通便利', cons: '价格较高，车流量大' },
            { area: '余杭区', pros: '价格实惠，环境安静', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '萧山国际机场；杭州站、杭州东站等多个火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.hangzhou.gov.cn/',
            attractions: [
                { name: '西湖', url: 'https://www.west-lake.com/', mustVisit: true },
                { name: '灵隐寺', url: 'https://www.lingyinsi.com/', mustVisit: true },
                { name: '千岛湖', url: 'https://www.qiandaohu.com/' }
            ],
            booking: [
                { name: '灵隐寺门票', url: 'https://www.lingyinsi.com/tickets/' }
            ],
            food: [
                { name: '杭州美食', url: 'https://www.dianping.com/hangzhou/food' }
            ]
        },
        poster: {
            title: '人间天堂',
            subtitle: '西湖风光，江南水乡',
            elements: ['西湖', '灵隐寺', '千岛湖', '西溪湿地'],
            layout: '顶部西湖，中央灵隐寺，底部千岛湖',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '西湖环游（断桥 → 白堤 → 苏堤）' },
                    { time: '12:00-14:00', afternoon: '午餐（西湖醋鱼）' },
                    { time: '14:00-17:00', afternoon2: '灵隐寺 → 飞来峰' },
                    { time: '18:00-21:00', evening: '西湖夜景' }
                ],
                tips: ['西湖建议骑行或步行', '灵隐寺建议早去'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 西湖环游（断桥 → 白堤 → 苏堤）' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（西湖醋鱼）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 灵隐寺 → 飞来峰' },
                    { time: '18:00-21:00', evening: 'Day1: 西湖夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 千岛湖一日游' }
                ],
                tips: ['千岛湖需要一整天时间', '建议跟团或自驾'],
                budget: '800-1500元'
            }
        }
    },
    '成都': {
        tags: ['休闲之都', '美食天堂', '天府之国'],
        season: '春秋两季',
        atmosphere: '悠闲舒适，美食文化',
        days: '3-4天',
        routes: ['宽窄巷子 → 锦里 → 武侯祠', '大熊猫繁育研究基地 → 春熙路', '都江堰一日游', '青城山一日游'],
        foods: [
            { name: '火锅', desc: '成都特色美食', price: '80-150元/人', mustTry: true },
            { name: '串串香', desc: '成都特色小吃', price: '50-100元/人' },
            { name: '担担面', desc: '成都特色面食', price: '15-25元/碗' },
            { name: '龙抄手', desc: '成都特色小吃', price: '15-25元/碗' },
            { name: '三大炮', desc: '成都传统小吃', price: '10-15元/份' }
        ],
        accommodations: [
            { area: '锦江区', pros: '市中心，交通便利', cons: '价格较高，人流量大' },
            { area: '青羊区', pros: '靠近景点，环境优美', cons: '价格较高' },
            { area: '成华区', pros: '价格实惠，交通便利', cons: '距离市中心较远' }
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
                { name: '大熊猫繁育研究基地', url: 'https://www.panda.org.cn/', mustVisit: true },
                { name: '武侯祠', url: 'https://www.wuhouci.net.cn/', mustVisit: true },
                { name: '都江堰', url: 'https://www.dujiangyan.gov.cn/' }
            ],
            booking: [
                { name: '大熊猫基地门票', url: 'https://www.panda.org.cn/tickets/' }
            ],
            food: [
                { name: '成都美食', url: 'https://www.dianping.com/chengdu/food' }
            ]
        },
        poster: {
            title: '天府之国',
            subtitle: '休闲成都，美食天堂',
            elements: ['大熊猫', '宽窄巷子', '武侯祠', '都江堰'],
            layout: '顶部大熊猫，中央宽窄巷子，底部武侯祠',
            colors: ['#27ae60', '#f39c12', '#e74c3c', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '大熊猫繁育研究基地' },
                    { time: '12:00-14:00', afternoon: '午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: '宽窄巷子 → 锦里 → 武侯祠' },
                    { time: '18:00-21:00', evening: '春熙路' }
                ],
                tips: ['大熊猫基地建议早去', '宽窄巷子建议傍晚去'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 大熊猫繁育研究基地' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 宽窄巷子 → 锦里 → 武侯祠' },
                    { time: '18:00-21:00', evening: 'Day1: 春熙路' },
                    { time: '09:00-17:00', morning2: 'Day2: 都江堰一日游' }
                ],
                tips: ['都江堰需要一整天时间', '建议跟团或自驾'],
                budget: '600-1200元'
            }
        }
    },
    '西安': {
        tags: ['十三朝古都', '历史文化名城', '丝绸之路起点'],
        season: '春秋两季',
        atmosphere: '历史厚重，文化底蕴深厚',
        days: '3-4天',
        routes: ['兵马俑 → 华清池', '大雁塔 → 小雁塔 → 陕西历史博物馆', '城墙 → 钟鼓楼 → 回民街', '乾陵 → 法门寺'],
        foods: [
            { name: '肉夹馍', desc: '西安特色美食', price: '10-15元/个', mustTry: true },
            { name: '凉皮', desc: '西安特色小吃', price: '10-15元/份' },
            { name: '羊肉泡馍', desc: '西安传统名菜', price: '25-40元/碗' },
            { name: '油泼面', desc: '西安特色面食', price: '15-25元/碗' },
            { name: '葫芦头', desc: '西安特色小吃', price: '20-30元/碗' }
        ],
        accommodations: [
            { area: '碑林区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '雁塔区', pros: '靠近景点，环境优美', cons: '价格较高' },
            { area: '未央区', pros: '价格实惠，交通便利', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁网络发达，建议使用地铁出行' },
            { type: '外部交通', info: '咸阳国际机场；西安站、西安北站等多个火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.xian.gov.cn/',
            attractions: [
                { name: '兵马俑', url: 'https://www.bmy.com.cn/', mustVisit: true },
                { name: '大雁塔', url: 'https://www.dayanta.com/', mustVisit: true },
                { name: '陕西历史博物馆', url: 'https://www.sxhm.com/' }
            ],
            booking: [
                { name: '兵马俑门票', url: 'https://www.bmy.com.cn/tickets/' }
            ],
            food: [
                { name: '西安美食', url: 'https://www.dianping.com/xian/food' }
            ]
        },
        poster: {
            title: '古都西安',
            subtitle: '十三朝古都，历史名城',
            elements: ['兵马俑', '大雁塔', '城墙', '回民街'],
            layout: '顶部兵马俑，中央大雁塔，底部城墙',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '兵马俑 → 华清池' },
                    { time: '12:00-14:00', afternoon: '午餐（羊肉泡馍）' },
                    { time: '14:00-17:00', afternoon2: '大雁塔 → 陕西历史博物馆' },
                    { time: '18:00-21:00', evening: '回民街' }
                ],
                tips: ['兵马俑需要半天时间', '陕西历史博物馆需要提前预约'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 兵马俑 → 华清池' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（羊肉泡馍）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 大雁塔 → 陕西历史博物馆' },
                    { time: '18:00-21:00', evening: 'Day1: 回民街' },
                    { time: '09:00-17:00', morning2: 'Day2: 城墙 → 钟鼓楼 → 乾陵 → 法门寺' }
                ],
                tips: ['乾陵和法门寺需要一整天时间', '建议跟团或自驾'],
                budget: '600-1200元'
            }
        }
    },
    '重庆': {
        tags: ['山城', '雾都', '火锅之都'],
        season: '春秋两季',
        atmosphere: '热情火辣，山城特色',
        days: '3-4天',
        routes: ['解放碑 → 洪崖洞 → 千厮门大桥', '长江索道 → 南山一棵树', '磁器口古镇 → 渣滓洞', '武隆天生三桥一日游'],
        foods: [
            { name: '火锅', desc: '重庆特色美食', price: '80-150元/人', mustTry: true },
            { name: '小面', desc: '重庆特色面食', price: '10-15元/碗' },
            { name: '酸辣粉', desc: '重庆特色小吃', price: '10-15元/份' },
            { name: '毛血旺', desc: '重庆传统名菜', price: '40-60元/份' },
            { name: '重庆烤鱼', desc: '重庆特色美食', price: '60-100元/份' }
        ],
        accommodations: [
            { area: '渝中区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '江北区', pros: '商业中心，交通便利', cons: '价格较高' },
            { area: '南岸区', pros: '环境优美，价格实惠', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '江北国际机场；重庆站、重庆北站等多个火车站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '雨具'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.cq.gov.cn/',
            attractions: [
                { name: '洪崖洞', url: 'https://www.hongyadong.com/', mustVisit: true },
                { name: '长江索道', url: 'https://www.cqropeway.com/', mustVisit: true },
                { name: '磁器口古镇', url: 'https://www.cqcq古镇.com/' }
            ],
            booking: [
                { name: '长江索道门票', url: 'https://www.cqropeway.com/tickets/' }
            ],
            food: [
                { name: '重庆美食', url: 'https://www.dianping.com/chongqing/food' }
            ]
        },
        poster: {
            title: '山城重庆',
            subtitle: '火锅之都，雾都风光',
            elements: ['洪崖洞', '长江索道', '解放碑', '磁器口古镇'],
            layout: '顶部洪崖洞，中央长江索道，底部解放碑',
            colors: ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '解放碑 → 洪崖洞' },
                    { time: '12:00-14:00', afternoon: '午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: '长江索道 → 南山一棵树' },
                    { time: '18:00-21:00', evening: '千厮门大桥夜景' }
                ],
                tips: ['洪崖洞夜景很美', '长江索道建议早去'],
                budget: '250-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 解放碑 → 洪崖洞' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（火锅）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 长江索道 → 南山一棵树' },
                    { time: '18:00-21:00', evening: 'Day1: 千厮门大桥夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 磁器口古镇 → 渣滓洞 → 武隆天生三桥' }
                ],
                tips: ['武隆天生三桥需要一整天时间', '建议跟团或自驾'],
                budget: '600-1200元'
            }
        }
    },
    '厦门': {
        tags: ['海上花园', '鼓浪屿', '闽南风情'],
        season: '春秋两季',
        atmosphere: '温馨浪漫，海滨风情',
        days: '3-4天',
        routes: ['鼓浪屿一日游', '厦门大学 → 南普陀寺', '曾厝垵 → 环岛路', '集美学村 → 园博园'],
        foods: [
            { name: '沙茶面', desc: '厦门特色美食', price: '20-30元/碗', mustTry: true },
            { name: '土笋冻', desc: '厦门特色小吃', price: '15-25元/份' },
            { name: '烧肉粽', desc: '厦门传统小吃', price: '10-15元/个' },
            { name: '海蛎煎', desc: '厦门特色美食', price: '20-30元/份' },
            { name: '花生汤', desc: '厦门传统饮品', price: '10-15元/碗' }
        ],
        accommodations: [
            { area: '思明区', pros: '市中心，景点集中', cons: '价格较高，人流量大' },
            { area: '鼓浪屿', pros: '环境优美，浪漫氛围', cons: '价格昂贵，交通不便' },
            { area: '湖里区', pros: '价格实惠，交通便利', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '高崎国际机场；厦门站、厦门北站等多个火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.xm.gov.cn/',
            attractions: [
                { name: '鼓浪屿', url: 'https://www.gulangyu.com/', mustVisit: true },
                { name: '厦门大学', url: 'https://www.xmu.edu.cn/', mustVisit: true },
                { name: '南普陀寺', url: 'https://www.nanputuo.com/' }
            ],
            booking: [
                { name: '鼓浪屿船票', url: 'https://www.gulangyu.com/tickets/' }
            ],
            food: [
                { name: '厦门美食', url: 'https://www.dianping.com/xiamen/food' }
            ]
        },
        poster: {
            title: '海上花园',
            subtitle: '鼓浪屿，闽南风情',
            elements: ['鼓浪屿', '厦门大学', '环岛路', '曾厝垵'],
            layout: '顶部鼓浪屿，中央环岛路，底部厦门大学',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '鼓浪屿一日游' },
                    { time: '12:00-14:00', afternoon: '午餐（沙茶面）' },
                    { time: '14:00-17:00', afternoon2: '厦门大学 → 南普陀寺' },
                    { time: '18:00-21:00', evening: '曾厝垵' }
                ],
                tips: ['鼓浪屿需要大半天时间', '厦门大学需要提前预约'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 鼓浪屿一日游' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（沙茶面）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 厦门大学 → 南普陀寺' },
                    { time: '18:00-21:00', evening: 'Day1: 曾厝垵' },
                    { time: '09:00-17:00', morning2: 'Day2: 环岛路 → 集美学村 → 园博园' }
                ],
                tips: ['环岛路建议骑行', '集美学村建议早去'],
                budget: '800-1500元'
            }
        }
    },
    '青岛': {
        tags: ['海滨城市', '啤酒之都', '帆船之都'],
        season: '夏季',
        atmosphere: '海滨风情，啤酒文化',
        days: '3-4天',
        routes: ['栈桥 → 八大关 → 五四广场', '崂山一日游', '啤酒博物馆 → 啤酒街', '金沙滩 → 银沙滩'],
        foods: [
            { name: '青岛啤酒', desc: '青岛特产', price: '10-15元/瓶', mustTry: true },
            { name: '海鲜', desc: '青岛特色美食', price: '80-150元/人' },
            { name: '青岛大包', desc: '青岛传统小吃', price: '10-15元/个' },
            { name: '蛤蜊', desc: '青岛特色美食', price: '30-50元/份' },
            { name: '鲅鱼水饺', desc: '青岛特色美食', price: '30-50元/份' }
        ],
        accommodations: [
            { area: '市南区', pros: '市中心，海滨风光', cons: '价格较高，人流量大' },
            { area: '市北区', pros: '商业中心，交通便利', cons: '价格较高' },
            { area: '黄岛区', pros: '价格实惠，海滨风光', cons: '距离市中心较远' }
        ],
        transport: [
            { type: '内部交通', info: '公交系统发达，建议使用公交出行' },
            { type: '外部交通', info: '流亭国际机场；青岛站、青岛北站等多个火车站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['身份证必带', '舒适的鞋子', '充电宝', '防晒用品'],
            avoid: ['不要在景点周边买纪念品', '不要乘坐黑车', '避开旅游高峰期']
        },
        links: {
            official: 'https://www.qingdao.gov.cn/',
            attractions: [
                { name: '崂山', url: 'https://www.laoshan.com.cn/', mustVisit: true },
                { name: '栈桥', url: 'https://www.zhanqiao.com/', mustVisit: true },
                { name: '啤酒博物馆', url: 'https://www.qdbeer.com/' }
            ],
            booking: [
                { name: '崂山门票', url: 'https://www.laoshan.com.cn/tickets/' }
            ],
            food: [
                { name: '青岛美食', url: 'https://www.dianping.com/qingdao/food' }
            ]
        },
        poster: {
            title: '啤酒之都',
            subtitle: '海滨青岛，帆船之都',
            elements: ['栈桥', '崂山', '啤酒博物馆', '金沙滩'],
            layout: '顶部崂山，中央栈桥，底部金沙滩',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '栈桥 → 八大关' },
                    { time: '12:00-14:00', afternoon: '午餐（海鲜）' },
                    { time: '14:00-17:00', afternoon2: '五四广场 → 啤酒博物馆' },
                    { time: '18:00-21:00', evening: '啤酒街' }
                ],
                tips: ['八大关建议步行', '啤酒博物馆建议早去'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 栈桥 → 八大关 → 五四广场' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐（海鲜）' },
                    { time: '14:00-17:00', afternoon2: 'Day1: 啤酒博物馆 → 啤酒街' },
                    { time: '18:00-21:00', evening: 'Day1: 青岛夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 崂山一日游 → 金沙滩' }
                ],
                tips: ['崂山需要一整天时间', '金沙滩建议下午去'],
                budget: '800-1500元'
            }
        }
    }
};

const cityAliases = {
    '北京': ['beijing', 'bj', '京城', '帝都', '北平']
};

const provinceCities = {
    '北京市': ['北京', '东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
    '上海市': ['上海', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
    '天津市': ['天津', '和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区'],
    '重庆市': ['重庆', '万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区', '綦江区', '大足区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区', '城口县', '丰都县', '垫江县', '忠县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱县', '秀山县', '酉阳县', '彭水县'],
    '河北省': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水', '雄安新区', '辛集市', '晋州市', '新乐市', '遵化市', '迁安市', '霸州市', '三河市', '涿州市', '安国市', '高碑店市', '泊头市', '任丘市', '黄骅市', '河间市', '深州市', '南宫市', '沙河市', '武安市'],
    '山西省': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁', '古交市', '潞城市', '高平市', '介休市', '永济市', '河津市', '原平市', '临汾市', '侯马市', '霍州市', '孝义市', '汾阳市', '灵石县', '武乡县', '黎城县', '壶关县', '长子县', '沁源县', '陵川县', '右玉县', '左权县', '榆社县', '昔阳县', '寿阳县', '太谷县', '祁县', '平遥县', '介休县', '万荣县', '稷山县', '新绛县', '绛县', '垣曲县', '夏县', '平陆县', '芮城县', '五台县', '代县', '繁峙县', '宁武县', '静乐县', '神池县', '岚县', '保德县', '偏关县', '永和县', '大宁县', '隰县', '蒲县', '汾西县', '兴县', '临县', '柳林县', '石楼县', '岚县', '方山县', '中阳县', '交口县'],
    '辽宁省': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛', '瓦房店', '海城', '凤城', '北镇', '凌源', '开原', '调兵山', '庄河市', '东港市', '凤城市', '凌海市', '北镇市', '盖州市', '大石桥市', '灯塔市', '调兵山市', '新民市', '法库县', '康平县', '长海县', '台安县', '岫岩县', '清原县', '新宾县', '桓仁县', '宽甸县', '黑山县', '义县', '凌海市', '阜蒙县', '彰武县', '西丰县', '昌图县', '建平县', '喀左县'],
    '吉林省': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边', '公主岭', '梅河口', '集安', '磐石', '蛟河', '桦甸', '舒兰', '双辽', '东丰', '东辽', '临江', '扶余', '大安', '洮南', '延吉', '图们', '敦化', '珲春', '龙井', '和龙', '德惠市', '榆树市', '农安县', '永吉县', '磐石市', '桦甸市', '舒兰市', '蛟河市', '梨树县', '伊通县', '双辽市', '东辽县', '辉南县', '柳河县', '梅河口市', '靖宇县', '抚松县', '长白县', '前郭县', '长岭县', '乾安县', '镇赉县', '通榆县', '洮南市', '大安市', '延吉市', '图们市', '敦化市', '珲春市', '龙井市', '和龙市', '汪清县', '安图县'],
    '黑龙江省': ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭', '加格达奇', '尚志', '五常', '海林', '宁安', '绥芬河', '东宁', '穆棱', '密山', '虎林', '北安', '五大连池', '铁力', '同江', '富锦', '抚远', '漠河', '呼玛', '塔河', '安达', '肇东', '海伦'],
    '江苏省': ['南京', '苏州', '无锡', '常州', '徐州', '南通', '扬州', '盐城', '淮安', '连云港', '镇江', '泰州', '宿迁', '昆山', '常熟', '张家港', '太仓', '江阴', '宜兴', '邳州', '新沂', '溧阳', '句容', '丹阳', '扬中', '靖江', '兴化', '泰兴', '仪征', '高邮', '海门', '启东', '东台', '大丰', '射阳', '阜宁', '滨海', '响水', '涟水', '金湖', '盱眙', '宝应'],
    '浙江省': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水', '萧山', '建德', '富阳', '临安', '余姚', '慈溪', '奉化', '乐清', '瑞安', '永康', '义乌', '东阳', '浦江', '磐安', '兰溪', '温岭', '临海', '玉环', '龙泉', '青田', '云和', '庆元', '缙云', '遂昌', '松阳', '龙游', '常山', '开化'],
    '安徽省': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城', '肥东', '肥西', '长丰', '庐江', '无为', '和县', '含山', '凤台', '寿县', '当涂', '怀远', '五河', '固镇', '天长', '明光', '全椒', '定远', '来安', '临泉', '太和', '阜南', '颍上', '界首', '萧县', '砀山', '灵璧', '泗县', '霍邱', '舒城', '金寨', '霍山', '涡阳', '蒙城', '石台', '青阳', '郎溪', '广德', '宁国', '绩溪', '旌德', '歙县', '休宁', '祁门', '黟县'],
    '福建省': ['福州', '厦门', '泉州', '漳州', '莆田', '宁德', '南平', '三明', '龙岩', '福清', '长乐', '闽侯', '连江', '罗源', '闽清', '永泰', '平潭', '石狮', '晋江', '南安', '惠安', '安溪', '永春', '德化', '金门', '仙游', '思明', '海沧', '湖里', '集美', '同安', '翔安', '鼓楼', '台江', '仓山', '马尾', '晋安', '长乐区', '新罗', '漳平', '永定', '上杭', '武平', '长汀', '连城', '蕉城', '福安', '福鼎', '霞浦', '古田', '屏南', '寿宁', '周宁', '柘荣', '梅列', '三元', '永安', '明溪', '清流', '宁化', '大田', '尤溪', '沙县', '将乐', '泰宁', '建宁', '延平', '顺昌', '浦城', '光泽', '松溪', '政和', '邵武', '武夷山', '建瓯', '建阳'],
    '江西省': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶', '南昌县', '新建', '进贤', '安义', '乐平', '浮梁', '莲花', '上栗', '芦溪', '瑞昌', '共青城', '庐山', '武宁', '修水', '永修', '德安', '星子', '都昌', '湖口', '彭泽', '浔阳', '柴桑', '渝水', '分宜', '月湖', '余江', '贵溪', '章贡', '南康', '赣县', '信丰', '大余', '上犹', '崇义', '安远', '龙南', '定南', '全南', '宁都', '于都', '兴国', '会昌', '寻乌', '石城', '瑞金', '吉州', '青原', '吉安县', '吉水', '峡江', '新干', '永丰', '泰和', '遂川', '万安', '安福', '永新', '井冈山', '袁州', '奉新', '万载', '上高', '宜丰', '靖安', '铜鼓', '丰城', '樟树', '高安', '临川', '东乡', '南城', '黎川', '南丰', '崇仁', '乐安', '宜黄', '金溪', '资溪', '广昌', '信州', '上饶县', '广丰', '玉山', '铅山', '横峰', '弋阳', '余干', '鄱阳', '万年', '婺源', '德兴'],
    '山东省': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽', '章丘', '平阴', '商河', '莱芜', '胶州', '即墨', '平度', '莱西', '滕州', '龙口', '莱阳', '莱州', '蓬莱', '招远', '栖霞', '海阳', '青州', '诸城', '寿光', '安丘', '高密', '昌邑', '曲阜', '兖州', '邹城', '微山', '鱼台', '金乡', '嘉祥', '汶上', '泗水', '梁山县', '新泰', '肥城', '宁阳', '东平县', '荣成', '乳山', '文登', '五莲', '莒县', '沂南', '郯城', '沂水', '兰陵', '费县', '平邑', '莒南', '蒙阴', '临沭', '德城区', '陵城区', '乐陵', '禹城', '宁津', '庆云', '临邑', '齐河', '平原县', '夏津', '武城', '阳谷', '茌平', '东阿', '冠县', '高唐', '临清', '滨城区', '沾化区', '惠民县', '阳信县', '无棣县', '博兴县', '邹平市', '牡丹区', '定陶区', '曹县', '单县', '成武县', '巨野县', '郓城县', '鄄城县', '东明县'],
    '河南省': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源', '巩义', '新郑', '新密', '登封', '荥阳', '中牟', '杞县', '通许', '尉氏', '兰考', '偃师', '孟津', '新安', '栾川', '嵩县', '汝阳', '宜阳', '洛宁', '伊川', '舞钢', '汝州', '林州', '安阳县', '汤阴', '滑县', '内黄', '淇县', '浚县', '新乡县', '获嘉', '原阳', '延津', '封丘', '长垣', '卫辉', '辉县', '修武', '博爱', '武陟', '温县', '沁阳', '孟州', '清丰', '南乐', '范县', '台前', '濮阳县', '禹州', '长葛', '鄢陵', '襄城', '舞阳', '临颍', '渑池', '义马', '灵宝', '陕州区', '卢氏', '南召', '西峡', '镇平', '内乡', '淅川', '社旗', '唐河', '新野', '桐柏', '邓州', '民权', '睢县', '宁陵', '柘城', '虞城', '夏邑', '永城', '罗山', '光山', '新县', '商城', '固始', '潢川', '淮滨', '息县', '项城', '扶沟', '西华', '商水', '沈丘', '鄢陵', '太康', '鹿邑', '西平', '上蔡', '平舆', '正阳', '确山', '泌阳', '汝南', '遂平', '新蔡', '新蔡'],
    '湖北省': ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门', '神农架', '大冶', '阳新', '丹江口', '郧阳', '郧西', '竹山', '竹溪', '房县', '枝江', '当阳', '远安', '兴山', '秭归', '长阳', '五峰', '宜都', '保康', '老河口', '枣阳', '宜城', '南漳', '谷城', '沙洋', '钟祥', '京山', '应城', '安陆', '大悟', '孝昌', '汉川', '应城', '黄州', '团风', '红安', '罗田', '英山', '浠水', '蕲春', '黄梅', '武穴', '麻城', '赤壁', '嘉鱼', '通城', '崇阳', '通山', '广水', '曾都区', '随县', '恩施市', '利川市', '建始', '巴东', '宣恩', '咸丰', '来凤', '鹤峰'],
    '湖南省': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西', '浏阳', '宁乡', '长沙县', '醴陵', '攸县', '茶陵', '炎陵', '湘乡', '韶山', '衡阳县', '衡南县', '衡山县', '衡东县', '祁东县', '耒阳', '常宁', '邵阳县', '新邵', '邵东', '隆回', '洞口', '绥宁', '新宁', '城步', '武冈', '岳阳县', '华容', '湘阴', '平江', '汨罗', '临湘', '石门', '澧县', '临澧', '桃源', '安乡', '津市', '慈利', '桑植', '安化', '桃江', '南县', '沅江', '资兴', '桂阳', '宜章', '永兴', '嘉禾', '临武', '汝城', '桂东', '安仁', '祁阳', '东安', '双牌', '道县', '江永', '宁远', '蓝山', '新田', '江华', '鹤城', '中方', '沅陵', '辰溪', '溆浦', '麻阳', '新晃', '芷江', '靖州', '通道', '洪江', '冷水江', '涟源', '双峰', '吉首', '泸溪', '凤凰', '花垣', '保靖', '古丈', '永顺', '龙山'],
    '广东省': ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮', '番禺', '花都', '南沙', '增城', '从化', '乐昌', '南雄', '曲江', '始兴', '翁源', '乳源', '新丰', '仁化', '武江区', '浈江区', '曲江区', '斗门区', '金湾区', '香洲区', '龙湖区', '金平区', '潮阳区', '潮南区', '澄海区', '南澳县', '禅城区', '南海区', '顺德区', '三水区', '高明区', '新会区', '台山区', '开平市', '鹤山市', '恩平市', '蓬江区', '江海区', '赤坎区', '霞山区', '坡头区', '麻章区', '遂溪县', '徐闻县', '雷州市', '吴川市', '高要区', '四会市', '广宁县', '怀集县', '封开县', '德庆县', '端州区', '鼎湖区', '梅江区', '梅县区', '大埔', '丰顺', '五华', '平远', '蕉岭', '兴宁市', '海丰县', '陆河县', '陆丰市', '源城区', '紫金县', '龙川县', '连平县', '和平县', '东源县', '江城区', '阳东区', '阳西县', '阳春市', '清城区', '清新区', '佛冈县', '阳山县', '连山', '连南', '英德市', '连州市', '湘桥区', '潮安区', '饶平县', '榕城区', '揭东区', '揭西县', '惠来县', '普宁市', '云城区', '云安区', '新兴县', '郁南县', '罗定市', '莞城区', '南城区', '万江区', '石碣', '石龙', '茶山', '石排', '企石', '横沥', '桥头', '谢岗', '东坑', '常平', '寮步', '大朗', '大岭山', '厚街', '沙田', '道滘', '洪梅', '麻涌', '望牛墩', '中堂', '高埗', '松山湖'],
    '海南省': ['海口', '三亚', '三沙', '儋州', '五指山', '琼海', '文昌', '万宁', '东方', '定安', '屯昌', '澄迈县', '临高县', '白沙县', '昌江县', '乐东县', '陵水县', '保亭县', '琼中县'],
    '四川省': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山', '都江堰', '彭州', '邛崃', '崇州', '简阳', '金堂', '大邑', '蒲江', '新都', '温江', '双流', '郫都', '新津', '荣县', '富顺', '米易', '盐边', '合江', '叙永', '古蔺', '中江', '罗江', '北川', '平武', '梓潼', '三台', '盐亭', '广汉', '什邡', '绵竹', '青川', '剑阁', '苍溪', '蓬溪', '大英', '射洪', '威远', '资中', '隆昌', '井研', '夹江', '沐川', '峨眉山', '峨眉山市', '犍为', '马边', '峨边', '西充', '南部', '营山', '蓬安', '仪陇', '阆中', '彭山', '仁寿', '洪雅', '丹棱', '青神', '宜宾县', '南溪区', '江安', '长宁', '高县', '珙县', '筠连', '兴文', '屏山', '岳池', '武胜', '邻水', '华蓥', '通川区', '达川区', '宣汉', '开江', '大竹', '渠县', '万源市', '名山区', '荥经', '汉源', '石棉', '天全', '芦山', '宝兴', '巴州区', '恩阳区', '通江县', '南江县', '平昌县', '雁江区', '乐至县', '马尔康', '汶川', '理县', '茂县', '松潘', '九寨沟', '若尔盖', '红原', '阿坝县', '壤塘县', '康定', '泸定', '丹巴', '九龙', '雅江', '道孚', '理塘', '巴塘', '乡城', '稻城', '得荣', '西昌', '德昌', '会理', '会东', '宁南', '普格', '布拖', '金阳', '昭觉', '喜德', '冕宁', '越西', '甘洛', '美姑', '雷波', '木里'],
    '贵州省': ['贵阳', '遵义', '六盘水', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南', '清镇', '修文', '息烽', '开阳', '白云区', '花溪区', '乌当区', '观山湖区', '红花岗区', '汇川区', '播州区', '赤水市', '仁怀市', '桐梓县', '绥阳县', '正安县', '道真县', '务川县', '凤冈县', '湄潭县', '余庆县', '习水县', '钟山区', '六枝特区', '水城县', '盘州市', '西秀区', '平坝区', '普定县', '镇宁县', '关岭县', '紫云县', '七星关区', '大方县', '黔西县', '金沙县', '织金县', '纳雍县', '威宁县', '赫章县', '碧江区', '万山区', '江口县', '玉屏县', '石阡县', '思南县', '印江县', '德江县', '沿河县', '松桃县', '兴义市', '兴仁市', '普安县', '晴隆县', '贞丰县', '望谟县', '册亨县', '安龙县', '凯里市', '黄平县', '施秉县', '三穗县', '镇远县', '岑巩县', '天柱县', '锦屏县', '剑河县', '台江县', '黎平县', '榕江县', '从江县', '雷山县', '麻江县', '丹寨县', '都匀市', '福泉市', '荔波县', '贵定县', '瓮安县', '独山县', '平塘县', '罗甸县', '长顺县', '龙里县', '惠水县', '三都县'],
    '云南省': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆', '安宁', '富民', '嵩明', '呈贡区', '晋宁区', '宜良县', '石林县', '禄劝县', '寻甸县', '东川区', '麒麟区', '沾益区', '马龙区', '宣威市', '陆良县', '师宗县', '罗平县', '富源县', '会泽县', '澄江市', '通海县', '华宁县', '易门县', '峨山县', '新平县', '元江县', '隆阳区', '施甸县', '龙陵县', '昌宁县', '腾冲市', '昭阳区', '鲁甸县', '巧家县', '盐津县', '大关县', '永善县', '绥江县', '镇雄县', '彝良县', '威信县', '水富市', '古城区', '玉龙县', '永胜县', '华坪县', '宁蒗县', '思茅区', '宁洱县', '墨江县', '景东县', '景谷县', '镇沅县', '江城县', '孟连县', '澜沧县', '西盟县', '临翔区', '凤庆县', '云县', '永德县', '镇康县', '双江县', '耿马县', '沧源县', '楚雄市', '双柏县', '牟定县', '南华县', '姚安县', '大姚县', '永仁县', '元谋县', '武定县', '禄丰县', '个旧市', '开远市', '蒙自市', '弥勒市', '屏边县', '建水县', '石屏县', '泸西县', '元阳县', '红河县', '金平县', '绿春县', '河口县', '文山市', '砚山县', '西畴县', '麻栗坡县', '马关县', '丘北县', '广南县', '富宁县', '景洪市', '勐海县', '勐腊县', '大理市', '漾濞县', '祥云县', '宾川县', '弥渡县', '南涧县', '巍山县', '永平县', '云龙县', '洱源县', '剑川县', '鹤庆县', '瑞丽市', '芒市', '梁河县', '盈江县', '陇川县', '泸水市', '福贡县', '贡山县', '兰坪县', '香格里拉市', '德钦县', '维西县'],
    '陕西省': ['西安', '宝鸡', '咸阳', '铜川', '渭南', '延安', '汉中', '榆林', '安康', '商洛', '西咸新区', '高陵区', '临潼区', '阎良区', '长安区', '鄠邑区', '蓝田县', '周至县', '渭滨区', '金台区', '陈仓区', '凤翔县', '岐山县', '扶风县', '眉县', '陇县', '千阳县', '麟游县', '凤县', '太白县', '秦都区', '渭城区', '杨陵区', '兴平市', '彬州市', '三原县', '泾阳县', '乾县', '礼泉县', '永寿县', '长武县', '旬邑县', '淳化县', '武功县', '王益区', '印台区', '耀州区', '宜君县', '临渭区', '华州区', '韩城市', '华阴市', '潼关县', '大荔县', '合阳县', '澄城县', '蒲城县', '白水县', '富平县', '宝塔区', '安塞区', '延长县', '延川县', '子长市', '志丹县', '吴起县', '甘泉县', '富县', '洛川县', '宜川县', '黄龙县', '黄陵县', '汉台区', '南郑区', '城固县', '洋县', '西乡县', '勉县', '宁强县', '略阳县', '镇巴县', '留坝县', '佛坪县', '榆阳区', '横山区', '神木市', '府谷县', '靖边县', '定边县', '绥德县', '米脂县', '佳县', '吴堡县', '清涧县', '子洲县', '汉滨区', '汉阴县', '石泉县', '宁陕县', '紫阳县', '岚皋县', '平利县', '镇坪县', '旬阳县', '白河县', '商州区', '洛南县', '丹凤县', '商南县', '山阳县', '镇安县', '柞水县'],
    '甘肃省': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南', '永登县', '榆中县', '皋兰县', '红古区', '西固区', '安宁区', '七里河区', '城关区', '文殊镇', '峪泉镇', '新城镇', '金川区', '永昌县', '白银区', '平川区', '靖远县', '会宁县', '景泰县', '秦州区', '麦积区', '清水县', '秦安县', '甘谷县', '武山县', '张家川县', '凉州区', '民勤县', '古浪县', '天祝县', '甘州区', '肃南县', '民乐县', '临泽县', '高台县', '山丹县', '崆峒区', '泾川县', '灵台县', '崇信县', '华亭市', '庄浪县', '静宁县', '肃州区', '玉门市', '敦煌市', '金塔县', '瓜州县', '肃北县', '阿克塞县', '西峰区', '庆城县', '环县', '华池县', '合水县', '正宁县', '宁县', '镇原县', '安定区', '通渭县', '陇西县', '渭源县', '临洮县', '漳县', '岷县', '武都区', '成县', '文县', '宕昌县', '康县', '西和县', '礼县', '徽县', '两当县', '临夏市', '临夏县', '康乐县', '永靖县', '广河县', '和政县', '东乡县', '积石山县', '合作市', '临潭县', '卓尼县', '舟曲县', '迭部县', '玛曲县', '碌曲县', '夏河县'],
    '青海省': ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西', '湟中县', '湟源县', '大通县', '乐都区', '平安区', '民和县', '互助县', '化隆县', '循化县', '海晏县', '祁连县', '刚察县', '门源县', '同仁县', '尖扎县', '泽库县', '河南县', '共和县', '同德县', '贵德县', '兴海县', '贵南县', '玛沁县', '班玛县', '甘德县', '达日县', '久治县', '玛曲县', '称多县', '治多县', '杂多县', '囊谦县', '曲麻莱县', '格尔木市', '德令哈市', '乌兰县', '都兰县', '天峻县', '茫崖市', '大柴旦', '冷湖', '茫崖'],
    '台湾省': ['台北', '新北', '桃园', '台中', '台南', '高雄', '基隆', '新竹', '嘉义', '彰化', '宜兰', '苗栗', '南投', '云林', '屏东', '花莲', '台东', '澎湖', '金门', '连江'],
    '内蒙古自治区': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安', '锡林郭勒', '阿拉善', '武川县', '清水河县', '和林县', '土左旗', '托县', '固阳县', '土右旗', '九原区', '石拐区', '白云矿区', '达茂旗', '乌达区', '海南区', '海勃湾区', '红山区', '元宝山区', '松山区', '阿鲁科尔沁旗', '巴林左旗', '巴林右旗', '林西县', '克什克腾旗', '翁牛特旗', '喀喇沁旗', '宁城县', '敖汉旗', '科尔沁区', '科尔沁左翼中旗', '科尔沁左翼后旗', '开鲁县', '库伦旗', '奈曼旗', '扎鲁特旗', '霍林郭勒市', '东胜区', '康巴什区', '达拉特旗', '准格尔旗', '鄂托克前旗', '鄂托克旗', '杭锦旗', '乌审旗', '伊金霍洛旗', '海拉尔区', '扎赉诺尔区', '满洲里市', '牙克石市', '扎兰屯市', '额尔古纳市', '根河市', '阿荣旗', '鄂温克旗', '陈巴尔虎旗', '新巴尔虎左旗', '新巴尔虎右旗', '莫旗', '鄂伦春旗', '阿尔山市', '科尔沁右翼前旗', '科尔沁右翼中旗', '扎赉特旗', '阿尔山', '突泉县', '乌兰浩特市', '锡林浩特市', '二连浩特市', '阿巴嘎旗', '苏尼特左旗', '苏尼特右旗', '东乌珠穆沁旗', '西乌珠穆沁旗', '太仆寺旗', '镶黄旗', '正镶白旗', '正蓝旗', '多伦县', '阿拉善左旗', '阿拉善右旗', '额济纳旗'],
    '广西壮族自治区': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左', '武鸣区', '邕宁区', '良庆区', '西乡塘区', '江南区', '青秀区', '兴宁区', '横县', '上林县', '隆安县', '马山县', '宾阳县', '柳江区', '柳城县', '鹿寨县', '融安县', '融水县', '三江县', '秀峰区', '叠彩区', '象山区', '七星区', '雁山区', '临桂区', '阳朔县', '灵川县', '全州县', '兴安县', '永福县', '灌阳县', '龙胜县', '资源县', '平乐县', '荔浦市', '恭城县', '万秀区', '长洲区', '龙圩区', '岑溪市', '苍梧县', '藤县', '蒙山县', '海城区', '银海区', '铁山港区', '合浦县', '港口区', '防城区', '东兴市', '上思县', '钦南区', '钦北区', '灵山县', '浦北县', '港北区', '港南区', '覃塘区', '桂平市', '平南县', '玉州区', '福绵区', '北流市', '容县', '陆川县', '博白县', '兴业县', '右江区', '田阳区', '田东县', '平果县', '德保县', '那坡县', '凌云县', '乐业县', '田林县', '西林县', '隆林县', '靖西市', '八步区', '平桂区', '昭平县', '钟山县', '富川县', '金城江区', '宜州区', '南丹县', '天峨县', '凤山县', '东兰县', '罗城县', '环江县', '巴马县', '都安县', '大化县', '来宾市', '合山市', '忻城县', '象州县', '武宣县', '金秀县', '江州区', '扶绥县', '宁明县', '龙州县', '大新县', '天等县', '凭祥市'],
    '西藏自治区': ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里', '城关区', '堆龙德庆区', '达孜区', '尼木县', '当雄县', '曲水县', '墨竹工卡县', '桑珠孜区', '南木林县', '江孜县', '定日县', '萨迦县', '拉孜县', '昂仁县', '谢通门县', '白朗县', '仁布县', '康马县', '定结县', '仲巴县', '亚东县', '吉隆县', '聂拉木县', '萨嘎县', '岗巴县', '卡若区', '江达县', '贡觉县', '类乌齐县', '丁青县', '察雅县', '八宿县', '左贡县', '芒康县', '洛隆县', '边坝县', '巴宜区', '工布江达县', '米林县', '墨脱县', '波密县', '察隅县', '朗县', '乃东区', '扎囊县', '贡嘎县', '桑日县', '琼结县', '曲松县', '措美县', '洛扎县', '加查县', '隆子县', '错那县', '浪卡子县', '色尼区', '嘉黎县', '比如县', '聂荣县', '安多县', '申扎县', '索县', '班戈县', '巴青县', '尼玛县', '双湖县', '普兰县', '札达县', '噶尔县', '日土县', '革吉县', '改则县', '措勤县'],
    '宁夏回族自治区': ['银川', '石嘴山', '吴忠', '固原', '中卫', '兴庆区', '西夏区', '金凤区', '永宁县', '贺兰县', '灵武市', '大武口区', '惠农区', '平罗县', '利通区', '红寺堡区', '盐池县', '同心县', '青铜峡市', '原州区', '西吉县', '隆德县', '泾源县', '彭阳县', '沙坡头区', '中宁县', '海原县'],
    '新疆维吾尔自治区': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '阿克苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰', '博尔塔拉', '巴音郭楞', '昌吉', '克孜勒苏', '石河子', '阿拉尔', '图木舒克', '五家渠', '北屯市', '铁门关市', '双河市', '可克达拉市', '昆玉市', '胡杨河市', '天山区', '沙依巴克区', '新市区', '水磨沟区', '头屯河区', '达坂城区', '米东区', '乌鲁木齐县', '独山子区', '白碱滩区', '乌尔禾区', '高昌区', '鄯善县', '托克逊县', '伊州区', '巴里坤县', '伊吾县', '阿克苏市', '温宿县', '库车市', '沙雅县', '新和县', '拜城县', '乌什县', '阿瓦提县', '柯坪县', '喀什市', '疏附县', '疏勒县', '英吉沙县', '泽普县', '莎车县', '叶城县', '麦盖提县', '岳普湖县', '伽师县', '巴楚县', '塔什库尔干县', '和田市', '和田县', '墨玉县', '皮山县', '洛浦县', '策勒县', '于田县', '民丰县', '伊宁市', '奎屯市', '霍尔果斯市', '伊宁县', '察布查尔县', '霍城县', '巩留县', '新源县', '昭苏县', '特克斯县', '尼勒克县', '塔城市', '乌苏市', '额敏县', '沙湾县', '托里县', '裕民县', '和布克赛尔县', '阿勒泰市', '布尔津县', '富蕴县', '福海县', '哈巴河县', '青河县', '吉木乃县', '博乐市', '阿拉山口市', '精河县', '温泉县', '库尔勒市', '轮台县', '尉犁县', '若羌县', '且末县', '焉耆县', '和静县', '和硕县', '博湖县', '昌吉市', '阜康市', '呼图壁县', '玛纳斯县', '奇台县', '吉木萨尔县', '木垒县', '阿图什市', '阿克陶县', '阿合奇县', '乌恰县'],
    '香港特别行政区': ['香港', '中西区', '湾仔区', '东区', '南区', '油尖旺区', '深水埗区', '九龙城区', '黄大仙区', '观塘区', '北区', '大埔区', '沙田区', '西贡区', '荃湾区', '屯门区', '元朗区', '葵青区', '离岛区'],
    '澳门特别行政区': ['澳门']
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

function getCitiesByProvince(provinceName) {
    provinceName = provinceName.trim();
    if (provinceCities[provinceName]) {
        return provinceCities[provinceName];
    }
    return [];
}

function getAllProvinces() {
    return Object.keys(provinceCities);
}

function initProvinceSelector() {
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');
    
    if (provinceSelect && citySelect) {
        const provinces = getAllProvinces();
        
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
        
        provinceSelect.addEventListener('change', function() {
            const selectedProvince = this.value;
            citySelect.innerHTML = '<option value="">选择城市</option>';
            
            if (selectedProvince) {
                const cities = getCitiesByProvince(selectedProvince);
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
                citySelect.disabled = false;
            } else {
                citySelect.disabled = true;
            }
        });
        
        citySelect.addEventListener('change', function() {
            const selectedCity = this.value;
            if (selectedCity) {
                document.getElementById('cityInput').value = selectedCity;
                const matchedCity = findCity(selectedCity);
                if (matchedCity) {
                    const cityData = cityDatabase[matchedCity];
                    renderCityContent(cityData, matchedCity);
                    recordSearch(matchedCity);
                } else {
                    alert('未找到该城市，请尝试其他城市');
                }
            }
        });
    }
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
                <h3 class="section-title">🗺️ 推荐路线</h3>
                <div class="routes">
                    ${cityData.routes.map(route => `<div class="route-item">${route}</div>`).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🍜 特色美食</h3>
                <div class="foods">
                    ${cityData.foods.map(food => `
                        <div class="food-item">
                            <span class="food-name">${food.name}${food.mustTry ? ' 🎯' : ''}</span>
                            <span class="food-desc">${food.desc}</span>
                            <span class="food-price">${food.price}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🏨 住宿推荐</h3>
                <div class="accommodations">
                    ${cityData.accommodations.map(accommodation => `
                        <div class="accommodation-item">
                            <span class="accommodation-area">${accommodation.area}</span>
                            <span class="accommodation-pros">✅ ${accommodation.pros}</span>
                            <span class="accommodation-cons">❌ ${accommodation.cons}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">🚗 交通指南</h3>
                <div class="transport">
                    ${cityData.transport.map(transport => `
                        <div class="transport-item">
                            <span class="transport-type">${transport.type}：</span>
                            <span class="transport-info">${transport.info}</span>
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
                <h3 class="section-title">🎨 海报设计</h3>
                <div class="poster-design">
                    <h4>设计主题：${cityData.poster.title}</h4>
                    <p>副标题：${cityData.poster.subtitle}</p>
                    <p>设计元素：${cityData.poster.elements.join('、')}</p>
                    <p>布局：${cityData.poster.layout}</p>
                    <p>配色方案：${cityData.poster.colors.join('、')}</p>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">📅 行程安排</h3>
                <div class="itinerary">
                    <h4>${selectedDays}天行程</h4>
                    <div class="itinerary-routes">
                        ${itinerary.routes.map(route => `
                            <div class="itinerary-route">
                                <span class="route-time">${route.time}</span>
                                <span class="route-activity">${route.morning || route.afternoon || route.afternoon2 || route.evening || route.morning2 || route.afternoon3}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="itinerary-tips">
                        <h5>旅行贴士：</h5>
                        <ul>
                            ${itinerary.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="itinerary-budget">
                        <h5>预算参考：${itinerary.budget}</h5>
                    </div>
                </div>
            </div>
        `;
        
        loading.classList.add('hidden');
    }, 500);
}

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
    
    seasonBadge.textContent = badgeText;
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

// 初始化
loadSearchStats();
updateSeasonBadge();
initProvinceSelector();
setInterval(simulateRealTimeUpdate, 30000);

// 天数选择按钮事件监听器
const dayButtons = document.querySelectorAll('.day-btn');
dayButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        dayButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedDays = parseInt(this.dataset.days);
    });
});

// 自定义天数应用按钮事件监听器
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

// 生成攻略按钮事件监听器
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

// 回车键事件监听器
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') document.getElementById('generateBtn').click();
});

// 快捷按钮事件监听器
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('cityInput').value = this.dataset.city;
        document.getElementById('generateBtn').click();
    });
});