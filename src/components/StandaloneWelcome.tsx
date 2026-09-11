import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Lamb } from './Lamb'
import { useStore } from '../lib/store'
import { isStandalone } from '../lib/install'
import { onEntered, hasEntered } from '../lib/intro'

// The installed app's first-run welcome: the big guiding lamb waves hello and
// offers to show you around. Appears once, only in the installed / standalone
// app, and only after the name onboarding — so a brand-new user is greeted (by
// name, if they gave one) and led straight into the tour. It waits for the
// opening intro to be entered so it never performs behind the splash.
//
// Add ?welcome=1 to the URL to preview it outside the installed app.

function forcedByUrl(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return new URLSearchParams(window.location.search).has('welcome')
  } catch {
    return false
  }
}

export function StandaloneWelcome() {
  const name = useStore((s) => s.name)
  const onboarded = useStore((s) => s.onboarded)
  const welcomed = useStore((s) => s.standaloneWelcomed)
  const markWelcomed = useStore((s) => s.markStandaloneWelcomed)
  const navigate = useNavigate()

  // Decide once, at mount, whether this device is even a candidate (installed app,
  // or a forced preview).
  const [eligible] = useState(() => forcedByUrl() || isStandalone())
  const [entered, setEntered] = useState(hasEntered)
  const [shown, setShown] = useState(false) // soft fade-in
  const [waveNonce, setWaveNonce] = useState(1) // bumped to keep the lamb waving

  const active = eligible && onboarded && !welcomed && entered

  // Wait for the opening intro to be dismissed (or fire now if there is none).
  useEffect(() => {
    if (!eligible) return
    return onEntered(() => setEntered(true))
  }, [eligible])

  // Fade the card in, and let the lamb wave again every few seconds while it's up.
  useEffect(() => {
    if (!active) return
    const raf = requestAnimationFrame(() => setShown(true))
    const id = window.setInterval(() => setWaveNonce((n) => n + 1), 3600)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(id)
    }
  }, [active])

  if (!active) return null

  const startTour = () => {
    markWelcomed()
    navigate('/guide')
  }

  const explore = () => {
    markWelcomed()
  }

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-mist-100/85 px-6 backdrop-blur-md transition-opacity duration-500 ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-full max-w-sm rounded-card bg-card p-8 text-center shadow-xl ring-1 ring-line">
        <span className="qw-float mx-auto -mb-1 inline-flex text-water-500">
          <Lamb size={148} wave waveKey={waveNonce} />
        </span>
        <p className="text-xs uppercase tracking-[0.2em] text-water-600">Quiet Waters</p>
        <h2 className="mt-1 text-3xl">{name ? `Welcome, ${name}!` : 'Welcome in'}</h2>
        <p className="mx-auto mt-3 max-w-xs leading-relaxed text-deep-600">
          I’m your little guide. Come — let me show you around: how to be still, dwell on a verse, and
          find your way.
        </p>

        <button
          onClick={startTour}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3.5 text-lg font-semibold text-onwater shadow-lg transition-transform active:scale-[0.98]"
        >
          <Compass size={18} /> Show me around
        </button>
        <button onClick={explore} className="mt-3 text-sm text-deep-500 hover:text-deep-700">
          I’ll explore on my own
        </button>
      </div>
    </div>
  )
}
