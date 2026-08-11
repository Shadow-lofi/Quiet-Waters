// Appearance preference. 'auto' follows the OS light/dark setting; 'cycle'
// follows the local time of day (light by day, dark by night).
export type ThemePref = 'day' | 'night' | 'auto' | 'cycle'

// Breath-prayer pacing for the breathing guide. 'off' shows a still circle.
export type BreathPace = 'off' | 'gentle' | 'calm' | 'deep'

// Optional ambient sound played during a sitting. All synthesized in-browser.
export type Soundscape = 'off' | 'fire' | 'leaves' | 'bowls'

// Animation preference. 'system' follows the OS reduced-motion setting; 'on'
// forces the gentle animations even when the OS asks to reduce motion; 'off'
// disables them regardless.
export type MotionPref = 'system' | 'on' | 'off'

// One completed (or ended-early) meditation sitting.
export interface Session {
  id: string
  endedAt: string // ISO timestamp
  plannedSec: number // the duration the user chose
  actualSec: number // how long they actually sat
  completed: boolean // reached the closing chime (vs. ended early)
  verseRef?: string // the Scripture they dwelt on
}
