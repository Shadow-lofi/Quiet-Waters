import { useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useStore } from '../lib/store'
import { startAmbient, stopAmbient, setAmbientVolume, isAmbientPlaying } from '../lib/ambient'
import { getAudioContext } from '../lib/audio'

// App-wide background music: the meditation ambience track ("Music" — spa.mp3),
// looped continuously across the whole app rather than only during a sitting, so
// it stays peaceful while you read and study. It keeps playing through a sitting
// (the chimes just layer over it — see SessionOverlay), and the Settings preview
// never stops it — both because it's tagged as the shared engine's 'background'
// owner (see lib/ambient.ts).
//
// Browsers block audio until a user gesture, so it starts on the first tap: the
// tap-to-enter intro tap counts, so the music swells in as the splash dissolves;
// otherwise the first interaction anywhere starts it. A floating speaker button
// mutes/unmutes instantly, and the choice is remembered (`backgroundMusic`).
//
// Mounted inside AppLayout, so it never plays on the public Landing page and its
// button rides along with the app shell.

function startLoop(): void {
  if (isAmbientPlaying()) return
  startAmbient('music', useStore.getState().ambientVolume, 'background')
}

export function BackgroundMusic() {
  const on = useStore((s) => s.backgroundMusic)
  const volume = useStore((s) => s.ambientVolume)
  const setPref = useStore((s) => s.setPref)

  // When it's on but not yet sounding (a fresh launch — no gesture has unlocked
  // audio), start it on the first user interaction anywhere.
  useEffect(() => {
    if (!on || isAmbientPlaying()) return
    const onGesture = () => {
      startLoop()
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('pointerdown', onGesture, true)
      window.removeEventListener('keydown', onGesture, true)
    }
    window.addEventListener('pointerdown', onGesture, true)
    window.addEventListener('keydown', onGesture, true)
    return cleanup
  }, [on])

  // Keep the live track at the chosen volume.
  useEffect(() => {
    if (on && isAmbientPlaying()) setAmbientVolume(volume)
  }, [on, volume])

  // iOS suspends the AudioContext when the app is backgrounded; resume on return.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && useStore.getState().backgroundMusic) {
        getAudioContext() // resumes a suspended context
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const toggle = () => {
    const next = !on
    // We're inside a user gesture here, so audio can start immediately.
    if (next) startLoop()
    else stopAmbient(false, 'background')
    setPref('backgroundMusic', next)
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Mute background music' : 'Play background music'}
      title={on ? 'Mute background music' : 'Play background music'}
      className="fixed right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-card/85 text-water-600 shadow-md ring-1 ring-line backdrop-blur-md transition active:scale-95"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 4.75rem)' }}
    >
      {on ? <Volume2 size={19} /> : <VolumeX size={19} />}
    </button>
  )
}
