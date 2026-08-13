import { Link, Navigate } from 'react-router-dom'
import {
  ArrowRight,
  Feather,
  Wind,
  Sunrise,
  Bell,
  Flame,
  Moon,
  CalendarHeart,
  ShieldCheck,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { WaterBackground } from '../components/WaterBackground'
import { APP_VERSION } from '../lib/version'

// The landing is the public front door — for first-time visitors and for
// search / social crawlers. Anyone who has already used Quiet Waters skips
// straight to their timer, so they never land here twice. (Read from
// localStorage directly to keep this page light and independent of the store.)
function hasUsedApp(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem('quiet-waters-v1')
    if (!raw) return false
    const s = JSON.parse(raw).state as { onboarded?: boolean; sessions?: unknown[] } | undefined
    return !!(s && (s.onboarded || (s.sessions && s.sessions.length)))
  } catch {
    return false
  }
}

const FEATURES: { Icon: typeof Feather; title: string; body: string }[] = [
  {
    Icon: Feather,
    title: 'Scripture to dwell on',
    body: 'A rotating contemplative verse to hold in your heart while you sit.',
  },
  {
    Icon: Wind,
    title: 'A breathing guide',
    body: 'A gentle circle that paces your breath with a short breath prayer.',
  },
  {
    Icon: Sunrise,
    title: 'Guided sittings',
    body: 'Ready-made sessions with quiet prompts that unfold as you rest.',
  },
  {
    Icon: Bell,
    title: 'Soft chimes',
    body: 'Warm, synthesized bells open and close your time — no jarring alarms.',
  },
  {
    Icon: Flame,
    title: 'Ambient hearth',
    body: 'An optional crackling warmth in the background as you settle in.',
  },
  {
    Icon: Moon,
    title: 'Day & night',
    body: 'A calm light that follows your clock, from daybreak to moonlit.',
  },
  {
    Icon: CalendarHeart,
    title: 'A gentle streak',
    body: 'A quiet record of the days you show up — encouragement, never pressure.',
  },
  {
    Icon: ShieldCheck,
    title: 'Private & offline',
    body: 'No account, no tracking. Everything stays on your device and works offline.',
  },
]

function BeginButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      to="/meditate"
      className="inline-flex items-center gap-2 rounded-full bg-water-500 px-8 py-4 text-lg font-semibold text-onwater shadow-lg shadow-water-500/20 transition-transform active:scale-[0.98]"
    >
      {children}
      <ArrowRight size={20} />
    </Link>
  )
}

export function Landing() {
  if (hasUsedApp()) return <Navigate to="/meditate" replace />

  return (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-16">
      <WaterBackground />

      {/* hero */}
      <header className="qw-enter flex flex-col items-center pt-16 text-center sm:pt-24">
        <span className="qw-float text-water-500">
          <Logo size={64} />
        </span>
        <h1 className="qw-title mt-5 text-5xl leading-none tracking-tight">Quiet Waters</h1>
        <p className="mt-4 font-serif text-xl italic text-deep-600">
          Be still, and know that He is God.
        </p>
        <p className="mt-5 max-w-md leading-relaxed text-deep-600">
          A quiet place to meet God in stillness — Scripture to dwell on, a gentle breathing guide,
          and soft chimes to keep the time.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <BeginButton>Begin</BeginButton>
          <p className="text-xs uppercase tracking-[0.18em] text-deep-400">
            Free · Private · Works offline
          </p>
        </div>
      </header>

      {/* what's inside */}
      <section className="mt-20">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-deep-500">What’s inside</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 rounded-card bg-card p-5 shadow-sm ring-1 ring-line"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
                <Icon size={19} />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-deep-900">{title}</p>
                <p className="mt-1 text-sm leading-snug text-deep-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* scripture */}
      <section className="mt-20 rounded-card bg-mist-200/60 px-6 py-10 text-center">
        <blockquote className="mx-auto max-w-lg font-serif text-2xl italic leading-relaxed text-deep-800">
          “He makes me lie down in green pastures. He leads me beside still waters.”
        </blockquote>
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-water-600">Psalm 23:2</p>
      </section>

      {/* closing */}
      <section className="mt-20 flex flex-col items-center text-center">
        <h2 className="text-3xl">Come and be still.</h2>
        <p className="mt-3 max-w-sm leading-relaxed text-deep-600">
          A few quiet minutes with God, whenever you need them. No sign-up — just begin.
        </p>
        <div className="mt-7">
          <BeginButton>Begin a sitting</BeginButton>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-20 text-center text-xs leading-relaxed text-deep-400">
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
    </div>
  )
}
