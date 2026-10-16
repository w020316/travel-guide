/* 返回顶部按钮 独立复验 (gstack-qa-lead) */
const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3001/index.html', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(600);
  const state = await page.evaluate(() => {
    const b = document.getElementById('backToTop');
    const r = b.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
    const topEl = document.elementFromPoint(cx, cy);
    return { hidden: b.hidden, rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }, scrollY: window.scrollY, hitTag: topEl && topEl.tagName, hitId: topEl && topEl.id, hitCls: topEl && String(topEl.className), btnPointerEvents: getComputedStyle(b).pointerEvents, btnZ: getComputedStyle(b).zIndex };
  });
  console.log('state:', JSON.stringify(state));

  // 监听 click 是否触发
  await page.evaluate(() => { window.__btClicks = 0; document.getElementById('backToTop').addEventListener('click', () => window.__btClicks++); });
  await page.click('#backToTop');
  const samples = [];
  for (let i = 0; i < 12; i++) { await page.waitForTimeout(250); samples.push(await page.evaluate(() => window.scrollY)); }
  const clicks = await page.evaluate(() => window.__btClicks);
  console.log('clicks fired:', clicks, ' scrollY samples:', JSON.stringify(samples));

  // 直接调用 scrollTo 验证页面本身可滚
  const direct = await page.evaluate(async () => { window.scrollTo({ top: 0, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 1500)); return window.scrollY; });
  console.log('direct scrollTo smooth ->', direct);
  const direct2 = await page.evaluate(async () => { window.scrollTo(0, 0); return window.scrollY; });
  console.log('direct scrollTo auto ->', direct2);
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
