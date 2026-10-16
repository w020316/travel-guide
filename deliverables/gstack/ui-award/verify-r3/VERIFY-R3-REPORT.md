# R3 独立复验报告 — 行纪 XING JI（gstack-qa-lead）

> 结论：**🟢 通过** ｜ 服务：`python -m http.server 3001`（127.0.0.1）｜ 引擎：Playwright + msedge（headless）
> 只读，未改任何仓库文件 ｜ 证据：`verify-r3/r3.js` `_r3.json` `_run.log` + 各断点 png

## 0. 速览
- **触摸目标：R1「首页 7 / 结果页 32」欠尺寸 → R3「0 / 0」**（fine 与 coarse 两种口径均 0）。硬伤已消。
- **功能回归：17/17 PASS**（含 R1 存疑的「返回顶部」，本轮稳定 PASS，`scrollYAfter=0`）。
- **新增无障碍：3/3 PASS**（footer 渲染、dialog 语义、skip-link 跳转）。
- **六档横向溢出：全 0**（首页+结果页）。
- **控制台：与基线一致**（501+404 各档 2 条，0 条 pageerror，无新增）。

## 1. 触摸目标全量复测（全量选择器：`a[href],button,input,select,[role=button],.pill,.style-pill,.qc-btn,.nav-link,.nav-menu-item,.suggestion-item,.history-chip,.icon-btn,.back-btn,.modal-close,.toast-action,.ext-link,.ra-link`）

| 口径 | 断点 | pointer:coarse | maxTouchPoints | 首页欠尺寸 | 结果页欠尺寸 |
|---|---|---|---|---|---|
| fine（默认） | 768 | false | 0 | **0** | **0** |
| fine | 414 | false | 0 | **0** | **0** |
| fine | 375 | false | 0 | **0** | **0** |
| coarse（hasTouch+isMobile） | 768 | true | 1 | **0** | **0** |
| coarse | 414 | true | 1 | **0** | **0** |
| coarse | 375 | true | 1 | **0** | **0** |

- 对照 R1：`首页 7（brand 38h、3×input 43–45h、3×select 40h）/ 结果页 32（back-btn 45×20、ext-link 57×27 ×28、ra-link 63×21 ×2）` → 现**全部达标**。
- 关键确认：R2 的 `.ext-link`/`.ra-link` 修复**不依赖 `pointer:coarse`** —— 它们同时写在 `@media (max-width:768px)` 的 5.3 块（L1859-1865），故在 **fine 口径下也生效**；
  5.4 的 `@media (pointer:coarse)`（L1889）仅额外补 `min-width`。两种口径实测均 0。
- headless 默认口径 = `pointer: fine`（已实测 `pointer.coarse=false, touchPts=0`）；已用 `hasTouch+isMobile` 模拟触摸口径复测，结论一致。

## 2. 功能回归（1440）

| # | 项 | 结果 | 证据 |
|---|---|---|---|
| 1 | 搜索联想下拉 | ✅ | `hidden=false, n=5, first=成都` |
| 2 | 联想回填并提交 | ✅ | `成` → `成都` |
| 3 | 生成→加载层出现 | ✅ | `sawLoading=true` |
| 4 | 结果页渲染 | ✅ | `#resultPage` 可见 |
| 5 | 结果页 13 区块完整 | ✅ | `sections=13, route-day=3, food-card=1, compare-card=11, mapBox=true, poster=true` |
| 6 | 工具条·收藏 | ✅ | `aria-pressed=true, favCount=1` |
| 7 | 工具条·复制文本 | ✅ | toast「攻略已复制到剪贴板」 |
| 8 | 工具条·分享链接 | ✅ | toast「攻略链接已复制…」 |
| 9 | 工具条·下载海报 | ✅ | 下载 `成都-2026-10-16-海报.png` |
| 10 | 工具条·查天气 | ✅ | 新窗口 + toast |
| 11 | 收藏弹层 开/关 | ✅ | open→closed |
| 12 | Toast 提示 | ✅ | 有节点、文案正确 |
| 13 | 返回顶部 | ✅ | `scrollYAfter=0`（R1 的 flake 未复现） |
| 14 | 工具条·再次生成 | ✅ | 回首页且回填「成都」 |
| 15 | 返回首页(backBtn) | ✅ | 首页可见、结果页隐藏 |
| 16 | 榜单渲染 | ✅ | 12 张卡 |
| 17 | 浏览历史 | ✅ | `#recentHistoryList` 1 条 |

**17/17 PASS。**

## 3. 新增无障碍回归（3/3 PASS）
- **footer 渲染** ✅：`footer.site-footer` 存在，高 139px，文案「行纪 XING JI · 行程与建议由 AI 结合 527 座城市数据库生成…」。
- **收藏弹层 dialog 语义** ✅：内层 `.favorites-modal` 具备 `role="dialog"` + `aria-modal="true"` + `aria-labelledby="favoritesModalTitle"`，且该 id 指向真实标题节点（可解析）。
- **skip-link** ✅：首个 Tab 停靠 = `A.skip-link[href="#homePage"]`；回车后 `location.hash=#homePage` 且 `document.activeElement.id=homePage`（`<main tabindex="-1">` 正确接收焦点）。

## 4. 六档横向溢出（scrollWidth / innerWidth）
| 断点 | 首页 over | 结果页 over |
|---|---|---|
| 1920 | 0 (1920/1920) | 0 (1920/1920) |
| 1440 | 0 (1440/1440) | 0 (1440/1440) |
| 1024 | 0 (1024/1024) | 0 (1024/1024) |
| 768 | 0 (768/768) | 0 (768/768) |
| 414 | 0 (414/414) | 0 (414/414) |
| 375 | 0 (375/375) | 0 (375/375) |

## 5. 控制台
- 各档 **2 条**：`501 (Unsupported method POST)`（后端缺失→按设计回退本地数据）+ `404 (File not found)`（预期）。
- `pageerror`：**0**。与 R1/R0 基线一致，**无新增**。

## 6. 结论与建议
- **🟢 通过**：R2 对触摸目标的修复**经全量选择器独立复验为真**（7/32 → 0/0，fine+coarse 双口径），且**未破坏任何既有交互**（17/17），新增无障碍三项均达标，六档溢出为 0。
- 遗留（非阻塞）：R1 提出的「≤414px Hero 末行 widow」本轮未在验证范围，如需可另行确认。
- 环境说明：`git status` 仍显示 `app.js` 有改动（地图区块，属更早工作），非 R2 范围。
