// Reads prices out of shop pages. Pure functions, so they can be tested without the network.

export interface FoundPrice {
  /** Every price the shop lists for the product (sizes, colors and so on). */
  prices: number[]
  /** Regular prices, for variants that are on sale. */
  regular: number[]
  /** Three-letter currency code, when the page says. */
  currency?: string
  available?: boolean
  source: 'shopify' | 'structured data' | 'page tags'
}

type Obj = Record<string, unknown>

const isObject = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const toArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v])
const unique = (ns: number[]) => [...new Set(ns.map((n) => Math.round(n * 100) / 100))].sort((a, b) => a - b)

/** "1,234.50", "70,00" or "16.99" as a number. Undefined when it isn't a price. */
export function parseAmount(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : undefined
  if (typeof value !== 'string') return undefined
  let s = value.trim().replace(/[^\d.,]/g, '')
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '')
  else if (/^\d+,\d{1,2}$/.test(s)) s = s.replace(',', '.')
  const n = Number(s)
  return s && Number.isFinite(n) && n > 0 ? n : undefined
}

/** A Shopify product, from the shop's `/products/<handle>.js` endpoint. Prices there are in cents. */
export function fromShopify(json: unknown): FoundPrice | undefined {
  if (!isObject(json) || !Array.isArray(json.variants)) return undefined
  const variants = json.variants.filter(isObject)
  const prices: number[] = []
  const regular: number[] = []
  for (const v of variants) {
    const price = Number(v.price) / 100
    if (!Number.isFinite(price) || price <= 0) continue
    prices.push(price)
    const compareAt = Number(v.compare_at_price) / 100
    if (Number.isFinite(compareAt) && compareAt > price) regular.push(compareAt)
  }
  if (!prices.length) return undefined
  return { prices: unique(prices), regular: unique(regular), available: typeof json.available === 'boolean' ? json.available : undefined, source: 'shopify' }
}

function walk(node: unknown, visit: (o: Obj) => void): void {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, visit))
  if (!isObject(node)) return
  visit(node)
  for (const value of Object.values(node)) if (typeof value === 'object') walk(value, visit)
}

const isProduct = (o: Obj) => toArray(o['@type']).some((t) => t === 'Product' || t === 'ProductGroup')

/** Comparable form of a page address: no "www.", no trailing slash, no #fragment. */
export function pageKey(url: string): string {
  try {
    const u = new URL(url)
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/+$/, '')}`.toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

/**
 * The product's schema.org data (the JSON-LD block most shop platforms add for search
 * engines). When a page describes several products, the one whose address matches wins.
 */
export function fromStructuredData(html: string, pageUrl: string): FoundPrice | undefined {
  const products: Obj[] = []
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      walk(JSON.parse(m[1].trim()), (o) => isProduct(o) && products.push(o))
    } catch {
      /* Some pages ship broken JSON-LD; skip that block. */
    }
  }
  if (!products.length) return undefined
  const wanted = pageKey(pageUrl)
  const product = products.find((p) => [p.url, p['@id']].some((u) => typeof u === 'string' && pageKey(u) === wanted)) ?? products[0]
  const offers = [...toArray(product.offers), ...toArray(product.hasVariant).flatMap((v) => (isObject(v) ? toArray(v.offers) : []))].flatMap((o) =>
    isObject(o) && o.offers ? [o, ...toArray(o.offers)] : [o],
  )
  const prices: number[] = []
  let currency: string | undefined
  let available: boolean | undefined
  for (const offer of offers.filter(isObject)) {
    // WooCommerce and some others put the price one level down, in priceSpecification.
    for (const spec of [offer, ...toArray(offer.priceSpecification).filter(isObject)]) {
      for (const key of ['price', 'lowPrice', 'highPrice']) {
        const n = parseAmount(spec[key])
        if (n !== undefined) prices.push(n)
      }
      if (typeof spec.priceCurrency === 'string') currency ??= spec.priceCurrency.toUpperCase()
    }
    if (typeof offer.availability === 'string') available = (available ?? false) || /InStock|PreOrder|LimitedAvailability|OnlineOnly/i.test(offer.availability)
  }
  if (!prices.length) return undefined
  return { prices: unique(prices), regular: [], currency, available, source: 'structured data' }
}

/** Attributes of one HTML tag, lowercased names. */
function attributes(tag: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) out.set(m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? '')
  return out
}

/** `<meta>` tags by property, name or itemprop. The first of each wins. */
export function metaTags(html: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(m[0])
    const key = (attrs.get('property') ?? attrs.get('name') ?? attrs.get('itemprop'))?.toLowerCase()
    const content = attrs.get('content')
    if (key && content !== undefined && !out.has(key)) out.set(key, content)
  }
  return out
}

/** The price tags many shops add for link previews (`product:price:amount`, `og:price:amount`). */
export function fromPageTags(html: string): FoundPrice | undefined {
  const tags = metaTags(html)
  const amount = parseAmount(tags.get('product:price:amount') ?? tags.get('og:price:amount') ?? tags.get('price'))
  if (amount === undefined) return undefined
  const currency = tags.get('product:price:currency') ?? tags.get('og:price:currency') ?? tags.get('pricecurrency')
  return { prices: [amount], regular: [], currency: currency?.toUpperCase(), source: 'page tags' }
}

/** The currency a page shows prices in, from its tags or Shopify's own setting. */
export function currencyFromHtml(html: string): string | undefined {
  const tags = metaTags(html)
  const tagged = tags.get('og:price:currency') ?? tags.get('product:price:currency')
  if (tagged) return tagged.toUpperCase()
  return html.match(/Shopify\.currency\s*=\s*\{[^}]*"active"\s*:\s*"([A-Z]{3})"/)?.[1]
}

/** "shop.example.co.uk" → "example.co.uk". Good enough to tell one business's site from another's. */
export function baseDomain(host: string): string {
  const labels = host.toLowerCase().replace(/\.$/, '').split('.')
  const twoPart = labels.length >= 3 && labels.at(-1)!.length === 2 && ['co', 'com', 'org', 'net', 'ac', 'gov'].includes(labels.at(-2)!)
  return labels.slice(twoPart ? -3 : -2).join('.')
}

/**
 * Whether a redirect still landed on the same page. Shops often add a country path
 * (/en-us/products/x) or a trailing slash, so only the last part of the path must match.
 */
export function samePage(from: string, to: string): boolean {
  const last = (url: string) =>
    new URL(url).pathname
      .replace(/\.html?$/, '')
      .split('/')
      .filter(Boolean)
      .at(-1)
      ?.toLowerCase()
  const want = last(from)
  return want === undefined || want === last(to)
}
