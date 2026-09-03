import { useState } from 'react'
import {
  ArrowUpRight,
  BellRing,
  Brain,
  Check,
  ChevronDown,
  Clock,
  DoorClosed,
  Droplets,
  Eye,
  Flame,
  Hourglass,
  KeyRound,
  Moon,
  ScrollText,
  Sunrise,
  Users,
} from 'lucide-react'
import {
  ARTICLE,
  KEY_VERSE,
  MOVEMENTS,
  PARABLE,
  PRACTICES,
  SYMBOLS,
  type Movement,
} from '../data/tenVirgins'
import { Seo } from '../components/Seo'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'

/** The Ten Virgins — a deep study of the parable (Matthew 25:1–13), read for the
 *  world we live in now. Watchful and hopeful, never date-setting. Companion to
 *  the End Times study; reached from the Study (Deep Dive) page. */

function movementIcon(i: number) {
  const icons = [Users, Flame, Clock, Moon, BellRing, Droplets, Hourglass, DoorClosed, Eye]
  const Icon = icons[i] ?? Flame
  return <Icon size={18} />
}

function MovementCard({ movement, index }: { movement: Movement; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-mist-100"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
          {movementIcon(index)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-tight text-deep-900">{movement.title}</span>
          <span className="block text-sm text-deep-500">{movement.passage}</span>
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-deep-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5">
          <blockquote className="border-l-2 border-water-500/30 pl-4">
            <p className="font-serif text-lg italic leading-relaxed text-deep-800">
              “{movement.verseText}”
            </p>
          </blockquote>

          <p className="mt-4 leading-relaxed text-deep-700">{movement.meaning}</p>

          <div className="mt-5 rounded-2xl bg-water-500/10 p-4 ring-1 ring-water-500/20">
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
              <Clock size={13} />
              In our world today
            </p>
            <p className="leading-relaxed text-deep-700">{movement.today}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function TenVirgins() {
  const addMemoryVerse = useStore((s) => s.addMemoryVerse)
  const inMemory = useStore((s) => s.memoryVerses.some((v) => v.ref === KEY_VERSE.ref))
  const pushToast = useToast((t) => t.push)

  const memorize = () => {
    if (inMemory) return
    addMemoryVerse(KEY_VERSE.ref, KEY_VERSE.text, KEY_VERSE.translation)
    pushToast({ tone: 'success', title: 'Added to Scripture Memory', message: KEY_VERSE.ref })
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo path="/ten-virgins" />
      <header>
        <h1 className="text-2xl">The Ten Virgins</h1>
        <p className="mt-1 text-sm text-deep-500">
          The parable of the wise and foolish (Matthew 25) — and what it asks of us now.
        </p>
      </header>

      {/* Framing: the parable in context — watchful, hopeful, self-examining */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Flame size={15} />
          Keep your lamp burning
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          On the Mount of Olives, teaching His followers about the close of the age, Jesus told of ten
          young women waiting through the night for a bridegroom. It is not, first of all, a story about
          the end of the world — it is a story about readiness, and about a difference between two kinds
          of waiting that stays hidden until the very last hour. Two thousand years into the wait, it may
          be the most searching parable He ever told for a world like ours.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          We read it the way He meant it — not to fix a date, but to examine our own hearts and be found
          ready. It ends where He wants us to live:
        </p>
        <p className="mt-3 font-serif text-lg italic leading-relaxed text-deep-800">
          “Watch therefore, for you don’t know the day nor the hour.”
        </p>
        <p className="mt-1.5 text-sm font-semibold text-water-600">Matthew 25:13</p>
      </section>

      {/* The parable itself, read through */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <ScrollText size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">The parable</h2>
            <p className="text-sm text-deep-500">Matthew 25:1–13</p>
          </div>
        </div>
        <div className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
          <div className="flex flex-col gap-3">
            {PARABLE.map((v) => (
              <p key={v.n} className="font-serif text-[1.05rem] leading-relaxed text-deep-800">
                <span className="mr-1 align-super text-[0.7rem] font-semibold text-water-600">
                  {v.n}
                </span>
                {v.text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* The symbols, unveiled */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <KeyRound size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">The symbols, unveiled</h2>
            <p className="text-sm text-deep-500">What each part of the story stands for</p>
          </div>
        </div>
        <ul className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
          {SYMBOLS.map((s, i) => (
            <li
              key={s.element}
              className={`px-5 py-4 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <p className="font-serif text-lg leading-tight text-deep-900">{s.element}</p>
              <p className="mt-1 leading-relaxed text-deep-600">{s.meaning}</p>
              {s.ref && (
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.15em] text-water-600">
                  {s.ref}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Walking through the parable, into today */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Flame size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">Walking through it</h2>
            <p className="text-sm text-deep-500">Open each movement — the story, and our own day</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {MOVEMENTS.map((m, i) => (
            <MovementCard key={m.title} movement={m} index={i} />
          ))}
        </div>
      </section>

      {/* Keeping the lamp full — the hopeful turn */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Droplets size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">Keeping your lamp full today</h2>
            <p className="text-sm text-deep-500">How to “buy oil” now, before midnight</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {PRACTICES.map((p) => (
            <div key={p.title} className="rounded-card bg-card p-5 shadow-sm ring-1 ring-line">
              <h3 className="text-lg leading-tight text-deep-900">{p.title}</h3>
              <p className="mt-1.5 leading-relaxed text-deep-600">{p.text}</p>
              {p.ref && (
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.15em] text-water-600">{p.ref}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Closing: the blessed hope, and a verse to carry */}
      <section className="rounded-card bg-reed-500/10 p-6 ring-1 ring-reed-400/30">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-reed-500">
          <Sunrise size={15} />
          The Bridegroom is coming
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          For all its solemn warning, the parable is finally about hope. The Bridegroom is coming, the
          feast is real, and the door still stands open now. A full lamp is not earned in fear; it is
          filled by love, one unhurried day at a time. So do not be anxious — be ready. Keep a little
          oil in the vessel, keep the flame low and steady, and let Him find you watching.
        </p>
        <blockquote className="mt-4 border-l-2 border-reed-400/40 pl-4">
          <p className="font-serif text-lg italic leading-relaxed text-deep-800">
            “{KEY_VERSE.text}”
          </p>
          <p className="mt-1.5 text-sm font-semibold text-reed-500">{KEY_VERSE.ref}</p>
        </blockquote>
        <button
          onClick={memorize}
          disabled={inMemory}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-card py-2.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-60 disabled:hover:bg-card sm:w-auto sm:px-5"
        >
          {inMemory ? <Check size={16} /> : <Brain size={16} />}
          {inMemory ? 'In Scripture Memory' : 'Memorize this verse'}
        </button>
      </section>

      {/* Companion teaching — the author's Oil in My Lamp site, named for this parable */}
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
