/**
 * 行纪 Xing Ji · R2 真实用户体验走查
 * ------------------------------------------------------------
 * 阶段四：以真实用户视角走 3 个核心场景，记录分步耗时与卡点。
 *
 * 场景 1：搜索城市 → 生成攻略 → 导出海报（核心路径）
 * 场景 2：收藏 → 比价 → 查看地图
 * 场景 3：天气信息 → 离线降级
 *
 * 注意：场景 1 走真实 AI（实测冷缓存 12–15s），不是 mock。
 *
 * 用法：node deliverables/gstack/r2-ux-walkthrough.js
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'screenshots', 'ux-r2');
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com'];

const log = [];
function mark(scene, step, ms, note = '') {
  log.push({ scene, step, ms: Math.round(ms), note });
  console.log(`  [${scene}] ${step.padEnd(22)} ${String(Math.round(ms)).padStart(6)}ms ${note}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((h) => u.includes(h))) return route.abort('failed');
    return route.continue();
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });

  // ================= 场景 1：搜索 → 生成 → 海报 =================
  console.log('\n=== 场景 1：搜索城市 → 生成攻略 → 导出海报 ===');
  let t = Date.now();
  await page.goto(BASE, { waitUntil: 'load', timeout: 25000 });
  mark('S1', '首屏可交互', Date.now() - t);
  await page.screenshot({ path: path.join(OUT, 's1-01-home.png') });

  // 输入城市（逐字输入，模拟真实打字）
  t = Date.now();
  const input = await page.$('#cityInput, input[placeholder*="城市"]');
  await input.click();
  await input.type('成都', { delay: 120 });
  const suggestVisible = await page.evaluate(() => {
    const s = document.querySelector('.suggestions, [class*="suggestion"]');
    return s ? !s.hidden : false;
  });
  mark('S1', '输入「成都」', Date.now() - t, `联想:${suggestVisible ? 'Y' : 'N'}`);
  await page.screenshot({ path: path.join(OUT, 's1-02-suggest.png') });

  // 提交生成
  t = Date.now();
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    () => { const l = document.querySelector('.loading, #loading'); return l && !l.hidden; },
    { timeout: 8000 }
  ).catch(() => {});
  mark('S1', '回车→加载态出现', Date.now() - t);

  // 等结果页
  t = Date.now();
  let resultOk = false;
  try {
    await page.waitForFunction(
      () => { const r = document.querySelector('#resultPage'); return r && !r.hidden; },
      { timeout: 70000 }
    );
    resultOk = true;
  } catch (_) {}
  mark('S1', '加载→结果页', Date.now() - t, resultOk ? '' : '超时未出结果');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 's1-03-result.png') });

  // 结果页结构
  const resultInfo = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    return {
      city: (q('.gc-head h1, .result-title, h1') || {}).textContent?.trim().slice(0, 20) || null,
      sections: document.querySelectorAll('.gc-section, [class*="section"]').length,
      hasBudget: !!q('[class*="budget"]'),
      hasWeather: !!q('[class*="weather"]'),
      hasMap: !!q('[class*="map"]'),
      hasPoster: !!q('.poster, [class*="poster"]'),
      bodyHeight: Math.round(document.documentElement.scrollHeight)
    };
  });
  console.log('  结果页结构:', JSON.stringify(resultInfo));

  // 导出海报（首次会动态加载 html2canvas）
  t = Date.now();
  const posterBtn = await page.$('[class*="poster"] button, button:has-text("海报"), #downloadPoster');
  let posterOk = false;
  if (posterBtn) {
    await posterBtn.click();
    await page.waitForTimeout(3500);
    posterOk = await page.evaluate(() => typeof window.html2canvas === 'function');
    mark('S1', '点导出海报', Date.now() - t, `html2canvas 注入:${posterOk ? 'Y' : 'N'}`);
  } else {
    mark('S1', '点导出海报', Date.now() - t, '未找到海报按钮');
  }
  await page.screenshot({ path: path.join(OUT, 's1-04-poster.png') });

  // ================= 场景 2：收藏 → 比价 → 地图 =================
  console.log('\n=== 场景 2：收藏 → 比价 → 地图 ===');
  t = Date.now();
  const favBtn = await page.$('[class*="fav"] button, button:has-text("收藏"), #favBtn');
  if (favBtn) { await favBtn.click(); await page.waitForTimeout(500); }
  mark('S2', '收藏当前城市', Date.now() - t);

  const s2 = await page.evaluate(() => {
    const tip = document.querySelector('.compare-tip');
    const cards = document.querySelectorAll('.compare-card');
    const mapEl = document.querySelector('[class*="map"]');
    return {
      compareCards: cards.length,
      compareTipText: tip ? tip.textContent.trim().slice(0, 30) : null,
      mapPresent: !!mapEl,
      mapText: mapEl ? mapEl.textContent.trim().slice(0, 40) : null
    };
  });
  console.log('  比价/地图:', JSON.stringify(s2));
  await page.screenshot({ path: path.join(OUT, 's2-01-compare-map.png') });

  // ================= 场景 3：天气 / 离线 =================
  console.log('\n=== 场景 3：天气 → 离线降级 ===');
  const s3 = await page.evaluate(() => {
    const w = document.querySelector('[class*="weather"]');
    return { weatherPresent: !!w, weatherText: w ? w.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) : null };
  });
  console.log('  天气:', JSON.stringify(s3));

  // 离线页
  t = Date.now();
  await page.goto(BASE + 'offline.html', { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  const off = await page.evaluate(() => ({
    title: document.title,
    text: document.body.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
    hasRetry: !!document.querySelector('button, a[href="/"]')
  }));
  mark('S3', '打开离线页', Date.now() - t);
  console.log('  离线页:', JSON.stringify(off));
  await page.screenshot({ path: path.join(OUT, 's3-01-offline.png') });

  // ================= 汇总 =================
  fs.writeFileSync(path.join(OUT, 'walkthrough.json'), JSON.stringify({ log, resultInfo, s2, s3, off, errors: errs }, null, 2), 'utf8');
  console.log('\n=== 汇总 ===');
  const s1Total = log.filter(x => x.scene === 'S1').reduce((a, b) => a + b.ms, 0);
  console.log('场景 1 关键路径合计:', s1Total, 'ms');
  console.log('页面异常数:', errs.length, errs.slice(0, 3).join(' | '));
  console.log('输出:', OUT);
  await browser.close();
})();
