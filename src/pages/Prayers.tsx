import { useState } from 'react'
import { Check, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'

const fmt = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

/**
 * A private, on-device prayer list. Lay requests before God, then mark them
 * answered in His time — the answered ones settle into a quiet record of His
 * faithfulness. Everything lives in the local store; nothing leaves the device.
 */
export function Prayers() {
  const prayers = useStore((s) => s.prayers)
  const addPrayer = useStore((s) => s.addPrayer)
  const answerPrayer = useStore((s) => s.answerPrayer)
  const reopenPrayer = useStore((s) => s.reopenPrayer)
  const removePrayer = useStore((s) => s.removePrayer)

  const [draft, setDraft] = useState('')

  const open = prayers.filter((p) => !p.answeredAt)
  const answered = prayers
    .filter((p) => p.answeredAt)
    .sort((a, b) => (b.answeredAt ?? 0) - (a.answeredAt ?? 0))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    addPrayer(draft)
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-2xl">Prayers</h1>
        <p className="mt-1 text-sm text-deep-500">
          Cast your cares on Him. Hold them here, and mark them answered in His time.
        </p>
      </header>

      <form onSubmit={submit} className="rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Lay a request before God…"
          className="w-full resize-none rounded-xl bg-mist-100 px-3 py-2.5 text-[0.95rem] leading-relaxed text-deep-800 outline-none ring-1 ring-line placeholder:text-deep-400"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-water-500 px-4 py-2 text-sm font-semibold text-onwater shadow-sm transition hover:bg-water-600 disabled:opacity-40"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      {prayers.length === 0 && (
        <div className="rounded-card bg-mist-200/60 px-6 py-10 text-center">
          <p className="font-serif text-lg text-deep-700">Nothing here yet</p>
          <p className="mt-1.5 text-sm text-deep-500">
            Lay a request before God above, and return to mark it answered in His time.
          </p>
        </div>
      )}

      {open.length > 0 && (
        <section>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-deep-500">
            Holding before God ({open.length})
          </p>
          <ul className="flex flex-col gap-2.5">
            {open.map((p) => (
              <li key={p.id} className="rounded-card bg-card p-4 shadow-sm ring-1 ring-line">
                <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-deep-800">{p.text}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-deep-400">{fmt(p.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => answerPrayer(p.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-reed-500/15 px-3 py-1.5 text-xs font-semibold text-reed-500 transition hover:bg-reed-500/25"
                    >
                      <Check size={14} /> Answered
                    </button>
                    <button
                      onClick={() => removePrayer(p.id)}
                      aria-label="Remove prayer"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {answered.length > 0 && (
        <section>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-reed-500">
            Answered ({answered.length})
          </p>
          <p className="mb-3 text-sm text-deep-500">A record of His faithfulness.</p>
          <ul className="flex flex-col gap-2.5">
            {answered.map((p) => (
              <li key={p.id} className="rounded-card bg-reed-500/10 p-4 ring-1 ring-reed-400/25">
                <div className="flex items-start gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-reed-500" />
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-deep-800">{p.text}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-reed-500">
                        Answered {fmt(p.answeredAt ?? p.createdAt)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => reopenPrayer(p.id)}
                          aria-label="Move back to holding"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-600"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          onClick={() => removePrayer(p.id)}
                          aria-label="Remove prayer"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-deep-400 transition hover:bg-mist-200 hover:text-deep-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
