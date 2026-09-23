import { describe, expect, it } from 'vitest'
import { distanceKm } from '../engine'
import { CLUB_BY_ID } from './community'
import { EVENT_TEMPLATES, PLACES, generateLocal, nearestPlace, sampleComments } from './local'

const NOW = new Date('2026-09-23T12:00:00').getTime()

describe('local content', () => {
  it('only uses real clubs', () => {
    for (const t of EVENT_TEMPLATES) expect(CLUB_BY_ID[t.club], t.id).toBeDefined()
  })

  it('is the same every time for the same area', () => {
    const a = generateLocal(PLACES[0], PLACES[0].name, NOW)
    const b = generateLocal(PLACES[0], PLACES[0].name, NOW)
    expect(a.events.map((e) => [e.id, e.venue, e.at.lat])).toEqual(b.events.map((e) => [e.id, e.venue, e.at.lat]))
  })

  it('differs between cities', () => {
    const a = generateLocal(PLACES[0], 'A', NOW).events.map((e) => e.venue).join()
    const b = generateLocal(PLACES[1], 'B', NOW).events.map((e) => e.venue).join()
    expect(a).not.toBe(b)
  })

  it('schedules every event in the coming week', () => {
    for (const e of generateLocal(PLACES[3], 'X', NOW).events) {
      expect(e.startsAt).toBeGreaterThan(NOW)
      expect(e.startsAt - NOW).toBeLessThanOrEqual(7 * 86_400_000)
    }
  })

  it('spreads events so the radius matters: most within 12 km, some further out', () => {
    const { events } = generateLocal(PLACES[5], 'X', NOW)
    const d = events.map((e) => distanceKm(PLACES[5], e.at))
    expect(Math.max(...d)).toBeLessThan(40)
    expect(d.filter((x) => x <= 12).length).toBeGreaterThan(events.length / 3)
    expect(d.some((x) => x > 12)).toBe(true)
  })

  it('never lets an event claim more people than it has room for', () => {
    for (const p of PLACES) for (const e of generateLocal(p, p.name, NOW).events) if (e.capacity) expect(e.going).toBeLessThan(e.capacity)
  })

  it('fills in local posts with no placeholders left', () => {
    for (const p of generateLocal(PLACES[8], 'X', NOW).posts) {
      expect(p.text).not.toMatch(/[{}]/)
      expect(p.near).toBeDefined()
    }
  })

  it('snaps a position to the nearest city, or none if far away', () => {
    expect(nearestPlace({ lat: 42.43, lng: -83.48 })?.id).toBe('detroit')
    expect(nearestPlace({ lat: 0, lng: -150 })).toBeUndefined()
  })

  it('gives every event a small starter discussion', () => {
    const c = sampleComments('ev-x', NOW)
    expect(c.length).toBeGreaterThan(0)
    expect(sampleComments('ev-x', NOW)).toEqual(c)
  })
})
