// HighScore PWA service worker.
// Strategy: network-first for pages/data (never cached, so the live app is
// always fresh), cache-first only for immutable static assets, and the offline
// page ONLY when a real navigation genuinely fails. Bump CACHE to evict old
// caches and auto-replace a stale worker.
const CACHE = "highscore-v2";
const CORE = ["/offline.html", "/icon-192.png", "/icon-512.png", "/highscore-logo-final.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Immutable, safe-to-cache assets (hashed Next chunks, images, fonts, lottie).
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /\.(png|jpe?g|svg|webp|gif|ico|woff2?|ttf|json)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never touch the backend API or anything cross-origin.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  // Static assets → cache-first (fast, and immutable so never stale).
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
      )
    );
    return;
  }

  // Pages, RSC and data → ALWAYS network (never cached). Only show the offline
  // page when a top-level navigation truly fails (i.e. the device is offline).
  event.respondWith(
    fetch(request).catch(() => {
      if (request.mode === "navigate") return caches.match("/offline.html");
      return Response.error();
    })
  );
});
