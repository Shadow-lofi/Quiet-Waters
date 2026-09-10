import { useState } from 'react'
import {
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Droplets,
  Eye,
  Flame,
  Footprints,
  Music,
  ScrollText,
  Sunrise,
} from 'lucide-react'
import {
  ARTICLE,
  BEATITUDE,
  BOWLS,
  FOUNDATION,
  KEY_VERSE,
  SONG_PASSAGE,
  type Bowl,
} from '../data/sevenBowls'
import { Seo } from '../components/Seo'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'

/** The Seven Last Plagues — the seven bowls of the wrath of God poured out by
 *  seven angels (Revelation 15–16). Read for the justice of God, the vindication
 *  of the martyrs, and the safety of belonging to the Lamb — never sensational,
 *  never date-setting. Companion to the End Times cluster; reached from the Study
 *  (Deep Dive) page. */

function BowlCard({ bowl, index }: { bowl: Bowl; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-line">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-mist-100"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist-200 font-serif text-lg font-semibold text-water-600">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-tight text-deep-900">{bowl.title}</span>
          <span className="block text-sm text-deep-500">{bowl.passage}</span>
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-deep-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5">
          <blockquote className="border-l-2 border-water-500/30 pl-4">
            <p className="font-serif text-lg italic leading-relaxed text-deep-800">
              “{bowl.verseText}”
            </p>
          </blockquote>

          <p className="mt-4 leading-relaxed text-deep-700">{bowl.meaning}</p>

          <div className="mt-5 rounded-2xl bg-water-500/10 p-4 ring-1 ring-water-500/20">
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-water-600">
              <Sunrise size={13} />
              For us now
            </p>
            <p className="leading-relaxed text-deep-700">{bowl.today}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function SevenBowls() {
  const addMemoryVerse = useStore((s) => s.addMemoryVerse)
  const inMemory = useStore((s) => s.memoryVerses.some((v) => v.ref === KEY_VERSE.ref))
  const pushToast = useToast((t) => t.push)

  const memorize = () => {
    if (inMemory) return
    addMemoryVerse(KEY_VERSE.ref, KEY_VERSE.text, KEY_VERSE.translation)
    pushToast({ tone: 'success', title: 'Added to Scripture Memory', message: KEY_VERSE.ref })
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo path="/seven-bowls" />
      <header>
        <h1 className="text-2xl">The Seven Last Plagues</h1>
        <p className="mt-1 text-sm text-deep-500">
          The seven bowls of the wrath of God, poured out by seven angels — Revelation 15–16.
        </p>
      </header>

      {/* Framing */}
      <section className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Droplets size={15} />
          The last outpouring
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          In Revelation, judgment comes in three sevens — seven seals, seven trumpets, and last, seven
          bowls (or vials) of the wrath of God, poured out by seven angels. John calls them{' '}
          <span className="font-medium text-deep-800">“the seven last plagues, for in them God’s wrath
          is finished”</span> (Revelation 15:1). They are the final, concentrated outpouring — the
          closing of the account.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          Yet before a single bowl is poured, John sees the redeemed standing by a sea of glass, harps
          in hand, singing the song of Moses and the Lamb (Revelation 15:2–4). The judgment chapter
          opens with worship — because the God who judges is the God who has already carried a people
          safely through.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          We read these chapters the way we read all of Revelation: not to sketch a timeline or to
          frighten anyone, but to see the justice of God, the patience that precedes it, and the safety
          of belonging to the Lamb. The bowls are heavy. They are also, finally, the end of evil — and
          the vindication of everyone who ever suffered for doing right.
        </p>
      </section>

      {/* Foundation */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <ScrollText size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">Where Scripture sets them</h2>
            <p className="text-sm text-deep-500">Revelation 15:1 · 16:1</p>
          </div>
        </div>
        <div className="rounded-card bg-card p-6 shadow-sm ring-1 ring-line">
          <div className="flex flex-col gap-5">
            {FOUNDATION.map((v) => (
              <div key={v.ref} className="border-l-2 border-water-500/25 pl-4">
                <p className="font-serif text-[1.05rem] italic leading-relaxed text-deep-800">
                  “{v.text}”
                </p>
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-water-600">
                  {v.ref}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Egypt again */}
      <section className="rounded-card bg-water-500/10 p-6 ring-1 ring-water-500/25">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Footprints size={15} />
          The plagues of Egypt, again
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          Anyone who knows the Exodus will hear the echoes: sores like the boils (Exodus 9), water
          turned to blood (Exodus 7), a darkness that can be felt (Exodus 10), unclean spirits like
          frogs (Exodus 8), hail that shatters (Exodus 9). The bowls are deliberately dressed in the
          language of Egypt.
        </p>
        <p className="mt-3 leading-relaxed text-deep-700">
          The point is not coincidence but assurance. The God who once heard the cry of slaves and came
          down to deliver them — bringing His judgments on a proud empire while His people sheltered
          under the blood of the lamb — is the same God here. A last Pharaoh, a last Egypt, a last
          exodus. And a people, again, kept safe by the blood of the Lamb.
        </p>
      </section>

      {/* The seven bowls */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Droplets size={18} className="text-water-600" />
          <div>
            <h2 className="text-lg leading-tight text-deep-900">The seven bowls, poured in turn</h2>
            <p className="text-sm text-deep-500">Open each — the Scripture, and our own day</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {BOWLS.map((b, i) => (
            <BowlCard key={b.title} bowl={b} index={i} />
          ))}
        </div>
      </section>

      {/* The one beatitude */}
      <section className="rounded-card bg-water-500/10 p-6 ring-1 ring-water-500/25">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-water-600">
          <Eye size={15} />
          Blessed is he who watches
        </div>
        <blockquote className="mt-3 border-l-2 border-water-500/30 pl-4">
          <p className="font-serif text-lg italic leading-relaxed text-deep-800">“{BEATITUDE.text}”</p>
          <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-water-600">
            {BEATITUDE.ref}
          </p>
        </blockquote>
        <p className="mt-4 leading-relaxed text-deep-700">
          Tucked into the sixth bowl, as the armies of the earth are being gathered, is the only
          beatitude in the whole sequence — and it is a word of Jesus Himself. It is startlingly gentle
          in so severe a place. The instruction for the last hour is not to arm ourselves or decode the
          headlines, but to stay awake and stay clothed — dressed in the righteousness of Christ, ready
          whenever He comes. Watchfulness is the whole posture the book asks of us.
        </p>
      </section>

      {/* Closing hope — the song by the sea */}
      <section className="rounded-card bg-reed-500/10 p-6 ring-1 ring-reed-400/30">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-reed-500">
          <Music size={15} />
          The song by the sea
        </div>
        <p className="mt-3 leading-relaxed text-deep-700">
          The bowls are terrible, but they are not the last word — and they are not even the first word
          of Revelation 15. Before the wrath, John shows us the ones who come through it: those who
          “overcame the beast,” standing on a sea of glass, singing. Their song joins Moses’ song at the
          Red Sea to the Lamb’s song of redemption — the same story, finished.
        </p>
        <div className="mt-4 flex flex-col gap-3 border-t border-reed-400/20 pt-4">
          {SONG_PASSAGE.map((v) => (
            <p key={v.n} className="font-serif text-[1.05rem] leading-relaxed text-deep-800">
              <span className="mr-1 align-super text-[0.7rem] font-semibold text-reed-500">{v.n}</span>
              {v.text}
            </p>
          ))}
        </div>
        <p className="mt-4 leading-relaxed text-deep-700">
          For those who are His, these chapters are not a reason to be afraid. They are the guarantee
          that evil ends, that innocent blood is answered, and that “just and true are your ways.” Do
          not dread the bowls; belong to the Lamb, keep your lamp lit, and sing.
        </p>
        <button
          onClick={memorize}
          disabled={inMemory}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-card py-2.5 text-sm font-medium text-water-600 ring-1 ring-line transition hover:bg-mist-200 disabled:opacity-60 disabled:hover:bg-card sm:w-auto sm:px-5"
        >
          {inMemory ? <Check size={16} /> : <Brain size={16} />}
          {inMemory ? 'In Scripture Memory' : 'Memorize the song (Rev 15:3–4)'}
        </button>
      </section>

      {/* Companion teaching — the author's Oil in My Lamp site */}
      <a
        href={ARTICLE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-card bg-card p-5 shadow-sm ring-1 ring-line transition hover:shadow-md hover:ring-water-400 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist-200 text-water-600">
            <Flame size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-water-600">
              Go deeper
            </p>
            <h2 className="mt-1 flex items-center gap-1.5 text-xl leading-tight text-deep-900">
              {ARTICLE.title}
              <ArrowUpRight
                size={18}
                className="text-water-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-deep-600">{ARTICLE.blurb}</p>
          </div>
        </div>
      </a>
    </div>
  )
}
