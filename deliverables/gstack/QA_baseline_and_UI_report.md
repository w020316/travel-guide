# QA 报告：测试基线核查 + 阶段三页面/界面检查

- 项目：行纪 · 中国城市旅行攻略生成器（`D:/xm/wz/travel-guide`）
- 执行人：qa-lead
- 方法：真实运行 vitest / 覆盖率、真实启动后端 curl 冒烟、真实浏览器自动化（Playwright + 本机 Edge）多视口截图
- 说明：**未修改任何源码**；截图见 `deliverables/gstack/screenshots/`

---

## 测试基线

### 单元测试（`npx vitest run`，backend/）
| 指标 | 实测值 |
|---|---|
| 测试文件 | **7 passed (7)** |
| 用例数 | **146 passed (146)** |
| 失败 | 0 |
| 跳过 | 0 |
| 总耗时 | **2.02s**（transform 359ms / setup 174ms / import 1.28s / tests 1.60s）|

测试文件：`aiProviders.test.js`、`authService.test.js`、`lruCache.test.js`、`safeLog.test.js`、`socialService.test.js`、`storage.test.js`、`weatherSync.test.js`

> 注：任务交接给出的基线为「5.42s」，本次实测为 **2.02s**（机器/缓存差异），用例数与通过数一致（146/146）。

### 覆盖率（`npx vitest run --coverage`，v8）
> ⚠️ 关键前提：`@vitest/coverage-v8` **并未安装**（不在 `node_modules`，也不在 `package.json` devDependencies，仅在 lockfile 的 peer 元数据中出现）。为取得真实数字，本次以 `npm install --no-save @vitest/coverage-v8@4.1.10` 临时安装（未写入 package.json）。**若不做此步，`--coverage` 直接报 `MISSING DEPENDENCY`。**

**汇总（真实数字）**

| 范围 | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| **All files** | **66.34** | **66.82** | **82.92** | **67.5** |

**逐文件**

| 文件 | % Stmts | % Branch | % Funcs | % Lines | 未覆盖行示例 |
|---|---|---|---|---|---|
| services/aiProviders.js | 100 | 96.42 | 100 | 100 | 250 |
| services/authService.js | 75.34 | 73.33 | 80 | 75.34 | 23-28,39-46,62-65,169-181,192-197 |
| services/socialService.js | **49.51** | 51.38 | 71.42 | 50.99 | 32-59,80-84,179-209,320-345,400-423,454-477… |
| utils/lruCache.js | 79.62 | 58.62 | 83.33 | 80 | 47,60-61,87-89,126-137 |
| utils/safeLog.js | 73.33 | 72.72 | 100 | 83.33 | 59-62 |

---

## 覆盖率差距分析（对照「核心业务模块 80%」目标）

**结论：整体语句覆盖率 66.34%，距 80% 目标差约 13.7 个百分点，未达标。**

1. **统计口径本身偏窄（首要问题）**：`vitest.config.js` 的 `coverage.include` 只纳入 5 个文件，以下**核心业务模块完全未纳入统计**（覆盖率数字为「不可见」而非「有覆盖」）：
   - `services/aiService.js`（671 行）— AI 编排核心，无任何测试
   - `routes/api.js`（833 行）— 全部 API 路由，无测试
   - `middleware/validation.js`（396 行）— 入参校验（安全关键），无测试
   - `server.js`（254 行）、`services/storage.js`、`services/weatherSync.js`、`services/realTimeSync.js`
   - 前端 `app.js`（2671 行）— 零覆盖
   - 其中 `storage.test.js`、`weatherSync.test.js` 已存在，却因未列入 include 而**不计入覆盖率**，等于白测。
2. **配置路径错误**：`include` 中的 `services/lruCache.js` 路径不存在，实际文件是 `utils/lruCache.js`（靠 `utils/**` 兜住）。该条目是**死配置**，易误导。
3. **拖后腿模块**：`socialService.js` 仅 49.51%（大量内存降级分支未覆盖）；`authService.js` 75.34%、`lruCache.js` 分支仅 58.62%。

