const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })).newPage();
  await p.goto('http://127.0.0.1:3001/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(2200);
  await p.keyboard.press('Tab'); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const a = document.activeElement; const b = a.getBoundingClientRect();
    return { tag: a.tagName, cls: a.className, text: a.textContent.trim(), top: Math.round(b.top), left: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) };
  });
  console.log('第一个 Tab 焦点:', JSON.stringify(r));
  await p.screenshot({ path: require('path').join(__dirname, 'r2', 'skip-link-focused.png') });
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
