# R3 复验 — 60fps + 无障碍（行纪 XING JI）

> 审计：gstack-investigator ｜ 只读，未改任何源文件 ｜ 服务：`python -m http.server 3001`
> 数据：`r3/perf-report.json` `r3/a11y-report.json` `r3/a11y2-report.json` `r3/a11y3-report.json` `r3/skip-link.png`
> 脚本：perf.js / ink-check.js / a11y.js / a11y2.js / a11y3.js / skip-check.js / modal-nav-check.js / navfocus-check.js / favfocus-check.js

## 一、性能 / 60fps — 达标（与 R1 持平）

| 场景 | 平均FPS | p95帧 | 最大帧 | 掉帧>33ms | 长任务>50ms | Layout | RecalcStyle |
|---|---|---|---|---|---|---|---|
| 首页·覆盖层开 | 60.0 | 16.9ms | 17.0ms | 0 | 0 | 0s | 0.038s |
| 首页·覆盖层关 | 60.0 | 16.8ms | 16.9ms | 0 | 0 | 0s | 0.020s |
| 结果页 | 60.0 | 16.8ms | 16.9ms | 0 | 0 | 0s | 0.003s |

### 新增 `.ink-scroll` SVG 装置 — 零开销（实测隔离）
- 计算样式快照：`.ink-scroll-svg` / `.ink-route` / `.ink-sun` 均 `animationName:none, willChange:auto, filter:none, transform:none` → **纯静态 SVG**（21 个图形节点）。唯一动效在父层 `.hero-aside`（`heroAsideIn` 1.1s，仅 opacity+transform，一次性、合成层）。
- 开/关对照（隐藏整个 `.hero-aside`）：RecalcStyleCount **211 → 211**（完全相同）、LayoutDuration 均 0 → **无可测重绘/合成开销**。
- 结论：R2 的 SVG 插画与 Hero 装饰未引入任何滚动成本。

### prefers-reduced-motion 降级 — 仍正确
- `animation-duration`/`transition-duration` 实测归 `1e-05s`；`.reveal` 全部可见（`allVisible:true`）；`initScrollReveal()` 直接 return（`revealCount:0`）。

## 二、无障碍逐项复核

| R1 缺口 | R2 声称 | 实测结论 |
|---|---|---|
| 无 skip-link | L39 新增 | ✅ **首个 Tab 即命中** `.skip-link`；聚焦后 `top:-80px→16px`（滑入可见，126×49）、`outline 2px #9E3F2C`；回车 → 焦点落到 `MAIN#homePage`(tabindex=-1)，`scrollY 69` |
| 无 footer landmark | L280 新增 | ✅ landmarks `footer:1`（contentinfo）暴露 |
| 弹层无对话框语义 | 补 role/aria-modal/labelledby | ✅ 内层 `.modal` 实测 `role=dialog, aria-modal=true, aria-labelledby=favoritesModalTitle`（→「我的收藏」）；焦点陷阱仍有效（12 次 Tab 不逃逸）、Esc 关闭、焦点归还 `navFavoritesBtn` |
| nav 用 role=menu | 改普通链接 | ✅ 现为 `<nav aria-label="移动端导航">`；roles 列表已无 menu/menuitem |
| nav-menu-item 焦点环被移除 | 补可见环 | ✅ 键盘 Tab 实测 `outline solid 2px #9E3F2C off -2px`，`:focus-visible` 命中 |
| fav-search-input 环用 accent-soft(1.16:1) | 改 accent-text | ✅ 实测双层环 `paper 0 0 0 2px + #9E3F2C 0 0 0 4px`（6.14:1）；border 转 accent-text |
| 关闭按钮名为「×」 | — | ✅ 现 `aria-label="关闭收藏弹层"` |
| favSearchInput 未标注 | — | ✅ 现 `aria-label="搜索收藏的城市或标题"` |

### 对比度 — 全部通过 AA（0 项失败）
- 首页 17 项（min **5.22**：ranking-foot）；结果页 11 项（min **5.30**）；徽章 5 项（min **4.95**，较 R1 的 4.63 提升：官方 5.30 / 比价 4.95 / 本地 4.95 / 民宿 4.95 / 通用 5.30）；结果页扩展 20 项全过。
- 注：`.hero-vtext` 因 R2 重构 Hero 落款而不再存在（`missing`，非失败）。

### 其他
- 缩放 200%（720/640）：横向溢出 0、无裁切 ✅。
- `emptyButtons: []`、`aria-hidden` 内无可聚焦元素 ✅；`lang=zh-CN`、无 `<img>`（0 张）✅。

## 三、仍存在的 Level A 缺口（需 app.js，本轮未做 — 如实记录）

1. **`#searchSuggestions` listbox 未补全**：`role="listbox"` 但子项 `.suggestion-item` 无 `role="option"`（`optionCount:0`），输入框无 `aria-activedescendant`/`aria-expanded`/`aria-autocomplete`（键盘上下键/回车已实现，仅缺 ARIA 映射）→ 4.1.2。
2. **结果页正文标题 h2→h4 跳级**：`行前准备`、`如何到达` 等（序列 [1,2,…,4,4,4,…]，无 h3）→ 1.3.1。

**🟡 残留（非 Level A）**：`#photoInput`（file）仍无 label/aria-label（父 `.upload-area` 仅视觉文案）。

## 四、总体结论
R2 对 R1 指出的 **6 项语义/焦点缺口全部修复并实测通过**（skip-link / footer / dialog 语义 / nav 语义 / 两处焦点环 / 两处控件标注）。**60fps 全程达标、零掉帧、零长任务**，新增水墨 SVG 装置经隔离实测**零开销**，reduced-motion 降级正确。**仍存 2 项 Level A 缺口**（搜索建议 listbox、结果页标题跳级），均需改 `app.js`，建议纳入 R2/R3 收尾或明确记为已知局限。
