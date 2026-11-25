const CACHE = "bqd-aire-v26";
const PRECACHE = ["./manifest.webmanifest", "./favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  var destino = event.request.destination;
  if (destino === "image" || destino === "video" || destino === "audio" || destino === "font") return;
  if (event.request.headers.has("range")) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          var copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(function () {});
        }
        return response;
      })
      .catch(function () { return caches.match(event.request); })
  );
});
