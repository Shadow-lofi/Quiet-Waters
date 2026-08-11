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
  { id: 'fire', label: 'Fire', hint: 'A crackling hearth' },
  { id: 'leaves', label: 'Leaves', hint: 'Wind through the leaves' },
  { id: 'bowls', label: 'Bowls', hint: 'Crystal singing bowls' },
]
