/**
 * 行纪 Xing Ji · R2 跨浏览器 × 视口 × 主题 矩阵
 * ------------------------------------------------------------
 * 阶段三交付物。三引擎（Chromium/Firefox/WebKit）× 7 档视口 × 亮暗主题。
 *
 * 说明：Windows 上无法运行真正的 Safari，WebKit 为同引擎近似，
 * 差异（如系统字体、Safari 专属前缀行为）需在报告中标明为局限。
 *
 * 用法：node deliverables/gstack/r2-crossbrowser.js [tag]
 */
const pw = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3001/';
const TAG = process.argv[2] || 'r2';
const OUT = path.join(__dirname, 'screenshots', `cross-${TAG}`);
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com'];

const VIEWPORTS = [
  { name: '1920x1080', w: 1920, h: 1080 },
  { name: '1440x900', w: 1440, h: 900 },
  { name: '1366x768', w: 1366, h: 768 },
  { name: '1024x768', w: 1024, h: 768 },
  { name: '768x1024', w: 768, h: 1024 },
  { name: '414x896', w: 414, h: 896 },
  { name: '375x667', w: 375, h: 667 }
];

// 只对代表性组合截图，避免 42 张全页图占用过多空间
const SHOT_AT = new Set(['1440x900|light', '375x667|dark']);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];

  for (const engine of ['chromium', 'firefox', 'webkit']) {
    for (const scheme of ['light', 'dark']) {
      // Firefox 的 colorScheme 上下文选项不生效（实测 matchMedia 恒为 false），
      // 必须用 firefoxUserPrefs 强制：layout.css.prefers-color-scheme.content-override
      // 0 = dark / 1 = light / 2 = system
      const launchOpts =
        engine === 'chromium'
          ? { channel: 'msedge', args: ['--no-proxy-server'] }
          : engine === 'firefox'
            ? { firefoxUserPrefs: { 'layout.css.prefers-color-scheme.content-override': scheme === 'dark' ? 0 : 1 } }
            : {};

      let browser;
      try {
        browser = await pw[engine].launch(launchOpts);
      } catch (e) {
        rows.push({ engine, scheme, error: 'launch failed: ' + String(e.message).slice(0, 100) });
        continue;
      }

      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          deviceScaleFactor: 1,
          // Firefox 走 prefs，这里传了也无害；其余引擎依赖此项
          ...(engine === 'firefox' ? {} : { colorScheme: scheme })
        });

        await ctx.route('**/*', (route) => {
          const url = route.request().url();
          if (BLOCKED.some((h) => url.includes(h))) return route.abort('failed');
          return route.continue();
        });

        const page = await ctx.newPage();
        const errs = [];
        page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
        page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e).slice(0, 120)));

        let navErr = null;
        try {
          await page.goto(BASE, { waitUntil: 'load', timeout: 25000 });
        } catch (e) {
          navErr = String(e).slice(0, 100);
        }
        await page.waitForTimeout(700);

        const m = await page.evaluate(() => {
          const de = document.documentElement;
          const cs = getComputedStyle(document.body);
          const rgb = (cs.backgroundColor.match(/\d+(\.\d+)?/g) || []).map(Number);
          const lum = rgb.length >= 3 ? (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 : 1;
          const h1 = document.querySelector('h1');
          return {
            overflow: Math.round(Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth),
            bg: cs.backgroundColor,
            darkApplied: lum < 0.3,
            h1Family: h1 ? getComputedStyle(h1).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null,
            h1Size: h1 ? getComputedStyle(h1).fontSize : null,
            // 关键结构存在性
            hasSearchForm: !!document.querySelector('form'),
            hasRankList: !!document.querySelector('.rank-card, [data-city]'),
            navVisible: (() => { const n = document.querySelector('.nav-links'); return n ? getComputedStyle(n).display !== 'none' : false; })(),
            fontFaces: document.fonts.size
          };
        });

        const key = `${vp.name}|${scheme}`;
        if (SHOT_AT.has(key)) {
          await page.screenshot({ path: path.join(OUT, `${engine}-${vp.name}-${scheme}.png`) });
        }

        rows.push({ engine, viewport: vp.name, scheme, navErr, ...m, errors: errs.length, errSample: errs.slice(0, 2) });
        await ctx.close();
      }
      await browser.close();
    }
  }

  fs.writeFileSync(path.join(OUT, 'matrix.json'), JSON.stringify(rows, null, 2), 'utf8');

  console.log('引擎      视口        主题   溢出  暗色  字体           错误');
  for (const r of rows) {
    if (r.error) { console.log(`${r.engine.padEnd(9)} LAUNCH FAILED`); continue; }
    console.log(
      `${r.engine.padEnd(9)} ${r.viewport.padEnd(11)} ${r.scheme.padEnd(6)} ${String(r.overflow).padStart(4)}  ` +
      `${r.darkApplied ? 'Y' : 'N'}    ${String(r.h1Family || '-').padEnd(15)} ${r.errors}`
    );
  }
  const bad = rows.filter(r => r.error || r.navErr || r.overflow > 0 || r.errors > 0);
  console.log(`\n异常组合: ${bad.length} / ${rows.length}`);
  if (bad.length) bad.slice(0, 8).forEach(b => console.log('  ⚠️', b.engine, b.viewport, b.scheme, b.error || b.navErr || `overflow=${b.overflow} errors=${b.errors}`));
  console.log('输出:', OUT);
})();
