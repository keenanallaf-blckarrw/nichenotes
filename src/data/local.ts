import { distanceKm, mulberry32, offsetPoint, type LatLng } from '../engine'
import { CLUB_BY_ID } from './community'
import type { EventComment, EventItem, Place, PostItem } from './types'

/** Areas people can pick. The app only ever uses the center of an area, never a home address. */
export const PLACES: Place[] = [
  { id: 'detroit', name: 'Detroit', country: 'US', lat: 42.3314, lng: -83.0458 },
  { id: 'boston', name: 'Boston', country: 'US', lat: 42.3601, lng: -71.0589 },
  { id: 'new-york', name: 'New York', country: 'US', lat: 40.7128, lng: -74.006 },
  { id: 'chicago', name: 'Chicago', country: 'US', lat: 41.8781, lng: -87.6298 },
  { id: 'atlanta', name: 'Atlanta', country: 'US', lat: 33.749, lng: -84.388 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'US', lat: 34.0522, lng: -118.2437 },
  { id: 'toronto', name: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 },
  { id: 'mexico-city', name: 'Mexico City', country: 'MX', lat: 19.4326, lng: -99.1332 },
  { id: 'sao-paulo', name: 'São Paulo', country: 'BR', lat: -23.5505, lng: -46.6333 },
  { id: 'london', name: 'London', country: 'GB', lat: 51.5072, lng: -0.1276 },
  { id: 'paris', name: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522 },
  { id: 'berlin', name: 'Berlin', country: 'DE', lat: 52.52, lng: 13.405 },
  { id: 'lagos', name: 'Lagos', country: 'NG', lat: 6.5244, lng: 3.3792 },
  { id: 'nairobi', name: 'Nairobi', country: 'KE', lat: -1.2921, lng: 36.8219 },
  { id: 'cape-town', name: 'Cape Town', country: 'ZA', lat: -33.9249, lng: 18.4241 },
  { id: 'dubai', name: 'Dubai', country: 'AE', lat: 25.2048, lng: 55.2708 },
  { id: 'mumbai', name: 'Mumbai', country: 'IN', lat: 19.076, lng: 72.8777 },
  { id: 'singapore', name: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198 },
  { id: 'seoul', name: 'Seoul', country: 'KR', lat: 37.5665, lng: 126.978 },
  { id: 'tokyo', name: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503 },
  { id: 'sydney', name: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093 },
]

/** Countries that measure distance in miles. */
export const MILE_COUNTRIES = new Set(['US', 'GB', 'LR', 'MM'])

export function nearestPlace(p: LatLng, withinKm = 60): Place | undefined {
  let best: Place | undefined
  let bestKm = withinKm
  for (const place of PLACES) {
    const d = distanceKm(p, place)
    if (d < bestKm) {
      best = place
      bestKm = d
    }
  }
  return best
}

type VenueKind = 'courts' | 'field' | 'park' | 'cafe' | 'community' | 'trail' | 'library' | 'skatepark' | 'studio' | 'lot' | 'garden'

// Invented, generic names for public places. Real venues come from hosts in the live app.
const VENUES: Record<VenueKind, string[]> = {
  courts: ['Riverside Courts', 'Maple Park courts', 'Northside Rec courts', 'Harbor Park courts'],
  field: ['Maple Field', 'Eastside Park field', 'Greenway field', 'Hillcrest Park field'],
  park: ['Riverside Park', 'Central Green', 'Maple Street Park', 'Lakeshore Park'],
  cafe: ['The Corner Café', 'Common Grounds Coffee', 'Blue Door Coffee', 'Second Cup Café'],
  community: ['Harbor Community Center', 'Northside Rec Center', 'Westgate Community Hall'],
  trail: ['Lakeview Trailhead', 'Ridge Trail parking area', 'Riverwalk trailhead'],
  library: ['Main Library, meeting room B', 'Eastside Library community room'],
  skatepark: ['Westgate Skate Park', 'Riverside Skate Plaza'],
  studio: ['Open Floor Dance Studio', 'Movement Space Studio'],
  lot: ['Market Street parking lot', 'Old Mill parking lot'],
  garden: ['Eastside Community Garden', 'Maple Street Garden'],
}

