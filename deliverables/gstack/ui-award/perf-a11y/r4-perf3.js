/* r4-perf3.js — 精确隔离「墨迹绘出动画窗口」(0.9–3.1s) 的帧节奏，动画开/关各跑 2 次 */
const { chromium } = require('playwright-core');
const BASE = 'http://127.0.0.1:3001/index.html';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const KILL_ANIM = () => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style');
  s.textContent = '.ink-route,.ink-nodes circle,.ink-summit{animation:none !important}'; (document.head || document.documentElement).appendChild(s); }); };

(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const measure = async (kill) => {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    if (kill) await c.addInitScript(KILL_ANIM);
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await sleep(900); // 让加载/首屏稳定，进入动画起笔前
    const frames = await p.evaluate(() => new Promise((res) => { const f = []; const st = performance.now();
      const t = (x) => { f.push(x); if (x - st >= 2200) { res(f); return; } requestAnimationFrame(t); }; requestAnimationFrame(t); }));
    await c.close();
    const d = []; for (let i = 1; i < frames.length; i++) d.push(frames[i] - frames[i - 1]);
    const total = frames[frames.length - 1] - frames[0]; const s = [...d].sort((a, b) => a - b);
    return { n: frames.length, avgFps: +((frames.length - 1) / (total / 1000)).toFixed(1), p95: +s[Math.floor(s.length * .95)].toFixed(1),
      max: +Math.max(...d).toFixed(1), dropped: d.filter(x => x > 33.4).length, gaps: d.filter(x => x > 33.4).map(x => +x.toFixed(0)) };
  };
  const out = { anim_ON: [], anim_OFF: [] };
  for (let i = 0; i < 2; i++) out.anim_ON.push(await measure(false));
  for (let i = 0; i < 2; i++) out.anim_OFF.push(await measure(true));
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
