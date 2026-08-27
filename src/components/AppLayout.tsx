import { NavLink, Outlet, Link } from 'react-router-dom'
import { Waves, CalendarHeart, BookOpen, Book, ScrollText, Settings as SettingsIcon } from 'lucide-react'
import { WaterBackground } from './WaterBackground'
import { ReminderScheduler } from './ReminderScheduler'
import { PullToRefresh } from './PullToRefresh'
import { Toaster } from './Toaster'
import { APP_VERSION } from '../lib/version'

const tabs = [
  { to: '/meditate', label: 'Meditate', Icon: Waves, end: true },
  { to: '/journey', label: 'Journey', Icon: CalendarHeart, end: false },
  { to: '/study', label: 'Study', Icon: BookOpen, end: false },
  { to: '/bible', label: 'Bible', Icon: Book, end: false },
  { to: '/enoch', label: 'Enoch', Icon: ScrollText, end: false },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, end: false },
]

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <WaterBackground />
      <ReminderScheduler />
      <PullToRefresh />
      <Toaster />
      <main className="flex-1 px-5 pb-28 pt-6">
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
