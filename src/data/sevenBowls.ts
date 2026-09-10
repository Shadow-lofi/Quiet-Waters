// Content for "The Seven Last Plagues" study — the seven bowls (vials) of the
// wrath of God poured out by seven angels (Revelation 15–16). Read reverently for
// the justice of God, the vindication of the martyrs, and the safety of belonging
// to the Lamb — never sensational, never date-setting (Matthew 24:36). Scripture
// is quoted from the public-domain World English Bible. Companion to the End
// Times cluster; links the author's "Oil in My Lamp" site at the foot.

// A numbered verse, for a passage read-through card.
export interface PassageVerse {
  n: number
  text: string
}

// A short Scripture with its reference, for the foundation card.
export interface FoundationVerse {
  ref: string
  text: string
}

// One of the seven bowls — the Scripture, its meaning, and a word for today.
export interface Bowl {
  title: string
  passage: string
  verseText: string
  meaning: string
  today: string
}

// The author's companion teaching site (end-times, watchful & hopeful).
export const ARTICLE = {
  title: 'Oil in My Lamp',
  blurb:
    'A companion teaching on keeping your heart ready and your lamp full for the return of Christ — the same watchfulness the sixth bowl calls for.',
  url: 'https://shadow-lofi.github.io/Oil-In-My-Lamp/',
}

// The verse to hold in the heart (offered for Scripture Memory) — the song of
// the redeemed, sung before the bowls are ever poured.
export const KEY_VERSE = {
  ref: 'Revelation 15:3–4',
  text: 'Great and marvelous are your works, Lord God, the Almighty! Righteous and true are your ways, you King of the nations. Who wouldn’t fear you, Lord, and glorify your name? For you only are holy. For all the nations will come and worship before you. For your righteous acts have been revealed.',
  translation: 'WEB',
}

// Where Scripture sets the seven last plagues.
export const FOUNDATION: FoundationVerse[] = [
  {
    ref: 'Revelation 15:1',
    text: 'I saw another great and marvelous sign in the sky: seven angels having the seven last plagues, for in them God’s wrath is finished.',
  },
  {
    ref: 'Revelation 16:1',
    text: 'I heard a loud voice out of the temple, saying to the seven angels, “Go and pour out the seven bowls of the wrath of God on the earth!”',
  },
]

// The one beatitude in the whole sequence — a word of Jesus, tucked into the
// sixth bowl as the armies of the earth are gathered.
export const BEATITUDE: FoundationVerse = {
  ref: 'Revelation 16:15',
  text: 'Behold, I come like a thief. Blessed is he who watches, and keeps his clothes, so that he doesn’t walk naked, and they see his shame.',
}

