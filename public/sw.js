/**
 * MEENAKSHI TECHNOLOGIES - SERVICE WORKER
 * Version: 2.1.0
 * Intelligent Multi-Tier Caching System & Offline Resilience
 */

const VERSION = 'v2.1.0';
const CACHE_NAMES = {
  static: `meenakshi-static-${VERSION}`,
  dynamic: `meenakshi-dynamic-${VERSION}`,
  images: `meenakshi-images-${VERSION}`
};

// Essential Core Shell Assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/css/style.css?v=2026.8',
  '/js/main.js?v=2026.8',
  '/images/logo.png',
  '/site.webmanifest'
];

// Maximum dynamic entries to prevent unbounded storage growth
const MAX_DYNAMIC_ITEMS = 60;
const MAX_IMAGE_ITEMS = 80;

/**
 * Trim cache to max items (LRU policy)
 */
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      for (let i = 0; i < keys.length - maxItems; i++) {
        await cache.delete(keys[i]);
      }
    }
  } catch (err) {
    console.warn('[SW] Cache trim error:', err);
  }
}

/* ==========================================================================
   INSTALL EVENT - Pre-cache Shell
   ========================================================================== */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then(async (cache) => {
      // Use map with individual error handling so one failure doesn't block install
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) {
              await cache.put(url, res);
            }
          } catch (e) {
            console.warn('[SW] Failed to precache:', url, e);
          }
        })
      );
    }).then(() => self.skipWaiting())
  );
});

/* ==========================================================================
   ACTIVATE EVENT - Purge Outdated Caches
   ========================================================================== */
self.addEventListener('activate', (event) => {
  const currentCaches = Object.values(CACHE_NAMES);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/* ==========================================================================
   FETCH EVENT - Strategic Routing
   ========================================================================== */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Never handle non-GET or chrome-extension schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. Bypass CMS, Admin, API and Dynamic PDF generation routes
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/cms') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('.pdf')
  ) {
    return;
  }

  // 3. HTML Navigation requests: NETWORK-FIRST with OFFLINE FALLBACK
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If valid response, clone and cache into dynamic cache
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAMES.dynamic).then((cache) => {
              cache.put(request, responseClone);
              trimCache(CACHE_NAMES.dynamic, MAX_DYNAMIC_ITEMS);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Try dynamic or static cache first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // Fall back to offline page
          const offlinePage = await caches.match('/offline');
          if (offlinePage) return offlinePage;

          return new Response('Offline - No connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // 4. Product & Static Images: STALE-WHILE-REVALIDATE
  if (
    url.pathname.startsWith('/images/') ||
    request.destination === 'image' ||
    /\.(png|jpe?g|webp|svg|ico|gif)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAMES.images).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
            trimCache(CACHE_NAMES.images, MAX_IMAGE_ITEMS);
          }
          return networkResponse;
        }).catch(() => null);

        // Return cached immediately if available; otherwise await network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. Static Assets (CSS, JS, Fonts): CACHE-FIRST
  if (
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/js/') ||
    url.pathname.endsWith('.webmanifest') ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAMES.static).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 6. Default Fallback: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

/* ==========================================================================
   MESSAGE EVENT - Cache Clearing & Service Worker Lifecycle
   ========================================================================== */
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.action === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => caches.delete(key)));
      }).then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true, message: 'All website caches cleared.' });
        }
      })
    );
  }
});

