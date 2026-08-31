import { useEffect, useRef, useState } from 'react'
import { Check, Pause, Play, SlidersHorizontal, Square, Volume2 } from 'lucide-react'
import { DEFAULT_RATE, narrationSupported, useNarration, useVoiceList } from '../lib/narration'
import { useStore } from '../lib/store'

const SPEEDS: { label: string; rate: number }[] = [
  { label: 'Slower', rate: 0.8 },
  { label: 'Natural', rate: DEFAULT_RATE },
  { label: 'Faster', rate: 1.15 },
]

const SAMPLE = 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.'

/**
 * A small "Listen" control that reads the given segments aloud with the
 * browser's built-in narrator voice, plus a settings menu to choose the voice
 * and reading speed (saved on-device). Renders nothing when speech synthesis is
 * unavailable. Narration is stopped automatically when `session` changes (e.g.
 * turning the chapter) or when the button unmounts (leaving the page).
 */
export function NarrationButton({
  session,
  segments,
  label = 'Listen',
  className = '',
  onEnd,
  showContinuous = false,
}: {
  session: string
  segments: string[]
  label?: string
  className?: string
  /** Fired when the passage finishes on its own — used for continuous reading. */
  onEnd?: () => void
  /** Show the "Keep reading" (auto-advance) toggle in the settings menu. */
  showContinuous?: boolean
}) {
  const status = useNarration((s) => s.status)
  const active = useNarration((s) => s.session)
  const toggle = useNarration((s) => s.toggle)
  const play = useNarration((s) => s.play)
  const stop = useNarration((s) => s.stop)

  const voiceURI = useStore((s) => s.narrationVoiceURI)
  const rate = useStore((s) => s.narrationRate)
  const continuous = useStore((s) => s.narrationContinuous)
  const setPref = useStore((s) => s.setPref)

  const voices = useVoiceList()
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const isActive = active === session
  const isPlaying = isActive && status === 'playing'

  const opts = { voiceURI, rate, onEnd }

  // Stop reading when the content changes out from under us, or on unmount.
  useEffect(() => {
    return () => {
      if (useNarration.getState().session === session) useNarration.getState().stop()
    }
  }, [session])

  // Close the settings menu on an outside click.
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [menuOpen])

  if (!narrationSupported) return null

  return (
    <div ref={wrapRef} className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {!isActive ? (
        <button
          onClick={() => toggle(session, segments, opts)}
          className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-3.5 py-1.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <Volume2 size={15} />
          {label}
        </button>
      ) : (
        <>
          <button
            onClick={() => toggle(session, segments, opts)}
            aria-label={isPlaying ? 'Pause narration' : 'Resume narration'}
            className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-3.5 py-1.5 text-sm font-medium text-onwater shadow-sm transition hover:bg-water-600"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={stop}
            aria-label="Stop narration"
            className="flex h-8 w-8 items-center justify-center rounded-full text-deep-500 ring-1 ring-line transition hover:bg-mist-200 hover:text-deep-700"
          >
            <Square size={14} className="fill-current" />
          </button>
        </>
      )}

      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Voice settings"
        aria-expanded={menuOpen}
        className={`flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-line transition ${
          menuOpen ? 'bg-mist-200 text-water-600' : 'text-deep-500 hover:bg-mist-200 hover:text-deep-700'
        }`}
      >
        <SlidersHorizontal size={14} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-card p-4 text-left shadow-xl ring-1 ring-line">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-deep-400">
            Voice
          </label>
          <select
            value={voiceURI ?? ''}
            onChange={(e) => setPref('narrationVoiceURI', e.target.value || null)}
            className="w-full rounded-lg bg-mist-100 px-3 py-2 text-sm text-deep-800 outline-none ring-1 ring-line"
          >
            <option value="">Auto — best available</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name}
              </option>
            ))}
          </select>

          <p className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-deep-400">Speed</p>
          <div className="flex gap-1 rounded-full bg-mist-100 p-1 ring-1 ring-line">
            {SPEEDS.map((s) => {
              const on = Math.abs(rate - s.rate) < 0.01
              return (
                <button
                  key={s.label}
                  onClick={() => setPref('narrationRate', s.rate)}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-xs font-medium transition ${
                    on ? 'bg-water-500 text-onwater shadow-sm' : 'text-deep-600 hover:text-deep-800'
                  }`}
                >
                  {on && <Check size={12} />}
                  {s.label}
                </button>
              )
            })}
          </div>

          {showContinuous && (
            <button
              onClick={() => setPref('narrationContinuous', !continuous)}
              role="switch"
              aria-checked={continuous}
              className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl bg-mist-100 px-3 py-2.5 text-left ring-1 ring-line"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-deep-800">Keep reading</span>
                <span className="block text-xs text-deep-500">Continue into the next chapter</span>
              </span>
              <span
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                  continuous ? 'bg-water-500' : 'bg-mist-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-all ${
                    continuous ? 'left-4' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          )}

          <button
            onClick={() => play('narration:preview', [SAMPLE], { voiceURI, rate })}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-100"
          >
            <Volume2 size={14} />
            Hear a sample
          </button>
          <p className="mt-2.5 text-[0.7rem] leading-snug text-deep-400">
            Voices come from your device. Installing your system’s “enhanced” or “natural” voices adds
            warmer options here.
          </p>
        </div>
      )}
    </div>
  )
}
