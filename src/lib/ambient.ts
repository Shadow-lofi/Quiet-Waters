import { getAudioContext } from './audio'
import type { Soundscape } from './types'

// Ambient soundscapes, synthesized entirely with the Web Audio API — no audio
// files, so they add nothing to the bundle and work fully offline.
//
// Each scape is a continuous "bed" (looping pink noise shaped by filters) plus,
// for the lively ones, discrete one-shot "voices" fired at randomized intervals
// by a small scheduler: rain drops, breaking waves, distant gulls, fire crackles.
// That irregularity is what makes them read as real rather than as flat noise.

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
let sources: AudioScheduledSourceNode[] = [] // long-lived beds + LFO oscillators
let chain: AudioNode[] = [] // long-lived filters/gains to disconnect
let timers: number[] = [] // pending scheduler timeouts
let gen = 0 // bumped on every stop/start so stale schedulers bail
let currentKind: Soundscape = 'off'

// Perceived-loudness trim per scape, applied under the user's 0–1 volume.
const TRIM: Record<Exclude<Soundscape, 'off'>, number> = {
  rain: 0.55,
  stream: 0.42,
  waves: 0.6,
  fire: 0.5,
}

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

/** A single rain drop tapping a surface: a short, lightly-resonant noise blip. */
function droplet(ctx: AudioContext, out: AudioNode, big = false) {
  if (!noiseBuffer) return
  const t = ctx.currentTime
  const decay = big ? rand(0.09, 0.18) : rand(0.035, 0.1)
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = big ? rand(500, 1200) : rand(900, 2700)
  bp.Q.value = big ? 9 : 6
  const g = ctx.createGain()
  const v = (big ? 0.24 : 0.12) * rand(0.5, 1)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(v, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.6, 0.6)
  src.connect(bp)
  bp.connect(g)
  g.connect(pan)
  pan.connect(out)
  src.start(t, Math.random() * (noiseBuffer.duration - 0.3))
  src.stop(t + decay + 0.05)
}

/** One wave: a swell that builds, brightens into a foamy break, then recedes. */
function wave(ctx: AudioContext, out: AudioNode) {
  if (!noiseBuffer) return
  const t = ctx.currentTime
  const build = rand(1.8, 3)
  const recede = rand(2.6, 4.4)
  const peak = rand(0.5, 0.9)
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  src.loop = true
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 240
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(480, t)
  lp.frequency.linearRampToValueAtTime(5600, t + build) // brighten to the crest
  lp.frequency.linearRampToValueAtTime(700, t + build + recede) // dull as it recedes
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(peak, t + build)
  g.gain.linearRampToValueAtTime(0.0001, t + build + recede)
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.35, 0.35)
  src.connect(hp)
  hp.connect(lp)
  lp.connect(g)
  g.connect(pan)
  pan.connect(out)
  src.start(t)
  src.stop(t + build + recede + 0.1)
}

/** A distant seagull: a couple of raspy, down-gliding chirps, quiet and echoey. */
function gull(ctx: AudioContext, out: AudioNode) {
  const t0 = ctx.currentTime
  const chirps = 2 + Math.floor(Math.random() * 3)
  const bus = ctx.createGain()
  bus.gain.value = rand(0.03, 0.06) // quiet = far away
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2200
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.85, 0.85)
  const delay = ctx.createDelay()
  delay.delayTime.value = 0.19
  const fb = ctx.createGain()
  fb.gain.value = 0.25
  bus.connect(lp)
  lp.connect(pan)
  pan.connect(out)
  lp.connect(delay)
  delay.connect(fb)
  fb.connect(delay)
  delay.connect(pan) // a touch of echo for open space

  let t = t0
  for (let i = 0; i < chirps; i++) {
    const dur = rand(0.1, 0.17)
    const f1 = rand(1100, 1500)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(f1, t)
    osc.frequency.exponentialRampToValueAtTime(f1 * rand(0.62, 0.8), t + dur)
    const vib = ctx.createOscillator()
    vib.frequency.value = 26
    const vibGain = ctx.createGain()
    vibGain.gain.value = 38
    vib.connect(vibGain)
    vibGain.connect(osc.frequency)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.0001, t)
    og.gain.exponentialRampToValueAtTime(1, t + 0.012)
    og.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(og)
    og.connect(bus)
    osc.start(t)
    osc.stop(t + dur + 0.02)
    vib.start(t)
    vib.stop(t + dur + 0.02)
    t += dur + rand(0.05, 0.12)
  }
  // Tidy up the shared bus after the cry + its echo tail have died away.
  const id = window.setTimeout(
    () => {
      ;[bus, lp, pan, delay, fb].forEach((n) => {
        try {
          n.disconnect()
        } catch {
          /* noop */
        }
      })
    },
    (t - t0 + 1.6) * 1000,
  )
  timers.push(id)
}

