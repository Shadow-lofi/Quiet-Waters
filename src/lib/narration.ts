// A gentle text-to-speech narrator built on the browser's Web Speech API —
// no audio files, no external service, no API key, and it works offline using
// the OS voices. One narration plays at a time, tracked here as a tiny store so
// any reader can drive it and highlight the line currently being read.
import { create } from 'zustand'

export type NarrationStatus = 'idle' | 'playing' | 'paused'

const synth: SpeechSynthesis | undefined =
  typeof window !== 'undefined' ? window.speechSynthesis : undefined

/** True when the browser can synthesize speech (so callers can hide the UI). */
export const narrationSupported =
  !!synth && typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window

// ── voice selection ─────────────────────────────────────────────────────────
let cachedVoice: SpeechSynthesisVoice | null = null

/** Pick a calm, natural English voice, preferring on-device (offline) voices. */
function chooseVoice(): SpeechSynthesisVoice | null {
  if (!synth) return null
  if (cachedVoice) return cachedVoice
  const voices = synth.getVoices()
  if (!voices.length) return null // list not ready yet — resolved on voiceschanged
  const english = voices.filter((v) => /^en/i.test(v.lang || ''))
  const pool = english.length ? english : voices
  cachedVoice =
    pool.find((v) => /natural|enhanced|premium|siri/i.test(v.name)) ??
    pool.find((v) => v.localService) ??
    pool[0] ??
    null
  return cachedVoice
}

// Voice lists load asynchronously on Chrome/Safari; warm it up and refresh.
if (synth) {
  chooseVoice()
  synth.addEventListener?.('voiceschanged', () => {
    cachedVoice = null
    chooseVoice()
  })
}

// ── keepalive ────────────────────────────────────────────────────────────────
// Chrome silently stops speaking after ~15s; nudging resume keeps it flowing.
let keepAlive: ReturnType<typeof setInterval> | null = null
function stopKeepAlive() {
  if (keepAlive) {
    clearInterval(keepAlive)
    keepAlive = null
  }
}
function startKeepAlive() {
  stopKeepAlive()
  keepAlive = setInterval(() => {
    if (synth && synth.speaking && !synth.paused) synth.resume()
  }, 8000)
}

// A token invalidates the callbacks of any prior narration, so a cancelled
// utterance's late `onend` can't reset the state of a newer one.
let token = 0

interface NarrationState {
  status: NarrationStatus
  /** Identifier of the content currently loaded (e.g. "bible:John 1:web"). */
  session: string | null
  /** Index of the segment being spoken, or -1 when idle. */
  index: number
  play: (session: string, segments: string[]) => void
  pause: () => void
  resume: () => void
  stop: () => void
  /** Play / pause / resume depending on the current state for this session. */
  toggle: (session: string, segments: string[]) => void
}

export const useNarration = create<NarrationState>((set, get) => ({
  status: 'idle',
  session: null,
  index: -1,

  play: (session, segments) => {
    if (!synth) return
    synth.cancel()
    stopKeepAlive()

    const clean = segments.map((s) => s.trim()).filter(Boolean)
    if (!clean.length) return

    const mine = ++token
    const voice = chooseVoice()
    set({ status: 'playing', session, index: 0 })

    clean.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text)
      if (voice) u.voice = voice
      u.rate = 0.95 // a touch slower — unhurried and easy to follow
      u.pitch = 1
      u.onstart = () => {
        if (token === mine) set({ index: i })
      }
      if (i === clean.length - 1) {
        u.onend = () => {
          if (token !== mine) return
          stopKeepAlive()
          set({ status: 'idle', session: null, index: -1 })
        }
      }
      synth.speak(u)
    })
    startKeepAlive()
  },

  pause: () => {
    if (!synth) return
    if (synth.speaking && !synth.paused) {
      synth.pause()
      set({ status: 'paused' })
    }
  },

  resume: () => {
    if (!synth) return
    if (synth.paused) {
      synth.resume()
      set({ status: 'playing' })
    }
  },

  stop: () => {
    token++ // invalidate any pending callbacks before cancelling
    if (synth) synth.cancel()
    stopKeepAlive()
    set({ status: 'idle', session: null, index: -1 })
  },

  toggle: (session, segments) => {
    const { status, session: active } = get()
    if (active === session && status === 'playing') return get().pause()
    if (active === session && status === 'paused') return get().resume()
    return get().play(session, segments)
  },
}))

/** Split a block of prose into short, sentence-sized chunks for smooth
 *  narration (short utterances dodge engine length limits and pause cleanly). */
export function chunkText(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.match(/[^.!?]+[.!?]*\s*/g) ?? [line])
    .map((s) => s.trim())
    .filter(Boolean)
}
