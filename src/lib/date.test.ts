import { describe, it, expect } from 'vitest'
import { dayKey, dayKeyBefore, daysBetween, formatMinutes, formatClock } from './date'

describe('dayKey', () => {
  it('formats a date as local YYYY-MM-DD', () => {
    expect(dayKey(new Date(2026, 8, 2))).toBe('2026-09-02') // month is 0-indexed
  })
  it('zero-pads month and day', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('daysBetween', () => {
  it('counts whole days (b - a)', () => {
    expect(daysBetween('2026-09-01', '2026-09-02')).toBe(1)
    expect(daysBetween('2026-09-02', '2026-09-01')).toBe(-1)
    expect(daysBetween('2026-09-02', '2026-09-02')).toBe(0)
  })
  it('spans month and year boundaries', () => {
    expect(daysBetween('2026-08-31', '2026-09-01')).toBe(1)
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1)
  })
})

describe('dayKeyBefore', () => {
  it('returns the key N days earlier', () => {
    const from = new Date(2026, 8, 2)
    expect(dayKeyBefore(0, from)).toBe('2026-09-02')
    expect(dayKeyBefore(1, from)).toBe('2026-09-01')
    expect(dayKeyBefore(2, from)).toBe('2026-08-31')
  })
})

describe('formatMinutes', () => {
  it('shows minutes under an hour', () => {
    expect(formatMinutes(600)).toBe('10 min')
    expect(formatMinutes(59)).toBe('1 min') // rounds to the nearest minute
  })
  it('shows hours and minutes', () => {
    expect(formatMinutes(3900)).toBe('1 hr 5 min')
    expect(formatMinutes(3600)).toBe('1 hr')
    expect(formatMinutes(7200)).toBe('2 hr')
  })
})

describe('formatClock', () => {
  it('formats mm:ss with a zero-padded seconds field', () => {
    expect(formatClock(90)).toBe('1:30')
    expect(formatClock(5)).toBe('0:05')
    expect(formatClock(0)).toBe('0:00')
  })
  it('clamps negatives to 0:00', () => {
    expect(formatClock(-5)).toBe('0:00')
  })
})
