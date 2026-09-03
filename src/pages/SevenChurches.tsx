import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  Church,
  Crown,
  DoorOpen,
  Ear,
  Flame,
  HeartCrack,
  Moon,
  Quote,
  Sparkles,
  Sword,
  Thermometer,
} from 'lucide-react'
import { GLANCE, LETTERS, type ChurchLetter } from '../data/sevenChurches'
import { Seo } from '../components/Seo'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'

/** The Seven Churches — the risen Christ's letters to the churches of Asia
 *  (Revelation 2–3), read for their modern spiritual meaning. Each church is a
 *  mirror of a condition alive in the church and the heart today. Styled to
 *  match the End Times study; reached from the Study (Deep Dive) page. */

function churchIcon(name: string) {
  switch (name) {
    case 'Ephesus':
      return <HeartCrack size={18} />
    case 'Smyrna':
      return <Crown size={18} />
    case 'Pergamum':
      return <Sword size={18} />
    case 'Thyatira':
      return <Flame size={18} />
    case 'Sardis':
      return <Moon size={18} />
    case 'Philadelphia':
      return <DoorOpen size={18} />
    case 'Laodicea':
      return <Thermometer size={18} />
    default:
      return <Church size={18} />
  }
}

function LetterCard({ letter }: { letter: ChurchLetter }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const setBibleRef = useStore((s) => s.setBibleRef)
  const addMemoryVerse = useStore((s) => s.addMemoryVerse)
  const inMemory = useStore((s) => s.memoryVerses.some((v) => v.ref === letter.keyVerse.ref))
  const pushToast = useToast((t) => t.push)

  // The letters live in Revelation 2 (Ephesus–Thyatira) and 3 (Sardis–Laodicea).
  const chapter = Number(letter.reference.match(/Revelation (\d+)/)?.[1]) || 2

  const readLetter = () => {
    setBibleRef('Revelation', chapter)
    navigate('/bible')
  }

  const memorize = () => {
    if (inMemory) return
    addMemoryVerse(letter.keyVerse.ref, letter.keyVerse.text, 'WEB')
    pushToast({ tone: 'success', title: 'Added to Scripture Memory', message: letter.keyVerse.ref })
  }

  return (
    <div className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-mist-100"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
          {churchIcon(letter.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-tight text-deep-900">{letter.name}</span>
          <span className="block text-sm text-deep-500">{letter.portrait}</span>
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-deep-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-water-600">{letter.reference}</p>

          {/* How Christ presents Himself to this church */}
          <div className="mt-4 rounded-2xl bg-mist-200/60 p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-deep-400">
              How Christ appears
            </p>
            <p className="mt-1.5 font-serif leading-relaxed text-deep-800">“{letter.christ}”</p>
            <p className="mt-1.5 text-sm font-semibold text-water-600">{letter.christRef}</p>
          </div>

          {letter.commend && (
            <div className="mt-5">
              <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-reed-500">
                What He commends
              </p>
              <p className="leading-relaxed text-deep-700">{letter.commend}</p>
            </div>
          )}

          {letter.correct && (
            <div className="mt-5">
              <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
                The correction
              </p>
              <p className="leading-relaxed text-deep-700">{letter.correct}</p>
            </div>
          )}

          {/* The modern spiritual meaning — the mirror for us */}
          <div className="mt-6 rounded-2xl bg-water-500/10 p-4 ring-1 ring-water-500/20">
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
              <Sparkles size={13} />
              What it means for us
            </p>
            <p className="leading-relaxed text-deep-700">{letter.today}</p>
          </div>

          {/* Promise to the one who overcomes */}
          <div className="mt-5">
            <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-reed-500">
              To the one who overcomes
            </p>
            <p className="leading-relaxed text-deep-700">{letter.promise}</p>
            <p className="mt-1.5 text-sm font-semibold text-reed-500">{letter.promiseRef}</p>
          </div>

          {/* A verse to sit with */}
          <blockquote className="mt-6 border-l-2 border-water-500/30 pl-4">
            <p className="font-serif text-lg italic leading-relaxed text-deep-800">
              “{letter.keyVerse.text}”
            </p>
            <p className="mt-1.5 text-sm font-semibold text-water-600">{letter.keyVerse.ref}</p>
          </blockquote>

          {/* Carry it further — read the whole letter, or hide the verse in your heart */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={readLetter}
              className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200"
            >
              <BookOpen size={16} /> Read the letter
            </button>
            <button
              onClick={memorize}
              disabled={inMemory}
              className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-60 disabled:hover:bg-transparent"
            >
              {inMemory ? <Check size={16} /> : <Brain size={16} />}
              {inMemory ? 'In Scripture Memory' : 'Memorize this verse'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function SevenChurches() {
  return (
    <div className="flex flex-col gap-6">
      <Seo path="/seven-churches" />
      <header>
        <h1 className="text-2xl">The Seven Churches</h1>
        <p className="mt-1 text-sm text-deep-500">
          Christ’s letters to the seven churches of Revelation — and the mirror they hold up to us.
        </p>
      </header>

      {/* Framing: seven mirrors, not seven relics */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Church size={15} />
          He walks among the lampstands
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          In the opening vision of Revelation, John sees the risen Christ walking among seven golden
          lampstands — the seven churches. To each He dictates a letter (Revelation 2–3), and every one
          begins the same way: <span className="italic">“I know your works.”</span> They were real
          first-century congregations in Asia Minor. But seven is the number of fullness, and the church
          has always read these letters as seven mirrors — each a portrait of a condition alive in
          Christ’s people, and in our own hearts, in every age.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          So we read them not as ancient history but as a searching light. Some are commended, some
          corrected, most both. To all seven the Spirit says the same thing — and it is meant for us:
        </p>
        <p className="mt-3 font-serif text-lg italic leading-relaxed text-deep-800">
          “He who has an ear, let him hear what the Spirit says to the churches.”
        </p>
        <p className="mt-1.5 text-sm font-semibold text-water-600">Revelation 2:7</p>
      </section>

      {/* The seven at a glance */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Ear size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">The seven at a glance</h2>
            <p className="text-sm text-deep-500">Each church as a spiritual portrait</p>
          </div>
        </div>
        <ol className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
          {GLANCE.map((g, i) => (
            <li
              key={g.name}
              className={`flex items-start gap-3 px-5 py-3.5 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mist-200 text-sm font-semibold text-water-600">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg leading-tight text-deep-900">{g.name}</p>
                <p className="text-sm leading-snug text-deep-500">{g.type}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The seven letters */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Flame size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">The seven letters</h2>
            <p className="text-sm text-deep-500">Open each to sit with what Christ says</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {LETTERS.map((l) => (
            <LetterCard key={l.name} letter={l} />
          ))}
        </div>
      </section>

      {/* Closing: the One who knows */}
      <section className="rounded-card bg-reed-500/10 p-6 ring-1 ring-reed-400/30">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-reed-500">
          <Quote size={15} />
          The One who knows
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          To each church Christ begins, <span className="italic">“I know your works”</span> — and He
          still does. He knows the church that is busy but cold, faithful but poor, alive in name but
          dead in fact, comfortable but lukewarm. He knows, and He loves, and to every wound His answer
          is the same tender word: <span className="italic">repent</span>, and open the door. To each
          one who overcomes He gives, in the end, nothing less than Himself.
        </p>
        <p className="mt-4 font-serif text-lg leading-relaxed text-deep-800">
          “Behold, I stand at the door and knock. If anyone hears my voice and opens the door, then I
          will come in to him, and will dine with him, and he with me.”
        </p>
        <p className="mt-1.5 text-sm font-semibold text-reed-500">Revelation 3:20</p>
      </section>
    </div>
  )
}
