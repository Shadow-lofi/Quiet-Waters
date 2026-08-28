import type { BreathPace } from '../lib/types'

// A gentle prompt that fades in at a given time during a guided sitting.
export interface GuidedStep {
  at: number // seconds from the start
  text: string
}

export interface GuidedSession {
  id: string
  title: string
  subtitle: string
  icon: 'still' | 'sunrise' | 'breath' | 'rest' | 'wait' | 'evening'
  durationMin: number
  verseRef: string // must match a ref in VERSES (drives the breath-prayer words)
  pace: BreathPace
  steps: GuidedStep[]
  nameBreath?: boolean // show the YHWH "name of God" breathing visual
}

// Ready-made sittings that bundle a length, a Scripture, a breath pace, and a
// sequence of soft prompts. All the verses referenced here exist in VERSES, so
// the breathing guide shows the matching inhale/exhale words.
export const GUIDED_SESSIONS: GuidedSession[] = [
  {
    id: 'be-still',
    title: 'Be Still',
    subtitle: 'A short centering pause',
    icon: 'still',
    durationMin: 3,
    verseRef: 'Psalm 46:10',
    pace: 'gentle',
    steps: [
      { at: 0, text: 'Settle in. Let your shoulders soften and your eyes gently close.' },
      { at: 20, text: 'Follow the circle — breathe in, and out. There is no hurry.' },
      { at: 45, text: '“Be still, and know that I am God.” — Psalm 46:10' },
      { at: 90, text: 'Carry the words on your breath. In: be still and know. Out: that You are God.' },
      { at: 140, text: 'When your thoughts wander, gently return. He is here.' },
    ],
  },
  {
    id: 'morning-stillness',
    title: 'Morning Stillness',
    subtitle: 'Begin the day with God',
    icon: 'sunrise',
    durationMin: 5,
    verseRef: 'Psalm 143:8',
    pace: 'gentle',
    steps: [
      { at: 0, text: 'Good morning. Before the day begins, come and rest a moment.' },
      { at: 25, text: 'Let the breath slow. There is nothing yet to hurry toward.' },
      { at: 60, text: '“Cause me to hear your loving kindness in the morning.” — Psalm 143:8' },
      { at: 120, text: 'Breathe it in: let me hear. And out: Your steadfast love.' },
      { at: 210, text: 'Offer the day to Him — its work, its people, its unknowns.' },
      { at: 270, text: 'Carry this stillness with you as you rise.' },
    ],
  },
  {
    id: 'breath-prayer',
    title: 'Breath Prayer',
    subtitle: 'One line on the breath',
    icon: 'breath',
    durationMin: 8,
    verseRef: 'Isaiah 26:3',
    pace: 'calm',
    steps: [
      { at: 0, text: 'Find your seat. Let the body be still and the breath come easy.' },
      { at: 30, text: 'We will pray a single line, carried gently on the breath.' },
      { at: 60, text: '“You keep him in perfect peace whose mind is stayed on You.” — Isaiah 26:3' },
      { at: 120, text: 'In: You keep me. Out: in perfect peace.' },
      { at: 240, text: 'Let the words grow slower than your thoughts.' },
      { at: 360, text: 'If you lose the line, simply begin again. Grace is patient.' },
      { at: 440, text: 'Rest here a little longer.' },
    ],
  },
  {
    id: 'breath-of-god',
    title: 'The Breath of God',
    subtitle: 'Pray the Name on your breath',
    icon: 'breath',
    durationMin: 6,
    verseRef: 'The Breath of God',
    pace: 'gentle',
    nameBreath: true,
    steps: [
      { at: 0, text: 'Settle in, and let your breath find its own slow rhythm.' },
      { at: 25, text: 'The name of God — YHWH — is the sound of a breath.' },
      { at: 55, text: 'Breathe it in: Yah. Breathe it out: weh.' },
      { at: 95, text: 'Without a single word, you are speaking His name.' },
      { at: 160, text: 'Your first breath and your last both carry it — and so does this one.' },
      { at: 240, text: 'When your mind wanders, return to the breath. He is nearer than it.' },
      { at: 320, text: 'Rest here. Simply be, and breathe His name.' },
    ],
  },
  {
    id: 'come-and-rest',
    title: 'Come & Rest',
    subtitle: 'Lay down the day’s weight',
    icon: 'rest',
    durationMin: 10,
    verseRef: 'Matthew 11:28',
    pace: 'deep',
    steps: [
      { at: 0, text: 'Lay down what you have carried today. You can pick it up later — or not at all.' },
      { at: 40, text: 'Let each breath out be a small letting-go.' },
      { at: 100, text: '“Come to me, all you who labor, and I will give you rest.” — Matthew 11:28' },
      { at: 200, text: 'In: I come to You. Out: and You give me rest.' },
      { at: 380, text: 'Notice where you are tense, and release it into His hands.' },
      { at: 540, text: 'You are not holding the world together. He is.' },
    ],
  },
  {
    id: 'waiting-on-god',
    title: 'Waiting on God',
    subtitle: 'Rest in unhurried silence',
    icon: 'wait',
    durationMin: 12,
    verseRef: 'Psalm 62:1',
    pace: 'calm',
    steps: [
      { at: 0, text: 'Come into the quiet. There is nothing to produce here — only to wait.' },
      { at: 45, text: 'Let the silence feel full, not empty.' },
      { at: 120, text: '“For God alone my soul waits in silence.” — Psalm 62:1' },
      { at: 260, text: 'In: for God alone. Out: my soul waits in silence.' },
      { at: 440, text: 'Waiting is not wasted. It is trust, slowed down.' },
      { at: 620, text: 'Stay. He is worth waiting for.' },
      { at: 690, text: 'Gently begin to return.' },
    ],
  },
  {
    id: 'evening-rest',
    title: 'Evening Rest',
    subtitle: 'Close the day and sleep in peace',
    icon: 'evening',
    durationMin: 7,
    verseRef: 'Psalm 4:8',
    pace: 'deep',
    steps: [
      { at: 0, text: 'The day is nearly done. Let it be enough. Come and lay it down.' },
      { at: 35, text: 'Let each breath out set something down — a worry, a word, a weight.' },
      { at: 90, text: '“In peace I will lie down and sleep, for You alone keep me safe.” — Psalm 4:8' },
      { at: 160, text: 'In: in peace I lie down. Out: for You keep me safe.' },
      { at: 260, text: 'Whatever is left unfinished, entrust it to Him through the night.' },
      { at: 350, text: 'You can rest, because He never sleeps. Be still, and be kept.' },
      { at: 400, text: 'Stay as long as you like — and carry this peace into sleep.' },
    ],
  },
]
