// Study material — Scripture to sit with and return to. Public-domain wording
// (World English Bible), matching the app's use of the divine Name (see the
// "pray the Name" breath in data/verses.ts). Add more pieces to the array over
// time; the Study page renders each one.

export interface StudyItem {
  text: string
  ref?: string // per-line reference (numbered pieces); omitted for flowing prayers
}

export interface StudyPiece {
  id: string
  title: string
  reference: string
  intro?: string
  // 'numbered' → an ordered list with a circle + per-line ref (default);
  // 'lines' → flowing serif lines, read as one prayer.
  layout?: 'numbered' | 'lines'
  items: StudyItem[]
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
]
