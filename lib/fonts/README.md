# 字体资产说明

本目录字体为 **Noto Sans SC / Noto Serif SC** 的子集化产物，用于替代原先对 Google Fonts CDN 的运行时依赖。

## 来源

| 文件 | 上游 | 子集范围 |
|---|---|---|
| `noto-sans-sc-subset.woff2` | Noto Sans SC (Variable, wght 100–900) | GB2312 一级汉字 + ASCII + 中文标点，共 4145 字形 |
| `noto-serif-sc-subset.woff2` | Noto Serif SC (Variable, wght 200–900) | 同上 |

## 为什么子集化

Google Fonts 对中文字体采用 `unicode-range` 分片策略：**单字重即 92 个 woff2 分片**，`index.html` 原先声明 8 个字重，共 800+ 个 FontFace，页面实际触发 112+ 个分片请求。`fonts.gstatic.com` 在中国大陆不可达时，这些请求挂起，导致 `load` 事件永不触发（实测 ≥45s 超时）。

子集化为单个可变字体文件后：
- 请求数：112+ → **2**
- 体积：分片总量不可控 → **2.4MB（缓存后为 0）**
- 外部依赖：**0**

## 许可证

Noto 系列字体由 Google 发布，采用 **SIL Open Font License 1.1**（OFL-1.1）。
允许自由使用、修改、嵌入与再分发，要求保留版权声明且不得单独售卖字体文件。

- 许可证全文：https://scripts.sil.org/OFL
- 上游项目：https://github.com/notofonts/noto-cjk

子集化工具：`fontTools.subset`（命令见 `deliverables/gstack/build-fonts.sh`）

## 重新生成

若字集范围需要调整（例如新增生僻地名用字），修改字符集后重跑：

```bash
bash deliverables/gstack/build-fonts.sh
```

> 注意：子集外字符会回退到 `--serif` / `--sans` 回退链中的系统字体，视觉略有差异但功能不受影响。
