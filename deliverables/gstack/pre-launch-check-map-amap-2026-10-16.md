# 行程地图「高德化」上线前复核报告（腾讯 → 高德 JS API 2.0）

**日期**：2026-10-16
**场景**：上线前检查（Go/No-Go）+ 全流程复核（线上实测 + 代码审查 + 安全审计 + 下个迭代交付）
**参与成员**：产品官（gstack-product-reviewer）· 安全卫士（gstack-security-officer）· 质量门神（gstack-qa-lead）· 设计师（gstack-designer）
**范围**：ec4a7bb / fcdc97a / 35484e7 / 8ef9aac 四个提交 + 线上环境 https://travel-guide-w5cq.onrender.com

---

## 📌 TL;DR（执行摘要）
- **整体结论：🟢 通过（Go）。** 原「行程地图全功能上线、底图真实渲染、至此完整闭环」的结论起初**不成立**——线上实测证明**底图根本没有渲染**；经本轮修复（f8b60c5）并部署复测后，**底图已真实渲染，B1/B2 闭环，判定 Go**。
- **关键发现**：QA 在线上真实环境用浏览器自动化实测（成都），修复前地图区块为**纯灰空白底 + 只有图钉浮在上面**，无路网/地名。根因是 CSP 未放行高德 WebGL 渲染器域名 `jsapi-service.amap.com`，渲染器脚本被拦截 → 内部画布 0×0。（用户先前提供的「成功」截图 `map-amap-headed.png` / `map-amap-final.png` 经主理人亲自复核，实为同一空白底图，属把「图钉渲染」误判为「底图渲染」。）
- **阻塞项**：2 条（B1 底图不渲染 P0、B2 logo 破图 P1），**已修复（f8b60c5）→ 已部署 → 已线上复测通过**。
- **最终验证**：复测确认 WebGL 画布 0×0 → 1708×756、底图路网/地名正常、高德 logo naturalWidth 0 → 172、主阻塞 CSP violation 清零；标注/交互/序号/审图号回归全通过。

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| Go / No-Go | 🟢 Go（B1/B2 已修复、已部署、已线上复测通过） |
| 严重度分布 | 🔴 0（原 1 已闭环）/ 🟠 5 / 🟡 4 / 🟢 2 |
| 阻塞项 | 2 条已全部闭环（B1 底图渲染 ✅、B2 logo/POI ✅） |
| 关键行动项 | 7 条（前 2 条已完成） |
| 建议负责人 | 部署+复测：已完成 · 白名单/配额核验：项目所有者（待办） |

---

## 1. 各成员核心结论

### 🔍 产品官（代码审查 · 任务 #2）
- **核心判断**：**可合入，无 Blocker**。`_AMapSecurityConfig` 确实在 SDK 加载前设置；15s 超时 promise 无 unhandled rejection；双 CSP 本次逐指令一致；0x0 时序修复方向正确。
- **关键建议**：追加一轮清理 —— 三处陈旧注释未同步、前端地图逻辑**零测试覆盖**、测试与真实 `.env` 耦合（8ef9aac 属打补丁）。
- ⚠️ **须更正**：产品官报告称「地图区块已线上真实渲染」，该前提被 QA 实测推翻（审查时未独立验证线上、轻信了部署状态）。其代码层面结论仍有效，但「已渲染」的判断作废。

### 🛡️ 安全卫士（OWASP+STRIDE 审计 · 任务 #3 + CSP 修复 · 任务 #7）
- **核心判断**：**本轮 CSP 放宽可接受、可上线，无 P0**。两处 CSP 逐指令比对一致，浏览器取交集 → 生效策略为更严格的 helmet，无绕过；攻略渲染逐字段 `escapeHtml`，未发现确认 XSS 注入点。
- **关键建议**：①（P1）`/api/config/map` 明文下发 secret 属高德 2.0 固有设计，但 Referer 白名单**挡不住脚本化盗用**，风险为「Key 配额被盗刷」的经济型 DoS → 核验控制台白名单 + 设配额上限与告警；②（既有问题）`app.js:2429-2444` 海报生成 `JSON.stringify` 内联 `<script>` 未防 `</script>` 逃逸。
- **修复交付**：commit **f8b60c5** —— 放行 `jsapi-service.amap.com`（script-src，精确域名）+ `webapi.amap.com`/`*.amap.com`（img-src，通配），按资源类型分级最小权限。

### ✅ 质量门神（线上实测复核 · 任务 #1）
- **核心判断**：**🔴 不通过（有阻塞项）**。底图未渲染；标注/交互/序号/审图号正常。
- **关键建议**：修好 B1+B2（两处 CSP 同步放行）后预计可整体达标；当前不建议放行上线。

### 🎨 设计师（下个迭代 · 任务 #4）
- **核心判断**：地图「按天分色 + 路线连线」已设计并**在本地工作区实现**（未提交）：7 色板（刻意避开红系以保目的地红标最醒目）、`AMap.Polyline` 带方向箭头、左上角图例（≥2 天才显示）、`setFitView(overlays,…,maxZoom 15)` 更聚焦；无分天数据时退化回统一蓝标。
- **关键建议**：本迭代需在**底图恢复渲染后**再合入并目视实测（分色/连线依赖底图才能验证）。

