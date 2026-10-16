/* a11y.js — WCAG 2.1 AA 只读审计：对比度 / 键盘 / 语义 / 缩放
   产出 a11y-report.json
*/
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const R = {};

  // ================= A. 对比度 =================
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await sleep(2600);

  // CSP 禁止 addScriptTag 内联脚本；改用 new Function 序列化（经 CDP Runtime.evaluate，不受 CSP 限制）
  const HELPERS = `
    function srgb(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
    function lum(r){return 0.2126*srgb(r[0])+0.7152*srgb(r[1])+0.0722*srgb(r[2]);}
    function ratio(a,b){const l1=lum(a),l2=lum(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
    function parse(s){const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x.trim()));return [p[0],p[1],p[2],p[3]===undefined?1:p[3]];}
    function effBg(el){let n=el,bg=[255,255,255];while(n&&n!==document.documentElement){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c[3]>0.6){bg=[c[0],c[1],c[2]];break;}n=n.parentElement;}return bg;}
    function alphaOver(fg,bg){const a=fg[3];return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a)];}
  `;
  const mkContrast = (body) => new Function('arg', HELPERS + '\n' + body);

  const contrastTargets = [
    ['body', '正文 body'], ['.hero-lede', 'Hero 导语'], ['.hero-title', 'Hero 主标题'],
    ['.eyebrow-no', 'eyebrow 编号(等宽)'], ['.eyebrow-text', 'eyebrow 中文'],
    ['.hero-vtext', 'Hero 竖排落款(装饰)'],
    ['.section-title', '区块标题 h2'], ['.section-aside .live-text', '区块右侧说明'],
    ['.rank-card .rc-title', '榜单卡标题'], ['.rank-card .rc-meta', '榜单卡元信息(等宽)'],
    ['.rank-card .rc-tag', '榜单卡标签'], ['.ranking-foot', '榜单脚注'],
    ['.qc-btn', '热门城市按钮'], ['.nav-link', '导航链接'], ['.btn-primary', '主按钮文字'],
    ['.meta-label', '表单标签'], ['.qc-label', '热门出发标签'],
  ];
  R.contrast = [];
  for (const [sel, label] of contrastTargets) {
    const t = await page.evaluate(mkContrast(`
      const { sel, label } = arg;
      const el = document.querySelector(sel);
      if (!el) return { label, sel, missing: true };
      const s = getComputedStyle(el);
      const bg = effBg(el);
      const fgRaw = parse(s.color);
      const fg = alphaOver(fgRaw, bg);
      return { label, sel, ratio: +ratio(fg, bg).toFixed(2), size: parseFloat(s.fontSize),
               weight: s.fontWeight, color: s.color, bg: 'rgb(' + bg.map(Math.round).join(',') + ')',
               text: (el.textContent || '').trim().slice(0, 14) };
    `), { sel, label });
    if (!t.missing) {
      const large = t.size >= 24 || (t.size >= 18.66 && parseInt(t.weight) >= 700);
      t.need = large ? 3 : 4.5;
      t.large = large;
      t.pass = t.ratio >= t.need;
    }
    R.contrast.push(t);
  }

  // 结果页对比度（含数据型等宽字、朱批、徽章）
  await page.fill('#cityInput', '成都');
  await page.click('#generateBtn');
  try { await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch (e) {}
  await sleep(2500);
  const resTargets = [
    ['.gc-idx', '区块序号(等宽)'], ['.gc-section > h2', '结果页 h2'], ['.gc-stat strong', '统计数字'],
    ['.budget-total', '预算合计'], ['.weather-temp', '气温(等宽)'], ['.poster .p-eyebrow', '海报 eyebrow(等宽)'],
    ['.compare-date', '对比日期(等宽)'], ['.gc-map-sub', '地图说明'], ['.result-title', '结果页主标题'],
    ['.gc-source-time', '数据来源时间(等宽)'], ['.tip-block li', '贴士正文'],
  ];
  R.contrastResult = [];
  for (const [sel, label] of resTargets) {
    const t = await page.evaluate(mkContrast(`
      const { sel, label } = arg;
      const el = document.querySelector(sel);
      if (!el) return { label, sel, missing: true };
      const s = getComputedStyle(el); const bg = effBg(el); const fgRaw = parse(s.color);
      const fg = alphaOver(fgRaw, bg);
      return { label, sel, ratio: +ratio(fg, bg).toFixed(2), size: parseFloat(s.fontSize), weight: s.fontWeight,
               color: s.color, bg: 'rgb(' + bg.map(Math.round).join(',') + ')', text: (el.textContent || '').trim().slice(0, 14) };
    `), { sel, label });
    if (!t.missing) { const large = t.size >= 24 || (t.size >= 18.66 && parseInt(t.weight) >= 700); t.need = large ? 3 : 4.5; t.large = large; t.pass = t.ratio >= t.need; }
    R.contrastResult.push(t);
  }

  // ================= B. 语义 / ARIA / landmark / 标题 =================
  R.semantics = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(h => h.offsetParent !== null || h.closest('[hidden]') === null)
      .map(h => ({ level: +h.tagName[1], text: (h.textContent || '').trim().slice(0, 26), hidden: !!h.closest('[hidden]') }));
    const landmarks = {};
    ['header', 'nav', 'main', 'footer', 'aside', 'form', 'article', 'section'].forEach(t => landmarks[t] = document.querySelectorAll(t).length);
    const roles = [...document.querySelectorAll('[role]')].map(e => ({ tag: e.tagName, role: e.getAttribute('role'), cls: (e.className || '').toString().slice(0, 30) }));
    const imgs = [...document.querySelectorAll('img')].map(i => ({ src: (i.getAttribute('src') || '').slice(0, 40), alt: i.getAttribute('alt'), hidden: i.getAttribute('aria-hidden') }));
    const lang = document.documentElement.getAttribute('lang');
    return { headings, landmarks, roles, imgs, lang };
  });

  // 空可访问名 / 表单标签
  R.namesAndLabels = await page.evaluate(() => {
    const nameOf = (el) => {
      if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
      const lb = el.getAttribute('aria-labelledby');
      if (lb) return lb.split(/\s+/).map(id => (document.getElementById(id) || {}).textContent || '').join(' ').trim();
      const t = (el.textContent || '').replace(/\\s+/g, ' ').trim();
      if (t) return t;
      return el.getAttribute('title') || el.getAttribute('alt') || '';
    };
    const emptyButtons = [...document.querySelectorAll('button, a[href]')]
      .filter(b => !b.closest('[hidden]') && !nameOf(b)).map(b => ({ tag: b.tagName, id: b.id, cls: (b.className || '').toString().slice(0, 30) }));
    const controls = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].map(c => {
      const id = c.id;
      const hasFor = id && document.querySelector('label[for="' + id + '"]');
      const wrapped = c.closest('label');
      return { id, type: c.type, label: !!(hasFor || wrapped), ariaLabel: c.getAttribute('aria-label'),
               ariaLabelledby: c.getAttribute('aria-labelledby'), placeholder: c.getAttribute('placeholder'), required: c.required };
    });
    // aria-hidden 祖先里含可聚焦元素
    const focusableInAriaHidden = [];
    document.querySelectorAll('[aria-hidden="true"]').forEach(h => {
      const f = h.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (f.length) focusableInAriaHidden.push({ cls: (h.className || '').toString().slice(0, 30), count: f.length });
    });
    return { emptyButtons, controls, focusableInAriaHidden };
  });

  // ================= C. 键盘 =================
  await page.evaluate(() => window.scrollTo(0, 0));
  // skip link?
  R.skipLink = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => /跳过|跳到|skip/i.test((x.textContent || '') + (x.getAttribute('href') || '')));
    return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null;
  });
  const stops = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(() => {
      const el = document.activeElement; if (!el) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, id: el.id, cls: (el.className || '').toString().slice(0, 24),
               text: (el.textContent || el.value || '').replace(/\\s+/g, ' ').trim().slice(0, 16),
               outline: cs.outlineStyle !== 'none' ? cs.outlineWidth + ' ' + cs.outlineColor + ' off' + cs.outlineOffset : 'NONE',
               boxShadow: cs.boxShadow !== 'none' };
    });
    stops.push(s);
  }
  R.tabStops = stops;

  // ================= D. 模态焦点管理 =================
  await page.click('#navFavoritesBtn');
  await sleep(400);
  R.modal = await page.evaluate(() => {
    const ov = document.getElementById('favoritesModal');
    const dlg = ov.querySelector('.modal');
    const a = document.activeElement;
    const closeBtn = document.getElementById('closeFavoritesModal');
    return {
      overlayRole: ov.getAttribute('role'), overlayAriaModal: ov.getAttribute('aria-modal'),
      overlayAriaLabel: ov.getAttribute('aria-label'), overlayAriaLabelledby: ov.getAttribute('aria-labelledby'),
      dialogRole: dlg.getAttribute('role'),
      closeBtnName: (closeBtn.getAttribute('aria-label') || closeBtn.textContent || '').trim(),
      focusInsideModal: ov.contains(a), activeTag: a.tagName, activeId: a.id,
      focusTrap: true,
    };
  });
  // Tab 循环测试：从当前焦点连按 12 次 Tab，看是否始终在 modal 内
  let trapped = true, escapedAt = -1;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => document.getElementById('favoritesModal').contains(document.activeElement));
    if (!inside) { trapped = false; escapedAt = i; break; }
  }
  R.modal.tabTrapped = trapped; R.modal.escapedAt = escapedAt;
  // Esc 关闭 + 焦点归还
  await page.keyboard.press('Escape');
  await sleep(300);
  R.modal.escClose = await page.evaluate(() => ({
    hidden: document.getElementById('favoritesModal').hidden,
    focusBack: document.activeElement.id || document.activeElement.tagName,
  }));

  // ================= E. prefers-reduced-motion 降级 =================
  const rc = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const rp = await rc.newPage();
  await rp.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await sleep(1500);
  R.reducedMotion = await rp.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal')];
    const anims = [...document.querySelectorAll('.hero-inner,.hero-aside,.hero-title,.search-card,.section-head')].map(e => {
      const s = getComputedStyle(e); return { cls: (e.className||'').toString().slice(0,20), opacity: s.opacity, dur: s.animationDuration, transDur: s.transitionDuration };
    });
    return { revealCount: els.length,
             allVisible: els.every(e => parseFloat(getComputedStyle(e).opacity) > 0.9 && getComputedStyle(e).transform === 'none'),
             samples: anims };
  });
  await rc.close();
  await ctx.close();

  // ================= F. 缩放 200%（reflow）=================
  R.zoom = [];
  for (const w of [720, 640]) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await sleep(2000);
    const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    // 是否有关键文本被裁切（水平溢出元素）
    const clipped = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('h1,h2,p,.btn-primary,.nav-link,.meta-label,input,select,button').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.left < -1 || r.right > window.innerWidth + 1)) out.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,20), left: Math.round(r.left), right: Math.round(r.right) });
      });
      return out.slice(0, 10);
    });
    R.zoom.push({ width: w, overflowPx: over, pass: over <= 0, clipped });
    await c.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'a11y-report.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
