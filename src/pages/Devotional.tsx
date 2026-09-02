import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useStore } from '../lib/store'
import {
  DEVOTIONAL_SERIES,
  completedCount,
  isSeriesComplete,
} from '../data/devotionals'

/**
 * Devotional library — unhurried, multi-day paths through Scripture. Each series
 * card shows where you are; tapping opens the series and its days. Grace-filled:
 * progress is remembered, never a streak to break. Local and private.
 */
export function Devotional() {
  const progress = useStore((s) => s.devotionalProgress)

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-2xl">Devotionals</h1>
        <p className="mt-1 text-sm text-deep-500">
          A few unhurried days in the Word — read, be still, and pray.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {DEVOTIONAL_SERIES.map((s) => {
          const done = progress[s.id] ?? []
          const count = completedCount(s.days.length, done)
          const complete = isSeriesComplete(s.days.length, done)
          const started = count > 0
          return (
            <Link
              key={s.id}
              to={`/devotional/${s.id}`}
              className="group block rounded-card bg-card p-5 shadow-sm ring-1 ring-line transition hover:shadow-md hover:ring-water-400 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
                      {s.days.length}-day devotional
                    </p>
                    {complete && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-mist-200 px-2 py-0.5 text-[0.65rem] font-semibold text-water-600">
                        <Check size={11} /> Complete
                      </span>
                    )}
                  </div>
                  <h2 className="mt-0.5 text-lg leading-tight text-deep-900">{s.title}</h2>
                  <p className="mt-1 text-sm leading-snug text-deep-500">{s.subtitle}</p>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-water-600 transition group-hover:translate-x-0.5"
                />
              </div>

              <p className="mt-4 border-t border-line pt-3 font-serif text-[0.95rem] italic leading-snug text-deep-700">
                “{s.verseText}”
                <span className="mt-1 block text-xs uppercase not-italic tracking-[0.16em] text-water-600">
                  {s.verseRef}
                </span>
              </p>

              {started && !complete && (
                <p className="mt-3 text-xs font-medium text-water-600">
                  Continue · {count} of {s.days.length} days
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
