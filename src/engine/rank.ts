import { effectiveAffinity, typePreference } from './profile'
import { COMBOS, VIBE_BY_ID, isCombo } from './taxonomy'
import type { CatalogItem, ItemType, Profile, Ranked, Reason, Tags, VibeId } from './types'

export interface RankOptions<T extends CatalogItem> {
  catalog: T[]
  profile: Profile
  /** Already in the feed. Only reused once everything else has been shown. */
  shownIds: Set<string>
  /** Never shown again. */
  excludeIds: Set<string>
  size: number
  seed: number
  now: number
  /** What the viewer just saw (oldest first), so variety holds across batch boundaries. */
  recent?: Pick<CatalogItem, 'type' | 'tags' | 'source'>[]
}

/** Positions (0-based) in each batch reserved for discovery and for a partner drop. */
const EXPLORE_SLOTS = [2, 7]
const PARTNER_SLOT = 4
/** A partner item must genuinely match the viewer to earn its slot. */
export const PARTNER_MIN_RELEVANCE = 0.25
const MAX_PER_TYPE: Record<ItemType, number> = { find: 4, quote: 2, post: 3, fit: 2, ritual: 1 }
const DAY = 86_400_000

/** Deterministic PRNG so a feed can be reproduced from its seed. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tagTotal(tags: Tags): number {
  return Object.values(tags).reduce((s, w) => s + w, 0) || 1
}

/** -1..1: how well an item's tags line up with what the user is into. */
export function relevance(tags: Tags, eff: Record<VibeId, number>): number {
  let sum = 0
  let max = -1
  for (const [id, w] of Object.entries(tags)) {
    const a = eff[id] ?? 0
    sum += w * a
    max = Math.max(max, w * a)
  }
  // Blend the average with the single best match so one strong hit still counts.
  return 0.6 * (sum / tagTotal(tags)) + 0.4 * max
}

/** Vibes that pushed this item up, strongest first. */
export function drivers(tags: Tags, eff: Record<VibeId, number>): VibeId[] {
  return Object.entries(tags)
    .map(([id, w]) => [id, w * (eff[id] ?? 0)] as const)
    .filter(([, c]) => c > 0.05)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
}

function isBlocked(tags: Tags, eff: Record<VibeId, number>): boolean {
  // Any strongly disliked or muted vibe that is central to the item rules it out.
  return Object.entries(tags).some(([id, w]) => w >= 0.5 && (eff[id] ?? 0) <= -0.5)
}

/**
 * Discovery score: how much of the item is territory the user hasn't explored,
 * preferring vibes adjacent to what they already love.
 */
function exploreScore(tags: Tags, profile: Profile, eff: Record<VibeId, number>): { score: number; anchor?: VibeId; vibe?: VibeId } {
  const strong = Object.keys(VIBE_BY_ID).filter((id) => (eff[id] ?? 0) > 0.4)
  let best = { score: 0 } as { score: number; anchor?: VibeId; vibe?: VibeId }
  for (const [id, w] of Object.entries(tags)) {
    const vibe = VIBE_BY_ID[id]
    if (!vibe || w < 0.5) continue
    const a = eff[id] ?? 0
    if (a > 0.25 || a < -0.15) continue
    const novelty = 1 / Math.sqrt(1 + (profile.exposure[id] ?? 0))
    const anchor = strong.find((s) => VIBE_BY_ID[s].adjacent.includes(id))
    const score = w * novelty * (anchor ? 1.5 : 1)
    if (score > best.score) best = { score, anchor, vibe: id }
  }
  return best
}

function primaryTag(tags: Tags): VibeId | undefined {
  let best: VibeId | undefined
  let bw = -1
  for (const [id, w] of Object.entries(tags)) {
    if (!isCombo(id) && w > bw) {
      best = id
      bw = w
    }
  }
  return best
}

function reasonFor(tags: Tags, eff: Record<VibeId, number>, profile: Profile): Reason {
  const combo = COMBOS.find((c) => (tags[c.id] ?? 0) >= 0.5 && profile.unlocked.includes(c.id))
  const tagsDriving = drivers(tags, eff).filter((id) => !isCombo(id))
  if (combo) return { kind: 'combo', combo: combo.id, tags: tagsDriving }
  if (tagsDriving.length) return { kind: 'match', tags: tagsDriving }
  return { kind: 'popular', tags: [] }
}

