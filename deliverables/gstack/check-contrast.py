"""WCAG 2.1 对比度校验（阶段五色彩系统验证）

从 style.css 的 :root 读取令牌，计算所有「文本级」组合的对比度比值，
并按 AA 标准（正文 ≥4.5:1 / 大字 ≥3:1）判定。
"""
import re
import io

css = io.open('style.css', encoding='utf-8').read()

# 解析 :root 内的 --token: #hex
m = re.search(r':root\s*\{(.*?)\n\}', css, re.S)
tokens = dict(re.findall(r'--([\w-]+):\s*(#[0-9A-Fa-f]{6})', m.group(1)))


def rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def lin(c):
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(h):
    r, g, b = rgb(h)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def ratio(fg, bg):
    l1, l2 = lum(fg), lum(bg)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)


# (前景, 背景, 说明, 阈值档位)
# 档位说明：
#   'text'    —— 正文级文本，WCAG 2.1 AA 要求 ≥4.5:1
#   'large'   —— 大字（≥18.66px bold 或 ≥24px），AA 要求 ≥3:1
#   'nontext' —— 非文本元素（边框 / 图标 / 图形），WCAG 1.4.11 要求 ≥3:1
CASES = [
    ('ink',        'paper',     '主文字 / 页面底',              'text'),
    ('ink',        'surface',   '主文字 / 卡片底',              'text'),
    ('ink-2',      'surface',   '次级文字 / 卡片底',            'text'),
    ('muted',      'paper',     '辅助文字 / 页面底',            'text'),
    ('muted-2',    'paper',     '弱化文字 / 页面底',            'text'),
    ('muted-2',    'paper-2',   '弱化文字 / 次级底',            'text'),
    ('muted-2',    'surface',   '弱化文字 / 卡片底',            'text'),
    ('accent-text', 'paper',    '品牌文本 / 页面底',            'text'),
    ('accent-text', 'surface',  '品牌文本 / 卡片底',            'text'),
    ('accent-text', 'accent-soft', '品牌文本 / 品牌浅底',       'text'),
    ('accent-text', 'paper-2',  '品牌文本 / 次级底',            'text'),
    ('paper',      'accent-text', '浅字 / 品牌实底（badge）',   'text'),
    ('sage',       'sage-bg',   '鼠尾草徽章文本 / 徽章底',      'text'),
    ('gold',       'gold-bg',   '金色徽章文本 / 徽章底',        'text'),
    ('plum',       'plum-bg',   '紫色徽章文本 / 徽章底',        'text'),
    ('warn-ink',   'warn-bg',   '警告文本 / 警告底',            'text'),
    ('success',    'paper',     '成功提示 / 页面底',            'text'),
    ('danger',     'paper',     '危险提示 / 页面底',            'text'),
    ('accent',     'paper',     '装饰色 / 页面底（仅边框图标）', 'nontext'),
]

# 对照：修复前的旧值
LEGACY = {
    'muted-2': '#7A736A',
    'accent-text': '#C8553D',
    'sage': '#7A8B6F',
    'gold': '#B0883E',
}

THRESH = {'text': 4.5, 'large': 3.0, 'nontext': 3.0}
GRADE = {'text': 'AA 正文', 'large': 'AA 大字', 'nontext': 'AA 非文本'}

print(f"{'组合':<34}{'比值':>7}  {'判定':<10} {'修复前':>8}  {'改善'}")
print('-' * 82)
fail = 0
for fg, bg, desc, kind in CASES:
    f, b = tokens.get(fg), tokens.get(bg)
    if not f or not b:
        print(f'  ⚠️ 令牌缺失: {fg} / {bg}')
        continue
    r = ratio(f, b)
    need = THRESH[kind]
    ok = r >= need

    old_fg = LEGACY.get(fg, f)
    old_r = ratio(old_fg, b) if old_fg != f else None
    old_s = f'{old_r:.2f}' + ('' if old_r is None or old_r >= need else ' ❌') if old_r else '—'
    delta = f'+{r - old_r:.2f}' if old_r else ''

    label = f'{fg} / {bg}'
    print(f'{label:<34}{r:>7.2f}  {("✅ " + GRADE[kind]) if ok else "❌ 未达":<10} {old_s:>8}  {delta}   {desc}')
    if not ok:
        fail += 1

print('-' * 82)
print(f'不达标组合数：{fail} / {len(CASES)}')
print('结论：' + ('✅ 全部达到 WCAG 2.1 AA' if fail == 0 else f'❌ 仍有 {fail} 组未达标'))

