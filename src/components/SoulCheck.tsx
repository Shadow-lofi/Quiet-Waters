import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'
import { SOUL_STATES, soulById } from '../data/soul'
import { seriesForSoul } from '../data/devotionals'
import { useStore } from '../lib/store'

/**
 * "How is your soul today?" — a gentle one-tap check-in shown before a sitting.
 * Choosing a state records it (a private, local log the Journey reflects) and
 * meets it with a fitting word of Scripture. No pressure, no tracking beyond
 * the device.
 */
export function SoulCheck() {
  const logSoul = useStore((s) => s.logSoul)
  const [picked, setPicked] = useState<string | null>(null)
  const state = picked ? soulById(picked) : null
  const suggested = picked ? seriesForSoul(picked) : undefined

  const choose = (id: string) => {
    logSoul(id)
    setPicked(id)
  }

  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">How is your soul today?</p>
      <div className="flex flex-wrap gap-2">
        {SOUL_STATES.map((s) => (
          <button
            key={s.id}
            onClick={() => choose(s.id)}
            aria-pressed={picked === s.id}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              picked === s.id
                ? 'bg-water-500 text-onwater shadow-sm'
                : 'bg-card text-deep-700 ring-1 ring-line hover:bg-mist-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {state && (
        <div className="qw-enter mt-3 rounded-card bg-mist-100 p-5 ring-1 ring-line">
          <div className="flex items-start justify-between gap-3">
            <p className="leading-relaxed text-deep-700">{state.word}</p>
            <button
              onClick={() => setPicked(null)}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-600"
            >
              <X size={15} />
            </button>
          </div>
          <blockquote className="mt-3 border-l-2 border-water-500/30 pl-4 font-serif text-lg leading-relaxed text-deep-900">
            “{state.verseText}”
          </blockquote>
          <p className="mt-2 pl-4 text-xs uppercase tracking-[0.16em] text-water-600">{state.verseRef}</p>

          {suggested && (
            <Link
              to={`/devotional/${suggested.id}`}
              className="group mt-4 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-line transition hover:ring-water-400"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
                  A devotional for this
                </p>
                <p className="truncate font-medium text-deep-900">{suggested.title}</p>
              </div>
              <ArrowRight
                size={17}
                className="shrink-0 text-water-600 transition group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
