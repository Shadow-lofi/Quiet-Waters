import { useEffect, useState } from 'react'
import { Copy, Download, Loader2, Send, Shuffle } from 'lucide-react'
import { ENCOURAGEMENTS, ENCOURAGEMENT_NOTES } from '../data/encouragements'
import {
  CARD_BACKGROUNDS,
  renderVerseImage,
  shareOrDownloadImage,
  verseShareText,
  type CardBackground,
} from '../lib/verseCard'
import { useToast } from '../lib/toast'

const canShareFiles = (() => {
  const nav =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & { canShare?: (d: ShareData) => boolean })
      : null
  try {
    return (
      !!nav &&
      typeof nav.share === 'function' &&
      !!nav.canShare?.({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] })
    )
  } catch {
    return false
  }
})()

/**
 * Send an encouragement — turn a word of Scripture into a shareable card with a
 * personal note on top, then send it to someone (native share) or copy the
 * words. Reuses the verse-card engine; the note rides along on the image and in
 * the shared text.
 */
export function Encourage() {
  const pushToast = useToast((t) => t.push)
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * ENCOURAGEMENTS.length))
  const [note, setNote] = useState(ENCOURAGEMENT_NOTES[0])
  const [bg, setBg] = useState<CardBackground>(CARD_BACKGROUNDS[0])
  const [preview, setPreview] = useState<string | null>(null)
  const [rendering, setRendering] = useState(true)
  const [busy, setBusy] = useState(false)

  const verse = ENCOURAGEMENTS[idx]

  const another = () =>
    setIdx((i) => {
      if (ENCOURAGEMENTS.length < 2) return i
      let n = i
      while (n === i) n = Math.floor(Math.random() * ENCOURAGEMENTS.length)
      return n
    })

  // Re-render the preview whenever the verse, note, or background changes.
  useEffect(() => {
    let alive = true
    let url: string | null = null
    setRendering(true)
    renderVerseImage({ text: verse.text, ref: verse.ref, note, background: bg })
      .then((blob) => {
        if (!alive) return
        url = URL.createObjectURL(blob)
        setPreview(url)
        setRendering(false)
      })
      .catch(() => {
        if (alive) setRendering(false)
      })
    return () => {
      alive = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [verse.text, verse.ref, note, bg])

  const send = async () => {
    if (busy) return
    setBusy(true)
    try {
      const blob = await renderVerseImage({ text: verse.text, ref: verse.ref, note, background: bg })
      const outcome = await shareOrDownloadImage(
        blob,
        verse.ref,
        verseShareText(verse.ref, verse.text, undefined, note),
      )
      if (outcome === 'downloaded') pushToast({ tone: 'success', title: 'Image saved' })
    } catch {
      pushToast({ title: 'Couldn’t create the image' })
    } finally {
      setBusy(false)
    }
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(verseShareText(verse.ref, verse.text, undefined, note))
      pushToast({ tone: 'success', title: 'Copied' })
    } catch {
      pushToast({ title: 'Couldn’t copy' })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl">Send an encouragement</h1>
        <p className="mt-1 text-sm text-deep-500">
          A word of Scripture for someone you love — add a line, and send it their way.
        </p>
      </header>

      {/* Your message */}
      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-deep-500">Your message</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 120))}
          rows={2}
          placeholder="Add a personal note…"
          className="w-full resize-none rounded-xl bg-card px-3 py-2.5 text-[0.95rem] leading-relaxed text-deep-800 shadow-sm outline-none ring-1 ring-line placeholder:text-deep-400"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ENCOURAGEMENT_NOTES.map((n) => (
            <button
              key={n}
              onClick={() => setNote(n)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                note === n
                  ? 'bg-water-500 text-onwater'
                  : 'bg-mist-100 text-deep-600 ring-1 ring-line hover:bg-mist-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* The verse */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-deep-500">The verse</p>
          <button
            onClick={another}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200"
          >
            <Shuffle size={13} /> Another
          </button>
        </div>
        <div className="rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
          <p className="font-serif text-[1.05rem] leading-relaxed text-deep-800">“{verse.text}”</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-water-600">{verse.ref}</p>
        </div>
      </section>

      {/* Preview */}
      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-deep-500">Preview</p>
        <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl ring-1 ring-line">
          {preview && (
            <img src={preview} alt={`${verse.ref} encouragement card`} className="h-full w-full object-cover" />
          )}
          {rendering && (
            <div className="absolute inset-0 grid place-items-center bg-mist-100/60">
              <Loader2 size={22} className="animate-spin text-water-500" />
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          {CARD_BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setBg(b)}
              aria-label={b.label}
              aria-pressed={b.id === bg.id}
              className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-card transition ${
                b.id === bg.id ? 'ring-deep-500' : 'ring-transparent'
              }`}
              style={{ background: `linear-gradient(145deg, ${b.from}, ${b.to})` }}
            />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div>
        <button
          onClick={send}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3.5 font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={18} className="animate-spin" />
          ) : canShareFiles ? (
            <Send size={18} />
          ) : (
            <Download size={18} />
          )}
          {canShareFiles ? 'Send it' : 'Save image'}
        </button>
        <button
          onClick={copyText}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <Copy size={15} /> Copy text
        </button>
      </div>
    </div>
  )
}
