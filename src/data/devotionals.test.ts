import { describe, it, expect } from 'vitest'
import {
  DEVOTIONAL_SERIES,
  seriesById,
  seriesForSoul,
  nextIncompleteDay,
  isSeriesComplete,
  completedCount,
} from './devotionals'
import { SOUL_STATES } from './soul'

describe('devotional series data', () => {
  it('has unique ids and non-empty days', () => {
    const ids = DEVOTIONAL_SERIES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of DEVOTIONAL_SERIES) {
      expect(s.days.length).toBeGreaterThan(0)
      for (const d of s.days) {
        expect(d.title && d.verseRef && d.verseText && d.reflection && d.prayer).toBeTruthy()
        expect(d.breathIn && d.breathOut).toBeTruthy() // needed for "Sit with this"
      }
    }
  })

  it('seriesById finds and misses', () => {
    expect(seriesById('be-still')?.title).toBe('Be Still')
    expect(seriesById('nope')).toBeUndefined()
  })
})

describe('seriesForSoul', () => {
  it('suggests a fitting series for its best-matching state', () => {
    expect(seriesForSoul('anxious')?.id).toBe('peace-over-anxiety')
    expect(seriesForSoul('afraid')?.id).toBe('peace-over-anxiety')
    expect(seriesForSoul('sorrowful')?.id).toBe('comfort-in-grief')
    expect(seriesForSoul('grateful')?.id).toBe('grateful-heart')
    expect(seriesForSoul('joyful')?.id).toBe('grateful-heart')
    expect(seriesForSoul('weary')?.id).toBe('be-still')
  })

  it('has a series for every soul state', () => {
    for (const s of SOUL_STATES) expect(seriesForSoul(s.id)).toBeDefined()
  })

  it('is undefined for an unknown state', () => {
    expect(seriesForSoul('nope')).toBeUndefined()
  })
})

describe('nextIncompleteDay', () => {
  it('is 0 for a fresh series', () => {
    expect(nextIncompleteDay(5, [])).toBe(0)
  })
  it('finds the first gap regardless of order', () => {
    expect(nextIncompleteDay(5, [0, 1, 3])).toBe(2)
    expect(nextIncompleteDay(5, [2, 0, 1])).toBe(3)
  })
  it('returns the length when all done', () => {
    expect(nextIncompleteDay(3, [0, 1, 2])).toBe(3)
  })
})

describe('isSeriesComplete / completedCount', () => {
  it('completes only when every day is done', () => {
    expect(isSeriesComplete(3, [0, 1])).toBe(false)
    expect(isSeriesComplete(3, [0, 1, 2])).toBe(true)
  })
  it('counts distinct in-range days only', () => {
    expect(completedCount(3, [0, 0, 1])).toBe(2) // dedup handled upstream, but be safe
    expect(completedCount(3, [0, 1, 5])).toBe(2) // out-of-range ignored
  })
})
