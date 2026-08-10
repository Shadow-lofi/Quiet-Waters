import { useState } from 'react'
import { useStore } from '../lib/store'
import { BREATH_PATTERNS } from '../data/presets'
import { APP_VERSION } from '../lib/version'
import type { BreathPace, ThemePref } from '../lib/types'

/** A pill segmented control. */
function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 rounded-full bg-mist-200 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.value ? 'bg-card text-water-600 shadow-sm' : 'text-deep-500 hover:text-deep-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** An on/off switch. */
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
        checked ? 'bg-water-500' : 'bg-mist-300'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-deep-800">{label}</p>
        {hint && <p className="text-xs text-deep-500">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function Settings() {
  const s = useStore()
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-2xl">Settings</h1>
      </header>

      {/* profile */}
      <section className="rounded-card bg-card px-5 py-2 shadow-sm ring-1 ring-line">
        <Row label="Your name" hint="Used to greet you — stays on this device">
          <input
            value={s.name}
            onChange={(e) => s.setName(e.target.value)}
            placeholder="Add name"
            maxLength={40}
            className="w-36 rounded-full bg-mist-100 px-3.5 py-1.5 text-right text-deep-900 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-water-500"
          />
        </Row>
      </section>

      {/* appearance */}
      <section className="rounded-card bg-card px-5 py-2 shadow-sm ring-1 ring-line">
        <Row label="Appearance" hint="Auto follows your device">
          <div className="w-44">
            <Segmented<ThemePref>
              value={s.theme}
              onChange={(v) => s.setPref('theme', v)}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'night', label: 'Night' },
                { value: 'auto', label: 'Auto' },
              ]}
            />
          </div>
        </Row>
      </section>

      {/* sound */}
      <section className="rounded-card bg-card px-5 py-2 shadow-sm ring-1 ring-line">
        <p className="pt-3 text-xs uppercase tracking-[0.2em] text-deep-500">Sound</p>
        <div className="divide-y divide-line">
          <Row label="Chimes" hint="Soft bells during your sitting">
            <Toggle checked={s.soundOn} onChange={(v) => s.setPref('soundOn', v)} />
          </Row>
          <Row label="Opening chime">
            <Toggle
              checked={s.openingChime}
              disabled={!s.soundOn}
              onChange={(v) => s.setPref('openingChime', v)}
            />
          </Row>
          <Row label="Closing chime">
            <Toggle
              checked={s.closingChime}
              disabled={!s.soundOn}
              onChange={(v) => s.setPref('closingChime', v)}
            />
          </Row>
          <Row label="Interval bell" hint="A gentle marker along the way">
            <div className="w-40">
              <Segmented<string>
                value={String(s.intervalMin)}
                onChange={(v) => s.setPref('intervalMin', Number(v))}
                options={[
                  { value: '0', label: 'Off' },
                  { value: '5', label: '5m' },
                  { value: '10', label: '10m' },
                ]}
              />
            </div>
          </Row>
        </div>
      </section>

      {/* breathing */}
      <section className="rounded-card bg-card px-5 py-2 shadow-sm ring-1 ring-line">
        <Row label="Breath pacing" hint={s.breathPace === 'off' ? 'A still circle' : BREATH_PATTERNS[s.breathPace].label}>
          <div />
        </Row>
        <div className="pb-3">
          <Segmented<BreathPace>
            value={s.breathPace}
            onChange={(v) => s.setPref('breathPace', v)}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'gentle', label: 'Gentle' },
              { value: 'calm', label: 'Calm' },
              { value: 'deep', label: 'Deep' },
            ]}
          />
        </div>
        <div className="divide-y divide-line border-t border-line">
          <Row label="Keep screen awake" hint="Stops the display dimming mid-sitting">
            <Toggle checked={s.keepAwake} onChange={(v) => s.setPref('keepAwake', v)} />
          </Row>
        </div>
      </section>

      {/* data */}
      <section className="rounded-card bg-card px-5 py-2 shadow-sm ring-1 ring-line">
        <Row label="Clear history" hint={`${s.sessions.length} sittings stored on this device`}>
          {confirmClear ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  s.clearHistory()
                  setConfirmClear(false)
                }}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-white"
                style={{ backgroundColor: '#b4534a' }}
              >
                Clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-full px-3 py-1.5 text-sm text-deep-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={s.sessions.length === 0}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-deep-600 ring-1 ring-line hover:bg-mist-200 disabled:opacity-40"
            >
              Clear
            </button>
          )}
        </Row>
      </section>

      <footer className="pb-2 text-center text-xs text-deep-400">
        <p className="font-serif text-sm italic text-deep-500">“Be still, and know that I am God.”</p>
        <p className="mt-2">Quiet Waters · v{APP_VERSION}</p>
      </footer>
    </div>
  )
}
