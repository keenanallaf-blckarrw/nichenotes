// Fetches shop pages the way a browser would, so the checker sees what a visitor sees.

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

export interface Page {
  status: number
  /** Where the request ended up after following redirects. */
  url: string
  contentType: string
  body: string
}

/**
 * GET a page, following redirects and keeping cookies along the way. Some shops
 * (Novesta, for one) send visitors through a country picker that only lets them
 * through once a cookie is set. Retries once on network errors and server errors.
 */
export async function get(url: string, { timeoutMs = 20_000, retries = 1 } = {}): Promise<Page> {
  try {
    const page = await getOnce(url, timeoutMs)
    if (page.status >= 500 && retries > 0) return retry(url, timeoutMs, retries)
    return page
  } catch (error) {
    if (retries > 0) return retry(url, timeoutMs, retries)
    throw error
  }
}

async function retry(url: string, timeoutMs: number, retries: number): Promise<Page> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return get(url, { timeoutMs, retries: retries - 1 })
}

async function getOnce(url: string, timeoutMs: number): Promise<Page> {
  const cookies = new Map<string, Map<string, string>>()
  let current = url
  for (let hop = 0; hop < 10; hop++) {
    const host = new URL(current).host
    const jar = cookies.get(host)
    const res = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        ...(jar?.size ? { cookie: [...jar].map(([name, value]) => `${name}=${value}`).join('; ') } : {}),
      },
    })
    for (const line of res.headers.getSetCookie()) {
      const pair = line.split(';')[0]
      const eq = pair.indexOf('=')
      if (eq <= 0) continue
      const hostJar = cookies.get(host) ?? new Map<string, string>()
      hostJar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
      cookies.set(host, hostJar)
    }
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      await res.body?.cancel()
      current = new URL(location, current).toString()
      continue
    }
    return { status: res.status, url: current, contentType: res.headers.get('content-type') ?? '', body: await res.text() }
  }
  throw new Error('too many redirects')
}

/** A short, readable reason for a failed request. */
export function reason(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'TimeoutError') return 'the site took too long to answer'
    const cause = (error as Error & { cause?: { code?: string } }).cause?.code
    if (cause === 'ENOTFOUND') return 'the web address no longer exists'
    return cause ?? error.message
  }
  return String(error)
}
