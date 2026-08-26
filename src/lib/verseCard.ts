// Renders a shareable verse "card" image entirely on a <canvas> — a soft Still
// Waters gradient with the verse and reference laid over it, plus a quiet
// wordmark. No libraries, no external assets, no canvas tainting, so the result
// exports cleanly via toBlob and can be shared as a file or downloaded.
//
// Gradient-only by design (no photo picker / IndexedDB) — the same "study
// essentials" restraint the reading tabs keep. Web-safe fonts (Georgia / system
// sans) so nothing has to load before we paint.
import { DISPLAY_URL } from './share'

const SIZE = 1080

export interface CardBackground {
  id: string
  label: string
  from: string
  to: string
}

// Deep, calm gradients from the "Still Waters" palette — all dark enough to
// hold light text without a scrim.
export const CARD_BACKGROUNDS: CardBackground[] = [
  { id: 'deep', label: 'Deep', from: '#22454f', to: '#10222b' },
  { id: 'still', label: 'Still', from: '#256f82', to: '#15303a' },
  { id: 'dawn', label: 'Dawn', from: '#4dacbc', to: '#245f70' },
  { id: 'reed', label: 'Reed', from: '#315a66', to: '#1a3b34' },
]

const TEXT_COLOR = '#f3fbfd' // onwater — light in both themes

/** Plain-text form for copy / text-share. */
export function verseShareText(ref: string, text: string, translationShort?: string): string {
  const tag = translationShort ? ` (${translationShort})` : ''
  return `“${text}”\n— ${ref}${tag}\n\nvia Quiet Waters · ${DISPLAY_URL}`
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

// Largest font (within a range) whose wrapped block still fits the card.
function fitVerse(ctx: CanvasRenderingContext2D, quoted: string, maxWidth: number) {
  const maxBlock = SIZE - 420
  for (let fs = 64; fs >= 26; fs -= 2) {
    ctx.font = `italic 500 ${fs}px Georgia, 'Times New Roman', serif`
    const lines = wrapText(ctx, quoted, maxWidth)
    if (lines.length * fs * 1.42 <= maxBlock) return { fs, lines }
  }
  ctx.font = `italic 500 26px Georgia, serif`
  return { fs: 26, lines: wrapText(ctx, quoted, maxWidth) }
}

interface RenderOpts {
  text: string
  ref: string
  translationShort?: string
  background: CardBackground
}

/** Render the verse card and return it as a JPEG blob (1080×1080). */
export async function renderVerseImage(opts: RenderOpts): Promise<Blob> {
  const { text, ref, translationShort, background } = opts
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unavailable')

  // Ground gradient.
  const g = ctx.createLinearGradient(0, 0, SIZE * 0.35, SIZE)
  g.addColorStop(0, background.from)
  g.addColorStop(1, background.to)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, SIZE, SIZE)

  // A faint pool of light near the top, like sun catching the surface.
  const glow = ctx.createRadialGradient(SIZE / 2, SIZE * 0.28, 0, SIZE / 2, SIZE * 0.28, SIZE * 0.7)
  glow.addColorStop(0, 'rgba(182,224,232,0.16)') // water-200-ish
  glow.addColorStop(1, 'rgba(182,224,232,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, SIZE, SIZE)

  ctx.fillStyle = TEXT_COLOR
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.28)'
  ctx.shadowBlur = 12

  const maxWidth = SIZE - 220
  const { fs, lines } = fitVerse(ctx, `“${text}”`, maxWidth)
  const lineHeight = fs * 1.42
  let y = SIZE / 2 - (lines.length * lineHeight) / 2 + lineHeight / 2 - 20
  for (const line of lines) {
    ctx.fillText(line, SIZE / 2, y)
    y += lineHeight
  }
  ctx.shadowBlur = 0

  // Reference (+ translation), a little below the verse.
  ctx.font = `600 34px Georgia, 'Times New Roman', serif`
  ctx.fillText(`${ref}${translationShort ? `  ·  ${translationShort}` : ''}`, SIZE / 2, y + 30)

  // Quiet wordmark + link at the foot.
  ctx.globalAlpha = 0.9
  ctx.font = `600 30px -apple-system, "Segoe UI", Roboto, sans-serif`
  ctx.fillText('Quiet Waters', SIZE / 2, SIZE - 92)
  ctx.globalAlpha = 0.62
  ctx.font = `500 24px -apple-system, "Segoe UI", Roboto, sans-serif`
  ctx.fillText(DISPLAY_URL, SIZE / 2, SIZE - 56)
  ctx.globalAlpha = 1

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.92)
  })
}

/** Share the rendered card via the native sheet, or download it as a fallback. */
export async function shareOrDownloadImage(
  blob: Blob,
  ref: string,
): Promise<'shared' | 'downloaded'> {
  const filename = `${ref.replace(/[^\w]+/g, '-').toLowerCase() || 'verse'}.jpg`
  const file = new File([blob], filename, { type: 'image/jpeg' })
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  if (typeof nav.share === 'function' && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: ref })
      return 'shared'
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return 'shared' // cancelled — don't also download
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}
