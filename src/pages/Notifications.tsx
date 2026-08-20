import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { AllCaughtUp } from '../components/AllCaughtUp'
import { InstallGuide } from '../components/InstallGuide'
import { useNotifications, type AppNotification } from '../lib/notifications'

/**
 * A quiet inbox for the app's own gentle nudges — the daily reminder, the
 * invitation to install, a waiting update. Each can be opened or checked off;
 * when the last one is cleared, it settles into the "all caught up" rest state.
 */
export function Notifications() {
  const navigate = useNavigate()
  const items = useNotifications()
  const [showGuide, setShowGuide] = useState(false)

  const open = (n: AppNotification) => {
    if (n.opensInstallGuide) setShowGuide(true)
    else if (n.to) navigate(n.to)
  }

  return (
    <div className="flex flex-col gap-7">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Notifications</h1>
          <p className="mt-1 text-sm text-deep-500">
            {items.length > 0
              ? `${items.length} thing${items.length > 1 ? 's' : ''} to tend to`
              : 'Your quiet inbox'}
          </p>
        </div>
        {items.length > 1 && (
          <button
            onClick={() => items.forEach((n) => n.dismiss())}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
          >
            Mark all done
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <AllCaughtUp />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((n) => (
            <NotificationCard key={n.id} n={n} onOpen={() => open(n)} />
          ))}
        </div>
      )}

      {showGuide && <InstallGuide onClose={() => setShowGuide(false)} />}
    </div>
  )
}

function NotificationCard({ n, onOpen }: { n: AppNotification; onOpen: () => void }) {
  const { Icon } = n
  return (
    <section className="qw-enter flex items-center gap-2 rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
          <Icon size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-deep-900">{n.title}</span>
          <span className="block truncate text-xs text-deep-500">{n.body}</span>
        </span>
      </button>
      <button
        onClick={n.dismiss}
        aria-label="Mark as done"
        title="Mark as done"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep-400 ring-1 ring-line transition hover:bg-reed-400/20 hover:text-reed-500 hover:ring-reed-400/40"
      >
        <Check size={16} />
      </button>
    </section>
  )
}
