// Scriptures on Sabbath and rest — for the weekly Sabbath rhythm. These frame
// rest as worship and gift (Gen 2:2–3, Ex 20:8, Mark 2:27, Heb 4:9–10), never as
// idleness or a day missed. Wordings kept close to public-domain (WEB/KJV-family)
// to stay copyright-clean, matching the rest of the app's Scripture.

export interface RestVerse {
  ref: string
  text: string
}

export const SABBATH_VERSES: RestVerse[] = [
  {
    ref: 'Genesis 2:2–3',
    text: 'On the seventh day God finished his work, and he rested. So God blessed the seventh day and made it holy.',
  },
  {
    ref: 'Exodus 20:8',
    text: 'Remember the Sabbath day, to keep it holy.',
  },
  {
    ref: 'Mark 2:27',
    text: 'The Sabbath was made for man, not man for the Sabbath.',
  },
  {
    ref: 'Hebrews 4:9–10',
    text: 'There remains therefore a Sabbath rest for the people of God; for he who has entered into his rest has also himself rested from his works.',
  },
  {
    ref: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
  },
  {
    ref: 'Psalm 23:2–3',
    text: 'He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
  },
  {
    ref: 'Exodus 33:14',
    text: 'My presence will go with you, and I will give you rest.',
  },
  {
    ref: 'Isaiah 30:15',
    text: 'In returning and rest you shall be saved; in quietness and in trust shall be your strength.',
  },
]

/** A rest verse chosen from `seed` (e.g. a weekly index) so it rotates gently. */
export function sabbathVerse(seed: number): RestVerse {
  const i = ((seed % SABBATH_VERSES.length) + SABBATH_VERSES.length) % SABBATH_VERSES.length
  return SABBATH_VERSES[i]
}

/** Full weeks since the epoch — a stable weekly seed for `sabbathVerse`. */
export function weekSeed(now: Date = new Date()): number {
  return Math.floor(now.getTime() / (7 * 86_400_000))
}

/** Days until the next occurrence of `sabbathDay` (0=today is the Sabbath). */
export function daysUntilSabbath(sabbathDay: number, now: Date = new Date()): number {
  return (sabbathDay - now.getDay() + 7) % 7
}

/** Is the given day the user's weekly Sabbath? */
export function isSabbathToday(sabbathDay: number, now: Date = new Date()): boolean {
  return now.getDay() === sabbathDay
}
