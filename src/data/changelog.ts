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
export const VERSION_HISTORY: string[] = ['1.27.0', '1.26.0', '1.25.0', '1.24.0', '1.23.0', '1.22.1', '1.22.0', '1.21.0', '1.20.0', '1.19.0', '1.18.0', '1.17.0', '1.16.0', '1.15.0', '1.14.0', '1.13.0', '1.12.0', '1.11.0', '1.10.0', '1.9.0', '1.8.0', '1.7.0', '1.6.0', '1.5.0', '1.4.4', '1.4.3', '1.4.2', '1.4.1', '1.4.0', '1.3.0', '1.2.0', '1.1.0', '1.0.0']

// Newest first. Entries sharing a date are grouped together on the page.
export const CHANGELOG: ChangeEntry[] = [
  // ── September 2 (v1.27.0) ────────────────────────────────
  {
    date: 'September 2, 2026',
    tag: 'New',
    title: 'Scripture Memory — hide the Word in your heart',
    detail:
      'Learn verses by heart as gentle flip cards — a quiet symbol on the front, the verse on the back. As you recall each one it resurfaces less often, so it takes root over time. Start with a few classics, add your own, or tap “Memorize” on any verse in the Bible reader. Find it on the Study page.',
    to: '/memory',
  },
  // ── September 2 (v1.26.0) ────────────────────────────────
  {
    date: 'September 2, 2026',
    tag: 'New',
    title: 'Keeping the Sabbath — a weekly rest',
    detail:
      'Set apart one day a week to rest in the Lord. On your Sabbath, the home screen greets you with a rest Scripture and an “I’m resting today” blessing — rest as worship, never a day missed. Turn on a gentle weekly reminder in Settings to be invited even when the app is closed in the background.',
    to: '/meditate',
  },
  // ── September 2 (v1.25.0) ────────────────────────────────
  {
    date: 'September 2, 2026',
    tag: 'New',
    title: 'Kids Bible Study — for the little ones',
    detail:
      'Animated Bible stories a child can tap through — Creation, Noah, David & Goliath, and Jonah — each with a gentle scene, a line you can hear read aloud, and a memory verse and star at the end. Free and offline. Find it on the Study page.',
    to: '/kids',
  },

  // ── September 2 (v1.24.0) ────────────────────────────────
  {
    date: 'September 2, 2026',
    tag: 'Improved',
    title: 'Add to your home screen — from anywhere',
    detail:
      'When you’re in a browser, a small “Add to your home screen” bar now rides along at the top of every page. Tap it and you go straight to the steps for your device — iPhone, Android, or computer. Once installed, it disappears for good.',
  },

  // ── September 2 (v1.23.0) ────────────────────────────────
  {
    date: 'September 2, 2026',
    tag: 'New',
    title: 'A way back from your saved verses',
    detail:
      'The Saved tab in the Bible now has a “Back to …” button that returns you to right where you were reading.',
    to: '/bible',
  },
  {
    date: 'September 2, 2026',
    tag: 'Fixed',
    title: 'Room to breathe at the top on phones',
    detail:
      'On phones with a notch or rounded top, the buttons up top — the bell, the Read/Saved tabs, the End button while meditating — no longer tuck under the status bar. They now sit clear of it.',
  },

  // ── September 2 (v1.22.1) ────────────────────────────────
  {
    date: 'September 2, 2026',
    tag: 'Fixed',
    title: 'The short books now read in full',
    detail:
      'Obadiah, Philemon, 2 John, 3 John, and Jude were showing only their first verse — the rest is restored, so each single-chapter book now reads all the way through.',
    to: '/bible',
  },

  // ── August 31 (v1.22.0) ─────────────────────────────────
  {
    date: 'August 31, 2026',
    tag: 'New',
    title: 'Send an encouragement',
    detail:
      'Turn a word of Scripture into a shareable card with a personal note on top, and send it to someone you love — by message, or copy the words. Choose a verse, add a line, pick a background. Find it on the Meditate page.',
    to: '/encourage',
  },

  // ── August 31 (v1.21.0) ─────────────────────────────────
  {
    date: 'August 31, 2026',
    tag: 'New',
    title: 'Listen straight through — chapter after chapter',
    detail:
      'The narrator can now keep reading into the next chapter on its own, like an audiobook — for walks, chores, or resting with your eyes closed. Turn on “Keep reading” in the voice menu beside Listen, in both the Bible and Enoch readers.',
    to: '/bible',
  },
  {
    date: 'August 31, 2026',
    tag: 'New',
    title: 'Lectio Divina — pray the Scriptures slowly',
    detail:
      'An ancient, unhurried way of praying a short passage in four movements — read, reflect, pray, and rest. The words stay before you the whole way, with a gentle prompt for each movement. Find it on the Meditate page.',
    to: '/lectio',
  },
  {
    date: 'August 31, 2026',
    tag: 'New',
    title: 'A prayer list — and a record of answered prayer',
    detail:
      'Lay your requests before God and hold them in one quiet place, then mark them answered in His time — the answered ones settle into a record of His faithfulness. Private and on-device. Find it on your Journey.',
    to: '/prayers',
  },
  {
    date: 'August 31, 2026',
    tag: 'New',
    title: 'How is your soul today?',
    detail:
      'A gentle one-tap check-in on the Meditate page. Name where your soul is — weary, anxious, grateful, and more — and be met with a fitting word of Scripture. Your Journey quietly remembers, so you can see how your soul has been over time.',
    to: '/meditate',
  },

  // ── August 30 (v1.20.0) ─────────────────────────────────
  {
    date: 'August 30, 2026',
    tag: 'Improved',
    title: 'A Back button on deeper pages',
    detail:
      'Pages you open from a link — the End Times Study, Updates, and Notifications — now carry a gentle “Back” button, so you can return to where you came from without hunting for the tab. A quiet help especially once the app is installed to your home screen.',
  },

  // ── August 30 (v1.19.0) ─────────────────────────────────
  {
    date: 'August 30, 2026',
    tag: 'New',
    title: 'End Times Study',
    detail:
      'A watchful, hopeful walk through what the New Testament says about the close of the age — the signs of the times, and deep dives into Matthew, Acts, and Revelation. Never date-setting, never fearful. Find it featured at the top of Deep Dive.',
    to: '/last-days',
  },

  // ── August 30 (v1.18.0) ─────────────────────────────────
  {
    date: 'August 30, 2026',
    tag: 'Improved',
    title: 'Choose your narrator’s voice',
    detail:
      'Tap the sliders beside “Listen” to pick which of your device’s voices reads to you and set the pace — slower, natural, or faster. It remembers your choice, and reads with cleaner pauses at each sentence. Installing your system’s “enhanced” or “natural” voices unlocks warmer, more lifelike reading.',
    to: '/bible',
  },

  // ── August 30 (v1.17.0) ─────────────────────────────────
  {
    date: 'August 30, 2026',
    tag: 'New',
    title: 'Hear the Word read aloud',
    detail:
      'A “Listen” button now sits atop each chapter in the Bible and Enoch readers. Tap it and a calm narrator voice reads the passage to you — the verse being read glows softly as it goes. Pause, resume, or stop anytime. It uses your device’s own voice, so it works offline and needs no account.',
    to: '/bible',
  },

  // ── August 28 (v1.16.0) ─────────────────────────────────
  {
    date: 'August 28, 2026',
    tag: 'New',
    title: 'A new guided sitting: Evening Rest',
    detail:
      'A gentle Compline to close the day — lay down its weight, entrust what is unfinished to God, and rest in Psalm 4:8, “In peace I will lie down and sleep, for You alone keep me safe.” Find it among the guided sittings on the Meditate page.',
    to: '/meditate',
  },

  // ── August 28 (v1.15.0) ─────────────────────────────────
  {
    date: 'August 28, 2026',
    tag: 'New',
    title: 'Seasons of the church year',
    detail:
      'The Notifications inbox now offers a gentle invitation as each sacred season arrives — Advent, Christmas, Lent, Holy Week, Eastertide, and Pentecost. It appears quietly when the season begins and rests through Ordinary Time. An invitation to be still, never an alarm.',
    to: '/notifications',
  },

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
