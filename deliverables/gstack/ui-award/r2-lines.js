const { chromium } = require('playwright-core');
const BASE = 'http://127.0.0.1:3001/index.html';
const collect = () => {
  const el = document.querySelector('.hero-title');
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const chars = [];
  let n;
  while ((n = walker.nextNode())) {
    for (let i = 0; i < n.data.length; i++) {
      const ch = n.data[i]; if (!ch.trim()) continue;
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
      const b = r.getBoundingClientRect();
      if (b.width === 0) continue;
      chars.push({ ch, top: Math.round(b.top), left: Math.round(b.left), right: Math.round(b.right) });
    }
  }
  const lines = {};
  chars.forEach(c => { (lines[c.top] = lines[c.top] || []).push(c); });
  return Object.keys(lines).sort((a, b) => a - b).map(t => {
    const arr = lines[t].sort((a, b) => a.left - b.left);
    return arr.map(c => c.ch).join('');
  });
};
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  for (const w of [375, 414]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(2400);
    const base = await p.evaluate(collect);
    const tw = await p.evaluate(() => getComputedStyle(document.querySelector('.hero-title')).textWrap);
    // 变体：隐藏 br
    await p.addStyleTag({ content: '.hero-title br{display:none}' });
    await p.waitForTimeout(200);
    const noBr = await p.evaluate(collect);
    console.log(`${w}px  text-wrap=${tw}`);
    console.log('  当前   :', JSON.stringify(base));
    console.log('  去<br> :', JSON.stringify(noBr));
    await c.close();
  }
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
