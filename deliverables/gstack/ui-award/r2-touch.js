const { chromium } = require('playwright-core');
const BASE = 'http://127.0.0.1:3001/index.html';
const SEL = 'a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
const probe = (SEL) => {
  const out = [];
  document.querySelectorAll(SEL).forEach(el => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.width < 48 || r.height < 48) out.push({ tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.className||'').toString().split(' ')[0].slice(0,20), w: Math.round(r.width), h: Math.round(r.height), txt: (el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,10) });
  });
  return out;
};
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  for (const w of [768, 414, 375]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(1800);
    const home = await p.evaluate(probe, SEL);
    await p.fill('#cityInput', '成都'); await p.click('#generateBtn');
    try { await p.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch(e){}
    await p.waitForTimeout(1200);
    const res = await p.evaluate(probe, SEL);
    console.log(`\n### ${w}px  首页欠尺寸 ${home.length} / 结果页欠尺寸 ${res.length}`);
    if (home.length) console.log('  首页:', JSON.stringify(home.slice(0,10)));
    if (res.length) console.log('  结果页:', JSON.stringify(res.slice(0,10)));
    await c.close();
  }
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
