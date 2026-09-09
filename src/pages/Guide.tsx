import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  BellRing,
  Waves,
  CalendarHeart,
  BookOpen,
  Book,
  HandHeart,
  Moon,
  Settings as SettingsIcon,
  Smartphone,
  ArrowRight,
  ChevronRight,
  Volume2,
  Shield,
  Check,
  Sparkles,
} from 'lucide-react'
import { Lamb } from '../components/Lamb'
import { InstallGuide } from '../components/InstallGuide'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'
import { isStandalone, detectPlatform } from '../lib/install'
import {
  NOTIFICATIONS_SUPPORTED,
  notificationPermission,
  requestNotificationPermission,
  formatReminderTime,
} from '../lib/reminders'

// A gentle, lamb-led walkthrough of Quiet Waters — the friendly "how do I use
// this?" page. It leads with a nudge to turn on the daily reminder (so the app
// can gently invite you back), then points the way to each part of the app.

interface Spot {
  to: string
  Icon: typeof Waves
  title: string
  body: string
}

const SPOTS: Spot[] = [
  {
    to: '/meditate',
    Icon: Waves,
    title: 'Be still',
    body: 'Choose a length and begin. Breathe a verse — or the Name — and rest. Guided sittings are there too.',
  },
  {
    to: '/journey',
    Icon: CalendarHeart,
    title: 'Your journey',
    body: 'Your streak, the days you’ve drawn near, and a look back at where you’ve been.',
  },
  {
    to: '/study',
    Icon: BookOpen,
    title: 'Study & Deep Dive',
    body: 'Walk slowly through Scripture — the Seven Churches, the Ten Virgins, the Feast of Trumpets, and more.',
  },
  {
    to: '/bible',
    Icon: Book,
    title: 'The Word',
    body: 'Read the Bible (and the Book of Enoch), highlight what stirs you, and hide verses in your heart.',
  },
  {
    to: '/prayers',
    Icon: HandHeart,
    title: 'Prayers',
    body: 'Hold a request before God, and mark it answered in His time.',
  },
  {
    to: '/meditate',
    Icon: Moon,
    title: 'Sabbath rest',
    body: 'A weekly invitation to lay down the striving and rest on Saturday. The card greets you at home.',
  },
  {
    to: '/settings',
    Icon: SettingsIcon,
    title: 'Make it yours',
    body: 'Music, day or night, animations, reminders — and a backup of everything, safe in your hands.',
  },
]

const TIPS: { Icon: typeof Waves; text: React.ReactNode }[] = [
  {
    Icon: Sparkles,
    text: (
      <>
        See the little lamb near the bottom-left corner? Tap it anytime for a gentle, page-aware
        hint. Turn it off in Settings if you’d rather have the quiet.
      </>
    ),
  },
  {
    Icon: Volume2,
    text: (
      <>
        The meditation music can play softly throughout the app. Tap the speaker (bottom-right) to
        pause or resume it anytime.
      </>
    ),
  },
  {
    Icon: Shield,
    text: (
      <>
        Everything stays on this device — no account, no cloud. Save a backup now and then, so a new
        phone can’t take it with it.
      </>
    ),
  },
]

