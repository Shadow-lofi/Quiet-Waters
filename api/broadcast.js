// Send an announcement to every subscribed device — e.g. "a new version is
// ready" or "a new guided session is here". Protected by PUSH_ADMIN_TOKEN so
// only you can trigger it (pass it as `Authorization: Bearer <token>`). Fire it
// with scripts/broadcast.mjs.

import { broadcast, pushReady } from './_send.js'
import { kvReady } from './_kv.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' })

  const admin = process.env.PUSH_ADMIN_TOKEN
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const token = bearer || (req.body && req.body.token)
  if (!admin || token !== admin) return res.status(401).json({ error: 'unauthorized' })

  if (!pushReady()) return res.status(500).json({ error: 'push-not-configured' })
  if (!kvReady()) return res.status(500).json({ error: 'store-not-configured' })

  const { title, body, url, tag } = req.body || {}
  if (!title) return res.status(400).json({ error: 'title-required' })

  try {
    const result = await broadcast({ title, body, url, tag })
    return res.status(200).json({ ok: true, ...result })
  } catch {
    return res.status(500).json({ error: 'send-failed' })
  }
}
