const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true });
  const p = await (await b.newContext()).newPage();
  await p.goto('http://127.0.0.1:3001/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const mk = (fs) => {
      const s = document.createElement('span');
      s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:"Noto Serif SC",serif;font-size:64px;' + fs;
      s.textContent = '城，写一份「值得」出发。';
      document.body.appendChild(s);
      const w = s.getBoundingClientRect().width;
      s.remove();
      return Math.round(w * 100) / 100;
    };
    return { normal: mk(''), palt: mk('font-feature-settings:"palt" 1;') };
  });
  console.log(JSON.stringify(r), '| delta px:', (r.normal - r.palt).toFixed(2), '| palt生效:', r.palt < r.normal);
  await b.close();
})();
