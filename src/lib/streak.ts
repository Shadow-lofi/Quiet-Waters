import { dayKey, dayKeyBefore, daysBetween } from './date'
import type { Session } from './types'

export interface Stats {
  currentStreak: number
  longestStreak: number
  totalSessions: number
  totalSeconds: number
  thisWeek: number // sittings in the last 7 local days
  /** Last 7 days, oldest→newest: whether a session landed on each day. */
  last7: { key: string; active: boolean }[]
}

/** Distinct local-day keys that have at least one session, newest first. */
function activeDays(sessions: Session[]): string[] {
  const set = new Set<string>()
  for (const s of sessions) set.add(dayKey(new Date(s.endedAt)))
  return [...set].sort().reverse()
}

export function computeStats(sessions: Session[]): Stats {
  const days = activeDays(sessions)

  // Current streak: consecutive days ending today or yesterday (so an unbroken
  // habit isn't marked "lost" until a full day has actually been missed).
  let currentStreak = 0
  if (days.length) {
    const today = dayKey()
    const gapFromToday = daysBetween(days[0], today)
    if (gapFromToday <= 1) {
      currentStreak = 1
      for (let i = 1; i < days.length; i++) {
        if (daysBetween(days[i], days[i - 1]) === 1) currentStreak++
        else break
      }
    }
  }

  // Longest streak across all history.
  let longestStreak = 0
  let run = 0
  for (let i = 0; i < days.length; i++) {
    if (i === 0 || daysBetween(days[i], days[i - 1]) === 1) run++
    else run = 1
    if (run > longestStreak) longestStreak = run
  }

  const activeSet = new Set(days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const key = dayKeyBefore(6 - i)
    return { key, active: activeSet.has(key) }
  })

  const totalSeconds = sessions.reduce((sum, s) => sum + s.actualSec, 0)
  const thisWeek = last7.filter((d) => d.active).length

  return {
    currentStreak,
    longestStreak,
    totalSessions: sessions.length,
    totalSeconds,
    thisWeek,
    last7,
  }
}
