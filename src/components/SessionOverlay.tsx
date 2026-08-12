import { useEffect, useRef, useState } from 'react'
import { Pause, Play, X, Check } from 'lucide-react'
import { BreathCircle } from './BreathCircle'
import { useStore } from '../lib/store'
import { playChime, primeAudio } from '../lib/audio'
import { startAmbient, stopAmbient } from '../lib/ambient'
import { formatClock, formatMinutes } from '../lib/date'
import type { MeditationVerse } from '../data/verses'
import type { GuidedStep } from '../data/guided'
import type { BreathPace, Session } from '../lib/types'

export function SessionOverlay({
  durationMin,
  verse,
  onClose,
  paceOverride,
  steps,
  title,
}: {
  durationMin: number
  verse: MeditationVerse
  onClose: () => void
  paceOverride?: BreathPace // guided sessions fix the breath pace
  steps?: GuidedStep[] // guided: timed prompts that replace the static verse
  title?: string // guided: shown in the top bar + logged as the session label
}) {
  const totalSec = Math.round(durationMin * 60)
  const {
    soundOn,
    openingChime,
    closingChime,
    intervalMin,
    breathPace,
    keepAwake,
    soundscape,
    ambientVolume,
    addSession,
  } = useStore()
  const pace = paceOverride ?? breathPace

  const [remaining, setRemaining] = useState(totalSec)
  const [paused, setPaused] = useState(false)
  const [done, setDone] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)

  const elapsedRef = useRef(0)
  const wakeRef = useRef<WakeLockSentinel | null>(null)
  // Latest prefs/flags for the interval callback without re-arming it.
  const flags = useRef({ soundOn, closingChime, intervalMin })
  flags.current = { soundOn, closingChime, intervalMin }

  // ── mount: opening chime, ambient soundscape, wake lock ──
  useEffect(() => {
    primeAudio()
    if (soundOn && openingChime) playChime('open')
    startAmbient(soundscape, ambientVolume)

    let reacquire: (() => void) | null = null
    if (keepAwake && 'wakeLock' in navigator) {
      navigator.wakeLock
        .request('screen')
        .then((s) => (wakeRef.current = s))
        .catch(() => {})
      reacquire = () => {
        if (document.visibilityState === 'visible' && !wakeRef.current) {
          navigator.wakeLock.request('screen').then((s) => (wakeRef.current = s)).catch(() => {})
        }
      }
      document.addEventListener('visibilitychange', reacquire)
    }
    return () => {
      if (reacquire) document.removeEventListener('visibilitychange', reacquire)
      wakeRef.current?.release().catch(() => {})
      wakeRef.current = null
      stopAmbient()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finish = (completed: boolean) => {
    if (done) return
    const actual = Math.min(elapsedRef.current, totalSec)

    // Ended almost immediately: just slip back to setup — no chime, no log, no
    // "Amen" celebration for a sitting that never really began.
    if (!completed && actual < 20) {
      stopAmbient()
      wakeRef.current?.release().catch(() => {})
      wakeRef.current = null
      onClose()
      return
    }

    if (completed && flags.current.soundOn && flags.current.closingChime) playChime('close')
    stopAmbient()
    wakeRef.current?.release().catch(() => {})
    wakeRef.current = null
    const session: Session = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      endedAt: new Date().toISOString(),
      plannedSec: totalSec,
      actualSec: actual,
      completed,
      verseRef: title ?? verse.ref, // guided sittings log under their title
    }
    // Only log a sitting worth counting (at least ~20s of stillness).
    if (actual >= 20) addSession(session)
    setDone(true)
  }

  // ── the per-second tick ──
  useEffect(() => {
    if (paused || done) return
    const id = window.setInterval(() => {
      elapsedRef.current += 1
      const rem = totalSec - elapsedRef.current
      setRemaining(rem)

      const intSec = flags.current.intervalMin * 60
      if (intSec > 0 && rem > 0 && elapsedRef.current % intSec === 0 && flags.current.soundOn) {
        playChime('interval')
      }
      if (steps && steps.length) {
        let idx = 0
        for (let i = 0; i < steps.length; i++) {
          if (elapsedRef.current >= steps[i].at) idx = i
          else break
        }
        setStepIdx(idx) // no-op re-render when unchanged
      }
      if (rem <= 0) finish(true)
    }, 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, done, totalSec])

  const meditatedSec = Math.min(elapsedRef.current, totalSec)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-mist-100 px-5 py-6">
      {done ? (
        <CompleteView
          meditatedSec={meditatedSec}
          verse={verse}
          onClose={onClose}
        />
      ) : (
        <>
          {/* top bar */}
          <div className="grid grid-cols-3 items-center">
            <span className="font-mono text-lg tabular-nums text-deep-700">
              {formatClock(remaining)}
            </span>
            <span className="truncate text-center text-sm uppercase tracking-[0.16em] text-deep-500">
              {title ?? ''}
            </span>
            <button
              onClick={() => finish(false)}
              className="flex items-center gap-1.5 justify-self-end rounded-full px-3 py-1.5 text-sm text-deep-500 hover:bg-mist-200 hover:text-deep-800"
            >
              <X size={16} /> End
            </button>
          </div>

          {/* breathing guide */}
          <div className="flex flex-1 flex-col items-center justify-center gap-10">
            <BreathCircle pace={pace} verse={verse} paused={paused} />

            {steps && steps.length ? (
              <div className="flex min-h-[7rem] max-w-sm items-center justify-center px-2">
                <p
                  key={stepIdx}
                  className="qw-fadein text-center font-serif text-xl leading-relaxed text-deep-800"
                >
                  {steps[stepIdx]?.text}
                </p>
              </div>
            ) : (
              <figure className="max-w-sm text-center">
                <blockquote className="font-serif text-xl italic leading-relaxed text-deep-800">
                  “{verse.text}”
                </blockquote>
                <figcaption className="mt-2 text-sm uppercase tracking-[0.18em] text-water-600">
                  {verse.ref}
                </figcaption>
              </figure>
            )}
          </div>

          {/* controls */}
          <div className="flex justify-center">
            <button
              onClick={() => setPaused((p) => !p)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-water-500 text-onwater shadow-lg transition-transform active:scale-95"
              aria-label={paused ? 'Resume' : 'Pause'}
            >
              {paused ? <Play size={26} className="ml-0.5" /> : <Pause size={26} />}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function CompleteView({
  meditatedSec,
  verse,
  onClose,
}: {
  meditatedSec: number
  verse: MeditationVerse
  onClose: () => void
}) {
  const name = useStore((st) => st.name)
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-reed-400/25 text-reed-500">
        <Check size={40} strokeWidth={2.4} />
      </div>
      <div>
        <h2 className="text-3xl">{name ? `Amen, ${name}.` : 'Amen.'}</h2>
        <p className="mt-2 text-deep-600">
          You rested with God for {formatMinutes(meditatedSec)}.
        </p>
      </div>
      <figure className="max-w-sm">
        <blockquote className="font-serif text-lg italic leading-relaxed text-deep-800">
          “{verse.text}”
        </blockquote>
        <figcaption className="mt-2 text-sm uppercase tracking-[0.18em] text-water-600">
          {verse.ref}
        </figcaption>
      </figure>
      <button
        onClick={onClose}
        className="mt-2 rounded-full bg-water-500 px-8 py-3 font-semibold text-onwater shadow-md transition-transform active:scale-95"
      >
        Return
      </button>
    </div>
  )
}
