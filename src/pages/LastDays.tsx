import { useState } from 'react'
import { ArrowUpRight, BookOpen, ChevronDown, Clock, Eye, Flame, Globe, ScrollText, Sunrise } from 'lucide-react'
import { ARTICLE, BOOKS, SIGNS, type BookStudy } from '../data/lastDays'
import { Seo } from '../components/Seo'

/** End Times Study — a watchful, hopeful walk through what the New Testament
 *  says about the close of the age. Ported from the companion Temple app and
 *  restyled for Quiet Waters. Reached from the Study (Deep Dive) page. */
function bookIcon(book: string) {
  if (book === 'Matthew') return <Eye size={18} />
  if (book === 'Acts') return <Globe size={18} />
  if (book === 'Revelation') return <ScrollText size={18} />
  return <BookOpen size={18} />
}

function BookCard({ study }: { study: BookStudy }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-mist-100"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
          {bookIcon(study.book)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-tight text-deep-900">The book of {study.book}</span>
          <span className="block text-sm text-deep-500">{study.subtitle}</span>
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-deep-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5">
          <p className="leading-relaxed text-deep-700">{study.overview}</p>

          {study.structure && (
            <div className="mt-4 rounded-2xl bg-mist-200/60 p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-deep-400">
                How it unfolds
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-deep-600">{study.structure}</p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {study.themes.map((t) => (
              <span key={t} className="rounded-full bg-mist-200 px-3 py-1 text-xs font-medium text-deep-600">
                {t}
              </span>
            ))}
          </div>

          <p className="mb-3 mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
            Key passages
          </p>
          <ul className="space-y-3.5">
            {study.passages.map((p) => (
              <li key={p.ref} className="rounded-2xl bg-mist-50 p-4 ring-1 ring-line">
                <p className="font-serif leading-relaxed text-deep-800">“{p.text}”</p>
                <p className="mt-1.5 text-sm font-semibold text-water-600">{p.ref}</p>
                <p className="mt-1.5 text-sm leading-snug text-deep-500">{p.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function LastDays() {
  return (
    <div className="flex flex-col gap-6">
      <Seo path="/last-days" />
      <header>
        <h1 className="text-2xl">End Times Study</h1>
        <p className="mt-1 text-sm text-deep-500">
          What the New Testament says about the close of the age — and how it reads in our own time.
        </p>
      </header>

      {/* Framing: watchful and hopeful, never fearful or date-setting */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Flame size={15} />
          Keep your lamp burning
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          Jesus told His followers to watch — not with fear, but with hope. These studies trace what the New
          Testament teaches about the last days, and how its words land in a world like ours. We hold it all
          with humility: “concerning that day and hour no one knows.” The goal is never to set dates, but to
          stay awake, faithful, and ready for the return of Christ.
        </p>
        <p className="mt-3 text-sm font-semibold text-water-600">Matthew 24:36</p>
      </section>

      {/* Signs of the times */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Eye size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">Signs of the times</h2>
            <p className="text-sm text-deep-500">New Testament themes, and how they read today</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {SIGNS.map((s) => (
            <div key={s.title} className="rounded-card bg-card p-5 shadow-sm ring-1 ring-line">
              <h3 className="text-lg leading-tight text-deep-900">{s.title}</h3>
              <div className="mt-3 rounded-2xl bg-mist-200/60 p-4">
                <p className="font-serif leading-relaxed text-deep-800">“{s.verseText}”</p>
                <p className="mt-1.5 text-sm font-semibold text-water-600">{s.verseRef}</p>
              </div>
              <div className="mt-3 flex gap-2.5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mist-200 text-water-600">
                  <Clock size={15} />
                </span>
                <p className="leading-relaxed text-deep-700">{s.today}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deep dives */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <BookOpen size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">Deep dive</h2>
            <p className="text-sm text-deep-500">Three New Testament books, opened up</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {BOOKS.map((b) => (
            <BookCard key={b.book} study={b} />
          ))}
        </div>
      </section>

      {/* Closing: the blessed hope */}
      <section className="rounded-card bg-reed-500/10 p-6 ring-1 ring-reed-400/30">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-reed-500">
          <Sunrise size={15} />
          The blessed hope
        </div>
        <p className="mt-3 font-serif text-lg leading-relaxed text-deep-800">
          “Straighten up and raise your heads, because your redemption is drawing near.”
        </p>
        <p className="mt-1.5 text-sm font-semibold text-reed-500">Luke 21:28</p>
        <p className="mt-4 leading-relaxed text-deep-700">
          The signs are not meant to frighten God’s people but to lift their eyes. We watch as those who know how
          the story ends — with every tear wiped away, death undone, and the Lord Himself among us. Until then:
          stay awake, keep your lamp burning, and live ready.
        </p>
      </section>

      {/* Companion teaching — the author's Oil in My Lamp site, at the foot */}
      <a
        href={ARTICLE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-card bg-card p-5 shadow-sm ring-1 ring-line transition hover:shadow-md hover:ring-water-400 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
            <Flame size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
              Go deeper
            </p>
            <h2 className="mt-1 flex items-center gap-1.5 text-xl leading-tight text-deep-900">
              {ARTICLE.title}
              <ArrowUpRight
                size={18}
                className="text-water-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-deep-600">{ARTICLE.blurb}</p>
          </div>
        </div>
      </a>
    </div>
  )
}
