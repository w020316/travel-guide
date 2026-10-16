/* R2 自检：内建静态服务器 + Playwright 截图（避免依赖后台常驻进程） */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..', '..', '..');   // repo root
const OUT = path.join(__dirname, 'r2');
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
    // 固定 3001：app.js 的 detectBaseURL() 在 localhost:3001 下返回同源相对路径，
    // 避免触发 CSP connect-src 违规（3001 被占用时回退随机端口）
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
    for (let y = 0; y <= document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
};

(async () => {
  const { srv, port } = await startServer();
  const BASE = `http://127.0.0.1:${port}/index.html`;
  const report = { ts: new Date().toISOString(), pages: [], errors: [] };
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text().slice(0, 200)); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)));

    await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, `home-${vp.name}.png`) });
    await scrollThrough(page);
    await page.screenshot({ path: path.join(OUT, `home-${vp.name}-full.png`), fullPage: true });

    const homeOver = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    let resOver = null, resultOk = false;
    try {
      await page.fill('#cityInput', '成都');
      await page.click('#generateBtn');
      await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
      await page.waitForTimeout(2000);
      await scrollThrough(page);
      await page.screenshot({ path: path.join(OUT, `result-${vp.name}.png`) });
      await page.screenshot({ path: path.join(OUT, `result-${vp.name}-full.png`), fullPage: true });
      resOver = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      resultOk = true;
    } catch (e) { report.errors.push({ vp: vp.name, gen: e.message.slice(0, 160) }); }

    report.pages.push({ vp: vp.name, homeOver, resOver, resultOk });
    report.errors.push({ vp: vp.name, errs: [...new Set(errs)] });
    await ctx.close();
  }

  // Hero 装置特写（2x）
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(2600);
    const hero = await page.$('.hero-inner');
    if (hero) await hero.screenshot({ path: path.join(OUT, 'zoom-hero.png') });
    const art = await page.$('.hero-aside');
    if (art) await art.screenshot({ path: path.join(OUT, 'zoom-ink-scroll.png') });
    await scrollThrough(page);
    const grid = await page.$('.ranking-grid');
    if (grid) { await grid.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await grid.screenshot({ path: path.join(OUT, 'zoom-ranking.png') }); }
    await ctx.close();
  }

  await browser.close();
  srv.close();
  fs.writeFileSync(path.join(OUT, '_report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.pages, null, 2));
  console.log('errors:', JSON.stringify(report.errors.filter(e => e.errs && e.errs.length)));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
