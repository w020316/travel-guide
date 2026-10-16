// QA 验证 8041ca4 前端分支：服务端 simulated / 服务端 qweather 两种 currentWeather
// 通过 Playwright route 拦截绕开 3997→3001 的 CSP/端口问题（仅测前端渲染逻辑）
const { chromium } = require('D:/dev-tools/npm-global/node_modules/@playwright/cli/node_modules/playwright');

const SERVER_PAYLOAD = JSON.parse(require('fs').readFileSync('D:/xm/wz/travel-guide/deliverables/qa-8041ca4-generate.json', 'utf8'));

function qweatherPayload() {
  const p = JSON.parse(JSON.stringify(SERVER_PAYLOAD));
  p.data.currentWeather = {
    city: '成都', source: 'qweather',
    current: { temp: '18°C', feelsLike: '16°C', condition: '阴', humidity: '78%', wind: '北风 3级', visibility: '9公里', pressure: '1015hPa' },
    forecast: [], updateTime: '2026-10-16T11:00:00+08:00'
  };
  return p;
}

function noCurrentWeatherPayload() {
  const p = JSON.parse(JSON.stringify(SERVER_PAYLOAD));
  delete p.data.currentWeather;
  return p;
}

async function runCase(browser, name, payload) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
  await context.route('**/api/ai/generate*', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) }));
  const p = await context.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await p.goto('http://127.0.0.1:3997/', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  await p.click('#cityInput');
  await p.type('#cityInput', '成都', { delay: 20 });
  await p.click('#generateBtn');
  await p.waitForSelector('#resultPage:not([hidden])', { timeout: 60000 });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const badge = document.querySelector('.weather-source');
    return {
      badgeText: badge ? badge.textContent.replace(/\s+/g, ' ').trim() : null,
      badgeClass: badge ? badge.className : null,
      badgeTitle: badge ? badge.getAttribute('title') : null,
      temp: (document.querySelector('.weather-temp') || {}).textContent || null,
      desc: (document.querySelector('.weather-desc') || {}).textContent || null
    };
  });
  await context.close();
  console.log(JSON.stringify({ case: name, ...r, pageErrors: errs }));
}

(async () => {
  const b = await chromium.launch({ channel: 'msedge', args: ['--no-proxy-server'] });
  await runCase(b, 'server-simulated', SERVER_PAYLOAD);
  await runCase(b, 'server-qweather', qweatherPayload());
  await runCase(b, 'no-currentWeather-genWeather-fallback', noCurrentWeatherPayload());
  await b.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
