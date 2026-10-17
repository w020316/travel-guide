/* qa-live-after-phase2.js — 线上复验（R4 UI + v11.3 地图按天分色）
   目标站点：https://travel-guide-w5cq.onrender.com（Render，冷启动 ~98s 需重试）
   检查：① UI 指纹（.hero-aside/.ink-scroll 存在且可见）② 生成攻略 → 结果页
   ③ 地图按天分色：.gc-map-sub 含「按天分色」、#gcMapLegend 可见（≥2 天）、
   #gcMapCanvas 渲染 ④ 全程 pageerror=0 ⑤ 截图存证 */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'https://travel-guide-w5cq.onrender.com/index.html';
const OUT = path.join(__dirname, 'screenshots');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const p = await c.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console.error: ' + m.text().slice(0, 160)); });
  const failed = [];
  p.on('requestfailed', (r) => failed.push(r.url().slice(0, 120) + ' :: ' + (r.failure() || {}).errorText));

  const R = { checks: {} };
  // 1. 打开（冷启动重试：首次可达即继续）
  let opened = false;
  for (let i = 1; i <= 3 && !opened; i++) {
    try { await p.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 150000 }); opened = true; }
    catch (e) { console.log('goto retry', i, e.message.slice(0, 80)); await sleep(3000); }
  }
  if (!opened) { console.log(JSON.stringify({ ...R, fatal: 'site unreachable' })); await b.close(); process.exit(2); }
  await sleep(2500);

  R.checks.uiFingerprint = await p.evaluate(() => ({
    heroAside: !!document.querySelector('.hero-aside'),
    inkScroll: !!document.querySelector('.ink-scroll'),
    inkRoute: !!document.querySelector('.ink-route'),
    heroAsideVisible: (() => { const a = document.querySelector('.hero-aside'); if (!a) return false; const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0; })()
  }));
  await p.screenshot({ path: path.join(OUT, 'live-after-phase2-home.png') });

  // 2. 生成攻略
  await p.fill('#cityInput', '成都');
  await p.click('#generateBtn');
  let resultOk = false;
  try { await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 120000 }); resultOk = true; } catch (e) {}
  R.checks.resultPage = resultOk;
  await sleep(2500);
  await p.screenshot({ path: path.join(OUT, 'live-after-phase2-result.png') });

  // 3. 地图：等区块出现 + 等待引擎结果（canvas 或 hint 二选一）
  let mapState = { sub: '', legendVisible: false, legendText: '', canvasVisible: false, hintVisible: false };
  try {
    await p.waitForFunction(() => !!document.querySelector('.gc-map-section'), { timeout: 30000 });
    await p.evaluate(() => document.querySelector('.gc-map-section').scrollIntoView({ block: 'center' }));
    await p.waitForFunction(() => {
      const cv = document.getElementById('gcMapCanvas');
      const ht = document.getElementById('gcMapHint');
      const lg = document.getElementById('gcMapLegend');
      return (cv && !cv.hidden) || (ht && !ht.hidden) || (lg && !lg.hidden);
    }, { timeout: 60000 });
  } catch (e) { R.checks.mapWaitError = e.message.slice(0, 100); }
  await sleep(2500);
  mapState = await p.evaluate(() => {
    const sub = document.querySelector('.gc-map-sub');
    const lg = document.getElementById('gcMapLegend');
    const cv = document.getElementById('gcMapCanvas');
    const ht = document.getElementById('gcMapHint');
    return {
      sub: sub ? sub.textContent.trim() : '',
      legendVisible: !!(lg && !lg.hidden && lg.getBoundingClientRect().height > 0),
      legendText: lg ? lg.textContent.trim().slice(0, 120) : '',
      canvasVisible: !!(cv && !cv.hidden && cv.getBoundingClientRect().height > 0),
      hintVisible: !!(ht && !ht.hidden)
    };
  });
  R.checks.map = mapState;
  R.checks.dayColorSub = /按天分色/.test(mapState.sub);
  await p.screenshot({ path: path.join(OUT, 'live-after-phase2-map.png') });

  R.errors = errors.slice(0, 12);
  R.requestFailed = failed.slice(0, 12);
  fs.writeFileSync(path.join(OUT, 'live-after-phase2.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
