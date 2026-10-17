# 行纪 XING JI · 设计系统规范（DESIGN.md）

> 版本 v11.6 ｜ 适用范围：`style.css` / `index.html` / `app.js` / `lib/fonts/fonts.css`（原生 HTML/CSS/JS，无构建步骤）
> 本文档是设计决策的**推导记录**，不是事后描述 —— 每条规范都写明「为什么是这个值」。

---

## 0. 设计理念

**一句话**：把「旅行攻略」当作一本可以随身携带的**旅行手记**来排版，而不是一个工具页面。

推导链：

1. 产品对象是「一座城的深度攻略」—— 内容本身带有**叙事性与人文感**，不是数据看板。
2. 因此视觉隐喻选**杂志/编辑设计**（editorial），而非仪表盘或电商卡片流。
3. 编辑设计的三个特征被逐条落地：
   - **衬线展示 + 无衬线正文**的双字族分工 → 标题有人文感、正文易读
   - **纸感底色 + 墨色文字**（而非纯白纯黑）→ 降低屏幕眩光，贴近纸媒阅读
   - **强分区标记**（区块标题下的实线 + 赭红覆盖线）→ 模拟杂志栏目标记
4. 品牌色选**赭红 `#C8553D`（H=25）**：中国古建/陶器常见色相，暖而不艳；配暖米纸底形成「旧书页」质感，与「手记」定位一致。

**反例（刻意不做）**：不用蓝紫渐变（科技感，与人文定位冲突）、不用大面积纯色块（破坏纸感）、不用玻璃拟态（廉价）。

---

## 1. 色彩系统

### 1.1 推导

色相空间锁定在 **H=25 单一色相族**：纸底、墨字、品牌红全部落在同一暖色轴上，避免冷暖混杂导致的「脏」。唯一例外是低饱和辅助色（鼠尾草绿 / 金 / 紫），仅用于**语义徽章**，用量极小。

### 1.2 令牌与对比度实测

所有「文本级」配色的对比度经脚本实算（`deliverables/gstack/check-contrast.py`），**19 组全部达到 WCAG 2.1 AA**。

| 令牌 | 色值 | 用途 | 实测对比度 |
|---|---|---|---|
| `--paper` | `#FAF7F2` | 页面底 | — |
| `--surface` | `#FEFDFB` | 卡片底 | — |
| `--ink` | `#1C1A17` | 主文字 | 16.25:1 / paper ✅ |
| `--ink-2` | `#3A352E` | 次级文字 | 11.95:1 / surface ✅ |
| `--muted` | `#6B655C` | 辅助文字 | 5.40:1 / paper ✅ |
| `--muted-2` | `#6E675E` | 弱化文字 | 5.22:1 / paper ✅ |
| `--accent` | `#C8553D` | **仅装饰**：边框/图标/装饰线 | 4.07:1（非文本，门槛 3:1）✅ |
| `--accent-text` | `#9E3F2C` | **文本用**品牌色 | 6.14:1 / paper ✅ |
| `--accent-soft` | `#F3E4DF` | 品牌浅底 | 配 accent-text 5.30:1 ✅ |
| `--sage` / `--sage-bg` | `#566A4D` / `#E8F0E4` | 语义徽章 | 5.05:1 ✅ |
| `--gold` / `--gold-bg` | `#8A6A28` / `#FFF4E5` | 语义徽章 | 4.63:1 ✅ |
| `--plum` / `--plum-bg` | `#6B5B8C` / `#EFE9F4` | 语义徽章 | 5.04:1 ✅ |
| `--success` / `--danger` | `#2D6A4F` / `#9E3F2C` | 提示 | 5.98 / 6.14:1 ✅ |

### 1.3 关键规则：品牌色「一色两用」的拆分

这是本次设计系统最重要的一条推导。

**问题**：`#C8553D` 作小号文本时对比度仅 **4.07:1**，未达 AA 正文门槛（4.5:1）。但品牌色又必须用于副标题、价格、eyebrow 等强调位置。

**错误解法**：整体加深品牌色 → 品牌识别度受损，且大面积装饰色过重。

