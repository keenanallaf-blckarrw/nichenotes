// Turns what the checker found into plain-language problems and notes.
import type { FindItem } from '../../src/data/types'
import { baseDomain, samePage, type FoundPrice } from './parse'

/** A problem means the app shows something wrong; a note is worth a look but not wrong. */
export type Severity = 'problem' | 'note'

export interface Issue {
  severity: Severity
  message: string
}

export interface LinkResult {
  status?: number
  /** Where the link ended up after redirects. */
  finalUrl?: string
  error?: string
}

const SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' }

export function formatPrice(amount: number, currency = 'USD'): string {
  const symbol = SYMBOLS[currency] ?? `${currency} `
  return `${symbol}${amount.toFixed(Number.isInteger(amount) ? 0 : 2)}`
}

export function judgeLink(link: string, result: LinkResult, kind: 'product' | 'shop'): Issue[] {
  if (result.error) return [{ severity: 'problem', message: `Couldn't open the page: ${result.error}.` }]
  if (!result.status || !result.finalUrl) return [{ severity: 'problem', message: 'Got no answer from the site.' }]
  if ([401, 403, 429].includes(result.status)) {
    // Many shops turn away automated visitors while the page works fine in a browser.
    return [{ severity: 'note', message: `The shop blocks automatic checks (${result.status}). Open the link to make sure it works.` }]
  }
  if (result.status >= 400) {
    const what = result.status === 404 || result.status === 410 ? 'Page not found' : 'The site returned an error'
    return [{ severity: 'problem', message: `${what} (${result.status}).` }]
  }
  const from = new URL(link)
  const to = new URL(result.finalUrl)
  if (baseDomain(from.hostname) !== baseDomain(to.hostname)) {
    return [{ severity: 'problem', message: `Now redirects to ${to.hostname.replace(/^www\./, '')}. The brand may have moved, renamed or closed.` }]
  }
  if (kind === 'product' && !samePage(link, result.finalUrl)) {
    return [{ severity: 'problem', message: `Now opens a different page: ${result.finalUrl}` }]
  }
  return []
}

type PricedFind = Pick<FindItem, 'price' | 'priceFrom' | 'approx' | 'shopPrice'>

/** How far an "About $X" price may drift before it needs updating. Shops abroad convert to dollars daily. */
export const APPROX_TOLERANCE = 0.1

export function judgePrice(find: PricedFind, found: FoundPrice | undefined): Issue[] {
  if (!found) return [{ severity: 'note', message: "Couldn't read the price automatically. Check it by hand." }]
  const currency = found.currency ?? find.shopPrice?.currency ?? 'USD'
  let target: number
  let tolerance = 0.01
  if (currency === 'USD') {
    target = find.price
    if (find.approx) tolerance = find.price * APPROX_TOLERANCE
  } else if (find.shopPrice?.currency === currency) {
    target = find.shopPrice.amount
  } else {
    return [{ severity: 'problem', message: `The shop shows prices in ${currency}. Mark it "approx" with its shopPrice in ${currency}.` }]
  }
  const close = (a: number) => Math.abs(a - target) <= tolerance
  const min = Math.min(...found.prices)
  const max = Math.max(...found.prices)
  const matches = find.priceFrom ? close(min) : found.prices.some(close)
  const issues: Issue[] = []
  if (!matches) {
    const now = min === max ? formatPrice(min, currency) : `${formatPrice(min, currency)}–${formatPrice(max, currency)}`
    if (found.regular.some(close)) {
      issues.push({ severity: 'note', message: `On sale right now for ${formatPrice(min, currency)} (regular ${formatPrice(target, currency)}).` })
    } else {
      const listed = `${find.priceFrom ? 'from' : find.approx && currency === 'USD' ? 'about' : 'at'} ${formatPrice(target, currency)}`
      issues.push({ severity: 'problem', message: `Listed ${listed}, but the shop now shows ${now}.` })
    }
  }
  if (found.available === false) issues.push({ severity: 'note', message: 'Sold out right now.' })
  return issues
}
