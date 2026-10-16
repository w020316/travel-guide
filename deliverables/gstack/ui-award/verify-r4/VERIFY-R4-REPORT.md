# R4 终验报告（QA 部分）— 行纪 XING JI（gstack-qa-lead）

> 结论：**🟢 通过** ｜ 服务：`python -m http.server 3001`（127.0.0.1）｜ Playwright + msedge headless ｜ 只读
> 证据：`verify-r4/r4.js` `_r4.json` `_run.log` + `home-*.png` `result-*.png` `inkscroll-768.png` `inkscroll-375.png`

## 0. 速览（QA 四项）
| 项 | 结果 |
|---|---|
| ① 六档横向溢出（首页+结果页） | **全 0**（含重点 768/414/375） |
| ② 触摸目标 ≤768（全量选择器，fine+coarse） | **0 欠尺寸** |
| ③ 功能回归 | **17/17 PASS** |
| ④ ≤860px 水墨立轴可见性 / CTA 挤压 | **可见、居中、置于搜索卡之后；CTA 未受挤压** |

## 1. 六档横向溢出（scrollWidth / innerWidth）
| 断点 | 首页 over | 结果页 over |
|---|---|---|
| 1920 | 0 (1920/1920) | 0 (1920/1920) |
| 1440 | 0 (1440/1440) | 0 (1440/1440) |
| 1024 | 0 (1024/1024) | 0 (1024/1024) |
| **768** | **0 (768/768)** | **0 (768/768)** |
| **414** | **0 (414/414)** | **0 (414/414)** |
| **375** | **0 (375/375)** | **0 (375/375)** |
- ≤860px 布局改动（hero-inner 转 flex、立轴改 order:2）**未引入任何横向溢出**。

## 2. 触摸目标（全量选择器 `a[href],button,input,select,[role=button],.pill,.style-pill,.qc-btn,.nav-link,.nav-menu-item,.suggestion-item,.history-chip,.icon-btn,.back-btn,.modal-close,.toast-action,.ext-link,.ra-link`）
| 口径 | 768 | 414 | 375 |
|---|---|---|---|
| fine（pointer:coarse=false） | 0 / 0 | 0 / 0 | 0 / 0 |
| coarse（hasTouch+isMobile，coarse=true） | 0 / 0 | 0 / 0 | 0 / 0 |
- 与 R3 一致，**仍 0 欠尺寸**（首页/结果页均 0），无回归。

## 3. 功能回归（1440）—— 17/17 PASS
✅ 搜索联想(n=5) ｜ ✅ 联想回填(成→成都) ｜ ✅ 加载层出现 ｜ ✅ 结果页渲染 ｜ ✅ **13 区块完整**(route-day=3,food-card=1,compare-card=11,mapBox=true,poster=true) ｜ ✅ 收藏 ｜ ✅ 复制 ｜ ✅ 分享链接 ｜ ✅ 下载海报(`成都-2026-10-16-海报.png`) ｜ ✅ 查天气(新窗口) ｜ ✅ 收藏弹层开/关 ｜ ✅ Toast ｜ ✅ 返回顶部(`y=0`) ｜ ✅ 再次生成 ｜ ✅ 返回首页 ｜ ✅ 榜单(12 卡) ｜ ✅ 浏览历史(1 条)

## 4. ≤860px 水墨立轴（跨端签名）实测
| 断点 | hero-inner | 立轴 display | 可见(w×h>0) | 尺寸 | 位于搜索卡之后 | 居中 | CTA 尺寸 |
|---|---|---|---|---|---|---|---|
| 1920 | block | flex(绝对定位,桌面装置) | ✅ | 200×317 | —（右侧装置） | — | 123×62 |
| 1440 | block | flex | ✅ | 173×274 | — | — | 123×62 |
| 1024 | block | flex | ✅ | 123×195 | — | — | 123×62 |
| **768** | **flex** | flex | ✅ | **190×301** | **✅ true** | **✅ true** | 123×62 |
| **414** | **flex** | flex | ✅ | **190×301** | **✅ true** | **✅ true** | 316×56 |
| **375** | **flex** | flex | ✅ | **180×285** | **✅ true** | **✅ true** | 277×56 |
- ≤860px：立轴由 `display:none` 改为 **可见**，`order:2` 排到搜索卡之后（`aside.y ≥ card.bottom`），水平**居中**（左右边距差 ≤12px），宽度收敛为 `min(48vw,190px)`（768/414=190，375=180），`opacity:1`。
- **不挤压主 CTA**：`#generateBtn` 在各档均为正常尺寸（768=123×62、414=316×56、375=277×56），无收缩/换行；立轴位于首屏之下，不占首屏 CTA 位置。
- 视觉确认：`inkscroll-375.png` / `inkscroll-768.png`（三叠远山 + 日轮 + 云海 + 赭红行程线 + 登顶节点 + 竖排「行纪·山水」+ 行纪印）渲染完整无残缺。
- ≥861px 桌面布局**未被改动**（hero-inner 仍 block，立轴仍为右侧绝对定位装置）。

## 5. 附带核对：墨迹绘出动画 / reduced-motion（供调查员交叉印证）
| 上下文 | `.ink-route` animationName | stroke-dashoffset | 节点/登顶 opacity | 立轴 display |
|---|---|---|---|---|
| `prefers-reduced-motion: reduce` | **none**（禁用） | 0px（静态完整实线） | 1 / 1（静态全显） | block |
| `prefers-reduced-motion: no-preference` | **inkRouteDraw**（激活） | 0px（终态） | 1 / 1 | block |
- 结论：减少动效下动画**被正确禁用**、立轴**静态全显**（无位移、无隐藏）；`no-preference` 下绘出动画挂载。静止态即终态（实线+节点可见），符合 `both` 填充语义。

## 6. 控制台
各档 2 条（`501 POST` 后端缺失→按设计回退本地数据 + `404` 预期）；**pageerror 0 条**；与 R1/R3 基线一致，**无新增**。

## 7. QA 结论
**🟢 通过** —— R4 的「跨端水墨签名」在 ≤860px 实测**可见、居中、位于搜索卡之后且不挤压主 CTA**；六档横向溢出全 0，触摸目标仍 0 欠尺寸，功能回归 17/17，控制台无新增异常。未见 R4 引入的布局/交互/无障碍回归。
