# 行纪 Xing Ji · 阶段一 代码审查报告

**日期**：2026-10-17
**阶段**：阶段一（代码审查）
**参与成员**：product-reviewer（完整交付）｜主理人直接取证（补足安全与性能线）
**基线**：`baseline-r2-2026-10-17.md`（269/269 测试通过，行覆盖 44.32%）

---

## 📌 TL;DR

- 整体结论：🔴 **不通过** —— 存在 2 个 P0，其中 1 个已修复但需轮换凭据
- 阻塞项：**2 条 P0 + 5 条 P1**
- 最严重问题：**第三方 CDN 串行阻塞应用启动**（国内环境 `load` 实测 ≥45s 超时）+ **真实 API Key 已推送到公开仓库**
- 一个已修复：密钥明文已于 `ac7f9fb` 移除，但**必须在上游吊销**
- 一个高价值业务缺陷：**目的地状态覆盖**导致点排行榜城市却生成旧城市攻略（已独立复现）

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| Go / No-Go | 🔴 **No-Go**（2 P0 未闭环） |
| 严重度分布 | 🔴 2 / 🟠 6 / 🟡 6 / 🟢 3 |
| 关键行动项 | 8 条（P0 2 + P1 6） |
| 建议负责人 | 前端主程（P0-A、P1-C、P1-D、P1-G）｜后端主程（P1-E、P1-F）｜运维（P0-B 轮换） |

---

## ⚠️ 本轮交付完整性声明

三线并行审查中，**product-reviewer 完整交付**；**investigator 在中断后补交了 3 条关键补充**（取消语义双重根因、edit-photo 鉴权定性、PROVINCE_MAP 重复键），其完整报告正文仍未送达；**security-officer 两次索取均未送达**。

**因此安全线由主理人直接实测与读码取证，覆盖面弱于专业线审查**：
- 安全：仅覆盖 CORS / JWT / 限流 / 密钥泄漏 / 公开端点 5 项，**未做完整 OWASP Top 10 与 STRIDE**
- 性能：覆盖首屏加载链路与字体，**未做 N+1、缓存无界、内存泄漏系统排查**

这两块缺口列入阶段二补审项，不作为「已通过」结论。

---

## 1. 各成员核心结论

### 🔍 产品评审员（product-reviewer）

- **核心判断**：代码质量高于覆盖率所暗示的水平（有真实断言、有版本化注释、依赖 SRI/CSP/鉴权分层），但**文档与实现大面积脱节**，且存在 4 个用户可直接感知的功能缺陷。
- **关键建议**：
  - `PROVINCE_MAP` 中 `'大同':'台湾'` 覆盖了前面的 `'大同':'山西'`（`app.js:437` vs `439`），对象字面量后者胜出 → 输入「大同」被识别为台湾
  - 收藏空态文案说「暂无收藏」，但容器仍有 3 个子节点（`app.js:2902-2912`），空态分支永不触发
  - 海报入口在结果页不可见（`app.js:2726-2738` 生成按钮，但对应 CSS 为 `display:none`）
  - `API_DOCUMENTATION.md` 描述的端点与 `routes/api.js` 实际注册**几乎不重合**，疑似从另一项目复制

### 🛡️ 安全线（主理人直接取证，非成员交付）

- **核心判断**：鉴权分层设计是**正确的**（生产强制 JWT_SECRET ≥32 字符、CORS 白名单精确匹配、显式拒绝 `*`、body 限 1mb、有 100req/min 限流），但存在**凭据管理**与**公开端点**两类实质问题。
- **关键结论**：
  - ✅ **通过**：JWT_SECRET 无硬编码兜底（`authService.js:37-46`）
  - ✅ **通过**：CORS 实现正确 —— 生产无白名单则拒绝所有跨源（`server.js:63-78`）。**本地实测到的「反射 evil.example」是开发环境预期行为，不是漏洞**（此处修正了初审的误判）
  - 🔴 **P0**：真实 API Key 明文在 `PROJECT_DELIVERY_REPORT.md:1375`，文件已推送到公开仓库
  - 🟠 **P1**：`/api/config/map` 同时下发高德 `key` 与 **`secret`**（实测返回 `{"key":"46f98...","secret":"c3a32..."}`）
  - 🟠 **P1**：匿名 `POST /api/ai/generate` 返回 400「请提供城市名称」而非 401，说明**鉴权确实放行**，仅靠 IP 限流兜底

### 🔧 性能线（主理人直接实测，非成员交付）

- **核心判断**：**应用能否启动，取决于两个境外 CDN 的响应速度**。这是架构级单点，不是可优化项。
- **关键数据**：

| 场景 | FCP | DCL | load |
|---|---|---|---|
| 正常（本机可访问 Google/CDN） | 1040ms | 1018ms | **≥45000ms 超时** |
| 拦截字体+CDN（模拟国内快速失败） | 172–660ms | 57–258ms | 189–312ms |

