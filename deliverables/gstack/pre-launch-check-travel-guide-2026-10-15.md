# 行纪 Xing Ji · 全面质量评估报告（六阶段 · 阶段一~三 + 设计审查）

**日期**：2026-10-15
**场景**：上线前检查 + 代码审查 + 安全审计 + 设计审查（多成员协作）
**项目**：`D:/xm/wz/travel-guide` — 行纪 XING JI · 中国城市旅行攻略生成器 v10.9.3
**技术栈**：前端原生 HTML/CSS/JS（无框架、无构建）｜后端 Node.js 22 + Express 4.18 ｜ Firebase / Render / Docker / Nginx
**参与成员**：产品评审员 + 安全官 + QA与发布负责人 + 设计顾问 + 调查员（5 位全员上场）

---

## 📌 TL;DR（执行摘要）

- **整体结论**：🔴 **不通过**（不建议按当前状态上线）
- 项目工程底子**扎实**：146/146 单测通过、无密钥泄露、工作树干净、41 路由错误处理全覆盖、前端全局污染极小、原创设计语言完整
- 但存在 **7 项阻断级缺陷**，其中 **3 项为功能性完全失效**（天气接口恒返回空、`/weather/:city` 恒 400、PWA 从未注册）、**2 项为安全漏洞**（DOM XSS、SW 缓存鉴权数据跨会话泄露）
- **覆盖率 66.34%，未达 80% 目标**，且统计口径仅覆盖 5 个文件——`aiService.js`、`routes/api.js`、`validation.js`、`app.js` 等核心模块**完全未纳入**，正是上述功能缺陷长期漏网的原因
- **设计达标度 7.06/10**（Awwwards 标准要求 ≥9）：色彩对比度 8 组未达 WCAG AA、响应式断点仅 2 档（需 6 档）
- **下一步**：先修 7 项 P0 阻断项（预计可在一个迭代内闭环），再补测试口径，然后进入阶段四/五

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| **Go / No-Go** | 🔴 **No-Go**（当前状态）；修完 7 项 P0 后可转 🟡 条件 Go |
| **严重度分布** | 🔴 7 ／ 🟠 9 ／ 🟡 27 ／ 🟢 8（合计 51 条，已去重合并） |
| **阻塞项数量** | **7** |
| **测试基线** | 7 文件 / 146 用例 / **0 失败**，耗时 2.02s（复测） |
| **覆盖率** | 语句 **66.34%** ／ 分支 66.82% ／ 函数 82.92% ／ 行 67.5%（**未达 80%**） |
| **设计达标度** | 平均 **7.06/10**（目标 ≥9），8 维度全部未达标 |
| **关键行动项** | 12 条（P0×7、P1×5） |
| **建议负责人** | 前端交互修复→前端负责人；后端正确性→后端负责人；CSP/SW/Nginx→安全+运维；设计令牌化→设计+前端 |

---

## 1. 各成员核心结论

### 🔍 产品官（阶段一 代码审查 + 产品评审）
- **核心判断**：代码层面输出 22 条问题（P1×6/P2×11/P3×5）。最严重的是 `getCityWeather()` 三处调用**漏了 `await`**，赋给 `currentWeather` 的实为 Promise，JSON 序列化后恒为 `{}`——**天气数据实际从未返回过**；`/weather/:city` 因中间件读错参数名（`req.params.name` vs 路由 `:city`）**必然 400**。
- **关键建议**：产品护城河（票务/酒店比价 + 打卡机位 + AI 修图 + 海报）方向正确，但 `RESERVATION_REQUIRED_SPOTS`/`PHOTO_SPOTS` 是**硬编码静态表仅覆盖约 15 城**，527 城中有 500+ 城拿不到这些高价值模块；热门度用 `Math.random()`、天气失败静默回退模拟数据却标为「天气情况」——**数据真实性未做任何标注**，对旅行决策类产品是信任杀手。补 OG 卡片是成本最低、收益最高的增长动作。

### 🛡️ 安全卫士（OWASP Top 10 + STRIDE）
- **核心判断**：15 条发现（🟠3/🟡7/🟢5）。**A03 注入 ❌、A05 配置错误 ❌、A09 日志失败 ❌**。最严重的是 `sw.js:61-89` ——Service Worker 对**所有同源 GET 做缓存优先且未排除 `/api/*`**，带鉴权接口响应被写入 Cache Storage 并按 URL 复用，**共享设备上会把上一会话数据返回给下一个请求，登出后仍返回旧数据**。
- **关键建议**：DOM XSS 与 prompt 注入（`preferences` 未校验）可组合放大，须一并修；`NGINX_DOMAIN_GUIDE.md:147` 的 CSP 含 `'unsafe-inline' 'unsafe-eval'`，**若按该指南部署则 XSS 防护基本失效**；`render.yaml` 的 `CORS_ORIGIN="*"` 与代码精确匹配逻辑冲突。认证（A07）与 SSRF（A10）判定为 ✅。

