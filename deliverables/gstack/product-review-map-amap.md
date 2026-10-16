# PR 级代码审查：腾讯→高德地图切换（4 提交）

范围：ec4a7bb / fcdc97a / 35484e7 / 8ef9aac（main）
方法：`review` skill 结构 + 逐提交 diff + 现状源码核对 + `node --check` + config 用例实跑
复核结论：`node --check` app.js/server.js/api.js 全通过；`vitest run -t "config/map"` 2 passed。

---

## 结论（整体判断）

**可合入（Already verified on-line）**。地图区块已线上真实渲染，方向正确，无 Blocker。
但**建议追加一轮清理**：3 处陈旧注释未同步、前端地图逻辑零测试覆盖、测试与真实 env 耦合。
安全面新增 `'unsafe-eval'` 需安全侧登记取舍。

---

## 已确认正确 / 值得肯定的点

- ✅ 双 CSP（index.html meta + server.js helmet）本次**逐指令一致**，吸取上轮「改一处必须同步另一处」教训。
- ✅ `_AMapSecurityConfig` 在 `appendChild(script)` **之前**设置，满足「SDK 加载前」硬要求（首次加载路径）。
- ✅ PlaceSearch 15s 超时 promise **无 unhandled rejection**：reject 落在已 settle 的 promise 上为 no-op；同步抛错/超时路径均被外层 `try/catch` 捕获。
- ✅ 坐标统一 `[lng, lat]`；InfoWindow 内容经 `escapeHtml()`，XSS 防护到位。
- ✅ 单点搜索失败 `resolve(null)` 跳过，不阻断整体；无 Key 时给引导而非报错。
- ✅ 时序修复（先 `canvas.hidden=false` 再 `new AMap.Map`）方向正确——中间隔了 PlaceSearch 的 `await`，布局已完成，0x0 根因成立。

---

## 问题清单（按严重度）

### 🟠 Major

**M1. 陈旧注释/命名未随切换同步（可维护性）**
- 位置：`app.js:1829`「行程地图（腾讯地图 GL JS）」；`style.css:1868`「8. 行程地图（v11.2 腾讯地图 GL JS）」；`backend/server.js:23`「meta 放行 map.qq.com 后 SDK 仍被 helmet 头的 CSP 拦截」。
- 问题：代码已切高德，注释仍写腾讯/map.qq.com，误导后续维护者（尤其 server.js 那条是 CSP 教训备注，域名已失效）。
- 建议：三处同步为「高德地图 JS API 2.0」；server.js 注释改为泛指或示例域名。
- 严重度：🟠 Major（不影响运行，但属本 PR 应闭环的一致性）。

**M2. CSP 新增 `'unsafe-eval'`（安全面收窄）**
- 位置：`index.html` meta + `backend/server.js:31` script-src。
- 问题：为高德 2.0 引擎内部 eval 放行 `unsafe-eval`，削弱 CSP 防 XSS 纵深。
- 建议：作为**已知取舍登记**；评估是否有 nonce/hash 或非 eval 加载路径可收窄；后续评审时明示。
- 严重度：🟠 Major（安全）。**建议转 security-officer 评估。**

**M3. 前端地图逻辑零测试覆盖（覆盖缺口）**
- 位置：`backend/tests/` 仅后端单测；`initGuideMap` / `loadAMapScript` / `searchPoi` / 时序 均无覆盖；本轮 4 提交仅新增 1 行后端断言。
- 问题：本轮已因**时序 + WebGL 0x0 两次回补**，正是缺测试的典型症状，回归风险高。
- 建议：抽出 `searchPoi`/`loadAMapScript` 为可测纯函数，或补 jsdom 级单测覆盖「无 Key→引导」「城市搜不到→报错」「景点部分失败→跳过」。
- 严重度：🟠 Major。

**M4. 测试与真实 env 耦合（8ef9aac 属补丁而非根治）**
- 位置：`backend/tests/apiRoutes.test.js:209-218`；根因在 `backend/tests/setup.js` 加载 dotenv。
- 问题：用例只 `delete MAP_AMAP_KEY` 未删 SECRET → .env 真实值泄漏致断言失败，补丁只是「再删一个变量」。同类脆弱（顺序/环境相关）会复发。
- 建议：在 setup 里 pin 掉 `MAP_AMAP_*`（同 AI_TOTAL_BUDGET_MS 做法），或用例内快照并完整隔离 env。
- 严重度：🟠 Major（测试可靠性）。

### 🟡 Minor

- **m1. 冗余代码**：`if (loading) loading.hidden=true; canvas.hidden=false;` 在 `app.js:2149-2150` 与 `2198-2199` 重复（35484e7 上移后 2198-2199 已冗余）。建议删除后一处（DRY）。
- **m2. 节流描述与实现不符**：每个景点最多 2 次 PlaceSearch（`city+spot` 失败再 `spot`），两次之间无间隔；`300ms` 又固定加在每景点末尾（含最后一个）。实际 QPS 控制弱于注释「串行 + 300ms 间隔」。
- **m3. `mapReady` 守卫前置**：`app.js:2127` 在异步开始前即置 `'1'`，fetch 偶发失败后同页无法重试（只能刷新，与提示文案一致但体验差）。建议失败时重置。
- **m4. `onload` 未校验 `window.AMap`**：`app.js:2113` 若脚本被拦，`resolve(undefined)` → 后续 `TypeError`，错误信息不直观。建议 onload 内判断并 reject 明确错误。
- **m5. img-src 无 `https://*.amap.com` 通配**：connect-src 用了通配，img-src 只列具体域；若高德某图片资源走 amap.com 会被拦（线上已验证可用，属预防性对齐）。

### 🟢 Nit

- `addMarker` 返回值未被使用（centerPoi 调用忽略返回）。
- `new AMap.Map(canvas, { center: null })` 显式 null 可省略。
- ec4a7bb 提交信息含「13 区块序号连续」等与地图无关走查项，可精简。

---

## 最高优先级 3-5 条

1. 🟠 M2 CSP `unsafe-eval` → 交安全侧评估并登记（security-officer）。
2. 🟠 M3 前端地图逻辑零覆盖 → 补关键路径单测（本轮已两次回补）。
3. 🟠 M1 三处陈旧注释（app.js:1829 / style.css:1868 / server.js:23）→ 同步为高德。
4. 🟠 M4 测试与 .env 耦合 → setup 里 pin `MAP_AMAP_*`，根治而非打补丁。
5. 🟡 m1 删除 2198-2199 冗余显示语句。
