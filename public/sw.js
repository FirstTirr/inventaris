const CACHE_NAME = "inventaris-v2";
const urlsToCache = ["/", "/favicon.ico", "/manifest.json", "/tefa.jpg"];

// Install service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch event
self.addEventListener("fetch", function (event) {
  const req = event.request;
  const url = new URL(req.url);

  // Jangan intersep request selain GET atau lintas-origin (API backend)
  // agar tidak memicu respondWith(undefined) ketika CORS/network gagal.
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then(function (response) {
        // If successful response, clone it, cache it, and return it
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(req, responseToCache);
        });

        return response;
      })
      .catch(function () {
        // If fetch fails (offline), try to return from cache
        return caches.match(req).then(function (cachedResponse) {
          return cachedResponse || Response.error();
        });
      }),
  );
});

// Activate service worker
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
