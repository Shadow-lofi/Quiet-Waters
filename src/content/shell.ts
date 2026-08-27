// Shared shell for Quiet Waters' fully-static content pages (the reading pages
// under /read/* and the guides under /learn/*). Unlike the app routes — which
// are a client-rendered SPA that only prerenders <head> meta — these pages carry
// their real body text in the HTML, so crawlers and readers with no JS get the
// whole thing. That's the point: the Books of Enoch and the meditation guides are
// the organic-search magnets, so their words must be in the markup.
//
// Everything here is build-time only (imported by the buildContentSite plugin in
// vite.config.ts), so the page is self-contained: hand-written theme-aware CSS
// (the "Still Waters" palette, mirroring src/index.css) is inlined, and a tiny
// no-flash script honors the same saved theme preference the app uses.

import { SITE_URL } from '../data/publicPages'

export { SITE_URL }

export const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
export const escAttr = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// The "Still Waters" palette as flat tokens (light base; night + OS-dark
// fallback). Kept in step with the @theme block in src/index.css.
const STYLES = `
  :root {
    --bg: #eef4f7;
    --panel: #ffffff;
    --panel-2: #e0ebf0;
    --ink: #15303a;
    --muted: #4a7683;
    --faint: #6b95a2;
    --line: #dbe8ed;
    --accent: #256f82;
    --accent-strong: #2f8ba0;
    --on-accent: #f3fbfd;
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='day']) {
      --bg: #0e1b24;
      --panel: #152530;
      --panel-2: #162a34;
      --ink: #eaf4f7;
      --muted: #8fb4c0;
      --faint: #6f97a3;
      --line: #24404b;
      --accent: #6ac4d5;
      --accent-strong: #46b0c3;
      --on-accent: #08161d;
      color-scheme: dark;
    }
  }
  :root[data-theme='night'] {
    --bg: #0e1b24;
    --panel: #152530;
    --panel-2: #162a34;
    --ink: #eaf4f7;
    --muted: #8fb4c0;
    --faint: #6f97a3;
    --line: #24404b;
    --accent: #6ac4d5;
    --accent-strong: #46b0c3;
    --on-accent: #08161d;
    color-scheme: dark;
  }

  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body {
    margin: 0;
    font-family: 'Nunito Sans Variable', ui-sans-serif, system-ui, -apple-system, sans-serif;
    color: var(--ink);
    background-color: var(--bg);
    background-image:
      radial-gradient(60rem 60rem at 50% -20%, color-mix(in oklab, var(--accent-strong) 12%, transparent), transparent 60%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    line-height: 1.6;
  }
  .wrap { max-width: 44rem; margin: 0 auto; padding: 1.5rem 1.25rem 5rem; }
  a { color: var(--accent); }
  h1, h2, h3 {
    font-family: 'Newsreader Variable', ui-serif, Georgia, Cambria, 'Times New Roman', serif;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--ink);
    line-height: 1.2;
  }
  h1 { font-size: clamp(1.9rem, 5vw, 2.6rem); margin: 0 0 0.5rem; }
  h2 { font-size: 1.5rem; margin: 2.5rem 0 0.75rem; }
  h3 { font-size: 1.15rem; margin: 1.75rem 0 0.5rem; }
  p { margin: 0 0 1rem; }

  .eyebrow {
    display: inline-block;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    font-weight: 600;
  }
  .lede { font-size: 1.12rem; color: var(--muted); }
  .crumbs { font-size: 0.8rem; color: var(--faint); margin: 0 0 1.5rem; }
  .crumbs a { color: var(--faint); text-decoration: none; }
  .crumbs a:hover { text-decoration: underline; }

  .brand {
    display: inline-flex; align-items: center; gap: 0.5rem;
    text-decoration: none; color: var(--muted); font-weight: 600; font-size: 0.9rem;
    margin-bottom: 1.75rem;
  }
  .brand .drop {
    width: 1.4rem; height: 1.4rem; border-radius: 999px;
    background: radial-gradient(circle at 50% 35%, var(--accent-strong), var(--accent));
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 20%, transparent);
  }

  blockquote {
    margin: 1.5rem 0; padding: 0.25rem 0 0.25rem 1.1rem;
    border-left: 3px solid color-mix(in oklab, var(--accent) 45%, transparent);
    font-family: 'Newsreader Variable', ui-serif, Georgia, serif;
    font-style: italic; font-size: 1.25rem; line-height: 1.5; color: var(--muted);
  }
  blockquote cite { display: block; font-size: 0.8rem; font-style: normal; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); margin-top: 0.5rem; }

  .panel {
    background: var(--panel); border: 1px solid var(--line);
    border-radius: 1.25rem; padding: 1.5rem;
  }

  .cta {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--accent-strong); color: var(--on-accent);
    text-decoration: none; font-weight: 700;
    padding: 0.85rem 1.5rem; border-radius: 999px;
    box-shadow: 0 8px 24px color-mix(in oklab, var(--accent-strong) 25%, transparent);
  }
  .cta:hover { filter: brightness(1.03); }
  .cta-row { margin: 2rem 0; }

  hr { border: none; border-top: 1px solid var(--line); margin: 2.5rem 0; }

  footer { margin-top: 3.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line); font-size: 0.8rem; color: var(--faint); line-height: 1.7; }
  footer a { color: var(--muted); }

  /* Reading pages (Enoch) */
  .toc { columns: 2; column-gap: 1.5rem; font-size: 0.9rem; }
  @media (max-width: 30rem) { .toc { columns: 1; } }
  .toc-group { break-inside: avoid; margin-bottom: 1.1rem; }
  .toc-group h3 { margin: 0 0 0.4rem; font-size: 0.95rem; }
  .toc-chaps { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .toc-chaps a {
    display: inline-flex; min-width: 1.9rem; justify-content: center;
    padding: 0.15rem 0.4rem; border-radius: 0.5rem;
    background: var(--panel-2); color: var(--muted); text-decoration: none; font-size: 0.82rem;
  }
  .toc-chaps a:hover { background: color-mix(in oklab, var(--accent) 22%, var(--panel-2)); color: var(--ink); }

  .chapter { margin: 2.25rem 0; scroll-margin-top: 1rem; }
  .chapter h2 { margin: 0 0 0.35rem; font-size: 1.35rem; }
  .chapter .section-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); }
  .verse-block {
    font-family: 'Newsreader Variable', ui-serif, Georgia, Cambria, serif;
    font-size: 1.12rem; line-height: 1.75; color: var(--ink);
  }
  .totop { font-size: 0.78rem; color: var(--faint); text-decoration: none; margin-left: 0.6rem; }
  .totop:hover { text-decoration: underline; }

  .book-switch { display: flex; gap: 0.5rem; margin: 1.25rem 0 0; flex-wrap: wrap; }
  .book-switch a {
    padding: 0.4rem 0.9rem; border-radius: 999px; border: 1px solid var(--line);
    text-decoration: none; color: var(--muted); font-size: 0.9rem; font-weight: 600;
  }
  .book-switch a[aria-current='page'] { background: var(--accent-strong); color: var(--on-accent); border-color: transparent; }

  /* Related links (guides) */
  .cards { display: grid; gap: 0.75rem; margin: 1rem 0; }
  .card {
    display: block; text-decoration: none; color: inherit;
    background: var(--panel); border: 1px solid var(--line); border-radius: 1rem; padding: 1.1rem 1.25rem;
  }
  .card:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--line)); }
  .card .card-title { font-family: 'Newsreader Variable', ui-serif, Georgia, serif; font-size: 1.15rem; color: var(--ink); }
  .card .card-desc { font-size: 0.9rem; color: var(--muted); margin-top: 0.25rem; }
`

