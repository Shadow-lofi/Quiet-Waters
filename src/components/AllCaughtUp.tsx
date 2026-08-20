import { Check } from 'lucide-react'

/**
 * The rest state for an empty notifications inbox: a slender, glowing cross
 * hovering over a calm lake with a soft reflection and ripples. Built entirely
 * on the app's --color-* tokens, so it flips with the Day/Night theme on its
 * own, and the cross's gentle float honours the reduced-motion preference
 * (see the .qw-float rules in index.css).
 */
export function AllCaughtUp() {
  return (
    <div className="qw-enter flex flex-col items-center px-4 py-4 text-center">
      <div className="w-full max-w-[320px] overflow-hidden rounded-card shadow-sm ring-1 ring-line">
        <svg viewBox="0 0 320 210" role="img" className="block h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          <title>A cross hovering over a calm lake at first light</title>
          <desc>
            A slender glowing cross floats above the still surface of a lake, casting a soft
            reflection, with gentle ripples spreading beneath it.
          </desc>
          <defs>
            <linearGradient id="ac-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-mist-50)" />
              <stop offset="1" stopColor="var(--color-mist-100)" />
            </linearGradient>
            <linearGradient id="ac-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-mist-200)" />
              <stop offset="1" stopColor="var(--color-mist-300)" />
            </linearGradient>
            <radialGradient id="ac-halo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="var(--color-water-300)" stopOpacity="0.45" />
              <stop offset="0.55" stopColor="var(--color-water-300)" stopOpacity="0.15" />
              <stop offset="1" stopColor="var(--color-water-300)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ac-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-water-300)" />
              <stop offset="1" stopColor="var(--color-water-500)" />
            </linearGradient>
            <filter id="ac-soft" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="ac-softer" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <clipPath id="ac-lake">
              <rect x="0" y="132" width="320" height="78" />
            </clipPath>
          </defs>

          {/* sky + dawn halo */}
          <rect x="0" y="0" width="320" height="132" fill="url(#ac-sky)" />
          <ellipse cx="160" cy="86" rx="120" ry="104" fill="url(#ac-halo)" />

          {/* light specks */}
          <circle cx="96" cy="52" r="1.6" fill="var(--color-onwater)" opacity="0.8" />
          <circle cx="228" cy="44" r="1.9" fill="var(--color-onwater)" opacity="0.7" />
          <circle cx="214" cy="96" r="1.4" fill="var(--color-onwater)" opacity="0.6" />
          <circle cx="104" cy="104" r="1.3" fill="var(--color-onwater)" opacity="0.55" />

          {/* lake */}
          <rect x="0" y="132" width="320" height="78" fill="url(#ac-water)" />
          <rect x="0" y="132" width="320" height="78" fill="var(--color-water-400)" opacity="0.1" />
          <g clipPath="url(#ac-lake)" stroke="var(--color-water-300)" fill="none" strokeLinecap="round">
            <line x1="18" y1="150" x2="70" y2="150" opacity="0.18" strokeWidth="2" />
            <line x1="250" y1="146" x2="304" y2="146" opacity="0.16" strokeWidth="2" />
            <line x1="44" y1="176" x2="120" y2="176" opacity="0.14" strokeWidth="2" />
            <line x1="206" y1="182" x2="286" y2="182" opacity="0.13" strokeWidth="2" />
            <line x1="132" y1="196" x2="196" y2="196" opacity="0.12" strokeWidth="2" />
          </g>

          {/* reflection of the cross — foreshortened, faded, blurred */}
          <g clipPath="url(#ac-lake)" filter="url(#ac-soft)" opacity="0.5">
            <rect x="155.5" y="134" width="9" height="50" rx="4.5" fill="var(--color-water-300)" />
            <rect x="139" y="150" width="42" height="8" rx="4" fill="var(--color-water-300)" />
          </g>
          {/* ripple bands breaking the reflection */}
          <g clipPath="url(#ac-lake)" stroke="var(--color-mist-200)" strokeWidth="2.4" opacity="0.7">
            <line x1="150" y1="146" x2="170" y2="146" />
            <line x1="148" y1="162" x2="172" y2="162" />
            <line x1="152" y1="176" x2="168" y2="176" />
          </g>

          {/* expanding ripple rings where the cross meets the water */}
          <g fill="none" stroke="var(--color-water-300)">
            <ellipse cx="160" cy="133" rx="26" ry="5" strokeWidth="1.6" opacity="0.5" />
            <ellipse cx="160" cy="133" rx="44" ry="8" strokeWidth="1.4" opacity="0.3" />
            <ellipse cx="160" cy="133" rx="64" ry="11" strokeWidth="1.2" opacity="0.16" />
          </g>

          {/* the hovering cross */}
          <g className="qw-float">
            <g filter="url(#ac-softer)" opacity="0.7">
              <rect x="153" y="40" width="14" height="82" rx="7" fill="var(--color-water-300)" />
              <rect x="132" y="59" width="56" height="14" rx="7" fill="var(--color-water-300)" />
            </g>
            <rect x="154.5" y="42" width="11" height="78" rx="5.5" fill="url(#ac-beam)" />
            <rect x="134" y="60.5" width="52" height="11" rx="5.5" fill="url(#ac-beam)" />
            <rect x="156.5" y="44" width="3.4" height="74" rx="1.7" fill="var(--color-onwater)" opacity="0.35" />
          </g>

          {/* reeds, lower left */}
          <g fill="none" stroke="var(--color-reed-500)" strokeLinecap="round" opacity="0.85">
            <path d="M34 210 C33 188 30 176 40 158" strokeWidth="2.6" />
            <path d="M46 210 C47 190 50 180 44 166" strokeWidth="2.2" opacity="0.75" />
            <path d="M24 210 C24 196 22 190 30 180" strokeWidth="2.2" opacity="0.65" />
          </g>
        </svg>
      </div>

      <h2 className="mt-6 text-2xl">All caught up</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-deep-500">
        Nothing left to tend. Be still, and rest in the quiet.
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-water-500/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-water-600">
        <Check size={13} /> Inbox clear
      </span>
    </div>
  )
}
