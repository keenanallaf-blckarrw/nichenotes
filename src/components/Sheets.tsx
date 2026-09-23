import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { effectiveAffinity, mostSimilar, VIBES, WORLDS, labelOf } from '../engine'
import { CATALOG, FITS, FIND_BY_ID, FINDS, SHOP_BY_ID } from '../data/catalog'
import type { FindItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { ObjectArt } from './ObjectArt'
import { Sheet, money } from './bits'
import { CardActions } from './cards/CardActions'
import { AreaSheet, EventSheet, HostSheet } from './LocalSheets'

export function Sheets() {
  const ui = useUI()
  if (!ui.sheet) return null
  switch (ui.sheet.kind) {
    case 'item':
      return <ItemSheet key={ui.sheet.id} id={ui.sheet.id} />
    case 'shop':
      return <ShopSheet key={ui.sheet.id} id={ui.sheet.id} />
    case 'suggest':
      return <SuggestSheet />
    case 'interests':
      return <InterestsSheet />
    case 'event':
      return <EventSheet key={ui.sheet.id} id={ui.sheet.id} />
    case 'host':
      return <HostSheet key={ui.sheet.club ?? 'any'} club={ui.sheet.club} />
    case 'area':
      return <AreaSheet />
    default:
      return null
  }
}

function Shelf({ title, finds }: { title: string; finds: FindItem[] }) {
  const ui = useUI()
  const store = useStore()
  if (!finds.length) return null
  return (
    <section className="mt-8">
      <h3 className="t-headline">{title}</h3>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
        {finds.map((f) => (
          <button key={f.id} className="flex w-[136px] shrink-0 flex-col gap-1.5 text-left" onClick={() => (store.track('open', f), ui.open({ kind: 'item', id: f.id }))}>
            <ObjectArt art={f.art} className="block aspect-square w-full rounded-[14px]" />
            <span className="t-foot line-clamp-2 font-medium">{f.name}</span>
            <span className="t-foot text-ink-2">{money(f.price)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function ItemSheet({ id }: { id: string }) {
  const ui = useUI()
  const store = useStore()
  const item = FIND_BY_ID[id]
  if (!item) return null
  const shop = SHOP_BY_ID[item.shop]
  const fromShop = FINDS.filter((f) => f.shop === item.shop && f.id !== item.id).slice(0, 6)
  const similar = mostSimilar(item, CATALOG, new Set(store.hidden), 8, ['find']) as FindItem[]
  const inFits = FITS.filter((f) => f.findIds.includes(item.id))

  return (
    <Sheet onClose={ui.close} label={item.name}>
      <div className="relative overflow-hidden rounded-[20px]">
        <ObjectArt art={item.art} className="block aspect-square w-full" />
        {item.sponsored && <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.75rem] font-semibold text-white">Partner</span>}
      </div>
      <h2 className="t-title mt-5">{item.name}</h2>
      <p className="t-sub mt-1 text-ink-2">
        {shop.name} · {shop.location}
      </p>
      <p className="t-title2 mt-3">{money(item.price)}</p>
      <p className="mt-2 text-ink-2">{item.blurb}</p>
      <button className="btn btn-primary btn-large mt-5 w-full" onClick={() => (store.shopClick(item), ui.open({ kind: 'shop', id: item.id }))}>
        Shop at {shop.name}
      </button>
      <div className="mt-2">
        <CardActions item={item} />
      </div>

      <section className="mt-6 rounded-[14px] bg-surface px-4 py-3.5">
        <p className="t-headline">About {shop.name}</p>
        <p className="t-sub mt-0.5 text-ink-2">{shop.blurb}</p>
      </section>

      {inFits.length > 0 && (
        <section className="mt-8">
          <h3 className="t-headline">Wear it with</h3>
          <div className="mt-3 flex flex-col">
            {inFits.map((fit) => (
              <div key={fit.id} className="flex items-center gap-3 border-b-[0.5px] border-line py-3 last:border-b-0">
                <div className="grid w-14 shrink-0 grid-cols-2 gap-px overflow-hidden rounded-[10px]">
                  {fit.findIds.map((fid) => (
                    <ObjectArt key={fid} art={FIND_BY_ID[fid].art} className="block aspect-square w-full" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="t-headline">{fit.name}</p>
                  <p className="t-foot text-ink-2">{fit.blurb}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-ink-3" />
              </div>
            ))}
          </div>
        </section>
      )}

      <Shelf title={`More from ${shop.name}`} finds={fromShop} />
      <Shelf title="You might also like" finds={similar} />
    </Sheet>
  )
}

function ShopSheet({ id }: { id: string }) {
  const ui = useUI()
  const item = FIND_BY_ID[id]
  if (!item) return null
  const shop = SHOP_BY_ID[item.shop]
  return (
    <Sheet onClose={ui.close} label={`Go to ${shop.name}`}>
      <div className="flex flex-col items-center pt-2 text-center">
        <ObjectArt art={item.art} className="block size-28 rounded-[20px]" />
        <h2 className="t-title mt-5">Go to {shop.name}</h2>
        <p className="t-sub mt-1 text-ink-2">
          {item.name} · {money(item.price)}
        </p>
        <p className="t-sub mt-5 max-w-[34ch] text-ink-2">
          In the live app, this opens {shop.name}'s website. You buy directly from them, and NicheNotes earns a small commission at no cost to you.
        </p>
        <p className="t-foot mt-3 text-ink-3">This is a preview. {shop.name} is a sample shop.</p>
        <button className="btn btn-primary btn-large mt-7 w-full" onClick={ui.close}>
          Done
        </button>
      </div>
    </Sheet>
  )
}

function SuggestSheet() {
  const ui = useUI()
  const store = useStore()
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [vibe, setVibe] = useState('')
  const [why, setWhy] = useState('')
  const [sent, setSent] = useState(false)
  const valid = name.trim().length > 1 && vibe && why.trim().length > 4

  return (
    <Sheet onClose={ui.close} label="Suggest a find">
      {sent ? (
        <div className="py-8 text-center">
          <h2 className="t-title">Thanks.</h2>
          <p className="mx-auto mt-2 max-w-[34ch] text-ink-2">The {labelOf(vibe)} community will take a look. If people save it, it goes live with your name on it.</p>
          <button className="btn btn-primary btn-large mt-7 w-full" onClick={ui.close}>
            Done
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (!valid) return
            store.scout({ name: name.trim(), link: link.trim(), vibe, why: why.trim() })
            setSent(true)
          }}
        >
          <div>
            <h2 className="t-title">Suggest a find</h2>
            <p className="mt-1 text-ink-2">Know something great that nobody has heard of? Share it.</p>
          </div>
          <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="suggest-name">
            What is it?
            <input id="suggest-name" className="field font-normal" placeholder="Hand-dyed indigo bandana" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="suggest-link">
            Where can people get it? (optional)
            <input id="suggest-link" className="field font-normal" placeholder="Website or social handle" value={link} onChange={(e) => setLink(e.target.value)} />
          </label>
          <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="suggest-vibe">
            Category
            <select id="suggest-vibe" className="field font-normal" value={vibe} onChange={(e) => setVibe(e.target.value)}>
              <option value="">Choose one</option>
              {VIBES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="suggest-why">
            Why is it great?
            <textarea id="suggest-why" rows={3} className="field font-normal" placeholder="One sentence is enough." value={why} onChange={(e) => setWhy(e.target.value)} />
          </label>
          <button className="btn btn-primary btn-large" disabled={!valid} type="submit">
            Submit
          </button>
        </form>
      )}
    </Sheet>
  )
}

/** Add or remove interests any time. Adding is a strong signal; removing is neutral, not a dislike. */
function InterestsSheet() {
  const ui = useUI()
  const store = useStore()
  const eff = effectiveAffinity(store.profile)
  return (
    <Sheet onClose={ui.close} label="Your interests">
      <h2 className="t-title">Your interests</h2>
      <p className="mt-1 text-ink-2">Tap to add or remove. Your feed updates right away.</p>
      <div className="mt-6 flex flex-col gap-6">
        {WORLDS.map((w) => (
          <div key={w.id} role="group" aria-labelledby={`edit-${w.id}`}>
            <h3 id={`edit-${w.id}`} className="t-foot mb-2.5 font-semibold text-ink-2">
              {w.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {VIBES.filter((v) => v.world === w.id).map((v) => {
                const on = (eff[v.id] ?? 0) > 0.3
                return (
                  <button key={v.id} className="chip" aria-pressed={on} onClick={() => (on ? store.unfollow(v.id) : store.follow(v.id))}>
                    {on && <Check size={15} strokeWidth={2.5} aria-hidden="true" />}
                    {v.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-large mt-8 w-full" onClick={ui.close}>
        Done
      </button>
    </Sheet>
  )
}
