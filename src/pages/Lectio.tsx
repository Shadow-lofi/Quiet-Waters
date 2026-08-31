import { useState } from 'react'
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react'
import { LECTIO_MOVEMENTS, LECTIO_PASSAGES } from '../data/lectio'
import { NarrationButton } from '../components/NarrationButton'
import { chunkText } from '../lib/narration'
import { Seo } from '../components/Seo'

/** Today's starting passage — steady through the day, but freely changed. */
function todayIndex(): number {
  const d = new Date()
  return (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % LECTIO_PASSAGES.length
}

/**
 * Lectio Divina — an unhurried, four-movement way of praying a short passage:
 * Read (Lectio), Reflect (Meditatio), Pray (Oratio), Rest (Contemplatio). The
 * passage stays in view the whole way; each movement offers a gentle prompt.
 */
export function Lectio() {
  const [pIdx, setPIdx] = useState(todayIndex)
  const [step, setStep] = useState(0)

  const passage = LECTIO_PASSAGES[pIdx]
  const movement = LECTIO_MOVEMENTS[step]
  const isLast = step === LECTIO_MOVEMENTS.length - 1

  const newPassage = () => {
    setPIdx((i) => (i + 1) % LECTIO_PASSAGES.length)
    setStep(0)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo path="/lectio" />
      <header>
        <h1 className="text-2xl">Lectio Divina</h1>
        <p className="mt-1 text-sm text-deep-500">
          An ancient way of praying the Scriptures, slowly — read, reflect, pray, and rest.
        </p>
      </header>

      {/* The passage — kept in view through every movement */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-water-600">{passage.ref}</p>
          <div className="flex items-center gap-1.5">
            <NarrationButton session={`lectio:${passage.ref}`} segments={chunkText(passage.text)} />
            <button
              onClick={newPassage}
              aria-label="Another passage"
              className="flex h-8 w-8 items-center justify-center rounded-full text-deep-500 ring-1 ring-line transition hover:bg-mist-200 hover:text-deep-700"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        <blockquote className="font-serif text-[1.35rem] leading-relaxed text-deep-900">
          “{passage.text}”
        </blockquote>
      </section>

      {/* Movement progress — tap a dot to jump */}
      <div className="flex items-center justify-center gap-2">
        {LECTIO_MOVEMENTS.map((m, i) => (
          <button
            key={m.latin}
            onClick={() => setStep(i)}
            aria-label={`${m.latin} — ${m.title}`}
            aria-current={i === step}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-6 bg-water-500' : 'w-2 bg-mist-300 hover:bg-deep-300'
            }`}
          />
        ))}
      </div>

      {/* The current movement */}
      <section className="rounded-card bg-mist-100 p-6 ring-1 ring-line">
        <p className="text-xs uppercase tracking-[0.22em] text-water-600">{movement.latin}</p>
        <h2 className="mt-1 font-serif text-2xl text-deep-900">{movement.title}</h2>
        <p className="mt-3 leading-relaxed text-deep-700">{movement.prompt}</p>
      </section>

      {/* Move through the movements */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-40"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        {isLast ? (
          <button
            onClick={newPassage}
            className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-5 py-2.5 text-sm font-semibold text-onwater shadow-sm transition hover:bg-water-600"
          >
            Amen · Begin again
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => Math.min(LECTIO_MOVEMENTS.length - 1, s + 1))}
            className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-5 py-2.5 text-sm font-semibold text-onwater shadow-sm transition hover:bg-water-600"
          >
            Continue <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
