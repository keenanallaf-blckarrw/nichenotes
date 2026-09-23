import { useEffect, useMemo, useRef } from 'react'
import { explain, isNotable } from '../engine'
import { QUOTES, itemName } from '../data/catalog'
import type { AnyItem } from '../data/types'
import { useStore, type FeedEntry } from '../state/store'
import { ItemCard, UnlockCard } from '../components/cards/Cards'
import { PageTitle } from '../components/bits'
import { useUI } from '../state/ui'
import { MapPin } from 'lucide-react'

function today(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

/** The morning quote: the reason to open the app every day. */
function DailyQuote() {
  const store = useStore()
  const quote = useMemo(() => {
    const pool = store.themes.length ? QUOTES.filter((q) => store.themes.includes(q.theme)) : QUOTES
    const day = Math.floor(Date.now() / 86_400_000)
    return pool[day % pool.length]
  }, [store.themes])
  return (
    <section className="pt-4 pb-2">
      <blockquote className="t-quote text-[1.875rem] leading-[1.2] sm:text-[2.125rem]">{quote.translation ?? quote.text}</blockquote>
      {quote.translation && <p className="t-sub mt-2 text-ink-2 italic">{quote.text}</p>}
      <p className="t-sub mt-4 font-semibold">{quote.author}</p>
      <p className="t-foot text-ink-2">{quote.source}</p>
    </section>
  )
}

/** Tracks impressions (for exploration) and dwell time (a weak positive signal). */
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
  const why = entry.reason ? { text: explain(entry.reason, store.profile, anchor ? itemName(anchor) : undefined), visible: isNotable(entry.reason) } : undefined
  return (
    <Observed item={item}>
      <div className={entry.reason?.kind === 'similar' ? 'anim-rise' : undefined}>
        <ItemCard item={item} why={why} />
      </div>
    </Observed>
  )
}

/** One gentle, dismissible nudge to turn on the local side of the app. */
function AreaPrompt() {
  const store = useStore()
  const ui = useUI()
  if (store.area || store.areaPromptDismissed) return null
  return (
    <section className="mt-8 rounded-[20px] bg-surface px-5 py-5">
      <p className="t-headline flex items-center gap-2">
        <MapPin size={18} className="text-accent-text" aria-hidden="true" /> Games and meetups near you
      </p>
      <p className="t-sub mt-1 text-ink-2">Pickup games, walks and meetups from clubs you like, within a distance you choose.</p>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary" onClick={() => ui.open({ kind: 'area' })}>
          Set your area
        </button>
        <button className="btn btn-secondary !bg-surface-2" onClick={store.dismissAreaPrompt}>
          Not now
        </button>
      </div>
    </section>
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
    const io = new IntersectionObserver(([e]) => e.isIntersecting && loadRef.current(), { rootMargin: '800px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div>
      <PageTitle title="For You" subtitle={today()} />
      <DailyQuote />
      <AreaPrompt />
      <div className="mt-10 flex flex-col gap-12">
        {store.feed.map((e) => (
          <Entry key={e.key} entry={e} />
        ))}
      </div>
      <div ref={sentinel} className="py-12 text-center">
        <button className="btn btn-secondary" onClick={() => store.loadMore()}>
          Show more
        </button>
      </div>
    </div>
  )
}
