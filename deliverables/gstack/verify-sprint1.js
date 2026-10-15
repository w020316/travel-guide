// 验证 Sprint 1：章节编号连续性 + 数据来源徽章
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)); });

  await p.goto('http://127.0.0.1:3001/', { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  const loadingTextAtStart = await p.evaluate(() => document.getElementById('loadingSub').textContent);

  await p.click('#cityInput');
  await p.type('#cityInput', '成都', { delay: 30 });
  await p.click('#generateBtn');

  // 抓取加载中的文案
  let loadingTextDuring = null;
  for (let i = 0; i < 20; i++) {
    await p.waitForTimeout(400);
    const t = await p.evaluate(() => {
      const l = document.getElementById('loading');
      return l.hidden ? null : document.getElementById('loadingSub').textContent;
    });
    if (t) { loadingTextDuring = t; break; }
  }

  await p.waitForSelector('#resultPage:not([hidden])', { timeout: 90000 });
  await p.waitForTimeout(1200);

  const r = await p.evaluate(() => {
    const gc = document.getElementById('guideContent');
    const idx = Array.from(gc.querySelectorAll('.gc-section .gc-idx')).map(e => e.textContent.trim());
    const titles = Array.from(gc.querySelectorAll('.gc-section h2')).map(h => h.textContent.replace(/^\d+\s*/, '').trim());
    const badge = gc.querySelector('.gc-source');
    return {
      indices: idx,
      titles,
      badgeText: badge ? badge.textContent.replace(/\s+/g, ' ').trim() : null,
      badgeClass: badge ? badge.className : null,
      badgeTitle: badge ? badge.getAttribute('title') : null
    };
  });

  // 校验序号连续性
  const nums = r.indices.map(n => parseInt(n, 10));
  const sequential = nums.every((n, i) => n === i);

  await p.screenshot({ path: 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/ux/D-source-badge.png' });
  await b.close();
  console.log(JSON.stringify({
    loadingTextAtStart, loadingTextDuring,
    indices: r.indices, titles: r.titles,
    sequential, badgeText: r.badgeText, badgeClass: r.badgeClass, badgeTitle: r.badgeTitle,
    consoleErrors: errs.length,
    consoleErrorTexts: errs
  }, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
