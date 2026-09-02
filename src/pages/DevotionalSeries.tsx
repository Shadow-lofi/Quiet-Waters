import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Feather,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'
import { SessionOverlay } from '../components/SessionOverlay'
import { NarrationButton } from '../components/NarrationButton'
import { primeAudio } from '../lib/audio'
import {
  seriesById,
  completedCount,
  nextIncompleteDay,
  type DevotionalDay,
  type DevotionalSeries as Series,
} from '../data/devotionals'
import type { MeditationVerse } from '../data/verses'

export function DevotionalSeries() {
  const { id } = useParams()
  const series = id ? seriesById(id) : undefined
  const done = useStore((s) => (series ? s.devotionalProgress[series.id] : undefined)) ?? []
  const startDevotional = useStore((s) => s.startDevotional)

  const [openDay, setOpenDay] = useState<number | null>(null)

  // Remember this as the series to resume on the home screen.
  useEffect(() => {
    if (series) startDevotional(series.id)
  }, [series, startDevotional])

  if (!series) return <Navigate to="/devotional" replace />

  if (openDay !== null && series.days[openDay]) {
    return (
      <DayReader
        key={openDay}
        series={series}
        dayIndex={openDay}
        isDone={done.includes(openDay)}
        onNavigate={setOpenDay}
      />
    )
  }

  return <SeriesOverview series={series} done={done} onOpen={setOpenDay} />
}

