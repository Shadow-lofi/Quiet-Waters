import { useState } from 'react'
import { Share, MoreVertical, MonitorDown, Plus, Download, X } from 'lucide-react'
import { Logo } from './Logo'
import { canPromptInstall, detectPlatform, promptInstall } from '../lib/install'

/** An inline glyph used within a step, styled to sit in the text baseline. */
function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex h-5 w-5 -translate-y-px items-center justify-center rounded-md bg-mist-200 text-water-600 align-middle">
      {children}
    </span>
  )
}

function steps(platform: ReturnType<typeof detectPlatform>): React.ReactNode[] {
  if (platform === 'ios') {
    return [
      <>
        Tap the Share button
        <Glyph>
          <Share size={13} />
        </Glyph>
        in Safari’s toolbar.
      </>,
      <>
        Scroll down and choose{' '}
        <span className="font-medium text-deep-800">Add to Home Screen</span>
        <Glyph>
          <Plus size={13} />
        </Glyph>
        .
      </>,
      <>
        Tap <span className="font-medium text-deep-800">Add</span> — Quiet Waters joins your home
        screen.
      </>,
    ]
  }
  if (platform === 'android') {
    return [
      <>
        Open the menu
        <Glyph>
          <MoreVertical size={13} />
        </Glyph>
        in Chrome (top-right).
      </>,
      <>
        Tap <span className="font-medium text-deep-800">Add to Home screen</span> (or{' '}
        <span className="font-medium text-deep-800">Install app</span>).
      </>,
      <>Confirm, and Quiet Waters appears with your other apps.</>,
    ]
  }
  return [
    <>
      Click the install icon
      <Glyph>
        <MonitorDown size={13} />
      </Glyph>
      in the address bar, or open the menu
      <Glyph>
        <MoreVertical size={13} />
      </Glyph>
      .
    </>,
    <>
      Choose <span className="font-medium text-deep-800">Install Quiet Waters</span>.
    </>,
    <>It opens in its own window, like a native app.</>,
  ]
}

const HINT: Record<ReturnType<typeof detectPlatform>, string> = {
  ios: 'On iPhone or iPad, in Safari',
  android: 'On Android, in Chrome',
  desktop: 'On your computer, in Chrome or Edge',
}

/** A gentle walkthrough for installing Quiet Waters to the home screen. Offers
 *  the browser's native install prompt where one is available (Chromium), and
 *  clear manual steps everywhere else (notably iOS Safari). */
export function InstallGuide({ onClose }: { onClose: () => void }) {
  const [platform] = useState(detectPlatform)
  const [native] = useState(canPromptInstall)

  const install = async () => {
    const outcome = await promptInstall()
    if (outcome === 'accepted') onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-mist-100/80 px-6 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-card bg-card p-7 shadow-xl ring-1 ring-line">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-deep-400 hover:bg-mist-200 hover:text-deep-700"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-water-500">
            <Logo size={44} />
          </span>
          <h2 className="mt-3 text-2xl">Add to Home Screen</h2>
          <p className="mt-1.5 text-sm text-deep-500">
            Install Quiet Waters for a full-screen, offline, one-tap sitting.
          </p>
        </div>

        {native && (
          <button
            onClick={install}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3 font-semibold text-onwater shadow-md transition-transform active:scale-[0.98]"
          >
            <Download size={18} /> Install Quiet Waters
          </button>
        )}

        <p className="mt-6 text-xs uppercase tracking-[0.16em] text-deep-400">
          {native ? 'Or add it by hand' : HINT[platform]}
        </p>
        <ol className="mt-3 flex flex-col gap-3.5">
          {steps(platform).map((node, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist-200 text-sm font-semibold text-water-600">
                {i + 1}
              </span>
              <p className="flex-1 leading-relaxed text-deep-700">{node}</p>
            </li>
          ))}
        </ol>

        <button
          onClick={onClose}
          className="mt-7 w-full rounded-full py-2.5 text-sm font-medium text-deep-500 ring-1 ring-line hover:bg-mist-200"
        >
          Done
        </button>
      </div>
    </div>
  )
}
