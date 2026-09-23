import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  applyEvent,
  COMBO_BY_ID,
  decayProfile,
  emptyProfile,
  labelOf,
  mostSimilar,
  rankBatch,
  recordImpression,
  takeSnapshot,
  VIBES,
  type EventKind,
  type Profile,
  type Reason,
  type Tags,
  type VibeId,
} from '../engine'
import { CATALOG, CLUB_BY_ID, itemById } from '../data/catalog'
import type { AnyItem, PostItem, QuoteTheme } from '../data/types'
import * as storage from './storage'

export interface Scout {
  id: string
  name: string
  link: string
  vibe: VibeId
  why: string
  at: number
}

export interface Settings {
  appearance: 'auto' | 'light' | 'dark'
  /** Multiplier on the base text size; the whole type scale is in rem. */
  textSize: 1 | 1.12 | 1.25
}

interface Persisted {
  v: 3
  onboarded: boolean
  handle: string
  /** Morning-quote themes. Empty means every theme. */
  themes: QuoteTheme[]
  settings: Settings
  profile: Profile
  liked: string[]
  saved: string[]
  hidden: string[]
  shown: string[]
  myPosts: PostItem[]
  /** yyyy-mm-dd → ritual ids completed that day. */
  ritualLog: Record<string, string[]>
  scouted: Scout[]
  seed: number
}

export interface FeedEntry {
  key: string
  id?: string
  reason?: Reason
  /** A combo the user just unlocked, shown as its own card. */
  unlock?: VibeId
}

export interface Toast {
  id: number
  tone: 'unlock' | 'info'
  title: string
  body?: string
}

export interface OnboardingInput {
  vibes: VibeId[]
  themes: QuoteTheme[]
}

const BATCH = 10
const MAX_SHOWN = 400

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function fresh(): Persisted {
  return {
    v: 3,
    onboarded: false,
    handle: '',
    themes: [],
    settings: { appearance: 'auto', textSize: 1 },
    profile: emptyProfile(Date.now()),
    liked: [],
    saved: [],
    hidden: [],
    shown: [],
    myPosts: [],
    ritualLog: {},
    scouted: [],
    seed: Math.floor(Math.random() * 1e9),
  }
}

function boot(): Persisted {
  const saved = storage.load<Persisted>()
  const base = saved?.v === 3 ? saved : fresh()
  // New session: fade stale interests, then freeze a snapshot for trend arrows.
  return { ...base, profile: takeSnapshot(decayProfile(base.profile, Date.now())) }
}

function toggle(list: string[], id: string, on: boolean): string[] {
  return on ? [...new Set([...list, id])] : list.filter((x) => x !== id)
}

