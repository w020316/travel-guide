// 第三轮迭代验证：无障碍路径 + 最终量化复评
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');

const BASE = 'http://127.0.0.1:3001/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const out = {};

  // ---- 1) prefers-reduced-motion: reduce 时应完全跳过入场动效 ----
  {
    const ctx = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: 'reduce'
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(900);
    out.reducedMotion = await page.evaluate(() => {
      const reveal = document.querySelectorAll('.reveal').length;
      // 抽查一个区块：应保持默认可见（opacity 为 1），而非停留在 opacity:0
      const sample = document.querySelector('.section-head');
      const op = sample ? getComputedStyle(sample).opacity : null;
      const anyHidden = Array.from(document.querySelectorAll('.search-card, .rank-card, .section-head'))
        .some(el => parseFloat(getComputedStyle(el).opacity) === 0);
      return { revealElementsAdded: reveal, sampleOpacity: op, anyInvisible: anyHidden };
    });
    await ctx.close();
  }

  // ---- 2) 正常模式：入场动效应生效 ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(900);
    out.normalMotion = await page.evaluate(() => ({
      revealElementsAdded: document.querySelectorAll('.reveal').length
    }));
    await ctx.close();
  }

  // ---- 3) 键盘焦点态：focus-visible 应给出可见轮廓 ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(700);

    const focusInfo = {};
    for (const sel of ['#cityInput', '#generateBtn', '#navFavoritesBtn']) {
      // 用 Tab 键移动焦点以触发 :focus-visible（programmatic focus 不会触发），
      // 并等待过渡完成后再读取计算样式
      await page.evaluate(() => document.body.focus());
      await page.keyboard.press('Tab');
      await page.waitForTimeout(120);
      await page.focus(sel).catch(() => {});
      await page.waitForTimeout(400);   // 等 transition 结束

      focusInfo[sel] = await page.evaluate(s => {
        const el = document.querySelector(s);
        if (!el) return 'not found';
        const cs = getComputedStyle(el);
        const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        const bs = cs.boxShadow || 'none';
        // 有效焦点环：存在 box-shadow 且不是「全透明 + 0 尺寸」的过渡起始态
        const isBlankRing = /^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px/.test(bs.trim());
        const hasRing = bs !== 'none' && !isBlankRing;
        return {
          outlineStyle: cs.outlineStyle,
          outlineWidth: cs.outlineWidth,
          boxShadow: bs,
          hasVisibleFocus: hasOutline || hasRing
        };
      }, sel);
    }
    out.focusVisible = focusInfo;
    await ctx.close();
  }

  // ---- 4) 最终量化：各断点关键指标 ----
  {
    out.finalMetrics = [];
    for (const vp of [{ n: '1920', w: 1920, h: 1080 }, { n: '375', w: 375, h: 667 }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
      const page = await ctx.newPage();
      await page.goto(BASE, { waitUntil: 'load' });
      await page.waitForTimeout(800);
      const m = await page.evaluate(() => {
        // 统计全站实际使用到的字号档位数（证明阶梯收敛）
        const sizes = new Set();
        document.querySelectorAll('body *').forEach(el => {
          const fs = getComputedStyle(el).fontSize;
          if (fs) sizes.add(fs);
        });
        // 统计仍在使用 transition:all 的「有过渡声明」元素
        let explicit = 0, allProp = 0;
        document.querySelectorAll('body *').forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.transitionDuration === '0s') return;   // 无过渡，跳过
          if (cs.transitionProperty === 'all') allProp++;
          else explicit++;
        });
        return {
          distinctFontSizesInUse: sizes.size,
          fontSizeList: Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b)),
          elementsWithTransition_all: allProp,
          elementsWithExplicitTransition: explicit,
          docScrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        };
      });
      out.finalMetrics.push({ viewport: vp.n, ...m });
      await ctx.close();
    }
  }

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
