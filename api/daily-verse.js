// The daily "verse to dwell on" broadcast. Triggered by a Vercel Cron (see the
// `crons` entry in vercel.json); sends the same gentle line to every subscriber.
// It's a broadcast, so everyone gets it at the one scheduled UTC time — no
// per-person schedules or timezones (that's a heavier, later phase).
//
// This shares the daily notification slot with the daily hymn: subscribers get
// ONE push a day, alternating by day-of-year — the verse on odd days, the hymn
// on even days (see api/_daily.js). On the hymn's days this endpoint no-ops.
//
// Protected by CRON_SECRET: Vercel Cron sends `Authorization: Bearer <secret>`
// when that env var is set, so set it to keep the endpoint from being poked.

import { broadcast, pushReady } from './_send.js'
import { kvReady } from './_kv.js'
import { dayOfYear, isHymnDay } from './_daily.js'

// Public-domain (WEB/KJV) lines, mirroring the rotation in src/lib/reminders.ts.
const NUDGES = [
  { title: 'A moment to be still', body: 'Be still, and know that I am God. — Psalm 46:10' },
  { title: 'Come and rest', body: 'Come to me, and I will give you rest. — Matthew 11:28' },
  { title: 'Quiet waters', body: 'He leads me beside still waters. — Psalm 23:2' },
  { title: 'Wait on Him', body: 'My soul waits in silence for God alone. — Psalm 62:1' },
  { title: 'A little while apart', body: 'Come away by yourselves and rest a while. — Mark 6:31' },
  { title: 'Peace, be still', body: 'You will keep him in perfect peace whose mind is stayed on You. — Isaiah 26:3' },
  { title: 'Return and rest', body: 'In quietness and trust is your strength. — Isaiah 30:15' },
]

function todaysNudge(now = new Date()) {
  return NUDGES[dayOfYear(now) % NUDGES.length]
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
    if (bearer !== secret) return res.status(401).json({ error: 'unauthorized' })
  }

  // On the hymn's days, stay quiet — the daily-hymn cron takes the slot.
  if (isHymnDay()) return res.status(200).json({ ok: true, skipped: 'hymn-day' })

  if (!pushReady()) return res.status(500).json({ error: 'push-not-configured' })
  if (!kvReady()) return res.status(500).json({ error: 'store-not-configured' })

  const nudge = todaysNudge()
  try {
    const result = await broadcast({
      title: nudge.title,
      body: nudge.body,
      url: '/meditate',
      tag: 'quiet-waters-daily',
    })
    return res.status(200).json({ ok: true, verse: nudge.title, ...result })
  } catch {
    return res.status(500).json({ error: 'send-failed' })
  }
}
