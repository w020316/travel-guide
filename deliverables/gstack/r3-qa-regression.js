/**
 * R3 QA 回归复测（工程师修复 Bug-1/2/3 后）— 聚焦改动影响面
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'screenshots', 'r3-qa');
const BLOCKED = ['fonts.googleapis.com','fonts.gstatic.com','html2canvas.hertzen.com','webapi.amap.com'];
const results = [];
function rec(n, p, d) { results.push({ name: n, pass: !!p, detail: d === undefined ? null : d }); console.log((p?'PASS':'FAIL')+'  '+n+(d!==undefined?'  => '+JSON.stringify(d):'')); }

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server','--force-color-profile=srgb'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0,200)));
  await page.route('**/*', r => BLOCKED.some(b => r.request().url().includes(b)) ? r.abort() : r.continue());

  await page.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.gc-section', { timeout: 60000 });
  await page.waitForTimeout(1200);

  // R1. 字重修复：result-title computed = 680
  const w = await page.evaluate(() => getComputedStyle(document.querySelector('.result-title')).fontWeight);
  rec('R1.result-title computed=680', w === '680', { computed: w });

  // R2. 预算：进视口前无 min-width（新预期）→ 进视口瞬间写入 → 动画中宽度稳定 → 终值还原
  const pre = await page.evaluate(() => Array.from(document.querySelectorAll('.budget-box .budget-num')).map(s => s.style.minWidth || '(none)'));
  rec('R2a.before viewport: no min-width (new intended behavior)', pre.every(x => x === '(none)'), { minWidths: pre });

  const r = await page.evaluate(() => new Promise((resolve) => {
    const box = document.querySelector('.budget-box');
    const spans = Array.from(box.querySelectorAll('.budget-num'));
    const init = spans.map(s => s.textContent);
    const y = box.getBoundingClientRect().top + window.scrollY - 400;
    window.scrollTo({ top: y, behavior: 'instant' });
    const samples = [];
    let t0 = null, mwAtStart = null;
    const iv = setInterval(() => {
      const cur = spans.map(s => s.textContent);
      const mws = spans.map(s => s.style.minWidth || '(none)');
      if (!t0 && cur.some((t,j) => t !== init[j])) { t0 = performance.now(); mwAtStart = mws; }
      if (t0) samples.push({ t: Math.round(performance.now()-t0), texts: cur.slice(0,3), widths: spans.map(s => +s.getBoundingClientRect().width.toFixed(1)) });
      if (t0 && performance.now() - t0 > 1100) {
        clearInterval(iv);
        const finW = spans.map(s => +s.getBoundingClientRect().width.toFixed(1));
        resolve({
          started: !!t0, minWidthsAtAnimStart: mwAtStart,
          midWidths: samples.length ? samples[Math.floor(samples.length/2)].widths : null,
          finalWidths: finW, finalTexts: spans.map(s => s.textContent),
          init, minWidthsEnd: mws,
          boxW0: box.getBoundingClientRect().width
        });
      }
    }, 33);
  }));
  rec('R2b.animation runs', r.started, {});
  rec('R2c.min-width written at animation start (fix for Bug-2)', r.started && r.minWidthsAtAnimStart.every(x => x !== '(none)'), { minWidths: r.minWidthsAtAnimStart });
  rec('R2d.span widths stable mid vs final (no jitter)', r.midWidths ? r.midWidths.every((v,i) => Math.abs(v - r.finalWidths[i]) < 1) : false, { mid: r.midWidths, fin: r.finalWidths });
  rec('R2e.final text == initial token', r.init.every((t,i) => r.finalTexts[i] === t), { final: r.finalTexts });
  rec('R2f.min-width persists after animation', r.minWidthsEnd.every(x => x !== '(none)'), {});

  // 触发一次复核：滚走再滚回，无二次动画
  const once = await page.evaluate(async () => {
    const box = document.querySelector('.budget-box');
    const spans = Array.from(box.querySelectorAll('.budget-num'));
    const before = spans.map(s => s.textContent);
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r2 => setTimeout(r2, 300));
    box.scrollIntoView({ block: 'center' });
    await new Promise(r2 => setTimeout(r2, 900));
    return spans.map(s => s.textContent).join('|') === before.join('|');
  });
  rec('R2g.trigger once (scroll away/back no re-animation)', once, {});

  // R3. reduced-motion 下预算静态 + 无 span
  const ctxR = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const pageR = await ctxR.newPage();
  await pageR.route('**/*', r2 => BLOCKED.some(b => r2.request().url().includes(b)) ? r2.abort() : r2.continue());
  await pageR.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await pageR.waitForSelector('.gc-section', { timeout: 60000 });
  await pageR.waitForTimeout(800);
  const rm = await pageR.evaluate(() => ({ spans: document.querySelectorAll('.budget-box .budget-num').length, op: getComputedStyle(document.querySelector('.gc-section')).opacity }));
  rec('R3.reduced-motion: no spans, sections visible', rm.spans === 0 && rm.op === '1', rm);
  await ctxR.close();

  await ctx.close();
  await browser.close();
  const pass = results.filter(x => x.pass).length;
  fs.writeFileSync(path.join(OUT, 'r3-qa-regression.json'), JSON.stringify({ total: results.length, pass, fail: results.length-pass, results, pageErrors: errs }, null, 2));
  console.log('\n==== REGRESSION: ' + pass + '/' + results.length + ' PASS ====  pageErrors:' + errs.length);
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
