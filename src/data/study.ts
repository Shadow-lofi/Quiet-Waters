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
]
