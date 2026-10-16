# R1 性能 + 无障碍独立审计 — 行纪 XING JI

> 审计：gstack-investigator ｜ 方式：只读（Playwright + CDP，Edge 通道，headless，1440×900）
> 本地服务：`python -m http.server 3001 --bind 127.0.0.1`（同 designer，后端缺失时按设计回退本地数据）
> 数据：`perf-report.json` / `a11y-report.json` / `a11y2-report.json` / `a11y3-report.json`
> 脚本：`perf.js` `attrib.js` `a11y.js` `a11y2.js` `a11y3.js` `focus-check.js`

## 一、性能 / 60fps — 结论：达标，无掉帧

| 场景 | 平均 FPS | p95 帧 | 最大帧 | 掉帧(>33ms) | 长任务(>50ms) |
|---|---|---|---|---|---|
| 首页滚动（覆盖层开） | 60.0 | 16.8ms | 17.4ms | 0 (0%) | 0 |
| 首页滚动（覆盖层关） | 60.0 | 16.8ms | 17.2ms | 0 (0%) | 0 |
| 结果页滚动 | 60.0 | 16.8ms | 16.9ms | 0 (0%) | 0 |

每轮 rAF 驱动来回滚动 4s、采样 241 帧。CDP Performance 指标（4s 增量）：

| 场景 | Layout | RecalcStyle | Script | Task | LayoutCount | RecalcCount |
|---|---|---|---|---|---|---|
| 首页·覆盖层开 | 0.001s | 0.045s | 0.024s | 0.203s | 1 | 241 |
| 首页·覆盖层关 | 0s | 0.022s | 0.022s | 0.170s | 0 | 241 |
| 结果页 | 0.001s | 0.004s | 0.023s | 0.228s | 2 | 20 |

### 关键判定
- **fixed + `mix-blend-mode:multiply` 纸纹覆盖层：零可测滚动开销。** 开/关对照：FPS 同为 60.0、掉帧同为 0、RecalcStyleCount 同为 241，TaskDuration 差 33ms/4s（≈单核 0.8%）。原理：覆盖层为 fixed 全屏层，被提升为独立合成层，blend 对静态底纹只算一次；滚动下方内容不触发其重栅格化。`will-change:auto` 但 blend 已强制分层。
- **`.reveal` 入场只动 `opacity` + `transform`**（CSS `.reveal.in` transition 仅列这两个属性）→ 纯合成层动画，无 layout/paint。
- **长任务 0 个**（首页 + 结果页），无 >50ms 阻塞。
- **`prefers-reduced-motion: reduce` 降级正确**：`animation-duration`/`transition-duration` 实测归为 `1e-05s`；`.reveal` 元素全部可见（`allVisible:true`），且 `initScrollReveal()` 直接 return（`revealCount:0`），不存在「降级后内容不可见」。
- **微观察（🟢 信息项，非缺陷）**：滚动期约 1 次 style-recalc/帧（241/4s），单次 ≈6–10µs、LayoutDuration≈0。归因实验（禁用 reveal 动画、隐藏 back-to-top）后计数不变（181→180）→ **与 R1 新增的覆盖层/reveal 无关**，属滚动固有微成本，可忽略。
- 注：headless 下测的是主线程 rAF 帧产出节奏（jank 判定的标准代理）；GPU 合成器路径未单独 profile，作为方法学说明。

## 二、无障碍 WCAG 2.1 AA

### 对比度 — 52/52 抽查项全部通过（最低 4.63:1）
| 类别 | 代表项（实测比值） |
|---|---|
| 正文/标题 | body 16.25、hero-title 16.25、section-title 16.25、result-title 16.25、gc-section h2 16.25 |
| 朱批/印章色 | eyebrow-no 6.14、eyebrow-text 6.14、gc-idx 6.14、route-day-num 6.45、budget-total 6.45 |
| 等宽数据字 | rc-meta 5.49、hc-time 5.49、wm-item strong 16.25、ts-time 14.89、compare-date 5.30、p-eyebrow 9.68 |
| 徽章变体 | 官方 5.30、**比价 4.63（最低）**、本地 5.05、民宿 5.15、通用 5.30、nav .badge 6.14 |
| 次级/标签 | hero-lede 5.40、rc-tag 5.67、meta-label 5.49、qc-label 5.49、ext-link 5.67、ac-cons 5.67 |

