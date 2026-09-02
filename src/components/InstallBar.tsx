import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { InstallGuide } from './InstallGuide'
import { isStandalone } from '../lib/install'
import { useStore } from '../lib/store'

/**
 * An app-wide, browser-only invitation to add Quiet Waters to the home screen —
 * a slim ribbon at the top of every page, so the nudge follows the user
 * wherever they are (not just the home page). Tapping it opens the InstallGuide,
 * which lands on their own device's steps (and offers the native install where
 * available). Hidden once the app is installed / running standalone, and the X
 * quiets it for good. Never shown inside the installed PWA.
 */
export function InstallBar() {
  const dismissed = useStore((s) => s.installPromptDismissed)
  const completed = useStore((s) => s.installCompleted)
  const dismiss = useStore((s) => s.dismissInstallPrompt)
  // Standalone status doesn't change within a session, so read it just once.
  const [installed] = useState(isStandalone)
  const [showGuide, setShowGuide] = useState(false)

  if (installed || completed || dismissed) return null

  return (
    <>
      <div className="qw-enter mb-5 flex items-center gap-2 rounded-2xl bg-water-500/10 p-2 ring-1 ring-water-500/25">
        <button
          onClick={() => setShowGuide(true)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-water-500 text-onwater">
            <Download size={16} />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-deep-800">
            Add to your home screen
          </span>
          <span className="shrink-0 rounded-full bg-water-500 px-3.5 py-1.5 text-xs font-semibold text-onwater shadow-sm">
            Install
          </span>
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-600"
        >
          <X size={15} />
        </button>
      </div>
      {showGuide && <InstallGuide onClose={() => setShowGuide(false)} />}
    </>
  )
}
