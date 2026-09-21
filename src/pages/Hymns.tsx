import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { HYMNS, hymnOfDayIndex, hymnReadingLines, type Hymn } from '../data/hymns'
import { NarrationButton } from '../components/NarrationButton'
import { Seo } from '../components/Seo'

/**
 * Daily Hymn — a beloved, public-domain hymn of the church to read slowly and
 * pray, a new one each day. The day's hymn is steady through the day (so it can
 * be returned to), but freely changed with "Another." Every text is in the
 * public domain; the page reads them as words to dwell on rather than perform,
 * with an optional gentle narration to read (or sing) along.
 */
export function Hymns() {
  const [idx, setIdx] = useState(hymnOfDayIndex)
  const hymn: Hymn = HYMNS[idx]

  const another = () => {
    setIdx((i) => (i + 1) % HYMNS.length)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo path="/hymns" />
      <header>
        <h1 className="text-2xl">Daily Hymn</h1>
        <p className="mt-1 text-sm text-deep-500">
          A hymn to dwell on and pray — a new one each day, sung by the church for generations.
        </p>
      </header>

      {/* The hymn */}
      <article className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-[1.6rem] leading-tight text-deep-900">{hymn.title}</h2>
            <p className="mt-1 text-sm text-deep-500">{hymn.author}</p>
          </div>
          <button
            onClick={another}
            aria-label="Another hymn"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-500 ring-1 ring-line transition hover:bg-mist-200 hover:text-deep-700"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* A one-line invitation, and the Scripture it flows from */}
        <p className="border-l-2 border-water-500/30 pl-4 font-serif italic leading-relaxed text-deep-700">
          {hymn.theme}
        </p>
        {hymn.scripture && (
          <p className="mt-2 pl-4 text-xs uppercase tracking-[0.16em] text-water-600">{hymn.scripture}</p>
        )}

        {/* Listen — read (or sing) along at a gentle pace */}
        <div className="mt-5">
          <NarrationButton
            session={`hymn:${hymn.id}`}
            segments={hymnReadingLines(hymn)}
            label="Read to me"
          />
        </div>

        {/* The stanzas — numbered, with the refrain after the first, as a hymnal prints it */}
        <div className="mt-6 flex flex-col gap-6">
          {hymn.stanzas.map((stanza, i) => (
            <div key={i}>
              <div className="flex gap-3">
                <span className="mt-1 select-none font-serif text-sm text-deep-300">{i + 1}</span>
                <p className="font-serif text-lg leading-relaxed text-deep-900">
                  {stanza.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < stanza.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>

              {hymn.refrain && i === 0 && (
                <div className="mt-4 ml-6 border-l-2 border-mist-300 pl-4">
                  <p className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-deep-400">Refrain</p>
                  <p className="font-serif text-lg italic leading-relaxed text-deep-700">
                    {hymn.refrain.map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < hymn.refrain!.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </article>

      <p className="text-center text-xs leading-relaxed text-deep-400">
        Words in the public domain, offered as a quiet act of worship.
      </p>
    </div>
  )
}
