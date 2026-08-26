import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, Check } from 'lucide-react'
import { renderSlideImage } from '../lib/slideCard'
import { shareOrDownloadImage } from '../lib/verseCard'

// A 16:9 projector slide for announcement loops — rendered on a canvas so a
// leader can download the PNG and drop it into ProPresenter / PowerPoint /
// Google Slides, or project this page full-screen. Standalone (no tab bar).

export function ChurchesSlide() {
  const [preview, setPreview] = useState<string | null>(null)
  const [rendering, setRendering] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = 'Quiet Waters — Projector Slide'
    let alive = true
    let url: string | null = null
    renderSlideImage()
      .then((blob) => {
        if (!alive) return
        url = URL.createObjectURL(blob)
        setPreview(url)
        setRendering(false)
      })
      .catch(() => alive && setRendering(false))
    return () => {
      alive = false
      if (url) URL.revokeObjectURL(url)
      document.title = prev
    }
  }, [])

  const download = async () => {
    try {
      const blob = await renderSlideImage()
      await shareOrDownloadImage(blob, 'quiet-waters-slide')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      /* the preview is still visible; nothing else to do */
    }
  }

  return (
    <div className="min-h-screen bg-mist-200/60 px-4 py-6">
      <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between gap-3">
        <Link
          to="/churches"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <button
          onClick={download}
          disabled={rendering}
          className="inline-flex items-center gap-2 rounded-full bg-water-500 px-6 py-2.5 text-sm font-semibold text-onwater shadow-sm transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {saved ? <Check size={16} /> : <Download size={16} />}
          {saved ? 'Saved' : 'Download slide (PNG)'}
        </button>
      </div>

      <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl ring-1 ring-line">
        {preview && <img src={preview} alt="Quiet Waters projector slide" className="h-full w-full" />}
        {rendering && (
          <div className="grid h-full place-items-center bg-deep-900">
            <Loader2 size={26} className="animate-spin text-water-400" />
          </div>
        )}
      </div>

      <p className="mx-auto mt-4 max-w-4xl text-center text-sm text-deep-500">
        A 1920×1080 slide for your announcement loop — drop it into ProPresenter, PowerPoint, or
        Google Slides, or project this page full-screen.
      </p>
    </div>
  )
}
