import { Link } from 'react-router-dom'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { CHANGELOG, VERSION_HISTORY, type ChangeEntry, type ChangeTag } from '../data/changelog'
import { APP_VERSION, BUILD_TIME } from '../lib/version'
import { useAppUpdate } from '../lib/swUpdate'

const tagStyles: Record<ChangeTag, string> = {
  New: 'bg-water-500/12 text-water-600',
  Improved: 'bg-reed-400/25 text-reed-500',
  Fixed: 'bg-mist-200 text-deep-600',
}

// Group the newest-first changelog by date, preserving order.
function groupByDate(entries: ChangeEntry[]): { date: string; items: ChangeEntry[] }[] {
  const groups: { date: string; items: ChangeEntry[] }[] = []
  for (const e of entries) {
    const last = groups[groups.length - 1]
    if (last && last.date === e.date) last.items.push(e)
    else groups.push({ date: e.date, items: [e] })
  }
  return groups
}

export function Updates() {
  const groups = groupByDate(CHANGELOG)

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-2xl">Updates</h1>
        <p className="mt-1 text-sm text-deep-500">
          Every change to Quiet Waters, newest first — new features, refinements, and fixes.
        </p>
      </header>

      <VersionCard />

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <section key={group.date}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-deep-400">
                {group.date}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="flex flex-col gap-2.5">
              {group.items.map((entry, i) => (
                <ChangeRow key={`${entry.title}-${i}`} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Closing verse — mercies new every morning */}
      <div className="mx-auto max-w-md rounded-card bg-mist-200/60 px-5 py-4 text-center">
        <p className="font-serif text-base italic leading-snug text-deep-700">
          “His mercies never come to an end; they are new every morning.”
        </p>
        <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-water-600">Lamentations 3:22–23</p>
      </div>
    </div>
  )
}

function VersionCard() {
  const ready = useAppUpdate((s) => s.ready)
  const checking = useAppUpdate((s) => s.checking)
  const apply = useAppUpdate((s) => s.apply)
  const check = useAppUpdate((s) => s.check)

  // A real "check for updates" only exists in the installed / production app,
  // where the service worker can look for a newer build. In dev there's none.
  const canCheck =
    import.meta.env.PROD && typeof navigator !== 'undefined' && 'serviceWorker' in navigator

  const built = new Date(BUILD_TIME)
  const builtLabel = Number.isNaN(built.getTime())
    ? null
    : built.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })

  const vi = VERSION_HISTORY.indexOf(APP_VERSION)
  const previousVersion = vi >= 0 ? (VERSION_HISTORY[vi + 1] ?? null) : null

  return (
    <section
      className={`flex flex-wrap items-center justify-between gap-4 rounded-card px-5 py-4 shadow-sm ring-1 ${
        ready ? 'bg-water-500/10 ring-water-500/30' : 'bg-card ring-line'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
            ready ? 'bg-water-500/20 text-water-600' : 'bg-mist-200 text-deep-500'
          }`}
        >
          <RefreshCw size={20} />
        </span>
        <div>
          <p className="font-medium text-deep-900">Quiet Waters · Version {APP_VERSION}</p>
          {previousVersion && <p className="text-xs text-deep-400">Previously v{previousVersion}</p>}
          <p className="text-sm text-deep-500">
            {ready
              ? 'A new version is ready to install.'
              : canCheck
                ? `You’re on the latest version${builtLabel ? ` · updated ${builtLabel}` : ''}.`
                : builtLabel
                  ? `Updated ${builtLabel}`
                  : 'The version you’re running.'}
          </p>
        </div>
      </div>

      {ready ? (
        <button
          onClick={apply}
          className="flex items-center gap-1.5 rounded-full bg-water-500 px-4 py-2 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
        >
          <RefreshCw size={16} /> Update now
        </button>
      ) : canCheck ? (
        <button
          onClick={() => void check()}
          disabled={checking}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-deep-700 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-50"
        >
          <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Checking…' : 'Check for updates'}
        </button>
      ) : null}
    </section>
  )
}

function ChangeRow({ entry }: { entry: ChangeEntry }) {
  const body = (
    <div className="flex items-start gap-3 rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
      <span
        className={`mt-0.5 w-[4.75rem] shrink-0 rounded-full py-1 text-center text-[0.7rem] font-semibold ${tagStyles[entry.tag]}`}
      >
        {entry.tag}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug text-deep-900">{entry.title}</p>
        <p className="mt-0.5 text-sm leading-snug text-deep-500">{entry.detail}</p>
      </div>
      {entry.to && <ChevronRight size={17} className="mt-0.5 shrink-0 text-deep-300" />}
    </div>
  )

  return entry.to ? (
    <Link to={entry.to} className="block transition-transform hover:-translate-y-0.5">
      {body}
    </Link>
  ) : (
    body
  )
}
