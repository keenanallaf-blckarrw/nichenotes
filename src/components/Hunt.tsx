import { ArrowUpRight } from 'lucide-react'
import type { Tags } from '../engine'
import { MAX_PRICE, ebayUrl, etsyUrl, type Hunt } from '../data/market'
import { useStore } from '../state/store'

/** Etsy and eBay searches for one query. Opening one teaches the feed, like a shop tap. */
export function HuntLinks({ query, tags }: { query: string; tags: Tags }) {
  const store = useStore()
  const link = 'inline-flex min-h-[44px] items-center gap-1 rounded-full bg-surface px-4 text-[0.9375rem] font-medium text-accent-text'
  return (
    <span className="flex shrink-0 gap-2">
      <a className={link} href={etsyUrl(query)} target="_blank" rel="noopener noreferrer" onClick={() => store.hunt(tags)} aria-label={`Search Etsy for ${query}`}>
        Etsy <ArrowUpRight size={15} aria-hidden="true" />
      </a>
      <a className={link} href={ebayUrl(query)} target="_blank" rel="noopener noreferrer" onClick={() => store.hunt(tags)} aria-label={`Search eBay for ${query}`}>
        eBay <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </span>
  )
}

/** A list of searches, each on its own row. */
export function HuntList({ hunts, showLabel = true }: { hunts: Hunt[]; showLabel?: boolean }) {
  return (
    <div className="mt-3 flex flex-col">
      {hunts.map((h) => (
        <div key={`${h.vibe}-${h.query}`} className="flex items-center gap-3 border-b-[0.5px] border-line py-2.5 last:border-b-0">
          <span className="min-w-0 flex-1">
            <span className="block first-letter:uppercase">{h.query}</span>
            {showLabel && <span className="t-foot block text-ink-2">{h.label}</span>}
          </span>
          <HuntLinks query={h.query} tags={{ [h.vibe]: 1 }} />
        </div>
      ))}
    </div>
  )
}

export function HuntNote() {
  return <p className="t-foot mt-2 text-ink-3">Opens Etsy or eBay, showing items under ${MAX_PRICE}. One-offs, vintage and handmade.</p>
}
