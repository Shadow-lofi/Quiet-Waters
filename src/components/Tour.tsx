import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { Lamb } from './Lamb'
import { useTour } from '../lib/tour'
import { TOUR } from '../data/tour'

// The guided tour overlay. Driven by the tiny tour store (lib/tour.ts): for each
// step it navigates to the step's route, finds the element tagged with the
// matching `data-tour`, scrolls it into view, and cuts a spotlight hole in a dim
// backdrop over it — with the lamb explaining it in a callout placed on the
// opposite side. Steps with no target (or a target that never appears) show a
// centered callout instead, so the tour always moves forward. Mounted in
// AppLayout at a high z-index, above the app but below the opening splash.

const PAD = 8 // breathing room around the spotlighted element

export function Tour() {
  const active = useTour((s) => s.active)
  const step = useTour((s) => s.step)
  const next = useTour((s) => s.next)
  const back = useTour((s) => s.back)
  const stop = useTour((s) => s.stop)
  const navigate = useNavigate()
  const location = useLocation()

  const [rect, setRect] = useState<DOMRect | null>(null)
  const stepDef = active ? TOUR[step] : undefined

  // For each step: navigate to its route (if needed), then keep the spotlight
  // glued to the target every frame — so it lands right and follows any scroll or
  // reflow, with no lag. The target is scrolled into view once, when it first
  // appears. Steps whose target never appears leave rect null (a centered callout).
  useEffect(() => {
    if (!active || !stepDef) return
    let cancelled = false
    let raf = 0
    setRect(null)

    const needNav = stepDef.route && location.pathname !== stepDef.route
    if (needNav) navigate(stepDef.route)
    if (!stepDef.target) return // a centered welcome/close step

    // Measure the target and glue the ring to it (no-op re-render when unchanged).
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${stepDef.target}"]`)
      if (!el) return false
      const r = el.getBoundingClientRect()
      setRect((prev) =>
        prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height
          ? prev
          : r,
      )
      return true
    }

    let scrolled = false
    let waited = 0
    const loop = () => {
      if (cancelled) return
      const el = document.querySelector<HTMLElement>(`[data-tour="${stepDef.target}"]`)
      if (el && !scrolled) {
        el.scrollIntoView({ block: 'center', behavior: 'auto' })
        scrolled = true
      }
      if (measure() || waited++ >= 200) {
        if (!scrolled) return // never appeared — leave a centered callout
      }
      raf = requestAnimationFrame(loop) // keep it glued while the step is up
    }
    raf = requestAnimationFrame(loop)

    // Belt-and-suspenders: scroll/resize fire even when rAF is throttled, and
    // capture=true catches the app's inner scroll container, not just the window.
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step])

  if (!active || !stepDef) return null

  const isLast = step === TOUR.length - 1
  // Place the callout opposite the target so it never sits on top of it.
  const targetLow = rect ? rect.top + rect.height / 2 > window.innerHeight / 2 : false
  const align = !rect ? 'center' : targetLow ? 'flex-start' : 'flex-end'

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="App tour">
      {/* click blocker + (when there's no spotlight) the full dim */}
      <div
        className="absolute inset-0"
        style={{ background: rect ? 'transparent' : 'rgba(9,20,27,0.55)' }}
      />

      {/* spotlight — a clear hole punched in the dim by a huge box-shadow spread */}
      {rect && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            borderRadius: 18,
            boxShadow: '0 0 0 3px var(--color-water-400), 0 0 0 9999px rgba(9,20,27,0.55)',
            transition: 'top 0.35s ease, left 0.35s ease, width 0.35s ease, height 0.35s ease',
          }}
        />
      )}

      {/* the lamb's callout */}
      <div
        className="pointer-events-none absolute inset-0 flex justify-center px-4"
        style={{
          alignItems: align,
          paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
        }}
      >
        <div className="qw-enter pointer-events-auto relative w-full max-w-sm rounded-card bg-card p-5 shadow-xl ring-1 ring-line">
          <button
            onClick={stop}
            aria-label="End the tour"
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-700"
          >
            <X size={15} />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <span className="qw-float mt-0.5 inline-flex shrink-0 text-water-500">
              <Lamb size={46} wave waveKey={step} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug text-deep-900">{stepDef.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-deep-600">{stepDef.body}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {TOUR.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-4 bg-water-500' : 'w-1.5 bg-mist-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={back}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              )}
              <button
                onClick={next}
                className="flex items-center gap-1.5 rounded-full bg-water-500 px-4 py-1.5 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98]"
              >
                {isLast ? (
                  <>
                    Done <Check size={15} />
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