interface EventTemplate {
  id: string
  club: string
  title: string
  venue: VenueKind
  /** 0 = Sunday … 6 = Saturday */
  day: number
  hour: number
  minute?: number
  capacity?: number
  detail: string
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  { id: 'hoops-sunday', club: 'hoops', title: 'Sunday morning pickup run', venue: 'courts', day: 0, hour: 9, capacity: 10, detail: 'Full-court 5-on-5, winners stay on. All levels welcome.' },
  { id: 'hoops-3v3', club: 'hoops', title: 'Beginner-friendly 3-on-3', venue: 'courts', day: 3, hour: 18, minute: 30, capacity: 12, detail: 'Half-court games, no pressure. Great if you are new or getting back into it.' },
  { id: 'soccer-weeknight', club: 'pickup-soccer', title: 'Weeknight pickup soccer', venue: 'field', day: 2, hour: 18, capacity: 14, detail: '7-a-side on grass. Bring a light and a dark shirt.' },
  { id: 'soccer-saturday', club: 'pickup-soccer', title: 'Saturday small-sided games', venue: 'field', day: 6, hour: 10, capacity: 16, detail: 'Short games, lots of touches, friendly pace.' },
  { id: 'jersey-swap', club: 'retro-jerseys', title: 'Retro jersey swap meet', venue: 'community', day: 6, hour: 13, detail: 'Bring jerseys to trade or sell. Tables are free.' },
  { id: 'watch-party', club: 'stadium-travel', title: 'Big game watch party', venue: 'cafe', day: 0, hour: 15, detail: 'Big screen, good food, fans of every team welcome.' },
  { id: 'flag-football', club: 'game-day', title: 'Flag football in the park', venue: 'field', day: 6, hour: 11, capacity: 14, detail: 'Teams of 7. Flags provided.' },
  { id: 'pickleball', club: 'racket-club', title: 'Pickleball drop-in', venue: 'courts', day: 4, hour: 18, capacity: 16, detail: 'Rotating doubles. Spare paddles available.' },
  { id: 'tennis-doubles', club: 'racket-club', title: 'Tennis doubles, all levels', venue: 'courts', day: 0, hour: 8, capacity: 8, detail: 'Mixed doubles, casual scoring.' },
  { id: 'twilight-nine', club: 'the-fairway', title: 'Twilight nine holes', venue: 'park', day: 5, hour: 17, capacity: 8, detail: 'Nine holes before sunset. Beginners paired with regulars.' },
  { id: 'group-ride', club: 'cycling', title: 'Saturday no-drop group ride', venue: 'cafe', day: 6, hour: 8, detail: '30 km (19 mi) at an easy pace. Nobody gets left behind.' },
  { id: 'park-yoga', club: 'yoga-pilates', title: 'Yoga in the park', venue: 'park', day: 0, hour: 10, detail: 'Gentle one-hour flow. Bring a mat or a towel.' },
  { id: 'open-practice', club: 'dance-floor', title: 'Open dance practice', venue: 'studio', day: 3, hour: 19, detail: 'Any style. Music on, mirrors up, no teacher.' },
  { id: 'skate-meetup', club: 'skate-surf', title: 'Skate park meetup', venue: 'skatepark', day: 6, hour: 16, detail: 'All ages and levels. Helmets encouraged.' },
  { id: 'run-coffee', club: 'run-and-brew', title: 'Saturday 5K, then coffee', venue: 'cafe', day: 6, hour: 7, minute: 30, detail: 'Easy pace, about 30 minutes, coffee after.' },
  { id: 'outdoor-workout', club: 'strength', title: 'Outdoor workout', venue: 'park', day: 1, hour: 7, detail: 'Bodyweight circuit. Scaled for every level.' },
  { id: 'book-meetup', club: 'book-club', title: 'Monthly book club meetup', venue: 'library', day: 4, hour: 19, detail: 'This month: short stories. Come even if you did not finish.' },
  { id: 'language-cafe', club: 'language-exchange', title: 'Language exchange café', venue: 'cafe', day: 2, hour: 19, detail: 'Tables for Spanish, French, Mandarin and English. Switch every 20 minutes.' },
  { id: 'game-night', club: 'tabletop', title: 'Board game night', venue: 'community', day: 5, hour: 19, detail: 'Over 30 games, easy ones to teach. Newcomers welcome.' },
  { id: 'retro-gaming', club: 'gamers', title: 'Retro gaming night', venue: 'community', day: 5, hour: 20, detail: 'Old consoles, couch co-op, tournaments for fun.' },
  { id: 'outdoor-movie', club: 'film-club', title: 'Outdoor movie night', venue: 'park', day: 6, hour: 20, detail: 'A classic on a big screen. Bring a blanket.' },
  { id: 'sketch-walk', club: 'artists', title: 'Sketch walk', venue: 'park', day: 0, hour: 14, detail: 'Draw what you see, then share sketches over coffee.' },
  { id: 'photo-walk', club: 'photography', title: 'Golden-hour photo walk', venue: 'park', day: 6, hour: 18, detail: 'Any camera, phones included.' },
  { id: 'repair-cafe', club: 'makers', title: 'Repair café', venue: 'community', day: 6, hour: 11, detail: 'Bring something broken. Volunteers help you fix it.' },
  { id: 'plant-swap', club: 'plant-parents', title: 'Plant swap', venue: 'garden', day: 0, hour: 11, detail: 'Bring cuttings, take cuttings. Pots welcome too.' },
  { id: 'dog-meetup', club: 'pet-people', title: 'Dog park meetup', venue: 'park', day: 6, hour: 9, detail: 'Friendly dogs and their people. Water bowls provided.' },
  { id: 'beginner-hike', club: 'outdoors', title: 'Beginner day hike', venue: 'trail', day: 0, hour: 8, detail: 'About 8 km (5 mi), easy pace, back by lunch.' },
  { id: 'potluck', club: 'home-cooks', title: 'Neighborhood potluck', venue: 'community', day: 0, hour: 17, detail: 'Bring a dish that means something to you.' },
  { id: 'bread-swap', club: 'bakers', title: 'Bread and bake swap', venue: 'cafe', day: 6, hour: 10, detail: 'Trade loaves, starters and tips.' },
  { id: 'meditation', club: 'mindfulness', title: 'Group meditation', venue: 'park', day: 3, hour: 7, detail: '20 minutes of guided sitting. Chairs available.' },
  { id: 'walk-talk', club: 'mental-health', title: 'Walk and talk', venue: 'park', day: 2, hour: 18, detail: 'A relaxed peer walk, not therapy. Share as much or as little as you like.' },
  { id: 'founders-coffee', club: 'founders', title: 'Founders coffee', venue: 'cafe', day: 3, hour: 8, detail: 'Bring what you are building and one question.' },
  { id: 'car-meet', club: 'car-club', title: 'Sunday morning car meet', venue: 'lot', day: 0, hour: 8, detail: 'All cars and bikes welcome. Coffee, no burnouts.' },
  { id: 'cleanup', club: 'low-waste', title: 'Park cleanup', venue: 'park', day: 6, hour: 9, detail: 'Gloves and bags provided. One hour, big difference.' },
  { id: 'campfire', club: 'campers', title: 'Campfire and s’mores night', venue: 'trail', day: 5, hour: 18, detail: 'An easy overnight for first-timers. Tents to borrow.' },
]

