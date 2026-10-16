/* a11y2.js — 补充审计：首页 Tab 序 / 徽章对比度 / listbox 语义 / 未标注控件 / 标题跳级 */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const HELPERS = `
  function srgb(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function lum(r){return 0.2126*srgb(r[0])+0.7152*srgb(r[1])+0.0722*srgb(r[2]);}
  function ratio(a,b){const l1=lum(a),l2=lum(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
  function parse(s){const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x.trim()));return [p[0],p[1],p[2],p[3]===undefined?1:p[3]];}
  function effBg(el){let n=el,bg=[255,255,255];while(n&&n!==document.documentElement){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c[3]>0.6){bg=[c[0],c[1],c[2]];break;}n=n.parentElement;}return bg;}
  function alphaOver(fg,bg){const a=fg[3];return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a)];}
`;
const mk = (body) => new Function('arg', HELPERS + '\n' + body);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const R = {};
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await sleep(2600);

  // ---- 首页 Tab 序（前 16 站）+ skip link ----
  const stops = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    stops.push(await page.evaluate(() => { const el = document.activeElement; if (!el) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, id: el.id, cls: (el.className||'').toString().slice(0,22),
        text: (el.textContent || el.value || '').replace(/\\s+/g,' ').trim().slice(0,18),
        outline: cs.outlineStyle !== 'none' ? cs.outlineWidth+' '+cs.outlineColor+' off'+cs.outlineOffset : 'NONE' }; }));
  }
  R.homeTabStops = stops;
  R.homeSkipLink = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => /跳过|跳到|skip/i.test((x.textContent||'')+(x.getAttribute('href')||'')));
    return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null;
  });

  // ---- R3: skip-link 功能复验（首个 Tab 出现 / 聚焦可见 / 激活后焦点落到 main） ----
  await page.reload({ waitUntil: 'load' });
  await sleep(1500);
  await page.keyboard.press('Tab');
  R.skipLinkFocus = await page.evaluate(() => {
    const el = document.activeElement; const cs = getComputedStyle(el);
    return { tag: el.tagName, cls: (el.className||'').toString(), text: (el.textContent||'').trim(),
             top: cs.top, position: cs.position, outline: cs.outlineStyle !== 'none' ? cs.outlineWidth+' '+cs.outlineColor : 'NONE',
             bg: cs.backgroundColor, color: cs.color, visibleInViewport: el.getBoundingClientRect().top >= 0 };
  });
  await page.keyboard.press('Enter');
  await sleep(400);
  R.skipLinkActivate = await page.evaluate(() => {
    const el = document.activeElement; const m = document.getElementById('homePage');
    return { activeTag: el.tagName, activeId: el.id, focusOnMain: el === m,
             mainTabindex: m.getAttribute('tabindex'), scrollY: Math.round(window.scrollY) };
  });

  // ---- 徽章对比度（朱批 / 徽章变体） ----
  const badgeSels = ['.badge', '.cc-badge-官方', '.cc-badge-比价', '.cc-badge-本地', '.cc-badge-民宿'];
  R.badges = [];
  for (const sel of badgeSels) {
    const t = await page.evaluate(mk(`
      const { sel } = arg; const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const s = getComputedStyle(el); const bg = effBg(el); const fg = alphaOver(parse(s.color), bg);
      return { sel, ratio: +ratio(fg, bg).toFixed(2), size: parseFloat(s.fontSize), weight: s.fontWeight,
               color: s.color, bg: 'rgb('+bg.map(Math.round).join(',')+')', text:(el.textContent||'').trim().slice(0,10) };
    `), { sel });
    if (!t.missing) { const large = t.size >= 24 || (t.size >= 18.66 && parseInt(t.weight) >= 700); t.need = large?3:4.5; t.pass = t.ratio >= t.need; }
    R.badges.push(t);
  }

  // ---- 搜索建议 listbox 语义 ----
  await page.fill('#cityInput', '成');
  await sleep(700);
  R.listbox = await page.evaluate(() => {
    const lb = document.getElementById('searchSuggestions');
    const inp = document.getElementById('cityInput');
    if (!lb) return { missing: true };
    const opts = [...lb.querySelectorAll('[role], li, div')].slice(0, 8).map(o => ({ tag: o.tagName, role: o.getAttribute('role'), text: (o.textContent||'').trim().slice(0,10) }));
    return { hidden: lb.hidden, role: lb.getAttribute('role'), optionCount: lb.querySelectorAll('[role="option"]').length,
             ariaLabel: lb.getAttribute('aria-label'), childCount: lb.children.length,
             inputActiveDescendant: inp.getAttribute('aria-activedescendant'),
             inputExpanded: inp.getAttribute('aria-expanded'),
             inputAutocomplete: inp.getAttribute('aria-autocomplete'),
             options: opts };
  });
  await page.fill('#cityInput', '');
  await sleep(300);

  // ---- 结果页：未标注控件上下文 + 标题跳级 + 重复 h2 ----
  await page.fill('#cityInput', '成都');
  await page.click('#generateBtn');
  try { await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch (e) {}
  await sleep(2500);

  R.controlContext = await page.evaluate(() => {
    const pi = document.getElementById('photoInput');
    const fi = document.getElementById('favSearchInput');
    const ctxOf = (el) => { if (!el) return null; const p = el.closest('label,.meta-group,.field,.upload,div');
      return { parentCls: (el.parentElement.className||'').toString().slice(0,30),
               nearestLabel: !!el.closest('label'),
               siblingText: (p ? (p.textContent||'').replace(/\\s+/g,' ').trim().slice(0,40) : '') }; };
    return { photoInput: pi ? ctxOf(pi) : 'absent', favSearchInput: ctxOf(fi) };
  });

  R.headingAudit = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => !h.closest('[hidden]'));
    const seq = hs.map(h => +h.tagName[1]);
    const jumps = [];
    for (let i = 1; i < seq.length; i++) if (seq[i] - seq[i-1] > 1) jumps.push({ from: 'h'+seq[i-1], to: 'h'+seq[i], text: (hs[i].textContent||'').trim().slice(0,16) });
    const dupH2 = {}; hs.filter(h=>h.tagName==='H2').forEach(h=>{ const t=(h.textContent||'').trim(); dupH2[t]=(dupH2[t]||0)+1; });
    return { sequence: seq, jumps, duplicateH2: Object.entries(dupH2).filter(([k,v])=>v>1), h1Count: seq.filter(x=>x===1).length };
  });

  // ---- 结果页显示时，首页是否 aria-hidden / inert ----
  R.pageSwitching = await page.evaluate(() => ({
    homeHidden: document.getElementById('homePage').hidden,
    homeAriaHidden: document.getElementById('homePage').getAttribute('aria-hidden'),
    resultHidden: document.getElementById('resultPage').hidden,
    resultAriaHidden: document.getElementById('resultPage').getAttribute('aria-hidden'),
    resultRole: document.getElementById('resultPage').getAttribute('role'),
  }));

  await ctx.close();
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'a11y2-report.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
