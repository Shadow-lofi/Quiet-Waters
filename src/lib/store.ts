import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dayKey } from './date'
import type { BreathPace, MotionPref, Session, Soundscape, ThemePref } from './types'

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

  // ── setup memory ──
  lastDurationMin: number
  verseCursor: number // which meditation verse is showing

  // ── actions ──
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
