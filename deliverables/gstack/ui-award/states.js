/* 补充状态截图：1920 宽版 / 加载层 / 收藏弹层 / Toast (gstack-designer) */
const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'after');
const BASE = 'http://127.0.0.1:3001/index.html';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });

  // 1920 宽版
  {
    const c = await browser.newContext({ viewport: { width: 1920, height: 1080 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2600);
    await p.screenshot({ path: path.join(OUT, 'after-home-1920.png') });
    await c.close();
  }

  // 1440：加载层 + 收藏弹层 + Toast
  {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2400);

    // 收藏弹层（空态）
    await p.click('#navFavoritesBtn');
    await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(OUT, 'after-modal-favorites.png') });
    await p.click('#closeFavoritesModal').catch(() => {});
    await p.waitForTimeout(400);

    // 加载层
    await p.fill('#cityInput', '敦煌');
    await p.click('#generateBtn');
    await p.waitForTimeout(450);
    const loadingVisible = await p.evaluate(() => { const l = document.getElementById('loading'); return l && !l.hidden; });
    if (loadingVisible) await p.screenshot({ path: path.join(OUT, 'after-loading.png') });

    await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
    await p.waitForTimeout(2000);
    // 触发一个 Toast（复制文本）
    await p.click('#copyTextBtn').catch(() => {});
    await p.waitForTimeout(700);
    await p.screenshot({ path: path.join(OUT, 'after-result-toast.png') });
    await c.close();
  }

  await browser.close();
  console.log('states captured');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
