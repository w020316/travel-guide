/* QA live probe #2: InfoWindow 真实鼠标交互 + CSP 证据 (gstack-qa-lead) */
const PW = 'D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(PW);
const fs = require('fs');
const CITY = process.argv[2] || '成都';
const BASE = 'https://travel-guide-w5cq.onrender.com';
const OUT = 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots';

(async () => {
  const events = [];
  const browser = await chromium.launch({ channel: 'msedge', headless: false, args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('console', m => events.push({ t: 'console.' + m.type(), text: m.text().slice(0, 400) }));
  page.on('pageerror', e => events.push({ t: 'pageerror', text: e.message.slice(0, 400) }));
  const r = { city: CITY, ts: new Date().toISOString() };
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.fill('#cityInput', CITY);
    await page.click('#generateBtn');
    await page.waitForFunction(() => { const x = document.getElementById('resultPage'); return x && !x.hidden; }, { timeout: 150000 });
    await page.waitForTimeout(25000);
    const box = await page.$('#gcMapBox');
    await box.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // 取一个景点蓝标（第2个 marker）的真实坐标，用 Playwright 真鼠标点击
    const pos = await page.evaluate(() => {
      const ms = [...document.querySelectorAll('.amap-marker')];
      const target = ms[1] || ms[0];
      const rc = target.getBoundingClientRect();
      return { x: rc.left + rc.width / 2, y: rc.top + rc.height * 0.3, title: target.getAttribute('title') };
    });
    r.clickTarget = pos;
    await page.mouse.click(pos.x, pos.y);
    await page.waitForTimeout(1200);
    r.infoAfterMouse = await page.evaluate(() => {
      const c = document.querySelector('.amap-info-content');
      return { present: !!document.querySelector('.amap-info'), text: c ? c.textContent.trim() : null };
    });
    await box.screenshot({ path: OUT + '/qa-live-after-infowindow-' + CITY + '.png' });

    // 备用：派发完整鼠标事件序列
    if (!r.infoAfterMouse.present) {
      await page.evaluate((p) => {
        const ms = [...document.querySelectorAll('.amap-marker')];
        const t = ms[1] || ms[0];
        ['mousedown', 'mouseup', 'click'].forEach(type => t.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: p.x, clientY: p.y })));
      }, pos);
      await page.waitForTimeout(1000);
      r.infoAfterDispatch = await page.evaluate(() => {
        const c = document.querySelector('.amap-info-content');
        return { present: !!document.querySelector('.amap-info'), text: c ? c.textContent.trim() : null };
      });
    }

    // 统计 marker 图标是否加载成功（蓝/红）与 DOM
    r.markerSummary = await page.evaluate(() => {
      const ms = [...document.querySelectorAll('.amap-marker')];
      return { total: ms.length, titles: ms.map(m => m.getAttribute('title')) };
    });
    r.mapCanvas = await page.evaluate(() => {
      const cv = document.querySelector('#gcMapCanvas canvas');
      const cont = document.querySelector('#gcMapCanvas .amap-container');
      return { innerCanvas: cv ? { w: cv.width, h: cv.height, cw: cv.clientWidth, ch: cv.clientHeight } : null,
        container: cont ? { cw: cont.clientWidth, ch: cont.clientHeight } : null,
        logoImgComplete: (() => { const i = document.querySelector('.amap-logo img'); return i ? { src: i.src, complete: i.complete, naturalW: i.naturalWidth } : null; })() };
    });
  } catch (e) { r.error = e.message; }
  r.csp = events.filter(e => /Content Security Policy|Refused to|violates the following/i.test(e.text)).map(e => e.text);
  r.pageErrors = events.filter(e => e.t === 'pageerror').map(e => e.text);
  fs.writeFileSync(OUT + '/qa-probe2-after-result.json', JSON.stringify(r, null, 2));
  console.log(JSON.stringify(r, null, 2));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