> 说明：`body::after` 纸纹（multiply，opacity .16）同时压暗文字与背景，对比比值近似保持；上式按计算样式取「最近非透明背景」计算，与 axe 方法一致。

### 键盘可达性
- **Tab 序合理**：品牌 → 3 个导航 → 城市输入 → 生成 → 出发地/目的地/日期/人数/偏好/预算 → 天数 pills…（首页实测前 16 站）。
- **焦点环可见**：按钮/链接 `outline: 2px #9E3F2C offset 3px`（= `--accent-text`，6.14:1 ≥3:1）；输入框改用「纸色 2px 间隙 + 4px `--accent-text` 外环」双层 box-shadow，实测生效（`rgb(250,247,242) 0 0 0 2px, rgb(158,63,44) 0 0 0 4px`）。R1 的焦点环升级（`--accent`→`--accent-text`）生效。
- **弹层焦点管理 ✓**：打开收藏弹层焦点移入、Tab/Shift+Tab 循环不逃逸（实测 12 次 Tab 未逃出）、Esc 关闭、焦点归还触发元素（`navFavoritesBtn`）。
- **跳过导航：缺失**（无 skip link）。

### 语义与 ARIA
- `lang="zh-CN"` ✓；landmark：header/nav/main/aside/form 各 1，`article` 13、`section` 17；**无 `footer`/contentinfo**。
- **标题层级存在跳级**：h1→h2→**h4**（「行前准备」「如何到达」），无 h3（序列 [1,2,2,…,4,4,4,…]）；h1 计数 1 ✓。
- **弹层无对话框语义**：`#favoritesModal` 无 `role="dialog"`/`aria-modal`/`aria-labelledby`。
- **搜索建议 listbox 不完整**：`role="listbox"` 但子项 `.suggestion-item` 无 `role="option"`（optionCount 0），输入框无 `aria-activedescendant`/`aria-expanded`/`aria-autocomplete`（键盘上下键/回车已实现）。
- **未标注表单控件 2 个**：`#photoInput`（file，位于 `.upload-area`，无 label/aria-label）、`#favSearchInput`（仅 placeholder）。
- **关闭按钮可访问名不具描述性**：`.modal-close` 名为「×」。
- `role="menu"`/`menuitem` 用于站点导航（语义偏重，宜用普通链接列表）。
- 无 `<img>`（0 张），海报用 `role="img"`+`aria-label` ✓；`aria-hidden` 容器内无可聚焦元素 ✓。

### 缩放 200%（reflow）
- 视口 720 / 640（≈1440/1280 的 200%）：**横向溢出 0**，无文本被裁切 ✓。

## 三、问题清单

**🔴 阻断：无。**

**🟠 建议 R2 修复（触及 AA / Level A）**
1. 收藏弹层补 `role="dialog"` + `aria-modal="true"` + `aria-labelledby`（4.1.2）。
2. 结果页正文小标题 h2→h4 跳级：`行前准备`/`如何到达` 等改用 h3，或降级为 h2（1.3.1）。
3. 搜索建议补全 listbox 模式：`.suggestion-item` 加 `role="option"` + `id`，输入框补 `aria-activedescendant`/`aria-expanded`/`aria-autocomplete="list"`（4.1.2）。

**🟡 可选优化**
4. 增加「跳过导航」链接（2.4.1；导航仅 3 项，影响低）。
5. `#photoInput`、`#favSearchInput` 补 `aria-label`（3.3.2 / 4.1.2）。
6. `.modal-close` 补 `aria-label="关闭收藏弹层"`。
7. `.nav-menu-item:focus-visible` 移除 outline 后仅靠浅色背景变化（移动端），建议保留可见焦点环（2.4.11）。
8. 站点导航的 `role="menu"/menuitem` 改为普通链接列表语义。
9. 补 `footer`/contentinfo landmark（当前无页脚）。

**🟢 通过项**
- 60fps 全程达标、零掉帧、零长任务；fixed+mix-blend 覆盖层零可测开销；reveal 仅合成属性；reduced-motion 降级正确。
- 对比度 52/52 通过；焦点环可见且 ≥3:1；焦点陷阱/ Esc / 焦点归还正确；缩放 200% 无溢出。

## 四、给主理人的一句话
R1 未引入任何性能或无障碍回归：**「60fps」硬指标已达成**；**WCAG 2.1 AA 在对比度/键盘/缩放三块达标**，但仍有 3 项 Level A 语义缺口（弹层对话框角色、标题跳级、listbox 模式），建议纳入 R2 精修。
