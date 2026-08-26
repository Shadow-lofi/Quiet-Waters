// The Updates log — a running, newest-first record of what has changed in Quiet
// Waters: new features, refinements, and fixes. Shown on the Updates page.
//
// To log a change: add an entry to the TOP of CHANGELOG with the date, a tag
// (New / Improved / Fixed), a short title, a one-line detail, and — when it lives
// on its own screen — a `to` route so the row deep-links there.

export type ChangeTag = 'New' | 'Improved' | 'Fixed'

export interface ChangeEntry {
  date: string // display date, e.g. 'August 12, 2026'
  tag: ChangeTag
  title: string
  detail: string
  to?: string // in-app route to open the related feature, when it has one
}

// Shipped versions, newest first. Used on the Updates page to show the version
// you're coming from, so the progression is visible. Add each new version here.
export const VERSION_HISTORY: string[] = ['1.14.0', '1.13.0', '1.12.0', '1.11.0', '1.10.0', '1.9.0', '1.8.0', '1.7.0', '1.6.0', '1.5.0', '1.4.4', '1.4.3', '1.4.2', '1.4.1', '1.4.0', '1.3.0', '1.2.0', '1.1.0', '1.0.0']

// Newest first. Entries sharing a date are grouped together on the page.
export const CHANGELOG: ChangeEntry[] = [
  // ── August 26 (v1.14.0) ─────────────────────────────────
  {
    date: 'August 26, 2026',
    tag: 'New',
    title: 'Share a verse as an image',
    detail:
      'Turn any verse into a quiet Still Waters image to share — tap Share on the daily verse, or on any verse in the Bible tab, choose a background, and send it or save it. A gentle way to pass along the Word.',
    to: '/meditate',
  },

  // ── August 25 (v1.13.0) ─────────────────────────────────
  {
    date: 'August 25, 2026',
    tag: 'New',
    title: '2 Enoch joins the Enoch tab',
    detail:
      'The Slavonic Book of Enoch (2 Enoch) — all 68 chapters in the Morfill/Charles public-domain translation — now sits alongside 1 Enoch under the Enoch tab. A toggle at the top switches between the two books, and it reads offline like the rest.',
    to: '/enoch',
  },

  // ── August 24 (v1.12.0) ─────────────────────────────────
  {
    date: 'August 24, 2026',
    tag: 'New',
    title: 'An in-app Bible',
    detail:
      'Read any chapter (World English Bible, KJV, and more), and tap a verse to highlight it, add a note, a label, or a bookmark — all kept on your device. It gathers under the new Bible tab, with a Saved view for everything you’ve marked.',
    to: '/bible',
  },
  {
    date: 'August 24, 2026',
    tag: 'New',
    title: 'The Book of Enoch',
    detail:
      'The complete Book of Enoch (1 Enoch) — all 108 chapters in R. H. Charles’s public-domain translation — now under a new Enoch tab, grouped by its five divisions and readable offline.',
    to: '/enoch',
  },

  // ── August 23 (v1.11.0) ─────────────────────────────────
  {
    date: 'August 23, 2026',
    tag: 'New',
    title: 'Gog and Magog — Ezekiel to Revelation',
    detail:
      'A three-part teaching in Study: the latter-days war of Ezekiel 38 — with each ancient nation matched to what it’s called today — its aftermath in Ezekiel 39, and how Revelation 20 relates.',
    to: '/study',
  },

  // ── August 22 (v1.10.0) ─────────────────────────────────
  {
    date: 'August 22, 2026',
    tag: 'New',
    title: 'A new Study section',
    detail:
      'A place for Scripture to sit with and return to — opening with the Ten Commandments, the Lord’s Prayer, and the Apostles’ Creed.',
    to: '/study',
  },

  // ── August 21 (v1.9.0) ──────────────────────────────────
  {
    date: 'August 21, 2026',
    tag: 'New',
    title: 'Notifications on your phone',
    detail:
      'Invite gentle notifications — a daily verse, and word of new features — that reach you even when the app is closed. Turn them on in Settings (on iPhone, add the app to your home screen first).',
    to: '/settings',
  },
  {
    date: 'August 21, 2026',
    tag: 'New',
    title: 'A quiet inbox that fills itself',
    detail:
      'Announcements now arrive in your Notifications, and “On this day” gently remembers a sitting from a year ago.',
    to: '/notifications',
  },

  // ── August 20 (v1.8.0) ──────────────────────────────────
  {
    date: 'August 20, 2026',
    tag: 'New',
    title: 'A Notifications inbox',
    detail:
      'A calm inbox gathers the app’s gentle nudges — your daily reminder, invitations, and updates — and settles into an “All caught up” rest when there’s nothing left to tend.',
    to: '/notifications',
  },
  {
    date: 'August 20, 2026',
    tag: 'New',
    title: 'Add to Home Screen',
    detail:
      'A gentle invitation — with a step-by-step walkthrough — to install Quiet Waters for full-screen, offline stillness. It quietly steps aside once you’ve installed it.',
    to: '/settings',
  },

  // ── August 13 (v1.7.0) ──────────────────────────────────
  {
    date: 'August 13, 2026',
    tag: 'New',
    title: 'Pray the Name on any sitting',
    detail:
      'Choose “The Name” under On the breath and your own free-timer sitting breathes Yah / weh — at its own slower, restful pace — with the Hebrew Name above the circle.',
    to: '/meditate',
  },

  // ── August 13 (v1.6.0) ──────────────────────────────────
  {
    date: 'August 13, 2026',
    tag: 'New',
    title: 'The Breath of God',
    detail:
      'A new guided sitting that prays the name of God on the breath — in: Yah, out: weh — with the Hebrew Name gently breathing above the circle. Find it under Guided sessions.',
    to: '/meditate',
  },

  // ── August 12 (v1.5.0) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'New',
    title: 'A welcome page',
    detail:
      'A gentle introduction now greets first-time visitors at the front door. The app opens straight to your timer as always.',
  },

  // ── August 12 (v1.4.4) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'Fixed',
    title: 'Chimes play when your phone is on silent',
    detail:
      'On iPhone, the opening, closing, and interval bells now sound through the speaker even with the mute switch on — not only through headphones.',
  },

  // ── August 12 (v1.4.3) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'Improved',
    title: 'A tidier name field',
    detail: 'The name field in Settings is smaller now, so the card sits more neatly.',
    to: '/settings',
  },

  // ── August 12 (v1.4.2) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'Improved',
    title: 'Install steps for every device',
    detail:
      'The Add to Home Screen guide now walks you through iPhone & iPad, Android, and computer — and opens to your own device. Find it in Settings.',
    to: '/settings',
  },

  // ── August 12 (v1.4.1) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'New',
    title: 'Add to your home screen',
    detail:
      'A short walkthrough shows how to install Quiet Waters to your home screen for a full-screen, offline, one-tap sitting. Find it in Settings.',
    to: '/settings',
  },
  {
    date: 'August 12, 2026',
    tag: 'Improved',
    title: 'A softer opening chime',
    detail:
      'The bell that opens a sitting now eases in more gently and warmly, so beginning feels a little more like settling than starting.',
  },

  // ── August 12 (v1.4.0) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'New',
    title: 'Share Quiet Waters',
    detail:
      'Invite someone to be still with a single tap — the link opens with a gentle preview card. Find it in Settings.',
    to: '/settings',
  },
  {
    date: 'August 12, 2026',
    tag: 'New',
    title: 'This Updates page',
    detail:
      'See what’s changed in Quiet Waters, newest first — and check for a new version when one’s ready.',
    to: '/updates',
  },
  {
    date: 'August 12, 2026',
    tag: 'Improved',
    title: 'A tidy update prompt',
    detail:
      'When a new version is ready, you’ll see a soft prompt instead of the app changing mid-visit — install it when you choose.',
  },

  // ── August 12 (v1.3.0) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'New',
    title: 'Gentle daily reminders',
    detail:
      'Choose a time to be invited into stillness. A soft banner greets you in the app, with an optional device notification when it’s allowed.',
    to: '/settings',
  },

  // ── August 12 (v1.2.0) ──────────────────────────────────
  {
    date: 'August 12, 2026',
    tag: 'New',
    title: 'Guided sittings',
    detail:
      'Five ready-made sessions — from a 3-minute “Be Still” to “Waiting on God” — each with quiet prompts that unfold as you sit.',
    to: '/meditate',
  },

  // ── August 11 (v1.1.0) ──────────────────────────────────
  {
    date: 'August 11, 2026',
    tag: 'New',
    title: 'Ambience — a crackling hearth',
    detail:
      'An optional warm background sound during your sitting, synthesized in the app so it works fully offline.',
    to: '/settings',
  },
  {
    date: 'August 11, 2026',
    tag: 'New',
    title: 'A quiet underwater backdrop',
    detail: 'Soft light rays and slowly rising bubbles drift behind the app — calming, and easy to turn off.',
  },
  {
    date: 'August 11, 2026',
    tag: 'Improved',
    title: 'Light that follows your day',
    detail:
      'A new Cycle appearance shifts from day to night with your local clock, plus an Animations setting so gentle motion shows the way you like.',
    to: '/settings',
  },

  // ── August 10 (v1.0.0) ──────────────────────────────────
  {
    date: 'August 10, 2026',
    tag: 'New',
    title: 'Quiet Waters',
    detail:
      'A Christian meditation timer — soft chimes, Scripture to dwell on, a breathing guide, and a gentle streak. Be still, and know that He is God.',
    to: '/meditate',
  },
]
