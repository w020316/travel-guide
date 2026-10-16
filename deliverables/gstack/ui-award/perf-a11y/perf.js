/* perf.js — 60fps 滚动实测 + 长任务 + 覆盖层开销对照 + 合成/布局指标
   只读审计：不修改仓库任何源文件。产出 perf-report.json
   运行：node deliverables/gstack/ui-award/perf-a11y/perf.js
*/
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// 页面内：安装 longtask 观察器（一次）
const INSTALL = () => {
  window.__perf = window.__perf || { longTasks: [], po: null };
  if (!window.__perf.po) {
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          window.__perf.longTasks.push({ start: +e.startTime.toFixed(1), dur: +e.duration.toFixed(1) });
      });
      po.observe({ entryTypes: ['longtask'] });
      window.__perf.po = po;
    } catch (e) {}
  }
};

// rAF 驱动来回滚动，并记录每帧时间戳（帧间隔即主线程帧产出节奏）
const SCROLL_DRIVER = (ms) => new Promise((resolve) => {
  const perf = window.__perf;
  perf.frames = []; perf.longTasks = [];
  const step = Math.max(6, Math.round(window.innerHeight * 0.06));
  const start = performance.now();
  let dir = 1;
  const drive = (t) => {
    perf.frames.push(t);
    window.scrollBy(0, dir * step);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= max - 2) dir = -1;
    if (window.scrollY <= 2) dir = 1;
    if (t - start >= ms) { resolve(true); return; }
    requestAnimationFrame(drive);
  };
  requestAnimationFrame(drive);
});

function analyze(frames, longTasks) {
  if (!frames || frames.length < 5) return { error: 'too few frames', frameCount: frames ? frames.length : 0 };
  const deltas = [];
  for (let i = 1; i < frames.length; i++) deltas.push(frames[i] - frames[i - 1]);
  const total = frames[frames.length - 1] - frames[0];
  const avgFps = (frames.length - 1) / (total / 1000);
  const sorted = [...deltas].sort((a, b) => a - b);
  const p = (q) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
  const dropped = deltas.filter(d => d > 33.4).length;
  const veryDropped = deltas.filter(d => d > 50).length;
  return {
    frameCount: frames.length,
    durationMs: +total.toFixed(1),
    avgFps: +avgFps.toFixed(1),
    p50: +p(0.5).toFixed(1), p95: +p(0.95).toFixed(1), p99: +p(0.99).toFixed(1),
    maxFrameMs: +Math.max(...deltas).toFixed(1),
    droppedFrames: dropped, droppedPct: +((dropped / deltas.length) * 100).toFixed(1),
    veryDroppedFrames: veryDropped,
    longTasks: longTasks.length,
    longTaskTotalMs: +longTasks.reduce((a, b) => a + b.dur, 0).toFixed(1),
    longTaskMaxMs: longTasks.length ? +Math.max(...longTasks.map(t => t.dur)).toFixed(1) : 0,
  };
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const report = { url: BASE, viewport: { width: 1440, height: 900 }, runs: {} };

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');

  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await sleep(2600);
  await page.evaluate(INSTALL);

  const metricsOf = async () => {
    const { metrics } = await cdp.send('Performance.getMetrics');
    const m = {}; metrics.forEach(x => m[x.name] = x.value);
    return { LayoutDuration: +(m.LayoutDuration||0).toFixed(3), RecalcStyleDuration: +(m.RecalcStyleDuration||0).toFixed(3),
             ScriptDuration: +(m.ScriptDuration||0).toFixed(3), TaskDuration: +(m.TaskDuration||0).toFixed(3),
             LayoutCount: m.LayoutCount, RecalcStyleCount: m.RecalcStyleCount };
  };
  const diff = (a, b) => { const d = {}; for (const k in b) d[k] = typeof b[k]==='number' ? +(b[k]-(a[k]||0)).toFixed(3) : undefined; return d; };

  const runScroll = async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(300);
    const m0 = await metricsOf();
    await page.evaluate(SCROLL_DRIVER, 4000);
    const frames = await page.evaluate(() => window.__perf.frames);
    const long = await page.evaluate(() => window.__perf.longTasks);
    const m1 = await metricsOf();
    return { ...analyze(frames, long), cdp: diff(m0, m1) };
  };

  // ---- 首页：覆盖层开启（默认） ----
  report.runs.home_overlay_on = await runScroll();

  // ---- 首页：覆盖层关闭（隔离 body::after 合成开销） ----
  await page.addStyleTag({ content: 'body::after{display:none !important}' });
  await sleep(400);
  report.runs.home_overlay_off = await runScroll();

  report.overlayProbe = await page.evaluate(() => {
    const cs = getComputedStyle(document.body, '::after');
    return { position: cs.position, mixBlendMode: cs.mixBlendMode, zIndex: cs.zIndex, willChange: cs.willChange,
             opacity: cs.opacity, pointerEvents: cs.pointerEvents, backgroundSize: cs.backgroundSize, hasFilter: cs.filter };
  });

  // ---- 结果页滚动 ----
  const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const rpage = await rctx.newPage();
  const rcdp = await rctx.newCDPSession(rpage);
  await rcdp.send('Performance.enable');
  await rpage.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await sleep(2000);
  await rpage.fill('#cityInput', '成都');
  await rpage.click('#generateBtn');
  try { await rpage.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch (e) {}
  await sleep(2500);
  await rpage.evaluate(INSTALL);
  const rm = async () => { const { metrics } = await rcdp.send('Performance.getMetrics'); const m={}; metrics.forEach(x=>m[x.name]=x.value);
    return { LayoutDuration:+(m.LayoutDuration||0).toFixed(3), RecalcStyleDuration:+(m.RecalcStyleDuration||0).toFixed(3),
             ScriptDuration:+(m.ScriptDuration||0).toFixed(3), TaskDuration:+(m.TaskDuration||0).toFixed(3),
             LayoutCount:m.LayoutCount, RecalcStyleCount:m.RecalcStyleCount }; };
  await rpage.evaluate(() => window.scrollTo(0,0)); await sleep(300);
  const rm0 = await rm();
  await rpage.evaluate(SCROLL_DRIVER, 4000);
  const rFrames = await rpage.evaluate(() => window.__perf.frames);
  const rLong = await rpage.evaluate(() => window.__perf.longTasks);
  const rm1 = await rm();
  report.runs.result_overlay_on = { ...analyze(rFrames, rLong), cdp: diff(rm0, rm1) };
  report.resultPageHeight = await rpage.evaluate(() => document.documentElement.scrollHeight);
  await rctx.close();

  await ctx.close();
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'perf-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
