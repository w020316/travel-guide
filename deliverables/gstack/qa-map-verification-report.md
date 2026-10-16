# 线上实测复核报告 · 高德地图切换（gstack-qa-lead / 任务 #1）

- 环境：https://travel-guide-w5cq.onrender.com （main 自动部署）
- 方法：真实浏览器自动化（Edge + Playwright），生成「成都」攻略后逐条实测；非只读代码
- 时间：2026-10-16 19:26–19:29（UTC+8）
- 脚本：deliverables/gstack/qa-map-probe.js、qa-map-probe2.js
- 原始数据：deliverables/gstack/screenshots/qa-probe-result.json、qa-probe2-result.json

## 总体结论：🔴 不通过（存在阻塞项）

地图「底图」在线上**没有渲染**（整块纯灰，只有标注图标）。根因是 **CSP 未放行高德 WebGL 渲染器脚本域名**。
标注与 InfoWindow 交互本身正常，区块序号正常，但底图缺失 + 高德 logo 破图属于必须修复的阻塞项。

---

## 逐条断言复核

### 1. 地图真实渲染（底图非全灰、非 0x0）—— ❌ 不通过
- **实测**：地图容器已显示且有尺寸，但内部 **WebGL 画布为 0×0**，底图完全空白（整块浅灰），仅标注可见。
- **证据**：
  - `#gcMapCanvas` clientWidth/Height = **854 × 378**（容器尺寸 OK，说明 35484e7「先显示容器」的修复生效）
  - 内部渲染画布 `#gcMapCanvas canvas` = **width 0 / height 0 / client 0×0**（未初始化）
  - 控制台 CSP 拦截：`Loading the script 'https://jsapi-service.amap.com/mapsplugincdn?...&cls=WebGLRender...' violates ... "script-src ..."` ← **高德 2.0 底图渲染器模块被拦截**
  - 截图 `qa-live-map-成都.png`（854×378 区块，纯灰 + 标注）
- **判定**：❌ 底图未渲染，属核心功能不达标。

### 2. 标注数量（目的地红标 1 + 景点蓝标 12）—— ✅ 通过
- **实测**：DOM 内 `.amap-marker` 共 **13 个** = 1 个目的地（红，title=成都市，28×40）+ **12 个景点**（蓝，24×34）。
- **证据**（qa-probe-result.json `map.markers[]`，12 个景点 title）：
  宽窄巷子景区 / 人民公园 / 春熙路步行街 / 成都太古里 / 奎星楼街 / 成都大熊猫繁育研究基地 / 成都武侯祠博物馆 / 锦里古街 / 玉林街 / 成都杜甫草堂博物馆 / 青羊宫 / 文殊院
- 与副标题「目的地与 **12** 个行程景点」一致（`data-spots` 解析 = 12）。截图 `qa-live-map-成都.png` 目视亦为 1 红 + 12 蓝。
- **判定**：✅ 通过。

### 3. 交互（点击标注弹 InfoWindow 显示景点名）—— ✅ 通过
- **实测**：用**真实鼠标事件**点击标注后，`.amap-info` 出现并显示景点名「奎星楼街」。
  - 注：probe#1 用 `element.click()` 程序化点击为**假阴性**（AMap 需真实鼠标事件）；probe#2 用 Playwright `page.mouse.click` 后正常弹出。
  - 该点位标注高度重叠，命中的是叠放最上层的「奎星楼街」，非坐标下第一个 marker，属重叠所致，非缺陷。
- **证据**：`qa-probe2-result.json` `infoAfterMouse.present=true, text="奎星楼街×"`；截图 `qa-live-infowindow-成都.png`。
- **判定**：✅ 通过。

### 4. 合规（高德审图号 / 版权标识）—— ⚠️ 存疑（审图号 OK，logo 破图）
- **审图号：✅ 由 SDK 自带控件渲染，非硬编码。**
  - DOM `.amap-copyright` 文本 = `© 2026 AutoNavi - GS(2025)5996号`，display:block / visibility:visible，尺寸 176×16（随图可见）。
  - 源码 `app.js / index.html / style.css` 中**检索不到** `GS(2025)` / `5996` 硬编码 → 确认由高德 SDK 版权控件动态渲染。
- **高德 logo：⚠️ 被 CSP 拦截成破图。**
  - `.amap-logo img` src=`https://webapi.amap.com/theme/v2.0/logo@2x.png`，`naturalWidth=0`（加载失败），截图左下角为**破图图标**。
  - 控制台：`Loading the image 'https://webapi.amap.com/theme/v2.0/logo@2x.png' violates ... "img-src ..."`。
  - 另有 `https://o4.amap.com/icon/...` POI 图标同样被 img-src 拦截（影响底图 POI 图标）。
