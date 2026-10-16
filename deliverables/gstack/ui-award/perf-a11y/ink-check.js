/* ink-check.js — R3: 隔离 .ink-scroll SVG 装置的滚动开销 + 确认其静态无动画 */
const { chromium } = require('playwright-core');
const BASE = 'http://127.0.0.1:3001/index.html';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const SCROLL_DRIVER = (ms) => new Promise((resolve) => {
  const start = performance.now(); let dir = 1;
  const step = Math.max(6, Math.round(window.innerHeight * 0.06));
  const drive = (t) => { window.scrollBy(0, dir * step);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= max - 2) dir = -1; if (window.scrollY <= 2) dir = 1;
    if (t - start >= ms) { resolve(true); return; } requestAnimationFrame(drive); };
  requestAnimationFrame(drive);
});
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p); await cdp.send('Performance.enable');
  await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await sleep(2600);

  // SVG 动画/合成属性快照
  const svgProps = await p.evaluate(() => {
    const svg = document.querySelector('.ink-scroll-svg');
    if (!svg) return { missing: true };
    const g = (sel) => { const e = document.querySelector(sel); if (!e) return null; const s = getComputedStyle(e);
      return { anim: s.animationName, dur: s.animationDuration, willChange: s.willChange, filter: s.filter, transform: s.transform }; };
    return { present: true, svg: g('.ink-scroll-svg'), route: g('.ink-route'), sun: g('.ink-sun'),
             aside: g('.hero-aside'), nodeCount: svg.querySelectorAll('path,circle,ellipse,rect').length };
  });

  const rc = async () => { const { metrics } = await cdp.send('Performance.getMetrics'); const m={}; metrics.forEach(x=>m[x.name]=x.value);
    return { Recalc: m.RecalcStyleCount, Layout: m.LayoutCount, LayoutDur: +(m.LayoutDuration||0).toFixed(3), PaintCount: m.PaintCount }; };
  const run = async () => { await p.evaluate(()=>window.scrollTo(0,0)); await sleep(300); const a=await rc(); await p.evaluate(SCROLL_DRIVER,3500); const z=await rc();
    return { recalc: z.Recalc-a.Recalc, layout: z.Layout-a.Layout, layoutDur: +((z.LayoutDur-a.LayoutDur).toFixed(3)) }; };

  const out = { svgProps };
  out.with_svg = await run();
  await p.addStyleTag({ content: '.hero-aside{display:none !important}' });
  await sleep(400);
  out.without_svg = await run();
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
