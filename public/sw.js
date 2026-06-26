// HighScore service worker — intentionally minimal.
//
// A previous version cached navigations and could show the offline page while
// online. This version does the opposite: it clears ALL caches and never
// intercepts requests (pure network passthrough), so the live app is always
// served straight from the network and an offline screen can never appear
// spuriously. It stays registered so the app remains installable as a PWA.
const VERSION = "highscore-v3-passthrough";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// No fetch interception — let every request go to the network as normal.
self.addEventListener("fetch", () => {});
