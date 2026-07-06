// Service Worker for 行纪 XING JI
const CACHE_VERSION = 'v10.5';
const CACHE_NAME = `xingji-${CACHE_VERSION}`;
const STATIC_CACHE = `xingji-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `xingji-runtime-${CACHE_VERSION}`;

// 预缓存的核心资源（仅本地静态资源，避免缓存失败导致 SW 安装失败）
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/data/expandedCities.js',
    '/icon.svg',
    '/offline.html'
];

// 安装：预缓存核心资源（失败容忍，单文件失败不阻断安装）
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                return Promise.allSettled(
                    CORE_ASSETS.map(url =>
                        cache.add(url).catch(err => {
                            console.warn('[SW] 缓存失败:', url, err.message);
                        })
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// 激活：清理旧缓存并接管客户端
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (![STATIC_CACHE, RUNTIME_CACHE].includes(cacheName)) {
                        console.log('[SW] 清理旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 请求拦截：分层缓存策略
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // 仅处理 GET 请求
    if (request.method !== 'GET') return;

    // 同源资源：缓存优先（stale-while-revalidate）
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then(cached => {
                const fetchPromise = fetch(request)
                    .then(response => {
                        // 仅缓存有效响应
                        if (!response || response.status !== 200 || response.type === 'opaque') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE).then(cache => {
                            cache.put(request, responseToCache);
                        });
                        return response;
                    })
                    .catch(() => {
                        // 网络失败：文档请求回退到离线页
                        if (request.destination === 'document') {
                            return caches.match('/offline.html')
                                .then(offline => offline || caches.match('/index.html'));
                        }
                        // 其他资源返回缓存（如有）
                        return cached;
                    });

                return cached || fetchPromise;
            })
        );
        return;
    }

    // 跨域请求（如 Google Fonts、html2canvas CDN）：网络优先，失败回退缓存
    if (url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('html2canvas.hertzen.com')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (!response || response.status !== 200) return response;
                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(request, responseToCache);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
    }
});

// 消息通信：接收前端刷新指令
self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
