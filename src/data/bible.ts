// Bible reader data. Passage TEXT is fetched at runtime from bible-api.com
// (public-domain translations, CORS-enabled) — see src/lib/bible.ts. This file
// only holds the small static structure: the book list (for the picker), the
// available public-domain translations, and the highlight palette.

export interface BibleBook {
  name: string
  chapters: number
  testament: 'OT' | 'NT'
}

export const BOOKS: BibleBook[] = [
  { name: 'Genesis', chapters: 50, testament: 'OT' },
  { name: 'Exodus', chapters: 40, testament: 'OT' },
  { name: 'Leviticus', chapters: 27, testament: 'OT' },
  { name: 'Numbers', chapters: 36, testament: 'OT' },
  { name: 'Deuteronomy', chapters: 34, testament: 'OT' },
  { name: 'Joshua', chapters: 24, testament: 'OT' },
  { name: 'Judges', chapters: 21, testament: 'OT' },
  { name: 'Ruth', chapters: 4, testament: 'OT' },
  { name: '1 Samuel', chapters: 31, testament: 'OT' },
  { name: '2 Samuel', chapters: 24, testament: 'OT' },
  { name: '1 Kings', chapters: 22, testament: 'OT' },
  { name: '2 Kings', chapters: 25, testament: 'OT' },
  { name: '1 Chronicles', chapters: 29, testament: 'OT' },
  { name: '2 Chronicles', chapters: 36, testament: 'OT' },
  { name: 'Ezra', chapters: 10, testament: 'OT' },
  { name: 'Nehemiah', chapters: 13, testament: 'OT' },
  { name: 'Esther', chapters: 10, testament: 'OT' },
  { name: 'Job', chapters: 42, testament: 'OT' },
  { name: 'Psalms', chapters: 150, testament: 'OT' },
  { name: 'Proverbs', chapters: 31, testament: 'OT' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'OT' },
  { name: 'Song of Solomon', chapters: 8, testament: 'OT' },
  { name: 'Isaiah', chapters: 66, testament: 'OT' },
  { name: 'Jeremiah', chapters: 52, testament: 'OT' },
  { name: 'Lamentations', chapters: 5, testament: 'OT' },
  { name: 'Ezekiel', chapters: 48, testament: 'OT' },
  { name: 'Daniel', chapters: 12, testament: 'OT' },
  { name: 'Hosea', chapters: 14, testament: 'OT' },
  { name: 'Joel', chapters: 3, testament: 'OT' },
  { name: 'Amos', chapters: 9, testament: 'OT' },
  { name: 'Obadiah', chapters: 1, testament: 'OT' },
  { name: 'Jonah', chapters: 4, testament: 'OT' },
  { name: 'Micah', chapters: 7, testament: 'OT' },
  { name: 'Nahum', chapters: 3, testament: 'OT' },
  { name: 'Habakkuk', chapters: 3, testament: 'OT' },
  { name: 'Zephaniah', chapters: 3, testament: 'OT' },
  { name: 'Haggai', chapters: 2, testament: 'OT' },
  { name: 'Zechariah', chapters: 14, testament: 'OT' },
  { name: 'Malachi', chapters: 4, testament: 'OT' },
  { name: 'Matthew', chapters: 28, testament: 'NT' },
  { name: 'Mark', chapters: 16, testament: 'NT' },
  { name: 'Luke', chapters: 24, testament: 'NT' },
  { name: 'John', chapters: 21, testament: 'NT' },
  { name: 'Acts', chapters: 28, testament: 'NT' },
  { name: 'Romans', chapters: 16, testament: 'NT' },
  { name: '1 Corinthians', chapters: 16, testament: 'NT' },
  { name: '2 Corinthians', chapters: 13, testament: 'NT' },
  { name: 'Galatians', chapters: 6, testament: 'NT' },
  { name: 'Ephesians', chapters: 6, testament: 'NT' },
  { name: 'Philippians', chapters: 4, testament: 'NT' },
  { name: 'Colossians', chapters: 4, testament: 'NT' },
  { name: '1 Thessalonians', chapters: 5, testament: 'NT' },
  { name: '2 Thessalonians', chapters: 3, testament: 'NT' },
  { name: '1 Timothy', chapters: 6, testament: 'NT' },
  { name: '2 Timothy', chapters: 4, testament: 'NT' },
  { name: 'Titus', chapters: 3, testament: 'NT' },
  { name: 'Philemon', chapters: 1, testament: 'NT' },
  { name: 'Hebrews', chapters: 13, testament: 'NT' },
  { name: 'James', chapters: 5, testament: 'NT' },
  { name: '1 Peter', chapters: 5, testament: 'NT' },
  { name: '2 Peter', chapters: 3, testament: 'NT' },
  { name: '1 John', chapters: 5, testament: 'NT' },
  { name: '2 John', chapters: 1, testament: 'NT' },
  { name: '3 John', chapters: 1, testament: 'NT' },
  { name: 'Jude', chapters: 1, testament: 'NT' },
  { name: 'Revelation', chapters: 22, testament: 'NT' },
]

export const bookByName = (name: string): BibleBook | undefined => BOOKS.find((b) => b.name === name)

// Single-chapter books need an explicit verse range from bible-api.com: it reads
// "Jude 1" as verse 1, not the whole book, so we request "Jude 1:1-<verses>".
// Traditional verse counts, stable across the public-domain translations here.
export const SINGLE_CHAPTER_VERSES: Record<string, number> = {
  Obadiah: 21,
  Philemon: 25,
  '2 John': 13,
  '3 John': 14,
  Jude: 25,
}

// Public-domain translations offered in the reader (bible-api.com identifiers).
export interface Translation {
  id: string
  name: string
  short: string
}

export const TRANSLATIONS: Translation[] = [
  { id: 'web', name: 'World English Bible', short: 'WEB' },
  { id: 'kjv', name: 'King James Version', short: 'KJV' },
  { id: 'asv', name: 'American Standard Version', short: 'ASV' },
  { id: 'bbe', name: 'Bible in Basic English', short: 'BBE' },
]

export const DEFAULT_TRANSLATION = 'web'

export const translationById = (id: string): Translation =>
  TRANSLATIONS.find((t) => t.id === id) ?? TRANSLATIONS[0]

// Highlight colors for the reader. `bg` tints the verse in-line (soft, so the
// serif text stays readable in both Day and Night); `swatch` is the picker dot.
export interface HighlightColor {
  id: string
  label: string
  bg: string
  swatch: string
}

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  { id: 'water', label: 'Water', bg: 'rgba(77, 172, 188, 0.34)', swatch: '#4dacbc' },
  { id: 'reed', label: 'Reed', bg: 'rgba(139, 181, 154, 0.34)', swatch: '#8bb59a' },
  { id: 'gold', label: 'Gold', bg: 'rgba(224, 180, 82, 0.36)', swatch: '#e0b452' },
  { id: 'rose', label: 'Rose', bg: 'rgba(214, 122, 122, 0.32)', swatch: '#d67a7a' },
  { id: 'sky', label: 'Sky', bg: 'rgba(125, 178, 219, 0.34)', swatch: '#7db2db' },
  { id: 'violet', label: 'Violet', bg: 'rgba(160, 130, 200, 0.32)', swatch: '#a082c8' },
]

export const highlightById = (id?: string): HighlightColor | undefined =>
  id ? HIGHLIGHT_COLORS.find((c) => c.id === id) : undefined
