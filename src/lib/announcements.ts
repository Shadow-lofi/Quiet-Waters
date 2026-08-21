import { create } from 'zustand'

// The announcements feed — server-authored notices that appear in the inbox
// (and can be pushed too). It's just a static JSON file the app fetches, so
// publishing an announcement is a one-line edit + deploy; no backend. Fetched
// once per app load, network-first (see the /announcements.json branch in
// public/sw.js) so a fresh deploy is seen promptly, with the last copy served
// offline.

export interface Announcement {
  id: string // stable — used for the dismissal ("done") memory
  title: string
  body: string
  url?: string // where tapping it leads (defaults to /updates)
  date?: string // ISO date, for ordering (newest first)
}

interface FeedState {
  items: Announcement[]
  loaded: boolean
  load: () => Promise<void>
}

export const useAnnouncements = create<FeedState>((set, get) => ({
  items: [],
  loaded: false,
  load: async () => {
    if (get().loaded) return
    set({ loaded: true }) // mark first so concurrent callers don't double-fetch
    try {
      const res = await fetch('/announcements.json', { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as unknown
      if (!Array.isArray(data)) return
      const items = data.filter(
        (a): a is Announcement =>
          !!a && typeof a.id === 'string' && typeof a.title === 'string' && typeof a.body === 'string',
      )
      items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
      set({ items })
    } catch {
      // Offline or malformed — the inbox simply shows no announcements.
    }
  },
}))
