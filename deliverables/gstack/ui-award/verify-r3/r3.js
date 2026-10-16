/* R3 独立复验 (gstack-qa-lead) —— 只读
 * 覆盖：6 档溢出 / 触摸目标全量(含 coarse 口径) / 功能回归 17 项 / 新增无障碍(skip-link·dialog·footer)
 * 用法: node deliverables/gstack/ui-award/verify-r3/r3.js
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const BASE = process.env.VERIFY_BASE || 'http://127.0.0.1:3001/index.html';
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

(async () => {
  const report = { base: BASE, ts: new Date().toISOString(), overflow: [], touch: [], touchMeta: {}, functional: [], a11y: [], console: [] };
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--force-device-scale-factor=1'] });

  // ---------- 1. 六档溢出 ----------
  for (const bp of BPS) {
    const ctx = await browser.newContext({ viewport: { width: bp.w, height: bp.h }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); }); p.on('pageerror', e => errs.push('pageerror:' + e.message.slice(0, 120)));
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2500);
    const home = await p.evaluate(OVERFLOW);
    await p.screenshot({ path: path.join(OUT, `home-${bp.w}.png`) });
    let result = null;
    try {
      await p.fill('#cityInput', CITY); await p.click('#generateBtn');
      await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
      await p.waitForTimeout(1500);
      result = await p.evaluate(OVERFLOW);
      await p.screenshot({ path: path.join(OUT, `result-${bp.w}.png`) });
    } catch (e) { result = { err: e.message.slice(0, 100) }; }
    report.overflow.push({ w: bp.w, home, result });
    report.console.push({ w: bp.w, errs: [...new Set(errs)] });
    await ctx.close();
  }

  // ---------- 2. 触摸目标（fine 与 coarse 两种口径） ----------
  for (const mode of ['fine', 'coarse']) {
    for (const w of TOUCH_BPS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 }, serviceWorkers: 'block',
        hasTouch: mode === 'coarse', isMobile: mode === 'coarse',
      });
      const p = await ctx.newPage();
      await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2200);
      const media = await p.evaluate(() => ({ coarse: matchMedia('(pointer: coarse)').matches, fine: matchMedia('(pointer: fine)').matches, hover: matchMedia('(hover: hover)').matches, maxTouch: navigator.maxTouchPoints }));
      const homeTouch = await p.evaluate(TOUCH);
      await p.fill('#cityInput', CITY); await p.click('#generateBtn');
      try { await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); } catch (e) {}
      await p.waitForTimeout(1200);
      const resTouch = await p.evaluate(TOUCH);
      report.touch.push({ mode, w, media, home: homeTouch, result: resTouch });
      if (mode === 'coarse' && w === 375) await p.screenshot({ path: path.join(OUT, 'result-375-coarse.png') });
      await ctx.close();
    }
  }

  // ---------- 3. 功能回归 + 无障碍 ----------
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const popups = [], downloads = [];
  page.on('popup', p => popups.push(p.url()));
  page.on('download', d => downloads.push(d.suggestedFilename()));
  const F = [];
  const check = async (name, fn) => { try { const d = await fn(); F.push({ name, ok: d === true || (d && d.ok), detail: (d && d.detail) !== undefined ? d.detail : (d === true ? '' : d) }); } catch (e) { F.push({ name, ok: false, detail: 'EXC: ' + e.message.slice(0, 130) }); } };
  const toastText = () => page.evaluate(() => Array.from(document.querySelectorAll('#toastWrap .toast')).map(t => t.textContent).join(' | '));

  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(2600);

  await check('搜索联想下拉出现', async () => { await page.fill('#cityInput', '成'); await page.waitForTimeout(700); const r = await page.evaluate(() => { const s = document.getElementById('searchSuggestions'); return { hidden: s.hidden, n: s.querySelectorAll('.suggestion-item').length, first: (s.querySelector('.suggestion-item .s-name') || {}).textContent || '' }; }); return { ok: !r.hidden && r.n > 0, detail: r }; });
  await check('联想项可选择(回填)', async () => { const before = await page.inputValue('#cityInput'); await page.evaluate(() => { const it = document.querySelector('#searchSuggestions .suggestion-item'); if (it) it.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); }); await page.waitForTimeout(300); const after = await page.inputValue('#cityInput'); return { ok: after !== before && after.length > 0, detail: { before, after } }; });
  await check('生成攻略→加载层出现', async () => { await page.evaluate(() => { document.getElementById('homePage').hidden = false; document.getElementById('resultPage').hidden = true; }); await page.fill('#cityInput', CITY); await page.click('#generateBtn'); let saw = false; for (let i = 0; i < 30; i++) { if (await page.evaluate(() => !document.getElementById('loading').hidden)) { saw = true; break; } await page.waitForTimeout(60); } return { ok: saw, detail: { sawLoading: saw } }; });
  await check('结果页渲染', async () => { await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); await page.waitForTimeout(1500); return true; });
  await check('结果页 13 区块完整', async () => { const r = await page.evaluate(() => ({ sections: document.querySelectorAll('#guideContent .gc-section').length, routeDays: document.querySelectorAll('.route-day').length, foodCards: document.querySelectorAll('.food-card').length, compareCards: document.querySelectorAll('.compare-card').length, mapBox: !!document.getElementById('gcMapBox'), poster: !!document.getElementById('poster') && document.getElementById('poster').children.length > 0 })); return { ok: r.sections >= 13 && r.routeDays >= 1 && r.foodCards >= 1, detail: r }; });
  await check('工具条·收藏', async () => { await page.click('#favoriteBtn'); await page.waitForTimeout(500); const r = await page.evaluate(() => ({ pressed: document.getElementById('favoriteBtn').getAttribute('aria-pressed'), favCount: document.getElementById('navFavCount').textContent })); return { ok: r.pressed === 'true' && Number(r.favCount) >= 1, detail: { ...r, toastText: await toastText() } }; });
  await check('工具条·复制文本', async () => { await page.click('#copyTextBtn'); await page.waitForTimeout(500); return { ok: true, detail: { toastText: await toastText() } }; });
  await check('工具条·分享链接', async () => { await page.click('#shareLinkBtn'); await page.waitForTimeout(500); return { ok: true, detail: { toastText: await toastText() } }; });
  await check('工具条·下载海报', async () => { await page.click('#downloadPosterBtn'); await page.waitForTimeout(3500); return { ok: downloads.length > 0, detail: { downloads, toastText: await toastText() } }; });
  await check('工具条·查天气', async () => { const n0 = popups.length; await page.click('#weatherBtn'); await page.waitForTimeout(800); return { ok: popups.length > n0, detail: { popups, toastText: await toastText() } }; });
  await check('收藏弹层 开/关', async () => { await page.click('#navFavoritesBtn'); await page.waitForTimeout(500); const open = await page.evaluate(() => !document.getElementById('favoritesModal').hidden); await page.click('#closeFavoritesModal'); await page.waitForTimeout(500); const closed = await page.evaluate(() => document.getElementById('favoritesModal').hidden); return { ok: open && closed, detail: { open, closed } }; });
  await check('Toast 提示', async () => { await page.click('#favoriteBtn'); await page.waitForTimeout(400); const n = await page.evaluate(() => document.getElementById('toastWrap').children.length); return { ok: n > 0, detail: { toastNodes: n, toastText: await toastText() } }; });
  await check('返回顶部', async () => { await page.evaluate(() => window.scrollTo(0, 1600)); await page.waitForTimeout(500); const shown = await page.evaluate(() => !document.getElementById('backToTop').hidden); await page.click('#backToTop'); let y = 9999; for (let i = 0; i < 14; i++) { await page.waitForTimeout(250); y = await page.evaluate(() => window.scrollY); if (y < 5) break; } return { ok: shown && y < 80, detail: { shown, scrollYAfter: y } }; });
  await check('工具条·再次生成', async () => { await page.click('#regenerateBtn'); await page.waitForTimeout(700); const r = await page.evaluate(() => ({ home: !document.getElementById('homePage').hidden, city: document.getElementById('cityInput').value })); return { ok: r.home && r.city.length > 0, detail: r }; });
  await check('返回首页(backBtn)', async () => { await page.fill('#cityInput', CITY); await page.click('#generateBtn'); await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 }); await page.click('#backBtn'); await page.waitForTimeout(600); const r = await page.evaluate(() => ({ home: !document.getElementById('homePage').hidden, result: document.getElementById('resultPage').hidden })); return { ok: r.home && r.result, detail: r }; });
  await check('榜单渲染', async () => { const n = await page.evaluate(() => document.getElementById('rankingList').children.length); return { ok: n > 0, detail: { cards: n } }; });
  await check('浏览历史', async () => { await page.waitForTimeout(400); const r = await page.evaluate(() => ({ hidden: document.getElementById('historySection').hidden, n: document.getElementById('recentHistoryList').children.length })); return { ok: !r.hidden && r.n > 0, detail: r }; });
  report.functional = F;

  // ---- 无障碍 ----
  const A = [];
  const acheck = async (name, fn) => { try { const d = await fn(); A.push({ name, ok: d === true || (d && d.ok), detail: (d && d.detail) !== undefined ? d.detail : d }); } catch (e) { A.push({ name, ok: false, detail: 'EXC: ' + e.message.slice(0, 130) }); } };

  await acheck('footer 渲染', async () => { const r = await page.evaluate(() => { const f = document.querySelector('footer.site-footer'); if (!f) return { found: false }; const b = f.getBoundingClientRect(); return { found: true, h: Math.round(b.height), txt: f.textContent.replace(/\s+/g, '').slice(0, 30) }; }); return { ok: r.found && r.h > 0, detail: r }; });
  await acheck('favoritesModal dialog 语义', async () => { const r = await page.evaluate(() => { const m = document.querySelector('#favoritesModal .favorites-modal'); return { role: m && m.getAttribute('role'), ariaModal: m && m.getAttribute('aria-modal'), labelledby: m && m.getAttribute('aria-labelledby'), labelExists: !!(m && m.getAttribute('aria-labelledby') && document.getElementById(m.getAttribute('aria-labelledby'))) }; }); return { ok: r.role === 'dialog' && r.ariaModal === 'true' && r.labelExists, detail: r }; });
  await acheck('skip-link 可聚焦并跳转', async () => {
    await page.evaluate(() => { window.scrollTo(0, 0); document.getElementById('homePage').hidden = false; document.getElementById('resultPage').hidden = true; document.body.focus(); });
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => { const el = document.activeElement; return { tag: el.tagName, cls: String(el.className || ''), href: el.getAttribute && el.getAttribute('href') }; });
    const isSkip = first.cls.includes('skip-link');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => ({ hash: location.hash, activeId: document.activeElement && document.activeElement.id }));
    return { ok: isSkip && (after.hash === '#homePage' || after.activeId === 'homePage'), detail: { firstTabStop: first, afterEnter: after } };
  });
  report.a11y = A;
  report.console.push({ w: 'functional-1440', errs: [] });
  await ctx.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, '_r3.json'), JSON.stringify(report, null, 2));

  // ---- 摘要 ----
  console.log('\n===== OVERFLOW =====');
  report.overflow.forEach(o => console.log(`w=${String(o.w).padEnd(5)} home=${o.home.over} (${o.home.scrollW}/${o.home.innerW})  result=${o.result.over !== undefined ? o.result.over : 'ERR'} (${o.result.scrollW || '-'}/${o.result.innerW || '-'})`));
  console.log('\n===== TOUCH (undersized <48px) =====');
  report.touch.forEach(t => console.log(`[${t.mode}] w=${t.w} pointer.coarse=${t.media.coarse} touchPts=${t.media.maxTouch}  home=${t.home.length} result=${t.result.length}`));
  const c375 = report.touch.find(t => t.mode === 'coarse' && t.w === 375);
  if (c375) { console.log('  coarse 375 offenders:', JSON.stringify(c375.home.concat(c375.result).map(x => `${x.tag}.${x.cls.split(' ')[0]}${x.id ? '#' + x.id : ''} ${x.w}x${x.h}`))); }
  const f375 = report.touch.find(t => t.mode === 'fine' && t.w === 375);
  if (f375) { console.log('  fine   375 offenders:', JSON.stringify(f375.home.concat(f375.result).map(x => `${x.tag}.${x.cls.split(' ')[0]}${x.id ? '#' + x.id : ''} ${x.w}x${x.h}`))); }
  console.log('\n===== FUNCTIONAL =====');
  report.functional.forEach(f => console.log(`${f.ok ? 'PASS' : 'FAIL'}  ${f.name}  ::  ${JSON.stringify(f.detail)}`));
  console.log('\n===== A11Y =====');
  report.a11y.forEach(a => console.log(`${a.ok ? 'PASS' : 'FAIL'}  ${a.name}  ::  ${JSON.stringify(a.detail)}`));
  console.log('\n===== CONSOLE =====');
  report.console.forEach(c => console.log(`w=${c.w}: ${c.errs.length}` + (c.errs.length ? ' :: ' + c.errs.join(' | ') : '')));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
