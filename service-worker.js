const CACHE_NAME = "parallax-demo-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // Puedes añadir más rutas si tienes archivos CSS/JS externos
];

// En producción, añade aquí rutas absolutas o relativas que uses.

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Cacheando archivos...");
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => 
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Borrando cache vieja:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
