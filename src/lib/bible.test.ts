import { describe, it, expect } from 'vitest'
import { apiReference, expectedVerseCount } from './bible'
import { SINGLE_CHAPTER_VERSES, bookByName } from '../data/bible'

describe('apiReference (single-chapter books)', () => {
  it('expands a single-chapter book to its full verse range', () => {
    // bible-api reads "Jude 1" as verse 1 — request the whole book instead.
    expect(apiReference('Jude 1')).toBe('Jude 1:1-25')
    expect(apiReference('2 John 1')).toBe('2 John 1:1-13')
    expect(apiReference('3 John 1')).toBe('3 John 1:1-14')
    expect(apiReference('Obadiah 1')).toBe('Obadiah 1:1-21')
    expect(apiReference('Philemon 1')).toBe('Philemon 1:1-25')
  })

  it('leaves multi-chapter references untouched', () => {
    expect(apiReference('John 1')).toBe('John 1')
    expect(apiReference('Genesis 1')).toBe('Genesis 1')
    expect(apiReference('1 John 1')).toBe('1 John 1') // multi-chapter, not remapped
    expect(apiReference('Psalms 23')).toBe('Psalms 23')
  })
})

describe('expectedVerseCount', () => {
  it('is defined only for single-chapter books at chapter 1', () => {
    expect(expectedVerseCount('Jude 1')).toBe(25)
    expect(expectedVerseCount('John 1')).toBeUndefined()
    expect(expectedVerseCount('Psalms 23')).toBeUndefined()
  })
})

describe('SINGLE_CHAPTER_VERSES', () => {
  it('covers exactly the five single-chapter books', () => {
    expect(Object.keys(SINGLE_CHAPTER_VERSES).sort()).toEqual(
      ['2 John', '3 John', 'Jude', 'Obadiah', 'Philemon'].sort(),
    )
  })

  it('each entry is a real single-chapter book in BOOKS', () => {
    for (const name of Object.keys(SINGLE_CHAPTER_VERSES)) {
      expect(bookByName(name)?.chapters).toBe(1)
    }
  })
})
