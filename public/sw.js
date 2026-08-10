// Quiet Waters offline service worker — runtime caching.
// The app shell is precached on install; everything else (hashed JS/CSS, fonts)
// is cached cache-first the first time it's fetched, so a repeat visit works
// with no network. Bump CACHE to retire old assets on a new deploy.
const CACHE = 'quiet-waters-v1'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/quiet-waters.svg']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {}),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // SPA navigations: network-first so a fresh deploy is picked up, falling back
  // to the cached shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    )
    return
  }

  // Static assets: cache-first, then populate the cache from the network.
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res.ok && res.type === 'basic') {
              const copy = res.clone()
              caches.open(CACHE).then((c) => c.put(req, copy))
            }
            return res
          })
          .catch(() => cached),
    ),
  )
})
