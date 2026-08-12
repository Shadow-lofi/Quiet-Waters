import { useEffect, useState } from 'react'
import { Waves, X } from 'lucide-react'
import { useStore } from '../lib/store'
import { dayKey } from '../lib/date'
import { hasSatToday, isPastReminderTime, todaysNudge } from '../lib/reminders'

/**
 * A soft invitation shown on the home screen when the daily reminder time has
 * passed and you haven't sat yet today. This is the reliable, permission-free
 * half of the reminder (see src/lib/reminders.ts). Dismissing it, or beginning
 * a sitting, quiets it for the rest of the day.
 */
export function ReminderBanner({ onBegin }: { onBegin: () => void }) {
  const reminderOn = useStore((s) => s.reminderOn)
  const reminderTime = useStore((s) => s.reminderTime)
  const sessions = useStore((s) => s.sessions)
  const dismissedDay = useStore((s) => s.reminderDismissedDay)
  const dismiss = useStore((s) => s.dismissReminderToday)

  // Re-check each minute so the banner appears when the time arrives even if
  // the app was already open and idle.
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const due =
    reminderOn &&
    dismissedDay !== dayKey() &&
    isPastReminderTime(reminderTime) &&
    !hasSatToday(sessions)

  if (!due) return null

  const nudge = todaysNudge()

  return (
    <section className="qw-enter rounded-card bg-card p-5 shadow-sm ring-1 ring-water-500/25">
      <div className="flex items-start gap-3">
        <span className="qw-float mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <Waves size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-deep-900">It's your time to be still</p>
          <p className="mt-1 font-serif text-lg leading-snug text-deep-700">
            “{nudge.body}”
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-water-600">{nudge.ref}</p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss reminder"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-400 hover:bg-mist-200 hover:text-deep-600"
        >
          <X size={16} />
        </button>
      </div>
      <button
        onClick={() => {
          dismiss()
          onBegin()
        }}
        className="mt-4 w-full rounded-full bg-water-500 py-2.5 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
      >
        Begin a sitting
      </button>
    </section>
  )
}