export function rankBatch<T extends CatalogItem>(opts: RankOptions<T>): Ranked<T>[] {
  const { catalog, profile, shownIds, excludeIds, size, now } = opts
  const rand = mulberry32(opts.seed)
  const eff = effectiveAffinity(profile)
  const hasSignal = Object.values(profile.affinity).some((v) => Math.abs(v) > 0.5)

  const eligible = catalog.filter((i) => !excludeIds.has(i.id) && !isBlocked(i.tags, eff))
  let pool = eligible.filter((i) => !shownIds.has(i.id))
  // Out of fresh items: recycle, so the feed never dead-ends.
  if (pool.filter((i) => !i.sponsored).length < size) pool = eligible

  const scored = pool.map((item) => {
    const rel = relevance(item.tags, eff)
    const ageDays = (now - item.createdAt) / DAY
    const fresh = ageDays < 7 ? 0.1 * (1 - ageDays / 7) : 0
    const recycled = shownIds.has(item.id) ? -0.6 : 0
    const base =
      (hasSignal ? rel : 0) + 0.25 * typePreference(profile, item.type) + 0.15 * item.popularity + fresh + recycled + (rand() - 0.5) * 0.06
    return { item, rel, base, explore: exploreScore(item.tags, profile, eff) }
  })

  const organic = scored.filter((s) => !s.item.sponsored)
  const partners = scored.filter((s) => s.item.sponsored && !shownIds.has(s.item.id) && s.rel >= PARTNER_MIN_RELEVANCE)
  const used = new Set<string>()
  const out: Ranked<T>[] = []
  const typeCount: Partial<Record<ItemType, number>> = {}

  const history = () => [...(opts.recent ?? []), ...out.map((r) => r.item)]
  const penalty = (item: T): number => {
    let p = 0
    const h = history()
    const last = h.slice(-2)
    if (last.length && last[last.length - 1].type === item.type) p += 0.4
    if (last.length === 2 && last.every((r) => r.type === item.type)) p += 1
    if ((typeCount[item.type] ?? 0) >= Math.ceil((MAX_PER_TYPE[item.type] * size) / 10)) p += 2
    const prim = primaryTag(item.tags)
    if (prim && h.slice(-3).some((r) => primaryTag(r.tags) === prim)) p += 0.2
    if (item.source && h.slice(-5).some((r) => r.source === item.source)) p += 0.3
    return p
  }

  const push = (s: (typeof scored)[number], reason: Reason) => {
    used.add(s.item.id)
    typeCount[s.item.type] = (typeCount[s.item.type] ?? 0) + 1
    out.push({ item: s.item, score: s.base, reason })
  }

  for (let pos = 0; pos < size; pos++) {
    if (pos === PARTNER_SLOT) {
      const p = partners.filter((s) => !used.has(s.item.id)).sort((a, b) => b.rel - a.rel)[0]
      if (p) {
        push(p, { kind: 'partner', tags: drivers(p.item.tags, eff).filter((id) => !isCombo(id)) })
        continue
      }
    }

    const remaining = organic.filter((s) => !used.has(s.item.id))
    if (!remaining.length) break

    if (hasSignal && EXPLORE_SLOTS.includes(pos)) {
      const pick = remaining
        .filter((s) => s.explore.score > 0)
        .sort((a, b) => b.explore.score + 0.3 * b.item.popularity - penalty(b.item) - (a.explore.score + 0.3 * a.item.popularity - penalty(a.item)))[0]
      if (pick) {
        const { vibe, anchor } = pick.explore
        push(pick, { kind: 'explore', tags: [vibe!, ...(anchor ? [anchor] : [])] })
        continue
      }
    }

    const pick = remaining.reduce((best, s) => (s.base - penalty(s.item) > best.base - penalty(best.item) ? s : best))
    push(pick, reasonFor(pick.item.tags, eff, profile))
  }

  return out
}

/** Cosine similarity over tag vectors. Used for "because you saved X". */
export function similarity(a: Tags, b: Tags): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (const [k, v] of Object.entries(a)) {
    na += v * v
    if (k in b) dot += v * b[k]
  }
  for (const v of Object.values(b)) nb += v * v
  return na && nb ? dot / Math.sqrt(na * nb) : 0
}

export function mostSimilar<T extends CatalogItem>(anchor: CatalogItem, catalog: T[], exclude: Set<string>, n: number, types?: ItemType[]): T[] {
  return catalog
    .filter((i) => i.id !== anchor.id && !exclude.has(i.id) && !i.sponsored && (!types || types.includes(i.type)))
    .map((i) => ({ i, s: similarity(anchor.tags, i.tags) }))
    .filter((x) => x.s > 0.35)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.i)
}
