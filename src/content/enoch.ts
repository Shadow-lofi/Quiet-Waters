// Static full-text reading pages for the Books of Enoch. The chapter text comes
// from the same public-domain JSON the app reads (public/enoch/*.json), passed in
// by the build plugin; everything else — the SEO copy, the section divisions, the
// short introductions — lives here so this stays decoupled from the app's runtime
// store (src/lib/enoch.ts). These pages are the site's biggest search magnet:
// people searching "book of enoch read online" should land on the whole text.

import { pageShell, breadcrumb, escHtml, SITE_URL, type ContentHead } from './shell'

export type EnochChapterData = { n: number; text: string }
export type EnochBookData = {
  book: string
  translation: string
  source: string
  chapters: EnochChapterData[]
}

export type EnochReadMeta = {
  id: string
  path: string
  seoTitle: string
  seoDesc: string
  heading: string
  subtitle: string
  attribution: string
  /** Short intro paragraphs (plain text; rendered as <p>). */
  intro: string[]
  sections: { label: string; from: number; to: number }[]
}

export const ENOCH_READ: EnochReadMeta[] = [
  {
    id: '1-enoch',
    path: '/read/1-enoch',
    seoTitle: 'The Book of Enoch (1 Enoch) — Complete Text, Read Online',
    seoDesc:
      'Read the complete Book of Enoch (1 Enoch) online, free — all 108 chapters of R. H. Charles’s public-domain translation, in a calm, ad-free reader. The Watchers, the giants, the parables, and the astronomical book.',
    heading: 'The Book of Enoch',
    subtitle: '1 Enoch · The Ethiopic Book of Enoch',
    attribution: 'Translated by R. H. Charles, 1917 · Public Domain',
    intro: [
      '1 Enoch is an ancient Jewish apocalyptic work, ascribed to Enoch, the seventh from Adam who “walked with God” (Genesis 5:24). It gathers several older books written over centuries before Christ, preserved in full in Ge‘ez (Ethiopic).',
      'Its most famous section, the Book of the Watchers, tells of angels who descended in the days of Noah, the giants born to them, and the judgment that followed. The letter of Jude quotes it directly (Jude 1:14–15). What follows is the complete text of R. H. Charles’s 1917 translation, now in the public domain.',
    ],
    sections: [
      { label: 'The Book of the Watchers', from: 1, to: 36 },
      { label: 'The Book of Parables', from: 37, to: 71 },
      { label: 'The Astronomical Book', from: 72, to: 82 },
      { label: 'The Book of Dream Visions', from: 83, to: 90 },
      { label: 'The Epistle of Enoch', from: 91, to: 108 },
    ],
  },
  {
    id: '2-enoch',
    path: '/read/2-enoch',
    seoTitle: '2 Enoch (The Book of the Secrets of Enoch) — Full Text Online',
    seoDesc:
      'Read 2 Enoch — the Slavonic “Book of the Secrets of Enoch” — online, free. The complete longer recension in the public-domain Morfill–Charles translation: Enoch’s ascent through the heavens and his words to his sons.',
    heading: 'The Secrets of Enoch',
    subtitle: '2 Enoch · The Slavonic Book of Enoch',
    attribution: 'Translated by W. R. Morfill & R. H. Charles · Public Domain',
    intro: [
      '2 Enoch, also called the Book of the Secrets of Enoch, survives in Old Church Slavonic. It recounts Enoch being carried up through the heavens to stand before the face of the Lord, the wonders he was shown, and the admonitions he brought back to his sons before he was taken.',
      'This is the complete longer recension in the public-domain translation of W. R. Morfill and R. H. Charles, as reprinted in The Forgotten Books of Eden (1926).',
    ],
    sections: [
      { label: 'The Ascent Through the Heavens', from: 1, to: 21 },
      { label: 'Before the Face of the Lord', from: 22, to: 38 },
      { label: 'Enoch’s Admonitions to His Sons', from: 39, to: 66 },
      { label: 'Enoch’s Assumption', from: 67, to: 68 },
    ],
  },
]

