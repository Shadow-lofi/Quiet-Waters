import { getAudioContext } from './audio'
import type { Soundscape } from './types'

// Ambient soundscapes, synthesized entirely with the Web Audio API — no audio
// files, so they add nothing to the bundle and work fully offline.
//
// Fire and Leaves are noise-based (a continuous filtered "bed" plus one-shot
// crackle/rustle "voices" fired at random intervals); Bowls is tonal (sustained
// sine partials rung at slow intervals over a faint drone). That irregularity is
// what makes them read as real rather than as flat loops.

let noiseBuffer: AudioBuffer | null = null

function pinkNoise(ctx: AudioContext): AudioBuffer {
  const frames = ctx.sampleRate * 3
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
  const out = buffer.getChannelData(0)
  // Paul Kellet's pink-noise filter.
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0
  for (let i = 0; i < frames; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    b6 = white * 0.115926
  }
  return buffer
}

// The live graph, kept so we can fade out and tear it down cleanly.
let master: GainNode | null = null
let sources: AudioScheduledSourceNode[] = [] // long-lived beds/drones + LFO oscillators
let chain: AudioNode[] = [] // long-lived filters/gains to disconnect
let timers: number[] = [] // pending scheduler timeouts
let gen = 0 // bumped on every stop/start so stale schedulers bail
let currentKind: Soundscape = 'off'

// Perceived-loudness trim per scape, applied under the user's 0–1 volume.
const TRIM: Record<Exclude<Soundscape, 'off'>, number> = {
  fire: 0.5,
  leaves: 0.5,
  bowls: 0.45,
}

// A calm C-based pentatonic for the singing bowls (Hz).
const BOWL_SCALE = [196, 261.63, 293.66, 329.63, 392, 440]

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

/** A burst of fire crackle: one to a few very short, bright pops. */
function crackle(ctx: AudioContext, out: AudioNode) {
  if (!noiseBuffer) return
  const cluster = 1 + Math.floor(Math.random() * Math.random() * 4) // usually 1, rarely up to 4
  let t = ctx.currentTime
  for (let i = 0; i < cluster; i++) {
    const decay = rand(0.006, 0.03)
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = rand(1300, 3600)
    const g = ctx.createGain()
    const v = rand(0.05, 0.4)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(v, t + 0.001)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    const pan = ctx.createStereoPanner()
    pan.pan.value = rand(-0.5, 0.5)
    src.connect(hp)
    hp.connect(g)
    g.connect(pan)
    pan.connect(out)
    src.start(t, Math.random() * (noiseBuffer.duration - 0.1))
    src.stop(t + decay + 0.03)
    t += rand(0.012, 0.05)
  }
}

/** A soft cluster of papery crinkles — individual leaves shifting. */
function rustle(ctx: AudioContext, out: AudioNode) {
  if (!noiseBuffer) return
  const cluster = 2 + Math.floor(Math.random() * 4) // 2–5 quick crinkles
  let t = ctx.currentTime
  for (let i = 0; i < cluster; i++) {
    const decay = rand(0.02, 0.07)
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = rand(2200, 5200)
    const g = ctx.createGain()
    const v = rand(0.03, 0.12)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(v, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    const pan = ctx.createStereoPanner()
    pan.pan.value = rand(-0.55, 0.55)
    src.connect(hp)
    hp.connect(g)
    g.connect(pan)
    pan.connect(out)
    src.start(t, Math.random() * (noiseBuffer.duration - 0.1))
    src.stop(t + decay + 0.03)
    t += rand(0.015, 0.06)
  }
}

/** One struck crystal bowl: pure sine partials that swell in and ring out long,
 *  each with a faintly detuned twin for the characteristic shimmer/beat. */
function bowl(ctx: AudioContext, out: AudioNode) {
  const t = ctx.currentTime
  const base = BOWL_SCALE[Math.floor(Math.random() * BOWL_SCALE.length)]
  const attack = rand(0.4, 1.2)
  const decay = rand(8, 14)
  const peak = rand(0.08, 0.15)

  const bus = ctx.createGain()
  bus.gain.setValueAtTime(0.0001, t)
  bus.gain.exponentialRampToValueAtTime(peak, t + attack)
  bus.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.4, 0.4)
  bus.connect(pan)
  pan.connect(out)

  const partials = [
    { mult: 1, g: 1 },
    { mult: 2, g: 0.14 },
    { mult: 2.8, g: 0.05 }, // a faint inharmonic top for the "glassy" ring
  ]
  for (const p of partials) {
    for (const detune of [1, 1 + rand(0.002, 0.006)]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = base * p.mult * detune
      const g = ctx.createGain()
      g.gain.value = p.g * (detune === 1 ? 0.6 : 0.4)
      osc.connect(g)
      g.connect(bus)
      osc.start(t)
      osc.stop(t + attack + decay + 0.1)
    }
  }
  const id = window.setTimeout(
    () => {
      try {
        bus.disconnect()
      } catch {
        /* noop */
      }
      try {
        pan.disconnect()
      } catch {
        /* noop */
      }
    },
    (attack + decay + 0.5) * 1000,
  )
  timers.push(id)
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
  if (!noiseBuffer) noiseBuffer = pinkNoise(ctx)

  const myGen = gen
  master = ctx.createGain()
  master.gain.value = 0.0001
  master.connect(ctx.destination)
  const out = master

  const noiseSource = () => {
    const s = ctx.createBufferSource()
    s.buffer = noiseBuffer
    s.loop = true
    sources.push(s)
    return s
  }
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

  if (kind === 'fire') {
    // low roar + soft hiss bed, with frequent crackle bursts
    const roarSrc = noiseSource()
    const roarLp = biquad('lowpass', 380)
    const roar = gain(0.32)
    roarSrc.connect(roarLp)
    roarLp.connect(roar)
    roar.connect(out)
    roarSrc.start()
    lfo(ctx, 0.4, 0.06, roar.gain) // flicker
    const hissSrc = noiseSource()
    const hissBp = biquad('bandpass', 1100, 0.8)
    const hiss = gain(0.05)
    hissSrc.connect(hissBp)
    hissBp.connect(hiss)
    hiss.connect(out)
    hissSrc.start()
    schedule(myGen, 110, 620, () => crackle(ctx, out))
  } else if (kind === 'leaves') {
    // papery wind-through-leaves bed that swells and fades, plus soft rustles
    const src = noiseSource()
    const hp = biquad('highpass', 1500)
    const lp = biquad('lowpass', 7000)
    const bed = gain(0.5)
    src.connect(hp)
    hp.connect(lp)
    lp.connect(bed)
    bed.connect(out)
    src.start()
    lfo(ctx, 0.12, 0.35, bed.gain) // gusts swell and settle
    lfo(ctx, 0.12, 700, hp.frequency) // brightness shifts with the gust
    schedule(myGen, 240, 820, () => rustle(ctx, out)) // individual leaves
  } else if (kind === 'bowls') {
    // faint sustained drone for continuity, with bowls rung at slow intervals
    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.value = 130.81 // C3
    const droneGain = gain(0.03)
    drone.connect(droneGain)
    droneGain.connect(out)
    drone.start()
    sources.push(drone)
    lfo(ctx, 0.07, 0.015, droneGain.gain) // gentle breathing
    const first = window.setTimeout(() => myGen === gen && master && bowl(ctx, out), 600)
    timers.push(first)
    schedule(myGen, 4000, 9000, () => bowl(ctx, out))
  }

  const target = clamp01(volume) * trim
  master.gain.linearRampToValueAtTime(Math.max(0.0001, target), ctx.currentTime + 1.8)
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
