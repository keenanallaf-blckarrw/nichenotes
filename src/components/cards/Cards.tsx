import { ArrowUpRight, Check, Sparkles, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COMBO_BY_ID, comboRecipe, effectiveAffinity } from '../../engine'
import { CREW_BY_ID, FIND_BY_ID, SHOP_BY_ID } from '../../data/catalog'
import type { AnyItem, FindItem, FitItem, PostItem, QuoteItem, RitualItem } from '../../data/types'
import { useStore } from '../../state/store'
import { useUI } from '../../state/ui'
import { ObjectArt } from '../ObjectArt'
import { Avatar, compact, money, timeAgo } from '../bits'
import { CardActions } from './CardActions'

export function WhyLine({ text, tone = 'default' }: { text: string; tone?: 'default' | 'slab' | 'partner' }) {
  const color = tone === 'slab' ? 'text-slab-ink-2' : tone === 'partner' ? 'text-gold' : 'text-ink-3'
  return <p className={`font-mono text-[11px] leading-snug tracking-wide ${color}`}>{text}</p>
}

export function QuoteCard({ item, why }: { item: QuoteItem; why?: string }) {
  const long = item.text.length > 110
  return (
    <article className="slab px-6 pt-7 pb-3">
      <div className="relative z-[1]">
        <div className="mb-4 font-mono text-[10.5px] tracking-[0.18em] text-slab-ink-2 uppercase">Words worth keeping</div>
        <blockquote className={`font-serif leading-[1.18] font-medium italic ${long ? 'text-[23px]' : 'text-[30px]'}`}>{item.text}</blockquote>
        {item.translation && <p className="mt-2 font-serif text-[18px] text-slab-ink-2">“{item.translation}”</p>}
        <footer className="mt-5">
          <div className="text-[13px] font-semibold tracking-[0.14em] uppercase">{item.author}</div>
          <div className="font-mono text-[11px] text-slab-ink-2">
            {item.source}
            {item.attributed && ' · attributed'}
          </div>
        </footer>
        <div className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-2">
          {why && <WhyLine text={why} tone="slab" />}
          <CardActions item={item} tone="slab" />
        </div>
      </div>
    </article>
  )
}

export function FindCard({ item, why, partner }: { item: FindItem; why?: string; partner?: boolean }) {
  const ui = useUI()
  const store = useStore()
  const shop = SHOP_BY_ID[item.shop]
  const openShop = () => {
    store.shopClick(item)
    ui.open({ kind: 'shop', id: item.id })
  }
  return (
    <article className="hang-tag overflow-hidden">
      <button className="block w-full text-left" onClick={() => (store.track('open', item), ui.open({ kind: 'item', id: item.id }))} aria-label={`Open ${item.name}`}>
        <div className="relative">
          <ObjectArt art={item.art} className="block aspect-[5/4] w-full" />
          <span className="tnum absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] text-white">N° {String(item.no).padStart(4, '0')}</span>
          {partner && <span className="absolute bottom-3 left-3 rounded-full bg-gold px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-wider text-bg uppercase">Partner</span>}
        </div>
      </button>
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[17px] leading-snug font-semibold">{item.name}</h3>
            <p className="text-[13px] text-ink-2">
              {shop.name} · {shop.location}
            </p>
          </div>
          <span className="tnum shrink-0 rounded-md border border-line px-2 py-0.5 font-mono text-[14px] font-medium">{money(item.price)}</span>
        </div>
        <p className="text-[14px] leading-relaxed text-ink-2">{item.blurb}</p>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn btn-accent !px-4 !py-2" onClick={openShop}>
            Shop at {shop.name} <ArrowUpRight size={16} />
          </button>
        </div>
        {why && <WhyLine text={why} tone={partner ? 'partner' : 'default'} />}
        <div className="-mx-2 border-t border-line pt-1">
          <CardActions item={item} />
        </div>
      </div>
    </article>
  )
}

