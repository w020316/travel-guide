# 阶段二上线冒烟报告 — v11.4 安全/逻辑修复（2026-10-17）

> 对象：https://travel-guide-w5cq.onrender.com ｜ 部署：`7d36492`（Render autoDeploy 本次正常，`main - travel-guide` 记录 `7134472619`，推送后约 2 分钟上线）
> 脚本：`qa-live-after-phase2.js`（成都）/ `qa-live-after-phase2-hz.js`（杭州变体）｜ 证据：`screenshots/live-after-phase2-*.png` + `live-after-phase2.json`

## 0. 结论：🟢 通过（附 1 条既有产品健壮性观察）

| 项 | 结果 |
|---|---|
| 部署指纹 | `/API_DOCUMENTATION.md` 由 200 → **404**（SEC-1 白名单生效）；`/` 200；`/app.js` 200 |
| 静态矩阵（20 路径） | 白名单 11 项 + `/health` 全 **200**；文档 / `start.bat` / `deliverables/**` 全 **404**；`.env` / `render.yaml` / `package.json` 全 **403** |
| 天气链路 | `/api/weather/成都` → `source=qweather`，实时 22°C 阴（axios 升级后真实上游正常） |
| AI 生成（API 级） | `POST /api/ai/generate`（成都）→ `source=ai`，**routes=3**（Day1 熊猫基地→武侯祠→锦里→春熙路），foods=6 |
| AI 生成（浏览器级） | 杭州全流程：结果页 + 地图 **16 景点按天分色 + 图例（第1/2/3天）+ 当日连线** ✅；UI 指纹 ✅；`pageerror=0` |
| 控制台已知噪音 | `mapplugin` / `javascript:` URL CSP 拦截 + 瓦片 `ERR_ABORTED` —— 均为已裁决既有项 / 正常取消，非本次引入 |

## 1. 观察：单次 AI 输出波动（既有产品健壮性项，非本次修复引入）

- 首次「成都」浏览器冒烟：AI 返回**美食有效、routes 为空** → 前端质量门 `isGuideDataValid` 的判据是「routes **或** foods 任一有效」→ 放行渲染（缺每日行程 / 地图区块）；同输入因 30 分钟缓存被复用，复跑仍无地图。
- 换城市（杭州）强制新生成 → 全流程正常；API 直调成都重新生成亦正常（routes=3）。→ 判定为**模型输出方差**，非代码回归。
- **建议（backlog V-6，非本轮阻塞）**：① 质量门改为「routes > 0 且 foods > 0」双必需（或 routes=0 时回退本地）；② 后端仅缓存通过结构校验的攻略；③ 可选：AI 输出 routes 缺失时自动重试一次。

## 2. 上线后待办（需人工）

- **Render 环境变量 `ADMIN_UIDS` 未配置**（需用户提供 Firebase UID，逗号分隔）→ 管理员端点当前仍 403（预期行为，非缺陷）。
- 其余非阻塞项 V-1~V-5 见 `02-fix-log.md` §六。
