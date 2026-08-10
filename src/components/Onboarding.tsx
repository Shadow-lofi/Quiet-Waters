import { useState } from 'react'
import { Logo } from './Logo'
import { useStore } from '../lib/store'

/** Gentle first-run welcome. Captures a name (stored on-device only) so the app
 *  can greet the user. Shown until they continue or skip — never nags again. */
export function Onboarding() {
  const onboarded = useStore((s) => s.onboarded)
  const setName = useStore((s) => s.setName)
  const setOnboarded = useStore((s) => s.setOnboarded)
  const [value, setValue] = useState('')

  if (onboarded) return null

  const finish = () => {
    setName(value.trim())
    setOnboarded(true)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-mist-100/80 px-6 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-card bg-card p-8 text-center shadow-xl ring-1 ring-line">
        <span className="mb-4 inline-flex text-water-500">
          <Logo size={52} />
        </span>
        <h2 className="text-3xl">Quiet Waters</h2>
        <p className="mt-2 font-serif text-lg italic text-deep-600">
          Be still, and know that He is God.
        </p>

        <label htmlFor="qw-name" className="mt-7 block text-left text-sm text-deep-600">
          What may we call you?
        </label>
        <input
          id="qw-name"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && finish()}
          placeholder="Your name"
          maxLength={40}
          className="mt-2 w-full rounded-2xl bg-mist-100 px-4 py-3 text-deep-900 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
        />

        <button
          onClick={finish}
          className="mt-5 w-full rounded-full bg-water-500 py-3.5 text-lg font-semibold text-onwater shadow-lg transition-transform active:scale-[0.98]"
        >
          Begin
        </button>
        <button
          onClick={() => setOnboarded(true)}
          className="mt-3 text-sm text-deep-500 hover:text-deep-700"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
