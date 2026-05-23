self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          return caches.delete(cache);
        })
      );
    }).then(() => {
      self.registration.unregister();
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Do nothing. Let the browser handle the fetch normally.
});
