import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plus, Search, Sparkles, VolumeX } from 'lucide-react'
import { COMBOS, COMBO_BY_ID, UNLOCK_THRESHOLD, VIBES, VIBE_BY_ID, WORLDS, comboRecipe, effectiveAffinity, isCombo, labelOf, relevance } from '../engine'
import { CATALOG, CREWS, FINDS, SHOP_BY_ID } from '../data/catalog'
import type { AnyItem, FindItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { ItemCard } from '../components/cards/Cards'
import { ObjectArt } from '../components/ObjectArt'
import { SectionTitle, money } from '../components/bits'

function FindTile({ f }: { f: FindItem }) {
  const ui = useUI()
  const store = useStore()
  return (
    <button className="group flex flex-col gap-1.5 text-left" onClick={() => (store.track('open', f), ui.open({ kind: 'item', id: f.id }))}>
      <div className="relative overflow-hidden rounded-[12px]">
        <ObjectArt art={f.art} className="block aspect-square w-full transition-transform duration-300 group-hover:scale-[1.04]" />
        {f.sponsored && <span className="absolute top-2 left-2 rounded-full bg-gold px-2 py-0.5 font-mono text-[9.5px] tracking-wider text-bg uppercase">Partner</span>}
      </div>
      <span className="line-clamp-2 text-[13.5px] leading-snug font-medium">{f.name}</span>
      <span className="flex justify-between text-[12px] text-ink-3">
        <span className="truncate">{SHOP_BY_ID[f.shop].name}</span>
        <span className="tnum font-mono text-ink-2">{money(f.price)}</span>
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
  const results = useMemo(() => (q.trim().length > 1 ? CATALOG.filter((i) => matches(i, q)).slice(0, 30) : []), [q])
  const trending = useMemo(() => [...FINDS].filter((f) => !store.hidden.includes(f.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 6), [store.hidden])
  const newThisWeek = useMemo(() => FINDS.filter((f) => Date.now() - f.createdAt < 7 * 86_400_000).sort((a, b) => b.createdAt - a.createdAt).slice(0, 6), [])

  return (
    <div className="flex flex-col gap-9 pt-6">
      <div>
        <div className="eyebrow">Discover</div>
        <h1 className="display mt-1 text-[52px]">Rabbit holes</h1>
        <form
          className="mt-4 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 focus-within:border-ink-3"
          onSubmit={(e) => (e.preventDefault(), store.search(q))}
          role="search"
        >
          <Search size={18} className="text-ink-3" />
          <input
            id="discover-search"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-3"
            placeholder="Retro kits, solid cologne, Seneca…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => store.search(q)}
          />
        </form>
      </div>

      {results.length > 0 || q.trim().length > 1 ? (
        <section className="flex flex-col gap-5">
          <div className="eyebrow">{results.length} results for “{q}”</div>
          {results.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </section>
      ) : (
        <>
          <section>
            <SectionTitle eyebrow="Subcultures" title="Where your interests cross" />
            <p className="mt-1 text-[14px] text-ink-2">Two vibes together unlock a third. Keep using the app and these light up.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[...COMBOS]
                .sort((a, b) => Number(store.profile.unlocked.includes(b.id)) - Number(store.profile.unlocked.includes(a.id)))
                .map((c) => {
                  const on = store.profile.unlocked.includes(c.id)
                  // Tell people exactly which half they're missing, rather than a percentage.
                  const missing = c.requires.filter((g) => Math.max(...g.map((id) => eff[id] ?? 0)) < UNLOCK_THRESHOLD)
                  const status = missing.length === c.requires.length ? 'Locked' : `Need ${missing.map((g) => g.map(labelOf).join(' or ')).join(' + ')}`
                  return (
                    <Link
                      key={c.id}
                      to={`/v/${c.id}`}
                      className={`flex flex-col gap-1 rounded-[12px] border p-3 transition-colors first:col-span-2 sm:first:col-span-1 ${on ? 'border-gold bg-gold-soft' : 'border-line bg-surface hover:border-ink-3'}`}
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-wider uppercase">
                        {on ? (
                          <>
                            <Sparkles size={12} className="text-gold" /> <span className="text-gold">Unlocked</span>
                          </>
                        ) : (
                          <span className="text-ink-3">{status}</span>
                        )}
                      </span>
                      <span className="display text-[24px]">{c.label}</span>
                      <span className="text-[12px] text-ink-2">{c.requires.map((g) => g.map(labelOf).join('/')).join(' × ')}</span>
                    </Link>
                  )
                })}
            </div>
          </section>

          <section>
            <SectionTitle
              eyebrow="Trending"
              title="What the crews are buying"
              action={
                <button className="chip shrink-0" onClick={() => ui.open({ kind: 'scout' })}>
                  <Plus size={14} /> Scout a find
                </button>
              }
            />
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
              {trending.map((f) => (
                <FindTile key={f.id} f={f} />
              ))}
            </div>
          </section>

          {newThisWeek.length > 0 && (
            <section>
              <SectionTitle eyebrow="Fresh" title="New this week" />
              <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1">
                {newThisWeek.map((f) => (
                  <div key={f.id} className="w-[150px] shrink-0">
                    <FindTile f={f} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {WORLDS.map((w) => (
            <section key={w.id}>
              <SectionTitle eyebrow={w.label} title={w.blurb} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {VIBES.filter((v) => v.world === w.id).map((v) => {
                  const a = eff[v.id] ?? 0
                  const muted = store.profile.muted.includes(v.id)
                  return (
                    <Link key={v.id} to={`/v/${v.id}`} className="flex flex-col gap-2 rounded-[12px] border border-line bg-surface p-3 hover:border-ink-3">
                      <span className="flex items-center justify-between">
                        <span className="text-[15px] font-semibold">{v.label}</span>
                        {muted ? <VolumeX size={14} className="text-ink-3" /> : <span className="tnum font-mono text-[11px] text-ink-3">{a > 0.05 ? Math.round(a * 100) : ''}</span>}
                      </span>
                      <span className="line-clamp-2 text-[12.5px] leading-snug text-ink-2">{v.blurb}</span>
                      <span className="h-[3px] rounded-full bg-accent-soft">
                        <span className="meter-fill block h-full rounded-full bg-accent" style={{ width: `${Math.max(0, a) * 100}%` }} />
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

export function VibePage() {
  const { id = '' } = useParams()
  const store = useStore()
  const vibe = VIBE_BY_ID[id]
  const combo = COMBO_BY_ID[id]
  const eff = effectiveAffinity(store.profile)
  const muted = store.profile.muted.includes(id)
  const items = CATALOG.filter((i) => (i.tags[id] ?? 0) >= 0.5 && !store.hidden.includes(i.id))
    .map((i) => ({ i, s: (i.tags[id] ?? 0) + 0.3 * relevance(i.tags, eff) + 0.1 * i.popularity }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.i)
  const crews = CREWS.filter((c) => (c.tags[id] ?? 0) >= 0.6)
  if (!vibe && !combo) return <div className="pt-10">That rabbit hole doesn't exist (yet).</div>

  const finds = items.filter((i): i is FindItem => i.type === 'find')
  const rest = interleave(items.filter((i) => i.type !== 'find'))

  return (
    <div className="flex flex-col gap-8 pt-6">
      <header>
        <div className="eyebrow">{combo ? 'Subculture' : WORLDS.find((w) => w.id === vibe.world)?.label}</div>
        <h1 className="display mt-1 text-[64px]">{combo?.label ?? vibe.label}</h1>
        <p className="mt-1 text-[16px] text-ink-2">{combo?.blurb ?? vibe.blurb}</p>
        {combo && <p className="mt-1 font-mono text-[12px] text-ink-3">{comboRecipe(combo, eff)}</p>}
        {!isCombo(id) && (
          <div className="mt-4 flex gap-2">
            {muted ? (
              <button className="btn btn-ghost !py-2" onClick={() => store.unmute(id)}>
                Unmute
              </button>
            ) : (
              <>
                <button className="btn !py-2" onClick={() => store.follow(id)}>
                  <Plus size={16} /> More of this
                </button>
                <button className="btn btn-ghost !py-2" onClick={() => store.mute(id)}>
                  <VolumeX size={16} /> Mute
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {finds.length > 0 && (
        <section>
          <SectionTitle eyebrow="Finds" title={`${finds.length} things worth knowing`} />
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
            {finds.map((f) => (
              <FindTile key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}

      {crews.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {crews.map((c) => (
            <Link key={c.id} to={`/crews/${c.id}`} className="chip">
              Join {c.name}
            </Link>
          ))}
        </section>
      )}

      {rest.length > 0 && (
        <section className="flex flex-col gap-5">
          <SectionTitle eyebrow="Words, fits and the crew" title="The rest of the hole" />
          {rest.slice(0, 12).map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </section>
      )}
    </div>
  )
}
