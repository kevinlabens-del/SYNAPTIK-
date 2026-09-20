const CACHE = "synaptik-v1";
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
          "./",
          "./index.html",
          "./manifest.webmanifest",
          "./icon.svg",
          "./icon-192.png",
          "./icon-512.png",
          "./icon-maskable.png",
        ]),
      )
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("message", (event) => {
  if (event.data === "ACTIVATE") self.skipWaiting();
});
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => {
              cache.put(event.request, copy);
              cache.put("./index.html", response.clone());
            });
          }
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(event.request)) ||
            (await caches.match("./index.html")) ||
            Response.error()
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (hit) =>
        hit ||
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((c) => c.put(event.request, copy));
            }
            return response;
          })
          .catch(() => Response.error()),
    ),
  );
});