function tableOfContents(meta: EnochReadMeta): string {
  const groups = meta.sections
    .map((s) => {
      const chaps = []
      for (let n = s.from; n <= s.to; n++) {
        chaps.push(`<a href="#ch-${n}">${n}</a>`)
      }
      return `<div class="toc-group">
        <h3>${escHtml(s.label)}</h3>
        <div class="toc-chaps">${chaps.join('')}</div>
      </div>`
    })
    .join('\n')
  return `<nav class="toc" aria-label="Chapters">\n${groups}\n</nav>`
}

function chapters(meta: EnochReadMeta, data: EnochBookData): string {
  const sectionStart = new Map(meta.sections.map((s) => [s.from, s.label]))
  return data.chapters
    .map((c) => {
      const label = sectionStart.get(c.n)
      const labelHtml = label ? `<p class="section-label">${escHtml(label)}</p>` : ''
      return `<article class="chapter" id="ch-${c.n}">
        ${labelHtml}
        <h2>Chapter ${c.n}<a class="totop" href="#top">↑ Top</a></h2>
        <p class="verse-block">${escHtml(c.text)}</p>
      </article>`
    })
    .join('\n')
}

/** Render one Book of Enoch reading page as a complete static document. */
export function renderEnochPage(meta: EnochReadMeta, data: EnochBookData): string {
  const other = ENOCH_READ.find((b) => b.id !== meta.id)
  const bookSwitch = ENOCH_READ.map(
    (b) =>
      `<a href="${b.path}"${b.id === meta.id ? ' aria-current="page"' : ''}>${escHtml(
        b.id === '1-enoch' ? '1 Enoch' : '2 Enoch',
      )}</a>`,
  ).join('')

  const introHtml = meta.intro.map((p) => `<p class="lede">${escHtml(p)}</p>`).join('\n')

  const head: ContentHead = {
    path: meta.path,
    title: meta.seoTitle,
    description: meta.seoDesc,
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: meta.heading,
        alternateName: meta.subtitle,
        bookFormat: 'https://schema.org/EBook',
        inLanguage: 'en',
        url: SITE_URL + meta.path,
        author: { '@type': 'Person', name: 'Enoch (attributed)' },
        translator: { '@type': 'Person', name: meta.attribution.replace(/ ·.*/, '') },
        isAccessibleForFree: true,
        about: 'Second Temple Jewish apocalyptic literature',
      },
      breadcrumb([
        { name: 'Quiet Waters', path: '/' },
        { name: 'The Books of Enoch', path: '/enoch' },
        { name: meta.subtitle, path: meta.path },
      ]),
    ],
  }

  const body = `      <span id="top"></span>
      <p class="eyebrow">The Books of Enoch</p>
      <h1>${escHtml(meta.heading)}</h1>
      <p class="lede" style="margin-top:-0.25rem">${escHtml(meta.subtitle)}</p>
      <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--faint)">${escHtml(
        meta.attribution,
      )}</p>

      <div class="book-switch" aria-label="Choose a book">${bookSwitch}</div>

      <div style="margin-top:1.75rem">${introHtml}</div>

      <div class="cta-row">
        <a class="cta" href="/enoch">Open in the Quiet Waters app →</a>
      </div>

      <div class="panel">
        <h2 style="margin-top:0">Contents</h2>
        ${tableOfContents(meta)}
      </div>

      <hr />

      ${chapters(meta, data)}

      <hr />
      <p>${escHtml(
        other
          ? `Keep reading: ${other.heading} (${other.id === '1-enoch' ? '1 Enoch' : '2 Enoch'}).`
          : '',
      )}${
        other ? ` <a href="${other.path}">Read ${other.id === '1-enoch' ? '1 Enoch' : '2 Enoch'} →</a>` : ''
      }</p>
      <p>Prefer to read a chapter at a time, or sit with it in prayer? <a href="/enoch">Open the Books of Enoch in the free app →</a></p>`

  return pageShell(head, body)
}
