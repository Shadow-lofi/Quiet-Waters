import { describe, it, expect } from 'vitest'
import { HYMNS, hymnById, hymnOfDayIndex, hymnReadingLines } from './hymns'

describe('hymn data', () => {
  it('has unique ids and non-empty, well-formed hymns', () => {
    const ids = HYMNS.map((h) => h.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(HYMNS.length).toBeGreaterThan(0)
    for (const h of HYMNS) {
      expect(h.title && h.author && h.theme).toBeTruthy()
      expect(h.stanzas.length).toBeGreaterThan(0)
      for (const stanza of h.stanzas) {
        expect(stanza.length).toBeGreaterThan(0)
        for (const line of stanza) expect(line.trim()).toBeTruthy()
      }
      if (h.refrain) {
        expect(h.refrain.length).toBeGreaterThan(0)
        for (const line of h.refrain) expect(line.trim()).toBeTruthy()
      }
    }
  })

  it('hymnById finds and misses', () => {
    expect(hymnById('amazing-grace')?.title).toBe('Amazing Grace')
    expect(hymnById('nope')).toBeUndefined()
  })
})

describe('hymnOfDayIndex', () => {
  it('is always a valid, in-range index', () => {
    // A year's worth of days should all land inside the set.
    const start = new Date(2026, 0, 1)
    for (let i = 0; i < 400; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const idx = hymnOfDayIndex(d)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(HYMNS.length)
    }
  })

  it('is steady for a given day and advances by one to the next', () => {
    const a = new Date(2026, 5, 10)
    const b = new Date(2026, 5, 11)
    expect(hymnOfDayIndex(a)).toBe(hymnOfDayIndex(a))
    expect(hymnOfDayIndex(b)).toBe((hymnOfDayIndex(a) + 1) % HYMNS.length)
  })
})

describe('hymnReadingLines', () => {
  it('reads every stanza line, with the refrain once after the first stanza', () => {
    const withRefrain = HYMNS.find((h) => h.refrain)!
    const lines = hymnReadingLines(withRefrain)
    const stanzaLineCount = withRefrain.stanzas.reduce((n, s) => n + s.length, 0)
    expect(lines.length).toBe(stanzaLineCount + withRefrain.refrain!.length)
    // The refrain follows the first stanza.
    const firstStanza = withRefrain.stanzas[0]
    expect(lines.slice(firstStanza.length, firstStanza.length + withRefrain.refrain!.length)).toEqual(
      withRefrain.refrain,
    )
  })

  it('reads only the stanza lines when there is no refrain', () => {
    const noRefrain = HYMNS.find((h) => !h.refrain)!
    const lines = hymnReadingLines(noRefrain)
    const stanzaLineCount = noRefrain.stanzas.reduce((n, s) => n + s.length, 0)
    expect(lines.length).toBe(stanzaLineCount)
  })
})
