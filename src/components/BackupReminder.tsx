import { X, ShieldCheck } from 'lucide-react'
import { useStore } from '../lib/store'
import { useBackup } from '../lib/useBackup'
import { backupReminderDue } from '../lib/backupReminder'

/**
 * A gentle, dismissible nudge to save a backup — the safety net for a local-first
 * app with no account. Shows on the home screen when the user has data worth
 * keeping and either has never backed up, or hasn't in a while (with newer
 * activity since). "Back up now" saves a file and resets the reminder; the ✕
 * snoozes it. Purely local; no accounts, no cloud.
 */
export function BackupReminder() {
  const sessions = useStore((s) => s.sessions)
  const savedVerses = useStore((s) => s.savedVerses)
  const prayers = useStore((s) => s.prayers)
  const memoryVerses = useStore((s) => s.memoryVerses)
  const soulLog = useStore((s) => s.soulLog)
  const lastBackupAt = useStore((s) => s.lastBackupAt)
  const backupSnoozedUntil = useStore((s) => s.backupSnoozedUntil)
  const snooze = useStore((s) => s.snoozeBackupReminder)
  const backup = useBackup()

  const hasData =
    sessions.length > 0 ||
    Object.keys(savedVerses).length > 0 ||
    prayers.length > 0 ||
    memoryVerses.length > 0 ||
    soulLog.length > 0
  const latestActivityAt = sessions.length ? Date.parse(sessions[0].endedAt) || null : null

  const due = backupReminderDue({
    now: Date.now(),
    lastBackupAt,
    backupSnoozedUntil,
    hasData,
    latestActivityAt,
  })
  if (!due) return null

  const neverBackedUp = lastBackupAt == null

  return (
    <section className="qw-enter rounded-card bg-card p-5 shadow-sm ring-1 ring-line">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <ShieldCheck size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-deep-900">Keep your data safe</p>
          <p className="mt-0.5 text-sm leading-relaxed text-deep-500">
            {neverBackedUp
              ? 'Everything lives on this device only. Save a backup so a cleared browser or a new phone can’t take it with them.'
              : 'It’s been a while since your last backup. Save a fresh copy so your recent progress is safe.'}
          </p>
        </div>
        <button
          onClick={snooze}
          aria-label="Not now"
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-600"
        >
          <X size={15} />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3 pl-[52px]">
        <button
          onClick={backup}
          className="rounded-full bg-water-500 px-5 py-2 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
        >
          Back up now
        </button>
        <button onClick={snooze} className="text-sm font-medium text-deep-500 hover:text-deep-700">
          Not now
        </button>
      </div>
    </section>
  )
}
