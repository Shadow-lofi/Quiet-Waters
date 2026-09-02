import { describe, it, expect } from 'vitest'
import { computeStats } from './streak'
import { dayKey, dayKeyBefore } from './date'
import type { Session } from './types'

function session(endedAt: string, actualSec = 600): Session {
  return { id: endedAt, endedAt, plannedSec: actualSec, actualSec, completed: true }
}

// An ISO timestamp for N local days ago, anchored at local noon so converting
// to/from UTC never slips across a day boundary in the test.
function daysAgoIso(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

describe('computeStats', () => {
  it('is empty for no sessions', () => {
    const s = computeStats([])
    expect(s).toMatchObject({
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalSeconds: 0,
      thisWeek: 0,
    })
    expect(s.last7).toHaveLength(7)
  })

  it('counts a current streak of consecutive days ending today', () => {
    const s = computeStats([session(daysAgoIso(0)), session(daysAgoIso(1)), session(daysAgoIso(2))])
    expect(s.currentStreak).toBe(3)
  })

  it('keeps the streak alive when the last sitting was yesterday', () => {
    const s = computeStats([session(daysAgoIso(1)), session(daysAgoIso(2))])
    expect(s.currentStreak).toBe(2)
  })

  it('breaks the current streak after a full missed day, but keeps the longest', () => {
    const s = computeStats([session(daysAgoIso(2)), session(daysAgoIso(3))])
    expect(s.currentStreak).toBe(0)
    expect(s.longestStreak).toBe(2)
  })

  it('dedupes multiple sittings on the same day for streaks', () => {
    const s = computeStats([session(daysAgoIso(0)), session(daysAgoIso(0)), session(daysAgoIso(1))])
    expect(s.currentStreak).toBe(2)
    expect(s.totalSessions).toBe(3) // totals still count every sitting
  })

  it('sums total seconds and this-week count', () => {
    const s = computeStats([session(daysAgoIso(0), 300), session(daysAgoIso(1), 600)])
    expect(s.totalSeconds).toBe(900)
    expect(s.thisWeek).toBe(2)
  })

  it('marks the right days active in last7', () => {
    const s = computeStats([session(daysAgoIso(0)), session(daysAgoIso(3))])
    const activeKeys = s.last7.filter((d) => d.active).map((d) => d.key)
    expect(activeKeys).toContain(dayKey())
    expect(activeKeys).toContain(dayKeyBefore(3))
    expect(activeKeys).toHaveLength(2)
  })
})
