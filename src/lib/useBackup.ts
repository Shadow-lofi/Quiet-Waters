import { useStore } from './store'
import { useToast } from './toast'
import { buildBackup, shareOrDownloadBackup } from './backup'

/**
 * Returns a `backup()` action that saves the current data to a file (native
 * share sheet, or download) and records that a backup was made — so the periodic
 * backup reminder resets. Shared by Settings and the home-screen reminder so the
 * behaviour and confirmation are identical wherever the user backs up.
 */
export function useBackup(): () => Promise<void> {
  const markBackedUp = useStore((s) => s.markBackedUp)
  const pushToast = useToast((t) => t.push)

  return async () => {
    try {
      const outcome = await shareOrDownloadBackup(buildBackup())
      markBackedUp()
      pushToast({
        tone: 'success',
        title: outcome === 'shared' ? 'Backup ready to save' : 'Backup saved',
        message: 'Keep this file somewhere safe — it can bring your data back.',
      })
    } catch {
      pushToast({ title: 'Couldn’t create the backup', message: 'Please try again in a moment.' })
    }
  }
}
