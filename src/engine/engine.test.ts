import { describe, expect, it } from 'vitest'
import { applyEvent, decayProfile, effectiveAffinity, emptyProfile, HALF_LIFE_DAYS, recordImpression } from './profile'
import { PARTNER_MIN_RELEVANCE, rankBatch, relevance, mostSimilar } from './rank'
import { explain, vibeRead } from './explain'
import { CATALOG, FIND_BY_ID } from '../data/catalog'
import type { Profile, Tags } from './types'

const NOW = 1_800_000_000_000
const DAY = 86_400_000

function seeded(tags: Tags): Profile {
  return applyEvent(emptyProfile(NOW), { kind: 'seed', tags }, NOW).profile
}

function batch(profile: Profile, opts: { shown?: string[]; exclude?: string[]; seed?: number } = {}) {
  return rankBatch({
    catalog: CATALOG,
    profile,
    shownIds: new Set(opts.shown ?? []),
    excludeIds: new Set(opts.exclude ?? []),
    size: 10,
    seed: opts.seed ?? 7,
    now: NOW,
  })
}

describe('profile learning', () => {
  it('unlocks retro jerseys when soccer meets vintage', () => {
    const { profile, unlocked } = applyEvent(emptyProfile(NOW), { kind: 'seed', tags: { soccer: 1, vintage: 1 } }, NOW)
    expect(unlocked).toContain('retrojerseys')
    expect(profile.unlocked).toContain('retrojerseys')
  })

  it('does not unlock a combo from one half alone', () => {
    const { unlocked } = applyEvent(emptyProfile(NOW), { kind: 'seed', tags: { soccer: 1 } }, NOW)
    expect(unlocked).not.toContain('retrojerseys')
  })

  it('reports an unlock only once', () => {
    const first = applyEvent(emptyProfile(NOW), { kind: 'seed', tags: { soccer: 1, vintage: 1 } }, NOW)
    const second = applyEvent(first.profile, { kind: 'save', tags: { soccer: 1, vintage: 1 } }, NOW)
    expect(second.unlocked).not.toContain('retrojerseys')
  })

  it('discovers retro jerseys through behavior, not only onboarding', () => {
    // Picked soccer at onboarding, then kept saving vintage things.
    let p = seeded({ soccer: 1 })
    const jacket = FIND_BY_ID['f-workjacket']
    for (let i = 0; i < 3; i++) p = applyEvent(p, { kind: 'save', tags: jacket.tags, itemType: 'find' }, NOW).profile
    expect(p.unlocked).toContain('retrojerseys')
  })

  it('"not for me" pushes a vibe negative', () => {
    const p = applyEvent(seeded({ fragrance: 0.2 }), { kind: 'hide', tags: { fragrance: 1 } }, NOW).profile
    expect(effectiveAffinity(p).fragrance).toBeLessThan(0)
  })

  it('muting overrides learned affinity', () => {
    const p = applyEvent(seeded({ skincare: 1 }), { kind: 'mute', tags: { skincare: 1 } }, NOW).profile
    expect(effectiveAffinity(p).skincare).toBe(-1)
  })

  it('halves interests after one half-life', () => {
    const p = seeded({ coffee: 1 })
    const later = decayProfile(p, NOW + HALF_LIFE_DAYS * DAY)
    expect(later.affinity.coffee).toBeCloseTo(p.affinity.coffee / 2, 5)
  })
})

