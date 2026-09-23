import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { effectiveAffinity, labelOf, relevance, VIBE_BY_ID } from '../engine'
import { CLUBS, CLUB_BY_ID, POSTS } from '../data/catalog'
import type { Club } from '../data/types'
import { useStore } from '../state/store'
import { PostCard } from '../components/cards/Cards'
import { Avatar, PageTitle, compact } from '../components/bits'

function ClubList({ clubs }: { clubs: Club[] }) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-surface">
      {clubs.map((c) => (
        <Link key={c.id} to={`/clubs/${c.id}`} className="flex items-center gap-3 border-b-[0.5px] border-line px-4 py-3 last:border-b-0">
          <Avatar name={c.name} size={42} square />
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{c.name}</span>
            <span className="t-foot block truncate text-ink-2">
              {compact(c.members)} members · {c.blurb}
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-ink-3" />
        </Link>
      ))}
    </div>
  )
}

export function Clubs() {
  const store = useStore()
  const eff = effectiveAffinity(store.profile)
  const ranked = CLUBS.map((c) => ({ c, r: relevance(c.tags, eff) })).sort((a, b) => b.r - a.r)
  const yours = ranked.filter((x) => x.r > 0.15).map((x) => x.c)
  const others = ranked.filter((x) => x.r <= 0.15).map((x) => x.c)

  return (
    <div>
      <PageTitle title="Clubs" />
      <p className="text-ink-2">Small communities for specific interests. The more specific, the better the advice.</p>
      {yours.length > 0 && (
        <section className="mt-8">
          <h2 className="t-foot mb-2 font-semibold text-ink-2">For you</h2>
          <ClubList clubs={yours} />
        </section>
      )}
      <section className="mt-8">
        <h2 className="t-foot mb-2 font-semibold text-ink-2">{yours.length ? 'More clubs' : 'All clubs'}</h2>
        <ClubList clubs={others} />
      </section>
    </div>
  )
}

export function ClubPage() {
  const { id = '' } = useParams()
  const store = useStore()
  const club = CLUB_BY_ID[id]
  const [text, setText] = useState('')
  if (!club) return <PageTitle title="Not found" />
  const posts = [...store.myPosts.filter((p) => p.club === id), ...POSTS.filter((p) => p.club === id && !store.hidden.includes(p.id))]
  const interests = Object.keys(club.tags).filter((v) => v in VIBE_BY_ID)

  return (
    <div>
      <Link to="/clubs" className="t-sub -ml-1 flex items-center pt-5 text-accent-text">
        <ChevronLeft size={22} /> Clubs
      </Link>
      <PageTitle title={club.name} subtitle={`${compact(club.members)} members`} />
      <p className="text-ink-2">{club.blurb}</p>
      <p className="t-foot mt-2 text-ink-3">{interests.map(labelOf).join(' · ')}</p>

      <form
        className="mt-8 rounded-[14px] bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim().length < 3) return
          store.addPost(id, text.trim())
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
          placeholder={`Share something with ${club.name}`}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
        />
        <div className="flex items-center justify-end gap-3">
          {text.length > 200 && <span className="t-foot tnum text-ink-3">{280 - text.length}</span>}
          <button className="btn btn-primary !py-1.5" disabled={text.trim().length < 3} type="submit">
            Post
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-8">
        {posts.map((p) => (
          <PostCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  )
}
