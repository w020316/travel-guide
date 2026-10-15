/* =========================================================
   行纪 XING JI — PWA 注册与网络状态提示
   ---------------------------------------------------------
   v10.10 修复 P0-2：本文件由 index.html 底部的内联 <script> 外置而来。
   原因：helmet 下发的 CSP 为 `script-src 'self' https://html2canvas.hertzen.com`
   （不含 'unsafe-inline' / nonce），内联脚本会被浏览器直接拦截，
   导致 Service Worker 从未注册、离线能力整体失效。
   外置为同源 .js 后，`script-src 'self'` 一项即可覆盖，无需放宽 CSP。
   加载方式：index.html 中 <script src="pwa.js" defer>，晚于 app.js 执行，
   因此可安全使用 app.js 挂载的 window.__toast。
   ========================================================= */

(function () {
    'use strict';

    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('[PWA] Service Worker 已注册:', reg.scope);

                // 监听新版本就绪，提示用户刷新
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            if (window.__toast) {
                                window.__toast('发现新版本，刷新以更新', {
                                    action: '刷新',
                                    onAction: () => location.reload()
                                });
                            }
                        }
                    });
                });
            })
            .catch(err => console.warn('[PWA] SW 注册失败:', err));
    });

    // 网络状态提示
    window.addEventListener('online', () => {
        if (window.__toast) window.__toast('网络已恢复');
    });
    window.addEventListener('offline', () => {
        if (window.__toast) {
            window.__toast('当前处于离线状态，仅可访问已缓存内容', { duration: 4000 });
        }
    });
})();
