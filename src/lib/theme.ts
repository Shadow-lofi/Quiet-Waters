import type { ThemePref } from './types'

/** Resolve a preference to the concrete skin, honoring the OS for 'auto'. */
export function resolveTheme(pref: ThemePref): 'day' | 'night' {
  if (pref === 'auto') {
    return typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'night'
      : 'day'
  }
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
