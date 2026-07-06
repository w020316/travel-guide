/* =========================================================
   行纪 XING JI — 主应用逻辑
   统一处理：本地 527 城数据库 + 后端 AI 攻略生成 + 智能数据增强
   ========================================================= */

(function () {
    'use strict';

    // ---------- 城市数据库（来自 data/expandedCities.js，file:// 模式下使用 fallback）----------
    const CITIES = (typeof EXPANDED_CITIES !== 'undefined') ? EXPANDED_CITIES : (function() {
        // file:// 模式或加载失败时的最小 fallback 数据，确保排行榜可渲染
        const fb = {};
        const seed = [
            ['北京','皇城古韵','春秋最佳','4-6',['历史文化','皇家园林','首都风貌']],
            ['上海','魔都风华','春秋最佳','3-5',['国际都市','外滩夜景','海派文化']],
            ['成都','慢生活之旅','四季皆宜','3-5',['美食之都','休闲慢游','大熊猫']],
            ['杭州','人间天堂','春秋最佳','2-4',['西湖美景','江南水乡','茶文化']],
            ['西安','千年古都','春秋最佳','3-5',['历史文化','古都','兵马俑']],
            ['重庆','山城雾都','春秋最佳','3-4',['8D魔幻城市','火锅之都','网红打卡地']],
            ['厦门','海上花园','春秋最佳','2-3',['海滨城市','文艺小清新','鼓浪屿']],
            ['丽江','纳西古韵','春秋最佳','3-4',['古城','纳西文化','雪山']],
            ['三亚','热带天堂','秋冬最佳','3-5',['海滨度假','热带风情','潜水']],
            ['大理','风花雪月','春秋最佳','2-3',['古城','白族文化','洱海']],
            ['拉萨','日光之城','夏秋最佳','3-5',['高原','藏文化','布达拉宫']],
            ['敦煌','丝路明珠','夏秋最佳','2-3',['丝路文化','莫高窟','沙漠']]
        ];
        seed.forEach(([name,title,season,days,tags]) => {
            fb[name] = { title: `${name}·${title}`, season, days, tags, foods: [], routes: [] };
        });
        return fb;
    })();

    // ---------- 状态 ----------
    const state = {
        selectedDays: 3,
        travelType: 'balanced',
        budgetRange: 'medium',
        currentGuide: null,
        currentCity: null,
        posterStyle: 'fresh',
        favorites: loadFavorites(),
        history: loadHistory()
    };

    // ---------- API 客户端 ----------
    const API = {
        // 同源部署时用相对路径；本地 file:// 打开时回退到本地模式
        base: detectBaseURL(),
        mode: detectMode(),

        async generateGuide(city, prefs) {
            if (this.mode === 'local') return buildLocalGuide(city, prefs);
            try {
                const ctrl = new AbortController();
                const timer = setTimeout(() => ctrl.abort(), 45000);
                const res = await fetch(`${this.base}/api/ai/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city, preferences: prefs }),
                    signal: ctrl.signal
                });
                clearTimeout(timer);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (json.success && json.data) return json.data;
                throw new Error(json.error || '生成失败');
            } catch (e) {
                console.warn('后端生成失败，回退本地数据:', e.message);
                return buildLocalGuide(city, prefs);
            }
        },

        async getTrending() {
            if (this.mode === 'local') return null;
            try {
                const res = await fetch(`${this.base}/api/expanded/trending?limit=12`, { signal: AbortSignal.timeout(5000) });
                if (!res.ok) return null;
                const json = await res.json();
                return json.success ? json.data : null;
            } catch { return null; }
        }
    };

    function detectBaseURL() {
        if (typeof window === 'undefined') return '';
        const h = window.location.hostname;
        if (h === 'localhost' || h === '127.0.0.1') {
            // 同源（后端托管）时用相对，独立打开前端时指向 3001
            return window.location.port === '3001' ? '' : 'http://localhost:3001';
        }
        return ''; // 生产同源
    }
    function detectMode() {
        if (typeof window === 'undefined') return 'local';
        if (window.location.protocol === 'file:') return 'local';
        return 'backend';
    }

    // ---------- 数据标准化（AI 返回格式 → 渲染所需格式）----------
    function normalizeGuideData(g) {
        if (!g) return g;

        // 0. 修复 days 字段重复"天"字（如 "1-2天天" → "1-2天"）
        if (typeof g.days === 'string') {
            g.days = g.days.replace(/天天+/g, '天').replace(/天+$/, '天');
        }
        if (typeof g.duration === 'string') {
            g.duration = g.duration.replace(/天天+/g, '天').replace(/天+$/, '天');
        }

        // 1. 标准化 routes：AI 可能返回字符串数组 ["Day1: A→B→C"] 或对象数组
        //    同时检测并替换占位文本（"精选行程"/"主要景点"等无意义内容）
        const PLACEHOLDER_PATTERNS = /^(精选行程|主要景点|行程安排|今日行程|Day\s*\d+\s*[:：]?\s*)$/i;
        if (Array.isArray(g.routes)) {
            g.routes = g.routes.map((r, i) => {
                if (typeof r === 'string') {
                    // 解析 "Day1: 景点A→景点B→景点C" 或 "Day 1: ..."
                    const m = r.match(/Day\s*(\d+)\s*[:：]\s*(.+)/i);
                    if (m) {
                        const day = parseInt(m[1], 10);
                        const routeLine = m[2].trim();
                        const spots = routeLine.split('→').map(s => s.trim()).filter(Boolean);
                        return { day, theme: `Day ${day}`, routeLine, spots };
                    }
                    // 无 Day 前缀的纯路线字符串
                    const spots = r.split('→').map(s => s.trim()).filter(Boolean);
                    return { day: i + 1, theme: `Day ${i + 1}`, routeLine: r, spots };
                }
                // 已是对象，确保 spots 存在
                if (r && typeof r === 'object') {
                    if (!r.spots && r.routeLine) {
                        r.spots = r.routeLine.split('→').map(s => s.trim()).filter(Boolean);
                    }
                    if (!r.day) r.day = i + 1;
                    if (!r.theme) r.theme = `Day ${r.day}`;
                }
                return r;
            }).filter(r => {
                // 过滤掉占位/空 routeLine
                if (!r) return false;
                const line = (typeof r === 'string') ? r : (r.routeLine || r.route || '');
                if (!line || !line.trim()) return false;
                if (PLACEHOLDER_PATTERNS.test(line.trim())) return false;
                // spots 必须有实际内容
                const spots = (typeof r === 'object') ? (r.spots || []) : [];
                if (spots.length === 0 && line.split('→').length < 2) return false;
                return true;
            });
        }

        // 2. 标准化 transport → transportation（AI 返回 transport 数组）
        if (Array.isArray(g.transport) && !g.transportation) {
            const arrival = g.transport.find(t => t.type === '外部交通' || t.type === '到达');
            const local = g.transport.find(t => t.type === '内部交通' || t.type === '市内');
            g.transportation = {
                arrival: arrival ? arrival.info : '高铁/飞机可达',
                localTransport: local ? local.info : '地铁、公交便利'
            };
        }
        // 兼容 transportation 也是数组的情况
        if (Array.isArray(g.transportation)) {
            const arrival = g.transportation.find(t => t.type === '外部交通' || t.type === '到达');
            const local = g.transportation.find(t => t.type === '内部交通' || t.type === '市内');
            g.transportation = {
                arrival: arrival ? arrival.info : '高铁/飞机可达',
                localTransport: local ? local.info : '地铁、公交便利'
            };
        }

        // 3. 标准化 foods：AI 返回 desc 字段，渲染期望 description
        //    关键清洗：过滤 description 是 JSON 字符串/过长/包含 { 的垃圾数据
        if (Array.isArray(g.foods)) {
            g.foods = g.foods.map(f => {
                if (f && typeof f === 'object') {
                    // desc → description
                    if (!f.description && f.desc) f.description = f.desc;
                    // priceRange → price
                    if (!f.price && f.priceRange) f.price = f.priceRange;
                    // recommendedRestaurants → whereToEat
                    if (!f.whereToEat && f.recommendedRestaurants) {
                        f.whereToEat = f.recommendedRestaurants.map(r => typeof r === 'string' ? { name: r, address: '' } : r);
                    }
                    // === 数据清洗：过滤垃圾 description ===
                    if (f.description) {
                        const desc = String(f.description).trim();
                        // 检测 JSON 字符串（如 {"tags":["龙城"...）
                        if (desc.startsWith('{') || desc.startsWith('[')) {
                            f.description = '';
                        }
                        // 检测过长的 description（>100 字符可能是垃圾数据）
                        else if (desc.length > 100) {
                            f.description = desc.substring(0, 80) + '...';
                        }
                        // 检测包含 JSON 标记的 description
                        else if (desc.includes('"tags"') || desc.includes('"name"') || desc.includes('"routes"')) {
                            f.description = '';
                        }
                    }
                    // === 清洗 name：如果是空字符串或 JSON，丢弃该 food ===
                    if (!f.name || typeof f.name !== 'string' || f.name.startsWith('{') || f.name.startsWith('[')) {
                        return null;
                    }
                }
                return f;
            }).filter(Boolean); // 移除 null
        }

        // 4. 标准化 accommodations：AI 返回 {area, pros, cons}，渲染期望 {name, area, features}
        if (Array.isArray(g.accommodations)) {
            g.accommodations = g.accommodations.map(a => {
                if (a && typeof a === 'object') {
                    if (!a.name && a.area) a.name = a.area + '住宿';
                    if (!a.features) {
                        a.features = [];
                        if (a.pros) a.features.push(a.pros);
                    }
                }
                return a;
            }).filter(a => a && a.name); // 移除无效项
        }

        // 5. 确保 budget 结构完整且 total 始终有值
        //    截图问题：budget.total 显示"待计算"，需确保始终填充
        if (!g.budget || typeof g.budget !== 'object') {
            g.budget = {};
        }
        if (!g.budget.breakdown && (g.budget.low || g.budget.medium || g.budget.high)) {
            g.budget.breakdown = {
                '经济档': g.budget.low || '—',
                '舒适档': g.budget.medium || '—',
                '豪华档': g.budget.high || '—'
            };
        }
        if (!g.budget.total) {
            // 优先用 overallBudget，否则从 low/medium 推算，最后用"约 XXX 元/人"
            if (g.overallBudget && g.overallBudget !== '待估算') {
                g.budget.total = g.overallBudget;
            } else if (g.budget.medium) {
                g.budget.total = `约 ${g.budget.medium}元/人/天`;
            } else {
                // 兜底：基于城市等级+天数计算
                const fallbackBudget = calcBudget(g.city || '', 3, 'medium');
                g.budget.total = fallbackBudget.total;
                if (!g.budget.breakdown) g.budget.breakdown = fallbackBudget.breakdown;
            }
        }
        // 同步 overallBudget
        if (!g.overallBudget || g.overallBudget === '待估算') {
            g.overallBudget = g.budget.total;
        }

        // 6. 确保 transportation 存在（本地模式 fallback）
        if (!g.transportation) {
            g.transportation = {
                arrival: '高铁/飞机可达',
                localTransport: '地铁、公交便利'
            };
        }

        // 7. 确保 title/subtitle 始终有值
        if (!g.title) g.title = `${g.city || ''}·旅行手记`;
        if (!g.subtitle) g.subtitle = `发现${g.city || ''}的独特魅力`;

        return g;
    }

    // ---------- 城市智能数据增强（基于省份/标签生成差异化真实数据）----------
    const PROVINCE_MAP = {
        '北京':'北京','上海':'上海','天津':'天津','重庆':'重庆',
        '广州':'广东','深圳':'广东','珠海':'广东','汕头':'广东','佛山':'广东','东莞':'广东','中山':'广东','惠州':'广东','江门':'广东','湛江':'广东','茂名':'广东','肇庆':'广东','梅州':'广东','汕尾':'广东','河源':'广东','清远':'广东','韶关':'广东','揭阳':'广东','阳江':'广东','潮州':'广东','云浮':'广东',
        '杭州':'浙江','宁波':'浙江','温州':'浙江','绍兴':'浙江','嘉兴':'浙江','金华':'浙江','台州':'浙江','湖州':'浙江','丽水':'浙江','衢州':'浙江','舟山':'浙江','义乌':'浙江','江山':'浙江','临海':'浙江',
        '南京':'江苏','苏州':'江苏','无锡':'江苏','常州':'江苏','南通':'江苏','徐州':'江苏','扬州':'江苏','盐城':'江苏','泰州':'江苏','镇江':'江苏','淮安':'江苏','连云港':'江苏','宿迁':'江苏','昆山':'江苏','常熟':'江苏','张家港':'江苏','宜兴':'江苏',
        '成都':'四川','绵阳':'四川','自贡':'四川','攀枝花':'四川','泸州':'四川','德阳':'四川','广元':'四川','遂宁':'四川','内江':'四川','乐山':'四川','南充':'四川','眉山':'四川','宜宾':'四川','广安':'四川','达州':'四川','雅安':'四川','巴中':'四川','资阳':'四川','西昌':'四川','峨眉山':'四川','都江堰':'四川','阆中':'四川',
        '武汉':'湖北','宜昌':'湖北','襄阳':'湖北','荆州':'湖北','十堰':'湖北','黄冈':'湖北','孝感':'湖北','荆门':'湖北','鄂州':'湖北','黄石':'湖北','咸宁':'湖北','随州':'湖北','恩施':'湖北','仙桃':'湖北','潜江':'湖北','天门':'湖北','神农架':'湖北',
        '长沙':'湖南','株洲':'湖南','湘潭':'湖南','衡阳':'湖南','邵阳':'湖南','岳阳':'湖南','常德':'湖南','张家界':'湖南','益阳':'湖南','郴州':'湖南','永州':'湖南','怀化':'湖南','娄底':'湖南','湘西':'湖南','凤凰':'湖南','韶山':'湖南',
        '西安':'陕西','宝鸡':'陕西','咸阳':'陕西','渭南':'陕西','延安':'陕西','汉中':'陕西','榆林':'陕西','安康':'陕西','商洛':'陕西','铜川':'陕西','华山':'陕西',
        '济南':'山东','青岛':'山东','烟台':'山东','威海':'山东','潍坊':'山东','淄博':'山东','临沂':'山东','济宁':'山东','泰安':'山东','德州':'山东','聊城':'山东','滨州':'山东','菏泽':'山东','东营':'山东','日照':'山东','莱芜':'山东','枣庄':'山东','曲阜':'山东','蓬莱':'山东','泰山':'山东',
        '郑州':'河南','洛阳':'河南','开封':'河南','南阳':'河南','安阳':'河南','新乡':'河南','许昌':'河南','平顶山':'河南','焦作':'河南','商丘':'河南','信阳':'河南','周口':'河南','驻马店':'河南','濮阳':'河南','三门峡':'河南','漯河':'河南','鹤壁':'河南','济源':'河南','少林寺':'河南','龙门':'河南',
        '沈阳':'辽宁','大连':'辽宁','鞍山':'辽宁','抚顺':'辽宁','本溪':'辽宁','丹东':'辽宁','锦州':'辽宁','营口':'辽宁','阜新':'辽宁','辽阳':'辽宁','盘锦':'辽宁','铁岭':'辽宁','朝阳':'辽宁','葫芦岛':'辽宁','旅顺':'辽宁',
        '长春':'吉林','吉林':'吉林','四平':'吉林','辽源':'吉林','通化':'吉林','白山':'吉林','松原':'吉林','白城':'吉林','延边':'吉林','延吉':'吉林','长白山':'吉林','集安':'吉林',
        '哈尔滨':'黑龙江','齐齐哈尔':'黑龙江','牡丹江':'黑龙江','佳木斯':'黑龙江','大庆':'黑龙江','鸡西':'黑龙江','双鸭山':'黑龙江','伊春':'黑龙江','七台河':'黑龙江','鹤岗':'黑龙江','黑河':'黑龙江','绥化':'黑龙江','大兴安岭':'黑龙江','漠河':'黑龙江','雪乡':'黑龙江','亚布力':'黑龙江',
        '昆明':'云南','大理':'云南','丽江':'云南','西双版纳':'云南','香格里拉':'云南','腾冲':'云南','瑞丽':'云南','普洱':'云南','曲靖':'云南','玉溪':'云南','保山':'云南','昭通':'云南','临沧':'云南','楚雄':'云南','红河':'云南','文山':'云南','怒江':'云南','迪庆':'云南','德宏':'云南','建水':'云南','束河':'云南','泸沽湖':'云南','元阳':'云南',
        '贵阳':'贵州','遵义':'贵州','安顺':'贵州','毕节':'贵州','铜仁':'贵州','六盘水':'贵州','黔东南':'贵州','黔南':'贵州','黔西南':'贵州','凯里':'贵州','镇远':'贵州','荔波':'贵州','西江':'贵州','梵净山':'贵州','黄果树':'贵州','兴义':'贵州','赤水':'贵州',
        '南宁':'广西','桂林':'广西','柳州':'广西','梧州':'广西','北海':'广西','防城港':'广西','钦州':'广西','贵港':'广西','玉林':'广西','百色':'广西','贺州':'广西','河池':'广西','来宾':'广西','崇左':'广西','阳朔':'广西','龙胜':'广西','德天':'广西','黄姚':'广西',
        '海口':'海南','三亚':'海南','三沙':'海南','儋州':'海南','五指山':'海南','文昌':'海南','琼海':'海南','万宁':'海南','东方':'海南','陵水':'海南','保亭':'海南','乐东':'海南','昌江':'海南','白沙':'海南','琼中':'海南','临高':'海南','澄迈':'海南','定安':'海南','屯昌':'海南','博鳌':'海南',
        '兰州':'甘肃','天水':'甘肃','酒泉':'甘肃','庆阳':'甘肃','平凉':'甘肃','定西':'甘肃','陇南':'甘肃','武威':'甘肃','张掖':'甘肃','武都':'甘肃','临夏':'甘肃','甘南':'甘肃','白银':'甘肃','金昌':'甘肃','嘉峪关':'甘肃','敦煌':'甘肃','嘉峪关':'甘肃','郎木寺':'甘肃','麦积山':'甘肃','崆峒山':'甘肃',
        '西宁':'青海','海东':'青海','海北':'青海','海南':'青海','黄南':'青海','果洛':'青海','玉树':'青海','海西':'青海','格尔木':'青海','德令哈':'青海','同仁':'青海','青海湖':'青海','茶卡':'青海','祁连':'青海','门源':'青海','年保玉则':'青海',
        '银川':'宁夏','石嘴山':'宁夏','吴忠':'宁夏','固原':'宁夏','中卫':'宁夏','灵武':'宁夏','永宁':'宁夏','贺兰':'宁夏','平罗':'宁夏','盐池':'宁夏','同心':'宁夏','泾源':'宁夏','隆德':'宁夏','西吉':'宁夏','彭阳':'宁夏','青铜峡':'宁夏','沙坡头':'宁夏','六盘山':'宁夏','沙湖':'宁夏','水洞沟':'宁夏',
        '乌鲁木齐':'新疆','克拉玛依':'新疆','吐鲁番':'新疆','哈密':'新疆','阿克苏':'新疆','喀什':'新疆','和田':'新疆','伊犁':'新疆','塔城':'新疆','阿勒泰':'新疆','博乐':'新疆','库尔勒':'新疆','阿图什':'新疆','昌吉':'新疆','阜康':'新疆','米泉':'新疆','五家渠':'新疆','阿拉尔':'新疆','图木舒克':'新疆','北屯':'新疆','铁门关':'新疆','双河':'新疆','可克达拉':'新疆','昆玉':'新疆','石河子':'新疆','那拉提':'新疆','禾木':'新疆','布尔津':'新疆','独库公路':'新疆','赛里木湖':'新疆','巴音布鲁克':'新疆','塔什库尔干':'新疆','伊宁':'新疆','库车':'新疆','乌伦古':'新疆','罗布人':'新疆',
        '拉萨':'西藏','日喀则':'西藏','昌都':'西藏','林芝':'西藏','山南':'西藏','那曲':'西藏','阿里':'西藏','尼木':'西藏','当雄':'西藏','林周':'西藏','曲水':'西藏','堆龙德庆':'西藏','达孜':'西藏','墨竹工卡':'西藏','工布江达':'西藏','米林':'西藏','墨脱':'西藏','波密':'西藏','察隅':'西藏','朗县':'西藏','南伊沟':'西藏','羊卓雍错':'西藏','纳木错':'西藏','珠峰':'西藏','珠穆朗玛':'西藏','羊八井':'西藏','江孜':'西藏','亚东':'西藏','樟木':'西藏','林芝':'西藏','八一':'西藏',
        '合肥':'安徽','芜湖':'安徽','蚌埠':'安徽','淮南':'安徽','马鞍山':'安徽','淮北':'安徽','铜陵':'安徽','安庆':'安徽','黄山':'安徽','滁州':'安徽','阜阳':'安徽','宿州':'安徽','六安':'安徽','亳州':'安徽','池州':'安徽','宣城':'安徽','明光':'安徽','天长':'安徽','桐城':'安徽','宁国':'安徽','界首':'安徽','巢湖':'安徽','潜山':'安徽','广德':'安徽','宿松':'安徽','徽州':'安徽','宏村':'安徽','西递':'安徽','歙县':'安徽','九华山':'安徽',
        '福州':'福建','厦门':'福建','莆田':'福建','三明':'福建','泉州':'福建','漳州':'福建','南平':'福建','龙岩':'福建','宁德':'福建','福清':'福建','长乐':'福建','永安':'福建','石狮':'福建','晋江':'福建','南安':'福建','龙海':'福建','邵武':'福建','武夷山':'福建','建瓯':'福建','漳平':'福建','建阳':'福建','宁德':'福建','福鼎':'福建','福安':'福建','霞浦':'福建','土楼':'福建','鼓浪屿':'福建',
        '南昌':'江西','景德镇':'江西','萍乡':'江西','九江':'江西','新余':'江西','鹰潭':'江西','赣州':'江西','吉安':'江西','宜春':'江西','抚州':'江西','上饶':'江西','庐山':'江西','井冈山':'江西','三清山':'江西','龙虎山':'江西','婺源':'江西','景德镇':'江西','瑞金':'江西','共青城':'江西','鄱阳':'江西','万年':'江西','德兴':'江西','樟树':'江西','丰城':'江西','高安':'江西','靖安':'江西','奉新':'江西','上高':'江西','宜丰':'江西','铜鼓':'江西','万载':'江西','修水':'江西','武宁':'江西','永修':'江西','德安':'江西','都昌':'江西','湖口':'江西','彭泽':'江西','瑞昌':'江西','乐平':'江西','贵溪':'江西','余江':'江西','分宜':'江西','渝水':'江西','南城':'江西','南丰':'江西','黎川':'江西','崇仁':'江西','乐安':'江西','宜黄':'江西','金溪':'江西','资溪':'江西','东乡':'江西','广昌':'江西','石城':'江西','宁都':'江西','于都':'江西','兴国':'江西','会昌':'江西','寻乌':'江西','安远':'江西','定南':'江西','龙南':'江西','全南':'江西','大余':'江西','信丰':'江西','上犹':'江西','崇义':'江西','赣县':'江西','南康':'江西','赣县':'江西',
        '石家庄':'河北','唐山':'河北','秦皇岛':'河北','邯郸':'河北','邢台':'河北','保定':'河北','张家口':'河北','承德':'河北','沧州':'河北','廊坊':'河北','衡水':'河北','辛集':'河北','藁城':'河北','晋州':'河北','新乐':'河北','鹿泉':'河北','遵化':'河北','迁安':'河北','武安':'河北','南宫':'河北','沙河':'河北','涿州':'河北','定州':'河北','安国':'河北','高碑店':'河北','泊头':'河北','任丘':'河北','黄骅':'河北','河间':'河北','三河':'河北','霸州':'河北','深州':'河北','乐亭':'河北','迁西':'河北','滦南':'河北','玉田':'河北','滦县':'河北','曹妃甸':'河北','北戴河':'河北','山海关':'河北','南戴河':'河北','兴隆':'河北','围场':'河北','丰宁':'河北','坝上':'河北','白洋淀':'河北','野三坡':'河北','狼牙山':'河北','清东陵':'河北','西柏坡':'河北','正定':'河北','赵县':'河北','井陉':'河北','赞皇':'河北','灵寿':'河北','行唐':'河北','平山':'河北','元氏':'河北','高邑':'河北','深泽':'河北','无极':'河北','赵县':'河北',
        '太原':'山西','大同':'山西','阳泉':'山西','长治':'山西','晋城':'山西','朔州':'山西','晋中':'山西','运城':'山西','忻州':'山西','临汾':'山西','吕梁':'山西','古交':'山西','霍州':'山西','孝义':'山西','介休':'山西','高平':'山西','原平':'山西','侯马':'山西','永济':'山西','河津':'山西','怀仁':'山西','潞城':'山西','平遥':'山西','五台山':'山西','云冈':'山西','壶口':'山西','恒山':'山西','悬空寺':'山西','应县':'山西','宁武':'山西','代县':'山西','繁峙':'山西','定襄':'山西','五寨':'山西','岢岚':'山西','河曲':'山西','保德':'山西','偏关':'山西','原平':'山西','静乐':'山西','神池':'山西','宁武':'山西','五台':'山西','岚县':'山西','方山':'山西','兴县':'山西','临县':'山西','柳林':'山西','石楼':'山西','中阳':'山西','交口':'山西','孝义':'山西','汾阳':'山西','文水':'山西','交城':'山西','兴县':'山西','临县':'山西','阳高':'山西','天镇':'山西','广灵':'山西','灵丘':'山西','浑源':'山西','左云':'山西','右玉':'山西','平鲁':'山西','山阴':'山西','应县':'山西','怀仁':'山西','朔城':'山西',
        '呼和浩特':'内蒙古','包头':'内蒙古','乌海':'内蒙古','赤峰':'内蒙古','通辽':'内蒙古','鄂尔多斯':'内蒙古','呼伦贝尔':'内蒙古','巴彦淖尔':'内蒙古','乌兰察布':'内蒙古','兴安':'内蒙古','锡林郭勒':'内蒙古','阿拉善':'内蒙古','满洲里':'内蒙古','扎兰屯':'内蒙古','牙克石':'内蒙古','根河':'内蒙古','额尔古纳':'内蒙古','乌兰浩特':'内蒙古','阿尔山':'内蒙古','霍林郭勒':'内蒙古','锡林浩特':'内蒙古','二连浩特':'内蒙古','丰镇':'内蒙古','东胜':'内蒙古','临河':'内蒙古','集宁':'内蒙古','海拉尔':'内蒙古','鄂温克':'内蒙古','陈巴尔虎':'内蒙古','新巴尔虎':'内蒙古','达茂':'内蒙古','四子王':'内蒙古','凉城':'内蒙古','察右':'内蒙古','卓资':'内蒙古','兴和':'内蒙古','商都':'内蒙古','化德':'内蒙古','武川':'内蒙古','和林格尔':'内蒙古','托克托':'内蒙古','清水河':'内蒙古','土默特':'内蒙古','达拉特':'内蒙古','准格尔':'内蒙古','鄂托克':'内蒙古','杭锦':'内蒙古','乌审':'内蒙古','伊金霍洛':'内蒙古','阿拉善左':'内蒙古','阿拉善右':'内蒙古','额济纳':'内蒙古','呼伦贝尔':'内蒙古','满洲里':'内蒙古','室韦':'内蒙古','恩和':'内蒙古','临江':'内蒙古','莫尔道嘎':'内蒙古','敖鲁古雅':'内蒙古','根河':'内蒙古','冷极':'内蒙古','额尔古纳':'内蒙古','湿地':'内蒙古','草原':'内蒙古','沙漠':'内蒙古','胡杨':'内蒙古',
        '香港':'香港','澳门':'澳门','台北':'台湾','高雄':'台湾','台中':'台湾','台南':'台湾','基隆':'台湾','新竹':'台湾','嘉义':'台湾','花莲':'台湾','台东':'台湾','屏东':'台湾','垦丁':'台湾','日月潭':'台湾','阿里山':'台湾','九份':'台湾','平溪':'台湾','淡水':'台湾','野柳':'台湾','太鲁阁':'台湾','清境':'台湾','宜兰':'台湾','澎湖':'台湾','金门':'台湾','马祖':'台湾','绿岛':'台湾','兰屿':'台湾','七星潭':'台湾','西门町':'台湾','101':'台湾','故宫':'台湾','中正纪念堂':'台湾','龙山寺':'台湾','忠孝东路':'台湾','阳明山':'台湾','北投':'台湾','乌来':'台湾','九份':'台湾','金瓜石':'台湾','十分':'台湾','菁桐':'台湾','平溪':'台湾','猴硐':'台湾','侯硐':'台湾','猫村':'台湾','暖暖':'台湾','瑞芳':'台湾','贡寮':'台湾','双溪':'台湾','头城':'台湾','礁溪':'台湾','宜兰':'台湾','罗东':'台湾','苏澳':'台湾','南方澳':'台湾','冬山':'台湾','五结':'台湾','三星':'台湾','大同':'台湾','员山':'台湾','壮围':'台湾','头城':'台湾','礁溪':'台湾','壮围':'台湾','员山':'台湾','三星':'台湾','大同':'台湾','南澳':'台湾','苏澳':'台湾','冬山':'台湾','五结':'台湾','罗东':'台湾','宜兰':'台湾',
    };

    // 一线城市与新一线城市（用于预算差异化）
    const TIER1 = new Set(['北京','上海','广州','深圳']);
    const TIER_NEW = new Set(['成都','杭州','武汉','西安','重庆','苏州','南京','天津','长沙','郑州','青岛','沈阳','大连','厦门','宁波','无锡','福州','济南','合肥','南昌','哈尔滨','长春','昆明','贵阳','南宁','太原','石家庄','兰州','海口','三亚','银川','西宁','乌鲁木齐','拉萨','呼和浩特']);

    // 城市等级判定
    function getCityTier(city) {
        if (TIER1.has(city)) return 1;
        if (TIER_NEW.has(city)) return 2;
        return 3;
    }

    // 智能预算计算（基于城市等级+天数+偏好）
    function calcBudget(city, days, budgetRange) {
        const tier = getCityTier(city);
        const tierMul = tier === 1 ? 1.3 : tier === 2 ? 1.0 : 0.8;
        const budgetMul = budgetRange === 'low' ? 0.7 : budgetRange === 'high' ? 1.6 : 1.0;
        const base = { transport: 300, hotel: 280, food: 150, ticket: 120 };
        const breakdown = {
            '交通': `${Math.round(base.transport * tierMul * budgetMul)}元`,
            '住宿': `${Math.round(base.hotel * tierMul * budgetMul * days)}元`,
            '餐饮': `${Math.round(base.food * tierMul * budgetMul * days)}元`,
            '门票': `${Math.round(base.ticket * budgetMul)}元`
        };
        const total = Math.round((base.transport + (base.hotel + base.food) * days + base.ticket) * tierMul * budgetMul);
        return { total: `${total}元`, breakdown, moneySavingTips: ['提前预订酒店享早鸟价', '关注景区免票日/学生证半价', '避开节假日高峰节省 30% 开销'] };
    }

    // 智能住宿推荐（基于省份+城市标签）
    function genAccommodations(city, tags, province) {
        const isOldCity = tags && tags.some(t => ['历史文化','古都','古城','皇家园林'].includes(t));
        const isFoodie = tags && tags.some(t => ['美食之都','美食天堂','美食'].includes(t));
        const isNature = tags && tags.some(t => ['自然风光','海滨城市','山水','江南水乡'].includes(t));
        const tier = getCityTier(city);
        const priceLow = tier === 1 ? '300-500元' : tier === 2 ? '200-400元' : '150-300元';
        const priceHigh = tier === 1 ? '600-1200元' : tier === 2 ? '500-800元' : '400-600元';

        const list = [];
        if (isOldCity) {
            list.push({ name: `${city}古城区精品客栈`, area: '古城区/老街', priceRange: `${priceLow}（淡季）/ ${priceHigh}（旺季）`, features: ['步行可达历史景点', '传统建筑风格', '体验当地文化'], pros: '地理位置绝佳，步行可达主要景点，沉浸式体验当地文化', cons: '老城区停车不便，夜间可能较喧闹' });
        }
        if (isFoodie) {
            list.push({ name: `${city}美食街区民宿`, area: '美食街/步行街周边', priceRange: `${priceLow}`, features: ['近美食聚集地', '步行觅食便利', '本地房东推荐'], pros: '下楼就是美食街，深夜觅食无压力', cons: '旺季需提前一个月预订' });
        }
        if (isNature) {
            list.push({ name: `${city}景区度假酒店`, area: '景区周边', priceRange: `${priceHigh}`, features: ['推窗即景', '环境清幽', '含早餐'], pros: '避开市区喧嚣，享受自然风光', cons: '距市中心较远，需自驾或打车' });
        }
        list.push({ name: `${city}市中心商务酒店`, area: '市中心/商圈', priceRange: `${priceLow}`, features: ['交通便利', '近地铁/公交', '配套齐全'], pros: '出行方便，周边配套成熟，性价比高', cons: '景观一般，缺乏特色' });
        return list.slice(0, 3);
    }

    // 智能交通信息（基于城市等级）
    function genTransportation(city, province) {
        const tier = getCityTier(city);
        const hasMetro = tier <= 2;
        const hasAirport = tier <= 2;
        return {
            arrival: hasAirport ? `${city}有机场，可乘飞机直达；高铁站连接全国铁路网，自驾可通过高速直达` : `可乘高铁至${province}内最近的枢纽站转车，或自驾走国道/省道到达`,
            localTransport: hasMetro ? `${city}地铁覆盖主要景点，公交网络发达，网约车便利，短途可骑共享单车` : `${city}以公交和网约车为主，景点集中区域可步行，建议拼车或包车游览`
        };
    }

    // 智能贴士（基于省份+季节）
    function genTips(city, season, province) {
        const tips = {
            prepare: ['身份证/护照', '舒适步行鞋（日行万步）', '充电宝（拍照耗电快）', '雨具（天气多变）'],
            avoid: ['避开节假日高峰（酒店涨价 2-3 倍）', '不轻信景区路边揽客', '谨慎购买"特产"（多数为义乌产）'],
            bestTime: [season || '春秋两季最佳']
        };
        // 高原地区特殊提示
        if (['西藏','青海','四川'].includes(province) && /高原|拉萨|林芝|日喀则|西宁|格尔木|香格里拉|峨眉山|九寨/.test(city)) {
            tips.prepare.push('防晒霜（高原紫外线强）', '红景天（预防高反）');
            tips.avoid.push('初到高原避免剧烈运动和饮酒');
        }
        // 海滨地区
        if (['海南','福建','广东','山东'].includes(province) && /海|岛|湾|港|三亚|厦门|青岛|威海|大连|北海/.test(city)) {
            tips.prepare.push('防晒霜（SPF50+）', '泳衣', '防水手机袋');
            tips.avoid.push('台风季（7-9月）关注天气预报');
        }
        // 北方冬季
        if (['黑龙江','吉林','辽宁','内蒙古','新疆'].includes(province)) {
            tips.prepare.push('羽绒服（冬季 -20℃ 以下）', '保暖内衣', '暖宝宝');
            tips.avoid.push('冬季路面结冰，自驾需换雪地胎');
        }
        return tips;
    }

    // ---------- 本地攻略生成（基于 527 城数据库 + 智能数据增强）----------
    function buildLocalGuide(city, prefs) {
        const base = CITIES[city];
        const days = prefs.days || 3;
        const province = PROVINCE_MAP[city] || '';
        const tags = base?.tags || [];
        const season = base?.season || '四季皆宜';

        // 公共增强数据
        const accommodations = genAccommodations(city, tags, province);
        const transportation = genTransportation(city, province);
        const tips = genTips(city, season, province);
        const budget = calcBudget(city, days, prefs.budgetRange);

        if (!base) {
            return {
                city, title: `${city}·发现之旅`, subtitle: `探索${province || ''}${city}的独特魅力`,
                season, duration: `${days}天`, overallBudget: budget.total,
                difficulty: '适中', source: 'local-mock',
                routes: buildMockRoutes(city, days),
                foods: [{ name: `${city}特色菜`, description: `${province || '当地'}招牌美食，体现地方风味`, price: '38-68元', mustTry: true, whereToEat: [{ name: '当地老字号', address: '市中心' }] }],
                accommodations, tips, budget, transportation,
                tags: ['本地数据']
            };
        }
        // 基于 DB 数据按天数扩展
        const routes = normalizeRoutes(base.routes, days, city);
        return {
            city,
            title: base.title || `${city}·旅行手记`,
            subtitle: base.poster?.subtitle || base.atmosphere || `发现${city}的独特魅力`,
            season: base.season || '四季皆宜',
            duration: `${days}天`,
            overallBudget: budget.total,
            difficulty: '适中',
            source: 'local-db',
            routes,
            foods: (base.foods || []).map(f => ({
                name: f.name, description: f.description || `${province}${city}特色美食`, price: f.price || '—',
                mustTry: !!f.mustTry, rating: 5, whereToEat: [{ name: f.location || '当地老字号', address: '市区' }]
            })),
            accommodations, tips, budget, transportation,
            tags: base.tags || []
        };
    }

    function normalizeRoutes(routeStrs, days, city) {
        const list = routeStrs || [];
        const out = [];
        for (let i = 0; i < days; i++) {
            const route = list[i % Math.max(list.length, 1)] || `${city}精华景点漫步`;
            out.push({
                day: i + 1,
                theme: `第 ${i + 1} 天 · ${city}探索`,
                routeLine: route,
                spots: route.split('→').map(s => s.trim()).filter(Boolean)
            });
        }
        return out;
    }
    function buildMockRoutes(city, days) {
        const out = [];
        for (let i = 0; i < days; i++) {
            out.push({
                day: i + 1, theme: `第 ${i + 1} 天 · ${city}精华`,
                routeLine: `${city}地标→历史街区→美食街`,
                spots: [`${city}地标景点`, '历史文化街区', '特色美食街']
            });
        }
        return out;
    }

    // ---------- DOM 引用 ----------
    const $ = (id) => document.getElementById(id);
    const dom = {
        cityInput: $('cityInput'), suggestions: $('searchSuggestions'), form: $('searchForm'),
        dayPills: $('dayPills'), travelType: $('travelType'), budgetRange: $('budgetRange'),
        quickCities: $('quickCities'), rankingList: $('rankingList'),
        historySection: $('historySection'), historyList: $('recentHistoryList'),
        loading: $('loading'), loadingCity: $('loadingCity'), loadingSub: $('loadingSub'), loadingBar: $('loadingBar'),
        resultPage: $('resultPage'), homePage: $('homePage'),
        resultTitle: $('resultTitle'), guideContent: $('guideContent'), poster: $('poster'),
        backBtn: $('backBtn'), favoriteBtn: $('favoriteBtn'), copyTextBtn: $('copyTextBtn'), downloadPosterBtn: $('downloadPosterBtn'),
        shareLinkBtn: $('shareLinkBtn'),
        posterStyles: $('posterStyles'),
        navFavCount: $('navFavCount'), navFavoritesBtn: $('navFavoritesBtn'),
        favoritesModal: $('favoritesModal'), closeFavoritesModal: $('closeFavoritesModal'),
        favoritesList: $('favoritesList'), emptyFavorites: $('emptyFavorites'),
        clearAllFavorites: $('clearAllFavorites'), exportFavorites: $('exportFavorites'),
        brandHome: $('brandHome'), toastWrap: $('toastWrap')
    };

    // ---------- 初始化 ----------
    function init() {
        renderQuickCities();
        renderRanking();
        renderHistory();
        updateFavCount();
        bindEvents();
        // 检测 URL 参数，自动打开攻略（支持分享链接）
        const urlState = parseUrlState();
        if (urlState && urlState.city) {
            // 同步表单状态
            if (urlState.days) {
                state.selectedDays = urlState.days;
                dom.dayPills.querySelectorAll('.pill').forEach(p => {
                    p.classList.toggle('active', parseInt(p.dataset.days, 10) === urlState.days);
                });
            }
            if (urlState.travelType) {
                state.travelType = urlState.travelType;
                dom.travelType.value = urlState.travelType;
            }
            if (urlState.budgetRange) {
                state.budgetRange = urlState.budgetRange;
                dom.budgetRange.value = urlState.budgetRange;
            }
            dom.cityInput.value = urlState.city;
            // 延迟一帧以等待页面渲染完成
            setTimeout(() => submitCity(urlState.city), 60);
        }
    }

    // ---------- 分享链接：URL 状态管理 ----------
    // 将城市+天数+偏好编码到 URL query string，支持分享后打开即显示同一攻略
    function updateShareUrl(city, prefs) {
        try {
            const params = new URLSearchParams();
            params.set('city', city);
            if (prefs.days) params.set('days', String(prefs.days));
            if (prefs.travelType) params.set('type', prefs.travelType);
            if (prefs.budgetRange) params.set('budget', prefs.budgetRange);
            const newUrl = `${location.pathname}?${params.toString()}${location.hash}`;
            history.replaceState(null, '', newUrl);
        } catch (e) {
            console.warn('更新分享 URL 失败:', e);
        }
    }

    // 解析 URL 参数为状态对象
    function parseUrlState() {
        try {
            const params = new URLSearchParams(location.search);
            const city = params.get('city');
            if (!city) return null;
            return {
                city: decodeURIComponent(city),
                days: params.get('days') ? parseInt(params.get('days'), 10) : null,
                travelType: params.get('type') || null,
                budgetRange: params.get('budget') || null
            };
        } catch (e) {
            return null;
        }
    }

    // 复制当前攻略的分享链接到剪贴板
    function copyShareLink(city) {
        const shareUrl = buildShareUrl(city || state.currentCity);
        if (!shareUrl) { toast('暂无可分享的攻略', 'error'); return; }
        const fullUrl = location.origin + shareUrl;
        navigator.clipboard.writeText(fullUrl).then(
            () => toast('攻略链接已复制，可粘贴给好友', 'success'),
            () => {
                // 降级方案：使用临时 input
                const tmp = document.createElement('input');
                tmp.value = fullUrl;
                document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand('copy'); toast('攻略链接已复制', 'success'); }
                catch { toast('复制失败，请手动复制地址栏链接', 'error'); }
                tmp.remove();
            }
        );
    }

    // 根据城市+当前偏好构造分享 URL（相对路径）
    function buildShareUrl(city) {
        if (!city) return null;
        const params = new URLSearchParams();
        params.set('city', city);
        params.set('days', String(state.selectedDays));
        params.set('type', state.travelType);
        params.set('budget', state.budgetRange);
        return `${location.pathname}?${params.toString()}`;
    }

    // ---------- 热门城市快捷 ----------
    function renderQuickCities() {
        const hot = ['北京', '上海', '成都', '杭州', '西安', '重庆', '厦门', '丽江', '三亚', '大理', '拉萨', '敦煌'];
        const frag = document.createDocumentFragment();
        hot.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'qc-btn';
            b.textContent = c;
            b.onclick = (e) => { e.preventDefault(); dom.cityInput.value = c; submitCity(c); };
            frag.appendChild(b);
        });
        dom.quickCities.appendChild(frag);
    }

    // ---------- 排行榜 ----------
    function renderRanking() {
        const list = Object.entries(CITIES)
            .map(([name, d]) => ({ name, ...d }))
            .sort((a, b) => scoreCity(b) - scoreCity(a))
            .slice(0, 12);

        if (!list.length) { dom.rankingList.innerHTML = '<p class="empty-guide">城市数据加载中…</p>'; return; }

        dom.rankingList.innerHTML = list.map((c, i) => `
            <article class="rank-card" data-rank="${String(i + 1).padStart(2, '0')}" data-city="${c.name}">
                <div class="rc-body">
                    <div class="rc-name">${c.name}</div>
                    <div class="rc-title">${c.title || ''}</div>
                    <div class="rc-tags">${(c.tags || []).slice(0, 3).map(t => `<span class="rc-tag">${t}</span>`).join('')}</div>
                    <div class="rc-meta">
                        <span>季节 <strong>${c.season || '四季皆宜'}</strong></span>
                        <span>建议 <strong>${(c.days || '3').replace(/天+$/, '')}天</strong></span>
                    </div>
                </div>
                <div class="rc-arrow">→</div>
            </article>
        `).join('');

        dom.rankingList.querySelectorAll('.rank-card').forEach(card => {
            card.onclick = () => { const city = card.dataset.city; dom.cityInput.value = city; submitCity(city); };
        });
    }

    // 简单的城市热度评分（按季节 + 标签）
    function scoreCity(c) {
        let s = 50;
        const month = new Date().getMonth() + 1;
        const season = c.season || '';
        if ((month >= 3 && month <= 5) && season.includes('春')) s += 30;
        if ((month >= 9 && month <= 11) && season.includes('秋')) s += 30;
        if (season.includes('四季') || season.includes('全年')) s += 15;
        if ((c.tags || []).includes('历史文化')) s += 8;
        if ((c.tags || []).includes('美食')) s += 8;
        if (c.foods && c.foods.length > 3) s += 6;
        if (c.routes && c.routes.length > 3) s += 6;
        return s + Math.random() * 4;
    }

    // ---------- 历史 ----------
    function renderHistory() {
        if (!state.history.length) { dom.historySection.hidden = true; return; }
        dom.historySection.hidden = false;
        dom.historyList.innerHTML = state.history.slice(0, 8).map(h => `
            <div class="history-chip" data-city="${escapeHtml(h.city)}">
                <span class="hc-name">${escapeHtml(h.city)}</span>
                <span class="hc-time">${timeAgo(h.time)}</span>
                <button class="hc-share" data-city="${escapeHtml(h.city)}" title="复制该攻略链接" aria-label="复制 ${escapeHtml(h.city)} 攻略链接">
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 2v8M5 5l3-3 3 3M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        `).join('');
        // 点击主体（非分享按钮）重新打开攻略
        dom.historyList.querySelectorAll('.history-chip').forEach(chip => {
            chip.onclick = (e) => {
                if (e.target.closest('.hc-share')) return; // 分享按钮单独处理
                const city = chip.dataset.city;
                dom.cityInput.value = city;
                submitCity(city);
            };
        });
        // 分享按钮：复制该城市的攻略链接
        dom.historyList.querySelectorAll('.hc-share').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                copyShareLink(btn.dataset.city);
            };
        });
    }

    // ---------- 事件绑定 ----------
    function bindEvents() {
        dom.form.addEventListener('submit', (e) => { e.preventDefault(); submitCity(dom.cityInput.value.trim()); });

        // 天数
        dom.dayPills.querySelectorAll('.pill').forEach(p => {
            p.onclick = () => {
                dom.dayPills.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
                p.classList.add('active');
                state.selectedDays = parseInt(p.dataset.days, 10);
            };
        });
        dom.travelType.onchange = () => state.travelType = dom.travelType.value;
        dom.budgetRange.onchange = () => state.budgetRange = dom.budgetRange.value;

        // 搜索建议
        let suggestTimer;
        dom.cityInput.addEventListener('input', () => {
            clearTimeout(suggestTimer);
            const q = dom.cityInput.value.trim();
            if (!q) { dom.suggestions.hidden = true; return; }
            suggestTimer = setTimeout(() => showSuggestions(q), 160);
        });
        dom.cityInput.addEventListener('blur', () => setTimeout(() => dom.suggestions.hidden = true, 200));
        dom.cityInput.addEventListener('focus', () => {
            if (dom.suggestions.innerHTML) dom.suggestions.hidden = false;
        });

        // 结果页
        dom.backBtn.onclick = showHome;
        dom.favoriteBtn.onclick = toggleFavorite;
        dom.copyTextBtn.onclick = copyGuideText;
        dom.downloadPosterBtn.onclick = downloadPoster;
        dom.shareLinkBtn.onclick = () => copyShareLink(state.currentCity);

        // 海报风格
        dom.posterStyles.querySelectorAll('.style-pill').forEach(p => {
            p.onclick = () => {
                dom.posterStyles.querySelectorAll('.style-pill').forEach(x => x.classList.remove('active'));
                p.classList.add('active');
                state.posterStyle = p.dataset.style;
                renderPoster();
            };
        });

        // 收藏
        dom.navFavoritesBtn.onclick = openFavorites;
        dom.closeFavoritesModal.onclick = closeFavorites;
        dom.favoritesModal.addEventListener('click', (e) => { if (e.target === dom.favoritesModal) closeFavorites(); });
        dom.clearAllFavorites.onclick = clearFavorites;
        dom.exportFavorites.onclick = exportFavorites;

        dom.brandHome.onclick = (e) => { e.preventDefault(); showHome(); };
    }

    // ---------- 搜索建议 ----------
    function showSuggestions(q) {
        const lower = q.toLowerCase();
        const matches = Object.entries(CITIES)
            .map(([name, d]) => {
                let score = 0;
                if (name === q) score = 100;
                else if (name.includes(q)) score = 85;
                else if ((d.tags || []).some(t => t.includes(q))) score = 60;
                else if ((d.title || '').includes(q)) score = 40;
                return { name, d, score };
            })
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        if (!matches.length) { dom.suggestions.hidden = true; return; }
        dom.suggestions.innerHTML = matches.map(m => `
            <div class="suggestion-item" data-city="${m.name}">
                <div>
                    <div class="s-name">${m.name}</div>
                    <div class="s-title">${m.d.title || ''}</div>
                </div>
                <div class="s-tags">${(m.d.tags || []).slice(0, 2).join(' · ')}</div>
            </div>
        `).join('');
        dom.suggestions.hidden = false;
        dom.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.onmousedown = () => { dom.cityInput.value = item.dataset.city; dom.suggestions.hidden = true; submitCity(item.dataset.city); };
        });
    }

    // ---------- 提交生成 ----------
    async function submitCity(city) {
        if (!city) { toast('请输入城市名称', 'error'); return; }
        showLoading(city);
        const prefs = { days: state.selectedDays, travelType: state.travelType, budgetRange: state.budgetRange };
        try {
            let guide = normalizeGuideData(await API.generateGuide(city, prefs));
            // 城市混淆检测：如果 AI 返回的内容明显属于其他城市，回退到本地智能数据
            if (guide && guide.cityMismatch) {
                console.warn(`⚠️ AI 城市混淆，回退本地数据：${city}`);
                toast('AI 数据异常，已切换为本地智能数据', 'info');
                guide = normalizeGuideData(buildLocalGuide(city, prefs));
            }
            // === 数据质量检测：如果 AI 数据质量过差（routes/foods 全空或全是占位），回退到本地智能数据 ===
            if (guide && !isGuideDataValid(guide, city)) {
                console.warn(`⚠️ AI 数据质量不佳，回退本地数据：${city}`);
                toast('AI 数据不完整，已切换为本地智能数据', 'info');
                guide = normalizeGuideData(buildLocalGuide(city, prefs));
            }
            state.currentGuide = guide;
            state.currentCity = city;
            addHistory(city);
            // 更新 URL，使当前攻略可通过链接分享
            updateShareUrl(city, prefs);
            renderResult(guide);
            hideLoading();
            showResult();
        } catch (e) {
            hideLoading();
            toast('生成失败：' + e.message, 'error');
        }
    }

    // 检测攻略数据质量：routes/foods 至少有一项有效内容
    function isGuideDataValid(g, city) {
        if (!g) return false;
        // routes 必须至少有 1 条有效路线（含 → 分隔的景点）
        const validRoutes = (g.routes || []).filter(r => {
            const line = (typeof r === 'string') ? r : (r.routeLine || r.route || '');
            return line && line.includes('→') && !/^(精选行程|主要景点|行程安排|今日行程)$/i.test(line.trim());
        });
        // foods 必须至少有 1 个有效美食（name 是正常字符串）
        const validFoods = (g.foods || []).filter(f => f && f.name && typeof f.name === 'string'
            && !f.name.startsWith('{') && !f.name.startsWith('[') && f.name.length >= 2);
        // 至少 routes 或 foods 有一项有效
        return validRoutes.length > 0 || validFoods.length > 0;
    }

    // ---------- 渲染结果 ----------
    function renderResult(g) {
        dom.resultTitle.textContent = g.title || `${g.city}攻略`;
        renderGuide(g);
        renderPoster();
        updateFavoriteBtn();
    }

    // ---------- 外部资源链接生成器 ----------
    // 为攻略中的景点/美食/住宿生成可点击的外部资源链接
    // - 景点 → 高德地图搜索（国内可用，无需 API Key）
    // - 美食 → 大众点评搜索（餐饮垂类，更精准）
    // - 住宿 → 高德地图搜索（区域定位）
    // - 百科 → 百度百科（景点补充资料）
    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    function amapSearchUrl(query) {
        // 高德地图搜索 URL（在地图上展示该地点）
        return `https://www.amap.com/search?query=${encodeURIComponent(query)}`;
    }
    function dianpingSearchUrl(city, query) {
        // 大众点评搜索 URL（城市+美食名）
        return `https://www.dianping.com/search/keyword/0/0_${encodeURIComponent(city + ' ' + query)}`;
    }
    function baikeUrl(term) {
        // 百度百科词条 URL
        return `https://baike.baidu.com/item/${encodeURIComponent(term)}`;
    }
    // 生成一个外链图标（SVG，新窗口打开）
    function extLinkHtml(url, label) {
        if (!url) return '';
        return `<a class="ext-link" href="${url}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(label || '查看详情')}">${escapeHtml(label || '详情')}<svg class="ext-link-icon" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M6 3h7v7M13 3L6 10M11 13H4V6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
    }

    function renderGuide(g) {
        const sections = [];

        // 头部
        sections.push(`
            <div class="gc-head">
                <div class="gc-eyebrow">${g.source === 'local-db' || g.source === 'local-mock' ? '本地数据 · ' : ''}${g.duration || ''} · ${g.difficulty || '适中'}</div>
                <h1>${g.title || g.city}</h1>
                <p class="gc-sub">${g.subtitle || ''}</p>
                <div class="gc-stats">
                    <div class="gc-stat">最佳季节 <strong>${g.season || '四季皆宜'}</strong></div>
                    <div class="gc-stat">行程 <strong>${g.duration || '3天'}</strong></div>
                    <div class="gc-stat">预算 <strong>${g.overallBudget || (g.budget && g.budget.total) || '待估'}</strong></div>
                </div>
            </div>
        `);

        // 行程
        if (g.routes && g.routes.length) {
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">01</span>每日行程</h2>
                    ${g.routes.map(r => {
                        const spots = r.spots && Array.isArray(r.spots)
                            ? r.spots.map(s => typeof s === 'string' ? s : s.name).filter(Boolean)
                            : [];
                        const routeLine = r.routeLine || (typeof r.route === 'string' ? r.route : '') || '';
                        return `
                            <div class="route-day">
                                <div class="route-day-head">
                                    <span class="route-day-num">${String(r.day || 1).padStart(2, '0')}</span>
                                    <span class="route-day-theme">${r.theme || r.title || `Day ${r.day || 1}`}</span>
                                </div>
                                ${routeLine ? `<div class="route-day-route">${routeLine}</div>` : ''}
                                ${spots.length ? `<ul class="route-list">${spots.map(s => `
                                    <li>
                                        <span class="rl-name">${escapeHtml(s)}</span>
                                        <span class="rl-links">
                                            ${extLinkHtml(amapSearchUrl(g.city + ' ' + s), '地图')}
                                            ${extLinkHtml(baikeUrl(s), '百科')}
                                        </span>
                                    </li>
                                `).join('')}</ul>` : ''}
                            </div>
                        `;
                    }).join('')}
                </section>
            `);
        }

        // 美食
        if (g.foods && g.foods.length) {
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">02</span>必尝美食</h2>
                    <div class="food-grid">
                        ${g.foods.map(f => {
                            const foodName = escapeHtml(f.name || '');
                            return `
                            <div class="food-card">
                                ${f.mustTry ? '<span class="fc-must">必吃</span>' : ''}
                                <div class="fc-name">${foodName}</div>
                                ${f.description ? `<div class="fc-desc">${escapeHtml(f.description)}</div>` : ''}
                                <div class="fc-meta">
                                    <span class="fc-price">${escapeHtml(f.price || '—')}</span>
                                    <span class="fc-loc">${escapeHtml((f.whereToEat && f.whereToEat[0] && f.whereToEat[0].name) || f.location || '')}</span>
                                </div>
                                <div class="fc-links">
                                    ${extLinkHtml(dianpingSearchUrl(g.city, f.name), '大众点评')}
                                    ${extLinkHtml(amapSearchUrl(g.city + ' ' + f.name), '附近餐厅')}
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </section>
            `);
        }

        // 预算
        if (g.budget) {
            const b = g.budget;
            const items = b.breakdown || {};
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">03</span>费用预算</h2>
                    <div class="budget-box">
                        <div class="budget-total">${b.total || g.overallBudget || '待估'}</div>
                        <div class="budget-label">预估总费用（参考）</div>
                        <div class="budget-items">
                            ${Object.entries(items).map(([k, v]) => `
                                <div class="budget-item"><div class="bi-label">${k}</div><div class="bi-val">${v}</div></div>
                            `).join('')}
                        </div>
                        ${b.moneySavingTips && b.moneySavingTips.length ? `
                            <div style="margin-top:18px;font-size:14px;color:var(--muted);">省钱建议：${b.moneySavingTips.join('；')}</div>
                        ` : ''}
                    </div>
                </section>
            `);
        }

        // 贴士
        if (g.tips) {
            const t = g.tips;
            const hasAccom = g.accommodations && g.accommodations.length;
            const hasTransport = g.transportation;
            const tipsIdx = hasAccom && hasTransport ? '05' : (hasAccom || hasTransport ? '04' : '03');
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${tipsIdx}</span>实用贴士</h2>
                    <div class="tips-grid">
                        ${t.prepare && t.prepare.length ? `<div class="tip-block"><h4>行前准备</h4><ul>${t.prepare.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
                        ${t.avoid && t.avoid.length ? `<div class="tip-block"><h4>避坑指南</h4><ul>${t.avoid.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
                        ${t.bestTime && t.bestTime.length ? `<div class="tip-block"><h4>最佳时间</h4><ul>${t.bestTime.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
                    </div>
                </section>
            `);
        }

        // 住宿
        if (g.accommodations && g.accommodations.length) {
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">03</span>住宿推荐</h2>
                    <div class="accommodation-grid">
                        ${g.accommodations.map(a => {
                            const acName = a.name || a.area || '住宿';
                            const searchQuery = g.city + ' ' + (a.area || acName);
                            return `
                            <div class="accommodation-card">
                                <div class="ac-name">${escapeHtml(acName)}</div>
                                ${a.area ? `<div class="ac-area">${escapeHtml(a.area)}</div>` : ''}
                                ${a.priceRange ? `<div class="ac-price">${typeof a.priceRange === 'string' ? escapeHtml(a.priceRange) : (a.priceRange.lowSeason ? escapeHtml(a.priceRange.lowSeason) + '~' + escapeHtml(a.priceRange.peakSeason) : '')}</div>` : ''}
                                ${a.features && a.features.length ? `<div class="ac-features">${a.features.map(f => `<span>${escapeHtml(f)}</span>`).join('')}</div>` : ''}
                                ${a.pros ? `<div class="ac-pros"><strong>优点：</strong>${escapeHtml(a.pros)}</div>` : ''}
                                ${a.cons ? `<div class="ac-cons"><strong>不足：</strong>${escapeHtml(a.cons)}</div>` : ''}
                                <div class="ac-links">
                                    ${extLinkHtml(amapSearchUrl(searchQuery), '地图查看')}
                                    ${extLinkHtml(`https://hotel.qunar.com/cn/list.php?cityName=${encodeURIComponent(g.city)}&fromDate=&toDate=&q=${encodeURIComponent(a.area || acName)}`, '比价订房')}
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </section>
            `);
        }

        // 交通
        if (g.transportation) {
            const tr = g.transportation;
            const sectionIdx = g.accommodations && g.accommodations.length ? '04' : '03';
            const tipsIdx = g.accommodations && g.accommodations.length ? '05' : '04';
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${sectionIdx}</span>交通指南</h2>
                    <div class="transport-card">
                        ${tr.arrival ? `<h4>如何到达</h4><p>${typeof tr.arrival === 'string' ? tr.arrival : (tr.arrival.byAir?.details || tr.arrival.byTrain?.details || '高铁/飞机可达')}</p>` : ''}
                        ${tr.localTransport ? `<h4>市内交通</h4><p>${typeof tr.localTransport === 'string' ? tr.localTransport : (tr.localTransport.metro || tr.localTransport.bus || '地铁、公交便利')}</p>` : ''}
                    </div>
                </section>
            `);
        }

        dom.guideContent.innerHTML = sections.join('') || '<div class="empty-guide">暂无攻略数据</div>';
    }

    // ---------- 海报 ----------
    function renderPoster() {
        const g = state.currentGuide;
        if (!g) return;
        const style = state.posterStyle;
        const tags = (g.tags || []).slice(0, 3).filter(t => t && typeof t === 'string');
        // 清洗 routes：过滤空值和占位文本
        const routes = (g.routes || []).slice(0, 4)
            .map(r => {
                const line = (typeof r === 'string') ? r : (r.routeLine || (typeof r.route === 'string' ? r.route : '') || r.theme || '');
                return line.trim();
            })
            .filter(line => line && !/^(精选行程|主要景点|行程安排|今日行程)$/i.test(line));
        // 清洗 foods：确保 name 是有效字符串
        const foods = (g.foods || []).slice(0, 3)
            .filter(f => f && f.name && typeof f.name === 'string' && !f.name.startsWith('{'))
            .map(f => ({ name: String(f.name).trim() }))
            .filter(f => f.name);
        const budget = g.budget?.total || g.overallBudget || '';
        const city = g.city || '';
        const subtitle = (g.subtitle || g.title || '').trim();

        // 防御：如果关键数据全空，显示提示而非空白
        if (!city && !routes.length && !foods.length) {
            dom.poster.className = `poster style-${style}`;
            dom.poster.innerHTML = `<div class="p-top"><div class="p-eyebrow">XING JI · TRAVEL POSTER</div><div class="p-city">攻略生成中</div></div>`;
            return;
        }

        dom.poster.className = `poster style-${style}`;
        dom.poster.innerHTML = `
            <div class="p-top">
                <div class="p-eyebrow">XING JI · TRAVEL POSTER</div>
                <div class="p-city">${escapeHtml(city)}</div>
                ${subtitle ? `<div class="p-sub">${escapeHtml(subtitle)}</div>` : ''}
            </div>
            <div class="p-mid">
                ${routes.length ? `
                <div class="p-section-label">行程路线</div>
                <ul class="p-routes">
                    ${routes.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>` : ''}
                ${foods.length ? `
                <div class="p-section-label" style="margin-top:14px;">必尝美食</div>
                <div class="p-foods">
                    ${foods.map(f => `<span class="p-food">${escapeHtml(f.name)}</span>`).join('')}
                </div>` : ''}
                ${budget ? `
                <div class="p-section-label" style="margin-top:14px;">预估预算</div>
                <div class="p-budget">${escapeHtml(budget)}</div>` : ''}
            </div>
            <div class="p-bot">
                ${tags.length ? `<div class="p-tags">${tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
                <div class="p-days">${escapeHtml(g.duration || '3天')}</div>
            </div>
        `;
    }

    // ---------- 视图切换 ----------
    function showResult() {
        dom.homePage.hidden = true;
        dom.resultPage.hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function showHome() {
        dom.resultPage.hidden = true;
        dom.homePage.hidden = false;
        // 清除 URL 中的攻略参数，避免刷新后再次自动打开
        try {
            if (location.search) history.replaceState(null, '', location.pathname + location.hash);
        } catch (e) { /* 忽略 */ }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ---------- 加载 ----------
    let loadingTimer;
    function showLoading(city) {
        dom.loadingCity.textContent = city;
        dom.loadingSub.textContent = 'AI 正在分析景点、美食与预算…';
        dom.loadingBar.style.width = '0%';
        dom.loading.hidden = false;
        let p = 0;
        loadingTimer = setInterval(() => {
            p = Math.min(p + Math.random() * 14, 92);
            dom.loadingBar.style.width = p + '%';
            if (p > 30) dom.loadingSub.textContent = '正在匹配你的旅行偏好…';
            if (p > 65) dom.loadingSub.textContent = '排版生成专属海报…';
        }, 420);
    }
    function hideLoading() {
        clearInterval(loadingTimer);
        dom.loadingBar.style.width = '100%';
        setTimeout(() => { dom.loading.hidden = true; }, 320);
    }

    // ---------- 收藏 ----------
    function loadFavorites() {
        try { return JSON.parse(localStorage.getItem('xj_favorites') || '[]'); } catch { return []; }
    }
    function saveFavorites() { localStorage.setItem('xj_favorites', JSON.stringify(state.favorites)); }
    function updateFavCount() { dom.navFavCount.textContent = state.favorites.length; }

    function toggleFavorite() {
        if (!state.currentGuide) return;
        const g = state.currentGuide;
        const idx = state.favorites.findIndex(f => f.city === g.city);
        if (idx >= 0) {
            state.favorites.splice(idx, 1);
            toast('已取消收藏');
        } else {
            state.favorites.unshift({ city: g.city, title: g.title, subtitle: g.subtitle, time: Date.now() });
            toast('已加入收藏', 'success');
        }
        saveFavorites();
        updateFavCount();
        updateFavoriteBtn();
    }
    function updateFavoriteBtn() {
        const fav = state.favorites.some(f => f.city === state.currentCity);
        dom.favoriteBtn.classList.toggle('active', fav);
        dom.favoriteBtn.textContent = fav ? '已收藏' : '收藏';
    }

    function openFavorites() {
        renderFavoritesList();
        dom.favoritesModal.hidden = false;
    }
    function closeFavorites() { dom.favoritesModal.hidden = true; }
    function renderFavoritesList() {
        if (!state.favorites.length) {
            dom.favoritesList.innerHTML = '';
            dom.emptyFavorites.hidden = false;
            return;
        }
        dom.emptyFavorites.hidden = true;
        dom.favoritesList.innerHTML = state.favorites.map(f => `
            <div class="fav-item">
                <div>
                    <div class="fi-name">${f.city}</div>
                    <div class="fi-title">${f.title || ''}</div>
                </div>
                <div class="fi-actions">
                    <button class="fi-btn view" data-city="${f.city}">查看</button>
                    <button class="fi-btn del" data-city="${f.city}">删除</button>
                </div>
            </div>
        `).join('');
        dom.favoritesList.querySelectorAll('.fi-btn.view').forEach(b => {
            b.onclick = () => { closeFavorites(); dom.cityInput.value = b.dataset.city; submitCity(b.dataset.city); };
        });
        dom.favoritesList.querySelectorAll('.fi-btn.del').forEach(b => {
            b.onclick = () => {
                state.favorites = state.favorites.filter(f => f.city !== b.dataset.city);
                saveFavorites(); updateFavCount(); renderFavoritesList(); updateFavoriteBtn();
                toast('已删除');
            };
        });
    }
    function clearFavorites() {
        if (!state.favorites.length) return;
        if (!confirm('确定清空所有收藏？')) return;
        state.favorites = [];
        saveFavorites(); updateFavCount(); renderFavoritesList(); updateFavoriteBtn();
        toast('已清空收藏');
    }
    function exportFavorites() {
        if (!state.favorites.length) { toast('暂无收藏可导出', 'error'); return; }
        const text = state.favorites.map((f, i) => `${i + 1}. ${f.city} — ${f.title || ''}`).join('\n');
        downloadFile('我的收藏.txt', text);
        toast('已导出收藏列表', 'success');
    }

    // ---------- 历史 ----------
    function loadHistory() {
        try { return JSON.parse(localStorage.getItem('xj_history') || '[]'); } catch { return []; }
    }
    function addHistory(city) {
        state.history = state.history.filter(h => h.city !== city);
        state.history.unshift({ city, time: Date.now() });
        state.history = state.history.slice(0, 12);
        localStorage.setItem('xj_history', JSON.stringify(state.history));
        renderHistory();
    }

    // ---------- 复制 / 下载 ----------
    function copyGuideText() {
        const g = state.currentGuide;
        if (!g) return;
        let text = `《${g.title}》\n${g.subtitle || ''}\n${'─'.repeat(30)}\n`;
        text += `城市：${g.city}\n季节：${g.season || '四季皆宜'}\n行程：${g.duration || '3天'}\n预算：${g.overallBudget || (g.budget && g.budget.total) || '待估'}\n`;
        if (g.routes) {
            text += `\n【行程】\n`;
            g.routes.forEach(r => { text += `Day ${r.day} ${r.theme || ''}：${r.routeLine || ''}\n`; });
        }
        if (g.foods) {
            text += `\n【美食】\n`;
            g.foods.forEach(f => { text += `· ${f.name} ${f.price || ''} ${f.mustTry ? '(必吃)' : ''}\n`; });
        }
        navigator.clipboard.writeText(text).then(
            () => toast('攻略已复制到剪贴板', 'success'),
            () => toast('复制失败，请手动选择', 'error')
        );
    }

    function downloadPoster() {
        if (typeof html2canvas === 'undefined') { toast('海报组件未加载，请刷新重试', 'error'); return; }
        const node = dom.poster;
        toast('正在生成海报…');
        html2canvas(node, { scale: 2, backgroundColor: null, useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${state.currentCity || '旅行'}-海报.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast('海报已下载', 'success');
        }).catch(() => toast('海报生成失败', 'error'));
    }

    function downloadFile(name, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.download = name;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // ---------- Toast ----------
    function toast(msg, type) {
        const t = document.createElement('div');
        t.className = 'toast' + (type ? ' ' + type : '');
        t.textContent = msg;
        dom.toastWrap.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 300); }, 2400);
    }

    // ---------- 工具 ----------
    function timeAgo(ts) {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return '刚刚';
        if (s < 3600) return Math.floor(s / 60) + '分钟前';
        if (s < 86400) return Math.floor(s / 3600) + '小时前';
        return Math.floor(s / 86400) + '天前';
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
