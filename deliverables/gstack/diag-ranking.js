// 诊断：榜单卡片点击后为何未出现结果页
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const BASE = 'http://127.0.0.1:3001/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const net = [];
  page.on('request', r => {
    if (r.url().includes('/api/')) net.push({ t: Date.now(), m: r.method(), u: r.url().replace(BASE, '/'), ev: 'req' });
  });
  page.on('response', async r => {
    if (r.url().includes('/api/')) net.push({ t: Date.now(), u: r.url().replace(BASE, '/'), ev: 'res', status: r.status() });
  });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // 榜单卡片的可见性 / 尺寸 / 是否被 reveal 影响
  const cardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.rank-card'));
    return {
      count: cards.length,
      first: cards[0] ? (() => {
        const r = cards[0].getBoundingClientRect();
        const cs = getComputedStyle(cards[0]);
        return {
          city: cards[0].dataset.city,
          hasRevealClass: cards[0].classList.contains('reveal'),
          hasInClass: cards[0].classList.contains('in'),
          opacity: cs.opacity,
          transform: cs.transform,
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          hasOnclick: typeof cards[0].onclick === 'function'
        };
      })() : null
    };
  });

  // 滚到榜单并点击
  await page.evaluate(() => document.getElementById('ranking').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(700);

  const afterScroll = await page.evaluate(() => {
    const c = document.querySelector('.rank-card');
    const cs = getComputedStyle(c);
    return { opacity: cs.opacity, hasIn: c.classList.contains('in'), transform: cs.transform };
  });

  const t0 = Date.now();
  await page.click('.rank-card');
  const clickMs = Date.now() - t0;

  // 观察 20 秒内状态变化
  const timeline = [];
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1000);
    const s = await page.evaluate(() => ({
      loadingHidden: document.getElementById('loading').hidden,
      loadingCity: document.getElementById('loadingCity').textContent,
      loadingSub: document.getElementById('loadingSub').textContent,
      resultHidden: document.getElementById('resultPage').hidden,
      cityInput: document.getElementById('cityInput').value
    }));
    timeline.push({ sec: i + 1, ...s });
    if (!s.resultHidden) break;
  }

  await browser.close();
  console.log(JSON.stringify({ cardInfo, afterScroll, clickMs, timeline, net, errs }, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
