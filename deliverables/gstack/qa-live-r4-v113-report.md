# 线上复验报告 — R4 UI + v11.3 地图按天分色（2026-10-17）

> 对象：https://travel-guide-w5cq.onrender.com ｜ 部署：`dep-db952omq1p3s73cs9s90`（手动触发 → live）
> 脚本：`qa-live-after-r4-v113.js` ｜ 证据：`screenshots/live-after-*.png` + `live-after-r4-v113.json`

## 0. 结论：🟢 通过（指纹 + 全流程 + 视觉三重确认）

| 项 | 结果 |
|---|---|
| 部署指纹（轮询确认） | `index.html` 含 `hero-aside` ✅（UI R1–R4 上线）；`app.js` 含 `AMAP_DAY_COLORS` ✅（v11.3 上线） |
| UI 指纹（DOM 实测） | `.hero-aside` / `.ink-scroll` / `.ink-route` 存在且可见 ✅ |
| 生成攻略全流程 | 结果页正常渲染（线上 AI 链路）✅ |
| 地图按天分色 | 副标题「按天分色，连线为当日游览路线」✅ · 图例「第1天 第2天 第3天」可见 ✅ · `#gcMapCanvas` 渲染 ✅ · 非引导/错误态 ✅ |
| 视觉抽检 | `live-after-map-daycolor.png`（三色标注 + 当日连线 + 图例）；`live-after-home-r4.png`（立轴装置在线） |

## 1. 过程备注

- **Render autoDeploy 未触发**（推送后约 7 分钟无部署记录，与既有记录的偶发问题一致）→ 用持久登录 Edge（`D:\xm\edge-render`）控制台 Manual Deploy 兜底（`render-manual-deploy.js`，截图 `render-service.png` / `render-deploy-triggered.png` / `render-deploy-status.png`），构建约 2 分钟完成。
- GitHub Pages 镜像（`w020316.github.io/travel-guide`）随推送自动更新成功（`hero-aside` 指纹命中）。

## 2. 控制台观察（均为既有已裁决项 / 无功能影响）

- `mapplugin.amap.com` 与 `javascript:` URL 被 CSP 拦截（console.error）—— **10-16 安全侧已裁决为「已知噪音：不阻塞、不修复」**（见 `qa-map-retest-report.md`：为其放宽 script-src 会扩大代码执行面，不划算）。
- `jsapi-data*.amap.com` 瓦片请求 `ERR_ABORTED` — 加载期视图变化/会话结束时的正常取消；地图完整渲染。
- **pageerror = 0**；本次两笔代码提交未触碰 CSP（`git diff` 核对为空）。
