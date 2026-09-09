// A tiny bridge between the opening intro splash and the app's own arrival
// animations (the guiding lamb wandering in and waving). The lamb waits to make
// its entrance until the app has been "entered" — i.e. the tap-to-enter splash
// has been dismissed — so it isn't performing behind the splash where no one can
// see it. When there's no splash at all, "entered" fires immediately.

let entered = false
const waiters = new Set<() => void>()

/** Mark the app as entered (past the splash). Idempotent; first call wins. */
export function markEntered(): void {
  if (entered) return
  entered = true
  for (const fn of [...waiters]) fn()
  waiters.clear()
}

export function hasEntered(): boolean {
  return entered
}

/**
 * Run `cb` once the app is entered — right away if it already is (no splash, or
 * it's already been dismissed), otherwise when the splash is next dismissed.
 * Returns an unsubscribe for the pending case.
 */
export function onEntered(cb: () => void): () => void {
  if (entered) {
    cb()
    return () => {}
  }
  waiters.add(cb)
  return () => {
    waiters.delete(cb)
  }
}
