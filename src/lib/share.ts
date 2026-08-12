// Sharing Quiet Waters — one source of truth for the invite copy, link, and
// share action. Used by the Share row in Settings.
//
// The link's rich preview (the "icon" that shows in a message) comes from the
// Open Graph tags in index.html (og:image → /og-card.png), so a shared link
// unfurls with the Quiet Waters card in Messages, WhatsApp, etc.

export const APP_URL = 'https://quiet-waters-meditation.vercel.app'
export const DISPLAY_URL = 'quiet-waters-meditation.vercel.app'

export const SHARE_TITLE = 'Quiet Waters · Christian Meditation'
export const SHARE_TEXT =
  'I’ve been using Quiet Waters — a quiet little app to be still before God, with Scripture to dwell on and a gentle breathing guide. Come be still with me:'

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled'

/** Copy the app link to the clipboard. Returns whether it succeeded. */
export async function copyShareLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(APP_URL)
    return true
  } catch {
    return false
  }
}

/**
 * Open the native share sheet; fall back to copying the link when the Web Share
 * API isn't available (most desktops). Returns what happened so the caller can
 * show the right confirmation.
 */
export async function shareApp(): Promise<ShareOutcome> {
  if (canShare()) {
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: APP_URL })
      return 'shared'
    } catch (e) {
      // A cancelled share throws AbortError — that's not a failure.
      if ((e as Error).name === 'AbortError') return 'cancelled'
      // Any other error: fall through to the copy fallback.
    }
  }
  return (await copyShareLink()) ? 'copied' : 'cancelled'
}
