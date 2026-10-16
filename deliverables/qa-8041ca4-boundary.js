// QA 边界用例：weatherSync（CommonJS，直接 require + __setAxiosForTest）
const assert = require('assert');
const path = require('path');

// ── 用例 A：weather/3d 失败但 weather/now 成功 → 应整体降级为 simulated（不抛错、不返回半残 qweather 数据）
(async () => {
  process.env.QWEATHER_API_KEY = 'k-test';
  const ws = require(path.resolve('D:/xm/wz/travel-guide/backend/services/weatherSync.js'));
  const calls = [];
  const mock = {
    get: async (url) => {
      calls.push(url);
      if (url.includes('/geo/')) return { data: { code: '200', location: [{ id: 'X1' }] } };
      if (url.includes('/weather/now')) return { data: { code: '200', now: { temp: '20', feelsLike: '18', text: '晴', humidity: '50', windDir: '东', windScale: '2', vis: '10', pressure: '1010' } } };
      if (url.includes('/weather/3d')) throw new Error('3d timeout');
      return { data: {} };
    },
    post: async () => ({ data: {} })
  };
  ws.__setAxiosForTest(mock);
  ws.clearWeatherCache();
  const r = await ws.getCityWeather('成都');
  assert.strictEqual(r.source, 'simulated', '3d 失败应整体降级 simulated');
  assert.strictEqual(r.current.temp.endsWith('°C'), true);
  console.log('CASE-A weather3d-fail-degrades: PASS, source=' + r.source);

  // ── 用例 B：QWEATHER_API_URL 显式配置时旧语义（原样使用，不重复拼接版本段）
  calls.length = 0;
  ws.clearWeatherCache();
  await ws.getRealWeather('成都');
  assert.ok(calls.length >= 2, '应有 now/3d 请求');
  // 当前模块加载时 env 未设 QWEATHER_API_URL → 默认 host + v7；此用例断言默认拼接无双重版本段
  assert.ok(calls[1].includes('/v7/weather/now'), 'now 应走 /v7/weather/now: ' + calls[1]);
  assert.ok(!calls[1].includes('/v7/v7'), '不应出现双重版本段');
  console.log('CASE-B default-url-no-double-version: PASS, now=' + calls[1]);

  // ── 用例 C：key 为空字符串时不附加空 key 参数（经 getRealWeather 全链路捕获 params）
  process.env.QWEATHER_API_KEY = '';
  const capturedParams = [];
  const mockC = {
    get: async (url, cfg) => {
      capturedParams.push({ url, params: cfg && cfg.params });
      if (url.includes('/geo/')) return { data: { code: '200', location: [{ id: 'X1' }] } };
      if (url.includes('/weather/now')) return { data: { code: '200', now: { temp: '20', feelsLike: '18', text: '晴', humidity: '50', windDir: '东', windScale: '2', vis: '10', pressure: '1010' } } };
      if (url.includes('/weather/3d')) return { data: { daily: [] } };
      return { data: {} };
    },
    post: async () => ({ data: {} })
  };
  ws.__setAxiosForTest(mockC);
  ws.clearWeatherCache();
  const rc = await ws.getRealWeather('成都');
  assert.strictEqual(rc && rc.source, 'qweather');
  assert.strictEqual(capturedParams.length, 3, '应有 3 次请求');
  for (const c of capturedParams) {
    assert.strictEqual('key' in c.params, false, '空字符串 key 不应附加到 ' + c.url);
  }
  console.log('CASE-C empty-key-not-attached: PASS (' + capturedParams.length + ' requests, no key param)');

  // ── 用例 D：QWEATHER_API_VERSION=v9 → URL 正确拼接（v9/weather/now）
  // 版本段在模块加载时读取，需以子进程方式验证（主进程 v7 已加载）
  const { execFileSync } = require('child_process');
  const nodeExe = process.execPath;
  const out = execFileSync(nodeExe, ['-e', `
    const path = require('path');
    process.env.QWEATHER_API_VERSION = 'v9';
    delete process.env.QWEATHER_API_URL;
    const ws = require('D:/xm/wz/travel-guide/backend/services/weatherSync.js');
    const calls = [];
    ws.__setAxiosForTest({
      get: async (url) => {
        calls.push(url);
        if (url.includes('/geo/')) return { data: { code: '200', location: [{ id: 'X1' }] } };
        if (url.includes('/weather/now')) return { data: { code: '200', now: { temp: '20', feelsLike: '18', text: '晴', humidity: '50', windDir: '东', windScale: '2', vis: '10', pressure: '1010' } } };
        if (url.includes('/weather/3d')) return { data: { daily: [] } };
        return { data: {} };
      },
      post: async () => ({ data: {} })
    });
    ws.getRealWeather('成都').then(r => {
      console.log(JSON.stringify({ ok: r && r.source === 'qweather', now: calls[1], fc: calls[2] }));
    }).catch(e => console.log(JSON.stringify({ ok: false, err: e.message })));
  `], { encoding: 'utf8', env: { ...process.env } });
  const d = JSON.parse(out.trim());
  assert.strictEqual(d.ok, true, 'v9 版本段拼接失败: ' + out);
  assert.ok(d.now.includes('/v9/weather/now'), 'now 应走 /v9/weather/now: ' + d.now);
  assert.ok(d.fc.includes('/v9/weather/3d'), '3d 应走 /v9/weather/3d: ' + d.fc);
  console.log('CASE-D version-v9: PASS, now=' + d.now);

  // ── 用例 E：显式 QWEATHER_API_URL（含版本段）语义不变 —— 子进程验证不重复拼接
  const out2 = execFileSync(nodeExe, ['-e', `
    process.env.QWEATHER_API_URL = 'https://example.re.qweatherapi.com/v7';
    delete process.env.QWEATHER_API_VERSION;
    const ws = require('D:/xm/wz/travel-guide/backend/services/weatherSync.js');
    const calls = [];
    ws.__setAxiosForTest({
      get: async (url) => {
        calls.push(url);
        if (url.includes('/geo/')) return { data: { code: '200', location: [{ id: 'X1' }] } };
        if (url.includes('/weather/now')) return { data: { code: '200', now: { temp: '20', feelsLike: '18', text: '晴', humidity: '50', windDir: '东', windScale: '2', vis: '10', pressure: '1010' } } };
        if (url.includes('/weather/3d')) return { data: { daily: [] } };
        return { data: {} };
      },
      post: async () => ({ data: {} })
    });
    ws.getRealWeather('成都').then(r => console.log(JSON.stringify({ ok: !!r, now: calls[1] }))).catch(e => console.log(JSON.stringify({ ok: false, err: e.message })));
  `], { encoding: 'utf8', env: { ...process.env } });
  const d2 = JSON.parse(out2.trim());
  assert.strictEqual(d2.ok, true);
  assert.strictEqual(d2.now, 'https://example.re.qweatherapi.com/v7/weather/now', '显式 URL 应原样使用: ' + d2.now);
  console.log('CASE-E explicit-url-unchanged: PASS, now=' + d2.now);

  console.log('ALL BOUNDARY CASES PASSED');
})().catch(e => { console.error('BOUNDARY FAILED:', e.message); process.exit(1); });
