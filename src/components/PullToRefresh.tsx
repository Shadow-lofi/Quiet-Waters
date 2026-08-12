import { useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'

// How far the (dampened) pull must travel before a release triggers a refresh,
// and the visual clamp so the indicator never runs away down the screen.
const TRIGGER = 70
const MAX = 100

/**
 * Pull-to-refresh for the installed PWA. In a normal browser tab the OS/browser
 * already provides its own pull-to-refresh, so we only take over in standalone
 * (installed) mode where that chrome is gone. The gesture engages only when the
 * page is scrolled to the very top, no overlay has locked body scroll, and the
 * finger is clearly dragging down — otherwise normal scrolling is untouched.
 */
export function PullToRefresh() {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const st = useRef({ startY: 0, pulling: false, active: false, refreshing: false, pull: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    if (!('ontouchstart' in window) || !standalone) return

    const scrollTop = () =>
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    // Skip while an overlay (a sitting, onboarding) has locked body scroll —
    // pulling there belongs to the overlay, not a reload.
    const blocked = () => st.current.refreshing || document.body.style.overflow === 'hidden'

    const reset = () => {
      st.current.pull = 0
      st.current.active = false
      setPull(0)
    }

    const onStart = (e: TouchEvent) => {
      if (blocked() || e.touches.length !== 1 || scrollTop() > 0) {
        st.current.pulling = false
        return
      }
      st.current.startY = e.touches[0].clientY
      st.current.pulling = true
      st.current.active = false
    }

    const onMove = (e: TouchEvent) => {
      if (!st.current.pulling || blocked()) return
      const dy = e.touches[0].clientY - st.current.startY
      if (dy <= 0 || scrollTop() > 0) {
        if (st.current.active) reset()
        return
      }
      st.current.active = true
      const dist = Math.min(MAX, dy * 0.5) // resistance so it feels elastic
      st.current.pull = dist
      setPull(dist)
      if (e.cancelable) e.preventDefault() // hold back the browser's own scroll/refresh
    }

    const onEnd = () => {
      if (!st.current.pulling) return
      if (!st.current.refreshing && st.current.active && st.current.pull >= TRIGGER) {
        st.current.refreshing = true
        setRefreshing(true)
        setPull(TRIGGER)
        window.setTimeout(() => window.location.reload(), 450)
      } else {
        reset()
      }
      st.current.pulling = false
      st.current.active = false
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  const ready = pull >= TRIGGER
  const visible = pull > 0 || refreshing
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] flex justify-center"
      style={{
        transform: `translateY(${refreshing ? TRIGGER : pull}px)`,
        opacity: visible ? 1 : 0,
        transition: pull === 0 || refreshing ? 'transform 0.25s ease, opacity 0.25s ease' : 'none',
      }}
    >
      <div className="mt-2 grid h-10 w-10 place-items-center rounded-full border border-line bg-card shadow-md">
        <RefreshCw
          size={18}
          className={refreshing ? 'animate-spin text-water-600' : ''}
          style={
            refreshing
              ? undefined
              : {
                  transform: `rotate(${Math.min(pull, MAX) * 2.6}deg)`,
                  color: ready ? 'var(--color-water-600)' : 'var(--color-deep-400)',
                }
          }
        />
      </div>
    </div>
  )
}
