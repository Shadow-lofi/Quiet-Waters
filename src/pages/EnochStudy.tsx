import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Loader2, RefreshCw } from 'lucide-react'
import { ENOCH_BOOKS, enochBookById, useEnoch, type EnochBook } from '../lib/enoch'
import { useStore } from '../lib/store'
import { chunkText } from '../lib/narration'
import { NarrationButton } from '../components/NarrationButton'
import { Seo } from '../components/Seo'

/** A reader for the Books of Enoch — public-domain text served as static JSON,
 *  fetched once and cached for offline reading. Holds 1 Enoch (R. H. Charles,
 *  1917) and 2 Enoch (Morfill/Charles); a toggle switches between them and the
 *  picker groups each book's chapters by its divisions. */
export function EnochStudy() {
  const bookId = useStore((s) => s.enochBook)
  const chapter = useStore((s) => s.enochChapter)
  const setRef = useStore((s) => s.setEnochRef)

  const book = enochBookById(bookId)
  const data = useEnoch((s) => s.data[book.id])
  const loading = useEnoch((s) => s.loading === book.id)
  const error = useEnoch((s) => s.error)
  const load = useEnoch((s) => s.load)

  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    void load(book)
  }, [book, load])

  const go = (b: string, c: number) => {
    setRef(b, c)
    setPickerOpen(false)
    window.scrollTo({ top: 0 })
  }
  const switchBook = (id: string) => {
    if (id === book.id) return
    setRef(id, 1)
    window.scrollTo({ top: 0 })
  }
  const step = (dir: -1 | 1) => {
    const c = chapter + dir
    if (c >= 1 && c <= book.chapters) go(book.id, c)
  }

  const section = book.sections.find((s) => chapter >= s.from && chapter <= s.to)
  const current = data?.chapters.find((c) => c.n === chapter)

  return (
    <div className="flex flex-col gap-6">
      <Seo path="/enoch" />
      <header>
        <h1 className="text-2xl">Enoch Study</h1>
        <p className="mt-1 text-sm text-deep-500">
          {book.title} — {book.subtitle}
        </p>
        <p className="mt-0.5 text-xs text-deep-400">{book.attribution}</p>
      </header>

      {ENOCH_BOOKS.length > 1 && (
        <div className="flex gap-1 rounded-full bg-mist-100 p-1 ring-1 ring-line" role="tablist" aria-label="Choose a book">
          {ENOCH_BOOKS.map((b) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={b.id === book.id}
              onClick={() => switchBook(b.id)}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                b.id === book.id
                  ? 'bg-water-500 text-onwater shadow-sm'
                  : 'text-deep-600 hover:bg-mist-200'
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => step(-1)}
          disabled={chapter <= 1}
          aria-label="Previous chapter"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-deep-600 ring-1 ring-line hover:bg-mist-200 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setPickerOpen(true)}
          className="flex-1 rounded-full bg-card py-2.5 text-center font-medium text-deep-900 shadow-sm ring-1 ring-line hover:bg-mist-100"
        >
          Chapter {chapter}
        </button>
        <button
          onClick={() => step(1)}
          disabled={chapter >= book.chapters}
          aria-label="Next chapter"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-deep-600 ring-1 ring-line hover:bg-mist-200 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        {section && (
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-water-600">{section.label}</p>
        )}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-deep-900">Chapter {chapter}</h2>
          {current && (
            <NarrationButton
              session={`enoch:${book.id}:${chapter}`}
              segments={chunkText(current.text)}
            />
          )}
        </div>

        {loading && !current && (
          <div className="grid place-items-center gap-3 py-12 text-deep-400">
            <Loader2 size={24} className="animate-spin text-water-500" />
            <p className="text-sm">Loading the text…</p>
          </div>
        )}
        {error && !current && (
          <div className="grid place-items-center gap-3 py-10 text-center">
            <p className="max-w-xs text-sm text-deep-500">
              We couldn’t load the text. Check your connection and try again.
            </p>
            <button
              onClick={() => void load(book)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-water-600 ring-1 ring-line hover:bg-mist-200"
            >
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        )}
        {current && (
          <p className="whitespace-pre-line font-serif text-[1.12rem] leading-9 text-deep-800">
            {current.text}
          </p>
        )}

        {current && (
          <p className="mt-6 border-t border-line pt-3 text-xs text-deep-400">
            {book.title} · {data?.translation} · Public Domain
          </p>
        )}
      </section>

      <div className="flex items-center justify-between gap-3 pb-2">
        <button
          onClick={() => step(-1)}
          disabled={chapter <= 1}
          className="rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line hover:bg-mist-200 disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={() => step(1)}
          disabled={chapter >= book.chapters}
          className="rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line hover:bg-mist-200 disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      {pickerOpen && (
        <ChapterPicker book={book} current={chapter} onPick={go} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  )
}

function ChapterPicker({
  book,
  current,
  onPick,
  onClose,
}: {
  book: EnochBook
  current: number
  onPick: (bookId: string, chapter: number) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-mist-100/70 backdrop-blur-md" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-3xl bg-card shadow-xl ring-1 ring-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <p className="text-sm font-semibold text-deep-800">{book.title}</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-deep-400 hover:bg-mist-200 hover:text-deep-600"
          >
            <X size={16} />
          </button>
        </div>
        <div
          className="overflow-y-auto px-5 py-4"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          {book.sections.map((sec) => (
            <div key={sec.label} className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-deep-400">
                {sec.label} · {sec.from}–{sec.to}
              </p>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {Array.from({ length: sec.to - sec.from + 1 }, (_, i) => sec.from + i).map((c) => (
                  <button
                    key={c}
                    onClick={() => onPick(book.id, c)}
                    className={`flex h-10 items-center justify-center rounded-xl text-sm font-medium ring-1 ring-line hover:bg-water-500 hover:text-onwater ${
                      c === current ? 'bg-water-500 text-onwater' : 'bg-mist-100 text-deep-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
