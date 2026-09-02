import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RefreshCw,
  Share2,
  Minus,
  Plus,
  Flame,
  Feather,
  Sunrise,
  Wind,
  Moon,
  MoonStar,
  Hourglass,
  BookOpen,
  HeartHandshake,
  ArrowRight,
  Brain,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { Onboarding } from '../components/Onboarding'
import { ReminderBanner } from '../components/ReminderBanner'
import { SabbathCard } from '../components/SabbathCard'
import { NotificationsBell } from '../components/NotificationsBell'
import { SoulCheck } from '../components/SoulCheck'
import { SessionOverlay } from '../components/SessionOverlay'
import { VerseShareSheet } from '../components/VerseShareSheet'
import { useStore } from '../lib/store'
import { primeAudio } from '../lib/audio'
import { computeStats } from '../lib/streak'
import { VERSES, verseByRef, YAHWEH_BREATH } from '../data/verses'
import { dueVerses } from '../data/memory'
import { seriesById, nextIncompleteDay } from '../data/devotionals'
import { DURATION_PRESETS } from '../data/presets'
import { GUIDED_SESSIONS, type GuidedSession } from '../data/guided'

function greeting(name: string): string {
  const h = new Date().getHours()
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return name ? `${part}, ${name}` : part
}

const GUIDED_ICON: Record<GuidedSession['icon'], typeof Sunrise> = {
  still: Feather,
  sunrise: Sunrise,
  breath: Wind,
  rest: Moon,
  wait: Hourglass,
  evening: MoonStar,
}

