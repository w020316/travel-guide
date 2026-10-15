// 修复验证脚本：实测 P0-1（弹窗居中）、P0-2（SW 注册 + 无 CSP 报错）、P0-3（375px 表单不溢出）
// 用 --no-proxy-server 绕过沙箱代理，否则 Chromium 无法访问 localhost
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const path = require('path');

const OUT = 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/after';
const BASE = 'http://127.0.0.1:3001/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const results = {};

  // ---------- 1) 移动端 375px：搜索表单溢出（P0-3） ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1200);

    const m = await page.evaluate(() => {
      const meta = document.querySelector('.search-meta');
      const pills = document.querySelector('.day-pills');
      const budget = document.querySelector('#budgetRange');
      const cs = getComputedStyle(document.body);
      return {
        metaClientWidth: meta ? meta.clientWidth : null,
        metaScrollWidth: meta ? meta.scrollWidth : null,
        pillsRight: pills ? Math.round(pills.getBoundingClientRect().right) : null,
        budgetRight: budget ? Math.round(budget.getBoundingClientRect().right) : null,
        viewport: window.innerWidth,
        bodyScrollWidth: document.body.scrollWidth,
        bodyOverflowX: cs.overflowX,
        pillCount: document.querySelectorAll('.day-pills .pill').length,
        visiblePills: Array.from(document.querySelectorAll('.day-pills .pill'))
          .filter(p => { const r = p.getBoundingClientRect(); return r.right <= window.innerWidth + 1; }).length
      };
    });
    results.p0_3_mobile375 = m;
    results.p0_3_pass = m.metaScrollWidth <= m.metaClientWidth + 1
      && m.budgetRight <= m.viewport + 1
      && m.visiblePills === m.pillCount;

    await page.screenshot({ path: path.join(OUT, 'after-375-search-form.png') });
    // 单独截取搜索表单 meta 区，便于人工核对字段是否被裁
    const card = await page.$('.search-card');
    if (card) await card.screenshot({ path: path.join(OUT, 'after-375-search-card.png') });
    results.p0_2_consoleErrors_mobile = consoleErrors;
    await ctx.close();
  }

  // ---------- 2) 桌面 1366：弹窗居中（P0-1）+ SW 注册（P0-2） ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    // P0-2：SW 注册
    const sw = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return { supported: false };
      const reg = await navigator.serviceWorker.getRegistration();
      return { supported: true, registered: !!reg, scope: reg ? reg.scope : null };
    });
    results.p0_2_sw = sw;
    results.p0_2_pass = sw.supported && sw.registered && consoleErrors.length === 0;

    // P0-1：打开收藏弹窗，测其几何位置
    await page.click('#navFavoritesBtn');
    await page.waitForTimeout(600);

    const geo = await page.evaluate(() => {
      const modal = document.querySelector('.modal');
      const overlay = document.querySelector('#favoritesModal');
      const mr = modal.getBoundingClientRect();
      return {
        modal: { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) },
        overlayDisplay: getComputedStyle(overlay).display,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        // 左右留白是否大致相等（居中判据）
        gapLeft: Math.round(mr.x),
        gapRight: Math.round(window.innerWidth - mr.right),
        gapTop: Math.round(mr.y),
        gapBottom: Math.round(window.innerHeight - mr.bottom)
      };
    });
    results.p0_1_desktop = geo;
    // 居中判据：左右留白差 ≤2px，且上下均不为 0
    results.p0_1_pass = Math.abs(geo.gapLeft - geo.gapRight) <= 2
      && geo.gapTop > 0 && geo.gapBottom > 0;

    await page.screenshot({ path: path.join(OUT, 'after-1366-modal-centered.png') });
    results.p0_2_consoleErrors_desktop = consoleErrors;
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
