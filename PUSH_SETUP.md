# Push notifications — setup

Quiet Waters can send **broadcast** push notifications that reach the phone even
when the app is closed: a **new version / feature** announcement (manual) and a
**daily verse** (a once-a-day cron). It's opt-in per device, anonymous (no
accounts — the server stores only opaque push endpoints), and gated behind the
installed PWA on iOS.

Everything is already coded. It stays **inert** until these one-time account
steps are done — all in the Vercel dashboard, none of which touch git.

## 1. Add a subscription store (Vercel KV / Upstash Redis)

Vercel dashboard → the `quiet-waters` project → **Storage** → create a **KV**
(Upstash Redis) database and connect it to the project. Vercel injects
`KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. (Free tier is plenty —
we store one small hash of subscriptions.)

## 2. Set environment variables

Project → **Settings → Environment Variables** (Production + Preview):

| Name | Value |
|------|-------|
| `VAPID_PUBLIC_KEY` | the public key generated for this repo (below) |
| `VAPID_PRIVATE_KEY` | the **private** key (keep secret) |
| `VAPID_SUBJECT` | `mailto:you@yourdomain` |
| `PUSH_ADMIN_TOKEN` | a long random string you invent (guards manual broadcasts) |
| `CRON_SECRET` | a long random string you invent (guards the daily cron) |
| `VITE_PUSH_ENABLED` | `1` — reveals the Settings toggle (leave unset until the above are done) |

> The whole feature ships **dormant**: until `VITE_PUSH_ENABLED=1`, the Settings
> toggle stays hidden and the API routes simply report "not configured", so it's
> safe to merge and deploy before finishing these steps.

The keypair that matches the public key embedded in `src/lib/push.ts` was
generated at build time. To generate a fresh pair (and then also update the
embedded public key or set `VITE_VAPID_PUBLIC_KEY`):

```bash
npx web-push generate-vapid-keys
```

## 3. Redeploy

Redeploy so the functions pick up the env vars. The daily-verse cron
(`vercel.json` → `crons`) runs at **13:00 UTC** daily; adjust the schedule there.

## 4. Turn it on

On an **installed** app (required on iPhone — Add to Home Screen first), open
**Settings → Notifications → On this device** and allow notifications.

## Sending a manual announcement

After shipping something, broadcast it to everyone opted in:

```bash
PUSH_ADMIN_TOKEN=your-token node scripts/broadcast.mjs \
  --title "New in Quiet Waters" \
  --body "An Evening Rest sitting has arrived." \
  --url "/updates"
```

## How it fits together

- Client: `src/lib/push.ts` (subscribe/unsubscribe), Settings toggle.
- Service worker: `public/sw.js` `push` + `notificationclick` handlers.
- Server: `api/subscribe.js`, `api/unsubscribe.js`, `api/broadcast.js`,
  `api/daily-verse.js` (cron), with `api/_kv.js` (store) and `api/_send.js`
  (web-push fan-out).
