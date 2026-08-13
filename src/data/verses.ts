// Contemplative Scripture for meditation. Each verse carries a short breath
// prayer split into an inhale phrase and an exhale phrase, so the breathing
// guide can gently pace the words. Translations kept close to public-domain
// wordings (WEB/KJV-family) to stay copyright-clean.

export interface MeditationVerse {
  ref: string
  text: string
  breathIn: string
  breathOut: string
}

// The YHWH breath prayer — not a Scripture in the rotation, but a contemplative
// practice: the name of God breathed. Inhale "Yah" (יה), exhale "weh" (וה). Kept
// out of VERSES so it never appears as a "dwell on this" verse; the guided
// sitting "The Breath of God" resolves it via verseByRef.
export const YAHWEH_BREATH: MeditationVerse = {
  ref: 'The Breath of God',
  text: 'Let everything that has breath praise the LORD.',
  breathIn: 'Yah',
  breathOut: 'weh',
}

/** Look up a verse by its reference (falls back to the first if not found). */
export function verseByRef(ref: string): MeditationVerse {
  if (ref === YAHWEH_BREATH.ref) return YAHWEH_BREATH
  return VERSES.find((v) => v.ref === ref) ?? VERSES[0]
}

export const VERSES: MeditationVerse[] = [
  {
    ref: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
    breathIn: 'Be still and know',
    breathOut: 'that You are God',
  },
  {
    ref: 'Psalm 23:2',
    text: 'He makes me lie down in green pastures. He leads me beside still waters.',
    breathIn: 'You lead me',
    breathOut: 'beside still waters',
  },
  {
    ref: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
    breathIn: 'I come to You',
    breathOut: 'and You give me rest',
  },
  {
    ref: 'Psalm 62:1',
    text: 'My soul rests in God alone. My salvation is from him.',
    breathIn: 'For God alone',
    breathOut: 'my soul waits in silence',
  },
  {
    ref: 'Isaiah 26:3',
    text: 'You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.',
    breathIn: 'You keep me',
    breathOut: 'in perfect peace',
  },
  {
    ref: 'John 15:4',
    text: 'Remain in me, and I in you. As the branch can’t bear fruit by itself, neither can you, unless you remain in me.',
    breathIn: 'I abide in You',
    breathOut: 'and You in me',
  },
  {
    ref: 'Psalm 131:2',
    text: 'Surely I have stilled and quieted my soul, like a weaned child with his mother.',
    breathIn: 'I have calmed',
    breathOut: 'and quieted my soul',
  },
  {
    ref: 'Zephaniah 3:17',
    text: 'The LORD your God is among you, a mighty one who will save. He will rejoice over you with singing.',
    breathIn: 'You are with me',
    breathOut: 'You rejoice over me',
  },
  {
    ref: 'Psalm 37:7',
    text: 'Rest in the LORD, and wait patiently for him.',
    breathIn: 'I rest in You',
    breathOut: 'and wait patiently',
  },
  {
    ref: 'Philippians 4:6-7',
    text: 'In nothing be anxious, and the peace of God will guard your hearts and minds in Christ Jesus.',
    breathIn: 'I release my care',
    breathOut: 'and receive Your peace',
  },
  {
    ref: 'Psalm 46:1',
    text: 'God is our refuge and strength, a very present help in trouble.',
    breathIn: 'You are my refuge',
    breathOut: 'my present help',
  },
  {
    ref: 'Mark 6:31',
    text: 'Come away by yourselves into a deserted place, and rest a while.',
    breathIn: 'I come away',
    breathOut: 'to rest a while',
  },
  {
    ref: 'Psalm 143:8',
    text: 'Cause me to hear your loving kindness in the morning, for I trust in you.',
    breathIn: 'Let me hear',
    breathOut: 'Your steadfast love',
  },
  {
    ref: 'Lamentations 3:22-23',
    text: 'His mercies never fail. They are new every morning; great is your faithfulness.',
    breathIn: 'New every morning',
    breathOut: 'is Your faithfulness',
  },
  {
    ref: 'Psalm 27:4',
    text: 'One thing I have asked: to dwell in the house of the LORD, to behold his beauty.',
    breathIn: 'One thing I ask',
    breathOut: 'to dwell with You',
  },
  {
    ref: 'John 14:27',
    text: 'Peace I leave with you. My peace I give to you. Don’t let your heart be troubled.',
    breathIn: 'Your peace',
    breathOut: 'You give to me',
  },
  {
    ref: 'Psalm 63:1',
    text: 'God, you are my God. I will earnestly seek you. My soul thirsts for you.',
    breathIn: 'My soul thirsts',
    breathOut: 'for You, my God',
  },
  {
    ref: 'Matthew 6:6',
    text: 'Enter into your inner room, and having shut your door, pray to your Father who is in secret.',
    breathIn: 'In the quiet',
    breathOut: 'I meet with You',
  },
]