**补测建议（按优先级）**
1. 修正 `include`：删除错误路径，补入 `services/aiService.js`、`routes/api.js`、`middleware/validation.js`、`services/storage.js`、`services/weatherSync.js`。
2. 为 `middleware/validation.js` 补边界/恶意输入用例（安全价值最高）。
3. 为 `routes/api.js` 用 supertest 补路由级集成测试（含 404/401/429）。
4. 提升 `socialService.js` 内存降级分支覆盖至 ≥80%。
5. `services/aiService.js` 用 mock provider 覆盖成功/超时/降级三条路径。

---

## 后端冒烟测试（真实响应）

启动：`cd backend && node server.js`（后台）。启动日志：MongoDB 不可用 → **内存存储模式，已加载 527 城市**；Firebase 未配置 → 认证/社交为本地/内存模式。

> ⚠️ 环境说明：本沙箱存在 HTTP 代理（`http_proxy=http://127.0.0.1:57513`），会拦截 localhost 请求返回 `502 upstream connect failed`。以下为加 `--noproxy '*'` 直连后的**真实结果**。

| 端点 | 状态码 | 耗时 | 大小 | 结果 |
|---|---|---|---|---|
| GET /health | 200 | 14ms | — | healthy，cityCount 527 |
| GET /api/cities | **200** | 6.3ms | 3233B | total 527，分页正常 |
| GET /api/stats | **404** | 4.7ms | 63B | `{"success":false,"error":"接口不存在"}` |
| GET /api/trending | **200** | 4.3ms | 750B | 返回成都/重庆/西安… |
| （补充）GET /api/expanded/stats | 200 | 20ms | 292KB | 统计功能实际在此路径 |
| （补充）GET /api/cities/all | 200 | 157ms | 257KB | — |
| （补充）GET /api/expanded/trending | 200 | 10ms | 6.4KB | — |

**发现**：**`/api/stats` 不存在（404）**。路由中只有 `/api/expanded/stats` 与需管理员权限的 `/api/social/stats`。若前端/文档依赖 `/api/stats`，需改路径或补路由。测试后进程已关闭（端口 3001 已释放）。

---

## 页面 × 分辨率矩阵

方法：Playwright（channel=msedge, headless）实测 + 元素级尺寸/溢出度量；✅ 正常 / ⚠️ 轻微 / ❌ 异常。

| 页面 / 区块 | 1920×1080 | 1366×768 | 768×1024 | 375×667 |
|---|---|---|---|---|
| Header / 导航 | ✅ | ✅ | ✅ | ✅（汉堡菜单正常） |
| Hero 主视觉 | ✅ | ✅ | ✅ | ✅ |
| 搜索表单（主输入） | ✅ | ✅ | ✅ | ✅ |
| 搜索表单（meta：出发地/目的地/日期/人数/天数/偏好/预算） | ✅ | ✅ | ✅ | ❌ 右列被裁切（见 UI-1） |
| 热门城市快捷 chips | ✅ | ✅ | ✅ | ✅ |
| 榜单列表 | ✅ | ✅ | ✅ | ✅（单列） |
| 结果页（海报+攻略） | ✅ | ✅ | ✅ | ✅（按钮换行正常） |
| 收藏弹窗 | ❌ 左上角吸附（见 UI-2） | ❌ 左上角吸附 | 未单独实测 | ❌ 顶部吸附 |
| 页面横向滚动条 | 无 | 无 | 无 | 无* |
| 控制台错误 | 2 | 2 | 2 | 2 |

\* 375px 无横向滚动条是**假象**：`body{overflow-x:hidden}`（style.css:48）把真实溢出裁掉了，内容实际被切（见 UI-1）。

**暗色模式**：全站**未实现** `prefers-color-scheme`/主题切换（style.css 无任何暗色规则，app.js 无主题逻辑）。实测 body 背景色在 `color-scheme: dark` 与 `light` 下**完全一致**（`rgb(250,247,242)`）→ 不存在「明暗不一致」，而是**系统暗色用户仍看到亮色界面**（见 UI-4）。

---

## UI 问题清单

