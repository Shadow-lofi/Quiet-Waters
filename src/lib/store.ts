import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BreathPace, Session, ThemePref } from './types'

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
}

// The preference keys that setPref can write.
type Prefs = Pick<
  State,
  'theme' | 'soundOn' | 'openingChime' | 'closingChime' | 'intervalMin' | 'breathPace' | 'keepAwake'
>

export const useStore = create<State>()(
  persist(
    (set) => ({
      name: '',
      onboarded: false,

      sessions: [],

      theme: 'night',
      soundOn: true,
      openingChime: true,
      closingChime: true,
      intervalMin: 0,
      breathPace: 'gentle',
      keepAwake: true,

      lastDurationMin: 10,
      verseCursor: 0,

      setName: (name) => set({ name: name.slice(0, 40) }),
      setOnboarded: (v) => set({ onboarded: v }),
      addSession: (s) => set((st) => ({ sessions: [s, ...st.sessions].slice(0, 500) })),
      clearHistory: () => set({ sessions: [] }),
      setPref: (key, value) => set({ [key]: value } as Partial<State>),
      setLastDuration: (min) => set({ lastDurationMin: min }),
      nextVerse: (total) => set((st) => ({ verseCursor: (st.verseCursor + 1) % Math.max(1, total) })),
    }),
    {
      name: 'quiet-waters-v1',
      version: 1,
    },
  ),
)
