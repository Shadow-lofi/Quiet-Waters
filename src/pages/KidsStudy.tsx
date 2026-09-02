import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BookHeart, Check, RotateCcw, Sparkles, Square, Star, Volume2 } from 'lucide-react'
import { StudyScene } from '../components/StudyScene'
import { useStore } from '../lib/store'
import { useNarration, chunkText } from '../lib/narration'
import { KIDS_STUDIES, studyById, type KidsStudy as KidsStudyData } from '../data/kidsStudies'
import { Seo } from '../components/Seo'

/**
 * Kids Bible Study — animated Bible stories for little ones. A tap-through
 * storybook (Creation, Noah, David, Jonah) with an SVG scene, a line of
 * kid-friendly narration you can hear read aloud, and a star + memory verse at
 * the end. Ported from the Temple app; here it's free and local-first (no
 * account, no Plus gate), and "Read to me" uses the shared narrator voice.
 */
export function KidsStudy() {
  const done = useStore((s) => s.kidStudiesDone)
  const completeStudy = useStore((s) => s.completeStudy)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [finished, setFinished] = useState(false)

  const stopNarration = useNarration((s) => s.stop)
  const study = activeId ? studyById(activeId) : null

  // Stop any read-aloud when the page, story, or finish state changes (and on unmount).
  useEffect(() => stopNarration, [page, activeId, finished, stopNarration])

  const open = (id: string) => {
    setActiveId(id)
    setPage(0)
    setFinished(false)
    window.scrollTo({ top: 0 })
  }
  const backToList = () => {
    stopNarration()
    setActiveId(null)
    setFinished(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo path="/kids" />
      <header>
        <h1 className="text-2xl">Kids Bible Study</h1>
        <p className="mt-1 text-sm text-deep-500">
          Animated Bible stories for little ones — read along or tap “Read to me,” and earn a star at
          the end.
        </p>
      </header>

      {!study ? (
        <StudyList doneIds={done} onOpen={open} />
      ) : finished ? (
        <FinishScreen study={study} onAgain={() => open(study.id)} onList={backToList} />
      ) : (
        <Reader
          study={study}
          page={page}
          onBack={backToList}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => {
            if (page < study.pages.length - 1) {
              setPage((p) => p + 1)
              window.scrollTo({ top: 0 })
            } else {
              completeStudy(study.id)
              setFinished(true)
            }
          }}
        />
      )}
    </div>
  )
}

function StudyList({ doneIds, onOpen }: { doneIds: string[]; onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {KIDS_STUDIES.map((s) => {
        const isDone = doneIds.includes(s.id)
        return (
          <div key={s.id} className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
            <div className="flex items-center gap-4">
              <div className="h-20 w-32 shrink-0 bg-mist-100 [&>svg]:h-full [&>svg]:w-full">
                <StudyScene scene={s.pages[0].scene} />
              </div>
              <div className="min-w-0 flex-1 py-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg leading-tight text-deep-900">{s.title}</h2>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-reed-500/15 px-2 py-0.5 text-[0.7rem] font-semibold text-reed-500">
                      <Check size={11} /> Done
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-deep-500">
                  {s.subtitle} · {s.pages.length} pages
                </p>
              </div>
              <div className="pr-3">
                <button
                  onClick={() => onOpen(s.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isDone
                      ? 'text-water-600 ring-1 ring-line hover:bg-mist-200'
                      : 'bg-water-500 text-onwater shadow-sm hover:bg-water-600'
                  }`}
                >
                  {isDone ? 'Read again' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
      <p className="flex items-center gap-1.5 pt-1 text-xs text-deep-400">
        <Sparkles size={13} /> More stories coming soon.
      </p>
    </div>
  )
}

function Reader({
  study,
  page,
  onBack,
  onPrev,
  onNext,
}: {
  study: KidsStudyData
  page: number
  onBack: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const p = study.pages[page]
  const last = page === study.pages.length - 1

  const voiceURI = useStore((s) => s.narrationVoiceURI)
  const rate = useStore((s) => s.narrationRate)
  const play = useNarration((s) => s.play)
  const stop = useNarration((s) => s.stop)
  const status = useNarration((s) => s.status)
  const session = useNarration((s) => s.session)

  const readSession = `kids:${study.id}:${page}`
  const reading = session === readSession && status === 'playing'

  const readAloud = () => {
    if (reading) stop()
    else play(readSession, chunkText(p.text), { voiceURI, rate })
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 self-start text-sm text-deep-500 transition hover:text-deep-800"
      >
        <ArrowLeft size={16} /> All stories
      </button>

      <div className="overflow-hidden rounded-2xl bg-mist-100 ring-1 ring-line">
        <StudyScene scene={p.scene} />
      </div>

      <div className="flex justify-center gap-1.5">
        {study.pages.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === page ? 'w-6 bg-water-500' : i < page ? 'w-1.5 bg-water-300' : 'w-1.5 bg-mist-300'
            }`}
          />
        ))}
      </div>

      <p className="font-serif text-xl leading-relaxed text-deep-800">{p.text}</p>

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-mist-200 px-3 py-1 text-sm font-medium text-water-600">
          {p.ref}
        </span>
        <button
          onClick={readAloud}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          {reading ? <Square size={15} className="fill-current" /> : <Volume2 size={16} />}
          {reading ? 'Stop' : 'Read to me'}
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-4">
        <button
          onClick={onPrev}
          disabled={page === 0}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-40"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <span className="mx-auto text-xs text-deep-400">
          Page {page + 1} of {study.pages.length}
        </span>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-4 py-2 text-sm font-semibold text-onwater shadow-sm transition hover:bg-water-600"
        >
          {last ? (
            <>
              <Star size={16} /> Finish
            </>
          ) : (
            <>
              Next <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function FinishScreen({
  study,
  onAgain,
  onList,
}: {
  study: KidsStudyData
  onAgain: () => void
  onList: () => void
}) {
  return (
    <section className="rounded-card bg-card p-6 text-center shadow-sm ring-1 ring-line">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-water-500/15 text-water-600">
        <Star size={34} className="fill-current" />
      </div>
      <h2 className="mt-4 text-2xl text-deep-900">You did it!</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-deep-500">
        You finished <span className="font-medium text-deep-700">{study.title}</span> and earned a{' '}
        <span className="font-medium text-water-600">star</span>. Well done!
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-reed-500/10 px-5 py-5 ring-1 ring-reed-400/25">
        <p className="flex items-center justify-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-reed-500">
          <BookHeart size={13} /> Remember this
        </p>
        <p className="mt-2 font-serif text-lg leading-relaxed text-deep-800">“{study.verse}”</p>
        <p className="mt-1 text-sm font-medium text-reed-500">{study.verseRef}</p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={onAgain}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-deep-600 ring-1 ring-line transition hover:bg-mist-200"
        >
          <RotateCcw size={16} /> Read again
        </button>
        <button
          onClick={onList}
          className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-4 py-2 text-sm font-semibold text-onwater shadow-sm transition hover:bg-water-600"
        >
          More stories <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}
