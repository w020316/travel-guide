// QA 回归验证 commit 8041ca4：天气来源徽章 + 榜单候选池（针对 PORT=3997 测试服务）
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  p.on('pageerror', e => errs.push('PAGEERROR: ' + String(e).slice(0, 120)));

  await p.goto('http://127.0.0.1:3997/', { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  // 1) 首页榜单（renderRanking 候选池行为）
  const ranking = await p.evaluate(() => {
    const sec = document.querySelector('#rankingSection, .ranking-section, [id*="ranking"], [class*="ranking"]');
    if (!sec) return { found: false };
    const items = Array.from(sec.querySelectorAll('li, .ranking-item, [class*="rank"]'))
      .map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => t).slice(0, 20);
    return { found: true, items };
  });

  // 2) 生成攻略 → 天气卡片徽章
  await p.click('#cityInput');
  await p.type('#cityInput', '成都', { delay: 30 });
  await p.click('#generateBtn');
  await p.waitForSelector('#resultPage:not([hidden])', { timeout: 90000 });
  await p.waitForTimeout(1200);

  const weather = await p.evaluate(() => {
    const card = document.querySelector('.weather-card');
    const badge = document.querySelector('.weather-source');
    return {
      hasWeatherCard: !!card,
      badgeText: badge ? badge.textContent.replace(/\s+/g, ' ').trim() : null,
      badgeClass: badge ? badge.className : null,
      badgeTitle: badge ? badge.getAttribute('title') : null,
      temp: (document.querySelector('.weather-temp') || {}).textContent || null,
      desc: (document.querySelector('.weather-desc') || {}).textContent || null
    };
  });

  await p.screenshot({ path: 'D:/xm/wz/travel-guide/deliverables/qa-8041ca4-weather-badge.png' });
  await b.close();
  console.log(JSON.stringify({ ranking, weather, consoleErrors: errs }, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
