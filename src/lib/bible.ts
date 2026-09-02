// Fetches passage text from bible-api.com (public-domain translations, CORS
// enabled). One chapter per request. Fetched chapters are cached in localStorage
// so re-reads are instant, work offline, and stay light on the free API.
import { DEFAULT_TRANSLATION, SINGLE_CHAPTER_VERSES } from '../data/bible'

export interface BibleVerse {
  book_name: string
  chapter: number
  verse: number
  text: string
}

export interface Passage {
  reference: string
  translation: string
  verses: BibleVerse[]
}

const CACHE_PREFIX = 'qw-bible:v1:'
const cacheKey = (ref: string, translation: string) => `${CACHE_PREFIX}${translation}:${ref}`

function readCache(ref: string, translation: string): Passage | null {
  try {
    const raw = localStorage.getItem(cacheKey(ref, translation))
    return raw ? (JSON.parse(raw) as Passage) : null
  } catch {
    return null
  }
}

function writeCache(ref: string, translation: string, passage: Passage) {
  try {
    localStorage.setItem(cacheKey(ref, translation), JSON.stringify(passage))
  } catch {
    // Quota exceeded or private mode — reading still works, just uncached.
  }
}

/**
 * Fetch a single chapter by reference, e.g. "John 1". Serves from the
 * localStorage cache when available; throws on network/API error so the caller
 * can show a retry state.
 */
export async function fetchPassage(ref: string, translation = DEFAULT_TRANSLATION): Promise<Passage> {
  // For a single-chapter book, `ref` is "Book 1"; bible-api needs the full verse
  // range or it returns only verse 1. `need` is that book's verse count.
  const m = ref.match(/^(.+) 1$/)
  const need = m ? SINGLE_CHAPTER_VERSES[m[1]] : undefined

  const cached = readCache(ref, translation)
  // Serve the cache, except a single-chapter entry saved before this fix (which
  // holds only verse 1) — re-fetch it in full.
  if (cached && (need === undefined || cached.verses.length >= need)) return cached

  const query = need ? `${ref}:1-${need}` : ref
  const url = `https://bible-api.com/${encodeURIComponent(query)}?translation=${encodeURIComponent(translation)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${ref} (${res.status})`)
  const data = await res.json()
  if (!data || !Array.isArray(data.verses) || data.verses.length === 0) {
    throw new Error(`No text found for ${ref}`)
  }

  const passage: Passage = {
    reference: data.reference || ref,
    translation: data.translation_name || translation,
    verses: data.verses.map((v: BibleVerse) => ({
      book_name: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      // The API pads verse text with newlines/spaces — collapse to a clean string.
      text: String(v.text).replace(/\s+/g, ' ').trim(),
    })),
  }
  writeCache(ref, translation, passage)
  return passage
}
