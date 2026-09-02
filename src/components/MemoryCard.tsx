import { MemorySymbolMark } from './MemorySymbol'
import { STAGE_LABEL, stageOf } from '../data/memory'
import type { MemoryVerse } from '../lib/types'

/**
 * A memory verse as a flip flashcard. The front wears a reverent symbol and the
 * reference — you recite from memory — and tapping flips it to reveal the verse
 * to check yourself. Both faces share one grid cell so the card sizes to the
 * longer face (no clipped verses), flipped in 3D. Controlled by the parent so a
 * review session can reset the flip between cards.
 */
export function MemoryCard({
  verse,
  flipped,
  onFlip,
}: {
  verse: MemoryVerse
  flipped: boolean
  onFlip: () => void
}) {
  const stage = STAGE_LABEL[stageOf(verse)]

  return (
    <div className="[perspective:1200px]">
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? 'Tap to hide the verse' : `Reveal ${verse.ref}`}
        className="relative grid min-h-[16rem] w-full rounded-card text-left transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : undefined }}
      >
        {/* front — symbol + reference */}
        <span className="flex flex-col items-center justify-center gap-4 rounded-card bg-gradient-to-br from-mist-200/70 to-card p-8 text-center shadow-sm ring-1 ring-water-500/25 [grid-area:1/1] [backface-visibility:hidden]">
          <span className="absolute right-4 top-4 rounded-full bg-mist-200/80 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-water-600">
            {stage}
          </span>
          <MemorySymbolMark id={verse.symbol} size={84} className="text-water-500" />
          <span className="font-serif text-2xl leading-tight text-deep-900">{verse.ref}</span>
          <span className="text-xs uppercase tracking-[0.18em] text-deep-400">Recite it, then tap</span>
        </span>

        {/* back — the verse revealed */}
        <span className="flex flex-col items-center justify-center gap-3 rounded-card bg-card p-8 text-center shadow-sm ring-1 ring-line [grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="font-serif text-xl leading-relaxed text-deep-900">
            “{verse.text}”
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-water-600">{verse.ref}</span>
          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-deep-300">Tap to flip back</span>
        </span>
      </button>
    </div>
  )
}
