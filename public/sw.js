// Simple Service Worker for PWA installability
const CACHE_NAME = 'kash-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/kash-icon.png',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});
