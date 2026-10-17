/**
 * 行纪 Xing Ji · R2 页面 × 分辨率矩阵截图
 * ------------------------------------------------------------
 * 阶段三交付物：7 档视口 × 亮/暗两种 colorScheme × 首页首屏 + 全页
 * 同时采集：横向溢出、首屏高度、导航可见性、控制台错误
 *
 * 用法：node deliverables/gstack/r2-screens.js [tag]
 *   tag 用于区分修复前后（如 before / after），输出到 screenshots/r2-<tag>/
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3001/';
const TAG = process.argv[2] || 'r2';
const OUT = path.join(__dirname, 'screenshots', `r2-${TAG}`);

const VIEWPORTS = [
  { name: '1920x1080', w: 1920, h: 1080 },
  { name: '1440x900', w: 1440, h: 900 },
  { name: '1366x768', w: 1366, h: 768 },
  { name: '1024x768', w: 1024, h: 768 },
  { name: '768x1024', w: 768, h: 1024 },
  { name: '414x896', w: 414, h: 896 },
  { name: '375x667', w: 375, h: 667 }
];

// 外部依赖：国内不可达，abort 以保证导航可完成
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    channel: 'msedge',
    args: ['--no-proxy-server', '--force-color-profile=srgb']
  });

  const report = { tag: TAG, generatedAt: new Date().toISOString(), shots: [] };

  for (const scheme of ['light', 'dark']) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
        colorScheme: scheme,
        reducedMotion: 'no-preference'
      });

      await ctx.route('**/*', (route) => {
        const url = route.request().url();
        if (BLOCKED.some((h) => url.includes(h))) return route.abort('failed');
        return route.continue();
      });

      const page = await ctx.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
      page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e).slice(0, 160)));

      await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(900);

      const m = await page.evaluate(() => {
        const de = document.documentElement;
        const cs = getComputedStyle(document.body);
        const header = document.querySelector('.site-header');
        const navLinks = document.querySelector('.nav-links');
        // 用相对亮度判定是否真的进了暗色，而不是硬编码颜色字符串
        // （暗色底 #17140F → rgb(23,20,15)，硬编码匹配极易假阴性）
        const rgb = (cs.backgroundColor.match(/\d+(\.\d+)?/g) || []).map(Number);
        const lum = rgb.length >= 3
          ? (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
          : 1;
        return {
          overflow: Math.round(Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth),
          scrollHeight: Math.round(de.scrollHeight),
          bodyBg: cs.backgroundColor,
          bodyColor: cs.color,
          colorScheme: getComputedStyle(de).colorScheme,
          headerVisible: header ? header.getBoundingClientRect().height > 0 : false,
          navVisible: navLinks ? getComputedStyle(navLinks).display !== 'none' : false,
          darkApplied: lum < 0.3
        };
      });

      const base = `${vp.name}-${scheme}`;
      await page.screenshot({ path: path.join(OUT, `${base}-viewport.png`) });
      await page.screenshot({ path: path.join(OUT, `${base}-full.png`), fullPage: true });

      report.shots.push({ viewport: vp.name, scheme, ...m, errors: errs.slice(0, 3) });
      await ctx.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'matrix.json'), JSON.stringify(report, null, 2), 'utf8');

  console.log('视口            主题   溢出  全高   导航  暗色生效  错误');
  for (const s of report.shots) {
    console.log(
      `${s.viewport.padEnd(14)} ${s.scheme.padEnd(6)} ${String(s.overflow).padStart(4)}  ${String(s.scrollHeight).padStart(5)}  ${s.navVisible ? 'Y' : 'N'}     ${s.darkApplied ? 'Y' : 'N'}       ${s.errors.length}`
    );
  }
  console.log('\n输出目录:', OUT);
})();
