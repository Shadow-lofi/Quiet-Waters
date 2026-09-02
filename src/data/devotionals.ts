// Devotional series — unhurried, multi-day paths through Scripture. Each day
// moves gently: a verse to dwell on, a short reflection, an optional pause to be
// still with the words, and a written prayer you can carry into your journal.
// Verses kept close to public-domain (World English Bible) to stay copyright-
// clean and match the rest of the app. Grace-filled: no streaks, no pressure —
// return when you can, and pick up where you left off.

export interface DevotionalDay {
  title: string
  verseRef: string
  verseText: string
  reflection: string
  prayer: string // a written prayer to pray — and to carry into the journal
  breathIn: string // anchor words for the optional "Sit with this" pause
  breathOut: string
  sitMinutes?: number // suggested length for that pause (default 5)
}

export interface DevotionalSeries {
  id: string
  title: string
  subtitle: string
  verseRef: string // a hero verse for the series card
  verseText: string
  soul?: string[] // SoulState ids this series gently suits (see data/soul.ts)
  days: DevotionalDay[]
}

export const DEVOTIONAL_SERIES: DevotionalSeries[] = [
  {
    id: 'be-still',
    title: 'Be Still',
    subtitle: 'Five days of coming to rest in God',
    verseRef: 'Psalm 46:10',
    verseText: 'Be still, and know that I am God.',
    soul: ['weary', 'restless', 'empty'],
    days: [
      {
        title: 'Come and Rest',
        verseRef: 'Matthew 11:28',
        verseText: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
        reflection:
          'Rest is not something you achieve — it is Someone you come to. Before you do anything today, notice the weight you are carrying, and hear the invitation: come. He does not ask you to arrive strong; He asks you to arrive.',
        prayer: 'Lord, I come to You as I am — tired, and carrying more than I can hold. Give me Your rest.',
        breathIn: 'I come to You',
        breathOut: 'and You give me rest',
        sitMinutes: 5,
      },
      {
        title: 'Be Still',
        verseRef: 'Psalm 46:10',
        verseText: 'Be still, and know that I am God.',
        reflection:
          'Stillness is not emptiness; it is making room. When the striving quiets, there is space to know — not just to know about God, but to know Him. Let your hands unclench for a few minutes and simply be with the One who is God.',
        prayer: 'Father, quiet the noise in me. In the stillness, let me know that You are God, and I am Yours.',
        breathIn: 'Be still and know',
        breathOut: 'that You are God',
        sitMinutes: 5,
      },
      {
        title: 'Beside Still Waters',
        verseRef: 'Psalm 23:2–3',
        verseText: 'He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
        reflection:
          'The Shepherd does not drive His sheep; He leads them, and He leads them to rest. If your soul feels frayed, notice that restoration is His work, not yours. You are led — you need only follow to the quiet water.',
        prayer: 'Good Shepherd, lead me beside still waters today. Restore my soul; I trust Your leading.',
        breathIn: 'He leads me',
        breathOut: 'and restores my soul',
        sitMinutes: 6,
      },
      {
        title: 'Cast Your Cares',
        verseRef: '1 Peter 5:7',
        verseText: 'Cast all your worries on him, because he cares for you.',
        reflection:
          'Casting is deliberate — a letting go, a handing over. You were never meant to carry the weight alone, and the One who catches it is not indifferent. He cares for you. Name one care today, and place it in His hands.',
        prayer: 'Lord, here is what I have been carrying. I cast it on You, because You care for me.',
        breathIn: 'I cast my cares',
        breathOut: 'for You care for me',
        sitMinutes: 5,
      },
      {
        title: 'Perfect Peace',
        verseRef: 'Isaiah 26:3',
        verseText: 'You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.',
        reflection:
          'Peace is not the absence of trouble but the presence of trust. A mind that keeps returning to God — steadfast, stayed on Him — is kept. When your thoughts scatter today, gently bring them home, and let trust settle you.',
        prayer: 'Keep my mind stayed on You, Lord. In the middle of everything, hold me in Your perfect peace.',
        breathIn: 'My mind stayed on You',
        breathOut: 'in perfect peace',
        sitMinutes: 6,
      },
    ],
  },
  {
    id: 'peace-over-anxiety',
    title: 'Peace Over Anxiety',
    subtitle: 'Five days of trading worry for trust',
    verseRef: 'Philippians 4:6–7',
    verseText:
      'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
    soul: ['anxious', 'afraid', 'restless'],
    days: [
      {
        title: 'Everything to God',
        verseRef: 'Philippians 4:6–7',
        verseText:
          'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God; and the peace of God will guard your hearts.',
        reflection:
          'Paul does not simply say “stop worrying” — he tells you where to put the worry. Turn each anxious thought into a specific prayer, wrapped in thanks, and a peace that outreasons your fear will stand guard over your heart.',
        prayer: 'Father, I bring You what I have been turning over in my mind. Trade my worry for Your peace.',
        breathIn: 'I bring it all to You',
        breathOut: 'and You guard my heart',
        sitMinutes: 5,
      },
      {
        title: 'One Day at a Time',
        verseRef: 'Matthew 6:34',
        verseText: 'Therefore don’t be anxious for tomorrow, for tomorrow will be anxious for itself.',
        reflection:
          'Most anxiety lives in a future that has not come. Jesus calls you back to today, where His grace already waits. You will be given what you need when you need it — not a moment before, and not a moment too late.',
        prayer: 'Jesus, keep me in today. I leave tomorrow in Your hands, where it has always been.',
        breathIn: 'Keep me in today',
        breathOut: 'tomorrow is Yours',
        sitMinutes: 5,
      },
      {
        title: 'When the Cares Are Many',
        verseRef: 'Psalm 94:19',
        verseText: 'In the multitude of my thoughts within me, your comforts delight my soul.',
        reflection:
          'Some seasons the worries pile high. This verse does not deny the many thoughts — it meets them with a greater comfort. Let His consolation reach you not after the pile is cleared, but right in the middle of it.',
        prayer: 'God, when my thoughts are many and loud, let Your comfort be nearer still, and delight my soul.',
        breathIn: 'When my cares are many',
        breathOut: 'Your comfort is greater',
        sitMinutes: 6,
      },
      {
        title: 'Fear Not, I Am With You',
        verseRef: 'Isaiah 41:10',
        verseText:
          'Don’t be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you.',
        reflection:
          'The cure for fear is not a change in your circumstances but a Person: “I am with you.” You are not holding yourself together by will. He steadies you, strengthens you, upholds you with His own hand.',
        prayer: 'Lord, still my fear with Your nearness. Strengthen me, help me, hold me up today.',
        breathIn: 'I will not fear',
        breathOut: 'for You are with me',
        sitMinutes: 5,
      },
      {
        title: 'A Quieted Soul',
        verseRef: 'Psalm 131:2',
        verseText: 'Surely I have stilled and quieted my soul, like a weaned child with his mother.',
        reflection:
          'A weaned child no longer frets for what it once needed — it simply rests, content to be held. God invites your restless soul into that same trust: not striving, not demanding, just resting in the nearness of the One who holds you.',
        prayer: 'Father, I stop striving. Like a child in its mother’s arms, let my soul be quiet and content in You.',
        breathIn: 'I still and quiet my soul',
        breathOut: 'content to be held',
        sitMinutes: 6,
      },
    ],
  },
  {
    id: 'waiting-on-god',
    title: 'Waiting on God',
    subtitle: 'Five days of learning to wait with hope',
    verseRef: 'Psalm 27:14',
    verseText: 'Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD.',
    soul: ['weary', 'sorrowful', 'empty'],
    days: [
      {
        title: 'Wait for the Lord',
        verseRef: 'Psalm 27:14',
        verseText: 'Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD.',
        reflection:
          'Waiting is not passive; it is a kind of courage. The psalm says it twice, as if to steady you: wait, and wait again. In the delay, God is not absent — He is at work in ways you cannot yet see.',
        prayer: 'Lord, give my heart courage to wait for You. I trust that You are working, even now.',
        breathIn: 'I wait for You',
        breathOut: 'and take courage',
        sitMinutes: 5,
      },
      {
        title: 'Renewed Strength',
        verseRef: 'Isaiah 40:31',
        verseText:
          'But those who wait for the LORD will renew their strength. They will mount up with wings like eagles.',
        reflection:
          'The world says strength comes from pushing harder. Isaiah says it comes from waiting — from depending on God rather than yourself. What feels like a delay may be the very place your strength is being renewed.',
        prayer: 'Lord, I stop striving in my own strength. As I wait on You, renew me from the inside out.',
        breathIn: 'As I wait on You',
        breathOut: 'You renew my strength',
        sitMinutes: 6,
      },
      {
        title: 'My Soul Waits in Silence',
        verseRef: 'Psalm 62:1',
        verseText: 'My soul rests in God alone. My salvation comes from him.',
        reflection:
          'There is a rest that comes only from God — not from an answer, not from a change, but from Him alone. Before you ask Him for anything today, let your soul simply be silent before Him, and rest in who He is.',
        prayer: 'God, my soul waits for You in silence. You alone are my rest; You alone are my salvation.',
        breathIn: 'My soul waits',
        breathOut: 'for God alone',
        sitMinutes: 6,
      },
      {
        title: 'In Returning and Rest',
        verseRef: 'Isaiah 30:15',
        verseText:
          'In returning and rest you will be saved. In quietness and in confidence will be your strength.',
        reflection:
          'When you are anxious to fix or force things, God offers a different way: return, and rest. Quietness and confidence are not weakness — they are where your true strength is found, because they lean the whole weight on Him.',
        prayer: 'Lord, I return to You and rest. In quietness and trust, be my strength today.',
        breathIn: 'In returning and rest',
        breathOut: 'is my strength',
        sitMinutes: 5,
      },
      {
        title: 'Hope Does Not Disappoint',
        verseRef: 'Romans 5:5',
        verseText:
          'Hope doesn’t disappoint us, because God’s love has been poured out into our hearts through the Holy Spirit.',
        reflection:
          'Waiting can wear hope thin. But this hope is not wishful thinking — it rests on a love already poured into you, not a promise still owed. The One you wait for has already given Himself. That is why hope holds.',
        prayer: 'Father, thank You that Your love is already poured into me. Let that love keep my hope alive as I wait.',
        breathIn: 'Your love is poured in me',
        breathOut: 'and hope will hold',
        sitMinutes: 6,
      },
    ],
  },
]

// ── lookups + progress helpers (pure) ──────────────────────────────

/** A series by id. */
export function seriesById(id: string): DevotionalSeries | undefined {
  return DEVOTIONAL_SERIES.find((s) => s.id === id)
}

/** The first day index not yet completed (or the length, if all are done). */
export function nextIncompleteDay(total: number, done: number[]): number {
  for (let i = 0; i < total; i++) if (!done.includes(i)) return i
  return total
}

/** Is every day of a series of this length completed? */
export function isSeriesComplete(total: number, done: number[]): boolean {
  return nextIncompleteDay(total, done) >= total
}

/** How many distinct, in-range days are completed. */
export function completedCount(total: number, done: number[]): number {
  return new Set(done.filter((d) => d >= 0 && d < total)).size
}