interface PostTemplate {
  club: string
  text: string
}

const LOCAL_POSTS: PostTemplate[] = [
  { club: 'hoops', text: 'Need two more for a 5-on-5 at {venue} this {day} morning. All levels welcome.' },
  { club: 'hoops', text: 'Are the lights at {venue} working again? Want to run tonight.' },
  { club: 'pickup-soccer', text: 'Pickup game at {venue} {day} at 6. We have a ball and cones, just bring water.' },
  { club: 'pickup-soccer', text: 'Looking for a regular weekend game nearby. Anyone have a group?' },
  { club: 'racket-club', text: 'Looking for a pickleball partner at {venue}, around beginner-intermediate level.' },
  { club: 'run-and-brew', text: 'New route this {day}: 5K along the water, coffee after. Easy pace.' },
  { club: 'cycling', text: 'Anyone commute through downtown in the mornings? Would love a riding buddy.' },
  { club: 'yoga-pilates', text: 'Free yoga at {venue} this {day}. Bring a mat or a towel.' },
  { club: 'book-club', text: 'Starting a small in-person book club. First meetup at {venue}.' },
  { club: 'tabletop', text: 'Game night at {venue} on {day}. We have 30 games and snacks.' },
  { club: 'pet-people', text: 'Morning dog walk crew at {venue}, 7 a.m. every day. Friendly dogs only!' },
  { club: 'photography', text: 'Photo walk this {day} at golden hour. Meet at {venue}.' },
  { club: 'plant-parents', text: 'Plant swap at {venue} on {day}. Bring cuttings, take cuttings.' },
  { club: 'language-exchange', text: 'Spanish and English exchange at {venue} every {day}. Come practice!' },
  { club: 'founders', text: 'Monthly founders coffee at {venue}. Bring what you are working on.' },
  { club: 'car-club', text: 'Sunday car meet at {venue}. All cars welcome, keep it respectful.' },
  { club: 'game-day', text: 'Flag football {day} at {venue}. Need a few more for teams of 7.' },
  { club: 'strength', text: 'Outdoor workout at {venue} {day} morning. Bodyweight only, all levels.' },
  { club: 'outdoors', text: 'Beginner hike this {day}. About 8 km (5 mi), easy pace. Who is in?' },
  { club: 'low-waste', text: 'Cleanup at {venue} this {day}. Gloves and bags provided.' },
  { club: 'dance-floor', text: 'Anyone want to practice together? I booked a room at {venue} for {day}.' },
  { club: 'artists', text: 'Sketching at {venue} on {day} afternoon if anyone wants to join.' },
]

