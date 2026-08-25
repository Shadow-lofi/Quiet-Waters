import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dayKey } from './date'
import type { BreathPace, MotionPref, SavedVerse, Session, Soundscape, ThemePref } from './types'

// The whole app is local-first: everything lives in this one persisted store,
// so it works fully offline and keeps no account. (Cloud sync can come later.)

interface State {
  // ── profile (local only — no account) ──
  name: string
  onboarded: boolean

  // ── history ──
  sessions: Session[]

  // ── preferences ──
  theme: ThemePref
  soundOn: boolean
  openingChime: boolean
  closingChime: boolean
  intervalMin: number // 0 = no interval bell
  breathPace: BreathPace
  keepAwake: boolean
  soundscape: Soundscape // ambient sound during a sitting ('off' = silence)
  ambientVolume: number // 0–1
  motion: MotionPref // whether the gentle animations run
  breatheName: boolean // free timer: pray the Name (Yah/weh) instead of the verse

  // ── gentle reminder (local, no server) ──
  reminderOn: boolean
  reminderTime: string // 'HH:MM' 24-hour, local time
  reminderDismissedDay: string // dayKey the in-app banner was last dismissed
  reminderNotifiedDay: string // dayKey a device notification last fired

  // ── install invite (browser only) ──
  installPromptDismissed: boolean // user tapped X — hide the banner for good
  installCompleted: boolean // the app was actually installed — stop prompting

  // ── notifications inbox ──
  // Ids the user has checked off: announcement feed ids, and 'onthisday-<dayKey>'
  // for the local "on this day" card. Kept bounded.
  dismissedNotices: string[]

  // ── bible reader ──
  savedVerses: Record<string, SavedVerse> // highlights/notes/bookmarks, keyed by ref
  bibleBook: string // resume where you left off
  bibleChapter: number
  bibleTranslation: string // bible-api.com translation id

  // ── setup memory ──
  lastDurationMin: number
  verseCursor: number // which meditation verse is showing

  // ── actions ──
  updateVerse: (
    ref: string,
    meta: { text: string; translation: string },
    patch: Partial<Pick<SavedVerse, 'color' | 'note' | 'label' | 'bookmarked'>>,
  ) => void
  removeSavedVerse: (ref: string) => void
  setBibleRef: (book: string, chapter: number) => void
  setBibleTranslation: (id: string) => void
  setName: (name: string) => void
  setOnboarded: (v: boolean) => void
  addSession: (s: Session) => void
  clearHistory: () => void
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void
  setLastDuration: (min: number) => void
  nextVerse: (total: number) => void
  dismissReminderToday: () => void
  markReminderNotified: () => void
  dismissInstallPrompt: () => void
  markInstalled: () => void
  dismissNotice: (id: string) => void
}

// The preference keys that setPref can write.
type Prefs = Pick<
  State,
  | 'theme'
  | 'soundOn'
  | 'openingChime'
  | 'closingChime'
  | 'intervalMin'
  | 'breathPace'
  | 'keepAwake'
  | 'soundscape'
  | 'ambientVolume'
  | 'motion'
  | 'breatheName'
  | 'reminderOn'
  | 'reminderTime'
>

export const useStore = create<State>()(
  persist(
    (set) => ({
      name: '',
      onboarded: false,

      sessions: [],

      theme: 'cycle',
      soundOn: true,
      openingChime: true,
      closingChime: true,
      intervalMin: 0,
      breathPace: 'gentle',
      keepAwake: true,
      soundscape: 'off',
      ambientVolume: 0.6,
      motion: 'on',
      breatheName: false,

      reminderOn: false,
      reminderTime: '08:00',
      reminderDismissedDay: '',
      reminderNotifiedDay: '',

      installPromptDismissed: false,
      installCompleted: false,

      dismissedNotices: [],

      savedVerses: {},
      bibleBook: 'John',
      bibleChapter: 1,
      bibleTranslation: 'web',

      lastDurationMin: 10,
      verseCursor: 0,

      setName: (name) => set({ name: name.slice(0, 40) }),
      setOnboarded: (v) => set({ onboarded: v }),
      addSession: (s) => set((st) => ({ sessions: [s, ...st.sessions].slice(0, 500) })),
      clearHistory: () => set({ sessions: [] }),
      setPref: (key, value) => set({ [key]: value } as Partial<State>),
      setLastDuration: (min) => set({ lastDurationMin: min }),
      nextVerse: (total) => set((st) => ({ verseCursor: (st.verseCursor + 1) % Math.max(1, total) })),
      dismissReminderToday: () => set({ reminderDismissedDay: dayKey() }),
      markReminderNotified: () => set({ reminderNotifiedDay: dayKey() }),
      dismissInstallPrompt: () => set({ installPromptDismissed: true }),
      markInstalled: () => set({ installCompleted: true }),
      dismissNotice: (id) =>
        set((st) =>
          st.dismissedNotices.includes(id)
            ? st
            : { dismissedNotices: [...st.dismissedNotices, id].slice(-200) },
        ),

      // Upsert a verse's highlight/note/label/bookmark; prune the record when
      // nothing is left on it.
      updateVerse: (ref, meta, patch) =>
        set((st) => {
          const prev =
            st.savedVerses[ref] ??
            ({ ref, text: meta.text, translation: meta.translation, createdAt: Date.now() } as SavedVerse)
          const next: SavedVerse = { ...prev, ...patch }
          if (!next.note?.trim()) delete next.note
          if (!next.label?.trim()) delete next.label
          if (!next.color) delete next.color
          if (!next.bookmarked) delete next.bookmarked
          const map = { ...st.savedVerses }
          if (next.color || next.note || next.label || next.bookmarked) map[ref] = next
          else delete map[ref]
          return { savedVerses: map }
        }),
      removeSavedVerse: (ref) =>
        set((st) => {
          const map = { ...st.savedVerses }
          delete map[ref]
          return { savedVerses: map }
        }),
      setBibleRef: (book, chapter) => set({ bibleBook: book, bibleChapter: chapter }),
      setBibleTranslation: (id) => set({ bibleTranslation: id }),
    }),
    {
      name: 'quiet-waters-v1',
      version: 7,
      // Retired soundscapes fall back to off. Dropped over versions: wind, rain,
      // stream, waves, leaves, bowls, guitar — leaving just fire.
      migrate: (persisted) => {
        const st = persisted as Partial<State>
        const retired = ['wind', 'rain', 'stream', 'waves', 'leaves', 'bowls', 'guitar']
        if (retired.includes(st.soundscape as string)) st.soundscape = 'off'
        return st as State
      },
    },
  ),
)
