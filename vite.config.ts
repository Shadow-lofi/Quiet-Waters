import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DEFAULT_OG_IMAGE, PUBLIC_PAGES, SITE_URL } from './src/data/publicPages'
import {
  ARTICLES,
  ENOCH_READ,
  renderArticlePage,
  renderEnochPage,
  renderLearnIndex,
  type EnochBookData,
} from './src/content'

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// App version (from package.json) + this build's timestamp, baked into the
// bundle so the Updates page can show what's running (see src/lib/version.ts).
const APP_VERSION = (
  JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }
).version
const BUILD_TIME = new Date().toISOString()
const BUILD_DATE = BUILD_TIME.slice(0, 10) // YYYY-MM-DD, for the sitemap lastmod

// Stamp a content-derived build id into the service worker's cache name, so a
// deploy that actually changes assets gets a new cache — which is what lets the
// worker detect an update and offer the "a new version is ready" prompt (see
// public/sw.js + lib/swUpdate.ts). A rebuild with identical output keeps the same
// id, so it never nags about a "new version" that isn't one.
function stampServiceWorker(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'
  let hash = APP_VERSION
  return {
    name: 'stamp-sw',
    apply: 'build',
    configResolved(cfg) {
      root = cfg.root
      outDir = cfg.build.outDir
    },
    generateBundle(_opts, bundle) {
      // Hash the set of emitted asset filenames (each is content-hashed by Vite),
      // so the id changes exactly when the build output changes.
      const names = Object.keys(bundle)
        .filter((n) => !n.endsWith('.map'))
        .sort()
      const digest = createHash('sha256').update(names.join('|')).digest('hex').slice(0, 8)
      hash = `${APP_VERSION}-${digest}`
    },
    closeBundle() {
      const swPath = resolve(root, outDir, 'sw.js')
      const sw = readFileSync(swPath, 'utf8').replace(
        "const CACHE = 'quiet-waters-dev'",
        `const CACHE = 'quiet-waters-${hash}'`,
      )
      writeFileSync(swPath, sw)
      // eslint-disable-next-line no-console
      console.log(`sw.js: cache quiet-waters-${hash}`)
    },
  }
}

// Bake correct per-route meta into a static index.html for each indexable app
// route, so social scrapers (which don't run JS) get real share previews and
// crawlers get the CORRECT self-referencing canonical (the SPA's single
// index.html hardcodes canonical to "/", which otherwise tells Google that
// /churches, /enoch, etc. are duplicates of the homepage). Vercel serves these
// static files ahead of the SPA catch-all rewrite, then the SPA hydrates. Meta
// comes from the same manifest <Seo> reads at runtime (src/data/publicPages.ts),
// so the two can never drift.
function prerenderPublicPages(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'

  const setTitle = (html: string, v: string) =>
    html.replace(/<title>[^<]*<\/title>/, `<title>${escText(v)}</title>`)
  const setMeta = (html: string, id: string, key: string, v: string) =>
    html.replace(
      new RegExp(`(${id}="${key.replace(/[:]/g, '\\$&')}"\\s+content=")[^"]*(")`, 'i'),
      `$1${escAttr(v)}$2`,
    )
  const setLink = (html: string, rel: string, v: string) =>
    html.replace(new RegExp(`(rel="${rel}"\\s+href=")[^"]*(")`, 'i'), `$1${escAttr(v)}$2`)

  return {
    name: 'prerender-public-pages',
    apply: 'build',
    configResolved(cfg) {
      root = cfg.root
      outDir = cfg.build.outDir
    },
    closeBundle() {
      const dist = resolve(root, outDir)
      const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

      for (const page of PUBLIC_PAGES) {
        const url = SITE_URL + (page.path === '/' ? '/' : page.path)
        const img = SITE_URL + (page.image || DEFAULT_OG_IMAGE)
        let html = template
        html = setTitle(html, page.title)
        html = setMeta(html, 'name', 'description', page.description)
        html = setLink(html, 'canonical', url)
        html = setMeta(html, 'property', 'og:type', page.type)
        html = setMeta(html, 'property', 'og:title', page.title)
        html = setMeta(html, 'property', 'og:description', page.description)
        html = setMeta(html, 'property', 'og:url', url)
        html = setMeta(html, 'property', 'og:image', img)
        html = setMeta(html, 'name', 'twitter:title', page.title)
        html = setMeta(html, 'name', 'twitter:description', page.description)
        html = setMeta(html, 'name', 'twitter:image', img)

        const outFile = resolve(dist, page.path.replace(/^\//, ''), 'index.html')
        mkdirSync(dirname(outFile), { recursive: true })
        writeFileSync(outFile, html)
      }
      // eslint-disable-next-line no-console
      console.log(`prerendered ${PUBLIC_PAGES.length} app routes with per-route meta`)
    },
  }
}

// Build the fully-static content site: the Books of Enoch reading pages
// (/read/*) and the meditation guides (/learn/*). Unlike prerenderPublicPages
// (which only fixes <head> meta on the SPA's shell), these pages carry their real
// body text in the HTML — the whole point, since the Enoch text and the guides
// are the organic-search magnets. Each is a self-contained document (inlined
// theme-aware CSS), written to dist/<path>/index.html and served by Vercel ahead
// of the SPA catch-all rewrite.
function buildContentSite(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'

  const emit = (dist: string, path: string, html: string) => {
    const outFile = resolve(dist, path.replace(/^\//, ''), 'index.html')
    mkdirSync(dirname(outFile), { recursive: true })
    writeFileSync(outFile, html)
  }

  return {
    name: 'build-content-site',
    apply: 'build',
    configResolved(cfg) {
      root = cfg.root
      outDir = cfg.build.outDir
    },
    closeBundle() {
      const dist = resolve(root, outDir)
      let count = 0

      // Guides: /learn index + each article.
      emit(dist, '/learn', renderLearnIndex())
      count++
      for (const article of ARTICLES) {
        emit(dist, article.path, renderArticlePage(article))
        count++
      }

      // Reading pages: the full public-domain text from the same JSON the app
      // reads (public/enoch/*.json), baked into crawlable HTML.
      for (const book of ENOCH_READ) {
        const jsonPath = resolve(root, 'public', 'enoch', `${book.id}.json`)
        const data = JSON.parse(readFileSync(jsonPath, 'utf8')) as EnochBookData
        emit(dist, book.path, renderEnochPage(book, data))
        count++
      }

      // eslint-disable-next-line no-console
      console.log(`built ${count} static content pages (/learn/*, /read/*)`)
    },
  }
}

// Stamp today's date into the built sitemap's <lastmod>, so each deploy tells
// search engines the site was freshly updated. The source public/sitemap.xml
// keeps a static date; only the emitted copy is rewritten.
function stampSitemap(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'
  return {
    name: 'stamp-sitemap',
    apply: 'build',
    configResolved(cfg) {
      root = cfg.root
      outDir = cfg.build.outDir
    },
    closeBundle() {
      const path = resolve(root, outDir, 'sitemap.xml')
      try {
        const xml = readFileSync(path, 'utf8').replace(
          /<lastmod>.*?<\/lastmod>/g,
          `<lastmod>${BUILD_DATE}</lastmod>`,
        )
        writeFileSync(path, xml)
        // eslint-disable-next-line no-console
        console.log(`sitemap.xml: lastmod ${BUILD_DATE}`)
      } catch {
        // no sitemap emitted — nothing to stamp
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerenderPublicPages(),
    buildContentSite(),
    stampServiceWorker(),
    stampSitemap(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  server: {
    port: Number(process.env.PORT) || 5273,
    host: true,
  },
})
