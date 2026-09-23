import { useMemo, useState } from 'react'
import { CalendarDays, Check, LocateFixed, MapPin, Search, ShieldCheck, Users } from 'lucide-react'
import { approximate, formatDistance, fromUnit, toUnit, type DistanceUnit } from '../engine'
import { CLUBS, CLUB_BY_ID } from '../data/catalog'
import { EVENT_TEMPLATES, MILE_COUNTRIES, PLACES, nearestPlace } from '../data/local'
import type { EventItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { Avatar, Segmented, Sheet, eventTime, timeAgo } from './bits'

const RADII: Record<DistanceUnit, number[]> = { mi: [2, 5, 10, 25], km: [3, 8, 15, 40] }

/** "About 2 mi" but "Less than 0.5 mi", never "About less than". */
function aboutDistance(d: string): string {
  return d.startsWith('less') ? `L${d.slice(1)}` : `About ${d}`
}

export function EventSheet({ id }: { id: string }) {
  const ui = useUI()
  const store = useStore()
  const [text, setText] = useState('')
  const item = store.lookup(id) as EventItem | undefined
  if (!item || item.type !== 'event') return null
  const club = CLUB_BY_ID[item.club]
  const isGoing = store.going.includes(item.id)
  const going = item.going + (isGoing ? 1 : 0)
  const km = store.distanceTo(item.at)
  const spots = item.capacity ? Math.max(0, item.capacity - going) : undefined
  const comments = store.commentsFor(item)

  return (
    <Sheet onClose={ui.close} label={item.title}>
      <p className="t-foot font-semibold text-ink-2">{club.name}</p>
      <h2 className="t-title mt-0.5">{item.title}</h2>

      <ul className="mt-5 flex flex-col gap-3">
        <li className="flex gap-3">
          <CalendarDays size={20} className="mt-0.5 shrink-0 text-ink-2" aria-hidden="true" />
          <span>{eventTime(item.startsAt)}</span>
        </li>
        <li className="flex gap-3">
          <MapPin size={20} className="mt-0.5 shrink-0 text-ink-2" aria-hidden="true" />
          <span>
            {item.venue}
            <span className="t-sub block text-ink-2">
              {km !== undefined && store.area ? `${aboutDistance(formatDistance(km, store.area.unit))} away, near ${item.area}` : `Near ${item.area}`}
            </span>
          </span>
        </li>
        <li className="flex gap-3">
          <Users size={20} className="mt-0.5 shrink-0 text-ink-2" aria-hidden="true" />
          <span>
            {going} going{spots !== undefined ? ` · ${spots === 0 ? 'Full' : `${spots} spots left`}` : ''}
            <span className="t-sub block text-ink-2">Hosted by @{item.host}</span>
          </span>
        </li>
      </ul>
      <p className="mt-4 text-ink-2">{item.detail}</p>

      {!item.mine && (
        <button className={`btn btn-large mt-6 w-full ${isGoing ? 'btn-secondary' : 'btn-primary'}`} onClick={() => store.toggleGoing(item)} aria-pressed={isGoing}>
          {isGoing ? (
            <>
              <Check size={18} strokeWidth={2.5} /> You're going
            </>
          ) : (
            "I'm going"
          )}
        </button>
      )}

      <section className="mt-8">
        <h3 className="t-headline">Discussion</h3>
        <p className="t-foot text-ink-2">Only people in {club.name} can see this.</p>
        <ol className="mt-4 flex flex-col gap-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar name={c.author} size={32} />
              <div className="min-w-0">
                <p className="t-foot">
                  <span className="font-semibold">@{c.author}</span> <span className="text-ink-3">· {timeAgo(c.at)}</span>
                </p>
                <p className="text-[1rem]">{c.text}</p>
              </div>
            </li>
          ))}
          {comments.length === 0 && <li className="t-sub text-ink-2">No messages yet. Say hi to the group.</li>}
        </ol>
        <form
          className="mt-4 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (text.trim().length < 1) return
            store.addComment(item, text.trim())
            setText('')
          }}
        >
          <label htmlFor="event-comment" className="sr-only">
            Message the group
          </label>
          <input id="event-comment" className="field" placeholder="Message the group" value={text} onChange={(e) => setText(e.target.value.slice(0, 280))} />
          <button className="btn btn-primary shrink-0 !py-3" disabled={!text.trim()} type="submit">
            Send
          </button>
        </form>
      </section>

      <section className="mt-8 flex gap-3 rounded-[14px] bg-surface p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ink-2" aria-hidden="true" />
        <div>
          <p className="t-sub">Meet in public places, bring a friend if you like, and tell someone where you are going.</p>
          {!item.mine && (
            <button className="t-sub mt-2 font-medium text-danger" onClick={() => (store.report(item.id), ui.close())}>
              Report this event
            </button>
          )}
        </div>
      </section>
    </Sheet>
  )
}

function defaultDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function HostSheet({ club: initialClub }: { club?: string }) {
  const ui = useUI()
  const store = useStore()
  const [club, setClub] = useState(initialClub ?? 'pickup-soccer')
  const example = EVENT_TEMPLATES.find((t) => t.club === club)
  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState('10:00')
  const [capacity, setCapacity] = useState('')
  const [detail, setDetail] = useState('')
  const startsAt = new Date(`${date}T${time}`).getTime()
  const valid = title.trim().length > 2 && venue.trim().length > 2 && startsAt > Date.now()

  if (!store.area) {
    return (
      <Sheet onClose={ui.close} label="Host something">
        <div className="py-6 text-center">
          <h2 className="t-title">First, set your area</h2>
          <p className="mx-auto mt-2 max-w-[32ch] text-ink-2">So people nearby can find what you're hosting.</p>
          <button className="btn btn-primary btn-large mt-6 w-full" onClick={() => ui.open({ kind: 'area' })}>
            Set your area
          </button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet onClose={ui.close} label="Host something">
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          const event = store.hostEvent({ club, title: title.trim(), venue: venue.trim(), startsAt, capacity: capacity ? Number(capacity) : undefined, detail: detail.trim() })
          if (event) ui.open({ kind: 'event', id: event.id })
        }}
      >
        <div>
          <h2 className="t-title">Host something</h2>
          <p className="mt-1 text-ink-2">A pickup game, a walk, a meetup. People in the club near {store.area.label} will see it.</p>
        </div>
        <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-club">
          Club
          <select id="host-club" className="field font-normal" value={club} onChange={(e) => setClub(e.target.value)}>
            {[...CLUBS].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-title">
          What is it?
          <input id="host-title" className="field font-normal" placeholder={example?.title ?? 'Meetup'} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-venue">
          Where? Choose a public place.
          <input id="host-venue" className="field font-normal" placeholder="A park, courts, a café, a library" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-date">
            Date
            <input id="host-date" type="date" className="field font-normal" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-time">
            Time
            <input id="host-time" type="time" className="field font-normal" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>
        <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-capacity">
          How many people? (optional)
          <input id="host-capacity" type="number" min={2} max={200} inputMode="numeric" className="field font-normal" placeholder="e.g. 10 for a 5-on-5" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </label>
        <label className="t-foot flex flex-col gap-1.5 font-semibold text-ink-2" htmlFor="host-detail">
          Anything people should know? (optional)
          <textarea id="host-detail" rows={3} className="field font-normal" placeholder={example?.detail ?? 'Level, what to bring, how to find you.'} value={detail} onChange={(e) => setDetail(e.target.value)} />
        </label>
        {startsAt <= Date.now() && <p className="t-foot text-danger">Choose a time in the future.</p>}
        <button className="btn btn-primary btn-large" disabled={!valid} type="submit">
          Post to {CLUB_BY_ID[club].name}
        </button>
        <p className="t-foot text-ink-3">Your exact location is never shared. People see the place you name and roughly how far away it is.</p>
      </form>
    </Sheet>
  )
}

function guessUnit(): DistanceUnit {
  const region = (typeof navigator !== 'undefined' ? navigator.language : 'en-US').split('-')[1]?.toUpperCase()
  return region && MILE_COUNTRIES.has(region) ? 'mi' : 'km'
}

