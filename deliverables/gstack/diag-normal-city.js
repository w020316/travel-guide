// 复测：非直辖市经榜单路径的完整耗时与网络行为
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const BASE = 'http://127.0.0.1:3001/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const net = [];
  const t0base = Date.now();
  page.on('request', r => {
    if (r.url().includes('/api/')) net.push({ at: Date.now() - t0base, m: r.method(), u: r.url().replace(BASE, '') });
  });
  page.on('requestfailed', r => {
    if (r.url().includes('/api/')) net.push({ at: Date.now() - t0base, failed: r.url().replace(BASE, ''), err: r.failure()?.errorText });
  });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    const c = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === '成都');
    if (c) c.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(600);

  const t0 = Date.now();
  await page.evaluate(() => {
    const c = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === '成都');
    if (c) c.click();
  });

  const timeline = [];
  let done = false;
  for (let i = 0; i < 120; i++) {          // 最多 60 秒
    await page.waitForTimeout(500);
    const s = await page.evaluate(() => ({
      loading: !document.getElementById('loading').hidden,
      loadingSub: document.getElementById('loadingSub').textContent,
      result: !document.getElementById('resultPage').hidden,
      toast: (() => { const tw = document.getElementById('toastWrap'); const l = tw && tw.lastElementChild; return l ? l.textContent.trim() : null; })()
    }));
    if (i % 4 === 0 || s.result || s.toast) timeline.push({ sec: ((Date.now() - t0) / 1000).toFixed(1), ...s });
    if (s.result) { done = true; break; }
  }

  await page.screenshot({ path: 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/ux/B-normal-成都-final.png' });

  await browser.close();
  console.log(JSON.stringify({ totalMs: Date.now() - t0, done, timeline, net }, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
