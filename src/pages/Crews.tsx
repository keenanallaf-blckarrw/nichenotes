import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { effectiveAffinity, labelOf, relevance, VIBE_BY_ID } from '../engine'
import { CREWS, CREW_BY_ID, POSTS } from '../data/catalog'
import { useStore } from '../state/store'
import { PostCard } from '../components/cards/Cards'
import { Avatar, compact } from '../components/bits'

export function Crews() {
  const store = useStore()
  const eff = effectiveAffinity(store.profile)
  const ranked = CREWS.map((c) => ({ c, r: relevance(c.tags, eff) })).sort((a, b) => b.r - a.r)
  const yours = ranked.filter((x) => x.r > 0.15)
  const others = ranked.filter((x) => x.r <= 0.15)

  const Row = ({ id }: { id: string }) => {
    const c = CREW_BY_ID[id]
    const latest = POSTS.find((p) => p.crew === id)
    return (
      <Link to={`/crews/${id}`} className="flex items-center gap-3 border-b border-line py-3.5 last:border-b-0">
        <Avatar name={c.name} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[16px] font-semibold">{c.name}</span>
            <span className="tnum font-mono text-[11px] text-ink-3">{compact(c.members)} members</span>
          </div>
          <div className="truncate text-[13.5px] text-ink-2">{latest ? `@${latest.author}: ${latest.text}` : c.blurb}</div>
        </div>
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-8 pt-6">
      <div>
        <div className="eyebrow">Crews</div>
        <h1 className="display mt-1 text-[52px]">Your people</h1>
        <p className="mt-1 text-[15px] text-ink-2">Small rooms for specific obsessions. The more niche, the better the advice.</p>
      </div>
      {yours.length > 0 && (
        <section>
          <h2 className="eyebrow mb-1">Picked for your vibe</h2>
          {yours.map(({ c }) => (
            <Row key={c.id} id={c.id} />
          ))}
        </section>
      )}
      <section>
        <h2 className="eyebrow mb-1">{yours.length ? 'Explore more' : 'All crews'}</h2>
        {others.map(({ c }) => (
          <Row key={c.id} id={c.id} />
        ))}
      </section>
    </div>
  )
}

export function CrewPage() {
  const { id = '' } = useParams()
  const store = useStore()
  const crew = CREW_BY_ID[id]
  const [text, setText] = useState('')
  if (!crew) return <div className="pt-10">That crew doesn't exist.</div>
  const posts = [...store.myPosts.filter((p) => p.crew === id), ...POSTS.filter((p) => p.crew === id && !store.hidden.includes(p.id))]
  const vibes = Object.keys(crew.tags).filter((v) => v in VIBE_BY_ID)

  return (
    <div className="flex flex-col gap-6 pt-6">
      <Link to="/crews" className="flex items-center gap-1 text-[14px] text-ink-2 hover:text-ink">
        <ArrowLeft size={16} /> Crews
      </Link>
      <header>
        <h1 className="display text-[56px]">{crew.name}</h1>
        <p className="mt-1 text-[15px] text-ink-2">{crew.blurb}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="tnum font-mono text-[12px] text-ink-3">{compact(crew.members)} members</span>
          {vibes.map((v) => (
            <Link key={v} to={`/v/${v}`} className="chip !py-1 !text-[12px]">
              {labelOf(v)}
            </Link>
          ))}
        </div>
      </header>
      <form
        className="flex flex-col gap-2 rounded-[14px] border border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim().length < 3) return
          store.addPost(id, text.trim())
          setText('')
        }}
      >
        <label htmlFor="compose" className="sr-only">
          Post to {crew.name}
        </label>
        <textarea
          id="compose"
          rows={2}
          className="w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-ink-3"
          placeholder={`Share a find, a fit, a thought with ${crew.name}…`}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
        />
        <div className="flex items-center justify-between">
          <span className="tnum font-mono text-[11px] text-ink-3">{280 - text.length}</span>
          <button className="btn !py-1.5" disabled={text.trim().length < 3} type="submit">
            Post
          </button>
        </div>
      </form>
      <div className="flex flex-col">
        {posts.map((p) => (
          <PostCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  )
}
