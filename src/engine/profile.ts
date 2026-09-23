import { COMBOS, type Combo } from './taxonomy'
import type { EventKind, ItemType, Profile, Tags, VibeEvent, VibeId } from './types'

/** Base weight of each signal. Buying intent and explicit "not for me" dominate. */
export const EVENT_WEIGHTS: Record<EventKind, number> = {
  seed: 3,
  view: 0.15,
  open: 0.6,
  like: 1,
  unlike: -1,
  save: 1.5,
  unsave: -1.5,
  shop: 2,
  share: 1.2,
  hide: -2.5,
  ritual_done: 0.8,
  ritual_skip: -0.1,
  post: 1,
  search: 0.5,
  follow: 3,
  mute: -4,
  // Showing up in person is the strongest signal of real interest.
  rsvp: 2.5,
  unrsvp: -1.5,
}

/** Interests fade if you stop engaging with them. */
export const HALF_LIFE_DAYS = 30
/** A combo unlocks once both halves are reasonably strong. */
export const UNLOCK_THRESHOLD = 0.35

const DAY = 86_400_000

export function emptyProfile(now: number): Profile {
  return { affinity: {}, typeAffinity: {}, exposure: {}, unlocked: [], muted: [], snapshot: {}, updatedAt: now, eventCount: 0 }
}

/** Squash a raw score into -1..1. */
export function norm(raw: number): number {
  return Math.tanh(raw / 3)
}

export function comboStrength(combo: Combo, base: Record<VibeId, number>): number {
  // Geometric mean of the best vibe in each group: both halves must be present.
  let product = 1
  for (const group of combo.requires) {
    const best = Math.max(0, ...group.map((id) => base[id] ?? 0))
    product *= best
  }
  return Math.pow(product, 1 / combo.requires.length)
}

/** Normalized affinity for every vibe plus derived combo strengths. Muted vibes read as -1. */
export function effectiveAffinity(profile: Profile): Record<VibeId, number> {
  const eff: Record<VibeId, number> = {}
  for (const [id, raw] of Object.entries(profile.affinity)) eff[id] = norm(raw)
  for (const combo of COMBOS) eff[combo.id] = comboStrength(combo, eff)
  for (const id of profile.muted) eff[id] = -1
  return eff
}

export function decayProfile(profile: Profile, now: number): Profile {
  const days = (now - profile.updatedAt) / DAY
  if (days <= 0) return profile
  const factor = Math.pow(0.5, days / HALF_LIFE_DAYS)
  const scale = (rec: Record<string, number>) => Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, v * factor]))
  return {
    ...profile,
    affinity: scale(profile.affinity),
    typeAffinity: scale(profile.typeAffinity as Record<string, number>),
    exposure: scale(profile.exposure),
    updatedAt: now,
  }
}

export interface ApplyResult {
  profile: Profile
  /** Combos that crossed the unlock threshold because of this event. */
  unlocked: VibeId[]
}

export function applyEvent(profile: Profile, event: VibeEvent, now: number): ApplyResult {
  const delta = EVENT_WEIGHTS[event.kind] * (event.strength ?? 1)
  const affinity = { ...profile.affinity }
  for (const [id, w] of Object.entries(event.tags)) {
    // Combo tags are derived, never learned directly.
    if (COMBOS.some((c) => c.id === id)) continue
    affinity[id] = (affinity[id] ?? 0) + delta * w
  }

  const typeAffinity = { ...profile.typeAffinity }
  if (event.itemType && event.kind !== 'view') {
    typeAffinity[event.itemType] = (typeAffinity[event.itemType] ?? 0) + delta * 0.3
  }

  let muted = profile.muted
  if (event.kind === 'mute') muted = [...new Set([...muted, ...Object.keys(event.tags)])]
  if (event.kind === 'follow') muted = muted.filter((id) => !(id in event.tags))

  const next: Profile = { ...profile, affinity, typeAffinity, muted, updatedAt: now, eventCount: profile.eventCount + 1 }

  const eff = effectiveAffinity(next)
  const unlocked = COMBOS.filter((c) => !profile.unlocked.includes(c.id) && eff[c.id] >= UNLOCK_THRESHOLD).map((c) => c.id)
  next.unlocked = [...profile.unlocked, ...unlocked]
  return { profile: next, unlocked }
}

export function recordImpression(profile: Profile, tags: Tags): Profile {
  const exposure = { ...profile.exposure }
  for (const [id, w] of Object.entries(tags)) exposure[id] = (exposure[id] ?? 0) + w
  return { ...profile, exposure }
}

/** Freeze the current state so the profile page can show what's rising or cooling. */
export function takeSnapshot(profile: Profile): Profile {
  return { ...profile, snapshot: effectiveAffinity(profile) }
}

export interface VibeStanding {
  id: VibeId
  value: number
  trend: number
}

export function topVibes(profile: Profile, n: number, opts: { combos?: boolean } = {}): VibeStanding[] {
  const eff = effectiveAffinity(profile)
  return Object.entries(eff)
    .filter(([id, v]) => v > 0.05 && (opts.combos ? profile.unlocked.includes(id) : !COMBOS.some((c) => c.id === id)))
    .map(([id, value]) => ({ id, value, trend: value - (profile.snapshot[id] ?? 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n)
}

export function typePreference(profile: Profile, type: ItemType): number {
  return norm(profile.typeAffinity[type] ?? 0)
}
