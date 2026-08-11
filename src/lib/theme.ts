import type { MotionPref, ThemePref } from './types'

// Daytime window for the 'cycle' appearance: light ~6am–7pm, dark otherwise.
// Kept in sync with the no-flash script in index.html.
export function isDaytime(d: Date = new Date()): boolean {
  const h = d.getHours()
  return h >= 6 && h < 19
}

/** Resolve a preference to the concrete skin: 'auto' honors the OS, 'cycle'
 *  honors the local time of day. */
export function resolveTheme(pref: ThemePref): 'day' | 'night' {
  if (pref === 'auto') {
    return typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'night'
      : 'day'
  }
  if (pref === 'cycle') return isDaytime() ? 'day' : 'night'
  return pref
}

/** Whether motion should be reduced, given the pref and the OS setting. */
export function shouldReduceMotion(pref: MotionPref): boolean {
  if (pref === 'on') return false
  if (pref === 'off') return true
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/** Apply the motion preference to <html> as data-motion ('reduce' | 'full').
 *  The CSS keys off this attribute (see index.css), so an in-app 'on' can bring
 *  the animations back even when the device requests reduced motion. */
export function applyMotion(pref: MotionPref): void {
  document.documentElement.dataset.motion = shouldReduceMotion(pref) ? 'reduce' : 'full'
}

/** Apply the resolved skin to <html> (data-theme + color-scheme). */
export function applyTheme(pref: ThemePref): void {
  const resolved = resolveTheme(pref)
  const root = document.documentElement
  if (resolved === 'night') {
    root.dataset.theme = 'night'
    root.style.colorScheme = 'dark'
  } else {
    delete root.dataset.theme
    root.style.colorScheme = 'light'
  }
}