---

## 2. 综合审查发现（去重合并，按严重度排序）

| # | 严重度 | 类别 | 位置 | 问题描述 | 建议 | 状态/来源 |
|---|--------|------|------|---------|------|---------|
| 1 | 🔴 | 功能/合规 | `backend/server.js:33` + `index.html:15` | `script-src` 缺 `jsapi-service.amap.com` → 高德 WebGL 渲染器被拦 → **底图不渲染**（画布 0×0、整块灰） | 两处同步追加该域名 | ✅ 已修 f8b60c5 / 质量门神 |
| 2 | 🟠 | 合规/品牌 | `backend/server.js:37` + `index.html:15` | `img-src` 缺 `webapi.amap.com`/`*.amap.com` → 高德 logo 破图 + POI 图标缺失 | 两处追加 `webapi.amap.com`、`*.amap.com` | ✅ 已修 f8b60c5 / 质量门神 |
| 3 | 🟠 | 安全 | `backend/routes/api.js:27-34` | `/api/config/map` 明文下发 secret；Referer 白名单仅防浏览器热链，挡不住脚本盗用 → 配额盗刷（经济型 DoS） | 核验控制台域名白名单 + 配额上限/告警；生产可改「代理服务器」方式 | ⏳ 待办 / 安全卫士 |
| 4 | 🟠 | 测试覆盖 | `backend/tests/`（前端地图逻辑） | `initGuideMap`/`loadAMapScript`/`searchPoi`/时序 **零覆盖**；本轮已因时序、0x0 两次回补 | 抽纯函数或补 jsdom 用例（无 Key→引导、城市搜不到→报错、景点部分失败→跳过） | ⏳ 待办 / 产品官 |
| 5 | 🟠 | 可维护性 | `app.js:1829`、`style.css:1868`、`backend/server.js:23` | 三处陈旧注释仍写「腾讯地图 GL JS」/「map.qq.com」，域名已失效、误导维护者 | 三处同步为「高德地图 JS API 2.0」 | ⏳ 待办 / 产品官+设计师 |
| 6 | 🟠 | 测试可靠性 | `backend/tests/setup.js`、`apiRoutes.test.js:209-218` | 用例与真实 `.env` 耦合（只删 KEY 未删 SECRET 致失败），8ef9aac 属打补丁非根治 | 在 setup 里 pin `MAP_AMAP_*`（同 `AI_TOTAL_BUDGET_MS` 做法） | ⏳ 待办 / 产品官 |
| 7 | 🟡 | 安全（既有） | `app.js:2429-2444` | 海报生成 `JSON.stringify` 内联 `<script>` 未防 `</script>` 逃逸；与 `unsafe-eval` 组合可放大 | 改 `postMessage`+`textContent` 或转义 `<` 为 `\u003c` | ⏳ 后续迭代 / 安全卫士 |
| 8 | 🟡 | 代码质量 | `app.js:2198-2199` | `35484e7` 上移后，`loading.hidden/canvas.hidden` 显示语句重复冗余 | 删除后一处 | ⏳ 待办 / 产品官 |
| 9 | 🟡 | 健壮性 | `app.js:2113` | `loadAMapScript` 的 `onload` 未校验 `window.AMap`，脚本被拦时 `resolve(undefined)` → 后续 `TypeError`，报错不直观 | onload 内校验并 reject 明确错误 | ⏳ 待办 / 产品官 |
| 10 | 🟡 | 健壮性 | `app.js:2127` | `mapReady` 在异步开始前置 `'1'`，fetch 偶发失败后同页无法重试（只能刷新） | 失败时重置守卫 | ⏳ 待办 / 产品官 |
| 11 | 🟡 | 一致性 | `app.js:2196` | 节流描述与实现不符：`300ms` 固定加在每景点末尾（含最后一个），QPS 控制弱于注释 | 修正注释或实现 | ⏳ 待办 / 产品官 |
| 12 | 🟢 | 安全 | `/api/config/map` | 限流 100/min/IP 对「本就可公开的接口」无实质防护 | 无需处理（认知对齐） | ℹ️ 安全卫士 |
| 13 | 🟢 | 待确认 | CSP `script-src` | 一个 `javascript:` URL 被 script-src 拦截（AMap 内部），影响未知 | 复核用途，如仅 logo 链接可忽略 | ⏳ 待确认 / 质量门神 |

---

## 3. 阻塞项清单 & 回滚预案（上线前检查专项）

### 阻塞项清单
| # | 级别 | 阻塞项 | 当前状态 |
|---|------|--------|---------|
| B1 | **P0** | `script-src` 缺 `jsapi-service.amap.com` → 底图不渲染 | ✅ 已修复（f8b60c5）→ 已部署 → 复测通过（画布 0×0→1708×756，路网/地名正常） |
| B2 | P1 | `img-src` 缺 `webapi.amap.com`/`*.amap.com` → 高德 logo 破图、POI 图标缺失 | ✅ 已修复（f8b60c5）→ 已部署 → 复测通过（logo naturalWidth 0→172，POI 拦截 0） |

