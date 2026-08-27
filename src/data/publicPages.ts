// Single source of truth for the public routes' SEO metadata. Consumed BOTH at
// runtime by <Seo> (for JS-rendering crawlers like Googlebot, and to keep the
// title/canonical correct as a visitor navigates the SPA) and at build time by
// the prerender plugin in vite.config.ts (which bakes these into a static
// per-route index.html so non-JS social scrapers get the right share preview and
// crawlers get the correct canonical). One list here means the two never drift.
//
// This covers the app's own routes that are worth indexing. The longer-form
// content pages under /learn/* and /read/* are fully static (real body text in
// the HTML) and defined separately in src/content/* — see the buildContentSite
// plugin in vite.config.ts.

export type PublicPageMeta = {
  path: string
  title: string
  description: string
  type: 'website' | 'article'
  /** Absolute site path to a share image; defaults to the branded card below. */
  image?: string
}

export const SITE_URL = 'https://quiet-waters-meditation.com'
export const DEFAULT_OG_IMAGE = '/og-card.png'

export const PUBLIC_PAGES: PublicPageMeta[] = [
  {
    path: '/',
    title: 'Quiet Waters · Christian Meditation Timer',
    description:
      'Quiet Waters — a Christian meditation timer. Be still before God with gentle chimes, Scripture to dwell on, and breath-prayer pacing. Free, private, works offline.',
    type: 'website',
  },
  {
    path: '/churches',
    title: 'Quiet Waters for Churches & Small Groups',
    description:
      'Bring Quiet Waters — a free, private Christian meditation app — to your church or small group. No accounts, no ads, one-tap install, works offline. Print the flyer and share the QR.',
    type: 'website',
  },
  {
    path: '/study',
    title: 'Prayers, Creeds & Scripture to Meditate On | Quiet Waters',
    description:
      'The Ten Commandments, the Lord’s Prayer, the Apostles’ Creed, and more — timeless Scripture and ancient prayers to sit with, to memorize, and to return to.',
    type: 'website',
  },
  {
    path: '/enoch',
    title: 'Read the Books of Enoch — Free Offline Reader | Quiet Waters',
    description:
      'A calm, distraction-free reader for the complete Books of Enoch (1 & 2 Enoch), the public-domain text. Free, private, and works offline — read a chapter, or sit with it in prayer.',
    type: 'website',
  },
]

export function pageMeta(path: string): PublicPageMeta | undefined {
  return PUBLIC_PAGES.find((p) => p.path === path)
}
