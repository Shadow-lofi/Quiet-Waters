// Search-intent guides (Temple's /learn playbook, brought to Quiet Waters).
// Fully static pages with the real article text in the HTML, targeting the
// questions people actually type: "what is Christian meditation," "how to
// meditate on Scripture," "what is a breath prayer." Each guide teaches the
// thing and then points into the free app to actually practice it.
//
// Content is authored as structured blocks so the renderer can keep the markup
// clean and consistent. Paragraph and list HTML is hand-written and trusted
// (internal links, <em>); headings, quotes, and the index cards are escaped.

import { pageShell, breadcrumb, escHtml, SITE_URL, type ContentHead } from './shell'

export type Block =
  | { t: 'p'; html: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'quote'; text: string; cite?: string }
  | { t: 'list'; ordered?: boolean; items: string[] }

export type Article = {
  path: string
  slug: string
  seoTitle: string
  seoDesc: string
  heading: string
  lede: string
  updated: string // YYYY-MM
  blocks: Block[]
  related: string[] // slugs
}

export const ARTICLES: Article[] = [
  {
    path: '/learn/christian-meditation',
    slug: 'christian-meditation',
    seoTitle: 'What Is Christian Meditation? A Beginner’s Guide | Quiet Waters',
    seoDesc:
      'What Christian meditation is (and isn’t), what the Bible says about meditating on God’s Word, and simple ways to begin — a beginner’s guide, with a free app to help you practice.',
    heading: 'What Is Christian Meditation?',
    lede: 'Christian meditation is not emptying your mind — it is filling it with God and his Word, and quieting yourself long enough to pay attention to him.',
    updated: '2026-08',
    blocks: [
      {
        t: 'p',
        html: 'When people hear “meditation,” they often picture emptying the mind. Christian meditation moves in the opposite direction. To meditate, in the Bible’s sense, is to <em>fill</em> the mind — to turn a verse, a truth, or the character of God over and over until it sinks from the head into the heart. It is less like erasing a whiteboard and more like a cow chewing the cud, or a fire slowly warming a cold room.',
      },
      { t: 'h2', text: 'Is meditation in the Bible?' },
      {
        t: 'p',
        html: 'Yes — Scripture speaks of meditation often, and always as a good and commanded thing. The Hebrew words behind it (<em>hagah</em>, to murmur or mutter under one’s breath, and <em>siach</em>, to muse or ponder) picture someone quietly repeating God’s words and dwelling on his works.',
      },
      {
        t: 'quote',
        text: 'Blessed is the one… whose delight is in the law of the LORD, and who meditates on his law day and night.',
        cite: 'Psalm 1:1–2',
      },
      {
        t: 'p',
        html: 'The very first psalm ties a flourishing life to meditation on God’s Word. God tells Joshua the same thing (Joshua 1:8). The longest chapter in the Bible, Psalm 119, returns to it again and again, and the psalmist meditates on God through the night watches (Psalm 63:6) and on all God has done (Psalm 143:5).',
      },
      { t: 'h2', text: 'How is it different from other kinds of meditation?' },
      {
        t: 'p',
        html: 'Many popular forms of meditation aim at detachment — letting go of every thought until the mind is blank. Christian meditation aims at <em>attachment</em>: drawing near to a God who is personal, who speaks, and who can be known. The goal is not an empty mind but a full heart, and not a technique that leaves you alone with yourself, but a conversation that leaves you with him.',
      },
      { t: 'h2', text: 'What does the practice look like?' },
      {
        t: 'p',
        html: 'In practice it is simple, and older than any app. You slow down. You take a short passage of Scripture and <a href="/learn/how-to-meditate-on-scripture">dwell on it</a> rather than rushing through. You quiet your body and your breathing. You let a single line become a <a href="/learn/breath-prayer">breath prayer</a> you can carry with you. Above all, you make room to be still:',
      },
      {
        t: 'quote',
        text: 'Be still, and know that I am God.',
        cite: 'Psalm 46:10',
      },
      { t: 'h2', text: 'How to begin (five simple steps)' },
      {
        t: 'list',
        ordered: true,
        items: [
          '<strong>Pick a short passage.</strong> One verse is plenty — Psalm 23:1, Psalm 46:10, or a line from the Lord’s Prayer.',
          '<strong>Get still.</strong> Sit comfortably, unclench, and take a few slow breaths. A minute of quiet is a fine place to start.',
          '<strong>Read it slowly, more than once.</strong> Let the words land. Lean on one word at a time.',
          '<strong>Turn it into prayer.</strong> Answer God from what you read — thank him, ask him, rest in him.',
          '<strong>Return to it through the day.</strong> Carry the line with you; let it surface while you walk or wait.',
        ],
      },
      { t: 'h2', text: 'A gentle place to start' },
      {
        t: 'p',
        html: 'You don’t need much — a few unhurried minutes and a quiet corner. <a href="/">Quiet Waters</a> is a free app built for exactly this: a calm timer, a verse to dwell on, a gentle breathing guide, and soft chimes to keep the time. No account, no ads, and it works offline.',
      },
    ],
    related: ['how-to-meditate-on-scripture', 'breath-prayer'],
  },
  {
    path: '/learn/how-to-meditate-on-scripture',
    slug: 'how-to-meditate-on-scripture',
    seoTitle: 'How to Meditate on Scripture: A Simple Practice | Quiet Waters',
    seoDesc:
      'A step-by-step guide to meditating on Scripture — how to slow down, dwell on a verse, and let God’s Word sink in, drawing on the ancient practice of lectio divina.',
    heading: 'How to Meditate on Scripture',
    lede: 'Meditating on Scripture means reading slowly enough for the words to sink in — turning a verse over until it becomes prayer. Here is a simple way to begin.',
    updated: '2026-08',
    blocks: [
      {
        t: 'p',
        html: 'Most of us read the Bible the way we read everything else — quickly, for information, and then on to the next thing. Meditation is a different pace. It reads a little and stays a while. The aim is not to get through a passage but to let the passage get through to you.',
      },
      {
        t: 'quote',
        text: 'His delight is in the law of the LORD, and on his law he meditates day and night. He is like a tree planted by streams of water.',
        cite: 'Psalm 1:2–3',
      },
      { t: 'h2', text: 'Choose a small passage' },
      {
        t: 'p',
        html: 'Start small — a single verse or two, not a whole chapter. Depth matters more than distance here. A psalm is a wonderful place to begin (try Psalm 23, Psalm 46, or Psalm 63), as is a line from the Gospels or the Lord’s Prayer. If you already have a reading plan, simply slow down over one verse that stands out.',
      },
      { t: 'h2', text: 'A simple method: read, reflect, respond, rest' },
      {
        t: 'p',
        html: 'Christians have meditated on Scripture this way for many centuries — a rhythm the old writers called <em>lectio divina</em> (“divine reading”): <em>lectio, meditatio, oratio, contemplatio</em>. You don’t need the Latin. Four unhurried movements are enough:',
      },
      {
        t: 'list',
        ordered: true,
        items: [
          '<strong>Read.</strong> Read the passage slowly, aloud if you can. Then read it again. Notice a word or phrase that draws you.',
          '<strong>Reflect.</strong> Sit with that word. Why this one? What is God showing you in it? Turn it over; let it question you.',
          '<strong>Respond.</strong> Pray back what you’ve found — confession, thanks, a request, surrender. Talk to God about it honestly.',
          '<strong>Rest.</strong> Stop talking. Simply be with God for a minute, the way you’d sit with someone you love without needing words.',
        ],
      },
      { t: 'h2', text: 'A few things that help' },
      {
        t: 'list',
        items: [
          'Repeat the verse under your breath, emphasizing a different word each time.',
          'Make it personal — put your own name in it, or pray it in the first person.',
          'Keep it short. Five faithful minutes beat an hour you dread.',
          'Meet at the same time each day; the rhythm does much of the work.',
          'Let a line follow you out — carry it as a <a href="/learn/breath-prayer">breath prayer</a> through the day.',
        ],
      },
      { t: 'h2', text: 'A short example' },
      {
        t: 'p',
        html: 'Take Psalm 23:1 — <em>“The LORD is my shepherd; I shall not want.”</em> Read it slowly. Rest on <em>my</em>: not a shepherd in general, but yours. Rest on <em>shall not want</em>: what are you afraid of lacking today? Then respond — “Lord, be my shepherd in this very thing” — and sit quietly, letting him be exactly that. That is meditation. Nothing more complicated than staying.',
      },
      { t: 'h2', text: 'Let the app keep the time' },
      {
        t: 'p',
        html: '<a href="/">Quiet Waters</a> is a free, distraction-free space for this: a gentle timer, a rotating verse to dwell on, a breathing guide, and soft chimes so you can close your eyes and simply stay in the Word. No account, no ads, works offline.',
      },
    ],
    related: ['christian-meditation', 'breath-prayer'],
  },
  {
    path: '/learn/breath-prayer',
    slug: 'breath-prayer',
    seoTitle: 'Breath Prayer: What It Is & How to Practice It | Quiet Waters',
    seoDesc:
      'What a breath prayer is, where the practice comes from, and simple breath prayers you can pray today — a gentle way to pray continually and quiet an anxious heart.',
    heading: 'Breath Prayer',
    lede: 'A breath prayer is a short prayer you pray on the rhythm of your breath — one line as you breathe in, one as you breathe out. It is a simple way to pray continually.',
    updated: '2026-08',
    blocks: [
      {
        t: 'p',
        html: 'A breath prayer is exactly what it sounds like: a brief prayer, usually just a phrase or two, prayed in time with your breathing. You breathe in on one line and out on the next, and repeat it gently for as long as you like. Because it is so short, you can pray it anywhere — waiting in line, lying awake, or in the middle of a hard moment.',
      },
      { t: 'h2', text: 'Where does it come from?' },
      {
        t: 'p',
        html: 'The practice is ancient. Its best-known form is the Jesus Prayer of the early church — <em>“Lord Jesus Christ, Son of God, have mercy on me, a sinner”</em> — prayed slowly and repeatedly until it becomes as natural as breathing. It takes seriously Paul’s call to “pray without ceasing” (1 Thessalonians 5:17), and echoes the psalms:',
      },
      {
        t: 'quote',
        text: 'Let everything that has breath praise the LORD.',
        cite: 'Psalm 150:6',
      },
      { t: 'h2', text: 'Simple breath prayers to try' },
      {
        t: 'p',
        html: 'Pick one and pray it slowly — inhale the first line, exhale the second:',
      },
      {
        t: 'list',
        items: [
          '<em>Be still</em> — <em>and know that I am God.</em> (Psalm 46:10)',
          '<em>Abba, Father</em> — <em>I belong to you.</em>',
          '<em>Lord Jesus Christ</em> — <em>have mercy on me.</em> (the Jesus Prayer)',
          '<em>Speak, Lord</em> — <em>your servant is listening.</em> (1 Samuel 3:9)',
          '<em>Yah</em> — <em>weh.</em> — the divine Name itself, breathed out as praise.',
        ],
      },
      { t: 'h2', text: 'How to practice' },
      {
        t: 'list',
        ordered: true,
        items: [
          'Sit comfortably and take a few slow breaths to settle.',
          'Choose a short prayer and match it to your breath — one line in, one line out.',
          'Don’t rush. Let the words move with the breath, not the breath with the words.',
          'When your mind wanders — and it will — gently return to the prayer. The returning <em>is</em> the prayer.',
          'Pray it for a minute or ten. Then carry it with you into the day.',
        ],
      },
      { t: 'h2', text: 'When to pray it' },
      {
        t: 'p',
        html: 'Breath prayer is a quiet friend in anxious moments. When worry rises, a slow, prayed breath preaches Philippians 4:6–7 to your own body — “do not be anxious… and the peace of God will guard your hearts.” It is a good companion for waiting, for falling asleep, and for the ordinary minutes between things.',
      },
      { t: 'h2', text: 'A guide for your breath' },
      {
        t: 'p',
        html: '<a href="/">Quiet Waters</a> includes a gentle breathing guide that paces your breath with a short prayer — including a mode that breathes the divine Name, <em>Yah</em> in and <em>weh</em> out. It’s free, private, and works offline. <a href="/learn/how-to-meditate-on-scripture">Meditating on a verse</a> pairs naturally with it.',
      },
    ],
    related: ['christian-meditation', 'how-to-meditate-on-scripture'],
  },
]

