// Content for Lectio Divina ("divine reading") — an ancient, unhurried way of
// praying the Scriptures in four movements. Passages are short and public-domain
// (World English Bible), matching the app's reading style and divine-name usage.

export interface LectioPassage {
  ref: string
  text: string
}

export interface LectioMovement {
  latin: string
  title: string
  prompt: string
}

// The four classic movements, in order.
export const LECTIO_MOVEMENTS: LectioMovement[] = [
  {
    latin: 'Lectio',
    title: 'Read',
    prompt:
      'Read the words slowly — aloud if you can — twice over. Let them settle. There is no hurry here.',
  },
  {
    latin: 'Meditatio',
    title: 'Reflect',
    prompt:
      'Which word or phrase reaches out to you? Gently repeat it, and dwell there. Why this one, today?',
  },
  {
    latin: 'Oratio',
    title: 'Pray',
    prompt:
      'Speak to God about what has stirred — a thanks, a longing, a confession, a quiet yes. Let it become prayer.',
  },
  {
    latin: 'Contemplatio',
    title: 'Rest',
    prompt:
      'Now let even the words fall away. Simply rest in God’s presence — held, unhurried, at home.',
  },
]

// A small, curated set of short passages that read well slowly.
export const LECTIO_PASSAGES: LectioPassage[] = [
  {
    ref: 'Psalm 23:1–3',
    text: 'Yahweh is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
  },
  {
    ref: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
  },
  {
    ref: 'Matthew 11:28–29',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and lowly in heart; and you will find rest for your souls.',
  },
  {
    ref: 'John 15:4–5',
    text: 'Remain in me, and I in you. I am the vine. You are the branches. He who remains in me and I in him bears much fruit, for apart from me you can do nothing.',
  },
  {
    ref: 'Philippians 4:6–7',
    text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
  },
  {
    ref: 'Isaiah 40:31',
    text: 'But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
  },
  {
    ref: 'Lamentations 3:22–23',
    text: 'It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning; great is your faithfulness.',
  },
  {
    ref: 'Zephaniah 3:17',
    text: 'Yahweh your God is among you, a mighty one who will save. He will rejoice over you with joy. He will calm you in his love. He will rejoice over you with singing.',
  },
  {
    ref: 'Psalm 62:1',
    text: 'My soul rests in God alone. My salvation is from him.',
  },
  {
    ref: 'Psalm 27:4',
    text: 'One thing I have asked of Yahweh, that I will seek after: that I may dwell in the house of Yahweh all the days of my life, to see Yahweh’s beauty, and to inquire in his temple.',
  },
]
