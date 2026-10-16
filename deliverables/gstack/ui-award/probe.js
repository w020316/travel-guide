/* 元素级特写 + 计算样式/无障碍探针 (gstack-designer) */
const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'after');
const BASE = 'http://127.0.0.1:3001/index.html';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true,
    args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2600);

  // 首页特写
  const hero = await page.$('.hero-inner');
  if (hero) await hero.screenshot({ path: path.join(OUT, 'zoom-hero.png') });
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
  await page.waitForTimeout(900);
  const grid = await page.$('.ranking-grid');
  if (grid) { await grid.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await grid.screenshot({ path: path.join(OUT, 'zoom-ranking.png') }); }

  // 计算样式探针
  const probe = await page.evaluate(() => {
    const cs = (sel, props) => { const el = document.querySelector(sel); if (!el) return { sel, missing: true };
      const s = getComputedStyle(el); const o = {}; props.forEach(p => o[p] = s.getPropertyValue(p)); return { sel, ...o }; };
    return {
      heroTitle: cs('.hero-title', ['font-family', 'font-size', 'font-feature-settings', 'max-width', 'text-wrap']),
      sectionTitle: cs('.section-title', ['font-feature-settings', 'font-family']),
      eyebrowNo: cs('.eyebrow-no', ['font-family', 'font-variant-numeric']),
      rcMeta: cs('.rank-card .rc-meta', ['font-variant-numeric', 'font-family']),
      body: cs('body', ['text-spacing-trim', 'font-synthesis']),
      seal: cs('.hero-seal', ['background-color', 'color', 'transform']),
      grain: (() => { const s = getComputedStyle(document.body, '::after'); return { content: s.content, position: s.position, mix: s.mixBlendMode, opacity: s.opacity, zIndex: s.zIndex }; })(),
      revealTargets: [...document.querySelectorAll('.reveal')].length,
      revealIn: [...document.querySelectorAll('.reveal.in')].length,
    };
  });

  // 生成攻略 → 结果页探针
  await page.fill('#cityInput', '成都');
  await page.click('#generateBtn');
  await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } window.scrollTo(0,0); });
  await page.waitForTimeout(800);
  const sec = await page.$('.gc-section');
  if (sec) { await sec.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await sec.screenshot({ path: path.join(OUT, 'zoom-guide-section.png') }); }
  const gcHead = await page.$('.gc-head');
  if (gcHead) { await gcHead.screenshot({ path: path.join(OUT, 'zoom-gc-head.png') }); }

  const probe2 = await page.evaluate(() => {
    const cs = (sel, props) => { const el = document.querySelector(sel); if (!el) return { sel, missing: true };
      const s = getComputedStyle(el); const o = {}; props.forEach(p => o[p] = s.getPropertyValue(p)); return { sel, ...o }; };
    return {
      gcIdx: cs('.gc-idx', ['font-family', 'font-variant-numeric']),
      gcStat: cs('.gc-stat', ['font-variant-numeric']),
      budgetTotal: cs('.budget-total', ['font-feature-settings', 'font-variant-numeric', 'font-family']),
      weatherTemp: cs('.weather-temp', ['font-variant-numeric', 'font-feature-settings']),
      posterLabel: getComputedStyle(document.querySelector('.poster-frame'), '::before').content,
      resultTitle: cs('.result-title', ['font-feature-settings', 'font-family']),
    };
  });

  await browser.close();
  console.log(JSON.stringify({ probe, probe2 }, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
