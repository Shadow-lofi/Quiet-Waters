import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'
import { Lamb } from './Lamb'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'
import { LAMB_HELPER_HIDDEN_ON, isLambCentered } from '../lib/lambHelper'
import { onEntered } from '../lib/intro'

// The guiding lamb — a gentle floating helper that lives in the app shell. It
// wanders in now and then with a short, page-aware tip (never a blocking modal),
// and it's always there to tap for a hint or the full tour. Deliberately quiet:
// it waits until after onboarding, pops up at most once every so often, never
// repeats the same tip back to back, and can be turned off in one tap (or in
// Settings). Mounted inside AppLayout, so it never appears on the public pages.

// The first hello, shown once (before any tip has ever popped up).
const INTRO_TIP =
  'Hello — I’m your little guide. Tap me anytime for a hint, or take the full tour.'

// Page-aware tips. First matching entry wins; the fallback covers everywhere else.
const TIP_GROUPS: { match: (p: string) => boolean; tips: string[] }[] = [
  {
    match: (p) => p === '/meditate',
    tips: [
      'Pick a length, then tap Begin — I’ll keep the time while you rest.',
      'On the breath: carry a verse, or breathe the Name — Yah in, weh out.',
      'Tap Share on the verse to send it to someone as a quiet image.',
      'In a hurry? A guided sitting below walks you through, step by step.',
    ],
  },
  {
    match: (p) => p === '/journey',
    tips: [
      'This is your journey — your streak, your sittings, and the prayers you’re holding.',
      'Miss a day? Grace covers it. Just come back to the water.',
    ],
  },
  {
    match: (p) => p.startsWith('/study') || p === '/last-days' || p.startsWith('/devotional'),
    tips: [
      'The Deep Dive studies walk slowly through Scripture. One a day is plenty.',
      'Devotional series pick up where you left off — no need to finish in one sitting.',
    ],
  },
  {
    match: (p) => p === '/bible' || p === '/enoch',
    tips: [
      'Tap a verse to highlight it, add a note, or hide it in your heart to memorize.',
      'Your highlights and bookmarks stay right here on your device.',
    ],
  },
  {
    match: (p) => p === '/prayers',
    tips: ['Write a request here, and mark it answered in His time.'],
  },
  {
    match: (p) => p === '/memory',
    tips: ['Review a verse when it’s due — a gentle way to hide the Word in your heart.'],
  },
  {
    match: (p) => p === '/settings',
    tips: [
      'Make it yours — music, day or night, reminders, and a backup of everything.',
      'Turn on a daily reminder here, so I can nudge you to be still.',
    ],
  },
]

const FALLBACK_TIPS = [
  'Lost? Tap me for a little tour of Quiet Waters.',
  'Everything you do stays on this device — private, and always yours.',
]

function tipsFor(path: string): string[] {
  return TIP_GROUPS.find((g) => g.match(path))?.tips ?? FALLBACK_TIPS
}

const COOLDOWN_MS = 40 * 60_000 // at most one auto-pop every ~40 minutes
const AUTO_DISMISS_MS = 18_000 // a gentle self-close if left untouched

// The lamb ambles into its corner once per app open — a gentle "hello". This
// module-level flag survives in-app navigation (AppLayout, and so this helper,
// stay mounted), so the entrance plays only on a fresh load, not on every page.
let hasWanderedIn = false

