import type { CatalogItem, LatLng } from '../engine'

export type QuoteTheme = 'philosophers' | 'athletes' | 'creators' | 'founders' | 'leaders' | 'mindful'

export interface QuoteItem extends CatalogItem {
  type: 'quote'
  text: string
  /** English rendering when the original is Latin/Greek. */
  translation?: string
  author: string
  /** Where it's from — work and passage when known. */
  source: string
  /** Morning-quote theme people can choose during onboarding. */
  theme: QuoteTheme
  /** Popularly credited but not traceable to the person's own words. */
  attributed?: boolean
}

export type ArtKind =
  | 'shirt'
  | 'jacket'
  | 'scarf'
  | 'sneaker'
  | 'bag'
  | 'chain'
  | 'ring'
  | 'watch'
  | 'cap'
  | 'glasses'
  | 'bottle'
  | 'tube'
  | 'jar'
  | 'book'
  | 'record'
  | 'mug'
  | 'shorts'
  | 'pants'
  | 'dress'
  | 'hoodie'
  | 'beanie'
  | 'glove'
  | 'pen'
  | 'skirt'
  | 'paddle'
  | 'pan'
  | 'belt'
  | 'ball'
  | 'racket'
  | 'mat'
  | 'block'
  | 'speaker'
  | 'skateboard'
  | 'comb'
  | 'cushion'
  | 'wallet'
  | 'palette'
  | 'camera'
  | 'keyboard'
  | 'headphones'
  | 'gamepad'
  | 'dice'
  | 'frame'
  | 'vase'
  | 'plant'
  | 'candle'
  | 'lamp'
  | 'lantern'
  | 'bowl'

export type ShirtPattern = 'plain' | 'bands' | 'stripes' | 'pinstripe' | 'sash' | 'halves' | 'chevron'

export interface ArtSpec {
  kind: ArtKind
  /** [light accent, main object color, detail color] */
  colors: [string, string, string]
  pattern?: ShirtPattern
  /** Which ball to draw for kind 'ball'. */
  variant?: 'basketball' | 'football' | 'soccer' | 'tennis' | 'golf' | 'yarn'
  /** Short text printed on the object (a jersey number, a label). */
  mark?: string
}

export interface Shop {
  id: string
  name: string
  blurb: string
  /** Where the brand is based. Left out when the brand doesn't say. */
  location?: string
  url: string
}

export interface FindItem extends CatalogItem {
  type: 'find'
  name: string
  shop: string
  price: number
  /** The price is the lowest of several sizes or options. */
  priceFrom?: boolean
  /** A US-dollar estimate: the shop prices in another currency. */
  approx?: boolean
  /** What the shop charges in its own currency, when it isn't US dollars. The link checker compares against this. */
  shopPrice?: { amount: number; currency: string }
  /** The product's own page at the shop. */
  url?: string
  /** What to search Etsy and eBay for to find more like this. */
  hunt?: string
  blurb: string
  art: ArtSpec
}

export interface FitItem extends CatalogItem {
  type: 'fit'
  name: string
  blurb: string
  findIds: string[]
  /** An outfit is something you wear; a set is a group of things you use. */
  label: 'Outfit' | 'Set'
}

export interface PostItem extends CatalogItem {
  type: 'post'
  author: string
  club: string
  text: string
  likes: number
  replies: number
  mine?: boolean
  /** Set for local posts. Always an approximate point, never someone's exact location. */
  near?: LatLng & { label: string }
}

export interface RitualItem extends CatalogItem {
  type: 'ritual'
  title: string
  detail: string
  minutes: number
}

/** A meetup in the real world: a pickup game, a photo walk, a book club. */
export interface EventItem extends CatalogItem {
  type: 'event'
  title: string
  club: string
  /** A public place: a park, courts, a café, a library. */
  venue: string
  at: LatLng
  /** Name of the area, e.g. "Detroit". */
  area: string
  startsAt: number
  going: number
  /** Spots in total, when it matters (a 5-on-5 needs 10). */
  capacity?: number
  detail: string
  host: string
  mine?: boolean
}

export interface EventComment {
  id: string
  author: string
  text: string
  at: number
  mine?: boolean
}

export type AnyItem = QuoteItem | FindItem | FitItem | PostItem | RitualItem | EventItem

export interface Club {
  id: string
  name: string
  blurb: string
  tags: Record<string, number>
  members: number
}

/** A place people can choose as the center of their area. */
export interface Place extends LatLng {
  id: string
  name: string
  country: string
}
