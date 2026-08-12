import { create } from 'zustand'
import { useToast } from './toast'

// Service-worker registration + the "a new version is ready" flow.
//
// The worker precaches the shell on install but WAITS instead of auto-activating
// (see public/sw.js), so a deploy never swaps a running session's assets out from
// under someone mid-sitting. When an update finishes installing we surface a
// gentle, persistent toast AND flip the `useAppUpdate` store below, which the
// Updates page reads to show the version and offer a one-tap update. Accepting it
// tells the waiting worker to take over and reloads once onto the fresh assets.

interface AppUpdateState {
  ready: boolean // a newer build is installed and waiting to activate
  checking: boolean // a manual "check for updates" is in flight
  apply: () => void // activate the waiting worker and reload
  check: () => Promise<void> // ask the browser to look for a newer build
}

let registration: ServiceWorkerRegistration | null = null
let waitingWorker: ServiceWorker | null = null
let reloading = false
let prompted = false

export const useAppUpdate = create<AppUpdateState>((set, get) => ({
  ready: false,
  checking: false,
  apply: () => {
    if (!waitingWorker) {
      window.location.reload()
      return
    }
    // Reload exactly once, after the fresh worker takes control — this is what
    // swaps in the new assets. Guarded so we never loop.
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => {
        if (reloading) return
        reloading = true
        window.location.reload()
      },
      { once: true },
    )
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  },
  check: async () => {
    if (!registration || get().checking) return
    set({ checking: true })
    try {
      await registration.update()
    } catch {
      /* offline or fetch failed — treat as "no update found" below */
    }
    // Give the browser a moment to fire updatefound/statechange, then settle.
    window.setTimeout(() => {
      set({ checking: false })
      if (!get().ready) {
        useToast.getState().push({ tone: 'success', title: 'You’re on the latest version' })
      }
    }, 1500)
  },
}))

function markReady(worker: ServiceWorker) {
  waitingWorker = worker
  useAppUpdate.setState({ ready: true, checking: false })
}

// Take the user to the Updates page (client-side, no reload) so they can see
// what changed and install from the "Update now" button there.
function openUpdatesPage() {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== '/updates') {
    window.history.pushState({}, '', '/updates')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

function promptUpdate(worker: ServiceWorker) {
  markReady(worker)
  if (prompted) return // one toast per page load, even if checks fire twice
  prompted = true
  useToast.getState().push({
    title: 'A new version is ready',
    message: 'Open Updates to see what changed and install it.',
    tone: 'water',
    duration: 0, // persist until the user acts on it
    action: { label: 'Review update', onClick: openUpdatesPage },
  })
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        registration = reg

        // An update finished installing on a previous visit and is still waiting.
        if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting)

        // An update starts installing now — prompt once it's ready to activate.
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            // `installed` + an existing controller == an update (not first run).
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              promptUpdate(installing)
            }
          })
        })
      })
      .catch(() => {})
  })
}