| 序号 | 严重度 | 页面/区块 | 视口 | 表现 | 建议 | 截图 |
|---|---|---|---|---|---|---|
| UI-1 | **高(P1)** | 搜索表单 meta 区 | 375×667 | 2 列网格溢出：`.search-meta` 容器宽 281px，`scrollWidth=455px`；子项右边延伸到 502px（视口仅 375）。**目的地输入框、天数 pills（仅 1/2 可见，3/4/5/7 被裁）、预算/偏好被切掉**，且被 `body{overflow-x:hidden}` 静默裁剪无滚动条 → 移动端用户无法选择 3/4/5/7 天及完整字段 | 窄屏下让 `.day-pills` 可换行或允许横向滚动（`overflow-x:auto`）；给 grid 子项 `min-width:0`；天数用 `flex-wrap` | mobile-375-search-meta.png |
| UI-2 | **高(P1)** | 收藏弹窗（所有 modal） | 全部 | 弹窗吸附在**左上角**而非居中：实测 `.modal` rect = x0,y0,w560,h614（1366×768）。根因：style.css:1329-1333 把 `position:fixed; inset:0; z-index:1000` 误加到 **`.modal`（内层对话框）**，覆盖了 `.modal-overlay{place-items:center}` 的居中。注释本意是「阻止背景滚动」，应作用于 overlay | 将 1329 行选择器由 `.modal` 改为 `.modal-overlay`（overlay 已有 fixed+inset:0，勿重复） | desktop-favorites-empty.png / mobile-375-favorites-modal.png |
| UI-3 | **高(P1)** | PWA / Service Worker | 全部 | 控制台报错：`index.html:269` 内联脚本被 CSP 阻止（`script-src 'self' https://html2canvas.hertzen.com` 无 `'unsafe-inline'`/nonce/hash）。该内联脚本是**唯一的 Service Worker 注册点**（app.js 中无注册逻辑）→ **SW 永不注册，PWA 离线能力、离线提示、在线/离线 toast 全部失效**；sw.js/offline.html 形同死代码 | 二选一：①把内联脚本外置为 `pwa.js` 并 `<script src>` 引入；②CSP 加该脚本的 sha256 hash。推荐 ① | （控制台证据，见下） |
| UI-4 | 中(P2) | 全站 | 全部 | **无暗色模式**：系统设为暗色时页面仍为亮色（body 背景 dark/light 均为 rgb(250,247,242)）。meta theme-color 固定 `#C8553D` | 如需支持暗色，加 `@media (prefers-color-scheme: dark)` 变量覆盖；若不支持，至少在文档中说明「仅亮色」 | desktop-1366-dark.png（与亮色一致） |
| UI-5 | 中(P2) | 前端 API 调用 | 全部 | CSP `connect-src 'self'` 阻止跨源 API：控制台报 `Connecting to 'http://localhost:3001/api/ai/generate' violates connect-src 'self'`。且 app.js:143 `window.location.port==='3001' ? '' : 'http://localhost:3001'` —— **独立部署前端（如 Firebase Hosting）时硬编码指向 localhost:3001，生产必坏**。当前仅靠本地数据降级兜底（结果页显示「本地数据」徽标） | API base 改为可注入配置（同源相对路径 / 环境变量）；CSP `connect-src` 加入真实后端域名 | desktop-1366-after-generate.png |
| UI-6 | 低(P3) | 触摸目标 | 375/768 | 多元素 <48px：天数 pills 42×42、热门城市 chips 54×31、输入框高 38–40、导航链接 56×24、汉堡按钮 40×40 | 移动端将关键可点区域提升至 ≥44–48px（chips 高度、输入框高度） | mobile-375x667.png |
| UI-7 | 低(P3) | 收藏弹窗空态 | 桌面 | 空态下「清空收藏」「导出列表」仍可点击（应禁用/隐藏） | 空态时 `disabled` | desktop-favorites-empty.png |
| UI-8 | 低(P3) | CSP meta | 全部 | 控制台报 `frame-ancestors` 经 `<meta>` 传递被忽略。**更正（经 security-officer 复核）**：后端 `server.js:21-39` 已用 Helmet 下发 CSP **响应头**（含 `frameAncestors:['none']` + `X-Frame-Options: SAMEORIGIN`），**统一部署（Express 托管前端）下点击劫持防护生效**，meta 那条被忽略属无害冗余。**残余风险仅在"用 Nginx 直托管前端、不经 Express"时**：此时只剩 meta CSP → frame-ancestors 被忽略，仅剩 X-Frame-Options: SAMEORIGIN | 统一部署无需改；若走 Nginx 直托管，需在 Nginx 层下发 CSP 头 | （控制台证据 + server.js:21-39） |
| UI-9 | 中(P2) | offline.html（离线页） | 全部 | 该页 2 处会被 Helmet CSP 阻断：①`offline.html:102` `<button onclick="location.reload()">重新连接</button>` 内联事件属性 → 被 Helmet 默认 `script-src-attr 'none'` 阻断，"重新连接"按钮失效；②`offline.html:118-121` 内联 `<script>`（网络恢复自动 reload）→ 被 `script-src 'self'` 阻断。叠加 UI-3（SW 不注册）→ 离线页双重不可达。**仅在 Express/Helmet 生产路径暴露**（详见下方证据） | 把 onclick 改为 `addEventListener`；内联 script 外置为 offline.js；与 UI-3 同批修复（统一外置 pwa.js/offline.js，`script-src 'self'` 一项即可覆盖三处） | offline.html:102,118 |

