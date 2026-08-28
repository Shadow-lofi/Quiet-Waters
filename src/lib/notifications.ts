import { useEffect, useState } from 'react'
import { Waves, Download, RefreshCw, Sparkles, History, CalendarHeart, Flame, Star } from 'lucide-react'
import { useStore } from './store'
import { useAppUpdate } from './swUpdate'
import { useAnnouncements } from './announcements'
import { isStandalone } from './install'
import { computeStats } from './streak'
import { dayKey, dayKeyBefore, formatMinutes } from './date'
import { hasSatToday, isPastReminderTime, todaysNudge } from './reminders'
import { currentSeason } from './season'

// Streak days worth a gentle blessing — a curated set, kept sparse on purpose
// (a celebration, not a badge economy).
const STREAK_MILESTONES = [7, 14, 21, 30, 40, 60, 90, 100, 150, 200, 300, 365, 500, 730, 1000]

function milestoneLabel(days: number): string {
  if (days === 7) return 'One week of stillness'
  if (days === 30) return 'A month of stillness'
  if (days === 365) return 'A year of stillness'
  if (days === 730) return 'Two years of stillness'
  return `${days.toLocaleString()} days of stillness`
}

// The notifications inbox is a *derived* view — assembled each render from local
// state and a lightweight announcements feed, never a stored message list. Each
// item's `dismiss` writes through to the flag that governs it, so checking
// something off here and dismissing its banner are one and the same. When
// nothing is active, the inbox shows the "all caught up" rest state.

type IconComponent = typeof Waves

export interface AppNotification {
  /** Stable id for React keys and de-duping. */
  id: string
  Icon: IconComponent
  title: string
  body: string
  /** Where tapping the card leads, if anywhere. */
  to?: string
  /** Tapping opens the install walkthrough instead of navigating. */
  opensInstallGuide?: boolean
  /** Clear this item ("done") — writes through to the shared dismissal flag. */
  dismiss: () => void
}

/** A past sitting on today's month/day in an earlier year, if there is one. */
function onThisDay(
  sessions: { endedAt: string; actualSec: number }[],
  now: Date,
): { yearsAgo: number; count: number; longestSec: number } | null {
  const m = now.getMonth()
  const d = now.getDate()
  const y = now.getFullYear()
  const prior = sessions.filter((s) => {
    const dt = new Date(s.endedAt)
    return dt.getMonth() === m && dt.getDate() === d && dt.getFullYear() < y
  })
  if (prior.length === 0) return null
  const mostRecentYear = Math.max(...prior.map((s) => new Date(s.endedAt).getFullYear()))
  const longestSec = Math.max(...prior.map((s) => s.actualSec))
  return { yearsAgo: y - mostRecentYear, count: prior.length, longestSec }
}

/**
 * The live list of things asking for the user's attention: the daily stillness
 * reminder (once due), fresh announcements, an "on this day" remembrance, the
 * invitation to install, and a waiting app update. Re-renders on the minute so
 * the reminder surfaces right when it's due, and loads the announcements feed
 * once on mount.
 */
