import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { COMBO_BY_ID, comboRecipe, effectiveAffinity, labelOf, topVibes, vibeRead } from '../engine'
import { FIND_BY_ID, MENTORS } from '../data/catalog'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { ObjectArt } from '../components/ObjectArt'
import { ItemCard } from '../components/cards/Cards'
import { PageTitle, SectionHeader } from '../components/bits'

export function Profile() {
  const store = useStore()
  const ui = useUI()
  const [confirmReset, setConfirmReset] = useState(false)
  const read = vibeRead(store.profile)
  const interests = topVibes(store.profile, 6)
  const eff = effectiveAffinity(store.profile)
  const savedFinds = store.saved.map((id) => FIND_BY_ID[id]).filter(Boolean)
  const savedOther = store.saved.map((id) => store.lookup(id)).filter((i) => i && i.type !== 'find')
  const mentor = MENTORS.find((m) => m.id === store.mentor)
  const row = 'flex w-full items-center gap-3 border-b-[0.5px] border-line px-4 py-3 text-left last:border-b-0'

  return (
    <div>
      <PageTitle title="You" />

      <section className="mt-2 rounded-[20px] bg-surface p-5">
        <p className="t-foot font-semibold text-ink-2">Your taste</p>
        <h2 className="t-title2 mt-1">{read.headline}</h2>
        <p className="t-sub text-ink-2">{read.sub}</p>
        {interests.length > 0 && (
          <div className="mt-5 flex flex-col gap-3">
            {interests.map((v) => (
              <Link key={v.id} to={`/i/${v.id}`} className="grid grid-cols-[112px_1fr] items-center gap-3">
                <span className="t-sub truncate">{labelOf(v.id)}</span>
                <span className="h-1.5 rounded-full bg-accent-soft">
                  <span className="meter-fill block h-full rounded-full bg-accent" style={{ width: `${v.value * 100}%` }} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
      <p className="t-foot mt-3 px-1 text-ink-3">
        Likes, saves, shop visits and time spent teach your feed. "Not interested" teaches it too. Interests you ignore slowly fade.
        {mentor ? ` Your morning quotes come from ${mentor.name}.` : ''}
      </p>

      {store.profile.unlocked.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Unlocked" />
          <div className="mt-3 overflow-hidden rounded-[14px] bg-surface">
            {store.profile.unlocked.map((id) => {
              const c = COMBO_BY_ID[id]
              return (
                <Link key={id} to={`/i/${id}`} className={row}>
                  <Sparkles size={18} className="shrink-0 text-accent-text" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{c.label}</span>
                    <span className="t-foot block text-ink-2">{comboRecipe(c, eff)}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-ink-3" />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="mt-10">
        <SectionHeader title="Saved" />
        {savedFinds.length === 0 && savedOther.length === 0 && <p className="t-sub mt-1 text-ink-2">Tap the bookmark on anything you want to come back to.</p>}
        {savedFinds.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {savedFinds.map((f) => (
              <button key={f.id} className="flex flex-col gap-1.5 text-left" onClick={() => ui.open({ kind: 'item', id: f.id })}>
                <ObjectArt art={f.art} className="block aspect-square w-full rounded-[14px]" />
                <span className="t-foot line-clamp-1 font-medium">{f.name}</span>
              </button>
            ))}
          </div>
        )}
        {savedOther.length > 0 && (
          <div className="mt-8 flex flex-col gap-12">
            {savedOther.map((i) => i && <ItemCard key={i.id} item={i} />)}
          </div>
        )}
      </section>

      {store.profile.muted.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Hidden" />
          <div className="mt-3 overflow-hidden rounded-[14px] bg-surface">
            {store.profile.muted.map((id) => (
              <div key={id} className={row}>
                <span className="flex-1">{labelOf(id)}</span>
                <button className="t-sub font-medium text-accent-text" onClick={() => store.unmute(id)}>
                  Show again
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {store.scouted.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Your suggestions" />
          <div className="mt-3 overflow-hidden rounded-[14px] bg-surface">
            {store.scouted.map((s) => (
              <div key={s.id} className={row}>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{s.name}</span>
                  <span className="t-foot block text-ink-2">{s.why}</span>
                </span>
                <span className="t-foot shrink-0 text-ink-3">In review</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 overflow-hidden rounded-[14px] bg-surface">
        <Link to="/brands" className={row}>
          <span className="flex-1">For brands</span>
          <ChevronRight size={18} className="shrink-0 text-ink-3" />
        </Link>
        {confirmReset ? (
          <div className={`${row} flex-wrap`}>
            <span className="flex-1">Erase everything your feed has learned?</span>
            <button className="t-sub font-semibold text-danger" onClick={() => store.reset()}>
              Erase
            </button>
            <button className="t-sub font-medium text-accent-text" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className={row} onClick={() => setConfirmReset(true)}>
            <span className="flex-1 text-danger">Start over</span>
          </button>
        )}
      </section>
      <p className="t-foot mt-3 px-1 text-ink-3">Preview version. Shops, products, usernames and posts are sample data, and everything stays on this device.</p>
    </div>
  )
}
