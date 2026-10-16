/* r4-perf4.js — 对齐「绘出动画真实窗口」的帧节奏测量。
   背景：页面加载较慢（DOMContentLoaded ~2.4s / load ~6.8s），CSS 动画在 ~2.4s 挂载、
   实际绘出段 ≈ 3.6–5.2s——r4-perf3 的固定 0.9–3.1s 窗口并未覆盖真实绘出段。
   本脚本改用 getAnimations().startTime 实测挂载点推导窗口，统计 ON/OFF 各 2 组；
   并输出资源加载 Top5 供加载抖动排查。产出：r4/r4-window2.json */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = path.join(__dirname, 'r4');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SAMPLER = () => {
  window.__f4 = { frames: [], long: [] };
  try { const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__f4.long.push({ t: +e.startTime.toFixed(0), d: +e.duration.toFixed(0) }); }); po.observe({ entryTypes: ['longtask'] }); } catch (e) {}
  const t = (x) => { window.__f4.frames.push(x); requestAnimationFrame(t); };
  requestAnimationFrame(t);
};
const KILL_ANIM = () => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style');
  s.textContent = '.ink-route,.ink-nodes circle,.ink-summit{animation:none !important}'; (document.head || document.documentElement).appendChild(s); }); };

function analyze(frames, long, win) {
  const d = []; for (let i = 1; i < frames.length; i++) d.push(frames[i] - frames[i - 1]);
  const total = frames[frames.length - 1] - frames[0]; const s = [...d].sort((a, b) => a - b);
  const gaps = []; for (let i = 1; i < frames.length; i++) { const dd = frames[i] - frames[i - 1]; if (dd > 33.4) gaps.push({ atMs: +frames[i - 1].toFixed(0), gapMs: +dd.toFixed(0) }); }
  return { n: frames.length, first: +frames[0].toFixed(0), last: +frames[frames.length - 1].toFixed(0),
    avgFps: +((frames.length - 1) / (total / 1000)).toFixed(1), p95: +s[Math.floor(s.length * .95)].toFixed(1),
    max: +Math.max(...d).toFixed(1), dropped: d.filter(x => x > 33.4).length,
    gaps, inWindow: win ? gaps.filter(g => g.atMs >= win[0] && g.atMs <= win[1]).length : null,
    longTasks: long };
}

(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const R = {};

  const run = async (kill) => {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    await c.addInitScript(SAMPLER);
    if (kill) await c.addInitScript(KILL_ANIM);
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    const meta = await p.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const route = document.querySelector('.ink-route');
      const cs = getComputedStyle(route);
      const anims = route.getAnimations ? route.getAnimations() : [];
      const inkStart = anims.length ? +(anims[0].startTime || 0).toFixed(0) : null;
      const aside = document.querySelector('.hero-aside');
      const aAnims = aside && aside.getAnimations ? aside.getAnimations() : [];
      const asideStart = aAnims.length ? +(aAnims[0].startTime || 0).toFixed(0) : null;
      let delay = parseFloat(cs.animationDelay); if (!(delay > 0)) delay = 1.15;
      let dur = parseFloat(cs.animationDuration); if (!(dur > 0)) dur = 1.6;
      const res = performance.getEntriesByType('resource').map(e => ({ n: e.name.split('/').slice(-1)[0].slice(0, 36), d: Math.round(e.duration), s: Math.round(e.startTime) })).sort((a, bb) => bb.d - a.d).slice(0, 5);
      return { animName: cs.animationName, inkStart, asideStart, delay, dur, dcl: +nav.domContentLoadedEventEnd.toFixed(0), loadEnd: +nav.loadEventEnd.toFixed(0), resources: res };
    });
    const base = meta.inkStart != null ? meta.inkStart : meta.asideStart;
    const win = base != null ? [Math.round(base + meta.delay * 1000), Math.round(base + meta.delay * 1000 + meta.dur * 1000)] : null;
    // 等到真实窗口结束后再取 buffer（覆盖完整绘出段）；若已过则至少再等 600ms
    const nowMs = await p.evaluate(() => performance.now());
    const waitMs = win ? Math.max(600, win[1] + 800 - nowMs) : 600;
    await sleep(Math.min(Math.max(waitMs, 200), 12000));
    const data = await p.evaluate(() => window.__f4);
    const out = { meta, window_inkDraw: win, ...analyze(data.frames, data.long, win) };    await c.close();
    return out;
  };

  for (let i = 1; i <= 4; i++) R['ON_' + i] = await run(false);
  for (let i = 1; i <= 4; i++) R['OFF_' + i] = await run(true);

  fs.writeFileSync(path.join(OUT, 'r4-window2.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
