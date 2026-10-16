# R1 视觉升级改动清单 — 行纪 XING JI（东方编辑体 · 精修升级）

> 执行：gstack-designer ｜ 范围：**仅 `style.css` + `index.html`**（`app.js` 未改动）
> 目标：把既有「暖纸 / 墨字 / 赭红 / 衬线」设计语言推向 Awwwards 级工艺密度，不推倒重来。

## 0. 设计推导（为什么这样改）

把站点当作**一本精工排印的旅行手记**：暖纸、墨字、发丝分隔线、印章赭红、克制的墨迹落定动效。
原实现方向已对（暖米纸 + 赭红 + 衬线 + 4px 栅格），缺的是**工艺密度**与**中文精排**：

1. **中文精排缺位** —— 标题用 `ch` 单位定宽（`ch` 以拉丁 "0" 为基准，中文场景严重低估），
   导致 Hero 主标题被挤成 3 行并留下孤字「攻略。」；全站未启用 CJK 比例标点（`palt`）；
   数字未对齐（无 `tabular-nums`）。
2. **质感不连续** —— 纸感噪点只存在于 Hero，Hero 与下方区块之间存在纹理密度「接缝」。
3. **识别锚点弱** —— 除顶栏品牌标外，无东方编辑体特有的落款/印章语言。
4. **存在真实响应式缺陷** —— 375px 结果页横向溢出 **273px**（见 §2）。
5. **编辑节奏过密** —— 三个区块各挂一个 uppercase+宽字距 eyebrow，正是 taste 规范点名的
   「最常被违反的一条」（每 3 个区块最多 1 个）。

## 1. 改动清单（关键位置）

### `style.css`（+443 / −38，2341 行）

| 区块 | 位置 | 内容 |
|---|---|---|
| 令牌层 | `:root`（L45–L60） | 新增**分级字族**语义令牌 `--font-display / --font-title / --font-sans / --font-mono`；`--mono` 等宽链；衬线/无衬线回退链补齐 macOS(`PingFang SC`) / Linux(`Source Han Sans SC`, `WenQuanYi Micro Hei`) 分支 |
| 令牌层 | `:root`（L87–L100） | 新增 `--ease-ink`（墨迹落定缓动 expo-out）、`--dur-reveal`、`--section-y / --section-y-sm`（流体区块节奏） |
| 令牌层 | `:root`（L27–L32） | 新增 `--seal` / `--seal-ink`（印章色） |
| 令牌层 | `:root`（L36–L45） | **色彩和谐**：`--plum #6B5B8C`（H≈265 冷紫，全站唯一完全出族色相）→ `--clay #7A5A45`（H≈25 暖陶土，5.15:1 ✅）。仅 `民宿` 徽章使用，无其他副作用 |
| 基础层 | `body`（L160–L175） | 新增 `font-synthesis: none`（禁 CJK 伪粗/伪斜体）、`text-spacing-trim: space-first`（中文标点占位收缩，Chrome 123+）、`font-variant-ligatures: none` |
| Hero | `.eyebrow`（L320–L335） | 字距 .32em→.22em；新增 `.eyebrow-no`(等宽) / `.eyebrow-sep`(发丝竖线) / `.eyebrow-text` 三分结构，**以竖线替代破折号** |
| Hero | `.hero-title`（L336–L378） | `max-width: 14ch → 12em`（**修复孤字**）；启用 `palt`+`kern`；`em` 强调由「斜体+高亮底色块」改为**同族字重对比 + 朱批墨线下划**（`inkUnderline` 动画）；缓动统一 `--ease-ink` |
| Hero | `.hero-bg::before`（L306） | 网格纹理 opacity .35→.2（弱化「装饰性十字线」观感） |
| Hero | `.hero-bg::after`（L309–L318） | 噪点 opacity .5→.3，并加**底部渐隐遮罩**消除区块接缝 |
| 区块头 | `.section-head` / `.section-title`（L510–L530） | 2px 实心粗线 → **1px 发丝线 + 2px 赭红起笔**；标题启用 `palt`、字距 -.02em |
| 贴士 | `.tip-block li::before`（L803） | 装饰性破折号 `content:'—'` → **绘制发丝短线**（taste 反模式修复） |
| 减少动效 | `@media (prefers-reduced-motion)`（L1552） | 补 `animation-delay/transition-delay` 归零 + `.reveal` 强制可见（避免降级下内容不可见） |
| 响应式 | `@media`（L1703 附近） | **`(max-width:1024px)` → `(min-width:961px) and (max-width:1024px)`** —— 修复断点顺序覆盖（见 §2） |
| 新增 | 文末 `v11.0` 区块（L2026 起，+230 行） | 纸感底纹 / Hero 落款 / 排版精修 / 墨迹落定动效 / 微交互 / 组件精修 / 响应式收口（详见下） |

### `v11.0` 追加区块（文末，7 小节）
1. **纸感底纹** `body::after`：fixed + `pointer-events:none` + `mix-blend-mode:multiply`，
   零滚动重绘（符合 taste 6.E 对 grain 的硬性要求）；z-index 3 低于 header(50)/modal(90)。
