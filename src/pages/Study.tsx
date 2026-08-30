import { Link } from 'react-router-dom'
import { ArrowRight, Flame } from 'lucide-react'
import { STUDY_MATERIAL, type StudyPiece } from '../data/study'
import { Seo } from '../components/Seo'

/**
 * Study material — Scripture to sit with and return to. Renders each piece from
 * data/study.ts as a titled card with a numbered list, styled to match the
 * app's calm, reverent surfaces.
 */
export function Study() {
  return (
    <div className="flex flex-col gap-8">
      <Seo path="/study" />
      <header>
        <h1 className="text-2xl">Deep Dive</h1>
        <p className="mt-1 text-sm text-deep-500">Scripture to sit with, and to return to.</p>
      </header>

      {/* Featured: the End Times Study, opened on its own page */}
      <Link
        to="/last-days"
        className="group block rounded-card bg-card p-5 shadow-sm ring-1 ring-line transition hover:shadow-md hover:ring-water-400 sm:p-6"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
            <Flame size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
              Featured study
            </p>
            <h2 className="mt-0.5 text-lg leading-tight text-deep-900">End Times Study</h2>
            <p className="mt-1 text-sm leading-snug text-deep-500">
              Watchful and hopeful — the signs of the times, and deep dives in Matthew, Acts &amp; Revelation.
            </p>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 text-water-600 transition group-hover:translate-x-0.5"
          />
        </div>
      </Link>

      {STUDY_MATERIAL.map((piece) => (
        <StudyCard key={piece.id} piece={piece} />
      ))}
    </div>
  )
}

function StudyCard({ piece }: { piece: StudyPiece }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-2xl">{piece.title}</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-water-600">{piece.reference}</p>
      </div>

      <div className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        {piece.overview && (
          <p className="mb-5 leading-relaxed text-deep-700">{piece.overview}</p>
        )}

        {piece.intro && (
          <blockquote className="mb-5 border-l-2 border-water-500/30 pl-4 font-serif text-lg italic leading-relaxed text-deep-700">
            {piece.intro}
          </blockquote>
        )}

        {piece.layout === 'lines' ? (
          <div className="flex flex-col gap-4">
            {piece.items.map((item, i) => (
              <p key={i} className="font-serif text-xl leading-relaxed text-deep-900">
                {item.text}
              </p>
            ))}
          </div>
        ) : piece.layout === 'mapping' ? (
          <ul className="flex flex-col gap-5">
            {piece.items.map((item, i) => (
              <li key={i} className="border-l-2 border-water-500/25 pl-4">
                {item.term && (
                  <p className="font-serif text-lg leading-snug text-deep-900">{item.term}</p>
                )}
                <p className="mt-0.5 leading-relaxed text-deep-600">{item.text}</p>
                {item.ref && (
                  <p className="mt-1 text-[0.7rem] uppercase tracking-[0.15em] text-water-600">
                    {item.ref}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ol className="flex flex-col gap-5">
            {piece.items.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist-200 text-sm font-semibold text-water-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-snug text-deep-900">{item.text}</p>
                  {item.ref && (
                    <p className="mt-1 text-[0.7rem] uppercase tracking-[0.15em] text-deep-400">
                      {item.ref}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        {piece.note && (
          <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-deep-500">
            {piece.note}
          </p>
        )}
      </div>
    </section>
  )
}
