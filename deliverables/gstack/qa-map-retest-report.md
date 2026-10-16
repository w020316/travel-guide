# 复测报告 · f8b60c5 部署后（gstack-qa-lead / 任务 #8）

- 环境：https://travel-guide-w5cq.onrender.com （main 自动部署）
- 部署确认：轮询响应头，第 3 次（19:36:25）`content-security-policy` 出现 `jsapi-service.amap.com` → 新版本已上线，方开始复测
- 方法：Edge + Playwright 真实浏览器，生成「成都」攻略实测；`serviceWorkers:'block'` 避免 SW 缓存旧版本
- 脚本/数据：deliverables/gstack/qa-map-probe.js、qa-map-probe2.js；screenshots/qa-probe-after-result.json、qa-probe2-after-result.json

## 总体结论：🟢 通过（B1/B2 已闭环，可判 Go）

底图已真实渲染，logo 恢复，标注/交互/序号/审图号全部回归通过。仅剩 1 项低危残留（mapplugin 脚本被拦，不影响功能）。

---

## 逐条判定

### 1. 底图真实渲染（B1）—— ✅ 通过
- 内部 WebGL 画布由 **0×0 → 1708×756**（client 854×378）；底图可见路网（橙色高速）、地名（彭州市/广汉市/新都区/青白江区/金堂县/温江区/崇州市/大邑县/双流区/龙泉驿区/郫都区/成都）、绿色地形轮廓。
- 证据：`qa-live-after-map-成都.png`（160KB，较修复前 19KB 纯灰图信息量显著提升）；`qa-probe-after-result.json` `innerCanvases=[{w:1708,h:756,cw:854,ch:378}]`。
- **判定**：✅ B1 闭环。

### 2. logo / POI 图标（B2）—— ✅ 通过
- `.amap-logo img` `naturalWidth=172`、`complete=true`（修复前 =0 破图）；截图左下角「高德地图」logo 正常显示。
- `o4.amap.com` POI 图标 CSP 拦截数：**0**（修复前 4 类）。
- 证据：`qa-probe-after-result.json` `logo.naturalW=172`；`qa-live-after-infowindow-成都.png` 左下角 logo 可见。
- **判定**：✅ B2 闭环。

### 3. CSP violation —— ⚠️ 主阻塞清零，剩项均为已知噪音（不阻塞、不修复）
- 已消除：`jsapi-service.amap.com`（WebGLRender）✅、`webapi.amap.com/theme/.../logo@2x.png` ✅、`o4.amap.com/icon/...` ✅。
- **剩余（已知 CSP 噪音，安全侧决策「不追加、不修复」）**：
  - `https://mapplugin.amap.com/maps/checkredirectcdn?...`（script-src，×2）—— 高德 CDN 重定向检查脚本；**被拦时底图与全部功能正常**，属非必需脚本。安全侧结论：为它放宽 script-src 会扩大代码执行面，**不划算，建议不追加**（若主理人坚持清屏，只加精确域名 `https://mapplugin.amap.com`，**禁止** `https://*.amap.com`）。
  - `javascript:` URL（script-src，×2）—— 上轮既有项，与本轮地图改动无关，无功能影响。
- 另有 `jsapi-data{1-5}.amap.com/tile/...pbf` 约 295 条 `net::ERR_ABORTED`：瓦片请求中止，但底图已渲染（属地图收敛后取消的冗余请求），非拦截。
- **判定**：✅ 主阻塞已消除；剩余项标注为**已知噪音 / 不阻塞 / 不修复**，不作为待办。

### 4. 回归确认 —— ✅ 通过
- **标注**：本代攻略副标题 = 「9 个行程景点」，实际 `.amap-marker` = **10 个**（1 红目的地「成都市」+ 9 蓝景点，**全部落标**）。标注数与副标题一致（上轮 12 为本代内容差异，非缺陷）。
- **InfoWindow**：真实鼠标点击标注 → 弹出 InfoWindow「成都大熊猫繁育研究基地」。证据：`qa-live-after-infowindow-成都.png`、`qa-probe2-after-result.json` `infoAfterMouse.present=true`。
- **区块序号**：00 天气情况 → 01 每日行程 → 02 行程地图 → 03 必尝美食 → 04 费用预算 → 05 实用贴士 → 06 住宿推荐 → 07 酒店民宿比价 → 08 交通指南 → 09 票务比价 → 10 景点预约提醒 → 11 打卡机位推荐 → 12 旅拍相册，连续无跳号。
- **审图号**：`© 2026 AutoNavi - GS(2025)5996号` 可见（176×16）。
- **pageError**：0（无未捕获异常）。

---

## 结论与建议
- **B1/B2 已闭环，地图功能线上达标，可判 Go。**
- 残留 CSP 报错（`mapplugin.amap.com` 与 `javascript:` URL）经安全侧评估为**已知噪音：不阻塞、不修复**，不作为待办项。

## 截图清单（deliverables/gstack/screenshots/）
- `qa-live-after-map-成都.png`（底图已渲染 + 标注）
- `qa-live-after-infowindow-成都.png`（底图 + 点击弹 InfoWindow）
- `qa-live-after-map-成都-infowindow.png`（probe1 地图区块）
- `qa-live-after-result-成都.png`（结果页全貌）
- `qa-probe-after-result.json` / `qa-probe2-after-result.json`（原始诊断）