export const articleBySlug = (slug: string): Article | undefined =>
  ARTICLES.find((a) => a.slug === slug)

function renderBlocks(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.t) {
        case 'p':
          return `<p>${b.html}</p>`
        case 'h2':
          return `<h2>${escHtml(b.text)}</h2>`
        case 'h3':
          return `<h3>${escHtml(b.text)}</h3>`
        case 'quote':
          return `<blockquote>${escHtml(b.text)}${
            b.cite ? `<cite>${escHtml(b.cite)}</cite>` : ''
          }</blockquote>`
        case 'list': {
          const tag = b.ordered ? 'ol' : 'ul'
          const items = b.items.map((it) => `<li>${it}</li>`).join('')
          return `<${tag}>${items}</${tag}>`
        }
      }
    })
    .join('\n      ')
}

function relatedCards(slugs: string[]): string {
  const cards = slugs
    .map((s) => articleBySlug(s))
    .filter((a): a is Article => !!a)
    .map(
      (a) => `<a class="card" href="${a.path}">
        <div class="card-title">${escHtml(a.heading)}</div>
        <div class="card-desc">${escHtml(a.lede)}</div>
      </a>`,
    )
    .join('\n        ')
  if (!cards) return ''
  return `<hr />
      <h2>Keep reading</h2>
      <div class="cards">
        ${cards}
      </div>`
}

