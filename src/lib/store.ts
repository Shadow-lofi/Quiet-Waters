import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dayKey } from './date'
import { newMemoryVerse, reviewOutcome } from '../data/memory'
import type {
  BreathPace,
  MemoryVerse,
  MotionPref,
  PrayerCategory,
  PrayerRequest,
  SavedVerse,
  Session,
  SoulCheckin,
  Soundscape,
  ThemePref,
} from './types'

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

  // ── reader narration (text-to-speech) ──
  narrationVoiceURI: string | null // chosen speechSynthesis voiceURI, null = auto-pick
  narrationRate: number // speaking rate (0.8 slower … 1.15 faster)
  narrationContinuous: boolean // keep reading into the next chapter when one ends

  // ── gentle reminder (local, no server) ──
  reminderOn: boolean
  reminderTime: string // 'HH:MM' 24-hour, local time
  reminderDismissedDay: string // dayKey the in-app banner was last dismissed
  reminderNotifiedDay: string // dayKey a device notification last fired

  // ── weekly Sabbath rhythm (local) ──
  sabbathDay: number // 0=Sun..6=Sat (JS getDay); the day set apart to rest
  sabbathLog: string[] // dayKeys the user chose to "keep the Sabbath"
  sabbathReminderOn: boolean // a gentle device notification on the Sabbath
  sabbathReminderTime: string // 'HH:MM' 24-hour, local time
  sabbathNotifiedDay: string // dayKey a Sabbath notification last fired

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

  // ── enoch study ──
  enochBook: string // book id (see ENOCH_BOOKS)
  enochChapter: number

  // ── prayer list (local, private) ──
  prayers: PrayerRequest[]

  // ── soul check-ins (local, private) ──
  soulLog: SoulCheckin[]

  // ── scripture memory (local, private) — verses hidden in the heart ──
  memoryVerses: MemoryVerse[]

  // ── devotional series (local) ──
  devotionalProgress: Record<string, number[]> // seriesId → completed day indices
  devotionalActive: string | null // the series to resume on the home screen
  devotionalReflections: Record<string, string> // "seriesId:day" → a private line

  // ── kids Bible study — ids of stories the child has finished ──
  kidStudiesDone: string[]

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
  setEnochRef: (book: string, chapter: number) => void
  addPrayer: (text: string, category?: PrayerCategory) => void
  answerPrayer: (id: string, note?: string) => void
  reopenPrayer: (id: string) => void
  removePrayer: (id: string) => void
  startDevotional: (seriesId: string) => void
  completeDevotionalDay: (seriesId: string, day: number) => void
  resetDevotional: (seriesId: string) => void
  setDevotionalReflection: (seriesId: string, day: number, text: string) => void
  logSoul: (state: string) => void
  addMemoryVerse: (ref: string, text: string, translation?: string) => void
  removeMemoryVerse: (ref: string) => void
  reviewMemoryVerse: (ref: string, recalled: boolean) => void
  completeStudy: (id: string) => void
  setName: (name: string) => void
  setOnboarded: (v: boolean) => void
  addSession: (s: Session) => void
  clearHistory: () => void
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void
  setLastDuration: (min: number) => void
  nextVerse: (total: number) => void
  dismissReminderToday: () => void
  markReminderNotified: () => void
  setSabbathDay: (day: number) => void
  keepSabbath: (dateKey: string) => void
  markSabbathNotified: () => void
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
  | 'narrationVoiceURI'
  | 'narrationRate'
  | 'narrationContinuous'
  | 'reminderOn'
  | 'reminderTime'
  | 'sabbathReminderOn'
  | 'sabbathReminderTime'
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

      narrationVoiceURI: null,
      narrationRate: 0.95,
      narrationContinuous: false,

      reminderOn: false,
      reminderTime: '08:00',
      reminderDismissedDay: '',
      reminderNotifiedDay: '',

      sabbathDay: 0, // Sunday by default
      sabbathLog: [],
      sabbathReminderOn: false,
      sabbathReminderTime: '09:00',
      sabbathNotifiedDay: '',

      installPromptDismissed: false,
      installCompleted: false,

      dismissedNotices: [],

      savedVerses: {},
      bibleBook: 'John',
      bibleChapter: 1,
      bibleTranslation: 'web',

      enochBook: '1-enoch',
      enochChapter: 1,

      prayers: [],
      soulLog: [],
      memoryVerses: [],
      devotionalProgress: {},
      devotionalActive: null,
      devotionalReflections: {},
      kidStudiesDone: [],

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

      setSabbathDay: (day) => set({ sabbathDay: day }),
      // Toggle whether the given day was kept as a Sabbath rest — a gentle count,
      // never a streak to fail.
      keepSabbath: (dateKey) =>
        set((st) => ({
          sabbathLog: st.sabbathLog.includes(dateKey)
            ? st.sabbathLog.filter((d) => d !== dateKey)
            : [dateKey, ...st.sabbathLog].slice(0, 500),
        })),
      markSabbathNotified: () => set({ sabbathNotifiedDay: dayKey() }),
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
      setEnochRef: (book, chapter) => set({ enochBook: book, enochChapter: chapter }),

      addPrayer: (text, category) =>
        set((st) => {
          const t = text.trim()
          if (!t) return st
          const prayer: PrayerRequest = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text: t.slice(0, 500),
            createdAt: Date.now(),
            ...(category ? { category } : {}),
          }
          return { prayers: [prayer, ...st.prayers].slice(0, 500) }
        }),
      answerPrayer: (id, note) =>
        set((st) => ({
          prayers: st.prayers.map((p) =>
            p.id === id
              ? { ...p, answeredAt: Date.now(), ...(note?.trim() ? { answeredNote: note.trim().slice(0, 300) } : {}) }
              : p,
          ),
        })),
      reopenPrayer: (id) =>
        set((st) => ({
          prayers: st.prayers.map((p) => {
            if (p.id !== id) return p
            const { answeredAt: _answeredAt, answeredNote: _answeredNote, ...rest } = p
            return rest
          }),
        })),
      removePrayer: (id) => set((st) => ({ prayers: st.prayers.filter((p) => p.id !== id) })),
      logSoul: (state) =>
        set((st) => ({ soulLog: [{ state, at: Date.now() }, ...st.soulLog].slice(0, 200) })),

      startDevotional: (seriesId) => set({ devotionalActive: seriesId }),
      completeDevotionalDay: (seriesId, day) =>
        set((st) => {
          const done = st.devotionalProgress[seriesId] ?? []
          if (done.includes(day)) return st
          return {
            devotionalActive: seriesId,
            devotionalProgress: {
              ...st.devotionalProgress,
              [seriesId]: [...done, day].sort((a, b) => a - b),
            },
          }
        }),
      resetDevotional: (seriesId) =>
        set((st) => {
          const next = { ...st.devotionalProgress }
          delete next[seriesId]
          return {
            devotionalProgress: next,
            devotionalActive: st.devotionalActive === seriesId ? null : st.devotionalActive,
          }
        }),
      setDevotionalReflection: (seriesId, day, text) =>
        set((st) => {
          const key = `${seriesId}:${day}`
          const next = { ...st.devotionalReflections }
          const t = text.trim()
          if (t) next[key] = t.slice(0, 1000)
          else delete next[key]
          return { devotionalReflections: next }
        }),

      addMemoryVerse: (ref, text, translation) =>
        set((st) => {
          const r = ref.trim()
          const t = text.trim()
          if (!r || !t || st.memoryVerses.some((v) => v.ref === r)) return st
          return {
            memoryVerses: [newMemoryVerse(r, t, translation), ...st.memoryVerses].slice(0, 500),
          }
        }),
      removeMemoryVerse: (ref) =>
        set((st) => ({ memoryVerses: st.memoryVerses.filter((v) => v.ref !== ref) })),
      reviewMemoryVerse: (ref, recalled) =>
        set((st) => ({
          memoryVerses: st.memoryVerses.map((v) =>
            v.ref === ref ? reviewOutcome(v, recalled) : v,
          ),
        })),
      completeStudy: (id) =>
        set((st) =>
          st.kidStudiesDone.includes(id)
            ? st
            : { kidStudiesDone: [id, ...st.kidStudiesDone] },
        ),
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
