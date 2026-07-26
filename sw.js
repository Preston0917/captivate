/* ============================================================
   sw.js — offline app shell for the Captivate PWA
   Scope is "./" so this works under GitHub Pages' /captivate/ path.

   *** bump CACHE_VERSION when shipping changes ***
   Nothing here is content-hashed: an old cache is only replaced when this
   string changes, so a stale version means users keep the old shell.

   Cross-origin requests (the api.anthropic.com analyzer call) and anything
   that isn't a GET are never intercepted or cached.
   ============================================================ */

const CACHE_VERSION = "captivate-v3";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/data/captivate-content.js",
  "./js/data/cues-content.js",
  "./js/data/quests-data.js",
  "./js/data/story-data.js",
  "./js/native.js",
  "./js/demos.js",
  "./js/state.js",
  "./js/ui.js",
  "./js/quests.js",
  "./js/nightmode.js",
  "./js/storymode.js",
  "./js/trainer.js",
  "./js/skilltree.js",
  "./js/analyzer.js",
  "./js/home.js",
  "./js/app.js",
  "./icons/icon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // addAll is all-or-nothing; add one by one so a single 404 can't break install.
    await Promise.all(SHELL.map(url =>
      cache.add(new Request(url, { cache: "reload" }))
        .catch(err => console.warn("[sw] precache skipped", url, err))
    ));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;

  // Never touch non-GET or cross-origin traffic (analyzer -> api.anthropic.com).
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Stale-while-revalidate: serve the cached copy instantly, refresh behind it.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req, { ignoreSearch: true });

    const network = fetch(req).then(res => {
      if (res && res.ok && res.type === "basic") cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (cached) return cached;

    const fresh = await network;
    if (fresh) return fresh;

    // Offline with nothing cached: fall back to the shell for navigations.
    if (req.mode === "navigate") {
      const shell = await cache.match("./index.html");
      if (shell) return shell;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  })());
});