const HANDLES = ['sam_k', 'jo_plays', 'ade_runs', 'mira_m', 'leo_v', 'nia_b', 'tomi_o', 'rin_h', 'kai_s', 'dev_p', 'ana_g', 'yusuf_a', 'lena_w', 'chris_t', 'priya_n', 'mateo_r']

const COMMENTS = [
  'I can bring a ball.',
  'Is it beginner friendly?',
  'Yes, all levels. Just come.',
  'Running 10 minutes late, save me a spot!',
  'Is there parking nearby?',
  'First time coming. See you there.',
  'Great group, highly recommend.',
  'I will bring water for everyone.',
  'Can I bring a friend?',
  'Of course, the more the merrier.',
]

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function nextOccurrence(now: number, day: number, hour: number, minute = 0): number {
  const d = new Date(now)
  d.setHours(hour, minute, 0, 0)
  let add = (day - d.getDay() + 7) % 7
  if (add === 0 && d.getTime() <= now) add = 7
  d.setDate(d.getDate() + add)
  return d.getTime()
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Mostly nearby, some further out, so the radius setting visibly matters. */
function spread(rand: () => number): number {
  return rand() < 0.65 ? 0.6 + rand() * 11 : 12 + rand() * 25
}

export interface LocalContent {
  events: EventItem[]
  posts: PostItem[]
}

/**
 * Sample local content around a center point. Deterministic for a given area,
 * so the same city always shows the same games. In the live app this comes
 * from real people hosting and posting.
 */
export function generateLocal(center: LatLng, area: string, now: number): LocalContent {
  const key = `${center.lat.toFixed(2)},${center.lng.toFixed(2)}`
  const events = EVENT_TEMPLATES.map((t) => {
    const rand = mulberry32(hashString(`${key}:${t.id}`))
    const kind = VENUES[t.venue]
    const club = CLUB_BY_ID[t.club]
    const going = t.capacity ? 2 + Math.floor(rand() * (t.capacity - 2)) : 4 + Math.floor(rand() * 26)
    const item: EventItem = {
      id: `ev-${key}-${t.id}`,
      type: 'event',
      title: t.title,
      club: t.club,
      venue: kind[Math.floor(rand() * kind.length)],
      at: offsetPoint(center, spread(rand), rand() * 360),
      area,
      startsAt: nextOccurrence(now, t.day, t.hour, t.minute),
      going,
      capacity: t.capacity,
      detail: t.detail,
      host: HANDLES[Math.floor(rand() * HANDLES.length)],
      tags: club.tags,
      source: t.club,
      createdAt: now - Math.floor(rand() * 3 * 86_400_000),
      popularity: Math.min(1, going / 20),
    }
    return item
  })

  const posts = LOCAL_POSTS.map((t, i) => {
    const rand = mulberry32(hashString(`${key}:post:${i}`))
    const club = CLUB_BY_ID[t.club]
    const venues = Object.values(VENUES).flat()
    const text = t.text.replace('{venue}', venues[Math.floor(rand() * venues.length)]).replace('{day}', DAY_NAMES[Math.floor(rand() * 7)])
    const likes = 3 + Math.floor(rand() * 60)
    const post: PostItem = {
      id: `lp-${key}-${i}`,
      type: 'post',
      author: HANDLES[Math.floor(rand() * HANDLES.length)],
      club: t.club,
      text,
      likes,
      replies: Math.floor(rand() * 18),
      near: { ...offsetPoint(center, spread(rand), rand() * 360), label: area },
      tags: club.tags,
      source: t.club,
      createdAt: now - Math.floor(rand() * 40) * 3_600_000,
      popularity: Math.min(1, likes / 80),
    }
    return post
  })

  return { events, posts }
}

/** A couple of sample replies so a new event's discussion is not empty. */
export function sampleComments(eventId: string, startsAt: number): EventComment[] {
  const rand = mulberry32(hashString(eventId))
  const n = 1 + Math.floor(rand() * 3)
  const start = Math.floor(rand() * COMMENTS.length)
  return Array.from({ length: n }, (_, i) => ({
    id: `${eventId}-c${i}`,
    author: HANDLES[Math.floor(rand() * HANDLES.length)],
    text: COMMENTS[(start + i * 2) % COMMENTS.length],
    at: Math.min(Date.now(), startsAt) - (n - i) * 3 * 3_600_000,
  }))
}
