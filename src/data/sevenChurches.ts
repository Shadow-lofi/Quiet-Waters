// Content for the "Seven Churches" study — the letters of the risen Christ to the
// seven churches of Asia (Revelation 2–3), read for their modern spiritual
// meaning. The seven are held as seven mirrors: each a portrait of a condition
// alive in Christ's church, and in each of our hearts, in every age. Tone is
// reverent and self-examining — "He who has an ear, let him hear." Scripture is
// quoted from the public-domain World English Bible, in short essential excerpts.

export interface ChurchLetter {
  /** Ephesus, Smyrna, … */
  name: string
  /** One-line spiritual portrait shown as the card subtitle. */
  portrait: string
  /** Revelation 2:1–7, etc. */
  reference: string
  /** How the risen Christ presents Himself to this church. */
  christ: string
  christRef: string
  /** What He commends — some letters have none. */
  commend?: string
  /** The correction or warning — Smyrna and Philadelphia receive none. */
  correct?: string
  /** The promise to the one who overcomes. */
  promise: string
  promiseRef: string
  /** The modern spiritual meaning — the mirror this church holds up to us. */
  today: string
  /** A single verse to sit with. */
  keyVerse: { text: string; ref: string }
}

// The seven at a glance — how each church has long been read as a spiritual type.
export interface Glance {
  name: string
  type: string
}

export const GLANCE: Glance[] = [
  { name: 'Ephesus', type: 'The busy heart that left its first love' },
  { name: 'Smyrna', type: 'The suffering church — faithful under fire' },
  { name: 'Pergamum', type: 'The compromising church' },
  { name: 'Thyatira', type: 'The church that tolerated corruption' },
  { name: 'Sardis', type: 'A name for being alive, but dead' },
  { name: 'Philadelphia', type: 'The faithful church with an open door' },
  { name: 'Laodicea', type: 'The lukewarm, self-sufficient church' },
]