export function AreaSheet() {
  const ui = useUI()
  const store = useStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'locating' | 'failed'>('idle')
  const area = store.area
  const unit = area?.unit ?? guessUnit()
  const places = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PLACES.filter((p) => !q || p.name.toLowerCase().includes(q))
  }, [query])

  const useCurrent = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return setStatus('failed')
    setStatus('locating')
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = approximate({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          const place = nearestPlace(center)
          store.setArea({ center, label: place?.name ?? 'your area', placeId: place?.id }, guessUnit())
          setStatus('idle')
        },
        () => setStatus('failed'),
        { timeout: 8000, maximumAge: 600_000 },
      )
    } catch {
      setStatus('failed')
    }
  }

  return (
    <Sheet onClose={ui.close} label="Your area">
      <h2 className="t-title">Your area</h2>
      <p className="mt-1 text-ink-2">See games, meetups and posts from clubs near you.</p>

      <button className="btn btn-secondary btn-large mt-6 w-full" onClick={useCurrent} disabled={status === 'locating'}>
        <LocateFixed size={18} /> {status === 'locating' ? 'Finding you…' : 'Use my current location'}
      </button>
      {status === 'failed' && <p className="t-foot mt-2 text-ink-2">Location isn't available here. Choose your city below instead.</p>}

      {area && (
        <>
          <Segmented<number>
            label={`Show things within (${unit === 'mi' ? 'miles' : 'kilometers'})`}
            value={RADII[unit].reduce((best, r) => (Math.abs(fromUnit(r, unit) - area.radiusKm) < Math.abs(fromUnit(best, unit) - area.radiusKm) ? r : best))}
            options={RADII[unit].map((r) => [r, `${r} ${unit}`])}
            onChange={(r) => store.updateArea({ radiusKm: fromUnit(r, unit) })}
          />
          <Segmented<DistanceUnit>
            label="Distance in"
            value={unit}
            options={[
              ['mi', 'Miles'],
              ['km', 'Kilometers'],
            ]}
            onChange={(u) => {
              // Keep roughly the same radius when switching units.
              const closest = RADII[u].reduce((best, r) => (Math.abs(fromUnit(r, u) - area.radiusKm) < Math.abs(fromUnit(best, u) - area.radiusKm) ? r : best))
              store.updateArea({ unit: u, radiusKm: fromUnit(closest, u) })
            }}
          />
        </>
      )}

      <label htmlFor="area-search" className="mt-6 flex items-center gap-2 rounded-[12px] bg-surface px-3 py-2.5">
        <Search size={18} className="shrink-0 text-ink-3" aria-hidden="true" />
        <span className="sr-only">Find a city</span>
        <input id="area-search" className="w-full bg-transparent outline-none placeholder:text-ink-3" placeholder="Find a city" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="mt-3 overflow-hidden rounded-[14px] bg-surface">
        {places.map((p) => {
          const on = area?.placeId === p.id
          return (
            <button
              key={p.id}
              className="flex min-h-[44px] w-full items-center gap-3 border-b-[0.5px] border-line px-4 py-2.5 text-left last:border-b-0"
              aria-pressed={on}
              onClick={() => store.setArea({ center: { lat: p.lat, lng: p.lng }, label: p.name, placeId: p.id }, MILE_COUNTRIES.has(p.country) ? 'mi' : 'km')}
            >
              <span className="flex-1">{p.name}</span>
              {on && <Check size={18} strokeWidth={2.5} className="text-accent-text" aria-hidden="true" />}
            </button>
          )
        })}
        {places.length === 0 && <p className="t-sub px-4 py-3 text-ink-2">No city by that name yet. Try "Use my current location".</p>}
      </div>

      <p className="t-foot mt-4 text-ink-3">
        NicheNotes only keeps your general area, never your exact location, and never shows it to anyone. Preview version: events and local posts are samples.
      </p>
      {area && (
        <div className="mt-6 flex flex-col gap-2">
          <button className="btn btn-primary btn-large w-full" onClick={ui.close}>
            Done{area ? ` · ${area.label}, ${Math.round(toUnit(area.radiusKm, area.unit))} ${area.unit}` : ''}
          </button>
          <button className="t-sub py-2 font-medium text-danger" onClick={store.clearArea}>
            Turn off location
          </button>
        </div>
      )}
    </Sheet>
  )
}
