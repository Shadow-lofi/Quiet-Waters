import { STUDY_MATERIAL, type StudyPiece } from '../data/study'

/**
 * Study material — Scripture to sit with and return to. Renders each piece from
 * data/study.ts as a titled card with a numbered list, styled to match the
 * app's calm, reverent surfaces.
 */
export function Study() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl">Study material</h1>
        <p className="mt-1 text-sm text-deep-500">Scripture to sit with, and to return to.</p>
      </header>

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
      </div>
    </section>
  )
}