### ✅ 质量门神（测试基线 + 阶段三 页面检查）
- **核心判断**：基线健康（146/146）但**覆盖率 66.34% 未达 80%，且口径严重偏窄**——`include` 仅含 5 个文件，`aiService.js`(671行)、`routes/api.js`(833行)、`validation.js`(396行)、`app.js`(2671行) **完全未纳入统计**；`storage.js`/`weatherSync.js` 有测试却不计入，等于白测；`include` 里 `services/lruCache.js` 路径不存在（真实在 `utils/`），是死配置。
- **关键建议**：实测 1920/1366/768/375 四档视口 + 真实 Playwright 截图 17 张，发现 **3 个 P1 真实 UI 缺陷**：① 375px 下搜索表单 meta 区溢出被裁；② **所有弹窗吸附左上角不居中**（根因已定位到一行 CSS）；③ PWA Service Worker 被 CSP 阻断从未注册。另：`/api/stats` 端点不存在（返回 404）。

### 🎨 设计师（Awwwards 8 维度审查 + 阶段五方案）
- **核心判断**：平均 **7.06/10**，8 维度**全部未达 ≥9 目标**。最弱是**色彩系统 6.0**——Python 实算对比度发现 **8 组文本未达 WCAG 2.1 AA**：`--accent #C8553D` 作小号文本仅 **4.07:1**（全站高频使用）、`--muted-2 #7A736A` 仅 **4.38:1**、sage/gold 徽章仅 3.13/3.00。次弱是**响应式 6.5**——断点**只有 2 档**（960/720px，要求 6 档），移动端触摸目标 40/42px **低于 48px 标准**。
- **关键建议**：49 处 `transition` 中 **35 处用 `transition: all`（71%）**，会过渡非合成属性触发重排重绘，是 60fps 最大风险；**23 档字号无体系**（含 12.5/13.5/14.5px 半像素漂移）；**全站无暗色模式**（`prefers-color-scheme` 零命中，与任务背景描述不符）。已给出可直接落地的完整令牌方案（色彩/排版/间距/缓动/断点）。亮点：原创性 8.0，编辑杂志风设计语言完整，`prefers-reduced-motion` 已全局支持。

### 🔧 排障手（健康检查 + 性能排查 + 代码质量）
- **核心判断**：**独立交叉验证了产品官的核心发现**（两条线各自读码得出同一结论，可信度高）。新增：`weatherSync.js` **3 处 axios 全无 timeout**，叠加 N+1 会耗尽 socket；`storage.js` 的 `citiesCache` 是**无上限 Map**，`POST /cities` 可无限写入（LRU 改造漏掉了它）。
- **关键建议**：文档存在 **11 处幽灵引用**——`admin.html`、`app_backup.js`、`app_fixed.js`、`dataSync.js` **均不存在**，文档称「50+城市」实际 527，称 `app.js` 是「旧版有语法错误」实为主逻辑文件，称「每5分钟刷新天气」但 `app.js` **无任何天气轮询定时器**。健康度亮点：**无密钥泄露**（`backend/.env` 从未入库）、41 路由 41 个 try 全覆盖、无空 catch、定时器均已清理。

---

## 2. 综合审查发现（去重合并后按严重度排序）

### 🔴 P0 — 阻断级（7 项，必须 100% 修复）

| # | 类别 | 位置 | 问题描述 | 建议 | 来源 |
|---|------|------|---------|------|------|
| 1 | 前端布局 | `style.css:1329-1333` | **所有弹窗吸附左上角、不居中**。`.modal-overlay`(:690) 本已 `position:fixed;inset:0;display:grid;place-items:center`，但 :1329 又把 `position:fixed;inset:0;z-index:1000` 加到**内层 `.modal`**，使卡片脱离网格流并撑满视口 → 渲染于 (0,0)。已截图复核属实 | 将 :1329 选择器 `.modal` 改为 `.modal-overlay`，或直接删除该块（`:1007` 的 `[hidden]{display:none!important}` 已能正确隐藏） | 质量门神 + 主理人复核 |
| 2 | 安全/功能 | `index.html:11-12` + `index.html:269-300` + `offline.html:102, 118-121`（**共 3 处内联脚本**） | **PWA Service Worker 从未注册**。helmet CSP（`server.js:21-39`）的 `script-src 'self' https://html2canvas.hertzen.com` 未含 `'unsafe-inline'`/nonce，而 SW 注册与 online/offline 监听是页面底部**内联 `<script>`** → 被浏览器直接拦截。该内联脚本是**全站唯一 SW 注册点**（`app.js` 无注册逻辑），故 `sw.js`/`offline.html` 成死代码，离线能力全废；`offline.html` 自身也含内联 `onclick` 与内联 `<script>`，**即使 SW 能注册，离线页的"重新连接"与自动重连仍会失效**（见 P2#43） | 内联脚本全部外置为 `pwa.js` 并以 `src` 引入（保持 `script-src 'self'`）；或为内联脚本加 `sha256` hash 并同步进 CSP | 产品官 + 安全官 + 质量门神（三方独立发现） |
| 3 | 前端布局 | `style.css` 搜索表单 meta 区 | **375px 下搜索表单溢出被裁**：容器 281px 而 `scrollWidth` 455px，子项右延至 502px。目的地输入框、天数 pills（仅 1/2 可见，3/4/5/7 被裁）、预算/偏好被切；被 `body{overflow-x:hidden}`(:48) **静默裁剪**，故无横向滚动条假象。已截图复核属实 | 窄屏下 `.day-pills` 允许换行或横向滚动；grid 子项补 `min-width:0` | 质量门神 + 主理人复核 |
| 4 | 安全(XSS) | `app.js:1598,1599,1600,1604,1606,1662,1728` | **DOM XSS**：AI 输出/管理员数据的 `g.title / g.subtitle / g.duration / g.season / g.overallBudget / budget.total / route.theme` **未经 `escapeHtml` 直接拼进 `innerHTML`**（如 `<h1>${g.title||g.city}</h1>`）。项目其他位置一律转义，此处遗漏；AI 输出属信任边界之外，可被 prompt 注入污染 | 全部套 `escapeHtml()`，或将 header 改为 `textContent` 赋值 | 产品官 + 安全官（交叉确认） |
| 5 | 后端正确性 | `routes/api.js:66, 429, 687` | **天气数据实际从未返回**。`getCityWeather()` 是 `async`（`weatherSync.js:113`），但三处调用均**未 `await`** → `weather` 实为 Promise（恒真），`guideData.currentWeather` / `updatedData.currentWeather` 被赋值为 Promise，JSON 序列化后恒为 `{}` | 三处改 `await getCityWeather(...)`；同时把 `mergeWithWeather`(:423) 改为 async | 产品官 + 调查员（交叉确认） |
| 6 | 后端正确性 | `routes/api.js:684` + `middleware/validation.js:3` | **`/weather/:city` 必然返回 400**。路由参数名为 `:city`，但挂载的 `validateCityName` 读的是 `req.params.name` → `cityName` 恒 undefined → 接口 100% 不可用 | 改用 `validateCityIdParam('city')`，或让 `validateCityName` 兼容 `req.params.city` | 产品官 |
| 7 | 安全/隐私 | `sw.js:61-89` | **SW 缓存鉴权接口响应，跨会话数据泄露**。Service Worker 对所有同源 GET 做缓存优先，**未排除 `/api/*`** → `/api/likes/user`、`/api/activity/timeline`、`/api/followers` 等带鉴权响应被写入 Cache Storage 并按 URL 复用；共享设备上会把上一会话数据返回给下一请求，登出后仍返回旧数据 | fetch 拦截中排除 API：`if (url.pathname.startsWith('/api/')) return;`；仅缓存静态资源白名单 | 安全官 |

