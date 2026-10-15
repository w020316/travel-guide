// 确认：直辖市在榜单点击路径下是否被误判为「省份」
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const BASE = 'http://127.0.0.1:3001/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const out = { municipalities: [], normalCity: null };

  // --- 1) 逐个点击榜单中的直辖市卡片，观察 toast ---
  for (const city of ['北京', '上海']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1400);

    // 找到该城市的榜单卡片（若无则跳过）
    const found = await page.evaluate(c => {
      const card = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === c);
      if (!card) return false;
      card.scrollIntoView({ behavior: 'instant', block: 'center' });
      return true;
    }, city);

    if (!found) { out.municipalities.push({ city, note: '不在榜单中' }); await ctx.close(); continue; }

    await page.waitForTimeout(600);
    const t0 = Date.now();
    await page.evaluate(c => {
      const card = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === c);
      card.click();
    }, city);

    // 观察 4 秒内是否出现 toast / loading / 结果页
    let toastText = null, loadingShown = false, resultShown = false;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(200);
      const s = await page.evaluate(() => {
        const tw = document.getElementById('toastWrap');
        const last = tw && tw.lastElementChild;
        return {
          toast: last ? last.textContent.trim() : null,
          loading: !document.getElementById('loading').hidden,
          result: !document.getElementById('resultPage').hidden
        };
      });
      if (s.toast) toastText = s.toast;
      if (s.loading) loadingShown = true;
      if (s.result) { resultShown = true; break; }
    }
    out.municipalities.push({
      city,
      elapsedMs: Date.now() - t0,
      toastText,
      loadingShown,
      resultShown
    });
    await page.screenshot({ path: `D:/xm/wz/travel-guide/deliverables/gstack/screenshots/ux/B-municipality-${city}.png` });
    await ctx.close();
  }

  // --- 2) 用非直辖市（成都）走同一路径，确认正常 ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1400);
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === '成都');
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(600);
    const t0 = Date.now();
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === '成都');
      if (card) card.click();
    });
    let resultShown = false;
    for (let i = 0; i < 100; i++) {
      await page.waitForTimeout(300);
      resultShown = await page.evaluate(() => !document.getElementById('resultPage').hidden);
      if (resultShown) break;
    }
    out.normalCity = { city: '成都', elapsedMs: Date.now() - t0, resultShown };
    await page.screenshot({ path: 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/ux/B-normal-成都.png' });
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
