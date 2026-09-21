// Daily Hymn — a beloved hymn of the church to dwell on and pray, a new one
// each day. Every text here is in the public domain (all authors and translators
// long predate modern copyright), matching the app's copyright-clean, reverent
// posture. These are meant less to be performed than to be read slowly — words
// the saints have sung for centuries, offered as a quiet act of worship.

export interface Hymn {
  id: string
  title: string
  author: string // author (and translator, where relevant) + year, on one line
  theme: string // a one-line invitation — the heart of it, or where to rest
  scripture?: string // a Scripture the hymn flows from, shown as a small anchor
  stanzas: string[][] // each stanza is its lines, in order
  refrain?: string[] // an optional refrain, sung after each stanza
}

export const HYMNS: Hymn[] = [
  {
    id: 'be-thou-my-vision',
    title: 'Be Thou My Vision',
    author: 'Ancient Irish; tr. Mary E. Byrne & Eleanor H. Hull, 1905/1912',
    theme: 'A prayer to see everything by the light of God, and to want Him above all.',
    scripture: 'Psalm 27:4',
    stanzas: [
      [
        'Be Thou my Vision, O Lord of my heart;',
        'Naught be all else to me, save that Thou art—',
        'Thou my best thought, by day or by night,',
        'Waking or sleeping, Thy presence my light.',
      ],
      [
        'Be Thou my Wisdom, and Thou my true Word;',
        'I ever with Thee and Thou with me, Lord;',
        'Thou my great Father, I Thy true son;',
        'Thou in me dwelling, and I with Thee one.',
      ],
      [
        'Riches I heed not, nor man’s empty praise,',
        'Thou mine inheritance, now and always:',
        'Thou and Thou only, first in my heart,',
        'High King of Heaven, my Treasure Thou art.',
      ],
      [
        'High King of Heaven, my victory won,',
        'May I reach Heaven’s joys, O bright Heaven’s Sun!',
        'Heart of my own heart, whatever befall,',
        'Still be my Vision, O Ruler of all.',
      ],
    ],
  },
  {
    id: 'dear-lord-and-father',
    title: 'Dear Lord and Father of Mankind',
    author: 'John Greenleaf Whittier, 1872',
    theme: 'The strain and stress laid down, until the soul hears the still, small voice of calm.',
    scripture: '1 Kings 19:12',
    stanzas: [
      [
        'Dear Lord and Father of mankind,',
        'Forgive our foolish ways;',
        'Reclothe us in our rightful mind,',
        'In purer lives Thy service find,',
        'In deeper reverence, praise.',
      ],
      [
        'In simple trust like theirs who heard,',
        'Beside the Syrian sea,',
        'The gracious calling of the Lord,',
        'Let us, like them, without a word,',
        'Rise up and follow Thee.',
      ],
      [
        'Drop Thy still dews of quietness,',
        'Till all our strivings cease;',
        'Take from our souls the strain and stress,',
        'And let our ordered lives confess',
        'The beauty of Thy peace.',
      ],
      [
        'Breathe through the heats of our desire',
        'Thy coolness and Thy balm;',
        'Let sense be dumb, let flesh retire;',
        'Speak through the earthquake, wind, and fire,',
        'O still, small voice of calm.',
      ],
    ],
  },
  {
    id: 'it-is-well',
    title: 'It Is Well with My Soul',
    author: 'Horatio G. Spafford, 1873',
    theme: 'Peace like a river, or sorrows like sea billows — and still, it is well.',
    scripture: '2 Kings 4:26',
    stanzas: [
      [
        'When peace, like a river, attendeth my way,',
        'When sorrows like sea billows roll;',
        'Whatever my lot, Thou hast taught me to say,',
        'It is well, it is well with my soul.',
      ],
      [
        'Though Satan should buffet, though trials should come,',
        'Let this blest assurance control,',
        'That Christ has regarded my helpless estate,',
        'And hath shed His own blood for my soul.',
      ],
      [
        'My sin—oh, the bliss of this glorious thought!—',
        'My sin, not in part but the whole,',
        'Is nailed to the cross, and I bear it no more,',
        'Praise the Lord, praise the Lord, O my soul!',
      ],
      [
        'And, Lord, haste the day when my faith shall be sight,',
        'The clouds be rolled back as a scroll;',
        'The trump shall resound, and the Lord shall descend,',
        'Even so, it is well with my soul.',
      ],
    ],
    refrain: ['It is well with my soul,', 'It is well, it is well with my soul.'],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    author: 'John Newton, 1779',
    theme: 'The wonder of being found — grace that has led us this far, and will lead us home.',
    scripture: '1 Chronicles 17:16–17',
    stanzas: [
      [
        'Amazing grace! how sweet the sound,',
        'That saved a wretch like me!',
        'I once was lost, but now am found,',
        'Was blind, but now I see.',
      ],
      [
        '’Twas grace that taught my heart to fear,',
        'And grace my fears relieved;',
        'How precious did that grace appear',
        'The hour I first believed!',
      ],
      [
        'Through many dangers, toils and snares,',
        'I have already come;',
        '’Tis grace hath brought me safe thus far,',
        'And grace will lead me home.',
      ],
      [
        'When we’ve been there ten thousand years,',
        'Bright shining as the sun,',
        'We’ve no less days to sing God’s praise',
        'Than when we’d first begun.',
      ],
    ],
  },
  {
    id: 'king-of-love',
    title: 'The King of Love My Shepherd Is',
    author: 'Henry W. Baker, 1868',
    theme: 'Psalm 23 set to song — a shepherd whose goodness never fails, leading us home.',
    scripture: 'Psalm 23',
    stanzas: [
      [
        'The King of love my Shepherd is,',
        'Whose goodness faileth never;',
        'I nothing lack if I am His,',
        'And He is mine forever.',
      ],
      [
        'Where streams of living water flow,',
        'My ransomed soul He leadeth,',
        'And where the verdant pastures grow,',
        'With food celestial feedeth.',
      ],
      [
        'Perverse and foolish oft I strayed,',
        'But yet in love He sought me,',
        'And on His shoulder gently laid,',
        'And home, rejoicing, brought me.',
      ],
      [
        'In death’s dark vale I fear no ill',
        'With Thee, dear Lord, beside me;',
        'Thy rod and staff my comfort still,',
        'Thy cross before to guide me.',
      ],
    ],
  },
  {
    id: 'abide-with-me',
    title: 'Abide with Me',
    author: 'Henry F. Lyte, 1847',
    theme: 'An evening prayer for the One who changes not to stay near through every passing hour.',
    scripture: 'Luke 24:29',
    stanzas: [
      [
        'Abide with me; fast falls the eventide;',
        'The darkness deepens; Lord, with me abide;',
        'When other helpers fail and comforts flee,',
        'Help of the helpless, O abide with me.',
      ],
      [
        'Swift to its close ebbs out life’s little day;',
        'Earth’s joys grow dim, its glories pass away;',
        'Change and decay in all around I see—',
        'O Thou who changest not, abide with me.',
      ],
      [
        'I need Thy presence every passing hour;',
        'What but Thy grace can foil the tempter’s power?',
        'Who like Thyself my guide and stay can be?',
        'Through cloud and sunshine, O abide with me.',
      ],
      [
        'Hold Thou Thy cross before my closing eyes;',
        'Shine through the gloom and point me to the skies;',
        'Heaven’s morning breaks, and earth’s vain shadows flee;',
        'In life, in death, O Lord, abide with me.',
      ],
    ],
  },
  {
    id: 'come-thou-fount',
    title: 'Come, Thou Fount of Every Blessing',
    author: 'Robert Robinson, 1758',
    theme: 'A wandering heart, sought and sealed by a mercy that never ceases.',
    scripture: '1 Samuel 7:12',
    stanzas: [
      [
        'Come, Thou Fount of every blessing,',
        'Tune my heart to sing Thy grace;',
        'Streams of mercy, never ceasing,',
        'Call for songs of loudest praise.',
        'Teach me some melodious sonnet,',
        'Sung by flaming tongues above;',
        'Praise the mount! I’m fixed upon it,',
        'Mount of Thy redeeming love.',
      ],
      [
        'Here I raise mine Ebenezer;',
        'Hither by Thy help I’m come;',
        'And I hope, by Thy good pleasure,',
        'Safely to arrive at home.',
        'Jesus sought me when a stranger,',
        'Wandering from the fold of God;',
        'He, to rescue me from danger,',
        'Interposed His precious blood.',
      ],
      [
        'O to grace how great a debtor',
        'Daily I’m constrained to be!',
        'Let Thy goodness, like a fetter,',
        'Bind my wandering heart to Thee:',
        'Prone to wander, Lord, I feel it,',
        'Prone to leave the God I love;',
        'Here’s my heart, O take and seal it,',
        'Seal it for Thy courts above.',
      ],
    ],
  },
  {
    id: 'holy-holy-holy',
    title: 'Holy, Holy, Holy',
    author: 'Reginald Heber, 1826',
    theme: 'The song of heaven, borrowed for the morning — the thrice-holy God adored.',
    scripture: 'Revelation 4:8',
    stanzas: [
      [
        'Holy, holy, holy! Lord God Almighty!',
        'Early in the morning our song shall rise to Thee;',
        'Holy, holy, holy! merciful and mighty!',
        'God in three Persons, blessed Trinity!',
      ],
      [
        'Holy, holy, holy! all the saints adore Thee,',
        'Casting down their golden crowns around the glassy sea;',
        'Cherubim and seraphim falling down before Thee,',
        'Which wert, and art, and evermore shalt be.',
      ],
      [
        'Holy, holy, holy! though the darkness hide Thee,',
        'Though the eye of sinful man Thy glory may not see,',
        'Only Thou art holy; there is none beside Thee,',
        'Perfect in power, in love, and purity.',
      ],
      [
        'Holy, holy, holy! Lord God Almighty!',
        'All Thy works shall praise Thy name, in earth, and sky, and sea;',
        'Holy, holy, holy! merciful and mighty!',
        'God in three Persons, blessed Trinity!',
      ],
    ],
  },
  {
    id: 'what-a-friend',
    title: 'What a Friend We Have in Jesus',
    author: 'Joseph M. Scriven, 1855',
    theme: 'Every care worth carrying to God in prayer — and a Friend who bears it all.',
    scripture: '1 Peter 5:7',
    stanzas: [
      [
        'What a Friend we have in Jesus,',
        'All our sins and griefs to bear!',
        'What a privilege to carry',
        'Everything to God in prayer!',
        'O what peace we often forfeit,',
        'O what needless pain we bear,',
        'All because we do not carry',
        'Everything to God in prayer!',
      ],
      [
        'Have we trials and temptations?',
        'Is there trouble anywhere?',
        'We should never be discouraged;',
        'Take it to the Lord in prayer.',
        'Can we find a friend so faithful,',
        'Who will all our sorrows share?',
        'Jesus knows our every weakness;',
        'Take it to the Lord in prayer.',
      ],
      [
        'Are we weak and heavy laden,',
        'Cumbered with a load of care?',
        'Precious Savior, still our refuge—',
        'Take it to the Lord in prayer.',
        'Do thy friends despise, forsake thee?',
        'Take it to the Lord in prayer!',
        'In His arms He’ll take and shield thee;',
        'Thou wilt find a solace there.',
      ],
    ],
  },
  {
    id: 'when-i-survey',
    title: 'When I Survey the Wondrous Cross',
    author: 'Isaac Watts, 1707',
    theme: 'Love so amazing, so divine, that it asks for everything — and gladly receives it.',
    scripture: 'Galatians 6:14',
    stanzas: [
      [
        'When I survey the wondrous cross',
        'On which the Prince of glory died,',
        'My richest gain I count but loss,',
        'And pour contempt on all my pride.',
      ],
      [
        'Forbid it, Lord, that I should boast,',
        'Save in the death of Christ my God!',
        'All the vain things that charm me most,',
        'I sacrifice them to His blood.',
      ],
      [
        'See from His head, His hands, His feet,',
        'Sorrow and love flow mingled down!',
        'Did e’er such love and sorrow meet,',
        'Or thorns compose so rich a crown?',
      ],
      [
        'Were the whole realm of nature mine,',
        'That were a present far too small;',
        'Love so amazing, so divine,',
        'Demands my soul, my life, my all.',
      ],
    ],
  },
  {
    id: 'rock-of-ages',
    title: 'Rock of Ages',
    author: 'Augustus M. Toplady, 1763',
    theme: 'Nothing in our hands to bring — only clinging to the cross, and hiding in the Rock.',
    scripture: 'Exodus 33:22',
    stanzas: [
      [
        'Rock of Ages, cleft for me,',
        'Let me hide myself in Thee;',
        'Let the water and the blood,',
        'From Thy wounded side which flowed,',
        'Be of sin the double cure,',
        'Save from wrath and make me pure.',
      ],
      [
        'Not the labors of my hands',
        'Can fulfill Thy law’s demands;',
        'Could my zeal no respite know,',
        'Could my tears forever flow,',
        'All for sin could not atone;',
        'Thou must save, and Thou alone.',
      ],
      [
        'Nothing in my hand I bring,',
        'Simply to Thy cross I cling;',
        'Naked, come to Thee for dress;',
        'Helpless, look to Thee for grace;',
        'Foul, I to the fountain fly;',
        'Wash me, Savior, or I die.',
      ],
      [
        'While I draw this fleeting breath,',
        'When mine eyes shall close in death,',
        'When I soar to worlds unknown,',
        'See Thee on Thy judgment throne,',
        'Rock of Ages, cleft for me,',
        'Let me hide myself in Thee.',
      ],
    ],
  },
  {
    id: 'o-god-our-help',
    title: 'O God, Our Help in Ages Past',
    author: 'Isaac Watts, 1719',
    theme: 'From everlasting to everlasting, the same — our shelter, our hope, our home.',
    scripture: 'Psalm 90:1–2',
    stanzas: [
      [
        'O God, our help in ages past,',
        'Our hope for years to come,',
        'Our shelter from the stormy blast,',
        'And our eternal home.',
      ],
      [
        'Under the shadow of Thy throne',
        'Thy saints have dwelt secure;',
        'Sufficient is Thine arm alone,',
        'And our defense is sure.',
      ],
      [
        'Before the hills in order stood,',
        'Or earth received her frame,',
        'From everlasting Thou art God,',
        'To endless years the same.',
      ],
      [
        'O God, our help in ages past,',
        'Our hope for years to come,',
        'Be Thou our guard while troubles last,',
        'And our eternal home.',
      ],
    ],
  },
  {
    id: 'praise-to-the-lord',
    title: 'Praise to the Lord, the Almighty',
    author: 'Joachim Neander, 1680; tr. Catherine Winkworth, 1863',
    theme: 'All that has life and breath, called to adore the King who so gently sustains us.',
    scripture: 'Psalm 103:1',
    stanzas: [
      [
        'Praise to the Lord, the Almighty, the King of creation!',
        'O my soul, praise Him, for He is thy health and salvation!',
        'All ye who hear, now to His temple draw near;',
        'Join me in glad adoration!',
      ],
      [
        'Praise to the Lord, who o’er all things so wondrously reigneth,',
        'Shelters thee under His wings, yea, so gently sustaineth!',
        'Hast thou not seen how thy desires e’er have been',
        'Granted in what He ordaineth?',
      ],
      [
        'Praise to the Lord, who doth prosper thy work and defend thee;',
        'Surely His goodness and mercy here daily attend thee.',
        'Ponder anew what the Almighty can do,',
        'If with His love He befriend thee.',
      ],
      [
        'Praise to the Lord! O let all that is in me adore Him!',
        'All that hath life and breath, come now with praises before Him!',
        'Let the Amen sound from His people again;',
        'Gladly for aye we adore Him.',
      ],
    ],
  },
  {
    id: 'blessed-assurance',
    title: 'Blessed Assurance',
    author: 'Fanny J. Crosby, 1873',
    theme: 'A foretaste of glory — resting, watching, and waiting, lost in His love.',
    scripture: 'Hebrews 10:22',
    stanzas: [
      [
        'Blessed assurance, Jesus is mine!',
        'O what a foretaste of glory divine!',
        'Heir of salvation, purchase of God,',
        'Born of His Spirit, washed in His blood.',
      ],
      [
        'Perfect submission, perfect delight,',
        'Visions of rapture now burst on my sight;',
        'Angels descending bring from above',
        'Echoes of mercy, whispers of love.',
      ],
      [
        'Perfect submission, all is at rest,',
        'I in my Savior am happy and blest;',
        'Watching and waiting, looking above,',
        'Filled with His goodness, lost in His love.',
      ],
    ],
    refrain: [
      'This is my story, this is my song,',
      'Praising my Savior all the day long;',
      'This is my story, this is my song,',
      'Praising my Savior all the day long.',
    ],
  },
]

// ── lookups + helpers (pure) ────────────────────────────────────────

/** A hymn by id. */
export function hymnById(id: string): Hymn | undefined {
  return HYMNS.find((h) => h.id === id)
}

/** The index of the day's hymn — steady through the day, but freely changed.
 *  A calendar-derived index so everyone sees the same hymn on a given day,
 *  advancing by one each day and cycling through the whole set. */
export function hymnOfDayIndex(d: Date = new Date()): number {
  return (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % HYMNS.length
}

/** The lines of a hymn in reading order — each stanza, with the refrain sung
 *  after the first stanza (as a hymnal prints it). Used for narration, so the
 *  spoken reading follows the same order the page shows. */
export function hymnReadingLines(hymn: Hymn): string[] {
  const lines: string[] = []
  hymn.stanzas.forEach((stanza, i) => {
    lines.push(...stanza)
    if (hymn.refrain && i === 0) lines.push(...hymn.refrain)
  })
  return lines
}
