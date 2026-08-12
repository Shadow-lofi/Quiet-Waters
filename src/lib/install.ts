// Add-to-home-screen helpers. Chromium browsers fire `beforeinstallprompt`,
// which we capture so we can offer a real in-app Install button; iOS Safari has
// no such API, so there we show manual steps instead. All detection is
// best-effort and the app is fully usable without ever installing.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Keep the event so we can trigger the native prompt from our own button.
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
  })
}

/** True when the app is already running as an installed / standalone PWA. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export type Platform = 'ios' | 'android' | 'desktop'

/** Best-effort guess at the user's platform, to show the right install steps. */
export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  // iPadOS 13+ reports as a Mac, so also treat a touch-capable "Mac" as iOS.
  const isIOS =
    /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1)
  if (isIOS) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

/** Whether a native "install" prompt is available to trigger right now. */
export function canPromptInstall(): boolean {
  return deferred !== null
}

/** Fire the browser's native install prompt, if one was captured. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferred) return 'unavailable'
  await deferred.prompt()
  const { outcome } = await deferred.userChoice
  deferred = null
  return outcome
}
