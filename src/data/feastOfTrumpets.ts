// Content for the "Feast of Trumpets" study — Yom Teruah / Rosh Hashanah
// (Leviticus 23:23–25; Numbers 29:1), read for its meaning now and correlated to
// the trumpet of 1 Thessalonians 4. Tone is watchful and hopeful, never fearful
// or date-setting (Matthew 24:36). Scripture is quoted from the public-domain
// World English Bible. Companion to the End Times cluster; links the author's
// "Oil in My Lamp" site at the foot.
//
// This year's hook is factual, not speculative: in 2026 (Hebrew year 5787) the
// first day of the feast, Sabbath, September 12, falls on Shabbat — so by an
// ancient Jewish tradition the shofar is not sounded on that first day but on the
// second (Sunday, September 13). We let that silence turn our ears forward to the
// one trumpet still to sound; we do NOT claim this is the year (Matthew 24:36).

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

// One meaning of the trumpet, walked from Scripture into today.
export interface Theme {
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
    'A companion teaching on keeping your heart ready and your lamp full for the return of Christ — the same hope the trumpet announces.',
  url: 'https://shadow-lofi.github.io/Oil-In-My-Lamp/',
}

// The verse to hold in the heart (offered for Scripture Memory).
export const KEY_VERSE = {
  ref: '1 Thessalonians 4:16–17',
  text: 'For the Lord himself will descend from heaven with a shout, with the voice of the archangel and with God’s trumpet. The dead in Christ will rise first, then we who are alive, who are left, will be caught up together with them in the clouds, to meet the Lord in the air. So we will be with the Lord forever.',
  translation: 'WEB',
}

// The feast's Scriptural foundation — where the LORD appoints the day.
export const FOUNDATION: FoundationVerse[] = [
  {
    ref: 'Leviticus 23:24–25',
    text: 'In the seventh month, on the first day of the month, there shall be a solemn rest for you, a memorial of blowing of trumpets, a holy convocation. You shall do no regular work.',
  },
  {
    ref: 'Numbers 29:1',
    text: 'In the seventh month, on the first day of the month, you shall have a holy convocation. You shall do no regular work. It is a day of blowing of trumpets to you.',
  },
]

// The meanings the trumpet gathers up across Scripture.
export const THEMES: Theme[] = [
  {
    title: 'The awakening blast',
    passage: 'Ephesians 5:14',
    verseText: 'Awake, you who sleep, and arise from the dead, and Christ will shine on you.',
    meaning:
      'The Hebrew name of the feast, Yom Teruah, means the day of the shout — the blast. The trumpet was never background music; it was a sound made to rouse a sleeping camp, to make people sit up and pay attention. Of all the feasts, this one begins not with a meal or a sacrifice but with a noise that wakes.',
    today:
      'We live half-asleep — dulled by hurry, numbed by screens, drowsy toward God. The feast calls the soul awake now. And it points past our morning drowsiness to the great waking still to come, when the dead in Christ will hear a trumpet and rise.',
  },
  {
    title: 'The gathering',
    passage: 'Matthew 24:31 · Numbers 10:2–3',
    verseText:
      'He will send out his angels with a great sound of a trumpet, and they will gather together his chosen ones from the four winds.',
    meaning:
      'Two silver trumpets once called Israel together: one long blast and the whole camp assembled around the presence of God (Numbers 10). The trumpet is the sound of being gathered — scattered people drawn back into one people, home.',
    today:
      'Isaiah saw a day when “a great trumpet will be blown,” and the perishing and the outcast would be gathered to worship (Isaiah 27:13). Jesus took up the very same image: a great trumpet that gathers His own from the four winds. The blast is not only a warning — it is a homecoming.',
  },
  {
    title: 'The coronation of the King',
    passage: 'Psalm 47:5',
    verseText: 'God has gone up with a shout, Yahweh with the sound of a trumpet.',
    meaning:
      'In Israel a king was crowned to the blast of the shofar — the trumpet announced that the throne was taken. So this feast came to be kept as the day of the King: “the LORD reigns.” The trumpet is a coronation fanfare.',
    today:
      'The trumpet that is coming is not first about escape or catastrophe. It is a coronation. It announces that the King has come for His own and that He reigns — which is why, for those who love Him, the sound is joy and not terror.',
  },
  {
    title: 'The day no one can pinpoint',
    passage: 'Matthew 24:36',
    verseText:
      'But no one knows of that day and hour, not even the angels of heaven, but my Father only.',
    meaning:
      'Alone among the feasts, Trumpets fell on the new moon — and no one knew the exact moment until two witnesses sighted the first sliver and the shofar sounded. Many have long noted that Jesus’ words, “no one knows the day or the hour,” echo a familiar way of speaking about this very feast.',
    today:
      'Whether or not He was pointing to Trumpets, the lesson holds: the day is hidden on purpose. We are not told the hour precisely so that we will be ready in every hour. The call is watchfulness, never date-setting — a full heart, whatever the hour turns out to be.',
  },
  {
    title: 'The last trumpet',
    passage: '1 Corinthians 15:51–52',
    verseText:
      'In a moment, in the twinkling of an eye, at the last trumpet… the dead will be raised incorruptible, and we will be changed.',
    meaning:
      'Paul gathers every meaning of the trumpet into one instant — a sound that wakes the dead and transforms the living, quicker than a blink. The awakening, the gathering, the coronation, all in one blast.',
    today:
      'This is where the Feast of Trumpets has always pointed. Not to a holiday on a calendar, but to a sound still ahead of us — the last trump, when what is mortal puts on what cannot die.',
  },
]

// 1 Thessalonians 4:15–18 (WEB) — the trumpet still to sound, and the comfort of it.
export const THESS_PASSAGE: PassageVerse[] = [
  {
    n: 15,
    text: 'For this we tell you by the word of the Lord, that we who are alive, who are left to the coming of the Lord, will in no way precede those who have fallen asleep.',
  },
  {
    n: 16,
    text: 'For the Lord himself will descend from heaven with a shout, with the voice of the archangel and with God’s trumpet. The dead in Christ will rise first,',
  },
  {
    n: 17,
    text: 'then we who are alive, who are left, will be caught up together with them in the clouds, to meet the Lord in the air. So we will be with the Lord forever.',
  },
  { n: 18, text: 'Therefore comfort one another with these words.' },
]
