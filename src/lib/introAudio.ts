import { getAudioContext } from './audio'

// A brief, gentle swell of the meditation music, played once as the installed
// app opens — the "snippet" the opening intro rings in. It fades in, holds, and
// fades away while the intro splash dissolves into the app. Same recording as
// the meditation ambience (public/audio/spa.mp3), decoded with the Web Audio API
// so the fade is smooth and it plays fully offline once the service worker has
// cached the file. Autoplay policies (iOS especially) block audio until a user
// gesture, so this is started from the tap on the splash — see IntroSplash.tsx.

const MUSIC_URL = '/audio/spa.mp3'

// Perceived-loudness trim, so the swell sits as gently as the same recording
// does as ambience (matches TRIM.music in ambient.ts).
const TRIM = 0.5

let buffer: AudioBuffer | null = null
let loading: Promise<AudioBuffer | null> | null = null

/** Begin fetching + decoding the clip. Safe to call before any user gesture —
 *  decoding works on a suspended AudioContext — so the swell can start promptly
 *  on tap. Fire-and-forget: any failure is swallowed and the intro simply stays
 *  silent (the visuals still play, and a tap still enters the app). */
export function preloadIntroAudio(): void {
  const ctx = getAudioContext()
  if (!ctx || buffer || loading) return
  loading = fetch(MUSIC_URL)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`intro audio ${r.status}`))))
    // Callback form of decodeAudioData for the widest (older Safari) support.
    .then((ab) => new Promise<AudioBuffer>((resolve, reject) => ctx.decodeAudioData(ab, resolve, reject)))
    .then((buf) => (buffer = buf))
    .catch((e) => {
      console.warn('[intro] audio failed to load', e)
      loading = null // allow a later retry
      return null
    })
}

/** Play the clip once as a soft swell: fade in, hold, then fade out over
 *  ~`seconds`. Must be called from a user gesture so the AudioContext can
 *  resume. Harmless no-op if audio is unavailable or the clip hasn't loaded. */
export function playIntroSwell(volume = 0.6, seconds = 6): void {
  const ctx = getAudioContext() // primes + resumes (we're inside a gesture)
  if (!ctx) return
  preloadIntroAudio() // ensure a load is in flight if preload was skipped

  const start = (buf: AudioBuffer | null) => {
    if (!buf) return
    const now = ctx.currentTime
    const fadeIn = 1.2
    const fadeOut = 2.2
    const hold = Math.max(fadeIn, seconds - fadeOut)
    const target = Math.max(0.0001, Math.min(1, volume) * TRIM)

    const src = ctx.createBufferSource()
    src.buffer = buf
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, now)
    g.gain.linearRampToValueAtTime(target, now + fadeIn)
    g.gain.setValueAtTime(target, now + hold)
    g.gain.linearRampToValueAtTime(0.0001, now + seconds)
    src.connect(g)
    g.connect(ctx.destination)
    src.start(now)
    src.stop(now + seconds + 0.1)
    src.onended = () => {
      try {
        src.disconnect()
      } catch {
        /* noop */
      }
      try {
        g.disconnect()
      } catch {
        /* noop */
      }
    }
  }

  if (buffer) start(buffer)
  else void (loading ?? Promise.resolve(null)).then(start)
}
