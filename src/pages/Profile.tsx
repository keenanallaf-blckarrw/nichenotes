import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight, RotateCcw, Sparkles, VolumeX } from 'lucide-react'
import { COMBO_BY_ID, comboRecipe, effectiveAffinity, labelOf, topVibes, vibeRead } from '../engine'
import { FIND_BY_ID, MENTORS } from '../data/catalog'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { ObjectArt } from '../components/ObjectArt'
import { ItemCard } from '../components/cards/Cards'
import { Avatar, SectionTitle, money } from '../components/bits'

export function Profile() {
  const store = useStore()
  const ui = useUI()
  const [confirmReset, setConfirmReset] = useState(false)
  const read = vibeRead(store.profile)
  const vibes = topVibes(store.profile, 10)
  const eff = effectiveAffinity(store.profile)
  const savedFinds = store.saved.map((id) => FIND_BY_ID[id]).filter(Boolean)
  const savedOther = store.saved.map((id) => store.lookup(id)).filter((i) => i && i.type !== 'find')
  const mentor = MENTORS.find((m) => m.id === store.mentor)
  const stashValue = savedFinds.reduce((s, f) => s + f.price, 0)

  return (
    <div className="flex flex-col gap-9 pt-6">
      <header className="flex items-center gap-4">
        <Avatar name={store.handle || 'you'} size={60} />
        <div>
          <div className="text-[18px] font-semibold">@{store.handle || 'you'}</div>
          <div className="text-[13px] text-ink-3">
            {store.profile.eventCount} signals learned{mentor ? ` · in ${mentor.name}'s corner` : ''}
            {store.ritualStreak > 0 ? ` · ${store.ritualStreak}-day ritual streak` : ''}
          </div>
        </div>
      </header>

      <section className="rounded-[16px] border border-line bg-surface p-5">
        <div className="eyebrow">Your vibe, as the feed reads it</div>
        <h1 className="display mt-2 text-[44px]">{read.headline}</h1>
        <p className="mt-1 text-[15px] text-ink-2">{read.sub}</p>
        <div className="mt-5 flex flex-col gap-3">
          {vibes.map((v) => (
            <Link key={v.id} to={`/v/${v.id}`} className="group grid grid-cols-[110px_1fr_48px] items-center gap-3">
              <span className="truncate text-[13px] font-semibold tracking-wide uppercase group-hover:underline">{labelOf(v.id)}</span>
              <span className="h-2 rounded-full bg-accent-soft">
                <span className="meter-fill block h-full rounded-full bg-accent" style={{ width: `${v.value * 100}%` }} />
              </span>
              <span className="tnum flex items-center justify-end gap-0.5 font-mono text-[12px] text-ink-2">
                {Math.round(v.value * 100)}
                {v.trend > 0.03 && <ArrowUpRight size={13} className="text-accent" aria-label="rising" />}
                {v.trend < -0.03 && <ArrowDownRight size={13} className="text-ink-3" aria-label="cooling" />}
              </span>
            </Link>
          ))}
          {!vibes.length && <p className="text-[14px] text-ink-3">Nothing yet. Like and save a few things.</p>}
        </div>
        <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
          How it works: likes, saves, shop taps and time spent push a vibe up; "Not for me" pushes it down; anything you ignore slowly fades. In this prototype
          everything stays on your device.
        </p>
      </section>

      {store.profile.unlocked.length > 0 && (
        <section>
          <SectionTitle eyebrow="Unlocked" title="Your subcultures" />
          <div className="mt-3 flex flex-col gap-2">
            {store.profile.unlocked.map((id) => {
              const c = COMBO_BY_ID[id]
              return (
                <Link key={id} to={`/v/${id}`} className="flex items-center gap-3 rounded-[12px] border border-gold bg-gold-soft px-4 py-3">
                  <Sparkles size={18} className="shrink-0 text-gold" />
                  <div className="min-w-0">
                    <div className="display text-[26px]">{c.label}</div>
                    <div className="font-mono text-[11.5px] text-ink-2">{comboRecipe(c, eff)}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <SectionTitle
          eyebrow="Stash"
          title={savedFinds.length ? `${savedFinds.length} saved finds` : 'Your stash is empty'}
          action={savedFinds.length ? <span className="tnum font-mono text-[12px] text-ink-3">{money(stashValue)} total</span> : undefined}
        />
        {savedFinds.length === 0 && <p className="mt-2 text-[14px] text-ink-2">Tap the bookmark on anything worth coming back to.</p>}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {savedFinds.map((f) => (
            <button key={f.id} className="flex flex-col gap-1 text-left" onClick={() => ui.open({ kind: 'item', id: f.id })}>
              <ObjectArt art={f.art} className="block aspect-square w-full rounded-[10px]" />
              <span className="line-clamp-1 text-[12px] font-medium">{f.name}</span>
            </button>
          ))}
        </div>
        {savedOther.length > 0 && (
          <div className="mt-6 flex flex-col gap-4">
            {savedOther.map((i) => i && <ItemCard key={i.id} item={i} />)}
          </div>
        )}
      </section>

      {store.profile.muted.length > 0 && (
        <section>
          <SectionTitle eyebrow="Muted" title="Not your thing" />
          <div className="mt-3 flex flex-wrap gap-2">
            {store.profile.muted.map((id) => (
              <button key={id} className="chip" onClick={() => store.unmute(id)}>
                <VolumeX size={14} /> {labelOf(id)} · Unmute
              </button>
            ))}
          </div>
        </section>
      )}

      {store.scouted.length > 0 && (
        <section>
          <SectionTitle eyebrow="Scout" title="Finds you submitted" />
          <div className="mt-3 flex flex-col gap-2">
            {store.scouted.map((s) => (
              <div key={s.id} className="rounded-[12px] border border-line p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-[11px] text-ink-3">In review · {labelOf(s.vibe)}</span>
                </div>
                <p className="text-[13.5px] text-ink-2">{s.why}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3 border-t border-line pt-6">
        <Link to="/brands" className="text-[15px] font-medium hover:underline">
          Are you a brand? Partner with NicheNotes →
        </Link>
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2 text-[14px]">
            <span>Wipe everything the feed learned?</span>
            <button className="btn !bg-danger !py-1.5 !text-white" onClick={() => store.reset()}>
              Yes, start over
            </button>
            <button className="btn btn-ghost !py-1.5" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="flex items-center gap-2 self-start text-[14px] text-ink-3 hover:text-ink" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={14} /> Reset my vibe
          </button>
        )}
        <p className="text-[12px] text-ink-3">Prototype build. Shops, products, handles and posts are sample data.</p>
      </section>
    </div>
  )
}
