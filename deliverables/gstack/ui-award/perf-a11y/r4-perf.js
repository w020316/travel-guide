/* r4-perf.js — R4 终验：入场绘出动画 FPS / 滚动 FPS(1440+768) / reduced-motion 状态 / 母题对比度
   只读，产出 r4/r4-report.json */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = path.join(__dirname, 'r4');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// 从页面最初就采样 rAF 帧 + 长任务（addInitScript 经 CDP 注入，不受 CSP 限制）
const SAMPLER = () => {
  window.__ent = { frames: [], long: [] };
  try {
    const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__ent.long.push(+e.duration.toFixed(1)); });
    po.observe({ entryTypes: ['longtask'] });
  } catch (e) {}
  const tick = (t) => { window.__ent.frames.push(t); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
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
function analyze(frames, long) {
  if (!frames || frames.length < 5) return { error: 'too few frames', frameCount: frames ? frames.length : 0 };
  const d = []; for (let i = 1; i < frames.length; i++) d.push(frames[i] - frames[i - 1]);
  const total = frames[frames.length - 1] - frames[0];
  const s = [...d].sort((a, b) => a - b); const p = (q) => s[Math.min(s.length - 1, Math.floor(s.length * q))];
  return { frameCount: frames.length, durationMs: +total.toFixed(1), avgFps: +((frames.length - 1) / (total / 1000)).toFixed(1),
    p95: +p(0.95).toFixed(1), maxFrameMs: +Math.max(...d).toFixed(1),
    dropped: d.filter(x => x > 33.4).length, droppedPct: +((d.filter(x => x > 33.4).length / d.length) * 100).toFixed(1),
    longTasks: long.length, longMax: long.length ? Math.max(...long) : 0, longTotal: +long.reduce((a, b) => a + b, 0).toFixed(1) };
}
const HELPERS = `
  function srgb(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function lum(r){return 0.2126*srgb(r[0])+0.7152*srgb(r[1])+0.0722*srgb(r[2]);}
  function ratio(a,b){const l1=lum(a),l2=lum(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
  function parse(s){const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x.trim()));return [p[0],p[1],p[2],p[3]===undefined?1:p[3]];}
  function effBg(el){let n=el,bg=[255,255,255];while(n&&n!==document.documentElement){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c[3]>0.6){bg=[c[0],c[1],c[2]];break;}n=n.parentElement;}return bg;}
  function alphaOver(fg,bg){const a=fg[3];return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a)];}
`;
const mk = (body) => new Function('arg', HELPERS + '\n' + body);

(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const R = {};

  // ---- 1. 入场绘出动画 FPS（1440，默认 no-preference） ----
  {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    await c.addInitScript(SAMPLER);
    const p = await c.newPage();
    const cdp = await c.newCDPSession(p); await cdp.send('Performance.enable');
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await sleep(4000); // 覆盖 1.15s–2.75s 绘出 + 2.35s 峰顶节点
    const ent = await p.evaluate(() => window.__ent);
    R.entrance_animation = analyze(ent.frames, ent.long);
    R.inkAnimState = await p.evaluate(() => {
      const g = (s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e);
        return { anim: cs.animationName, dur: cs.animationDuration, delay: cs.animationDelay, offset: cs.strokeDashoffset, dash: cs.strokeDasharray }; };
      return { route: g('.ink-route'), node1: g('.ink-nodes circle:nth-child(1)'), summit: g('.ink-summit') };
    });
    // 滚动
    await p.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
    await p.evaluate(SCROLL_DRIVER, 4000);
    R.scroll_1440 = analyze(await p.evaluate(() => window.__ent.frames.slice()), await p.evaluate(() => window.__ent.long));
    await c.close();
  }

  // ---- 2. ≤860px 跨端立轴：滚动 FPS + 立轴可见性（768） ----
  {
    const c = await b.newContext({ viewport: { width: 768, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    const cdp = await c.newCDPSession(p); await cdp.send('Performance.enable');
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await sleep(3000);
    R.aside768 = await p.evaluate(() => {
      const a = document.querySelector('.hero-aside'); const s = getComputedStyle(a); const r = a.getBoundingClientRect();
      const sc = document.querySelector('.ink-scroll'); const scr = sc.getBoundingClientRect();
      return { display: s.display, position: s.position, order: s.order, w: Math.round(r.width), h: Math.round(r.height),
               inViewportWidth: scr.width > 0 && scr.width <= window.innerWidth, scrollWidth: Math.round(scr.width), viewportW: window.innerWidth };
    });
    await p.evaluate(SCROLL_DRIVER, 4000);
    R.scroll_768 = await p.evaluate(() => ({ frames: window.__ent ? window.__ent.frames.length : -1 }));
    // 用独立采样
    const frames = await p.evaluate(() => new Promise((res) => { const f = []; const st = performance.now();
      const t = (x) => { f.push(x); if (x - st >= 3000) { res(f); return; } requestAnimationFrame(t); }; requestAnimationFrame(t); }));
    R.scroll_768b = analyze(frames, []);
    R.overflow768 = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await c.close();
  }

  // ---- 3. reduced-motion：动画禁用 + 立轴静态全显（1440 与 768） ----
  {
    for (const w of [1440, 768]) {
      const c = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const p = await c.newPage();
      await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await sleep(1800);
      R['reducedMotion_' + w] = await p.evaluate(() => {
        const g = (s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e);
          return { anim: cs.animationName, dur: cs.animationDuration, opacity: cs.opacity, offset: cs.strokeDashoffset, dash: cs.strokeDasharray }; };
        const a = document.querySelector('.hero-aside'); const s = getComputedStyle(a); const r = a.getBoundingClientRect();
        const route = document.querySelector('.ink-route');
        return { route: g('.ink-route'), node1: g('.ink-nodes circle:nth-child(1)'), summit: g('.ink-summit'),
                 aside: { display: s.display, opacity: s.opacity, w: Math.round(r.width), h: Math.round(r.height) },
                 routeStrokeVisible: route ? getComputedStyle(route).stroke !== 'none' : null };
      });
      await c.close();
    }
  }

  // ---- 4. 结果页母题对比度（.gc-head h2 与母题） ----
  {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage(); await p.goto(BASE, { waitUntil: 'load', timeout: 60000 }); await sleep(2000);
    await p.fill('#cityInput', '成都'); await p.click('#generateBtn');
    try { await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch (e) {}
    await sleep(2000);
    R.gcHead = await p.evaluate(mk(`
      const out = {};
      const h = document.querySelector('.gc-head h2') || document.querySelector('.gc-head');
      if (h) { const s = getComputedStyle(h); const bg = effBg(h); const fg = alphaOver(parse(s.color), bg);
        out.h2 = { ratio: +ratio(fg, bg).toFixed(2), size: parseFloat(s.fontSize), weight: s.fontWeight, color: s.color, bg: 'rgb('+bg.map(Math.round).join(',')+')' }; }
      const gh = document.querySelector('.gc-head');
      if (gh) { const a = getComputedStyle(gh, '::after');
        out.motif = { content: a.content, opacity: a.opacity, zIndex: a.zIndex, background: a.backgroundColor,
                      hasMask: a.maskImage !== 'none' || a.webkitMaskImage !== 'none', pointerEvents: a.pointerEvents }; }
      const parentZ = gh ? getComputedStyle(gh).zIndex : null; out.parentZ = parentZ;
      return out;
    `));
    await c.close();
  }

  await b.close();
  fs.writeFileSync(path.join(OUT, 'r4-report.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
