import { useEffect, useMemo, useRef } from 'react'
import { explain } from '../engine'
import { QUOTES, itemName } from '../data/catalog'
import type { AnyItem } from '../data/types'
import { useStore, type FeedEntry } from '../state/store'
import { ItemCard, UnlockCard } from '../components/cards/Cards'
import { Logo } from '../components/bits'
import { VibeMeter } from '../components/Shell'

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
]

function roman(n: number): string {
  let out = ''
  for (const [v, s] of ROMAN) while (n >= v) (out += s), (n -= v)
  return out
}

/** Today's date the way Caesar would carve it: XXIII · IX · MMXXVI */
function romanDate(d = new Date()): string {
  return `${roman(d.getDate())} · ${roman(d.getMonth() + 1)} · ${roman(d.getFullYear())}`
}

function DailyWord() {
  const store = useStore()
  const quote = useMemo(() => {
    const pool = QUOTES.filter((q) => !store.mentor || q.mentor === store.mentor)
    const day = Math.floor(Date.now() / 86_400_000)
    return pool[day % pool.length]
  }, [store.mentor])
  const hello = store.handle ? `Morning, @${store.handle}` : 'Morning'
  return (
    <section className="slab mt-4 px-6 pt-6 pb-6">
      <div className="relative z-[1]">
        <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.16em] text-slab-ink-2 uppercase">
          <span>{hello}</span>
          <span className="tnum">{romanDate()}</span>
        </div>
        <blockquote className="mt-5 font-serif text-[34px] leading-[1.1] font-medium italic sm:text-[40px]">{quote.translation ?? quote.text}</blockquote>
        {quote.translation && <p className="mt-2 font-serif text-[18px] text-slab-ink-2 italic">{quote.text}</p>}
        <div className="mt-5 text-[13px] font-semibold tracking-[0.14em] uppercase">{quote.author}</div>
        <div className="font-mono text-[11px] text-slab-ink-2">{quote.source}</div>
      </div>
    </section>
  )
}

/** Tracks impressions (for exploration) and dwell (a weak positive signal). */
function Observed({ item, children }: { item: AnyItem; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const store = useStore()
  const storeRef = useRef(store)
  storeRef.current = store
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let seen = false
    let viewed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          if (!seen) {
            seen = true
            storeRef.current.impression(item)
          }
          if (!viewed) timer = setTimeout(() => ((viewed = true), storeRef.current.track('view', item)), 1800)
        } else if (timer) clearTimeout(timer)
      },
      { threshold: [0, 0.6] },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [item])
  return <div ref={ref}>{children}</div>
}

function Entry({ entry }: { entry: FeedEntry }) {
  const store = useStore()
  if (entry.unlock) return <UnlockCard combo={entry.unlock} />
  const item = store.lookup(entry.id!)
  if (!item) return null
  const anchor = entry.reason?.anchorId ? store.lookup(entry.reason.anchorId) : undefined
  const why = entry.reason ? explain(entry.reason, store.profile, anchor ? itemName(anchor) : undefined) : undefined
  return (
    <Observed item={item}>
      <div className={entry.reason?.kind === 'similar' ? 'anim-rise' : undefined}>
        <ItemCard item={item} why={why} />
      </div>
    </Observed>
  )
}

export function Feed() {
  const store = useStore()
  const sentinel = useRef<HTMLDivElement>(null)
  const loadRef = useRef(store.loadMore)
  loadRef.current = store.loadMore

  useEffect(() => {
    if (store.feed.length === 0) loadRef.current()
  }, [store.feed.length])

  useEffect(() => {
    const el = sentinel.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && loadRef.current(), { rootMargin: '600px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div>
      <header className="sticky top-0 z-20 -mx-4 border-b border-line bg-bg/92 px-4 pt-3 pb-2.5 backdrop-blur-md" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
        </div>
        <div className="mt-2 flex items-center gap-3 lg:mt-0">
          <span className="display shrink-0 text-[20px]">For you</span>
          <div className="min-w-0 flex-1">
            <VibeMeter compact />
          </div>
        </div>
      </header>

      <DailyWord />

      <div className="mt-5 flex flex-col gap-5">
        {store.feed.map((e) => (
          <Entry key={e.key} entry={e} />
        ))}
      </div>
      <div ref={sentinel} className="py-10 text-center">
        <button className="btn btn-ghost" onClick={() => store.loadMore()}>
          Keep digging
        </button>
      </div>
    </div>
  )
}
