// Content for the "End Times Study" page. Scriptures are shown as short,
// essential excerpts with a reference, in the app's calm reading style. The tone
// is watchful and hopeful — never date-setting (see Matthew 24:36), never
// fearful. Ported from the companion Temple app so the study lives here too.

export interface Sign {
  title: string
  verseRef: string
  verseText: string
  today: string
}

export interface KeyPassage {
  ref: string
  text: string
  note: string
}

export interface BookStudy {
  book: string
  subtitle: string
  overview: string
  structure?: string
  themes: string[]
  passages: KeyPassage[]
}

// The author's companion teaching site, linked at the foot of the page.
export const ARTICLE = {
  title: 'Oil in My Lamp',
  blurb:
    'A companion teaching on the signs of the times — deep studies in Daniel, Matthew, and Revelation, written to help believers stay watchful.',
  url: 'https://shadow-lofi.github.io/Oil-In-My-Lamp/',
}

// Signs of the times — New Testament themes and how they read in our own day.
export const SIGNS: Sign[] = [
  {
    title: 'Wars and rumors of wars',
    verseRef: 'Matthew 24:6–7',
    verseText: 'You will hear of wars and rumors of wars… nation will rise against nation.',
    today:
      'Conflict between nations is a constant of the headlines. Jesus said such things “must take place,” yet “the end is not yet” — a call to steadiness, not panic.',
  },
  {
    title: 'Deception will increase',
    verseRef: 'Matthew 24:4–5, 11',
    verseText: 'See that no one leads you astray… many false prophets will arise and lead many astray.',
    today:
      'In an age of endless competing voices, His very first warning about the end was not a disaster but deception. Test everything against His Word.',
  },
  {
    title: 'The gospel to all nations',
    verseRef: 'Matthew 24:14',
    verseText: 'This gospel of the kingdom will be proclaimed throughout the whole world… and then the end will come.',
    today:
      'For the first time in history, technology can carry the good news to nearly every nation and language on earth — the one sign Jesus tied directly to the end.',
  },
  {
    title: 'Lawlessness and love grown cold',
    verseRef: 'Matthew 24:12',
    verseText: 'Because lawlessness will be increased, the love of many will grow cold.',
    today:
      'Where wrong is called right and hearts grow hard, Scripture invites us to keep our own love warm, our own faith awake.',
  },
  {
    title: 'Scoffers will come',
    verseRef: '2 Peter 3:3–4',
    verseText: 'Scoffers will come… saying, “Where is the promise of his coming?”',
    today:
      'Skepticism about Christ’s return is itself something Scripture foretold. His apparent delay is patience — “not wishing that any should perish.”',
  },
  {
    title: 'Perilous times',
    verseRef: '2 Timothy 3:1–5',
    verseText: 'In the last days there will come times of difficulty… lovers of self… lovers of pleasure rather than lovers of God.',
    today:
      'Paul’s description of the age reads like a mirror held up to ours — and a call to live by a different spirit.',
  },
]

