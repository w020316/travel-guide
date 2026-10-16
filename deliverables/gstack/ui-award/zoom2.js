const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'after');
const BASE = 'http://127.0.0.1:3001/index.html';
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(2400);

  // 强制显示加载层
  await p.evaluate(() => { const l = document.getElementById('loading'); if (l) l.hidden = false; });
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(OUT, 'zoom-loading.png') });
  await p.evaluate(() => { const l = document.getElementById('loading'); if (l) l.hidden = true; });

  // 结果页：比价区块
  await p.fill('#cityInput', '成都');
  await p.click('#generateBtn');
  await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } });
  await p.waitForTimeout(600);
  const info = await p.evaluate(() => {
    const sels = ['.compare-grid', '.compare-card', '.food-grid', '.route-day', '.tips-grid', '.accommodation-grid', '.photo-spot-grid', '.reservation-alert'];
    return sels.map(s => ({ sel: s, n: document.querySelectorAll(s).length }));
  });
  console.log('sections:', JSON.stringify(info));
  for (const sel of ['.compare-grid', '.food-grid', '.route-day', '.tips-grid']) {
    const el = await p.$(sel);
    if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await el.screenshot({ path: path.join(OUT, 'zoom-' + sel.replace(/[^a-z]/g, '') + '.png') }); }
  }
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
