// External links used across the app.

// "Support the mission" — a Ko-fi page that helps keep Quiet Waters free,
// local-first, and ad-free. Swap this URL to move the support link elsewhere
// (Buy Me a Coffee, Patreon, etc.); the button follows whatever it points at.
export const SUPPORT_URL = 'https://ko-fi.com/shadetech'

/** True once SUPPORT_URL points at a real page (not the placeholder handle). */
export const SUPPORT_ENABLED = !SUPPORT_URL.includes('YOUR_HANDLE')