- **根因链**：
  1. `index.html:26-28` 同步加载 Google Fonts CSS → 单字重 **92 个 `@font-face` 分片**，页面共声明 **808 个 FontFace**
  2. `index.html:31-34` html2canvas 以 `defer` 加载，`index.html:338` app.js 同为 `defer` → **按文档顺序串行执行**
  3. CDN 挂起时 html2canvas 不返回 → app.js 永不执行 → **整站白屏**
  4. 字体分片挂起 → `load` 事件永不触发 → PWA 注册/懒加载/埋点全部失效

---

## 2. 综合审查发现（去重合并，按严重度排序）

| # | 严重度 | 类别 | 位置 | 问题描述 | 建议 | 来源 |
|---|---|---|---|---|---|---|
| 1 | 🔴 P0 | 性能/架构 | `index.html:26-28`<br>`index.html:31-34`<br>`index.html:338` | 字体 CSS 与 html2canvas 均为境外同步/defer 依赖。字体侧 808 个 FontFace、112+ 分片；CDN 侧与 app.js 同为 defer 串行。国内环境 `load` 实测 ≥45s 超时，CDN 挂起则白屏 | 字体自托管子集（已备 2.4MB woff2）；html2canvas 本地化；app.js 改 `type="module"` 或 dynamic import，与第三方解耦 | 主理人实测 |
| 2 | 🔴 P0 | 安全 | `PROJECT_DELIVERY_REPORT.md:1375` | 真实 Agnes API Key 明文，文件已推送公开仓库 `github.com/w020316/travel-guide` | **已修复**（`ac7f9fb` 改占位符）；**必须在上游吊销该 Key**，git 历史无法靠删文件撤回 | 主理人实测 |
| 3 | 🟠 P1 | 功能缺失 | `style.css` 全局 | 无暗色模式：`prefers-color-scheme` / `color-scheme` 全项目 0 处。7 档视口 × dark 实测 `darkApplied` 全为 N | 增加 `:root[data-theme]` 双令牌集 + `prefers-color-scheme` 自动跟随 + 手动切换 | 主理人实测 |
| 4 | 🟠 P1 | 逻辑 | `app.js:1264`<br>`app.js:861/907/953/2957` | `targetCity = state.destination \|\| city`，但四个 submitCity 入口均不清空 `state.destination` → 用户填过目的地后点排行榜任意城市，仍生成旧目的地攻略 | 在四个入口统一 `state.destination=''`，或改为显式传参而非读全局 | 主理人复现 |
| 5 | 🟠 P1 | 安全 | `backend/routes/api.js:27-37` | `/api/config/map` 明文下发高德 `key` **与 `secret`**。JS API 只需 key，secret 泄露可用于服务端配额盗用 | 仅下发 key；secret 保留服务端；如用安全密钥（securityJsCode）需走官方代理方案 | 主理人实测 |
| 6 | 🟠 P1 | 安全 | `backend/routes/api.js:39` | `POST /api/ai/generate` 仅 `optionalAuth`，匿名可调用。实测返回 400（参数校验）而非 401，证明鉴权放行 | 匿名额度用尽后强制登录；或对匿名请求加严格频控与预算上限 | 主理人实测 |
| 7 | 🟠 P1 | 质量 | `backend/routes/api.js` 等 | 行覆盖 44.32%，核心缺口：`routes/api.js` 18.8%、`middleware/validation.js` 33.5%、`socialService.js` 27.1%、`mcp/server.js` 0% | 优先补 `validation.js`（安全边界）与 `routes/api.js` 的鉴权/错误分支 | 主理人实测 |
| 7b | 🟠 P1 | 逻辑 | `app.js` controller 单例<br>+ `hideLoading` 定时器 | **「可取消生成」语义双重失效**：① controller 为模块级单例，新请求不 abort 上一个 → 旧请求结果仍可能覆盖新结果；② `hideLoading` 用 `setTimeout` 无条件恢复 UI，取消后加载层被定时器重新点亮 | controller 改为请求局部变量并在新请求前 abort 旧的；`hideLoading` 绑定请求 id，过期回调直接 return | investigator（补交） |
| 8 | 🟡 P2 | 文档 | `系统说明和使用指南.md:57` | 声称 `GET /api/stats`，实测 **404**（实际为 `/api/social/stats`、`/api/expanded/stats`）；文档所列 `app_backup.js`/`app_fixed.js` 不存在 | 按实际路由重写文档 | 主理人实测 |
| 9 | 🟡 P2 | 逻辑 | `app.js:437` vs `439` | `PROVINCE_MAP` 共 **804 条目 / 772 唯一键 / 30 个重复键**，其中仅 **1 个值冲突**：`'大同':'台湾'` 覆盖了 `'大同':'山西'`。影响面收窄为：**天气省份标签**与**交通建议分支**取到错误省份，不影响攻略主体生成 | 删除台湾段 `'大同'`；建议加构建期断言检测重复键冲突 | product-reviewer + investigator（口径已收窄） |
| 10 | 🟡 P2 | UX | `app.js:2902-2912` | 收藏空态判定失效：文案说「暂无收藏」但容器含 3 个子节点，空态永不显示 | 空态用独立容器渲染，判定改为数据长度而非 DOM 子节点 | product-reviewer |
| 11 | 🟡 P2 | UX | `app.js:2726-2738` | 结果页海报入口对应元素 CSS 为 `display:none`，用户无法触达海报导出 | 确认是否被后续版本误隐藏，恢复可见或移到工具栏 | product-reviewer |
| 12 | 🟡 P2 | UX | `index.html:230-233` | 存在密码/手机号字段但产品无对应能力，误导用户填写敏感信息 | 移除，或明确标注「选填·仅本地」 | product-reviewer |
| 12b | 🟡 P2 | 逻辑 | `app.js`（前端无登录态注入） | `POST /api/ai/edit-photo` 要求 `verifyCustomToken`，但前端不存在 token 注入机制 → **该功能 100% 返回 401**，属死功能。定性为「功能不可用」而非安全漏洞（鉴权本身正确） | 要么接入 Firebase 登录并注入 Authorization，要么下线该入口 | investigator（补交） |
| 13 | 🟢 P3 | 规范 | `style.css:32` | `--fs-2xs` 令牌声明后未被使用（死令牌） | 使用或删除，保持令牌集与消费点一致 | product-reviewer |
| 14 | 🟢 P3 | 工具 | `deliverables/gstack/check-contrast.py` | 报 `sage/gold/plum` 令牌缺失，实际 CSS 中为 `--sage-bg` 等命名，脚本变量名不匹配 | 修正脚本取值逻辑，避免误报 | 主理人实测 |
| 15 | 🟢 P3 | 可用性 | `style.css` 桌面端 | 桌面端 28 个交互元素 <48px（如 `a.nav-link` 56×25）。鼠标场景可接受，但键盘焦点框偏小 | 用伪元素扩展热区至 44px，视觉尺寸不变 | 主理人实测 |

