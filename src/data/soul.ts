// "How is your soul today?" — a small set of honest states, each met with a
// fitting word of Scripture (World English Bible, public domain) and a gentle
// pastoral line. Tapping one records a private check-in and offers the response.

export interface SoulState {
  id: string
  label: string
  verseRef: string
  verseText: string
  word: string
}

export const SOUL_STATES: SoulState[] = [
  {
    id: 'weary',
    label: 'Weary',
    verseRef: 'Matthew 11:28',
    verseText: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
    word: 'Lay it down. His rest is real, and it is for you.',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    verseRef: '1 Peter 5:7',
    verseText: 'Cast all your worries on him, because he cares for you.',
    word: 'You don’t carry it alone. Hand Him the weight, breath by breath.',
  },
  {
    id: 'afraid',
    label: 'Afraid',
    verseRef: 'Isaiah 41:10',
    verseText: 'Don’t be afraid, for I am with you. Don’t be dismayed, for I am your God.',
    word: 'Fear is loud, but He is near. You are held.',
  },
  {
    id: 'sorrowful',
    label: 'Sorrowful',
    verseRef: 'Psalm 34:18',
    verseText: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.',
    word: 'He is nearest now. Your tears are not unseen.',
  },
  {
    id: 'restless',
    label: 'Restless',
    verseRef: 'Psalm 46:10',
    verseText: 'Be still, and know that I am God.',
    word: 'Stop striving. Be still, and let Him be God.',
  },
  {
    id: 'empty',
    label: 'Empty',
    verseRef: 'Psalm 63:1',
    verseText: 'God, you are my God. I will earnestly seek you. My soul thirsts for you in a dry and weary land.',
    word: 'Bring the emptiness to Him. He fills the thirsty.',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    verseRef: 'Psalm 103:2',
    verseText: 'Praise Yahweh, my soul, and don’t forget all his benefits.',
    word: 'Let thanks rise. Name the gifts, one by one.',
  },
  {
    id: 'joyful',
    label: 'Joyful',
    verseRef: 'Psalm 16:11',
    verseText: 'In your presence is fullness of joy. In your right hand there are pleasures forever more.',
    word: 'Savor it. This gladness is a gift from His hand.',
  },
]

export function soulById(id: string): SoulState | undefined {
  return SOUL_STATES.find((s) => s.id === id)
}
