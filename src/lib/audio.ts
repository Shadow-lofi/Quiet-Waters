// Gentle chimes synthesized with the Web Audio API — no audio files, so it
// works fully offline and adds nothing to the bundle. Each chime is a soft
// singing-bowl-like tone: a fundamental plus a couple of quiet harmonics with a
// long, smooth exponential decay.

let ctx: AudioContext | null = null

/** Lazily create the AudioContext and resume it. Must be called from a user
 *  gesture (e.g. the Begin button) or iOS/Safari will keep it suspended. */
export function primeAudio(): void {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    /* audio unavailable — the app stays fully usable without sound */
  }
}

/** The shared AudioContext (created + resumed on demand). Exposed so the ambient
 *  soundscape engine can mix into the same context as the chimes. Returns null if
 *  audio is unavailable. */
export function getAudioContext(): AudioContext | null {
  primeAudio()
  return ctx
}

type ChimeKind = 'open' | 'interval' | 'close'

// Base pitch (Hz) per chime. Opening is a calm mid tone; the closing bell is a
// little lower and longer, like a bowl being let fully ring out.
const BASE: Record<ChimeKind, number> = {
  open: 396,
  interval: 528,
  close: 288,
}

const DECAY: Record<ChimeKind, number> = {
  open: 3.4,
  interval: 2.6,
  close: 5.0,
}

/** Play one chime. Silent (and harmless) if audio couldn't start. */
export function playChime(kind: ChimeKind, volume = 0.5): void {
  primeAudio()
  if (!ctx) return
  const now = ctx.currentTime
  const fundamental = BASE[kind]
  const decay = DECAY[kind]

  // A shared gentle low-pass keeps the tone warm rather than glassy.
  const master = ctx.createGain()
  master.gain.value = volume
  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 2200
  tone.connect(master)
  master.connect(ctx.destination)

  // Fundamental + a fifth + an octave, each quieter and shorter than the last —
  // the recipe for a soft, bell-like shimmer.
  const partials = [
    { ratio: 1, gain: 1.0, decay: decay },
    { ratio: 1.5, gain: 0.4, decay: decay * 0.7 },
    { ratio: 2.0, gain: 0.22, decay: decay * 0.5 },
  ]

  for (const p of partials) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = fundamental * p.ratio
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(p.gain, now + 0.02) // fast, soft attack
    g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay) // long decay
    osc.connect(g)
    g.connect(tone)
    osc.start(now)
    osc.stop(now + p.decay + 0.1)
  }
}