export function FitCard({ item, why }: { item: FitItem; why?: string }) {
  const ui = useUI()
  const store = useStore()
  const finds = item.findIds.map((id) => FIND_BY_ID[id]).filter(Boolean)
  const total = finds.reduce((s, f) => s + f.price, 0)
  return (
    <article className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow)]">
      <div className="flex items-baseline justify-between px-4 pt-4">
        <span className="eyebrow">{item.label === 'Fit' ? 'Fit inspo' : 'The kit'}</span>
        <span className="tnum font-mono text-[12px] text-ink-2">
          {finds.length} pieces · {money(total)}
        </span>
      </div>
      <h3 className="display px-4 pt-1 text-[30px]">{item.name}</h3>
      <p className="px-4 pt-1 text-[14px] text-ink-2">{item.blurb}</p>
      <div className="grid grid-cols-2 gap-[3px] p-4">
        {finds.map((f) => (
          <button
            key={f.id}
            className="group relative overflow-hidden rounded-[8px] text-left"
            onClick={() => (store.track('open', f), ui.open({ kind: 'item', id: f.id }))}
            aria-label={`Open ${f.name}`}
          >
            <ObjectArt art={f.art} className="block aspect-square w-full transition-transform group-hover:scale-[1.03]" />
            <span className="tnum absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10.5px] text-white">{money(f.price)}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1 px-4 pb-2">
        {why && <WhyLine text={why} />}
        <div className="-mx-2 border-t border-line pt-1">
          <CardActions item={item} />
        </div>
      </div>
    </article>
  )
}

export function PostCard({ item, why }: { item: PostItem; why?: string }) {
  const crew = CREW_BY_ID[item.crew]
  // Posts are conversation, not merchandise: a flat row, no card chrome.
  return (
    <article className="border-y border-line px-1 py-4">
      <div className="flex gap-3">
        <Avatar name={item.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
            <span className="font-semibold">@{item.author}</span>
            <Link to={`/crews/${crew.id}`} className="text-accent hover:underline">
              {crew.name}
            </Link>
            <span className="text-ink-3">{timeAgo(item.createdAt)}</span>
          </div>
          <p className="mt-1 text-[15.5px] leading-relaxed">{item.text}</p>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-3">
            <span className="tnum">{compact(item.replies)} replies</span>
          </div>
          {why && (
            <div className="mt-1">
              <WhyLine text={why} />
            </div>
          )}
          <div className="-mx-2 mt-1">
            <CardActions item={item} likes={item.likes} />
          </div>
        </div>
      </div>
    </article>
  )
}

export function RitualCard({ item, why }: { item: RitualItem; why?: string }) {
  const store = useStore()
  const done = store.doneToday.includes(item.id)
  return (
    <article className="ticket flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Today's ritual</span>
        <span className="flex items-center gap-1 font-mono text-[12px] text-ink-2">
          <Timer size={14} /> {item.minutes ? `${item.minutes} min` : 'tonight'}
        </span>
      </div>
      <div>
        <h3 className="display text-[26px]">{item.title}</h3>
        <p className="mt-1 text-[14px] text-ink-2">{item.detail}</p>
      </div>
      <div className="flex items-center gap-2">
        {done ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-[14px] font-semibold text-accent">
            <Check size={16} /> Done{store.ritualStreak > 1 ? ` · ${store.ritualStreak}-day streak` : ''}
          </span>
        ) : (
          <>
            <button className="btn !py-2" onClick={() => store.ritual(item, true)}>
              <Check size={16} /> Done it
            </button>
            <button className="btn btn-ghost !py-2" onClick={() => (store.ritual(item, false), store.dismiss(item.id))}>
              Not today
            </button>
          </>
        )}
      </div>
      {why && <WhyLine text={why} />}
    </article>
  )
}

export function UnlockCard({ combo }: { combo: string }) {
  const store = useStore()
  const c = COMBO_BY_ID[combo]
  return (
    <article className="anim-rise relative overflow-hidden rounded-[14px] border border-gold bg-gold-soft px-5 py-5">
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-gold uppercase">
        <Sparkles size={14} /> New vibe unlocked
      </div>
      <h3 className="display mt-2 text-[44px] text-ink">{c.label}</h3>
      <p className="font-mono text-[12px] text-ink-2">{comboRecipe(c, effectiveAffinity(store.profile))}</p>
      <p className="mt-2 text-[15px] text-ink">{c.blurb}</p>
      <Link to={`/v/${c.id}`} className="btn mt-4 !py-2">
        Go down the rabbit hole <ArrowUpRight size={16} />
      </Link>
    </article>
  )
}

export function ItemCard({ item, why }: { item: AnyItem; why?: string }) {
  switch (item.type) {
    case 'quote':
      return <QuoteCard item={item} why={why} />
    case 'find':
      return <FindCard item={item} why={why} partner={!!item.sponsored} />
    case 'fit':
      return <FitCard item={item} why={why} />
    case 'post':
      return <PostCard item={item} why={why} />
    case 'ritual':
      return <RitualCard item={item} why={why} />
  }
}
