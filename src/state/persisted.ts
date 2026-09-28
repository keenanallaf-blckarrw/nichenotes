import { decayProfile, emptyProfile, takeSnapshot, type DistanceUnit, type LatLng, type Profile, type VibeId } from '../engine'
import type { EventComment, EventItem, PostItem, QuoteTheme } from '../data/types'
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

/** The person's area. Only an approximate center is ever stored. */
export interface Area {
  center: LatLng
  label: string
  placeId?: string
  radiusKm: number
  unit: DistanceUnit
}

/** Everything saved on the device between visits. */
export interface Persisted {
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
  /** yyyy-mm-dd (local day) → ritual ids completed that day. */
  ritualLog: Record<string, string[]>
  scouted: Scout[]
  seed: number
  area: Area | null
  going: string[]
  comments: Record<string, EventComment[]>
  myEvents: EventItem[]
  reported: string[]
  areaPromptDismissed: boolean
}

export function fresh(): Persisted {
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
    area: null,
    going: [],
    comments: {},
    myEvents: [],
    reported: [],
    areaPromptDismissed: false,
  }
}

export function boot(): Persisted {
  const saved = storage.load<Persisted>()
  // Fill in fields added since the data was saved, so nobody loses their taste profile.
  const base = saved?.v === 3 ? { ...fresh(), ...saved } : fresh()
  // New session: fade stale interests, then freeze a snapshot for trend arrows.
  return { ...base, profile: takeSnapshot(decayProfile(base.profile, Date.now())) }
}

export function toggle(list: string[], id: string, on: boolean): string[] {
  return on ? [...new Set([...list, id])] : list.filter((x) => x !== id)
}
