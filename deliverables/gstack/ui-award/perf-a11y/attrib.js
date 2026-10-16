/* attrib.js — 归因首页滚动期「每帧 1 次 style recalc」的来源（只读） */
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

  const rc = async () => { const { metrics } = await cdp.send('Performance.getMetrics'); const m={}; metrics.forEach(x=>m[x.name]=x.value);
    return { Recalc: m.RecalcStyleCount, Layout: m.LayoutCount, RecalcDur: +(m.RecalcStyleDuration||0).toFixed(3), LayoutDur:+(m.LayoutDuration||0).toFixed(3) }; };
  const run = async () => { await p.evaluate(()=>window.scrollTo(0,0)); await sleep(300); const a=await rc(); await p.evaluate(SCROLL_DRIVER,3000); const z=await rc();
    return { recalc: z.Recalc-a.Recalc, layout: z.Layout-a.Layout, recalcDur:+((z.RecalcDur-a.RecalcDur).toFixed(3)), layoutDur:+((z.LayoutDur-a.LayoutDur).toFixed(3)) }; };

  const out = {};
  out.baseline = await run();
  await p.addStyleTag({ content: '.reveal{opacity:1 !important;transform:none !important;transition:none !important}' });
  await sleep(300); out.no_reveal_anim = await run();
  await p.addStyleTag({ content: '#backToTop{display:none !important}' });
  await sleep(300); out.no_reveal_no_btop = await run();

  console.log(JSON.stringify(out, null, 2));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
