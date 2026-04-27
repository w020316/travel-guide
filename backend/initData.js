const mongoose = require('mongoose');
const City = require('./models/City');

// 从app_fixed.js中复制的城市数据
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
            { name: '鲅鱼水饺', desc: '青岛特色美食', price: '30-50元/份' }
        ],
        accommodations: [
            { area: '市南区', pros: '靠近海边，景点集中', cons: '价格较高，人流量大' },
            { area: '市北区', pros: '交通便利，价格实惠', cons: '距离海边较远' },
            { area: '崂山区', pros: '环境优美，靠近崂山', cons: '价格较高，距离市中心较远' }
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
                { name: '栈桥', url: 'https://www.qingdaozhanqiao.com/', mustVisit: true },
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
            title: '海滨之城',
            subtitle: '啤酒之都，海洋风情',
            elements: ['栈桥', '崂山', '啤酒博物馆', '金沙滩'],
            layout: '顶部栈桥，中央崂山，底部啤酒博物馆',
            colors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '栈桥 → 八大关' },
                    { time: '12:00-14:00', afternoon: '午餐（海鲜）' },
                    { time: '14:00-17:00', afternoon2: '啤酒博物馆 → 五四广场' },
                    { time: '18:00-21:00', evening: '金沙滩' }
                ],
                tips: ['啤酒博物馆需要预约', '金沙滩建议下午去'],
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
    }
};

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/travel-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB数据库连接成功');
  
  // 导入城市数据
  try {
    for (const [cityName, cityData] of Object.entries(cityDatabase)) {
      // 查找是否已有该城市
      let city = await City.findOne({ name: cityName });
      
      if (city) {
        // 更新现有城市数据
        city = Object.assign(city, cityData);
        city.updatedAt = new Date();
      } else {
        // 创建新城市数据
        city = new City({ name: cityName, ...cityData });
      }
      
      await city.save();
      console.log(`城市${cityName}数据导入成功`);
    }
    
    console.log('所有城市数据导入完成');
  } catch (error) {
    console.error('导入城市数据失败:', error);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('MongoDB数据库连接失败:', err);
  process.exit(1);
});