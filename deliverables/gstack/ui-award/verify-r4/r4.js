/* R4 终验 (gstack-qa-lead) —— 只读
 * 覆盖：6 档溢出 / 触摸目标(全量,fine+coarse) / 功能回归 17 / ≤860px 水墨立轴可见性与 CTA 挤压 / 墨迹动画(reduced-motion)
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = __dirname;
const CITY = '成都';
const BPS = [{ w: 1920, h: 1000 }, { w: 1440, h: 900 }, { w: 1024, h: 768 }, { w: 768, h: 1024 }, { w: 414, h: 896 }, { w: 375, h: 812 }];
const TOUCH_BPS = [768, 414, 375];
function ensure(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
ensure(OUT);

const OVERFLOW = () => ({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, over: document.documentElement.scrollWidth - window.innerWidth });
const TOUCH = () => {
  const sels = 'a[href], button, input:not([type=hidden]), select, textarea, [role="button"], .pill, .style-pill, .qc-btn, .nav-link, .nav-menu-item, .suggestion-item, .history-chip, .icon-btn, .back-btn, .modal-close, .toast-action, .ext-link, .ra-link';
  const out = [];
  document.querySelectorAll(sels).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) return;
    const w = Math.round(r.width), h = Math.round(r.height);
    if (w < 48 || h < 48) out.push({ tag: el.tagName, id: el.id || '', cls: String(el.className || '').slice(0, 40), w, h, txt: (el.textContent || '').trim().slice(0, 14) });
  });
  return out;
};
const INK = () => {
  const q = s => document.querySelector(s);
  const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), right: Math.round(r.right), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) }; };
  const aside = q('.hero-aside'), ink = q('.ink-scroll'), card = q('.search-card'), cta = q('#generateBtn'), hero = q('.hero-inner');
  const ar = rect(aside), ir = rect(ink), cr = rect(card), ctar = rect(cta);
  return {
    vw: window.innerWidth,
    asideDisplay: aside ? getComputedStyle(aside).display : null,
    asideVisible: !!(ar && ar.w > 0 && ar.h > 0),
    asideRect: ar,
    inkRect: ir,
    inkDisplay: ink ? getComputedStyle(ink).display : null,
    cardRect: cr,
    ctaRect: ctar,
    heroInnerDisplay: hero ? getComputedStyle(hero).display : null,
    asideAfterCard: !!(ar && cr && ar.y >= cr.bottom - 2),
    asideCentered: ar ? Math.abs(ar.x - (window.innerWidth - ar.right)) <= 12 : null,
  };
};
const INKANIM = () => {
  const route = document.querySelector('.ink-route');
  const nodes = document.querySelectorAll('.ink-nodes circle');
  const summit = document.querySelector('.ink-summit');
  const cs = route ? getComputedStyle(route) : null;
  return {
    routeAnim: cs ? cs.animationName : null,
    routeDashoffset: cs ? cs.strokeDashoffset : null,
    routeDasharray: cs ? cs.strokeDasharray : null,
    nodeOpacity: nodes.length ? getComputedStyle(nodes[0]).opacity : null,
    summitOpacity: summit ? getComputedStyle(summit).opacity : null,
    inkScrollDisplay: document.querySelector('.ink-scroll') ? getComputedStyle(document.querySelector('.ink-scroll')).display : null,
  };
};

(async () => {
  const report = { ts: new Date().toISOString(), overflow: [], ink: [], touch: [], functional: [], rm: {}, console: [] };
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--force-device-scale-factor=1'] });

  // 1. 六档溢出 + 立轴几何
  for (const bp of BPS) {
    const ctx = await browser.newContext({ viewport: { width: bp.w, height: bp.h }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 110)); }); p.on('pageerror', e => errs.push('pageerror:' + e.message.slice(0, 110)));
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2800);
    const home = await p.evaluate(OVERFLOW);
    const ink = await p.evaluate(INK);
    await p.screenshot({ path: path.join(OUT, `home-${bp.w}.png`) });
    let result = null;
    try { await p.fill('#cityInput', CITY); await p.click('#generateBtn'); await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); await p.waitForTimeout(1500); result = await p.evaluate(OVERFLOW); await p.screenshot({ path: path.join(OUT, `result-${bp.w}.png`) }); } catch (e) { result = { err: e.message.slice(0, 90) }; }
    report.overflow.push({ w: bp.w, home, result });
    report.ink.push({ w: bp.w, ...ink });
    report.console.push({ w: bp.w, errs: [...new Set(errs)] });
    await ctx.close();
  }

  // 2. 触摸目标（fine + coarse）
  for (const mode of ['fine', 'coarse']) {
    for (const w of TOUCH_BPS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block', hasTouch: mode === 'coarse', isMobile: mode === 'coarse' });
      const p = await ctx.newPage();
      await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2200);
      const home = await p.evaluate(TOUCH);
      await p.fill('#cityInput', CITY); await p.click('#generateBtn');
      try { await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); } catch (e) {}
      await p.waitForTimeout(1200);
      const result = await p.evaluate(TOUCH);
      report.touch.push({ mode, w, homeCount: home.length, resultCount: result.length, offenders: home.concat(result).slice(0, 10) });
      await ctx.close();
    }
  }

  // 3. 功能回归
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const popups = [], downloads = [];
  page.on('popup', p => popups.push(p.url())); page.on('download', d => downloads.push(d.suggestedFilename()));
  const F = []; const check = async (n, fn) => { try { const d = await fn(); F.push({ name: n, ok: d === true || (d && d.ok), detail: (d && d.detail) !== undefined ? d.detail : (d === true ? '' : d) }); } catch (e) { F.push({ name: n, ok: false, detail: 'EXC:' + e.message.slice(0, 120) }); } };
  const tt = () => page.evaluate(() => Array.from(document.querySelectorAll('#toastWrap .toast')).map(t => t.textContent).join(' | '));
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(2600);
  await check('搜索联想', async () => { await page.fill('#cityInput', '成'); await page.waitForTimeout(700); const r = await page.evaluate(() => { const s = document.getElementById('searchSuggestions'); return { hidden: s.hidden, n: s.querySelectorAll('.suggestion-item').length }; }); return { ok: !r.hidden && r.n > 0, detail: r }; });
  await check('联想回填', async () => { const b = await page.inputValue('#cityInput'); await page.evaluate(() => { const it = document.querySelector('#searchSuggestions .suggestion-item'); if (it) it.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); }); await page.waitForTimeout(300); const a = await page.inputValue('#cityInput'); return { ok: a !== b && a.length > 0, detail: { b, a } }; });
  await check('加载层出现', async () => { await page.evaluate(() => { document.getElementById('homePage').hidden = false; document.getElementById('resultPage').hidden = true; }); await page.fill('#cityInput', CITY); await page.click('#generateBtn'); let s = false; for (let i = 0; i < 30; i++) { if (await page.evaluate(() => !document.getElementById('loading').hidden)) { s = true; break; } await page.waitForTimeout(60); } return { ok: s, detail: { sawLoading: s } }; });
  await check('结果页渲染', async () => { await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); await page.waitForTimeout(1500); return true; });
  await check('13 区块完整', async () => { const r = await page.evaluate(() => ({ sections: document.querySelectorAll('#guideContent .gc-section').length, routeDays: document.querySelectorAll('.route-day').length, foodCards: document.querySelectorAll('.food-card').length, compareCards: document.querySelectorAll('.compare-card').length, mapBox: !!document.getElementById('gcMapBox'), poster: !!document.getElementById('poster') && document.getElementById('poster').children.length > 0 })); return { ok: r.sections >= 13 && r.routeDays >= 1 && r.foodCards >= 1, detail: r }; });
  await check('收藏', async () => { await page.click('#favoriteBtn'); await page.waitForTimeout(500); const r = await page.evaluate(() => ({ p: document.getElementById('favoriteBtn').getAttribute('aria-pressed'), c: document.getElementById('navFavCount').textContent })); return { ok: r.p === 'true' && +r.c >= 1, detail: { ...r, toast: await tt() } }; });
  await check('复制', async () => { await page.click('#copyTextBtn'); await page.waitForTimeout(500); return { ok: true, detail: { toast: await tt() } }; });
  await check('分享链接', async () => { await page.click('#shareLinkBtn'); await page.waitForTimeout(500); return { ok: true, detail: { toast: await tt() } }; });
  await check('下载海报', async () => { await page.click('#downloadPosterBtn'); await page.waitForTimeout(3500); return { ok: downloads.length > 0, detail: { downloads } }; });
  await check('查天气', async () => { const n = popups.length; await page.click('#weatherBtn'); await page.waitForTimeout(800); return { ok: popups.length > n, detail: { popups } }; });
  await check('收藏弹层开/关', async () => { await page.click('#navFavoritesBtn'); await page.waitForTimeout(500); const o = await page.evaluate(() => !document.getElementById('favoritesModal').hidden); await page.click('#closeFavoritesModal'); await page.waitForTimeout(500); const c = await page.evaluate(() => document.getElementById('favoritesModal').hidden); return { ok: o && c, detail: { o, c } }; });
  await check('Toast', async () => { await page.click('#favoriteBtn'); await page.waitForTimeout(400); const n = await page.evaluate(() => document.getElementById('toastWrap').children.length); return { ok: n > 0, detail: { n, toast: await tt() } }; });
  await check('返回顶部', async () => { await page.evaluate(() => window.scrollTo(0, 1600)); await page.waitForTimeout(500); const sh = await page.evaluate(() => !document.getElementById('backToTop').hidden); await page.click('#backToTop'); let y = 9999; for (let i = 0; i < 14; i++) { await page.waitForTimeout(250); y = await page.evaluate(() => window.scrollY); if (y < 5) break; } return { ok: sh && y < 80, detail: { sh, y } }; });
  await check('再次生成', async () => { await page.click('#regenerateBtn'); await page.waitForTimeout(700); const r = await page.evaluate(() => ({ home: !document.getElementById('homePage').hidden, city: document.getElementById('cityInput').value })); return { ok: r.home && r.city.length > 0, detail: r }; });
  await check('返回首页', async () => { await page.fill('#cityInput', CITY); await page.click('#generateBtn'); await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); await page.click('#backBtn'); await page.waitForTimeout(600); const r = await page.evaluate(() => ({ home: !document.getElementById('homePage').hidden, res: document.getElementById('resultPage').hidden })); return { ok: r.home && r.res, detail: r }; });
  await check('榜单', async () => { const n = await page.evaluate(() => document.getElementById('rankingList').children.length); return { ok: n > 0, detail: { cards: n } }; });
  await check('浏览历史', async () => { await page.waitForTimeout(400); const r = await page.evaluate(() => ({ hidden: document.getElementById('historySection').hidden, n: document.getElementById('recentHistoryList').children.length })); return { ok: !r.hidden && r.n > 0, detail: r }; });
  report.functional = F;
  await ctx.close();

  // 4. 墨迹动画 / reduced-motion
  const rmCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const rp = await rmCtx.newPage(); await rp.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await rp.waitForTimeout(1200);
  report.rm = await rp.evaluate(INKANIM);
  await rmCtx.close();
  const npCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'no-preference' });
  const npp = await npCtx.newPage(); await npp.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await npp.waitForTimeout(500);
  report.np = await npp.evaluate(INKANIM);
  await npCtx.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, '_r4.json'), JSON.stringify(report, null, 2));
  console.log('\n===== OVERFLOW =====');
  report.overflow.forEach(o => console.log(`w=${String(o.w).padEnd(5)} home=${o.home.over} (${o.home.scrollW}/${o.home.innerW})  result=${o.result.over !== undefined ? o.result.over : 'ERR'} (${o.result.scrollW || '-'}/${o.result.innerW || '-'})`));
  console.log('\n===== INK-SCROLL (<=860 visible?) =====');
  report.ink.forEach(i => console.log(`w=${i.w} heroInner=${i.heroInnerDisplay} asideDisplay=${i.asideDisplay} visible=${i.asideVisible} ink=${i.inkRect ? i.inkRect.w + 'x' + i.inkRect.h : '-'} afterCard=${i.asideAfterCard} centered=${i.asideCentered} cta=${i.ctaRect ? i.ctaRect.w + 'x' + i.ctaRect.h : '-'}`));
  console.log('\n===== TOUCH =====');
  report.touch.forEach(t => console.log(`[${t.mode}] w=${t.w} home=${t.homeCount} result=${t.resultCount}` + (t.offenders.length ? ' :: ' + JSON.stringify(t.offenders.map(x => `${x.tag}.${x.cls.split(' ')[0]}${x.id ? '#' + x.id : ''} ${x.w}x${x.h}`)) : '')));
  console.log('\n===== FUNCTIONAL =====');
  report.functional.forEach(f => console.log(`${f.ok ? 'PASS' : 'FAIL'}  ${f.name}  ::  ${JSON.stringify(f.detail)}`));
  console.log('\n===== INK ANIM =====');
  console.log('reduce     :', JSON.stringify(report.rm));
  console.log('no-pref    :', JSON.stringify(report.np));
  console.log('\n===== CONSOLE =====');
  report.console.forEach(c => console.log(`w=${c.w}: ${c.errs.length}` + (c.errs.length ? ' :: ' + c.errs.join(' | ') : '')));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
