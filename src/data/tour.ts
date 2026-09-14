// The guided tour — an ordered walk through the app, led by the little lamb. The
// Tour component (components/Tour.tsx) navigates to each step's route, finds the
// element tagged with the matching `data-tour` attribute, spotlights it, and
// shows the lamb's explanation in a callout. Steps whose target isn't found (a
// conditional element) fall back to a centered callout, so the tour never stalls.

export interface TourStep {
  /** Route to be on for this step (the tour navigates here first). */
  route: string
  /** The `data-tour` value to spotlight, if any (omit for a centered welcome/close). */
  target?: string
  title: string
  body: string
}

export const TOUR: TourStep[] = [
  {
    route: '/meditate',
    title: 'Welcome — let me show you around',
    body: 'I’m your little guide. I’ll walk you through Quiet Waters, one stop at a time. Tap Next to follow along.',
  },
  {
    route: '/meditate',
    target: 'verse',
    title: 'A verse to dwell on',
    body: 'Sit with the day’s verse. “New” gives you another, and “Share” turns it into a quiet image to send someone.',
  },
  {
    route: '/meditate',
    target: 'begin',
    title: 'Be still',
    body: 'Choose how long, then tap Begin — a gentle, timed sitting with soft chimes and breath pacing. Guided sittings are just below.',
  },
  {
    route: '/journey',
    target: 'journey-stats',
    title: 'Your journey',
    body: 'Every quiet moment is counted here — your streak, your sittings, and the prayers you’re holding before God.',
  },
  {
    route: '/study',
    target: 'study',
    title: 'Deep Dive',
    body: 'Studies and devotionals to walk slowly through Scripture — the Seven Churches, the Ten Virgins, the Seven Last Plagues, and more.',
  },
  {
    route: '/bible',
    target: 'bible',
    title: 'The Word',
    body: 'Read the whole Bible — tap a verse to highlight it, add a note, or hide it in your heart to memorize.',
  },
  {
    route: '/enoch',
    target: 'enoch',
    title: 'The Books of Enoch',
    body: 'The complete Books of Enoch too — the public-domain text, read beautifully, and fully offline.',
  },
  {
    route: '/settings',
    target: 'reminder',
    title: 'Make it yours',
    body: 'Turn on a gentle daily reminder so I can nudge you to be still. Music, day or night, and a backup of everything live here too.',
  },
  {
    route: '/meditate',
    target: 'lamb',
    title: 'That’s me',
    body: 'Tap me in the corner anytime — for a little tip, or to take this tour again. You can turn me off in Settings whenever you like.',
  },
  {
    route: '/meditate',
    title: 'Be still, and know',
    body: 'That’s the tour. Wherever you wander, I’m close by. “Be still, and know that He is God.”',
  },
]
