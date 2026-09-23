import { Check, ChevronRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COMBO_BY_ID, comboRecipe, effectiveAffinity, formatDistance } from '../../engine'
import { CLUB_BY_ID, FIND_BY_ID, SHOP_BY_ID } from '../../data/catalog'
import type { AnyItem, EventItem, FindItem, FitItem, PostItem, QuoteItem, RitualItem } from '../../data/types'
import { useStore } from '../../state/store'
import { useUI } from '../../state/ui'
import { ObjectArt } from '../ObjectArt'
import { Avatar, DateTile, eventTime, money, timeAgo } from '../bits'
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
  const store = useStore()
  const club = CLUB_BY_ID[item.club]
  const km = item.near ? store.distanceTo(item.near) : undefined
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
          {item.near && <span className="text-ink-3">· {km !== undefined && store.area ? `${formatDistance(km, store.area.unit)} away` : `near ${item.near.label}`}</span>}
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

function useEventInfo(item: EventItem) {
  const store = useStore()
  const going = item.going + (store.going.includes(item.id) ? 1 : 0)
  const km = store.distanceTo(item.at)
  const d = km !== undefined && store.area ? formatDistance(km, store.area.unit) : undefined
  // Shown at the start of a line, so capitalize ("Less than 0.5 mi away").
  const distance = d && d[0].toUpperCase() + d.slice(1)
  const spots = item.capacity ? Math.max(0, item.capacity - going) : undefined
  return { going, distance, spots, isGoing: store.going.includes(item.id) }
}

/** A real-world meetup in the feed. The one action is Join. */
export function EventCard({ item, why }: { item: EventItem; why?: Why }) {
  const ui = useUI()
  const store = useStore()
  const club = CLUB_BY_ID[item.club]
  const { going, distance, spots, isGoing } = useEventInfo(item)
  return (
    <article className="rounded-[20px] bg-surface p-4">
      <p className="t-foot font-semibold text-ink-2">
        {club.name} · Near you
      </p>
      <div className="mt-2 flex gap-4">
        <DateTile ts={item.startsAt} />
        <button className="min-w-0 flex-1 text-left" onClick={() => (store.track('open', item), ui.open({ kind: 'event', id: item.id }))} aria-label={`View ${item.title}`}>
          <h3 className="t-headline">{item.title}</h3>
          <p className="t-sub text-ink-2">{eventTime(item.startsAt)}</p>
          <p className="t-sub text-ink-2">{item.venue}</p>
          <p className="t-foot mt-1 text-ink-2">
            {distance ? `${distance} away · ` : ''}
            {going} going{spots !== undefined ? ` · ${spots === 0 ? 'full' : `${spots} spots left`}` : ''}
          </p>
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button className={`btn ${isGoing ? 'btn-secondary !bg-surface-2' : 'btn-primary'}`} onClick={() => store.toggleGoing(item)} aria-pressed={isGoing}>
          {isGoing ? (
            <>
              <Check size={16} strokeWidth={2.5} /> Going
            </>
          ) : (
            'Join'
          )}
        </button>
        <button className="btn btn-secondary !bg-surface-2" onClick={() => ui.open({ kind: 'event', id: item.id })}>
          Discuss
        </button>
      </div>
      <div className="mt-1 flex flex-col gap-0.5">
        <WhyLine why={why} />
        <CardActions item={item} why={why?.text} />
      </div>
    </article>
  )
}

/** Compact event for grouped lists (Nearby, club pages). */
export function EventRow({ item }: { item: EventItem }) {
  const ui = useUI()
  const store = useStore()
  const { going, distance, isGoing } = useEventInfo(item)
  return (
    <button
      className="flex w-full items-center gap-3 border-b-[0.5px] border-line px-3 py-3 text-left last:border-b-0"
      onClick={() => (store.track('open', item), ui.open({ kind: 'event', id: item.id }))}
    >
      <DateTile ts={item.startsAt} />
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{item.title}</span>
        <span className="t-foot block truncate text-ink-2">
          {eventTime(item.startsAt)} · {item.venue}
        </span>
        <span className="t-foot block text-ink-2">
          {distance ? `${distance} away · ` : ''}
          {going} going
          {isGoing && <span className="font-semibold text-accent-text"> · You're going</span>}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-ink-3" />
    </button>
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
    case 'event':
      return <EventCard item={item} why={why} />
  }
}
