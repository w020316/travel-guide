/* QA live probe: 高德地图渲染复核 (gstack-qa-lead)
 * 用法: node qa-map-probe.js [city] [headless:0|1]
 */
const PW = 'D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(PW);
const fs = require('fs');

const CITY = process.argv[2] || '成都';
const HEADLESS = process.argv[3] === '1';
const BASE = 'https://travel-guide-w5cq.onrender.com';
const OUT = 'D:/xm/wz/travel-guide/deliverables/gstack/screenshots';

(async () => {
  const events = [];
  const push = (t, text) => events.push({ t, text: String(text).slice(0, 500) });

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: HEADLESS,
    args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('console', m => push('console.' + m.type(), m.text()));
  page.on('pageerror', e => push('pageerror', e.message));
  page.on('requestfailed', r => push('requestfailed', r.url() + ' :: ' + (r.failure() ? r.failure().errorText : '')));

  const result = { city: CITY, headless: HEADLESS, ts: new Date().toISOString() };
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);

    // WebGL 能力自检
    result.webgl = await page.evaluate(() => {
      try { const c = document.createElement('canvas'); const gl = c.getContext('webgl2') || c.getContext('webgl'); return !!gl; }
      catch (e) { return 'err:' + e.message; }
    });

    await page.fill('#cityInput', CITY);
    await page.click('#generateBtn');
    await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 150000 });
    result.resultVisible = true;

    // 等待地图初始化 + 标注串行搜索（PlaceSearch QPS 限制，逐个 300ms 间隔）
    // 轮询 marker 数量直到稳定，最多 90s
    let last = -1, stable = 0;
    for (let i = 0; i < 45; i++) {
      await page.waitForTimeout(2000);
      const n = await page.evaluate(() => document.querySelectorAll('.amap-marker').length);
      if (n === last && n > 0) { stable++; if (stable >= 3) break; } else { stable = 0; }
      last = n;
    }
    result.finalMarkerCount = last;

    // 区块序号
    result.sections = await page.evaluate(() => [...document.querySelectorAll('.gc-section')].map(s => {
      const idx = s.querySelector('.gc-idx');
      const h2 = s.querySelector('h2');
      return { idx: idx ? idx.textContent.trim() : null, title: h2 ? h2.textContent.replace(/^\s*\d+\s*/, '').trim() : null, cls: s.className };
    }));

    // 地图 DOM 诊断
    result.map = await page.evaluate(() => {
      const box = document.getElementById('gcMapBox');
      const canvas = document.getElementById('gcMapCanvas');
      const hint = document.getElementById('gcMapHint');
      const loading = document.getElementById('gcMapLoading');
      const q = (s) => document.querySelectorAll(s).length;
      const inner = canvas ? canvas.querySelector('canvas') : null;
      const containers = canvas ? [...canvas.querySelectorAll('canvas')].map(c => ({ w: c.width, h: c.height, cw: c.clientWidth, ch: c.clientHeight })) : [];
      const logo = document.querySelector('.amap-logo');
      const cop = document.querySelector('.amap-copyright');
      const vis = (el) => { if (!el) return null; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return { display: s.display, visibility: s.visibility, opacity: s.opacity, w: Math.round(r.width), h: Math.round(r.height) }; };
      const markers = [...document.querySelectorAll('.amap-marker')].map(m => {
        const r = m.getBoundingClientRect();
        const img = m.querySelector('img');
        return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), title: m.getAttribute('title') || '', icon: img ? (img.src || '').slice(0, 60) : null };
      });
      return {
        boxExists: !!box, boxDataCity: box ? box.dataset.city : null,
        spotsCount: box && box.dataset.spots ? box.dataset.spots.split('|').filter(Boolean).length : null,
        canvasExists: !!canvas, canvasHidden: canvas ? canvas.hidden : null,
        canvasClient: canvas ? { w: canvas.clientWidth, h: canvas.clientHeight } : null,
        innerCanvasCount: containers.length, innerCanvases: containers,
        amapContainerCount: q('.amap-container'), amapLayerCount: q('.amap-layer'),
        markerCount: markers.length, markers,
        hintHidden: hint ? hint.hidden : null, hintText: hint ? hint.textContent.trim().slice(0, 200) : null,
        loadingHidden: loading ? loading.hidden : null,
        logo: { present: !!logo, text: logo ? logo.textContent.trim() : null, src: logo ? (logo.querySelector('img') ? logo.querySelector('img').src : null) : null, naturalW: logo && logo.querySelector('img') ? logo.querySelector('img').naturalWidth : null, complete: logo && logo.querySelector('img') ? logo.querySelector('img').complete : null, vis: vis(logo) },
        copyright: { present: !!cop, text: cop ? cop.textContent.trim() : null, vis: vis(cop) }
      };
    });

    // 截图：整页地图区块
    const box = await page.$('#gcMapBox');
    if (box) {
      await box.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await box.screenshot({ path: OUT + '/qa-live-after-map-' + CITY + '.png' });
      result.mapShot = 'qa-live-after-map-' + CITY + '.png';
    }

    // InfoWindow 交互：点击第一个 marker
    result.infoWindow = await page.evaluate(async () => {
      const m = document.querySelector('.amap-marker');
      if (!m) return { ok: false, reason: 'no marker' };
      m.click();
      await new Promise(r => setTimeout(r, 900));
      const info = document.querySelector('.amap-info, .amap-info-content');
      const wrap = document.querySelector('.amap-info-contentContainer');
      return { ok: !!info, text: (info ? info.textContent.trim() : (wrap ? wrap.textContent.trim() : null)) };
    });
    if (box) { await page.waitForTimeout(500); await box.screenshot({ path: OUT + '/qa-live-after-map-' + CITY + '-infowindow.png' }); result.infoShot = 'qa-live-after-map-' + CITY + '-infowindow.png'; }

    // 全页截图（结果页）
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: OUT + '/qa-live-after-result-' + CITY + '.png', fullPage: false });
    result.resultShot = 'qa-live-after-result-' + CITY + '.png';

    result.verdict = 'probe-complete';
  } catch (e) {
    result.error = e.message;
  }
  result.events = events;
  result.csp = events.filter(e => /Content Security Policy|Refused to|violates the following/i.test(e.text));
  result.pageErrors = events.filter(e => e.t === 'pageerror');
  result.consoleErrors = events.filter(e => e.t === 'console.error' || e.t === 'console.warning');
  fs.writeFileSync(OUT + '/qa-probe-after-result.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
