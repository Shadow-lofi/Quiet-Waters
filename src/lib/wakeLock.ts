// Keep the screen awake during a sitting.
//
// Primary: the Screen Wake Lock API (Chrome/Android/desktop, and iOS/iPadOS
// 16.4+). It's auto-released whenever the page is hidden (the screen dimming,
// backgrounding, locking), so we listen for that and re-acquire when the page is
// visible again — the previous code held a stale sentinel and never re-acquired,
// so the screen slept for the rest of a sitting after the first dim.
//
// Fallback: a muted, inline, looping <video> fed by a canvas capture stream —
// a device keeps the display on while a video is playing, which covers browsers
// where the Wake Lock API isn't available or its request is refused.
//
// NOTE: nothing a web page can do overrides iOS **Low Power Mode**, which sleeps
// the screen regardless. That has to be turned off on the phone.

let sentinel: WakeLockSentinel | null = null
let video: HTMLVideoElement | null = null
let drawTimer: number | null = null
let active = false

async function acquireSentinel(): Promise<void> {
  if (!('wakeLock' in navigator)) return
  try {
    sentinel = await navigator.wakeLock.request('screen')
    // The OS releases the lock when the page hides; clear our ref so the
    // visibility handler knows to re-acquire on return.
    sentinel.addEventListener('release', () => {
      sentinel = null
    })
  } catch (err) {
    // Refused (e.g. Low Power Mode, or unsupported state) — surface it, then let
    // the video fallback try.
    console.warn('[wakeLock] screen lock refused', err)
    sentinel = null
  }
}

type CaptureCanvas = HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream }

function startVideoFallback(): void {
  if (video) return
  try {
    const canvas = document.createElement('canvas') as CaptureCanvas
    canvas.width = 2
    canvas.height = 2
    const ctx = canvas.getContext('2d')
    if (!ctx || typeof canvas.captureStream !== 'function') return
    // Nudge a pixel each second so the capture stream keeps emitting frames.
    let flip = false
    drawTimer = window.setInterval(() => {
      flip = !flip
      ctx.fillStyle = flip ? '#000001' : '#000000'
      ctx.fillRect(0, 0, 2, 2)
    }, 1000)

    const stream = canvas.captureStream(1)
    const el = document.createElement('video')
    el.muted = true
    el.setAttribute('muted', '')
    el.setAttribute('playsinline', '')
    el.setAttribute('aria-hidden', 'true')
    el.style.cssText =
      'position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none;'
    el.srcObject = stream
    document.body.appendChild(el)
    video = el
    void el.play().catch((err) => console.warn('[wakeLock] video fallback refused', err))
  } catch (err) {
    console.warn('[wakeLock] video fallback failed', err)
    stopVideoFallback()
  }
}

function stopVideoFallback(): void {
  if (drawTimer != null) {
    clearInterval(drawTimer)
    drawTimer = null
  }
  if (video) {
    try {
      video.pause()
      ;(video.srcObject as MediaStream | null)?.getTracks().forEach((t) => t.stop())
      video.srcObject = null
      video.remove()
    } catch {
      /* already gone */
    }
    video = null
  }
}

function onVisibilityChange(): void {
  if (!active || document.visibilityState !== 'visible') return
  if (!sentinel) void acquireSentinel()
  if (video && video.paused) void video.play().catch(() => {})
}

/** Begin keeping the screen awake. Safe to call more than once. */
export async function keepScreenAwake(): Promise<void> {
  if (active) return
  active = true
  document.addEventListener('visibilitychange', onVisibilityChange)
  await acquireSentinel()
  // Only reach for the video hack when the Wake Lock API didn't take.
  if (!sentinel) startVideoFallback()
}

/** Stop keeping the screen awake and release everything. */
export function releaseScreenAwake(): void {
  active = false
  document.removeEventListener('visibilitychange', onVisibilityChange)
  sentinel?.release().catch(() => {})
  sentinel = null
  stopVideoFallback()
}
