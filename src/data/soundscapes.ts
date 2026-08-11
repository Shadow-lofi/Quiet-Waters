import type { Soundscape } from '../lib/types'

export interface SoundscapeInfo {
  id: Soundscape
  label: string
  hint: string
}

// The soundscapes offered in Settings, in display order. Each is generated live
// by the Web Audio engine in lib/ambient.ts — no audio files.
export const SOUNDSCAPES: SoundscapeInfo[] = [
  { id: 'off', label: 'Off', hint: 'Silence' },
  { id: 'rain', label: 'Rain', hint: 'Light drops on the pane' },
  { id: 'stream', label: 'Stream', hint: 'A gentle brook' },
  { id: 'waves', label: 'Waves', hint: 'Shore break, gulls far off' },
  { id: 'fire', label: 'Fire', hint: 'A crackling hearth' },
]
