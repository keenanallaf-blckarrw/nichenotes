import { describe, expect, it } from 'vitest'
import { approximate, bearing, distanceKm, formatDistance, fromUnit, offsetPoint, toUnit } from './geo'

const DETROIT = { lat: 42.3314, lng: -83.0458 }
const CHICAGO = { lat: 41.8781, lng: -87.6298 }

describe('geo', () => {
  it('measures real distances', () => {
    expect(distanceKm(DETROIT, CHICAGO)).toBeGreaterThan(375)
    expect(distanceKm(DETROIT, CHICAGO)).toBeLessThan(390)
    expect(distanceKm(DETROIT, DETROIT)).toBe(0)
  })

  it('offsets a point by the distance and direction asked for', () => {
    for (const [km, dir] of [
      [1, 0],
      [5, 90],
      [12.5, 200],
      [30, 315],
    ]) {
      const p = offsetPoint(DETROIT, km, dir)
      expect(distanceKm(DETROIT, p)).toBeCloseTo(km, 3)
      expect(Math.abs(((bearing(DETROIT, p) - dir + 540) % 360) - 180)).toBeLessThan(0.5)
    }
  })

  it('converts units both ways', () => {
    expect(toUnit(fromUnit(10, 'mi'), 'mi')).toBeCloseTo(10)
    expect(toUnit(16.09344, 'mi')).toBeCloseTo(10)
    expect(toUnit(5, 'km')).toBe(5)
  })

  it('rounds displayed distances so exact spots cannot be worked out', () => {
    expect(formatDistance(0.3, 'km')).toBe('less than 0.5 km')
    expect(formatDistance(1.26, 'km')).toBe('1.5 km')
    expect(formatDistance(13.4, 'km')).toBe('13 km')
    expect(formatDistance(3.2, 'mi')).toBe('2 mi')
  })

  it('stores only an approximate position', () => {
    expect(approximate({ lat: 42.331429, lng: -83.045753 })).toEqual({ lat: 42.33, lng: -83.05 })
  })
})