/** Render one guide article as a complete static document. */
export function renderArticlePage(a: Article): string {
  const head: ContentHead = {
    path: a.path,
    title: a.seoTitle,
    description: a.seoDesc,
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.heading,
        description: a.seoDesc,
        url: SITE_URL + a.path,
        inLanguage: 'en',
        isAccessibleForFree: true,
        author: { '@type': 'Organization', name: 'Quiet Waters' },
        publisher: { '@type': 'Organization', name: 'Quiet Waters' },
      },
      breadcrumb([
        { name: 'Quiet Waters', path: '/' },
        { name: 'Guides', path: '/learn' },
        { name: a.heading, path: a.path },
      ]),
    ],
  }

  const body = `      <p class="crumbs"><a href="/learn">Guides</a> · Christian meditation</p>
      <span id="top"></span>
      <h1>${escHtml(a.heading)}</h1>
      <p class="lede">${escHtml(a.lede)}</p>

      ${renderBlocks(a.blocks)}

      <div class="cta-row">
        <a class="cta" href="/">Try Quiet Waters — free →</a>
      </div>

      ${relatedCards(a.related)}`

  return pageShell(head, body)
}

/** Render the /learn index that links to every guide. */
export function renderLearnIndex(): string {
  const head: ContentHead = {
    path: '/learn',
    title: 'Christian Meditation & Contemplative Prayer — Guides | Quiet Waters',
    description:
      'Simple, Scripture-rooted guides to Christian meditation, meditating on God’s Word, and breath prayer — plus a free app to help you practice being still before God.',
    ogType: 'website',
    jsonLd: [
      breadcrumb([
        { name: 'Quiet Waters', path: '/' },
        { name: 'Guides', path: '/learn' },
      ]),
    ],
  }

  const cards = ARTICLES.map(
    (a) => `<a class="card" href="${a.path}">
        <div class="card-title">${escHtml(a.heading)}</div>
        <div class="card-desc">${escHtml(a.lede)}</div>
      </a>`,
  ).join('\n        ')

  const body = `      <p class="eyebrow">Guides</p>
      <h1>Learning to be still before God</h1>
      <p class="lede">Short, Scripture-rooted guides to Christian meditation and contemplative prayer — and a free, private app to help you practice.</p>

      <div class="cards" style="margin-top:1.75rem">
        ${cards}
      </div>

      <div class="cta-row">
        <a class="cta" href="/">Open Quiet Waters — free →</a>
      </div>

      <hr />
      <p>Quiet Waters also includes an in-app Bible and the complete <a href="/read/1-enoch">Books of Enoch</a> to read online.</p>`

  return pageShell(head, body)
}