function useStoreValue() {
  const [state, setState] = useState<Persisted>(boot)
  const [feed, setFeed] = useState<FeedEntry[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  // Combos unlocked but not yet celebrated. One card per batch, so it stays special.
  const pendingUnlocks = useRef<VibeId[]>([])
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => storage.save(state), [state])

  const allItems = useCallback((): AnyItem[] => [...CATALOG, ...stateRef.current.myPosts], [])
  const lookup = useCallback((id: string) => itemById(id, stateRef.current.myPosts), [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((ts) => [...ts.slice(-2), { ...t, id }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4200)
  }, [])

  const announce = useCallback(
    (unlocked: VibeId[]) => {
      if (!unlocked.length) return
      for (const id of unlocked) {
        const combo = COMBO_BY_ID[id]
        toast({ tone: 'unlock', title: `Unlocked: ${combo.label}`, body: combo.blurb })
      }
      pendingUnlocks.current.push(...unlocked)
    },
    [toast],
  )

  /** Apply a learning signal and surface any combos it unlocked. */
  const signal = useCallback(
    (kind: EventKind, tags: Tags, itemType?: AnyItem['type'], strength?: number) => {
      const res = applyEvent(stateRef.current.profile, { kind, tags, itemType, strength }, Date.now())
      stateRef.current = { ...stateRef.current, profile: res.profile }
      setState(stateRef.current)
      announce(res.unlocked)
    },
    [announce],
  )

  const track = useCallback((kind: EventKind, item: AnyItem) => signal(kind, item.tags, item.type), [signal])

  const update = useCallback((fn: (s: Persisted) => Persisted) => {
    stateRef.current = fn(stateRef.current)
    setState(stateRef.current)
  }, [])

  const feedRef = useRef(feed)
  feedRef.current = feed

  const loadMore = useCallback(() => {
    const s = stateRef.current
    const doneToday = s.ritualLog[today()] ?? []
    // The feed opens under the daily quote, so a fresh feed counts a quote as just seen.
    const recent = feedRef.current.length
      ? feedRef.current
          .slice(-5)
          .map((e) => (e.id ? itemById(e.id, s.myPosts) : undefined))
          .filter((i): i is AnyItem => !!i)
      : [{ type: 'quote' as const, tags: {} }]
    const batch = rankBatch({
      catalog: allItems().filter((i) => !(i.type === 'post' && i.mine)),
      profile: s.profile,
      shownIds: new Set(s.shown),
      excludeIds: new Set([...s.hidden, ...doneToday]),
      size: BATCH,
      seed: s.seed + s.shown.length,
      now: Date.now(),
      recent,
    })
    const next = pendingUnlocks.current.shift()
    const unlockEntries = next ? [{ key: `u-${next}-${s.shown.length}`, unlock: next }] : []
    const entries = batch.map((r, i) => ({ key: `${r.item.id}-${s.shown.length + i}`, id: r.item.id, reason: r.reason }))
    feedRef.current = [...feedRef.current, ...unlockEntries, ...entries]
    setFeed((f) => [...f, ...unlockEntries, ...entries])
    update((st) => ({ ...st, shown: [...st.shown, ...batch.map((r) => r.item.id)].slice(-MAX_SHOWN) }))
  }, [allItems, update])

  const resetFeed = useCallback(() => setFeed([]), [])

  /** TikTok-style instant adaptation: slot similar items just below the one you engaged with. */
  const injectSimilar = useCallback(
    (anchor: AnyItem, n: number) => {
      if (anchor.type !== 'find' && anchor.type !== 'fit') return
      setFeed((f) => {
        const idx = f.findIndex((e) => e.id === anchor.id)
        if (idx < 0 || f.some((e) => e.reason?.kind === 'similar' && e.reason.anchorId === anchor.id)) return f
        const inFeed = new Set([...f.map((e) => e.id!).filter(Boolean), ...stateRef.current.hidden])
        const sims = mostSimilar(anchor, allItems(), inFeed, n, ['find', 'fit'])
        if (!sims.length) return f
        const entries = sims.map((i) => ({ key: `sim-${i.id}-${Date.now()}`, id: i.id, reason: { kind: 'similar' as const, tags: [], anchorId: anchor.id } }))
        const at = Math.min(f.length, idx + 2)
        return [...f.slice(0, at), ...entries, ...f.slice(at)]
      })
    },
    [allItems],
  )

  const toggleLike = useCallback(
    (item: AnyItem) => {
      const on = !stateRef.current.liked.includes(item.id)
      update((s) => ({ ...s, liked: toggle(s.liked, item.id, on) }))
      track(on ? 'like' : 'unlike', item)
      if (on) injectSimilar(item, 1)
    },
    [track, update, injectSimilar],
  )

  const toggleSave = useCallback(
    (item: AnyItem) => {
      const on = !stateRef.current.saved.includes(item.id)
      update((s) => ({ ...s, saved: toggle(s.saved, item.id, on) }))
      track(on ? 'save' : 'unsave', item)
      if (on) {
        injectSimilar(item, 2)
        toast({ tone: 'info', title: 'Saved' })
      }
    },
    [track, update, injectSimilar, toast],
  )

  const hide = useCallback(
    (item: AnyItem) => {
      update((s) => ({ ...s, hidden: toggle(s.hidden, item.id, true) }))
      track('hide', item)
      setFeed((f) => f.filter((e) => e.id !== item.id))
      toast({ tone: 'info', title: "You'll see less like this" })
    },
    [track, update, toast],
  )

  /** Drop an entry from the feed without treating it as a dislike. */
  const dismiss = useCallback((id: string) => setFeed((f) => f.filter((e) => e.id !== id)), [])

  const impression = useCallback(
    (item: AnyItem) => update((s) => ({ ...s, profile: recordImpression(s.profile, item.tags) })),
    [update],
  )

  const shopClick = useCallback(
    (item: AnyItem) => {
      track('shop', item)
      injectSimilar(item, 2)
    },
    [track, injectSimilar],
  )

  const ritual = useCallback(
    (item: AnyItem, done: boolean) => {
      track(done ? 'ritual_done' : 'ritual_skip', item)
      if (done) update((s) => ({ ...s, ritualLog: { ...s.ritualLog, [today()]: [...new Set([...(s.ritualLog[today()] ?? []), item.id])] } }))
    },
    [track, update],
  )

  const addPost = useCallback(
    (clubId: string, text: string) => {
      const club = CLUB_BY_ID[clubId]
      const post: PostItem = {
        id: `mine-${Date.now()}`,
        type: 'post',
        author: stateRef.current.handle || 'you',
        club: clubId,
        text,
        likes: 0,
        replies: 0,
        mine: true,
        tags: club.tags,
        source: clubId,
        createdAt: Date.now(),
        popularity: 0,
      }
      update((s) => ({ ...s, myPosts: [post, ...s.myPosts] }))
      signal('post', club.tags, 'post')
      return post
    },
    [signal, update],
  )

  const follow = useCallback(
    (id: VibeId) => {
      signal('follow', { [id]: 1 })
      toast({ tone: 'info', title: `You'll see more ${labelOf(id)}` })
    },
    [signal, toast],
  )

  const mute = useCallback(
    (id: VibeId) => {
      signal('mute', { [id]: 1 })
      toast({ tone: 'info', title: `${labelOf(id)} hidden`, body: 'You can undo this from your profile.' })
    },
    [signal, toast],
  )

  /** Remove an interest without penalizing it, like un-following. */
  const unfollow = useCallback(
    (id: VibeId) => update((s) => ({ ...s, profile: { ...s.profile, muted: s.profile.muted.filter((m) => m !== id), affinity: { ...s.profile.affinity, [id]: 0 } } })),
    [update],
  )

  const unmute = useCallback(
    (id: VibeId) => update((s) => ({ ...s, profile: { ...s.profile, muted: s.profile.muted.filter((m) => m !== id), affinity: { ...s.profile.affinity, [id]: 0 } } })),
    [update],
  )

  const search = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase()
      if (q.length < 3) return
      const hits = VIBES.filter((v) => v.label.toLowerCase().includes(q) || v.id.includes(q))
      if (hits.length) signal('search', Object.fromEntries(hits.map((v) => [v.id, 1])))
    },
    [signal],
  )

  const scout = useCallback(
    (s: Omit<Scout, 'id' | 'at'>) => {
      update((st) => ({ ...st, scouted: [{ ...s, id: `s-${Date.now()}`, at: Date.now() }, ...st.scouted] }))
      signal('post', { [s.vibe]: 1 })
    },
    [signal, update],
  )

  const completeOnboarding = useCallback(
    (input: OnboardingInput) => {
      let profile = emptyProfile(Date.now())
      const unlockedAll: VibeId[] = []
      const events = input.vibes.map((id) => ({ tags: { [id]: 1 }, strength: 1 }))
      for (const e of events) {
        const res = applyEvent(profile, { kind: 'seed', tags: e.tags, strength: e.strength }, Date.now())
        profile = res.profile
        unlockedAll.push(...res.unlocked)
      }
      update((s) => ({ ...s, onboarded: true, themes: input.themes, profile: takeSnapshot({ ...profile, snapshot: {} }), shown: [] }))
      // Unlocks from onboarding appear at the top of the first feed.
      pendingUnlocks.current = unlockedAll
      setFeed([])
    },
    [update],
  )

  const setSettings = useCallback((patch: Partial<Settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } })), [update])
  const setThemes = useCallback((themes: QuoteTheme[]) => update((s) => ({ ...s, themes })), [update])

  const reset = useCallback(() => {
    storage.clear()
    // Keep display settings: they are about the person's needs, not their taste.
    const next = { ...fresh(), settings: stateRef.current.settings }
    stateRef.current = next
    setState(next)
    setFeed([])
    pendingUnlocks.current = []
  }, [])

  const doneToday = state.ritualLog[today()] ?? []
  const ritualStreak = useMemo(() => {
    let n = 0
    const d = new Date()
    for (;;) {
      const key = d.toISOString().slice(0, 10)
      if (!state.ritualLog[key]?.length) break
      n++
      d.setDate(d.getDate() - 1)
    }
    return n
  }, [state.ritualLog])

  return {
    ...state,
    feed,
    toasts,
    doneToday,
    ritualStreak,
    lookup,
    allItems,
    loadMore,
    resetFeed,
    track,
    toggleLike,
    toggleSave,
    hide,
    dismiss,
    impression,
    shopClick,
    ritual,
    addPost,
    follow,
    mute,
    unfollow,
    unmute,
    search,
    scout,
    completeOnboarding,
    setSettings,
    setThemes,
    reset,
    dismissToast: (id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)),
  }
}

export type Store = ReturnType<typeof useStoreValue>

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside StoreProvider')
  return s
}
