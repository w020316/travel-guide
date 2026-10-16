const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'after');
const BASE = 'http://127.0.0.1:3001/index.html';
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  for (const w of [768, 414]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2200);
    await p.screenshot({ path: path.join(OUT, `after-home-${w}.png`) });
    await p.fill('#cityInput', '成都');
    await p.click('#generateBtn');
    await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: path.join(OUT, `after-result-${w}.png`) });
    await c.close();
  }
  await b.close();
  console.log('bp captured');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
