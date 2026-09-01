// Verses to send as an encouragement — words of comfort, strength, and peace to
// pass to someone else. Public-domain (World English Bible), matching the app's
// reading style. Paired with a few short note presets to open the card.

export interface Encouragement {
  ref: string
  text: string
}

export const ENCOURAGEMENTS: Encouragement[] = [
  {
    ref: 'Numbers 6:24–26',
    text: 'Yahweh bless you, and keep you. Yahweh make his face to shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace.',
  },
  {
    ref: 'Isaiah 41:10',
    text: 'Don’t be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you.',
  },
  {
    ref: 'Joshua 1:9',
    text: 'Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.',
  },
  {
    ref: 'Zephaniah 3:17',
    text: 'Yahweh your God is among you, a mighty one who will save. He will rejoice over you with joy. He will calm you in his love. He will rejoice over you with singing.',
  },
  {
    ref: 'Psalm 34:18',
    text: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.',
  },
  {
    ref: 'Isaiah 40:31',
    text: 'Those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
  },
  {
    ref: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
  },
  {
    ref: 'Philippians 4:6–7',
    text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God will guard your hearts and minds in Christ Jesus.',
  },
  {
    ref: 'Psalm 121:1–2',
    text: 'I will lift up my eyes to the hills. Where does my help come from? My help comes from Yahweh, who made heaven and earth.',
  },
  {
    ref: 'Deuteronomy 31:6',
    text: 'Be strong and courageous. Don’t be afraid… for Yahweh your God himself is who goes with you. He will not fail you nor forsake you.',
  },
  {
    ref: 'Lamentations 3:22–23',
    text: 'It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning; great is your faithfulness.',
  },
  {
    ref: 'Isaiah 26:3',
    text: 'You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.',
  },
  {
    ref: 'Romans 8:38–39',
    text: 'For I am persuaded that neither death, nor life… nor any other created thing will be able to separate us from God’s love which is in Christ Jesus our Lord.',
  },
  {
    ref: 'Psalm 23:1',
    text: 'Yahweh is my shepherd; I shall lack nothing.',
  },
]

// Short openers to place above the verse on the card. The user can also write
// their own — these are just a gentle starting point.
export const ENCOURAGEMENT_NOTES: string[] = [
  'Thinking of you today.',
  'Praying for you.',
  'You are loved.',
  'God is with you.',
  'Grace and peace to you.',
]
