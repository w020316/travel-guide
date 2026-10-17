/**
 * 行纪 Xing Ji · R3 QA 交互/样式/布局验证
 * ------------------------------------------------------------
 * QA(Edward) 独立验证 R3 未提交改动：
 *   1. 预算数字滚动（进视口触发一次 / reduced-motion 静态 / 区间两端 / 年份不滚 / min-width 防抖动）
 *   2. 可变字重 680/620 生效性（含 .result-title 重复规则核查）+ hero-title 900
 *   3. 章节呼吸位（3n margin + 发丝线令牌亮暗双轨 / 锚点定位 / ≤480 收缩）
 *   4. 表单实时校验提示（aria-live / 20 字上限 / 纯符号 / 与联想互不遮挡）
 *   5. Hero 视差（--hero-parallax 变量 / reduced-motion 禁用 / 移动端阅读流）
 *   附：console 错误清单（UX-1 CSP 噪音豁免标注）
 *
 * 用法：node deliverables/gstack/r3-qa-verify.js
 * 输出：deliverables/gstack/screenshots/r3-qa/r3-qa-report.json + 控制台摘要
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'screenshots', 'r3-qa');
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com', 'webapi.amap.com'];

fs.mkdirSync(OUT, { recursive: true });
const results = [];
const consoleErrors = [];
function rec(name, pass, detail) {
  results.push({ name, pass: !!pass, detail: detail === undefined ? null : detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  => ' + JSON.stringify(detail) : ''}`);
}

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    args: ['--no-proxy-server', '--force-color-profile=srgb']
  });

  // ================= 阶段 A：交互验证（1440x900） =================
  const ctxA = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctxA.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push({ page: 'A', text: m.text().slice(0, 300) }); });
  page.on('pageerror', (e) => consoleErrors.push({ page: 'A', pageerror: String(e).slice(0, 300) }));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((b) => u.includes(b))) return route.abort();
    return route.continue();
  });

  // ---- A1. 校验提示：结构 + aria-live ----
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const hintInfo = await page.evaluate(() => {
    const el = document.getElementById('cityInputHint');
    if (!el) return null;
    return { exists: true, ariaLive: el.getAttribute('aria-live'), describedby: document.getElementById('cityInput').getAttribute('aria-describedby') };
  });
  rec('hint.element+aria-live=polite', !!hintInfo && hintInfo.ariaLive === 'polite' && (hintInfo.describedby || '').includes('cityInputHint'), hintInfo);

  // 超 20 字 → 提示出现
  const long25 = '一'.repeat(25);
  await page.fill('#cityInput', long25);
  await page.waitForTimeout(650);
  const longState = await page.evaluate(() => {
    const el = document.getElementById('cityInputHint');
    return { shown: el.classList.contains('show'), text: el.textContent, visible: !!(el.offsetWidth || el.offsetHeight) };
  });
  rec('hint.over20chars shows', longState.shown && longState.visible && longState.text.includes('20'), longState);

  // 纯符号 → 提示出现
  await page.fill('#cityInput', '@@@###￥%……');
  await page.waitForTimeout(650);
  const symState = await page.evaluate(() => {
    const el = document.getElementById('cityInputHint');
    return { shown: el.classList.contains('show'), text: el.textContent };
  });
  rec('hint.pure-symbols shows', symState.shown && symState.text.length > 0, symState);

  // 合法输入 → 提示消失 + 联想下拉正常 + 几何互不遮挡
  await page.fill('#cityInput', '西安');
  await page.waitForTimeout(700);
  const okState = await page.evaluate(() => {
    const hint = document.getElementById('cityInputHint');
    const sug = document.getElementById('searchSuggestions');
    const hr = hint.getBoundingClientRect();
    const sr = sug.hidden ? null : sug.getBoundingClientRect();
    let overlap = null;
    if (sr && !sug.hidden) {
      overlap = !(sr.bottom <= hr.top || hr.bottom <= sr.top || sr.right <= hr.left || hr.right <= sr.left);
    }
    return {
      hintShown: hint.classList.contains('show'), hintText: hint.textContent,
      sugHidden: sug.hidden, sugCount: sug.querySelectorAll('.suggestion-item').length,
      overlapWithHint: overlap
    };
  });
  rec('hint.valid-input cleared', !okState.hintShown && okState.hintText === '', okState);
  rec('suggestions work with hint (160ms)', !okState.sugHidden && okState.sugCount > 0, okState);
  rec('suggestions no overlap with hint', okState.overlapWithHint === false, { overlap: okState.overlapWithHint });
  await page.fill('#cityInput', '');

  // ---- A2. Hero 视差：变量写入 + 只走 translate ----
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const p0 = await page.evaluate(() => {
    const a = document.querySelector('.hero-aside');
    return { varSet: a.style.getPropertyValue('--hero-parallax'), translate: getComputedStyle(a).translate, transform: getComputedStyle(a).transform };
  });
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);
  const p500 = await page.evaluate(() => document.querySelector('.hero-aside').style.getPropertyValue('--hero-parallax'));
  rec('parallax var 0→500px ⇒ 0→~60px', Math.abs(parseFloat(p500 || '0') - 60) < 1 && p0.varSet === '', { at0: p0.varSet, at500: p500, translate: p0.translate });
  rec('parallax uses translate prop (not transform)', typeof p0.translate === 'string' && p0.translate.includes('60px') === false && p0.transform !== 'none', { translate: p0.translate, transform: p0.transform });
  await page.evaluate(() => window.scrollTo(0, 0));

  // ---- A3. 字重：680/620 生效性 + .result-title 重复规则 ----
  await page.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForSelector('.gc-section', { timeout: 60000 });
  } catch (e) {
    rec('result page rendered (.gc-section)', false, String(e).slice(0, 200));
  }
  await page.waitForTimeout(1200);
  const weights = await page.evaluate(() => {
    const w = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontWeight : null; };
    return {
      resultTitle: w('.result-title'), sectionTitle: w('.section-title'), gcH2: w('.gc-head h2'),
      gcSectionH2: w('.gc-section > h2'), weatherTemp: w('.weather-temp'), budgetTotal: w('.budget-total'),
      heroTitle: w('.hero-title'), loadingTitle: w('.loading-title'),
      resultTitleCount: document.querySelectorAll('.result-title').length
    };
  });
  rec('weight.section-title=680', weights.sectionTitle === '680', weights.sectionTitle);
  rec('weight.gc-head h2=680', weights.gcH2 === '680', weights.gcH2);
  rec('weight.gc-section h2=680', weights.gcSectionH2 === '680', weights.gcSectionH2);
  rec('weight.weather-temp=680', weights.weatherTemp === '680', weights.weatherTemp);
  rec('weight.budget-total=680', weights.budgetTotal === '680', weights.budgetTotal);
  rec('weight.hero-title=900 (untouched)', weights.heroTitle === '900', weights.heroTitle);
  // 设计意图是 680：若 computed 为 700 → 2279 行重复规则覆盖了 892 行的 680
  rec('weight.result-title=680 (design intent)', weights.resultTitle === '680', { computed: weights.resultTitle, note: weights.resultTitle === '700' ? 'style.css:2279 重复声明 font-weight:700 覆盖了 :892 的 680' : null });

  // ---- A4. 章节呼吸位 ----
  const breath = await page.evaluate(() => {
    const secs = Array.from(document.querySelectorAll('.guide-content > .gc-section, .gc-section'));
    const uniq = Array.from(new Set(secs));
    const token = getComputedStyle(document.documentElement).getPropertyValue('--section-breath').trim();
    const rows = uniq.map((s, i) => {
      const cs = getComputedStyle(s);
      const af = getComputedStyle(s, '::after');
      return { i, tag: s.tagName + '.' + (s.className.split(' ')[1] || ''), mb: cs.marginBottom, is3n: (i + 1) % 3 === 0, afterBg: af.backgroundColor, afterOpacity: af.opacity };
    });
    return { count: uniq.length, token, rows };
  });
  rec('breath.13 sections present', breath.count === 13, { count: breath.count });
  rec('breath.token defined', /clamp/.test(breath.token), breath.token);
  const mbPx = (v) => parseFloat(v);
  const breathOk = breath.rows.filter((r) => r.is3n).every((r) => Math.abs(mbPx(r.mb) - 96) < 2) && breath.rows.filter((r) => !r.is3n).every((r) => Math.abs(mbPx(r.mb) - 44) < 2);
  rec('breath.margin 3n≈96px others≈44px', breathOk, breath.rows.map((r) => `${r.i + 1}:${r.mb}`).join(' '));
  rec('breath.hairline ::after on 3n only', breath.rows.filter((r) => r.is3n).every((r) => r.afterBg !== 'rgba(0, 0, 0, 0)') && breath.rows.filter((r) => !r.is3n).every((r) => r.afterBg === 'rgba(0, 0, 0, 0)'), breath.rows.filter((r) => r.is3n).map((r) => r.afterBg));

  // 发丝线颜色 = --line-2（亮轨 #D8CFC0）
  const lineLight = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.gc-section'))[2];
    const af = getComputedStyle(el, '::after');
    const token = getComputedStyle(el).getPropertyValue('--line-2').trim();
    return { afterBg: af.backgroundColor, token, opacity: af.opacity };
  });
  rec('breath.line color == --line-2 (light #D8CFC0)', lineLight.afterBg === 'rgb(216, 207, 192)', lineLight);

  // ---- A5. 锚点导航定位（呼吸 margin 不得破坏定位） ----
  const anchor = await page.evaluate(async () => {
    const nav = document.querySelector('.guide-nav');
    if (!nav) return { nav: false };
    const items = Array.from(nav.querySelectorAll('.guide-nav-item'));
    const idxs = [2, 5, 6, 9, 12];
    const out = [];
    for (const i of idxs) {
      const a = items[i];
      if (!a) continue;
      a.click();
      await new Promise((r) => setTimeout(r, 900));
      const t = document.getElementById(a.getAttribute('href').slice(1));
      const navH = nav.getBoundingClientRect().height + 16;
      out.push({ i: i + 1, label: a.textContent.trim(), top: +(t.getBoundingClientRect().top - navH).toFixed(1) });
    }
    return { nav: true, out, navH: nav.getBoundingClientRect().height + 16 };
  });
  if (anchor.nav) {
    const maxErr = Math.max(...anchor.out.map((o) => Math.abs(o.top)));
    rec('anchor.3n-era nav click lands within ±4px of nav offset', maxErr <= 4, { maxErr, samples: anchor.out });
  } else {
    rec('anchor.nav exists', false, 'guide-nav missing');
  }

  // ---- A6. 预算数字滚动 ----
  const budget0 = await page.evaluate(() => {
    const box = document.querySelector('.budget-box');
    if (!box) return { box: false };
    const spans = Array.from(box.querySelectorAll('.budget-num'));
    return { box: true, initialTexts: spans.map((s) => s.textContent), minWidths: spans.map((s) => s.style.minWidth), hosts: Array.from(box.querySelectorAll('.budget-total, .bi-val')).map((h) => h.textContent.trim()).slice(0, 12) };
  });
  rec('budget.spans pre-wrapped with min-width', budget0.box && budget0.initialTexts.length > 0 && budget0.minWidths.every((w) => w && w !== '0px'), { n: budget0.initialTexts && budget0.initialTexts.length, minWidths: budget0.minWidths });

  // 滚动进视口 → 动画发生（中间帧 ≠ 终值）→ 终值回到原文
  await page.evaluate(() => { const b = document.querySelector('.budget-box'); b.scrollIntoView({ block: 'center' }); });
  const midShot = await page.evaluate(() => new Promise((res) => setTimeout(() => {
    const spans = Array.from(document.querySelectorAll('.budget-box .budget-num'));
    res({ midTexts: spans.map((s) => s.textContent), boxW: document.querySelector('.budget-box').getBoundingClientRect().width });
  }, 250)));
  await page.waitForTimeout(900);
  const budget1 = await page.evaluate(() => {
    const box = document.querySelector('.budget-box');
    const spans = Array.from(box.querySelectorAll('.budget-num'));
    return { finalTexts: spans.map((s) => s.textContent), targets: spans.map((s) => s.dataset.target), grouped: spans.map((s) => s.dataset.grouped), boxW: box.getBoundingClientRect().width, hostTexts: Array.from(box.querySelectorAll('.budget-total, .bi-val')).map((h) => h.textContent.trim()).slice(0, 12) };
  });
  const animated = midShot.midTexts.some((t, i) => t !== budget1.finalTexts[i]);
  rec('budget.animation actually ran (mid≠final)', animated, { mid: midShot.midTexts.slice(0, 6), final: budget1.finalTexts.slice(0, 6) });
  const finalOk = budget1.finalTexts.every((t, i) => t === budget0.initialTexts[i]);
  rec('budget.final text == pre-animation token', finalOk, { final: budget1.finalTexts, init: budget0.initialTexts });
  const noShift = Math.abs(midShot.boxW - budget1.boxW) < 1;
  rec('budget.no layout shift during animation (box width stable)', noShift, { midW: midShot.boxW, endW: budget1.boxW });

  // 年份不被误滚：终值文本里不应出现 .budget-num 包裹的 4 位年份紧跟「年」
  const yearCheck = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.budget-box .budget-total, .budget-box .bi-val').forEach((h) => {
      h.childNodes.forEach((n) => {
        if (n.nodeType === 1 && n.classList.contains('budget-num') && /^\d{4}$/.test(n.textContent)) {
          const nx = n.nextSibling;
          if (nx && nx.nodeType === 3 && nx.textContent.startsWith('年')) bad.push(n.textContent);
        }
      });
    });
    const rangeSpans = Array.from(document.querySelectorAll('.budget-box .budget-num')).filter((s) => /^(1900|2100|3000|5000)$/.test(s.textContent)).length;
    return { badYearSpans: bad, rangeLikeSpans: rangeSpans };
  });
  rec('budget.year-like numbers NOT animated', yearCheck.badYearSpans.length === 0, yearCheck);

  // XSS 注入面：host 重建只用 textNode/无 innerHTML —— 静态核查（代码审查）已在报告中记录
  const xssProbe = await page.evaluate(() => {
    // 构造一个含 HTML 字符样式的金额文本？预算值来自数据层（数字/字符串），此处验证重建后无元素注入
    const box = document.querySelector('.budget-box');
    return { unexpectedTags: Array.from(box.querySelectorAll('.budget-total span:not(.budget-num), .bi-val span:not(.budget-num)')).length };
  });
  rec('budget.rebuild only .budget-num spans (no other tags)', xssProbe.unexpectedTags === 0, xssProbe);

  // ---- A7. 截图（结果页 light 1440） ----
  await page.screenshot({ path: path.join(OUT, 'result-1440-light-full.png'), fullPage: true });

  // 亮→暗：呼吸线/危险色令牌
  await ctxA.close();
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const pageD = await ctxD.newPage();
  pageD.on('console', (m) => { if (m.type() === 'error') consoleErrors.push({ page: 'A-dark', text: m.text().slice(0, 300) }); });
  pageD.on('pageerror', (e) => consoleErrors.push({ page: 'A-dark', pageerror: String(e).slice(0, 300) }));
  await pageD.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((b) => u.includes(b))) return route.abort();
    return route.continue();
  });
  await pageD.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await pageD.waitForSelector('.gc-section', { timeout: 60000 });
  await pageD.waitForTimeout(1200);
  const lineDark = await pageD.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.gc-section'))[2];
    const af = getComputedStyle(el, '::after');
    return { afterBg: af.backgroundColor, token: getComputedStyle(el).getPropertyValue('--line-2').trim() };
  });
  rec('breath.line color == --line-2 (dark #7A6F5E)', lineDark.afterBg === 'rgb(122, 111, 94)', lineDark);
  await pageD.screenshot({ path: path.join(OUT, 'result-1440-dark-full.png'), fullPage: true });

  // 暗色下 hint 危险色
  await pageD.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pageD.waitForTimeout(600);
  await pageD.fill('#cityInput', '一'.repeat(25));
  await pageD.waitForTimeout(650);
  const dangerDark = await pageD.evaluate(() => {
    const el = document.getElementById('cityInputHint');
    return { color: getComputedStyle(el).color, token: getComputedStyle(el).getPropertyValue('--danger').trim() };
  });
  rec('hint.danger color == --danger dark #F08A7A', dangerDark.color === 'rgb(240, 138, 122)', dangerDark);
  await ctxD.close();

  // ================= 阶段 B：reduced-motion =================
  const ctxR = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const pageR = await ctxR.newPage();
  pageR.on('pageerror', (e) => consoleErrors.push({ page: 'B-reduce', pageerror: String(e).slice(0, 300) }));
  await pageR.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((b) => u.includes(b))) return route.abort();
    return route.continue();
  });
  await pageR.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pageR.waitForTimeout(600);
  await pageR.evaluate(() => window.scrollTo(0, 500));
  await pageR.waitForTimeout(300);
  const rmParallax = await pageR.evaluate(() => {
    const a = document.querySelector('.hero-aside');
    return { varSet: a.style.getPropertyValue('--hero-parallax') };
  });
  rec('reduced-motion.parallax disabled', rmParallax.varSet === '', rmParallax);
  await pageR.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await pageR.waitForSelector('.gc-section', { timeout: 60000 });
  await pageR.evaluate(() => { const b = document.querySelector('.budget-box'); if (b) b.scrollIntoView({ block: 'center' }); });
  await pageR.waitForTimeout(800);
  const rmBudget = await pageR.evaluate(() => {
    const spans = document.querySelectorAll('.budget-box .budget-num');
    const first = document.querySelector('.gc-section');
    const op = first ? getComputedStyle(first).opacity : null;
    return { spanCount: spans.length, firstSectionOpacity: op };
  });
  rec('reduced-motion.budget static (no .budget-num)', rmBudget.spanCount === 0, rmBudget);
  rec('reduced-motion.sections visible (no stuck opacity)', rmBudget.firstSectionOpacity === '1', rmBudget);
  await ctxR.close();

  // ================= 阶段 C：移动端 375 阅读流 + ≤480 呼吸收缩 =================
  const ctxM = await browser.newContext({ viewport: { width: 375, height: 667 }, colorScheme: 'light' });
  const pageM = await ctxM.newPage();
  pageM.on('console', (m) => { if (m.type() === 'error') consoleErrors.push({ page: 'C-mobile', text: m.text().slice(0, 300) }); });
  pageM.on('pageerror', (e) => consoleErrors.push({ page: 'C-mobile', pageerror: String(e).slice(0, 300) }));
  pageM.on('pageerror', (e) => consoleErrors.push({ page: 'C-mobile', pageerror: String(e).slice(0, 300) }));
  await pageM.route('**/*', (route) => {
    const u = route.request().url();
    if (BLOCKED.some((b) => u.includes(b))) return route.abort();
    return route.continue();
  });
  await pageM.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pageM.waitForTimeout(800);
  const mobOrder = await pageM.evaluate(() => {
    const r = (sel) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, order: getComputedStyle(el).order }; };
    return {
      title: r('.hero-title'), aside: r('.hero-aside'), card: r('.search-card'),
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });
  rec('mobile.reading-flow 标题→立轴→表单', mobOrder.title && mobOrder.aside && mobOrder.card && mobOrder.title.bottom <= mobOrder.aside.top + 2 && mobOrder.aside.bottom <= mobOrder.card.top + 2, mobOrder);
  rec('mobile.no horizontal overflow (home ≤375)', mobOrder.overflow <= 1, { overflowPx: mobOrder.overflow });
  await pageM.goto(BASE + '?city=' + encodeURIComponent('成都'), { waitUntil: 'domcontentloaded' });
  await pageM.waitForSelector('.gc-section', { timeout: 60000 });
  await pageM.waitForTimeout(1000);
  const mobBreath = await pageM.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.gc-section'))[2];
    return { mb: getComputedStyle(el).marginBottom, overflow: document.documentElement.scrollWidth - window.innerWidth };
  });
  rec('mobile.breath shrunk ≤480 (~64px)', Math.abs(parseFloat(mobBreath.mb) - 64) < 2, mobBreath);
  rec('mobile.no horizontal overflow (result ≤375)', mobBreath.overflow <= 1, { overflowPx: mobBreath.overflow });
  await ctxM.close();

  await browser.close();

  // ================= 汇总 =================
  const pass = results.filter((r) => r.pass).length;
  const summary = { total: results.length, pass, fail: results.length - pass, results, consoleErrors };
  fs.writeFileSync(path.join(OUT, 'r3-qa-report.json'), JSON.stringify(summary, null, 2));
  console.log(`\n==== SUMMARY: ${pass}/${results.length} PASS ====${consoleErrors.length ? '\nconsole errors: ' + consoleErrors.length : ' (no console errors)'}`);
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
