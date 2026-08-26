import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import { Logo } from '../components/Logo'

// A print-ready flyer a leader can hand-out, pin up, or drop in a bulletin.
// The sheet is deliberately LIGHT and mostly white (ink-friendly, photocopies
// cleanly) with fixed colors so it looks the same on screen, in print, and in
// either app theme. Print styling lives under @media print in index.css.

const BADGES = ['Free', 'No sign-up', 'Works offline', 'Private']

export function ChurchesFlyer() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Quiet Waters — Printable Flyer'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="min-h-screen bg-mist-200/60 px-4 py-6">
      {/* toolbar — screen only */}
      <div className="no-print mx-auto mb-6 flex max-w-[8.5in] items-center justify-between gap-3">
        <Link
          to="/churches"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-water-500 px-6 py-2.5 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* the flyer sheet — fixed light palette, letter portrait */}
      <div
        className="flyer-sheet mx-auto flex w-full max-w-[8.5in] flex-col items-center bg-white px-10 py-14 text-center shadow-xl"
        style={{ aspectRatio: '8.5 / 11', color: '#15303a' }}
      >
        {/* brand */}
        <div style={{ color: '#256f82' }}>
          <Logo size={72} />
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight" style={{ color: '#15303a' }}>
          Quiet Waters
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.32em]" style={{ color: '#2f8ba0' }}>
          Christian Meditation
        </p>

        <div className="my-7 h-px w-24" style={{ background: '#cbdde5' }} />

        {/* invitation */}
        <p className="max-w-md font-serif text-[1.7rem] italic leading-snug" style={{ color: '#22454f' }}>
          “Be still, and know that I am God.”
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.2em]" style={{ color: '#2f8ba0' }}>
          Psalm 46:10
        </p>
        <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed" style={{ color: '#4a7683' }}>
          A quiet place to meet God in stillness — Scripture to dwell on, a gentle breathing guide,
          an offline Bible, and soft chimes to keep the time.
        </p>

        {/* QR */}
        <div className="mt-9 rounded-2xl border p-4" style={{ borderColor: '#cbdde5' }}>
          <img
            src="/qr-quiet-waters.svg"
            alt="Scan to open Quiet Waters"
            width={228}
            height={228}
            style={{ width: 228, height: 228, display: 'block' }}
          />
        </div>
        <p className="mt-4 text-lg font-semibold" style={{ color: '#15303a' }}>
          Scan to begin
        </p>
        <p className="mt-0.5 text-base" style={{ color: '#2f8ba0' }}>
          quiet-waters-meditation.com
        </p>

        {/* badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {BADGES.map((b) => (
            <span
              key={b}
              className="rounded-full px-3.5 py-1 text-xs font-medium"
              style={{ background: '#eef4f7', color: '#256f82' }}
            >
              {b}
            </span>
          ))}
        </div>

        {/* foot */}
        <div className="mt-auto pt-9">
          <p className="text-sm" style={{ color: '#6b95a2' }}>
            A gift to the Church — free to use and to share.
          </p>
        </div>
      </div>

      <p className="no-print mx-auto mt-4 max-w-[8.5in] text-center text-xs text-deep-400">
        Tip: in the print dialog, choose “Save as PDF,” or set margins to “None” for a full-bleed
        sheet.
      </p>
    </div>
  )
}