export function Meditate() {
  const { name, verseCursor, nextVerse, lastDurationMin, setLastDuration, sessions, breatheName, setPref, memoryVerses } =
    useStore()
  const devotionalActive = useStore((s) => s.devotionalActive)
  const devotionalProgress = useStore((s) => s.devotionalProgress)
  const verse = VERSES[verseCursor % VERSES.length]
  const streak = computeStats(sessions).currentStreak
  const memoryDue = dueVerses(memoryVerses).length

  // Resume the active devotional, if one is under way and not yet finished.
  const activeSeries = devotionalActive ? seriesById(devotionalActive) : undefined
  const devNextDay = activeSeries
    ? nextIncompleteDay(activeSeries.days.length, devotionalProgress[activeSeries.id] ?? [])
    : 0
  const showDevResume = activeSeries && devNextDay < activeSeries.days.length

  const [minutes, setMinutes] = useState(lastDurationMin)
  const [active, setActive] = useState(false)
  const [guided, setGuided] = useState<GuidedSession | null>(null)
  const [sharing, setSharing] = useState(false)

  const clamp = (n: number) => Math.max(1, Math.min(120, n))

  const begin = () => {
    primeAudio() // unlock audio within the user gesture
    setLastDuration(minutes)
    setActive(true)
  }

  const beginGuided = (session: GuidedSession) => {
    primeAudio()
    setGuided(session)
  }

  return (
    <div className="relative flex flex-col gap-7">
      <Onboarding />

      <NotificationsBell className="absolute right-0 top-0 z-10" />

      {/* header — centered hero */}
      <header className="qw-enter flex flex-col items-center gap-2 pt-2 text-center">
        <span className="qw-float text-water-500">
          <Logo size={46} />
        </span>
        <h1 className="qw-title text-4xl leading-none tracking-tight">Quiet Waters</h1>
        <p className="text-sm text-deep-500">{greeting(name)}</p>
        {streak > 0 && (
          <Link
            to="/journey"
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-sm font-semibold text-water-600 shadow-sm ring-1 ring-line"
          >
            <Flame size={15} /> {streak} day{streak > 1 ? 's' : ''}
          </Link>
        )}
      </header>

      <ReminderBanner onBegin={begin} />

      {/* weekly Sabbath — a warm invitation to rest as worship */}
      <SabbathCard />

      {/* scripture memory — a gentle nudge when verses are due to review */}
      {memoryDue > 0 && (
        <Link
          to="/memory"
          className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
            <Brain size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-deep-900">
              {memoryDue} verse{memoryDue > 1 ? 's' : ''} to review
            </p>
            <p className="truncate text-sm text-deep-500">Hide the Word in your heart</p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-water-600 transition group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* resume the devotional you're in the middle of */}
      {showDevResume && activeSeries && (
        <Link
          to={`/devotional/${activeSeries.id}`}
          className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
            <Sunrise size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-deep-900">Continue · {activeSeries.title}</p>
            <p className="truncate text-sm text-deep-500">
              Day {devNextDay + 1} of {activeSeries.days.length}
            </p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-water-600 transition group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* how is your soul today? — a gentle check-in before sitting */}
      <SoulCheck />

      {/* verse to dwell on */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-deep-500">Dwell on this</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSharing(true)}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-deep-500 hover:bg-mist-200 hover:text-deep-700"
              aria-label="Share this verse as an image"
            >
              <Share2 size={13} /> Share
            </button>
            <button
              onClick={() => nextVerse(VERSES.length)}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-deep-500 hover:bg-mist-200 hover:text-deep-700"
              aria-label="Show another verse"
            >
              <RefreshCw size={13} /> New
            </button>
          </div>
        </div>
        <blockquote className="font-serif text-2xl leading-relaxed text-deep-900">
          “{verse.text}”
        </blockquote>
        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-water-600">{verse.ref}</p>
      </section>

      {sharing && (
        <VerseShareSheet
          verse={{ ref: verse.ref, text: verse.text }}
          onClose={() => setSharing(false)}
        />
      )}

      {/* what to carry on the breath */}
      <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">On the breath</p>
        <div className="flex max-w-xs gap-1 rounded-full bg-mist-200 p-1">
          <button
            onClick={() => setPref('breatheName', false)}
            className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !breatheName ? 'bg-card text-water-600 shadow-sm' : 'text-deep-500 hover:text-deep-700'
            }`}
          >
            Scripture
          </button>
          <button
            onClick={() => setPref('breatheName', true)}
            className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              breatheName ? 'bg-card text-water-600 shadow-sm' : 'text-deep-500 hover:text-deep-700'
            }`}
          >
            The Name
          </button>
        </div>
        {breatheName && (
          <p className="mt-2 text-xs text-deep-500">
            Breathe the name of God — Yah in, weh out.
          </p>
        )}
      </section>

      {/* duration */}
      <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">How long?</p>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                minutes === m
                  ? 'bg-water-500 text-onwater shadow-sm'
                  : 'bg-card text-deep-700 ring-1 ring-line hover:bg-mist-200'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>

        {/* fine stepper */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            onClick={() => setMinutes((v) => clamp(v - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-deep-700 ring-1 ring-line hover:bg-mist-200"
            aria-label="One minute less"
          >
            <Minus size={18} />
          </button>
          <div className="text-center">
            <span className="font-serif text-4xl tabular-nums text-deep-900">{minutes}</span>
            <span className="ml-1 text-deep-500">min</span>
          </div>
          <button
            onClick={() => setMinutes((v) => clamp(v + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-deep-700 ring-1 ring-line hover:bg-mist-200"
            aria-label="One minute more"
          >
            <Plus size={18} />
          </button>
        </div>
      </section>

      {/* begin */}
      <button
        onClick={begin}
        className="rounded-full bg-water-500 py-4 text-lg font-semibold text-onwater shadow-lg shadow-water-500/20 transition-transform active:scale-[0.98]"
      >
        Begin
      </button>

      {/* Lectio Divina — pray the Scriptures slowly (own page) */}
      <Link
        to="/lectio"
        className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <BookOpen size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-deep-900">Lectio Divina</p>
          <p className="truncate text-sm text-deep-500">Pray the Scriptures, slowly</p>
        </div>
        <ArrowRight size={18} className="shrink-0 text-water-600 transition group-hover:translate-x-0.5" />
      </Link>

      {/* Send an encouragement — a verse card for someone (own page) */}
      <Link
        to="/encourage"
        className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <HeartHandshake size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-deep-900">Send an encouragement</p>
          <p className="truncate text-sm text-deep-500">A verse for someone you love</p>
        </div>
        <ArrowRight size={18} className="shrink-0 text-water-600 transition group-hover:translate-x-0.5" />
      </Link>

      {/* guided sessions */}
      <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">Guided sessions</p>
        <div className="flex flex-col gap-3">
          {GUIDED_SESSIONS.map((s) => {
            const Icon = GUIDED_ICON[s.icon]
            return (
              <button
                key={s.id}
                onClick={() => beginGuided(s)}
                className="flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-deep-900">{s.title}</p>
                  <p className="truncate text-sm text-deep-500">{s.subtitle}</p>
                </div>
                <span className="shrink-0 rounded-full bg-mist-200 px-3 py-1 text-xs font-semibold text-deep-600">
                  {s.durationMin} min
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {active && (
        <SessionOverlay
          durationMin={minutes}
          verse={breatheName ? YAHWEH_BREATH : verse}
          nameBreath={breatheName}
          onClose={() => setActive(false)}
        />
      )}
      {guided && (
        <SessionOverlay
          durationMin={guided.durationMin}
          verse={verseByRef(guided.verseRef)}
          paceOverride={guided.pace}
          steps={guided.steps}
          title={guided.title}
          nameBreath={guided.nameBreath}
          onClose={() => setGuided(null)}
        />
      )}
    </div>
  )
}
