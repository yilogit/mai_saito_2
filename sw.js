const CACHE_NAME = 'yiloko-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/music.js',
    '/js/time.js',
    '/js/weather.js'
];

// 安装并缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// 拦截请求，确保断网或后台时也能读取缓存
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
