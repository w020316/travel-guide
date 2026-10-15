// 第二轮迭代验证：标题层级顺序 + 工具栏主次区分
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3001/', { waitUntil: 'load' });
  await page.waitForTimeout(800);

  const r = await page.evaluate(() => {
    // 解开结果页隐藏，注入一段模拟攻略内容以检验标题层级
    const rp = document.getElementById('resultPage');
    rp.hidden = false;
    document.getElementById('guideContent').innerHTML =
      '<div class="gc-head"><h2>成都·慢生活之旅</h2></div>';

    // 按 DOM 顺序收集所有标题
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
      .filter(h => h.offsetParent !== null)
      .map(h => ({ tag: h.tagName, text: (h.textContent || '').trim().slice(0, 20) }));

    const btn = document.getElementById('downloadPosterBtn');
    const normal = document.getElementById('copyTextBtn');
    const cs = el => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, color: s.color, weight: s.fontWeight };
    };

    const out = {
      headingsInResultPage: headings,
      primaryBtn: cs(btn),
      normalBtn: cs(normal),
      primaryDistinct: getComputedStyle(btn).backgroundColor !== getComputedStyle(normal).backgroundColor
    };
    rp.hidden = true;
    return out;
  });

  // 校验标题顺序：h1 必须出现在 h2 之前
  const seq = r.headingsInResultPage.map(h => Number(h.tag[1]));
  let orderOk = true;
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] > seq[i - 1] + 1) { orderOk = false; break; }
  }

  console.log(JSON.stringify({
    ...r,
    headingLevels: seq,
    headingOrderOk: orderOk
  }, null, 2));

  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
