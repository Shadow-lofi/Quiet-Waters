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

export type EnableStatus = 'subscribed' | 'denied' | 'unsupported' | 'error'

/** The result of trying to enable push. `detail` carries the real reason on an
 *  error, so a device-only failure (no console) can be surfaced to the user. */
export interface EnableResult {
  status: EnableStatus
  detail?: string
}

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

  // iOS/Safari commonly throws AbortError ("push service error") from a transient
  // failure registering with Apple's push service — retrying, with a growing
  // pause and a clean slate each time, usually succeeds. Persistent failures
  // still surface (the last error propagates) so the reason reaches the user.
  const delays = [0, 800, 2000]
  let lastErr: unknown
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt]) await new Promise((r) => setTimeout(r, delays[attempt]))
    try {
      return await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
    } catch (err) {
      lastErr = err
      console.warn(`[push] subscribe attempt ${attempt + 1} failed`, err)
      // Clear anything a failed attempt may have left behind before retrying.
      await (await reg.pushManager.getSubscription())?.unsubscribe().catch(() => {})
    }
  }
  throw lastErr
}

/**
 * Ask permission, subscribe with the browser's push service, and register the
 * subscription with the server so it can receive broadcasts. Must be called from
 * a user gesture (the permission prompt requires it).
 */
export async function enablePush(): Promise<EnableResult> {
  if (!isPushSupported() || !PUSH_CONFIGURED) return { status: 'unsupported' }
  let permission: NotificationPermission
  try {
    permission = await Notification.requestPermission()
  } catch {
    permission = Notification.permission
  }
  if (permission !== 'granted') return { status: 'denied' }

  // Track where we are so a failure names the step it happened in.
  let stage = 'service worker'
  try {
    const reg = await navigator.serviceWorker.ready
    stage = 'subscribe'
    const sub = await subscribeToPush(reg)
    stage = 'register'
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.warn('[push] server rejected the subscription', res.status, body)
      return { status: 'error', detail: `register failed (${res.status})` }
    }
    return { status: 'subscribed' }
  } catch (err) {
    // Surface the real reason so a persistent failure is debuggable — the flow is
    // device-only (no console on a phone), so the name/message rides into the UI.
    const e = err as Error
    console.warn('[push] enable failed at', stage, e)
    const name = e?.name || 'Error'
    const message = e?.message ? `: ${e.message}` : ''
    return { status: 'error', detail: `${stage} — ${name}${message}` }
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
