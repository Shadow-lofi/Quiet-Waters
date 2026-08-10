// Register the offline service worker (production only). Kept deliberately
// simple: runtime caching, so the app becomes installable and works offline
// after the first visit. See public/sw.js.
export function registerSW(): void {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
