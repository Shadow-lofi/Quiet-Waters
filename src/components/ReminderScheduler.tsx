import { useEffect } from 'react'
import { useStore } from '../lib/store'
import { dayKey } from '../lib/date'
import { isSabbathToday } from '../data/sabbath'
import {
  fireReminderNotification,
  fireSabbathNotification,
  hasSatToday,
  isPastReminderTime,
  notificationPermission,
} from '../lib/reminders'

/**
 * Renders nothing. While the app is running, it watches for the daily reminder
 * time and the weekly Sabbath, and — if allowed — shows a soft device
 * notification, but only when the app is backgrounded, since the in-app banner
 * and SabbathCard already handle the case where you're looking at the screen. At
 * most one of each per day. There is no server, so nothing fires while the app
 * is fully closed (by design).
 */
export function ReminderScheduler() {
  useEffect(() => {
    const backgrounded = () => document.visibilityState === 'hidden'

    const checkDaily = () => {
      const st = useStore.getState()
      if (!st.reminderOn) return
      if (notificationPermission() !== 'granted') return
      if (st.reminderNotifiedDay === dayKey()) return
      if (!isPastReminderTime(st.reminderTime)) return
      if (hasSatToday(st.sessions)) return
      // Don't interrupt someone already in the app — the banner covers that.
      if (!backgrounded()) return
      void fireReminderNotification()
      st.markReminderNotified()
    }

    const checkSabbath = () => {
      const st = useStore.getState()
      if (!st.sabbathReminderOn) return
      if (notificationPermission() !== 'granted') return
      if (!isSabbathToday(st.sabbathDay)) return
      if (st.sabbathNotifiedDay === dayKey()) return
      if (!isPastReminderTime(st.sabbathReminderTime)) return
      // Already chose to rest today? No need to nudge — the card covers it.
      if (st.sabbathLog.includes(dayKey())) return
      if (!backgrounded()) return
      void fireSabbathNotification()
      st.markSabbathNotified()
    }

    const check = () => {
      checkDaily()
      checkSabbath()
    }

    const id = setInterval(check, 30_000)
    document.addEventListener('visibilitychange', check)
    check()
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  return null
}
