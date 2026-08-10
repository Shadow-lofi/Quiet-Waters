// The Quiet Waters mark: a drop meeting still water, sending out concentric
// ripples. Uses currentColor so it inherits whatever text color it's placed in.

export function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ripples */}
      <ellipse cx="32" cy="40" rx="24" ry="8" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <ellipse cx="32" cy="40" rx="15" ry="5" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      {/* the drop */}
      <path
        d="M32 10c0 0 11 13 11 21a11 11 0 1 1-22 0c0-8 11-21 11-21z"
        fill="currentColor"
        opacity="0.92"
      />
      {/* highlight */}
      <circle cx="28" cy="30" r="3" fill="var(--color-mist-50)" opacity="0.5" />
    </svg>
  )
}
