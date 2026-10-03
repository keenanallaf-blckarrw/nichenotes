import { describe, expect, it } from 'vitest'
import { judgeLink, judgePrice } from './judge'
import { baseDomain, currencyFromHtml, fromPageTags, fromShopify, fromStructuredData, parseAmount, samePage } from './parse'

describe('reading prices', () => {
  it('reads every Shopify variant, in dollars, with sale prices', () => {
    const found = fromShopify({
      available: true,
      variants: [
        { price: 585, compare_at_price: null },
        { price: 1400, compare_at_price: 1900 },
      ],
    })
    expect(found).toEqual({ prices: [5.85, 14], regular: [19], available: true, source: 'shopify' })
    expect(fromShopify('<html>')).toBeUndefined()
  })

  it('picks the product that matches the page from structured data', () => {
    const html = `
      <script type="application/ld+json">{"@type":"Product","url":"https://shop.com/product/other/","offers":{"price":"74.00","priceCurrency":"USD"}}</script>
      <script type="application/ld+json">{"@graph":[{"@type":"WebPage"},{"@type":"Product","@id":"https://www.shop.com/product/unburden-serum/#product",
        "offers":[{"@type":"Offer","price":"102.00","priceCurrency":"usd","availability":"https://schema.org/InStock"}]}]}</script>`
    expect(fromStructuredData(html, 'https://www.shop.com/product/unburden-serum/')).toEqual({
      prices: [102],
      regular: [],
      currency: 'USD',
      available: true,
      source: 'structured data',
    })
  })

  it('reads aggregate offers and product groups, and survives broken JSON', () => {
    const html = `<script type="application/ld+json">{oops</script>
      <script type="application/ld+json">{"@type":"ProductGroup","hasVariant":[{"offers":{"price":30}},{"offers":{"@type":"AggregateOffer","lowPrice":"25","highPrice":"40","availability":"OutOfStock"}}]}</script>`
    expect(fromStructuredData(html, 'https://x.com/p')?.prices).toEqual([25, 30, 40])
    expect(fromStructuredData(html, 'https://x.com/p')?.available).toBe(false)
  })

  it('falls back to price tags, in any attribute order', () => {
    const html = `<meta content="70" property="product:price:amount"/><meta property='product:price:currency' content='eur'>`
    expect(fromPageTags(html)).toEqual({ prices: [70], regular: [], currency: 'EUR', source: 'page tags' })
    expect(currencyFromHtml('<script>Shopify.currency = {"active":"GBP","rate":"1.0"};</script>')).toBe('GBP')
  })

  it('understands written prices', () => {
    expect(parseAmount('1,234.50')).toBe(1234.5)
    expect(parseAmount('70,00')).toBe(70)
    expect(parseAmount('$16.99')).toBe(16.99)
    expect(parseAmount('free')).toBeUndefined()
    expect(parseAmount(0)).toBeUndefined()
  })
})

describe('judging links', () => {
  it('flags broken pages and brands that moved', () => {
    expect(judgeLink('https://a.com/products/x', { status: 404, finalUrl: 'https://a.com/products/x' }, 'product')[0].message).toMatch(/not found/)
    expect(judgeLink('https://cowboynco.com/products/x', { status: 200, finalUrl: 'https://www.ocasabotanica.com/products/y' }, 'product')[0].message).toMatch(
      /redirects to ocasabotanica\.com/,
    )
  })

  it('flags a product link that now lands somewhere else, but allows country paths', () => {
    expect(judgeLink('https://a.com/products/x', { status: 200, finalUrl: 'https://a.com/collections/all' }, 'product')).toHaveLength(1)
    expect(judgeLink('https://a.com/products/x', { status: 200, finalUrl: 'https://www.a.com/en-us/products/x/' }, 'product')).toEqual([])
    expect(judgeLink('https://us.a.com', { status: 200, finalUrl: 'https://us.a.com/en' }, 'shop')).toEqual([])
  })

  it('asks for a hand check when a shop blocks automatic visitors', () => {
    const [issue] = judgeLink('https://a.com/products/x', { status: 403, finalUrl: 'https://a.com/products/x' }, 'product')
    expect(issue.severity).toBe('note')
  })

  it('treats subdomains as the same business', () => {
    expect(baseDomain('us.gonovesta.com')).toBe('gonovesta.com')
    expect(baseDomain('shop.example.co.uk')).toBe('example.co.uk')
    expect(samePage('https://a.com/', 'https://a.com/en-us')).toBe(true)
  })
})

describe('judging prices', () => {
  const found = (prices: number[], extra = {}) => ({ prices, regular: [], source: 'shopify' as const, ...extra })

  it('accepts a listed price that matches any size', () => {
    expect(judgePrice({ price: 14 }, found([5.85, 14]))).toEqual([])
  })

  it('needs the lowest price to match for "from" prices', () => {
    expect(judgePrice({ price: 64, priceFrom: true }, found([64, 70]))).toEqual([])
    expect(judgePrice({ price: 60, priceFrom: true }, found([64, 70]))[0].message).toBe('Listed from $60, but the shop now shows $64–$70.')
  })

  it('notes sales and sold-out items without calling them wrong', () => {
    const issues = judgePrice({ price: 19 }, found([9.5], { regular: [19], available: false }))
    expect(issues.map((i) => i.severity)).toEqual(['note', 'note'])
    expect(issues[0].message).toBe('On sale right now for $9.50 (regular $19).')
  })

  it('compares foreign prices in the shop’s own currency', () => {
    expect(judgePrice({ price: 240, approx: true, shopPrice: { amount: 180, currency: 'GBP' } }, found([180, 205], { currency: 'GBP' }))).toEqual([])
    expect(judgePrice({ price: 81 }, found([70], { currency: 'EUR' }))[0].message).toMatch(/shows prices in EUR/)
  })

  it('lets "about" prices drift a little with exchange rates', () => {
    expect(judgePrice({ price: 94, approx: true }, found([94.14], { currency: 'USD' }))).toEqual([])
    expect(judgePrice({ price: 94, approx: true }, found([120], { currency: 'USD' }))[0].message).toBe('Listed about $94, but the shop now shows $120.')
    expect(judgePrice({ price: 94 }, found([94.14], { currency: 'USD' }))).toHaveLength(1)
  })

  it('reads WooCommerce prices nested in priceSpecification', () => {
    const html = `<script type="application/ld+json">{"@type":"Product","offers":[{"@type":"Offer","priceSpecification":[{"price":"102.00","priceCurrency":"USD"}]}]}</script>`
    expect(fromStructuredData(html, 'https://x.com/p')?.prices).toEqual([102])
  })

  it('asks for a hand check when no price could be read', () => {
    expect(judgePrice({ price: 10 }, undefined)[0].severity).toBe('note')
  })
})
