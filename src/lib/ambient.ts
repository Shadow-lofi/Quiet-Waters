import { getAudioContext } from './audio'
import type { Soundscape } from './types'

// Ambient soundscapes, synthesized entirely with the Web Audio API — no audio
// files, so they add nothing to the bundle and work fully offline.
//
// "Music" is a soft, prayerful ambient pad: four sine voices that glide gently
// between the notes of a slow, consonant chord progression (in C major), under a
// slowly-breathing lowpass filter, with an occasional soft bell tone from a
// pentatonic scale. No melody to follow — just a warm, evolving wash to rest in.

// The live graph, kept so we can fade out and tear it down cleanly.
let master: GainNode | null = null
let sources: AudioScheduledSourceNode[] = [] // long-lived voices + LFO oscillators
let chain: AudioNode[] = [] // long-lived filters/gains to disconnect
let timers: number[] = [] // pending scheduler timeouts
let gen = 0 // bumped on every stop/start so stale schedulers bail
let currentKind: Soundscape = 'off'

// Perceived-loudness trim per scape, applied under the user's 0–1 volume.
const TRIM: Record<Exclude<Soundscape, 'off'>, number> = {
  music: 0.55,
}

// A slow, consonant progression (frequencies in Hz). Voice 0 is the bass; the
// upper voices share common tones so changes read as gentle voice-leading, not a
// smear. Roughly: C · Am7 · Fmaj7 · G6.
const CHORDS: number[][] = [
  [130.81, 196.0, 261.63, 329.63], // C3  G3  C4  E4
  [110.0, 164.81, 261.63, 329.63], // A2  E3  C4  E4
  [174.61, 220.0, 261.63, 329.63], // F3  A3  C4  E4
  [196.0, 246.94, 293.66, 329.63], // G3  B3  D4  E4
]

// A soft bell picks from the C-major pentatonic, an octave up.
const BELL_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0] // C5 D5 E5 G5 A5

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** Wire a slow oscillator onto an AudioParam (adds to its base value). */
function lfo(ctx: AudioContext, freq: number, depth: number, target: AudioParam) {
  const osc = ctx.createOscillator()
  osc.frequency.value = freq
  const g = ctx.createGain()
  g.gain.value = depth
  osc.connect(g)
  g.connect(target)
  osc.start()
  sources.push(osc)
  chain.push(g)
}

/** Recursively fire `fn` at a random interval in [min,max] ms until the scape
 *  changes (gen mismatch). */
function schedule(myGen: number, min: number, max: number, fn: () => void) {
  const id = window.setTimeout(() => {
    if (myGen !== gen || !master) return
    fn()
    schedule(myGen, min, max, fn)
  }, rand(min, max))
  timers.push(id)
}

// ── one-shot voices ─────────────────────────────────────────────────────────

/** A single soft bell — slow attack, long decay, gently panned. Sometimes it
 *  stays silent, so the accents feel unforced. */
function bell(ctx: AudioContext, out: AudioNode) {
  if (Math.random() < 0.4) return
  const t = ctx.currentTime
  const f = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)]
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = f
  const g = ctx.createGain()
  const peak = rand(0.04, 0.085)
  const decay = rand(3, 5)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.4) // slow swell in
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay) // long tail
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.4, 0.4)
  osc.connect(g)
  g.connect(pan)
  pan.connect(out)
  osc.start(t)
  osc.stop(t + decay + 0.5)
}

// ── control surface ─────────────────────────────────────────────────────────

/** Start (or switch to) an ambient soundscape, fading it in. */
export function startAmbient(kind: Soundscape, volume: number): void {
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

  const biquad = (type: BiquadFilterType, freq: number, q?: number) => {
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    if (q !== undefined) f.Q.value = q
    chain.push(f)
    return f
  }
  const gain = (v: number) => {
    const g = ctx.createGain()
    g.gain.value = v
    chain.push(g)
    return g
  }

  if (kind === 'music') {
    const now = ctx.currentTime
    // A warm lowpass rolls off the highs; it breathes open and closed slowly.
    const lp = biquad('lowpass', 720, 0.6)
    lp.connect(out)
    lfo(ctx, 0.02, 240, lp.frequency) // ~50s sweep, ±240 Hz around 720
    const pad = gain(1)
    pad.connect(lp)

    const VOICES = 4
    const oscs: OscillatorNode[] = []
    const lastFreqs = [...CHORDS[0]]
    for (let i = 0; i < VOICES; i++) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = CHORDS[0][i]
      const vg = gain(0.0001)
      osc.connect(vg)
      vg.connect(pad)
      osc.start()
      sources.push(osc)
      // ease the voice in
      vg.gain.setValueAtTime(0.0001, now)
      vg.gain.linearRampToValueAtTime(rand(0.1, 0.13), now + 3)
      lfo(ctx, rand(0.03, 0.07), 0.045, vg.gain) // gentle swell
      lfo(ctx, rand(0.05, 0.12), rand(0.6, 1.6), osc.detune) // subtle warmth drift
      oscs.push(osc)
    }

    // Glide the voices to the next chord every ~13s.
    let idx = 0
    schedule(myGen, 12000, 15000, () => {
      idx = (idx + 1) % CHORDS.length
      const chord = CHORDS[idx]
      const t = ctx.currentTime
      for (let i = 0; i < VOICES; i++) {
        oscs[i].frequency.cancelScheduledValues(t)
        oscs[i].frequency.setValueAtTime(lastFreqs[i], t)
        oscs[i].frequency.exponentialRampToValueAtTime(chord[i], t + 2.2)
        lastFreqs[i] = chord[i]
      }
    })

    // An occasional soft bell.
    schedule(myGen, 7000, 17000, () => bell(ctx, out))
  }

  const target = clamp01(volume) * trim
  master.gain.linearRampToValueAtTime(Math.max(0.0001, target), ctx.currentTime + 2)
  currentKind = kind
}

/** Fade out and dispose the current soundscape. Pass immediate to skip the fade. */
export function stopAmbient(immediate = false): void {
  gen++ // any in-flight scheduler now bails
  for (const id of timers) clearTimeout(id)
  timers = []

  const m = master
  const srcs = sources
  const links = chain
  master = null
  sources = []
  chain = []
  currentKind = 'off'
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
    for (const n of links) {
      try {
        n.disconnect()
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

/** Adjust the live soundscape's volume (0–1) without restarting it. */
export function setAmbientVolume(volume: number): void {
  if (!master || currentKind === 'off') return
  const ctx = master.context
  const target = clamp01(volume) * TRIM[currentKind]
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
  master.gain.linearRampToValueAtTime(Math.max(0.0001, target), ctx.currentTime + 0.3)
}

/** Whether a soundscape is currently playing (used by the Settings preview). */
export function isAmbientPlaying(): boolean {
  return currentKind !== 'off'
}
