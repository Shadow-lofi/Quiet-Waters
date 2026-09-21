// Shared scheduling rule for the alternating daily broadcast. Subscribers get
// ONE gentle push a day, not two: the day's "verse to dwell on" on odd days and
// the day's "hymn to dwell on" on even days, split by day-of-year. Both cron
// endpoints (api/daily-verse.js, api/daily-hymn.js) import this so the rule
// lives in exactly one place and the two can never disagree about whose day it
// is. Both crons are scheduled at the same UTC time; on any given day one sends
// and the other no-ops.

/** Day of the year for `now` (Jan 1 → 1), in the runtime's timezone. */
export function dayOfYear(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

/** Even day-of-year → the hymn's day; odd → the verse's day. */
export function isHymnDay(now = new Date()) {
  return dayOfYear(now) % 2 === 0
}
