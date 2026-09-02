import { describe, it, expect } from 'vitest'
import {
  SABBATH_VERSES,
  sabbathVerse,
  daysUntilSabbath,
  isSabbathToday,
} from './sabbath'

// A local date fixed to a known weekday. 2026-09-06 is a Sunday (getDay 0).
function on(weekday: number): Date {
  const sunday = new Date(2026, 8, 6, 12, 0, 0) // Sun Sep 6 2026, local noon
  const d = new Date(sunday)
  d.setDate(sunday.getDate() + weekday)
  return d
}

describe('sabbathVerse', () => {
  it('wraps the seed into a valid verse, even for negatives', () => {
    for (const seed of [0, 3, SABBATH_VERSES.length, -1, -SABBATH_VERSES.length - 2, 999]) {
      expect(SABBATH_VERSES).toContain(sabbathVerse(seed))
    }
  })

  it('is stable for the same seed and rotates across seeds', () => {
    expect(sabbathVerse(2)).toBe(sabbathVerse(2))
    expect(sabbathVerse(0)).toBe(sabbathVerse(SABBATH_VERSES.length))
    expect(sabbathVerse(0)).not.toBe(sabbathVerse(1))
  })
})

describe('daysUntilSabbath', () => {
  it('is 0 on the Sabbath itself', () => {
    expect(daysUntilSabbath(0, on(0))).toBe(0) // Sunday, Sabbath = Sunday
    expect(daysUntilSabbath(3, on(3))).toBe(0)
  })

  it('counts forward, wrapping the week', () => {
    expect(daysUntilSabbath(0, on(1))).toBe(6) // Monday → next Sunday
    expect(daysUntilSabbath(6, on(0))).toBe(6) // Sunday → Saturday
    expect(daysUntilSabbath(1, on(0))).toBe(1) // Sunday → tomorrow (Monday)
  })
})

describe('isSabbathToday', () => {
  it('is true only on the chosen weekday', () => {
    expect(isSabbathToday(0, on(0))).toBe(true)
    expect(isSabbathToday(0, on(2))).toBe(false)
    expect(isSabbathToday(6, on(6))).toBe(true)
  })
})
