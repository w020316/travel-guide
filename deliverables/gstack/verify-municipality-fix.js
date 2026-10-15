// 验证：点击榜单首卡「北京」现在能否完整生成攻略
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)); });
  await p.goto('http://127.0.0.1:3001/', { waitUntil: 'load' });
  await p.waitForTimeout(1600);

  const first = await p.evaluate(() => document.querySelector('.rank-card').dataset.city);
  await p.evaluate(() => {
    const c = document.querySelector('.rank-card');
    c.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await p.waitForTimeout(600);

  const t0 = Date.now();
  await p.evaluate(() => document.querySelector('.rank-card').click());

  let toast = null, done = false;
  for (let i = 0; i < 120; i++) {
    await p.waitForTimeout(500);
    const s = await p.evaluate(() => ({
      toast: (() => { const w = document.getElementById('toastWrap'); const l = w && w.lastElementChild; return l ? l.textContent.trim() : null; })(),
      result: !document.getElementById('resultPage').hidden
    }));
    if (s.toast) toast = s.toast;
    if (s.result) { done = true; break; }
  }

  const title = await p.evaluate(() => document.getElementById('resultTitle').textContent.trim());
  await p.screenshot({ path: 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/ux/B-municipality-FIXED.png' });
  await b.close();
  console.log(JSON.stringify({ firstCardCity: first, elapsedMs: Date.now() - t0, toast, resultShown: done, title, consoleErrors: errs.length }, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
