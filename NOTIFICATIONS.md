# Notifications — backlog & log

A pull-from list for Quiet Waters' notification system: the in-app **inbox**
(derived items + an "all caught up" rest state) and **web-push broadcasts**
(reach the phone even when the app is closed). Pull the next item from the top of
"Next up," build it, then move it to "Shipped."

**Guiding tone.** This is a calm, reverent app. Every notification is an
*invitation, never an alarm*: opt-in, low-frequency, instantly silenceable, and
never guilt-tripping or gamified. When in doubt, send less.

**Channels.** `inbox` = shows in the in-app Notifications page. `push` = sent to
the device. `both` = ideally appears in the inbox *and* pings the phone.

**Infra legend.** 🟢 uses what's already built · 🟡 small addition · 🔴 needs new
backend (cron + per-user schedule/timezone, i.e. the "phase 2" lift).

---

## Shipped ✅

| Item | Channel | Notes |
|---|---|---|
| Notifications inbox + "All caught up" rest state | inbox | Cross-over-lake empty state; derived list |
| Local daily reminder | inbox | In-app banner + foreground device notification (no server) |
| Install invite | inbox | Reuses the home-screen install prompt's flag |
| "New version ready" | inbox | Detected client-side by the service worker |
| **New feature / version announcement** | push | Manual broadcast via `scripts/broadcast.mjs` |
| **Daily verse / prayer of the day** | push | Cron broadcast, 13:00 UTC (`api/daily-verse`) |
| **Announcements feed → inbox** | both | `public/announcements.json` → inbox cards; network-first SW; the enabler |
| **"On this day"** | inbox | Remembrance from local session history (same month/day, prior year) |
| **Weekly reflection** | inbox | Sunday recap of the past week's sittings, from local data |
| **Milestone blessing** | inbox | Quiet celebration when the streak reaches a marker (7, 30, 40, 365…) |
| **Seasonal / liturgical invitations** | inbox | Church-calendar invitation (Advent, Christmas, Lent, Holy Week, Eastertide, Pentecost) via `src/lib/season.ts` — a date-driven derived notice, dismissible per occurrence; nothing in Ordinary Time. Push side can broadcast later when enabled. |
| **New guided-session announcement** | both | First use: **Evening Rest** (a Compline sitting) — a `public/announcements.json` entry → inbox card. Repeat this for each new sitting/series. |

---

## Next up (low infra, high value)

_The low-infra inbox items are all shipped. To announce the **next** new sitting
or series, drop a `public/announcements.json` entry (the pattern used for Evening
Rest) — and, once web-push is wired up, an optional broadcast to ping phones._

The remaining pulls need the phase-2 backend (per-user schedule + timezone) or
careful design — see **Later** below. Or add fresh content that carries its own
announcement (a new guided series, a themed collection).

---

## Later (needs the phase-2 backend or careful design)

| Item | Channel | Infra | Notes |
|---|---|---|---|
| Personalized daily reminder to the phone | push | 🔴 | Per-user time + timezone stored server-side; the big lift |
| Midday / evening reminder slots | both | 🟡–🔴 | Extra local slots now; pushed versions need per-user schedules |
| Gentle streak-at-risk nudge | push | 🔴 | Opt-in, capped, softly worded — never FOMO |
| Warm return-after-absence | push | 🔴 | Needs last-active tracking; rare, hard frequency cap |
| Sabbath rhythm | both | 🟡 | Weekly "set this hour apart" |
| Onboarding-finish nudge | inbox | 🟢 | "Set a reminder time to build the rhythm" — no push |

---

## Someday / needs accounts

- "A friend you invited joined" / shared prayer / intercession — requires user
  accounts, which this no-account, local-first app doesn't have. Parked.

---

## Cross-cutting ideas

- **Per-type preferences** — let users choose which broadcast types they get
  (announcements vs daily verse). Needs storing prefs with the subscription.
- **Quiet hours** — never deliver pushes during a user's chosen quiet window.
- **Frequency cap** — a global ceiling so the app never feels noisy.
