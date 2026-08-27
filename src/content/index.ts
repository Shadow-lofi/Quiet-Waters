// Barrel for the fully-static content site (reading pages + guides). The
// buildContentSite plugin in vite.config.ts imports from here; the app bundle
// never does. CONTENT_PATHS is the canonical list of static content URLs, used
// to expand the sitemap and (defensively) the Vercel rewrites.

export { ENOCH_READ, renderEnochPage, type EnochBookData } from './enoch'
export { ARTICLES, renderArticlePage, renderLearnIndex } from './articles'

import { ENOCH_READ } from './enoch'
import { ARTICLES } from './articles'

export const CONTENT_PATHS: string[] = [
  '/learn',
  ...ARTICLES.map((a) => a.path),
  ...ENOCH_READ.map((b) => b.path),
]
