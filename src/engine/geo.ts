/** Minimal geography helpers. Pure functions, no browser APIs. */

export interface LatLng {
  lat: number
  lng: number
}

export type DistanceUnit = 'mi' | 'km'

const EARTH_KM = 6371
const KM_PER_MI = 1.609344
const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

/** Great-circle distance in kilometers. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** The point `km` away from `from` in direction `bearingDeg` (0 = north). */
export function offsetPoint(from: LatLng, km: number, bearingDeg: number): LatLng {
  const d = km / EARTH_KM
  const b = rad(bearingDeg)
  const lat1 = rad(from.lat)
  const lng1 = rad(from.lng)
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b))
  const lng2 = lng1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2))
  return { lat: deg(lat2), lng: ((deg(lng2) + 540) % 360) - 180 }
}

/** Compass bearing from a to b in degrees, 0 = north. */
export function bearing(a: LatLng, b: LatLng): number {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat))
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng))
  return (deg(Math.atan2(y, x)) + 360) % 360
}

export function toUnit(km: number, unit: DistanceUnit): number {
  return unit === 'mi' ? km / KM_PER_MI : km
}

export function fromUnit(value: number, unit: DistanceUnit): number {
  return unit === 'mi' ? value * KM_PER_MI : value
}

/**
 * "0.8 mi" / "12 km". Rounded so nobody's exact spot can be worked out from it:
 * to the nearest half unit below 10, whole units above.
 */
export function formatDistance(km: number, unit: DistanceUnit): string {
  const v = toUnit(km, unit)
  if (v < 0.5) return `less than 0.5 ${unit}`
  const rounded = v < 10 ? Math.round(v * 2) / 2 : Math.round(v)
  return `${rounded} ${unit}`
}

/** Round a position to about 1 km so stored locations are never exact. */
export function approximate(p: LatLng): LatLng {
  return { lat: Math.round(p.lat * 100) / 100, lng: Math.round(p.lng * 100) / 100 }
}
