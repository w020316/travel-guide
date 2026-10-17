/**
 * R3 QA Round-3 诊断
 *  - 预算动画：全新加载后【先测预算】（排除锚点测试滚动污染），捕捉动画中间帧宽度
 *  - 锚点 -20px：拆解 handler 公式（navH_click / 预期Y / 实际scrollY / navH_after）
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'screenshots', 'r3-qa');
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com', 'webapi.amap.com'];
const results = [];
function rec(name, pass, detail) {
  results.push({ name, pass: !!pass, detail: detail === undefined ? null : detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  => ' + JSON.stringify(detail) : ''}`);
}
const settleFn = `(() => { let last=-1,n=0; return new Promise(res=>{ const iv=setInterval(()=>{ if(window.scrollY===last){n++; if(n>=3){clearInterval(iv);res(window.scrollY);return;}} else n=0; last=window.scrollY; },80); }); })()`;

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server', '--force-color-profile=srgb'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((b) => u.includes(b))) return route.abort();
    return route.continue();
  });

  await page.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.gc-section', { timeout: 60000 });
  await page.waitForTimeout(1200);

  // ---- B1. 预算动画（页面加载后第一个动作，无滚动污染） ----
  const budget = await page.evaluate(async () => {
    const box = document.querySelector('.budget-box');
    const spans = Array.from(box.querySelectorAll('.budget-num'));
    const init = spans.map((s) => s.textContent);
    box.scrollIntoView({ block: 'center' });
    // settle
    let last = -1, n = 0;
    await new Promise((res) => { const iv = setInterval(() => { if (window.scrollY === last) { n++; if (n >= 3) { clearInterval(iv); res(); return; } } else n = 0; last = window.scrollY; }, 80); });
    let started = false, mid = null, midWidths = null;
    for (let k = 0; k < 60; k++) {
      const cur = spans.map((s) => s.textContent);
      if (cur.some((t, j) => t !== init[j])) { started = true; mid = cur; midWidths = spans.map((s) => +s.getBoundingClientRect().width.toFixed(1)); break; }
      await new Promise((r) => setTimeout(r, 30));
    }
    let final = null, finalWidths = null, stable = 0, prev = null;
    for (let k = 0; k < 120; k++) {
      const cur = spans.map((s) => s.textContent);
      if (prev && cur.join('|') === prev.join('|')) stable++; else stable = 0;
      prev = cur;
      if (stable >= 6) { final = cur; finalWidths = spans.map((s) => +s.getBoundingClientRect().width.toFixed(1)); break; }
      await new Promise((r) => setTimeout(r, 30));
    }
    if (!final) { final = prev; finalWidths = spans.map((s) => +s.getBoundingClientRect().width.toFixed(1)); }
    const hostLine = document.querySelector('.budget-total');
    return { init, started, mid, midWidths, final, finalWidths, minWidths: spans.map((s) => s.style.minWidth || '(none)'), totalText: hostLine && hostLine.textContent };
  });
  rec('budget.animation runs (fresh load, first action)', budget.started, { started: budget.started, mid: budget.mid });
  rec('budget.min-width written', budget.minWidths.every((w) => w !== '(none)'), { minWidths: budget.minWidths });
  rec('budget.final == initial', budget.init.every((t, i) => budget.final[i] === t), { final: budget.final });
  if (budget.started) {
    rec('budget.span width during animation vs final (jitter evidence)', budget.midWidths.every((w, j) => Math.abs(w - budget.finalWidths[j]) < 1), { mid: budget.midWidths, fin: budget.finalWidths });
  }

  // ---- B2. 锚点 -20px 诊断（等预算动画完全结束再测） ----
  await page.waitForTimeout(1200);
  const diag = await page.evaluate(async () => {
    const nav = document.querySelector('.guide-nav');
    const out = [];
    for (const i of [2, 5, 6, 9]) {
      const a = nav.querySelectorAll('.guide-nav-item')[i];
      const target = document.getElementById(a.getAttribute('href').slice(1));
      const navH_before = nav.getBoundingClientRect().height + 16;
      const expectedY = target.getBoundingClientRect().top + window.scrollY - navH_before;
      a.click();
      let last = -1, n = 0;
      await new Promise((res) => { const iv = setInterval(() => { if (window.scrollY === last) { n++; if (n >= 4) { clearInterval(iv); res(); return; } } else n = 0; last = window.scrollY; }, 80); });
      await new Promise((r) => setTimeout(r, 300));
      const navH_after = nav.getBoundingClientRect().height + 16;
      out.push({
        i: i + 1,
        navH_before: +navH_before.toFixed(1), navH_after: +navH_after.toFixed(1),
        expectedY: +expectedY.toFixed(1), actualY: +window.scrollY.toFixed(1),
        targetTopAfter: +target.getBoundingClientRect().top.toFixed(1),
        deltaY: +(window.scrollY - expectedY).toFixed(1)
      });
    }
    const navCss = getComputedStyle(nav);
    return { out, navOverflow: navCss.overflowX, navPosition: navCss.position };
  });
  rec('anchor.landing delta = actualY - expectedY within ±4', diag.out.every((o) => Math.abs(o.deltaY) <= 4), diag);
  rec('anchor.navH stable before/after click', diag.out.every((o) => Math.abs(o.navH_before - o.navH_after) <= 1), diag);
  console.log('nav css:', JSON.stringify(diag.navOverflow), diag.navPosition);

  await ctx.close();
  await browser.close();
  const pass = results.filter((r) => r.pass).length;
  fs.writeFileSync(path.join(OUT, 'r3-qa-round3.json'), JSON.stringify({ total: results.length, pass, fail: results.length - pass, results, errors }, null, 2));
  console.log(`\n==== ROUND3 SUMMARY: ${pass}/${results.length} PASS ====  pageErrors:${errors.filter((e) => !e.includes('Failed to load resource')).length}`);
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
