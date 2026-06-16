/* CAIRN Service Worker v1 */
const CACHE = "cairn-v1";
const PRECACHE = [
  "./index.html",
  "./manifest.json",
  "./icon-192.svg",
  "./icon-512.svg",
  /* CDN resources — キャッシュしておくことでオフライン動作 */
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://unpkg.com/recharts@2.12.7/umd/Recharts.js",
  "https://unpkg.com/papaparse@5.4.1/papaparse.min.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => {
      /* CDNはネットワーク失敗しても続行（no-throw） */
      return Promise.all(
        PRECACHE.map((url) =>
          c.add(url).catch(() => {
            console.warn("[SW] skip cache:", url);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Cache-first for local, Network-first for CDN fonts */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  /* Google Fonts — stale-while-revalidate */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const cached = await c.match(e.request);
        const fetchP = fetch(e.request).then((r) => {
          c.put(e.request, r.clone());
          return r;
        }).catch(() => cached);
        return cached || fetchP;
      })
    );
    return;
  }

  /* CDN JS — cache-first */
  if (url.hostname === "unpkg.com" || url.hostname === "cdn.jsdelivr.net") {
    e.respondWith(
      caches.match(e.request).then((r) =>
        r || fetch(e.request).then((resp) => {
          if (resp.ok) {
            caches.open(CACHE).then((c) => c.put(e.request, resp.clone()));
          }
          return resp;
        })
      )
    );
    return;
  }

  /* アプリシェル — cache-first */
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((r) =>
        r || fetch(e.request).then((resp) => {
          if (resp.ok) {
            caches.open(CACHE).then((c) => c.put(e.request, resp.clone()));
          }
          return resp;
        })
      )
    );
  }
});
