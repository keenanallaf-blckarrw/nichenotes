import { useState } from 'react'
import { ArrowUpRight, Check, MapPin, Store } from 'lucide-react'
import { mostSimilar, VIBES, labelOf, VIBE_BY_ID } from '../engine'
import { CATALOG, FITS, FIND_BY_ID, FINDS, SHOP_BY_ID } from '../data/catalog'
import type { FindItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { ObjectArt } from './ObjectArt'
import { Sheet, money } from './bits'
import { CardActions } from './cards/CardActions'

export function Sheets() {
  const ui = useUI()
  if (!ui.sheet) return null
  switch (ui.sheet.kind) {
    case 'item':
      return <ItemSheet key={ui.sheet.id} id={ui.sheet.id} />
    case 'shop':
      return <ShopSheet key={ui.sheet.id} id={ui.sheet.id} />
    case 'scout':
      return <ScoutSheet />
    default:
      return null
  }
}

function MiniFind({ f }: { f: FindItem }) {
  const ui = useUI()
  const store = useStore()
  return (
    <button className="group flex w-[132px] shrink-0 flex-col gap-1.5 text-left" onClick={() => (store.track('open', f), ui.open({ kind: 'item', id: f.id }))}>
      <ObjectArt art={f.art} className="block aspect-square w-full rounded-[10px]" />
      <span className="line-clamp-2 text-[13px] leading-snug font-medium group-hover:underline">{f.name}</span>
      <span className="tnum font-mono text-[12px] text-ink-2">{money(f.price)}</span>
    </button>
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
  const vibes = Object.entries(item.tags)
    .filter(([v]) => v in VIBE_BY_ID)
    .sort((a, b) => b[1] - a[1])
    .map(([v]) => v)

  return (
    <Sheet onClose={ui.close} label={item.name}>
      <div className="hang-tag overflow-hidden">
        <ObjectArt art={item.art} className="block aspect-[4/3] w-full" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow tnum">N° {String(item.no).padStart(4, '0')}{item.sponsored ? ' · Partner' : ''}</div>
          <h2 className="display mt-1 text-[34px]">{item.name}</h2>
        </div>
        <span className="tnum mt-5 shrink-0 rounded-md border border-line px-2 py-1 font-mono text-[16px] font-medium">{money(item.price)}</span>
      </div>
      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{item.blurb}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {vibes.map((v) => (
          <span key={v} className="chip !py-1 !text-[12px]">
            {labelOf(v)}
          </span>
        ))}
      </div>
      <button className="btn btn-accent mt-5 w-full !py-3" onClick={() => (store.shopClick(item), ui.open({ kind: 'shop', id: item.id }))}>
        Shop at {shop.name} <ArrowUpRight size={17} />
      </button>
      <div className="-mx-2 mt-2">
        <CardActions item={item} />
      </div>

      <section className="mt-6 rounded-[14px] border border-line p-4">
        <div className="flex items-center gap-2 text-[15px] font-semibold">
          <Store size={16} /> {shop.name}
        </div>
        <p className="mt-1 text-[14px] text-ink-2">{shop.blurb}</p>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-3">
          <MapPin size={13} /> {shop.location}
        </p>
      </section>

      {inFits.length > 0 && (
        <section className="mt-6">
          <h3 className="eyebrow mb-2">Styled in</h3>
          <div className="flex flex-col gap-2">
            {inFits.map((fit) => (
              <div key={fit.id} className="flex items-center gap-3 rounded-[12px] border border-line p-2">
                <div className="grid w-16 shrink-0 grid-cols-2 gap-[2px] overflow-hidden rounded-[8px]">
                  {fit.findIds.map((fid) => (
                    <ObjectArt key={fid} art={FIND_BY_ID[fid].art} className="block aspect-square w-full" />
                  ))}
                </div>
                <div>
                  <div className="display text-[20px]">{fit.name}</div>
                  <div className="text-[13px] text-ink-2">{fit.blurb}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {fromShop.length > 0 && (
        <section className="mt-6">
          <h3 className="eyebrow mb-2">More from {shop.name}</h3>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {fromShop.map((f) => (
              <MiniFind key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-6">
          <h3 className="eyebrow mb-2">Same energy</h3>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {similar.map((f) => (
              <MiniFind key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}
    </Sheet>
  )
}

function ShopSheet({ id }: { id: string }) {
  const ui = useUI()
  const item = FIND_BY_ID[id]
  if (!item) return null
  const shop = SHOP_BY_ID[item.shop]
  return (
    <Sheet onClose={ui.close} label={`Heading to ${shop.name}`}>
      <div className="flex items-center gap-4">
        <ObjectArt art={item.art} className="block size-20 shrink-0 rounded-[12px]" />
        <div>
          <div className="eyebrow">Heading to</div>
          <h2 className="display text-[34px]">{shop.name}</h2>
          <p className="text-[14px] text-ink-2">
            {item.name} · <span className="tnum font-mono">{money(item.price)}</span>
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-[14px] border border-dashed border-line bg-surface p-4 text-[14px] leading-relaxed text-ink-2">
        <p>
          <strong className="text-ink">Prototype:</strong> {shop.name} is a sample shop. In the live app this button opens the shop's product page through a
          tracked link. You buy straight from them; NicheNotes earns a small commission and the shop sees the sale came from here.
        </p>
      </div>
      <div className="mt-4 grid gap-2 text-[14px]">
        {['You pay the shop directly. No markup.', 'We learned something: shopping is the strongest signal your feed gets.', 'Shops that sell well here can apply to become Partners.'].map((t) => (
          <div key={t} className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {t}
          </div>
        ))}
      </div>
      <button className="btn mt-6 w-full !py-3" onClick={ui.close}>
        Back to the feed
      </button>
    </Sheet>
  )
}

function ScoutSheet() {
  const ui = useUI()
  const store = useStore()
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [vibe, setVibe] = useState('')
  const [why, setWhy] = useState('')
  const [sent, setSent] = useState(false)
  const valid = name.trim().length > 1 && vibe && why.trim().length > 4

  return (
    <Sheet onClose={ui.close} label="Scout a find">
      {sent ? (
        <div className="py-6 text-center">
          <div className="display text-[40px]">Nice find.</div>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-2">
            It goes to the {labelOf(vibe)} crew for a vote. If it gets saved enough, it goes live and you get Scout credit on it.
          </p>
          <button className="btn mt-6" onClick={ui.close}>
            Done
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!valid) return
            store.scout({ name: name.trim(), link: link.trim(), vibe, why: why.trim() })
            setSent(true)
          }}
        >
          <div>
            <div className="eyebrow">Scout a find</div>
            <h2 className="display mt-1 text-[34px]">Know something nobody's heard of?</h2>
            <p className="mt-1 text-[14px] text-ink-2">The best finds come from you. Scouts earn a cut when their find sells (coming soon).</p>
          </div>
          <label className="flex flex-col gap-1 text-[13px] font-medium" htmlFor="scout-name">
            What is it?
            <input id="scout-name" className="rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[15px] font-normal" placeholder="e.g. Hand-dyed indigo bandana" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-[13px] font-medium" htmlFor="scout-link">
            Where can you get it? <span className="font-normal text-ink-3">(optional)</span>
            <input id="scout-link" className="rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[15px] font-normal" placeholder="Shop link or @handle" value={link} onChange={(e) => setLink(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-[13px] font-medium" htmlFor="scout-vibe">
            Which vibe?
            <select id="scout-vibe" className="rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[15px] font-normal" value={vibe} onChange={(e) => setVibe(e.target.value)}>
              <option value="">Pick one</option>
              {VIBES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[13px] font-medium" htmlFor="scout-why">
            Why is it good?
            <textarea id="scout-why" rows={3} className="rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[15px] font-normal" placeholder="Sell it to the crew in a sentence." value={why} onChange={(e) => setWhy(e.target.value)} />
          </label>
          <button className="btn btn-accent !py-3" disabled={!valid} type="submit">
            Submit to the crew
          </button>
        </form>
      )}
    </Sheet>
  )
}
