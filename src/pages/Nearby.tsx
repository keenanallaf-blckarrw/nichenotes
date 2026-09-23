import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { bearing, distanceKm, effectiveAffinity, relevance, toUnit } from '../engine'
import type { EventItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { EventRow, PostCard } from '../components/cards/Cards'
import { PageTitle, SectionHeader, Segmented, dayLabel } from '../components/bits'

/** A simple radar: you in the middle, events placed by real distance and direction. */
function Radar({ events, forYou }: { events: EventItem[]; forYou: Set<string> }) {
  const store = useStore()
  const area = store.area!
  const R = 88
  const rings = [1 / 3, 2 / 3, 1]
  const max = toUnit(area.radiusKm, area.unit)
  return (
    <figure className="mt-4 rounded-[20px] bg-surface p-4">
      <svg viewBox="0 0 200 200" className="mx-auto block w-full max-w-[280px]" role="img" aria-label={`${events.length} events within ${Math.round(max)} ${area.unit} of ${area.label}`}>
        {rings.map((r) => (
          <circle key={r} cx="100" cy="100" r={R * r} fill="none" style={{ stroke: 'var(--line)' }} strokeWidth="1" />
        ))}
        {events.map((e) => {
          const d = Math.min(1, distanceKm(area.center, e.at) / area.radiusKm) * R
          const a = (bearing(area.center, e.at) * Math.PI) / 180
          const mine = forYou.has(e.id)
          return (
            <circle
              key={e.id}
              cx={100 + d * Math.sin(a)}
              cy={100 - d * Math.cos(a)}
              r={mine ? 5 : 4}
              style={{ fill: mine ? 'var(--accent)' : 'var(--ink-3)', stroke: 'var(--surface)' }}
              strokeWidth="2"
            >
              <title>{`${e.title} · ${e.venue}`}</title>
            </circle>
          )
        })}
        <circle cx="100" cy="100" r="6" style={{ fill: 'var(--ink)', stroke: 'var(--surface)' }} strokeWidth="2" />
        {rings.map((r) => (
          <text
            key={r}
            x="100"
            y={100 - R * r + 2.5}
            textAnchor="middle"
            fontSize="7"
            paintOrder="stroke"
            strokeWidth="3"
            style={{ fill: 'var(--ink-2)', stroke: 'var(--surface)' }}
          >
            {`${Math.round(max * r * 10) / 10} ${area.unit}`}
          </text>
        ))}
      </svg>
      <figcaption className="t-foot mt-2 flex justify-center gap-4 text-ink-2">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-ink" /> You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-accent" /> For you
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-ink-3" /> Other events
        </span>
      </figcaption>
    </figure>
  )
}

export function Nearby() {
  const store = useStore()
  const ui = useUI()
  const [filter, setFilter] = useState<'foryou' | 'all'>('foryou')
  const area = store.area

  if (!area) {
    return (
      <div>
        <PageTitle title="Near you" />
        <div className="mt-6 rounded-[20px] bg-surface px-5 py-8 text-center">
          <MapPin size={28} className="mx-auto text-accent-text" aria-hidden="true" />
          <h2 className="t-title2 mt-3">Find games and meetups near you</h2>
          <p className="t-sub mx-auto mt-1 max-w-[32ch] text-ink-2">Pickup games, walks, book clubs and more, from people who like what you like.</p>
          <button className="btn btn-primary mt-5" onClick={() => ui.open({ kind: 'area' })}>
            Set your area
          </button>
        </div>
      </div>
    )
  }

  const { events, posts } = store.nearby()
  const eff = effectiveAffinity(store.profile)
  const forYou = new Set(events.filter((e) => e.mine || store.going.includes(e.id) || relevance(e.tags, eff) > 0.15).map((e) => e.id))
  const shown = filter === 'foryou' ? events.filter((e) => forYou.has(e.id)) : events
  const days = new Map<string, EventItem[]>()
  for (const e of shown) {
    const label = dayLabel(e.startsAt)
    days.set(label, [...(days.get(label) ?? []), e])
  }

  return (
    <div>
      <PageTitle
        title="Near you"
        action={
          <button className="btn btn-primary shrink-0" onClick={() => ui.open({ kind: 'host' })}>
            Host
          </button>
        }
      />
      <button className="t-sub flex items-center gap-1 font-medium text-accent-text" onClick={() => ui.open({ kind: 'area' })}>
        <MapPin size={16} aria-hidden="true" /> {area.label} · within {Math.round(toUnit(area.radiusKm, area.unit))} {area.unit}
      </button>

      <Radar events={events} forYou={forYou} />

      <Segmented<'foryou' | 'all'>
        label="Show"
        value={filter}
        options={[
          ['foryou', `For you (${forYou.size})`],
          ['all', `Everything (${events.length})`],
        ]}
        onChange={setFilter}
      />

      <div className="mt-6 flex flex-col gap-6">
        {[...days].map(([label, list]) => (
          <section key={label}>
            <h2 className="t-foot mb-2 font-semibold text-ink-2">{label}</h2>
            <div className="overflow-hidden rounded-[14px] bg-surface">
              {list.map((e) => (
                <EventRow key={e.id} item={e} />
              ))}
            </div>
          </section>
        ))}
        {shown.length === 0 && (
          <p className="t-sub text-ink-2">
            Nothing matching your interests nearby yet. Try Everything, a bigger distance, or host something yourself.
          </p>
        )}
      </div>

      {posts.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Talk nearby" />
          <div className="mt-4 flex flex-col gap-8">
            {[...posts]
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 6)
              .map((p) => (
                <PostCard key={p.id} item={p} />
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
