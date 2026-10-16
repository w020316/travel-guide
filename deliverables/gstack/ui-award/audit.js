/* 八维度自检：对比度 / 触摸目标 / 焦点环 / 全断点溢出 / 减少动效 (gstack-designer) */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';

function srgb(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function lum(rgb) { return 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]); }
function contrast(a, b) { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }
function parseRGB(s) { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x.trim())); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const report = { contrast: [], touch: [], overflow: [], focus: {}, reducedMotion: {}, notes: [] };

  // ---- A. 对比度（桌面） ----
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2600);

  const pick = async (sel, label) => page.evaluate(({ sel, label }) => {
    const el = document.querySelector(sel); if (!el) return { label, sel, missing: true };
    const s = getComputedStyle(el);
    // 向上找第一个非透明背景
    let bg = 'rgba(0, 0, 0, 0)', n = el;
    while (n && n !== document.documentElement) { const bs = getComputedStyle(n).backgroundColor; const p = bs.match(/rgba?\(([^)]+)\)/); if (p) { const arr = p[1].split(',').map(Number); if ((arr[3] === undefined ? 1 : arr[3]) > 0.6) { bg = bs; break; } } n = n.parentElement; }
    return { label, sel, color: s.color, bg, fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight };
  }, { sel, label });

  const targets = [
    ['body', '正文 body'],
    ['.hero-lede', 'Hero 导语'],
    ['.hero-title', 'Hero 主标题'],
    ['.eyebrow', 'Hero eyebrow'],
    ['.section-title', '区块标题'],
    ['.rank-card .rc-title', '卡片副标题'],
    ['.rank-card .rc-tag', '卡片标签'],
    ['.rank-card .rc-meta', '卡片元信息'],
    ['.qc-btn', '热门城市按钮'],
    ['.nav-link', '导航链接'],
    ['.btn-primary', '主按钮文字'],
    ['.search-card .meta-label', '表单标签'],
    ['#cityInput', '城市输入框'],
    ['.ranking-foot', '榜单脚注'],
    ['.section-aside', '区块右侧说明'],
  ];
  for (const [sel, label] of targets) {
    const t = await pick(sel, label);
    if (t.missing) { report.contrast.push({ label, missing: true }); continue; }
    const fg = parseRGB(t.color), bg = parseRGB(t.bg);
    if (!fg || !bg) { report.contrast.push({ label, note: 'unparsed', color: t.color, bg: t.bg }); continue; }
    const ratio = contrast(fg, bg);
    const large = t.fontSize >= 24 || (t.fontSize >= 18.66 && parseInt(t.fontWeight) >= 700);
    const need = large ? 3 : 4.5;
    report.contrast.push({ label, ratio: +ratio.toFixed(2), need, pass: ratio >= need, size: t.fontSize, fg: t.color, bg: t.bg });
  }

  // ---- B. 焦点环（键盘可见性） ----
  await page.keyboard.press('Tab');
  report.focus = await page.evaluate(() => {
    const el = document.activeElement; if (!el) return { none: true };
    const s = getComputedStyle(el);
    return { tag: el.tagName, cls: el.className, outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor, offset: s.outlineOffset };
  });

  await ctx.close();

  // ---- C. 全断点溢出 + 触摸目标（移动） ----
  const breakpoints = [1920, 1440, 1024, 768, 414, 375];
  for (const w of breakpoints) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2000);
    const homeOver = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

    // v11.1 R2：全量选择器触摸目标测量（首页）
    const touchProbe = () => {
      const SEL = 'a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
      const out = [];
      document.querySelectorAll(SEL).forEach(el => {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.width < 48 || r.height < 48) {
          out.push({
            tag: el.tagName.toLowerCase(), id: el.id || '',
            cls: (el.className || '').toString().split(' ')[0].slice(0, 24),
            w: Math.round(r.width), h: Math.round(r.height),
            txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 12),
          });
        }
      });
      return out;
    };
    const homeSmall = w <= 768 ? await p.evaluate(touchProbe) : null;

    // 结果页
    await p.fill('#cityInput', '成都');
    await p.click('#generateBtn');
    try { await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch (e) {}
    await p.waitForTimeout(1500);
    const resOver = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    report.overflow.push({ w, home: homeOver, result: resOver, pass: homeOver <= 0 && resOver <= 0 });

    if (w <= 768) {
      const resSmall = await p.evaluate(touchProbe);
      report.touch.push({ w, homeCount: homeSmall.length, home: homeSmall.slice(0, 12), resultCount: resSmall.length, result: resSmall.slice(0, 12) });
    }
    await c.close();
  }

  // ---- D. prefers-reduced-motion ----
  const rc = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const rp = await rc.newPage();
  await rp.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await rp.waitForTimeout(1200);
  report.reducedMotion = await rp.evaluate(() => {
    const vis = (sel) => { const el = document.querySelector(sel); if (!el) return null; const s = getComputedStyle(el); return { opacity: s.opacity, transform: s.transform }; };
    return {
      heroTitle: vis('.hero-title'),
      searchCard: vis('.search-card'),
      revealVisible: [...document.querySelectorAll('.reveal')].every(e => parseFloat(getComputedStyle(e).opacity) > 0.9),
      revealCount: document.querySelectorAll('.reveal').length,
    };
  });
  await rc.close();

  await browser.close();
  const out = path.join(__dirname, 'after', '_audit.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
