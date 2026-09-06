import { getAudioContext } from './audio'
import type { Soundscape } from './types'

// Ambient sound during a sitting: a single recorded track ("Music"), decoded
// once with the Web Audio API and looped seamlessly. Kept as MP3 so it decodes
// on every browser (AAC hangs in codec-limited Chromium). Lazy-cached by the
// service worker on first play, so after that it works fully offline.
//
// Track: "Zen Spiritual Yoga Massage Meditation Spa" by REDproductions (Pixabay,
// free/no-attribution). The file is still named spa.mp3; see public/audio/CREDITS.txt.

let master: GainNode | null = null
let sources: AudioScheduledSourceNode[] = [] // playing buffer sources
let timers: number[] = [] // pending loop schedulers
let gen = 0 // bumped on every stop/start so stale schedulers bail
let currentKind: Soundscape = 'off'

// Who started the ambience currently playing. There's one shared engine, so this
// lets a caller release only its own playback: e.g. app-wide "background music"
// keeps looping while a sitting begins and ends over the top of it, and leaving
// the Settings preview never silences the background track. See startAmbient /
// stopAmbient's `who`.
export type AmbientOwner = 'background' | 'session' | 'preview'
let owner: AmbientOwner | null = null

// Perceived-loudness trim, applied under the user's 0–1 volume.
const TRIM: Record<Exclude<Soundscape, 'off'>, number> = {
  music: 0.5,
}

const MUSIC_URL = '/audio/spa.mp3'
let musicBuffer: AudioBuffer | null = null
let musicLoading: Promise<AudioBuffer | null> | null = null

function loadMusicBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  if (musicBuffer) return Promise.resolve(musicBuffer)
  if (!musicLoading) {
    musicLoading = fetch(MUSIC_URL)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`music ${r.status}`))))
      // Callback form of decodeAudioData for the widest (older Safari) support.
      .then(
        (ab) =>
          new Promise<AudioBuffer>((resolve, reject) => ctx.decodeAudioData(ab, resolve, reject)),
      )
      .then((buf) => {
        musicBuffer = buf
        return buf
      })
      .catch((e) => {
        console.warn('[ambient] music track failed to load', e)
        musicLoading = null // allow a later retry
        return null
      })
  }
  return musicLoading
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** Loop a decoded buffer seamlessly by overlapping successive plays with an
 *  equal fade-out/fade-in crossfade, so the loop point is inaudible. */
function startMusicLoop(ctx: AudioContext, buffer: AudioBuffer, out: AudioNode, myGen: number) {
  const XF = 3 // crossfade seconds
  const dur = buffer.duration
  const playFrom = (when: number) => {
    if (myGen !== gen || !master) return
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, when)
    g.gain.linearRampToValueAtTime(1, when + XF) // fade in
    g.gain.setValueAtTime(1, when + Math.max(XF, dur - XF))
    g.gain.linearRampToValueAtTime(0.0001, when + dur) // fade out into the next
    src.connect(g)
    g.connect(out)
    src.start(when)
    src.stop(when + dur + 0.2)
    sources.push(src)
    // Start the next pass XF seconds before this one ends, so they crossfade.
    const nextWhen = when + dur - XF
    const id = window.setTimeout(
      () => playFrom(nextWhen),
      Math.max(0, (nextWhen - ctx.currentTime - 1) * 1000),
    )
    timers.push(id)
  }
  playFrom(ctx.currentTime + 0.05)
}

/** Start (or switch to) the ambient track, fading it in. `who` records the caller
 *  so it (and only it) can later stop this playback — defaults to a sitting. */
export function startAmbient(kind: Soundscape, volume: number, who: AmbientOwner = 'session'): void {
  stopAmbient(true) // tears down anything playing and bumps `gen`
  if (kind === 'off') return
  const trim = TRIM[kind as Exclude<Soundscape, 'off'>]
  if (trim === undefined) return // unknown / retired scape → stay silent
  const ctx = getAudioContext()
  if (!ctx) return

  const myGen = gen
  master = ctx.createGain()
  master.gain.value = 0.0001
  master.connect(ctx.destination)
  const out = master

  // Decode once (cached), then crossfade-loop the recording.
  loadMusicBuffer(ctx).then((buf) => {
    if (myGen !== gen || !buf) return
    startMusicLoop(ctx, buf, out, myGen)
  })

  const target = clamp01(volume) * trim
  master.gain.linearRampToValueAtTime(Math.max(0.0001, target), ctx.currentTime + 2)
  currentKind = kind
  owner = who
}

/** Fade out and dispose the current ambience. Pass immediate to skip the fade.
 *  Pass `who` to release only playback that caller owns — a mismatched owner is a
 *  no-op, so a sitting or a Settings preview never stops the background music.
 *  Omitting `who` forces the stop (used internally to tear down before a start). */
export function stopAmbient(immediate = false, who?: AmbientOwner): void {
  if (who && owner && owner !== who) return // someone else owns it — leave it playing
  gen++ // any in-flight scheduler now bails
  for (const id of timers) clearTimeout(id)
  timers = []

  const m = master
  const srcs = sources
  master = null
  sources = []
  currentKind = 'off'
  owner = null
  if (!m) return

  const teardown = () => {
    for (const s of srcs) {
      try {
        s.stop()
      } catch {
        /* already stopped */
      }
      try {
        s.disconnect()
      } catch {
        /* noop */
      }
    }
    try {
      m.disconnect()
    } catch {
      /* noop */
    }
  }

  if (immediate) {
    teardown()
    return
  }
  try {
    const ctx = m.context
    m.gain.cancelScheduledValues(ctx.currentTime)
    m.gain.setValueAtTime(m.gain.value, ctx.currentTime)
    m.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.9)
  } catch {
    /* noop */
  }
  setTimeout(teardown, 1000)
}

/** Adjust the live ambience volume (0–1) without restarting it. */
export function setAmbientVolume(volume: number): void {
  if (!master || currentKind === 'off') return
  const ctx = master.context
  const target = clamp01(volume) * TRIM[currentKind]
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
  master.gain.linearRampToValueAtTime(Math.max(0.0001, target), ctx.currentTime + 0.3)
}

/** Whether the ambience is currently playing (used by the Settings preview). */
export function isAmbientPlaying(): boolean {
  return currentKind !== 'off'
}
