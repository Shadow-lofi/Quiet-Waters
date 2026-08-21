// Register a device's push subscription so it can receive broadcasts. Anonymous:
// we store only the opaque subscription object the browser hands us.

import { saveSubscription, kvReady } from './_kv.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' })
  if (!kvReady()) return res.status(500).json({ error: 'store-not-configured' })

  const sub = req.body
  if (!sub || !sub.endpoint || !sub.keys) {
    return res.status(400).json({ error: 'invalid-subscription' })
  }

  try {
    await saveSubscription(sub)
    return res.status(201).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'store-failed' })
  }
}
