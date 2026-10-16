/* R4 自检：跨端水墨签名 + 墨迹绘出动画
   - 内建静态服务器（优先 3001，被占用则回退随机端口）
   - 六档断点首页/结果页横向溢出
   - ≤860px 立轴可见性 + 尺寸测量
   - 用 Web Animations API 定格绘出过程（起笔/行笔/收笔）截图
   - 绘出动画期间 rAF 帧率
   - prefers-reduced-motion: reduce 下终态正确
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUT = path.join(__dirname, 'r4');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const file = path.join(ROOT, p);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    srv.on('error', () => srv.listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port })));
    srv.listen(3001, '127.0.0.1', () => resolve({ srv, port: 3001 }));
  });
}

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: '768', width: 768, height: 900 },
  { name: '414', width: 414, height: 900 },
  { name: '375', width: 375, height: 812 },
];

const scrollThrough = async (page) => {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y <= document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
};

(async () => {
  const { srv, port } = await startServer();
  const BASE = `http://127.0.0.1:${port}/index.html`;
  const report = { ts: new Date().toISOString(), port, pages: [], errors: [] };
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text().slice(0, 200)); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)));

    await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3200);   // 等绘出动画收笔
    await page.screenshot({ path: path.join(OUT, `home-${vp.name}.png`) });

    // 立轴可见性 + 尺寸
    const aside = await page.evaluate(() => {
      const el = document.querySelector('.hero-aside');
      const sc = document.querySelector('.ink-scroll');
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const sr = sc ? sc.getBoundingClientRect() : null;
      const route = document.querySelector('.ink-route');
      const rcs = route ? getComputedStyle(route) : null;
      return {
        display: cs.display,
        position: cs.position,
        w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top),
        scrollW: sr ? Math.round(sr.width) : null, scrollH: sr ? Math.round(sr.height) : null,
        scrollLeft: sr ? Math.round(sr.left) : null,
        routeDashOffset: rcs ? rcs.strokeDashoffset : null,
        routeDashArray: rcs ? rcs.strokeDasharray : null,
        nodeOpacity: (() => { const n = document.querySelector('.ink-nodes circle'); return n ? getComputedStyle(n).opacity : null; })(),
        summitOpacity: (() => { const s = document.querySelector('.ink-summit'); return s ? getComputedStyle(s).opacity : null; })(),
      };
    });

    const homeOver = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    let resOver = null, resultOk = false, gcMotif = null;
    try {
      await page.fill('#cityInput', '成都');
      await page.click('#generateBtn');
      await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
      await page.waitForTimeout(1800);
      await scrollThrough(page);
      await page.screenshot({ path: path.join(OUT, `result-${vp.name}.png`) });
      const head = await page.$('.gc-head');
      if (head) await head.screenshot({ path: path.join(OUT, `result-head-${vp.name}.png`) });
      gcMotif = await page.evaluate(() => {
        const h = document.querySelector('.gc-head');
        if (!h) return null;
        const cs = getComputedStyle(h, '::after');
        const r = h.getBoundingClientRect();
        return { hasAfter: !!cs.content, opacity: cs.opacity, display: cs.display, headW: Math.round(r.width) };
      });
      resOver = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      resultOk = true;
    } catch (e) { report.errors.push({ vp: vp.name, gen: e.message.slice(0, 160) }); }

    report.pages.push({ vp: vp.name, homeOver, resOver, resultOk, aside, gcMotif });
    if (errs.length) report.errors.push({ vp: vp.name, errs: [...new Set(errs)] });
    await ctx.close();
  }

  // ---- 绘出过程定格（1440，2x）----
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const setT = async (ms) => page.evaluate((t) => {
      document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = t; } catch (e) {} });
    }, ms);
    const art = await page.$('.hero-aside');
    for (const [label, t] of [['t0', 1150], ['t1', 1750], ['t2', 2350], ['t3', 3000]]) {
      await setT(t);
      await page.waitForTimeout(120);
      if (art) await art.screenshot({ path: path.join(OUT, `ink-draw-${label}.png`) });
    }
    await ctx.close();
  }

  // ---- 帧率（1440，绘出动画窗口内）----
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    const fps = await page.evaluate(async () => {
      document.getAnimations().forEach(a => { try { a.currentTime = 0; a.play(); } catch (e) {} });
      return await new Promise((resolve) => {
        let frames = 0, long = 0, last = performance.now();
        const start = last;
        function tick(now) {
          frames++;
          const dt = now - last; last = now;
          if (dt > 32) long++;
          if (now - start < 2600) requestAnimationFrame(tick);
          else resolve({ frames, ms: Math.round(now - start), fps: +(frames / ((now - start) / 1000)).toFixed(1), longFrames: long });
        }
        requestAnimationFrame(tick);
      });
    });
    report.fps = fps;
    await ctx.close();
  }

  // ---- prefers-reduced-motion: reduce 终态 ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    report.reducedMotion = await page.evaluate(() => {
      const route = document.querySelector('.ink-route');
      const n = document.querySelector('.ink-nodes circle');
      const s = document.querySelector('.ink-summit');
      const anims = document.getAnimations().filter(a => /inkRouteDraw|inkFadeIn/.test(a.animationName || ''));
      return {
        routeDashOffset: getComputedStyle(route).strokeDashoffset,
        nodeOpacity: getComputedStyle(n).opacity,
        summitOpacity: getComputedStyle(s).opacity,
        inkAnimations: anims.length,
      };
    });
    await page.screenshot({ path: path.join(OUT, 'reduced-motion-hero.png') });
    await ctx.close();
  }

  await browser.close();
  srv.close();
  fs.writeFileSync(path.join(OUT, '_report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