2. **Hero 落款**：`.hero-aside`（发丝竖线 + `.hero-seal` 印章 + `.hero-vtext` 竖排「旅行手记」），
   印面用赭红实底 + 反白字 + 高频噪点斑驳 + 3.5° 歪斜。
3. **排版精修**：展示级标题统一 `palt` + `text-spacing-trim`；数字统一 `tabular-nums`+`tnum`；
   数据型小字（`.gc-idx`/`.compare-date`/`.eyebrow-no`/`.poster .p-eyebrow`/`.rc-meta`）改等宽字族；
   正文补 `text-wrap: pretty` + `hanging-punctuation: allow-end`。
4. **动效**：`.reveal` 入场统一 `--dur-reveal` + `--ease-ink`；Hero 入场同样统一。
5. **微交互**：导航下划线（右收左放）；品牌标 hover 微抬+转印色；焦点环由 `--accent`(4.07:1)
   升级为 `--accent-text`(6.14:1) + 3px offset；补齐 `.modal-close`/`.back-to-top`/`.hc-share` 等按下态。
6. **组件精修**：搜索卡去塑料感重阴影改「纸片+发丝边」；海报角标「POSTER」→「旅行海报」附着页签；
   加载转子改「墨圈」（单侧加粗）；结果页工具条主次分隔。
7. **响应式收口**：≤720px 收起落款（避免与标题争位）；≤960px 海报列限宽居中；
   ≤768px 结果页工具条改确定性两行；≤720px 工具按钮改 **2 列网格**（消除末行宽度不均）。

### `index.html`（+8 / −4）
- Hero：新增 `.hero-aside` 落款结构；`.eyebrow` 拆为 `No.001` ｜ 竖线 ｜ 中文（去破折号）。
- 移除「榜单」「浏览历史」两个区块的 `.eyebrow`（**eyebrow 收敛为全站 1 个**）。
- `meta description` 破折号 → 冒号。
- **未触碰任何既有 `id` / `class` / `data-*`**；新增元素均 `aria-hidden` 装饰层或纯文本包裹。

## 2. 修复的真实缺陷（可复现）

**P0 · 结果页 375px 横向溢出 273px**
- 现象：`.result-grid` 在 375px 下计算为 `320px 280px`（仍是双列），页面 `scrollWidth` 648 vs 视口 375。
- 根因：`@media (max-width:1024px)`（源文件更靠后）与 `@media (max-width:960px)` 同时命中 375px，
  后者被前者按**源码顺序**覆盖 → 单列规则失效。
- 修复：1024px 断点收窄为 `961px–1024px` 区间。
- 验证：修复后 375px `scrollWidth = 375`（溢出 0），`gridCols = 343px`（单列）。

**P1 · Hero 主标题孤字**
- 现象：`max-width: 14ch` 在中文下仅约 7 字宽，导致「写一份值得出发的攻略。」折行留下孤字「攻略。」。
- 修复：改 `12em`（≈12 全角字宽）。现为干净两行。

**P2 · 768px 结果页工具条挤压**
- 现象：标题折两行、「← 返回」折成「← 返 / 回」。
- 修复：≤768px 改确定性两行；≤720px 工具按钮改 2 列网格。

## 3. 自检证据

> 本地服务：`python -m http.server 3001 --bind 127.0.0.1`（在仓库根目录）。
> 之所以用 3001：`app.js` 的 `detectBaseURL()` 在 `localhost:3001` 时返回同源相对路径，
> 后端缺失时按设计回退本地数据渲染结果页，且不触发 CSP 违规。
> 复跑：`node deliverables/gstack/ui-award/shot.js after` / `audit.js` / `states.js` / `shot-bp.js`。

- 截图：`deliverables/gstack/ui-award/before/` 与 `after/`（1920 / 1440 / 1024 / 768 / 414 / 375，首页+结果页，含整页）
- 状态：`after-loading.png` / `after-modal-favorites.png` / `after-result-toast.png`
- 特写：`after/zoom-*.png`（hero / ranking / gc-head / guide-section / compare-grid / food-grid / tips / route-day / loading）
- 审计：`after/_audit.json`（对比度 / 触摸目标 / 焦点环 / 全断点溢出 / 减少动效）
- 脚本：`shot.js` `shot-bp.js` `states.js` `zoom2.js` `audit.js` `probe.js` `palt-test.js`

**结论**：对比度 15/15 项通过 AA；6 档断点横向溢出全为 0；≤768px 触摸目标欠尺寸 0；
`prefers-reduced-motion` 下内容全部可见；`palt` 实测使标点串 768px→704px（−8.3%）生效。

## 4. 待办（交给主理人）

- `DESIGN.md` 需同步：L49 `--plum` 令牌表已改为 `--clay`；L82-83 字族链已扩展；
  L277「全站小标 eyebrow」策略已收敛为 Hero 单点。**受「只改 style.css/index.html」约束，本轮未动。**
