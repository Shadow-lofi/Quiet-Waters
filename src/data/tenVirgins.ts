// Content for the "Ten Virgins" deep study — the Parable of the Ten Virgins
// (Matthew 25:1–13), read for its meaning in the world we live in now. Tone is
// watchful and hopeful, never fearful or date-setting (Matthew 25:13). Scripture
// is quoted from the public-domain World English Bible. The study is a companion
// to the End Times study and links the author's "Oil in My Lamp" site — named
// after this very parable — at the foot.

// A verse of the parable, for the read-through card.
export interface ParableVerse {
  n: number
  text: string
}

// One line of the symbol key.
export interface Symbol {
  element: string
  meaning: string
  ref?: string
}

// One movement of the parable, walked through with its modern application.
export interface Movement {
  title: string
  passage: string
  verseText: string
  meaning: string
  today: string
}

// A practical way to "keep the lamp full" now.
export interface Practice {
  title: string
  text: string
  ref?: string
}

// The author's companion teaching site, named after this parable.
export const ARTICLE = {
  title: 'Oil in My Lamp',
  blurb:
    'A companion teaching drawn from this very parable — on keeping your lamp full and your heart ready for the return of Christ.',
  url: 'https://shadow-lofi.github.io/Oil-In-My-Lamp/',
}

// The verse to hold in the heart (offered for Scripture Memory).
export const KEY_VERSE = {
  ref: 'Matthew 25:13',
  text: 'Watch therefore, for you don’t know the day nor the hour in which the Son of Man is coming.',
  translation: 'WEB',
}

// Matthew 25:1–13, World English Bible.
export const PARABLE: ParableVerse[] = [
  { n: 1, text: 'Then the Kingdom of Heaven will be like ten virgins who took their lamps and went out to meet the bridegroom.' },
  { n: 2, text: 'Five of them were foolish, and five were wise.' },
  { n: 3, text: 'Those who were foolish, when they took their lamps, took no oil with them,' },
  { n: 4, text: 'but the wise took oil in their vessels with their lamps.' },
  { n: 5, text: 'Now while the bridegroom delayed, they all slumbered and slept.' },
  { n: 6, text: 'But at midnight there was a cry, “Behold! The bridegroom is coming! Come out to meet him!”' },
  { n: 7, text: 'Then all those virgins arose, and trimmed their lamps.' },
  { n: 8, text: 'The foolish said to the wise, “Give us some of your oil, for our lamps are going out.”' },
  { n: 9, text: 'But the wise answered, saying, “What if there isn’t enough for us and you? You go rather to those who sell, and buy for yourselves.”' },
  { n: 10, text: 'While they went away to buy, the bridegroom came, and those who were ready went in with him to the wedding feast, and the door was shut.' },
  { n: 11, text: 'Afterward the other virgins also came, saying, “Lord, Lord, open to us.”' },
  { n: 12, text: 'But he answered, “Most certainly I tell you, I don’t know you.”' },
  { n: 13, text: 'Watch therefore, for you don’t know the day nor the hour in which the Son of Man is coming.' },
]

// The symbols of the parable, unveiled.
export const SYMBOLS: Symbol[] = [
  {
    element: 'The Bridegroom',
    meaning: 'Christ Himself — the returning Lord, coming for His bride.',
    ref: 'Matthew 9:15 · Revelation 19:7',
  },
  {
    element: 'The wedding feast',
    meaning: 'The marriage supper of the Lamb — the joy of being with God forever.',
    ref: 'Revelation 19:9',
  },
  {
    element: 'The ten virgins',
    meaning: 'The whole waiting church — everyone who professes to be looking for Him. All ten were invited; all went out to meet Him.',
  },
  {
    element: 'The lamps',
    meaning: 'The outward profession of faith — the part everyone can see.',
    ref: 'Matthew 5:16',
  },
  {
    element: 'The oil',
    meaning: 'The hidden inner reality — the Spirit and a genuine, personal life with God; the one thing that cannot be borrowed.',
    ref: 'Romans 8:9',
  },
  {
    element: 'The delay',
    meaning: 'The long wait before Christ returns, which quietly tests every heart.',
    ref: '2 Peter 3:9',
  },
  {
    element: 'The midnight cry',
    meaning: 'The sudden announcement of His coming — at the darkest, least-expected hour.',
    ref: '1 Thessalonians 5:2',
  },
  {
    element: 'The shut door',
    meaning: 'The finality of that day — the close of the season of grace.',
    ref: 'Luke 13:25',
  },
  {
    element: '“I don’t know you”',
    meaning: 'The tragedy of a profession without a relationship — knowing about Him, but never being known by Him.',
    ref: 'Matthew 7:23',
  },
]

