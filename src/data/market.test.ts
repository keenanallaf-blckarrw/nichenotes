import { describe, expect, it } from 'vitest'
import { COMBOS, VIBES, applyEvent, emptyProfile } from '../engine'
import { HUNTS, MAX_PRICE, ebayUrl, etsyUrl, huntsForProfile } from './market'

describe('Etsy and eBay hunts', () => {
  it('has searches for every interest and every combo', () => {
    for (const v of [...VIBES, ...COMBOS]) expect(HUNTS[v.id]?.length ?? 0, v.label).toBeGreaterThanOrEqual(2)
  })

  it('caps prices in every search link', () => {
    expect(etsyUrl('wool cap')).toBe(`https://www.etsy.com/search?q=wool%20cap&max=${MAX_PRICE}`)
    expect(ebayUrl('wool & cap')).toBe(`https://www.ebay.com/sch/i.html?_nkw=wool%20%26%20cap&_udhi=${MAX_PRICE}`)
  })

  it('follows the person’s taste, niches first, and skips hidden interests', () => {
    const now = Date.now()
    let p = applyEvent(emptyProfile(now), { kind: 'seed', tags: { soccer: 1, vintage: 1, skincare: 1 } }, now).profile
    p = applyEvent(p, { kind: 'mute', tags: { skincare: 1 } }, now).profile
    const hunts = huntsForProfile(p, 0)
    expect(hunts[0].vibe).toBe('retrojerseys')
    expect(hunts.map((h) => h.vibe)).toEqual(expect.arrayContaining(['soccer', 'vintage']))
    expect(hunts.some((h) => h.vibe === 'skincare')).toBe(false)
  })

  it('rotates searches from day to day', () => {
    const now = Date.now()
    const p = applyEvent(emptyProfile(now), { kind: 'seed', tags: { baseball: 1 } }, now).profile
    expect(huntsForProfile(p, 0)[0].query).not.toBe(huntsForProfile(p, 1)[0].query)
  })
})
