// When to gently remind the user to save a backup — the safety net for a
// local-first app with no account. Pure logic (unit-tested), shared by the
// store (snooze window) and components/BackupReminder.

const DAY = 24 * 60 * 60 * 1000

/** After a dismissal, wait this long before nudging again. */
export const SNOOZE_MS = 7 * DAY
/** After a backup, only nudge again once it's been at least this long. */
export const DUE_AFTER_MS = 14 * DAY

export interface BackupReminderInput {
  now: number
  lastBackupAt: number | null
  backupSnoozedUntil: number | null
  /** Is there anything worth backing up yet? */
  hasData: boolean
  /** Timestamp of the most recent activity (e.g. the last sitting), or null. */
  latestActivityAt: number | null
}

/**
 * Whether to show the "save a backup" nudge:
 *   • never, if there's no data yet or the nudge is snoozed;
 *   • yes, if the user has data but has never backed up;
 *   • otherwise, only once it's been a while since the last backup AND there's
 *     newer activity since then (so we never nag someone who just backed up).
 */
export function backupReminderDue({
  now,
  lastBackupAt,
  backupSnoozedUntil,
  hasData,
  latestActivityAt,
}: BackupReminderInput): boolean {
  if (!hasData) return false
  if (backupSnoozedUntil != null && backupSnoozedUntil > now) return false
  if (lastBackupAt == null) return true
  if (now - lastBackupAt < DUE_AFTER_MS) return false
  return latestActivityAt != null && latestActivityAt > lastBackupAt
}
