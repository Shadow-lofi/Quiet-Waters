// Renders a 1920×1080 projector slide entirely on a <canvas> — a deep Still
// Waters gradient with the wordmark, a verse, and the QR, sized for a screen /
// announcement loop (dark, unlike the ink-friendly print flyer). No libraries;
// the QR is drawn from the same-origin PNG so the result exports cleanly.

const W = 1920
const H = 1080
const INK = '#f3fbfd' // onwater
const ACCENT = '#86cad6' // water-300

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// A rounded rectangle path (older Safari lacks ctx.roundRect).
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Render the projector slide and return it as a PNG blob (1920×1080). */
export async function renderSlideImage(): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unavailable')

  // Ground gradient + a soft pool of light.
  const g = ctx.createLinearGradient(0, 0, W * 0.5, H)
  g.addColorStop(0, '#22454f')
  g.addColorStop(1, '#0e1b24')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W * 0.32, H * 0.35, 0, W * 0.32, H * 0.35, W * 0.55)
  glow.addColorStop(0, 'rgba(134,202,214,0.14)')
  glow.addColorStop(1, 'rgba(134,202,214,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // ── Left column: brand + verse ──
  const x = 150
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Drop mark (from the Logo SVG path, 64-unit space).
  ctx.save()
  ctx.translate(x, 210)
  ctx.scale(88 / 64, 88 / 64)
  ctx.fillStyle = ACCENT
  ctx.fill(new Path2D('M32 10c0 0 11 13 11 21a11 11 0 1 1-22 0c0-8 11-21 11-21z'))
  ctx.restore()

  ctx.fillStyle = INK
  ctx.font = "600 106px Georgia, 'Times New Roman', serif"
  ctx.fillText('Quiet Waters', x, 470)

  ctx.fillStyle = ACCENT
  ctx.font = '600 30px -apple-system, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('C H R I S T I A N   M E D I T A T I O N', x + 4, 520)

  ctx.fillStyle = 'rgba(134,202,214,0.5)'
  ctx.fillRect(x + 4, 570, 130, 3)

  // Verse
  ctx.fillStyle = INK
  ctx.font = "italic 500 62px Georgia, 'Times New Roman', serif"
  const verse = wrap(ctx, '“Be still, and know that I am God.”', 1040)
  let vy = 680
  for (const line of verse) {
    ctx.fillText(line, x, vy)
    vy += 78
  }
  ctx.fillStyle = ACCENT
  ctx.font = '600 30px -apple-system, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('PSALM 46:10', x + 4, vy + 6)

  // Intro
  ctx.fillStyle = 'rgba(243,251,253,0.82)'
  ctx.font = '400 36px -apple-system, "Segoe UI", Roboto, sans-serif'
  const intro = wrap(
    ctx,
    'A quiet place to meet God in stillness — Scripture, a breath prayer, and soft chimes.',
    1050,
  )
  let iy = vy + 90
  for (const line of intro) {
    ctx.fillText(line, x, iy)
    iy += 50
  }

  // ── Right column: QR on a white chip ──
  const chipW = 470
  const chipX = W - chipW - 150
  const chipY = (H - chipW) / 2 - 40
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, chipX, chipY, chipW, chipW, 36)
  ctx.fill()

  try {
    const qr = await loadImage('/qr-quiet-waters.png')
    const pad = 45
    ctx.drawImage(qr, chipX + pad, chipY + pad, chipW - pad * 2, chipW - pad * 2)
  } catch {
    // If the QR can't load, leave the white chip — the URL below still guides.
  }

  ctx.textAlign = 'center'
  const cx = chipX + chipW / 2
  ctx.fillStyle = INK
  ctx.font = '700 44px -apple-system, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('Scan to be still', cx, chipY + chipW + 78)
  ctx.fillStyle = ACCENT
  ctx.font = '500 34px -apple-system, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('quiet-waters-meditation.com', cx, chipY + chipW + 128)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
  })
}
