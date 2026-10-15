/* =========================================================
   行纪 XING JI — 离线页脚本
   ---------------------------------------------------------
   v10.10 修复 P0-2：本文件替代 offline.html 中的两处内联脚本：
     1) <button onclick="location.reload()">  —— 内联事件属性，
        被 helmet 默认的 `script-src-attr 'none'` 拦截，按钮失效；
     2) <script>window.addEventListener('online', ...)</script> —— 内联脚本，
        被 `script-src 'self'` 拦截，网络恢复后无法自动重连。
   外置为同源 .js 后，`script-src 'self'` 一项即可覆盖全部逻辑。
   注意：offline.html 自身不含 CSP meta，故该缺陷只在
   Express/helmet 生产路径暴露，本地静态预览无法复现。
   ========================================================= */

(function () {
    'use strict';

    // 网络恢复后自动重连
    window.addEventListener('online', () => location.reload());

    // 「重新连接」按钮：替代内联 onclick
    const btn = document.getElementById('reconnectBtn');
    if (btn) {
        btn.addEventListener('click', () => location.reload());
    }
})();
