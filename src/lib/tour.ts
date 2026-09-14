import { create } from 'zustand'
import { TOUR } from '../data/tour'

// The running state of the guided tour (see components/Tour.tsx and data/tour.ts).
// Kept in its own tiny store so any surface — the installed-app welcome, the
// corner lamb's tip, the guide page — can start it, and the LambHelper can hush
// its own tips while the tour is running.

interface TourState {
  active: boolean
  step: number
  start: () => void
  next: () => void
  back: () => void
  goTo: (step: number) => void
  stop: () => void
}

export const useTour = create<TourState>((set, get) => ({
  active: false,
  step: 0,
  start: () => set({ active: true, step: 0 }),
  next: () => {
    const n = get().step + 1
    if (n >= TOUR.length) set({ active: false, step: 0 })
    else set({ step: n })
  },
  back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
  goTo: (step) => set({ step: Math.max(0, Math.min(TOUR.length - 1, step)) }),
  stop: () => set({ active: false, step: 0 }),
}))
