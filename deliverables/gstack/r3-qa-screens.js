/**
 * 行纪 Xing Ji · R3 QA 截图矩阵
 * 7 档视口 × 亮/暗 × 首页(首屏+全页) + 结果页(全页)，采集横向溢出
 * 输出：deliverables/gstack/screenshots/r3-qa/（不覆盖 R2 证据）
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'screenshots', 'r3-qa');
const VIEWPORTS = [
  { name: '1920', w: 1920, h: 1080 }, { name: '1440', w: 1440, h: 900 },
  { name: '1366', w: 1366, h: 768 }, { name: '1024', w: 1024, h: 768 },
  { name: '768', w: 768, h: 1024 }, { name: '414', w: 414, h: 896 },
  { name: '375', w: 375, h: 667 }
];
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com', 'webapi.amap.com'];
const overflowLog = [];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server', '--force-color-profile=srgb'] });
  for (const scheme of ['light', 'dark']) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: scheme });
      const page = await ctx.newPage();
      await page.route('**/*', (route) => {
        const u = route.request().url();
        if (BLOCKED.some((b) => u.includes(b))) return route.abort();
        return route.continue();
      });
      // 首页
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(900);
      const ovHome = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
      overflowLog.push({ page: `home-${vp.name}-${scheme}`, overflowPx: ovHome.sw - ovHome.iw });
      await page.screenshot({ path: path.join(OUT, `home-${vp.name}-${scheme}-fold.png`) });
      await page.screenshot({ path: path.join(OUT, `home-${vp.name}-${scheme}-full.png`), fullPage: true });
      // 结果页（本地降级数据）
      await page.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
      try { await page.waitForSelector('.gc-section', { timeout: 45000 }); } catch (e) { /* 记录 */ }
      await page.waitForTimeout(1200);
      const ovRes = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
      overflowLog.push({ page: `result-${vp.name}-${scheme}`, overflowPx: ovRes.sw - ovRes.iw });
      await page.screenshot({ path: path.join(OUT, `result-${vp.name}-${scheme}-full.png`), fullPage: true });
      await ctx.close();
      console.log(`done ${scheme} ${vp.name}`);
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'r3-qa-overflow.json'), JSON.stringify(overflowLog, null, 2));
  const bad = overflowLog.filter((o) => o.overflowPx > 1);
  console.log('\noverflow violations (>1px):', bad.length ? JSON.stringify(bad) : 'NONE');
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