export const LETTERS: ChurchLetter[] = [
  {
    name: 'Ephesus',
    portrait: 'The church that left its first love',
    reference: 'Revelation 2:1–7',
    christ:
      'He who holds the seven stars in his right hand, and who walks among the seven golden lampstands.',
    christRef: 'Revelation 2:1',
    commend:
      'He knows their toil, their patient endurance, and that they cannot bear evildoers — they tested false apostles and found them liars, and have not grown weary for His name’s sake.',
    correct:
      '“But I have this against you, that you left your first love.” Sound and tireless, yet cold. The call: remember where you have fallen, repent, and do the first works again — or the lampstand is removed.',
    promise:
      'To the one who overcomes, He gives to eat from the tree of life, which is in the Paradise of God.',
    promiseRef: 'Revelation 2:7',
    today:
      'This is the mirror for the busy, orthodox, discerning believer whose love has quietly cooled into duty. Everything looks right — hard work, sound doctrine, a nose for error — but the warmth is gone. Christ does not ask for more activity; He asks for the first love back. Remember, repent, and return to the things you did at the beginning.',
    keyVerse: {
      text: 'But I have this against you, that you left your first love.',
      ref: 'Revelation 2:4',
    },
  },
  {
    name: 'Smyrna',
    portrait: 'The suffering church — faithful under fire',
    reference: 'Revelation 2:8–11',
    christ: 'The first and the last, who was dead, and has come to life.',
    christRef: 'Revelation 2:8',
    commend:
      'He knows their oppression and their poverty — “but you are rich” — and the slander they endure. To this church He speaks no word of correction, only comfort: “Don’t be afraid… Be faithful to death, and I will give you the crown of life.”',
    correct: undefined,
    promise:
      'The one who overcomes will not be hurt by the second death.',
    promiseRef: 'Revelation 2:11',
    today:
      'The persecuted, poor, pressed-down church — and the only one, with Philadelphia, that Christ never rebukes. He speaks as the One who Himself died and rose, so He knows the road. To saints under real suffering it says: you are richer than you feel, and the crown is sure. To a comfortable church it says: remember your family under fire, and count what actually makes you rich.',
    keyVerse: {
      text: 'Be faithful to death, and I will give you the crown of life.',
      ref: 'Revelation 2:10',
    },
  },
  {
    name: 'Pergamum',
    portrait: 'The compromising church',
    reference: 'Revelation 2:12–17',
    christ: 'He who has the sharp two-edged sword.',
    christRef: 'Revelation 2:12',
    commend:
      'They live “where Satan’s throne is,” yet hold fast His name and did not deny the faith — even when Antipas, His faithful witness, was killed among them.',
    correct:
      'Yet some hold the teaching of Balaam and of the Nicolaitans — letting the surrounding idolatry and immorality seep inside. “Repent therefore, or else I am coming to you quickly, and I will make war against them with the sword of my mouth.”',
    promise:
      'To the one who overcomes He gives of the hidden manna, and a white stone with a new name written on it, which no one knows but the one who receives it.',
    promiseRef: 'Revelation 2:17',
    today:
      'This church stood firm against pressure from outside but grew porous to compromise within. It is the mirror for the believer who will not publicly deny Christ, yet quietly makes peace with the world’s idols and appetites. Faithfulness at the front door means little if the back door is left open. The hidden manna and the secret new name — an intimacy with Christ that compromise slowly forfeits.',
    keyVerse: {
      text: 'You hold firmly to my name, and didn’t deny my faith.',
      ref: 'Revelation 2:13',
    },
  },
  {
    name: 'Thyatira',
    portrait: 'The church that tolerated corruption',
    reference: 'Revelation 2:18–29',
    christ:
      'The Son of God, who has eyes like a flame of fire, and feet like burnished brass.',
    christRef: 'Revelation 2:18',
    commend:
      'He knows their works — “your love, faith, service, and patient endurance” — and that their last works are more than the first. This church is growing.',
    correct:
      '“But I have this against you, that you tolerate your woman Jezebel” — a false prophetess seducing His servants into immorality and idolatry. He gave her time to repent. “I am he who searches the minds and hearts.” To the faithful rest: hold fast what you have until He comes.',
    promise:
      'To the one who overcomes and keeps His works to the end, He gives authority over the nations — and the morning star, Christ Himself.',
    promiseRef: 'Revelation 2:26–28',
    today:
      'A warm, active, growing church — yet so prizing love and tolerance that it will not confront false teaching in its own house. It is the mirror for a people who mistake the refusal to judge anything for the highest love. Christ’s flame-eyes see past reputation into the heart. Real love holds the truth; it does not shelter what quietly destroys.',
    keyVerse: {
      text: 'I am he who searches the minds and hearts.',
      ref: 'Revelation 2:23',
    },
  },
  {
    name: 'Sardis',
    portrait: 'A name for being alive, but dead',
    reference: 'Revelation 3:1–6',
    christ: 'He who has the seven Spirits of God, and the seven stars.',
    christRef: 'Revelation 3:1',
    commend:
      'Only a remnant: “a few names in Sardis that did not defile their garments. They will walk with me in white, for they are worthy.”',
    correct:
      '“You have a reputation for being alive, but you are dead.” The call is urgent: “Wake up, and strengthen the things that remain… Remember therefore how you have received and heard. Keep it, and repent.” Otherwise He comes as a thief.',
    promise:
      'The one who overcomes will be dressed in white; his name will never be blotted out of the book of life, and Christ will confess it before His Father and the angels.',
    promiseRef: 'Revelation 3:5',
    today:
      'The church that is alive on paper and dead in practice — coasting on history, programs, and respectability with no living power. It is the mirror for the believer whose reputation outran their reality long ago. Christ’s word is not “try harder” but “wake up.” Strengthen what still has a pulse; and take heart — even in Sardis, a faithful few walk with Him in white.',
    keyVerse: {
      text: 'You have a reputation for being alive, but you are dead.',
      ref: 'Revelation 3:1',
    },
  },
  {
    name: 'Philadelphia',
    portrait: 'The faithful church with an open door',
    reference: 'Revelation 3:7–13',
    christ:
      'He who is holy, he who is true, he who has the key of David — who opens and no one can shut, and shuts and no one opens.',
    christRef: 'Revelation 3:7',
    commend:
      '“You have a little power, and kept my word, and didn’t deny my name.” So He set before them an open door no one can shut, and a promise to keep them through the hour of testing. Like Smyrna, this church receives no rebuke.',
    correct: undefined,
    promise:
      'The one who overcomes He makes a pillar in the temple of His God, never again to leave it — and writes on him the name of God, the name of the new Jerusalem, and Christ’s own new name.',
    promiseRef: 'Revelation 3:12',
    today:
      'Small in strength, faithful in substance. It kept His word and would not deny His name, and He answered with a door for witness and mission that no power on earth can close. It is the mirror for the weak-but-faithful — the reminder that Christ never measures His church by its size or clout, only by its faithfulness. “Hold firmly that which you have, so that no one takes your crown.”',
    keyVerse: {
      text: 'Behold, I have set before you an open door, which no one can shut.',
      ref: 'Revelation 3:8',
    },
  },
  {
    name: 'Laodicea',
    portrait: 'The lukewarm, self-sufficient church',
    reference: 'Revelation 3:14–22',
    christ:
      'The Amen, the Faithful and True Witness, the Beginning of the creation of God.',
    christRef: 'Revelation 3:14',
    commend: undefined,
    correct:
      '“You are neither cold nor hot… because you are lukewarm… I will vomit you out of my mouth.” They say, “I am rich… and have need of nothing,” not knowing they are wretched, poor, blind, and naked. His counsel: buy from Him gold refined by fire, white garments, and salve for the eyes. “As many as I love, I reprove and chasten. Be zealous therefore, and repent.”',
    promise:
      'To the one who overcomes He grants to sit with Him on His throne, as He also overcame and sat down with His Father on His throne.',
    promiseRef: 'Revelation 3:21',
    today:
      'The clearest mirror of the modern, comfortable, self-sufficient church and heart — prosperous, at ease, sure it needs nothing, and blind to its own poverty. It is the only church with nothing Christ can commend. Yet here comes the tenderest picture in all seven: the Lord standing outside His own church, knocking, asking to come in and share a meal. Lukewarm is not beyond hope. Open the door.',
    keyVerse: {
      text: 'Behold, I stand at the door and knock.',
      ref: 'Revelation 3:20',
    },
  },
]
