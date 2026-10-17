/**
 * R3 QA Round-2 聚焦复测
 *  - budget: settle 后轮询动画（排除 html{scroll-behavior:smooth} 干扰），
 *            记录 min-width 缺失下 span 级宽度变化（验证 B2 布局抖动影响）
 *  - anchor: 结构性验证（移除呼吸规则前后各区块 offsetTop 不变）+ settle 后点击落点
 *  - breath: 修正基线（.gc-weather 既有 --space-28 规则，style.css:1116）
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
const settle = `(async () => {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    if (window.scrollY === last) break;
    last = window.scrollY;
    await new Promise(r => setTimeout(r, 100));
  }
  return window.scrollY;
})()`;

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server', '--force-color-profile=srgb'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((b) => u.includes(b))) return route.abort();
    return route.continue();
  });

  await page.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.gc-section', { timeout: 60000 });
  await page.waitForTimeout(1500);

  // ---- R1. 呼吸位 margin（修正基线） ----
  const breath = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.gc-section')).map((s, i) => ({
      i: i + 1, is3n: (i + 1) % 3 === 0, isWeather: s.classList.contains('gc-weather'),
      mb: getComputedStyle(s).marginBottom
    }));
  });
  const bad3n = breath.filter((r) => r.is3n && Math.abs(parseFloat(r.mb) - 96) >= 2);
  const badOther = breath.filter((r) => !r.is3n && !(r.isWeather && Math.abs(parseFloat(r.mb) - 28) < 2) && Math.abs(parseFloat(r.mb) - 44) >= 2);
  rec('breath.margins (3n=96, others=44 except gc-weather=28 pre-existing)', bad3n.length === 0 && badOther.length === 0, { bad3n, badOther });

  // ---- R2. 锚点结构性验证：呼吸 margin 不改变区块顶点 ----
  const topsA = await page.evaluate(() => Array.from(document.querySelectorAll('.gc-section')).map((s) => s.getBoundingClientRect().top + window.scrollY));
  await page.addStyleTag({ content: '.gc-section:nth-of-type(3n):not(:last-child){margin-bottom:44px!important}.gc-section:nth-of-type(3n):not(:last-child)::after{display:none!important}' });
  await page.waitForTimeout(300);
  const topsB = await page.evaluate(() => Array.from(document.querySelectorAll('.gc-section')).map((s) => s.getBoundingClientRect().top + window.scrollY));
  const maxTopDelta = Math.max(...topsA.map((t, i) => Math.abs(t - topsB[i])));
  rec('anchor.breath margin does NOT move section tops (structural)', maxTopDelta < 0.5, { maxTopDelta });
  await page.evaluate(() => window.location.reload());
  await page.waitForSelector('.gc-section', { timeout: 60000 });
  await page.waitForTimeout(1500);

  // ---- R3. 锚点点击落点（settle 轮询；末区块受文档底 clamp 豁免） ----
  const anchor = await page.evaluate(async () => {
    const nav = document.querySelector('.guide-nav');
    const items = Array.from(nav.querySelectorAll('.guide-nav-item'));
    const out = [];
    for (const i of [2, 5, 6, 9]) {
      const a = items[i];
      if (!a) continue;
      a.click();
      // settle：等 scrollY 稳定
      let last = -1;
      for (let k = 0; k < 50; k++) {
        if (window.scrollY === last) break;
        last = window.scrollY;
        await new Promise((r) => setTimeout(r, 100));
      }
      await new Promise((r) => setTimeout(r, 200));
      const t = document.getElementById(a.getAttribute('href').slice(1));
      const navH = nav.getBoundingClientRect().height + 16;
      out.push({ i: i + 1, label: a.textContent.trim(), err: +(t.getBoundingClientRect().top - navH).toFixed(1) });
    }
    return out;
  });
  const maxErr = Math.max(...anchor.map((o) => Math.abs(o.err)));
  rec('anchor.click lands within ±4px after settle (excl. last-section clamp)', maxErr <= 4, { maxErr, samples: anchor });

  // ---- R4. 预算动画（settle + 轮询动画帧） ----
  const budget = await page.evaluate(async () => {
    const box = document.querySelector('.budget-box');
    const spans = Array.from(box.querySelectorAll('.budget-num'));
    const init = spans.map((s) => s.textContent);
    box.scrollIntoView({ block: 'center' });
    // settle 滚动
    let last = -1;
    for (let k = 0; k < 50; k++) {
      if (window.scrollY === last) break;
      last = window.scrollY;
      await new Promise((r) => setTimeout(r, 100));
    }
    // 轮询等动画首帧（文本变化）
    let started = false;
    let mid = null, midWidths = null;
    for (let k = 0; k < 50; k++) {
      const cur = spans.map((s) => s.textContent);
      if (cur.some((t, j) => t !== init[j])) { started = true; mid = cur; midWidths = spans.map((s) => s.getBoundingClientRect().width); break; }
      await new Promise((r) => setTimeout(r, 40));
    }
    // 等动画结束（文本稳定 5 帧）
    let final = null, finalWidths = null;
    let stable = 0, prev = null;
    for (let k = 0; k < 100; k++) {
      const cur = spans.map((s) => s.textContent);
      if (prev && cur.join('|') === prev.join('|')) stable++; else stable = 0;
      prev = cur;
      if (stable >= 5) { final = cur; finalWidths = spans.map((s) => s.getBoundingClientRect().width); break; }
      await new Promise((r) => setTimeout(r, 40));
    }
    if (!final) { final = prev; finalWidths = spans.map((s) => s.getBoundingClientRect().width); }
    return {
      init, started, mid, final,
      minWidths: spans.map((s) => s.style.minWidth || '(none)'),
      midWidths, finalWidths,
      widthDelta: midWidths ? midWidths.map((w, j) => +(w - finalWidths[j]).toFixed(1)) : null
    };
  });
  rec('budget.animation runs on scroll into view', budget.started, { started: budget.started, mid: budget.mid });
  rec('budget.final text == initial token', budget.init.every((t, i) => budget.final[i] === t), { init: budget.init, final: budget.final });
  rec('budget.min-width written (expects PASS if bug B2 fixed)', budget.minWidths.every((w) => w !== '(none)'), { minWidths: budget.minWidths });
  rec('budget.span widths stable during animation (no jitter)', budget.widthDelta ? budget.widthDelta.every((d) => Math.abs(d) < 1) : false, { midWidths: budget.midWidths, finalWidths: budget.finalWidths, delta: budget.widthDelta });

  await ctx.close();
  await browser.close();
  const pass = results.filter((r) => r.pass).length;
  fs.writeFileSync(path.join(OUT, 'r3-qa-round2.json'), JSON.stringify({ total: results.length, pass, fail: results.length - pass, results }, null, 2));
  console.log(`\n==== ROUND2 SUMMARY: ${pass}/${results.length} PASS ====`);
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
