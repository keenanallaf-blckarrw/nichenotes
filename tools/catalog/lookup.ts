// Finds products in a Shopify shop, to make adding a brand quick.
// Run it with: npm run lookup -- teotl.co tallow balm
import { get } from './http'
import { currencyFromHtml, metaTags } from './parse'

interface ShopifyProduct {
  title: string
  handle: string
  variants: { price: string; compare_at_price: string | null; available?: boolean; title: string }[]
}

const [store, ...words] = process.argv.slice(2)
if (!store) {
  console.log('Usage: npm run lookup -- <shop address> [words to match]\nExample: npm run lookup -- teotl.co lip balm')
  process.exit(1)
}

const origin = new URL(store.startsWith('http') ? store : `https://${store}`).origin
const home = await get(origin)
const description = metaTags(home.body).get('description') ?? metaTags(home.body).get('og:description')
console.log(`${origin}${description ? `\n${description.trim()}` : ''}\n`)

const products: ShopifyProduct[] = []
for (let page = 1; page <= 4; page++) {
  const res = await get(`${origin}/products.json?limit=250&page=${page}`)
  let batch: ShopifyProduct[] = []
  try {
    batch = (JSON.parse(res.body) as { products?: ShopifyProduct[] }).products ?? []
  } catch {
    if (page === 1) {
      console.log("This shop doesn't share a product list (it isn't on Shopify, or it blocks it). Look the product up on its site.")
      process.exit(1)
    }
  }
  products.push(...batch)
  if (batch.length < 250) break
}

const want = words.map((w) => w.toLowerCase())
const hits = products.filter((p) => want.every((w) => p.title.toLowerCase().includes(w)))
const currency = currencyFromHtml(home.body)
console.log(`${hits.length} of ${products.length} products match${want.length ? ` "${want.join(' ')}"` : ''}.${currency ? ` Prices in ${currency} (the shop's own currency).` : ''}\n`)
for (const p of hits.slice(0, 30)) {
  const prices = p.variants.map((v) => Number(v.price)).filter((n) => n > 0)
  const regular = p.variants.filter((v) => Number(v.compare_at_price ?? 0) > Number(v.price)).map((v) => Number(v.compare_at_price))
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  const price = low === high ? low.toFixed(2) : `${low.toFixed(2)}–${high.toFixed(2)}`
  const stock = p.variants.some((v) => v.available !== false) ? '' : ' · sold out'
  console.log(`${p.title}\n  ${price}${regular.length ? ` (regular ${Math.max(...regular).toFixed(2)})` : ''}${stock}\n  ${origin}/products/${p.handle}\n`)
}
