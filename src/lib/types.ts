// Appearance preference. 'auto' follows the OS light/dark setting; 'cycle'
// follows the local time of day (light by day, dark by night).
export type ThemePref = 'day' | 'night' | 'auto' | 'cycle'

// Breath-prayer pacing for the breathing guide. 'off' shows a still circle.
export type BreathPace = 'off' | 'gentle' | 'calm' | 'deep'

// Optional ambient sound played during a sitting. All synthesized in-browser.
export type Soundscape = 'off' | 'fire'

// Animation preference. 'system' follows the OS reduced-motion setting; 'on'
// forces the gentle animations even when the OS asks to reduce motion; 'off'
// disables them regardless.
export type MotionPref = 'system' | 'on' | 'off'

// One completed (or ended-early) meditation sitting.
export interface Session {
  id: string
  endedAt: string // ISO timestamp
  plannedSec: number // the duration the user chose
  actualSec: number // how long they actually sat
  completed: boolean // reached the closing chime (vs. ended early)
  verseRef?: string // the Scripture they dwelt on
}

// A verse the reader has marked — highlight color, a note, a label, and/or a
// plain bookmark, all on one record keyed by the canonical reference. A record
// with none of those is pruned. Local-first: lives in the persisted store.
export interface SavedVerse {
  ref: string // "Book Chapter:Verse", e.g. "John 3:16" — the key
  text: string // verse text at save time
  translation: string // translation id it was first saved from
  color?: string // highlight color id (see HIGHLIGHT_COLORS)
  note?: string
  label?: string
  bookmarked?: boolean // a plain save with no color/note
  createdAt: number
}

// A prayer the user is holding before God. When answered, `answeredAt` is set
// and it settles into the "answered" record — a quiet history of faithfulness.
// Local-first: lives in the persisted store.
export interface PrayerRequest {
  id: string
  text: string
  createdAt: number
  answeredAt?: number // set when marked answered
}

// A one-tap check-in on the state of one's soul before a sitting. `state` is a
// SoulState id (see data/soul.ts). Kept as a bounded local log so the Journey
// can gently reflect how the soul has been lately. Local-first.
export interface SoulCheckin {
  state: string
  at: number
}

// A reverent symbol shown on the face of a memory flashcard (see MemorySymbol).
export type MemorySymbol =
  | 'drop'
  | 'cross'
  | 'flame'
  | 'crown'
  | 'star'
  | 'book'
  | 'heart'
  | 'anchor'

// A verse the user is hiding in their heart. Practiced as a flip flashcard and
// resurfaced on a gentle spaced-repetition schedule: each recall pushes `dueAt`
// further out (by `level`); a miss brings it back to learning. Local-first.
export interface MemoryVerse {
  ref: string // canonical reference, the key ("Psalm 46:10")
  text: string
  translation?: string // translation id/short it was added from, if known
  addedAt: number
  level: number // 0 = learning; higher boxes = longer intervals
  dueAt: number // ms timestamp of the next review
  lastReviewedAt?: number
  reviewCount: number
  symbol: MemorySymbol // the face shown on the card front
}

// A verse tapped in the reader — the working target for the verse action sheet.
export interface SelectedVerse {
  ref: string
  text: string
  translation: string
  book: string
  chapter: number
  verse: number
}