// Mirrors the no-flash script in index.html: honor the saved theme preference so
// a reader who has used the app sees their chosen skin; otherwise fall to the
// time-of-day "cycle" default (and CSS covers the no-JS / OS-dark case).
const THEME_SCRIPT = `
(function(){try{
  var raw=localStorage.getItem('quiet-waters-v1');var s={};
  try{s=raw?(JSON.parse(raw).state||{}):{}}catch(e){}
  var pref=s.theme||'cycle';var h=new Date().getHours();
  var dark=pref==='night'||(pref==='auto'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)||(pref==='cycle'&&!(h>=6&&h<19));
  document.documentElement.dataset.theme=dark?'night':'day';
}catch(e){}})();
`

const DEFAULT_OG = '/og-card.png'

export type ContentHead = {
  path: string
  title: string
  description: string
  ogType?: 'website' | 'article'
  image?: string
  /** Extra JSON-LD objects (Article, Book, BreadcrumbList, …). */
  jsonLd?: object[]
}

/** Wrap page body HTML in a complete, self-contained document. */
export function pageShell(head: ContentHead, bodyHtml: string): string {
  const url = SITE_URL + head.path
  const img = SITE_URL + (head.image || DEFAULT_OG)
  const ogType = head.ogType || 'article'
  const ld = (head.jsonLd || [])
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n    ')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escHtml(head.title)}</title>
    <meta name="description" content="${escAttr(head.description)}" />
    <link rel="canonical" href="${escAttr(url)}" />
    <link rel="icon" type="image/svg+xml" href="/quiet-waters.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#0e1b24" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#eef4f7" media="(prefers-color-scheme: light)" />
    <meta property="og:site_name" content="Quiet Waters" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${escAttr(head.title)}" />
    <meta property="og:description" content="${escAttr(head.description)}" />
    <meta property="og:url" content="${escAttr(url)}" />
    <meta property="og:image" content="${escAttr(img)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(head.title)}" />
    <meta name="twitter:description" content="${escAttr(head.description)}" />
    <meta name="twitter:image" content="${escAttr(img)}" />
    ${ld}
    <style>${STYLES}</style>
    <script>${THEME_SCRIPT}</script>
  </head>
  <body>
    <div class="wrap">
      <a class="brand" href="/"><span class="drop"></span>Quiet Waters</a>
${bodyHtml}
      <footer>
        <p><a href="/">Quiet Waters</a> — a free, private Christian meditation app. No account, no ads, works offline.</p>
        <p>Scripture and the Books of Enoch quoted here are public domain. © ${new Date().getFullYear()} Quiet Waters · Developed by Tavaris Freeman · Midnight Codex</p>
      </footer>
    </div>
  </body>
</html>`
}

/** A BreadcrumbList JSON-LD object for a content page. */
export function breadcrumb(items: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  }
}
