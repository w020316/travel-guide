/**
 * 行纪 Xing Ji · R2 基线测量脚本
 * ------------------------------------------------------------
 * 目的：在「真实国内网络」假设下重建基线。
 * 上一轮 verify-design.js 用 waitUntil:'load' 会因第三方资源（Google Fonts 等）
 * 不可达而 30s 超时 —— 该超时本身即是被测对象，故本轮：
 *   1. 拦截并 abort 所有境外第三方域，模拟国内真实可达性
 *   2. 用 domcontentloaded 作为导航完成信号，另测 FCP / load 时长
 *   3. 采集：横向溢出、触摸目标、字体实际生效族、控制台错误、渲染阻塞资源
 *
 * 输出：deliverables/gstack/baseline-r2.json
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'baseline-r2.json');

const VIEWPORTS = [
  { name: 'desktop-1920', w: 1920, h: 1080 },
  { name: 'desktop-1440', w: 1440, h: 900 },
  { name: 'laptop-1366', w: 1366, h: 768 },
  { name: 'tablet-1024', w: 1024, h: 768 },
  { name: 'tablet-768', w: 768, h: 1024 },
  { name: 'mobile-414', w: 414, h: 896 },
  { name: 'mobile-375', w: 375, h: 667 }
];

// 国内真实网络下不可达 / 高延迟的域
const BLOCKED = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'html2canvas.hertzen.com'
];

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    args: ['--no-proxy-server', '--disable-features=Translate']
  });

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    blockedHosts: BLOCKED,
    viewports: [],
    blockingResources: [],
    consoleErrors: [],
    pageErrors: []
  };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
      bypassCSP: false
    });

    // 拦截境外第三方：模拟国内网络不可达
    await ctx.route('**/*', (route) => {
      const url = route.request().url();
      if (BLOCKED.some((h) => url.includes(h))) {
        return route.abort('failed');
      }
      return route.continue();
    });

    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 300));
    });
    page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));

    const t0 = Date.now();
    let navErr = null;
    try {
      await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e) {
      navErr = String(e).slice(0, 200);
    }
    const dcl = Date.now() - t0;

    // 等字体与首屏稳定
    await page.waitForTimeout(1200);

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const body = document.body;
      const overflow = Math.max(de.scrollWidth, body ? body.scrollWidth : 0) - window.innerWidth;

      // 渲染阻塞资源（尚未完成且位于 head 的 stylesheet）
      const blocking = [];
      for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
        if (!l.sheet) blocking.push(l.href);
      }

      // 实际生效字体
      const probe = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), size: cs.fontSize };
      };

      // 触摸目标：所有可交互元素
      const sels = 'button, a, input, select, textarea, [role="button"], .btn, .chip, .tab';
      const small = [];
      for (const el of document.querySelectorAll(sels)) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue; // 隐藏元素
        if (r.width < 48 || r.height < 48) {
          small.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 40),
            w: Math.round(r.width),
            h: Math.round(r.height)
          });
        }
      }

      // 横向溢出元素定位
      const offenders = [];
      if (overflow > 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > window.innerWidth + 1 || r.left < -1) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 40),
              left: Math.round(r.left),
              right: Math.round(r.right)
            });
            if (offenders.length >= 5) break;
          }
        }
      }

      // 性能条目
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = {};
      for (const p of performance.getEntriesByType('paint')) paints[p.name] = Math.round(p.startTime);

      return {
        overflow: Math.round(overflow),
        offenders,
        blockingStylesheets: blocking,
        docHeight: Math.round(de.scrollHeight),
        fonts: {
          h1: probe('h1, .hero-title'),
          body: probe('body'),
          btn: probe('button, .btn')
        },
        touchSmallCount: small.length,
        touchSmallSample: small.slice(0, 8),
        perf: {
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
          loadEvent: Math.round(nav.loadEventEnd || 0),
          fcp: paints['first-contentful-paint'] || null,
          fcpPaint: paints['first-paint'] || null
        }
      };
    });

    report.viewports.push({ ...vp, navMs: dcl, navErr, ...metrics, consoleErrors: errors.slice(0, 5) });
    report.consoleErrors.push(...errors.map((e) => `[${vp.name}] ${e}`));

    await ctx.close();
  }

  // 汇总阻塞资源（取 1920 视口）
  report.blockingResources = report.viewports[0]?.blockingStylesheets || [];

  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), 'utf8');

  // 控制台摘要
  console.log('=== R2 基线摘要 ===');
  for (const v of report.viewports) {
    console.log(
      `${v.name.padEnd(14)} 溢出:${String(v.overflow).padStart(4)}px  小触控:${String(v.touchSmallCount).padStart(3)}  ` +
        `DCL:${String(v.perf.domContentLoaded).padStart(5)}ms  load:${String(v.perf.loadEvent).padStart(6)}ms  FCP:${v.perf.fcp}`
    );
  }
  console.log('\n阻塞渲染样式表:', report.blockingResources.length ? report.blockingResources : '无');
  console.log('控制台错误数:', report.consoleErrors.length);
  if (report.consoleErrors.length) console.log(report.consoleErrors.slice(0, 6).join('\n'));
  console.log('\n已写入:', OUT);
})();
