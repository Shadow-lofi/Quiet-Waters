import { useState } from 'react'
import { X, Check, Bookmark, Copy, Trash2, Share2 } from 'lucide-react'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'
import { HIGHLIGHT_COLORS, translationById } from '../data/bible'
import type { SelectedVerse } from '../lib/types'
import { VerseShareSheet } from './VerseShareSheet'

/** A gentle bottom sheet for a tapped verse: highlight, note, label, bookmark,
 *  copy, or clear — all saved locally in the store, keyed by reference. */
export function VerseActionSheet({ verse, onClose }: { verse: SelectedVerse; onClose: () => void }) {
  const saved = useStore((s) => s.savedVerses[verse.ref])
  const updateVerse = useStore((s) => s.updateVerse)
  const removeSavedVerse = useStore((s) => s.removeSavedVerse)
  const pushToast = useToast((t) => t.push)

  const [note, setNote] = useState(saved?.note ?? '')
  const [label, setLabel] = useState(saved?.label ?? '')
  const [showShare, setShowShare] = useState(false)

  const meta = { text: verse.text, translation: verse.translation }

  const setColor = (id: string) =>
    updateVerse(verse.ref, meta, { color: saved?.color === id ? undefined : id })

  const save = () => {
    updateVerse(verse.ref, meta, { note, label })
    pushToast({ tone: 'success', title: 'Saved' })
    onClose()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `“${verse.text}” — ${verse.ref} (${translationById(verse.translation).short})`,
      )
      pushToast({ tone: 'success', title: 'Copied' })
    } catch {
      pushToast({ title: 'Couldn’t copy' })
    }
  }

  const hasSaved = Boolean(saved?.color || saved?.note || saved?.label || saved?.bookmarked)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-mist-100/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-card p-6 shadow-xl ring-1 ring-line"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-water-600">{verse.ref}</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-400 hover:bg-mist-200 hover:text-deep-600"
          >
            <X size={16} />
          </button>
        </div>

        <blockquote className="font-serif text-lg leading-relaxed text-deep-800">
          “{verse.text}”
        </blockquote>

        <p className="mt-5 text-xs uppercase tracking-[0.16em] text-deep-400">Highlight</p>
        <div className="mt-2 flex flex-wrap gap-2.5">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              aria-label={c.label}
              className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-card transition ${
                saved?.color === c.id ? 'ring-deep-500' : 'ring-transparent'
              }`}
              style={{ backgroundColor: c.swatch }}
            />
          ))}
        </div>

        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (optional)"
          maxLength={40}
          className="mt-4 w-full rounded-full bg-mist-100 px-4 py-2 text-sm text-deep-900 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note…"
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl bg-mist-100 px-4 py-3 text-sm leading-relaxed text-deep-900 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
        />

        <button
          onClick={save}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3 font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
        >
          <Check size={18} /> Save
        </button>

        <button
          onClick={() => setShowShare(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <Share2 size={16} /> Share as image
        </button>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => updateVerse(verse.ref, meta, { bookmarked: !saved?.bookmarked })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
          >
            <Bookmark
              size={15}
              className={saved?.bookmarked ? 'fill-water-500 text-water-500' : ''}
            />
            {saved?.bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          <button
            onClick={copy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
          >
            <Copy size={15} /> Copy
          </button>
          {hasSaved && (
            <button
              onClick={() => {
                removeSavedVerse(verse.ref)
                onClose()
              }}
              aria-label="Remove"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-deep-400 ring-1 ring-line transition hover:bg-rose-500/10 hover:text-rose-500"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {showShare && (
        <VerseShareSheet
          verse={{
            ref: verse.ref,
            text: verse.text,
            translationShort: translationById(verse.translation).short,
          }}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
