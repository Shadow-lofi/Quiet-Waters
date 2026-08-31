import { useEffect, useRef, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { fetchPassage, type Passage } from '../lib/bible'
import { useStore } from '../lib/store'
import { useNarration } from '../lib/narration'
import { NarrationButton } from './NarrationButton'
import { highlightById } from '../data/bible'
import type { SelectedVerse } from '../lib/types'

/**
 * Fetches and renders a single chapter as flowing serif text with superscript
 * verse numbers. Text comes from bible-api.com via lib/bible (cached in
 * localStorage after the first read). Each verse is tappable for the study tools,
 * and any saved highlight color / note is shown inline. With "Keep reading" on,
 * finishing a chapter's narration calls `onAdvance` and auto-plays the next.
 */
export function ChapterReader({
  reference,
  translation,
  onSelectVerse,
  onAdvance,
}: {
  reference: string
  translation: string
  onSelectVerse: (v: SelectedVerse) => void
  /** Advance to the next chapter for continuous reading; returns false at the
   *  very end of Scripture (so narration simply stops). */
  onAdvance?: () => boolean
}) {
  const [passage, setPassage] = useState<Passage | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const savedVerses = useStore((s) => s.savedVerses)

  const continuous = useStore((s) => s.narrationContinuous)
  const voiceURI = useStore((s) => s.narrationVoiceURI)
  const rate = useStore((s) => s.narrationRate)

  const session = `bible:${reference}:${translation}`
  const readingIndex = useNarration((s) => (s.session === session ? s.index : -1))

  const segments = passage ? passage.verses.map((v) => v.text) : []

  // Keep the latest values where the stable end-handler / auto-play can read them.
  const latest = useRef({ continuous, onAdvance, voiceURI, rate, session, segments })
  latest.current = { continuous, onAdvance, voiceURI, rate, session, segments }
  const pendingAutoPlay = useRef(false)

  // Fired when a chapter finishes reading on its own — advance if continuous.
  const handleEnd = useRef(() => {
    const l = latest.current
    if (!l.continuous) return
    if (l.onAdvance?.()) pendingAutoPlay.current = true
  }).current

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetchPassage(reference, translation)
      .then((p) => {
        if (!cancelled) {
          setPassage(p)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reference, translation, attempt])

  // Once the freshly-advanced chapter has loaded, keep the narration going.
  useEffect(() => {
    if (status === 'ready' && passage && pendingAutoPlay.current) {
      pendingAutoPlay.current = false
      const l = latest.current
      if (!l.continuous) return
      useNarration.getState().play(l.session, l.segments, {
        voiceURI: l.voiceURI,
        rate: l.rate,
        onEnd: handleEnd,
      })
    }
  }, [status, passage, handleEnd])

  if (status === 'loading') {
    return (
      <div className="grid place-items-center gap-3 py-16 text-deep-400">
        <Loader2 size={26} className="animate-spin text-water-500" />
        <p className="text-sm">Loading {reference}…</p>
      </div>
    )
  }

  if (status === 'error' || !passage) {
    return (
      <div className="grid place-items-center gap-3 rounded-card bg-mist-200/60 py-12 text-center">
        <p className="max-w-xs text-sm text-deep-500">
          We couldn’t load {reference}. Check your connection and try again.
        </p>
        <button
          onClick={() => setAttempt((a) => a + 1)}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <NarrationButton
          session={session}
          segments={segments}
          onEnd={handleEnd}
          showContinuous={!!onAdvance}
        />
      </div>
      <p className="font-serif text-[1.15rem] leading-9 text-deep-800">
        {passage.verses.map((v, i) => {
          const ref = `${v.book_name} ${v.chapter}:${v.verse}`
          const saved = savedVerses[ref]
          const color = highlightById(saved?.color)
          const isReading = i === readingIndex
          return (
            <span
              key={`${v.chapter}:${v.verse}`}
              onClick={() =>
                onSelectVerse({
                  ref,
                  text: v.text,
                  translation,
                  book: v.book_name,
                  chapter: v.chapter,
                  verse: v.verse,
                })
              }
              className={`cursor-pointer rounded-[3px] px-0.5 transition hover:bg-mist-200/70 ${
                isReading ? 'bg-water-500/15 text-deep-900' : ''
              } ${
                saved?.note ? 'underline decoration-dotted decoration-water-500/70 underline-offset-[5px]' : ''
              }`}
              style={
                !isReading && color
                  ? {
                      backgroundColor: color.bg,
                      boxDecorationBreak: 'clone',
                      WebkitBoxDecorationBreak: 'clone',
                    }
                  : undefined
              }
            >
              <sup className="mr-0.5 align-super text-[0.62em] font-sans font-semibold text-water-600">
                {v.verse}
              </sup>
              {v.text}{' '}
            </span>
          )
        })}
      </p>
      <p className="mt-6 border-t border-line pt-3 text-xs text-deep-400">
        {passage.translation} · Public Domain
        <span className="ml-2 text-deep-300">· Tap a verse to highlight, note, or save</span>
      </p>
    </div>
  )
}
