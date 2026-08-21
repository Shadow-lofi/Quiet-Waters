// Web Push sender — signs and delivers a payload to the browser push services
// using the app's VAPID identity. Also owns the "broadcast to everyone" fan-out
// used by both the manual announcement route and the daily-verse cron.

import webpush from 'web-push'
import { allSubscriptions, removeSubscription } from './_kv.js'

let configured = false

/** Whether the VAPID keypair is present (feature is inert without it). */
export function pushReady() {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
}

function ensureConfigured() {
  if (configured) return
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:hello@quietwaters.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
  configured = true
}

/**
 * Send one notification to every stored subscription. Dead endpoints (the push
 * service replies 404/410) are pruned as we go. Returns a small tally.
 */
export async function broadcast({ title, body = '', url = '/meditate', tag = 'quiet-waters-announce' }) {
  ensureConfigured()
  const payload = JSON.stringify({ title, body, url, tag })
  const subs = await allSubscriptions()
  let sent = 0
  let pruned = 0
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload)
        sent++
      } catch (err) {
        const code = err && err.statusCode
        if (code === 404 || code === 410) {
          await removeSubscription(sub.endpoint)
          pruned++
        }
      }
    }),
  )
  return { total: subs.length, sent, pruned }
}
