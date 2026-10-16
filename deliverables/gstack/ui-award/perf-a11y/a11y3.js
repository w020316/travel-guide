/* a11y3.js — 徽章变体对比度（结果页）+ 输入框焦点环实测 + 结果页控件文本对比度 */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = 'http://127.0.0.1:3001/index.html';
const OUT = __dirname;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const HELPERS = `
  function srgb(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function lum(r){return 0.2126*srgb(r[0])+0.7152*srgb(r[1])+0.0722*srgb(r[2]);}
  function ratio(a,b){const l1=lum(a),l2=lum(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
  function parse(s){const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x.trim()));return [p[0],p[1],p[2],p[3]===undefined?1:p[3]];}
  function effBg(el){let n=el,bg=[255,255,255];while(n&&n!==document.documentElement){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c[3]>0.6){bg=[c[0],c[1],c[2]];break;}n=n.parentElement;}return bg;}
  function alphaOver(fg,bg){const a=fg[3];return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a)];}
`;
const mk = (body) => new Function('arg', HELPERS + '\n' + body);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-dev-shm-usage'] });
  const R = {};
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  await sleep(2400);

  // 焦点环实测（键盘聚焦城市输入框）
  await page.focus('#cityInput');
  await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); // 触发 :focus-visible
  R.inputFocus = await page.evaluate(() => {
    const el = document.activeElement; const cs = getComputedStyle(el);
    return { id: el.id, outline: cs.outlineStyle + ' ' + cs.outlineWidth, boxShadow: cs.boxShadow, borderColor: cs.borderColor, bg: cs.backgroundColor };
  });

  // 结果页
  await page.fill('#cityInput', '成都');
  await page.click('#generateBtn');
  try { await page.waitForFunction(() => { const r = document.getElementById('resultPage'); return r && !r.hidden; }, { timeout: 45000 }); } catch (e) {}
  await sleep(2500);

  const sels = [
    ['.cc-badge-官方', '徽章·官方'], ['.cc-badge-比价', '徽章·比价'], ['.cc-badge-本地', '徽章·本地'], ['.cc-badge-民宿', '徽章·民宿'],
    ['.cc-badge', '徽章(通用)'],
    ['.compare-card .cc-platform', '比价平台名'],
    ['.gc-map-legend-item', '地图图例(等宽)'],
    ['.icon-btn', '结果工具按钮'], ['.back-btn', '返回按钮'],
    ['.style-pill', '海报风格 pill'], ['.ext-link', '外链(地图/百科)'],
    ['.hc-time', '历史时间(等宽)'], ['.empty-state p', '空状态文本'],
    ['.gc-stat', '统计标签'], ['.budget-item .bi-val', '预算项数值(等宽)'],
    ['.wm-item strong', '天气项数值(等宽)'], ['.ts-time', '时刻(等宽)'],
    ['.route-day-num', '行程天序号'], ['.ac-pros', '住宿优点'], ['.ac-cons', '住宿缺点'],
    ['.ra-note', '备注'], ['.fav-item', '收藏项'],
  ];
  R.contrast = [];
  for (const [sel, label] of sels) {
    const t = await page.evaluate(mk(`
      const { sel } = arg; const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const s = getComputedStyle(el); const bg = effBg(el); const fg = alphaOver(parse(s.color), bg);
      return { sel, ratio: +ratio(fg, bg).toFixed(2), size: parseFloat(s.fontSize), weight: s.fontWeight,
               color: s.color, bg: 'rgb('+bg.map(Math.round).join(',')+')', text:(el.textContent||'').trim().slice(0,12) };
    `), { sel });
    if (!t.missing) { const large = t.size >= 24 || (t.size >= 18.66 && parseInt(t.weight) >= 700); t.need = large?3:4.5; t.pass = t.ratio >= t.need; t.label = label; }
    R.contrast.push(t);
  }

  // 结果页键盘焦点环（抽查 icon-btn / ext-link / style-pill）
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#backBtn'); // 回到首页确保焦点顺序稳定
  await sleep(500);
  await page.click('#navFavoritesBtn'); await sleep(300); await page.keyboard.press('Escape'); await sleep(300);

  await ctx.close();
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'a11y3-report.json'), JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
