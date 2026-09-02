import { describe, it, expect } from 'vitest'
import {
  newMemoryVerse,
  reviewOutcome,
  isDue,
  dueVerses,
  stageOf,
  symbolForRef,
  nextReviewLabel,
  MEMORY_SYMBOLS,
  MAX_LEVEL,
  REVIEW_INTERVAL_DAYS,
} from './memory'

const DAY = 86_400_000
const T0 = 1_700_000_000_000 // a fixed "now"

describe('newMemoryVerse', () => {
  it('starts at level 0, due immediately, with a stable symbol', () => {
    const v = newMemoryVerse('Psalm 46:10', 'Be still…', 'web', T0)
    expect(v).toMatchObject({ ref: 'Psalm 46:10', level: 0, dueAt: T0, reviewCount: 0 })
    expect(isDue(v, T0)).toBe(true)
    expect(MEMORY_SYMBOLS).toContain(v.symbol)
    expect(v.symbol).toBe(symbolForRef('Psalm 46:10')) // deterministic
  })
})

describe('reviewOutcome', () => {
  it('climbs a level on recall and pushes the next review out', () => {
    const v = newMemoryVerse('John 3:16', 'For God…', undefined, T0)
    const r1 = reviewOutcome(v, true, T0)
    expect(r1.level).toBe(1)
    expect(r1.dueAt).toBe(T0 + REVIEW_INTERVAL_DAYS[1] * DAY)
    expect(r1.reviewCount).toBe(1)

    const r2 = reviewOutcome(r1, true, r1.dueAt)
    expect(r2.level).toBe(2)
    expect(r2.dueAt).toBe(r1.dueAt + REVIEW_INTERVAL_DAYS[2] * DAY)
  })

  it('caps at MAX_LEVEL', () => {
    let v = newMemoryVerse('x', 'y', undefined, T0)
    for (let i = 0; i < 20; i++) v = reviewOutcome(v, true, v.dueAt)
    expect(v.level).toBe(MAX_LEVEL)
    expect(v.dueAt).toBe(v.lastReviewedAt! + REVIEW_INTERVAL_DAYS[MAX_LEVEL] * DAY)
  })

  it('a miss returns the verse to learning, due tomorrow', () => {
    const v = reviewOutcome(newMemoryVerse('x', 'y', undefined, T0), true, T0) // level 1
    const missed = reviewOutcome(v, false, T0 + 5 * DAY)
    expect(missed.level).toBe(0)
    expect(missed.dueAt).toBe(T0 + 5 * DAY + DAY)
    expect(missed.reviewCount).toBe(2)
  })

  it('never mutates the input', () => {
    const v = newMemoryVerse('x', 'y', undefined, T0)
    const snapshot = { ...v }
    reviewOutcome(v, true, T0)
    expect(v).toEqual(snapshot)
  })
})

describe('dueVerses', () => {
  it('returns only due verses, oldest-due first', () => {
    const a = { ...newMemoryVerse('a', 't', undefined, T0), dueAt: T0 - 2 * DAY }
    const b = { ...newMemoryVerse('b', 't', undefined, T0), dueAt: T0 - 5 * DAY }
    const c = { ...newMemoryVerse('c', 't', undefined, T0), dueAt: T0 + 3 * DAY }
    const q = dueVerses([a, b, c], T0)
    expect(q.map((v) => v.ref)).toEqual(['b', 'a'])
  })
})

describe('stageOf', () => {
  it('maps levels to learning / known / rooted', () => {
    const base = newMemoryVerse('x', 'y', undefined, T0)
    expect(stageOf({ ...base, level: 0 })).toBe('learning')
    expect(stageOf({ ...base, level: 2 })).toBe('learning')
    expect(stageOf({ ...base, level: 3 })).toBe('known')
    expect(stageOf({ ...base, level: MAX_LEVEL })).toBe('rooted')
  })
})

describe('nextReviewLabel', () => {
  it('phrases the gap gently', () => {
    const base = newMemoryVerse('x', 'y', undefined, T0)
    expect(nextReviewLabel({ ...base, dueAt: T0 - DAY }, T0)).toBe('Due now')
    expect(nextReviewLabel({ ...base, dueAt: T0 + DAY }, T0)).toBe('Tomorrow')
    expect(nextReviewLabel({ ...base, dueAt: T0 + 3 * DAY }, T0)).toBe('In 3 days')
    expect(nextReviewLabel({ ...base, dueAt: T0 + 30 * DAY }, T0)).toBe('In 4 weeks')
  })
})
