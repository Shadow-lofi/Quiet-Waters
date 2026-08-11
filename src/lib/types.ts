// Appearance preference. 'auto' follows the OS light/dark setting.
export type ThemePref = 'day' | 'night' | 'auto'

// Breath-prayer pacing for the breathing guide. 'off' shows a still circle.
export type BreathPace = 'off' | 'gentle' | 'calm' | 'deep'

// Optional ambient sound played during a sitting. All synthesized in-browser.
export type Soundscape = 'off' | 'rain' | 'stream' | 'waves' | 'fire'

// One completed (or ended-early) meditation sitting.
export interface Session {
  id: string
  endedAt: string // ISO timestamp
  plannedSec: number // the duration the user chose
  actualSec: number // how long they actually sat
  completed: boolean // reached the closing chime (vs. ended early)
  verseRef?: string // the Scripture they dwelt on
}