// Walking through the parable, movement by movement, into today.
export const MOVEMENTS: Movement[] = [
  {
    title: 'All ten look the same',
    passage: 'Matthew 25:1–2',
    verseText: 'Ten virgins… went out to meet the bridegroom. Five of them were foolish, and five were wise.',
    meaning:
      'All ten were invited. All went out to meet Him. All carried lamps. All called themselves His. From the outside, you could not tell the wise from the foolish — the difference was entirely hidden. The dividing line does not run between the church and the world; it runs straight down the middle of the waiting church.',
    today:
      'In a world full of cultural, casual, and inherited faith, this is the most searching truth of the parable. You can attend, sing, serve, and say all the right words and still be carrying an empty lamp. The question is not “Am I in the crowd going out to meet Him?” but “Is there oil in my vessel?”',
  },
  {
    title: 'Lamps everyone can see, oil no one can',
    passage: 'Matthew 25:3–4',
    verseText: 'The foolish took no oil with them, but the wise took oil in their vessels with their lamps.',
    meaning:
      'A lamp is public; the reserve of oil is private. The wise carried an unseen supply — an inner store to keep the flame alive when the wait grew long. The foolish had all the appearance of light with nothing underneath to sustain it.',
    today:
      'Our age is expert at the lamp — the profile, the platform, the performance of belief — and thin on the oil. It is possible to hold “a form of godliness” while denying its power (2 Timothy 3:5). The wise tend the hidden life with God that no screen ever sees: the secret prayer, the quiet obedience, the daily walk in the Spirit.',
  },
  {
    title: 'The Bridegroom delayed',
    passage: 'Matthew 25:5a',
    verseText: 'Now while the bridegroom delayed…',
    meaning:
      'The whole test hangs on this delay. Had He come at once, the difference between the two groups would never have surfaced. It is the long wait that separates a flame with oil behind it from a flame with nothing in reserve.',
    today:
      'Two thousand years on, the delay is the very thing the world mocks — “Where is the promise of his coming?” (2 Peter 3:4). Yet the delay is not absence but patience, God “not wishing that any should perish” (2 Peter 3:9). The danger of a long wait is that it lulls us into living as though He were not coming at all.',
  },
  {
    title: 'They all slept',
    passage: 'Matthew 25:5b',
    verseText: '…they all slumbered and slept.',
    meaning:
      'Read it carefully: the wise slept too. Sleep is not the sin of this parable. When the cry came, the difference was never who had stayed awake — it was who had oil when they woke. Readiness is not sleeplessness; it is being prepared in advance.',
    today:
      'This is strangely comforting. Every honest believer knows seasons of spiritual drowsiness — the dry stretch, the dulled affections, the tired heart. The parable does not condemn the weary; it warns the unprepared. You cannot promise you will feel wide awake when He comes — but you can make sure your vessel is full.',
  },
  {
    title: 'The midnight cry',
    passage: 'Matthew 25:6–7',
    verseText: 'But at midnight there was a cry, “Behold! The bridegroom is coming! Come out to meet him!”',
    meaning:
      'The call comes at midnight — the darkest, latest, least-expected hour — and it comes suddenly. There is no time to go and become what you are not. The shout only reveals what was already there.',
    today:
      '“The day of the Lord comes like a thief in the night” (1 Thessalonians 5:2). No countdown, no chance to cram. Whatever you have quietly built over the years is what you will have in that hour. The suddenness is not meant to frighten you, but to make today the day you prepare.',
  },
  {
    title: 'The oil that cannot be borrowed',
    passage: 'Matthew 25:8–9',
    verseText: '“Give us some of your oil…” “What if there isn’t enough for us and you? Go… and buy for yourselves.”',
    meaning:
      'The refusal sounds harsh, but it is simply true: this oil is not transferable. No one can lend you an inner life with God. It was not selfishness on the part of the wise — the thing genuinely could not be shared.',
    today:
      'There is no secondhand faith. You cannot ride into that day on a believing parent, a devout spouse, a good church, a Christian upbringing, or the prayers of others. Every one of these is a gift — but the relationship with Christ has to be your own. What is merely borrowed will fail you at the exact moment you need it most.',
  },
  {
    title: 'Too late to buy',
    passage: 'Matthew 25:10',
    verseText: 'While they went away to buy, the bridegroom came, and those who were ready went in… and the door was shut.',
    meaning:
      'The oil was available — but not at midnight. The foolish were not shut out for lack of desire at the end. They were shut out because they left for later what could only be gathered beforehand.',
    today:
      '“I’ll get serious about God someday” is the exact folly the parable names. Grace is free, but it is received into a life, not conjured in a moment of panic. The tragedy of the foolish is not that they were wicked — it is that they assumed they still had time.',
  },
  {
    title: 'The shut door, and “I don’t know you”',
    passage: 'Matthew 25:11–12',
    verseText: '“Lord, Lord, open to us.” But he answered, “Most certainly I tell you, I don’t know you.”',
    meaning:
      'The most sobering line is not about the door but about the relationship: “I don’t know you.” They knew about Him — enough to wait, to carry a lamp, to cry “Lord, Lord.” What was missing was that He knew them.',
    today:
      'It echoes Matthew 7:22–23 — “Lord, Lord, did we not…” “I never knew you.” Activity is not intimacy. The heart of readiness is not religious output but being known by God — walked with, surrendered to, loved. The warning is severe precisely because the love behind it is real.',
  },
  {
    title: '“Watch therefore”',
    passage: 'Matthew 25:13',
    verseText: 'Watch therefore, for you don’t know the day nor the hour in which the Son of Man is coming.',
    meaning:
      'Here is the point of the whole parable, in Jesus’ own words — not to calculate the hour, but to live ready for it, with a full vessel, whatever the hour turns out to be.',
    today:
      'To watch is not to stare at the sky or set dates; it is to keep the lamp trimmed and the vessel full — a life quietly kept with God, so that whenever He comes, you are not scrambling. Readiness is today’s work, never tomorrow’s.',
  },
]

