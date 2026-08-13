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
export const VERSION_HISTORY: string[] = ['1.6.0', '1.5.0', '1.4.4', '1.4.3', '1.4.2', '1.4.1', '1.4.0', '1.3.0', '1.2.0', '1.1.0', '1.0.0']

// Newest first. Entries sharing a date are grouped together on the page.
export const CHANGELOG: ChangeEntry[] = [
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
