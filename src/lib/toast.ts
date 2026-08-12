import { create } from 'zustand'

// A tiny, gentle toast queue. Used for the "link copied" note and the
// persistent "a new version is ready" prompt (see lib/swUpdate.ts).

export type ToastTone = 'default' | 'success' | 'water'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: string
  title: string
  message?: string
  tone: ToastTone
  action?: ToastAction
}

interface ToastState {
  toasts: Toast[]
  push: (t: {
    title: string
    message?: string
    tone?: ToastTone
    duration?: number
    action?: ToastAction
  }) => void
  dismiss: (id: string) => void
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  push: ({ title, message, tone = 'default', duration = 4000, action }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    set((s) => ({ toasts: [...s.toasts, { id, title, message, tone, action }] }))
    // A duration of 0 (or Infinity) keeps the toast up until it's acted on or
    // dismissed — used for the "new version ready" prompt.
    if (duration > 0 && Number.isFinite(duration)) {
      window.setTimeout(() => get().dismiss(id), duration)
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
