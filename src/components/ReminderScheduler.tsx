import { useEffect } from 'react'
import { useStore } from '../lib/store'
import { dayKey } from '../lib/date'
import {
  fireReminderNotification,
  hasSatToday,
  isPastReminderTime,
  notificationPermission,
} from '../lib/reminders'

/**
 * Renders nothing. While the app is running, it watches for the daily reminder
 * time and, if allowed, shows a soft device notification — but only when the
 * app is backgrounded, since the in-app banner already handles the case where
 * you're looking at the screen. At most one notification per day. There is no
 * server, so nothing fires while the app is fully closed (by design).
 */
export function ReminderScheduler() {
  useEffect(() => {
    const check = () => {
      const st = useStore.getState()
      if (!st.reminderOn) return
      if (notificationPermission() !== 'granted') return
      if (st.reminderNotifiedDay === dayKey()) return
      if (!isPastReminderTime(st.reminderTime)) return
      if (hasSatToday(st.sessions)) return
      // Don't interrupt someone already in the app — the banner covers that.
      if (document.visibilityState !== 'hidden') return
      void fireReminderNotification()
      st.markReminderNotified()
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
