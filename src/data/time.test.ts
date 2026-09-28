import { describe, expect, it } from 'vitest'
import { dayKey, dayNumber, streak } from './time'

describe('dayKey', () => {
  it('uses the local calendar day, not UTC', () => {
    // 11:30 pm local time stays on the 5th wherever the test runs.
    expect(dayKey(new Date(2026, 8, 5, 23, 30))).toBe('2026-09-05')
    expect(dayKey(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01')
  })
})

describe('dayNumber', () => {
  it('changes at local midnight, not in the evening', () => {
    const evening = dayNumber(new Date(2026, 8, 5, 23, 59))
    expect(dayNumber(new Date(2026, 8, 5, 0, 1))).toBe(evening)
    expect(dayNumber(new Date(2026, 8, 6, 0, 1))).toBe(evening + 1)
  })
})

describe('streak', () => {
  const now = new Date(2026, 8, 10, 21, 0)
  const log = (days: number[]) => Object.fromEntries(days.map((d) => [dayKey(new Date(2026, 8, d)), ['r1']]))

  it('counts consecutive days ending today', () => {
    expect(streak(log([8, 9, 10]), now)).toBe(3)
  })

  it('keeps yesterday’s streak alive before today’s habit is done', () => {
    expect(streak(log([8, 9]), now)).toBe(2)
  })

  it('breaks on a missed day', () => {
    expect(streak(log([6, 7, 9, 10]), now)).toBe(2)
    expect(streak(log([7, 8]), now)).toBe(0)
  })

  it('ignores empty days', () => {
    expect(streak({ [dayKey(now)]: [] }, now)).toBe(0)
  })
})
