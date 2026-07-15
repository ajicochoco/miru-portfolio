const CACHE_NAME = 'miru-portfolio-v1';

const ASSETS = [
  './',
  'index.html',
  'price.html',
  'terms.html',
  'privacy.html',
  'tokushoho.html',
  'thanks.html',
  'manifest.json',
  'css/style.css',
  'js/main.js',
  'images/hero.jpg',
  'images/about.jpg',
  'images/work1.jpg',
  'images/work2.jpg',
  'images/work3.jpg',
  'images/work4.jpg',
  'images/work5.jpg',
  'images/work6.jpg',
  'images/furniture.png',
  'images/furniture2.jpg',
  'images/furniture3.jpg',
  'images/furniture4.png',
  'images/furniture5.png',
  'images/furniture6.jpg',
  'images/furniture7.jpg',
  'images/furniture8.png',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// キャッシュ優先＋裏で最新版を取得して更新（オフライン時はキャッシュ、オンライン時は常に最新化）
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
