/* r4-perf2.js — 归因入场帧缺口：发生在「页面加载」还是「墨迹绘出动画(1.15–2.75s)」？
   对照：动画开 vs 动画关。并修正纯滚动测量（先清空缓冲）。 */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = path.join(__dirname, 'r4');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SAMPLER = () => {
  window.__ent = { frames: [], long: [] };
  try { const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__ent.long.push({ t: +e.startTime.toFixed(0), d: +e.duration.toFixed(0) }); }); po.observe({ entryTypes: ['longtask'] }); } catch (e) {}
  const tick = (t) => { window.__ent.frames.push(t); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
// 在最早时机禁用 ink 动画（动画延迟 1.15s，DOMContentLoaded 注入足够早）
const KILL_ANIM = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style');
    s.textContent = '.ink-route,.ink-nodes circle,.ink-summit{animation:none !important}';
    (document.head || document.documentElement).appendChild(s);
  });
};
const SCROLL_DRIVER = (ms) => new Promise((resolve) => {
  const start = performance.now(); let dir = 1;
  const step = Math.max(6, Math.round(window.innerHeight * 0.06));
  const drive = (t) => { window.scrollBy(0, dir * step);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= max - 2) dir = -1; if (window.scrollY <= 2) dir = 1;
    if (t - start >= ms) { resolve(true); return; } requestAnimationFrame(drive); };
  requestAnimationFrame(drive);
});
function gaps(frames) { // 返回 >33ms 的帧缺口及其绝对时间(ms)
  const out = []; for (let i = 1; i < frames.length; i++) { const d = frames[i] - frames[i - 1]; if (d > 33.4) out.push({ at: +frames[i - 1].toFixed(0), gap: +d.toFixed(0) }); } return out;
}
function sum(frames, long) {
  const d = []; for (let i = 1; i < frames.length; i++) d.push(frames[i] - frames[i - 1]);
  const total = frames[frames.length - 1] - frames[0]; const s = [...d].sort((a, b) => a - b);
  return { n: frames.length, avgFps: +((frames.length - 1) / (total / 1000)).toFixed(1), p95: +s[Math.floor(s.length * .95)].toFixed(1),
    max: +Math.max(...d).toFixed(1), dropped: d.filter(x => x > 33.4).length, long: long.length };
}

(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const R = {};

  const runEntrance = async (kill) => {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    await c.addInitScript(SAMPLER);
    if (kill) await c.addInitScript(KILL_ANIM);
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await sleep(4000);
    const ent = await p.evaluate(() => window.__ent);
    const animOn = await p.evaluate(() => getComputedStyle(document.querySelector('.ink-route')).animationName);
    const res = { ...sum(ent.frames, ent.long), inkAnimationName: animOn,
      gapsOver33ms: gaps(ent.frames).map(g => ({ atMs: g.at, gapMs: g.gap })),
      longTasks: ent.long.map(l => ({ atMs: l.t, durMs: l.d })),
      inAnimationWindow_1150_2900: gaps(ent.frames).filter(g => g.at >= 1100 && g.at <= 2950).length };
    // 纯滚动：清空缓冲后测
    await p.evaluate(() => { window.__ent.frames = []; window.__ent.long = []; window.scrollTo(0, 0); });
    await sleep(300);
    await p.evaluate(SCROLL_DRIVER, 4000);
    const sc = await p.evaluate(() => window.__ent);
    res.pureScroll = { ...sum(sc.frames, sc.long), gapsOver33ms: gaps(sc.frames) };
    await c.close();
    return res;
  };

  R.entrance_anim_ON = await runEntrance(false);
  R.entrance_anim_OFF = await runEntrance(true);

  fs.writeFileSync(path.join(OUT, 'r4-attrib.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
