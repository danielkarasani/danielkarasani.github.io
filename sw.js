const CACHE_NAME = 'daniel-portfolio-cache-v5';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './index-de.html',
  './index-it.html',
  './about.html',
  './about-de.html',
  './about-it.html',
  './blog.html',
  './blog-de.html',
  './blog-it.html',
  './air-analyzer.html',
  './air-analyzer-de.html',
  './air-analyzer-it.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './blog-posts.json',
  './DanielKarasani-favcon.svg',
  './favicon.ico',
  './images/logo-schaer.webp',
  './images/logo-unibz-engineering.webp',
  './images/logo-unibz.webp',
  './images/logo-tfo.webp',
  './images/logo-idal.webp',
  './images/logo-zoeschg.webp',
  './images/logo-frigotherm.webp',
  './images/daniel-karasani-industrial-engineer.webp',
  './images/daniel-fullbody.webp'
];

// Install Event: Pre-cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        // Cache assets individually or gracefully handle failure to cache a single file
        return Promise.allSettled(
          PRECACHE_ASSETS.map((asset) => {
            return cache.add(asset).catch((err) => {
              console.warn(`[Service Worker] Failed to pre-cache asset: ${asset}`, err);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => {
            console.log('[Service Worker] Clearing old cache', cache);
            return caches.delete(cache);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Avoid intercepting third-party APIs (like web3forms or google analytics)
  const isSelfOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com');
  const isCDN = url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('cdn.jsdelivr.net');

  if (!isSelfOrigin && !isGoogleFont && !isCDN) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.log('[Service Worker] Fetch failed, network offline:', err);
          // If offline and request is an HTML page, fallback to cached index
          if (event.request.headers.get('accept')?.includes('text/html')) {
             const requestUrl = event.request.url;
             let fallbackPage = './index.html';
             if (requestUrl.includes('-de.')) fallbackPage = './index-de.html';
             else if (requestUrl.includes('-it.')) fallbackPage = './index-it.html';
             return cachedResponse || cache.match(fallbackPage);
          }
          throw err;
        });

        // Return cached response instantly if we have it, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
