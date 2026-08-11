import type { ThemePref } from './types'

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
