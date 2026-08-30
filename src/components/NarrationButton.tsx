import { useEffect } from 'react'
import { Pause, Play, Square, Volume2 } from 'lucide-react'
import { narrationSupported, useNarration } from '../lib/narration'

/**
 * A small "Listen" control that reads the given segments aloud with the
 * browser's built-in narrator voice. Renders nothing when speech synthesis is
 * unavailable. Narration is stopped automatically when `session` changes (e.g.
 * turning the chapter) or when the button unmounts (leaving the page).
 */
export function NarrationButton({
  session,
  segments,
  label = 'Listen',
  className = '',
}: {
  session: string
  segments: string[]
  label?: string
  className?: string
}) {
  const status = useNarration((s) => s.status)
  const active = useNarration((s) => s.session)
  const toggle = useNarration((s) => s.toggle)
  const stop = useNarration((s) => s.stop)

  const isActive = active === session
  const isPlaying = isActive && status === 'playing'

  // Stop reading when the content changes out from under us, or on unmount.
  useEffect(() => {
    return () => {
      if (useNarration.getState().session === session) useNarration.getState().stop()
    }
  }, [session])

  if (!narrationSupported) return null

  if (!isActive) {
    return (
      <button
        onClick={() => toggle(session, segments)}
        className={`inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-3.5 py-1.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200 ${className}`}
      >
        <Volume2 size={15} />
        {label}
      </button>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        onClick={() => toggle(session, segments)}
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
    </div>
  )
}