**采用解法**：把品牌色拆成**两个语义令牌**，按「承载文本与否」分工：

- `--accent`（`#C8553D`）→ 只用于**不承载小号文本**的位置：边框、图标、装饰线、进度条、大面积图形。这些属 WCAG 1.4.11 非文本元素，门槛 3:1，4.07 通过。
- `--accent-text`（`#9E3F2C`）→ 所有**文本级**强调，6.14:1 稳过 AA。

同一色相，两种明度，视觉上仍是同一个品牌红。

### 1.4 使用规范

- ✅ 文本强调一律 `var(--accent-text)`
- ✅ 边框/图标/装饰线一律 `var(--accent)`
- ✅ 品牌色作**实底**时（badge / 选中态），底色用 `--accent-text`、文字用 `--paper` → 6.14:1
- ❌ 禁止在文本上直接使用 `var(--accent)`
- ❌ 禁止新增未经令牌化的硬编码色值（现状：0 处残留）

---

## 1.5 暗色模式（v11.6 新增）

### 1.5.1 推导

暗色不是「把亮色反转」。反转会得到冷灰底，与「暖米纸 + 墨字」的手记定位断裂。因此暗色沿用**同一暖色轴（H≈25–37）**：底色 `#17140F` 是纸色的深墨版，文字 `#F3EDE3` 是暖白而非纯白。

品牌赭红在深底上按「一色两用」原则**提亮**：装饰用 `#D9705A`，文本用 `#E9907A`（7.64:1）。这不是新颜色，是同一色相在深底上的等感知明度。

### 1.5.2 触发方式（双轨）

```css
/* 系统跟随（自动） */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* 暗色令牌 */ }
}
/* 手动切换（为切换按钮预留） */
:root[data-theme="dark"]  { /* 暗色令牌 */ }
:root[data-theme="light"] { color-scheme: light; }  /* 压过系统暗色 */
```

**关键规则**：媒体查询里必须带 `:not([data-theme="light"])`，否则用户手动选亮色时会被系统偏好覆盖。

### 1.5.3 暗色令牌表（实测对比度）

| 令牌 | 亮色 | 暗色 | 暗色实测 |
|---|---|---|---|
| `--paper` | `#FAF7F2` | `#17140F` | 页面底 |
| `--paper-2` | `#F2EDE4` | `#1E1A14` | 次级底 |
| `--surface` | `#FEFDFB` | `#1C1813` | 卡片底 |
| `--surface-2` | `#F8F5EE` | `#241F18` | 次级卡片 |
| `--ink` | `#1C1A17` | `#F3EDE3` | 15.77:1 /paper ✅ |
| `--ink-2` | `#3A352E` | `#D9D0C2` | 12.03:1 /paper ✅ |
| `--muted` | `#6B655C` | `#A69C8C` | 6.78:1 /paper ✅ |
| `--muted-2` | `#6E675E` | `#9A9182` | 5.90:1 /paper ✅ |
| `--line` | `#E4DDD1` | `#332D24` | 纯装饰发丝线 |
| `--line-2` | `#D8CFC0` | `#7A6F5E` | 3.73:1（控件边界，非文本门槛 3:1）✅ |
| `--accent` | `#C8553D` | `#D9705A` | 5.61:1（装饰）✅ |
| `--accent-text` | `#9E3F2C` | `#E9907A` | 7.64:1 /paper ✅ |
| `--accent-soft` | `#F3E4DF` | `#3B221A` | 品牌浅底 |
| `--gold` | `#7A5C1F` | `#D7A855` | 8.41:1 ✅ |
| `--success` | `#2D6A4F` | `#6CBE93` | 8.24:1 ✅ |
| `--danger` | `#9E3F2C` | `#F08A7A` | 7.54:1 ✅ |
| `--warn-bg` | `#FFF8E7` | `#2E2413` | 警告底 |
| `--warn-ink` | `#5C4400` | `#F2DCA6` | 11.29:1 /warn-bg ✅ |

