import { SUPPORT_URL, SUPPORT_ENABLED } from '../lib/links'

/**
 * "Support me on Ko-fi" button — a native pill in Ko-fi's blue with their cup
 * mark (public/kofi-cup.png), self-hosted so it works offline and pulls in no
 * third-party code. Renders nothing until SUPPORT_URL points at a real page —
 * see lib/links.ts.
 */
export function SupportButton({ className = '' }: { className?: string }) {
  if (!SUPPORT_ENABLED) return null
  return (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Support Quiet Waters on Ko-fi"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.95rem] font-bold text-white shadow-sm transition-transform hover:opacity-95 active:scale-[0.98] ${className}`}
      style={{ backgroundColor: '#72a4f2' }}
    >
      <img src="/kofi-cup.png" alt="" aria-hidden="true" width={26} height={21} className="h-5 w-auto" />
      <span>Support me on Ko-fi</span>
    </a>
  )
}
