// 阶段四 · 真实用户体验走查（3 个核心场景，含逐步计时与截图）
// v2：修正场景 B —— 榜单首张卡片是直辖市「北京」，点击会被省份识别逻辑拦截，
//     故按「首个非直辖市卡片」选择，同时把直辖市失败路径单独记录为问题点。
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const path = require('path');

const OUT = 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/ux';
const BASE = 'http://127.0.0.1:3001/';
const MUNICIPALITIES = ['北京', '上海', '天津', '重庆'];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

  const log = [];
  const start = Date.now();
  let last = start;
  const step = async (name, fn) => {
    const t = Date.now();
    let err = null;
    try { if (fn) await fn(); } catch (e) { err = e.message; }
    const now = Date.now();
    log.push({ step: name, ms: now - t, atSec: ((now - start) / 1000).toFixed(1), error: err });
    last = now;
  };

  // ============ 场景 A：搜索城市 → 生成攻略 → 查看结果 ============
  await step('A1 打开首页', async () => {
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
  });
  await page.screenshot({ path: path.join(OUT, 'A1-home.png') });

  await step('A2 输入城市名「成都」', async () => {
    await page.click('#cityInput');
    await page.type('#cityInput', '成都', { delay: 40 });
    await page.waitForTimeout(400);
  });
  await page.screenshot({ path: path.join(OUT, 'A2-typing.png') });

  await step('A3 选择天数=3、偏好=美食', async () => {
    await page.click('.day-pills .pill[data-days="3"]').catch(() => {});
    await page.selectOption('#travelType', 'foodie').catch(() => {});
  });

  await step('A4 点击「生成攻略」→ 等待结果', async () => {
    await page.click('#generateBtn');
    await page.waitForSelector('#resultPage:not([hidden])', { timeout: 90000 });
    await page.waitForTimeout(1500);
  });
  await page.screenshot({ path: path.join(OUT, 'A4-result.png') });

  const resultProbe = await page.evaluate(() => {
    const gc = document.getElementById('guideContent');
    return {
      title: document.getElementById('resultTitle').textContent.trim(),
      sections: Array.from(gc.querySelectorAll('.gc-section h2')).map(h => h.textContent.trim()),
      hasBudget: !!gc.querySelector('.budget-box'),
      hasWeather: !!gc.querySelector('.gc-weather'),
      hasPoster: document.getElementById('poster').children.length > 0,
      guideHeightPx: gc.scrollHeight
    };
  });

  await step('A5 滚动阅读攻略', async () => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
    await page.waitForTimeout(600);
  });
  await page.screenshot({ path: path.join(OUT, 'A5-scrolled.png') });

  // ============ 场景 B：榜单 → 一键生成（选非直辖市） ============
  await step('B1 返回首页', async () => {
    await page.click('#backBtn');
    await page.waitForTimeout(900);
  });

  const rankCities = await page.evaluate(() => Array.from(document.querySelectorAll('.rank-card')).map(c => c.dataset.city));
  const target = rankCities.find(c => !MUNICIPALITIES.includes(c));

  await step(`B2 滚动榜单并点击「${target}」卡片`, async () => {
    await page.evaluate(t => {
      const c = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === t);
      if (c) c.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, target);
    await page.waitForTimeout(600);
    await page.evaluate(t => {
      const c = Array.from(document.querySelectorAll('.rank-card')).find(el => el.dataset.city === t);
      if (c) c.click();
    }, target);
  });
  await page.screenshot({ path: path.join(OUT, 'B2-ranking-click.png') });

  await step('B3 等待结果页', async () => {
    await page.waitForSelector('#resultPage:not([hidden])', { timeout: 90000 });
    await page.waitForTimeout(1200);
  });
  await page.screenshot({ path: path.join(OUT, 'B3-result-from-ranking.png') });

  // ============ 场景 C：收藏 + 分享 ============
  await step('C1 点击「收藏」', async () => {
    await page.click('#favoriteBtn');
    await page.waitForTimeout(700);
  });
  await page.screenshot({ path: path.join(OUT, 'C1-favorited.png') });

  await step('C2 点击「分享链接」', async () => {
    await page.click('#shareLinkBtn');
    await page.waitForTimeout(900);
  });
  await page.screenshot({ path: path.join(OUT, 'C2-share.png') });

  await step('C3 返回首页并打开「我的收藏」', async () => {
    await page.click('#backBtn');
    await page.waitForTimeout(900);
    await page.click('#navFavoritesBtn');
    await page.waitForTimeout(800);
  });
  await page.screenshot({ path: path.join(OUT, 'C3-favorites-modal.png') });

  const favProbe = await page.evaluate(() => {
    const items = document.querySelectorAll('#favoritesList .fav-item');
    const m = document.querySelector('.modal');
    const r = m.getBoundingClientRect();
    return {
      favCount: items.length,
      modalCentered: Math.abs(r.x - (window.innerWidth - r.right)) < 3,
      modalRect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    };
  });

  await step('C4 点击收藏项回到攻略', async () => {
    await page.evaluate(() => {
      const it = document.querySelector('#favoritesList .fav-item');
      if (it) it.click();
    });
    await page.waitForTimeout(2500);
  });
  await page.screenshot({ path: path.join(OUT, 'C4-back-to-guide.png') });

  const totalMs = Date.now() - start;

  await browser.close();
  console.log(JSON.stringify({ totalMs, rankCities, target, steps: log, resultProbe, favProbe, consoleErrors }, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
