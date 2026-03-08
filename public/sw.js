// Service Worker: clears all caches and unregisters to prevent white screen issues
self.addEventListener('install', (event) => {
    // Activate immediately, don't wait
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Delete ALL old caches
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('[SW] Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            // Unregister this service worker so it stops intercepting
            console.log('[SW] All caches cleared, unregistering...');
            return self.registration.unregister();
        })
    );
});

// Do NOT intercept fetch requests - let everything go straight to the network
