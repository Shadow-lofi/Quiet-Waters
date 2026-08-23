// Study material — Scripture to sit with and return to. Public-domain wording
// (World English Bible), matching the app's use of the divine Name (see the
// "pray the Name" breath in data/verses.ts). Add more pieces to the array over
// time; the Study page renders each one.

export interface StudyItem {
  term?: string // a heading for the item (e.g. an ancient nation name), for 'mapping'
  text: string
  ref?: string // per-line reference (numbered / mapping pieces)
}

export interface StudyPiece {
  id: string
  title: string
  reference: string
  overview?: string // plain opening paragraph (for teachings)
  intro?: string // an emphasized quote shown as a blockquote
  // 'numbered' → ordered list with a circle + per-line ref (default);
  // 'lines' → flowing serif lines, read as one prayer/creed;
  // 'mapping' → a glossary of term → explanation (for teachings).
  layout?: 'numbered' | 'lines' | 'mapping'
  items: StudyItem[]
  note?: string // a closing note (e.g. an interpretive caveat)
}

export const STUDY_MATERIAL: StudyPiece[] = [
  {
    id: 'ten-commandments',
    title: 'The Ten Commandments',
    reference: 'Exodus 20:2–17',
    intro:
      '“I am Yahweh your God, who brought you out of the land of Egypt, out of the house of bondage.”',
    items: [
      { text: 'You shall have no other gods before me.', ref: 'Exodus 20:3' },
      {
        text: 'You shall not make for yourself an idol, nor bow down to them, nor serve them.',
        ref: 'Exodus 20:4–6',
      },
      { text: 'You shall not take the name of Yahweh your God in vain.', ref: 'Exodus 20:7' },
      { text: 'Remember the Sabbath day, to keep it holy.', ref: 'Exodus 20:8–11' },
      { text: 'Honor your father and your mother.', ref: 'Exodus 20:12' },
      { text: 'You shall not murder.', ref: 'Exodus 20:13' },
      { text: 'You shall not commit adultery.', ref: 'Exodus 20:14' },
      { text: 'You shall not steal.', ref: 'Exodus 20:15' },
      { text: 'You shall not give false testimony against your neighbor.', ref: 'Exodus 20:16' },
      {
        text: 'You shall not covet anything that belongs to your neighbor.',
        ref: 'Exodus 20:17',
      },
    ],
  },
  {
    id: 'lords-prayer',
    title: "The Lord's Prayer",
    reference: 'Matthew 6:9–13',
    intro: '“Pray like this:”',
    layout: 'lines',
    items: [
      { text: 'Our Father in heaven, may your name be kept holy.' },
      { text: 'Let your Kingdom come. Let your will be done, as in heaven, so on earth.' },
      { text: 'Give us today our daily bread.' },
      { text: 'Forgive us our debts, as we also forgive our debtors.' },
      { text: 'Bring us not into temptation, but deliver us from the evil one.' },
      { text: 'For yours is the Kingdom, the power, and the glory forever. Amen.' },
    ],
  },
  {
    id: 'apostles-creed',
    title: "The Apostles' Creed",
    reference: 'An ancient confession of faith',
    layout: 'lines',
    items: [
      { text: 'I believe in God, the Father almighty, creator of heaven and earth.' },
      {
        text:
          'I believe in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, ' +
          'born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried; ' +
          'he descended to the dead. On the third day he rose again; he ascended into heaven, is seated ' +
          'at the right hand of the Father, and will come again to judge the living and the dead.',
      },
      {
        text:
          'I believe in the Holy Spirit, the holy Christian Church, the communion of saints, the ' +
          'forgiveness of sins, the resurrection of the body, and the life everlasting. Amen.',
      },
    ],
  },
  {
    id: 'gog-and-magog',
    title: 'The War of Gog and Magog',
    reference: 'Ezekiel 38–39',
    overview:
      'In the latter years, the prophet foresees a vast coalition — led by “Gog, of the land of ' +
      'Magog” — that gathers from the far north and beyond to come against a regathered, ' +
      'unsuspecting Israel dwelling in peace. But the battle is the LORD’s: God Himself intervenes ' +
      'and defeats the invaders on the mountains of Israel, so that the nations, and His own ' +
      'people, know that He is the LORD.',
    intro:
      '“Son of man, set your face toward Gog, of the land of Magog… and prophesy against him.” — Ezekiel 38:2',
    layout: 'mapping',
    items: [
      {
        term: 'Gog',
        text:
          'Not a nation but the leader of the coalition — the chief prince “of the land of Magog” ' +
          'who heads the invasion.',
        ref: 'Ezekiel 38:2–3',
      },
      {
        term: 'Magog',
        text:
          'The ancient Scythians, nomadic peoples north of the Black and Caspian Seas — widely ' +
          'identified today with Russia and the Central Asian steppes.',
        ref: 'Ezekiel 38:2',
      },
      {
        term: 'Rosh (in some translations)',
        text:
          'Sometimes read as a place-name and linked to Russia; many scholars instead render it ' +
          '“chief prince.” Disputed.',
        ref: 'Ezekiel 38:2–3',
      },
      {
        term: 'Meshech and Tubal',
        text: 'Ancient Anatolian peoples (Mushki and Tabal) — the region of modern Turkey.',
        ref: 'Ezekiel 38:2',
      },
      {
        term: 'Persia',
        text: 'Modern Iran, which was called Persia until it was renamed in 1935.',
        ref: 'Ezekiel 38:5',
      },
      {
        term: 'Cush',
        text: 'The Upper Nile region — modern Sudan, and parts of Ethiopia.',
        ref: 'Ezekiel 38:5',
      },
      {
        term: 'Put (Phut)',
        text: 'North Africa west of Egypt — modern Libya.',
        ref: 'Ezekiel 38:5',
      },
      {
        term: 'Gomer',
        text:
          'The ancient Cimmerians of Asia Minor — often identified with modern Turkey and parts ' +
          'of Eastern Europe.',
        ref: 'Ezekiel 38:6',
      },
      {
        term: 'Beth-togarmah',
        text: 'The “house of Togarmah” from the far north — modern Armenia and eastern Turkey (the Caucasus).',
        ref: 'Ezekiel 38:6',
      },
    ],
    note:
      'These modern identifications are the common view among many Bible teachers, drawn from ' +
      'where these ancient peoples once lived; the details are debated, and the timing and ' +
      'fulfillment belong to God. The prophecy’s aim is not fear but assurance: “I will magnify ' +
      'myself and sanctify myself… and they will know that I am the LORD.” (Ezekiel 38:23)',
  },
  {
    id: 'gog-aftermath',
    title: 'The Aftermath of the War',
    reference: 'Ezekiel 39',
    overview:
      'After Gog falls on the mountains of Israel, Ezekiel 39 describes the aftermath — the ' +
      'cleansing of the land, the vindication of God’s holy name, and the full restoration of ' +
      'His people. The chapter moves from battlefield to blessing.',
    intro:
      '“I will make my holy name known among my people Israel… and the nations will know that I am the LORD, the Holy One in Israel.” — Ezekiel 39:7',
    items: [
      {
        text: 'God turns Gog back and strikes the weapons from his hand; he falls on the mountains of Israel.',
        ref: 'Ezekiel 39:2–4',
      },
      {
        text: 'The slain are given to the birds and wild beasts — a great sacrificial feast.',
        ref: 'Ezekiel 39:4, 17–20',
      },
      {
        text: 'Israel burns the weapons of war for seven years, needing no other fuel.',
        ref: 'Ezekiel 39:9–10',
      },
      {
        text: 'For seven months they bury the dead to cleanse the land — a valley named Hamon-Gog, “the multitude of Gog.”',
        ref: 'Ezekiel 39:11–16',
      },
      {
        text: 'God’s holy name is made known, no longer to be profaned among His people or the nations.',
        ref: 'Ezekiel 39:7, 21–24',
      },
      {
        text: 'The LORD restores Jacob, gathers His people home, and pours out His Spirit upon them.',
        ref: 'Ezekiel 39:25–29',
      },
    ],
    note:
      'The seven years’ fuel and seven months’ burial picture the totality of God’s victory; the ' +
      'chapter ends not in carnage but in covenant — “I will pour out my Spirit on the house of Israel.”',
  },
  {
    id: 'gog-magog-revelation',
    title: 'Gog and Magog in Revelation',
    reference: 'Revelation 20:7–9',
    overview:
      'The names Gog and Magog return at the very end of the age. After the thousand years, Satan ' +
      'is released and gathers the nations — “Gog and Magog” — from the four corners of the earth ' +
      'for one last assault on God’s people, only to be devoured by fire from heaven.',
    intro:
      '“…to deceive the nations… Gog and Magog, to gather them together to the war…” — Revelation 20:8',
    layout: 'mapping',
    items: [
      {
        term: 'In Ezekiel 38–39',
        text:
          'A coalition of named nations invades a regathered, peaceful Israel in the latter years; ' +
          'God destroys them on the mountains of Israel, then restores His people and pours out His Spirit.',
        ref: 'Ezekiel 38–39',
      },
      {
        term: 'In Revelation 20:7–9',
        text:
          'After the thousand-year reign, Satan is loosed and deceives the nations of the whole ' +
          'earth (“Gog and Magog”) for a final revolt; fire comes down from heaven and consumes ' +
          'them, and the last judgment follows.',
        ref: 'Revelation 20:7–9',
      },
      {
        term: 'How they relate',
        text:
          'Same names, same theme — the nations’ futile rage against God, ending in His decisive ' +
          'victory. Many teachers hold them to be two distinct events separated by the millennium ' +
          '(Ezekiel’s named coalition earlier, Revelation’s global uprising at the very end); ' +
          'others read them as one symbolic picture.',
      },
    ],
    note:
      'Whether one war or two, the message is settled: no gathering of the nations can stand ' +
      'against the Lord — “they will know that I am the LORD.”',
  },
]
