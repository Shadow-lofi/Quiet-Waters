import { useEffect } from 'react'
import { useStore } from '../lib/store'
import { applyTheme } from '../lib/theme'

/** Applies the chosen appearance to <html> and, when set to 'auto', follows the
 *  OS light/dark setting live. Renders nothing. */
export function ThemeProvider() {
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('auto')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  return null
}