export function useNotifications(): AppNotification[] {
  const [, tick] = useState(0)
  useEffect(() => {
    void useAnnouncements.getState().load()
    const id = setInterval(() => tick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const reminderOn = useStore((s) => s.reminderOn)
  const reminderTime = useStore((s) => s.reminderTime)
  const sessions = useStore((s) => s.sessions)
  const reminderDismissedDay = useStore((s) => s.reminderDismissedDay)
  const installDismissed = useStore((s) => s.installPromptDismissed)
  const installCompleted = useStore((s) => s.installCompleted)
  const dismissedNotices = useStore((s) => s.dismissedNotices)
  const updateReady = useAppUpdate((s) => s.ready)
  const updateDismissed = useAppUpdate((s) => s.dismissed)
  const announcements = useAnnouncements((s) => s.items)

  const list: AppNotification[] = []

  const reminderDue =
    reminderOn &&
    reminderDismissedDay !== dayKey() &&
    isPastReminderTime(reminderTime) &&
    !hasSatToday(sessions)
  if (reminderDue) {
    const nudge = todaysNudge()
    list.push({
      id: 'reminder',
      Icon: Waves,
      title: "It's your time to be still",
      body: `“${nudge.body}” · ${nudge.ref}`,
      to: '/meditate',
      dismiss: () => useStore.getState().dismissReminderToday(),
    })
  }

  // Announcements (server-authored feed), newest first, minus dismissed ones.
  for (const a of announcements) {
    const id = `announce-${a.id}`
    if (dismissedNotices.includes(id)) continue
    list.push({
      id,
      Icon: Sparkles,
      title: a.title,
      body: a.body,
      to: a.url || '/updates',
      dismiss: () => useStore.getState().dismissNotice(id),
    })
  }

  // "On this day" — a gentle remembrance drawn purely from local history.
  const otd = onThisDay(sessions, new Date())
  if (otd) {
    const id = `onthisday-${dayKey()}`
    if (!dismissedNotices.includes(id)) {
      const when = otd.yearsAgo === 1 ? 'A year ago today' : `${otd.yearsAgo} years ago today`
      list.push({
        id,
        Icon: History,
        title: 'On this day',
        body: `${when} you paused here — ${formatMinutes(otd.longestSec)} of stillness. Return to the water.`,
        to: '/journey',
        dismiss: () => useStore.getState().dismissNotice(id),
      })
    }
  }

  // Weekly reflection — a gentle Sunday recap of the past week's practice
  // (the seven days ending today), shown only if there was at least one sitting.
  const now = new Date()
  if (now.getDay() === 0) {
    const weekId = `weekly-${dayKey(now)}`
    const cutoff = dayKeyBefore(6, now)
    const week = sessions.filter((s) => dayKey(new Date(s.endedAt)) >= cutoff)
    if (week.length > 0 && !dismissedNotices.includes(weekId)) {
      const totalSec = week.reduce((sum, s) => sum + s.actualSec, 0)
      const days = new Set(week.map((s) => dayKey(new Date(s.endedAt)))).size
      list.push({
        id: 'weekly',
        Icon: CalendarHeart,
        title: 'Your week of stillness',
        body: `${week.length} sitting${week.length > 1 ? 's' : ''} across ${days} day${
          days > 1 ? 's' : ''
        } — ${formatMinutes(totalSec)}. Rest well.`,
        to: '/journey',
        dismiss: () => useStore.getState().dismissNotice(weekId),
      })
    }
  }

  // Milestone blessing — a quiet celebration when the streak reaches a marker.
  // Shows the highest milestone reached that hasn't been acknowledged yet, so a
  // missed day never robs the moment.
  const streak = computeStats(sessions).currentStreak
  const milestone = STREAK_MILESTONES.filter((m) => m <= streak).pop()
  if (milestone) {
    const id = `milestone-${milestone}`
    if (!dismissedNotices.includes(id)) {
      list.push({
        id,
        Icon: Flame,
        title: milestoneLabel(milestone),
        body: 'Well done for returning, day after day. Be still, and rest in the quiet.',
        to: '/journey',
        dismiss: () => useStore.getState().dismissNotice(id),
      })
    }
  }

  // Seasonal invitation — a gentle nod to the church calendar (Advent, Lent,
  // Holy Week, Eastertide, Pentecost), offered once per occurrence and easily
  // set aside. Nothing surfaces in Ordinary Time.
  const season = currentSeason(now)
  if (season) {
    const id = `season-${season.key}`
    if (!dismissedNotices.includes(id)) {
      list.push({
        id,
        Icon: Star,
        title: season.title,
        body: season.body,
        to: season.to,
        dismiss: () => useStore.getState().dismissNotice(id),
      })
    }
  }

  if (!isStandalone() && !installCompleted && !installDismissed) {
    list.push({
      id: 'install',
      Icon: Download,
      title: 'Add Quiet Waters to your home screen',
      body: 'Full-screen, offline stillness — one tap away.',
      opensInstallGuide: true,
      dismiss: () => useStore.getState().dismissInstallPrompt(),
    })
  }

  if (updateReady && !updateDismissed) {
    list.push({
      id: 'update',
      Icon: RefreshCw,
      title: 'A new version is ready',
      body: 'See what changed and install it.',
      to: '/updates',
      dismiss: () => useAppUpdate.getState().dismiss(),
    })
  }

  return list
}
