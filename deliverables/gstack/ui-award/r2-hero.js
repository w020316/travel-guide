const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'r2');
const BASE = 'http://127.0.0.1:3001/index.html';
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  for (const w of [1920, 1440, 1024, 900, 861]) {
    const c = await b.newContext({ viewport: { width: w, height: 950 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2600);
    const m = await p.evaluate(() => {
      const t = document.querySelector('.hero-title').getBoundingClientRect();
      const a = document.querySelector('.hero-aside') ? document.querySelector('.hero-aside').getBoundingClientRect() : null;
      const ov = document.documentElement.scrollWidth - window.innerWidth;
      return { titleRight: Math.round(t.right), titleW: Math.round(t.width), asideLeft: a ? Math.round(a.left) : null, asideW: a ? Math.round(a.width) : null, overlap: a ? Math.round(t.right - a.left) : null, overflow: ov };
    });
    console.log(w + 'px', JSON.stringify(m));
    await p.screenshot({ path: path.join(OUT, `hero-${w}.png`) });
    await c.close();
  }
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