describe('ranking', () => {
  it('leads a retro-jersey profile with soccer and vintage', () => {
    const top = batch(seeded({ soccer: 1, vintage: 1 })).slice(0, 4)
    for (const r of top.filter((r) => r.reason.kind !== 'explore')) {
      expect(relevance(r.item.tags, effectiveAffinity(seeded({ soccer: 1, vintage: 1 })))).toBeGreaterThan(0)
    }
    expect(top.some((r) => (r.item.tags.retrojerseys ?? 0) > 0 || (r.item.tags.soccer ?? 0) > 0)).toBe(true)
  })

  it('surfaces a retro jersey in the first batch for that profile', () => {
    const items = batch(seeded({ soccer: 1, vintage: 1 }))
    expect(items.some((r) => r.item.type === 'find' && (r.item.tags.retrojerseys ?? 0) >= 0.9)).toBe(true)
  })

  it('never shows excluded (hidden) items', () => {
    const exclude = ['f-striped', 'f-keeper', 'q-quality']
    const items = batch(seeded({ soccer: 1, vintage: 1 }), { exclude })
    expect(items.map((r) => r.item.id)).not.toEqual(expect.arrayContaining(exclude))
  })

  it('keeps muted vibes out of the feed', () => {
    let p = seeded({ soccer: 1 })
    p = applyEvent(p, { kind: 'mute', tags: { skincare: 1 } }, NOW).profile
    for (let s = 1; s < 6; s++) {
      for (const r of batch(p, { seed: s })) expect(r.item.tags.skincare ?? 0).toBeLessThan(0.5)
    }
  })

  it('reserves slots for exploration once the profile has signal', () => {
    const items = batch(seeded({ soccer: 1, vintage: 1 }))
    const explore = items.filter((r) => r.reason.kind === 'explore')
    expect(explore.length).toBeGreaterThan(0)
    const eff = effectiveAffinity(seeded({ soccer: 1, vintage: 1 }))
    for (const r of explore) expect(eff[r.reason.tags[0]] ?? 0).toBeLessThan(0.3)
  })

  it('prefers exploring neighbors of what you love', () => {
    const items = batch(seeded({ soccer: 1, vintage: 1 }))
    const anchored = items.filter((r) => r.reason.kind === 'explore' && r.reason.tags[1])
    expect(anchored.length).toBeGreaterThan(0)
  })

  it('only shows partner items that match the viewer', () => {
    const profiles: Tags[] = [{ soccer: 1, vintage: 1 }, { cooking: 1 }, { vinyl: 1, reading: 1 }, { skincare: 1 }]
    for (const tags of profiles) {
      const p = seeded(tags)
      const eff = effectiveAffinity(p)
      for (const r of batch(p).filter((r) => r.item.sponsored)) {
        expect(r.reason.kind).toBe('partner')
        expect(relevance(r.item.tags, eff)).toBeGreaterThanOrEqual(PARTNER_MIN_RELEVANCE)
      }
    }
  })

  it('shows no partner items to a cold-start user', () => {
    expect(batch(emptyProfile(NOW)).some((r) => r.item.sponsored)).toBe(false)
  })

  it('never stacks three of the same type in a row', () => {
    for (let s = 1; s < 8; s++) {
      const types = batch(seeded({ philosophy: 1, discipline: 1 }), { seed: s }).map((r) => r.item.type)
      for (let i = 2; i < types.length; i++) expect(types[i] === types[i - 1] && types[i] === types[i - 2]).toBe(false)
    }
  })

  it('keeps variety across batch boundaries', () => {
    for (let s = 1; s < 8; s++) {
      const first = batch(seeded({ philosophy: 1, discipline: 1 }), { seed: s })
      const recent = [first[first.length - 1].item]
      const next = rankBatch({ catalog: CATALOG, profile: seeded({ philosophy: 1, discipline: 1 }), shownIds: new Set(first.map((r) => r.item.id)), excludeIds: new Set(), size: 10, seed: s + 10, now: NOW, recent })
      expect(next[0].item.type).not.toBe(recent[0].type)
    }
  })

  it('does not repeat items while fresh ones remain', () => {
    const p = seeded({ soccer: 1 })
    const first = batch(p).map((r) => r.item.id)
    const second = batch(p, { shown: first, seed: 8 }).map((r) => r.item.id)
    expect(second.filter((id) => first.includes(id))).toEqual([])
  })

  it('is deterministic for a given seed', () => {
    const p = seeded({ coffee: 1, running: 1 })
    expect(batch(p, { seed: 42 }).map((r) => r.item.id)).toEqual(batch(p, { seed: 42 }).map((r) => r.item.id))
  })

  it('exposure makes a vibe less novel', () => {
    const p = seeded({ soccer: 1 })
    const seen = recordImpression(p, { fragrance: 5 })
    const before = batch(p).filter((r) => r.reason.kind === 'explore' && r.reason.tags[0] === 'fragrance').length
    const after = batch(seen).filter((r) => r.reason.kind === 'explore' && r.reason.tags[0] === 'fragrance').length
    expect(after).toBeLessThanOrEqual(before)
  })
})

describe('similar items', () => {
  it('finds other retro jerseys for a retro jersey', () => {
    const sims = mostSimilar(FIND_BY_ID['f-striped'], CATALOG, new Set(), 3, ['find'])
    expect(sims.length).toBeGreaterThan(0)
    for (const s of sims) expect(s.tags.soccer ?? 0).toBeGreaterThan(0)
  })
})

describe('explanations', () => {
  it('names the combo recipe for combo picks', () => {
    const p = seeded({ soccer: 1, vintage: 1 })
    expect(explain({ kind: 'combo', combo: 'retrojerseys', tags: ['soccer'] }, p)).toBe('Retro Jerseys · Soccer + Vintage & Thrift')
  })

  it('summarizes a profile by its top interests', () => {
    const p = seeded({ soccer: 1, vintage: 1, philosophy: 0.6 })
    expect(vibeRead(p).headline).toBe('Soccer, Vintage & Thrift and Philosophy')
  })

  it('handles an empty profile', () => {
    expect(vibeRead(emptyProfile(NOW)).headline).toBe('Still learning your taste')
  })
})
