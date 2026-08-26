import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Printer,
  HandHeart,
  Lock,
  Smartphone,
  WifiOff,
  BookOpen,
  HeartHandshake,
  Users,
  Sunrise,
  Sprout,
  Church,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { WaterBackground } from '../components/WaterBackground'

// A front door for pastors and small-group leaders — the case for bringing
// Quiet Waters to a congregation, plus the QR and a printable flyer. Standalone
// (outside the app's tab layout), reached by direct link / QR / word of mouth.

const REASONS: { Icon: typeof HandHeart; title: string; body: string }[] = [
  {
    Icon: HandHeart,
    title: 'Free, always',
    body: 'No cost, no ads, no upsell — a gift to the Church, given freely.',
  },
  {
    Icon: Lock,
    title: 'No account, nothing tracked',
    body: 'No sign-up, no email, no data collected. Everything stays on the person’s own device.',
  },
  {
    Icon: Smartphone,
    title: 'Installs in one tap',
    body: 'No App Store. It adds to any phone’s home screen and opens full-screen like an app.',
  },
  {
    Icon: WifiOff,
    title: 'Works offline',
    body: 'Fully usable with no signal — perfect for a youth room, a camp, or a quiet retreat.',
  },
  {
    Icon: BookOpen,
    title: 'Rooted in Scripture',
    body: 'Meditation on Scripture, a breath-prayer guide, an in-app Bible, and the Books of Enoch.',
  },
  {
    Icon: HeartHandshake,
    title: 'Made to be shared',
    body: 'Print the flyer, drop the QR in your bulletin, or simply send the link.',
  },
]

const USES: { Icon: typeof Users; title: string; body: string }[] = [
  {
    Icon: Users,
    title: 'Youth group',
    body: 'Works offline in any room, with no App-Store hurdles on teens’ phones.',
  },
  {
    Icon: HeartHandshake,
    title: 'Small groups',
    body: 'A shared rhythm of stillness to carry between your gatherings.',
  },
  {
    Icon: Sunrise,
    title: 'Sunday & prayer',
    body: 'A guided pause before the service, or a tool for prayer ministry.',
  },
  {
    Icon: Sprout,
    title: 'Discipleship',
    body: 'A gentle daily habit of being with God in His Word.',
  },
]

export function Churches() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Quiet Waters for Churches & Small Groups'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-16">
      <WaterBackground />

      {/* hero */}
      <header className="qw-enter flex flex-col items-center pt-16 text-center sm:pt-24">
        <span className="qw-float text-water-500">
          <Logo size={60} />
        </span>
        <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-mist-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-water-600">
          <Church size={13} /> For churches & groups
        </p>
        <h1 className="qw-title mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
          Bring stillness to your church
        </h1>
        <p className="mt-4 font-serif text-xl italic text-deep-600">
          “Be still, and know that I am God.”
        </p>
        <p className="mt-5 max-w-md leading-relaxed text-deep-600">
          Quiet Waters is a quiet little app for meeting God in stillness — Scripture to dwell on, a
          gentle breathing guide, an offline Bible, and soft chimes. Free to give your whole
          congregation, with nothing to sign up for.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/churches/flyer"
            className="inline-flex items-center gap-2 rounded-full bg-water-500 px-7 py-3.5 text-base font-semibold text-onwater shadow-lg shadow-water-500/20 transition-transform active:scale-[0.98]"
          >
            <Printer size={18} /> Print the flyer
          </Link>
          <Link
            to="/meditate"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-water-600 ring-1 ring-line transition hover:bg-mist-200"
          >
            Try it yourself <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      {/* why churches */}
      <section className="mt-20">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-deep-500">
          Why it fits a congregation
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {REASONS.map(({ Icon, title, body }) => (
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

      {/* ways to use */}
      <section className="mt-20">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-deep-500">
          Ways to use it
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {USES.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-card bg-mist-200/50 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-water-600 shadow-sm ring-1 ring-line">
                <Icon size={17} />
              </span>
              <p className="mt-3 font-medium text-deep-900">{title}</p>
              <p className="mt-1 text-sm leading-snug text-deep-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* share it — QR + steps */}
      <section className="mt-20 rounded-card bg-card p-6 shadow-sm ring-1 ring-line sm:p-8">
        <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-8">
          <div className="shrink-0 rounded-2xl bg-white p-4 ring-1 ring-line">
            <img
              src="/qr-quiet-waters.svg"
              alt="QR code linking to quiet-waters-meditation.com"
              width={168}
              height={168}
              style={{ width: 168, height: 168 }}
            />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="text-2xl">Share it in a moment</h2>
            <p className="mt-2 text-sm leading-relaxed text-deep-600">
              Point a phone camera at the code, or send{' '}
              <span className="font-medium text-water-600">quiet-waters-meditation.com</span>.
            </p>
            <ol className="mt-4 space-y-2 text-left text-sm text-deep-600">
              <li className="flex gap-2.5">
                <span className="font-serif font-semibold text-water-600">1.</span> Print the flyer
                for your board or welcome table.
              </li>
              <li className="flex gap-2.5">
                <span className="font-serif font-semibold text-water-600">2.</span> Drop the QR into
                a bulletin or a slide.
              </li>
              <li className="flex gap-2.5">
                <span className="font-serif font-semibold text-water-600">3.</span> Share the link
                in your group chat.
              </li>
            </ol>
            <Link
              to="/churches/flyer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-water-500 px-6 py-3 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
            >
              <Printer size={16} /> Open the printable flyer
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-16 text-center text-sm leading-relaxed text-deep-500">
        <p className="font-serif text-lg italic text-deep-700">
          “Freely you have received; freely give.”
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-water-600">Matthew 10:8</p>
        <p className="mt-6 text-xs text-deep-400">
          Questions? Reach{' '}
          <span className="text-deep-500">Tavaris Freeman · Midnight Codex</span>. Use it, share it,
          bless your people with it.
        </p>
      </footer>
    </div>
  )
}