---

## ✅ 行动清单

| # | 行动 | 负责方 | 紧急度 | 验收标准 |
|---|---|---|---|---|
| 1 | 在上游吊销泄漏的 Agnes API Key 并重新签发 | 运维/用户 | **P0 立即** | 旧 Key 调用返回 401 |
| 2 | 字体自托管 + html2canvas 本地化 + app.js 解耦第三方 | 前端 | P0 | 拦截全部境外域后 `load` <3s，页面功能完整 |
| 3 | 修复 `state.destination` 覆盖（4 个入口） | 前端 | P1 | 填目的地后点排行榜城市，生成的是该城市 |
| 4 | `/api/config/map` 停止下发 `secret` | 后端 | P1 | 响应体仅含 key 与 provider |
| 5 | 匿名 AI 端点加额度与频控 | 后端 | P1 | 匿名超限返回 429/401，不消耗 AI 预算 |
| 6 | 补 `validation.js` + `routes/api.js` 测试至 60%+ | 后端 | P1 | 覆盖率实测提升，269 用例全绿 |
| 7 | 增加暗色模式（令牌双集 + 系统跟随） | 前端 | P1 | 7 档 × dark 实测 `darkApplied` 全为 Y，对比度仍达 AA |
| 8 | 修复生成请求取消语义（controller 单例 + hideLoading 定时器） | 前端 | P1 | 连点两次生成只有最后一次渲染；取消后加载层不复活 |

---

## ⚠️ 待完善 / 已知局限

1. **安全审计不完整**：未做完整 OWASP Top 10 与 STRIDE 威胁建模，`socialService`/`storage` 的 IDOR 未验
2. **性能审计不完整**：未做 N+1、缓存无界、内存泄漏、事件监听泄漏的系统排查
3. **未做浏览器兼容实测**（Chrome/Firefox/Safari/Edge），留待阶段三
4. **未做真实 AI 生成链路实测**（15–30s 耗时场景），留待阶段四
5. 阶段三/四将验证 UX-2/UX-3 等需浏览器实测的项

---

## 📚 成员产出索引

| 成员 | 状态 | 产出 |
|---|---|---|
| product-reviewer（产品官） | ✅ 完整交付 | STD-1~5 / SMELL-1~2 / DOC-1~2 / TEST-1~2 / UX-1~4，含三张统计表 |
| security-officer（安全卫士） | ❌ 网络中断，报告未送达 | 由主理人直接取证 5 项替代，覆盖不完整 |
| investigator（排障手） | ❌ 网络中断，报告未送达 | 由主理人直接实测首屏链路替代，覆盖不完整 |

---

> 本报告由软件工坊 AI 协作生成。安全与性能两部分覆盖不完整，阶段二开始前建议补审。
