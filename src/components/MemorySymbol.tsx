import type { MemorySymbol as SymbolId } from '../lib/types'

// Reverent line-art for a memory card's face. Each symbol is drawn in a 48×48
// box using currentColor, so it inherits the card's water/mist tone and stays
// theme-aware in day and night.
const PATHS: Record<SymbolId, React.ReactNode> = {
  // a drop meeting still water, sending out ripples — the Quiet Waters mark
  drop: (
    <>
      <ellipse cx="24" cy="37" rx="15" ry="4.5" fill="none" opacity="0.3" />
      <ellipse cx="24" cy="37" rx="9" ry="2.6" fill="none" opacity="0.55" />
      <path d="M24 7c0 0 9 11 9 17a9 9 0 1 1-18 0c0-6 9-17 9-17z" opacity="0.92" />
    </>
  ),
  cross: (
    <>
      <rect x="20.5" y="7" width="7" height="34" rx="2.2" opacity="0.92" />
      <rect x="12" y="16.5" width="24" height="7" rx="2.2" opacity="0.92" />
    </>
  ),
  flame: (
    <path
      d="M24 6c2 7 9 10 9 18a9 9 0 0 1-18 0c0-4 2.5-6.5 4.5-9 .8 2.7 2.4 3.2 3 1.5C23.2 14 22 11 24 6z"
      opacity="0.92"
    />
  ),
  crown: (
    <path
      d="M9 33 L13 16 L19.5 25 L24 13 L28.5 25 L35 16 L39 33 Z"
      opacity="0.92"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="M24 5c1.3 11 6.6 16.3 17.5 17.5C30.6 23.8 25.3 29.1 24 40c-1.3-10.9-6.6-16.2-17.5-17.5C17.4 21.3 22.7 16 24 5z"
      opacity="0.92"
    />
  ),
  book: (
    <>
      <path d="M24 13c-3.5-2.6-8-3-13-2v22c5-1 9.5-.6 13 2z" fill="none" opacity="0.9" />
      <path d="M24 13c3.5-2.6 8-3 13-2v22c-5-1-9.5-.6-13 2z" fill="none" opacity="0.9" />
      <line x1="24" y1="14.5" x2="24" y2="35" opacity="0.5" />
    </>
  ),
  heart: (
    <path
      d="M24 39C10 30 8 21 12.5 16.5c3.6-3.6 8.5-2 11.5 2 3-4 7.9-5.6 11.5-2C40 21 38 30 24 39z"
      opacity="0.92"
    />
  ),
  anchor: (
    <>
      <circle cx="24" cy="11" r="3.6" opacity="0.9" />
      <line x1="24" y1="14.5" x2="24" y2="39" opacity="0.9" />
      <line x1="16" y1="20" x2="32" y2="20" opacity="0.9" />
      <path d="M11 30c1.5 6 7 9 13 9s11.5-3 13-9" opacity="0.9" fill="none" />
    </>
  ),
}

export function MemorySymbolMark({
  id,
  size = 72,
  className = '',
}: {
  id: SymbolId
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[id] ?? PATHS.drop}
    </svg>
  )
}