**实测结论**：30 组令牌配对全部 ≥ AA；运行时遍历可见文本节点（首页 159 + 结果页 278 + 收藏弹窗 284，亮暗双套共 721 处）**0 处不达标**。

### 1.5.4 暗色下的非颜色调整

| 项 | 处理 | 原因 |
|---|---|---|
| `color-scheme` | 亮 `light` / 暗 `dark` | 原生控件、滚动条、日期选择器跟随 |
| 阴影 | 改纯黑 + 提高透明度（.04→.28 / .10→.52 / .20→.62），并保留 `--line-2` 描边 | 深底上阴影几乎不可见，层级需靠描边补 |
| 遮罩 | 弹窗 .5→.66，加载层用 `--overlay-page` 深色版 | 深底上 .5 遮罩对比不足 |
| 噪点纹理 | `mix-blend-mode: multiply` → `screen` | multiply 在深底上完全不可见 |
| Hero 网格 | 不透明度 .2→.42 | 深底上需提高才可感知 |
| 图片 | **不加** brightness 滤镜 | 用户上传照片与海报属内容/导出物，压暗会损失保真 |
| 海报画布 | 4 种风格固定亮色 | 导出 PNG 是独立视觉系统，不应随主题变深 |

---

## 2. 排版规范

### 2.1 字族

```css
/* 基础字族（回退链） */
--serif: 'Noto Serif SC', 'Source Han Serif SC', 'Noto Serif CJK SC', 'Songti SC', 'STSong', 'SimSun', serif;
--sans:  'Noto Sans SC', system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
         'Microsoft YaHei', 'Source Han Sans SC', 'WenQuanYi Micro Hei', sans-serif;
--mono:  ui-monospace, 'SF Mono', 'JetBrains Mono', 'Cascadia Mono', 'Roboto Mono', Menlo, Consolas,
         'Noto Sans SC', monospace;

/* 语义别名（组件按「角色」取用，不直接引用具体字族） */
--font-display: var(--serif);   /* 页面级展示标题：h1 / hero / 区块标题 */
--font-title:   var(--serif);   /* 组件标题：卡片 / 弹窗 / 正文小标题 */
--font-sans:    var(--sans);    /* 正文 */
--font-mono:    var(--mono);    /* 数字 / 日期 / 预算 / 时间 */
```

**推导**：原回退链只写了 `'Songti SC'`（macOS 专属），Windows/Linux 会直接落到通用 `serif`，中文渲染劣化明显。补齐 `Source Han Serif SC` / `Noto Serif CJK SC` / `STSong` / `SimSun` 回退；无衬线侧补 `PingFang SC`（macOS）与 `Source Han Sans SC` / `WenQuanYi Micro Hei`（Linux）。

**分级原则（v11.1 R2 引入语义别名）**：层级靠**字重 + 字距 + 颜色**建立，不靠频繁切换字体族；`--font-display` 只给 ≥24px 的页面级展示标题，≤20px 的组件标题统一走 `--font-title`，数字/日期一律 `--font-mono` + `font-variant-numeric: tabular-nums`。

同时补齐 `-moz-osx-font-smoothing` 与 `text-rendering: optimizeLegibility`（原先只有 macOS 专属的 `-webkit-font-smoothing`），并新增 `font-synthesis: none` 禁止浏览器伪造 CJK 粗体/斜体。

### 2.2 字号阶梯

原实现有 **23 档散值**，含 `12.5 / 13.5 / 14.5px` 的 0.5px 半像素漂移（会导致不同 DPR 下渲染不一致）。现收敛为成体系的两组：

**① 页面 UI 阶梯（模数 ≈1.25，10 档）**

| 令牌 | 值 | 典型用途 |
|---|---|---|
| `--fs-3xs` | 11px | 英文副标、角标（原 9/10px，提升到可读下限） |
| `--fs-2xs` | 12px | meta 标签、徽章 |
| `--fs-sm` | 14px | 次级正文、控件 |
| `--fs-base` | 16px | 正文基准 |
| `--fs-md` | 18px | 区块小标题 |
| `--fs-lg` | 22px | 卡片标题、弹窗标题 |
| `--fs-xl` | 28px | 次级标题 |
| `--fs-2xl` | 32px | 区块数字 |
| `--fs-3xl` | 36px | 大标题 |

