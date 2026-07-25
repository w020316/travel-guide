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
        origin: '',           // 出发地（v9.0 新增）
        destination: '',      // 目的地（v9.0 新增，优先作为攻略城市）
        travelers: '2',       // 人数（v9.0 新增）
        travelDate: '',       // 出行日期（v10.1 新增，YYYY-MM-DD）
        currentGuide: null,
        currentCity: null,
        posterStyle: 'fresh',
        favorites: loadFavorites(),
        history: loadHistory()
    };

    // v10.1: 省份/直辖市识别（用户输入省份名时给出友好提示）
    const PROVINCES = ['北京','上海','天津','重庆','广东','浙江','江苏','四川','湖北','湖南','陕西','山东','河南','辽宁','吉林','黑龙江','云南','贵州','广西','海南','甘肃','青海','宁夏','新疆','西藏','安徽','福建','江西','河北','山西','内蒙古','香港','澳门','台湾'];
    // 各省热门城市（用于省份输入时推荐）
    const PROVINCE_HOT_CITIES = {
        '黑龙江':['哈尔滨','齐齐哈尔','牡丹江','大庆','漠河','雪乡'],
        '吉林':['长春','吉林','延吉','长白山','集安'],
        '辽宁':['沈阳','大连','鞍山','丹东','旅顺'],
        '广东':['广州','深圳','珠海','汕头','佛山','湛江'],
        '浙江':['杭州','宁波','温州','绍兴','嘉兴','舟山'],
        '江苏':['南京','苏州','无锡','常州','扬州','连云港'],
        '四川':['成都','绵阳','乐山','宜宾','西昌','峨眉山'],
        '湖北':['武汉','宜昌','襄阳','荆州','恩施','神农架'],
        '湖南':['长沙','张家界','株洲','岳阳','凤凰','韶山'],
        '陕西':['西安','宝鸡','咸阳','延安','汉中','华山'],
        '山东':['济南','青岛','烟台','威海','潍坊','泰山','曲阜'],
        '河南':['郑州','洛阳','开封','南阳','安阳','少林寺'],
        '云南':['昆明','大理','丽江','西双版纳','香格里拉','腾冲'],
        '贵州':['贵阳','遵义','安顺','毕节','荔波','梵净山'],
        '广西':['南宁','桂林','柳州','北海','阳朔','黄姚'],
        '海南':['海口','三亚','三沙','儋州','文昌','博鳌'],
        '甘肃':['兰州','天水','酒泉','张掖','敦煌','嘉峪关'],
        '青海':['西宁','海东','海北','玉树','青海湖','茶卡'],
        '新疆':['乌鲁木齐','喀什','伊犁','阿勒泰','吐鲁番','禾木'],
        '西藏':['拉萨','日喀则','昌都','林芝','纳木错','珠峰'],
        '安徽':['合肥','芜湖','蚌埠','黄山','安庆','九华山','宏村'],
        '福建':['福州','厦门','泉州','漳州','武夷山','鼓浪屿'],
        '江西':['南昌','景德镇','九江','赣州','庐山','婺源'],
        '河北':['石家庄','唐山','秦皇岛','邯郸','保定','承德','北戴河'],
        '山西':['太原','大同','运城','临汾','平遥','五台山','云冈'],
        '内蒙古':['呼和浩特','包头','赤峰','鄂尔多斯','呼伦贝尔','满洲里','阿尔山']
    };

    // v10.1: 检测用户输入是否为省份名（支持"省/市/区/自治区/特别行政区"等后缀）
    function detectProvince(input) {
        if (!input) return null;
        const raw = input.trim();
        if (PROVINCES.includes(raw)) return raw;
        // 移除常见后缀：省/市/区/自治区/壮族自治区/回族自治区/维吾尔自治区/特别行政区
        const cleaned = raw
            .replace(/特别行政区$/, '')
            .replace(/维吾尔自治区$/, '')
            .replace(/壮族自治区$/, '')
            .replace(/回族自治区$/, '')
            .replace(/自治区$/, '')
            .replace(/[省市]$/, '')
            .trim();
        if (PROVINCES.includes(cleaned)) return cleaned;
        return null;
    }

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

    // 智能预算计算（基于城市等级+天数+偏好+人数）
    function calcBudget(city, days, budgetRange, travelers) {
        const tier = getCityTier(city);
        const tierMul = tier === 1 ? 1.3 : tier === 2 ? 1.0 : 0.8;
        const budgetMul = budgetRange === 'low' ? 0.7 : budgetRange === 'high' ? 1.6 : 1.0;
        // v9.0: 人数影响（多人可分摊住宿，人均略降）
        const travelerCount = parseInt(travelers, 10) || 2;
        const travelerMul = travelerCount >= 4 ? 0.85 : travelerCount >= 2 ? 0.92 : 1.0;
        const base = { transport: 300, hotel: 280, food: 150, ticket: 120 };
        const breakdown = {
            '交通': `${Math.round(base.transport * tierMul * budgetMul * travelerMul)}元`,
            '住宿': `${Math.round(base.hotel * tierMul * budgetMul * travelerMul * days)}元`,
            '餐饮': `${Math.round(base.food * tierMul * budgetMul * travelerMul * days)}元`,
            '门票': `${Math.round(base.ticket * budgetMul * travelerMul)}元`
        };
        const total = Math.round((base.transport + (base.hotel + base.food) * days + base.ticket) * tierMul * budgetMul * travelerMul);
        const personTotal = Math.round(total / Math.max(travelerCount, 1));
        return {
            total: `${total}元（人均 ${personTotal}元）`,
            personTotal: `${personTotal}元`,
            breakdown,
            moneySavingTips: ['提前预订酒店享早鸟价', '关注景区免票日/学生证半价', '避开节假日高峰节省 30% 开销', travelerCount >= 2 ? '多人同行住宿可分摊，人均更划算' : '单人出行建议青旅或民宿']
        };
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

    // 智能交通信息（基于城市等级+出发地）
    function genTransportation(city, province, origin) {
        const tier = getCityTier(city);
        const hasMetro = tier <= 2;
        const hasAirport = tier <= 2;
        // v9.0: 如有出发地，生成具体的出发地→目的地交通建议
        let arrivalInfo;
        if (origin) {
            const originTier = getCityTier(origin);
            const originProvince = PROVINCE_MAP[origin] || '';
            // 判断出发地与目的地距离
            if (origin === city) {
                arrivalInfo = `您已在${city}本地，建议步行或骑行开始游览`;
            } else if (originProvince === province) {
                arrivalInfo = `从${origin}到${city}同省，可乘高铁（约1-2小时）或自驾走省内高速`;
            } else if (hasAirport && originTier <= 2) {
                arrivalInfo = `从${origin}到${city}：飞机约2-3小时直达，或高铁约4-8小时，自驾走高速约8-12小时`;
            } else if (hasAirport) {
                arrivalInfo = `从${origin}到${city}：可乘飞机中转，或高铁至${province}内枢纽站转车`;
            } else {
                arrivalInfo = `从${origin}到${city}：建议高铁+大巴组合，或自驾走国道/省道`;
            }
        } else {
            arrivalInfo = hasAirport ? `${city}有机场，可乘飞机直达；高铁站连接全国铁路网，自驾可通过高速直达` : `可乘高铁至${province}内最近的枢纽站转车，或自驾走国道/省道到达`;
        }
        return {
            arrival: arrivalInfo,
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

    // v9.0 智能天气生成（基于城市+季节+省份）
    function genWeather(city, season) {
        const province = PROVINCE_MAP[city] || '';
        const month = new Date().getMonth() + 1;
        // 基础天气模板
        const weatherBySeason = {
            '春季最佳': { temp: '15-22℃', desc: '春暖花开，气候宜人，偶有春雨', advice: '建议穿薄外套，备雨具' },
            '夏季最佳': { temp: '25-32℃', desc: '夏季炎热，注意防晒防暑', advice: '穿透气衣物，避开正午暴晒' },
            '秋季最佳': { temp: '15-25℃', desc: '秋高气爽，温差适中，最佳出行季', advice: '穿长袖薄外套，适合户外活动' },
            '冬季最佳': { temp: '-5-8℃', desc: '冬季寒冷，需注意保暖', advice: '穿羽绒服，备保暖内衣' },
            '春秋最佳': { temp: '15-25℃', desc: '春秋两季气候舒适，适合出行', advice: '穿薄外套，温差较大注意增减' },
            '夏秋最佳': { temp: '20-30℃', desc: '夏秋季节气候温暖，偶有降雨', advice: '备雨具，穿透气衣物' },
            '春夏最佳': { temp: '18-28℃', desc: '春夏季节气候温和，植物茂盛', advice: '穿薄外套，防晒' },
            '秋冬最佳': { temp: '5-18℃', desc: '秋冬季节气候凉爽，景色优美', advice: '穿保暖外套' },
            '全年适宜': { temp: '15-25℃', desc: '全年气候温和，四季皆可游览', advice: '根据实时天气穿搭' },
            '夏冬两季': { temp: '变化大', desc: '夏热冬冷，温差较大', advice: '根据季节准备衣物' }
        };
        let weather = weatherBySeason[season] || weatherBySeason['全年适宜'];

        // 特殊地区调整
        // 高原地区
        if (['西藏','青海'].includes(province) || /拉萨|林芝|日喀则|西宁|香格里拉/.test(city)) {
            weather = { temp: '8-18℃', desc: '高原气候，昼夜温差大，紫外线强', advice: '穿冲锋衣，防晒霜 SPF50+，预防高反' };
        }
        // 海滨城市
        if (['海南','福建','广东','山东'].includes(province) && /海|岛|湾|港|三亚|厦门|青岛|威海|大连|北海/.test(city)) {
            if (month >= 6 && month <= 9) {
                weather = { temp: '26-32℃', desc: '海滨夏季炎热潮湿，偶有台风', advice: '防晒，关注台风预警' };
            }
        }
        // 东北冬季
        if (['黑龙江','吉林','辽宁','内蒙古','新疆'].includes(province)) {
            if (month >= 11 || month <= 3) {
                weather = { temp: '-20~-5℃', desc: '东北冬季严寒，雪景壮丽', advice: '穿羽绒服+保暖内衣+暖宝宝' };
            }
        }
        // 当前月份提示
        const monthWeather = getCurrentMonthWeather(month, province);
        return {
            ...weather,
            currentMonth: `${month}月`,
            currentMonthWeather: monthWeather,
            province: province || '中国'
        };
    }

    // 根据当前月份生成天气提示
    function getCurrentMonthWeather(month, province) {
        const monthWeatherMap = {
            1: '冬季，北方寒冷，南方湿冷',
            2: '初春，北方仍冷，南方回暖',
            3: '春季，气温回升，北方风大',
            4: '春暖花开，全国普遍舒适',
            5: '暮春初夏，南方开始入夏',
            6: '初夏，南方梅雨，北方干热',
            7: '盛夏，全国高温，南方湿热',
            8: '盛夏，高温持续，台风活跃',
            9: '初秋，北方转凉，南方仍热',
            10: '秋高气爽，全国舒适',
            11: '深秋初冬，北方入冬',
            12: '冬季，全国寒冷，北方降雪'
        };
        return monthWeatherMap[month] || '气候温和';
    }

    // ---------- 本地攻略生成（基于 527 城数据库 + 智能数据增强）----------
    function buildLocalGuide(city, prefs) {
        const base = CITIES[city];
        const days = prefs.days || 3;
        const province = PROVINCE_MAP[city] || '';
        const tags = base?.tags || [];
        const season = base?.season || '四季皆宜';
        const origin = prefs.origin || '';       // v9.0 出发地
        const travelers = prefs.travelers || '2'; // v9.0 人数

        // 公共增强数据
        const accommodations = genAccommodations(city, tags, province);
        const transportation = genTransportation(city, province, origin); // v9.0 传入出发地
        const tips = genTips(city, season, province);
        const budget = calcBudget(city, days, prefs.budgetRange, travelers); // v9.0 传入人数
        const weather = genWeather(city, season); // v9.0 天气

        if (!base) {
            // v10.2: 城市不在数据库中 — 标记为"通用模板"，提示用户数据非精确
            return {
                city, title: `${city}·发现之旅`, subtitle: `探索${province || ''}${city}的独特魅力`,
                season, duration: `${days}天`, overallBudget: budget.total,
                difficulty: '适中', source: 'local-mock',
                isUnknownCity: true, // v10.2: 标记未知城市
                routes: buildMockRoutes(city, days),
                foods: [{ name: `${city}特色菜`, description: `${province || '当地'}招牌美食，体现地方风味`, price: '38-68元', mustTry: true, whereToEat: [{ name: '当地老字号', address: '市中心' }] }],
                accommodations, tips, budget, transportation, weather,
                tags: ['本地数据'],
                origin, destination: city, travelers // v9.0
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
            accommodations, tips, budget, transportation, weather,
            tags: base.tags || [],
            origin, destination: city, travelers // v9.0
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
        originInput: $('originInput'), destinationInput: $('destinationInput'), travelers: $('travelers'),
        travelDateInput: $('travelDateInput'),
        quickCities: $('quickCities'), rankingList: $('rankingList'),
        historySection: $('historySection'), historyList: $('recentHistoryList'), clearHistoryBtn: $('clearHistoryBtn'),
        loading: $('loading'), loadingCity: $('loadingCity'), loadingSub: $('loadingSub'), loadingBar: $('loadingBar'),
        resultPage: $('resultPage'), homePage: $('homePage'),
        resultTitle: $('resultTitle'), guideContent: $('guideContent'), poster: $('poster'),
        backBtn: $('backBtn'), favoriteBtn: $('favoriteBtn'), copyTextBtn: $('copyTextBtn'), downloadPosterBtn: $('downloadPosterBtn'),
        shareLinkBtn: $('shareLinkBtn'), weatherBtn: $('weatherBtn'), regenerateBtn: $('regenerateBtn'),
        posterStyles: $('posterStyles'),
        navFavCount: $('navFavCount'), navFavoritesBtn: $('navFavoritesBtn'),
        favoritesModal: $('favoritesModal'), closeFavoritesModal: $('closeFavoritesModal'),
        favoritesList: $('favoritesList'), emptyFavorites: $('emptyFavorites'),
        favSearchWrap: $('favSearchWrap'), favSearchInput: $('favSearchInput'), emptyFavSearch: $('emptyFavSearch'),
        clearAllFavorites: $('clearAllFavorites'), exportFavorites: $('exportFavorites'),
        brandHome: $('brandHome'), toastWrap: $('toastWrap'),
        backToTop: $('backToTop'),
        // P1-5: 移动端汉堡菜单
        navMenuBtn: $('navMenuBtn'), navMenu: $('navMenu'),
        navMenuFavBtn: $('navMenuFavBtn'), navMenuFavCount: $('navMenuFavCount')
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
            // v9.0: 恢复出发地/人数
            if (urlState.origin) {
                state.origin = urlState.origin;
                if (dom.originInput) dom.originInput.value = urlState.origin;
            }
            if (urlState.travelers) {
                state.travelers = urlState.travelers;
                if (dom.travelers) dom.travelers.value = urlState.travelers;
            }
            // v10.4: 恢复出行日期
            if (urlState.travelDate && dom.travelDateInput) {
                state.travelDate = urlState.travelDate;
                dom.travelDateInput.value = urlState.travelDate;
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
            // v9.0: 同步出发地/人数
            if (prefs.origin) params.set('origin', prefs.origin);
            if (prefs.travelers) params.set('travelers', prefs.travelers);
            // v10.4: 同步出行日期
            if (prefs.travelDate) params.set('date', prefs.travelDate);
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
                budgetRange: params.get('budget') || null,
                origin: params.get('origin') ? decodeURIComponent(params.get('origin')) : null,     // v9.0
                travelers: params.get('travelers') || null,                                         // v9.0
                travelDate: params.get('date') || null                                              // v10.4
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
        // v9.0: 同步出发地/人数
        if (state.origin) params.set('origin', state.origin);
        if (state.travelers) params.set('travelers', state.travelers);
        // v10.4: 同步出行日期
        if (state.travelDate) params.set('date', state.travelDate);
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
            <article class="rank-card" data-rank="${String(i + 1).padStart(2, '0')}" data-city="${escapeHtml(c.name)}">
                <div class="rc-body">
                    <div class="rc-name">${escapeHtml(c.name)}</div>
                    <div class="rc-title">${escapeHtml(c.title || '')}</div>
                    <div class="rc-tags">${(c.tags || []).slice(0, 3).map(t => `<span class="rc-tag">${escapeHtml(t)}</span>`).join('')}</div>
                    <div class="rc-meta">
                        <span>季节 <strong>${escapeHtml(c.season || '四季皆宜')}</strong></span>
                        <span>建议 <strong>${escapeHtml((c.days || '3').replace(/天+$/, ''))}天</strong></span>
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
    // 修复 P1：移除 Math.random() 抖动，避免排行榜每次刷新顺序变化
    // 改用基于日期的稳定种子，保证当日一致、隔日有轻微变化
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
        // 基于城市名 hash + 当日日期的稳定种子，避免随机抖动
        const nameHash = (c.name || '').split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
        const daySeed = new Date().getDate();
        return s + (Math.abs(nameHash ^ daySeed) % 4);
    }

    // ---------- 历史 ----------
    function renderHistory() {
        if (!state.history.length) { dom.historySection.hidden = true; return; }
        dom.historySection.hidden = false;
        dom.historyList.innerHTML = state.history.slice(0, 8).map(h => `
            <div class="history-chip" data-city="${escapeHtml(h.city)}" data-time="${h.time}">
                <span class="hc-name">${escapeHtml(h.city)}</span>
                <span class="hc-time">${timeAgo(h.time)}</span>
                <button class="hc-share" data-city="${escapeHtml(h.city)}" title="复制该攻略链接" aria-label="复制 ${escapeHtml(h.city)} 攻略链接">
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 2v8M5 5l3-3 3 3M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="hc-del" data-city="${escapeHtml(h.city)}" title="删除此条记录" aria-label="删除 ${escapeHtml(h.city)} 历史">
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4l1 9a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1l1-9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        `).join('');
        // 点击主体（非按钮）重新打开攻略
        dom.historyList.querySelectorAll('.history-chip').forEach(chip => {
            chip.onclick = (e) => {
                if (e.target.closest('.hc-share, .hc-del')) return;
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
        // v10.5: 单条删除按钮（P2-8: 改为撤销 toast 模式——立即删除，5 秒内可撤销）
        dom.historyList.querySelectorAll('.hc-del').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const city = btn.dataset.city;
                // 暂存被删除记录（含原 time，以便恢复后 timeAgo 不重置）
                const removed = state.history.find(h => h.city === city) || null;
                removeHistory(city);
                toast(`已删除「${city}」历史记录`, '', {
                    action: '撤销',
                    duration: 5000,
                    onAction: () => {
                        if (!removed) return;
                        // 恢复到列表顶部，保留原 time
                        state.history = state.history.filter(h => h.city !== city);
                        state.history.unshift(removed);
                        state.history = state.history.slice(0, 12);
                        localStorage.setItem('xj_history', JSON.stringify(state.history));
                        renderHistory();
                        toast('已恢复');
                    }
                });
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

        // v9.0 新增：出发地/目的地/人数
        dom.originInput.addEventListener('input', () => state.origin = dom.originInput.value.trim());
        dom.destinationInput.addEventListener('input', () => state.destination = dom.destinationInput.value.trim());
        dom.travelers.onchange = () => state.travelers = dom.travelers.value;
        // v10.1: 出行日期
        if (dom.travelDateInput) {
            // 默认设置为今天
            dom.travelDateInput.value = formatDate();
            state.travelDate = formatDate();
            dom.travelDateInput.addEventListener('change', () => {
                state.travelDate = dom.travelDateInput.value;
            });
        }
        // 目的地输入时同步到城市输入框（攻略以目的地为准）
        dom.destinationInput.addEventListener('change', () => {
            if (dom.destinationInput.value.trim()) {
                dom.cityInput.value = dom.destinationInput.value.trim();
            }
        });

        // 搜索建议
        let suggestTimer;
        dom.cityInput.addEventListener('input', () => {
            clearTimeout(suggestTimer);
            // 修复 P1：用户在主搜索框输入新城市时清空目的地状态，
            // 否则 state.destination 会持续覆盖 cityInput、快捷城市、排行榜、历史记录的提交
            state.destination = '';
            if (dom.destinationInput) dom.destinationInput.value = '';
            const q = dom.cityInput.value.trim();
            if (!q) { dom.suggestions.hidden = true; return; }
            suggestTimer = setTimeout(() => showSuggestions(q), 160);
        });
        dom.cityInput.addEventListener('blur', () => setTimeout(() => dom.suggestions.hidden = true, 200));
        dom.cityInput.addEventListener('focus', () => {
            if (dom.suggestions.innerHTML) dom.suggestions.hidden = false;
        });
        // v10.6: 键盘导航 — 上下键选择建议，回车确认，Esc 关闭
        dom.cityInput.addEventListener('keydown', (e) => {
            const items = dom.suggestions.querySelectorAll('.suggestion-item');
            // 建议面板隐藏或无项时，仅处理 Esc
            if (dom.suggestions.hidden || !items.length) {
                if (e.key === 'Escape') dom.suggestions.hidden = true;
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const cur = dom.suggestions.querySelector('.suggestion-item.active');
                let idx = cur ? Array.from(items).indexOf(cur) : -1;
                idx = (idx + 1) % items.length;
                items.forEach(x => x.classList.remove('active'));
                items[idx].classList.add('active');
                items[idx].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const cur = dom.suggestions.querySelector('.suggestion-item.active');
                let idx = cur ? Array.from(items).indexOf(cur) : 0;
                idx = (idx - 1 + items.length) % items.length;
                items.forEach(x => x.classList.remove('active'));
                items[idx].classList.add('active');
                items[idx].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                const cur = dom.suggestions.querySelector('.suggestion-item.active');
                if (cur) {
                    e.preventDefault();
                    const city = cur.dataset.city;
                    dom.cityInput.value = city;
                    dom.suggestions.hidden = true;
                    submitCity(city);
                }
            } else if (e.key === 'Escape') {
                dom.suggestions.hidden = true;
            }
        });

        // 结果页
        dom.backBtn.onclick = showHome;
        dom.favoriteBtn.onclick = toggleFavorite;
        dom.copyTextBtn.onclick = copyGuideText;
        dom.downloadPosterBtn.onclick = downloadPoster;
        dom.shareLinkBtn.onclick = () => copyShareLink(state.currentCity);
        // v10.5: 查天气（链接到中国天气网官方搜索页）
        if (dom.weatherBtn) {
            dom.weatherBtn.onclick = () => {
                const city = state.currentGuide?.city || state.currentCity;
                if (!city) { toast('请先生成攻略'); return; }
                // 修复 P1：HTTP 混合内容，HTTPS 部署下会被拦截，改为 HTTPS
                const url = `https://www.weather.com.cn/search101/?cityname=${encodeURIComponent(city)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                toast(`已打开「${city}」天气查询`);
            };
        }
        // v10.5: 再次生成（保留城市，返回首页调整参数）
        if (dom.regenerateBtn) {
            dom.regenerateBtn.onclick = () => {
                const city = state.currentGuide?.city || state.currentCity;
                if (!city) { toast('请先生成攻略'); return; }
                dom.cityInput.value = city;
                showHome();
                // 滚动到搜索区
                setTimeout(() => {
                    dom.cityInput.focus();
                    dom.cityInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                toast(`已填入「${city}」，调整参数后重新生成`);
            };
        }

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
        // v10.6: 收藏列表搜索过滤
        if (dom.favSearchInput) {
            dom.favSearchInput.addEventListener('input', () => {
                renderFavoritesList(dom.favSearchInput.value);
            });
        }
        // P1-5: 移动端汉堡菜单——点击展开/收起、点击外部关闭、ESC 关闭、菜单项点击后关闭
        if (dom.navMenuBtn && dom.navMenu) {
            const openNavMenu = () => {
                dom.navMenu.hidden = false;
                dom.navMenuBtn.setAttribute('aria-expanded', 'true');
                dom.navMenuBtn.setAttribute('aria-label', '关闭导航菜单');
            };
            const closeNavMenu = () => {
                dom.navMenu.hidden = true;
                dom.navMenuBtn.setAttribute('aria-expanded', 'false');
                dom.navMenuBtn.setAttribute('aria-label', '打开导航菜单');
            };
            const toggleNavMenu = () => { dom.navMenu.hidden ? openNavMenu() : closeNavMenu(); };
            dom.navMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleNavMenu(); });
            // 点击菜单外部关闭
            document.addEventListener('click', (e) => {
                if (dom.navMenu.hidden) return;
                if (!dom.navMenu.contains(e.target) && !dom.navMenuBtn.contains(e.target)) closeNavMenu();
            });
            // ESC 关闭并把焦点还给触发按钮
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !dom.navMenu.hidden) { closeNavMenu(); dom.navMenuBtn.focus(); }
            });
            // 菜单项点击后自动收起，并把焦点还给汉堡按钮（便于键盘流连续操作）
            dom.navMenu.querySelectorAll('[data-nav-menu]').forEach(item => {
                item.addEventListener('click', () => {
                    closeNavMenu();
                    dom.navMenuBtn.focus();
                });
            });
            // 汉堡菜单内的「我的收藏」入口 → 打开收藏弹层
            if (dom.navMenuFavBtn) {
                dom.navMenuFavBtn.addEventListener('click', () => { openFavorites(); });
            }
            // 切回桌面端（>720px）时关闭菜单，避免遗留展开态
            window.addEventListener('resize', () => {
                if (window.innerWidth > 720 && !dom.navMenu.hidden) closeNavMenu();
            });
        }
        // v10.5: 清空历史
        if (dom.clearHistoryBtn) {
            dom.clearHistoryBtn.onclick = () => {
                if (state.history.length === 0) { toast('暂无历史记录'); return; }
                if (confirm(`确定清空全部 ${state.history.length} 条浏览历史？此操作不可撤销。`)) {
                    clearAllHistory();
                }
            };
        }

        dom.brandHome.onclick = (e) => { e.preventDefault(); showHome(); };

        // v10.6: 返回顶部按钮
        if (dom.backToTop) {
            let scrollTimer;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    dom.backToTop.hidden = window.scrollY < 600;
                }, 100);
            }, { passive: true });
            dom.backToTop.onclick = () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        }
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

        if (!matches.length) {
            // v10.2: 无结果时给出友好提示
            dom.suggestions.innerHTML = `
                <div class="suggestion-empty">
                    <div class="se-icon">?</div>
                    <div class="se-text">
                        <div class="se-title">未找到匹配「${escapeHtml(q)}」的城市</div>
                        <div class="se-hint">试试输入：北京、成都、厦门、丽江</div>
                    </div>
                </div>
            `;
            dom.suggestions.hidden = false;
            return;
        }
        dom.suggestions.innerHTML = matches.map(m => `
            <div class="suggestion-item" data-city="${escapeHtml(m.name)}">
                <div>
                    <div class="s-name">${escapeHtml(m.name)}</div>
                    <div class="s-title">${escapeHtml(m.d.title || '')}</div>
                </div>
                <div class="s-tags">${(m.d.tags || []).slice(0, 2).map(t => escapeHtml(t)).join(' · ')}</div>
            </div>
        `).join('');
        dom.suggestions.hidden = false;
        dom.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.onmousedown = () => { dom.cityInput.value = item.dataset.city; dom.suggestions.hidden = true; submitCity(item.dataset.city); };
        });
    }

    // ---------- 提交生成 ----------
    async function submitCity(city) {
        // v9.0: 优先使用目的地作为攻略城市
        const targetCity = state.destination || city;
        if (!targetCity) { toast('请输入城市名称', 'error'); return; }

        // v10.1: 省份识别 — 用户输入"黑龙江"等省份名时，提示选择具体城市
        const province = detectProvince(targetCity);
        if (province) {
            const hotCities = PROVINCE_HOT_CITIES[province] || [];
            const msg = hotCities.length
                ? `「${province}」是一个省份，请选择具体城市。推荐：${hotCities.slice(0,4).join('、')}`
                : `「${province}」是一个省份，请输入具体城市名`;
            toast(msg, 'error');
            // 自动填充推荐城市到搜索框，方便用户
            if (hotCities.length) {
                dom.cityInput.value = '';
                dom.destinationInput.value = '';
                showSuggestions(province);
                dom.cityInput.focus();
            }
            return;
        }

        // v10.1: 出行日期校验 — 如果选了过去的日期，提示用户
        if (state.travelDate) {
            const today = formatDate().replace(/-/g, '');
            const selected = state.travelDate.replace(/-/g, '');
            if (selected < today) {
                toast('出行日期是过去的时间，请重新选择', 'error');
                dom.travelDateInput && dom.travelDateInput.focus();
                return;
            }
        }

        showLoading(targetCity);
        const prefs = {
            days: state.selectedDays,
            travelType: state.travelType,
            budgetRange: state.budgetRange,
            origin: state.origin,           // v9.0 出发地
            travelers: state.travelers,     // v9.0 人数
            travelDate: state.travelDate    // v10.1 出行日期
        };
        try {
            let guide = normalizeGuideData(await API.generateGuide(targetCity, prefs));
            // 城市混淆检测：如果 AI 返回的内容明显属于其他城市，回退到本地智能数据
            if (guide && guide.cityMismatch) {
                console.warn(`⚠️ AI 城市混淆，回退本地数据：${targetCity}`);
                toast('AI 数据异常，已切换为本地智能数据', 'info');
                guide = normalizeGuideData(buildLocalGuide(targetCity, prefs));
            }
            // === 数据质量检测：如果 AI 数据质量过差（routes/foods 全空或全是占位），回退到本地智能数据 ===
            if (guide && !isGuideDataValid(guide, targetCity)) {
                console.warn(`⚠️ AI 数据质量不佳，回退本地数据：${targetCity}`);
                toast('AI 数据不完整，已切换为本地智能数据', 'info');
                guide = normalizeGuideData(buildLocalGuide(targetCity, prefs));
            }
            // v9.0: 注入出发地/目的地/人数到攻略数据中
            guide.origin = state.origin || '';
            guide.destination = targetCity;
            guide.travelers = state.travelers || '2';
            // v9.0: 生成天气信息
            if (!guide.weather) guide.weather = genWeather(targetCity, guide.season);

            state.currentGuide = guide;
            state.currentCity = targetCity;
            addHistory(targetCity);
            // 更新 URL，使当前攻略可通过链接分享
            updateShareUrl(targetCity, prefs);
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

    // v10.0: 票务比价链接生成器
    // 国内票务平台均需企业认证，无公开免费 API，采用搜索页链接方案让用户自行比价
    // 平台：12306（火车票/高铁）、携程（机票/火车票）、飞猪（机票）、去哪儿（机票/火车票）
    function ticketCompareLinks(origin, destination) {
        if (!destination) return [];
        const orig = origin || '';
        const links = [];
        // 12306 火车票/高铁（官方，无手续费）
        links.push({
            platform: '12306',
            type: '火车票/高铁',
            url: orig
                ? `https://www.12306.cn/index/otn/leftTicketDto?leftTicketDTO.train_date=${formatDate()}&leftTicketDTO.from_station=${encodeURIComponent(orig)}&leftTicketDTO.to_station=${encodeURIComponent(destination)}&purpose_codes=ADULT`
                : `https://www.12306.cn/index/`,
            badge: '官方',
            desc: '铁路官方渠道，无手续费'
        });
        // 携程火车票
        links.push({
            platform: '携程',
            type: '火车票',
            url: orig
                ? `https://trains.ctrip.com/webapp/train/list?ticketType=0&dStation=${encodeURIComponent(orig)}&aStation=${encodeURIComponent(destination)}&dDate=${formatDate()}`
                : `https://trains.ctrip.com/`,
            badge: '比价',
            desc: '可对比多个车次，支持抢票'
        });
        // 携程机票
        links.push({
            platform: '携程',
            type: '机票',
            url: orig
                ? `https://flights.ctrip.com/online/list/oneway-${encodeURIComponent(orig)}-${encodeURIComponent(destination)}?depdate=${formatDate()}`
                : `https://flights.ctrip.com/`,
            badge: '比价',
            desc: '多航司对比，含特价机票'
        });
        // 飞猪机票（阿里系）
        links.push({
            platform: '飞猪',
            type: '机票',
            url: orig
                ? `https://sjipiao.fliggy.com/flight-search/flight-search?depCity=${encodeURIComponent(orig)}&arrCity=${encodeURIComponent(destination)}&depDate=${formatDate()}`
                : `https://www.fliggy.com/`,
            badge: '比价',
            desc: '阿里旗下，含会员优惠'
        });
        // 去哪儿机票
        links.push({
            platform: '去哪儿',
            type: '机票',
            url: orig
                ? `https://flight.qunar.com/site/oneway_list.htm?fromCity=${encodeURIComponent(orig)}&toCity=${encodeURIComponent(destination)}&fromDate=${formatDate()}`
                : `https://flight.qunar.com/`,
            badge: '比价',
            desc: '低价机票搜索，覆盖全航司'
        });
        return links;
    }

    // v10.0: 酒店/民宿比价链接生成器
    // 平台：携程、去哪儿、美团、Airbnb、小猪短租
    function hotelCompareLinks(city) {
        if (!city) return [];
        const links = [];
        // 携程酒店
        links.push({
            platform: '携程',
            type: '酒店',
            url: `https://hotels.ctrip.com/hotels/list?cityName=${encodeURIComponent(city)}`,
            badge: '综合',
            desc: '覆盖最全，含用户点评'
        });
        // 去哪儿酒店
        links.push({
            platform: '去哪儿',
            type: '酒店',
            url: `https://hotel.qunar.com/cn/list.php?cityName=${encodeURIComponent(city)}`,
            badge: '比价',
            desc: '多平台比价，找最低价'
        });
        // 美团酒店
        links.push({
            platform: '美团',
            type: '酒店',
            url: `https://hotel.meituan.com/search/?cityName=${encodeURIComponent(city)}`,
            badge: '本地',
            desc: '本地生活，含钟点房/日租房'
        });
        // Airbnb 民宿
        links.push({
            platform: 'Airbnb',
            type: '民宿',
            url: `https://www.airbnb.cn/s/${encodeURIComponent(city)}/homes`,
            badge: '民宿',
            desc: '国际民宿，特色房源'
        });
        // 小猪短租
        links.push({
            platform: '小猪短租',
            type: '民宿',
            url: `https://www.xiaozhu.com/${encodeURIComponent(city)}-duanzufang/`,
            badge: '民宿',
            desc: '国内短租，整租/合租'
        });
        // 途家民宿
        links.push({
            platform: '途家',
            type: '民宿',
            url: `https://www.tujia.com/${encodeURIComponent(city)}`,
            badge: '民宿',
            desc: '公寓民宿，适合家庭出游'
        });
        return links;
    }

    // v10.0: 需要预约的热门景点数据库
    // 包含全国主要城市需要提前预约/购票的景点
    const RESERVATION_REQUIRED_SPOTS = {
        '北京': [
            { name: '故宫', url: 'https://gugong.228.com.cn/', advance: '提前7天', note: '每日限8万人，必须预约' },
            { name: '国家博物馆', url: 'https://www.chnmuseum.cn/zs/', advance: '提前7天', note: '免费但必须预约' },
            { name: '毛主席纪念堂', url: 'http://cpc.people.com.cn/GB/434423/index.html', advance: '提前1天', note: '免费，需预约' },
            { name: '八达岭长城', url: 'https://www.mutianyu.com.cn/', advance: '提前3天', note: '建议预约，可现场购票' },
            { name: '颐和园', url: 'https://www.summerpalace-china.com/', advance: '提前1天', note: '旺季建议预约' },
            { name: '天坛公园', url: 'https://www.tiantanpark.com/', advance: '提前1天', note: '旺季建议预约' }
        ],
        '上海': [
            { name: '上海迪士尼', url: 'https://www.shanghaidisneyresort.com/', advance: '提前60天', note: '必须预约，每日限流' },
            { name: '上海博物馆', url: 'https://www.shanghaimuseum.net/', advance: '提前7天', note: '免费但需预约' },
            { name: '上海科技馆', url: 'https://www.sstm.org.cn/', advance: '提前3天', note: '需购票预约' },
            { name: '东方明珠', url: 'https://www.orientalpearltower.com/', advance: '提前1天', note: '建议预约' }
        ],
        '西安': [
            { name: '兵马俑', url: 'https://www.bmy.com.cn/', advance: '提前7天', note: '必须预约购票' },
            { name: '陕西历史博物馆', url: 'https://www.sxhm.com/', advance: '提前14天', note: '免费但极难预约' },
            { name: '大唐不夜城', url: '', advance: '无需预约', note: '开放街区，免费游览' }
        ],
        '成都': [
            { name: '大熊猫繁育研究基地', url: 'https://www.panda.org.cn/', advance: '提前3天', note: '必须预约，每日限流' },
            { name: '三星堆博物馆', url: 'https://www.sxd.cn/', advance: '提前5天', note: '必须预约' },
            { name: '武侯祠', url: 'https://www.wuhouci.net.cn/', advance: '提前1天', note: '建议预约' }
        ],
        '杭州': [
            { name: '西湖', url: '', advance: '无需预约', note: '开放式景区，免费' },
            { name: '灵隐寺', url: 'https://www.lingyinsi.com/', advance: '提前1天', note: '需购票，建议预约' },
            { name: '浙江省博物馆', url: 'https://www.zhejiangmuseum.com/', advance: '提前3天', note: '免费但需预约' }
        ],
        '南京': [
            { name: '中山陵', url: 'https://www.zschina.org.cn/', advance: '提前7天', note: '免费但必须预约' },
            { name: '南京博物院', url: 'https://www.njmuseum.com/', advance: '提前7天', note: '免费但需预约' }
        ],
        '重庆': [
            { name: '洪崖洞', url: '', advance: '无需预约', note: '开放式景区，免费' },
            { name: '长江索道', url: '', advance: '提前1天', note: '建议预约，旺季排队久' }
        ],
        '苏州': [
            { name: '拙政园', url: 'https://www.szzzy.cn/', advance: '提前3天', note: '必须预约，每日限流' },
            { name: '苏州博物馆', url: 'https://www.szmuseum.com/', advance: '提前7天', note: '免费但需预约' }
        ],
        '厦门': [
            { name: '鼓浪屿', url: 'https://www.gly.cn/', advance: '提前15天', note: '需购船票，旺季紧张' }
        ],
        '广州': [
            { name: '广州塔', url: 'https://www.cantontower.com/', advance: '提前1天', note: '建议预约' },
            { name: '陈家祠', url: '', advance: '提前1天', note: '建议预约' }
        ],
        '深圳': [
            { name: '世界之窗', url: 'https://www.szc.com.cn/', advance: '提前1天', note: '建议预约' }
        ],
        '三亚': [
            { name: '蜈支洲岛', url: 'https://www.wzzhidao.com/', advance: '提前3天', note: '需购船票+门票' },
            { name: '南山文化旅游区', url: 'https://www.nanshan.com/', advance: '提前1天', note: '建议预约' }
        ],
        '丽江': [
            { name: '玉龙雪山', url: '', advance: '提前3天', note: '必须预约，含索道票' },
            { name: '丽江古城', url: '', advance: '无需预约', note: '开放式景区，需古城维护费' }
        ],
        '拉萨': [
            { name: '布达拉宫', url: 'https://www.potalapalace.cn/', advance: '提前1天', note: '必须预约，每日限流' },
            { name: '大昭寺', url: '', advance: '提前1天', note: '需购票' }
        ],
        '敦煌': [
            { name: '莫高窟', url: 'https://www.mgk.org.cn/', advance: '提前30天', note: '必须预约，A票极紧张' },
            { name: '鸣沙山月牙泉', url: '', advance: '提前1天', note: '建议预约' }
        ]
    };

    // 检测城市中需要预约的景点
    function getReservationSpots(city, routes) {
        const cityReservations = RESERVATION_REQUIRED_SPOTS[city] || [];
        if (!cityReservations.length) return [];
        // 从行程中提取所有景点名
        const allSpots = [];
        (routes || []).forEach(r => {
            const spots = r.spots || (typeof r === 'string' ? r.split('→').map(s => s.trim()) : []);
            spots.forEach(s => {
                const name = typeof s === 'string' ? s : (s?.name || '');
                if (name) allSpots.push(name);
            });
        });
        // v10.1: 精确匹配逻辑 — 景点名需完整包含预约景点名，且长度差异不能太大（避免"故宫"误匹配"故宫角楼"）
        // 改为：行程景点名包含预约景点名，或预约景点名包含行程景点名（但短词需≥2字）
        const matched = cityReservations.filter(r => {
            const targetName = r.name;
            return allSpots.some(s => {
                // 行程景点包含预约景点名（如"故宫博物院"包含"故宫"）
                if (s.includes(targetName) && targetName.length >= 2) return true;
                // 预约景点名包含行程景点（如"故宫"包含在"故宫博物院"中），但避免短词误匹配
                if (targetName.includes(s) && s.length >= 3) return true;
                return false;
            });
        });
        // 如果行程中没有明确提到，返回该城市所有需预约景点（提示用户）
        return matched.length ? matched : cityReservations;
    }

    // v10.0: 打卡机位推荐
    // 基于城市生成热门拍照机位
    const PHOTO_SPOTS = {
        '北京': [
            { name: '故宫角楼', desc: '经典紫禁城机位，清晨光线最佳', time: '日出后1小时', tip: '带长焦镜头，角楼倒影池边' },
            { name: '长城日出', desc: '金山岭/箭扣长城壮丽日出', time: '日出前30分钟', tip: '需提前一晚住山下民宿' },
            { name: '天坛祈年殿', desc: '对称构图，蓝顶白阶红墙', time: '上午9-10点', tip: '正门中轴线对称构图' },
            { name: '胡同光影', desc: '南锣鼓巷/什刹海胡同', time: '下午3-5点', tip: '捕捉老北京生活气息' }
        ],
        '上海': [
            { name: '外滩夜景', desc: '陆家嘴天际线，万国建筑群', time: '日落后蓝调时刻', tip: '外滩观景台，带广角' },
            { name: '武康路', desc: '法租界老洋房，文艺街区', time: '上午10-12点', tip: '武康大楼转角必拍' },
            { name: '田子坊', desc: '弄堂里的艺术气息', time: '下午2-4点', tip: '小巷光影，抓拍人文' },
            { name: '东方明珠塔', desc: '城市地标，夜景灯光', time: '日落后', tip: '塔下仰拍或外滩远眺' }
        ],
        '成都': [
            { name: '宽窄巷子', desc: '清朝古街道，川西民居', time: '上午9-11点', tip: '巷子深处避开人流' },
            { name: '太古里', desc: '现代与古刹并存', time: '傍晚5-7点', tip: '大慈寺与太古里交界' },
            { name: '熊猫基地', desc: '萌宠拍摄，竹林背景', time: '上午8-10点', tip: '熊猫活跃期，带长焦' },
            { name: '锦里夜景', desc: '红灯笼古街，三国文化', time: '日落后', tip: '雨夜红灯笼倒影' }
        ],
        '杭州': [
            { name: '西湖断桥', desc: '白娘子传说地，湖光山色', time: '日出或日落', tip: '雪后断桥残雪经典' },
            { name: '雷峰塔夕照', desc: '西湖十景之一', time: '日落前30分钟', tip: '长桥公园是最佳机位' },
            { name: '灵隐寺竹林', desc: '禅意古寺，幽静竹林', time: '上午8-10点', tip: '雨后竹林光影' },
            { name: '龙井茶园', desc: '梯田茶园，绿色治愈', time: '上午9-11点', tip: '采茶季4-5月最佳' }
        ],
        '西安': [
            { name: '大雁塔夜景', desc: '音乐喷泉+古塔', time: '日落后', tip: '北广场喷泉表演时' },
            { name: '城墙骑行', desc: '古城墙日落', time: '日落前1小时', tip: '南门骑行至含光门' },
            { name: '兵马俑', desc: '世界第八奇迹', time: '上午9-11点', tip: '一号坑前端俯拍' },
            { name: '大唐不夜城', desc: '盛唐风华夜游', time: '日落后', tip: '不倒翁小姐姐' }
        ],
        '重庆': [
            { name: '洪崖洞夜景', desc: '千与千寻同款', time: '日落后', tip: '千厮门大桥拍全景' },
            { name: '李子坝轻轨', desc: '轻轨穿楼奇观', time: '上午10-12点', tip: '对面观景平台' },
            { name: '长江索道', desc: '山城立体交通', time: '日落前', tip: '索道内拍江景' },
            { name: '解放碑', desc: '城市地标', time: '夜晚灯光', tip: '仰拍建筑群' }
        ],
        '厦门': [
            { name: '鼓浪屿', desc: '万国建筑，海岛风情', time: '上午8-11点', tip: '日光岩俯瞰全岛' },
            { name: '曾厝垵', desc: '文艺渔村', time: '下午3-5点', tip: '小巷店铺特色招牌' },
            { name: '环岛路', desc: '海岸线日落', time: '日落前30分钟', tip: '白城沙滩拍海景' }
        ],
        '丽江': [
            { name: '古城夜景', desc: '纳西古韵，红灯笼', time: '日落后', tip: '大水车附近' },
            { name: '玉龙雪山', desc: '雪山云海', time: '上午9-11点', tip: '蓝月谷前景' },
            { name: '束河古镇', desc: '比丽江更安静', time: '上午10-12点', tip: '青龙桥拍古镇' }
        ],
        '三亚': [
            { name: '亚龙湾日落', desc: '热带海滩晚霞', time: '日落前30分钟', tip: '沙滩椰树剪影' },
            { name: '蜈支洲岛', desc: '碧海蓝天', time: '上午9-11点', tip: '观日岩俯瞰' },
            { name: '天涯海角', desc: '经典地标', time: '上午8-10点', tip: '避开正午强光' }
        ],
        '拉萨': [
            { name: '布达拉宫', desc: '雪域圣殿', time: '日出或日落', tip: '药王山观景台' },
            { name: '大昭寺转经', desc: '虔诚信仰', time: '清晨或傍晚', tip: '八廓街跟拍人文' },
            { name: '纳木错', desc: '圣湖星空', time: '夜晚星空', tip: '带三脚架拍银河' }
        ],
        '敦煌': [
            { name: '鸣沙山月牙泉', desc: '沙漠绿洲奇观', time: '日落前1小时', tip: '沙丘顶俯瞰月牙泉' },
            { name: '莫高窟', desc: '千年壁画', time: '上午9-11点', tip: '窟内禁止拍照，外观可拍' },
            { name: '雅丹魔鬼城', desc: '风蚀地貌日落', time: '日落前', tip: '西海舰队机位' }
        ]
    };

    function getPhotoSpots(city) {
        return PHOTO_SPOTS[city] || [];
    }

    // 通用：格式化当前日期为 YYYY-MM-DD
    // v10.1: 支持传入 Date 对象或字符串，优先使用用户选择的出行日期
    function formatDate(d) {
        // v10.1: 如果没有传入日期，优先使用用户选择的出行日期
        if (!d && state.travelDate) return state.travelDate;
        d = d || new Date();
        // 如果是字符串，直接返回（已经是 YYYY-MM-DD 格式）
        if (typeof d === 'string') return d;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // v9.0: 按时间段拆分景点（上午/下午/晚上）
    // 将景点列表按 3 个时段分组，每个时段分配 1-2 个景点
    function splitSpotsByTime(spots) {
        if (!spots || !spots.length) return [{ time: '全天', period: '自由安排', spots: [] }];
        // 时段定义
        const slots = [
            { time: '09:00-12:00', period: '上午', spots: [] },
            { time: '14:00-17:00', period: '下午', spots: [] },
            { time: '18:00-21:00', period: '晚上', spots: [] }
        ];
        // 按顺序分配景点到时段
        spots.forEach((s, i) => {
            const slotIdx = Math.min(Math.floor(i / Math.max(Math.ceil(spots.length / 3), 1)), 2);
            slots[slotIdx].spots.push(s);
        });
        // 过滤掉没有景点的时段
        return slots.filter(s => s.spots.length > 0);
    }

    function renderGuide(g) {
        const sections = [];

        // v9.0: 出发地/目的地信息
        const originText = g.origin ? `${escapeHtml(g.origin)} → ${escapeHtml(g.destination || g.city)}` : `${escapeHtml(g.city)}`;
        const travelersText = g.travelers ? `${escapeHtml(g.travelers)} 人出行` : '2 人出行';

        // 头部（v9.0: 新增出发地→目的地、人数、天气）
        sections.push(`
            <div class="gc-head">
                <div class="gc-eyebrow">${g.source === 'local-db' || g.source === 'local-mock' ? '本地数据 · ' : ''}${g.duration || ''} · ${g.difficulty || '适中'}</div>
                <h1>${g.title || g.city}</h1>
                <p class="gc-sub">${g.subtitle || ''}</p>
                <div class="gc-stats">
                    <div class="gc-stat gc-stat-route">路线 <strong>${originText}</strong></div>
                    <div class="gc-stat">出行 <strong>${travelersText}</strong></div>
                    <div class="gc-stat">最佳季节 <strong>${g.season || '四季皆宜'}</strong></div>
                    <div class="gc-stat">行程 <strong>${g.duration || '3天'}</strong></div>
                    <div class="gc-stat">预算 <strong>${g.overallBudget || (g.budget && g.budget.total) || '待估'}</strong></div>
                </div>
            </div>
        `);

        // v10.2: 未知城市提示 — 城市不在数据库中时显示友好提醒
        if (g.isUnknownCity) {
            sections.push(`
                <div class="gc-notice gc-notice-warn">
                    <div class="gn-icon">!</div>
                    <div class="gn-content">
                        <div class="gn-title">「${escapeHtml(g.city)}」暂无精确数据</div>
                        <div class="gn-desc">当前展示的是通用旅行模板。如需精确景点/美食推荐，请尝试搜索热门城市（如北京、成都、厦门、丽江）或确认城市名拼写。</div>
                    </div>
                </div>
            `);
        }

        // v9.0: 天气情况区块（在行程之前展示）
        if (g.weather) {
            const w = g.weather;
            sections.push(`
                <section class="gc-section gc-weather">
                    <h2><span class="gc-idx">00</span>天气情况</h2>
                    <div class="weather-card">
                        <div class="weather-main">
                            <div class="weather-temp">${escapeHtml(w.temp || '')}</div>
                            <div class="weather-desc">${escapeHtml(w.desc || '')}</div>
                        </div>
                        <div class="weather-meta">
                            ${w.currentMonth ? `<div class="wm-item"><span class="wm-label">当前月份</span><strong>${escapeHtml(w.currentMonth)}</strong></div>` : ''}
                            ${w.currentMonthWeather ? `<div class="wm-item"><span class="wm-label">当月天气</span><strong>${escapeHtml(w.currentMonthWeather)}</strong></div>` : ''}
                            ${w.advice ? `<div class="wm-item"><span class="wm-label">穿衣建议</span><strong>${escapeHtml(w.advice)}</strong></div>` : ''}
                            ${w.province ? `<div class="wm-item"><span class="wm-label">所属省份</span><strong>${escapeHtml(w.province)}</strong></div>` : ''}
                        </div>
                    </div>
                </section>
            `);
        }

        // 行程（v9.0: 每日行程添加时间段 上午/下午/晚上）
        if (g.routes && g.routes.length) {
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">01</span>每日行程</h2>
                    ${g.routes.map(r => {
                        const spots = r.spots && Array.isArray(r.spots)
                            ? r.spots.map(s => typeof s === 'string' ? s : s.name).filter(Boolean)
                            : [];
                        const routeLine = r.routeLine || (typeof r.route === 'string' ? r.route : '') || '';
                        // v9.0: 按时间段拆分景点
                        const timeSlots = splitSpotsByTime(spots);
                        return `
                            <div class="route-day">
                                <div class="route-day-head">
                                    <span class="route-day-num">${String(r.day || 1).padStart(2, '0')}</span>
                                    <span class="route-day-theme">${r.theme || r.title || `Day ${r.day || 1}`}</span>
                                </div>
                                ${routeLine ? `<div class="route-day-route">${escapeHtml(routeLine)}</div>` : ''}
                                ${timeSlots.map(slot => `
                                    <div class="route-timeslot">
                                        <div class="ts-label">
                                            <span class="ts-time">${slot.time}</span>
                                            <span class="ts-period">${slot.period}</span>
                                        </div>
                                        <ul class="route-list">
                                            ${slot.spots.map(s => `
                                                <li>
                                                    <span class="rl-name">${escapeHtml(s)}</span>
                                                    <span class="rl-links">
                                                        ${extLinkHtml(amapSearchUrl(g.city + ' ' + s), '地图')}
                                                        ${extLinkHtml(baikeUrl(s), '百科')}
                                                    </span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
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
                                <div class="budget-item"><div class="bi-label">${escapeHtml(k)}</div><div class="bi-val">${escapeHtml(v)}</div></div>
                            `).join('')}
                        </div>
                        ${b.moneySavingTips && b.moneySavingTips.length ? `
                            <div style="margin-top:18px;font-size:14px;color:var(--muted);">省钱建议：${b.moneySavingTips.map(escapeHtml).join('；')}</div>
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
                        ${t.prepare && t.prepare.length ? `<div class="tip-block"><h4>行前准备</h4><ul>${t.prepare.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>` : ''}
                        ${t.avoid && t.avoid.length ? `<div class="tip-block"><h4>避坑指南</h4><ul>${t.avoid.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>` : ''}
                        ${t.bestTime && t.bestTime.length ? `<div class="tip-block"><h4>最佳时间</h4><ul>${t.bestTime.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>` : ''}
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

        // v10.0: 酒店/民宿比价平台
        const hotelLinks = hotelCompareLinks(g.city);
        if (hotelLinks.length) {
            const hIdx = '03b';
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${hIdx}</span>酒店民宿比价</h2>
                    <div class="compare-note">
                        <span class="compare-route">${escapeHtml(g.city)} · 全平台比价</span>
                    </div>
                    <div class="compare-grid">
                        ${hotelLinks.map(t => `
                            <a class="compare-card" href="${t.url}" target="_blank" rel="noopener noreferrer">
                                <div class="cc-head">
                                    <span class="cc-platform">${escapeHtml(t.platform)}</span>
                                    <span class="cc-badge cc-badge-${t.badge}">${escapeHtml(t.badge)}</span>
                                </div>
                                <div class="cc-type">${escapeHtml(t.type)}</div>
                                <div class="cc-desc">${escapeHtml(t.desc)}</div>
                            </a>
                        `).join('')}
                    </div>
                    <p class="compare-tip">提示：同一家酒店在不同平台价格可能差 10-30%，建议对比后下单。民宿首选 Airbnb/途家，酒店首选携程/去哪儿。</p>
                </section>
            `);
        }

        // 交通
        if (g.transportation) {
            const tr = g.transportation;
            const sectionIdx = g.accommodations && g.accommodations.length ? '04' : '03';
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${sectionIdx}</span>交通指南</h2>
                    <div class="transport-card">
                        ${tr.arrival ? `<h4>如何到达</h4><p>${typeof tr.arrival === 'string' ? escapeHtml(tr.arrival) : escapeHtml(tr.arrival.byAir?.details || tr.arrival.byTrain?.details || '高铁/飞机可达')}</p>` : ''}
                        ${tr.localTransport ? `<h4>市内交通</h4><p>${typeof tr.localTransport === 'string' ? escapeHtml(tr.localTransport) : escapeHtml(tr.localTransport.metro || tr.localTransport.bus || '地铁、公交便利')}</p>` : ''}
                    </div>
                </section>
            `);
        }

        // v10.0: 票务比价（火车票/机票/高铁）
        const ticketLinks = ticketCompareLinks(g.origin, g.destination || g.city);
        if (ticketLinks.length) {
            const tIdx = (g.accommodations && g.accommodations.length ? '05' : '04');
            const hasOrigin = !!g.origin;
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${tIdx}</span>票务比价 · 火车票/机票</h2>
                    <div class="compare-note">
                        <span class="compare-route">${hasOrigin ? `${escapeHtml(g.origin)} → ${escapeHtml(g.destination || g.city)}` : `目的地：${escapeHtml(g.destination || g.city)}`}</span>
                        <span class="compare-date">${formatDate()}</span>
                    </div>
                    ${hasOrigin ? '' : '<p class="compare-tip" style="background:#FFF8E7;border-left:3px solid #E8C875;">未填写出发地，以下链接直达各平台首页，请手动输入出发地与日期后搜索。</p>'}
                    <div class="compare-grid">
                        ${ticketLinks.map(t => `
                            <a class="compare-card" href="${t.url}" target="_blank" rel="noopener noreferrer">
                                <div class="cc-head">
                                    <span class="cc-platform">${escapeHtml(t.platform)}</span>
                                    <span class="cc-badge cc-badge-${t.badge}">${escapeHtml(t.badge)}</span>
                                </div>
                                <div class="cc-type">${escapeHtml(t.type)}</div>
                                <div class="cc-desc">${escapeHtml(t.desc)}</div>
                            </a>
                        `).join('')}
                    </div>
                    <p class="compare-tip">提示：各平台价格实时变动，建议多平台对比后下单。12306 为铁路官方渠道，无手续费。</p>
                </section>
            `);
        }

        // v10.0: 景点预约提示（在交通/票务之后）
        const reservationSpots = getReservationSpots(g.city, g.routes);
        if (reservationSpots.length) {
            const rIdx = (g.accommodations && g.accommodations.length ? '06' : '05');
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${rIdx}</span>景点预约提醒</h2>
                    <div class="reservation-alert">
                        <div class="ra-icon">!</div>
                        <div class="ra-content">
                            <p class="ra-title">以下景点需要提前预约，请务必提前购票以免白跑</p>
                            <div class="ra-list">
                                ${reservationSpots.map(r => `
                                    <div class="ra-item">
                                        <div class="ra-item-head">
                                            <span class="ra-name">${escapeHtml(r.name)}</span>
                                            <span class="ra-advance">${escapeHtml(r.advance)}</span>
                                        </div>
                                        <div class="ra-note">${escapeHtml(r.note)}</div>
                                        ${r.url ? `<a class="ra-link" href="${r.url}" target="_blank" rel="noopener noreferrer">立即预约 →</a>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>
            `);
        }

        // v10.0: 打卡机位推荐（在景点预约之后）
        const photoSpots = getPhotoSpots(g.city);
        if (photoSpots.length) {
            const pIdx = (g.accommodations && g.accommodations.length ? '07' : '06');
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">${pIdx}</span>打卡机位推荐</h2>
                    <div class="photo-spot-grid">
                        ${photoSpots.map(p => `
                            <div class="photo-spot-card">
                                <div class="ps-name">${escapeHtml(p.name)}</div>
                                <div class="ps-desc">${escapeHtml(p.desc)}</div>
                                <div class="ps-meta">
                                    <span class="ps-time">最佳时间：${escapeHtml(p.time)}</span>
                                </div>
                                <div class="ps-tip">拍摄建议：${escapeHtml(p.tip)}</div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `);
        }

        // v10.0: 照片上传 + AI 修图（在最末）
        const phIdx = (g.accommodations && g.accommodations.length ? '08' : '07');
        sections.push(`
            <section class="gc-section">
                <h2><span class="gc-idx">${phIdx}</span>旅拍相册 · AI 修图</h2>
                <div class="photo-upload-section" id="photoUploadSection">
                    <div class="upload-area" id="uploadArea">
                        <input type="file" id="photoInput" accept="image/*" multiple hidden>
                        <div class="upload-placeholder">
                            <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
                                <path d="M24 32V12m0 0l-8 8m8-8l8 8M8 36h32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>点击或拖拽上传旅行照片</p>
                            <span class="upload-hint">支持多张，本地存储，AI 提供修图建议</span>
                        </div>
                    </div>
                    <div class="photo-grid" id="photoGrid"></div>
                    <div class="photo-actions">
                        <button class="btn-secondary" id="genPhotoPosterBtn">生成旅拍海报</button>
                        <button class="btn-secondary" id="aiEditBtn">AI 修图建议</button>
                    </div>
                    <div class="ai-result" id="aiResult" hidden></div>
                </div>
            </section>
        `);

        dom.guideContent.innerHTML = sections.join('') || '<div class="empty-guide">暂无攻略数据</div>';

        // v10.0: 绑定照片上传事件
        bindPhotoUploadEvents();
    }

    // v10.0: 照片上传与 AI 修图
    function bindPhotoUploadEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const photoInput = document.getElementById('photoInput');
        const photoGrid = document.getElementById('photoGrid');
        const genPosterBtn = document.getElementById('genPhotoPosterBtn');
        const aiEditBtn = document.getElementById('aiEditBtn');
        const aiResult = document.getElementById('aiResult');
        if (!uploadArea || !photoInput) return;

        // 加载已存储的照片
        renderPhotoGrid();

        // 点击上传区
        uploadArea.addEventListener('click', () => photoInput.click());
        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });
        photoInput.addEventListener('change', (e) => handleFiles(e.target.files));

        // 生成旅拍海报
        if (genPosterBtn) {
            genPosterBtn.addEventListener('click', generatePhotoPoster);
        }
        // AI 修图建议
        if (aiEditBtn) {
            aiEditBtn.addEventListener('click', getAIEditAdvice);
        }
    }

    // 处理上传文件
    function handleFiles(files) {
        if (!files || !files.length) return;
        const photos = loadPhotos();
        // v10.1: 按当前城市过滤显示，但存储上限提升到 12 张
        const remaining = 12 - photos.length;
        if (remaining <= 0) {
            toast('相册已满（12 张），请先删除部分照片', 'error');
            return;
        }
        const toProcess = Array.from(files).slice(0, remaining);
        let processed = 0;
        let skipped = 0;
        toProcess.forEach(file => {
            if (!file.type.startsWith('image/')) { toast(`「${file.name}」不是图片，已跳过`, 'error'); skipped++; return; }
            // v10.1: 限制提升到 5MB（压缩后会更小）
            if (file.size > 5 * 1024 * 1024) { toast(`图片 ${file.name} 超过 5MB，已跳过`, 'error'); skipped++; return; }
            const reader = new FileReader();
            reader.onload = (e) => {
                // v10.1: 压缩到 800px 宽度（提升海报打印质量），JPEG 0.75 质量
                compressImage(e.target.result, 800, (compressed) => {
                    photos.push({
                        id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
                        data: compressed,
                        name: file.name,
                        city: state.currentCity || '',
                        time: new Date().toISOString()
                    });
                    processed++;
                    if (processed + skipped === toProcess.length) {
                        savePhotos(photos);
                        renderPhotoGrid();
                        const msg = processed === toProcess.length
                            ? `已上传 ${processed} 张照片`
                            : `上传 ${processed} 张，跳过 ${skipped} 张`;
                        toast(msg, processed ? 'success' : 'error');
                    }
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // 压缩图片
    function compressImage(dataUrl, maxWidth, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            // v10.1: 白色背景填充（避免 PNG 透明区域变黑）
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // v10.1: 质量提升到 0.78（平衡清晰度与体积）
            callback(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.onerror = () => callback(dataUrl); // 压缩失败返回原图
        img.src = dataUrl;
    }

    // 渲染照片网格
    // v10.1: 优先显示当前城市的照片，无则显示全部
    function renderPhotoGrid() {
        const photoGrid = document.getElementById('photoGrid');
        if (!photoGrid) return;
        const allPhotos = loadPhotos();
        if (!allPhotos.length) {
            photoGrid.innerHTML = '<p class="photo-empty-hint">还没有照片，点击上方上传</p>';
            return;
        }
        // v10.1: 按当前城市过滤，无结果则显示全部
        const currentCity = state.currentCity;
        let photos = currentCity ? allPhotos.filter(p => p.city === currentCity) : [];
        if (!photos.length) photos = allPhotos;

        photoGrid.innerHTML = photos.map(p => `
            <div class="photo-item" data-id="${p.id}" title="${escapeHtml(p.city || '未标注城市')} · ${escapeHtml(p.name)}">
                <img src="${p.data}" alt="${escapeHtml(p.name)}" loading="lazy">
                <button class="photo-delete" data-id="${p.id}" title="删除">×</button>
            </div>
        `).join('');
        // 绑定删除
        photoGrid.querySelectorAll('.photo-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const photos = loadPhotos().filter(p => p.id !== id);
                savePhotos(photos);
                renderPhotoGrid();
                toast('已删除', 'success');
            });
        });
        // v10.1: 点击照片选中（用于 AI 修图选照片）
        photoGrid.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('photo-delete')) return;
                photoGrid.querySelectorAll('.photo-item').forEach(x => x.classList.remove('selected'));
                item.classList.add('selected');
            });
        });
    }

    // 照片存储
    function loadPhotos() {
        try { return JSON.parse(localStorage.getItem('xj_photos') || '[]'); }
        catch { return []; }
    }
    // v10.3: 存储前检测容量，避免 QuotaExceededError 导致数据丢失
    function savePhotos(photos) {
        try {
            const data = JSON.stringify(photos);
            // 检测存储容量（localStorage 通常限制 5MB）
            const sizeMB = (data.length / 1024 / 1024).toFixed(2);
            if (data.length > 4 * 1024 * 1024) {
                // 超过 4MB 时强制只保留最新的 6 张
                const trimmed = photos.slice(-6);
                localStorage.setItem('xj_photos', JSON.stringify(trimmed));
                toast(`照片存储已满（${sizeMB}MB），仅保留最新 6 张`, 'info');
                return;
            }
            localStorage.setItem('xj_photos', data);
        } catch (e) {
            // 容量超限时，逐步删除旧照片重试
            let list = photos.slice();
            while (list.length > 0) {
                try {
                    localStorage.setItem('xj_photos', JSON.stringify(list));
                    if (list.length < photos.length) {
                        toast(`存储空间不足，已自动删除 ${photos.length - list.length} 张旧照片`, 'info');
                    }
                    return;
                } catch {
                    list.shift();
                }
            }
            toast('存储空间不足，请清理浏览器数据后重试', 'error');
        }
    }

    // 生成旅拍海报
    function generatePhotoPoster() {
        const photos = loadPhotos();
        if (!photos.length) { toast('请先上传照片', 'error'); return; }
        const g = state.currentGuide;
        if (!g) { toast('请先生成攻略', 'error'); return; }
        // 用第一张照片作为背景，叠加攻略信息
        const photo = photos[0];
        // v10.3: 检测弹窗是否被拦截
        const poster = window.open('', '_blank');
        if (!poster || poster.closed || typeof poster.closed === 'undefined') {
            toast('弹窗被浏览器拦截，请允许本站弹窗后重试', 'error');
            return;
        }
        // v10.3: 所有用户数据通过 textContent 注入，避免 XSS
        const city = g.city || '';
        const subtitle = g.subtitle || g.title || '';
        const tags = (g.tags || []).slice(0, 3);
        const routes = (g.routes || []).slice(0, 2).map(r => typeof r === 'string' ? r : (r.routeLine || r.theme || ''));
        const budget = g.budget?.total || '';
        poster.document.write(`
            <!DOCTYPE html><html><head><title>旅拍海报 - 行纪</title>
            <style>
                body{margin:0;padding:0;font-family:'Noto Serif SC',serif;background:#1C1A17;display:flex;align-items:center;justify-content:center;min-height:100vh}
                .poster{position:relative;width:600px;height:900px;overflow:hidden;background:#000}
                .poster img{width:100%;height:100%;object-fit:cover;opacity:.7}
                .overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.3) 0%,rgba(0,0,0,.7) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:40px;color:#fff}
                .city{font-size:64px;font-weight:900;letter-spacing:-.02em;margin:0;line-height:1}
                .subtitle{font-size:18px;margin:8px 0 24px;opacity:.9}
                .tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
                .tag{padding:4px 12px;border:1px solid rgba(255,255,255,.5);border-radius:999px;font-size:13px}
                .routes{font-size:14px;opacity:.8;line-height:1.6;margin-bottom:12px}
                .budget{font-size:20px;font-weight:700;color:#C8553D}
                .logo{position:absolute;top:30px;right:30px;font-size:11px;letter-spacing:.3em;opacity:.7}
            </style></head><body>
            <div class="poster">
                <img id="posterImg" alt="旅拍照片">
                <div class="overlay">
                    <div class="logo">XING JI · TRAVEL</div>
                    <h1 class="city" id="posterCity"></h1>
                    <p class="subtitle" id="posterSubtitle"></p>
                    <div class="tags" id="posterTags"></div>
                    <div class="routes" id="posterRoutes"></div>
                    <div class="budget" id="posterBudget"></div>
                </div>
            </div>
            <script>
                (function(){
                    var img = document.getElementById('posterImg');
                    img.src = ${JSON.stringify(photo.data)};
                    document.getElementById('posterCity').textContent = ${JSON.stringify(city)};
                    document.getElementById('posterSubtitle').textContent = ${JSON.stringify(subtitle)};
                    var tagsEl = document.getElementById('posterTags');
                    ${JSON.stringify(tags)}.forEach(function(t){ var s=document.createElement('span'); s.className='tag'; s.textContent=t; tagsEl.appendChild(s); });
                    var routesEl = document.getElementById('posterRoutes');
                    ${JSON.stringify(routes)}.forEach(function(r,i){ if(i>0) routesEl.appendChild(document.createElement('br')); routesEl.appendChild(document.createTextNode(r)); });
                    if (${JSON.stringify(budget)}) { document.getElementById('posterBudget').textContent = ${JSON.stringify(budget)}; }
                    window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };
                })();
            <\/script>
            </body></html>
        `);
        poster.document.close();
    }

    // AI 修图建议
    // v10.1: 支持用户选中的照片（点击照片选中），无选择时用第一张
    async function getAIEditAdvice() {
        const photos = loadPhotos();
        if (!photos.length) { toast('请先上传照片', 'error'); return; }
        const aiResult = document.getElementById('aiResult');
        if (!aiResult) return;
        // v10.1: 检查用户是否选中了某张照片
        const selectedEl = document.querySelector('.photo-item.selected');
        let photo = photos[0];
        if (selectedEl) {
            const selectedId = selectedEl.dataset.id;
            const found = photos.find(p => p.id === selectedId);
            if (found) photo = found;
        }
        aiResult.hidden = false;
        aiResult.innerHTML = '<div class="ai-loading">AI 正在分析照片，请稍候...</div>';
        const g = state.currentGuide;
        try {
            // 调用后端 AI 获取修图建议
            const response = await fetch(`${API.base}/api/ai/edit-photo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    city: g?.city || '',
                    photoName: photo.name,
                    guideContext: {
                        city: g?.city,
                        season: g?.season,
                        tags: g?.tags
                    }
                })
            });
            const data = await response.json();
            if (data.success && data.advice) {
                aiResult.innerHTML = `<div class="ai-advice"><h4>AI 修图建议 · ${escapeHtml(photo.name || '当前照片')}</h4><p>${escapeHtml(data.advice)}</p></div>`;
            } else {
                // 后端失败，提供本地建议
                aiResult.innerHTML = `<div class="ai-advice"><h4>修图建议（本地） · ${escapeHtml(photo.name || '当前照片')}</h4>${getLocalEditAdvice(g)}</div>`;
                toast('AI 服务暂不可用，已使用本地建议', 'info');
            }
        } catch (e) {
            // 网络失败，提供本地建议
            aiResult.innerHTML = `<div class="ai-advice"><h4>修图建议（本地） · ${escapeHtml(photo.name || '当前照片')}</h4>${getLocalEditAdvice(g)}</div>`;
            toast('网络异常，已使用本地建议', 'info');
        }
    }

    // 本地修图建议（AI 不可用时的回退）
    function getLocalEditAdvice(g) {
        const city = g?.city || '';
        const season = g?.season || '';
        const tags = g?.tags || [];
        const advices = [];
        // 基于城市风格
        if (tags.includes('历史文化') || tags.includes('古都')) {
            advices.push('建议增强暖色调，突出历史厚重感；适当降低饱和度，增加复古胶片感');
        }
        if (tags.includes('海滨城市') || tags.includes('热带风情')) {
            advices.push('建议提升蓝色饱和度，增强海天一色效果；适当增加曝光，画面更通透');
        }
        if (tags.includes('高原') || tags.includes('雪山')) {
            advices.push('建议增加对比度，突出雪山层次；适当降低色温，增强冷峻感');
        }
        if (tags.includes('夜景') || tags.includes('网红打卡地')) {
            advices.push('夜景建议：提升阴影细节，降低高光；增加霓虹灯饱和度，增强氛围感');
        }
        // 基于季节
        if (season.includes('春')) advices.push('春景建议：提升绿色饱和度，增加花卉明度');
        if (season.includes('秋')) advices.push('秋景建议：增强金黄色调，增加落叶层次感');
        if (season.includes('冬')) advices.push('冬景建议：提升白色纯净度，增加冷色调');
        // 通用建议
        advices.push('通用建议：使用三分法构图裁剪；适当增加清晰度；添加暗角增强主体');
        advices.push('人像建议：肤色提亮，背景虚化；使用柔光效果');
        return advices.map(a => `<p>• ${a}</p>`).join('');
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
            // P2-9: 海报作为整张图片语义，添加 role="img" 与 aria-label
            dom.poster.setAttribute('role', 'img');
            dom.poster.setAttribute('aria-label', '攻略生成中 旅行攻略海报');
            dom.poster.innerHTML = `<div class="p-top"><div class="p-eyebrow">XING JI · TRAVEL POSTER</div><div class="p-city">攻略生成中</div></div>`;
            return;
        }

        dom.poster.className = `poster style-${style}`;
        // P2-9: 海报作为整张图片语义，aria-label 描述「城市名 + 旅游攻略海报」
        dom.poster.setAttribute('role', 'img');
        dom.poster.setAttribute('aria-label', `${city} 旅游攻略海报`);
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
        // 修复 P2：进入 showLoading 前先清理上一个定时器，避免快速连续触发导致 setInterval 泄漏
        if (loadingTimer) {
            clearInterval(loadingTimer);
            loadingTimer = null;
        }
        // v10.2: 根据模式显示不同文案
        const isLocal = API.mode === 'local';
        dom.loadingSub.textContent = isLocal ? '正在从本地数据库检索景点…' : 'AI 正在分析景点、美食与预算…';
        dom.loadingBar.style.width = '0%';
        dom.loading.hidden = false;
        let p = 0;
        loadingTimer = setInterval(() => {
            p = Math.min(p + Math.random() * 14, 92);
            dom.loadingBar.style.width = p + '%';
            // 修复 P3：本地模式与 AI 模式文案完全一致，合并分支
            if (p > 30) dom.loadingSub.textContent = '正在匹配你的旅行偏好…';
            if (p > 65) dom.loadingSub.textContent = '排版生成专属海报…';
        }, 420);
    }
    function hideLoading() {
        clearInterval(loadingTimer);
        dom.loadingBar.style.width = '100%';
        setTimeout(() => { dom.loading.hidden = true; }, 320);
    }

    // ---------- 焦点陷阱（P1-8）----------
    // 通用工具：打开模态框时记录触发元素、焦点移入首个可聚焦元素、Tab/Shift+Tab 在容器内循环、ESC 关闭并恢复焦点
    let favFocusTrap = null;
    function trapFocus(container, onClose) {
        const trigger = document.activeElement;
        const selector = 'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const getFocusable = () => Array.from(container.querySelectorAll(selector)).filter(el => {
            // 过滤自身或祖先带 [hidden] 的元素
            if (el.hidden || el.closest('[hidden]')) return false;
            // offsetParent 为 null 通常意味着不可见（display:none）
            return el.offsetParent !== null;
        });
        // 等一帧让显隐动画就绪后再聚焦
        requestAnimationFrame(() => {
            const f = getFocusable();
            if (f.length) f[0].focus();
        });
        const onKeydown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (typeof onClose === 'function') onClose();
                return;
            }
            if (e.key !== 'Tab') return;
            const f = getFocusable();
            if (!f.length) { e.preventDefault(); return; }
            const first = f[0], last = f[f.length - 1];
            const active = document.activeElement;
            if (e.shiftKey) {
                if (active === first || !container.contains(active)) { e.preventDefault(); last.focus(); }
            } else {
                if (active === last || !container.contains(active)) { e.preventDefault(); first.focus(); }
            }
        };
        container.addEventListener('keydown', onKeydown);
        return {
            release() {
                container.removeEventListener('keydown', onKeydown);
                if (trigger && typeof trigger.focus === 'function') {
                    try { trigger.focus({ preventScroll: true }); } catch (e) { /* 忽略 */ }
                }
            }
        };
    }

    // ---------- 收藏 ----------
    function loadFavorites() {
        try { return JSON.parse(localStorage.getItem('xj_favorites') || '[]'); } catch { return []; }
    }
    function saveFavorites() { localStorage.setItem('xj_favorites', JSON.stringify(state.favorites)); }
    function updateFavCount() {
        const n = state.favorites.length;
        dom.navFavCount.textContent = n;
        // P1-5: 同步移动端汉堡菜单内的收藏数 badge
        if (dom.navMenuFavCount) dom.navMenuFavCount.textContent = n;
    }

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
        // P1-9: 同步 aria-pressed，让屏幕阅读器感知收藏开关状态
        dom.favoriteBtn.setAttribute('aria-pressed', fav ? 'true' : 'false');
    }

    function openFavorites() {
        renderFavoritesList();
        dom.favoritesModal.hidden = false;
        // v10.6: 收藏数 ≥ 3 时显示搜索框
        dom.favSearchWrap.hidden = state.favorites.length < 3;
        if (dom.favSearchInput) dom.favSearchInput.value = '';
        // P1-8: 启用焦点陷阱——记录触发元素、焦点移入模态框、Tab 循环、ESC 关闭并恢复焦点
        if (favFocusTrap) favFocusTrap.release();
        favFocusTrap = trapFocus(dom.favoritesModal, closeFavorites);
    }
    function closeFavorites() {
        dom.favoritesModal.hidden = true;
        // P1-8: 释放焦点陷阱，把焦点还给触发按钮
        if (favFocusTrap) { favFocusTrap.release(); favFocusTrap = null; }
    }
    // v10.6: 支持搜索过滤的收藏列表渲染
    function renderFavoritesList(filter = '') {
        if (!state.favorites.length) {
            dom.favoritesList.innerHTML = '';
            dom.emptyFavorites.hidden = false;
            dom.emptyFavSearch.hidden = true;
            return;
        }
        dom.emptyFavorites.hidden = true;
        // 应用搜索过滤
        const q = (filter || '').toLowerCase().trim();
        const list = q
            ? state.favorites.filter(f =>
                (f.city || '').toLowerCase().includes(q) ||
                (f.title || '').toLowerCase().includes(q))
            : state.favorites;
        // 搜索无结果时显示提示
        if (q && list.length === 0) {
            dom.favoritesList.innerHTML = '';
            dom.emptyFavSearch.hidden = false;
            return;
        }
        dom.emptyFavSearch.hidden = true;
        dom.favoritesList.innerHTML = list.map(f => `
            <div class="fav-item">
                <div>
                    <div class="fi-name">${escapeHtml(f.city)}</div>
                    <div class="fi-title">${escapeHtml(f.title || '')}</div>
                </div>
                <div class="fi-actions">
                    <button class="fi-btn view" data-city="${escapeHtml(f.city)}">查看</button>
                    <button class="fi-btn del" data-city="${escapeHtml(f.city)}">删除</button>
                </div>
            </div>
        `).join('');
        dom.favoritesList.querySelectorAll('.fi-btn.view').forEach(b => {
            b.onclick = () => { closeFavorites(); dom.cityInput.value = b.dataset.city; submitCity(b.dataset.city); };
        });
        dom.favoritesList.querySelectorAll('.fi-btn.del').forEach(b => {
            b.onclick = () => {
                state.favorites = state.favorites.filter(f => f.city !== b.dataset.city);
                saveFavorites(); updateFavCount(); renderFavoritesList(dom.favSearchInput?.value || ''); updateFavoriteBtn();
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
    // v10.5: 删除单条历史
    function removeHistory(city) {
        state.history = state.history.filter(h => h.city !== city);
        localStorage.setItem('xj_history', JSON.stringify(state.history));
        renderHistory();
    }
    // v10.5: 清空全部历史
    function clearAllHistory() {
        state.history = [];
        localStorage.removeItem('xj_history');
        renderHistory();
        toast('已清空全部浏览历史');
    }

    // ---------- 复制 / 下载 ----------
    function copyGuideText() {
        const g = state.currentGuide;
        if (!g) return;
        let text = `《${g.title}》\n${g.subtitle || ''}\n${'─'.repeat(30)}\n`;
        text += `城市：${g.city}\n季节：${g.season || '四季皆宜'}\n行程：${g.duration || '3天'}\n预算：${g.overallBudget || (g.budget && g.budget.total) || '待估'}\n`;
        // v10.4: 添加出行信息
        if (g.origin) text += `出发地：${g.origin} → ${g.destination || g.city}\n`;
        if (g.travelers) text += `出行人数：${g.travelers} 人\n`;
        if (g.travelDate) text += `出行日期：${g.travelDate}\n`;
        if (g.routes) {
            text += `\n【行程】\n`;
            g.routes.forEach(r => { text += `Day ${r.day} ${r.theme || ''}：${r.routeLine || ''}\n`; });
        }
        if (g.foods) {
            text += `\n【美食】\n`;
            g.foods.forEach(f => { text += `· ${f.name} ${f.price || ''} ${f.mustTry ? '(必吃)' : ''}\n`; });
        }
        // v10.4: 添加景点预约提醒
        const reservationSpots = getReservationSpots(g.city, g.routes);
        if (reservationSpots.length) {
            text += `\n【景点预约提醒】\n`;
            reservationSpots.forEach(r => { text += `· ${r.name}：${r.advance}（${r.note}）\n`; });
        }
        // v10.4: 添加打卡机位
        const photoSpots = getPhotoSpots(g.city);
        if (photoSpots.length) {
            text += `\n【打卡机位】\n`;
            photoSpots.slice(0, 3).forEach(p => { text += `· ${p.name}：${p.time || ''} ${p.tip || ''}\n`; });
        }
        text += `\n${'─'.repeat(30)}\n由「行纪 XING JI」生成`;
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
            // v10.4: 文件名带城市+日期，方便用户管理
            const datePart = state.travelDate ? `-${state.travelDate}` : '';
            link.download = `${state.currentCity || '旅行'}${datePart}-海报.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast('海报已下载', 'success');
        }).catch(() => toast('海报生成失败，请检查网络后重试', 'error'));
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
    // P2-8: 扩展 toast 支持 action 按钮 + onAction 回调，用于「删除后撤销」等场景
    // 签名：toast(msg, type?, options?) 或 toast(msg, options)（兼容 PWA 中 window.__toast(msg, { action, onAction }) 调用）
    function toast(msg, type, options) {
        if (typeof type === 'object' && type !== null) { options = type; type = ''; }
        options = options || {};
        const t = document.createElement('div');
        t.className = 'toast' + (type ? ' ' + type : '');
        t.textContent = msg;
        if (options.action && typeof options.onAction === 'function') {
            const btn = document.createElement('button');
            btn.className = 'toast-action';
            btn.type = 'button';
            btn.textContent = options.action;
            btn.onclick = () => { dismiss(); options.onAction(); };
            t.appendChild(btn);
        }
        dom.toastWrap.appendChild(t);
        let timer = null;
        const duration = options.duration || 2400;
        function dismiss() {
            if (timer) { clearTimeout(timer); timer = null; }
            if (!t.parentNode) return;
            t.style.opacity = '0';
            t.style.transform = 'translateY(8px)';
            setTimeout(() => t.remove(), 300);
        }
        timer = setTimeout(dismiss, duration);
    }
    // P2-8: 暴露给 PWA / Service Worker 更新提示使用（index.html 内联脚本已调用 window.__toast）
    window.__toast = toast;

    // ---------- 工具 ----------
    function timeAgo(ts) {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return '刚刚';
        if (s < 3600) return Math.floor(s / 60) + '分钟前';
        if (s < 86400) return Math.floor(s / 3600) + '小时前';
        if (s < 86400 * 7) return Math.floor(s / 86400) + '天前';
        // v10.5: 超过 7 天显示日期格式
        const d = new Date(ts);
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        // 同年省略年份，跨年显示完整日期
        if (d.getFullYear() === now.getFullYear()) {
            return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        }
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
