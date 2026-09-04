import { describe, it, expect } from 'vitest'
import { backupReminderDue, SNOOZE_MS, DUE_AFTER_MS } from './backupReminder'

const DAY = 24 * 60 * 60 * 1000
const NOW = 1_000_000_000_000

describe('backupReminderDue', () => {
  it('stays quiet when there is no data yet', () => {
    expect(
      backupReminderDue({ now: NOW, lastBackupAt: null, backupSnoozedUntil: null, hasData: false, latestActivityAt: null }),
    ).toBe(false)
  })

  it('nudges when there is data but no backup has ever been made', () => {
    expect(
      backupReminderDue({ now: NOW, lastBackupAt: null, backupSnoozedUntil: null, hasData: true, latestActivityAt: NOW }),
    ).toBe(true)
  })

  it('stays quiet while snoozed, even if otherwise due', () => {
    expect(
      backupReminderDue({ now: NOW, lastBackupAt: null, backupSnoozedUntil: NOW + SNOOZE_MS, hasData: true, latestActivityAt: NOW }),
    ).toBe(false)
  })

  it('nudges again once the snooze has elapsed', () => {
    expect(
      backupReminderDue({ now: NOW, lastBackupAt: null, backupSnoozedUntil: NOW - 1, hasData: true, latestActivityAt: NOW }),
    ).toBe(true)
  })

  it('stays quiet soon after a backup', () => {
    expect(
      backupReminderDue({ now: NOW, lastBackupAt: NOW - DAY, backupSnoozedUntil: null, hasData: true, latestActivityAt: NOW }),
    ).toBe(false)
  })

  it('nudges after a while when there is newer activity than the last backup', () => {
    const lastBackupAt = NOW - DUE_AFTER_MS - DAY
    expect(
      backupReminderDue({ now: NOW, lastBackupAt, backupSnoozedUntil: null, hasData: true, latestActivityAt: NOW - DAY }),
    ).toBe(true)
  })

  it('does not nag when nothing has changed since the last backup', () => {
    const lastBackupAt = NOW - DUE_AFTER_MS - DAY
    expect(
      backupReminderDue({ now: NOW, lastBackupAt, backupSnoozedUntil: null, hasData: true, latestActivityAt: lastBackupAt - DAY }),
    ).toBe(false)
  })
})
