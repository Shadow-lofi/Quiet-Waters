// Backup & restore — the safety net for a local-first app with no account.
// Everything the user builds up (sittings, streak, saved verses, notes,
// memory verses, prayers, soul & Sabbath logs, devotional progress, settings)
// lives in one persisted localStorage blob, which a cleared browser or a lost
// phone can wipe. Export writes that blob to a JSON file the user keeps; restore
// reads one back and reloads so the store rehydrates from it. We also make a
// best-effort request for *persistent* storage, so the browser is less likely
// to evict the data on its own (e.g. Safari's periodic purge of unused PWAs).

import { APP_VERSION } from './version'

/** The localStorage key the zustand store persists under (see lib/store.ts). */
export const STORE_KEY = 'quiet-waters-v1'

export interface BackupFile {
  app: 'quiet-waters'
  type: 'backup'
  /** The store's persist schema version, lifted from the persisted blob. */
  schema: number | null
  appVersion: string
  exportedAt: string
  /** The raw persisted store, exactly as stored: { state, version }. */
  data: unknown
}

/** Read the current persisted store and wrap it as a backup payload. */
export function buildBackup(now: Date = new Date()): BackupFile {
  let data: unknown
  try {
    const raw = localStorage.getItem(STORE_KEY)
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = null
  }
  const version =
    data && typeof data === 'object' && 'version' in (data as object)
      ? Number((data as { version: unknown }).version)
      : NaN
  return {
    app: 'quiet-waters',
    type: 'backup',
    schema: Number.isFinite(version) ? version : null,
    appVersion: APP_VERSION,
    exportedAt: now.toISOString(),
    data,
  }
}

/** A tidy, dated filename for the backup. */
export function backupFilename(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`
  return `quiet-waters-backup-${stamp}.json`
}

export type BackupParse =
  | { ok: true; data: unknown; schema: number | null; exportedAt: string | null }
  | { ok: false; error: string }

/** Validate a chosen file's text as a Quiet Waters backup. Pure — unit-tested. */
export function parseBackup(text: string): BackupParse {
  let obj: unknown
  try {
    obj = JSON.parse(text)
  } catch {
    return { ok: false, error: 'That file isn’t valid JSON — it may be the wrong file.' }
  }
  if (!obj || typeof obj !== 'object') {
    return { ok: false, error: 'That doesn’t look like a Quiet Waters backup.' }
  }
  const o = obj as Record<string, unknown>
  if (o.app !== 'quiet-waters') {
    return { ok: false, error: 'That backup isn’t from Quiet Waters.' }
  }
  if (!o.data || typeof o.data !== 'object') {
    return { ok: false, error: 'This backup is empty.' }
  }
  const d = o.data as Record<string, unknown>
  if (!d.state || typeof d.state !== 'object') {
    return { ok: false, error: 'This backup looks incomplete or corrupted.' }
  }
  return {
    ok: true,
    data: o.data,
    schema: typeof o.schema === 'number' ? o.schema : null,
    exportedAt: typeof o.exportedAt === 'string' ? o.exportedAt : null,
  }
}

/** Write the restored store to localStorage. The caller reloads the page so the
 *  zustand persist layer rehydrates (and migrates) from it cleanly. */
export function writeRestoredStore(data: unknown): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}

/** Share the backup via the native sheet (best on iOS — “Save to Files”), or
 *  download it as a fallback. Mirrors shareOrDownloadImage in lib/verseCard. */
export async function shareOrDownloadBackup(file: BackupFile): Promise<'shared' | 'downloaded'> {
  const filename = backupFilename(new Date(file.exportedAt))
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' })
  const asFile = new File([blob], filename, { type: 'application/json' })
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  if (typeof nav.share === 'function' && nav.canShare?.({ files: [asFile] })) {
    try {
      await nav.share({ files: [asFile], title: 'Quiet Waters backup' })
      return 'shared'
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return 'shared' // cancelled — don't also download
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}

// ── Persistent storage — best-effort guard against automatic eviction ────────

export type StorageProtection = 'persisted' | 'unprotected' | 'unsupported'

/** Whether the browser has marked this origin's storage as persistent. */
export async function storageProtection(): Promise<StorageProtection> {
  try {
    if (navigator.storage?.persisted) {
      return (await navigator.storage.persisted()) ? 'persisted' : 'unprotected'
    }
  } catch {
    /* ignore */
  }
  return 'unsupported'
}

/** Ask the browser to keep this origin's data (most browsers decide by
 *  heuristic, without a prompt). Returns the resulting protection state. */
export async function requestStoragePersistence(): Promise<StorageProtection> {
  try {
    if (navigator.storage?.persist) {
      if (await navigator.storage.persisted?.()) return 'persisted'
      return (await navigator.storage.persist()) ? 'persisted' : 'unprotected'
    }
  } catch {
    /* ignore */
  }
  return 'unsupported'
}