// How to "buy oil" now — practical, hopeful ways to keep the lamp full.
export const PRACTICES: Practice[] = [
  {
    title: 'Tend the hidden life',
    text: 'The oil is gathered in secret. A little unhurried time with God each day — even a few still minutes — is how the vessel slowly fills.',
    ref: 'Matthew 6:6',
  },
  {
    title: 'Stay in the Word',
    text: '“Your word is a lamp to my feet.” Scripture is fuel for a flame that lasts through a long, dark wait.',
    ref: 'Psalm 119:105',
  },
  {
    title: 'Keep the flame of prayer',
    text: 'An ongoing conversation, not an emergency flare. Pray while there is peace — not only at midnight.',
    ref: '1 Thessalonians 5:17',
  },
  {
    title: 'Walk in the Spirit',
    text: 'The oil is His presence. Readiness is simply a life yielded to Him, one ordinary day at a time.',
    ref: 'Galatians 5:16, 25',
  },
  {
    title: 'Make it your own',
    text: 'Don’t lean on borrowed faith. Come to Christ yourself, and let yourself be known by Him.',
    ref: 'John 10:14',
  },
  {
    title: 'Live as if today',
    text: 'Let the certainty of His coming — not the timing of it — shape how you live right now.',
    ref: 'Titus 2:12–13',
  },
]
