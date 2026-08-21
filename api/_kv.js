// Tiny Redis-over-REST helper for the push subscription store. Works with a
// Vercel KV / Upstash Redis database via its REST API — set either the Vercel KV
// env vars (KV_REST_API_URL / KV_REST_API_TOKEN) or the Upstash ones
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). No SDK, just fetch.
//
// Subscriptions are stored anonymously in one hash — field = push endpoint,
// value = the full subscription JSON. There are no user accounts.

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const KEY = 'push:subs'

/** Whether a subscription store is configured. */
export function kvReady() {
  return Boolean(URL && TOKEN)
}

async function cmd(args) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  if (!res.ok) throw new Error(`KV ${args[0]} failed: ${res.status}`)
  const data = await res.json()
  return data.result
}

/** Store (or refresh) a push subscription, keyed by its endpoint. */
export function saveSubscription(sub) {
  return cmd(['HSET', KEY, sub.endpoint, JSON.stringify(sub)])
}

/** Forget a subscription by endpoint. */
export function removeSubscription(endpoint) {
  return cmd(['HDEL', KEY, endpoint])
}

/** Every stored subscription. */
export async function allSubscriptions() {
  const values = (await cmd(['HVALS', KEY])) || []
  return values
    .map((v) => {
      try {
        return JSON.parse(v)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}