export function Guide() {
  const reminderOn = useStore((s) => s.reminderOn)
  const reminderTime = useStore((s) => s.reminderTime)
  const setPref = useStore((s) => s.setPref)
  const pushToast = useToast((t) => t.push)

  const [perm, setPerm] = useState(notificationPermission())
  const [showInstall, setShowInstall] = useState(false)
  const [installable] = useState(() => !isStandalone())
  const iosNeedsInstall = detectPlatform() === 'ios' && !isStandalone()

  // Notifications are "fully on" when the daily reminder is enabled and the
  // browser has actually granted permission for a device nudge. When the browser
  // can't do notifications at all, an enabled reminder still greets you in-app.
  const fullyOn = reminderOn && (perm === 'granted' || !NOTIFICATIONS_SUPPORTED)

  const turnOnReminders = async () => {
    setPref('reminderOn', true)
    // Ask for permission the first time, inside this tap gesture (so the prompt
    // is allowed). Without it the in-app banner still nudges you.
    let next = notificationPermission()
    if (NOTIFICATIONS_SUPPORTED && next === 'default') {
      next = await requestNotificationPermission()
    }
    setPerm(next)

    if (next === 'granted') {
      pushToast({
        tone: 'success',
        title: 'Gentle reminders on',
        message: `A nudge here at ${formatReminderTime(reminderTime)}, and on your device when the app is in the background.`,
      })
    } else if (next === 'denied') {
      pushToast({
        title: 'Reminders on — inside the app',
        duration: 9000,
        message: iosNeedsInstall
          ? 'Add Quiet Waters to your Home Screen to also be nudged on your iPhone.'
          : 'Notifications are blocked. Allow them for Quiet Waters in your browser settings to be nudged on your device too.',
      })
    } else {
      pushToast({
        tone: 'success',
        title: 'Gentle reminders on',
        message: 'You’ll see a soft invitation when you open the app after your chosen time.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-7">
      {/* hero — the little lamb who leads */}
      <header className="qw-enter flex flex-col items-center gap-2 pt-1 text-center">
        <span className="qw-float text-water-500">
          <Lamb size={132} />
        </span>
        <h1 className="text-2xl">A little guide</h1>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-deep-500">
          The Shepherd leads His flock beside still waters. Let this little lamb show you around
          Quiet Waters.
        </p>
      </header>

      {/* notifications nudge — the heart of the guide's welcome */}
      {fullyOn ? (
        <section className="flex items-center gap-3 rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-reed-400/20 text-reed-500">
            <Check size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-deep-900">Gentle reminders are on</p>
            <p className="text-sm text-deep-500">
              A soft nudge to be still around {formatReminderTime(reminderTime)}.{' '}
              <Link to="/settings" className="text-water-600 underline-offset-2 hover:underline">
                Change the time
              </Link>
            </p>
          </div>
        </section>
      ) : (
        <section className="rounded-card bg-card p-5 shadow-sm ring-1 ring-line">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
              <BellRing size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-deep-900">Let me nudge you to be still</p>
              <p className="mt-1 text-sm leading-relaxed text-deep-500">
                A gentle daily reminder — a quiet invitation to pause. It’s easy to forget in a busy
                day; a soft nudge helps you return.
              </p>
            </div>
          </div>

          <button
            onClick={turnOnReminders}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3 font-semibold text-onwater shadow-md transition-transform active:scale-[0.98]"
          >
            <Bell size={18} /> Turn on gentle reminders
          </button>

          {iosNeedsInstall && (
            <button
              onClick={() => setShowInstall(true)}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
            >
              <Smartphone size={16} /> Add to Home Screen for iPhone alerts
            </button>
          )}

          <p className="mt-3 text-center text-xs leading-relaxed text-deep-400">
            {perm === 'denied'
              ? 'Notifications are blocked in your browser — you’ll still get a nudge inside the app.'
              : 'You can fine-tune the time, and the weekly Sabbath rest, in Settings.'}
          </p>
        </section>
      )}

      {/* finding your way */}
      <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">Finding your way</p>
        <div className="flex flex-col gap-3">
          {SPOTS.map(({ to, Icon, title, body }) => (
            <Link
              key={title}
              to={to}
              className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-deep-900">{title}</p>
                <p className="text-sm leading-relaxed text-deep-500">{body}</p>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 self-center text-water-600 transition group-hover:translate-x-0.5"
              />
            </Link>
          ))}

          {/* add to home screen — only when not already installed */}
          {installable && (
            <button
              onClick={() => setShowInstall(true)}
              className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
                <Smartphone size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-deep-900">Add to Home Screen</p>
                <p className="text-sm leading-relaxed text-deep-500">
                  Install Quiet Waters for full-screen, offline stillness — and, on a phone, device
                  reminders.
                </p>
              </div>
              <ChevronRight size={18} className="shrink-0 self-center text-deep-300" />
            </button>
          )}
        </div>
      </section>

      {/* a couple of gentle tips */}
      <section>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">Good to know</p>
        <ul className="flex flex-col gap-3">
          {TIPS.map(({ Icon, text }, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-sm ring-1 ring-line">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
                <Icon size={15} />
              </span>
              <p className="flex-1 text-sm leading-relaxed text-deep-600">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mx-auto max-w-xs pb-2 text-center font-serif text-lg italic leading-relaxed text-deep-600">
        “He leads me beside still waters. He restores my soul.”
        <span className="mt-1 block text-xs uppercase not-italic tracking-[0.18em] text-water-600">
          Psalm 23:2–3
        </span>
      </p>

      {showInstall && <InstallGuide onClose={() => setShowInstall(false)} />}
    </div>
  )
}
