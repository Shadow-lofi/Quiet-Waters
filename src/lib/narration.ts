// A gentle text-to-speech narrator built on the browser's Web Speech API —
// no audio files, no external service, no API key, and it works offline using
// the OS voices. One narration plays at a time, tracked here as a tiny store so
// any reader can drive it and highlight the line currently being read.
import { useEffect, useState } from 'react'
import { create } from 'zustand'

export type NarrationStatus = 'idle' | 'playing' | 'paused'

export interface NarrationOptions {
  /** A specific speechSynthesis voiceURI to use; falls back to the best pick. */
  voiceURI?: string | null
  /** Speaking rate (~0.8 slower … 1.15 faster). */
  rate?: number
  /** Called once the whole passage finishes on its own (never on stop/pause).
   *  Used for continuous reading — advancing to the next chapter. */
  onEnd?: () => void
}

const synth: SpeechSynthesis | undefined =
  typeof window !== 'undefined' ? window.speechSynthesis : undefined

/** True when the browser can synthesize speech (so callers can hide the UI). */
export const narrationSupported =
  !!synth && typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window

/** The default speaking rate — a touch slower than 1, so it's unhurried. */
export const DEFAULT_RATE = 0.95

// ── voice selection ─────────────────────────────────────────────────────────
// Apple ships a fixed set of "novelty" voices (sound effects and singing) that
// read Scripture terribly and just clutter the picker — hide them everywhere.
const NOVELTY_VOICES = new Set([
  'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'deranged', 'good news',
  'hysterical', 'jester', 'organ', 'pipe organ', 'superstar', 'trinoids', 'whisper',
  'wobble', 'zarvox', 'albert',
])
function isNovelty(v: SpeechSynthesisVoice): boolean {
  const base = (v.name || '').replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()
  return NOVELTY_VOICES.has(base)
}

// Rank the installed voices so the best one is picked automatically. Neural /
// "natural" and the platform premium voices (Apple Enhanced/Siri, Google,
// Microsoft Natural) sound far warmer than the basic defaults like Samantha.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name || ''
  let score = 0
  if (/natural|neural/i.test(name)) score += 6
  if (/enhanced|premium/i.test(name)) score += 5
  if (/google/i.test(name)) score += 4
  if (/siri/i.test(name)) score += 4
  if (/microsoft/i.test(name)) score += 2
  // A few voices that are known to be pleasant, calm reading voices.
  if (/\b(ava|samantha|jenny|aria|allison|serena|zoe|joelle|nathan|evan)\b/i.test(name)) score += 2
  if (v.localService) score += 1 // works offline
  if (/en[-_]us/i.test(v.lang || '')) score += 1
  return score
}

/** All usable voices, English first, sorted best-sounding first. */
export function listVoices(): SpeechSynthesisVoice[] {
  if (!synth) return []
  const all = synth.getVoices().filter((v) => !isNovelty(v))
  const english = all.filter((v) => /^en/i.test(v.lang || ''))
  const pool = english.length ? english : all
  return [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))
}

/** Resolve a voice: the chosen one if still present, else the best available. */
function chooseVoice(preferredURI?: string | null): SpeechSynthesisVoice | null {
  if (!synth) return null
  const all = synth.getVoices()
  if (!all.length) return null // list not ready yet — resolved on voiceschanged
  if (preferredURI) {
    const picked = all.find((v) => v.voiceURI === preferredURI)
    if (picked) return picked
  }
  return listVoices()[0] ?? null
}

// Voice lists load asynchronously on Chrome/Safari — nudge the load once.
if (synth) void synth.getVoices()

/**
 * React hook: the current list of voices (best-sounding first), kept in sync as
 * the browser finishes loading them. Empty when speech isn't supported.
 */
export function useVoiceList(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => listVoices())
  useEffect(() => {
    if (!synth) return
    const update = () => setVoices(listVoices())
    update()
    synth.addEventListener?.('voiceschanged', update)
    return () => synth.removeEventListener?.('voiceschanged', update)
  }, [])
  return voices
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
  play: (session: string, segments: string[], opts?: NarrationOptions) => void
  pause: () => void
  resume: () => void
  stop: () => void
  /** Play / pause / resume depending on the current state for this session. */
  toggle: (session: string, segments: string[], opts?: NarrationOptions) => void
}

export const useNarration = create<NarrationState>((set, get) => ({
  status: 'idle',
  session: null,
  index: -1,

  play: (session, segments, opts) => {
    if (!synth) return
    synth.cancel()
    stopKeepAlive()

    const clean = segments.map((s) => s.trim()).filter(Boolean)
    if (!clean.length) return

    const mine = ++token
    const voice = chooseVoice(opts?.voiceURI)
    const rate = opts?.rate ?? DEFAULT_RATE
    set({ status: 'playing', session, index: 0 })

    clean.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text)
      if (voice) u.voice = voice
      u.rate = rate
      u.pitch = 1
      u.onstart = () => {
        if (token === mine) set({ index: i })
      }
      if (i === clean.length - 1) {
        u.onend = () => {
          if (token !== mine) return
          stopKeepAlive()
          set({ status: 'idle', session: null, index: -1 })
          opts?.onEnd?.() // natural completion only — stop() bumps the token first
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

  toggle: (session, segments, opts) => {
    const { status, session: active } = get()
    if (active === session && status === 'playing') return get().pause()
    if (active === session && status === 'paused') return get().resume()
    return get().play(session, segments, opts)
  },
}))

/** Split a block of prose into short chunks at sentence-ending punctuation, so
 *  narration pauses cleanly at each period, question, exclamation, colon, or
 *  semicolon. Commas are kept within a chunk — the voice's own prosody gives
 *  them a lighter, natural pause. Short utterances also dodge engine length
 *  limits and let pause/resume land between sentences. */
export function chunkText(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [line])
    .map((s) => s.trim())
    .filter(Boolean)
}