// The seven bowls, in order (Revelation 16).
export const BOWLS: Bowl[] = [
  {
    title: 'Poured on the earth — the festering sore',
    passage: 'Revelation 16:2',
    verseText:
      'The first went, and poured out his bowl into the earth, and it became a harmful and evil sore on the people who had the mark of the beast, and who worshiped his image.',
    meaning:
      'The first bowl falls not on the innocent but on those who bear the mark of the beast — those who chose its allegiance. The very mark that seemed to secure them becomes the site of their wound. It echoes the boils of Egypt (Exodus 9): a sore that no power or wealth can heal.',
    today:
      'What we bow to, we become bound to. The plague simply makes visible what was already true — a life given to the beast is a life marked by it. The bowl asks a quiet question of us now: whose mark is on your life — the beast’s, or the Lamb’s?',
  },
  {
    title: 'Poured on the sea — blood as of a dead man',
    passage: 'Revelation 16:3',
    verseText:
      'The second angel poured out his bowl into the sea, and it became blood as of a dead man. Every living thing in the sea died.',
    meaning:
      'The sea, teeming with life, becomes “blood as of a dead man,” and everything in it dies — an echo of the Nile turned to blood (Exodus 7). Creation itself recoils under the weight of judgment.',
    today:
      'When a people set themselves against the Giver of life, the gifts of life turn against them. The bowls are not arbitrary cruelty; they are a hardened age finally reaping what it has long sown.',
  },
  {
    title: 'Poured on the rivers — “You are righteous”',
    passage: 'Revelation 16:4–7',
    verseText:
      'The third poured out his bowl into the rivers and springs of water, and they became blood. I heard the angel of the waters saying, “You are righteous… because you have judged these things. For they poured out the blood of the saints and the prophets, and you have given them blood to drink. They deserve this.”',
    meaning:
      'When the third bowl turns fresh water to blood, heaven pauses to speak: the judgment is just, because “they poured out the blood of the saints and the prophets.” The altar answers, “true and righteous are your judgments.” This is the martyrs’ cry of Revelation 6 — “how long?” — at last answered.',
    today:
      'We flinch at judgment, but Scripture insists it is right, and that the blood of the persecuted is never forgotten. God is not indifferent to the innocent blood spilled in every age. For those who have suffered for doing good, the bowl is not horror but vindication.',
  },
  {
    title: 'Poured on the sun — scorching heat',
    passage: 'Revelation 16:8–9',
    verseText:
      'The fourth poured out his bowl on the sun, and it was given to him to scorch men with fire… and people blasphemed the name of God who has the power over these plagues. They didn’t repent and give him glory.',
    meaning:
      'The fourth bowl turns the sun to fire, and the response is telling: people “blasphemed the name of God… They didn’t repent.” Judgment on its own does not soften a hardened heart — though it is meant to.',
    today:
      'Suffering does not automatically produce repentance; it reveals what is already there. The same heat that melts wax hardens clay. The warning is not to wait for pain to turn us — but to soften now, while mercy is still calling.',
  },
  {
    title: 'Poured on the beast’s throne — a kingdom of darkness',
    passage: 'Revelation 16:10–11',
    verseText:
      'The fifth poured out his bowl on the throne of the beast, and his kingdom was darkened. They gnawed their tongues because of the pain, and they blasphemed the God of heaven because of their pains and their sores. They still didn’t repent of their works.',
    meaning:
      'The fifth bowl strikes the seat of power itself, and the whole kingdom goes dark — an echo of the darkness over Egypt that could be felt (Exodus 10). What promised light and order collapses into gloom, and still “they didn’t repent.”',
    today:
      'Every kingdom built against God is finally a kingdom of darkness, however bright its lights. When the counterfeit fails, the heart is laid bare — pain without repentance, blame without turning. The bowl invites us to build our lives on the one Throne that will never go dark.',
  },
  {
    title: 'Poured on the Euphrates — the gathering to Armageddon',
    passage: 'Revelation 16:12–16',
    verseText:
      'The sixth poured out his bowl on the great river, the Euphrates. Its water was dried up, that the way might be prepared for the kings that come from the sunrise.',
    meaning:
      'The sixth bowl dries the great river to clear a road for “the kings of the sunrise,” while three unclean spirits like frogs go out from the dragon, the beast, and the false prophet to gather the world’s rulers “to the war of that great day of God, the Almighty” — the place called Har-Magedon. And into the middle of it a single voice breaks in (see the beatitude below).',
    today:
      'The powers of the earth are being drawn together; the believer is being told, simply, to watch. The one word for this hour is not “brace yourself” but “stay awake, keep your garments” — clothed in Christ, ready whenever He comes.',
  },
  {
    title: 'Poured into the air — “It is done!”',
    passage: 'Revelation 16:17–21',
    verseText:
      'The seventh poured out his bowl into the air. A loud voice came out of the temple of heaven, from the throne, saying, “It is done!” There were lightnings, sounds, and thunders; and there was a great earthquake, such as has not happened since there were men on the earth.',
    meaning:
      'The seventh bowl is poured into the air, and the voice from the throne declares, “It is done!” Then the greatest earthquake in history, Babylon remembered and given the cup of wrath, islands and mountains fleeing, and hail like the seventh plague of Egypt (Exodus 9). The account is closed; the wrath is complete.',
    today:
      '“It is done” is God’s word over the end of evil’s reign, as surely as “It is finished” was His word over its defeat at the cross. The bowls do not trail off — they arrive at a settled end. For those in the Lamb, that finish is not terror but the doorway to the new heaven and the new earth.',
  },
]

// Revelation 15:2–4 (WEB) — the song of Moses and the Lamb, sung by the redeemed
// before a single bowl is poured. The judgment chapter opens with worship.
export const SONG_PASSAGE: PassageVerse[] = [
  {
    n: 2,
    text: 'I saw something like a sea of glass mixed with fire, and those who overcame the beast, his image, and the number of his name, standing on the sea of glass, having harps of God.',
  },
  {
    n: 3,
    text: 'They sang the song of Moses, the servant of God, and the song of the Lamb, saying, “Great and marvelous are your works, Lord God, the Almighty! Righteous and true are your ways, you King of the nations.',
  },
  {
    n: 4,
    text: 'Who wouldn’t fear you, Lord, and glorify your name? For you only are holy. For all the nations will come and worship before you. For your righteous acts have been revealed.”',
  },
]
