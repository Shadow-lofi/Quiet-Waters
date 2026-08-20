import { useState } from 'react'
import { Download, ChevronRight, X } from 'lucide-react'
import { InstallGuide } from './InstallGuide'
import { isStandalone } from '../lib/install'
import { useStore } from '../lib/store'

/**
 * A gentle, dismissible invitation — shown only in the browser, never once the
 * app is already installed / running standalone — to add Quiet Waters to the
 * home screen. Tapping it opens the full InstallGuide walkthrough (the same
 * instructions offered in Settings); the X quiets it for good. Kept quiet on
 * purpose so it never competes with the daily sitting.
 */
export function InstallBanner() {
  const dismissed = useStore((s) => s.installPromptDismissed)
  const dismiss = useStore((s) => s.dismissInstallPrompt)
  // Standalone status doesn't change within a session, so read it just once.
  const [installed] = useState(isStandalone)
  const [showGuide, setShowGuide] = useState(false)

  if (installed || dismissed) return null

  return (
    <>
      <section className="qw-enter rounded-card bg-card shadow-sm ring-1 ring-water-500/25">
        <div className="flex items-center gap-2 p-4">
          <button
            onClick={() => setShowGuide(true)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <span className="qw-float flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
              <Download size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-deep-900">Add to your home screen</span>
              <span className="block text-xs text-deep-500">
                Tap for full-screen, offline, one-tap stillness
              </span>
            </span>
            <ChevronRight size={17} className="shrink-0 text-deep-300" />
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-400 hover:bg-mist-200 hover:text-deep-600"
          >
            <X size={16} />
          </button>
        </div>
      </section>
      {showGuide && <InstallGuide onClose={() => setShowGuide(false)} />}
    </>
  )
}
