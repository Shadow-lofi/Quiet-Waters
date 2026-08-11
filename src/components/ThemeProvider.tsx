import { useEffect } from 'react'
import { useStore } from '../lib/store'
import { applyMotion, applyTheme } from '../lib/theme'

/** Applies the chosen appearance + motion preference to <html>. 'auto' follows
 *  the OS light/dark setting live; 'cycle' follows the local time of day,
 *  re-checking each minute and whenever the app regains focus. Motion 'system'
 *  follows the OS reduced-motion setting live. Renders nothing. */
export function ThemeProvider() {
  const theme = useStore((s) => s.theme)
  const motion = useStore((s) => s.motion)

  // ── motion ──
  useEffect(() => {
    applyMotion(motion)
    if (motion !== 'system') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => applyMotion('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [motion])

  // ── appearance ──
  useEffect(() => {
    applyTheme(theme)

    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const onChange = () => applyTheme('auto')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }

    if (theme === 'cycle') {
      const tick = () => applyTheme('cycle')
      const id = window.setInterval(tick, 60_000) // cross the day/night line within a minute
      const onVisible = () => document.visibilityState === 'visible' && tick()
      document.addEventListener('visibilitychange', onVisible)
      return () => {
        clearInterval(id)
        document.removeEventListener('visibilitychange', onVisible)
      }
    }
  }, [theme])

  return null
}
