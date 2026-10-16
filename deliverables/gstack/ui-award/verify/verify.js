/* 独立验证脚本 (gstack-qa-lead) —— 只读，不改任何仓库文件
 * 覆盖：6 档断点横向溢出 / 触摸目标 / 功能回归 / 控制台异常
 * 用法: node deliverables/gstack/ui-award/verify/verify.js
 * 依赖: playwright-core (D:\xm\node_modules) + msedge 通道
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = process.env.VERIFY_BASE || 'http://127.0.0.1:3001/index.html';
const OUT = path.join(__dirname);
const CITY = '成都';
const BPS = [
  { w: 1920, h: 1000 },
  { w: 1440, h: 900 },
  { w: 1024, h: 768 },
  { w: 768, h: 1024 },
  { w: 414, h: 896 },
  { w: 375, h: 812 },
];

function ensure(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
ensure(OUT);

const OVERFLOW_PROBE = () => {
  const iw = window.innerWidth;
  const out = [];
  const seen = new Set();
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;
    const over = Math.round(Math.max(r.right - iw, -r.left));
    if (over > 1) {
      const key = (el.tagName + '.' + (el.className || '')).slice(0, 80);
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ tag: el.tagName, id: el.id || '', cls: String(el.className || '').slice(0, 60), over, right: Math.round(r.right), w: Math.round(r.width), txt: (el.textContent || '').trim().slice(0, 18) });
    }
  });
  return { scrollW: document.documentElement.scrollWidth, innerW: iw, over: document.documentElement.scrollWidth - iw, offenders: out.slice(0, 12) };
};

// 逐字测行盒，用于判定 Hero 孤字
const TITLE_LINES = () => {
  const el = document.querySelector('.hero-title');
  if (!el) return null;
  const lines = {};
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    for (let i = 0; i < n.length; i++) {
      const r = document.createRange();
      r.setStart(n, i); r.setEnd(n, i + 1);
      const rect = r.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const top = Math.round(rect.top / 5) * 5;
      lines[top] = (lines[top] || { text: '', w: 0 });
      lines[top].text += n.textContent[i];
      lines[top].w = Math.max(lines[top].w, Math.round(rect.right));
      lines[top].left = Math.min(lines[top].left === undefined ? 1e9 : lines[top].left, Math.round(rect.left));
    }
  }
  return Object.keys(lines).sort((a, b) => a - b).map(k => ({ text: lines[k].text, right: lines[k].w, left: lines[k].left, width: lines[k].w - lines[k].left }));
};

const TOUCH_PROBE = () => {
  const sels = 'a[href], button, input:not([type=hidden]), select, textarea, [role="button"], .pill, .style-pill, .qc-btn, .nav-link, .nav-menu-item, .suggestion-item, .history-chip, .icon-btn, .back-btn, .modal-close, .toast-action';
  const out = [];
  document.querySelectorAll(sels).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;            // 不可见
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) return;
    const w = Math.round(r.width), h = Math.round(r.height);
    if (w < 48 || h < 48) {
      out.push({ tag: el.tagName, id: el.id || '', cls: String(el.className || '').slice(0, 40), w, h, txt: (el.textContent || '').trim().slice(0, 14) });
    }
  });
  return out;
};

(async () => {
  const report = { base: BASE, ts: new Date().toISOString(), breakpoints: [], console: [], functional: [], meta: {} };
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--force-device-scale-factor=1'] });
    report.meta.browser = 'msedge';
  } catch (e) {
    browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
    report.meta.browser = 'chromium(fallback): ' + e.message.slice(0, 80);
  }

  // ================= A/B. 断点溢出 + 触摸目标 =================
  for (const bp of BPS) {
    const ctx = await browser.newContext({ viewport: { width: bp.w, height: bp.h }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text().slice(0, 200)); });
    page.on('pageerror', e => errs.push('pageerror: ' + String(e.message).slice(0, 200)));
    page.on('requestfailed', r => errs.push('requestfailed: ' + r.url().slice(0, 90) + ' :: ' + (r.failure() && r.failure().errorText)));

    await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2600);
    const home = await page.evaluate(OVERFLOW_PROBE);
    const titleLines = await page.evaluate(TITLE_LINES);
    await page.screenshot({ path: path.join(OUT, `home-${bp.w}.png`) });

    let result = null, resErr = null;
    try {
      await page.fill('#cityInput', CITY);
      await page.click('#generateBtn');
      await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
      await page.waitForTimeout(1800);
      result = await page.evaluate(OVERFLOW_PROBE);
      const grid = await page.evaluate(() => {
        const g = document.querySelector('.result-grid');
        const p = document.querySelector('.poster-col');
        return { cols: g ? getComputedStyle(g).gridTemplateColumns : null, posterW: p ? Math.round(p.getBoundingClientRect().width) : null };
      });
      result.grid = grid;
      await page.screenshot({ path: path.join(OUT, `result-${bp.w}.png`) });
    } catch (e) { resErr = e.message.slice(0, 160); }

    const touchHome = bp.w <= 768 ? await page.evaluate(() => { const r = document.getElementById('resultPage'); if (r && !r.hidden) r.hidden = true; return null; }) : null;
    // 触摸目标：首页（先确保在首页态）
    let touch = null;
    if (bp.w <= 768) {
      await page.evaluate(() => { const r = document.getElementById('resultPage'); if (r) r.hidden = true; const h = document.getElementById('homePage'); if (h) h.hidden = false; window.scrollTo(0, 0); });
      await page.waitForTimeout(400);
      const homeTouch = await page.evaluate(TOUCH_PROBE);
      // 结果页触摸
      let resTouch = [];
      if (result) {
        await page.evaluate(() => { const h = document.getElementById('homePage'); if (h) h.hidden = true; const r = document.getElementById('resultPage'); if (r) r.hidden = false; window.scrollTo(0, 0); });
        await page.waitForTimeout(400);
        resTouch = await page.evaluate(TOUCH_PROBE);
      }
      touch = { home: homeTouch, result: resTouch };
    }

    report.breakpoints.push({ w: bp.w, home, result, resErr, grid: result ? result.grid : null, titleLines, touch });
    report.console.push({ w: bp.w, errs: [...new Set(errs)] });
    await ctx.close();
  }

  // ================= C. 功能回归（1440 桌面） =================
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const ferrs = [];
  page.on('console', m => { if (m.type() === 'error') ferrs.push('console.error: ' + m.text().slice(0, 200)); });
  page.on('pageerror', e => ferrs.push('pageerror: ' + String(e.message).slice(0, 200)));
  const popups = [];
  page.on('popup', p => popups.push(p.url()));
  const downloads = [];
  page.on('download', d => downloads.push(d.suggestedFilename()));

  const F = [];
  const check = async (name, fn) => {
    try { const d = await fn(); F.push({ name, ok: d === true || (d && d.ok), detail: (d && d.detail) !== undefined ? d.detail : (d === true ? '' : d) }); }
    catch (e) { F.push({ name, ok: false, detail: 'EXC: ' + e.message.slice(0, 140) }); }
  };
  const toastText = () => page.evaluate(() => Array.from(document.querySelectorAll('#toastWrap .toast')).map(t => t.textContent).join(' | '));

  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2600);

  // 1. 搜索联想
  await check('搜索联想下拉出现', async () => {
    await page.fill('#cityInput', '成');
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => { const s = document.getElementById('searchSuggestions'); return { hidden: s.hidden, n: s.querySelectorAll('.suggestion-item').length, first: (s.querySelector('.suggestion-item .s-name') || {}).textContent || '' }; });
    return { ok: !r.hidden && r.n > 0, detail: r };
  });
  await check('联想项可选择(回填)', async () => {
    const before = await page.inputValue('#cityInput');
    await page.evaluate(() => { const it = document.querySelector('#searchSuggestions .suggestion-item'); if (it) it.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); });
    await page.waitForTimeout(300);
    const after = await page.inputValue('#cityInput');
    return { ok: after !== before && after.length > 0, detail: { before, after } };
  });
  // 等结果页出现（mousedown 会触发 submitCity）
  await check('生成攻略→加载层出现', async () => {
    await page.evaluate(() => { const h = document.getElementById('homePage'); if (h) h.hidden = false; const r = document.getElementById('resultPage'); if (r) r.hidden = true; });
    await page.fill('#cityInput', CITY);
    await page.click('#generateBtn');
    let saw = false;
    for (let i = 0; i < 30; i++) { const v = await page.evaluate(() => !document.getElementById('loading').hidden); if (v) { saw = true; break; } await page.waitForTimeout(60); }
    return { ok: saw, detail: { sawLoading: saw } };
  });
  await check('结果页渲染(#resultPage)', async () => {
    await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
    await page.waitForTimeout(1500);
    return true;
  });
  await check('结果页区块完整', async () => {
    const r = await page.evaluate(() => {
      const heads = Array.from(document.querySelectorAll('#guideContent h2')).map(h => h.textContent.replace(/\s+/g, ''));
      return {
        sections: document.querySelectorAll('#guideContent .gc-section').length,
        heads,
        routeDays: document.querySelectorAll('.route-day').length,
        foodCards: document.querySelectorAll('.food-card').length,
        compareCards: document.querySelectorAll('.compare-card').length,
        mapBox: !!document.getElementById('gcMapBox'),
        poster: !!document.getElementById('poster') && document.getElementById('poster').children.length > 0,
      };
    });
    const want = ['每日行程', '必尝美食'];
    const okHeads = want.every(w => r.heads.some(h => h.includes(w)));
    return { ok: r.sections >= 4 && r.routeDays >= 1 && r.foodCards >= 1 && okHeads, detail: r };
  });
  // 2. 工具条
  await check('工具条·收藏', async () => {
    await page.click('#favoriteBtn'); await page.waitForTimeout(500);
    const r = await page.evaluate(() => ({ pressed: document.getElementById('favoriteBtn').getAttribute('aria-pressed'), favCount: document.getElementById('navFavCount').textContent, toast: document.getElementById('toastWrap').children.length }));
    return { ok: r.pressed === 'true' && Number(r.favCount) >= 1, detail: { ...r, toastText: await toastText() } };
  });
  await check('工具条·复制文本', async () => {
    await page.click('#copyTextBtn'); await page.waitForTimeout(500);
    return { ok: true, detail: { toastText: await toastText() } };
  });
  await check('工具条·分享链接', async () => {
    await page.click('#shareLinkBtn'); await page.waitForTimeout(500);
    return { ok: true, detail: { toastText: await toastText() } };
  });
  await check('工具条·下载海报', async () => {
    await page.click('#downloadPosterBtn'); await page.waitForTimeout(3500);
    return { ok: true, detail: { downloads, toastText: await toastText() } };
  });
  await check('工具条·查天气(新窗口)', async () => {
    const n0 = popups.length;
    await page.click('#weatherBtn'); await page.waitForTimeout(800);
    return { ok: popups.length > n0, detail: { popups, toastText: await toastText() } };
  });
  // 3. 收藏弹层开/关
  await check('收藏弹层 开/关', async () => {
    await page.click('#navFavoritesBtn'); await page.waitForTimeout(500);
    const open = await page.evaluate(() => !document.getElementById('favoritesModal').hidden);
    await page.click('#closeFavoritesModal'); await page.waitForTimeout(500);
    const closed = await page.evaluate(() => document.getElementById('favoritesModal').hidden);
    return { ok: open && closed, detail: { open, closed } };
  });
  await check('Toast 提示出现', async () => {
    await page.click('#favoriteBtn'); await page.waitForTimeout(400);
    const n = await page.evaluate(() => document.getElementById('toastWrap').children.length);
    return { ok: n > 0, detail: { toastNodes: n, toastText: await toastText() } };
  });
  // 4. 返回顶部
  await check('返回顶部按钮', async () => {
    await page.evaluate(() => window.scrollTo(0, 1600)); await page.waitForTimeout(500);
    const shown = await page.evaluate(() => !document.getElementById('backToTop').hidden);
    await page.click('#backToTop'); await page.waitForTimeout(1200);
    const y = await page.evaluate(() => window.scrollY);
    return { ok: shown && y < 80, detail: { shown, scrollYAfter: y } };
  });
  // 5. 再次生成
  await check('工具条·再次生成', async () => {
    await page.click('#regenerateBtn'); await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({ home: !document.getElementById('homePage').hidden, city: document.getElementById('cityInput').value }));
    return { ok: r.home && r.city.length > 0, detail: r };
  });
  // 6. 返回首页
  await check('返回首页(backBtn)', async () => {
    await page.fill('#cityInput', CITY); await page.click('#generateBtn');
    await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
    await page.click('#backBtn'); await page.waitForTimeout(600);
    const r = await page.evaluate(() => ({ home: !document.getElementById('homePage').hidden, result: document.getElementById('resultPage').hidden }));
    return { ok: r.home && r.result, detail: r };
  });
  // 7. 榜单
  await check('榜单渲染', async () => {
    const n = await page.evaluate(() => document.getElementById('rankingList').children.length);
    return { ok: n > 0, detail: { cards: n } };
  });
  // 8. 浏览历史
  await check('浏览历史', async () => {
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({ hidden: document.getElementById('historySection').hidden, n: document.getElementById('recentHistoryList').children.length }));
    return { ok: !r.hidden && r.n > 0, detail: r };
  });

  report.functional = F;
  report.console.push({ w: 'functional-1440', errs: [...new Set(ferrs)] });
  await ctx.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, '_verify.json'), JSON.stringify(report, null, 2));

  // ---- 控制台摘要 ----
  console.log('\n================ BREAKPOINT OVERFLOW ================');
  report.breakpoints.forEach(b => {
    console.log(`w=${String(b.w).padEnd(5)} home over=${String(b.home.over).padStart(4)} (sw=${b.home.scrollW}/iw=${b.home.innerW})  result over=${b.result ? String(b.result.over).padStart(4) : 'ERR ' + b.resErr}  cols=${b.grid ? b.grid.cols : '-'}  poster=${b.grid ? b.grid.posterW : '-'}`);
  });
  console.log('\n================ TITLE LINES (orphan check) ================');
  report.breakpoints.forEach(b => { console.log(`w=${b.w}: ` + (b.titleLines || []).map(l => `[${l.text}]=${l.width}px`).join('  ')); });
  console.log('\n================ TOUCH TARGETS (<=768, <48px) ================');
  report.breakpoints.filter(b => b.w <= 768).forEach(b => { console.log(`w=${b.w} home欠尺寸=${b.touch ? b.touch.home.length : '-'} result欠尺寸=${b.touch ? b.touch.result.length : '-'}`); if (b.touch) b.touch.home.concat(b.touch.result).slice(0, 12).forEach(s => console.log(`    <${s.tag} ${s.cls}${s.id ? '#' + s.id : ''}> ${s.w}x${s.h} "${s.txt}"`)); });
  console.log('\n================ FUNCTIONAL REGRESSION ================');
  report.functional.forEach(f => console.log(`${f.ok ? 'PASS' : 'FAIL'}  ${f.name}  ::  ${JSON.stringify(f.detail)}`));
  console.log('\n================ CONSOLE ================');
  report.console.forEach(c => console.log(`w=${c.w}: ${c.errs.length} 条` + (c.errs.length ? '\n   - ' + c.errs.join('\n   - ') : '')));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
