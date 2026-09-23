const DAY = 86_400_000

/** Catalog timestamps are relative to app load so "new this week" stays true in the prototype. */
export const LOADED_AT = Date.now()

export function daysAgo(n: number): number {
  return LOADED_AT - n * DAY
}
