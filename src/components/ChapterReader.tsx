import { useEffect, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { fetchPassage, type Passage } from '../lib/bible'
import { useStore } from '../lib/store'
import { highlightById } from '../data/bible'
import type { SelectedVerse } from '../lib/types'

/**
 * Fetches and renders a single chapter as flowing serif text with superscript
 * verse numbers. Text comes from bible-api.com via lib/bible (cached in
 * localStorage after the first read). Each verse is tappable for the study tools,
 * and any saved highlight color / note is shown inline.
 */
export function ChapterReader({
  reference,
  translation,
  onSelectVerse,
}: {
  reference: string
  translation: string
  onSelectVerse: (v: SelectedVerse) => void
}) {
  const [passage, setPassage] = useState<Passage | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const savedVerses = useStore((s) => s.savedVerses)

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
      <p className="font-serif text-[1.15rem] leading-9 text-deep-800">
        {passage.verses.map((v) => {
          const ref = `${v.book_name} ${v.chapter}:${v.verse}`
          const saved = savedVerses[ref]
          const color = highlightById(saved?.color)
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
                saved?.note ? 'underline decoration-dotted decoration-water-500/70 underline-offset-[5px]' : ''
              }`}
              style={
                color
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
