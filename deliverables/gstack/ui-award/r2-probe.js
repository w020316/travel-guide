const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })).newPage();
  await p.goto('http://127.0.0.1:3001/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
      const s = getComputedStyle(el);
      const fs = parseFloat(s.fontSize);
      if (fs >= 40) {
        const r = el.getBoundingClientRect();
        out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 40), fs, color: s.color, opacity: s.opacity, w: Math.round(r.width), h: Math.round(r.height) });
      }
    });
    out.sort((a, b) => b.fs - a.fs);
    const ghost = getComputedStyle(document.querySelector('.rank-card'), '::before');
    const rc = document.querySelector('.rank-card').getBoundingClientRect();
    const g = { fs: ghost.fontSize, color: ghost.color, w: Math.round(rc.width), h: Math.round(rc.height) };
    return { big: out.slice(0, 12), ghost };
  });
  console.log(JSON.stringify(r, null, 2));
  await b.close();
})();