> **v11.1 R2**：原 `--fs-xs: 13px` 与 12/14 仅差 1px，三档近乎 +1 步进、视觉上无法区分且徒增维护面，已**删除**（小字只保留「12px 辅助 / 14px 次级正文」两级）。仍存在的 `var(--fs-xs)` 引用已全部迁移到 `--fs-sm`。

**② 流体尺寸（断点间平滑，4 个）**

| 令牌 | 值 | 用途 |
|---|---|---|
| `--fs-fluid-title` | `clamp(22px, 3vw, 32px)` | 结果页标题 |
| `--fs-4xl` | `clamp(28px, 3.8vw, 44px)` | 区块标题 |
| `--fs-fluid-h1` | `clamp(28px, 4vw, 42px)` | 攻略正文 H1 |
| `--fs-5xl` | `clamp(44px, 6.5vw, 80px)` | Hero 主标题 |

**③ 展示尺寸（3 个）**：`44 / 56 / 120px` —— 海报画布与装饰水印，按固定比例设定，**不参与页面排版节奏**（海报是导出为 PNG 的独立视觉系统）。

### 2.3 行高与字距

- 正文 `--lh-body: 1.75` —— 中文方块字比拉丁字母需要更大行距
- 标题 `--lh-tight: 1.12`
- 大标题字距 `--ls-tight: -.015em`（大字号需收紧）
- eyebrow / 标签字距 `--ls-wide: .12em` ~ `--ls-wider: .3em`（小字号需放开）

### 2.4 断行控制

```css
.hero-title, .section-title, .result-title, .gc-head h1, .modal-head h3 { text-wrap: balance; }
.gc-sub, .hero-lede, .gn-desc { text-wrap: pretty; }
```

**推导**：中文标题在窄容器中易出现「末行仅剩 1-2 字」的孤字，`balance` 让浏览器均衡分配每行字数；正文用 `pretty` 避免末行孤字，但不追求均衡（避免正文行宽跳动）。

---

## 3. 间距与布局

### 3.1 4px 基数栅格

原实现混用 `22 / 26 / 18 / 14 / 10 / 6px`（2px 倍数而非 4px），导致节奏不齐。现统一为 18 档：

```css
--space-4:  4px;   --space-8:  8px;   --space-12: 12px;  --space-16: 16px;
--space-20: 20px;  --space-24: 24px;  --space-28: 28px;  --space-32: 32px;
--space-36: 36px;  --space-40: 40px;  --space-44: 44px;  --space-48: 48px;
--space-56: 56px;  --space-60: 60px;  --space-64: 64px;  --space-72: 72px;
--space-80: 80px;  --space-96: 96px;
```

**命名规则（v11.6 勘误）**：令牌后缀 = 实际像素值，`--space-48` 就是 48px。

> ⚠️ 本文档旧版（v10.10）曾写作 `--space-1: 4px … --space-20: 80px` 的「序号制」，与代码中的「像素值制」完全冲突——按旧文档写 `--space-12` 会得到 12px 而非文档暗示的 48px，相差 4 倍。已按代码实际值更正，**以本节为准**。

### 3.2 容器

- 默认 `--maxw: 1180px`
- ≥1440px 切 `--maxw-wide: 1320px`

**推导**：1180px 容器在 1920 视口两侧留白近 370px，内容显得孤立；宽版变体让大屏更从容，同时不无限拉伸（正文行宽仍需可控）。

---

## 4. 动效规范

### 4.1 缓动与时长令牌

```css
--ease-out:    cubic-bezier(.2,.7,.3,1);   /* 主缓动：快速起步、柔和收尾 */
--ease-in-out: cubic-bezier(.4,0,.2,1);
--ease-spring: cubic-bezier(.34,1.4,.64,1); /* 弹性：用于强调性反馈 */
--dur-fast: .15s;  --dur-base: .22s;  --dur-slow: .4s;  --dur-enter: .7s;
```

