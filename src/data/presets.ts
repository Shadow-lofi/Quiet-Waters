// Duration presets (minutes) offered on the setup screen. Custom lengths are
// still possible via the stepper.
export const DURATION_PRESETS = [3, 5, 10, 15, 20, 30]

export interface BreathPattern {
  inhale: number // seconds
  hold: number
  exhale: number
  holdOut: number
  label: string
}

// The breathing guide's timing per pace. Kept unhurried — exhales are longer
// than inhales, which is what actually settles the nervous system.
export const BREATH_PATTERNS: Record<'gentle' | 'calm' | 'deep', BreathPattern> = {
  gentle: { inhale: 4, hold: 0, exhale: 6, holdOut: 0, label: 'Gentle · 4–6' },
  calm: { inhale: 4, hold: 4, exhale: 6, holdOut: 2, label: 'Calm · 4–4–6–2' },
  deep: { inhale: 5, hold: 5, exhale: 5, holdOut: 5, label: 'Deep · box 5' },
}

// A slower, hold-less rhythm just for the YHWH "Breath of God" prayer, so the
// Name rests fully on one long, unhurried in-and-out breath. Used whenever the
// name-breath visual is active, regardless of the chosen pace (see BreathCircle).
export const NAME_BREATH_PATTERN: BreathPattern = {
  inhale: 4.5,
  hold: 0,
  exhale: 7,
  holdOut: 0,
  label: 'The Name · 4.5–7',
}
