import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Bookmark } from 'lucide-react'
import { BOOKS, TRANSLATIONS, bookByName, highlightById } from '../data/bible'
import { ChapterReader } from '../components/ChapterReader'
import { VerseActionSheet } from '../components/VerseActionSheet'
import { useStore } from '../lib/store'
import type { SelectedVerse, SavedVerse } from '../lib/types'

/** An in-app Bible reader (text from bible-api.com, cached offline) with local
 *  highlights, notes, labels, and bookmarks — no account, everything on-device. */
export function Bible() {
  const book = useStore((s) => s.bibleBook)
  const chapter = useStore((s) => s.bibleChapter)
  const translation = useStore((s) => s.bibleTranslation)
  const setBibleRef = useStore((s) => s.setBibleRef)
  const setBibleTranslation = useStore((s) => s.setBibleTranslation)
  const savedVerses = useStore((s) => s.savedVerses)

  const [tab, setTab] = useState<'read' | 'saved'>('read')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selected, setSelected] = useState<SelectedVerse | null>(null)

  const current = bookByName(book) ?? BOOKS[0]

  const openChapter = (b: string, c: number) => {
    setBibleRef(b, c)
    setPickerOpen(false)
    setTab('read')
    window.scrollTo({ top: 0 })
  }

  const step = (dir: -1 | 1) => {
    const idx = BOOKS.findIndex((b) => b.name === book)
    let bi = idx
    let ch = chapter + dir
    if (ch < 1) {
      bi = (idx - 1 + BOOKS.length) % BOOKS.length
      ch = BOOKS[bi].chapters
    } else if (ch > current.chapters) {
      bi = (idx + 1) % BOOKS.length
      ch = 1
    }
    openChapter(BOOKS[bi].name, ch)
  }

  const savedList = Object.values(savedVerses).sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl">Bible</h1>
        <div className="flex gap-1 rounded-full bg-mist-200 p-1 text-sm">
          {(['read', 'saved'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                tab === t ? 'bg-card text-water-600 shadow-sm' : 'text-deep-500 hover:text-deep-700'
              }`}
            >
              {t === 'read' ? 'Read' : `Saved${savedList.length ? ` (${savedList.length})` : ''}`}
            </button>
          ))}
        </div>
      </header>

      {tab === 'read' ? (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={() => step(-1)}
              aria-label="Previous chapter"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-deep-600 ring-1 ring-line hover:bg-mist-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPickerOpen(true)}
              className="flex-1 rounded-full bg-card py-2.5 text-center font-medium text-deep-900 shadow-sm ring-1 ring-line hover:bg-mist-100"
            >
              {book} {chapter}
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next chapter"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-deep-600 ring-1 ring-line hover:bg-mist-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="-mt-2 flex justify-center">
            <select
              value={translation}
              onChange={(e) => setBibleTranslation(e.target.value)}
              aria-label="Translation"
              className="rounded-full bg-mist-100 px-3 py-1 text-xs text-deep-600 outline-none ring-1 ring-line"
            >
              {TRANSLATIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
            <ChapterReader
              reference={`${book} ${chapter}`}
              translation={translation}
              onSelectVerse={setSelected}
            />
          </section>

          <div className="flex items-center justify-between gap-3 pb-2">
            <button
              onClick={() => step(-1)}
              className="rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line hover:bg-mist-200"
            >
              ← Previous
            </button>
            <button
              onClick={() => step(1)}
              className="rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line hover:bg-mist-200"
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <SavedList
          list={savedList}
          onOpen={(sv) => {
            const m = sv.ref.match(/^(.*) (\d+):\d+$/)
            if (m) openChapter(m[1], Number(m[2]))
          }}
        />
      )}

      {pickerOpen && (
        <BookPicker current={book} onPick={openChapter} onClose={() => setPickerOpen(false)} />
      )}
      {selected && <VerseActionSheet verse={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function SavedList({ list, onOpen }: { list: SavedVerse[]; onOpen: (sv: SavedVerse) => void }) {
  if (list.length === 0) {
    return (
      <div className="qw-enter rounded-card bg-mist-200/60 px-6 py-12 text-center">
        <p className="font-serif text-lg text-deep-700">Nothing saved yet</p>
        <p className="mt-1.5 text-sm text-deep-500">
          While reading, tap any verse to highlight it, add a note, or bookmark it — it’ll gather here.
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      {list.map((sv) => {
        const color = highlightById(sv.color)
        return (
          <button
            key={sv.ref}
            onClick={() => onOpen(sv)}
            className="rounded-card bg-card p-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-[0.16em] text-water-600">{sv.ref}</span>
              <span className="flex items-center gap-1.5">
                {color && (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color.swatch }}
                    aria-hidden
                  />
                )}
                {sv.bookmarked && <Bookmark size={13} className="fill-water-500 text-water-500" />}
              </span>
            </div>
            <p className="mt-1.5 line-clamp-3 font-serif text-[1.05rem] leading-snug text-deep-800">
              “{sv.text}”
            </p>
            {sv.label && (
              <span className="mt-2 inline-block rounded-full bg-mist-200 px-2.5 py-0.5 text-xs font-medium text-deep-600">
                {sv.label}
              </span>
            )}
            {sv.note && <p className="mt-2 text-sm leading-relaxed text-deep-500">{sv.note}</p>}
          </button>
        )
      })}
    </div>
  )
}

function BookPicker({
  current,
  onPick,
  onClose,
}: {
  current: string
  onPick: (book: string, chapter: number) => void
  onClose: () => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const book = chosen ? bookByName(chosen) : null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-mist-100/70 backdrop-blur-md" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-3xl bg-card shadow-xl ring-1 ring-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          {book ? (
            <button
              onClick={() => setChosen(null)}
              className="flex items-center gap-1 text-sm font-medium text-water-600"
            >
              <ChevronLeft size={16} /> Books
            </button>
          ) : (
            <p className="text-sm font-semibold text-deep-800">Choose a book</p>
          )}
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
          {book ? (
            <>
              <p className="mb-3 font-serif text-xl text-deep-900">{book.name}</p>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
                  <button
                    key={c}
                    onClick={() => onPick(book.name, c)}
                    className="flex h-10 items-center justify-center rounded-xl bg-mist-100 text-sm font-medium text-deep-700 ring-1 ring-line hover:bg-water-500 hover:text-onwater"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          ) : (
            (['OT', 'NT'] as const).map((t) => (
              <div key={t} className="mb-4">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-deep-400">
                  {t === 'OT' ? 'Old Testament' : 'New Testament'}
                </p>
                <div className="flex flex-col">
                  {BOOKS.filter((b) => b.testament === t).map((b) => (
                    <button
                      key={b.name}
                      onClick={() => (b.chapters === 1 ? onPick(b.name, 1) : setChosen(b.name))}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[0.95rem] transition hover:bg-mist-100 ${
                        b.name === current ? 'text-water-600' : 'text-deep-800'
                      }`}
                    >
                      {b.name}
                      <span className="text-xs text-deep-400">{b.chapters}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
