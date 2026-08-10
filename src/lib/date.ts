// Local-day helpers. Streaks are counted by the user's local calendar day, so
// a late-night sitting still lands on the right day.

/** YYYY-MM-DD for the given date in the local timezone. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** dayKey for N days before the given date. */
export function dayKeyBefore(n: number, from: Date = new Date()): string {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return dayKey(d)
}

/** Whole days between two YYYY-MM-DD keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const ta = Date.UTC(ay, am - 1, ad)
  const tb = Date.UTC(by, bm - 1, bd)
  return Math.round((tb - ta) / 86_400_000)
}

/** e.g. "12 min" or "1 hr 5 min". */
export function formatMinutes(totalSec: number): string {
  const min = Math.round(totalSec / 60)
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

/** mm:ss for the live countdown. */
export function formatClock(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}
