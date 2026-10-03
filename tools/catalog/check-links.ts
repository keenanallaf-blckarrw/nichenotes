// Checks every real brand link in the app: does it still open the right page, and is the price still right?
// Run it with: npm run check:links
import type { FindItem } from '../../src/data/types'
import { REAL_FINDS, REAL_SHOPS } from '../../src/data/brands'
import { get, reason, type Page } from './http'
import { judgeLink, judgePrice, type Issue } from './judge'
import { currencyFromHtml, fromPageTags, fromShopify, fromStructuredData, type FoundPrice } from './parse'

interface Job {
  kind: 'product' | 'shop'
  brand: string
  label: string
  url: string
  find?: FindItem
}

interface Result extends Job {
  issues: Issue[]
}

const SHOP_NAME = Object.fromEntries(REAL_SHOPS.map((s) => [s.id, s.name]))

const jobs: Job[] = [
  ...REAL_SHOPS.map((s): Job => ({ kind: 'shop', brand: s.name, label: 'Shop page', url: s.url })),
  ...REAL_FINDS.map((f): Job => ({ kind: 'product', brand: SHOP_NAME[f.shop] ?? f.shop, label: f.name, url: f.url ?? '', find: f })),
]

async function readPrice(page: Page): Promise<FoundPrice | undefined> {
  const url = new URL(page.url)
  // Shopify shops publish each product at /products/<handle>.js, with every size and its stock.
  if (/\/products\/[^/]+\/?$/.test(url.pathname)) {
    try {
      const js = await get(`${url.origin}${url.pathname.replace(/\/$/, '')}.js`, { retries: 0 })
      if (js.status === 200 && /json|javascript/.test(js.contentType)) {
        const found = fromShopify(JSON.parse(js.body))
        if (found) return { ...found, currency: currencyFromHtml(page.body) }
      }
    } catch {
      /* Not a Shopify shop. */
    }
  }
  return fromStructuredData(page.body, page.url) ?? fromPageTags(page.body)
}

async function check(job: Job): Promise<Issue[]> {
  if (!job.url) return [{ severity: 'problem', message: 'Has no link.' }]
  let page: Page
  try {
    page = await get(job.url)
  } catch (error) {
    return judgeLink(job.url, { error: reason(error) }, job.kind)
  }
  const linkIssues = judgeLink(job.url, { status: page.status, finalUrl: page.url }, job.kind)
  if (job.kind === 'shop' || !job.find || linkIssues.length) return linkIssues
  return judgePrice(job.find, await readPrice(page))
}

/** One shop at a time per website, several websites at once: quick, and polite to small shops. */
async function runAll(all: Job[], parallel = 6): Promise<Result[]> {
  const byHost = new Map<string, Job[]>()
  for (const job of all) {
    const host = job.url ? new URL(job.url).host : 'none'
    byHost.set(host, [...(byHost.get(host) ?? []), job])
  }
  const queues = [...byHost.values()]
  const results: Result[] = []
  let done = 0
  const progress = () => process.stderr.isTTY && process.stderr.write(`\rChecking ${all.length} links… ${done}/${all.length}`)
  async function worker() {
    for (let queue = queues.shift(); queue; queue = queues.shift()) {
      for (const job of queue) {
        results.push({ ...job, issues: await check(job) })
        done++
        progress()
      }
    }
  }
  await Promise.all(Array.from({ length: parallel }, worker))
  if (process.stderr.isTTY) process.stderr.write('\r\x1b[K')
  return results
}

function print(results: Result[]): number {
  const color = process.stdout.isTTY
  const paint = (code: number, s: string) => (color ? `\x1b[${code}m${s}\x1b[0m` : s)
  const order = (r: Result) => `${r.brand} ${r.kind === 'shop' ? 0 : 1} ${r.label}`
  const sorted = [...results].sort((a, b) => order(a).localeCompare(order(b)))
  const problems = sorted.filter((r) => r.issues.some((i) => i.severity === 'problem'))
  const notes = sorted.filter((r) => !problems.includes(r) && r.issues.length)

  const section = (title: string, rows: Result[], mark: string) => {
    if (!rows.length) return
    console.log(`\n${title}`)
    for (const r of rows) {
      console.log(`  ${mark} ${r.brand}: ${r.label}`)
      for (const issue of r.issues) console.log(`      ${issue.message}`)
      console.log(paint(2, `      ${r.url}`))
    }
  }

  const products = results.filter((r) => r.kind === 'product').length
  console.log(`Checked ${results.length} links: ${REAL_SHOPS.length} brands and ${products} products.`)
  section(paint(31, `Problems to fix (${problems.length})`), problems, paint(31, '✗'))
  section(paint(33, `Worth a look (${notes.length})`), notes, paint(33, '•'))
  const fine = results.length - problems.length - notes.length
  console.log(`\n${paint(32, '✓')} ${fine} of ${results.length} links open the right page with the right price.`)
  if (problems.length) console.log('Fix the problems in src/data/brands.ts, then run this again.')
  return problems.length
}

const problems = print(await runAll(jobs))
process.exit(problems ? 1 : 0)