**控制台错误原文（4 视口均出现，各 2 条）**
```
[ERROR] The Content Security Policy directive 'frame-ancestors' is ignored when delivered via a <meta> element. (index.html:11)
[ERROR] Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://html2canvas.hertzen.com'. ... The action has been blocked. (index.html:269)
```
> ⚠️ **测试口径说明（重要）**：本次页面检查前端用 `python -m http.server 8080` 静态托管，**未经过 Express 后端**，因此**没有 CSP 响应头**，只看到 `index.html` 的 meta CSP。这解释了为何 UI-8 初判为"无服务端 CSP"——**经 security-officer 复核已更正**：真实部署（`node backend/server.js`）下 Helmet 会下发完整 CSP 头，`frame-ancestors 'none'` 生效。UI-3/UI-5/UI-9 在内联脚本与 connect-src 两处**在两种托管方式下都成立**（meta 与响应头均未放开 inline / 跨源）。

**UI-9 生产路径硬证据（实测 `curl -D - http://localhost:3001/...`）**
```
=== /offline.html ===
HTTP/1.1 200 OK
Content-Security-Policy: ...;script-src 'self' https://html2canvas.hertzen.com;...;script-src-attr 'none';...
X-Frame-Options: SAMEORIGIN
=== /sw.js ===（同样带头）
Content-Security-Policy: ...;script-src 'self' ...;script-src-attr 'none';...
```
- **只在 Express/Helmet 路径暴露**：`offline.html` **自身无 CSP meta**，因此 `python -m http.server` 静态测试口径下**看不到**该缺陷（反而不阻断）；一旦走 Express（真实部署），响应头含 `script-src-attr 'none'` 与 `script-src 'self'` → 上述两处被阻断。**故"测试环境未复现"≠"没问题"。**
- **SW 缓存路径同样带 CSP 头**：`sw.js` 的 `CORE_ASSETS` 含 `/offline.html`，安装时 `cache.add('/offline.html')` 从同源 Express 抓取，缓存的响应**携带同一 CSP 头**；离线时 `caches.match('/offline.html')` 返回的仍是带头响应 → 外置脚本修复方案有效的前提成立。

---

## 截图清单（`deliverables/gstack/screenshots/`）
- 视口矩阵：`desktop-1920x1080(.png/-full)`、`desktop-1366x768(.png/-full)`、`tablet-768x1024(.png/-full)`、`mobile-375x667(.png/-full)`
- 状态/交互：`desktop-1366-dark.png`、`desktop-1366-dark-full.png`、`desktop-favorites-empty.png`、`mobile-375-navmenu.png`、`mobile-375-favorites-modal.png`、`mobile-375-search-meta.png`、`desktop-1366-after-generate.png`、`mobile-375-result.png`、`tablet-768-result.png`

## 总体结论
- 测试基线**健康**（146/146 通过），但**覆盖率 66.34% 未达 80% 目标**，且统计口径严重偏窄（aiService/routes/middleware/前端未纳入）。
- 后端核心接口可用，但 **`/api/stats` 不存在**。
- 前端存在 **3 个 P1 级真实缺陷**：移动端表单被裁切（UI-1）、弹窗错位（UI-2）、PWA/SW 被 CSP 阻断（UI-3），另有 CSP connect-src/硬编码 base 的生产部署风险（UI-5）。
