import { useEffect, useState } from 'react'
import { X, Share2, Download, Copy, Loader2 } from 'lucide-react'
import { useToast } from '../lib/toast'
import {
  CARD_BACKGROUNDS,
  renderVerseImage,
  shareOrDownloadImage,
  verseShareText,
  type CardBackground,
} from '../lib/verseCard'

export interface ShareableVerse {
  ref: string
  text: string
  translationShort?: string
}

const canShareFiles = (() => {
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { canShare?: (d: ShareData) => boolean }) : null
  try {
    return !!nav && typeof nav.share === 'function' && !!nav.canShare?.({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] })
  } catch {
    return false
  }
})()

/** A bottom sheet that turns a verse into a shareable 1080×1080 image — pick a
 *  background, then share it (or save it), or copy the words as text. */
export function VerseShareSheet({ verse, onClose }: { verse: ShareableVerse; onClose: () => void }) {
  const pushToast = useToast((t) => t.push)
  const [bg, setBg] = useState<CardBackground>(CARD_BACKGROUNDS[0])
  const [preview, setPreview] = useState<string | null>(null)
  const [rendering, setRendering] = useState(true)
  const [busy, setBusy] = useState(false)

  // Re-render the preview whenever the chosen background changes.
  useEffect(() => {
    let alive = true
    let url: string | null = null
    setRendering(true)
    renderVerseImage({ text: verse.text, ref: verse.ref, translationShort: verse.translationShort, background: bg })
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
  }, [verse.text, verse.ref, verse.translationShort, bg])

  const shareImage = async () => {
    if (busy) return
    setBusy(true)
    try {
      const blob = await renderVerseImage({
        text: verse.text,
        ref: verse.ref,
        translationShort: verse.translationShort,
        background: bg,
      })
      const outcome = await shareOrDownloadImage(blob, verse.ref)
      if (outcome === 'downloaded') pushToast({ tone: 'success', title: 'Image saved' })
    } catch {
      pushToast({ title: 'Couldn’t create the image' })
    } finally {
      setBusy(false)
    }
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(
        verseShareText(verse.ref, verse.text, verse.translationShort),
      )
      pushToast({ tone: 'success', title: 'Copied' })
    } catch {
      pushToast({ title: 'Couldn’t copy' })
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-mist-100/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-card p-6 shadow-xl ring-1 ring-line"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-water-600">Share as image</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep-400 hover:bg-mist-200 hover:text-deep-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live preview */}
        <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl ring-1 ring-line">
          {preview && (
            <img src={preview} alt={`${verse.ref} verse card`} className="h-full w-full object-cover" />
          )}
          {rendering && (
            <div className="absolute inset-0 grid place-items-center bg-mist-100/60">
              <Loader2 size={22} className="animate-spin text-water-500" />
            </div>
          )}
        </div>

        {/* Background picker */}
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

        {/* Actions */}
        <button
          onClick={shareImage}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-water-500 py-3 font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={18} className="animate-spin" />
          ) : canShareFiles ? (
            <Share2 size={18} />
          ) : (
            <Download size={18} />
          )}
          {canShareFiles ? 'Share' : 'Save image'}
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
