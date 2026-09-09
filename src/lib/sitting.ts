// A tiny flag for whether a meditation sitting is currently on screen (the
// SessionOverlay). The guiding lamb reads this so its periodic tips stay quiet
// during a sitting — stillness shouldn't be interrupted. Not reactive by design;
// it's only ever read imperatively, the moment a tip is about to appear.

let active = false

export function setSittingActive(value: boolean): void {
  active = value
}

export function isSittingActive(): boolean {
  return active
}