// ── Series overview: the list of days ────────────────────────────────
function SeriesOverview({
  series,
  done,
  onOpen,
}: {
  series: Series
  done: number[]
  onOpen: (i: number) => void
}) {
  const count = completedCount(series.days.length, done)
  const nextDay = nextIncompleteDay(series.days.length, done)

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
          {series.days.length}-day devotional
        </p>
        <h1 className="mt-0.5 text-2xl">{series.title}</h1>
        <p className="mt-1 text-sm text-deep-500">{series.subtitle}</p>
        <p className="mt-3 text-xs font-medium text-deep-400">
          {count === 0
            ? 'Not started yet'
            : count >= series.days.length
              ? 'All days complete · return any time'
              : `${count} of ${series.days.length} days`}
        </p>
      </header>

      <ul className="flex flex-col gap-2.5">
        {series.days.map((d, i) => {
          const isDone = done.includes(i)
          const isNext = i === nextDay && !isDone
          return (
            <li key={i}>
              <button
                onClick={() => onOpen(i)}
                className={`flex w-full items-center gap-3.5 rounded-card bg-card p-4 text-left shadow-sm ring-1 transition hover:shadow-md ${
                  isNext ? 'ring-water-400' : 'ring-line hover:ring-water-400'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isDone ? 'bg-mist-200 text-water-600' : 'bg-mist-100 text-deep-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-deep-400">
                    Day {i + 1}
                    {isNext && <span className="ml-2 text-water-600">· Continue</span>}
                  </span>
                  <span className="block truncate font-medium text-deep-900">{d.title}</span>
                  <span className="block truncate text-xs text-deep-500">{d.verseRef}</span>
                </span>
                <ArrowRight size={17} className="shrink-0 text-water-600" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Day reader: verse → reflection → sit → pray ──────────────────────
function DayReader({
  series,
  dayIndex,
  isDone,
  onNavigate,
}: {
  series: Series
  dayIndex: number
  isDone: boolean
  onNavigate: (i: number | null) => void
}) {
  const day: DevotionalDay = series.days[dayIndex]
  const total = series.days.length
  const isLast = dayIndex === total - 1

  const completeDevotionalDay = useStore((s) => s.completeDevotionalDay)
  const addPrayer = useStore((s) => s.addPrayer)
  const push = useToast((s) => s.push)

  const [sitting, setSitting] = useState(false)
  const [prayerDraft, setPrayerDraft] = useState(day.prayer)
  const [addedPrayer, setAddedPrayer] = useState(false)

  const sitVerse: MeditationVerse = {
    ref: day.verseRef,
    text: day.verseText,
    breathIn: day.breathIn,
    breathOut: day.breathOut,
  }

  const beginSit = () => {
    primeAudio() // unlock audio within the user gesture
    setSitting(true)
  }

  const addToJournal = () => {
    if (!prayerDraft.trim() || addedPrayer) return
    addPrayer(prayerDraft)
    setAddedPrayer(true)
    push({ tone: 'success', title: 'Added to your prayer journal' })
  }

  const complete = () => {
    completeDevotionalDay(series.id, dayIndex)
    onNavigate(isLast ? null : dayIndex + 1) // finish → back to overview; else next day
  }

  return (
    <div className="flex flex-col gap-6">
      {/* header row */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate(null)}
          className="-ml-1.5 inline-flex items-center gap-0.5 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-deep-500 transition hover:bg-mist-200 hover:text-deep-700"
        >
          <ChevronLeft size={18} /> All days
        </button>
        <span className="text-xs uppercase tracking-[0.18em] text-deep-400">
          Day {dayIndex + 1} of {total}
        </span>
      </div>

      <header>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
          {series.title}
        </p>
        <h1 className="mt-1 font-serif text-3xl leading-tight text-deep-900">{day.title}</h1>
      </header>

      {/* the verse to dwell on */}
      <section className="rounded-card bg-gradient-to-br from-mist-200/60 to-card p-6 shadow-sm ring-1 ring-line">
        <blockquote className="font-serif text-2xl leading-relaxed text-deep-900">
          “{day.verseText}”
        </blockquote>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm uppercase tracking-[0.18em] text-water-600">{day.verseRef}</p>
          <NarrationButton
            session={`dev-${series.id}-${dayIndex}`}
            segments={[day.verseText, day.reflection]}
            className="shrink-0"
          />
        </div>
      </section>

      {/* reflection */}
      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-deep-500">Reflect</p>
        <p className="leading-relaxed text-deep-700">{day.reflection}</p>
      </section>

      {/* an optional pause to be still with the words */}
      <button
        onClick={beginSit}
        className="flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <Feather size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-deep-900">Sit with this</p>
          <p className="truncate text-sm text-deep-500">
            {day.sitMinutes ?? 5} min · breathe the words, and be still
          </p>
        </div>
        <ArrowRight size={18} className="shrink-0 text-water-600" />
      </button>

      {/* pray — and carry it into the journal */}
      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-deep-500">Pray</p>
        <textarea
          value={prayerDraft}
          onChange={(e) => {
            setPrayerDraft(e.target.value)
            setAddedPrayer(false)
          }}
          rows={3}
          className="w-full resize-none rounded-2xl bg-card px-4 py-3 font-serif text-lg leading-relaxed text-deep-800 shadow-sm outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <Link to="/prayers" className="text-xs font-medium text-water-600 hover:underline">
            Open prayer journal
          </Link>
          <button
            onClick={addToJournal}
            disabled={!prayerDraft.trim() || addedPrayer}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-water-600 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-60 disabled:hover:bg-transparent"
          >
            {addedPrayer ? <Check size={15} /> : null}
            {addedPrayer ? 'In your prayer journal' : 'Add to prayer journal'}
          </button>
        </div>
      </section>

      {/* complete + move on */}
      <div className="mt-1 flex flex-col gap-3 border-t border-line pt-5">
        <button
          onClick={complete}
          className="w-full rounded-full bg-water-500 py-3 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
        >
          {isDone
            ? isLast
              ? 'Done · back to days'
              : 'Continue to the next day'
            : isLast
              ? 'Mark complete & finish'
              : 'Mark complete & continue'}
        </button>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate(dayIndex - 1)}
            disabled={dayIndex === 0}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-deep-500 transition hover:bg-mist-200 disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            onClick={() => onNavigate(dayIndex + 1)}
            disabled={isLast}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-deep-500 transition hover:bg-mist-200 disabled:opacity-30"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {sitting && (
        <SessionOverlay
          durationMin={day.sitMinutes ?? 5}
          verse={sitVerse}
          title={day.title}
          onClose={() => setSitting(false)}
        />
      )}
    </div>
  )
}
