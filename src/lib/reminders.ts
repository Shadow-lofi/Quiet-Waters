// Gentle daily reminder — deliberately local-first, no server or push backend.
//
// Two ways it reaches you, and never more than one nudge per day:
//   • an in-app banner when you open Quiet Waters after your chosen time and
//     haven't sat yet (works everywhere, no permission needed);
//   • a soft device notification if you've allowed them AND the app is running
//     in the background when your time arrives (installed desktop/Android PWAs).
// A reminder that fires while the app is fully closed would need a push server,
// which this app intentionally doesn't have — the banner is the reliable path.

import { dayKey } from './date'
import type { Session } from './types'

export const NOTIFICATIONS_SUPPORTED =
  typeof window !== 'undefined' && 'Notification' in window

/** 'granted' | 'denied' | 'default' | 'unsupported'. */
export function notificationPermission(): NotificationPermission | 'unsupported' {
  return NOTIFICATIONS_SUPPORTED ? Notification.permission : 'unsupported'
}

/** Ask the browser to allow notifications. Must be called from a user gesture. */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!NOTIFICATIONS_SUPPORTED) return 'denied'
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/** True if any sitting was logged on today's local calendar day. */
export function hasSatToday(sessions: Session[]): boolean {
  const today = dayKey()
  return sessions.some((s) => dayKey(new Date(s.endedAt)) === today)
}

/** Minutes-since-midnight for a 'HH:MM' string (safe fallback to 8:00). */
function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return 8 * 60
  return h * 60 + m
}

/** Has the local clock reached the reminder time today? */
export function isPastReminderTime(hhmm: string, now: Date = new Date()): boolean {
  return now.getHours() * 60 + now.getMinutes() >= timeToMinutes(hhmm)
}

/** '08:00' → '8:00 AM' for display. */
export function formatReminderTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

// A small rotation of warm invitations so the nudge doesn't feel like the same
// alarm every day. Chosen deterministically by the day, so it's stable within a
// day but gently different across days. Wordings kept public-domain (WEB/KJV).
interface Nudge {
  title: string
  body: string
  ref: string
}

const NUDGES: Nudge[] = [
  { title: 'A moment to be still', body: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
  { title: 'Come and rest', body: 'Come to me, and I will give you rest.', ref: 'Matthew 11:28' },
  { title: 'Quiet waters', body: 'He leads me beside still waters.', ref: 'Psalm 23:2' },
  { title: 'Wait on Him', body: 'My soul waits in silence for God alone.', ref: 'Psalm 62:1' },
  { title: 'A little while apart', body: 'Come away by yourselves and rest a while.', ref: 'Mark 6:31' },
  { title: 'Peace, be still', body: 'You will keep him in perfect peace whose mind is stayed on You.', ref: 'Isaiah 26:3' },
  { title: 'Return and rest', body: 'In returning and rest you shall be saved; in quietness and trust is your strength.', ref: 'Isaiah 30:15' },
]

/** The gentle line for today — stable within the day, rotates across days. */
export function todaysNudge(now: Date = new Date()): Nudge {
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return NUDGES[dayOfYear % NUDGES.length]
}

/**
 * Show today's reminder as a device notification. Prefers the service worker
 * registration (fires even when the tab is backgrounded, and is required on
 * some platforms); falls back to a plain Notification.
 */
export async function fireReminderNotification(): Promise<void> {
  if (notificationPermission() !== 'granted') return
  const nudge = todaysNudge()
  const options: NotificationOptions = {
    body: `“${nudge.body}” — ${nudge.ref}`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'quiet-waters-daily', // replaces any earlier one; never stacks
  }
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) {
      await reg.showNotification(nudge.title, options)
      return
    }
  } catch {
    // fall through to the plain Notification path
  }
  try {
    new Notification(nudge.title, options)
  } catch {
    // notifications unavailable — the in-app banner still covers the user
  }
}
