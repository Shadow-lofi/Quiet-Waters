// The church calendar — just enough of it to offer a gentle seasonal invitation
// in the Notifications inbox (Advent, Christmas, Lent, Holy Week, Eastertide,
// Pentecost). Purely local + date-driven; no server, no stored schedule. Like
// the rest of the inbox, an invitation is offered — never an alarm — and is
// dismissible once per occurrence (the `key` carries the year).

export interface SeasonInvite {
  /** Stable per-occurrence key, e.g. "advent-2026" (used to build the notice id). */
  key: string
  title: string
  body: string
  /** Where the card leads. */
  to: string
}

// A day at local midnight, so all comparisons are date-only (no time-of-day).
function atMidnight(y: number, m: number, d: number): Date {
  return new Date(y, m, d, 0, 0, 0, 0)
}
function addDays(date: Date, n: number): Date {
  return atMidnight(date.getFullYear(), date.getMonth(), date.getDate() + n)
}
function within(now: Date, start: Date, end: Date): boolean {
  const t = atMidnight(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return t >= start.getTime() && t <= end.getTime()
}

// Western (Gregorian) Easter Sunday — the Anonymous Gregorian computus
// (Meeus/Jones/Butcher). Everything Lent→Pentecost hangs off this date.
export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return atMidnight(year, month - 1, day)
}

// The first Sunday of Advent (four Sundays before Christmas): the Sunday on or
// before Dec 24, then back three weeks.
function adventStart(year: number): Date {
  const dec24 = atMidnight(year, 11, 24)
  const fourthAdventSunday = addDays(dec24, -dec24.getDay()) // Sunday on/before Dec 24
  return addDays(fourthAdventSunday, -21)
}

/**
 * The seasonal invitation for `now`, or null in Ordinary Time. Narrow, high
 * windows (Holy Week, Pentecost) are checked before the broad ones so the most
 * fitting invitation wins. Returns at most one.
 */
export function currentSeason(now: Date = new Date()): SeasonInvite | null {
  const y = now.getFullYear()
  const easter = easterSunday(y)
  const to = '/meditate'

  // Easter-anchored seasons (all fall in the same calendar year as Easter).
  const ashWednesday = addDays(easter, -46)
  const palmSunday = addDays(easter, -7)
  const holySaturday = addDays(easter, -1)
  const pentecost = addDays(easter, 49)

  // Holy Week — Palm Sunday through Holy Saturday (inside Lent, shown instead).
  if (within(now, palmSunday, holySaturday)) {
    return {
      key: `holy-week-${y}`,
      title: 'Holy Week',
      body: 'Walk quietly toward the cross. Keep watch with Him this week — come and be still.',
      to,
    }
  }
  // Pentecost — the day and a couple after, so it is easy to catch.
  if (within(now, pentecost, addDays(pentecost, 2))) {
    return {
      key: `pentecost-${y}`,
      title: 'Pentecost',
      body: 'The Spirit was poured out like living water. Be still, and be filled.',
      to,
    }
  }
  // Eastertide — the octave of Easter (the eight days from Easter Sunday).
  if (within(now, easter, addDays(easter, 7))) {
    return {
      key: `eastertide-${y}`,
      title: 'He is risen',
      body: 'Eastertide — rest in the joy of the empty tomb. Be still, and rejoice.',
      to,
    }
  }
  // Lent — Ash Wednesday through the day before Palm Sunday.
  if (within(now, ashWednesday, addDays(palmSunday, -1))) {
    return {
      key: `lent-${y}`,
      title: 'Lent has begun',
      body: 'Forty days in the wilderness — a season to return to God in quiet. Come and be still.',
      to,
    }
  }

  // Advent & Christmas straddle the year boundary. Christmastide runs from Dec 25
  // into Jan 6 (Epiphany), so early-January days belong to the previous year's
  // Christmas; its key uses that December's year so the occurrence stays stable.
  const decChristmasStart = atMidnight(y, 11, 25)
  const janEpiphany = atMidnight(y, 0, 6)
  if (within(now, decChristmasStart, atMidnight(y, 11, 31))) {
    return christmasInvite(y, to)
  }
  if (within(now, atMidnight(y, 0, 1), janEpiphany)) {
    return christmasInvite(y - 1, to)
  }
  // Advent — first Sunday of Advent through Christmas Eve.
  if (within(now, adventStart(y), atMidnight(y, 11, 24))) {
    return {
      key: `advent-${y}`,
      title: 'Advent has begun',
      body: 'A season of waiting and watching. Keep a quiet vigil as the Light draws near — be still, and prepare Him room.',
      to,
    }
  }

  return null
}

function christmasInvite(decYear: number, to: string): SeasonInvite {
  return {
    key: `christmas-${decYear}`,
    title: 'The Word became flesh',
    body: 'Christmastide — rest in the wonder of God with us. Be still before the manger.',
    to,
  }
}