**推导**：原实现绝大多数 transition 未显式声明缓动，落到浏览器默认 `ease`（起步慢、收尾也慢），不符合真实物体减速的运动直觉。统一改用 `ease-out` 系。

时长分层：微交互 150ms / 常规 220ms / 较大位移 400ms / 入场 700ms。

### 4.2 关键规则：禁止 `transition: all`

**问题**：原实现 49 处 transition 中 **35 处使用 `transition: all`**。`all` 会过渡 `box-shadow` / `border-width` / `color` 等非合成属性，触发重排重绘，是 60fps 的最大风险点。

**解法**：定义通用属性集令牌，只包含合成层友好 / 低成本属性：

```css
--t-interactive: transform var(--dur-base) var(--ease-out),
                 opacity var(--dur-base) var(--ease-out),
                 box-shadow var(--dur-base) var(--ease-out),
                 border-color var(--dur-base) var(--ease-out),
                 background-color var(--dur-base) var(--ease-out),
                 color var(--dur-base) var(--ease-out);
```

全部 35 处 `transition: all` 已替换为 `var(--t-interactive)`，实测 `getComputedStyle().transitionProperty` 返回具体属性列表而非 `all`。

### 4.3 滚动入场体系

```css
.reveal { opacity: 0; transform: translateY(16px); }
.reveal.in { opacity: 1; transform: none; transition: opacity/transform var(--dur-enter) var(--ease-out); }
```

由 `app.js` 的 `initScrollReveal()` 用 IntersectionObserver 驱动，同组元素按序错开 60ms（上限 6 档）形成瀑布节奏。仅动 `opacity` / `transform`。

**无障碍**：`prefers-reduced-motion: reduce` 时**完全跳过初始化**，元素保持默认可见状态（而非缩短时长）。

### 4.4 will-change 策略

仅对可交互卡片声明 `will-change: transform`（`.rank-card` / `.food-card` / `.accommodation-card` / `.compare-card` / `.photo-item`）。

**推导**：`will-change` 滥用会导致浏览器为每个元素创建独立合成层，内存暴涨。只在「确定会 hover 抬升」的卡片上声明。

---

## 5. 微交互规范

### 5.1 状态覆盖矩阵

| 状态 | 原实现 | 现状 |
|---|---|---|
| `:hover` | 覆盖较广 | ✅ 保持 |
| `:focus-visible` | 有全局兜底 | ✅ 保持 |
| `:active` | **仅 1 处**（`.btn-primary`） | ✅ 补齐 14 类元素：`transform: scale(.97)` + 加速时长 |
| `:disabled` | **零命中** | ✅ 补齐 `opacity: .5` + `cursor: not-allowed` + 禁用位移 |
| `:invalid` | **零命中** | ✅ 字段级红边 + 柔光环 |
| tap-highlight | 未处理 | ✅ `-webkit-tap-highlight-color: transparent`（默认灰块与暖米纸色调冲突） |

### 5.2 按压反馈原则

按下态用 `scale(.97)` 而非仅 `translateY(0)`：后者只是取消 hover 位移，用户感知不到「按到了」。缩放能给出明确的物理反馈。

---

## 6. 响应式规范

### 6.1 断点体系（6 档）

原实现只有 **2 档**（960 / 720px）。现补齐：

| 断点 | 布局变化 |
|---|---|
| ≥1440px | 容器切宽版 1320px |
| ≤1024px | 结果页双列收窄（320px + 1fr）；榜单/美食网格降为 2 列 |
| ≤960px | 结果页双列 → 单列（原有） |
| ≤768px | 导航切汉堡菜单；进入触摸布局；**触摸目标 ≥48px** |
| ≤720px | 搜索表单转网格（原有） |
| ≤480px | 搜索表单降为单列 |
| ≤414px | 容器内边距收紧；攻略统计卡单列 |
| ≤375px | 榜单/美食/比价网格全部单列兜底 |

### 6.2 触摸目标

```css
--tap-min: 48px;
```

