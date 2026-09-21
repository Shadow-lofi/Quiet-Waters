// The daily "hymn to dwell on" broadcast. Triggered by a Vercel Cron (see the
// `crons` entry in vercel.json) once a day; sends the day's hymn to every
// subscriber. Like the daily-verse cron, it's a broadcast — everyone gets it at
// the one scheduled UTC time (no per-person schedules or timezones, which is a
// heavier, later phase).
//
// The cron fires during Americas daytime (see vercel.json) so the UTC calendar
// day matches the local day for the bulk of users — which keeps the hymn named
// here the same as the one their /hymns page shows for "today."
//
// Protected by CRON_SECRET: Vercel Cron sends `Authorization: Bearer <secret>`
// when that env var is set, so set it to keep the endpoint from being poked.

import { broadcast, pushReady } from './_send.js'
import { kvReady } from './_kv.js'

// A lightweight mirror of src/data/hymns.ts — SAME titles, SAME order — with a
// short teaser line for the notification body. Keep this list in sync with the
// app's HYMNS when hymns are added or reordered, so the pushed hymn matches the
// one the /hymns page shows for the day. (The api/ folder is plain JS with no
// build step, so it can't import the TypeScript data directly — hence the copy,
// the same pattern the daily-verse cron uses for its verse rotation.)
const HYMNS = [
  { title: 'Be Thou My Vision', line: 'See everything by the light of God, and want Him above all.' },
  { title: 'Dear Lord and Father of Mankind', line: 'Lay down the strain and stress, and hear the still, small voice of calm.' },
  { title: 'It Is Well with My Soul', line: 'Peace like a river, or sorrows like the sea — and still, it is well.' },
  { title: 'Amazing Grace', line: 'The grace that has led us this far will lead us home.' },
  { title: 'The King of Love My Shepherd Is', line: 'Psalm 23 in song — a Shepherd whose goodness never fails.' },
  { title: 'Abide with Me', line: 'An evening prayer for the One who changes not to stay near.' },
  { title: 'Come, Thou Fount of Every Blessing', line: 'A wandering heart, sought and sealed by a mercy that never ceases.' },
  { title: 'Holy, Holy, Holy', line: 'The song of heaven, borrowed for the morning.' },
  { title: 'What a Friend We Have in Jesus', line: 'Every care worth carrying to God in prayer.' },
  { title: 'When I Survey the Wondrous Cross', line: 'Love so amazing, so divine, it asks for everything.' },
  { title: 'Rock of Ages', line: 'Nothing in our hands to bring — only clinging to the cross.' },
  { title: 'O God, Our Help in Ages Past', line: 'Our shelter, our hope, our eternal home.' },
  { title: 'Praise to the Lord, the Almighty', line: 'All that has life and breath, called to adore the King.' },
  { title: 'Blessed Assurance', line: 'A foretaste of glory — resting, watching, and waiting in His love.' },
]

// The day's hymn — the SAME calendar-index rotation as hymnOfDayIndex() in
// src/data/hymns.ts, so the push and the page agree on "today's" hymn.
function todaysHymn(now = new Date()) {
  const idx = (now.getFullYear() * 372 + now.getMonth() * 31 + now.getDate()) % HYMNS.length
  return HYMNS[idx]
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
    if (bearer !== secret) return res.status(401).json({ error: 'unauthorized' })
  }

  if (!pushReady()) return res.status(500).json({ error: 'push-not-configured' })
  if (!kvReady()) return res.status(500).json({ error: 'store-not-configured' })

  const hymn = todaysHymn()
  try {
    const result = await broadcast({
      title: 'A hymn to dwell on',
      body: `“${hymn.title}” — ${hymn.line}`,
      url: '/hymns',
      tag: 'quiet-waters-hymn',
    })
    return res.status(200).json({ ok: true, hymn: hymn.title, ...result })
  } catch {
    return res.status(500).json({ error: 'send-failed' })
  }
}