export function LambHelper() {
  const location = useLocation()
  const navigate = useNavigate()
  const helperOn = useStore((s) => s.helperOn)
  const onboarded = useStore((s) => s.onboarded)
  const setPref = useStore((s) => s.setPref)
  const pushToast = useToast((t) => t.push)

  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false) // drives the soft enter/leave transition
  const [tip, setTip] = useState('')
  const lastTip = useRef('')

  const path = location.pathname
  const hidden = !helperOn || LAMB_HELPER_HIDDEN_ON.includes(path)
  const centered = isLambCentered(path)

  // The arrival plays once per app open, but only once the app has been *entered*
  // (past the tap-to-enter intro splash) — otherwise the lamb would amble in and
  // wave behind the splash, where no one can see it. `entranceActive` applies the
  // wander-in; `waveNonce` keys the raised foreleg so each bump (the entrance, or
  // a tap) replays the wave. Until the arrival fires on a fresh open, the lamb
  // stays hidden so it slides in cleanly instead of flashing into place.
  const [entranceActive, setEntranceActive] = useState(false)
  const [waveNonce, setWaveNonce] = useState(0)
  const awaitingEntrance = !hasWanderedIn && !entranceActive

  useEffect(() => {
    if (hidden || hasWanderedIn) return
    return onEntered(() => {
      if (hasWanderedIn) return
      hasWanderedIn = true
      setEntranceActive(true)
      setWaveNonce((n) => n + 1)
    })
  }, [hidden])

  const pickTip = (): string => {
    const pool = tipsFor(path)
    const fresh = pool.filter((t) => t !== lastTip.current)
    const from = fresh.length ? fresh : pool
    const chosen = from[Math.floor(Math.random() * from.length)]
    lastTip.current = chosen
    return chosen
  }

  const reveal = (text: string) => {
    setTip(text)
    setOpen(true)
    // fade/slide in on the next frame
    requestAnimationFrame(() => setShown(true))
  }

  const close = () => {
    setShown(false)
    window.setTimeout(() => setOpen(false), 260) // let the leave transition play
  }

  // Tap the lamb: give a little wave hello and open a tip (or, if a tip is
  // already open, just close it).
  const onTapLamb = () => {
    if (open) {
      close()
      return
    }
    setWaveNonce((n) => n + 1) // wave on tap
    const first = useStore.getState().helperTipAt == null
    reveal(first ? INTRO_TIP : pickTip())
    if (first) useStore.getState().noteHelperTip()
  }

  // Auto-pop: on landing somewhere new, sometimes the lamb wanders in with a tip.
  // Close any open bubble first, then maybe schedule a fresh one. Reads the
  // cooldown from the store directly so noting a tip doesn't retrigger this.
  useEffect(() => {
    setShown(false)
    setOpen(false)
    if (hidden || !onboarded) return

    const { helperTipAt } = useStore.getState()
    const first = helperTipAt == null
    const now = Date.now()
    if (!first) {
      if (now - (helperTipAt ?? 0) < COOLDOWN_MS) return
      if (Math.random() > 0.5) return // keep it occasional, not every page
    }

    const delay = first ? 3500 : 1600
    const id = window.setTimeout(() => {
      reveal(first ? INTRO_TIP : pickTip())
      useStore.getState().noteHelperTip()
    }, delay)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, hidden, onboarded])

  // A gentle self-close so a tip never lingers.
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(close, AUTO_DISMISS_MS)
    return () => window.clearTimeout(id)
  }, [open])

  if (hidden) return null

  const tour = () => {
    close()
    navigate('/guide')
  }

  const turnOff = () => {
    close()
    setPref('helperOn', false)
    pushToast({
      title: 'The guiding lamb will rest',
      message: 'Turn it back on anytime in Settings.',
    })
  }

  return (
    <>
      {/* the tip bubble — a soft speech bubble just below the lamb */}
      {open && (
        <div
          role="status"
          className={`fixed z-40 w-[min(19rem,calc(100vw-1.5rem))] rounded-2xl bg-card p-4 shadow-xl ring-1 ring-line transition-[opacity,transform] duration-300 ease-out ${
            centered ? 'left-1/2 -translate-x-1/2' : 'left-3'
          } ${shown ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
          style={{ top: 'calc(env(safe-area-inset-top) + 4rem)' }}
        >
          <button
            onClick={close}
            aria-label="Dismiss"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-700"
          >
            <X size={14} />
          </button>

          <p className="pr-6 text-sm leading-relaxed text-deep-700">{tip}</p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={tour}
              className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-3.5 py-1.5 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
            >
              Show me around
              <ArrowRight size={15} />
            </button>
            <button
              onClick={turnOff}
              className="text-xs text-deep-400 underline-offset-2 transition hover:text-deep-600 hover:underline"
            >
              Turn off tips
            </button>
          </div>

          {/* little tail pointing up toward the lamb */}
          <span
            className={`absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-line bg-card ${
              centered ? 'left-1/2 -translate-x-1/2' : 'left-6'
            }`}
          />
        </div>
      )}

      {/* the floating lamb button — top-left (opposite the bell), or top-center on the Bible reader.
          A positioning wrapper carries the once-per-open "wander in" so it doesn't fight the
          perpetual float on the button (both would animate transform). */}
      <div
        className={`fixed z-40 ${centered ? '' : 'left-3'} ${
          awaitingEntrance
            ? 'opacity-0'
            : entranceActive
              ? centered
                ? 'qw-drop-in'
                : 'qw-wander-in'
              : ''
        }`}
        style={{
          top: 'calc(env(safe-area-inset-top) + 0.75rem)',
          ...(centered ? { left: '50%', marginLeft: '-1.375rem' } : {}),
        }}
      >
        <button
          onClick={onTapLamb}
          aria-label={open ? 'Close the guiding lamb' : 'Open the guiding lamb for a tip'}
          title="A little guide"
          className="qw-float flex h-11 w-11 items-center justify-center rounded-full bg-card/85 text-water-600 shadow-md ring-1 ring-line backdrop-blur-md transition active:scale-95"
        >
          <Lamb size={40} wave={waveNonce > 0} waveKey={waveNonce} />
        </button>
      </div>
    </>
  )
}
