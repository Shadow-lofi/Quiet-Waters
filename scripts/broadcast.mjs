// Send a push announcement to everyone who opted in — e.g. after shipping a new
// version or feature. It just calls the protected /api/broadcast route.
//
// Usage:
//   PUSH_ADMIN_TOKEN=… node scripts/broadcast.mjs --title "…" [--body "…"] [--url "/updates"]
//
// Optional env:
//   BROADCAST_BASE  site origin to hit (default: production domain below)

const BASE = process.env.BROADCAST_BASE || 'https://quiet-waters-meditation.com'
const TOKEN = process.env.PUSH_ADMIN_TOKEN

if (!TOKEN) {
  console.error('Set PUSH_ADMIN_TOKEN (must match the Vercel env var).')
  process.exit(1)
}

// Minimal --flag value parser.
const args = process.argv.slice(2)
const opts = {}
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '')
  opts[key] = args[i + 1]
}

if (!opts.title) {
  console.error('A --title is required. Example:')
  console.error('  node scripts/broadcast.mjs --title "New in v1.8" --body "Evening Rest sitting" --url "/updates"')
  process.exit(1)
}

const payload = {
  title: opts.title,
  body: opts.body || '',
  url: opts.url || '/meditate',
  tag: opts.tag || 'quiet-waters-announce',
}

const res = await fetch(`${BASE}/api/broadcast`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
  body: JSON.stringify(payload),
})

const text = await res.text()
if (!res.ok) {
  console.error(`Broadcast failed (${res.status}): ${text}`)
  process.exit(1)
}
console.log(`Sent. ${text}`)
