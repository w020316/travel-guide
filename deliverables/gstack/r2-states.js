/**
 * 行纪 Xing Ji · R2 三态检查（加载 / 空 / 错误）
 * ------------------------------------------------------------
 * 阶段三要求检查「加载状态、空数据状态、错误状态的正确展示」。
 * 本脚本用真实交互触发三种状态并截图，同时检查：
 *   - 加载态是否可取消、文案是否分阶段
 *   - 空态是否显示引导而非空白
 *   - 错误态是否给出可理解的提示且可重试
 *
 * 用法：node deliverables/gstack/r2-states.js
 */
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3001/';
const OUT = path.join(__dirname, 'screenshots', 'states-r2');
const BLOCKED = ['fonts.googleapis.com', 'fonts.gstatic.com', 'html2canvas.hertzen.com'];

async function newPage(browser, scheme) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: scheme
  });
  await ctx.route('**/*', (route) => {
    const url = route.request().url();
    if (BLOCKED.some((h) => url.includes(h))) return route.abort('failed');
    return route.continue();
  });
  const page = await ctx.newPage();
  return { ctx, page };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const findings = [];

  for (const scheme of ['light', 'dark']) {
    // ---------- 1. 加载态：拦截 AI 请求使其挂起，观察加载层 ----------
    {
      const { ctx, page } = await newPage(browser, scheme);
      // 让 AI 请求挂起 20s，模拟慢网络
      await page.route('**/api/ai/generate', async () => { /* 永不 fulfill */ });
      await page.goto(BASE, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(600);

      const input = await page.$('#cityInput, input[type="search"], input[placeholder*="城市"]');
      if (input) await input.fill('成都');
      const btn = await page.$('#generateBtn, form button[type="submit"], button:has-text("生成攻略")');
      if (btn) await btn.click();
      await page.waitForTimeout(1200);

      const state = await page.evaluate(() => {
        const loading = document.querySelector('.loading, #loading, [class*="loading"]');
        const cancel = document.querySelector('#loadingCancel, .loading-cancel, [class*="cancel"]');
        const sub = document.querySelector('.loading-sub, [class*="loading-sub"]');
        const visible = loading ? !loading.hidden && getComputedStyle(loading).display !== 'none' : false;
        return {
          loadingVisible: visible,
          cancelVisible: cancel ? getComputedStyle(cancel).display !== 'none' : false,
          subText: sub ? sub.textContent.trim().slice(0, 40) : null,
          bodyOverflow: Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)
        };
      });
      await page.screenshot({ path: path.join(OUT, `loading-${scheme}.png`) });
      findings.push({ scheme, state: 'loading', ...state });
      await ctx.close();
    }

    // ---------- 2. 空态：收藏为空 ----------
    {
      const { ctx, page } = await newPage(browser, scheme);
      await page.goto(BASE, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(600);
      await page.evaluate(() => { try { localStorage.removeItem('xingji_favorites'); localStorage.clear(); } catch (_) {} });
      await page.reload({ waitUntil: 'load' });
      await page.waitForTimeout(600);

      const favBtn = await page.$('#favoritesBtn, [class*="fav"], button:has-text("收藏")');
      if (favBtn) await favBtn.click();
      await page.waitForTimeout(700);

      const state = await page.evaluate(() => {
        const modal = document.querySelector('.modal, [class*="modal"], [class*="favorites"]');
        const empty = document.querySelector('[class*="empty"], .empty-guide, [class*="no-data"]');
        return {
          modalVisible: modal ? getComputedStyle(modal).display !== 'none' : false,
          emptyText: empty ? empty.textContent.trim().slice(0, 60) : null,
          emptyVisible: empty ? getComputedStyle(empty).display !== 'none' : false
        };
      });
      await page.screenshot({ path: path.join(OUT, `empty-${scheme}.png`) });
      findings.push({ scheme, state: 'empty', ...state });
      await ctx.close();
    }

    // ---------- 3. 错误态：AI 返回 500 ----------
    {
      const { ctx, page } = await newPage(browser, scheme);
      await page.route('**/api/ai/generate', (route) =>
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, error: '内部错误' }) })
      );
      await page.goto(BASE, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(600);

      const input = await page.$('#cityInput, input[type="search"], input[placeholder*="城市"]');
      if (input) await input.fill('成都');
      const btn = await page.$('#generateBtn, form button[type="submit"], button:has-text("生成攻略")');
      if (btn) await btn.click();
      await page.waitForTimeout(2500);

      const state = await page.evaluate(() => {
        const toast = document.querySelector('.toast, [class*="toast"]');
        const result = document.querySelector('#resultPage, [class*="result"]');
        return {
          toastText: toast ? toast.textContent.trim().slice(0, 60) : null,
          toastVisible: toast ? getComputedStyle(toast).opacity !== '0' : false,
          // 关键：错误后是否仍能给出可用内容（本地降级）
          resultRendered: result ? !result.hidden : false,
          hasGuideContent: !!document.querySelector('.guide, [class*="guide"], .poster, [class*="poster"]')
        };
      });
      await page.screenshot({ path: path.join(OUT, `error-${scheme}.png`) });
      findings.push({ scheme, state: 'error', ...state });
      await ctx.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'states.json'), JSON.stringify(findings, null, 2), 'utf8');

  console.log('主题   状态     关键观测');
  for (const f of findings) {
    const detail =
      f.state === 'loading' ? `加载层:${f.loadingVisible ? 'Y' : 'N'} 取消:${f.cancelVisible ? 'Y' : 'N'} 文案:"${f.subText || '-'}"`
      : f.state === 'empty' ? `弹窗:${f.modalVisible ? 'Y' : 'N'} 空态:${f.emptyVisible ? 'Y' : 'N'} 文案:"${f.emptyText || '-'}"`
      : `Toast:"${f.toastText || '-'}" 结果页:${f.resultRendered ? 'Y' : 'N'} 有内容:${f.hasGuideContent ? 'Y' : 'N'}`;
    console.log(`${f.scheme.padEnd(6)} ${f.state.padEnd(8)} ${detail}`);
  }
  console.log('\n输出:', OUT);
})();
