import { Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COMBO_BY_ID, comboRecipe, effectiveAffinity } from '../../engine'
import { CLUB_BY_ID, FIND_BY_ID, SHOP_BY_ID } from '../../data/catalog'
import type { AnyItem, FindItem, FitItem, PostItem, QuoteItem, RitualItem } from '../../data/types'
import { useStore } from '../../state/store'
import { useUI } from '../../state/ui'
import { ObjectArt } from '../ObjectArt'
import { Avatar, money, timeAgo } from '../bits'
import { CardActions } from './CardActions'

/** Why text for a card: shown only when notable, otherwise it lives in the ••• menu. */
export interface Why {
  text: string
  visible: boolean
}

function WhyLine({ why }: { why?: Why }) {
  if (!why?.visible) return null
  return <p className="t-foot text-ink-2">{why.text}</p>
}

export function QuoteCard({ item, why }: { item: QuoteItem; why?: Why }) {
  return (
    <article className="rounded-[20px] bg-surface px-6 pt-7 pb-3">
      <blockquote className={`t-quote ${item.text.length > 110 ? 'text-[1.375rem]' : 'text-[1.625rem]'} leading-[1.25]`}>{item.text}</blockquote>
      {item.translation && <p className="t-sub mt-2 text-ink-2">{item.translation}</p>}
      <p className="t-sub mt-5 font-semibold">{item.author}</p>
      <p className="t-foot text-ink-2">
        {item.source}
        {item.attributed && ' · Attributed'}
      </p>
      <div className="mt-3 flex flex-col gap-1">
        <WhyLine why={why} />
        <CardActions item={item} why={why?.text} />
      </div>
    </article>
  )
}

export function FindCard({ item, why }: { item: FindItem; why?: Why }) {
  const ui = useUI()
  const store = useStore()
  const shop = SHOP_BY_ID[item.shop]
  return (
    <article>
      <button className="relative block w-full overflow-hidden rounded-[20px]" onClick={() => (store.track('open', item), ui.open({ kind: 'item', id: item.id }))} aria-label={`View ${item.name}`}>
        <ObjectArt art={item.art} className="block aspect-[4/3] w-full" />
        {item.sponsored && <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">Partner</span>}
      </button>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="t-headline">{item.name}</h3>
          <p className="t-sub text-ink-2">
            {shop.name} · {money(item.price)}
          </p>
        </div>
        <button className="btn btn-primary shrink-0" onClick={() => (store.shopClick(item), ui.open({ kind: 'shop', id: item.id }))}>
          Shop
        </button>
      </div>
      <p className="t-sub mt-1.5 text-ink-2">{item.blurb}</p>
      <div className="mt-1.5 flex flex-col gap-0.5">
        <WhyLine why={why} />
        <CardActions item={item} why={why?.text} />
      </div>
    </article>
  )
}

export function FitCard({ item, why }: { item: FitItem; why?: Why }) {
  const ui = useUI()
  const store = useStore()
  const finds = item.findIds.map((id) => FIND_BY_ID[id]).filter(Boolean)
  const total = finds.reduce((s, f) => s + f.price, 0)
  return (
    <article>
      <p className="t-foot font-semibold text-ink-2">{item.label}</p>
      <h3 className="t-title2">{item.name}</h3>
      <p className="t-sub mt-0.5 text-ink-2">{item.blurb}</p>
      <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-[20px]">
        {finds.map((f) => (
          <button key={f.id} className="relative block text-left" onClick={() => (store.track('open', f), ui.open({ kind: 'item', id: f.id }))} aria-label={`View ${f.name}`}>
            <ObjectArt art={f.art} className="block aspect-square w-full" />
          </button>
        ))}
      </div>
      <p className="t-foot mt-2 text-ink-2">
        {finds.length} pieces · {money(total)} total
      </p>
      <div className="mt-1 flex flex-col gap-0.5">
        <WhyLine why={why} />
        <CardActions item={item} why={why?.text} />
      </div>
    </article>
  )
}

export function PostCard({ item, why }: { item: PostItem; why?: Why }) {
  const club = CLUB_BY_ID[item.club]
  return (
    <article className="flex gap-3">
      <Avatar name={item.author} />
      <div className="min-w-0 flex-1">
        <div className="t-foot flex flex-wrap items-baseline gap-x-1.5">
          <span className="font-semibold text-ink">@{item.author}</span>
          <span className="text-ink-3">in</span>
          <Link to={`/clubs/${club.id}`} className="font-medium text-accent-text">
            {club.name}
          </Link>
          <span className="text-ink-3">· {timeAgo(item.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-[1rem] leading-[1.45]">{item.text}</p>
        <div className="mt-1 flex flex-col gap-0.5">
          <WhyLine why={why} />
          <CardActions item={item} likes={item.likes} why={why?.text} />
        </div>
      </div>
    </article>
  )
}

export function HabitCard({ item, why }: { item: RitualItem; why?: Why }) {
  const store = useStore()
  const done = store.doneToday.includes(item.id)
  return (
    <article className="rounded-[20px] bg-surface px-5 py-5">
      <p className="t-foot font-semibold text-ink-2">Today's habit{item.minutes ? ` · ${item.minutes} min` : ''}</p>
      <h3 className="t-title2 mt-0.5">{item.title}</h3>
      <p className="t-sub mt-0.5 text-ink-2">{item.detail}</p>
      <div className="mt-4 flex items-center gap-2">
        {done ? (
          <span className="t-sub inline-flex items-center gap-1.5 font-semibold text-accent-text">
            <Check size={18} strokeWidth={2.5} /> Done{store.ritualStreak > 1 ? ` · ${store.ritualStreak} days in a row` : ''}
          </span>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => store.ritual(item, true)}>
              Done
            </button>
            <button className="btn btn-secondary !bg-surface-2" onClick={() => (store.ritual(item, false), store.dismiss(item.id))}>
              Not today
            </button>
          </>
        )}
      </div>
      {why?.visible && (
        <div className="mt-3">
          <WhyLine why={why} />
        </div>
      )}
    </article>
  )
}

export function UnlockCard({ combo }: { combo: string }) {
  const store = useStore()
  const c = COMBO_BY_ID[combo]
  return (
    <article className="anim-rise rounded-[20px] bg-accent-soft px-6 py-6">
      <p className="t-foot flex items-center gap-1.5 font-semibold text-accent-text">
        <Sparkles size={15} /> Unlocked
      </p>
      <h3 className="t-title mt-1">{c.label}</h3>
      <p className="t-sub text-ink-2">{comboRecipe(c, effectiveAffinity(store.profile))}</p>
      <p className="t-sub mt-2">{c.blurb}</p>
      <Link to={`/i/${c.id}`} className="btn btn-primary mt-4">
        Explore {c.label}
      </Link>
    </article>
  )
}

export function ItemCard({ item, why }: { item: AnyItem; why?: Why }) {
  switch (item.type) {
    case 'quote':
      return <QuoteCard item={item} why={why} />
    case 'find':
      return <FindCard item={item} why={why} />
    case 'fit':
      return <FitCard item={item} why={why} />
    case 'post':
      return <PostCard item={item} why={why} />
    case 'ritual':
      return <HabitCard item={item} why={why} />
  }
}
