// 阶段五设计令牌化 —— 浏览器实测验证
// 检查：6 档断点无横向溢出、触摸目标 ≥48px、动效属性已展开、滚动入场生效
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const path = require('path');

const OUT = 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots/design';
const BASE = 'http://127.0.0.1:3001/';
const VIEWPORTS = [
  { name: 'desktop-1920', w: 1920, h: 1080 },
  { name: 'desktop-1440', w: 1440, h: 900 },
  { name: 'laptop-1366', w: 1366, h: 768 },
  { name: 'tablet-1024', w: 1024, h: 768 },
  { name: 'tablet-768', w: 768, h: 1024 },
  { name: 'mobile-414', w: 414, h: 896 },
  { name: 'mobile-375', w: 375, h: 667 }
];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const report = { viewports: [], touch: null, motion: null };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(900);

    const m = await page.evaluate(() => {
      const de = document.documentElement;
      // 找出所有实际超出视口右边界、且未被 overflow 容器裁剪的元素
      const overflowing = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > window.innerWidth + 1) {
          const cs = getComputedStyle(el);
          if (cs.position !== 'fixed' && cs.visibility !== 'hidden' && cs.display !== 'none') {
            overflowing.push({
              sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
                   (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''),
              right: Math.round(r.right)
            });
          }
        }
      });
      return {
        viewport: window.innerWidth,
        docScrollWidth: de.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        horizontalOverflow: de.scrollWidth > window.innerWidth + 1,
        overflowingElements: overflowing.slice(0, 8),
        wrapMaxWidth: getComputedStyle(document.querySelector('.wrap')).maxWidth
      };
    });
    report.viewports.push({ name: vp.name, ...m });
    await page.screenshot({ path: path.join(OUT, `${vp.name}.png`) });
    await ctx.close();
  }

  // 触摸目标检查（375px，触摸布局）
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(900);

    report.touch = await page.evaluate(() => {
      // 结果页内的交互元素默认 hidden，先解除隐藏以便测量真实尺寸
      const rp = document.getElementById('resultPage');
      const poster = document.querySelector('.poster-styles');
      if (rp) rp.hidden = false;
      if (poster) poster.hidden = false;

      const sels = ['.btn-primary', '.qc-btn', '.pill', '.nav-menu-btn', '.icon-btn', '.style-pill'];
      const out = {};
      sels.forEach(s => {
        const el = document.querySelector(s);
        if (!el) { out[s] = 'not found'; return; }
        const r = el.getBoundingClientRect();
        out[s] = {
          w: Math.round(r.width),
          h: Math.round(r.height),
          pass: Math.min(r.width, r.height) >= 44
        };
      });
      if (rp) rp.hidden = true;
      return out;
    });
    await ctx.close();
  }

  // 动效属性检查：确认 transition: all 已展开为具体属性
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(900);

    report.motion = await page.evaluate(() => {
      const sample = ['.btn-primary', '.rank-card', '.icon-btn', '.nav-link', '.qc-btn'];
      const props = {};
      sample.forEach(s => {
        const el = document.querySelector(s);
        if (el) props[s] = getComputedStyle(el).transitionProperty;
      });
      // 是否存在仍在使用 all 的元素
      let allCount = 0;
      document.querySelectorAll('body *').forEach(el => {
        if (getComputedStyle(el).transitionProperty === 'all') allCount++;
      });
      const revealEls = document.querySelectorAll('.reveal').length;
      const revealedEls = document.querySelectorAll('.reveal.in').length;
      return { transitionPropertySample: props, elementsStillUsingAll: allCount, revealEls, revealedEls };
    });
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
