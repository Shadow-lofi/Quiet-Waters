import { useEffect, useRef, useState } from 'react'
import { BREATH_PATTERNS } from '../data/presets'
import type { MeditationVerse } from '../data/verses'
import type { BreathPace } from '../lib/types'

const MIN_SCALE = 0.62
const MAX_SCALE = 1.0

interface Phase {
  name: 'in' | 'hold' | 'out' | 'rest'
  label: string
  dur: number
  from: number
  to: number
}

function buildPhases(pace: Exclude<BreathPace, 'off'>): Phase[] {
  const p = BREATH_PATTERNS[pace]
  const phases: Phase[] = [{ name: 'in', label: 'Breathe in', dur: p.inhale, from: MIN_SCALE, to: MAX_SCALE }]
  if (p.hold) phases.push({ name: 'hold', label: 'Hold', dur: p.hold, from: MAX_SCALE, to: MAX_SCALE })
  phases.push({ name: 'out', label: 'Breathe out', dur: p.exhale, from: MAX_SCALE, to: MIN_SCALE })
  if (p.holdOut) phases.push({ name: 'rest', label: 'Rest', dur: p.holdOut, from: MIN_SCALE, to: MIN_SCALE })
  return phases
}

// Ease-in-out so the disc swells and settles like a real breath.
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t)

export function BreathCircle({
  pace,
  verse,
  paused,
}: {
  pace: BreathPace
  verse: MeditationVerse
  paused: boolean
}) {
  const discRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [word, setWord] = useState('')

  const reduced =
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    // Still mode (pace off, or reduced motion): a calm, unmoving disc with the
    // verse's inhale phrase as a single anchor word.
    if (pace === 'off' || reduced) {
      if (discRef.current) discRef.current.style.transform = 'scale(0.82)'
      setLabel(pace === 'off' ? '' : 'Be still')
      setWord(verse.breathIn)
      return
    }

    const phases = buildPhases(pace)
    const cycle = phases.reduce((sum, p) => sum + p.dur, 0)
    let raf = 0
    let start = performance.now()
    let pausedAt: number | null = null
    let lastName = ''

    const tick = (now: number) => {
      if (paused) {
        if (pausedAt === null) pausedAt = now
        setLabel('Paused')
        raf = requestAnimationFrame(tick)
        return
      }
      // Resuming: shift the clock so we continue from where we froze.
      if (pausedAt !== null) {
        start += now - pausedAt
        pausedAt = null
      }

      const t = ((now - start) / 1000) % cycle
      let acc = 0
      let cur = phases[0]
      let within = 0
      for (const p of phases) {
        if (t < acc + p.dur) {
          cur = p
          within = (t - acc) / p.dur
          break
        }
        acc += p.dur
      }

      const scale = cur.from + (cur.to - cur.from) * ease(within)
      if (discRef.current) discRef.current.style.transform = `scale(${scale.toFixed(3)})`

      if (cur.name !== lastName) {
        lastName = cur.name
        setLabel(cur.label)
        setWord(cur.name === 'in' || cur.name === 'hold' ? verse.breathIn : verse.breathOut)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pace, paused, reduced, verse])

  return (
    <div className="relative flex aspect-square w-full max-w-xs items-center justify-center">
      {/* ambient ripples */}
      {!reduced &&
        [0, 2, 4].map((delay) => (
          <span
            key={delay}
            className="qw-ripple-ring absolute h-40 w-40 rounded-full border border-water-400"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

      {/* the breathing disc */}
      <div
        ref={discRef}
        className="flex h-56 w-56 items-center justify-center rounded-full border border-water-300 text-center transition-transform"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, color-mix(in oklab, var(--color-water-300) 55%, transparent), color-mix(in oklab, var(--color-water-500) 32%, transparent))',
          boxShadow: '0 0 60px color-mix(in oklab, var(--color-water-400) 40%, transparent)',
          willChange: 'transform',
        }}
      >
        <div className="px-6">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-deep-600">{label}</p>
          <p className="font-serif text-lg leading-snug text-deep-900">{word}</p>
        </div>
      </div>
    </div>
  )
}
