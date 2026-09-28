import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { COMBOS, COMBO_BY_ID, UNLOCK_THRESHOLD, VIBES, VIBE_BY_ID, WORLDS, comboRecipe, effectiveAffinity, isCombo, labelOf, relevance } from '../engine'
import { CATALOG, CLUBS, FINDS, SHOP_BY_ID } from '../data/catalog'
import type { AnyItem, FindItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { ItemCard } from '../components/cards/Cards'
import { ObjectArt } from '../components/ObjectArt'
import { PageTitle, SectionHeader, price } from '../components/bits'
import { HuntList, HuntNote } from '../components/Hunt'
import { HUNTS, huntsForProfile } from '../data/market'
import { dayNumber } from '../data/time'

function FindTile({ f }: { f: FindItem }) {
  const ui = useUI()
  const store = useStore()
  return (
    <button className="flex flex-col gap-2 text-left" onClick={() => (store.track('open', f), ui.open({ kind: 'item', id: f.id }))}>
      <span className="relative block overflow-hidden rounded-[16px]">
        <ObjectArt art={f.art} className="block aspect-square w-full" />
        {f.sponsored && <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[0.6875rem] font-semibold text-white">Partner</span>}
      </span>
      <span>
        <span className="t-foot line-clamp-2 font-semibold">{f.name}</span>
        <span className="t-foot block text-ink-2">
          {SHOP_BY_ID[f.shop].name} · {price(f)}
        </span>
      </span>
    </button>
  )
}

/** Round-robin by type so a list never runs ten quotes in a row. */
function interleave(items: AnyItem[]): AnyItem[] {
  const groups = new Map<string, AnyItem[]>()
  for (const i of items) groups.set(i.type, [...(groups.get(i.type) ?? []), i])
  const out: AnyItem[] = []
  while (out.length < items.length) for (const g of groups.values()) if (g.length) out.push(g.shift()!)
  return out
}

function matches(item: AnyItem, q: string): boolean {
  const hay = [
    item.type === 'find' ? `${item.name} ${item.blurb} ${SHOP_BY_ID[item.shop].name}` : '',
    item.type === 'fit' ? `${item.name} ${item.blurb}` : '',
    item.type === 'quote' ? `${item.text} ${item.author}` : '',
    item.type === 'post' ? `${item.text} ${item.author}` : '',
    item.type === 'ritual' ? `${item.title} ${item.detail}` : '',
    Object.keys(item.tags).map(labelOf).join(' '),
  ]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}

export function Discover() {
  const store = useStore()
  const ui = useUI()
  const [q, setQ] = useState('')
  const eff = effectiveAffinity(store.profile)
  const searching = q.trim().length > 1
  const results = useMemo(() => (searching ? CATALOG.filter((i) => matches(i, q)).slice(0, 30) : []), [q, searching])
  const popular = useMemo(() => FINDS.filter((f) => !store.hidden.includes(f.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 6), [store.hidden])
  const hunts = useMemo(() => huntsForProfile(store.profile, dayNumber()), [store.profile])
  const combos = [...COMBOS].sort((a, b) => Number(store.profile.unlocked.includes(b.id)) - Number(store.profile.unlocked.includes(a.id)))

  return (
    <div>
      <PageTitle title="Discover" />
      <form className="mt-2 flex items-center gap-2 rounded-[12px] bg-surface px-3 py-2.5" onSubmit={(e) => (e.preventDefault(), store.search(q))} role="search">
        <Search size={18} className="shrink-0 text-ink-3" />
        <input
          id="discover-search"
          className="w-full bg-transparent text-[1.0625rem] outline-none placeholder:text-ink-3"
          placeholder="Search jerseys, cologne, Seneca…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => store.search(q)}
        />
      </form>

      {searching ? (
        <section className="mt-8 flex flex-col gap-12">
          <p className="t-foot text-ink-2">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          {results.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </section>
      ) : (
        <div className="mt-10 flex flex-col gap-12">
          <section>
            <SectionHeader title="Where your interests meet" />
            <p className="t-sub mt-1 text-ink-2">Two interests together unlock a new one.</p>
            <div className="no-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
              {combos.map((c) => {
                const on = store.profile.unlocked.includes(c.id)
                // Say exactly which half is missing instead of showing a percentage.
                const missing = c.requires.filter((g) => Math.max(...g.map((id) => eff[id] ?? 0)) < UNLOCK_THRESHOLD)
                const status = on ? 'Unlocked' : missing.length === c.requires.length ? 'Locked' : `Needs ${missing.map((g) => g.map(labelOf).join(' or ')).join(' and ')}`
                return (
                  <Link key={c.id} to={`/i/${c.id}`} className={`flex w-[200px] shrink-0 flex-col rounded-[16px] p-4 ${on ? 'bg-accent-soft' : 'bg-surface'}`}>
                    <span className={`t-foot flex items-center gap-1 font-semibold ${on ? 'text-accent-text' : 'text-ink-3'}`}>
                      {on && <Sparkles size={13} />} {status}
                    </span>
                    <span className="t-headline mt-3">{c.label}</span>
                    <span className="t-foot text-ink-2">{on ? comboRecipe(c, eff) : c.requires.map((g) => g.map(labelOf).join(' or ')).join(' + ')}</span>
                  </Link>
                )
              })}
            </div>
          </section>

          <section>
            <SectionHeader title="Popular right now" />
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3">
              {popular.map((f) => (
                <FindTile key={f.id} f={f} />
              ))}
            </div>
          </section>

          {hunts.length > 0 && (
            <section>
              <SectionHeader title="Hunt for you" />
              <p className="t-sub mt-1 text-ink-2">Searches picked from your taste. New ones each day.</p>
              <HuntList hunts={hunts} />
              <HuntNote />
            </section>
          )}

          <section>
            <SectionHeader title="Browse" />
            <div className="mt-2 flex flex-col gap-6">
              {WORLDS.map((w) => (
                <div key={w.id}>
                  <h3 className="t-foot mb-2 font-semibold text-ink-2">{w.label}</h3>
                  <div className="overflow-hidden rounded-[14px] bg-surface">
                    {VIBES.filter((v) => v.world === w.id).map((v) => (
                      <Link key={v.id} to={`/i/${v.id}`} className="flex items-center gap-3 border-b-[0.5px] border-line px-4 py-3 last:border-b-0">
                        <span className="min-w-0 flex-1">
                          <span className="block">{v.label}</span>
                          <span className="t-foot block truncate text-ink-2">{v.blurb}</span>
                        </span>
                        {store.profile.muted.includes(v.id) && <span className="t-foot text-ink-3">Hidden</span>}
                        <ChevronRight size={18} className="shrink-0 text-ink-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] bg-surface px-5 py-6 text-center">
            <h2 className="t-title2">Know something great?</h2>
            <p className="t-sub mx-auto mt-1 max-w-[32ch] text-ink-2">Suggest a small brand or product the community should see.</p>
            <button className="btn btn-primary mt-4" onClick={() => ui.open({ kind: 'suggest' })}>
              Suggest a find
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

export function InterestPage() {
  const { id = '' } = useParams()
  const store = useStore()
  const vibe = VIBE_BY_ID[id]
  const combo = COMBO_BY_ID[id]
  const eff = effectiveAffinity(store.profile)
  const muted = store.profile.muted.includes(id)
  if (!vibe && !combo) return <PageTitle title="Not found" />

  const items = CATALOG.filter((i) => (i.tags[id] ?? 0) >= 0.5 && !store.hidden.includes(i.id))
    .map((i) => ({ i, s: (i.tags[id] ?? 0) + 0.3 * relevance(i.tags, eff) + 0.1 * i.popularity }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.i)
  const finds = items.filter((i): i is FindItem => i.type === 'find')
  const rest = interleave(items.filter((i) => i.type !== 'find'))
  const clubs = CLUBS.filter((c) => (c.tags[id] ?? 0) >= 0.6)

  return (
    <div>
      <PageTitle title={combo?.label ?? vibe.label} subtitle={combo ? comboRecipe(combo, eff) : WORLDS.find((w) => w.id === vibe.world)?.label} />
      <p className="text-ink-2">{combo?.blurb ?? vibe.blurb}</p>
      {!isCombo(id) && (
        <div className="mt-5 flex gap-2">
          {muted ? (
            <button className="btn btn-secondary" onClick={() => store.unmute(id)}>
              Show {vibe.label} again
            </button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => store.follow(id)}>
                See more
              </button>
              <button className="btn btn-secondary" onClick={() => store.mute(id)}>
                Hide
              </button>
            </>
          )}
        </div>
      )}

      {finds.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Finds" />
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3">
            {finds.map((f) => (
              <FindTile key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}

      {clubs.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Clubs" />
          <div className="mt-3 overflow-hidden rounded-[14px] bg-surface">
            {clubs.map((c) => (
              <Link key={c.id} to={`/clubs/${c.id}`} className="flex items-center gap-3 border-b-[0.5px] border-line px-4 py-3 last:border-b-0">
                <span className="min-w-0 flex-1">
                  <span className="block">{c.name}</span>
                  <span className="t-foot block text-ink-2">{c.blurb}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-ink-3" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <SectionHeader title="Hunt on Etsy and eBay" />
        <HuntList hunts={(HUNTS[id] ?? []).map((query) => ({ vibe: id, label: combo?.label ?? vibe.label, query }))} showLabel={false} />
        <HuntNote />
      </section>

      {rest.length > 0 && (
        <section className="mt-10 flex flex-col gap-12">
          <SectionHeader title="More" />
          {rest.slice(0, 12).map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </section>
      )}
    </div>
  )
}
