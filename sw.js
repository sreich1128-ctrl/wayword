// Offline cache. Bump VERSION whenever app or content files change so phones pick up the update.
const VERSION = 'wayword-v19';
const LANGS = ['pt-PT', 'es', 'fr', 'it', 'ru', 'ar-levantine', 'he', 'ja', 'ro'];
const PRECACHE = [
  './', 'index.html', 'css/style.css', 'js/app.js', 'js/data.js', 'js/store.js', 'js/speech.js', 'js/speak.js', 'js/voices.js', 'js/schedule.js', 'js/typecheck.js',
  'manifest.webmanifest', 'icons/icon.svg',
  'content/languages.json', 'content/concepts.json', 'content/categories.json', 'content/tiers.json',
  'content/scenarios.json', 'content/patterns.json', 'content/language-meta.json', 'content/flight.json',
  ...LANGS.map((c) => `content/lang/${c}.json`),
  ...LANGS.map((c) => `content/sounds/${c}.json`),
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Stale-while-revalidate: open instantly from cache, refresh in the background.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
