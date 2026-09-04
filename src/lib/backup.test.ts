import { describe, it, expect } from 'vitest'
import { parseBackup, backupFilename } from './backup'

describe('parseBackup', () => {
  const valid = JSON.stringify({
    app: 'quiet-waters',
    type: 'backup',
    schema: 7,
    data: { state: { name: 'Ada', sessions: [] }, version: 7 },
  })

  it('accepts a well-formed backup', () => {
    const r = parseBackup(valid)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.schema).toBe(7)
      expect((r.data as { state: { name: string } }).state.name).toBe('Ada')
    }
  })

  it('rejects invalid JSON', () => {
    expect(parseBackup('{ not json').ok).toBe(false)
  })

  it('rejects a file from another app', () => {
    const r = parseBackup(JSON.stringify({ app: 'something-else', data: { state: {} } }))
    expect(r.ok).toBe(false)
  })

  it('rejects a backup with no data', () => {
    expect(parseBackup(JSON.stringify({ app: 'quiet-waters' })).ok).toBe(false)
  })

  it('rejects a backup missing the state blob', () => {
    const r = parseBackup(JSON.stringify({ app: 'quiet-waters', data: { version: 7 } }))
    expect(r.ok).toBe(false)
  })

  it('tolerates a missing schema (older backup)', () => {
    const r = parseBackup(JSON.stringify({ app: 'quiet-waters', data: { state: {} } }))
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.schema).toBe(null)
  })
})

describe('backupFilename', () => {
  it('is a dated .json name', () => {
    // Local-time construction, so the date parts are stable across zones.
    expect(backupFilename(new Date(2026, 8, 4, 10, 30))).toBe('quiet-waters-backup-2026-09-04.json')
  })
})
