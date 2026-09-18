import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'

// Public contact address for the app (shown here and in the Play listing).
const CONTACT_EMAIL = 'shadeshadowtech@gmail.com'

export function Contact() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Contact · Quiet Waters'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="min-h-screen bg-mist-100 px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-deep-500 underline-offset-2 hover:text-deep-700 hover:underline"
        >
          <ArrowLeft size={15} /> Quiet Waters
        </Link>

        <h1 className="mt-6 font-serif text-3xl text-deep-900">Get in touch</h1>
        <p className="mt-1.5 text-sm text-deep-500">We’d love to hear from you.</p>

        <p className="mt-6 text-[0.95rem] leading-relaxed text-deep-700">
          Quiet Waters is a small, prayerful project. If you have a question, a bit of feedback, a
          verse that met you, or something that isn’t working, please reach out — a real person reads
          and replies.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-6 flex items-center gap-3 rounded-card bg-card px-5 py-4 shadow-sm ring-1 ring-line transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-200 text-water-600">
            <Mail size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-deep-900">Email us</span>
            <span className="block truncate text-sm text-water-600">{CONTACT_EMAIL}</span>
          </span>
        </a>

        <p className="mt-8 text-sm leading-relaxed text-deep-500">
          You can also read our{' '}
          <Link to="/privacy" className="text-water-600 underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </p>

        <div className="mt-10 border-t border-line pt-6 text-sm text-deep-500">
          <p>Made by Tavaris Freeman · Midnight Codex</p>
          <Link
            to="/meditate"
            className="mt-2 inline-block text-water-600 underline-offset-2 hover:underline"
          >
            ← Back to Quiet Waters
          </Link>
        </div>
      </div>
    </div>
  )
}
