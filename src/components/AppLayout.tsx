import { useEffect } from 'react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Waves, CalendarHeart, BookOpen, Book, ScrollText, ChevronLeft, Settings as SettingsIcon } from 'lucide-react'
import { WaterBackground } from './WaterBackground'
import { ReminderScheduler } from './ReminderScheduler'
import { PullToRefresh } from './PullToRefresh'
import { InstallBar } from './InstallBar'
import { Toaster } from './Toaster'
import { APP_VERSION } from '../lib/version'
import { requestStoragePersistence } from '../lib/backup'

const tabs = [
  { to: '/meditate', label: 'Meditate', Icon: Waves, end: true },
  { to: '/journey', label: 'Journey', Icon: CalendarHeart, end: false },
  { to: '/study', label: 'Study', Icon: BookOpen, end: false },
  { to: '/bible', label: 'Bible', Icon: Book, end: false },
  { to: '/enoch', label: 'Enoch', Icon: ScrollText, end: false },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, end: false },
]

// Where a sub-page's Back button lands when it was opened directly (no in-app
// history to pop) — its natural parent, defaulting to the app home.
const BACK_FALLBACK: Record<string, string> = {
  '/last-days': '/study',
  '/seven-churches': '/study',
  '/ten-virgins': '/study',
  '/lectio': '/meditate',
  '/kids': '/study',
  '/memory': '/study',
  '/devotional': '/study',
  '/encourage': '/meditate',
  '/prayers': '/journey',
  '/updates': '/meditate',
  '/notifications': '/meditate',
}

// A direct-load Back target for a deeper path with no exact fallback above —
// e.g. a series page /devotional/<id> should fall back to the library.
function fallbackFor(pathname: string): string {
  if (BACK_FALLBACK[pathname]) return BACK_FALLBACK[pathname]
  if (pathname.startsWith('/devotional/')) return '/devotional'
  return '/meditate'
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Once, on entering the app, ask the browser to keep this device's data
  // (best-effort; guards against automatic eviction of the local-first store).
  useEffect(() => {
    void requestStoragePersistence()
  }, [])
  // Tabs live in the bottom bar; only the deeper pages need a Back affordance —
  // which matters most for installed PWAs, where there's no browser back button.
  const isTab = tabs.some((t) => t.to === location.pathname)
  const goBack = () => {
    // A real in-app history entry pops back to it; a direct load falls back to
    // the page's natural parent so Back never dead-ends or leaves the app.
    if (location.key !== 'default') navigate(-1)
    else navigate(fallbackFor(location.pathname))
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <WaterBackground />
      <ReminderScheduler />
      <PullToRefresh />
      <Toaster />
      <main
        className="flex-1 px-5 pb-28"
        style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
      >
        <InstallBar />
        {!isTab && (
          <button
            onClick={goBack}
            className="mb-4 -ml-1.5 inline-flex items-center gap-0.5 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-deep-500 transition hover:bg-mist-200 hover:text-deep-700"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}
        <Outlet />
        <footer className="mt-12 text-center text-xs leading-relaxed text-deep-400">
          <p>
            Developed by <span className="text-deep-500">Tavaris Freeman</span> · Midnight Codex
          </p>
          <p className="mt-0.5">
            © {new Date().getFullYear()} Quiet Waters ·{' '}
            <Link to="/updates" className="underline-offset-2 hover:text-deep-600 hover:underline">
              v{APP_VERSION}
            </Link>{' '}
            · All rights reserved <sup className="text-[0.65em]">†</sup>
          </p>
        </footer>
      </main>

      {/* Bottom tab bar — thumb-reachable, safe-area aware. */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/85 backdrop-blur-md">
        <div
          className="mx-auto flex max-w-lg items-stretch justify-around"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {tabs.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  isActive ? 'text-water-600' : 'text-deep-500 hover:text-deep-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