> **判定**：B1+B2 均已闭环，线上地图达标，**判定 🟢 Go**。剩余 2 条低危 CSP 拦截（`mapplugin.amap.com` CDN 重定向检查、AMap 内部 `javascript:` URL）不影响功能；安全侧结论为**不追加**（保持 script-src 最小权限，不为非功能脚本扩大代码执行面），故 f8b60c5 即为本轮最终交付。

### 回滚预案
- 本次修复 **f8b60c5 仅改 CSP 响应头/`meta`（2 文件，+6/-3 行）**，无逻辑、无数据、无接口契约变更。
- 回滚方式：`git revert f8b60c5`（或 Render 控制台回滚到上一成功部署）。
- 回滚后影响面：仅回到「底图不渲染」的旧状态，**标注/交互/其他 12 个区块均不受影响**——回滚代价极低、无数据风险。

---

## ✅ 行动清单

| # | 行动 | 负责方 | 紧急度 | 备注 |
|---|------|--------|--------|------|
| 1 | ~~部署 f8b60c5（push main → Render 自动部署）~~ | 主理人 | ✅ 完成 | 已 push（35484e7..f8b60c5） |
| 2 | ~~线上复测：底图渲染 + logo/POI 图标 + CSP violation~~ | 质量门神 | ✅ 完成 | 🟢 通过，B1/B2 闭环 |
| 3 | 核验高德控制台域名白名单生效 + 设每日配额上限与用量告警 | 项目所有者 | P1 | 防 Key 配额被盗刷 |
| 4 | 同步三处陈旧注释为「高德地图 JS API 2.0」 | 开发 | P1 | app.js:1829 / style.css:1868 / server.js:23 |
| 5 | `setup.js` pin `MAP_AMAP_*`，根治测试与 `.env` 耦合 | 开发 | P2 | 替代 8ef9aac 打补丁 |
| 6 | 补前端地图逻辑单测（无 Key/城市搜不到/部分失败） | 开发 | P2 | 本轮两次回补的根因 |
| 7 | 清理 `app.js:2198-2199` 冗余 + `onload` 校验 + `mapReady` 重置 | 开发 | P2 | 低风险清理 |

---

## 4. 下个迭代交付（按天分色 + 路线连线）

- **状态**：已设计并实现于**本地工作区**（`M app.js`、`M style.css`，**未提交**，便于复核）。
- **设计要点**：7 色板（Day1 蔚蓝 #3d8bfd … Day7 石板灰 #94a3b8，超 7 天循环）；刻意避开红系以保证目的地红标 `#9e3f2c` 始终最醒目；`AMap.Polyline`（当天色、`showDir` 箭头、strokeWeight 4）；左上角半透明图例（≥2 天才显示）；`setFitView(overlays, false, [60,60,60,60], 15)`。
- **兼容性**：`data-days` 缺失/非 JSON/空 → 自动退化为原「统一蓝标」，不报错；`node --check app.js` 通过。
- **合入前置条件**：**必须在 f8b60c5 部署、底图恢复渲染后再合入**——否则分色与连线无法在线上目视验证。

---

## ⚠️ 待完善 / 已知局限

- 本次「地图已闭环」的原始判断来自**未在线上真实验证**（截图误读）；教训：**任何「已上线生效」的结论必须以真实环境实测为准，不能以本地/有头截图或部署状态推断**。产品官本轮也踩了同一坑，已记录。
- 高德 JS API 2.0 强制 `'unsafe-eval'`（引擎内部 eval）为**已知取舍**，属安全纵深削减但当前无确认注入点。
- `/api/config/map` 明文 secret 为高德 2.0 明文方案的固有设计，短期以「域名白名单 + 配额上限」缓解，长期建议评估「代理服务器」方式。
- P2 的 `javascript:` URL 拦截影响尚未确认。
- 下个迭代实现尚未经线上实测（底图现已恢复渲染，具备合入后实测条件）。
- 剩余 2 条低危 CSP 拦截（`mapplugin.amap.com`、AMap 内部 `javascript:` URL）不影响功能，未处理。

---

## 📚 成员产出索引

- 产品官（gstack-product-reviewer）原始产出：`deliverables/gstack/product-review-map-amap.md`
- 质量门神（gstack-qa-lead）原始产出：`deliverables/gstack/qa-map-verification-report.md`（初测 🔴）+ `deliverables/gstack/qa-map-retest-report.md`（复测 🟢）+ 截图 `deliverables/gstack/screenshots/qa-live-*.png`、`qa-live-after-*.png` + 原始数据 `qa-probe*-result.json`、`qa-probe*-after-result.json`
- 安全卫士（gstack-security-officer）原始产出：本报告第 1、2 节审计结论 + CSP 修复 commit **f8b60c5**
- 设计师（gstack-designer）原始产出：本报告第 4 节设计规格 + 本地工作区改动（`app.js`/`style.css` 未提交）+ 自检页 `D:/xm/wz/_gc_preview/map-palette.html`

---

> 本报告由软件工坊（GStack）AI 协作生成，关键决策请由工程负责人复核。
