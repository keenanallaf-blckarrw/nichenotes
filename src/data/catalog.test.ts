import { describe, expect, it } from 'vitest'
import { COMBOS, COMBO_BY_ID, VIBES, VIBE_BY_ID, WORLDS, applyEvent, emptyProfile, rankBatch } from '../engine'
import { CATALOG, CLUB_BY_ID, CLUBS, FINDS, FIND_BY_ID, FITS, POSTS, QUOTES, QUOTE_THEMES, SHOP_BY_ID } from './catalog'

const isTag = (id: string) => id in VIBE_BY_ID || id in COMBO_BY_ID

// Guards the promise that every option in the app leads somewhere real.
describe('catalog integrity', () => {
  it('has unique ids', () => {
    const ids = CATALOG.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only uses known interests in tags', () => {
    for (const item of CATALOG) for (const t of Object.keys(item.tags)) expect(isTag(t), `${item.id} → ${t}`).toBe(true)
    for (const club of CLUBS) for (const t of Object.keys(club.tags)) expect(isTag(t), `${club.id} → ${t}`).toBe(true)
  })

  it('links every find to a shop and every outfit to real finds', () => {
    for (const f of FINDS) expect(SHOP_BY_ID[f.shop], f.id).toBeDefined()
    for (const fit of FITS) for (const id of fit.findIds) expect(FIND_BY_ID[id], `${fit.id} → ${id}`).toBeDefined()
    for (const p of POSTS) expect(CLUB_BY_ID[p.club], p.id).toBeDefined()
  })

  it('puts every interest in a group and gives it adjacent interests that exist', () => {
    for (const v of VIBES) {
      expect(WORLDS.some((w) => w.id === v.world), v.id).toBe(true)
      for (const a of v.adjacent) expect(VIBE_BY_ID[a], `${v.id} → ${a}`).toBeDefined()
    }
    for (const c of COMBOS) for (const g of c.requires) for (const id of g) expect(VIBE_BY_ID[id], `${c.id} → ${id}`).toBeDefined()
  })

  it('gives every interest at least one product and three things to see', () => {
    for (const v of VIBES) {
      const items = CATALOG.filter((i) => (i.tags[v.id] ?? 0) >= 0.5)
      expect(items.filter((i) => i.type === 'find').length, `${v.label} products`).toBeGreaterThanOrEqual(1)
      expect(items.length, `${v.label} items`).toBeGreaterThanOrEqual(3)
    }
  })

  it('gives every interest a club', () => {
    for (const v of VIBES) expect(CLUBS.some((c) => (c.tags[v.id] ?? 0) >= 0.6), v.label).toBe(true)
  })

  it('gives every quote theme several quotes', () => {
    for (const t of QUOTE_THEMES) expect(QUOTES.filter((q) => q.theme === t.id).length, t.name).toBeGreaterThanOrEqual(5)
  })

  it('leads someone with a single interest to relevant things first', () => {
    const now = Date.now()
    for (const v of VIBES) {
      const profile = applyEvent(emptyProfile(now), { kind: 'seed', tags: { [v.id]: 1 } }, now).profile
      const batch = rankBatch({ catalog: CATALOG, profile, shownIds: new Set(), excludeIds: new Set(), size: 10, seed: 1, now })
      const relevant = batch.filter((r) => (r.item.tags[v.id] ?? 0) > 0)
      expect(relevant.length, v.label).toBeGreaterThanOrEqual(2)
    }
  })
})
