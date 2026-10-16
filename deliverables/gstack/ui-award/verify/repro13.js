/* 忠实复现主套件第 13 步（返回顶部）之前的操作序列，带轮询 */
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:3001/index.html', { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(2600);
  // 生成结果页
  await p.fill('#cityInput', '成都'); await p.click('#generateBtn');
  await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
  await p.waitForTimeout(1500);
  // 复现前置操作：工具条收藏 / 复制 / 分享 / 下载 / 天气 / 收藏弹层 / Toast
  await p.click('#favoriteBtn'); await p.waitForTimeout(400);
  await p.click('#copyTextBtn'); await p.waitForTimeout(400);
  await p.click('#shareLinkBtn'); await p.waitForTimeout(400);
  await p.click('#navFavoritesBtn'); await p.waitForTimeout(400);
  await p.click('#closeFavoritesModal'); await p.waitForTimeout(400);
  await p.click('#favoriteBtn'); await p.waitForTimeout(400);
  // 第 13 步
  await p.evaluate(() => window.scrollTo(0, 1600)); await p.waitForTimeout(500);
  const shown = await p.evaluate(() => !document.getElementById('backToTop').hidden);
  const yBefore = await p.evaluate(() => window.scrollY);
  await p.click('#backToTop');
  const s = []; for (let i = 0; i < 16; i++) { await p.waitForTimeout(250); s.push(await p.evaluate(() => window.scrollY)); }
  console.log('shown=', shown, 'yBefore=', yBefore, 'poll=', JSON.stringify(s));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
