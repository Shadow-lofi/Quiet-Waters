// The little lamb — the gentle guide who walks the user through Quiet Waters.
// A nod to the Shepherd who leads beside still waters (Psalm 23): a woolly lamb
// with a calm face, a faint halo, and a ripple of still water beneath.
//
// The fleece and face use fixed colors so the lamb stays the same warm little
// character in both the light and night themes; only the halo and the water
// ripple use `currentColor`, so they take on whatever accent it's placed in.

export function Lamb({
  size = 120,
  className = '',
  wave = false,
  waveKey,
}: {
  size?: number
  className?: string
  /** Raise a little foreleg and wave hello (used for the corner lamb). */
  wave?: boolean
  /** Bump to replay the wave — the raised arm remounts, restarting its animation. */
  waveKey?: number
}) {
  // The fleece silhouette — bumps drawn twice: a slightly larger grey layer
  // behind gives a clean, seam-free outline that reads on white or dark cards.
  const puffs: [number, number, number][] = [
    [60, 72, 17], // solid middle
    [44, 60, 10],
    [60, 55, 11],
    [76, 60, 10],
    [35, 72, 10],
    [85, 72, 10],
    [48, 86, 11],
    [72, 86, 11],
    [60, 89, 12],
  ]
  // The woolly cap over the top of the face.
  const forelock: [number, number, number][] = [
    [48, 43, 7],
    [60, 40, 8],
    [72, 43, 7],
  ]

  const WOOL = '#f6f9fa'
  const WOOL_EDGE = '#cddfe5'
  const FACE = '#5b7a84'
  const FACE_EDGE = '#4a6b76'
  const INK = '#20343b'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label="A little lamb"
    >
      {/* still water beneath — inherits the accent color */}
      <ellipse cx="60" cy="108" rx="33" ry="5.5" fill="currentColor" opacity="0.16" />
      <ellipse cx="60" cy="108" rx="19" ry="3" fill="currentColor" opacity="0.24" />

      {/* a faint halo — the Lamb who leads */}
      <ellipse
        cx="60"
        cy="26"
        rx="20"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.4"
      />

      {/* little hooves peeking beneath the fleece */}
      <rect x="49" y="95" width="8" height="9" rx="4" fill={FACE_EDGE} />
      <rect x="63" y="95" width="8" height="9" rx="4" fill={FACE_EDGE} />

      {/* ears, tucked under the forelock */}
      <g fill={FACE}>
        <ellipse cx="40" cy="51" rx="8" ry="5" transform="rotate(-24 40 51)" />
        <ellipse cx="80" cy="51" rx="8" ry="5" transform="rotate(24 80 51)" />
      </g>

      {/* fleece — grey edge layer, then the wool on top */}
      <g fill={WOOL_EDGE}>
        {puffs.map(([cx, cy, r], i) => (
          <circle key={`be-${i}`} cx={cx} cy={cy} r={r + 2.5} />
        ))}
      </g>
      <g fill={WOOL}>
        {puffs.map(([cx, cy, r], i) => (
          <circle key={`b-${i}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>

      {/* face */}
      <ellipse cx="60" cy="53" rx="14.5" ry="13.5" fill={FACE} />

      {/* woolly forelock over the top of the face */}
      <g fill={WOOL_EDGE}>
        {forelock.map(([cx, cy, r], i) => (
          <circle key={`fe-${i}`} cx={cx} cy={cy} r={r + 2.5} />
        ))}
      </g>
      <g fill={WOOL}>
        {forelock.map(([cx, cy, r], i) => (
          <circle key={`f-${i}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>

      {/* a calm little face */}
      <circle cx="53.5" cy="54" r="2.6" fill={INK} />
      <circle cx="66.5" cy="54" r="2.6" fill={INK} />
      <circle cx="52.7" cy="53.1" r="0.9" fill={WOOL} opacity="0.85" />
      <circle cx="65.7" cy="53.1" r="0.9" fill={WOOL} opacity="0.85" />
      {/* soft cheeks */}
      <ellipse cx="49" cy="60" rx="3.6" ry="2.4" fill="#e7a7a0" opacity="0.5" />
      <ellipse cx="71" cy="60" rx="3.6" ry="2.4" fill="#e7a7a0" opacity="0.5" />
      {/* nose + gentle smile */}
      <ellipse cx="60" cy="60.5" rx="2.4" ry="1.8" fill={FACE_EDGE} />
      <path
        d="M55.5 64 Q60 68 64.5 64"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* a little foreleg raised in a wave — only during the entrance. It swings
          from the shoulder (see the qw-lamb-arm keyframes in index.css). */}
      {wave && (
        <g key={waveKey} className="qw-lamb-arm">
          <line
            x1="83"
            y1="67"
            x2="97"
            y2="43"
            stroke={FACE_EDGE}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="98" cy="42" r="5" fill={FACE_EDGE} />
        </g>
      )}
    </svg>
  )
}
