const DAY = 86_400_000

/** Catalog timestamps are relative to app load so "new this week" stays true in the prototype. */
export const LOADED_AT = Date.now()

export function daysAgo(n: number): number {
  return LOADED_AT - n * DAY
}

/** yyyy-mm-dd in the person's own time zone, so evening activity counts for that evening's day. */
export function dayKey(date: Date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

/**
 * Days in a row with at least one entry in the log. A streak still counts until
 * the day ends, so it runs from today, or from yesterday if today is still empty.
 */
export function streak(log: Record<string, string[]>, now: Date = new Date()): number {
  const d = new Date(now)
  if (!log[dayKey(d)]?.length) d.setDate(d.getDate() - 1)
  let n = 0
  while (log[dayKey(d)]?.length) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