### 🟠 P1 — 严重（9 项，必须 100% 修复）

| # | 类别 | 位置 | 问题描述 | 建议 | 来源 |
|---|------|------|---------|------|------|
| 8 | 性能/资源 | `routes/api.js:423-441, 476-510` | `/cities/all` 无分页时遍历 527 城调用未 await 的 `mergeWithWeather`，冷缓存下并发触发最多 527×(1 geo+2 weather) ≈ **1581 次上游 HTTP**，无并发上限，构成资源放大/对上游 API 的 DoS | 批量接口禁止逐城触发外部天气；改按需拉取 + 并发闸（p-limit）；至少 await 串行并跳过无缓存命中 | 产品官 + 调查员 |
| 9 | 稳定性 | `services/weatherSync.js:37, 66, 73` | **3 处 axios 请求全无 `timeout`**（geo/now/3d）→ 网络异常时请求悬挂，叠加 #8 会耗尽 socket（`aiProviders.js` 有 60-120s 超时，此处完全没有） | 统一补 `timeout: 5000~8000` | 调查员 |
| 10 | 安全(注入) | `routes/api.js:27, 48-55` | **prompt 注入通道**：仅 `city` 与 `preferences.days` 被校验，`origin / travelers / travelType / budgetRange` 原样传入 `aiService.buildPrompt()`（`aiService.js:128-135`），配合 #4 可放大为 XSS | `origin` 套用与 city 相同正则；`travelers` 白名单 `1-6/6+`；`travelType/budgetRange` 用 enum 白名单 | 安全官 |
| 11 | 安全(日志) | `services/socialService.js` 12 处 | 仍用 `console.error('xxx失败:', error)` **打印完整 error 对象**（可能含用户评论内容/Firestore request payload）；已建好的 `utils/safeLog.js` 未在此文件应用 | 改用 `logError('SocialService.xxx', error, {userId})`，与 `authService.js` 保持一致 | 安全官 |
| 12 | 安全(配置) | `NGINX_DOMAIN_GUIDE.md:147` | 指南中的 CSP 含 **`script-src 'unsafe-inline' 'unsafe-eval'`** 及 cdnjs/gstatic/aframe.io/raw.githack 等无关 CDN，**远弱于** `index.html:12` 的严格 CSP；按此部署 XSS 防护基本失效 | 删除 `'unsafe-inline' 'unsafe-eval'` 与无关 CDN，使 Nginx CSP 与 meta 完全一致；以响应头为唯一来源 | 安全官 |
| 13 | 安全(配置) | `NGINX_DOMAIN_GUIDE.md:84-94, 142-147` | Nginx `add_header` **继承陷阱**：静态资源 location 内各自定义了 `Cache-Control`，导致服务器级安全头（HSTS / X-Frame-Options / CSP / X-Content-Type-Options）**在这些 location 全部丢失** | 在每个 location 内重复安全头，或用 `map`/`include` 统一注入 | 安全官 |
| 14 | 安全(成本) | `routes/api.js:25` | `/api/ai/generate` 仅 `optionalAuth`，**匿名可无限调用付费 AI**（虽有 100 次/分/IP 限流，仍可放大为配额消耗 DoS）；而 `/ai/generate-batch` 反而要求登录——同文件对 edit-photo/cache 已加 admin，此处漏 | 引入按 IP/用户的 AI 日配额；`generate-batch` 提升为 `requireAdmin` | 产品官 + 安全官 |
| 15 | 性能/内存 | `services/storage.js:15, 125-130` | `citiesCache` 为**无上限普通 Map**，`addCity` 经 `POST /cities` 可无限写入（P1-13 的 LRU 改造未覆盖 storage） | 设 max 上限或城市白名单校验 | 调查员 |
| 16 | 部署风险 | `app.js:143` + `index.html:12` | **前端硬编码 `http://localhost:3001`**，且 CSP `connect-src 'self'` 阻止该地址 → 独立部署前端（如 Firebase）时生产必坏，仅靠本地数据降级兜底，AI 功能不可用 | base 改可注入配置或相对路径；CSP `connect-src` 加真实后端域名 | 质量门神 |