- **判定**：⚠️ 审图号合规呈现，但高德 logo（品牌/合规要求的一部分）缺失，需修复。

### 5. 区块序号（00→03…连续无跳号）—— ✅ 通过
- **实测**：`.gc-section` 序号连续：`00 天气情况 → 01 每日行程 → 02 行程地图 → 03 必尝美食 → 04 费用预算 → 05 实用贴士 → 06 住宿推荐 → 07 酒店民宿比价 → 08 交通指南 → 09 票务比价·火车票/机票 → 10 景点预约提醒 → 11 打卡机位推荐 → 12 旅拍相册·AI 修图`。
- **证据**：`qa-probe-result.json` `sections[]`。
- **判定**：✅ 通过。

### 6. 无控制台报错 —— ❌ 不通过（有 CSP violation）
- **实测**：**0 个 pageError**（无未捕获异常 ✅），但存在 **14+ 条 CSP violation console.error**：
  1. `script-src` 拦截 `https://jsapi-service.amap.com/mapsplugincdn?...cls=WebGLRender`（**导致底图不渲染**）
  2. `img-src` 拦截 `https://webapi.amap.com/theme/v2.0/logo@2x.png`（logo 破图）
  3. `img-src` 拦截 `https://o4.amap.com/icon/...`（POI 图标，4 类）
  4. `script-src` 拦截一个 `javascript:` URL（AMap 内部）
- 另：约 275 条 `https://jsapi-data{1-5}.amap.com/tile/...pbf/... :: net::ERR_ABORTED`（矢量瓦片请求被中止，与渲染器被拦一致）；16 条 `fonts.gstatic.com ... net::ERR_FAILED`（本地网络/字体源不可达，**非产品 CSP 缺陷**，font-src 已放行 gstatic）。
- **判定**：❌ CSP violation 存在（pageError 为 0）。

---

## 阻塞项（按优先级）

| # | 级别 | 问题 | 位置 | 修复建议 |
|---|------|------|------|----------|
| B1 | **P0** | `script-src` 未放行 `https://jsapi-service.amap.com` → WebGL 渲染器被拦，**底图不渲染** | `backend/server.js:31`（helmet）+ `index.html:15`（meta） | 两处 `script-src` 均追加 `https://jsapi-service.amap.com`（或 `https://*.amap.com`） |
| B2 | **P1** | `img-src` 未放行 `https://webapi.amap.com`、`https://o4.amap.com` → 高德 logo 破图 + POI 图标缺失（合规/品牌） | 同上两处 `img-src` | 追加 `https://webapi.amap.com https://*.amap.com`（`*.amap.com` 已覆盖 o4/jsapi-data 等） |
| B3 | **P2** | `javascript:` URL 被 `script-src` 拦截（AMap 内部），需确认是否影响功能 | CSP script-src | 复核 AMap 用途；如仅 logo 链接可忽略，否则需评估 |

> 说明：`connect-src` 已含 `https://*.amap.com`，可覆盖 `jsapi-data*.amap.com` 矢量瓦片，无需改动。
> meta CSP（index.html）与 helmet 头（server.js）**两处均需同步修改**，只改一处仍会被更严格者拦截。

## 非阻塞观察
- 地图容器尺寸修复（35484e7）已生效：`#gcMapCanvas` = 854×378（非 0×0）。真正 0×0 的是被 CSP 拦掉渲染器后的内部画布。
- `fonts.gstatic.com` 16 条加载失败：本地网络环境导致，非产品缺陷。
- 标注/InfoWindow/区块序号/审图号均正常，修复 B1+B2 后预计可整体达标。

## 截图清单（deliverables/gstack/screenshots/）
- `qa-live-map-成都.png`（854×378，底图空白 + 1 红 12 蓝标注 + 审图号 + 破图 logo）
- `qa-live-infowindow-成都.png`（点击标注弹出「奎星楼街」InfoWindow）
- `qa-live-map-成都-infowindow.png`（probe#1 地图区块，无 InfoWindow）
- `qa-live-result-成都.png`（1440×900 结果页全貌）
- `qa-probe-result.json` / `qa-probe2-result.json`（原始诊断数据）

## 复现步骤
1. 打开 https://travel-guide-w5cq.onrender.com
2. 城市输入「成都」→ 点「生成攻略」→ 等待结果页
3. 滚到「02 行程地图」→ 观察底图为纯灰（无路网/地名）
4. DevTools Console 可见 `jsapi-service.amap.com ... WebGLRender ... violates script-src`