/** A single water bubble/trickle: a soft sine with a quick rising pitch — the
 *  "bloop" of water moving over stones. */
function bubble(ctx: AudioContext, out: AudioNode) {
  const t = ctx.currentTime
  const dur = rand(0.05, 0.11)
  const f0 = rand(360, 820)
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(f0, t)
  osc.frequency.exponentialRampToValueAtTime(f0 * rand(1.4, 2.2), t + dur) // rising = a bubble
  const g = ctx.createGain()
  const v = rand(0.04, 0.13)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(v, t + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.5, 0.5)
  osc.connect(g)
  g.connect(pan)
  pan.connect(out)
  osc.start(t)
  osc.stop(t + dur + 0.03)
}

/** A distant forest bird: one to three soft, high, warbling notes. */
function birdChirp(ctx: AudioContext, out: AudioNode) {
  const t0 = ctx.currentTime
  const notes = 1 + Math.floor(Math.random() * 3)
  const bus = ctx.createGain()
  bus.gain.value = rand(0.02, 0.05) // soft = far off among the trees
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 5000
  const pan = ctx.createStereoPanner()
  pan.pan.value = rand(-0.8, 0.8)
  bus.connect(lp)
  lp.connect(pan)
  pan.connect(out)
  let t = t0
  for (let i = 0; i < notes; i++) {
    const dur = rand(0.06, 0.13)
    const f = rand(2200, 3600)
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(f, t)
    osc.frequency.linearRampToValueAtTime(f * rand(1.05, 1.3), t + dur * 0.5)
    osc.frequency.linearRampToValueAtTime(f * rand(0.9, 1), t + dur)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.0001, t)
    og.gain.exponentialRampToValueAtTime(1, t + 0.01)
    og.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(og)
    og.connect(bus)
    osc.start(t)
    osc.stop(t + dur + 0.02)
    t += dur + rand(0.06, 0.16)
  }
  const id = window.setTimeout(
    () => {
      ;[bus, lp, pan].forEach((n) => {
        try {
          n.disconnect()
        } catch {
          /* noop */
        }
      })
    },
    (t - t0 + 0.5) * 1000,
  )
  timers.push(id)
}

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

  if (kind === 'rain') {
    // a light drizzle: faint background wash + sparse, gentle droplet taps
    const src = noiseSource()
    const hp = biquad('highpass', 700)
    const lp = biquad('lowpass', 2800)
    const bed = gain(0.06)
    src.connect(hp)
    hp.connect(lp)
    lp.connect(bed)
    bed.connect(out)
    src.start()
    lfo(ctx, 0.13, 0.03, bed.gain)
    schedule(myGen, 90, 340, () => droplet(ctx, out)) // gentle patter (was a downpour)
    schedule(myGen, 900, 2600, () => droplet(ctx, out, true)) // an occasional fuller drop
  } else if (kind === 'stream') {
    // a slow forest brook: soft flowing-water bed, water trickling over stones,
    // and the odd far-off bird among the trees
    const src = noiseSource()
    const bp = biquad('bandpass', 720, 0.6)
    const lp = biquad('lowpass', 2600)
    const bed = gain(0.4)
    src.connect(bp)
    bp.connect(lp)
    lp.connect(bed)
    bed.connect(out)
    src.start()
    lfo(ctx, 0.18, 150, bp.frequency) // slow, gentle wander of the current
    lfo(ctx, 0.5, 0.05, bed.gain) // subtle breathing of the flow
    schedule(myGen, 140, 520, () => bubble(ctx, out)) // trickling over pebbles
    schedule(myGen, 16000, 38000, () => birdChirp(ctx, out)) // distant forest bird
  } else if (kind === 'waves') {
    // low ocean rumble bed, breaking waves, and the odd distant gull
    const src = noiseSource()
    const lp = biquad('lowpass', 500)
    const bed = gain(0.26)
    src.connect(lp)
    lp.connect(bed)
    bed.connect(out)
    src.start()
    lfo(ctx, 0.06, 0.1, bed.gain)
    lfo(ctx, 0.06, 170, lp.frequency)
    const first = window.setTimeout(() => myGen === gen && master && wave(ctx, out), 1200)
    timers.push(first)
    schedule(myGen, 6500, 12000, () => wave(ctx, out))
    schedule(myGen, 13000, 32000, () => gull(ctx, out))
  } else if (kind === 'fire') {
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
