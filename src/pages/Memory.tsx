import { useMemo, useState } from 'react'
import { Plus, Check, X, RotateCcw, Trash2, Sparkles, ChevronDown } from 'lucide-react'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'
import { MemoryCard } from '../components/MemoryCard'
import { MemorySymbolMark } from '../components/MemorySymbol'
import {
  dueVerses,
  stageOf,
  STAGE_LABEL,
  nextReviewLabel,
  STARTER_VERSES,
} from '../data/memory'
import type { MemoryVerse } from '../lib/types'

/**
 * Scripture Memory — a quiet place to hide the Word in your heart (Ps 119:11).
 * Verses are practiced as flip flashcards (a reverent symbol on the face, the
 * verse on the back) and resurface on a gentle spaced-repetition schedule. All
 * local and private; nothing leaves the device.
 */
export function Memory() {
  const memoryVerses = useStore((s) => s.memoryVerses)
  const addMemoryVerse = useStore((s) => s.addMemoryVerse)
  const removeMemoryVerse = useStore((s) => s.removeMemoryVerse)
  const reviewMemoryVerse = useStore((s) => s.reviewMemoryVerse)
  const push = useToast((s) => s.push)

  // Review session (a snapshot queue so the store updating mid-session is fine).
  const [queue, setQueue] = useState<MemoryVerse[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Add / starter UI.
  const [adding, setAdding] = useState(false)
  const [draftRef, setDraftRef] = useState('')
  const [draftText, setDraftText] = useState('')
  const [showStarters, setShowStarters] = useState(false)

  const due = useMemo(() => dueVerses(memoryVerses), [memoryVerses])
  const counts = useMemo(() => {
    const c = { learning: 0, known: 0, rooted: 0 }
    for (const v of memoryVerses) c[stageOf(v)]++
    return c
  }, [memoryVerses])

  const beginReview = (verses: MemoryVerse[]) => {
    if (verses.length === 0) return
    setQueue(verses)
    setIdx(0)
    setFlipped(false)
  }

  const rate = (recalled: boolean) => {
    if (!queue) return
    reviewMemoryVerse(queue[idx].ref, recalled)
    if (idx + 1 >= queue.length) {
      setIdx(idx + 1) // past the end → done screen
    } else {
      setIdx(idx + 1)
      setFlipped(false)
    }
  }

  const exitReview = () => {
    setQueue(null)
    setIdx(0)
    setFlipped(false)
  }

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const r = draftRef.trim()
    if (!r || !draftText.trim()) return
    if (memoryVerses.some((v) => v.ref === r)) {
      push({ title: 'Already in your verses', message: r })
      return
    }
    addMemoryVerse(r, draftText)
    push({ tone: 'success', title: 'Added to memory', message: r })
    setDraftRef('')
    setDraftText('')
    setAdding(false)
  }

  const addStarter = (ref: string, text: string) => {
    addMemoryVerse(ref, text)
    push({ tone: 'success', title: 'Added to memory', message: ref })
  }

  // ── Review session ────────────────────────────────────────────────
  if (queue) {
    const finished = idx >= queue.length
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-deep-500">
            {finished ? 'Review complete' : `Review · ${idx + 1} of ${queue.length}`}
          </p>
          <button
            onClick={exitReview}
            aria-label="End review"
            className="flex h-8 w-8 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-700"
          >
            <X size={18} />
          </button>
        </div>

        {finished ? (
          <section className="qw-enter flex flex-col items-center gap-4 rounded-card bg-gradient-to-br from-mist-200/70 to-card p-8 text-center shadow-sm ring-1 ring-water-500/25">
            <MemorySymbolMark id="heart" size={72} className="text-water-500" />
            <h2 className="font-serif text-2xl text-deep-900">The Word is taking root</h2>
            <p className="max-w-xs text-sm leading-relaxed text-deep-600">
              Well done. What you return to, you remember — and what you remember, the Spirit brings
              to mind when you need it.
            </p>
            <button
              onClick={exitReview}
              className="mt-1 rounded-full bg-water-500 px-6 py-2.5 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
            >
              Finish
            </button>
          </section>
        ) : (
          <>
            <MemoryCard
              verse={queue[idx]}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
            />
            {flipped ? (
              <div className="flex gap-3">
                <button
                  onClick={() => rate(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-mist-200 py-3 text-sm font-semibold text-deep-700 transition hover:bg-mist-300"
                >
                  <RotateCcw size={16} /> Review again
                </button>
                <button
                  onClick={() => rate(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-water-500 py-3 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Check size={16} /> I knew it
                </button>
              </div>
            ) : (
              <button
                onClick={() => setFlipped(true)}
                className="rounded-full py-3 text-sm font-semibold text-water-600 ring-1 ring-line transition hover:bg-mist-200"
              >
                Reveal the verse
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  // ── Overview ──────────────────────────────────────────────────────
  const remainingStarters = STARTER_VERSES.filter(
    (sv) => !memoryVerses.some((v) => v.ref === sv.ref),
  )
  const soonest = memoryVerses.length
    ? memoryVerses.reduce((a, b) => (a.dueAt < b.dueAt ? a : b))
    : null

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-2xl">Scripture Memory</h1>
        <p className="mt-1 text-sm text-deep-500">
          Hide the Word in your heart, and let it take root.
        </p>
      </header>

      {/* review summary */}
      {memoryVerses.length > 0 && (
        <section className="rounded-card bg-gradient-to-br from-mist-200/60 to-card p-5 shadow-sm ring-1 ring-line">
          {due.length > 0 ? (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
                    Today
                  </p>
                  <p className="mt-0.5 text-deep-900">
                    <span className="font-serif text-3xl text-deep-900">{due.length}</span>{' '}
                    <span className="text-deep-600">
                      verse{due.length > 1 ? 's' : ''} to review
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => beginReview(due)}
                className="mt-4 w-full rounded-full bg-water-500 py-3 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
              >
                Begin review
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="font-serif text-lg text-deep-900">All caught up</p>
              <p className="mt-1 text-sm text-deep-500">
                Nothing due right now
                {soonest ? ` · next ${nextReviewLabel(soonest).toLowerCase()}` : ''}.
              </p>
              <button
                onClick={() => beginReview(memoryVerses)}
                className="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold text-water-600 ring-1 ring-line transition hover:bg-mist-200"
              >
                Practice anyway
              </button>
            </div>
          )}

          {(counts.learning > 0 || counts.known > 0 || counts.rooted > 0) && (
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-line pt-3 text-xs text-deep-500">
              <span>Learning · {counts.learning}</span>
              <span>Known · {counts.known}</span>
              <span>Rooted · {counts.rooted}</span>
            </div>
          )}
        </section>
      )}

      {/* your verses */}
      {memoryVerses.length > 0 && (
        <section>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">Your verses</p>
          <ul className="flex flex-col gap-2.5">
            {memoryVerses.map((v) => (
              <li
                key={v.ref}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-line"
              >
                <button
                  onClick={() => beginReview([v])}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-label={`Practice ${v.ref}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist-200 text-water-600">
                    <MemorySymbolMark id={v.symbol} size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-deep-900">{v.ref}</span>
                    <span className="block truncate text-xs text-deep-500">
                      {STAGE_LABEL[stageOf(v)]} · {nextReviewLabel(v)}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => removeMemoryVerse(v.ref)}
                  aria-label={`Remove ${v.ref}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-300 transition hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* add a verse */}
      {adding ? (
        <form onSubmit={submitAdd} className="rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
          <input
            value={draftRef}
            onChange={(e) => setDraftRef(e.target.value)}
            placeholder="Reference — e.g. Psalm 46:10"
            maxLength={60}
            className="w-full rounded-full bg-mist-100 px-4 py-2 text-sm text-deep-900 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
          />
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="The verse, in the words you want to learn…"
            rows={3}
            className="mt-3 w-full resize-none rounded-2xl bg-mist-100 px-4 py-3 text-sm leading-relaxed text-deep-900 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-full px-4 py-2 text-sm font-medium text-deep-500 transition hover:bg-mist-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!draftRef.trim() || !draftText.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-4 py-2 text-sm font-semibold text-onwater shadow-sm transition hover:bg-water-600 disabled:opacity-40"
            >
              <Check size={16} /> Add verse
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-card py-3 text-sm font-semibold text-water-600 shadow-sm ring-1 ring-line transition hover:bg-mist-200"
        >
          <Plus size={16} /> Add a verse
        </button>
      )}

      {/* starter set */}
      {remainingStarters.length > 0 && (
        <section>
          {memoryVerses.length === 0 ? (
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-deep-500">
              <Sparkles size={14} className="text-water-500" /> Start with a few classics
            </div>
          ) : (
            <button
              onClick={() => setShowStarters((v) => !v)}
              className="mb-3 flex w-full items-center justify-between text-xs uppercase tracking-[0.2em] text-deep-500"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-water-500" /> Add a classic
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showStarters ? 'rotate-180' : ''}`}
              />
            </button>
          )}

          {(memoryVerses.length === 0 || showStarters) && (
            <ul className="flex flex-col gap-2.5">
              {remainingStarters.map((sv) => (
                <li
                  key={sv.ref}
                  className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-line"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-deep-900">{sv.ref}</p>
                    <p className="truncate text-xs text-deep-500">{sv.text}</p>
                  </div>
                  <button
                    onClick={() => addStarter(sv.ref, sv.text)}
                    aria-label={`Add ${sv.ref}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600 transition hover:bg-water-500 hover:text-onwater"
                  >
                    <Plus size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
