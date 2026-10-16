const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'r2');
const BASE = 'http://127.0.0.1:3001/index.html';
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const c = await b.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 3, serviceWorkers: 'block' });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(2600);
  const el = await p.$('.hero-aside');
  if (el) await el.screenshot({ path: path.join(OUT, 'zoom-ink-scroll.png') });
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
