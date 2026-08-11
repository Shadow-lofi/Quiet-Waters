import { useEffect } from 'react'
import { useStore } from '../lib/store'
import { applyTheme } from '../lib/theme'

/** Applies the chosen appearance to <html>. 'auto' follows the OS light/dark
 *  setting live; 'cycle' follows the local time of day, re-checking each minute
 *  and whenever the app regains focus. Renders nothing. */
export function ThemeProvider() {
  const theme = useStore((s) => s.theme)

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
