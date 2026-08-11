import type { CSSProperties } from 'react'

// A calm, decorative underwater layer that sits behind all app content: a few
// slow shafts of light drifting down through the water, with the occasional
// bubble rising. Purely presentational (aria-hidden, pointer-events-none), built
// from CSS transforms/opacity so it's cheap, and fully hidden under
// prefers-reduced-motion (see .qw-water in index.css). Colors flip with the
// theme via the --qw-ray / --qw-bubble tokens.

const RAYS: CSSProperties[] = [
  { left: '8%', animationDelay: '0s', animationDuration: '30s' },
  { left: '44%', animationDelay: '-11s', animationDuration: '36s' },
  { left: '73%', animationDelay: '-19s', animationDuration: '27s' },
]

// left, size(px), duration(s), delay(s), horizontal drift(px)
const BUBBLES = [
  { left: '12%', size: 10, dur: 25, delay: 0, drift: 14 },
  { left: '27%', size: 6, dur: 31, delay: 7, drift: -10 },
  { left: '45%', size: 14, dur: 21, delay: 12, drift: 9 },
  { left: '60%', size: 8, dur: 28, delay: 3, drift: -16 },
  { left: '77%', size: 5, dur: 34, delay: 15, drift: 12 },
  { left: '89%', size: 11, dur: 23, delay: 9, drift: -8 },
  { left: '52%', size: 7, dur: 30, delay: 19, drift: 18 },
]

export function WaterBackground() {
  return (
    <div
      aria-hidden="true"
      className="qw-water pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {RAYS.map((style, i) => (
        <span key={`ray-${i}`} className="qw-ray" style={style} />
      ))}
      {BUBBLES.map((b, i) => (
        <span
          key={`bubble-${i}`}
          className="qw-bubble"
          style={
            {
              left: b.left,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              '--drift': `${b.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