// Deep dives into three New Testament books.
export const BOOKS: BookStudy[] = [
  {
    book: 'Matthew',
    subtitle: 'The Olivet Discourse — the King’s own words about the end',
    overview:
      'On the Mount of Olives, Jesus gave His fullest teaching about the close of the age (Matthew 24–25). He names the signs, warns again and again against deception, and turns every warning into the same command: watch, and be ready. He is certain of His return — and just as certain that no one knows its day.',
    structure:
      'Matthew 24–25 — the signs (24:4–14), the tribulation (24:15–28), the coming of the Son of Man (24:29–31), the lesson of the fig tree (24:32–35), no one knows the day (24:36–44), and three parables of readiness — the faithful servant, the ten virgins, the talents — closing with the judgment of the nations (25:31–46).',
    themes: ['Watchfulness', 'Readiness', 'Truth over deception', 'The certain return of Christ', 'Faithfulness while we wait'],
    passages: [
      {
        ref: 'Matthew 24:14',
        text: 'This gospel of the kingdom will be proclaimed throughout the whole world… and then the end will come.',
        note: 'The one sign tied directly to the timing of the end.',
      },
      {
        ref: 'Matthew 24:32–33',
        text: 'From the fig tree learn its lesson… when you see all these things, you know that he is near.',
        note: 'Read the season the way you read the changing trees.',
      },
      {
        ref: 'Matthew 24:36',
        text: 'Concerning that day and hour no one knows… but the Father only.',
        note: 'The guardrail against every attempt to set a date.',
      },
      {
        ref: 'Matthew 24:42',
        text: 'Stay awake, for you do not know on what day your Lord is coming.',
        note: 'The heartbeat of the whole discourse.',
      },
    ],
  },
  {
    book: 'Acts',
    subtitle: 'The last days have already begun',
    overview:
      'At Pentecost, Peter stands and declares that the outpouring of the Spirit is the fulfillment of Joel’s prophecy of “the last days” (Acts 2:17). By the New Testament’s own reckoning, we have lived in the last days ever since. Acts shows the church as last-days people: Spirit-filled, bold in witness, and carrying the gospel toward the ends of the earth — the very sign that precedes the end.',
    structure:
      'From the ascension and its promise (1), to Pentecost and Peter’s sermon (2), to the life of the early church (2:42–47), to the gospel pressing outward through Jerusalem, Judea, Samaria, and on toward Rome and the nations.',
    themes: ['The last days began at Pentecost', 'The power of the Spirit', 'Witness to the ends of the earth', 'A real, visible return'],
    passages: [
      {
        ref: 'Acts 1:11',
        text: 'This Jesus… will come in the same way as you saw him go into heaven.',
        note: 'The promise spoken at the ascension — a real, personal return.',
      },
      {
        ref: 'Acts 1:8',
        text: 'You will be my witnesses… to the end of the earth.',
        note: 'The church’s mission for the whole age until He comes.',
      },
      {
        ref: 'Acts 2:17',
        text: 'In the last days… I will pour out my Spirit on all flesh.',
        note: 'Peter names our own age as “the last days.”',
      },
      {
        ref: 'Acts 17:31',
        text: 'He has fixed a day on which he will judge the world… by a man whom he has appointed.',
        note: 'History is moving toward a day already fixed.',
      },
    ],
  },
  {
    book: 'Revelation',
    subtitle: 'The unveiling of Jesus Christ',
    overview:
      'The word “revelation” means unveiling — and the book is, first of all, the unveiling of Jesus: reigning now, returning soon, making all things new. It is the only book of the Bible that promises a blessing simply to those who read it (Revelation 1:3). Through vivid symbols it assures the church that, however dark the hour, the Lamb has already won — and He will dwell with His people forever.',
    structure:
      'Letters to the seven churches (2–3), the throne and the Lamb (4–5), the seals, trumpets, and bowls (6–16), the fall of Babylon (17–18), the return of Christ (19), judgment and the millennium (20), and the new heaven and new earth (21–22).',
    themes: ['Jesus reigning and returning', 'The victory of the Lamb', 'Perseverance of the saints', 'The hope of the new creation'],
    passages: [
      {
        ref: 'Revelation 1:3',
        text: 'Blessed is the one who reads aloud the words of this prophecy… for the time is near.',
        note: 'The only book that pronounces a blessing on its readers.',
      },
      {
        ref: 'Revelation 1:7',
        text: 'Behold, he is coming with the clouds, and every eye will see him.',
        note: 'The theme of the whole book in a single line.',
      },
      {
        ref: 'Revelation 21:4',
        text: 'He will wipe away every tear… and death shall be no more.',
        note: 'Where all of history is finally heading.',
      },
      {
        ref: 'Revelation 22:20',
        text: 'Surely I am coming soon. Amen. Come, Lord Jesus!',
        note: 'The Bible’s closing prayer — and ours.',
      },
    ],
  },
]
