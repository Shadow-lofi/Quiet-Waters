// Drop a device's push subscription (they turned notifications off).

import { removeSubscription, kvReady } from './_kv.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' })
  if (!kvReady()) return res.status(500).json({ error: 'store-not-configured' })

  const endpoint = req.body && req.body.endpoint
  if (!endpoint) return res.status(400).json({ error: 'endpoint-required' })

  try {
    await removeSubscription(endpoint)
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'store-failed' })
  }
}
