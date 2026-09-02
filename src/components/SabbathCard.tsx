import { useState } from 'react'
import { Check, Feather, Settings2, BellRing } from 'lucide-react'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'
import { DOW_LETTER, DOW_FULL, dayKey } from '../lib/date'
import { sabbathVerse, weekSeed, daysUntilSabbath, isSabbathToday } from '../data/sabbath'
import { formatReminderTime } from '../lib/reminders'

/**
 * Sabbath rhythm — a weekly rest that celebrates rest as worship (Ex 20:8,
 * Mark 2:27, Heb 4:9–10) rather than guilt-tripping a missed day. On the user's
 * Sabbath it warmly invites rest and logs a gentle "Sabbaths kept" count (never
 * a streak to fail). On other days it stays quiet — just the next Sabbath. The
 * device-notification reminder is opt-in from Settings (see ReminderScheduler).
 */
export function SabbathCard() {
  const sabbathDay = useStore((s) => s.sabbathDay)
  const sabbathLog = useStore((s) => s.sabbathLog)
  const sabbathReminderOn = useStore((s) => s.sabbathReminderOn)
  const sabbathReminderTime = useStore((s) => s.sabbathReminderTime)
  const keepSabbath = useStore((s) => s.keepSabbath)
  const setSabbathDay = useStore((s) => s.setSabbathDay)
  const push = useToast((s) => s.push)

  const [pickerOpen, setPickerOpen] = useState(false)

  const today = dayKey()
  const isSabbath = isSabbathToday(sabbathDay)
  const keptToday = sabbathLog.includes(today)
  const kept = sabbathLog.length
  const daysUntil = daysUntilSabbath(sabbathDay)

  function chooseDay(day: number) {
    setSabbathDay(day)
    setPickerOpen(false)
    push({ tone: 'default', title: `Sabbath set to ${DOW_FULL[day]}` })
  }

  function rest() {
    keepSabbath(today)
    if (!keptToday) {
      push({ tone: 'success', title: 'Resting today 🕊️', message: 'Be still, and be restored.' })
    }
  }

  const reminderNote = sabbathReminderOn ? (
    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-deep-400">
      <BellRing size={12} /> Rest reminder · {formatReminderTime(sabbathReminderTime)}
    </p>
  ) : null

  const picker = (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-2 text-xs font-medium text-deep-500">Which day is your Sabbath?</p>
      <div className="flex gap-1.5">
        {DOW_LETTER.map((letter, i) => {
          const on = i === sabbathDay
          return (
            <button
              key={i}
              onClick={() => chooseDay(i)}
              aria-label={DOW_FULL[i]}
              aria-pressed={on}
              className={`h-10 flex-1 rounded-xl text-sm font-semibold transition ${
                on ? 'bg-water-500 text-onwater' : 'bg-mist-200 text-deep-600 hover:bg-mist-300'
              }`}
            >
              {letter}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-deep-400">
        A rest reminder can be turned on in Settings.
      </p>
    </div>
  )

  const gear = (
    <button
      onClick={() => setPickerOpen((v) => !v)}
      className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-700"
      aria-label="Change Sabbath day"
      aria-expanded={pickerOpen}
    >
      <Settings2 size={17} />
    </button>
  )

  // ── Off-day: a quiet reminder of the coming Sabbath ────────────────
  if (!isSabbath) {
    return (
      <section className="qw-enter rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mist-200 text-water-600">
            <Feather size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
              Sabbath rhythm
            </p>
            <p className="font-medium text-deep-900">
              Next Sabbath · {DOW_FULL[sabbathDay]}
              <span className="ml-1.5 font-normal text-deep-500">
                {daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {kept > 0 && <span className="hidden text-xs text-deep-400 sm:inline">{kept} kept</span>}
            {gear}
          </div>
        </div>
        {pickerOpen && picker}
      </section>
    )
  }

  // ── The Sabbath itself: a warm invitation to rest ──────────────────
  const verse = sabbathVerse(weekSeed())
  return (
    <section className="qw-enter rounded-card bg-gradient-to-br from-mist-200/70 to-card p-5 shadow-sm ring-1 ring-water-500/25">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="qw-float flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mist-300/70 text-water-700">
            <Feather size={22} />
          </span>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
              Rest · {DOW_FULL[sabbathDay]}
            </p>
            <h3 className="font-serif text-xl leading-tight text-deep-900">Today is your Sabbath</h3>
          </div>
        </div>
        {gear}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-deep-600">
        Lay down the striving today. Rest is worship, not a day missed — the Lord Himself rested,
        and He invites you to be restored.
      </p>

      <div className="mt-4 rounded-2xl bg-card/70 p-4 ring-1 ring-line">
        <p className="font-serif text-lg leading-relaxed text-deep-800">“{verse.text}”</p>
        <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-water-600">{verse.ref}</p>
      </div>

      <div className="mt-4">
        {keptToday ? (
          <button
            onClick={rest}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mist-200 py-3 text-sm font-medium text-water-700 ring-1 ring-water-500/25 transition hover:bg-mist-300"
          >
            <Check size={17} />
            Resting in Him today 🕊️
          </button>
        ) : (
          <button
            onClick={rest}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
          >
            <Feather size={16} />
            I’m resting today 🕊️
          </button>
        )}
      </div>

      {kept > 0 && (
        <p className="mt-3 text-center text-xs text-deep-400">
          Sabbaths kept: <span className="font-semibold text-water-600">{kept}</span>
        </p>
      )}

      {reminderNote}

      {pickerOpen && picker}
    </section>
  )
}
