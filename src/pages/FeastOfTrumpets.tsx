import { useState } from 'react'
import {
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Cloud,
  Crown,
  EyeOff,
  Flame,
  Megaphone,
  ScrollText,
  Sunrise,
  Users,
  VolumeX,
} from 'lucide-react'
import {
  ARTICLE,
  FOUNDATION,
  KEY_VERSE,
  THEMES,
  THESS_PASSAGE,
  type Theme,
} from '../data/feastOfTrumpets'
import { Seo } from '../components/Seo'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'

/** The Feast of Trumpets — Yom Teruah (Leviticus 23; Numbers 29), read for its
 *  meaning now and correlated to the trumpet of 1 Thessalonians 4. Watchful and
 *  hopeful, never date-setting. Companion to the End Times cluster; reached from
 *  the Study (Deep Dive) page. */

function themeIcon(i: number) {
  const icons = [Sunrise, Users, Crown, EyeOff, Megaphone]
  const Icon = icons[i] ?? Megaphone
  return <Icon size={18} />
}

function ThemeCard({ theme, index }: { theme: Theme; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-mist-100"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
          {themeIcon(index)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-tight text-deep-900">{theme.title}</span>
          <span className="block text-sm text-deep-500">{theme.passage}</span>
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
              “{theme.verseText}”
            </p>
          </blockquote>

          <p className="mt-4 leading-relaxed text-deep-700">{theme.meaning}</p>

          <div className="mt-5 rounded-2xl bg-water-500/10 p-4 ring-1 ring-water-500/20">
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
              <Sunrise size={13} />
              For us now
            </p>
            <p className="leading-relaxed text-deep-700">{theme.today}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function FeastOfTrumpets() {
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
      <Seo path="/feast-of-trumpets" />
      <header>
        <h1 className="text-2xl">The Feast of Trumpets</h1>
        <p className="mt-1 text-sm text-deep-500">
          Yom Teruah — the day of the blast (Leviticus 23) — and the trumpet still to come.
        </p>
      </header>

      {/* Framing */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Megaphone size={15} />
          The trumpet that is coming
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          On the first day of the seventh month, the LORD set apart a holy day marked by one thing: the
          sound of trumpets. No long ritual, no explanation given — just a blast over a resting people, a
          “memorial of blowing of trumpets.” Of all the appointed feasts, it is the one announced by a
          noise.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          The Jewish people have kept it for millennia as Yom Teruah — the day of the shout — and Rosh
          Hashanah, the head of the year. But the trumpet has always pointed past itself: to an awakening,
          a gathering, the crowning of a King, and a day whose hour no one can name. The New Testament
          picks up the very same sound and lets it ring into the future — to the trumpet still to blow.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          We read it the way we read all these things — not to fix a date, but to listen, and to be found
          ready.
        </p>
      </section>

      {/* Foundation */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <ScrollText size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">Where Scripture appoints it</h2>
            <p className="text-sm text-deep-500">Leviticus 23 · Numbers 29</p>
          </div>
        </div>
        <div className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
          <div className="flex flex-col gap-5">
            {FOUNDATION.map((v) => (
              <div key={v.ref} className="border-l-2 border-water-500/25 pl-4">
                <p className="font-serif text-[1.05rem] italic leading-relaxed text-deep-800">
                  “{v.text}”
                </p>
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-water-600">
                  {v.ref}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This year — the silent trumpet */}
      <section className="rounded-card bg-water-500/10 p-6 ring-1 ring-water-500/25">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <VolumeX size={15} />
          This year — 2026 · Hebrew year 5787
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          In 2026 the Feast of Trumpets begins at sundown on Friday, September 11, with its first day on
          Saturday, September 12, and a second day on Sunday, September 13. This year holds a quiet
          irony: the first day, September 12, falls on the <span className="font-medium text-deep-800">Sabbath</span>.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          By an ancient Jewish tradition, when the Feast of Trumpets falls on the Sabbath the shofar is
          not sounded on that first day — the main blowing waits until the second (the second day never
          lands on a Sabbath, so the trumpet always sounds on at least one). So this year, on the very
          Feast of the Trumpet Blast, the trumpet is <span className="font-medium text-deep-800">silent</span> on
          day one.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          There is something to sit with in that hush. On the day made for the blast, the horn is laid
          down and the feast keeps a Sabbath rest. A silence on the Feast of Trumpets turns the ear
          forward — to the one trumpet no tradition can quiet and no calendar can schedule: the trumpet of
          God. We are not saying this is the year — “no one knows the day or the hour” (Matthew 24:36). We
          only let the silence make us listen.
        </p>
      </section>

      {/* The meanings of the trumpet */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Megaphone size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">What the trumpet means</h2>
            <p className="text-sm text-deep-500">Open each — the Scripture, and our own day</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {THEMES.map((t, i) => (
            <ThemeCard key={t.title} theme={t} index={i} />
          ))}
        </div>
      </section>

      {/* 1 Thessalonians 4 — the trumpet still to sound */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Cloud size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">The trumpet still to sound</h2>
            <p className="text-sm text-deep-500">1 Thessalonians 4:15–18</p>
          </div>
        </div>
        <div className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
          <div className="flex flex-col gap-3">
            {THESS_PASSAGE.map((v) => (
              <p key={v.n} className="font-serif text-[1.05rem] leading-relaxed text-deep-800">
                <span className="mr-1 align-super text-[0.7rem] font-semibold text-water-600">
                  {v.n}
                </span>
                {v.text}
              </p>
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <p className="leading-relaxed text-deep-700">
              Paul is not writing to frighten the Thessalonians but to comfort them. They were grieving
              believers who had died before Christ returned, afraid their loved ones had somehow missed
              the day. He answers with a trumpet.
            </p>
            <p className="mt-3 leading-relaxed text-deep-700">
              Notice verse 15: <span className="italic">“we who are alive… will in no way precede those
              who have fallen asleep.”</span> No one is left out and no one is left behind — the dead in
              Christ are first. Then, in verse 16, everything the Feast of Trumpets ever meant arrives at
              once: <span className="font-medium text-deep-800">a shout</span> and{' '}
              <span className="font-medium text-deep-800">the trumpet of God</span> — the awakening blast;{' '}
              <span className="font-medium text-deep-800">the dead rise</span> — the great waking; and in
              verse 17 the living are <span className="font-medium text-deep-800">caught up together</span>{' '}
              — the gathering — to meet the descending King in the air.
            </p>
            <p className="mt-3 leading-relaxed text-deep-700">
              The blast that wakes, the horn that gathers, the fanfare that crowns the King — Paul’s “trump
              of God” is the true and final Feast of Trumpets, the one every autumn rehearsal has pointed
              toward. Whether the appointed feasts mark its timing is something faithful people debate; the
              pattern and the promise are not in doubt. And so verse 18 gives the whole passage its
              purpose: <span className="italic">“comfort one another with these words.”</span>
            </p>
          </div>
        </div>
      </section>

      {/* Closing hope + a verse to carry */}
      <section className="rounded-card bg-reed-500/10 p-6 ring-1 ring-reed-400/30">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-reed-500">
          <Sunrise size={15} />
          Comfort one another with these words
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          For those who are His, the coming trumpet is not a sound to dread. It is a coronation and a
          homecoming — the King descending, the dead awakened, the scattered gathered, and every one of
          His own with Him forever. So do not be anxious; be awake. Keep listening, keep watching, and let
          the promise steady your heart today.
        </p>
        <blockquote className="mt-4 border-l-2 border-reed-400/40 pl-4">
          <p className="font-serif text-lg italic leading-relaxed text-deep-800">“{KEY_VERSE.text}”</p>
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

      {/* Companion teaching — the author's Oil in My Lamp site */}
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
