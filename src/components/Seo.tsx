import { useEffect } from 'react'
import { DEFAULT_OG_IMAGE, pageMeta, SITE_URL } from '../data/publicPages'

// Per-route SEO for the app's indexable routes. Looks the route up in the shared
// manifest (src/data/publicPages.ts) by path, then updates the document title,
// description, canonical link, and Open Graph / Twitter tags in place (so there
// are never duplicates) — which JS-rendering crawlers like Googlebot read, and
// which keeps the tab title + canonical correct as a visitor moves around the
// SPA. Non-JS social scrapers get the same values from the static per-route HTML
// the build prerenders from that same manifest, so the two can never drift.

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function Seo({ path }: { path: string }) {
  useEffect(() => {
    const meta = pageMeta(path)
    if (!meta) return
    const url = SITE_URL + (path === '/' ? '/' : path)
    const img = SITE_URL + (meta.image || DEFAULT_OG_IMAGE)
    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    upsertLink('canonical', url)
    upsertMeta('property', 'og:type', meta.type)
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)
    upsertMeta('name', 'twitter:image', img)
  }, [path])

  return null
}
