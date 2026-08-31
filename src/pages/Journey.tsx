import { Link } from 'react-router-dom'
import { Flame, Trophy, Timer, Sprout, HandHeart, ArrowRight } from 'lucide-react'
import { useStore } from '../lib/store'
import { computeStats } from '../lib/streak'
import { formatMinutes } from '../lib/date'
import { soulById } from '../data/soul'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function Journey() {
  const sessions = useStore((s) => s.sessions)
  const prayers = useStore((s) => s.prayers)
  const soulLog = useStore((s) => s.soulLog)
  const stats = computeStats(sessions)

  const openPrayers = prayers.filter((p) => !p.answeredAt).length
  const answeredPrayers = prayers.filter((p) => p.answeredAt).length

  const stat = [
    { Icon: Flame, label: 'Day streak', value: String(stats.currentStreak) },
    { Icon: Trophy, label: 'Longest', value: String(stats.longestStreak) },
    { Icon: Sprout, label: 'Sittings', value: String(stats.totalSessions) },
    { Icon: Timer, label: 'Time still', value: formatMinutes(stats.totalSeconds) },
  ]

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-2xl">Your journey</h1>
        <p className="mt-1 text-sm text-deep-500">
          {stats.thisWeek > 0
            ? `${stats.thisWeek} ${stats.thisWeek === 1 ? 'day' : 'days'} of stillness this week.`
            : 'A new week to draw near.'}
        </p>
      </header>

      {/* this week */}
      <section className="rounded-card bg-card p-5 shadow-sm ring-1 ring-line">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-deep-500">This week</p>
        <div className="flex justify-between">
          {stats.last7.map((d) => {
            const dow = DOW[new Date(d.key + 'T00:00:00').getDay()]
            return (
              <div key={d.key} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs ${
                    d.active
                      ? 'bg-water-500 text-onwater shadow-sm'
                      : 'bg-mist-200 text-deep-400'
                  }`}
                >
                  {d.active ? '✓' : ''}
                </div>
                <span className="text-xs text-deep-500">{dow}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* stat grid */}
      <section className="grid grid-cols-2 gap-3">
        {stat.map(({ Icon, label, value }) => (
          <div key={label} className="rounded-card bg-card p-5 shadow-sm ring-1 ring-line">
            <Icon size={20} className="text-water-500" />
            <p className="mt-3 font-serif text-3xl text-deep-900">{value}</p>
            <p className="text-sm text-deep-500">{label}</p>
          </div>
        ))}
      </section>

      {/* soul lately — gentle reflection of the check-ins */}
      {soulLog.length > 0 && (
        <section>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">Your soul lately</p>
          <div className="flex flex-wrap gap-2">
            {soulLog.slice(0, 10).map((c) => (
              <span
                key={c.at}
                className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm text-deep-700 ring-1 ring-line"
              >
                {soulById(c.state)?.label ?? c.state}
                <span className="text-xs text-deep-400">
                  {new Date(c.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* prayer list (own page) */}
      <Link
        to="/prayers"
        className="group flex items-center gap-4 rounded-card bg-card p-5 shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <HandHeart size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-deep-900">Prayers</p>
          <p className="truncate text-sm text-deep-500">
            {openPrayers > 0
              ? `${openPrayers} held${answeredPrayers > 0 ? ` · ${answeredPrayers} answered` : ''}`
              : answeredPrayers > 0
                ? `${answeredPrayers} answered`
                : 'Hold a request, and mark it answered in His time'}
          </p>
        </div>
        <ArrowRight size={18} className="shrink-0 text-water-600 transition group-hover:translate-x-0.5" />
      </Link>

      {/* recent sittings */}
      <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">Recent</p>
        {sessions.length === 0 ? (
          <div className="rounded-card border border-dashed border-line p-8 text-center text-deep-500">
            No sittings yet. Your first quiet moment will appear here.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {sessions.slice(0, 12).map((s) => {
              const d = new Date(s.endedAt)
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-line"
                >
                  <div>
                    <p className="font-medium text-deep-800">{formatMinutes(s.actualSec)}</p>
                    <p className="text-xs text-deep-500">{s.verseRef ?? 'Meditation'}</p>
                  </div>
                  <div className="text-right text-xs text-deep-500">
                    <p>{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    <p>{d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
