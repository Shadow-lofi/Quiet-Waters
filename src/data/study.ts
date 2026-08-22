// Study material — Scripture to sit with and return to. Public-domain wording
// (World English Bible), matching the app's use of the divine Name (see the
// "pray the Name" breath in data/verses.ts). Add more pieces to the array over
// time; the Study page renders each one.

export interface StudyItem {
  text: string
  ref: string
}

export interface StudyPiece {
  id: string
  title: string
  reference: string
  intro?: string
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
]
