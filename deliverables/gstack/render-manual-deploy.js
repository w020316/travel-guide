/* render-manual-deploy.js — 用持久登录的 Edge 配置（D:\xm\edge-render）打开 Render 控制台，
   对 travel-guide 服务执行「Manual Deploy → Deploy latest commit」。
   背景：Render autoDeploy 偶发未触发（推送后 ~10 分钟无部署记录），需控制台手动兜底。 */
const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'screenshots');

(async () => {
  const ctx = await chromium.launchPersistentContext('D:/xm/edge-render', {
    channel: 'msedge', headless: false, viewport: { width: 1440, height: 900 }
  });
  const p = ctx.pages()[0] || await ctx.newPage();
  try {
    await p.goto('https://dashboard.render.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(4000);
    console.log('URL after open:', p.url());
    if (/login|signin/i.test(p.url())) throw new Error('登录态失效：' + p.url());

    // 找 travel-guide 服务卡片/链接
    let link = p.locator('a[href*="/web/srv-"]').filter({ hasText: 'travel-guide' }).first();
    if (!(await link.count())) {
      link = p.getByText('travel-guide', { exact: false }).first();
    }
    await link.click({ timeout: 15000 });
    await p.waitForTimeout(4500);
    console.log('service url:', p.url());
    await p.screenshot({ path: path.join(OUT, 'render-service.png') });

    // Manual Deploy 按钮
    const md = p.getByRole('button', { name: /Manual Deploy/i }).first();
    await md.click({ timeout: 15000 });
    await p.waitForTimeout(1200);
    // 菜单项：Deploy latest commit
    const item = p.getByText(/Deploy latest commit/i).first();
    await item.click({ timeout: 10000 });
    await p.waitForTimeout(3500);
    await p.screenshot({ path: path.join(OUT, 'render-deploy-triggered.png'), fullPage: false });
    console.log('MANUAL_DEPLOY_TRIGGERED ok, url=', p.url());
    await p.waitForTimeout(4000);
    await p.screenshot({ path: path.join(OUT, 'render-deploy-status.png') });
  } finally {
    await ctx.close();
  }
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
