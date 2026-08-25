import { create } from 'zustand'

// The Books of Enoch — public-domain text served as static JSON from /public
// (fetched once, then cached by the service worker for offline reading). Right
// now this is 1 Enoch (R. H. Charles, 1917); the model holds a list of books so
// more can be added later.

export interface EnochChapter {
  n: number
  text: string // verbatim, with verse numbers inline (e.g. "1. … 2. …")
}

export interface EnochBookData {
  book: string
  translation: string
  source: string
  chapters: EnochChapter[]
}

export interface EnochSection {
  label: string
  from: number
  to: number
}

export interface EnochBook {
  id: string
  title: string
  subtitle: string
  attribution: string
  file: string
  chapters: number
  sections: EnochSection[]
}

export const ENOCH_BOOKS: EnochBook[] = [
  {
    id: '1-enoch',
    title: '1 Enoch',
    subtitle: 'The Ethiopic Book of Enoch',
    attribution: 'Translated by R. H. Charles, 1917 · Public Domain',
    file: '/enoch/1-enoch.json',
    chapters: 108,
    // The five traditional divisions of 1 Enoch.
    sections: [
      { label: 'The Book of the Watchers', from: 1, to: 36 },
      { label: 'The Book of Parables', from: 37, to: 71 },
      { label: 'The Astronomical Book', from: 72, to: 82 },
      { label: 'The Book of Dream Visions', from: 83, to: 90 },
      { label: 'The Epistle of Enoch', from: 91, to: 108 },
    ],
  },
  {
    id: '2-enoch',
    title: '2 Enoch',
    subtitle: 'The Slavonic Book of Enoch',
    attribution: 'Translated by W. R. Morfill & R. H. Charles · Public Domain',
    file: '/enoch/2-enoch.json',
    chapters: 68,
    // The longer (Slavonic) recension, grouped by its narrative arc.
    sections: [
      { label: 'The Ascent Through the Heavens', from: 1, to: 21 },
      { label: 'Before the Face of the Lord', from: 22, to: 38 },
      { label: 'Enoch’s Admonitions to His Sons', from: 39, to: 66 },
      { label: 'Enoch’s Assumption', from: 67, to: 68 },
    ],
  },
]

export const enochBookById = (id: string): EnochBook =>
  ENOCH_BOOKS.find((b) => b.id === id) ?? ENOCH_BOOKS[0]

interface EnochState {
  data: Record<string, EnochBookData> // by book id
  loading: string | null
  error: boolean
  load: (book: EnochBook) => Promise<void>
}

/** Loads (and caches, in memory + via the service worker) a book's JSON. */
export const useEnoch = create<EnochState>((set, get) => ({
  data: {},
  loading: null,
  error: false,
  load: async (book) => {
    if (get().data[book.id] || get().loading === book.id) return
    set({ loading: book.id, error: false })
    try {
      const res = await fetch(book.file)
      if (!res.ok) throw new Error(String(res.status))
      const json = (await res.json()) as EnochBookData
      set((s) => ({ data: { ...s.data, [book.id]: json }, loading: null }))
    } catch {
      set({ loading: null, error: true })
    }
  },
}))
