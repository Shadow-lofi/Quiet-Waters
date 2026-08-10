# Quiet Waters

A **Christian meditation timer** — a quiet, local-first PWA for being still before God.
Set a length, receive a Scripture to dwell on, breathe along with a gentle guide,
and let soft chimes open and close your time. Your streak and history stay on your
device.

> *"Be still, and know that I am God."* — Psalm 46:10

## What's inside (v1)

- **Meditation timer** — presets or a custom length, opening / closing chimes, and
  an optional interval bell. Chimes are synthesized with the Web Audio API, so
  there are no sound files and it works fully offline.
- **Scripture to dwell on** — a rotating contemplative verse, each with a breath
  prayer split across the inhale and exhale.
- **Breathing guide** — a swelling "still waters" circle paced to gentle / calm /
  deep patterns (or off), honoring `prefers-reduced-motion`.
- **Journey** — current & longest streak, total sittings, time in stillness, and a
  seven-day view.
- **Still Waters theme** — soft mist, water, and reed tones, with **Day**, **Night**,
  and **Auto** (follow-the-OS) appearances.
- **Installable & offline** — PWA with a service worker and app icons.

## Stack

React 19 · Vite · TypeScript · Tailwind v4 (token-based theming) · Zustand
(local-first, `localStorage`-persisted) · react-router · self-hosted variable
fonts (Newsreader + Nunito Sans).

## Develop

```bash
npm install
npm run gen:icons   # rasterize the PWA/app icons (needs the sharp dep)
npm run dev
```

- `npm run build` — production build to `dist/`
- `npm run verify` — lint + typecheck

## Deploy

Static SPA — deploys to Vercel as-is (`vercel.json` handles SPA rewrites and cache
headers). Any static host works; point the SPA fallback at `index.html`.

---

Part of the same family as [Temple · Faith & Fitness](https://temple-faith-fitness.com).
Developed by Tavaris Freeman.
