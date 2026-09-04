// Web Push — the opt-in channel that reaches the phone even when Quiet Waters is
// fully closed (unlike the local reminder in lib/reminders.ts, which only fires
// while the app is open). Broadcasts only: gentle announcements — a new version
// or feature, and the daily verse — sent from the server to everyone who opted
// in. There are no accounts; the server stores only anonymous push endpoints.
//
// Platform notes:
//   • iOS/iPadOS allow web push ONLY for a PWA added to the Home Screen (16.4+),
//     never in a Safari tab — so `isPushSupported()` is naturally false there
//     until the app is installed. That's why the install invite matters.
//   • The service worker is only registered in production (see lib/swUpdate.ts),
//     so the toggle is shown only in the built app.

// The VAPID *public* key is safe to ship (browsers receive it). The matching
// private key lives only in the server's VAPID_PRIVATE_KEY env var. Override the
// embedded default per-environment with VITE_VAPID_PUBLIC_KEY if you rotate keys.
const VAPID_PUBLIC_KEY =
  (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ||
  'BNmWsaBFANEfUKUB68PRfLanvzdh8vxmGzJHL7xj5WpIfBb-JbQXc_yU_kexCF_NuhcYQYztyQ35UvybJHC-W68'

// The feature stays fully hidden until you flip VITE_PUSH_ENABLED=1 in the
// environment — so the code can ship and deploy dormant, and the Settings toggle
// only appears once the backend (VAPID keys + subscription store) is actually
// wired up. See PUSH_SETUP.md.
export const PUSH_CONFIGURED =
  Boolean(VAPID_PUBLIC_KEY) && import.meta.env.VITE_PUSH_ENABLED === '1'

/** True when this browser can subscribe to web push (installed PWA on iOS). */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/** Base64URL VAPID key → the byte array the PushManager expects. */
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

/** The device's current push subscription, if it has one. */
export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  const reg = await navigator.serviceWorker.getRegistration()
  return (await reg?.pushManager.getSubscription()) ?? null
}

export type EnableResult = 'subscribed' | 'denied' | 'unsupported' | 'error'

/** Base64url encoding of a subscription's applicationServerKey, for comparison. */
function serverKeyOf(sub: PushSubscription): string | null {
  const raw = sub.options?.applicationServerKey
  if (!raw) return null
  const bytes = new Uint8Array(raw)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Subscribe with the push service, recovering from the common failure mode: a
 * leftover subscription from a previous VAPID key (e.g. after a service-worker
 * update) makes a fresh `subscribe()` throw. Drop any stale subscription and try
 * again; retry once more after a short pause for transient (iOS) failures.
 */
async function subscribeToPush(reg: ServiceWorkerRegistration): Promise<PushSubscription> {
  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)

  // Reuse an existing subscription only if it was made with the current key;
  // otherwise it's stale and must be replaced (and the server can't reach it).
  const existing = await reg.pushManager.getSubscription()
  if (existing) {
    if (serverKeyOf(existing) === VAPID_PUBLIC_KEY) return existing
    await existing.unsubscribe().catch(() => {})
  }

  try {
    return await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
  } catch (err) {
    console.warn('[push] first subscribe attempt failed, retrying', err)
    // Clear anything the failed attempt may have left behind, then retry once.
    await (await reg.pushManager.getSubscription())?.unsubscribe().catch(() => {})
    await new Promise((r) => setTimeout(r, 600))
    return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
  }
}

/**
 * Ask permission, subscribe with the browser's push service, and register the
 * subscription with the server so it can receive broadcasts. Must be called from
 * a user gesture (the permission prompt requires it).
 */
export async function enablePush(): Promise<EnableResult> {
  if (!isPushSupported() || !PUSH_CONFIGURED) return 'unsupported'
  let permission: NotificationPermission
  try {
    permission = await Notification.requestPermission()
  } catch {
    permission = Notification.permission
  }
  if (permission !== 'granted') return 'denied'

  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await subscribeToPush(reg)
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    })
    if (!res.ok) {
      console.warn('[push] server rejected the subscription', res.status)
      return 'error'
    }
    return 'subscribed'
  } catch (err) {
    // Surface the real reason so a persistent failure is debuggable (it otherwise
    // collapses to one opaque message).
    console.warn('[push] enable failed', err)
    return 'error'
  }
}

/** Unsubscribe on this device and drop the endpoint from the server. */
export async function disablePush(): Promise<void> {
  const sub = await currentSubscription()
  if (!sub) return
  try {
    await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    })
  } catch {
    /* best-effort — the server also prunes dead endpoints on send */
  }
  try {
    await sub.unsubscribe()
  } catch {
    /* already gone */
  }
}
