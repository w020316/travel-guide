/* 行纪 UI 升级 —— 截图 + 控制台/溢出自检脚本 (gstack-designer)
 * 用法: node shot.js <before|after>
 * 依赖: playwright-core (本地可解析) + msedge 通道
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const LABEL = process.argv[2] || 'after';
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = path.join(__dirname, LABEL);
const CITY = '成都';

function ensure(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
ensure(OUT);

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'mobile-375', width: 375, height: 812 },
];

(async () => {
  const report = { label: LABEL, ts: new Date().toISOString(), pages: [], errors: [] };
  const browser = await chromium.launch({
    channel: 'msedge', headless: true,
    args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage', '--force-device-scale-factor=1']
  });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1, serviceWorkers: 'block',
      reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push('console.error: ' + m.text().slice(0, 300)); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 300)));

    await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2500); // 字体 + 入场动效

    // 首页首屏截图
    await page.screenshot({ path: path.join(OUT, `${LABEL}-home-${vp.name}.png`), fullPage: false });

    // 滚动一遍触发 IntersectionObserver 入场，再回到顶部拍整页
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, `${LABEL}-home-${vp.name}-full.png`), fullPage: true });

    // 横向溢出断言
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      over: document.documentElement.scrollWidth - window.innerWidth,
    }));

    // 生成攻略 → 结果页
    let resultOk = false, resultErr = null;
    try {
      await page.fill('#cityInput', CITY);
      await page.click('#generateBtn');
      await page.waitForFunction(() => {
        const r = document.getElementById('resultPage');
        return r && !r.hidden;
      }, { timeout: 60000 });
      await page.waitForTimeout(2000);
      resultOk = true;
      await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.7);
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 110));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT, `${LABEL}-result-${vp.name}.png`), fullPage: false });
      await page.screenshot({ path: path.join(OUT, `${LABEL}-result-${vp.name}-full.png`), fullPage: true });
      const resOverflow = await page.evaluate(() => {
        const grid = document.querySelector('.result-grid');
        return {
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          over: document.documentElement.scrollWidth - window.innerWidth,
          gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
          posterW: document.querySelector('.poster-col') ? Math.round(document.querySelector('.poster-col').getBoundingClientRect().width) : null,
        };
      });
      report.pages.push({ vp: vp.name, overflow, resOverflow, resultOk });
    } catch (e) {
      resultErr = e.message;
      report.pages.push({ vp: vp.name, overflow, resultOk: false, resultErr });
    }

    report.errors.push({ vp: vp.name, errs: [...new Set(errs)] });
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, `_report-${LABEL}.json`), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
