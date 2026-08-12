// Quiet Waters — offline service worker.
//
// CACHE carries a build id so each deploy gets its own cache; the id is stamped
// in at build time by the stamp-sw plugin in vite.config.ts (it replaces the
// 'quiet-waters-dev' literal below with a content hash). In dev the worker isn't
// registered (see main.tsx / lib/swUpdate.ts), so the 'dev' default stays inert.
const CACHE = 'quiet-waters-dev'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/quiet-waters.svg']

self.addEventListener('install', (event) => {
  // Precache the shell, but DON'T skipWaiting: a fresh build waits so the app can
  // surface a gentle "a new version is ready" prompt instead of swapping the
  // running assets out mid-sitting. The page tells us to activate via a message.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {}),
  )
})

// The page posts this once the user accepts the update; then we take over and a
// controllerchange on the client triggers a single reload onto the new assets.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('quiet-waters-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// Tapping the daily reminder focuses an open Quiet Waters window, or opens one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow ? self.clients.openWindow('/') : undefined
    }),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // App navigations: serve the installed shell from THIS worker's OWN cache, so a
  // reload keeps running the exact version the user is on. A newer build precaches
  // its own shell but stays "waiting" — the app only swaps to it when the user
  // accepts (Update now → SKIP_WAITING). The network is only a first-load fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = (await cache.match('/index.html')) || (await cache.match('/'))
        return cached || fetch(req)
      }),
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
