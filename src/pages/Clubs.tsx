import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { effectiveAffinity, labelOf, relevance, toUnit, VIBE_BY_ID } from '../engine'
import { CLUBS, CLUB_BY_ID, POSTS } from '../data/catalog'
import type { Club, EventItem } from '../data/types'
import { useStore } from '../state/store'
import { useUI } from '../state/ui'
import { EventRow, PostCard } from '../components/cards/Cards'
import { Avatar, PageTitle, Segmented, compact } from '../components/bits'

/** Clubs where "pickup game" is the natural thing to host. */
const PICKUP_CLUBS = new Set(['pickup-soccer', 'hoops', 'game-day', 'racket-club'])

function ClubList({ clubs, nearbyCount }: { clubs: Club[]; nearbyCount: (id: string) => number }) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-surface">
      {clubs.map((c) => {
        const n = nearbyCount(c.id)
        return (
          <Link key={c.id} to={`/clubs/${c.id}`} className="flex items-center gap-3 border-b-[0.5px] border-line px-4 py-3 last:border-b-0">
            <Avatar name={c.name} size={42} square />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{c.name}</span>
              <span className="t-foot block truncate text-ink-2">
                {n > 0 ? <span className="font-semibold text-accent-text">{n} near you · </span> : null}
                {compact(c.members)} members · {c.blurb}
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-ink-3" />
          </Link>
        )
      })}
    </div>
  )
}

/** Location prompt, or the next few things happening nearby. */
function NearYou({ events, clubId }: { events: EventItem[]; clubId?: string }) {
  const store = useStore()
  const ui = useUI()
  const area = store.area
  const club = clubId ? CLUB_BY_ID[clubId] : undefined

  if (!area) {
    return (
      <section className="mt-6 rounded-[20px] bg-surface px-5 py-5">
        <p className="t-headline flex items-center gap-2">
          <MapPin size={18} className="text-accent-text" aria-hidden="true" /> {club ? `${club.name} near you` : 'Games and meetups near you'}
        </p>
        <p className="t-sub mt-1 text-ink-2">Set your area to see pickup games, meetups and local posts from people nearby.</p>
        <button className="btn btn-primary mt-4" onClick={() => ui.open({ kind: 'area' })}>
          Set your area
        </button>
      </section>
    )
  }

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="t-title2">{club ? 'Near you' : `Near ${area.label}`}</h2>
        <button className="t-sub font-medium text-accent-text" onClick={() => ui.open({ kind: 'area' })}>
          {Math.round(toUnit(area.radiusKm, area.unit))} {area.unit}
        </button>
      </div>
      {events.length > 0 ? (
        <div className="mt-3 overflow-hidden rounded-[14px] bg-surface">
          {events.map((e) => (
            <EventRow key={e.id} item={e} />
          ))}
        </div>
      ) : (
        <p className="t-sub mt-2 text-ink-2">Nothing planned near {area.label} yet. Be the first to host something.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={() => ui.open({ kind: 'host', club: clubId })}>
          {clubId && PICKUP_CLUBS.has(clubId) ? 'Start a pickup game' : 'Host something'}
        </button>
        {!club && (
          <Link to="/nearby" className="btn btn-secondary">
            See everything nearby
          </Link>
        )}
      </div>
    </section>
  )
}

export function Clubs() {
  const store = useStore()
  const eff = effectiveAffinity(store.profile)
  const ranked = CLUBS.map((c) => ({ c, r: relevance(c.tags, eff) })).sort((a, b) => b.r - a.r)
  const yours = ranked.filter((x) => x.r > 0.15).map((x) => x.c)
  const others = ranked.filter((x) => x.r <= 0.15).map((x) => x.c)
  const { events } = store.nearby()
  const nearbyCount = (id: string) => events.filter((e) => e.club === id).length
  // Upcoming things from your clubs first, then everything else.
  const yourIds = new Set(yours.map((c) => c.id))
  const upcoming = [...events].sort((a, b) => Number(yourIds.has(b.club)) - Number(yourIds.has(a.club)) || a.startsAt - b.startsAt).slice(0, 4)

  return (
    <div>
      <PageTitle title="Clubs" />
      <p className="text-ink-2">Communities for every interest, online and near you.</p>
      <NearYou events={upcoming} />
      {yours.length > 0 && (
        <section className="mt-10">
          <h2 className="t-foot mb-2 font-semibold text-ink-2">For you</h2>
          <ClubList clubs={yours} nearbyCount={nearbyCount} />
        </section>
      )}
      <section className="mt-8">
        <h2 className="t-foot mb-2 font-semibold text-ink-2">{yours.length ? 'More clubs' : 'All clubs'}</h2>
        <ClubList clubs={others} nearbyCount={nearbyCount} />
      </section>
    </div>
  )
}

export function ClubPage() {
  const { id = '' } = useParams()
  const store = useStore()
  const club = CLUB_BY_ID[id]
  const [text, setText] = useState('')
  const [scope, setScope] = useState<'near' | 'all'>('near')
  if (!club) return <PageTitle title="Not found" />
  const nearby = store.nearby()
  const events = nearby.events.filter((e) => e.club === id)
  const localPosts = nearby.posts.filter((p) => p.club === id).sort((a, b) => b.createdAt - a.createdAt)
  const allPosts = [...store.myPosts.filter((p) => p.club === id && !p.near), ...POSTS.filter((p) => p.club === id && !store.hidden.includes(p.id))]
  const local = !!store.area && scope === 'near'
  const posts = local ? localPosts : allPosts
  const interests = Object.keys(club.tags).filter((v) => v in VIBE_BY_ID)

  return (
    <div>
      <Link to="/clubs" className="t-sub -ml-1 flex items-center pt-5 text-accent-text">
        <ChevronLeft size={22} /> Clubs
      </Link>
      <PageTitle title={club.name} subtitle={`${compact(club.members)} members`} />
      <p className="text-ink-2">{club.blurb}</p>
      <p className="t-foot mt-2 text-ink-3">{interests.map(labelOf).join(' · ')}</p>

      <NearYou events={events} clubId={id} />

      <section className="mt-10">
        <h2 className="t-title2">Posts</h2>
        {store.area && (
          <Segmented<'near' | 'all'>
            label="Show posts from"
            value={scope}
            options={[
              ['near', `Near ${store.area.label}`],
              ['all', 'Everywhere'],
            ]}
            onChange={setScope}
          />
        )}
        <form
          className="mt-4 rounded-[14px] bg-surface p-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (text.trim().length < 3) return
            store.addPost(id, text.trim(), local)
            setText('')
          }}
        >
          <label htmlFor="compose" className="sr-only">
            Post to {club.name}
          </label>
          <textarea
            id="compose"
            rows={2}
            className="w-full resize-none bg-transparent px-1 text-[1.0625rem] outline-none placeholder:text-ink-3"
            placeholder={local ? `Ask ${club.name} near ${store.area!.label}, like "Anyone up for a game Saturday?"` : `Share something with ${club.name}`}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
          />
          <div className="flex items-center justify-end gap-3">
            {text.length > 200 && <span className="t-foot tnum text-ink-3">{280 - text.length}</span>}
            <button className="btn btn-primary !py-1.5" disabled={text.trim().length < 3} type="submit">
              Post{local ? ' nearby' : ''}
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col gap-8">
          {posts.map((p) => (
            <PostCard key={p.id} item={p} />
          ))}
          {posts.length === 0 && <p className="t-sub text-ink-2">No posts near {store.area?.label} yet. Start the conversation.</p>}
        </div>
      </section>
    </div>
  )
}
