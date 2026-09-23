// Bump when stored shapes change; older data is simply ignored.
const KEY = 'nichenotes:v2'

// Storage can be missing or throw (private windows, sandboxed previews), so the
// app must always work without it.
export function load<T>(): T | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function save(value: unknown): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    /* ignore: the prototype keeps working in memory */
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
