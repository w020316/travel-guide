const cityDatabase = {
    '北京': {
        tags: ['历史古都', '现代都市', '文化中心'],
        season: '春秋两季最佳（3-5月、9-11月）',
        atmosphere: '厚重庄严与现代活力交融',
        days: '4-5天',
        routes: ['天安门广场 → 故宫 → 景山公园', '长城（八达岭/慕田峪）→ 奥林匹克公园', '颐和园 → 圆明园 → 北大清华', '天坛 → 胡同文化游 → 什刹海', '博物馆之旅（国家博物馆/军博）'],
        foods: [
            { name: '北京烤鸭', desc: '皮脆肉嫩，必吃推荐，全聚德/便宜坊', price: '150-300元/人' },
            { name: '炸酱面', desc: '老北京传统面食，地道口味', price: '20-50元/人' },
            { name: '豆汁焦圈', desc: '特色早餐，体验老北京风味', price: '15-30元/人' },
            { name: '卤煮火烧', desc: '经典京味小吃', price: '20-40元/人' },
            { name: '艾窝窝', desc: '传统宫廷点心', price: '10-20元/人' }
        ],
        accommodations: [
            { area: '王府井/前门', pros: '交通便利，靠近景点', cons: '价格较高，人流密集' },
            { area: '三里屯/工体', pros: '夜生活丰富，时尚便利', cons: '离部分景点较远' },
            { area: '西单', pros: '购物方便，性价比高', cons: '景点相对分散' }
        ],
        transport: [
            { type: '内部交通', info: '地铁发达，覆盖全城；公交便宜' },
            { type: '外部交通', info: '首都机场、大兴机场；北京站、北京西站、北京南站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['身份证必带（景点验票）', '提前预约故宫、长城门票', '春秋带外套，早晚温差大', '准备舒适的步行鞋'],
            avoid: ['不要在景点周边买纪念品', '避开早高峰乘地铁', '不要相信黑导游', '天坛东门有假庙门']
        },
        links: {
            official: 'https://www.ebeijing.gov.cn/',
            attractions: [
                { name: '故宫博物院', url: 'https://www.dpm.org.cn/' },
                { name: '长城', url: 'https://www.badaling.gov.cn/' },
                { name: '颐和园', url: 'https://www.summerpalace.com/' },
                { name: '天坛', url: 'https://www.tiantanpark.com/' }
            ],
            booking: [
                { name: '故宫预约', url: 'https://www.dpm.org.cn/' },
                { name: '长城门票', url: 'https://www.badaling.gov.cn/' }
            ],
            food: [
                { name: '全聚德', url: 'https://www.quanjude.com.cn/' },
                { name: '北京美食攻略', url: 'https://www.dianping.com/beijing' }
            ]
        },
        poster: {
            title: '京城时光',
            subtitle: '穿越千年，遇见北京',
            elements: ['故宫红墙金瓦', '长城蜿蜒起伏', '胡同灰砖灰瓦', '现代都市天际线'],
            layout: '中央大字标题，底部景点剪影环绕，左右两侧美食与住宿图标',
            colors: ['#c9a96e', '#8b4513', '#dc143c', '#2f4f4f', '#ffd700']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '天安门广场 → 故宫', afternoon: '景山公园 → 南锣鼓巷', evening: '什刹海/后海夜游' }
                ],
                tips: ['早起错峰游览故宫', '提前在官网预约门票', '穿舒适的步行鞋'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 天安门 → 故宫', afternoon: 'Day1: 天坛 → 胡同游', evening: 'Day1: 王府井/簋街美食', morning2: 'Day2: 八达岭长城', afternoon2: 'Day2: 奥林匹克公园/鸟巢' }
                ],
                tips: ['长城需提前购票', '第一天晚上可住前门/王府井', '两天时间较紧，建议精选景点'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 天安门 → 故宫 → 景山', afternoon: 'Day1: 天坛', evening: 'Day1: 王府井/前门大街', morning2: 'Day2: 八达岭长城', afternoon2: 'Day2: 明十三陵', evening2: 'Day2: 鸟巢/水立方夜景', morning3: 'Day3: 颐和园 → 圆明园', afternoon3: 'Day3: 北大/清华 → 五道口' }
                ],
                tips: ['故宫周一闭馆', '长城建议早上去', '颐和园很大，建议安排充足时间'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 天安门 → 故宫 → 景山', afternoon: 'Day1: 天坛', evening: 'Day1: 王府井/前门大街', morning2: 'Day2: 八达岭长城', afternoon2: 'Day2: 明十三陵', evening2: 'Day2: 鸟巢/水立方夜景', morning3: 'Day3: 颐和园 → 圆明园', afternoon3: 'Day3: 北大/清华校园', evening3: 'Day3: 三里屯/太古里', morning4: 'Day4: 北海公园 → 恭王府', afternoon4: 'Day4: 雍和宫 → 国子监', evening4: 'Day4: 返程' }
                ],
                tips: ['建议住在地铁沿线', '提前预约热门景点', '带好身份证，部分景点验票'],
                budget: '2500-4000元'
            }
        }
    },
    '上海': {
        tags: ['现代魔都', '海派文化', '购物天堂'],
        season: '3-5月、9-11月',
        atmosphere: '中西合璧，时尚摩登',
        days: '3-4天',
        routes: ['外滩 → 南京路步行街 → 豫园城隍庙', '陆家嘴（东方明珠）→ 上海博物馆 → 田子坊', '迪士尼乐园一日游', '朱家角/七宝古镇 → 徐家汇'],
        foods: [
            { name: '生煎包', desc: '底脆汁多，上海特色', price: '15-30元/人' },
            { name: '小笼包', desc: '皮薄汁鲜，蟹粉最赞', price: '30-80元/人' },
            { name: '红烧肉', desc: '浓油赤酱，本帮经典', price: '40-80元/人' },
            { name: '葱油拌面', desc: '简单却惊艳', price: '20-35元/人' },
            { name: '蟹壳黄', desc: '酥脆香甜', price: '10-20元/人' }
        ],
        accommodations: [
            { area: '外滩/人民广场', pros: '景观绝佳，交通核心', cons: '价格较高' },
            { area: '淮海路/新天地', pros: '时尚购物天堂', cons: '人流较多' },
            { area: '静安寺', pros: '文艺小资氛围浓', cons: '部分景点需打车' }
        ],
        transport: [
            { type: '内部交通', info: '地铁公交覆盖完善；打车便利' },
            { type: '外部交通', info: '浦东机场、虹桥机场；上海站、上海虹桥站' }
        ],
        budget: { low: '2000', medium: '4000', high: '6000+' },
        tips: {
            prepare: ['提前预约东方明珠、迪士尼', '准备好健康码', '带好雨具，梅雨季节注意', '外滩观灯注意安全'],
            avoid: ['不要在南京路买高价商品', '避开早高峰地铁', '景区餐厅慎选', '警惕网红店排队的托']
        },
        links: {
            official: 'https://www.shanghai.gov.cn/',
            attractions: [
                { name: '东方明珠', url: 'https://www.orientalpearl.com/' },
                { name: '外滩', url: 'https://www.thebund.com.cn/' },
                { name: '豫园', url: 'https://www.yuyuan.sh/' },
                { name: '迪士尼', url: 'https://www.shanghaidisneyresort.com/' }
            ],
            booking: [
                { name: '东方明珠预约', url: 'https://www.orientalpearl.com/' },
                { name: '迪士尼门票', url: 'https://www.shanghaidisneyresort.com/' }
            ],
            food: [
                { name: '上海美食', url: 'https://www.dianping.com/shanghai' },
                { name: '本帮菜推荐', url: 'https://www.xiangyang.cn/' }
            ]
        },
        poster: {
            title: '魔都掠影',
            subtitle: '东方巴黎，不夜之城',
            elements: ['外滩建筑群', '陆家嘴天际线', '弄堂剪影', '霓虹夜色'],
            layout: '上下分区，顶部摩天楼剪影，下方美食与购物图标阵列',
            colors: ['#1a1a2e', '#ffd700', '#dc143c', '#4169e1', '#c0c0c0']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '外滩 → 南京路步行街', afternoon: '豫园城隍庙 → 新天地', evening: '陆家嘴夜景/东方明珠' }
                ],
                tips: ['外滩建议傍晚去，看夜景', '迪士尼需要单独一天'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 外滩 → 南京路', afternoon: 'Day1: 豫园 → 城隍庙', evening: 'Day1: 黄浦江夜游/外滩夜景', morning2: 'Day2: 田子坊 → 新天地', afternoon2: 'Day2: 上海博物馆 → 徐家汇' }
                ],
                tips: ['第二天晚上可以去朱家角古镇'],
                budget: '1000-2000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 外滩 → 南京路 → 豫园', afternoon: 'Day1: 老城隍庙小吃', evening: 'Day1: 外滩万国建筑博览', morning2: 'Day2: 陆家嘴（东方明珠/上海中心）', afternoon2: 'Day2: 上海科技馆/博物馆', evening2: 'Day2: 浦东夜景/陆家嘴', morning3: 'Day3: 田子坊 → 新天地 → 武康路', afternoon3: 'Day3: 朱家角/七宝古镇', evening3: 'Day3: 返程' }
                ],
                tips: ['上海地铁很方便，住地铁站附近', '田子坊适合拍照'],
                budget: '2000-3500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 外滩 → 南京路 → 豫园', afternoon: 'Day1: 老城隍庙', evening: 'Day1: 外滩夜景', morning2: 'Day2: 陆家嘴金融区', afternoon2: 'Day2: 上海博物馆/科技馆', evening2: 'Day2: 浦东夜景', morning3: 'Day3: 迪士尼乐园全天', afternoon3: 'Day3: 迪士尼烟花', evening3: 'Day3: 返回市区', morning4: 'Day4: 田子坊 → 新天地 → 武康路', afternoon4: 'Day4: 朱家角古镇', evening4: 'Day4: 返程' }
                ],
                tips: ['迪士尼一定要提前购票', '住人民广场或南京路附近最方便'],
                budget: '3000-5000元'
            }
        }
    },
    '成都': {
        tags: ['美食之都', '休闲之都', '熊猫故乡'],
        season: '3-6月、9-11月',
        atmosphere: '慢生活，茶馆文化',
        days: '3-4天',
        routes: ['宽窄巷子 → 锦里 → 武侯祠', '大熊猫基地 → 杜甫草堂 → 青羊宫', '都江堰 → 青城山', '鹤鸣茶馆 → 人民公园 → 太古里'],
        foods: [
            { name: '火锅', desc: '麻辣鲜香，川味代表', price: '80-150元/人' },
            { name: '串串香', desc: '自选食材，边吃边聊', price: '50-100元/人' },
            { name: '担担面', desc: '红油拌面，香辣可口', price: '15-25元/人' },
            { name: '钟水饺', desc: '皮薄馅嫩，红油够劲', price: '15-30元/人' },
            { name: '赖汤圆', desc: '软糯香甜，传统名点', price: '10-20元/人' }
        ],
        accommodations: [
            { area: '春熙路/太古里', pros: '核心商圈，购物便利', cons: '价格略高' },
            { area: '宽窄巷子附近', pros: '文化氛围浓，游玩方便', cons: '夜间较吵' },
            { area: '锦里/武侯祠', pros: '靠近景点，夜景美', cons: '周边堵车' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景点；公交便宜' },
            { type: '外部交通', info: '双流机场、天府机场；成都站、成都东站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['带好肠胃药，防辣过度', '提前预约熊猫基地', '春熙路小偷多注意', '茶馆体验要尝盖碗茶'],
            avoid: ['不要在景区买火锅底料', '宽窄巷子消费较高', '避开早高峰地铁', '不要相信低价一日游']
        },
        links: {
            official: 'https://www.chengdu.gov.cn/',
            attractions: [
                { name: '大熊猫基地', url: 'https://www.panda.org.cn/' },
                { name: '宽窄巷子', url: 'https://www.kuanzhai.com/' },
                { name: '锦里', url: 'https://www.cdjinli.com/' },
                { name: '都江堰', url: 'https://www.djy517.com/' }
            ],
            booking: [
                { name: '熊猫基地预约', url: 'https://www.panda.org.cn/' },
                { name: '青城山门票', url: 'https://www.qingchengshan.net/' }
            ],
            food: [
                { name: '成都火锅推荐', url: 'https://www.dianping.com/chengdu' },
                { name: '美食街推荐', url: 'https://www.xiian.com/' }
            ]
        },
        poster: {
            title: '成都时光',
            subtitle: '一座来了就不想走的城市',
            elements: ['大熊猫', '宽窄巷子', '火锅美食', '盖碗茶'],
            layout: '左侧熊猫图标，右侧城市剪影，底部美食图标横排',
            colors: ['#ff6b6b', '#2ecc71', '#f39c12', '#9b59b6', '#34495e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '宽窄巷子 → 人民公园', afternoon: '锦里 → 武侯祠', evening: '春熙路/太古里' }
                ],
                tips: ['熊猫基地需要半天以上', '武侯祠傍晚关门'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 大熊猫基地', afternoon: 'Day1: 宽窄巷子 → 人民公园', evening: 'Day1: 锦里夜景 → 小酒馆', morning2: 'Day2: 都江堰 → 青城山', afternoon2: 'Day2: 返回市区 → 春熙路' }
                ],
                tips: ['熊猫基地早上去最好', '青城山建议坐索道'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 大熊猫繁育基地', afternoon: 'Day1: 杜甫草堂 → 青羊宫', evening: 'Day1: 宽窄巷子/鹤鸣茶馆', morning2: 'Day2: 都江堰全天', afternoon2: 'Day2: 青城山后山', evening2: 'Day2: 返回市区', morning3: 'Day3: 武侯祠 → 锦里', afternoon3: 'Day3: 春熙路/太古里购物', evening3: 'Day3: 九眼桥酒吧街' }
                ],
                tips: ['成都美食偏辣，肠胃不好带药', '茶馆体验是成都文化'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 大熊猫基地', afternoon: 'Day1: 杜甫草堂', evening: 'Day1: 宽窄巷子/鹤鸣茶馆', morning2: 'Day2: 都江堰', afternoon2: 'Day2: 青城山前山', evening2: 'Day2: 返回市区', morning3: 'Day3: 武侯祠 → 锦里', afternoon3: 'Day3: 东郊记忆 → 339电视塔', evening3: 'Day3: 九眼桥/兰桂坊', morning4: 'Day4: 青城山后山/街子古镇', afternoon4: 'Day4: 文殊院 → 春熙路', evening4: 'Day4: 返程' }
                ],
                tips: ['成都带不辣的食物较少', '火锅推荐小龙坎、大龙燚'],
                budget: '2000-3500元'
            }
        }
    },
    '杭州': {
        tags: ['人间天堂', '西湖美景', '互联网之都'],
        season: '3-5月、9-11月',
        atmosphere: '诗情画意，江南韵味',
        days: '2-3天',
        routes: ['西湖环湖（断桥→白堤→苏堤→雷峰塔）', '灵隐寺 → 龙井村 → 宋城', '千岛湖/西溪湿地'],
        foods: [
            { name: '东坡肉', desc: '肥而不腻，入口即化', price: '40-80元/人' },
            { name: '西湖醋鱼', desc: '酸甜鲜嫩', price: '50-100元/人' },
            { name: '龙井虾仁', desc: '茶香四溢', price: '60-120元/人' },
            { name: '片儿川', desc: '杭州特色面食', price: '20-35元/人' },
            { name: '定胜糕', desc: '软糯香甜', price: '10-15元/人' }
        ],
        accommodations: [
            { area: '西湖边', pros: '景色绝佳，晨晚皆美', cons: '价格高，节假日拥挤' },
            { area: '河坊街', pros: '古街氛围浓，美食多', cons: '较吵闹' },
            { area: '武林广场', pros: '交通便利，购物方便', cons: '离西湖稍远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景区；公交+共享单车' },
            { type: '外部交通', info: '萧山机场；杭州站、杭州东站' }
        ],
        budget: { low: '1500', medium: '2800', high: '4500+' },
        tips: {
            prepare: ['西湖可租自行车环湖', '灵隐寺早点去人少', '带好防晒', '品龙井茶认准狮峰'],
            avoid: ['不要在西湖边吃高价饭', '避开节假日断桥', '不要买景区假龙井', '灵隐寺外香火慎买']
        },
        links: {
            official: 'https://www.hangzhou.gov.cn/',
            attractions: [
                { name: '西湖', url: 'https://www.gotohz.com/' },
                { name: '灵隐寺', url: 'https://www.lingyinsi.com/' },
                { name: '宋城', url: 'https://www.songcn.com/' },
                { name: '千岛湖', url: 'https://www.qiandaohu.cn/' }
            ],
            booking: [
                { name: '西湖游船预约', url: 'https://www.gotohz.com/' },
                { name: '宋城演出票', url: 'https://www.songcn.com/' }
            ],
            food: [
                { name: '外婆家', url: 'https://www.waipojia.com/' },
                { name: '杭州美食', url: 'https://www.dianping.com/hangzhou' }
            ]
        },
        poster: {
            title: '江南忆',
            subtitle: '最忆是杭州',
            elements: ['三潭印月', '雷峰塔', '断桥残雪', '龙井茶园'],
            layout: '水墨风格，西湖山水为背景，诗词点缀',
            colors: ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '断桥残雪 → 白堤 → 孤山', afternoon: '苏堤 → 雷峰塔', evening: '音乐喷泉/河坊街' }
                ],
                tips: ['西湖建议骑车环湖', '雷峰塔傍晚去可看日落'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 西湖环湖（断桥→苏堤）', afternoon: 'Day1: 雷峰塔 → 南宋御街', evening: 'Day1: 河坊街夜市/音乐喷泉', morning2: 'Day2: 灵隐寺 → 龙井村', afternoon2: 'Day2: 梅家坞茶园 → 宋城' }
                ],
                tips: ['灵隐寺早点去人少', '龙井茶认准狮峰产区'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 西湖断桥 → 白堤 → 孤山', afternoon: 'Day1: 苏堤 → 雷峰塔', evening: 'Day1: 河坊街/南宋御街', morning2: 'Day2: 灵隐寺 → 法喜寺', afternoon2: 'Day2: 龙井村 → 梅家坞', evening2: 'Day2: 西溪湿地夜游', morning3: 'Day3: 千岛湖全天', afternoon3: 'Day3: 返回市区', evening3: 'Day3: 返程' }
                ],
                tips: ['千岛湖需要单独一天', '西溪湿地建议坐摇橹船'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 西湖环湖精华', afternoon: 'Day1: 雷峰塔 → 南宋御街', evening: 'Day1: 河坊街夜市', morning2: 'Day2: 灵隐寺 → 永福寺', afternoon2: 'Day2: 龙井村 → 十里梅林', evening2: 'Day2: 西溪湿地', morning3: 'Day3: 千岛湖全天', afternoon3: 'Day3: 千岛湖夜景', evening3: 'Day3: 返回市区', morning4: 'Day4: 良渚古城遗址', afternoon4: 'Day4: 塘栖古镇/超山', evening4: 'Day4: 返程' }
                ],
                tips: ['杭州景点较分散，建议租车或包车', '春秋季西湖最美'],
                budget: '2500-4000元'
            }
        }
    },
    '西安': {
        tags: ['历史古都', '美食之城', '丝绸之路'],
        season: '3-5月、9-11月',
        atmosphere: '千年古都，历史厚重',
        days: '3-4天',
        routes: ['城墙 → 钟楼鼓楼 → 回民街', '秦始皇兵马俑 → 华清池 → 长恨歌', '大雁塔 → 大唐芙蓉园 → 永兴坊', '陕西历史博物馆 → 碑林 → 书院门'],
        foods: [
            { name: '肉夹馍', desc: '腊汁肉配白吉馍，香', price: '10-20元/人' },
            { name: '羊肉泡馍', desc: '料重味醇', price: '30-60元/人' },
            { name: '凉皮', desc: '酸辣爽口，夏日必备', price: '8-15元/人' },
            { name: 'biangbiang面', desc: '宽面油泼，香辣过瘾', price: '15-30元/人' },
            { name: '甑糕', desc: '软糯香甜', price: '5-10元/人' }
        ],
        accommodations: [
            { area: '钟楼/南门', pros: '核心位置，交通便利', cons: '价格适中' },
            { area: '回民街附近', pros: '美食天堂，夜生活丰富', cons: '较为嘈杂' },
            { area: '大雁塔', pros: '大唐文化氛围浓', cons: '离部分景点较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景点；公交便捷' },
            { type: '外部交通', info: '咸阳国际机场；西安站、西安北站' }
        ],
        budget: { low: '1200', medium: '2200', high: '3500+' },
        tips: {
            prepare: ['城墙骑自行车环游', '提前订兵马俑门票', '带好防晒和外套', '回民街清真食品注意'],
            avoid: ['不要在景点买蓝田玉', '不要信野导', '回民街部分餐厅价格虚高', '长恨歌演出提前订票']
        },
        links: {
            official: 'https://www.xa.gov.cn/',
            attractions: [
                { name: '兵马俑', url: 'https://www.bmy.com.cn/' },
                { name: '城墙', url: 'https://www.xacheng.com/' },
                { name: '大雁塔', url: 'https://www.dayananta.com/' },
                { name: '华清池', url: 'https://www.huaqingjiudian.com/' }
            ],
            booking: [
                { name: '兵马俑预约', url: 'https://www.bmy.com.cn/' },
                { name: '长恨歌演出', url: 'https://www.hqctg.com/' }
            ],
            food: [
                { name: '回民街美食', url: 'https://www.xianstreet.com/' },
                { name: '西安美食', url: 'https://www.dianping.com/xian' }
            ]
        },
        poster: {
            title: '长安十二时辰',
            subtitle: '一眼千年，梦回大唐',
            elements: ['大雁塔', '古城墙', '兵马俑', '钟楼'],
            layout: '古典印章风格，钟楼鼓楼对称呼应，底部秦俑剪影',
            colors: ['#c9a96e', '#8b4513', '#dc143c', '#2f4f4f', '#ffd700']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '城墙骑行 → 钟楼鼓楼', afternoon: '回民街美食 → 大雁塔', evening: '大唐不夜城/音乐喷泉' }
                ],
                tips: ['城墙建议骑自行车', '大雁塔音乐喷泉晚上9点'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 钟楼 → 城墙 → 回民街', afternoon: 'Day1: 大雁塔 → 大唐芙蓉园', evening: 'Day1: 大唐不夜城', morning2: 'Day2: 兵马俑 → 华清池', afternoon2: 'Day2: 长恨歌演出（可选）' }
                ],
                tips: ['兵马俑一定请导游', '华清池建议傍晚去'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 城墙 → 钟楼 → 回民街', afternoon: 'Day1: 碑林 → 书院门', evening: 'Day1: 大雁塔/大唐不夜城', morning2: 'Day2: 兵马俑 → 华清池', afternoon2: 'Day2: 长恨歌演出', evening2: 'Day2: 返回市区', morning3: 'Day3: 陕西历史博物馆', afternoon3: 'Day3: 大唐芙蓉园/永兴坊', evening3: 'Day3: 返程' }
                ],
                tips: ['陕西历史博物馆免费但需预约', '永兴坊美食比回民街便宜'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 城墙骑行 → 钟楼 → 回民街', afternoon: 'Day1: 碑林 → 书院门', evening: 'Day1: 大雁塔/大唐不夜城', morning2: 'Day2: 兵马俑 → 华清池', afternoon2: 'Day2: 骊山 → 长恨歌', evening2: 'Day2: 返回市区', morning3: 'Day3: 陕西历史博物馆 → 大唐芙蓉园', afternoon3: 'Day3: 永兴坊 → 老城根', evening3: 'Day3: 夜游城墙（可选）', morning4: 'Day4: 乾陵 → 法门寺', afternoon4: 'Day4: 返回市区购物', evening4: 'Day4: 返程' }
                ],
                tips: ['乾陵和法门寺需要包车', '西安美食偏酸辣'],
                budget: '2000-3500元'
            }
        }
    },
    '重庆': {
        tags: ['山城雾都', '火锅之都', '魔幻地形'],
        season: '3-5月、9-11月',
        atmosphere: '8D魔幻，立体城市',
        days: '4天3晚',
        routes: ['解放碑 → 洪崖洞 → 千厮门大桥', '李子坝轻轨穿楼 → 鹅岭二厂 → 观音桥', '磁器口古镇 → 白公馆 → 山城步道', '长江索道 → 南山一棵树 → 老火锅'],
        foods: [
            { name: '重庆火锅', desc: '九宫格，麻辣鲜香', price: '80-150元/人' },
            { name: '小面', desc: '重庆早餐必吃，花市豌杂面', price: '8-15元/人' },
            { name: '酸辣粉', desc: '酸辣开胃，八一好吃街', price: '10-18元/人' },
            { name: '串串香', desc: '自选自烫', price: '50-100元/人' },
            { name: '江湖菜', desc: '毛血旺、辣子鸡', price: '60-100元/人' }
        ],
        accommodations: [
            { area: '解放碑/洪崖洞', pros: '交通便利，夜景近在咫尺', cons: '节假日拥挤' },
            { area: '南滨路', pros: '江景房浪漫', cons: '交通略堵' },
            { area: '观音桥', pros: '商圈繁华，美食多', cons: '离部分景点远' }
        ],
        transport: [
            { type: '内部交通', info: '轻轨穿楼是特色；公交+打车；下载渝畅行APP' },
            { type: '外部交通', info: '江北机场；重庆站、重庆北站、重庆西站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['穿防滑运动鞋（日均2万步）', '带薄外套（昼夜温差大）', '火锅从微辣开始', '提前预约长江索道'],
            avoid: ['不要相信导航找洪崖洞', '不要在洪崖洞里面吃饭', '长江索道别从新华路站坐', '不要穿高跟鞋']
        },
        links: {
            official: 'https://www.cq.gov.cn/',
            attractions: [
                { name: '洪崖洞', url: 'https://www.hongyadong.com/' },
                { name: '长江索道', url: 'http://www.cqsxzl.com/' },
                { name: '武隆天生三桥', url: 'https://www.wulong.com/' },
                { name: '磁器口', url: 'https://www.ciqikou.com/' }
            ],
            booking: [
                { name: '长江索道预约', url: 'http://www.cqsxzl.com/' },
                { name: '武隆门票', url: 'https://www.wulong.com/' }
            ],
            food: [
                { name: '珮姐老火锅', url: 'https://www.peijiehotpot.com/' },
                { name: '重庆美食', url: 'https://www.dianping.com/chongqing' }
            ]
        },
        poster: {
            title: '雾都夜话',
            subtitle: '8D魔幻山城',
            elements: ['洪崖洞', '解放碑', '长江索道', '火锅美食'],
            layout: '上下分层，上部江景夜色，下部美食阵列，魔幻8D效果',
            colors: ['#1a1a2e', '#ff6b6b', '#ffd700', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '解放碑 → 长江索道', afternoon: '南山一棵树 → 老君洞', evening: '南滨路夜景/火锅' }
                ],
                tips: ['长江索道单程20元', '南山看夜景绝佳'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 解放碑 → 洪崖洞', afternoon: 'Day1: 长江索道 → 南山一棵树', evening: 'Day1: 南滨路火锅', morning2: 'Day2: 李子坝轻轨 → 鹅岭二厂', afternoon2: 'Day2: 磁器口古镇' }
                ],
                tips: ['洪崖洞晚上去才美', '鹅岭二厂拍照圣地'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 解放碑 → 长江索道', afternoon: 'Day1: 南山一棵树', evening: 'Day1: 南滨路/火锅', morning2: 'Day2: 武隆天生三桥', afternoon2: 'Day2: 仙女山国家森林公园', evening2: 'Day2: 返回市区', morning3: 'Day3: 李子坝轻轨 → 鹅岭二厂', afternoon3: 'Day3: 磁器口 → 白公馆', evening3: 'Day3: 观音桥/九街' }
                ],
                tips: ['武隆需要单独一天', '重庆火锅认准珮姐'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 解放碑 → 洪崖洞', afternoon: 'Day1: 长江索道 → 南山', evening: 'Day1: 南滨路火锅', morning2: 'Day2: 武隆天生三桥', afternoon2: 'Day2: 仙女山', evening2: 'Day2: 返回市区', morning3: 'Day3: 李子坝轻轨 → 鹅岭二厂', afternoon3: 'Day3: 磁器口 → 白公馆', evening3: 'Day3: 观音桥/九街', morning4: 'Day4: 大足石刻', afternoon4: 'Day4: 返回市区购物', evening4: 'Day4: 返程' }
                ],
                tips: ['大足石刻需要半天', '重庆山路多，鞋子很重要'],
                budget: '2500-4000元'
            }
        }
    },
    '广州': {
        tags: ['美食之都', '花城', '岭南文化'],
        season: '10-12月',
        atmosphere: '早茶文化，粤式生活',
        days: '3-4天',
        routes: ['早茶 → 沙面 → 上下九步行街', '广州塔 → 珠江夜游 → 太古汇', '陈家祠 → 圣心大教堂 → 北京路步行街', '白云山/长隆动物园'],
        foods: [
            { name: '早茶点心', desc: '虾饺/烧麦/凤爪必点', price: '80-150元/人' },
            { name: '白切鸡', desc: '皮爽肉滑', price: '60-120元/人' },
            { name: '叉烧饭', desc: '港式经典', price: '30-50元/人' },
            { name: '肠粉', desc: '滑嫩细腻', price: '15-30元/人' },
            { name: '双皮奶', desc: '顺德甜品', price: '15-25元/人' }
        ],
        accommodations: [
            { area: '天河区/珠江新城', pros: 'CBD核心，交通便利', cons: '价格较高' },
            { area: '越秀区/北京路', pros: '老城区，美食多', cons: '交通较堵' },
            { area: '荔湾区/上下九', pros: '岭南风情浓', cons: '设施较旧' }
        ],
        transport: [
            { type: '内部交通', info: '地铁发达；公交+有轨电车；支付宝领广州地铁码' },
            { type: '外部交通', info: '白云机场；广州站、广州南站、广州东站' }
        ],
        budget: { low: '1500', medium: '4000', high: '6000+' },
        tips: {
            prepare: ['早茶体验要早去排队', '广州塔/省博提前预约', '带好防晒和雨具', '长隆动物园提前订票'],
            avoid: ['不要在上下九买假名牌', '早茶店消费注意小费', '避开广交会期间', '珠江夜游选正规游船']
        },
        links: {
            official: 'https://www.gz.gov.cn/',
            attractions: [
                { name: '广州塔', url: 'https://www.cantontower.com/' },
                { name: '长隆动物园', url: 'https://www.chimelong.com/' },
                { name: '沙面', url: 'https://www.shameen.com.cn/' },
                { name: '白云山', url: 'https://www.baiyunshan.com.cn/' }
            ],
            booking: [
                { name: '广州塔门票', url: 'https://www.cantontower.com/' },
                { name: '长隆门票', url: 'https://www.chimelong.com/' }
            ],
            food: [
                { name: '点都德', url: 'https://www.demandue.com/' },
                { name: '广州美食', url: 'https://www.dianping.com/guangzhou' }
            ]
        },
        poster: {
            title: '羊城记',
            subtitle: '食在广州，味在岭南',
            elements: ['广州塔小蛮腰', '早茶点心', '岭南骑楼', '珠江夜景'],
            layout: '左图右文，早茶元素环绕，广州塔剪影标志',
            colors: ['#3498db', '#ff6b6b', '#ffd700', '#2ecc71', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '早茶体验 → 沙面岛', afternoon: '上下九 → 陈家祠', evening: '珠江夜游/广州塔' }
                ],
                tips: ['早茶推荐点都德、陶陶居', '广州塔傍晚去可看日落'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 早茶 → 沙面', afternoon: 'Day1: 陈家祠 → 圣心大教堂', evening: 'Day1: 北京路步行街', morning2: 'Day2: 广州塔 → 广东省博物馆', afternoon2: 'Day2: 太古汇/天河城' }
                ],
                tips: ['圣心大教堂免费参观', '太古汇是购物天堂'],
                budget: '1000-2000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 早茶 → 沙面', afternoon: 'Day1: 上下九 → 陈家祠', evening: 'Day1: 珠江夜游', morning2: 'Day2: 广州塔 → 广东省博物馆', afternoon2: 'Day2: 天河城/太古汇', evening2: 'Day2: 花城广场夜景', morning3: 'Day3: 长隆野生动物世界全天', afternoon3: 'Day3: 长隆国际大马戏（可选）', evening3: 'Day3: 返回市区' }
                ],
                tips: ['长隆动物园建议买VIP', '广州美食偏清淡'],
                budget: '2000-3500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 早茶 → 沙面', afternoon: 'Day1: 圣心大教堂 → 北京路', evening: 'Day1: 珠江夜游', morning2: 'Day2: 广州塔 → 广东省博物馆', afternoon2: 'Day2: 白云山', evening2: 'Day2: 珠江新城', morning3: 'Day3: 长隆野生动物世界', afternoon3: 'Day3: 长隆水上乐园/飞鸟乐园', evening3: 'Day3: 长隆国际大马戏', morning4: 'Day4: 佛山祖庙 → 黄飞鸿纪念馆', afternoon4: 'Day4: 岭南天地 → 清晖园', evening4: 'Day4: 返程' }
                ],
                tips: ['可以坐地铁去佛山', '广州塔门票建议提前订'],
                budget: '3000-5000元'
            }
        }
    },
    '厦门': {
        tags: ['海滨度假', '文艺清新', '闽南文化'],
        season: '3-5月、10-11月',
        atmosphere: '海岛文艺，慢生活',
        days: '4天3晚',
        routes: ['鼓浪屿一日游', '厦门大学 → 南普陀寺 → 环岛路', '集美学村 → 厦门大桥 → 老院子', '曾厝垵 → 胡里山炮台 → 中山路步行街'],
        foods: [
            { name: '沙茶面', desc: '厦门特色，料多汤鲜', price: '20-40元/人' },
            { name: '海蛎煎', desc: '外酥里嫩', price: '20-35元/人' },
            { name: '烧肉粽', desc: '糯米配五花肉', price: '10-20元/人' },
            { name: '土笋冻', desc: '海边特色', price: '10-15元/人' },
            { name: '花生汤', desc: '甜品经典，配油条', price: '8-15元/人' }
        ],
        accommodations: [
            { area: '曾厝垵', pros: '文艺氛围浓，美食多', cons: '较吵闹' },
            { area: '鼓浪屿', pros: '岛上风光，安静浪漫', cons: '交通不便，物价高' },
            { area: '中山路', pros: '步行街繁华', cons: '人流密集' }
        ],
        transport: [
            { type: '内部交通', info: 'BRT快速公交；共享单车环岛；地铁1号线' },
            { type: '外部交通', info: '高崎机场（岛内）；厦门站、厦门北站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['鼓浪屿船票提前订（节假日秒没）', '带好防晒和帽子', '环岛路租自行车', '海鲜问清价格再点'],
            avoid: ['鼓浪屿不要周末去', '不要在景区买珍珠', '中山路消费较高', '警惕野导游']
        },
        links: {
            official: 'https://www.xiamen.gov.cn/',
            attractions: [
                { name: '鼓浪屿', url: 'https://www.gly.cn/' },
                { name: '厦门大学', url: 'https://www.xmu.edu.cn/' },
                { name: '南普陀寺', url: 'https://www.nanputuo.com.cn/' },
                { name: '环岛路', url: 'https://www.xmtravel.com/' }
            ],
            booking: [
                { name: '鼓浪屿船票', url: 'https://www.gly.cn/' },
                { name: '厦门景点门票', url: 'https://www.xmtravel.com/' }
            ],
            food: [
                { name: '厦门美食', url: 'https://www.dianping.com/xiamen' },
                { name: '曾厝垵美食', url: 'https://www.zengcuo.com/' }
            ]
        },
        poster: {
            title: '海岛日记',
            subtitle: '琴声海韵，遇见厦门',
            elements: ['鼓浪屿日光岩', '环岛路海岸线', '厦大芙蓉隧道', '闽南建筑'],
            layout: '小清新风格，海浪元素边框，蓝色系为主',
            colors: ['#3498db', '#87ceeb', '#ffd700', '#ff6b6b', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '鼓浪屿一日游（菽庄花园/日光岩）', afternoon: '皓月园 → 风琴博物馆', evening: '中山路步行街' }
                ],
                tips: ['鼓浪屿船票要提前买', '岛上限速，禁止骑车'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 鼓浪屿全天', afternoon: 'Day1: 菽庄花园/日光岩', evening: 'Day1: 中山路夜市', morning2: 'Day2: 南普陀寺 → 厦门大学', afternoon2: 'Day2: 环岛路 → 曾厝垵' }
                ],
                tips: ['厦门大学需要预约', '环岛路骑行最美'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 鼓浪屿全天', afternoon: 'Day1: 日光岩/菽庄花园', evening: 'Day1: 中山路', morning2: 'Day2: 南普陀寺 → 厦门大学', afternoon2: 'Day2: 环岛路骑行 → 胡里山炮台', evening2: 'Day2: 演武大桥观景台', morning3: 'Day3: 集美学村 → 陈嘉庚纪念馆', afternoon3: 'Day3: 园博苑/老院子', evening3: 'Day3: 返程' }
                ],
                tips: ['厦门大学芙蓉隧道必去', '曾厝垵美食很多但偏贵'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 南普陀寺 → 厦门大学', afternoon: 'Day1: 芙蓉隧道 → 演武大桥', evening: 'Day1: 环岛路', morning2: 'Day2: 鼓浪屿全天', afternoon2: 'Day2: 日光岩/风琴博物馆', evening2: 'Day2: 岛上夜景', morning3: 'Day3: 集美学村', afternoon3: 'Day3: 陈嘉庚纪念馆/龙舟池', evening3: 'Day3: 杏林/海沧', morning4: 'Day4: 天竺山森林公园/北辰山', afternoon4: 'Day4: 曾厝垵 → 中山路', evening4: 'Day4: 返程' }
                ],
                tips: ['可以坐地铁1号线看海', '厦门夏天很热，做好防晒'],
                budget: '2500-4000元'
            }
        }
    },
    '南京': {
        tags: ['历史古都', '民国风情', '文学之城'],
        season: '3-5月、9-11月',
        atmosphere: '六朝古都，厚重深沉',
        days: '4天3晚',
        routes: ['中山陵 → 明孝陵 → 音乐台', '南京博物院 → 明城墙 → 中华门', '夫子庙 → 秦淮河夜游 → 老门东', '侵华日军纪念馆 → 玄武湖 → 颐和路'],
        foods: [
            { name: '盐水鸭', desc: '南京招牌，皮白肉嫩，金宏兴/章云', price: '30-60元/人' },
            { name: '鸭血粉丝汤', desc: '老少皆宜，小潘记最正宗', price: '15-30元/人' },
            { name: '牛肉锅贴', desc: '外脆里嫩，李记清真馆', price: '20-35元/人' },
            { name: '赤豆元宵', desc: '甜品经典，莲湖糕团店', price: '10-15元/人' },
            { name: '美龄粥', desc: '南京大牌档必点', price: '20-40元/人' }
        ],
        accommodations: [
            { area: '新街口', pros: '地铁枢纽，交通便利，美食多', cons: '价格较高' },
            { area: '夫子庙/秦淮河', pros: '夜景绝美，文化氛围浓', cons: '人流较多' },
            { area: '老门东', pros: '美食天堂，古色古香', cons: '离部分景点远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁1/2/3号线覆盖主要景点；公交便捷' },
            { type: '外部交通', info: '禄口机场；南京站、南京南站' }
        ],
        budget: { low: '1200', medium: '2800', high: '4500+' },
        tips: {
            prepare: ['中山陵需提前预约（免费）', '南京博物院提前预约', '穿舒适鞋（日均2万步）', '秋季赏银杏、春季赏樱花'],
            avoid: ['夫子庙商业街慎买特产', '盐水鸭认准本地老字号', '景区餐厅慎选', '不要在景点买雨花石']
        },
        links: {
            official: 'https://www.nanjing.gov.cn/',
            attractions: [
                { name: '中山陵', url: 'https://www.zhongshan.tour/' },
                { name: '南京博物院', url: 'https://www.njmuseum.com/' },
                { name: '夫子庙', url: 'https://www.fuzimiao.com/' },
                { name: '明孝陵', url: 'https://www.mingxiaoling.com.cn/' }
            ],
            booking: [
                { name: '中山陵预约', url: 'https://www.zhongshan.tour/' },
                { name: '南京景点预约', url: 'https://www.njpark.gov.cn/' }
            ],
            food: [
                { name: '南京大牌档', url: 'https://www.njdpf.com/' },
                { name: '南京美食', url: 'https://www.dianping.com/nanjing' }
            ]
        },
        poster: {
            title: '金陵梦华',
            subtitle: '江南佳丽地，金陵帝王州',
            elements: ['中山陵台阶', '夫子庙秦淮河', '古城墙', '梧桐大道'],
            layout: '水墨写意风格，秦淮河为背景，诗词点缀',
            colors: ['#2f4f4f', '#c9a96e', '#dc143c', '#4a7c59', '#8b4513']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '中山陵 → 明孝陵', afternoon: '南京博物院 → 明城墙', evening: '夫子庙/秦淮河夜游' }
                ],
                tips: ['中山陵周一闭馆', '秦淮河夜游建议坐画舫'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 中山陵 → 明孝陵 → 音乐台', afternoon: 'Day1: 南京博物院', evening: 'Day1: 夫子庙/秦淮河', morning2: 'Day2: 侵华日军纪念馆 → 玄武湖', afternoon2: 'Day2: 颐和路 → 老门东' }
                ],
                tips: ['明孝陵早上6:30前免费', '老门东美食比夫子庙便宜'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 中山陵 → 明孝陵', afternoon: 'Day1: 音乐台', evening: 'Day1: 夫子庙/秦淮河', morning2: 'Day2: 中华门城堡 → 老门东', afternoon2: 'Day2: 瞻园 → 甘熙故居', evening2: 'Day2: 新街口/1912街区', morning3: 'Day3: 玄武湖 → 鸡鸣寺', afternoon3: 'Day3: 颐和路 → 长江路', evening3: 'Day3: 返程' }
                ],
                tips: ['鸡鸣寺素面很好吃', '南京大牌档必去'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 中山陵 → 明孝陵', afternoon: 'Day1: 音乐台', evening: 'Day1: 夫子庙/秦淮河', morning2: 'Day2: 南京博物院 → 明城墙', afternoon2: 'Day2: 中华门', evening2: 'Day2: 老门东', morning3: 'Day3: 牛首山文化旅游区', afternoon3: 'Day3: 银杏湖主题乐园', evening3: 'Day3: 汤山温泉（可选）', morning4: 'Day4: 玄武湖 → 鸡鸣寺', afternoon4: 'Day4: 颐和路/长江路文化街', evening4: 'Day4: 返程' }
                ],
                tips: ['牛首山非常壮观', '汤山温泉是南京特色'],
                budget: '2000-3500元'
            }
        }
    },
    '青岛': {
        tags: ['海滨度假', '啤酒之城', '欧韵风情'],
        season: '5-10月',
        atmosphere: '碧海蓝天，啤酒飘香',
        days: '3-4天',
        routes: ['栈桥 → 圣弥厄尔教堂 → 中山路', '八大关 → 第二海水浴场 → 五四广场', '崂山一日游 → 啤酒街', '金沙滩 → 海洋世界 → 台东夜市'],
        foods: [
            { name: '啤酒海鲜', desc: '青岛啤酒配海鲜，绝配', price: '100-200元/人' },
            { name: '烤鱿鱼', desc: '街头经典', price: '15-30元/人' },
            { name: '排骨米饭', desc: '青岛特色', price: '25-40元/人' },
            { name: '辣炒蛤蜊', desc: '鲜辣可口', price: '30-50元/人' },
            { name: '海菜凉粉', desc: '青岛特色小吃', price: '15-25元/人' }
        ],
        accommodations: [
            { area: '栈桥/中山路', pros: '老城区核心，交通便利', cons: '较为拥挤' },
            { area: '五四广场', pros: '现代城区，景观好', cons: '价格略高' },
            { area: '崂山区', pros: '靠近崂山，环境好', cons: '离海稍远' }
        ],
        transport: [
            { type: '内部交通', info: '公交覆盖；租电动车便利；下载青岛地铁APP' },
            { type: '外部交通', info: '流亭机场；青岛站、青岛北站' }
        ],
        budget: { low: '1300', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['海边注意防晒', '啤酒街慎选餐厅', '崂山提前规划路线', '带好肠胃药'],
            avoid: ['不要在栈桥买珍珠项链', '海鲜注意防宰', '避开啤酒节高峰', '五四广场周边消费较高']
        },
        links: {
            official: 'https://www.qingdao.gov.cn/',
            attractions: [
                { name: '崂山', url: 'https://www.qingdao.gov.cn/ls/' },
                { name: '栈桥', url: 'https://www.qingdao.gov.cn/zhanqiao/' },
                { name: '八大关', url: 'https://www.badaguan.com/' },
                { name: '五四广场', url: 'https://www.wusiplace.com/' }
            ],
            booking: [
                { name: '崂山门票', url: 'https://www.qingdao.gov.cn/ls/' },
                { name: '青岛景点', url: 'https://www.qingdao.gov.cn/' }
            ],
            food: [
                { name: '啤酒街', url: 'https://www.pijiu.com/' },
                { name: '青岛美食', url: 'https://www.dianping.com/qingdao' }
            ]
        },
        poster: {
            title: '青青岛',
            subtitle: '红瓦绿树，碧海蓝天',
            elements: ['栈桥回澜阁', '八大关建筑', '五四广场', '崂山道教'],
            layout: '德式建筑元素，啤酒杯剪影，蓝色海洋风',
            colors: ['#3498db', '#ffd700', '#dc143c', '#2ecc71', '#c0c0c0']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '栈桥 → 中山路 → 圣弥厄尔教堂', afternoon: '八大关 → 第二海水浴场', evening: '五四广场/灯光秀' }
                ],
                tips: ['栈桥喂海鸥冬季最佳', '五四广场灯光秀晚上8点'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 栈桥 → 中山路', afternoon: 'Day1: 八大关 → 第二海水浴场', evening: 'Day1: 五四广场/奥帆中心', morning2: 'Day2: 崂山全天（巨峰/北九水）', afternoon2: 'Day2: 啤酒街/营口路' }
                ],
                tips: ['崂山建议早上去', '营口路海鲜市场现买加工'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 栈桥 → 圣弥厄尔教堂 → 中山路', afternoon: 'Day1: 信号山 → 大学路', evening: 'Day1: 劈柴院/台东夜市', morning2: 'Day2: 八大关 → 第二海水浴场', afternoon2: 'Day2: 五四广场 → 奥帆中心', evening2: 'Day2: 情人坝看夜景', morning3: 'Day3: 崂山全天', afternoon3: 'Day3: 返回市区', evening3: 'Day3: 返程' }
                ],
                tips: ['青岛老城区适合暴走', '金沙滩沙子最细'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 栈桥 → 中山路 → 圣弥厄尔教堂', afternoon: 'Day1: 信号山 → 大学路/鱼山路', evening: 'Day1: 劈柴院/台东夜市', morning2: 'Day2: 八大关 → 第二/第三海水浴场', afternoon2: 'Day2: 太平角 → 湛山寺', evening2: 'Day2: 五四广场夜景', morning3: 'Day3: 崂山巨峰景区', afternoon3: 'Day3: 崂山北九水', evening3: 'Day3: 啤酒街/营口路', morning4: 'Day4: 金沙滩 → 海洋世界', afternoon4: 'Day4: 琴岛之眼/唐岛湾', evening4: 'Day4: 返程' }
                ],
                tips: ['青岛景点分散，建议租车', '夏天来注意防暑'],
                budget: '2500-4000元'
            }
        }
    },
    '苏州': {
        tags: ['园林之城', '江南水乡', '丝绸之府'],
        season: '4-6月、9-11月',
        atmosphere: '小桥流水，诗情画意',
        days: '4天3晚',
        routes: ['拙政园 → 苏州博物馆 → 平江路', '虎丘 → 山塘街 → 留园', '周庄/同里古镇一日游', '诚品书店 → 金鸡湖 → 双塔市集'],
        foods: [
            { name: '松鼠桂鱼', desc: '苏帮菜代表作', price: '80-150元/人' },
            { name: '阳澄湖大闸蟹', desc: '秋季必吃', price: '100-300元/人' },
            { name: '苏式汤面', desc: '面条细软，汤鲜', price: '20-40元/人' },
            { name: '哑巴生煎', desc: '皮脆汁多，排队王', price: '15-25元/人' },
            { name: '糕团点心', desc: '糯软香甜', price: '15-30元/人' }
        ],
        accommodations: [
            { area: '观前街', pros: '核心商圈，美食多', cons: '人流较多' },
            { area: '平江路', pros: '古街氛围，水乡风情', cons: '价格略高' },
            { area: '山塘街', pros: '夜景绝美', cons: '较为商业化' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景点；公交+单车；下载苏e行APP' },
            { type: '外部交通', info: '苏南硕放机场；苏州站、苏州北站' }
        ],
        budget: { low: '1200', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['园林需提前预约（苏博、拙政园）', '平江路适合傍晚漫步', '穿舒适平底鞋', '苏帮菜偏甜可提前告知'],
            avoid: ['不要在景区买假丝绸', '拙政园避开周末', '山塘街晚上去更美', '阳澄湖大闸蟹防假']
        },
        links: {
            official: 'https://www.suzhou.gov.cn/',
            attractions: [
                { name: '拙政园', url: 'https://www.suzhou.gov.cn/' },
                { name: '苏州博物馆', url: 'https://www.szmuseum.com/' },
                { name: '虎丘', url: 'https://www.hdcsz.com/' },
                { name: '周庄', url: 'https://www.zhouzhuang.net/' }
            ],
            booking: [
                { name: '苏州园林预约', url: 'https://www.szgarden.com/' },
                { name: '同里门票', url: 'https://www.tongli.net/' }
            ],
            food: [
                { name: '得月楼', url: 'https://www.deyuelou.com/' },
                { name: '苏州美食', url: 'https://www.dianping.com/suzhou' }
            ]
        },
        poster: {
            title: '姑苏漫',
            subtitle: '上有天堂，下有苏杭',
            elements: ['拙政园亭台', '平江路水巷', '虎丘塔', '太湖风光'],
            layout: '水墨淡彩风格，园林窗框为背景，诗词点缀',
            colors: ['#2ecc71', '#3498db', '#c9a96e', '#f39c12', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '拙政园 → 苏州博物馆', afternoon: '平江路 → 观前街', evening: '山塘街夜景' }
                ],
                tips: ['苏博周一闭馆', '园林建议请导游'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 拙政园 → 苏州博物馆', afternoon: 'Day1: 平江路 → 观前街', evening: 'Day1: 山塘街夜游', morning2: 'Day2: 虎丘 → 留园', afternoon2: 'Day2: 寒山寺 → 枫桥' }
                ],
                tips: ['虎丘需要3-4小时', '留园比拙政园小但很精致'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 拙政园', afternoon: 'Day1: 苏州博物馆 → 平江路', evening: 'Day1: 观前街/太监弄', morning2: 'Day2: 虎丘 → 留园', afternoon2: 'Day2: 山塘街 → 枫桥', evening2: 'Day2: 金鸡湖夜景', morning3: 'Day3: 周庄古镇全天', afternoon3: 'Day3: 返回市区', evening3: 'Day3: 返程' }
                ],
                tips: ['周庄建议早上早进去', '苏州菜偏甜'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 拙政园', afternoon: 'Day1: 苏州博物馆 → 狮子林', evening: 'Day1: 平江路/观前街', morning2: 'Day2: 虎丘 → 留园', afternoon2: 'Day2: 寒山寺/枫桥', evening2: 'Day2: 山塘街夜景', morning3: 'Day3: 同里古镇全天', afternoon3: 'Day3: 同里退思园', evening3: 'Day3: 返回市区', morning4: 'Day4: 诚品书店 → 金鸡湖', afternoon4: 'Day4: 苏州中心/东方之门', evening4: 'Day4: 返程' }
                ],
                tips: ['同里比周庄更原生态', '金鸡湖看日落很美'],
                budget: '2000-3500元'
            }
        }
    },
    '丽江': {
        tags: ['艳遇之都', '古城风情', '纳西文化'],
        season: '3-5月、9-11月',
        atmosphere: '慢生活，邂逅时光',
        days: '4-5天',
        routes: ['丽江古城 → 木府 → 黑龙潭', '玉龙雪山 → 蓝月谷', '拉市海 → 茶马古道', '泸沽湖两日游', '束河古镇 → 白沙古镇'],
        foods: [
            { name: '腊排骨火锅', desc: '丽江招牌，钰洁腊排骨最正宗', price: '60-100元/人' },
            { name: '鸡豆凉粉', desc: '纳西特色，忠义市场', price: '10-20元/人' },
            { name: '纳西烤鱼', desc: '新鲜美味', price: '40-80元/人' },
            { name: '土鸡米线', desc: '阿婆土鸡米线，二十年老店', price: '10-15元/人' },
            { name: '水性杨花', desc: '泸沽湖特色菜', price: '20-40元/人' }
        ],
        accommodations: [
            { area: '丽江古城内', pros: '氛围绝佳，夜生活丰富', cons: '价格较高晚上吵' },
            { area: '束河古镇', pros: '相对安静，品质高', cons: '离主城较远' },
            { area: '大研古镇南门', pros: '交通便利，靠近玉龙雪山方向', cons: '较为嘈杂' }
        ],
        transport: [
            { type: '内部交通', info: '包车或拼车最方便；古城步行' },
            { type: '外部交通', info: '三义机场；丽江站' }
        ],
        budget: { low: '2000', medium: '4000', high: '6000+' },
        tips: {
            prepare: ['高原注意防晒和高原反应', '玉龙雪山提前买索道票', '古城维护费50元', '泸沽湖路况差需备晕车药'],
            avoid: ['不要相信艳遇拉客', '古城内消费较高', '银饰假货多慎买', '拉市海骑马防坑']
        },
        links: {
            official: 'https://www.lijiang.gov.cn/',
            attractions: [
                { name: '玉龙雪山', url: 'https://www.yulong雪山.com/' },
                { name: '丽江古城', url: 'https://www.lijiangdi.com/' },
                { name: '泸沽湖', url: 'https://www.lugu lake.com/' },
                { name: '拉市海', url: 'https://www.lashihai.com/' }
            ],
            booking: [
                { name: '玉龙雪山索道', url: 'https://www.yulong雪山.com/' },
                { name: '丽江千古情', url: 'https://www.qianzhui.com/' }
            ],
            food: [
                { name: '丽江美食', url: 'https://www.dianping.com/lijiang' },
                { name: '腊排骨推荐', url: 'https://www.lijiang-ad.com/' }
            ]
        },
        poster: {
            title: '丽江时光',
            subtitle: '一米阳光，邂逅丽江',
            elements: ['玉龙雪山', '古城四方街', '泸沽湖', '东巴文化'],
            layout: '民族风与现代感结合，梯田元素，暖色调',
            colors: ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '丽江古城 → 木府', afternoon: '黑龙潭 → 束河古镇', evening: '古城夜景/酒吧街' }
                ],
                tips: ['木府门票60元', '古城晚上去才热闹'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 玉龙雪山 → 蓝月谷', afternoon: 'Day1: 冰川公园/云杉坪', evening: 'Day1: 丽江千古情', morning2: 'Day2: 拉市海 → 茶马古道', afternoon2: 'Day2: 束河古镇' }
                ],
                tips: ['玉龙雪山索道要提前订', '高原反应因人而异'],
                budget: '1000-2000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 玉龙雪山 → 蓝月谷', afternoon: 'Day1: 云杉坪/牦牛坪', evening: 'Day1: 丽江古城/千古情', morning2: 'Day2: 泸沽湖全天', afternoon2: 'Day2: 环湖 → 里格半岛', evening2: 'Day2: 摩梭篝火晚会', morning3: 'Day3: 泸沽湖日出 → 丽江古城', afternoon: 'Day3: 黑龙潭 → 束河', evening3: 'Day3: 返程' }
                ],
                tips: ['泸沽湖建议住一晚看日出', '路况较差，备好晕车药'],
                budget: '2000-3500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 丽江古城 → 木府', afternoon: 'Day1: 黑龙潭 → 狮子山', evening: 'Day1: 古城夜景/大水车', morning2: 'Day2: 玉龙雪山 → 蓝月谷', afternoon2: 'Day2: 冰川公园', evening2: 'Day2: 印象丽江/千古情', morning3: 'Day3: 泸沽湖全天（环湖）', afternoon3: 'Day3: 里格半岛 → 女神湾', evening3: 'Day3: 篝火晚会', morning4: 'Day4: 泸沽湖日出 → 返回丽江', afternoon4: 'Day4: 拉市海/白沙古镇', evening4: 'Day4: 返程' }
                ],
                tips: ['泸沽湖到丽江约4小时车程', '丽江昼夜温差大'],
                budget: '3000-5000元'
            }
        }
    },
    '三亚': {
        tags: ['海滨度假', '热带风情', '避寒圣地'],
        season: '11-4月',
        atmosphere: '阳光沙滩，度假天堂',
        days: '4-5天',
        routes: ['天涯海角 → 南山文化旅游区', '亚龙湾热带天堂森林公园 → 亚龙湾海滩', '蜈支洲岛一日游', '鹿回头公园 → 大东海 → 三亚千古情', '免税店购物 → 泡酒店'],
        foods: [
            { name: '海鲜大餐', desc: '第一市场现买加工', price: '100-300元/人' },
            { name: '椰子鸡', desc: '海南特色', price: '80-150元/人' },
            { name: '文昌鸡', desc: '海南四大名菜', price: '60-120元/人' },
            { name: '清补凉', desc: '消暑甜品', price: '10-20元/人' },
            { name: '热带水果', desc: '芒果、椰子、菠萝蜜', price: '20-50元/人' }
        ],
        accommodations: [
            { area: '亚龙湾', pros: '高端度假区，海水最好', cons: '价格高，离市区远' },
            { area: '海棠湾', pros: '免税店近，新开酒店多', cons: '风浪大不能下海' },
            { area: '三亚湾/大东海', pros: '性价比高，交通便利', cons: '海水质量一般' }
        ],
        transport: [
            { type: '内部交通', info: '公交+打车；推荐租车自驾' },
            { type: '外部交通', info: '凤凰机场；三亚站' }
        ],
        budget: { low: '3000', medium: '6000', high: '10000+' },
        tips: {
            prepare: ['防晒霜SPF50+必备', '带好墨镜和草帽', '海鲜第一市场更实惠', '亚龙湾森林公园提前订票'],
            avoid: ['不要在景区买珍珠', '海鲜加工注意防宰', '潜水不要选低价团', '租车防骗']
        },
        links: {
            official: 'https://www.sanya.gov.cn/',
            attractions: [
                { name: '蜈支洲岛', url: 'https://www.wuzhizhou.com/' },
                { name: '南山寺', url: 'https://www.nanshantravel.com/' },
                { name: '天涯海角', url: 'https://www.aitianya.com/' },
                { name: '亚龙湾', url: 'https://www.ylwbaby.com/' }
            ],
            booking: [
                { name: '蜈支洲岛门票', url: 'https://www.wuzhizhou.com/' },
                { name: '亚特兰蒂斯', url: 'https://www.atlantist.com/' }
            ],
            food: [
                { name: '第一市场海鲜', url: 'https://www.sanya-food.com/' },
                { name: '三亚美食', url: 'https://www.dianping.com/sanya' }
            ]
        },
        poster: {
            title: '海岛日记',
            subtitle: '面朝大海，春暖花开',
            elements: ['天涯海角', '蜈支洲岛', '椰林树影', '观音像'],
            layout: '热带风情，热带植物边框，海蓝色渐变背景',
            colors: ['#3498db', '#87ceeb', '#ffd700', '#ff6b6b', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '天涯海角', afternoon: '南山文化旅游区', evening: '三亚湾椰梦长廊' }
                ],
                tips: ['天涯海角早上去人少', '南山寺素斋不错'],
                budget: '400-800元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 天涯海角 → 南山寺', afternoon: 'Day1: 大东海 → 鹿回头', evening: 'Day1: 第一市场海鲜', morning2: 'Day2: 亚龙湾热带天堂森林公园', afternoon2: 'Day2: 亚龙湾海滩' }
                ],
                tips: ['亚龙湾森林公园过江龙索道很刺激', '大东海适合初学者游泳'],
                budget: '1200-2000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 天涯海角', afternoon: 'Day1: 南山寺', evening: 'Day1: 三亚湾看日落', morning2: 'Day2: 蜈支洲岛全天', afternoon2: 'Day2: 岛上潜水/摩托艇', evening2: 'Day2: 返回市区', morning3: 'Day3: 亚龙湾热带天堂森林公园', afternoon3: 'Day3: 亚龙湾海滩 → 百花谷', evening3: 'Day3: 返程' }
                ],
                tips: ['蜈支洲岛船票要早买', '岛上午餐较贵可自带'],
                budget: '2500-4000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 天涯海角 → 南山寺', afternoon: 'Day1: 大东海', evening: 'Day1: 鹿回头公园夜景', morning2: 'Day2: 蜈支洲岛全天', afternoon2: 'Day2: 岛上娱乐项目', evening2: 'Day2: 岛上午餐', morning3: 'Day3: 亚龙湾热带天堂', afternoon3: 'Day3: 亚龙湾海滩 → 太阳湾', evening3: 'Day3: 海棠湾/免税店', morning4: 'Day4: 分界洲岛/呆呆岛', afternoon4: 'Day4: 返程' }
                ],
                tips: ['海棠湾免税店购物很划算', '建议租车自驾游玩'],
                budget: '4000-7000元'
            }
        }
    },
    '哈尔滨': {
        tags: ['冰雪之都', '俄式风情', '音乐之城'],
        season: '12-2月（冰雪节）',
        atmosphere: '冰雕雪景异域风情',
        days: '3-4天',
        routes: ['中央大街 → 索菲亚教堂 → 松花江', '冰雪大世界/太阳岛雪博会', '亚布力滑雪一日游', '老道外中华巴洛克 → 防洪纪念塔'],
        foods: [
            { name: '锅包肉', desc: '酸甜酥脆，东北代表', price: '40-70元/人' },
            { name: '铁锅炖', desc: '大鹅/排骨/鱼', price: '80-150元/人' },
            { name: '红肠', desc: '俄式香肠，秋林里道斯', price: '20-40元/人' },
            { name: '马迭尔冰棍', desc: '中央大街必吃', price: '5-10元/根' },
            { name: '杀猪菜', desc: '东北特色', price: '40-80元/人' }
        ],
        accommodations: [
            { area: '中央大街', pros: '核心景区，交通便利', cons: '价格较高' },
            { area: '索菲亚教堂附近', pros: '拍照方便', cons: '人流较多' },
            { area: '江北', pros: '冰雪大世界附近', cons: '离市区较远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁1号线覆盖主要景区' },
            { type: '外部交通', info: '太平机场；哈尔滨站、哈尔滨西站' }
        ],
        budget: { low: '2000', medium: '4000', high: '6000+' },
        tips: {
            prepare: ['防寒装备必备（手套/帽子/暖宝宝）', '冰雪大世界晚上去', '手机贴暖宝宝防冻关机', '带好充电宝'],
            avoid: ['不要在中央大街买红肠', '冰雪大世界提前订票', '亚布力选正规雪场', '出租车慎选']
        },
        links: {
            official: 'https://www.harbin.gov.cn/',
            attractions: [
                { name: '冰雪大世界', url: 'https://www.hrbll.com/' },
                { name: '中央大街', url: 'https://www.zbc.com/' },
                { name: '索菲亚教堂', url: 'https://www.sofiachurch.com/' },
                { name: '亚布力滑雪', url: 'https://www.yabuli.com/' }
            ],
            booking: [
                { name: '冰雪大世界门票', url: 'https://www.hrbll.com/' },
                { name: '亚布力滑雪票', url: 'https://www.yabuli.com/' }
            ],
            food: [
                { name: '秋林公司', url: 'https://www.churin.com.cn/' },
                { name: '哈尔滨美食', url: 'https://www.dianping.com/harbin' }
            ]
        },
        poster: {
            title: '冰城恋',
            subtitle: '童话雪国，浪漫冰城',
            elements: ['索菲亚教堂', '冰雪大世界', '中央大街', '松花江畔'],
            layout: '冰晶质感，蓝白渐变，教堂剪影为主体',
            colors: ['#3498db', '#ffffff', '#87ceeb', '#ffd700', '#c0c0c0']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '中央大街 → 索菲亚教堂', afternoon: '松花江 → 防洪纪念塔', evening: '冰雪大世界（冬季）' }
                ],
                tips: ['冰雪大世界要下午3点去', '马迭尔冰棍冬天才好吃'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 中央大街 → 索菲亚教堂', afternoon: 'Day1: 老道外中华巴洛克', evening: 'Day1: 松花江/冰雪大世界', morning2: 'Day2: 太阳岛雪博会 → 俄罗斯小镇', afternoon2: 'Day2: 防洪纪念塔 → 中央大街' }
                ],
                tips: ['太阳岛夏天避暑冬天看雪', '老道外建筑很有特色'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 中央大街 → 索菲亚教堂', afternoon: 'Day1: 松花江 → 防洪纪念塔', evening: 'Day1: 冰雪大世界', morning2: 'Day2: 亚布力滑雪全天', afternoon2: 'Day2: 滑雪/赏雪景', evening2: 'Day2: 返回市区', morning3: 'Day3: 太阳岛雪博会 → 俄罗斯小镇', afternoon3: 'Day3: 老道外 → 果戈里大街', evening3: 'Day3: 返程' }
                ],
                tips: ['亚布力离哈尔滨2-3小时', '冰雪大世界很冷多穿衣服'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 中央大街 → 索菲亚教堂', afternoon: 'Day1: 老道外中华巴洛克', evening: 'Day1: 松花江畔', morning2: 'Day2: 冰雪大世界全天', afternoon2: 'Day2: 太阳岛雪博会', evening2: 'Day2: 俄罗斯风情园', morning3: 'Day3: 亚布力滑雪全天', afternoon3: 'Day3: 森林小火车', evening3: 'Day3: 返回市区', morning4: 'Day4: 伏尔加庄园', afternoon4: 'Day4: 薰衣草庄园/啤酒节', evening4: 'Day4: 返程' }
                ],
                tips: ['亚布力有多个雪场可选', '伏尔加庄园很美但离市区远'],
                budget: '2500-4000元'
            }
        }
    },
    '武汉': {
        tags: ['江城', '大学之城', '早餐之都'],
        season: '3-5月、9-11月',
        atmosphere: '码头文化，热干面香',
        days: '2-3天',
        routes: ['黄鹤楼 → 户部巷 → 武汉长江大桥', '武汉大学 → 湖北省博物馆 → 东湖', '汉口江滩 → 黎黄陂路 → 江汉路步行街'],
        foods: [
            { name: '热干面', desc: '武汉早餐代表，蔡林记最正宗', price: '5-15元/人' },
            { name: '豆皮', desc: '外脆里嫩，老通城', price: '5-10元/人' },
            { name: '鸭脖', desc: '麻辣鲜香，精武路鸭脖', price: '20-40元/人' },
            { name: '糊汤粉', desc: '鲜鱼糊汤配油条', price: '10-20元/人' },
            { name: '武昌鱼', desc: '清蒸红烧皆可', price: '40-80元/人' }
        ],
        accommodations: [
            { area: '武昌/黄鹤楼', pros: '景点集中', cons: '人流较多' },
            { area: '汉口江滩', pros: '江景好，夜景美', cons: '离部分景点远' },
            { area: '光谷', pros: '现代商业区', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景区；公交' },
            { type: '外部交通', info: '天河机场；武汉站、武昌站、汉口站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['过早文化体验要早起', '武大樱花季提前预约', '带好遮阳遮雨具', '东湖可以骑自行车'],
            avoid: ['不要在黄鹤楼买纪念品', '户部巷消费偏高', '热干面认准老字号', '避开武大周末']
        },
        links: {
            official: 'https://www.wuhan.gov.cn/',
            attractions: [
                { name: '黄鹤楼', url: 'https://www.huanghelou.com/' },
                { name: '武汉大学', url: 'https://www.whu.edu.cn/' },
                { name: '东湖', url: 'https://www.eastlake.com/' },
                { name: '湖北省博物馆', url: 'https://www.hbmuseum.com/' }
            ],
            booking: [
                { name: '黄鹤楼门票', url: 'https://www.huanghelou.com/' },
                { name: '东湖游船', url: 'https://www.eastlake.com/' }
            ],
            food: [
                { name: '蔡林记', url: 'https://www.cailinji.com/' },
                { name: '武汉美食', url: 'https://www.dianping.com/wuhan' }
            ]
        },
        poster: {
            title: '江城记',
            subtitle: '过早武汉，码头味道',
            elements: ['黄鹤楼', '武汉长江大桥', '武大樱花', '东湖绿道'],
            layout: '现代城市风格，黄色为主调，豆浆热干面元素',
            colors: ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#ffffff']
        }
    },
    '长沙': {
        tags: ['娱乐之都', '美食之城', '红色旅游'],
        season: '3-5月、9-11月',
        atmosphere: '辣妹子香，娱乐精神',
        days: '2-3天',
        routes: ['橘子洲 → 岳麓山 → 岳麓书院', '湖南省博物馆 → 五一广场 → 太平街', '世界之窗/海底世界 → 火宫殿'],
        foods: [
            { name: '臭豆腐', desc: '长沙招牌，火宫殿/黑色经典', price: '10-20元/人' },
            { name: '辣椒炒肉', desc: '湘菜代表，下饭菜', price: '30-50元/人' },
            { name: '口味虾', desc: '麻辣鲜香，文和友', price: '60-120元/人' },
            { name: '糖油粑粑', desc: '甜而不腻', price: '5-10元/人' },
            { name: '茶颜悦色', desc: '长沙特色奶茶', price: '15-25元/杯' }
        ],
        accommodations: [
            { area: '五一广场', pros: '核心商圈，交通便利', cons: '价格略高' },
            { area: '太平街', pros: '美食一条街', cons: '人流较多' },
            { area: '岳麓山', pros: '环境好，空气清新', cons: '离市中心远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景区' },
            { type: '外部交通', info: '黄花机场；长沙站、长沙南站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['带好肠胃药，湘菜很辣', '茶颜悦色每家店都排队', '橘子洲可以坐小火车', '太平街晚上去更热闹'],
            avoid: ['不要在火宫殿吃饭', '避开周末五一广场', '橘子洲周末人超多', '世界之窗性价比一般']
        },
        links: {
            official: 'https://www.changsha.gov.cn/',
            attractions: [
                { name: '橘子洲', url: 'https://www.juzizhou.com/' },
                { name: '岳麓山', url: 'https://www.yuelu.gov.cn/' },
                { name: '湖南省博物馆', url: 'https://www.hnmuseum.com/' },
                { name: '五一广场', url: 'https://www.5广场.com/' }
            ],
            booking: [
                { name: '橘子洲预约', url: 'https://www.juzizhou.com/' },
                { name: '岳麓山', url: 'https://www.yuelu.gov.cn/' }
            ],
            food: [
                { name: '火宫殿', url: 'https://www.huogongdian.com/' },
                { name: '长沙美食', url: 'https://www.dianping.com/changsha' }
            ]
        },
        poster: {
            title: '星城记',
            subtitle: '快乐长沙，辣不怕',
            elements: ['橘子洲头', '岳麓书院', '太平街', '臭豆腐'],
            layout: '潮流混搭风格，辣椒红与奶茶色撞色',
            colors: ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '岳麓山 → 岳麓书院 → 湖南大学', afternoon: '橘子洲头', evening: '五一广场/太平街' }
                ],
                tips: ['岳麓山建议坐索道上山', '橘子洲小火车20元'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 岳麓山 → 岳麓书院', afternoon: 'Day1: 湖南大学', evening: 'Day1: 坡子街/火宫殿', morning2: 'Day2: 橘子洲', afternoon2: 'Day2: 湖南省博物馆 → 开福寺' }
                ],
                tips: ['省博物馆周一闭馆', '茶颜悦色到处都有不用排队'],
                budget: '500-800元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 岳麓山 → 岳麓书院', afternoon: 'Day1: 湖南大学', evening: 'Day1: 太平街/坡子街', morning2: 'Day2: 橘子洲', afternoon2: 'Day2: 湖南省博物馆', evening2: 'Day2: 五一广场/黄兴路', morning3: 'Day3: 世界之窗/海底世界', afternoon3: 'Day3: 铜官窑古镇', evening3: 'Day3: 返程' }
                ],
                tips: ['长沙夜生活很丰富', '文和友小龙虾必吃'],
                budget: '1000-1500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 岳麓山 → 岳麓书院', afternoon: 'Day1: 湖南大学', evening: 'Day1: 太平街/坡子街', morning2: 'Day2: 橘子洲', afternoon2: 'Day2: 湖南省博物馆 → 开福寺', evening2: 'Day2: 五一广场', morning3: 'Day3: 韶山（毛泽东故居）', afternoon3: 'Day3: 花明楼', evening3: 'Day3: 返回市区', morning4: 'Day4: 铜官窑古镇 → 靖港古镇', afternoon4: 'Day4: 返回市区购物', evening4: 'Day4: 返程' }
                ],
                tips: ['韶山离长沙约1小时', '铜官窑很美但较远'],
                budget: '1500-2500元'
            }
        }
    },
    '天津': {
        tags: ['万国建筑', '津门故里', '相声之乡'],
        season: '4-6月、9-10月',
        atmosphere: '中西合璧，码头文化',
        days: '3-4天',
        routes: ['古文化街 → 鼓楼 → 南市食品街', '意大利风情区 → 天津之眼 → 海河游船', '五大道 → 瓷房子 → 西开教堂', '滨海新区 → 国家海洋博物馆'],
        foods: [
            { name: '狗不理包子', desc: '天津招牌，皮薄馅多', price: '30-60元/人' },
            { name: '麻花', desc: '桂发祥十八街麻花最正宗', price: '20-50元/份' },
            { name: '耳朵眼炸糕', desc: '外酥里嫩，豆沙馅', price: '5-10元/个' },
            { name: '煎饼果子', desc: '早餐必备，正宗天津味', price: '8-15元/套' },
            { name: '嘎巴菜', desc: '天津特色早餐', price: '8-15元/碗' }
        ],
        accommodations: [
            { area: '天津站/意式风情区', pros: '交通便利，看海河夜景', cons: '价格适中' },
            { area: '五大道', pros: '老洋房氛围，安静文艺', cons: '离部分景点远' },
            { area: '滨江道/和平区', pros: '商圈繁华，购物便利', cons: '人流较多' }
        ],
        transport: [
            { type: '内部交通', info: '地铁发达；公交+共享单车' },
            { type: '外部交通', info: '滨海机场；天津站、天津西站、天津南站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['海河夜景值得一看', '五大道适合慢慢逛', '天津之眼傍晚去', '听一场相声是必修课'],
            avoid: ['不要在古文化街买特产', '不要信路边的低价一日游', '景区周边慎买麻花', '不要在食品街吃正餐']
        },
        links: {
            official: 'https://www.tj.gov.cn/',
            attractions: [
                { name: '天津之眼', url: 'https://www.tianjineye.com/' },
                { name: '意大利风情区', url: 'https://www.italianwpt.com/' },
                { name: '五大道', url: 'https://www.wudadao.com/' },
                { name: '古文化街', url: 'https://www.guwjj.com/' }
            ],
            booking: [
                { name: '天津之眼门票', url: 'https://www.tianjineye.com/' },
                { name: '海河游船', url: 'https://www.tianjin-tour.com/' }
            ],
            food: [
                { name: '狗不理', url: 'https://www.goubuli.com/' },
                { name: '天津美食', url: 'https://www.dianping.com/tianjin' }
            ]
        },
        poster: {
            title: '津门韵',
            subtitle: '万国建筑博览，津味生活',
            elements: ['天津之眼', '五大道洋房', '古文化街', '海河夜景'],
            layout: '左右分区，左侧地标剪影，右侧美食与建筑图标',
            colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '古文化街 → 鼓楼 → 南市食品街', afternoon: '意大利风情区 → 北安桥', evening: '天津之眼/海河夜景' }
                ],
                tips: ['天津之眼建议傍晚去', '古文化街有很多相声馆'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 古文化街 → 鼓楼', afternoon: 'Day1: 意大利风情区', evening: 'Day1: 海河游船/天津之眼', morning2: 'Day2: 五大道 → 瓷房子', afternoon2: 'Day2: 西开教堂 → 滨江道' }
                ],
                tips: ['五大道建议租自行车', '瓷房子门口拍照即可'],
                budget: '600-1000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 古文化街 → 鼓楼 → 南市', afternoon: 'Day1: 意大利风情区', evening: 'Day1: 海河夜景', morning2: 'Day2: 五大道 → 瓷房子', afternoon2: 'Day2: 西开教堂 → 滨江道', evening2: 'Day2: 听相声/德云社', morning3: 'Day3: 滨海新区 → 国家海洋博物馆', afternoon3: 'Day3: 航母主题公园', evening3: 'Day3: 返程' }
                ],
                tips: ['天津相声推荐名流茶馆', '海洋博物馆很适合带孩子'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 古文化街 → 鼓楼', afternoon: 'Day1: 南市食品街', evening: 'Day1: 意大利风情区夜景', morning2: 'Day2: 五大道全天', afternoon2: 'Day2: 瓷房子 → 西开教堂', evening2: 'Day2: 滨江道/和平路', morning3: 'Day3: 蓟县 → 盘山/黄崖关长城', afternoon3: 'Day3: 独乐寺', evening3: 'Day3: 返回市区', morning4: 'Day4: 天津之眼 → 海河游船', afternoon4: 'Day4: 周恩来邓颖超纪念馆', evening4: 'Day4: 返程' }
                ],
                tips: ['蓟县距离市区约2小时车程', '天津早餐文化很丰富'],
                budget: '1800-3000元'
            }
        }
    },
    '大理': {
        tags: ['风花雪月', '白族风情', '洱海度假'],
        season: '3-5月、9-11月',
        atmosphere: '慢生活，文艺清新',
        days: '4-5天',
        routes: ['大理古城 → 三塔 → 苍山洗马潭索道', '环洱海西线：才村→磻溪→喜洲→海舌公园', '双廊古镇 → 南诏风情岛', '沙溪古镇 → 诺邓古镇'],
        foods: [
            { name: '喜洲粑粑', desc: '现烤破酥粑粑，咸口绝了', price: '5-10元/个' },
            { name: '白族酸辣鱼', desc: '酸辣鲜香', price: '40-80元/人' },
            { name: '乳扇', desc: '大理特色奶酪', price: '10-20元/串' },
            { name: '水性杨花', desc: '泸沽湖特色菜', price: '20-40元/人' },
            { name: '野生菌火锅', desc: '雨季限定，菌子新鲜', price: '80-150元/人' }
        ],
        accommodations: [
            { area: '大理古城', pros: '夜生活丰富，吃喝方便', cons: '较吵闹' },
            { area: '才村/洱海边', pros: '推窗见湖，日出方便', cons: '餐厅较少' },
            { area: '双廊', pros: '海景绝佳，安静浪漫', cons: '价格较高' }
        ],
        transport: [
            { type: '内部交通', info: '环洱海租电动车；大巴；包车' },
            { type: '外部交通', info: '大理机场；大理站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['洱海环海建议租电动车', '苍山索道提前买票', '防晒必备，高原紫外线强', '环海西路拍照点超美'],
            avoid: ['不要信低价环海旅拍', '不要在古城门口租电动车', '不要在景区买银饰', '鲜花饼别在古城买贵的']
        },
        links: {
            official: 'https://www.dali.gov.cn/',
            attractions: [
                { name: '洱海', url: 'https://www.erhai.com/' },
                { name: '苍山', url: 'https://www.cangshan.com/' },
                { name: '大理古城', url: 'https://www.daligucheng.com/' },
                { name: '双廊', url: 'https://www.shuanglang.com/' }
            ],
            booking: [
                { name: '苍山索道', url: 'https://www.cangshan.com/' },
                { name: '洱海游船', url: 'https://www.erhai.com/' }
            ],
            food: [
                { name: '大理美食', url: 'https://www.dianping.com/dali' },
                { name: '喜洲粑粑', url: 'https://www.xishuobaba.com/' }
            ]
        },
        poster: {
            title: '风花雪月',
            subtitle: '下关风，上关花，苍山雪，洱海月',
            elements: ['洱海日出', '苍山雪顶', '喜洲稻田', '双廊古镇'],
            layout: '水墨风格，洱海山水为背景，文艺清新色调',
            colors: ['#3498db', '#87ceeb', '#f39c12', '#ffffff', '#2ecc71']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '大理古城 → 三塔', afternoon: '苍山洗马潭索道', evening: '古城洋人街/DTB' }
                ],
                tips: ['苍山索道要查天气', '古城的洋人街适合晚上逛'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 大理古城 → 三塔', afternoon: 'Day1: 苍山洗马潭', evening: 'Day1: 古城夜市', morning2: 'Day2: 环洱海西线（才村→喜洲）', afternoon2: 'Day2: 海舌公园' }
                ],
                tips: ['环海西路骑行最美', '喜洲粑粑一定要吃'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 大理古城 → 三塔', afternoon: 'Day1: 苍山洗马潭', evening: 'Day1: 古城洋人街', morning2: 'Day2: 环洱海西线', afternoon2: 'Day2: 双廊古镇', evening2: 'Day2: 双廊日落', morning3: 'Day3: 双廊 → 南诏风情岛', afternoon3: 'Day3: 挖色 → 小普陀', evening3: 'Day3: 返程' }
                ],
                tips: ['双廊海景房很贵但值得', '洱海东线适合开车'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 大理古城 → 三塔', afternoon: 'Day1: 苍山洗马潭', evening: 'Day1: 古城夜市', morning2: 'Day2: 环洱海西线（才村→喜洲→海舌）', afternoon2: 'Day2: 周城扎染', evening2: 'Day2: 双廊', morning3: 'Day3: 双廊 → 南诏风情岛', afternoon3: 'Day3: 挖色 → 小普陀', evening3: 'Day3: 环海东路', morning4: 'Day4: 沙溪古镇', afternoon4: 'Day4: 诺邓古镇', evening4: 'Day4: 返程' }
                ],
                tips: ['沙溪古镇很原始', '诺邓火腿很有名'],
                budget: '2500-4000元'
            }
        }
    },
    '桂林': {
        tags: ['山水甲天下', '漓江风光', '喀斯特地貌'],
        season: '4-6月、9-10月',
        atmosphere: '烟雨漓江，水墨丹青',
        days: '4-5天',
        routes: ['象鼻山 → 东西巷 → 两江四湖夜游', '杨堤竹筏 → 九马画山 → 兴坪古镇 → 20元人民币背景', '遇龙河漂流 → 十里画廊 → 银子岩', '龙脊梯田 → 黄洛瑶寨'],
        foods: [
            { name: '桂林米粉', desc: '干拌卤菜粉，老东江、石记最正宗', price: '5-8元/碗' },
            { name: '阳朔啤酒鱼', desc: '漓江剑骨鱼，鲜辣入味', price: '80-120元/人' },
            { name: '荔浦芋扣肉', desc: '粉糯入味，入口即化', price: '40-60元/人' },
            { name: '恭城油茶', desc: '本地人的中式咖啡', price: '10-20元/人' },
            { name: '田螺酿', desc: '阳朔特色', price: '30-50元/人' }
        ],
        accommodations: [
            { area: '桂林市区/东西巷', pros: '逛吃方便，夜景美', cons: '离景区较远' },
            { area: '阳朔西街', pros: '夜生活丰富，美食多', cons: '夜晚较吵' },
            { area: '遇龙河畔', pros: '推窗见山水，安静清幽', cons: '交通不便' }
        ],
        transport: [
            { type: '内部交通', info: '桂林站离市区最近；阳朔高铁23元；租电动车30元/天' },
            { type: '外部交通', info: '两江机场；桂林站、桂林北站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['漓江竹筏提前预约', '象鼻山免费需预约', '带好20元人民币', '遇龙河漂流选金龙桥-旧县段'],
            avoid: ['不要信景区低价团', '不要坐私人野筏', '阳朔西街主街消费高', '竹筏小费非强制按需给']
        },
        links: {
            official: 'https://www.guilin.com.cn/',
            attractions: [
                { name: '漓江', url: 'https://www.lijiang.com/' },
                { name: '象鼻山', url: 'https://www.xbscn.com/' },
                { name: '阳朔西街', url: 'https://www.yangshuo.com/' },
                { name: '龙脊梯田', url: 'https://www.guilinjing.com/' }
            ],
            booking: [
                { name: '漓江船票', url: 'https://www.lijiang.com/' },
                { name: '遇龙河漂流', url: 'https://www.yulonghe.com/' }
            ],
            food: [
                { name: '桂林米粉', url: 'https://www.glrice.com/' },
                { name: '桂林美食', url: 'https://www.dianping.com/guilin' }
            ]
        },
        poster: {
            title: '山水画中游',
            subtitle: '桂林山水甲天下，阳朔山水甲桂林',
            elements: ['象鼻山', '漓江竹筏', '阳朔西街', '龙脊梯田'],
            layout: '水墨晕染风格，漓江山水为背景，诗意盎然',
            colors: ['#2ecc71', '#3498db', '#f39c12', '#ffffff', '#34495e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '象鼻山 → 叠彩山', afternoon: '两江四湖/木龙湖', evening: '东西巷/正阳步行街' }
                ],
                tips: ['象鼻山现在免费但需预约', '两江四湖夜游很美'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 象鼻山 → 叠彩山', afternoon: 'Day1: 两江四湖', evening: 'Day1: 东西巷', morning2: 'Day2: 杨堤竹筏 → 兴坪古镇', afternoon2: 'Day2: 20元人民币背景' }
                ],
                tips: ['漓江竹筏4小时较累', '兴坪古镇很小但很美'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 象鼻山 → 叠彩山', afternoon: 'Day1: 两江四湖', evening: 'Day1: 东西巷', morning2: 'Day2: 杨堤竹筏 → 兴坪', afternoon2: 'Day2: 兴坪20元背景', evening2: 'Day2: 阳朔西街', morning3: 'Day3: 遇龙河漂流 → 十里画廊', afternoon3: 'Day3: 银子岩 → 西街', evening3: 'Day3: 返程' }
                ],
                tips: ['遇龙河漂流比漓江安静', '阳朔啤酒鱼必吃'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 象鼻山 → 叠彩山', afternoon: 'Day1: 两江四湖', evening: 'Day1: 东西巷', morning2: 'Day2: 杨堤竹筏 → 兴坪', afternoon2: 'Day2: 兴坪20元背景', evening2: 'Day2: 阳朔西街', morning3: 'Day3: 遇龙河漂流 → 十里画廊', afternoon3: 'Day3: 银子岩/世外桃源', evening3: 'Day3: 西街', morning4: 'Day4: 龙脊梯田全天', afternoon4: 'Day4: 黄洛瑶寨', evening4: 'Day4: 返程' }
                ],
                tips: ['龙脊梯田需要一整天', '平安寨和金坑大寨可二选一'],
                budget: '2000-3500元'
            }
        }
    },
    '香港': {
        tags: ['购物天堂', '美食之都', '东方之珠'],
        season: '10-12月',
        atmosphere: '中西合璧，时尚摩登',
        days: '4-5天',
        routes: ['尖沙咀 → 星光大道 → 维港夜景 → 幻彩咏香江', '太平山顶 → 凌霄阁 → 卢吉道', '中环 → 半山扶梯 → 兰桂坊', '迪士尼乐园/海洋公园', '南丫岛/长洲岛离岛游'],
        foods: [
            { name: '茶餐厅', desc: '菠萝油+丝袜奶茶，翠华/兰芳园', price: '50-100元/人' },
            { name: '港式早茶', desc: '虾饺/烧麦/叉烧包，添好运/美心', price: '80-150元/人' },
            { name: '鱼蛋/鸡蛋仔', desc: '街头小吃经典', price: '15-30元/份' },
            { name: '烧鹅', desc: '一乐烧鹅/镛记', price: '100-200元/人' },
            { name: '富豪雪糕', desc: '流动雪糕车，情怀小吃', price: '10-20元/份' }
        ],
        accommodations: [
            { area: '尖沙咀', pros: '交通便利，购物天堂', cons: '价格较高' },
            { area: '铜锣湾', pros: '本地人聚集，美食多', cons: '人流密集' },
            { area: '旺角/油麻地', pros: '市井烟火浓，性价比高', cons: '环境较嘈杂' }
        ],
        transport: [
            { type: '内部交通', info: '八达通必备；地铁；天星小轮2.7港币' },
            { type: '外部交通', info: '直飞；西九龙高铁；深圳口岸过关' }
        ],
        budget: { low: '3000', medium: '6000', high: '10000+' },
        tips: {
            prepare: ['提前办港澳通行证', '兑换500-1000港币', '下载MTR Mobile查线路', '八达通必备'],
            avoid: ['地铁内禁止饮食，罚2000港币', '非吸烟区抽烟罚5000港币', '海鲜先问价再点', '景区不买水零食']
        },
        links: {
            official: 'https://www.discoverhongkong.cn/',
            attractions: [
                { name: '迪士尼乐园', url: 'https://www.hongkongdisneyland.com/' },
                { name: '海洋公园', url: 'https://www.oceanpark.com.hk/' },
                { name: '太平山顶', url: 'https://www.thepeak.com.hk/' },
                { name: '维港夜景', url: 'https://www.victoriaharbour.com/' }
            ],
            booking: [
                { name: '迪士尼门票', url: 'https://www.hongkongdisneyland.com/' },
                { name: '海洋公园门票', url: 'https://www.oceanpark.com.hk/' }
            ],
            food: [
                { name: '翠华餐厅', url: 'https://www.tsuiwah.com/' },
                { name: '香港美食', url: 'https://www.openrice.com/hongkong' }
            ]
        },
        poster: {
            title: '东方之珠',
            subtitle: '购物美食天堂，维港夜景无敌',
            elements: ['维多利亚港', '太平山', '霓虹夜景', '港式美食'],
            layout: '现代都市风格，霓虹灯效果，维港剪影',
            colors: ['#1a1a2e', '#ffd700', '#dc143c', '#4169e1', '#c0c0c0']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '尖沙咀 → 星光大道', afternoon: '香港历史博物馆/科学馆', evening: '维港夜景/幻彩咏香江' }
                ],
                tips: ['幻彩咏香江每晚8点', '天星小轮2.7港币很便宜'],
                budget: '500-1000元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 尖沙咀 → 星光大道', afternoon: 'Day1: 旺角/女人街', evening: 'Day1: 维港夜景', morning2: 'Day2: 太平山顶 → 凌霄阁', afternoon2: 'Day2: 中环/半山扶梯 → 兰桂坊' }
                ],
                tips: ['太平山缆车要排队', '山顶夜景很漂亮'],
                budget: '1200-2000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 尖沙咀 → 星光大道', afternoon: 'Day1: 香港历史博物馆', evening: 'Day1: 维港夜景', morning2: 'Day2: 太平山顶 → 卢吉道', afternoon2: 'Day2: 中环 → 半山扶梯 → 兰桂坊', evening2: 'Day2: 中环码头', morning3: 'Day3: 南丫岛/长洲岛', afternoon3: 'Day3: 离岛风光', evening3: 'Day3: 返程' }
                ],
                tips: ['南丫岛需坐船', '离岛海鲜便宜新鲜'],
                budget: '2500-4000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 尖沙咀 → 星光大道', afternoon: 'Day1: 香港太空馆/艺术馆', evening: 'Day1: 维港夜景', morning2: 'Day2: 迪士尼乐园全天', afternoon2: 'Day2: 迪士尼烟花', evening2: 'Day2: 返回市区', morning3: 'Day3: 太平山顶 → 中环', afternoon3: 'Day3: 半山扶梯 → 兰桂坊', evening3: 'Day3: 铜锣湾/时代广场', morning4: 'Day4: 海洋公园全天', afternoon4: 'Day4: 铜锣湾购物', evening4: 'Day4: 返程' }
                ],
                tips: ['迪士尼和海洋公园各需一天', '香港购物推荐铜锣湾'],
                budget: '5000-8000元'
            }
        }
    },
    '洛阳': {
        tags: ['十三朝古都', '牡丹花城', '石窟艺术'],
        season: '4-5月（牡丹文化节）',
        atmosphere: '唐风汉韵，千年古都',
        days: '3-4天',
        routes: ['龙门石窟 → 白马寺', '洛邑古城 → 应天门夜景 → 明堂天堂', '洛阳博物馆 → 丽景门 → 十字街夜市', '老君山一日游'],
        foods: [
            { name: '不翻汤', desc: '洛阳非遗，酸辣开胃', price: '10-15元/碗' },
            { name: '洛阳水席', desc: '管记/杏花村，24道菜道道有汤', price: '40-60元/人' },
            { name: '牛肉汤', desc: '马杰山牛肉汤配饼丝', price: '10-20元/碗' },
            { name: '锅贴', desc: '外酥里嫩，配海碧汽水', price: '15-30元/人' },
            { name: '小街天府', desc: '担担面、小酥肉', price: '20-40元/人' }
        ],
        accommodations: [
            { area: '老城区/洛邑古城', pros: '夜景氛围浓，靠近美食', cons: '设施较旧' },
            { area: '西工区', pros: '交通便利，靠近小街', cons: '离龙门石窟远' },
            { area: '洛龙区', pros: '环境整洁，靠近博物馆', cons: '夜生活较少' }
        ],
        transport: [
            { type: '内部交通', info: '地铁1/2号线；公交1元；共享电车' },
            { type: '外部交通', info: '洛阳龙门站；洛阳北郊机场' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['龙门石窟提前5天预约', '牡丹文化节4.1-5.5', '穿汉服拍照超美', '博物馆周一闭馆'],
            avoid: ['不要买景区门口高价香', '不要信野导游', '汉服租赁要砍价', '老君山选正规纯玩团']
        },
        links: {
            official: 'https://www.ly.gov.cn/',
            attractions: [
                { name: '龙门石窟', url: 'https://www.lmsk.com/' },
                { name: '白马寺', url: 'https://www.baimasi.com/' },
                { name: '洛邑古城', url: 'https://www.luoyigu.com/' },
                { name: '老君山', url: 'https://www.laojunshan.com/' }
            ],
            booking: [
                { name: '龙门石窟门票', url: 'https://www.lmsk.com/' },
                { name: '老君山门票', url: 'https://www.laojunshan.com/' }
            ],
            food: [
                { name: '管记水席', url: 'https://www.guanji.com/' },
                { name: '洛阳美食', url: 'https://www.dianping.com/luoyang' }
            ]
        },
        poster: {
            title: '洛阳光',
            subtitle: '千年古都，牡丹花城',
            elements: ['龙门石窟', '应天门', '白马寺', '牡丹花会'],
            layout: '古典印章风格，唐风建筑剪影，红色为主调',
            colors: ['#dc143c', '#c9a96e', '#8b4513', '#ffd700', '#2f4f4f']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '龙门石窟', afternoon: '白马寺', evening: '洛邑古城/十字街夜市' }
                ],
                tips: ['龙门石窟需要3-4小时', '白马寺门口有共享单车'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 龙门石窟', afternoon: 'Day1: 白马寺', evening: 'Day1: 洛邑古城夜景', morning2: 'Day2: 洛阳博物馆 → 丽景门', afternoon2: 'Day2: 应天门/明堂天堂' }
                ],
                tips: ['应天门夜景很震撼', '水席是洛阳特色'],
                budget: '600-1000元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 龙门石窟', afternoon: 'Day1: 白马寺', evening: 'Day1: 洛邑古城', morning2: 'Day2: 老君山全天', afternoon2: 'Day2: 老君山云顶日落', evening2: 'Day2: 返回市区', morning3: 'Day3: 洛阳博物馆 → 丽景门', afternoon3: 'Day3: 应天门/明堂天堂', evening3: 'Day3: 十字街夜市' }
                ],
                tips: ['老君山需要一天时间', '洛阳汉服体验很火'],
                budget: '1200-1800元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 龙门石窟', afternoon: 'Day1: 白马寺', evening: 'Day1: 洛邑古城夜景', morning2: 'Day2: 老君山全天', afternoon2: 'Day2: 老君山云顶', evening2: 'Day2: 返回市区', morning3: 'Day3: 洛阳博物馆 → 丽景门', afternoon3: 'Day3: 应天门/明堂天堂', evening3: 'Day3: 十字街夜市', morning4: 'Day4: 白云山/龙潭大峡谷', afternoon4: 'Day4: 返程' }
                ],
                tips: ['白云山景观很美但较远', '洛阳美食偏酸辣'],
                budget: '1800-2800元'
            }
        }
    },
    '张家界': {
        tags: ['奇峰怪石', '武陵源', '阿凡达取景地'],
        season: '4-6月、9-11月',
        atmosphere: '奇山异水，天然氧吧',
        days: '4-5天',
        routes: ['天门山 → 玻璃栈道 → 天门洞 → 99道弯', '武陵源景区（袁家界 → 金鞭溪 →十里画廊）', '黄龙洞 → 宝峰湖', '张家界大峡谷玻璃桥'],
        foods: [
            { name: '土家三下锅', desc: '土家特色，辣得过瘾', price: '40-80元/人' },
            { name: '葛根粉', desc: '清凉解暑', price: '5-15元/碗' },
            { name: '湘西腊肉', desc: '烟熏味十足', price: '30-60元/人' },
            { name: '岩耳炖鸡', desc: '张家界特产', price: '80-150元/人' },
            { name: '酸萝卜', desc: '开胃小菜', price: '5-10元/份' }
        ],
        accommodations: [
            { area: '武陵源区', pros: '离森林公园近', cons: '离天门山远' },
            { area: '市区', pros: '交通便利，美食多', cons: '离景区较远' },
            { area: '景区山顶', pros: '看日出方便', cons: '住宿条件有限' }
        ],
        transport: [
            { type: '内部交通', info: '景区大巴；包车；步行' },
            { type: '外部交通', info: '荷花机场；张家界站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['天门山提前3天预约', '穿防滑运动鞋', '带好雨具', '景区范围大建议2-3天'],
            avoid: ['不要相信景区外低价票', '不要在景区门口买腊肉', '三下锅不要点微辣', '玻璃桥不要选低价团']
        },
        links: {
            official: 'https://www.zhangjiajie.gov.cn/',
            attractions: [
                { name: '天门山', url: 'https://www.tianmenshan.com/' },
                { name: '武陵源', url: 'https://www.wulingyuan.com/' },
                { name: '大峡谷玻璃桥', url: 'https://www.zjjg.com/' },
                { name: '黄龙洞', url: 'https://www.hld.com/' }
            ],
            booking: [
                { name: '天门山门票', url: 'https://www.tianmenshan.com/' },
                { name: '武陵源门票', url: 'https://www.wulingyuan.com/' }
            ],
            food: [
                { name: '张家界美食', url: 'https://www.dianping.com/zhangjiajie' },
                { name: '土家三下锅', url: 'https://www.tujia-food.com/' }
            ]
        },
        poster: {
            title: '奇境仙踪',
            subtitle: '三千奇峰，八百秀水',
            elements: ['天门山', '玻璃栈道', '袁家界', '金鞭溪'],
            layout: '奇幻风格，峰林剪影，云雾效果',
            colors: ['#2ecc71', '#3498db', '#f39c12', '#ffffff', '#34495e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { morning: '天门山 → 玻璃栈道', afternoon: '天门洞 → 99道弯', evening: '天门山索道下山/夜市' }
                ],
                tips: ['天门山提前3天预约', '玻璃栈道很刺激'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { morning: 'Day1: 天门山全天', afternoon: 'Day1: 玻璃栈道/天门洞', evening: 'Day1: 天门山夜景', morning2: 'Day2: 武陵源（袁家界）', afternoon2: 'Day2: 金鞭溪' }
                ],
                tips: ['天门山需要大半天', '武陵源景区很大'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { morning: 'Day1: 天门山全天', afternoon: 'Day1: 玻璃栈道', evening: 'Day1: 天门山索道', morning2: 'Day2: 武陵源（袁家界 → 天子山）', afternoon2: 'Day2: 十里画廊 → 金鞭溪', evening2: 'Day2: 景区住宿', morning3: 'Day3: 黄龙洞/宝峰湖', afternoon3: 'Day3: 返回市区', evening3: 'Day3: 返程' }
                ],
                tips: ['武陵源门票4天有效', '山顶住宿条件一般但方便看日出'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { morning: 'Day1: 天门山全天', afternoon: 'Day1: 玻璃栈道/天门洞', evening: 'Day1: 天门山夜景', morning2: 'Day2: 武陵源（袁家界）', afternoon2: 'Day2: 天子山 → 贺龙公园', evening2: 'Day2: 景区住宿', morning3: 'Day3: 十里画廊 → 金鞭溪', afternoon3: 'Day3: 黄龙洞', evening3: 'Day3: 返回市区', morning4: 'Day4: 张家界大峡谷玻璃桥', afternoon4: 'Day4: 返程' }
                ],
                tips: ['大峡谷玻璃桥很震撼', '建议穿防滑鞋'],
                budget: '2000-3500元'
            }
        }
    },
    '深圳': {
        tags: ['创新之都', '海滨城市', '主题公园'],
        season: '10-12月、3-4月',
        atmosphere: '年轻活力，科技创新',
        days: '3-4天',
        routes: ['世界之窗 → 欢乐谷 → 锦绣中华', '东部华侨城 → 大梅沙海滨公园', '深圳湾公园 → 人才公园 → 海岸城', '大鹏半岛 → 较场尾 → 杨梅坑'],
        foods: [
            { name: '早茶点心', desc: '粤式早茶，虾饺烧麦', price: '80-150元/人', mustTry: true },
            { name: '潮汕牛肉火锅', desc: '新鲜牛肉，手打牛肉丸', price: '100-200元/人', mustTry: true },
            { name: '椰子鸡', desc: '海南特色，清甜滋补', price: '80-150元/人' },
            { name: '光明乳鸽', desc: '深圳特产，皮脆肉嫩', price: '50-80元/只', mustTry: true },
            { name: '沙井蚝', desc: '本地特产，鲜美无比', price: '60-100元/人' }
        ],
        accommodations: [
            { area: '华侨城', pros: '主题公园集中，景观好', cons: '价格较高' },
            { area: '东门/罗湖', pros: '交通便利，购物方便', cons: '较嘈杂' },
            { area: '大鹏半岛', pros: '海边度假，安静浪漫', cons: '离市区远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景区；公交+共享单车' },
            { type: '外部交通', info: '宝安机场；深圳站、深圳北站、福田站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['欢乐谷、世界之窗需提前购票', '大梅沙周末人多', '东部华侨城很大，建议早点去', '带好防晒'],
            avoid: ['不要在东门买假名牌', '景区餐饮价格偏高', '避开节假日出行', '杨梅坑旺季停车难']
        },
        links: {
            official: 'https://www.sz.gov.cn/',
            attractions: [
                { name: '世界之窗', url: 'https://www.szwwco.com/', mustVisit: true },
                { name: '欢乐谷', url: 'https://www.szhtg.com/', mustVisit: true },
                { name: '东部华侨城', url: 'https://www.octbay.com/' },
                { name: '大梅沙', url: 'https://www.dameisha.com/' }
            ],
            booking: [
                { name: '欢乐谷门票', url: 'https://www.szhtg.com/' },
                { name: '世界之窗门票', url: 'https://www.szwwco.com/' }
            ],
            food: [
                { name: '早茶推荐', url: 'https://www.dianping.com/shenzhen' },
                { name: '潮汕美食', url: 'https://www.dianping.com/shenzhen' }
            ]
        },
        poster: {
            title: '创新之城',
            subtitle: '鹏城万里，活力无限',
            elements: ['平安金融中心', '世界之窗', '大小梅沙', '深圳湾'],
            layout: '现代科技风格，天际线剪影，蓝色为主调',
            colors: ['#3498db', '#1abc9c', '#f39c12', '#e74c3c', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '世界之窗/欢乐谷' },
                    { time: '12:00-14:00', afternoon: '午餐+休息' },
                    { time: '14:00-18:00', afternoon2: '东部华侨城/大梅沙' },
                    { time: '18:00-21:00', evening: '深圳湾看日落/海岸城美食' }
                ],
                tips: ['主题公园需要一整天', '大梅沙傍晚看日落很美'],
                budget: '300-600元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 世界之窗全天' },
                    { time: '17:00-21:00', evening: 'Day1: 欢乐海岸/深圳湾夜景' },
                    { time: '08:00-12:00', morning2: 'Day2: 东部华侨城（茶溪谷）' },
                    { time: '12:00-17:00', afternoon2: 'Day2: 大梅沙海滨公园' }
                ],
                tips: ['华侨城很大，建议坐接驳车', '大梅沙旺季人很多'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 世界之窗' },
                    { time: '17:00-21:00', evening: 'Day1: 欢乐海岸夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 欢乐谷全天' },
                    { time: '17:00-21:00', evening2: 'Day2: 东门老街/美食' },
                    { time: '08:00-14:00', morning3: 'Day3: 大鹏半岛（较场尾/杨梅坑）' },
                    { time: '14:00-18:00', afternoon3: 'Day3: 返程' }
                ],
                tips: ['大鹏半岛适合拍照', '杨梅坑有鹿嘴山庄'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 世界之窗' },
                    { time: '17:00-21:00', evening: 'Day1: 欢乐海岸' },
                    { time: '09:00-17:00', morning2: 'Day2: 欢乐谷' },
                    { time: '17:00-21:00', evening2: 'Day2: 东门美食街' },
                    { time: '08:00-17:00', morning3: 'Day3: 东部华侨城（茶溪谷+大峡谷）' },
                    { time: '17:00-21:00', evening3: 'Day3: 大梅沙夜景' },
                    { time: '08:00-14:00', morning4: 'Day4: 大鹏古城 → 杨梅坑' },
                    { time: '14:00-18:00', afternoon4: 'Day4: 返程' }
                ],
                tips: ['深圳景点较分散，建议租车', '海鲜去大鹏更便宜新鲜'],
                budget: '1800-3000元'
            },
            '5天4晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 世界之窗' },
                    { time: '17:00-21:00', evening: 'Day1: 欢乐海岸夜景' },
                    { time: '09:00-17:00', morning2: 'Day2: 欢乐谷' },
                    { time: '17:00-21:00', evening2: 'Day2: 东门美食街' },
                    { time: '08:00-17:00', morning3: 'Day3: 东部华侨城双谷' },
                    { time: '17:00-21:00', evening3: 'Day3: 大梅沙看日落' },
                    { time: '08:00-14:00', morning4: 'Day4: 大鹏古城 → 较场尾 → 杨梅坑' },
                    { time: '14:00-21:00', afternoon4: 'Day4: 较场尾海边民宿' },
                    { time: '08:00-12:00', morning5: 'Day5: 西涌/东涌海滩' },
                    { time: '12:00-17:00', afternoon5: 'Day5: 返程' }
                ],
                tips: ['较场尾有很多特色民宿', '西涌海水最干净'],
                budget: '2500-4000元'
            }
        }
    },
    '珠海': {
        tags: ['百岛之城', '浪漫海滨', '海洋温泉'],
        season: '10-12月、3-5月',
        atmosphere: '休闲浪漫，舒适宜居',
        days: '2-3天',
        routes: ['情侣路 → 珠海渔女 → 日月贝', '长隆海洋王国 → 横琴岛', '外伶仃岛/东澳岛一日游', '圆明新园 → 梦幻水城'],
        foods: [
            { name: '海鲜大餐', desc: '斗门海鲜，鲜活美味', price: '100-300元/人', mustTry: true },
            { name: '横琴蚝', desc: '珠海特产，肥嫩鲜美', price: '60-100元/人', mustTry: true },
            { name: '白蕉鲈鱼', desc: '清蒸最佳', price: '80-150元/人' },
            { name: '烧腊', desc: '广式烧腊，茶餐厅经典', price: '30-60元/人' },
            { name: '糖水', desc: '广东甜品，润肺清心', price: '15-30元/人' }
        ],
        accommodations: [
            { area: '拱北/情侣路', pros: '交通便利，景观好', cons: '节假日较挤' },
            { area: '横琴', pros: '长隆附近，适合亲子', cons: '离市区远' },
            { area: '海岛', pros: '海岛度假，体验独特', cons: '交通不便，物价高' }
        ],
        transport: [
            { type: '内部交通', info: '公交+共享单车；建议租车' },
            { type: '外部交通', info: '金湾机场；珠海站、珠海北站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['长隆海洋王国提前订票', '海岛需提前订船票', '带好防晒', '情侣路适合骑行'],
            avoid: ['不要在景区周边吃海鲜', '海岛旺季一票难求', '横琴口岸人流量大', '避开中午时段户外活动']
        },
        links: {
            official: 'https://www.zhuhai.gov.cn/',
            attractions: [
                { name: '长隆海洋王国', url: 'https://www.chimelong.com/', mustVisit: true },
                { name: '情侣路', url: 'https://www.zhuhai.gov.cn/' },
                { name: '外伶仃岛', url: 'https://www.wld123.com/' },
                { name: '东澳岛', url: 'https://www.dongao.com/' }
            ],
            booking: [
                { name: '长隆门票', url: 'https://www.chimelong.com/' },
                { name: '海岛船票', url: 'https://www.zhhsly.com/' }
            ],
            food: [
                { name: '斗门海鲜', url: 'https://www.dianping.com/zhuhai' },
                { name: '横琴生蚝', url: 'https://www.dianping.com/zhuhai' }
            ]
        },
        poster: {
            title: '浪漫珠海',
            subtitle: '百岛之城，浪漫之都',
            elements: ['日月贝', '珠海渔女', '长隆海洋王国', '情侣路'],
            layout: '海洋浪漫风格，贝壳元素，蓝色渐变背景',
            colors: ['#3498db', '#87ceeb', '#ffd700', '#ff6b6b', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '情侣路 → 珠海渔女' },
                    { time: '12:00-14:00', afternoon: '午餐+休息' },
                    { time: '14:00-18:00', afternoon2: '日月贝 → 城市阳台' },
                    { time: '18:00-21:00', evening: '情侣路骑行/看日落' }
                ],
                tips: ['情侣路适合傍晚骑行', '日月贝夜景很美'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 长隆海洋王国全天' },
                    { time: '17:00-21:00', evening: 'Day1: 横琴美食/烟花表演' },
                    { time: '08:00-12:00', morning2: 'Day2: 情侣路 → 珠海渔女' },
                    { time: '12:00-14:00', afternoon2: '午餐' },
                    { time: '14:00-18:00', afternoon2: '圆明新园/梦幻水城' }
                ],
                tips: ['长隆至少需要一天', '海洋王国烟花晚上8点'],
                budget: '800-1500元'
            },
            '3天2晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 长隆海洋王国' },
                    { time: '17:00-21:00', evening: 'Day1: 横琴夜景' },
                    { time: '08:00-12:00', morning2: 'Day2: 外伶仃岛/东澳岛' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 海岛观光/海鲜' },
                    { time: '18:00-21:00', evening2: 'Day2: 海岛住宿' },
                    { time: '08:00-12:00', morning3: 'Day3: 海岛日出 → 返回市区' },
                    { time: '12:00-18:00', afternoon3: 'Day3: 情侣路 → 圆明新园' }
                ],
                tips: ['海岛需提前订票', '东澳岛设施更完善'],
                budget: '1500-2500元'
            },
            '4天3晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 长隆海洋王国' },
                    { time: '17:00-21:00', evening: 'Day1: 横琴美食' },
                    { time: '08:00-17:00', morning2: 'Day2: 长隆宇宙飞船/大马戏' },
                    { time: '17:00-21:00', evening2: 'Day2: 返回市区' },
                    { time: '08:00-14:00', morning3: 'Day3: 外伶仃岛往返' },
                    { time: '14:00-21:00', afternoon3: 'Day3: 情侣路夜景' },
                    { time: '08:00-12:00', morning4: 'Day4: 珠海渔女 → 日月贝' },
                    { time: '12:00-17:00', afternoon4: 'Day4: 返程' }
                ],
                tips: ['海岛一天足够', '长隆可以买两日票'],
                budget: '2000-3500元'
            },
            '5天4晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 长隆海洋王国' },
                    { time: '17:00-21:00', evening: 'Day1: 烟花表演' },
                    { time: '09:00-17:00', morning2: 'Day2: 长隆宇宙飞船' },
                    { time: '17:00-21:00', evening2: 'Day2: 大马戏' },
                    { time: '08:00-17:00', morning3: 'Day3: 东澳岛全天' },
                    { time: '17:00-21:00', evening3: 'Day3: 海岛住宿' },
                    { time: '08:00-12:00', morning4: 'Day4: 海岛日出 → 返回' },
                    { time: '12:00-18:00', afternoon4: 'Day4: 情侣路 → 圆明新园' },
                    { time: '08:00-12:00', morning5: 'Day5: 珠海渔女 → 日月贝' },
                    { time: '12:00-17:00', afternoon5: 'Day5: 返程' }
                ],
                tips: ['海岛住宿提前订', '建议租电动车环岛'],
                budget: '3000-5000元'
            }
        }
    },
    '昆明': {
        tags: ['春城', '花都', '西南枢纽'],
        season: '3-6月、9-11月',
        atmosphere: '四季如春，鲜花常开',
        days: '3-4天',
        routes: ['翠湖 → 云南大学 → 讲武堂 → 南屏街', '石林 → 九乡', '滇池 → 西山龙门 → 民族村', '世博园 → 金殿 → 黑龙潭'],
        foods: [
            { name: '过桥米线', desc: '云南招牌，建新园/桥香园', price: '30-80元/人', mustTry: true },
            { name: '野生菌火锅', desc: '雨季限定，鸡枞/松茸', price: '150-300元/人', mustTry: true },
            { name: '鲜花饼', desc: '云南特产，嘉华现烤', price: '3-8元/个', mustTry: true },
            { name: '汽锅鸡', desc: '原汁原味，滋补养生', price: '80-150元/人' },
            { name: '烤乳扇', desc: '大理特色，奶香浓郁', price: '10-20元/串' }
        ],
        accommodations: [
            { area: '翠湖/五华区', pros: '老城核心，交通便利', cons: '价格适中' },
            { area: '呈贡大学城', pros: '新兴区域，安静舒适', cons: '离景点远' },
            { area: '滇池度假区', pros: '环境好，靠近滇池', cons: '交通不便' }
        ],
        transport: [
            { type: '内部交通', info: '地铁覆盖主要景区；公交+共享单车' },
            { type: '外部交通', info: '长水机场；昆明站、昆明南站' }
        ],
        budget: { low: '1200', medium: '2500', high: '4000+' },
        tips: {
            prepare: ['石林建议报一日游', '野生菌一定要煮熟', '紫外线强做好防晒', '四季如春但早晚温差大'],
            avoid: ['不要在景区买银饰', '野生菌别贪便宜', '石林电瓶车建议坐', '民族村购物要砍价']
        },
        links: {
            official: 'https://www.km.gov.cn/',
            attractions: [
                { name: '石林', url: 'https://www.shilin.com/', mustVisit: true },
                { name: '滇池', url: 'https://www.yndc.com/' },
                { name: '云南民族村', url: 'https://www.ynsmc.com/' },
                { name: '翠湖', url: 'https://www.cuhu.com/' }
            ],
            booking: [
                { name: '石林门票', url: 'https://www.shilin.com/' },
                { name: '民族村门票', url: 'https://www.ynsmc.com/' }
            ],
            food: [
                { name: '建新园', url: 'https://www.jianxinyuan.com/' },
                { name: '昆明美食', url: 'https://www.dianping.com/kunming' }
            ]
        },
        poster: {
            title: '春城花都',
            subtitle: '四季如春，鲜花不败',
            elements: ['石林', '滇池', '翠湖', '民族村'],
            layout: '花团锦簇风格，鲜花元素边框，春天气息',
            colors: ['#e74c3c', '#2ecc71', '#f39c12', '#3498db', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '翠湖 → 云南大学' },
                    { time: '12:00-14:00', afternoon: '午餐（南屏街）' },
                    { time: '14:00-18:00', afternoon2: '滇池 → 西山龙门' },
                    { time: '18:00-21:00', evening: '民族村/昆明老街' }
                ],
                tips: ['翠湖红嘴鸥11月-次年3月', '西山龙门能看到滇池全景'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 石林景区' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 九乡景区' },
                    { time: '18:00-21:00', evening: 'Day1: 返回市区' },
                    { time: '08:00-12:00', morning2: 'Day2: 翠湖 → 云南大学' },
                    { time: '12:00-14:00', afternoon2: 'Day2: 民族村' }
                ],
                tips: ['石林九乡可以一天玩完', '石林请导游很有必要'],
                budget: '600-1000元'
            },
            '3天2晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 石林 → 九乡' },
                    { time: '17:00-21:00', evening: 'Day1: 返回市区' },
                    { time: '08:00-12:00', morning2: 'Day2: 翠湖 → 讲武堂' },
                    { time: '12:00-14:00', afternoon: 'Day2: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day2: 滇池 → 西山' },
                    { time: '18:00-21:00', evening2: 'Day2: 民族村夜场' },
                    { time: '08:00-12:00', morning3: 'Day3: 世博园 → 金殿' },
                    { time: '12:00-18:00', afternoon3: 'Day3: 返程' }
                ],
                tips: ['民族村下午有表演', '金殿有樱花可看'],
                budget: '1000-1800元'
            },
            '4天3晚': {
                routes: [
                    { time: '08:00-17:00', morning: 'Day1: 石林全天' },
                    { time: '17:00-21:00', evening: 'Day1: 返回' },
                    { time: '08:00-17:00', morning2: 'Day2: 九乡 → 溶洞奇观' },
                    { time: '17:00-21:00', evening2: 'Day2: 市区美食' },
                    { time: '08:00-12:00', morning3: 'Day3: 翠湖 → 云南大学' },
                    { time: '12:00-14:00', afternoon: 'Day3: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day3: 滇池 → 西山' },
                    { time: '18:00-21:00', evening: 'Day3: 民族村' },
                    { time: '08:00-12:00', morning4: 'Day4: 世博园 → 金殿' },
                    { time: '12:00-17:00', afternoon4: 'Day4: 返程' }
                ],
                tips: ['石林需要一天时间', '云大校园很美'],
                budget: '1500-2500元'
            },
            '5天4晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 石林' },
                    { time: '12:00-17:00', afternoon: 'Day1: 九乡' },
                    { time: '17:00-21:00', evening: 'Day1: 返回' },
                    { time: '08:00-17:00', morning2: 'Day2: 东川红土地' },
                    { time: '17:00-21:00', evening2: 'Day2: 红土地住宿' },
                    { time: '08:00-12:00', morning3: 'Day3: 红土地日出 → 昆明' },
                    { time: '12:00-14:00', afternoon: 'Day3: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day3: 翠湖' },
                    { time: '18:00-21:00', evening: 'Day3: 南屏街' },
                    { time: '08:00-12:00', morning4: 'Day4: 滇池 → 西山' },
                    { time: '12:00-14:00', afternoon: 'Day4: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day4: 民族村' },
                    { time: '18:00-21:00', evening: 'Day4: 市区' },
                    { time: '08:00-12:00', morning5: 'Day5: 世博园 → 金殿' },
                    { time: '12:00-17:00', afternoon5: 'Day5: 返程' }
                ],
                tips: ['东川红土地摄影胜地', '最佳拍摄季节3-5月、9-12月'],
                budget: '2000-3500元'
            }
        }
    },
    '拉萨': {
        tags: ['日光城', '藏传佛教', '雪域高原'],
        season: '5-10月',
        atmosphere: '神圣纯净，信仰之地',
        days: '4-5天',
        routes: ['布达拉宫 → 大昭寺 → 八廓街', '纳木措一日游', '羊卓雍措 → 普莫雍措', '哲蚌寺 → 色拉寺 → 罗布林卡'],
        foods: [
            { name: '藏面', desc: '藏族早餐，面条劲道', price: '8-15元/碗', mustTry: true },
            { name: '甜茶', desc: '藏式奶茶，1元一杯', price: '1-3元/杯', mustTry: true },
            { name: '牦牛肉火锅', desc: '高原特产，肉质鲜嫩', price: '100-200元/人', mustTry: true },
            { name: '酥油茶', desc: '藏族传统，咸香浓郁', price: '5-10元/壶' },
            { name: '青稞酒', desc: '藏区特产，度数低', price: '10-20元/壶' }
        ],
        accommodations: [
            { area: '布达拉宫附近', pros: '景点集中，景观好', cons: '价格较高' },
            { area: '八廓街', pros: '藏式风情浓厚', cons: '海拔较高' },
            { area: '仙足岛', pros: '相对安静，客栈多', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '人力三轮车；公交；出租车' },
            { type: '外部交通', info: '贡嘎机场；拉萨站' }
        ],
        budget: { low: '3000', medium: '5000', high: '8000+' },
        tips: {
            prepare: ['提前服用红景天', '布达拉宫提前预约', '尊重当地宗教习俗', '高原紫外线强，防晒必备', '慢慢走，不要剧烈运动'],
            avoid: ['不要在布达拉宫拍照', '不要用手指指佛像', '不要在圣湖游泳', '不要购买野生动物制品']
        },
        links: {
            official: 'https://www.lasa.gov.cn/',
            attractions: [
                { name: '布达拉宫', url: 'https://www.potalapalace.com/', mustVisit: true },
                { name: '大昭寺', url: 'https://www.jokhang.com.cn/', mustVisit: true },
                { name: '纳木措', url: 'https://www.namtso.com/' },
                { name: '羊卓雍措', url: 'https://www.yamdrok.com/' }
            ],
            booking: [
                { name: '布达拉宫预约', url: 'https://www.potalapalace.com/' },
                { name: '纳木措一日游', url: 'https://www.namtso.com/' }
            ],
            food: [
                { name: '光明港琼甜茶馆', url: 'https://www.dianping.com/lhasa' },
                { name: '拉萨美食', url: 'https://www.dianping.com/lhasa' }
            ]
        },
        poster: {
            title: '日光之城',
            subtitle: '圣地拉萨，心灵之旅',
            elements: ['布达拉宫', '大昭寺', '纳木措', '羊卓雍措'],
            layout: '雪域高原风格，藏式建筑剪影，蓝天白云背景',
            colors: ['#3498db', '#c9a96e', '#dc143c', '#ffffff', '#1a1a2e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '布达拉宫参观' },
                    { time: '12:00-14:00', afternoon: '午餐+休息' },
                    { time: '14:00-18:00', afternoon2: '大昭寺 → 八廓街' },
                    { time: '18:00-21:00', evening: '布达拉宫夜景' }
                ],
                tips: ['布达拉宫提前1-2天预约', '大昭寺请导游讲解'],
                budget: '300-500元'
            },
            '2天1晚': {
                routes: [
                    { time: '09:00-17:00', morning: 'Day1: 布达拉宫 → 大昭寺' },
                    { time: '17:00-21:00', evening: 'Day1: 八廓街闲逛' },
                    { time: '06:00-18:00', morning2: 'Day2: 纳木措一日游' }
                ],
                tips: ['纳木措海拔高，注意高反', '看日出要早起'],
                budget: '800-1200元'
            },
            '3天2晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 布达拉宫' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 大昭寺' },
                    { time: '18:00-21:00', evening: 'Day1: 八廓街' },
                    { time: '06:00-18:00', morning2: 'Day2: 纳木措' },
                    { time: '18:00-21:00', evening2: 'Day2: 返回' },
                    { time: '09:00-12:00', morning3: 'Day3: 色拉寺 → 哲蚌寺' },
                    { time: '12:00-18:00', afternoon3: 'Day3: 罗布林卡' }
                ],
                tips: ['色拉寺下午有辩经', '哲蚌寺是西藏最大寺庙'],
                budget: '1200-2000元'
            },
            '4天3晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 布达拉宫' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 大昭寺' },
                    { time: '18:00-21:00', evening: 'Day1: 八廓街夜景' },
                    { time: '06:00-18:00', morning2: 'Day2: 纳木措' },
                    { time: '18:00-21:00', evening2: 'Day2: 返回' },
                    { time: '09:00-17:00', morning3: 'Day3: 羊卓雍措 → 普莫雍措' },
                    { time: '17:00-21:00', evening3: 'Day3: 返回' },
                    { time: '09:00-12:00', morning4: 'Day4: 色拉寺 → 哲蚌寺' },
                    { time: '12:00-18:00', afternoon4: 'Day4: 罗布林卡' }
                ],
                tips: ['羊湖海拔较高注意高反', '沿途风景很美'],
                budget: '1800-2800元'
            },
            '5天4晚': {
                routes: [
                    { time: '09:00-12:00', morning: 'Day1: 布达拉宫' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 大昭寺' },
                    { time: '18:00-21:00', evening: 'Day1: 八廓街' },
                    { time: '06:00-18:00', morning2: 'Day2: 纳木措' },
                    { time: '18:00-21:00', evening2: 'Day2: 返回' },
                    { time: '08:00-17:00', morning3: 'Day3: 羊卓雍措 → 普莫雍措' },
                    { time: '17:00-21:00', evening3: 'Day3: 返回' },
                    { time: '09:00-12:00', morning4: 'Day4: 色拉寺 → 哲蚌寺' },
                    { time: '12:00-14:00', afternoon: 'Day4: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day4: 罗布林卡' },
                    { time: '09:00-12:00', morning5: 'Day5: 扎基寺 → 小昭寺' },
                    { time: '12:00-17:00', afternoon5: 'Day5: 返程' }
                ],
                tips: ['扎基寺是财神庙', '小昭寺人少更清净'],
                budget: '2500-4000元'
            }
        }
    },
    '乌鲁木齐': {
        tags: ['天山脚下', '瓜果之乡', '中亚风情'],
        season: '6-9月、12-2月',
        atmosphere: '民族风情，烤肉飘香',
        days: '4-5天',
        routes: ['天山天池一日游', '国际大巴扎 → 红山公园', '南山风景区', '吐鲁番一日游（葡萄沟/火焰山/坎儿井）'],
        foods: [
            { name: '羊肉串', desc: '新疆招牌，红柳大串', price: '8-15元/串', mustTry: true },
            { name: '大盘鸡', desc: '新疆代表菜，量大味美', price: '80-150元/份', mustTry: true },
            { name: '手抓饭', desc: '维吾尔族传统', price: '30-50元/人' },
            { name: '馕', desc: '新疆特色，外脆内软', price: '3-8元/个' },
            { name: '哈密瓜', desc: '吐鲁番特产，甘甜无比', price: '5-15元/斤' }
        ],
        accommodations: [
            { area: '天山区', pros: '老城核心，交通便利', cons: '人流较多' },
            { area: '沙依巴克区', pros: '大巴扎附近', cons: '较嘈杂' }
        ],
        transport: [
            { type: '内部交通', info: '公交+BRT；出租车' },
            { type: '外部交通', info: '地窝堡机场；乌鲁木齐站' }
        ],
        budget: { low: '2000', medium: '4000', high: '6000+' },
        tips: {
            prepare: ['天池提前购票', '时差2小时', '防晒必备'],
            avoid: ['不要在景区买玉', '吐鲁番夏季高温']
        },
        links: {
            official: 'https://www.urumqi.gov.cn/',
            attractions: [
                { name: '天山天池', url: 'https://www.tianchi.com/', mustVisit: true },
                { name: '国际大巴扎', url: 'https://www.bazar.com.cn/', mustVisit: true },
                { name: '吐鲁番', url: 'https://www.turpan.com/' }
            ],
            booking: [
                { name: '天池门票', url: 'https://www.tianchi.com/' }
            ],
            food: [
                { name: '新疆美食', url: 'https://www.dianping.com/urumqi' }
            ]
        },
        poster: {
            title: '天山明珠',
            subtitle: '歌舞之乡，瓜果之城',
            elements: ['天山天池', '国际大巴扎', '火焰山'],
            layout: '西域风情',
            colors: ['#f39c12', '#e74c3c', '#2ecc71']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '09:00-12:00', morning: '国际大巴扎' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-18:00', afternoon2: '红山公园' },
                    { time: '18:00-21:00', evening: '大巴扎夜景' }
                ],
                tips: ['大巴扎晚上有表演'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-16:00', morning: 'Day1: 天山天池' },
                    { time: '16:00-21:00', evening: 'Day1: 返回市区' },
                    { time: '09:00-12:00', morning2: 'Day2: 国际大巴扎' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 红山公园' }
                ],
                tips: ['天池需要大半天'],
                budget: '600-1000元'
            },
            '3天2晚': {
                routes: [
                    { time: '08:00-16:00', morning: 'Day1: 天山天池' },
                    { time: '16:00-21:00', evening: 'Day1: 返回' },
                    { time: '09:00-17:00', morning2: 'Day2: 吐鲁番全天' },
                    { time: '17:00-21:00', evening2: 'Day2: 返回' },
                    { time: '09:00-12:00', morning3: 'Day3: 大巴扎' },
                    { time: '12:00-18:00', afternoon3: 'Day3: 南山牧场' }
                ],
                tips: ['吐鲁番夏季很热'],
                budget: '1000-1800元'
            }
        }
    },
    '兰州': {
        tags: ['黄河之都', '丝绸之路', '牛肉面之城'],
        season: '5-9月',
        atmosphere: '黄河穿城，丝路重镇',
        days: '2-3天',
        routes: ['黄河风情线 → 中山桥 → 白塔山', '甘肃省博物馆 → 黄河母亲像', '五泉山公园', '青城古镇'],
        foods: [
            { name: '牛肉面', desc: '兰州招牌，一清二白三红四绿', price: '8-15元/碗', mustTry: true },
            { name: '手抓羊肉', desc: '甘南草原羊肉，鲜嫩无比', price: '50-80元/斤', mustTry: true },
            { name: '羊肉泡馍', desc: '料重味醇', price: '20-30元/人' },
            { name: '灰豆子', desc: '兰州甜品，软糯香甜', price: '5-10元/碗' },
            { name: '热冬果', desc: '兰州特色，冬季必吃', price: '5-10元/个' }
        ],
        accommodations: [
            { area: '城关区', pros: '老城核心，交通便利', cons: '人流较多' },
            { area: '七里河区', pros: '靠近黄河风情线', cons: '离火车站远' }
        ],
        transport: [
            { type: '内部交通', info: '公交+出租车' },
            { type: '外部交通', info: '中川机场；兰州站、兰州西站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['中山桥看黄河日落很美', '牛肉面早餐必吃', '带好防晒'],
            avoid: ['不要在景区买牛肉干', '不要相信低价一日游']
        },
        links: {
            official: 'https://www.lzscn.com.cn/',
            attractions: [
                { name: '黄河风情线', url: 'https://www.lzscn.com.cn/', mustVisit: true },
                { name: '甘肃省博物馆', url: 'https://www.gsmuseum.cn/' },
                { name: '白塔山', url: 'https://www.lzscn.com.cn/' }
            ],
            booking: [
                { name: '门票预订', url: 'https://www.lzscn.com.cn/' }
            ],
            food: [
                { name: '兰州牛肉面', url: 'https://www.dianping.com/lanzhou' }
            ]
        },
        poster: {
            title: '黄河之都',
            subtitle: '丝路重镇，牛肉面香',
            elements: ['黄河', '中山桥', '白塔山', '牛肉面'],
            layout: '黄河风情风格',
            colors: ['#f39c12', '#e74c3c', '#3498db', '#ffffff']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '黄河风情线 → 中山桥' },
                    { time: '12:00-14:00', afternoon: '午餐（正宁路夜市）' },
                    { time: '14:00-18:00', afternoon2: '甘肃省博物馆' },
                    { time: '18:00-21:00', evening: '黄河母亲像 → 白塔山夜景' }
                ],
                tips: ['牛肉面早餐最佳', '白塔山看日落很美'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 黄河风情线' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 甘肃省博物馆' },
                    { time: '18:00-21:00', evening: 'Day1: 白塔山夜景' },
                    { time: '08:00-12:00', morning2: 'Day2: 五泉山公园' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 青城古镇' }
                ],
                tips: ['青城古镇是千年古镇', '夏季来更好'],
                budget: '600-1000元'
            }
        }
    },
    '沈阳': {
        tags: ['工业重镇', '清朝发祥地', '东北中心'],
        season: '5-9月、12-2月',
        atmosphere: '工业城市，皇家气息',
        days: '2-3天',
        routes: ['沈阳故宫 → 张氏帅府 → 中街', '北陵公园 → 清昭陵', '沈阳博物馆 → 大帅府', '棋盘山 → 怪坡'],
        foods: [
            { name: '老边饺子', desc: '沈阳招牌，皮薄馅大', price: '30-60元/人', mustTry: true },
            { name: '李连贵熏肉大饼', desc: '百年老店，传统名吃', price: '20-40元/人', mustTry: true },
            { name: '沈阳回头', desc: '面食小吃，酥脆可口', price: '10-20元/人' },
            { name: '锅包肉', desc: '东北代表菜，酸甜酥脆', price: '40-80元/人' },
            { name: '杀猪菜', desc: '东北特色，血肠酸菜', price: '30-60元/人' }
        ],
        accommodations: [
            { area: '沈河区', pros: '故宫/中街附近', cons: '价格较高' },
            { area: '和平区', pros: '交通便利，美食多', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交' },
            { type: '外部交通', info: '桃仙机场；沈阳站、沈阳北站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['沈阳故宫比北京故宫小很多', '冬季来可以看雪景', '带好保暖'],
            avoid: ['不要在故宫门口买票', '中街购物要还价']
        },
        links: {
            official: 'https://www.shenyang.gov.cn/',
            attractions: [
                { name: '沈阳故宫', url: 'https://www.mmgz.synt.gov.cn/', mustVisit: true },
                { name: '张氏帅府', url: 'https://www.symzmuseum.com.cn/' },
                { name: '北陵公园', url: 'https://www.beiling.com/' }
            ],
            booking: [
                { name: '沈阳故宫门票', url: 'https://www.mmgz.synt.gov.cn/' }
            ],
            food: [
                { name: '老边饺子', url: 'https://www.lbjj.com.cn/' },
                { name: '沈阳美食', url: 'https://www.dianping.com/shenyang' }
            ]
        },
        poster: {
            title: '盛京往事',
            subtitle: '工业之城，清朝故都',
            elements: ['沈阳故宫', '张氏帅府', '中街', '北陵'],
            layout: '古典与现代结合',
            colors: ['#e74c3c', '#f39c12', '#c9a96e', '#34495e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '沈阳故宫' },
                    { time: '12:00-14:00', afternoon: '午餐（中街）' },
                    { time: '14:00-18:00', afternoon2: '张氏帅府 → 中街' },
                    { time: '18:00-21:00', evening: '沈阳夜市美食' }
                ],
                tips: ['故宫请导游讲解', '中街是中国第一条商业步行街'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 沈阳故宫' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 张氏帅府' },
                    { time: '18:00-21:00', evening: 'Day1: 中街夜市' },
                    { time: '08:00-12:00', morning2: 'Day2: 北陵公园' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 沈阳博物馆' }
                ],
                tips: ['北陵是清太宗皇太极陵墓', '冬季北陵雪景很美'],
                budget: '600-1000元'
            }
        }
    },
    '郑州': {
        tags: ['中原腹地', '铁路之城', '商都'],
        season: '4-6月、9-11月',
        atmosphere: '中原文化，嵩山少林',
        days: '2-3天',
        routes: ['少林寺 → 嵩山 → 塔林', '郑州博物馆 → 二七纪念塔', '黄河风景区', '嵩阳书院 → 中岳庙'],
        foods: [
            { name: '烩面', desc: '河南招牌，汤鲜面劲', price: '15-30元/碗', mustTry: true },
            { name: '胡辣汤', desc: '早餐首选，辛辣开胃', price: '5-10元/碗', mustTry: true },
            { name: '灌汤包', desc: '开封特色，皮薄汁多', price: '20-40元/人' },
            { name: '羊肉汤', desc: '洛阳水席代表', price: '20-40元/碗' },
            { name: '卷凉皮', desc: '街头小吃，清爽可口', price: '5-10元/份' }
        ],
        accommodations: [
            { area: '二七区', pros: '火车站附近，交通便利', cons: '较嘈杂' },
            { area: '金水区', pros: '市中心，美食多', cons: '价格较高' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交+出租车' },
            { type: '外部交通', info: '新郑机场；郑州站、郑州东站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['少林寺至少需要半天', '嵩山有索道', '胡辣汤是早餐必吃'],
            avoid: ['不要相信少林寺门口算命', '景区周边餐饮较贵']
        },
        links: {
            official: 'https://www.zhengzhou.gov.cn/',
            attractions: [
                { name: '少林寺', url: 'https://www.shaolin.org.cn/', mustVisit: true },
                { name: '嵩山', url: 'https://www.songshan.com.cn/' },
                { name: '郑州博物馆', url: 'https://www.zzmuseum.com/' }
            ],
            booking: [
                { name: '少林寺门票', url: 'https://www.shaolin.org.cn/' }
            ],
            food: [
                { name: '郑州美食', url: 'https://www.dianping.com/zhengzhou' },
                { name: '烩面推荐', url: 'https://www.dianping.com/zhengzhou' }
            ]
        },
        poster: {
            title: '中原明珠',
            subtitle: '少林功夫，商都文化',
            elements: ['少林寺', '嵩山', '烩面', '黄河'],
            layout: '中原文化风格',
            colors: ['#e74c3c', '#f39c12', '#c9a96e', '#8b4513']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '07:00-12:00', morning: '少林寺 → 塔林' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-18:00', afternoon2: '嵩山三皇寨/索道' },
                    { time: '18:00-21:00', evening: '观看少林表演' }
                ],
                tips: ['少林寺武术表演上午下午都有', '建议早去避开人流'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '07:00-12:00', morning: 'Day1: 少林寺全天' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 嵩山' },
                    { time: '18:00-21:00', evening: 'Day1: 登封夜市' },
                    { time: '08:00-12:00', morning2: 'Day2: 郑州博物馆' },
                    { time: '12:00-14:00', afternoon2: 'Day2: 二七纪念塔' }
                ],
                tips: ['少林寺门票包含武术表演', '嵩山风景很美'],
                budget: '600-1000元'
            }
        }
    },
    '贵阳': {
        tags: ['林城', '避暑之都', '多彩贵州'],
        season: '6-8月、3-5月',
        atmosphere: '清凉宜人，酸辣美食',
        days: '3-4天',
        routes: ['黔灵山公园 → 甲秀楼', '黄果树瀑布一日游', '青岩古镇', '花溪公园 → 十里河滩'],
        foods: [
            { name: '酸汤鱼', desc: '贵州招牌，凯里酸汤', price: '60-120元/人', mustTry: true },
            { name: '肠旺面', desc: '贵阳早餐必备', price: '10-20元/碗', mustTry: true },
            { name: '丝娃娃', desc: '素春卷，凉爽可口', price: '15-30元/人' },
            { name: '豆腐圆子', desc: '贵州特色，外脆内嫩', price: '10-20元/人' },
            { name: '辣子鸡', desc: '贵州名菜，香辣过瘾', price: '50-80元/份' }
        ],
        accommodations: [
            { area: '南明区', pros: '甲秀楼附近，景观好', cons: '价格适中' },
            { area: '云岩区', pros: '市中心，交通便利', cons: '人流较多' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交+BRT' },
            { type: '外部交通', info: '龙洞堡机场；贵阳站、贵阳北站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['夏季避暑好去处', '黄果树需提前购票', '酸汤鱼必吃'],
            avoid: ['不要在景区买银饰', '黄果树旺季人很多']
        },
        links: {
            official: 'https://www.guiyang.gov.cn/',
            attractions: [
                { name: '黄果树瀑布', url: 'https://www.huangguoshu.com.cn/', mustVisit: true },
                { name: '黔灵山', url: 'https://www.qianlingshan.com/' },
                { name: '青岩古镇', url: 'https://www.qingyan.com.cn/' }
            ],
            booking: [
                { name: '黄果树门票', url: 'https://www.huangguoshu.com.cn/' }
            ],
            food: [
                { name: '贵阳美食', url: 'https://www.dianping.com/guiyang' }
            ]
        },
        poster: {
            title: '林城夏宫',
            subtitle: '避暑之都，多彩贵州',
            elements: ['黄果树', '黔灵山', '甲秀楼', '酸汤鱼'],
            layout: '山水田园风格',
            colors: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '黔灵山公园（看猕猴）' },
                    { time: '12:00-14:00', afternoon: '午餐（蔡家街美食）' },
                    { time: '14:00-18:00', afternoon2: '甲秀楼 → 南明河畔' },
                    { time: '18:00-21:00', evening: '二七路夜市' }
                ],
                tips: ['黔灵山猴子很多注意安全', '甲秀楼夜景很美'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '07:00-15:00', morning: 'Day1: 黄果树瀑布全天' },
                    { time: '15:00-21:00', evening: 'Day1: 返回市区' },
                    { time: '08:00-12:00', morning2: 'Day2: 青岩古镇' },
                    { time: '12:00-14:00', afternoon2: 'Day2: 午餐（青岩猪蹄）' },
                    { time: '14:00-18:00', afternoon2: 'Day2: 花溪公园' }
                ],
                tips: ['黄果树需要一整天', '青岩古镇美食很多'],
                budget: '600-1000元'
            }
        }
    },
    '济南': {
        tags: ['泉城', '齐鲁文化', '大明湖'],
        season: '4-6月、9-11月',
        atmosphere: '泉水之城，文化底蕴',
        days: '2-3天',
        routes: ['趵突泉 → 大明湖 → 千佛山', '黑虎泉 → 宽厚里 → 泉城广场', '章丘百脉泉', '灵岩寺'],
        foods: [
            { name: '九转大肠', desc: '鲁菜经典，肥而不腻', price: '60-100元/份', mustTry: true },
            { name: '糖醋鲤鱼', desc: '济南名菜，外酥里嫩', price: '80-150元/份', mustTry: true },
            { name: '油旋', desc: '济南传统小吃，酥脆可口', price: '5-10元/个' },
            { name: '甜沫', desc: '济南早餐必备', price: '3-5元/碗' },
            { name: '把子肉', desc: '济南特色，肥而不腻', price: '15-25元/份' }
        ],
        accommodations: [
            { area: '历下区', pros: '市中心，景点集中', cons: '价格较高' },
            { area: '市中区', pros: '交通便利，美食多', cons: '离景点稍远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交+共享单车' },
            { type: '外部交通', info: '遥墙机场；济南站、济南西站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['趵突泉建议早上看', '大明湖夜景很美', '带好雨伞'],
            avoid: ['不要在景区买泉水', '不要相信黑导游']
        },
        links: {
            official: 'https://www.jinan.gov.cn/',
            attractions: [
                { name: '趵突泉', url: 'https://www.baotuquan.com/', mustVisit: true },
                { name: '大明湖', url: 'https://www.daminghu.com/' },
                { name: '千佛山', url: 'https://www.qianfoshan.com/' }
            ],
            booking: [
                { name: '景区门票', url: 'https://www.jinan.gov.cn/' }
            ],
            food: [
                { name: '济南美食', url: 'https://www.dianping.com/jinan' }
            ]
        },
        poster: {
            title: '泉城济南',
            subtitle: '家家泉水，户户垂杨',
            elements: ['趵突泉', '大明湖', '千佛山', '九转大肠'],
            layout: '泉水文化风格',
            colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '趵突泉 → 泉城广场' },
                    { time: '12:00-14:00', afternoon: '午餐（宽厚里美食）' },
                    { time: '14:00-18:00', afternoon2: '大明湖 → 黑虎泉' },
                    { time: '18:00-21:00', evening: '千佛山夜景' }
                ],
                tips: ['趵突泉早上去人少', '大明湖有船游'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 趵突泉' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 大明湖' },
                    { time: '18:00-21:00', evening: 'Day1: 泉城广场夜景' },
                    { time: '08:00-12:00', morning2: 'Day2: 千佛山' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 章丘百脉泉' }
                ],
                tips: ['百脉泉比趵突泉人少', '千佛山可以看全景'],
                budget: '600-1000元'
            }
        }
    },
    '太原': {
        tags: ['龙城', '晋商故里', '汾河之都'],
        season: '4-6月、9-11月',
        atmosphere: '晋商文化，历史悠久',
        days: '2-3天',
        routes: ['晋祠 → 天龙山石窟', '太原博物馆 → 汾河公园', '蒙山大佛', '纯阳宫 → 山西省博物馆'],
        foods: [
            { name: '刀削面', desc: '山西招牌，筋道可口', price: '10-20元/碗', mustTry: true },
            { name: '老陈醋', desc: '山西特产，酸香浓郁', price: '15-30元/瓶', mustTry: true },
            { name: '头脑', desc: '太原特色，营养滋补', price: '20-30元/碗' },
            { name: '过油肉', desc: '山西名菜，外酥里嫩', price: '40-60元/份' },
            { name: '碗托', desc: '山西小吃，凉爽可口', price: '5-10元/份' }
        ],
        accommodations: [
            { area: '迎泽区', pros: '市中心，交通便利', cons: '人流较多' },
            { area: '小店区', pros: '新区，环境好', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交+出租车' },
            { type: '外部交通', info: '武宿机场；太原站、太原南站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['晋祠需要半天', '带好防晒', '陈醋是特产'],
            avoid: ['不要在景区买假醋', '不要相信低价一日游']
        },
        links: {
            official: 'https://www.taiyuan.gov.cn/',
            attractions: [
                { name: '晋祠', url: 'https://www.jinci.com/', mustVisit: true },
                { name: '蒙山大佛', url: 'https://www.mengshan.com/' },
                { name: '山西省博物馆', url: 'https://www.shanximuseum.com/' }
            ],
            booking: [
                { name: '晋祠门票', url: 'https://www.jinci.com/' }
            ],
            food: [
                { name: '太原美食', url: 'https://www.dianping.com/taiyuan' }
            ]
        },
        poster: {
            title: '龙城太原',
            subtitle: '晋商故里，汾河明珠',
            elements: ['晋祠', '蒙山大佛', '汾河', '刀削面'],
            layout: '晋商文化风格',
            colors: ['#8b4513', '#e74c3c', '#f39c12', '#34495e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '晋祠' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-18:00', afternoon2: '蒙山大佛' },
                    { time: '18:00-21:00', evening: '汾河公园夜景' }
                ],
                tips: ['晋祠历史悠久', '蒙山大佛很震撼'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 晋祠' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 天龙山石窟' },
                    { time: '18:00-21:00', evening: 'Day1: 汾河公园' },
                    { time: '08:00-12:00', morning2: 'Day2: 山西省博物馆' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 纯阳宫' }
                ],
                tips: ['天龙山石窟值得看', '博物馆免费但需预约'],
                budget: '600-1000元'
            }
        }
    },
    '南宁': {
        tags: ['绿城', '壮乡首府', '南国门户'],
        season: '10-12月、3-5月',
        atmosphere: '热带风情，民族特色',
        days: '2-3天',
        routes: ['青秀山 → 南湖公园', '广西民族博物馆', '大明山', '扬美古镇'],
        foods: [
            { name: '老友粉', desc: '南宁招牌，酸辣开胃', price: '10-20元/碗', mustTry: true },
            { name: '柠檬鸭', desc: '广西名菜，酸爽可口', price: '60-100元/份', mustTry: true },
            { name: '粉饺', desc: '南宁小吃，皮薄馅大', price: '10-15元/份' },
            { name: '酸嘢', desc: '广西特色，酸甜开胃', price: '10-20元/斤' },
            { name: '邕州鱼生', desc: '南宁特色，鲜嫩爽口', price: '80-150元/斤' }
        ],
        accommodations: [
            { area: '青秀区', pros: '市中心，景点集中', cons: '价格较高' },
            { area: '西乡塘区', pros: '大学城区，美食多', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交+共享单车' },
            { type: '外部交通', info: '吴圩机场；南宁站、南宁东站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['青秀山很大建议坐观光车', '带好防晒和防蚊', '老友粉早餐必吃'],
            avoid: ['不要在景区买水果', '不要相信黑导游']
        },
        links: {
            official: 'https://www.nanning.gov.cn/',
            attractions: [
                { name: '青秀山', url: 'https://www.qingxiushan.com/', mustVisit: true },
                { name: '广西民族博物馆', url: 'https://www.gxmb.org/' },
                { name: '大明山', url: 'https://www.daming.com.cn/' }
            ],
            booking: [
                { name: '青秀山门票', url: 'https://www.qingxiushan.com/' }
            ],
            food: [
                { name: '南宁美食', url: 'https://www.dianping.com/nanning' }
            ]
        },
        poster: {
            title: '绿城南宁',
            subtitle: '壮乡首府，南国风情',
            elements: ['青秀山', '南湖', '民族博物馆', '老友粉'],
            layout: '热带风情风格',
            colors: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '青秀山' },
                    { time: '12:00-14:00', afternoon: '午餐（中山路美食街）' },
                    { time: '14:00-18:00', afternoon2: '广西民族博物馆' },
                    { time: '18:00-21:00', evening: '南湖公园夜景' }
                ],
                tips: ['青秀山要早去', '中山路晚上更热闹'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 青秀山' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 广西民族博物馆' },
                    { time: '18:00-21:00', evening: 'Day1: 中山路夜市' },
                    { time: '08:00-12:00', morning2: 'Day2: 大明山' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 扬美古镇' }
                ],
                tips: ['大明山需要一整天', '扬美古镇有千年历史'],
                budget: '600-1000元'
            }
        }
    },
    '西宁': {
        tags: ['夏都', '青藏高原', '塔尔寺'],
        season: '6-8月',
        atmosphere: '高原风光，民族风情',
        days: '2-3天',
        routes: ['塔尔寺 → 西宁市区', '青海湖一日游', '贵德黄河', '门源油菜花海'],
        foods: [
            { name: '手抓羊肉', desc: '青海招牌，鲜嫩无比', price: '50-80元/斤', mustTry: true },
            { name: '酸奶', desc: '青海特色，酸甜可口', price: '5-15元/碗', mustTry: true },
            { name: '酿皮', desc: '青海小吃，凉爽可口', price: '10-15元/份' },
            { name: '炒面片', desc: '青海主食，劲道美味', price: '15-25元/碗' },
            { name: '烤羊肉串', desc: '青海特色，香嫩多汁', price: '5-10元/串' }
        ],
        accommodations: [
            { area: '城西区', pros: '塔尔寺方向，交通便利', cons: '价格适中' },
            { area: '城东区', pros: '回族美食多', cons: '较嘈杂' }
        ],
        transport: [
            { type: '内部交通', info: '公交+出租车' },
            { type: '外部交通', info: '曹家堡机场；西宁站' }
        ],
        budget: { low: '1500', medium: '3000', high: '5000+' },
        tips: {
            prepare: ['带好防晒', '防高反药物', '昼夜温差大带外套'],
            avoid: ['不要在景区买银饰', '不要相信低价青海湖团']
        },
        links: {
            official: 'https://www.xining.gov.cn/',
            attractions: [
                { name: '塔尔寺', url: 'https://www.tahsi.com/', mustVisit: true },
                { name: '青海湖', url: 'https://www.qinghaihu.com.cn/' },
                { name: '门源花海', url: 'https://www.menyuan.com.cn/' }
            ],
            booking: [
                { name: '塔尔寺门票', url: 'https://www.tahsi.com/' },
                { name: '青海湖一日游', url: 'https://www.qinghaihu.com.cn/' }
            ],
            food: [
                { name: '西宁美食', url: 'https://www.dianping.com/xining' }
            ]
        },
        poster: {
            title: '夏都西宁',
            subtitle: '高原明珠，清凉之都',
            elements: ['塔尔寺', '青海湖', '油菜花海', '手抓羊肉'],
            layout: '高原风光风格',
            colors: ['#2ecc71', '#3498db', '#f39c12', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '塔尔寺' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-18:00', afternoon2: '西宁市区（莫家街/水井巷）' },
                    { time: '18:00-21:00', evening: '西宁夜市' }
                ],
                tips: ['塔尔寺请导游讲解', '莫家街美食很多'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 塔尔寺' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 西宁市区' },
                    { time: '18:00-21:00', evening: 'Day1: 夜市' },
                    { time: '06:00-18:00', morning2: 'Day2: 青海湖一日游' }
                ],
                tips: ['青海湖需要一整天', '带上厚外套'],
                budget: '600-1000元'
            }
        }
    },
    '银川': {
        tags: ['塞上江南', '西夏古都', '回乡风情'],
        season: '5-9月',
        atmosphere: '沙漠绿洲，回族风情',
        days: '2-3天',
        routes: ['西夏王陵 → 贺兰山岩画', '沙湖 → 沙坡头', '水洞沟 → 镇北堡西部影城', '银川市区（南关清真寺）'],
        foods: [
            { name: '手抓羊肉', desc: '宁夏招牌，鲜嫩无比', price: '50-80元/斤', mustTry: true },
            { name: '宁夏滩羊', desc: '宁夏特产，肉质细嫩', price: '80-150元/斤', mustTry: true },
            { name: '羊杂碎', desc: '宁夏特色，汤鲜味美', price: '15-25元/碗' },
            { name: '馓子', desc: '回族传统，酥脆可口', price: '10-20元/斤' },
            { name: '枸杞', desc: '宁夏特产，滋补养生', price: '30-60元/斤' }
        ],
        accommodations: [
            { area: '兴庆区', pros: '市中心，交通便利', cons: '价格适中' },
            { area: '金凤区', pros: '新区，环境好', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '公交+出租车' },
            { type: '外部交通', info: '河东机场；银川站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['沙湖沙坡头需要一整天', '带好防晒和墨镜', '尊重回族习俗'],
            avoid: ['不要在景区买枸杞', '不要相信低价沙漠团']
        },
        links: {
            official: 'https://www.yinchuan.gov.cn/',
            attractions: [
                { name: '西夏王陵', url: 'https://www.xixia王陵.com/', mustVisit: true },
                { name: '沙湖', url: 'https://www.shahu.com.cn/' },
                { name: '沙坡头', url: 'https://www.shapotou.com/' }
            ],
            booking: [
                { name: '景区门票', url: 'https://www.yinchuan.gov.cn/' }
            ],
            food: [
                { name: '银川美食', url: 'https://www.dianping.com/yinchuan' }
            ]
        },
        poster: {
            title: '塞上江南',
            subtitle: '西夏古都，回乡风情',
            elements: ['西夏王陵', '沙湖', '贺兰山', '手抓羊肉'],
            layout: '沙漠绿洲风格',
            colors: ['#f39c12', '#e74c3c', '#2ecc71', '#34495e']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '西夏王陵' },
                    { time: '12:00-14:00', afternoon: '午餐' },
                    { time: '14:00-18:00', afternoon2: '贺兰山岩画' },
                    { time: '18:00-21:00', evening: '银川市区' }
                ],
                tips: ['西夏王陵历史悠久', '贺兰山岩画很震撼'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 西夏王陵' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 贺兰山岩画' },
                    { time: '18:00-21:00', evening: 'Day1: 银川夜市' },
                    { time: '07:00-18:00', morning2: 'Day2: 沙湖/沙坡头一日游' }
                ],
                tips: ['沙坡头有沙漠项目', '沙湖风景很美'],
                budget: '600-1000元'
            }
        }
    },
    '海口': {
        tags: ['椰城', '热带海滨', '自贸区'],
        season: '11-4月',
        atmosphere: '热带风情，椰风海韵',
        days: '2-3天',
        routes: ['骑楼老街 → 海口钟楼 → 万绿园', '假日海滩 → 西秀海滩', '火山口地质公园', '东寨港红树林'],
        foods: [
            { name: '海南粉', desc: '海南招牌，粉质细腻', price: '10-20元/碗', mustTry: true },
            { name: '椰子饭', desc: '海南特色，香甜可口', price: '20-30元/个', mustTry: true },
            { name: '清补凉', desc: '海南甜品，清凉解暑', price: '10-15元/碗' },
            { name: '抱罗粉', desc: '文昌特色，汤鲜味美', price: '15-25元/碗' },
            { name: '糟粕醋', desc: '海南小吃，酸辣开胃', price: '15-25元/碗' }
        ],
        accommodations: [
            { area: '龙华区', pros: '市中心，交通便利', cons: '价格较高' },
            { area: '美兰区', pros: '靠近机场，方便', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '公交+共享单车+出租车' },
            { type: '外部交通', info: '美兰机场；海口站、海口东站' }
        ],
        budget: { low: '1000', medium: '2000', high: '3500+' },
        tips: {
            prepare: ['带好防晒和泳衣', '椰子水新鲜好喝', '骑楼老街适合拍照'],
            avoid: ['不要在景区买椰子', '不要相信黑导游']
        },
        links: {
            official: 'https://www.haikou.gov.cn/',
            attractions: [
                { name: '骑楼老街', url: 'https://www.qilou.com/', mustVisit: true },
                { name: '假日海滩', url: 'https://www.jiari.com/' },
                { name: '火山口', url: 'https://www.huoshankou.com/' }
            ],
            booking: [
                { name: '景区门票', url: 'https://www.haikou.gov.cn/' }
            ],
            food: [
                { name: '海口美食', url: 'https://www.dianping.com/haikou' }
            ]
        },
        poster: {
            title: '椰城海口',
            subtitle: '热带风情，海韵椰风',
            elements: ['骑楼老街', '椰子树', '海滩', '海南粉'],
            layout: '热带海滨风格',
            colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '骑楼老街 → 海口钟楼' },
                    { time: '12:00-14:00', afternoon: '午餐（骑楼美食）' },
                    { time: '14:00-18:00', afternoon2: '万绿园 → 假日海滩' },
                    { time: '18:00-21:00', evening: '西秀海滩看日落' }
                ],
                tips: ['骑楼老街早上人少', '假日海滩适合游泳'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 骑楼老街' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 假日海滩' },
                    { time: '18:00-21:00', evening: 'Day1: 海口夜市' },
                    { time: '08:00-12:00', morning2: 'Day2: 火山口地质公园' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 东寨港红树林' }
                ],
                tips: ['火山口有熔岩隧道', '红树林可以坐游船'],
                budget: '600-1000元'
            }
        }
    },
    '福州': {
        tags: ['榕城', '有福之州', '闽都文化'],
        season: '3-5月、9-11月',
        atmosphere: '海滨城市，闽都文化',
        days: '2-3天',
        routes: ['三坊七巷 → 林则徐纪念馆', '鼓山 → 涌泉寺', '西湖公园 → 左海公园', '马尾船政文化'],
        foods: [
            { name: '佛跳墙', desc: '闽菜经典，山珍海味', price: '100-200元/份', mustTry: true },
            { name: '鱼丸', desc: '福州特色，Q弹鲜美', price: '15-25元/碗', mustTry: true },
            { name: '肉燕', desc: '福州小吃，皮薄馅嫩', price: '10-20元/碗' },
            { name: '锅边糊', desc: '福州早餐，汤鲜味美', price: '5-10元/碗' },
            { name: '芋泥', desc: '福州甜品，香甜可口', price: '10-15元/份' }
        ],
        accommodations: [
            { area: '鼓楼区', pros: '三坊七巷附近', cons: '价格较高' },
            { area: '台江区', pros: '交通便利，美食多', cons: '离景点远' }
        ],
        transport: [
            { type: '内部交通', info: '地铁+公交+共享单车' },
            { type: '外部交通', info: '长乐机场；福州站、福州南站' }
        ],
        budget: { low: '800', medium: '1500', high: '2500+' },
        tips: {
            prepare: ['三坊七巷建议请导游', '鼓山有缆车', '带好雨伞'],
            avoid: ['不要在景区买茶叶', '不要相信黑导游']
        },
        links: {
            official: 'https://www.fuzhou.gov.cn/',
            attractions: [
                { name: '三坊七巷', url: 'https://www.sfqxiang.com/', mustVisit: true },
                { name: '鼓山', url: 'https://www.gushan.com.cn/' },
                { name: '林则徐纪念馆', url: 'https://www.lzx.org.cn/' }
            ],
            booking: [
                { name: '景区门票', url: 'https://www.fuzhou.gov.cn/' }
            ],
            food: [
                { name: '福州美食', url: 'https://www.dianping.com/fuzhou' }
            ]
        },
        poster: {
            title: '有福之州',
            subtitle: '闽都文化，海滨榕城',
            elements: ['三坊七巷', '鼓山', '闽江', '佛跳墙'],
            layout: '闽都文化风格',
            colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']
        },
        itineraries: {
            '1天': {
                routes: [
                    { time: '08:00-12:00', morning: '三坊七巷 → 林则徐纪念馆' },
                    { time: '12:00-14:00', afternoon: '午餐（达明路美食街）' },
                    { time: '14:00-18:00', afternoon2: '鼓山 → 涌泉寺' },
                    { time: '18:00-21:00', evening: '闽江夜游' }
                ],
                tips: ['三坊七巷上午人少', '鼓山可以坐缆车'],
                budget: '200-400元'
            },
            '2天1晚': {
                routes: [
                    { time: '08:00-12:00', morning: 'Day1: 三坊七巷' },
                    { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                    { time: '14:00-18:00', afternoon2: 'Day1: 林则徐纪念馆' },
                    { time: '18:00-21:00', evening: 'Day1: 闽江夜游' },
                    { time: '08:00-12:00', morning2: 'Day2: 鼓山' },
                    { time: '12:00-18:00', afternoon2: 'Day2: 马尾船政文化' }
                ],
                tips: ['船政文化值得看', '鼓山风景很美'],
                budget: '600-1000元'
            }
        }
    }
},
'呼和浩特': {
    tags: ['草原文化', '塞上青城', '蒙古族风情'],
    season: '6-9月',
    atmosphere: '草原风情，民族特色浓厚',
    days: '2-3天',
    routes: ['大召寺 → 席力图召 → 塞上老街', '希拉穆仁草原一日游', '内蒙古博物院 → 昭君博物院'],
    foods: [
        { name: '手抓肉', desc: '蒙古族传统美食，鲜嫩多汁', price: '50-100元/人', mustTry: true },
        { name: '烤全羊', desc: '草原特色，外酥里嫩', price: '800-1500元/只', mustTry: true },
        { name: '奶豆腐', desc: '蒙古族传统奶制品', price: '20-40元/人' },
        { name: '莜面', desc: '山西特色，健康美味', price: '30-60元/人' },
        { name: '马奶酒', desc: '蒙古族传统饮品', price: '50-100元/瓶' }
    ],
    accommodations: [
        { area: '市中心', pros: '交通便利，购物方便', cons: '价格较高' },
        { area: '草原景区', pros: '体验草原生活', cons: '条件相对简陋' },
        { area: '新城区', pros: '环境优美，性价比高', cons: '离老城区较远' }
    ],
    transport: [
        { type: '内部交通', info: '公交覆盖广；打车方便' },
        { type: '外部交通', info: '白塔机场；呼和浩特站、呼和浩特东站' }
    ],
    budget: { low: '1000', medium: '2000', high: '3500+' },
    tips: {
        prepare: ['带好防晒用品', '草原昼夜温差大，带外套', '尊重蒙古族风俗习惯'],
        avoid: ['不要在草原上随意开车', '不要购买假的奶制品', '避开旅游旺季']
    },
    links: {
        official: 'https://www.huhhot.gov.cn/',
        attractions: [
            { name: '大召寺', url: 'https://www.dazhao.org.cn/', mustVisit: true },
            { name: '希拉穆仁草原', url: 'https://www.xilamuren.com/', mustVisit: true },
            { name: '内蒙古博物院', url: 'https://www.immuseum.com/' }
        ],
        booking: [
            { name: '草原旅游', url: 'https://www.xilamuren.com/' }
        ],
        food: [
            { name: '呼和浩特美食', url: 'https://www.dianping.com/huhehaote' }
        ]
    },
    poster: {
        title: '青城印象',
        subtitle: '草原青城，民族风情',
        elements: ['草原', '蒙古包', '马头琴', '敖包'],
        layout: '顶部草原风光，中央蒙古包剪影，底部民族特色图案',
        colors: ['#2ecc71', '#f39c12', '#e67e22', '#34495e', '#2c3e50']
    },
    itineraries: {
        '1天': {
            routes: [
                { time: '08:00-12:00', morning: '大召寺 → 席力图召' },
                { time: '12:00-14:00', afternoon: '午餐（蒙古餐厅）' },
                { time: '14:00-18:00', afternoon2: '内蒙古博物院' },
                { time: '18:00-21:00', evening: '塞上老街' }
            ],
            tips: ['大召寺有免费讲解', '博物院需要预约'],
            budget: '200-400元'
        },
        '2天1晚': {
            routes: [
                { time: '08:00-12:00', morning: 'Day1: 大召寺 → 塞上老街' },
                { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                { time: '14:00-18:00', afternoon2: 'Day1: 内蒙古博物院' },
                { time: '18:00-21:00', evening: 'Day1: 蒙古风情表演' },
                { time: '07:00-18:00', morning2: 'Day2: 希拉穆仁草原一日游' }
            ],
            tips: ['草原需要带外套', '骑马注意安全'],
            budget: '800-1500元'
        }
    }
},
'大连': {
    tags: ['浪漫之都', '海滨城市', '足球之城'],
    season: '5-9月',
    atmosphere: '浪漫海滨，异国风情',
    days: '3-4天',
    routes: ['星海广场 → 星海湾大桥 → 圣亚海洋世界', '金石滩 → 发现王国', '老虎滩海洋公园 → 棒棰岛', '俄罗斯风情街 → 东港商务区'],
    foods: [
        { name: '海鲜', desc: '新鲜美味，品种丰富', price: '80-150元/人', mustTry: true },
        { name: '焖子', desc: '大连特色小吃，配麻酱', price: '15-30元/人', mustTry: true },
        { name: '咸鱼饼子', desc: '传统渔家菜', price: '30-60元/人' },
        { name: '炒焖子', desc: '街头小吃，味道独特', price: '10-20元/人' },
        { name: '海胆', desc: '新鲜肥美，营养丰富', price: '50-100元/人' }
    ],
    accommodations: [
        { area: '星海广场附近', pros: '海景房，风景优美', cons: '价格较高' },
        { area: '火车站周边', pros: '交通便利，购物方便', cons: '人流较多' },
        { area: '金石滩', pros: '环境优美，适合度假', cons: '离市区较远' }
    ],
    transport: [
        { type: '内部交通', info: '公交覆盖广；轻轨便捷' },
        { type: '外部交通', info: '周水子机场；大连站、大连北站' }
    ],
    budget: { low: '1500', medium: '3000', high: '5000+' },
    tips: {
        prepare: ['带好泳衣，海边游玩', '防晒用品必备', '夏季注意防蚊'],
        avoid: ['不要在景区买高价海鲜', '不要相信黑导游', '避开旅游高峰期']
    },
    links: {
        official: 'https://www.dalian.gov.cn/',
        attractions: [
            { name: '星海广场', url: 'https://www.xinghai-square.com/', mustVisit: true },
            { name: '金石滩', url: 'https://www金石滩.com/', mustVisit: true },
            { name: '老虎滩', url: 'https://www.laohutan.com/' }
        ],
        booking: [
            { name: '发现王国', url: 'https://www.discoveryland.cn/' }
        ],
        food: [
            { name: '大连美食', url: 'https://www.dianping.com/dalian' }
        ]
    },
    poster: {
        title: '浪漫滨城',
        subtitle: '北方明珠，海韵大连',
        elements: ['大海', '沙滩', '欧式建筑', '足球'],
        layout: '顶部海景，中央城市天际线，底部海鲜美食',
        colors: ['#3498db', '#1abc9c', '#f1c40f', '#e74c3c', '#9b59b6']
    },
    itineraries: {
        '1天': {
            routes: [
                { time: '08:00-12:00', morning: '星海广场 → 星海湾大桥' },
                { time: '12:00-14:00', afternoon: '午餐（海鲜）' },
                { time: '14:00-18:00', afternoon2: '圣亚海洋世界' },
                { time: '18:00-21:00', evening: '东港商务区' }
            ],
            tips: ['海洋世界需要半天时间', '东港看夜景'],
            budget: '300-500元'
        },
        '2天1晚': {
            routes: [
                { time: '08:00-12:00', morning: 'Day1: 老虎滩海洋公园' },
                { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                { time: '14:00-18:00', afternoon2: 'Day1: 棒棰岛' },
                { time: '18:00-21:00', evening: 'Day1: 星海广场夜景' },
                { time: '08:00-18:00', morning2: 'Day2: 金石滩 → 发现王国' }
            ],
            tips: ['发现王国需要一天', '金石滩适合拍照'],
            budget: '800-1500元'
        }
    }
},
'宁波': {
    tags: ['港城', '书藏古今', '港通天下'],
    season: '3-5月、9-11月',
    atmosphere: '江南水乡，港口城市',
    days: '2-3天',
    routes: ['天一阁 → 月湖公园 → 天一广场', '宁波博物馆 → 南塘老街', '东钱湖 → 韩岭古村', '溪口蒋氏故里一日游'],
    foods: [
        { name: '宁波汤圆', desc: '软糯香甜，黑芝麻馅', price: '15-30元/人', mustTry: true },
        { name: '奉化芋艿头', desc: '软糯可口，营养丰富', price: '20-40元/人', mustTry: true },
        { name: '红膏炝蟹', desc: '宁波特色，鲜美无比', price: '80-150元/人' },
        { name: '宁波年糕', desc: '软糯有嚼劲', price: '15-30元/人' },
        { name: '苔菜拖黄鱼', desc: '外酥里嫩，鲜美可口', price: '40-80元/人' }
    ],
    accommodations: [
        { area: '天一广场附近', pros: '市中心，交通便利', cons: '价格较高' },
        { area: '南塘老街附近', pros: '文化氛围浓，美食多', cons: '夜间较吵' },
        { area: '东钱湖', pros: '环境优美，适合度假', cons: '离市区较远' }
    ],
    transport: [
        { type: '内部交通', info: '地铁覆盖主要景点；公交便利' },
        { type: '外部交通', info: '栎社机场；宁波站、宁波南站' }
    ],
    budget: { low: '1000', medium: '2000', high: '3500+' },
    tips: {
        prepare: ['带好雨具，宁波多雨', '身份证必带', '夏季注意防晒'],
        avoid: ['不要在景区买高价纪念品', '不要相信黑导游', '避开节假日人流高峰']
    },
    links: {
        official: 'https://www.ningbo.gov.cn/',
        attractions: [
            { name: '天一阁', url: 'https://www.tianyige.com.cn/', mustVisit: true },
            { name: '东钱湖', url: 'https://www.dongqianhu.com/' },
            { name: '溪口蒋氏故里', url: 'https://www.xikou.com/' }
        ],
        booking: [
            { name: '溪口门票', url: 'https://www.xikou.com/' }
        ],
        food: [
            { name: '宁波美食', url: 'https://www.dianping.com/ningbo' }
        ]
    },
    poster: {
        title: '甬城记忆',
        subtitle: '书藏古今，港通天下',
        elements: ['天一阁', '港口', '水乡古镇', '汤圆'],
        layout: '顶部港口风光，中央天一阁剪影，底部美食展示',
        colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6']
    },
    itineraries: {
        '1天': {
            routes: [
                { time: '08:00-12:00', morning: '天一阁 → 月湖公园' },
                { time: '12:00-14:00', afternoon: '午餐' },
                { time: '14:00-18:00', afternoon2: '宁波博物馆 → 南塘老街' },
                { time: '18:00-21:00', evening: '天一广场' }
            ],
            tips: ['天一阁是中国最早的图书馆', '南塘老街美食多'],
            budget: '200-400元'
        },
        '2天1晚': {
            routes: [
                { time: '08:00-12:00', morning: 'Day1: 天一阁 → 月湖' },
                { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                { time: '14:00-18:00', afternoon2: 'Day1: 宁波博物馆' },
                { time: '18:00-21:00', evening: 'Day1: 南塘老街' },
                { time: '08:00-18:00', morning2: 'Day2: 东钱湖 → 韩岭古村' }
            ],
            tips: ['东钱湖很大，建议预留一天', '韩岭古村适合拍照'],
            budget: '600-1000元'
        }
    }
},
'黄山': {
    tags: ['天下第一奇山', '世界遗产', '云海日出'],
    season: '3-5月、9-11月',
    atmosphere: '雄奇壮丽，云海缭绕',
    days: '2-3天',
    routes: ['黄山风景区一日游（前山或后山）', '黄山风景区两日游（前山+后山）', '宏村 → 西递古村', '屯溪老街 → 徽州古城'],
    foods: [
        { name: '黄山毛峰', desc: '中国十大名茶之一', price: '100-500元/斤', mustTry: true },
        { name: '徽州臭鳜鱼', desc: '闻着臭吃着香', price: '80-150元/份', mustTry: true },
        { name: '徽州毛豆腐', desc: '传统名菜，外酥里嫩', price: '30-60元/份' },
        { name: '黄山烧饼', desc: '酥脆可口，梅干菜馅', price: '10-20元/盒' },
        { name: '绩溪炒粉丝', desc: '徽州特色，鲜美可口', price: '25-45元/份' }
    ],
    accommodations: [
        { area: '黄山风景区内', pros: '方便看日出，节省时间', cons: '价格较高' },
        { area: '汤口镇', pros: '离景区近，价格适中', cons: '条件一般' },
        { area: '宏村/西递', pros: '体验徽派建筑，环境优美', cons: '离景区较远' }
    ],
    transport: [
        { type: '内部交通', info: '景区索道；景区大巴' },
        { type: '外部交通', info: '黄山机场；黄山北站、黄山站' }
    ],
    budget: { low: '1500', medium: '3000', high: '5000+' },
    tips: {
        prepare: ['舒适的登山鞋', '保暖衣物（山上温差大）', '雨具', '手电筒'],
        avoid: ['不要在山上买高价食品', '不要相信黑导游', '避开节假日人流高峰']
    },
    links: {
        official: 'https://www.huangshan.gov.cn/',
        attractions: [
            { name: '黄山风景区', url: 'https://www.huangshan.com.cn/', mustVisit: true },
            { name: '宏村', url: 'https://www.hongcun.com/', mustVisit: true },
            { name: '西递', url: 'https://www.xidi.com/' }
        ],
        booking: [
            { name: '黄山门票', url: 'https://www.huangshan.com.cn/' },
            { name: '宏村门票', url: 'https://www.hongcun.com/' }
        ],
        food: [
            { name: '黄山美食', url: 'https://www.dianping.com/huangshan' }
        ]
    },
    poster: {
        title: '黄山奇景',
        subtitle: '天下第一奇山',
        elements: ['黄山云海', '奇松怪石', '日出', '徽派建筑'],
        layout: '顶部黄山云海，中央迎客松，底部徽派村落',
        colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6']
    },
    itineraries: {
        '1天': {
            routes: [
                { time: '06:00-12:00', morning: '黄山风景区（前山）' },
                { time: '12:00-14:00', afternoon: '午餐（山上）' },
                { time: '14:00-18:00', afternoon2: '黄山风景区（后山）' }
            ],
            tips: ['一天时间较紧，建议乘缆车', '山上天气多变'],
            budget: '300-500元'
        },
        '2天1晚': {
            routes: [
                { time: '08:00-12:00', morning: 'Day1: 黄山风景区（前山）' },
                { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                { time: '14:00-18:00', afternoon2: 'Day1: 山顶游览' },
                { time: '05:00-07:00', morning2: 'Day2: 看日出' },
                { time: '07:00-12:00', afternoon2: 'Day2: 后山游览' }
            ],
            tips: ['山上住宿需提前预订', '带好保暖衣物'],
            budget: '1500-2500元'
        }
    }
},
'敦煌': {
    tags: ['丝路明珠', '莫高窟', '沙漠奇观'],
    season: '5-10月',
    atmosphere: '大漠风情，文化底蕴深厚',
    days: '2-3天',
    routes: ['莫高窟 → 鸣沙山月牙泉', '阳关 → 玉门关 → 雅丹魔鬼城', '敦煌古城 → 西千佛洞'],
    foods: [
        { name: '驴肉黄面', desc: '敦煌特色，驴肉鲜美', price: '30-60元/人', mustTry: true },
        { name: '敦煌酿皮子', desc: '清凉爽口，夏季必备', price: '15-30元/人', mustTry: true },
        { name: '浆水面', desc: '酸香可口，解暑佳品', price: '20-40元/人' },
        { name: '泡儿油糕', desc: '外酥内软，香甜可口', price: '10-20元/份' },
        { name: '杏皮水', desc: '敦煌特色饮品，酸甜解渴', price: '5-15元/杯' }
    ],
    accommodations: [
        { area: '市区', pros: '交通便利，购物方便', cons: '离景点较远' },
        { area: '鸣沙山附近', pros: '离景区近，方便游玩', cons: '价格较高' },
        { area: '莫高窟附近', pros: '方便参观莫高窟', cons: '设施较少' }
    ],
    transport: [
        { type: '内部交通', info: '包车或拼车最方便' },
        { type: '外部交通', info: '敦煌机场；敦煌站' }
    ],
    budget: { low: '1200', medium: '2500', high: '4000+' },
    tips: {
        prepare: ['防晒用品必备', '沙漠温差大，带外套', '口罩防沙', '充足的饮用水'],
        avoid: ['不要在沙漠中单独行动', '不要购买假的敦煌壁画', '避开正午高温时段']
    },
    links: {
        official: 'https://www.dunhuang.gov.cn/',
        attractions: [
            { name: '莫高窟', url: 'https://www.mogaoku.net/', mustVisit: true },
            { name: '鸣沙山月牙泉', url: 'https://www.mingshashan.com/', mustVisit: true },
            { name: '雅丹魔鬼城', url: 'https://www.yadan.com.cn/' }
        ],
        booking: [
            { name: '莫高窟门票', url: 'https://www.mogaoku.net/' }
        ],
        food: [
            { name: '敦煌美食', url: 'https://www.dianping.com/dunhuang' }
        ]
    },
    poster: {
        title: '丝路敦煌',
        subtitle: '千年石窟，大漠风情',
        elements: ['莫高窟壁画', '鸣沙山月牙泉', '沙漠驼队', '飞天壁画'],
        layout: '顶部沙漠风光，中央莫高窟剪影，底部驼队图案',
        colors: ['#f39c12', '#e67e22', '#d35400', '#34495e', '#2c3e50']
    },
    itineraries: {
        '1天': {
            routes: [
                { time: '08:00-12:00', morning: '莫高窟' },
                { time: '12:00-14:00', afternoon: '午餐' },
                { time: '14:00-18:00', afternoon2: '鸣沙山月牙泉' },
                { time: '18:00-21:00', evening: '敦煌夜市' }
            ],
            tips: ['莫高窟需要提前预约', '鸣沙山傍晚去较凉爽'],
            budget: '300-500元'
        },
        '2天1晚': {
            routes: [
                { time: '08:00-12:00', morning: 'Day1: 莫高窟' },
                { time: '12:00-14:00', afternoon: 'Day1: 午餐' },
                { time: '14:00-18:00', afternoon2: 'Day1: 鸣沙山月牙泉' },
                { time: '18:00-21:00', evening: 'Day1: 敦煌夜市' },
                { time: '08:00-18:00', morning2: 'Day2: 阳关 → 玉门关 → 雅丹魔鬼城' }
            ],
            tips: ['雅丹魔鬼城路途较远', '带好防晒用品'],
            budget: '800-1500元'
        }
    }
};

const cityAliases = {
    '北京': ['beijing', 'bj', '京城', '帝都', '北平'],
    '上海': ['shanghai', 'sh', '魔都', '申城', '沪上'],
    '成都': ['chengdu', 'cd', '蓉城', '天府之国', '蜀都'],
    '杭州': ['hangzhou', 'hz', '杭州', '临安', '钱塘', '西湖'],
    '西安': ['xian', '西安', 'xa', '长安', '古都', '咸阳'],
    '重庆': ['chongqing', 'cq', '重庆', '山城', '雾都', '渝州'],
    '广州': ['guangzhou', 'gz', '广州', '羊城', '花城', '穗城'],
    '厦门': ['xiamen', 'xm', '厦门', '鹭岛', '海上花园', '思明'],
    '南京': ['nanjing', 'nj', '金陵', '江宁', '石头城'],
    '青岛': ['qingdao', 'qd', '岛城', '琴岛', '胶州'],
    '苏州': ['suzhou', 'sz', '姑苏', '吴中', '苏州', '水乡'],
    '丽江': ['lijiang', 'lj', '大研', '丽江古城'],
    '三亚': ['sanya', 'sy', '天涯海角', '鹿城'],
    '哈尔滨': ['harbin', 'hrb', '冰城', '东方莫斯科'],
    '武汉': ['wuhan', 'wh', '江城', '珞珈', '武汉三镇'],
    '长沙': ['changsha', 'cs', '星城', '楚汉名城', '湘江'],
    '天津': ['tianjin', 'tj', '津门', '津沽', '天津卫'],
    '大理': ['dali', 'dl', '大理国', '风花雪月', '下关'],
    '桂林': ['guilin', 'gl', '桂林山水', '漓江', '阳朔'],
    '香港': ['hongkong', 'hk', '港岛', '东方之珠', '香港'],
    '洛阳': ['luoyang', 'ly', '洛邑', '神都', '牡丹城'],
    '张家界': ['zhangjiajie', 'zjj', '武陵源', '天门山', '湘西'],
    '深圳': ['shenzhen', 'sz', '深圳', '鹏城', '深港'],
    '珠海': ['zhuhai', 'zh', '珠海', '百岛之城'],
    '昆明': ['kunming', 'km', '昆明', '春城', '花都'],
    '拉萨': ['lasa', 'ls', '拉萨', '日光城', '藏区'],
    '乌鲁木齐': ['wulumuqi', 'wlmq', '乌鲁木齐', '天山', '新疆'],
    '兰州': ['lanzhou', 'lz', '兰州', '黄河之都', '丝路'],
    '沈阳': ['shenyang', 'sy', '沈阳', '盛京', '工业城'],
    '郑州': ['zhengzhou', 'zz', '郑州', '中原', '商都'],
    '贵阳': ['guiyang', 'gy', '贵阳', '林城', '避暑之都'],
    '济南': ['jinan', 'jn', '济南', '泉城', '齐鲁'],
    '太原': ['taiyuan', 'ty', '太原', '龙城', '晋商'],
    '南宁': ['nanning', 'nn', '南宁', '绿城', '壮乡'],
    '西宁': ['xining', 'xn', '西宁', '夏都', '高原'],
    '银川': ['yinchuan', 'yc', '银川', '塞上江南', '西夏'],
    '海口': ['haikou', 'hk', '海口', '椰城', '自贸区'],
    '福州': ['fuzhou', 'fz', '福州', '榕城', '闽都'],
    '呼和浩特': ['huhehaote', 'huhhot', 'hhht', '青城', '草原城'],
    '大连': ['dalian', 'dl', '滨城', '浪漫之都', '足球城'],
    '宁波': ['ningbo', 'nb', '甬城', '港城', '书藏古今'],
    '黄山': ['huangshan', 'hs', '黄山', '奇山', '徽州'],
    '敦煌': ['dunhuang', 'dh', '敦煌', '丝路', '莫高窟']
};

function findCity(cityName) {
    const normalized = cityName.trim().toLowerCase();
    if (cityDatabase[normalized]) return normalized;
    if (cityDatabase[normalized.charAt(0).toUpperCase() + normalized.slice(1)]) return normalized.charAt(0).toUpperCase() + normalized.slice(1);
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
        '大': 'D', '桂': 'G', '香': 'X', '洛': 'L', '张': 'Z'
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

function generatePosterHTML(cityData, cityName) {
    // 生成自定义天数的行程
    let itineraryTypes = [];
    if (cityData.itineraries) {
        itineraryTypes = Object.keys(cityData.itineraries);
    } else {
        // 生成默认行程类型
        for (let i = 1; i <= 7; i++) {
            itineraryTypes.push(`${i}天${i > 1 ? (i - 1) + '晚' : ''}`);
        }
    }
    
    // 确保选中的天数对应行程存在
    let selectedItinerary = `${selectedDays}天${selectedDays > 1 ? (selectedDays - 1) + '晚' : ''}`;
    if (!itineraryTypes.includes(selectedItinerary)) {
        selectedItinerary = itineraryTypes[0] || '1天';
    }
    
    const defaultItinerary = selectedItinerary;
    
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
            <div class="transport-type">🚗 ${t.type}</div>
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
                    <div class="link-group-title">🎫 景点门票</div>
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

    const itinerarySelectorHTML = `
        <div class="itinerary-selector">
            <div class="itinerary-tabs">
                ${itineraryTypes.map((type, idx) => `
                    <button class="itinerary-tab ${type === selectedItinerary ? 'active' : ''}" data-itinerary="${type}">
                        ${type}
                    </button>
                `).join('')}
            </div>
            <div class="itinerary-content">
                ${itineraryTypes.map((type, idx) => {
                    let itinerary = cityData.itineraries ? cityData.itineraries[type] : null;
                    if (!itinerary) {
                        // 生成自定义行程
                        itinerary = {
                            routes: generateCustomItinerary(cityData, parseInt(type.split('天')[0])),
                            tips: ['根据您的时间定制的行程'],
                            budget: '根据实际消费而定'
                        };
                    }
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
                                <h4>💡 行程小贴士</h4>
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
    `;

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
                <h3 class="section-title">� 行程规划</h3>
                ${itinerarySelectorHTML}
                
                <h3 class="section-title" style="margin-top: 30px;">��️ 经典路线</h3>
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
                        <div class="tip-title">⚠️ 避坑指南</div>
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
                <a href="#" class="download-btn" onclick="alert('攻略收藏功能即将上线！您可以截图保存攻略。'); return false;">📥 收藏攻略</a>
            </div>
        </div>
    `;
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

document.getElementById('generateBtn').addEventListener('click', async function() {
    const cityInput = document.getElementById('cityInput').value.trim();
    if (!cityInput) {
        alert('请输入城市名称！');
        return;
    }

    recordSearch(cityInput);

    document.getElementById('result').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const matchedCity = findCity(cityInput);
    const resultDiv = document.getElementById('result');

    if (matchedCity) {
        resultDiv.innerHTML = generatePosterHTML(cityDatabase[matchedCity], matchedCity);
    } else {
        const randomData = {
            tags: ['待解锁', '神秘城市'],
            season: '等待探索',
            days: '未知',
            routes: ['等待您来探索'],
            foods: [{ name: '等待发现', desc: '更多美食待解锁', price: '-' }],
            accommodations: [{ area: '待探索', pros: '更多住宿待发现', cons: '' }],
            transport: [{ type: '待到达', info: '更多交通方式待发现' }],
            budget: { low: '?', medium: '?', high: '?' },
            tips: { prepare: ['更多准备待解锁'], avoid: ['更多避坑待发现'] },
            links: {
                official: 'https://www.baidu.com/',
                attractions: [
                    { name: '待探索景点', url: 'https://www.baidu.com/' }
                ],
                booking: [
                    { name: '待发现', url: 'https://www.baidu.com/' }
                ],
                food: [
                    { name: '待解锁美食', url: 'https://www.baidu.com/' }
                ]
            },
            poster: {
                title: cityInput,
                subtitle: '一座等待探索的城市',
                elements: ['城市地标', '特色美食', '自然风光', '文化体验'],
                layout: '简洁大气，城市元素巧妙融合',
                colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
            }
        };
        resultDiv.innerHTML = generatePosterHTML(randomData, cityInput);
    }

    document.getElementById('loading').classList.add('hidden');
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const sortedCities = Object.entries(searchStats.citySearches)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    const maxCount = sortedCities[0]?.[1] || 1;
    
    return sortedCities.map(([city, count], index) => {
        const oldIndex = searchStats.lastRanking.indexOf(city);
        let trend = null;
        if (oldIndex !== -1) {
            if (oldIndex > index) trend = 'up';
            else if (oldIndex < index) trend = 'down';
        } else {
            trend = 'new';
        }
        return {
            city,
            count,
            progress: (count / maxCount) * 100,
            rank: index + 1,
            trend,
            hot: index < 3
        };
    });
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
        <div class="ranking-item ${item.hot ? 'hot' : ''} ${item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : ''}"
             data-city="${item.city}">
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
    '清明': ['武汉', '南京', '杭州', '苏州', '扬州', '无锡'],
    '五一': ['青岛', '大连', '厦门', '西安', '成都', '重庆'],
    '端午': ['武汉', '南京', '杭州', '苏州'],
    '暑假': ['青岛', '大连', '厦门', '三亚', '秦皇岛', '威海'],
    '中秋': ['杭州', '苏州', '南京', '扬州', '无锡'],
    '国庆': ['北京', '西安', '成都', '重庆', '杭州', '上海', '丽江'],
    '元旦': ['哈尔滨', '雪乡', '长白山', '三亚', '昆明']
};

const eventTrends = [
    { name: '樱花季', cities: ['武汉', '南京', '杭州', '西安'], multiplier: 3 },
    { name: '避暑圣地', cities: ['青岛', '大连', '厦门', '秦皇岛'], multiplier: 2.5 },
    { name: '枫叶红了', cities: ['北京', '南京', '西安', '喀纳斯'], multiplier: 2 },
    { name: '冰雪奇缘', cities: ['哈尔滨', '雪乡', '长白山'], multiplier: 3 },
    { name: '海岛度假', cities: ['三亚', '厦门', '北海', '涠洲岛'], multiplier: 2.5 },
    { name: '古镇漫游', cities: ['丽江', '大理', '苏州', '乌镇', '周庄'], multiplier: 2 },
    { name: '美食之旅', cities: ['成都', '重庆', '广州', '长沙', '西安'], multiplier: 2 },
    { name: '网红打卡', cities: ['重庆', '成都', '西安', '长沙'], multiplier: 2.5 }
];

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 9) return 'autumn';
    return 'winter';
}

function getCurrentHoliday() {
    const month = new Date().getMonth();
    const day = new Date().getDate();
    if (month === 0 && day >= 1 && day <= 7) return '元旦';
    if (month === 1 && day >= 10 && day <= 16) return '春节';
    if (month === 2 && day >= 4 && day <= 6) return '清明';
    if (month === 3 && day >= 1 && day <= 5) return '五一';
    if (month === 4 && day >= 28 && day <= 30) return '端午';
    if (month === 6 && day >= 15 && day <= 31) return '暑假';
    if (month === 8 && day >= 15 && day <= 21) return '中秋';
    if ((month === 8 && day >= 22) || (month === 9 && day <= 7)) return '国庆';
    return null;
}

function getTrendingCities() {
    const trending = [];
    const currentSeason = getCurrentSeason();
    const currentHoliday = getCurrentHoliday();
    
    seasonTrends[currentSeason].forEach(city => {
        if (searchStats.citySearches[city]) {
            trending.push({ city, score: searchStats.citySearches[city] * 1.5, reason: '季节推荐' });
        }
    });
    
    if (currentHoliday && holidayTrends[currentHoliday]) {
        holidayTrends[currentHoliday].forEach(city => {
            if (searchStats.citySearches[city]) {
                trending.push({ city, score: searchStats.citySearches[city] * 2, reason: '节日热点' });
            }
        });
    }
    
    eventTrends.forEach(event => {
        event.cities.forEach(city => {
            if (searchStats.citySearches[city]) {
                trending.push({ city, score: searchStats.citySearches[city] * event.multiplier, reason: event.name });
            }
        });
    });
    
    return trending.sort((a, b) => b.score - a.score).slice(0, 5);
}

function simulateRealTimeUpdate() {
    const cities = Object.keys(searchStats.citySearches);
    const currentSeason = getCurrentSeason();
    const seasonCities = seasonTrends[currentSeason];
    const currentHoliday = getCurrentHoliday();
    const holidayCities = currentHoliday ? holidayTrends[currentHoliday] : [];
    
    for (let i = 0; i < 5; i++) {
        let randomCity;
        const rand = Math.random();
        if (rand < 0.2 && seasonCities.length > 0) {
            randomCity = seasonCities[Math.floor(Math.random() * seasonCities.length)];
        } else if (rand < 0.35 && holidayCities.length > 0) {
            randomCity = holidayCities[Math.floor(Math.random() * holidayCities.length)];
        } else {
            randomCity = cities[Math.floor(Math.random() * cities.length)];
        }
        
        const baseAdd = Math.floor(Math.random() * 5) + 1;
        let multiplier = 1;
        if (seasonCities.includes(randomCity)) multiplier *= 1.5;
        if (holidayCities.includes(randomCity)) multiplier *= 1.8;
        
        searchStats.citySearches[randomCity] = (searchStats.citySearches[randomCity] || 0) + Math.floor(baseAdd * multiplier);
        searchStats.totalSearches += Math.floor(baseAdd * multiplier);
    }
    
    searchStats.lastUpdate = new Date();
    saveSearchStats();
    renderRanking();
}

function getAIRecommendation() {
    const recommendations = [];
    const topCities = Object.entries(searchStats.citySearches)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    topCities.forEach(([city, count], index) => {
        let label = '';
        if (index === 0) label = '🔥 全国最热';
        else if (index === 1) label = '⭐ 热门之选';
        else if (index === 2) label = '👍 强烈推荐';
        else label = '💡 值得一去';
        
        recommendations.push({
            city,
            count,
            label,
            reason: getRecommendationReason(city)
        });
    });
    
    return recommendations;
}

function getRecommendationReason(city) {
    const reasons = {
        '北京': '历史古都，皇家风范',
        '上海': '魔都魅力，购物天堂',
        '成都': '美食之都，熊猫故乡',
        '杭州': '西湖十景，人间天堂',
        '西安': '千年古都，网红城市',
        '重庆': '8D魔幻城市，夜景绝美',
        '广州': '粤式美食，花城四季',
        '厦门': '海上花园，文艺清新',
        '南京': '六朝古都，秦淮风月',
        '青岛': '啤酒之城，避暑圣地',
        '苏州': '园林水乡，东方威尼斯',
        '丽江': '艳遇之都，古镇风情',
        '三亚': '天涯海角，度假胜地',
        '哈尔滨': '冰城夏都，冰雪奇缘',
        '武汉': '樱花之城，九省通衢',
        '长沙': '美食之都，娱乐天堂',
        '天津': '万国建筑，相声之乡',
        '大理': '风花雪月，苍山洱海',
        '桂林': '山水甲天下，漓江风光',
        '香港': '购物天堂，美食之都',
        '洛阳': '千年古都，牡丹花城',
        '张家界': '奇峰怪石，阿凡达取景地'
    };
    return reasons[city] || '热门旅游城市';
}

function updateSeasonBadge() {
    const badge = document.getElementById('seasonBadge');
    if (!badge) return;
    
    const currentSeason = getCurrentSeason();
    const currentHoliday = getCurrentHoliday();
    const seasonLabels = {
        spring: '🌸 春季推荐',
        summer: '☀️ 避暑热门',
        autumn: '🍂 秋色撩人',
        winter: '❄️ 冰雪奇缘'
    };
    
    let badgeText = seasonLabels[currentSeason];
    if (currentHoliday) {
        badgeText = `🎉 ${currentHoliday}热门 | ` + badgeText;
    }
    badge.textContent = badgeText;
}

loadSearchStats();
updateSeasonBadge();
setInterval(simulateRealTimeUpdate, 30000);

// 生成自定义行程函数
function generateCustomItinerary(cityData, days) {
    const routes = [];
    const attractions = cityData.attractions || [];
    const foods = cityData.foods || [];
    
    // 每天的时间段
    const timeSlots = [
        { time: '08:00-12:00', period: 'morning', icon: '🌅' },
        { time: '12:00-18:00', period: 'afternoon', icon: '☀️' },
        { time: '18:00-22:00', period: 'evening', icon: '🌙' }
    ];
    
    // 为每天生成行程
    for (let day = 1; day <= days; day++) {
        const dayRoute = {};
        
        // 分配景点和美食到不同时间段
        const dayAttractions = attractions.slice((day - 1) * 3, day * 3);
        const dayFoods = foods.slice((day - 1) * 2, day * 2);
        
        // 上午安排景点
        if (dayAttractions.length > 0) {
            dayRoute.morning = `游览 ${dayAttractions[0].name}`;
        }
        
        // 下午安排景点
        if (dayAttractions.length > 1) {
            dayRoute.afternoon = `游览 ${dayAttractions[1].name}`;
        } else {
            dayRoute.afternoon = '自由活动';
        }
        
        // 晚上安排美食
        if (dayFoods.length > 0) {
            dayRoute.evening = `品尝 ${dayFoods[0].name}`;
        } else {
            dayRoute.evening = '休息调整';
        }
        
        routes.push(dayRoute);
    }
    
    return routes;
}

// 自定义天数功能
let selectedDays = 3; // 默认3天

// 天数选择按钮事件
const dayButtons = document.querySelectorAll('.day-btn');
dayButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        dayButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedDays = parseInt(this.dataset.days);
    });
});

// 自定义天数输入事件
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