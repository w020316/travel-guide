const { chromium } = require('playwright-core');
const BASE = 'http://127.0.0.1:3001/index.html';
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const out = {};
  // 1440 桌面
  {
    const c = await b.newContext({ viewport: { width: 1440, height: 950 }, serviceWorkers: 'block' });
    const p = await c.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.slice(0, 160)));
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2600);
    out.desktop = await p.evaluate(() => ({
      footer: !!document.querySelector('.site-footer'),
      skipLink: !!document.querySelector('.skip-link'),
      inkScroll: !!document.querySelector('.ink-scroll-svg'),
      navRoleMenu: document.querySelectorAll('[role="menu"],[role="menuitem"]').length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));
    // 打开收藏弹层
    await p.click('#navFavoritesBtn'); await p.waitForTimeout(500);
    out.modal = await p.evaluate(() => {
      const d = document.querySelector('#favoritesModal [role="dialog"]');
      return d ? { role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'), labelledby: d.getAttribute('aria-labelledby'), hasTarget: !!document.getElementById(d.getAttribute('aria-labelledby')) } : null;
    });
    await p.keyboard.press('Escape');
    // skip link 聚焦
    await p.keyboard.press('Tab'); await p.waitForTimeout(300);
    out.skipFocus = await p.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { cls: a.className, top: Math.round(r.top), visible: r.top > -10 }; });
    out.desktopErrs = [...new Set(errs)];
    await c.close();
  }
  // 375 / 414 hero 标题断行
  for (const w of [414, 375]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2400);
    out['hero' + w] = await p.evaluate(() => {
      const el = document.querySelector('.hero-title');
      const r = el.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      // 逐行取文本
      const range = document.createRange(); range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter(x => x.height > 5);
      const lines = rects.length;
      return { lines, lineHeight: Math.round(lh), height: Math.round(r.height), text: el.textContent, overflow: document.documentElement.scrollWidth - window.innerWidth };
    });
    await c.close();
  }
  await b.close();
  console.log(JSON.stringify(out, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
