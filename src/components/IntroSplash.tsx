import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { useStore } from '../lib/store'
import { isStandalone } from '../lib/install'
import { preloadIntroAudio, playIntroSwell } from '../lib/introAudio'
import { markEntered } from '../lib/intro'

// A brief, reverent "enter the quiet" moment shown when the installed app opens:
// a drop meets still water, "Quiet Waters" surfaces, and a gentle prompt waits
// for a single tap — which rings in a soft swell of the meditation music and
// dissolves the splash into the app.
//
// Shown only in the installed / standalone app (this is the "app version"),
// once per cold launch (the component mounts once at app start; in-app
// navigation never remounts it), and only while the "Opening intro" preference
// is on. It's tap-to-enter rather than auto-play on purpose: browsers — iOS
// especially — block audio until a user gesture, so a tap is the reliable way to
// make the music actually sound. Adding ?intro=1 to the URL forces it for
// previewing outside the installed app.

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).has('intro')) return true
  } catch {
    /* ignore malformed URLs */
  }
  if (!isStandalone()) return false
  return useStore.getState().introOn
}

export function IntroSplash() {
  // Decide once, at mount, from the already-hydrated persisted store (localStorage
  // is synchronous, so there's no flash of the wrong state).
  const [show] = useState(shouldShow)
  const [shown, setShown] = useState(false) // drives the soft fade-in
  const [leaving, setLeaving] = useState(false) // drives the fade-out on enter
  const [done, setDone] = useState(false) // unmount once faded out
  const entered = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // No splash to wait on — the app is entered right away, so the lamb and any
    // other arrival animations can begin immediately.
    if (!show) {
      markEntered()
      return
    }
    // Start loading the music now so the swell can begin the instant they tap.
    preloadIntroAudio()
    // Fade the splash in on the next frame, and move focus here so the tap can
    // also be triggered from the keyboard / a screen reader.
    const id = requestAnimationFrame(() => setShown(true))
    rootRef.current?.focus()
    return () => cancelAnimationFrame(id)
  }, [show])

  if (!show || done) return null

  const enter = () => {
    if (entered.current) return
    entered.current = true
    // Let the app's arrival animations (the guiding lamb) begin as we dissolve.
    markEntered()
    // Inside the tap gesture: ring in the music, then dissolve into the app.
    // When app-wide background music is on, this same tap starts that continuous
    // loop (it swells in as the splash dissolves — see BackgroundMusic), so we
    // skip the one-shot swell to avoid two copies of the track overlapping.
    if (!useStore.getState().backgroundMusic) playIntroSwell(useStore.getState().ambientVolume)
    setLeaving(true)
    window.setTimeout(() => setDone(true), 900)
  }

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Enter Quiet Waters"
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          enter()
        }
      }}
      className={`qw-intro fixed inset-0 z-[100] flex cursor-pointer select-none flex-col items-center justify-center px-8 text-center outline-none transition-[opacity,transform] duration-700 ease-out ${
        leaving
          ? 'pointer-events-none scale-[1.03] opacity-0'
          : shown
            ? 'opacity-100'
            : 'opacity-0'
      }`}
    >
      {/* the drop meeting still water, sending out ripples */}
      <div className="relative mb-9 flex h-24 w-24 items-center justify-center text-water-500">
        <span className="qw-intro-ring" />
        <span className="qw-intro-ring" style={{ animationDelay: '1.5s' }} />
        <span className="qw-intro-ring" style={{ animationDelay: '3s' }} />
        <span className="qw-intro-drop relative">
          <Logo size={68} />
        </span>
      </div>

      <div className="qw-intro-line" style={{ animationDelay: '0.35s' }}>
        <h1 className="qw-title text-5xl leading-none tracking-tight">Quiet Waters</h1>
      </div>
      <p
        className="qw-intro-line mt-4 font-serif text-xl italic text-deep-600"
        style={{ animationDelay: '0.6s' }}
      >
        Be still, and know that He is God.
      </p>

      <p className="qw-intro-prompt mt-12 text-[0.7rem] uppercase tracking-[0.25em] text-deep-400">
        Tap to enter still waters
      </p>
    </div>
  )
}