### 🟡 P2 — 一般（26 项，修复率目标 ≥90%）

| # | 类别 | 位置 | 问题描述 | 建议 | 来源 |
|---|------|------|---------|------|------|
| 17 | 设计/无障碍 | `style.css` 多处 | **8 组文本对比度未达 WCAG 2.1 AA**：accent/paper **4.07**、accent/surface 4.28、accent/accent-soft 3.52、muted-2/paper **4.38**、muted-2/paper-2 4.01、paper/accent 4.07、sage 徽章 3.13、gold 徽章 3.00 | 文本级 accent 改用 `--accent-text`(#9E3F2C, 6.14✅)；muted-2 加深至 #6E675E；badge 底色改 accent-text；sage→#566A4D、gold→#8A6A28 | 设计师 |
| 18 | 设计/响应式 | `style.css:970, 975` | **断点仅 2 档**（960/720px），要求 6 档（1920/1440/1024/768/375/414）；移动端触摸目标 40/42px **低于 48px**；`.hc-share`/`.photo-delete` 仅 22px、`.modal-close` 32px | 补 1024/768/375 断点 + 1440 宽版容器；移动端关键可点区 ≥48px | 设计师 + 质量门神 |
| 19 | 设计/动效 | `style.css` 35 处 | **71% 的 transition 使用 `transition: all`**，会过渡 box-shadow/border/color 等非合成属性触发重排重绘，是 60fps 最大风险；缓动多数为默认 `ease`；无 `will-change`；无 IntersectionObserver 滚动入场体系 | `all` 全部展开为显式属性；建立 `--ease-*` 令牌；卡片 hover 压到 200ms；关键动画加 `will-change:transform` | 设计师 |
| 20 | 设计/留白 | `style.css` 多处 | **无 `--space-*` 间距令牌**，魔法值遍布；间距值混用 2px/4px 倍数（22/26/18/14/10/6px 均为 2px 倍数），值集合 ≥15 个，远超获奖级精简度（通常 8 档内） | 定义 `--space-1..10`（4px 基）并全局替换；网格 gap 统一 | 设计师 |
| 21 | 设计/排版 | `style.css` 全站 | **23 档字号无体系**，含 12.5/13.5/14.5px **半像素漂移**；中段步进比仅 1.04-1.08（远低于 1.2 视觉区分阈值）；9px/10px 微观字号低于可读下限；`Songti SC` 仅 macOS，Windows 落到通用 serif 渲染劣化 | 建立 `--fs-*` 令牌 + 1.25 模数阶梯，收敛到 11 档；补 Windows CJK 回退链（`Source Han Serif SC`/`SimSun`）；标题加 `text-wrap:balance` | 设计师 |
| 22 | 设计/功能缺失 | `style.css` 全站 | **全站无暗色模式**（`prefers-color-scheme` / `data-theme` 零命中），系统暗色下仍渲染亮色。**注意：任务背景描述称"含暗色模式"，与代码不符** | 补 `prefers-color-scheme: dark` 变量组，或明确文档化"仅支持亮色" | 设计师 + 质量门神 |
| 23 | 后端并发 | `services/aiService.js:48, 71-77, 104-118` | `this.currentProvider` 为**进程级可变共享状态**，并发请求（不同城市/某 provider 故障）会互相覆盖造成串扰；provider 切换后递归重入同一实例，无并发隔离 | 每次调用用局部 provider 变量，禁止改实例状态 | 产品官 |
| 24 | 后端缓存 | `services/aiService.js:55-62` | 缓存 key `${city}-${JSON.stringify(preferences)}` **不含 provider**，切换 provider 后旧缓存仍命中，返回上一 provider 结果 | key 加入 `this.currentProvider` | 产品官 |
| 25 | 后端逻辑 | `services/socialService.js:187-207, 377-381` | Firestore 模式 `toggleLike`/`recordView` 对目标文档 `.update()`，目标不存在时（尤其 `cities` 集合以中文城市名为 docId，Firestore 中并无对应文档）抛错 → 接口 500 | 改用 `set(...,{merge:true})` 或先判存在；为 cities 建独立计数集合 | 产品官 |
| 26 | 后端逻辑 | `services/socialService.js:429-436` | 内存模式 `getViewStats` 返回全局 `this.counters.views`，与 targetId/timeRange 无关 → **任意目标浏览统计都相同** | 内存模式按 targetId 聚合计数 | 产品官 |
| 27 | 后端权限 | `services/authService.js:73` | 正常登录签发的 JWT **硬编码 `role:'user'`**，生产不存在任何 admin 用户 → 所有 `requireAdmin` 接口（cache 清理/sync/edit-photo/social-stats）**在生产永不可达** | 增加管理员判定（白名单 uid / Firebase Custom Claims） | 产品官 |
| 28 | 安全/信息泄露 | `server.js:87-100` | 静态根目录 = 项目根，敏感路径黑名单**未含 `.md` 文档** → `PROJECT_DELIVERY_REPORT.md`(72KB)、`API_DOCUMENTATION.md`、`FIREBASE_SETUP.md`、`NGINX_DOMAIN_GUIDE.md`、`系统说明和使用指南.md`、`start.bat` 可被匿名下载，泄露架构/部署细节 | 改白名单托管（只放行前端资源）；或扩展黑名单含 `*.md` | 产品官 + 安全官 |
| 29 | 安全/配置 | `render.yaml:21` | `CORS_ORIGIN="*"` 与代码 `allowedOrigins.includes(origin)` 精确匹配逻辑冲突 → **实际拒绝所有跨源请求**；若日后"修好"通配符支持将立即变成"通配符 + `credentials:true`"高危组合 | `render.yaml` 改显式前端域名；代码内显式拒绝 `*` | 安全官 |
| 30 | 依赖治理 | `backend/package.json` | **`multer`、`uuid`、`express-rate-limit` 三个依赖未被任何源码引用**（限流用的是 `validation.js:292` 自实现版）；`multer@1.4.5-lts.2` 属历史 DoS 公告集中对象 | 移除未用依赖；若需上传则升级 `multer@2.x` 并限制类型/大小/数量 | 产品官 + 安全官 |
| 31 | 后端功能缺失 | `routes/api.js` | **`/api/stats` 端点不存在**（实测返回 404 `{"success":false,"error":"接口不存在"}`），而 `系统说明和使用指南.md:57` 明确文档化了该接口；统计功能实际在 `/api/expanded/stats` | 补 `/api/stats` 路由或修正文档 | 质量门神 |
| 32 | 性能 | `services/storage.js:70-80`、`routes/api.js:444-470` | `getAllCities()` 每次调用重建 527 条完整对象（浅拷贝全表）；`/cities`、`/cities/all` 每请求 O(n) 全量分配，无请求级缓存 | 缓存不可变快照只读返回；或按字段投影 | 产品官 |
| 33 | 性能 | `data/expandedCitiesLoader.js:814-838`、`routes/api.js:641` | `/expanded/provinces`（无参）遍历 ~34 省份 × 527 城 ≈ **1.4 万次 `includes`**，每请求重复计算且无缓存 | 复用已有 `CACHE_DURATION` 机制缓存 5min | 产品官 |
| 34 | 后端逻辑 | `services/aiService.js:226-249` | 城市混淆检测**过于激进**：routes/title/foods 中出现任一其他已知城市名即置 `_cityMismatch=true`，前端会**整体回退本地数据**。像「西安→成都」「北京飞三亚」这类合法交通描述会误判，把正确攻略丢掉 | 仅检测"景点/美食主体"字段，或要求 ≥2 个其他城市且排除交通/出发地语境 | 产品官 |
| 35 | 稳定性 | `server.js:242-251` | `uncaughtException`/`unhandledRejection` 一律 `process.exit(1)`，任意未处理 Promise 拒绝即整进程退出（依赖 PM2 重启） | `unhandledRejection` 先告警+上报，仅在连续异常时退出 | 产品官 |
| 36 | 安全/凭证 | `services/weatherSync.js:18-19` + `.env.example:50-51` | 和风天气"专属域名等价于凭证"，但真实专属域名 `kp3h2rh7ab.re.qweatherapi.com` 作为**默认回退值硬编码**，且 `.env.example`（**已被 git 跟踪**）中同样出现 | 移除代码内硬编码回退（未配置即降级模拟）；`.env.example` 用占位域名 | 安全官 |
| 37 | 工程规范 | `.gitignore:29` | **文件名 typo**：写的是 `系统提示和使用指南.md`（"提示"），实际文件是 `系统说明和使用指南.md`（"说明"）→ 忽略规则失效，真实文档被提交入库 | 修正 typo | 调查员 |
| 38 | 工程规范 | `sw.js:2`、`backend/package.json:1` | 版本漂移：`sw.js` `CACHE_VERSION='v10.5'` 落后产品 v10.9.3（PWA 长期缓存旧资源）；`package.json` `version:"2.0.0"` 与产品 v10.9.3 脱节 | 统一版本号；补 git tag | 调查员 |
| 39 | 文档 | `系统说明和使用指南.md` | **11 处幽灵引用/失实**：`admin.html`、`app_backup.js`、`app_fixed.js`、`services/dataSync.js` **均不存在**；「50+城市」实际 527；称 `app.js` 是「旧版有语法错误」实为主逻辑文件（2671行）；「每5分钟刷新天气」但 `app.js` 无任何天气轮询定时器；API 表列出的 `/api/sync-weather/:name?`、`/api/sync/:name`、`/api/sync-all` **均不存在**，且完全未提及 41 个真实路由中的绝大多数 | 按当前代码重写文档；建立文档与代码的一致性检查 | 调查员 |
| 40 | 配置 | `backend/.env` vs `.env.example` | **键不对齐**：`.env` 仅 8 键，`.env.example` 有 23 键，缺 **FIREBASE_\***（→ 认证走降级）、**QWEATHER_API_URL/GEO_URL**（→ 天气回退到硬编码专属域名）、AMAP/通义/文心/OpenAI 等 | 对齐两份文件；补 `.env.example` 缺失键说明 | 调查员 |
| 41 | 测试 | `backend/vitest.config.js:19-27` | **覆盖率口径严重偏窄**：`include` 仅 5 文件。完全未纳入：`aiService.js`(671行)、`routes/api.js`(833行)、`middleware/validation.js`(396行)、`server.js`、`storage.js`、`weatherSync.js`、前端 `app.js`(2671行)。其中 storage/weatherSync **已有测试却不计入，等于白测**。**41 个路由 0 单测**，正是 P0#5/#6 长期漏网的原因 | 修正 include 覆盖面；补 validation 边界测试 → routes 用 supertest 集成测试 → socialService 降级分支 → aiService mock provider | 质量门神 |
| 42 | 测试 | `backend/vitest.config.js:21` | `include` 里的 `services/lruCache.js` **路径不存在**（真实文件在 `utils/lruCache.js`）→ 死配置，该文件靠 `utils/**/*.js` 侥幸覆盖 | 修正为 `utils/lruCache.js` 或删除 | 质量门神 |
| 43 | 安全/配置 | `offline.html:102, 118-121` | **离线页被 CSP 双重阻断**：`:102` 的 `onclick="location.reload()"` 内联事件处理器被 helmet 默认 `script-src-attr 'none'` 拦截；`:118-121` 的 `window.addEventListener('online', ...)` 内联 `<script>` 被 `script-src 'self'` 拦截 → 即便 SW 能注册，离线页的"重新连接"按钮与自动重连也**均失效**。与 P0#2 叠加，离线能力**双重不可达** | 把 `onclick` 改为 `addEventListener` 绑定的外部脚本，或为 `offline.html` 单独放宽 CSP（hash/nonce） | 安全官 + 质量门神 |

### 🟢 P3 — 建议（8 项，可列入 backlog）

| # | 类别 | 位置 | 问题描述 | 建议 | 来源 |
|---|------|------|---------|------|------|
| 44 | 死代码 | `routes/api.js:550-560` | `/cities/:name` 未挂 `optionalAuth`，`req.user` 恒 undefined，`if (req.user) recordView(...)` 永不执行 → 城市详情浏览从不记录 | 加 `authService.optionalAuth` | 产品官 |
| 45 | 逻辑 | `app.js:713, 717` | `parseUrlState` 对 `URLSearchParams.get()` 结果**二次 `decodeURIComponent`**，含 `%` 的值抛 URIError 被吞 → 分享链接静默失效 | 去掉二次 decode（URLSearchParams 已解码） | 产品官 |
| 46 | 死代码 | `app.js:127-135`、`routes/api.js:7` | `API.getTrending` 定义后从未调用；`api.js` 导入 `startWeatherSync` 未使用 | 删除或接线 | 产品官 |
| 47 | 工程规范 | 全项目 | **无任何 lint/格式化配置**（无 eslint/prettier/.editorconfig），魔法值/重复代码无自动化约束；`app.js` 单文件 2671 行未拆分 | 引入 ESLint + Prettier；拆分 `app.js` 为 render/api/state 模块 | 产品官 |
| 48 | 工程规范 | git | **无任何 git tag**（`git tag` 为空），却迭代了 v10.1→v10.9.3，发布不可追溯；提交 scope 不统一（大量裸 `feat:`/`fix:`） | 补 tag；统一 `类型(范围): 描述` 格式 | 调查员 |
| 49 | 代码质量 | `app.js` | **超长函数**：`renderGuide` **358 行**、`bindEvents` 209 行、`normalizeGuideData` 204 行、`hotelCompareLinks` 126 行；`renderGuide` 内模板嵌套达 4 层 map（缩进 6-7 级） | 拆分函数；抽 `links.push` 公共工厂（ticket 5 处/hotel 6 处同构） | 调查员 |
| 50 | 安全/信息泄露 | `server.js:164-169`、`ecosystem.config.js:6` | 404 处理器回显 `path: req.path`；cluster 双实例使**内存型限流/LRU 缓存按实例隔离**（有效阈值翻倍） | 404 不回显原始路径；限流/缓存改用共享存储或改单实例 | 安全官 |
| 51 | 其他 | `data/expandedCitiesLoader.js:224`、`backend/.npmrc:3`、`index.html` | MD5 指纹（非安全用途，建议换 sha256）；`.npmrc` 设 `audit=false` 关闭供应链审计；**无 OG/Twitter Card meta**（分享到微信无标题无预览图） | 换 sha256；恢复 `audit=true` 并接入 CI；补 OG 卡片 | 安全官 + 产品官 |

---

## 3. 8 维度设计评分汇总（Awwwards 标准，目标全部 ≥9）

| # | 维度 | 当前得分 | 关键差距 | 优先级 |
|---|------|---------|---------|--------|
| 4 | 色彩系统 | **6.0** | 8 组文本对比度未达 AA；大量非令牌硬编码色；无暗色模式 | **P0** |
| 7 | 响应式表现 | **6.5** | 断点仅 2 档（需 6 档）；触摸目标 40/42px < 48px | **P0** |
| 2 | 留白运用 | 7.0 | 无间距令牌；间距值混用 2px/4px 倍数 | P1 |
| 5 | 动效设计 | 7.0 | 71% 用 `transition: all`；缓动无令牌；缺滚动入场 | P1 |
| 6 | 微交互 | 7.0 | `:active` 仅 1 处；`:disabled`/`:invalid` 全缺 | P1 |
| 1 | 排版设计 | 7.5 | 23 档字号无体系（含半像素漂移）；缺 Windows CJK serif 回退 | P1 |
| 3 | 视觉层级 | 7.5 | accent 文本稀释权重；工具栏 6 按钮无主次；标题层级倒挂（结果页 h2 在 h1 前） | P2 |
| 8 | 原创性 | 8.0 | 概念强，但缺 `DESIGN.md` 推导文档 | P2 |
| — | **平均** | **7.06** | 距"全部 ≥9"缺口明显 | — |

---

## 4. 上线前 Go/No-Go 决策

### 🚫 阻塞项清单（7 项，全部修复前不得上线）

| # | 阻塞项 | 影响面 | 修复难度 |
|---|--------|--------|---------|
| 1 | 弹窗吸附左上角（`style.css:1329`） | 全部弹窗 UI | ⭐ 极低（改 1 行选择器） |
| 2 | CSP 阻断内联 SW 注册 → PWA 全废 | PWA/离线 | ⭐⭐ 低（脚本外置） |
| 3 | 375px 搜索表单溢出被裁 | 移动端核心入口 | ⭐⭐ 低（CSS 网格） |
| 4 | DOM XSS（`app.js:1598-1728`） | 安全 | ⭐⭐ 低（套 escapeHtml） |
| 5 | 天气接口恒返回 `{}`（`api.js:66/429/687`） | 核心功能 | ⭐ 极低（补 await） |
| 6 | `/weather/:city` 恒 400（`api.js:684`） | 核心功能 | ⭐ 极低（改参数名） |
| 7 | SW 缓存鉴权数据跨会话泄露（`sw.js:61-89`） | 隐私/安全 | ⭐⭐ 低（排除 /api/） |

### ↩️ 回滚预案

- **前端**：改动集中在 `style.css` / `index.html` / `app.js` / `sw.js` 四个文件，均无构建步骤。回滚方式为 `git revert <commit>` 后刷新浏览器；PWA 需注意 SW 缓存——回滚后须**提升 `sw.js` 的 `CACHE_VERSION`** 才能让客户端拿到旧版资源。
- **后端**：`routes/api.js` / `services/*.js` 改动可通过 `git revert` 回退并 `pm2 restart`；`backend/.env` 未纳入版本控制，回滚不影响环境配置。
- **数据库**：本次修复不涉及 schema 变更，无数据迁移，无回滚数据风险。
- **发布策略**：建议先在 Render 的 preview 环境验证 7 项阻塞项，再切生产；Nginx 侧改动（CSP 对齐、安全头补齐）须**先改配置并 `nginx -t` 校验**，再 reload。

---

## ✅ 行动清单（12 条）

| # | 行动 | 负责方 | 紧急度 | 预期产出 |
|---|------|--------|--------|---------|
| 1 | 修 `.modal` 误加 `position:fixed`（`style.css:1329` 选择器改 `.modal-overlay`） | 前端 | **P0** | 弹窗恢复居中，截图复核 |
| 2 | SW 注册脚本外置为 `pwa.js`，保持 CSP `script-src 'self'` | 前端 | **P0** | 控制台无 CSP 报错，SW 注册成功 |
| 3 | 修 375px 搜索表单溢出（`.day-pills` 换行 + grid `min-width:0`） | 前端 | **P0** | 375/414 视口无裁切 |
| 4 | 为 `app.js:1598-1728` 全部 AI 输出字段套 `escapeHtml()` | 前端 | **P0** | XSS 载荷测试通过 |
| 5 | `api.js:66/429/687` 补 `await`，`mergeWithWeather` 改 async | 后端 | **P0** | 天气字段返回真实对象，补单测锁定 |
| 6 | `api.js:684` 参数名对齐（改 `validateCityIdParam('city')`） | 后端 | **P0** | `/weather/:city` 返回 200 |
| 7 | `sw.js` fetch 拦截排除 `/api/*`，仅缓存静态白名单 | 前端 | **P0** | 登出后不返回旧数据 |
| 8 | 修正 `vitest.config.js` 覆盖率 include（覆盖 `routes/`、`middleware/`、`services/`），补 `validation.js` 边界测试 + `routes` supertest 集成测试 | 后端 | **P1** | 覆盖率提升至 ≥80%，锁定 #5/#6 |
| 9 | `weatherSync.js` 三处 axios 补 `timeout`；`storage.js` 缓存加 LRU 上限 | 后端 | **P1** | 无悬挂请求、内存有界 |
| 10 | 补 `preferences` 校验（origin 正则 + travelers/travelType/budgetRange 白名单） | 后端 | **P1** | prompt 注入通道关闭 |
| 11 | 对齐 Nginx CSP（去 `unsafe-inline`/`unsafe-eval`）+ 补齐各 location 安全头；`render.yaml` CORS 改显式域名 | 运维/安全 | **P1** | `nginx -t` 通过，安全头齐全 |
| 12 | 执行阶段五设计令牌化（色彩 AA 修复 + 6 档断点 + 间距/字号/缓动令牌 + `transition:all` 展开） | 设计+前端 | **P1** | 8 维度复评 ≥9 分，回写 `DESIGN.md` |

---

## ⚠️ 待完善 / 已知局限

1. **依赖漏洞未取得权威结果**：`npm audit` 在当前 registry（npmmirror）返回 `NOT_IMPLEMENTED`，且 `.npmrc` 设了 `audit=false`，沙箱无外网无法切官方源。安全官**未编造任何 CVE**，改用手动版本核对（express 4.22.1 / axios 1.15.2 / mongoose 8.23.1 / jsonwebtoken 9.0.3 / helmet 7.2.0 均较新；`multer@1.4.5-lts.2` 零引用且落后）。**建议在 CI 接入官方源 `npm audit`。**
2. **浏览器兼容性未实测**：本次仅用本机 Edge（Chromium）实测，未覆盖 Firefox / Safari。Chrome/Edge 结论可外推，**Firefox/Safari 待补测**。
3. **暗色模式事实澄清**：任务背景描述项目"含暗色模式"，但代码 `prefers-color-scheme`/`data-theme` **零命中**——**当前实现无暗色模式**，需确认是需求变更还是背景描述失准。
4. **后端冒烟为单次采样**：`/health` 14ms、`/api/cities` 6.3ms、`/api/trending` 4.3ms 为本地单次测量，非压测结果，不具备容量参考意义。
5. **阶段四（真实用户体验评估 / SUS 量表）与阶段六（竞品调研）尚未执行**：本次交付覆盖阶段一~三 + 设计审查（阶段五方案）。阶段四需在 7 项 P0 修复后执行，否则用户旅程会被已知缺陷污染。
6. **覆盖率 66.34% 为口径偏窄下的数字**：若把 `routes/api.js`、`aiService.js`、`app.js` 纳入统计，真实覆盖率将**显著低于** 66.34%。
7. **`backend/.env` 未读取内容**：仅确认其存在且从未入库，`JWT_SECRET` 是否为占位符**待人工确认**。
8. **P0#2 的生效前提（重要，已有实测证据）**：`offline.html` **没有 CSP meta**，其内联脚本仅在生产 Express 路径下被 helmet 响应头拦截。实测（`node backend/server.js` 后 `curl -D -`）：`/offline.html` 与 `/sw.js` **均返回 helmet CSP 头**，含 `script-src-attr 'none'` 与 `script-src 'self'`（无 inline）→ 缺陷在生产路径**确实存在**。而本地静态预览（`python -m http.server`，无 CSP）**看不到**该问题——**"测试环境未复现 ≠ 没问题"**。因此 P0#2 的验证必须在**经 `server.js` 或真实 Nginx 提供服务的环境**下进行。
   - 附带结论：`sw.js` 的 `CORE_ASSETS` 含 `/offline.html`，`cache.add()` 从同源 Express 抓取并缓存**带头响应**，离线时 `caches.match('/offline.html')` 返回的仍带头 → **外置脚本修复方案有效**，不会因缓存而策略漂移。
9. **点击劫持防护事实澄清（成员自我更正）**：`server.js:21-39` 的 helmet 配置**确实**包含 `frameAncestors: ["'none'"]`，helmet 默认还会下发 `X-Frame-Options: SAMEORIGIN` → **经 Express 统一部署时防点击劫持是生效的**（已由实测响应头二次印证）。此前"meta 传递的 `frame-ancestors` 被忽略"的说法仅适用于"前端由 Nginx/静态托管独立提供、未经过 `server.js`"的场景（该场景的风险已由 P1#12/#13 覆盖）。

---

## 📚 成员产出索引

| 成员 | 产出 |
|------|------|
| 🔍 product-reviewer（产品官） | 阶段一代码审查 22 条问题清单（含行号）+ 产品评审 5 点结论 |
| 🛡️ security-officer（安全卫士） | 15 条安全发现 + OWASP Top 10 检查表 + STRIDE 威胁建模 + 依赖版本核对 |
| ✅ qa-lead（质量门神） | `deliverables/gstack/QA_baseline_and_UI_report.md` + 17 张真实截图（`deliverables/gstack/screenshots/`）+ 页面×分辨率矩阵 + 覆盖率差距分析 + 后端冒烟结果 |
| 🎨 designer（设计师） | 8 维度评分与差距分析 + 阶段五完整优化方案（色彩/排版/组件/响应式令牌）+ 真实设计参考链接 |
| 🔧 investigator（排障手） | 健康检查 + 性能排查 10 条 + 代码质量诊断（超长函数清单）+ 待清理项清单 10 条 |

---

> 本报告由软件工坊 AI 协作生成，关键决策请由工程负责人复核。
> 所有 P0/P1 结论均经至少两名成员独立验证或主理人亲自复核（截图/源码），未编造任何数据。
