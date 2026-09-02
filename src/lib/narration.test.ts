import { describe, it, expect } from 'vitest'
import { chunkText } from './narration'

describe('chunkText', () => {
  it('splits prose into sentence-sized chunks', () => {
    expect(chunkText('Be still. Know that I am God.')).toEqual([
      'Be still.',
      'Know that I am God.',
    ])
  })

  it('keeps terminal punctuation with each chunk', () => {
    expect(chunkText('Who is this? He is the King!')).toEqual(['Who is this?', 'He is the King!'])
  })

  it('breaks at semicolons and colons too', () => {
    expect(chunkText('One thing I ask: to dwell; to seek.')).toEqual([
      'One thing I ask:',
      'to dwell;',
      'to seek.',
    ])
  })

  it('splits on newlines', () => {
    expect(chunkText('Line one\nLine two')).toEqual(['Line one', 'Line two'])
  })

  it('drops empty and whitespace-only fragments', () => {
    expect(chunkText('   ')).toEqual([])
    expect(chunkText('Hello.   \n\n  World.')).toEqual(['Hello.', 'World.'])
  })

  it('handles a chunk with no terminal punctuation', () => {
    expect(chunkText('a fragment')).toEqual(['a fragment'])
  })
})
