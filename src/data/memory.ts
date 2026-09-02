// Scripture Memory — the gentle spaced-repetition core, the reverent card
// symbols, and a small curated starter set. All pure and local-first; the store
// (memoryVerses) holds the state, this file holds the logic and the data.
//
// The schedule is a soft Leitner ladder: a new verse is due now (level 0); each
// time you recall it, it climbs a level and its next review moves further out;
// a miss brings it gently back to learning (due tomorrow), never punishing.

import type { MemoryVerse, MemorySymbol } from '../lib/types'

const DAY = 86_400_000

// Days until the next review, indexed by the level a verse *lands on*. Level 0
// (learning) is always due now. Growing, but never harsh.
export const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35, 90] as const
export const MAX_LEVEL = REVIEW_INTERVAL_DAYS.length - 1 // 6 — "rooted"

// The symbols a card can wear on its face — assigned once per verse, kept stable.
export const MEMORY_SYMBOLS: MemorySymbol[] = [
  'drop',
  'cross',
  'flame',
  'crown',
  'star',
  'book',
  'heart',
  'anchor',
]

/** A small stable hash of a string → non-negative integer. */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** A reverent symbol for a reference — deterministic, so it never changes. */
export function symbolForRef(ref: string): MemorySymbol {
  return MEMORY_SYMBOLS[hash(ref) % MEMORY_SYMBOLS.length]
}

/** Build a fresh memory verse, due immediately for its first practice. */
export function newMemoryVerse(
  ref: string,
  text: string,
  translation: string | undefined,
  now: number = Date.now(),
): MemoryVerse {
  return {
    ref,
    text,
    translation,
    addedAt: now,
    level: 0,
    dueAt: now,
    reviewCount: 0,
    symbol: symbolForRef(ref),
  }
}

/**
 * Apply the outcome of one review. Recall climbs the ladder and pushes the next
 * review out by the new level's interval; a miss returns the verse to learning,
 * due again tomorrow. Returns a new verse (never mutates).
 */
export function reviewOutcome(
  v: MemoryVerse,
  recalled: boolean,
  now: number = Date.now(),
): MemoryVerse {
  const level = recalled ? Math.min(v.level + 1, MAX_LEVEL) : 0
  const days = recalled ? REVIEW_INTERVAL_DAYS[level] : 1
  return {
    ...v,
    level,
    dueAt: now + days * DAY,
    lastReviewedAt: now,
    reviewCount: v.reviewCount + 1,
  }
}

/** Is this verse due for review now? */
export function isDue(v: MemoryVerse, now: number = Date.now()): boolean {
  return v.dueAt <= now
}

/** The verses due now, oldest-due first — the review queue. */
export function dueVerses(list: MemoryVerse[], now: number = Date.now()): MemoryVerse[] {
  return list.filter((v) => isDue(v, now)).sort((a, b) => a.dueAt - b.dueAt)
}

export type MemoryStage = 'learning' | 'known' | 'rooted'

/** Where a verse sits on its journey into the heart. */
export function stageOf(v: MemoryVerse): MemoryStage {
  if (v.level >= MAX_LEVEL) return 'rooted'
  if (v.level >= 3) return 'known'
  return 'learning'
}

export const STAGE_LABEL: Record<MemoryStage, string> = {
  learning: 'Learning',
  known: 'Known',
  rooted: 'Rooted',
}

/** A gentle, human phrasing of when a verse comes back around. */
export function nextReviewLabel(v: MemoryVerse, now: number = Date.now()): string {
  const ms = v.dueAt - now
  if (ms <= 0) return 'Due now'
  const days = Math.round(ms / DAY)
  if (days <= 0) return 'Later today'
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `In ${days} days`
  if (days < 14) return 'In a week'
  if (days < 45) return `In ${Math.round(days / 7)} weeks`
  return `In ${Math.round(days / 30)} months`
}

// A curated starter set — classic, concise verses worth hiding in the heart.
// Wordings kept close to public-domain (WEB) to stay copyright-clean. The
// anchor of the whole feature is Psalm 119:11.
export interface StarterVerse {
  ref: string
  text: string
}

export const STARTER_VERSES: StarterVerse[] = [
  {
    ref: 'Psalm 119:11',
    text: 'I have hidden your word in my heart, that I might not sin against you.',
  },
  {
    ref: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
  },
  {
    ref: 'John 3:16',
    text: 'For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.',
  },
  {
    ref: 'Proverbs 3:5–6',
    text: 'Trust in the LORD with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.',
  },
  {
    ref: 'Philippians 4:6',
    text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
  },
  {
    ref: 'Isaiah 41:10',
    text: 'Don’t be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you.',
  },
  {
    ref: 'Romans 8:28',
    text: 'We know that all things work together for good for those who love God, to those who are called according to his purpose.',
  },
  {
    ref: 'Joshua 1:9',
    text: 'Be strong and courageous. Don’t be afraid. Don’t be dismayed, for the LORD your God is with you wherever you go.',
  },
  {
    ref: 'Matthew 6:33',
    text: 'Seek first God’s Kingdom and his righteousness; and all these things will be given to you as well.',
  },
  {
    ref: 'Psalm 23:1',
    text: 'The LORD is my shepherd; I shall lack nothing.',
  },
]
