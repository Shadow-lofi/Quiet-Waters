import { useEffect, useState } from 'react'
import { Waves, Download, RefreshCw } from 'lucide-react'
import { useStore } from './store'
import { useAppUpdate } from './swUpdate'
import { isStandalone } from './install'
import { dayKey } from './date'
import { hasSatToday, isPastReminderTime, todaysNudge } from './reminders'

// The notifications inbox is a *derived* view — the app keeps no server and no
// stored message list. Each item is computed from the same local state that
// drives the home-screen banners, and its `dismiss` reuses the very same flag,
// so marking something "done" in the inbox and dismissing its banner are one
// and the same. When nothing is active, the inbox shows the "all caught up"
// rest state (see components/AllCaughtUp).

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

/**
 * The live list of things asking for the user's attention, newest-intent first:
 * the daily stillness reminder (once its time has passed and today's sitting is
 * still undone), the invitation to install, and a waiting app update. Re-renders
 * on the minute so the reminder appears right when it's due.
 */
export function useNotifications(): AppNotification[] {
  // Tick each minute so a time-gated reminder surfaces even on an idle screen.
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const reminderOn = useStore((s) => s.reminderOn)
  const reminderTime = useStore((s) => s.reminderTime)
  const sessions = useStore((s) => s.sessions)
  const reminderDismissedDay = useStore((s) => s.reminderDismissedDay)
  const installDismissed = useStore((s) => s.installPromptDismissed)
  const installCompleted = useStore((s) => s.installCompleted)
  const updateReady = useAppUpdate((s) => s.ready)
  const updateDismissed = useAppUpdate((s) => s.dismissed)

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