**推导**：WCAG 2.5.5 (AAA) 与 iOS HIG 均建议 44–48px。原实现移动端规则为 40/42px，且 `.hc-share` / `.hc-del` / `.photo-delete` 仅 **22px**、`.modal-close` 仅 32px。

**解法**：对视觉尺寸必须保持小巧的图标按钮（分享/删除/关闭），用**伪元素扩展热区**——视觉 22px 不变，点击区域 48×48：

```css
.hc-del::after { content: ''; position: absolute; width: var(--tap-min); height: var(--tap-min); transform: translate(-50%,-50%); inset: 50% 50% 50% 50%; }
```

### 6.3 实测结果

7 档视口（1920/1440/1366/1024/768/414/375）**全部零横向溢出**；375px 下 6 类交互元素触摸目标全部 ≥48px。

---

## 7. 原创性声明

### 7.1 自有设计元素（可追溯）

| 元素 | 出处 | 说明 |
|---|---|---|
| brand-mark 旋转 -3° | `style.css` 品牌区 | 模拟印章的轻微歪斜，避免机械感 |
| Hero 网格 + SVG 噪点 + 暗角 | Hero 背景层 | 模拟纸张纤维纹理 |
| section-head 赭红覆盖线 | 区块标题 | 杂志栏目分区标记 |
| live-dot 脉冲 | 榜单区 | 表示「数据实时」 |
| 海报 4 风格（清新/复古/极简/水墨） | 海报系统 | 水墨风格含「墨」字水印 |
| 编辑式 eyebrow（短横线 + 大写 + 宽字距） | 全站小标 | 贯穿全站的编辑节奏标记 |

### 7.2 无抄袭声明

- 未使用任何 UI 框架（Bootstrap / Tailwind / Ant）或其默认样式
- 未复用任何模板（HTML5 UP / ThemeForest 等）
- 配色为自定义暖色系统，非取色自现有作品
- 交互模式（双列海报+正文、比价卡片、机位推荐）为本产品业务需求推导，非套用通用组件库

### 7.3 参考来源（仅作设计手法参考，非视觉复制）

- New Media Campaigns —《Best Examples of Content Heavy Editorial Website Designs》
  https://www.newmediacampaigns.com/blog/best-examples-of-content-heavy-editorial-website-designs
  （提炼「内容组织 / 隐藏复杂度 / 寻路 / 视觉层级」四条编辑站原则）
- Sesh — Journals from the Nile（编辑·旅行刊，援引 Kinfolk / Cereal Magazine 慢编辑美学）
  https://www.seshkairo.com/
- Awwwards 获奖条目（用于设定量化标准，未复制视觉）：
  https://www.awwwards.com/sites/noiz ｜ https://www.awwwards.com/cappen/

---

## 8. 维护约定

1. **新增颜色必须先定义令牌**，禁止在规则中直接写 hex
2. **新增字号必须复用现有阶梯**，不得引入新档位
3. **新增间距必须落在 4px 栅格**上，令牌后缀即像素值
4. **禁止使用 `transition: all`**，统一用 `var(--t-interactive)` 或显式属性
5. **修改颜色令牌后必须重跑** `python deliverables/gstack/check-contrast.py` 确认 AA 未被破坏
6. **修改布局后必须重跑** `node deliverables/gstack/verify-design.js` 确认 7 档视口零溢出
7. **新增主题相关令牌必须双轨同步**：`@media (prefers-color-scheme: dark)` 与 `:root[data-theme="dark"]` 两处都要写，且媒体查询需带 `:not([data-theme="light"])`
8. **组件禁止内联色值**。`app.js` 生成的 HTML 不得写 `style="background:#..."`——内联样式不随主题切换，且无法被令牌覆盖（v11.6 曾因此出现暗色下 2.56:1 的对比度事故）。改用语义类（如 `.compare-tip--warn`）
9. **字体已自托管**，新增字族须在 `lib/fonts/` 放置子集化 woff2 并在 `fonts.css` 声明，禁止再引入外部字体 CDN（中文分片会导致 load 事件挂起）

---

> 本文档与 `style.css` 的 `:root` 区块一一对应；如两者不一致，以本文档的推导为准并修正代码。
