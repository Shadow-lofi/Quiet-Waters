import { describe, it, expect } from 'vitest'
import { verseShareText } from './verseCard'

describe('verseShareText', () => {
  it('formats the verse, reference, and attribution', () => {
    const out = verseShareText('John 3:16', 'For God so loved the world')
    expect(out).toContain('“For God so loved the world”')
    expect(out).toContain('— John 3:16')
    expect(out).toContain('quiet-waters-meditation.com')
  })

  it('adds the translation tag when given', () => {
    expect(verseShareText('John 3:16', 'text', 'WEB')).toContain('— John 3:16 (WEB)')
  })

  it('prepends a personal note as a greeting', () => {
    const out = verseShareText('Psalm 23:1', 'Yahweh is my shepherd', undefined, 'Thinking of you.')
    expect(out.startsWith('Thinking of you.\n\n')).toBe(true)
    expect(out).toContain('“Yahweh is my shepherd”')
  })

  it('omits the note block when it is empty or whitespace', () => {
    expect(verseShareText('Psalm 23:1', 'text', undefined, '   ').startsWith('“')).toBe(true)
    expect(verseShareText('Psalm 23:1', 'text').startsWith('“')).toBe(true)
  })
})
