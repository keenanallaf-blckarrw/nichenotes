import type { CatalogItem } from '../engine'

export type MentorId = 'caesar' | 'marcus' | 'musashi' | 'cruyff' | 'bruce'

export interface QuoteItem extends CatalogItem {
  type: 'quote'
  text: string
  /** English rendering when the original is Latin/Greek. */
  translation?: string
  author: string
  /** Where it's from — work and passage when known. */
  source: string
  mentor?: MentorId
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
  | 'pan'
  | 'belt'

export type ShirtPattern = 'plain' | 'hoops' | 'stripes' | 'pinstripe' | 'sash' | 'halves' | 'chevron'

export interface ArtSpec {
  kind: ArtKind
  /** [tile background, main object colour, detail colour] */
  colors: [string, string, string]
  pattern?: ShirtPattern
  /** Short text printed on the object (a shirt number, a label). */
  mark?: string
}

export interface Shop {
  id: string
  name: string
  blurb: string
  location: string
  url: string
}

export interface FindItem extends CatalogItem {
  type: 'find'
  /** Catalog number shown as N° 0142. */
  no: number
  name: string
  shop: string
  price: number
  blurb: string
  art: ArtSpec
}

export interface FitItem extends CatalogItem {
  type: 'fit'
  name: string
  blurb: string
  findIds: string[]
  /** A fit is something you wear; a kit is a set of things you use. */
  label: 'Fit' | 'Kit'
}

export interface PostItem extends CatalogItem {
  type: 'post'
  author: string
  crew: string
  text: string
  likes: number
  replies: number
  mine?: boolean
}

export interface RitualItem extends CatalogItem {
  type: 'ritual'
  title: string
  detail: string
  minutes: number
}

export type AnyItem = QuoteItem | FindItem | FitItem | PostItem | RitualItem

export interface Crew {
  id: string
  name: string
  blurb: string
  tags: Record<string, number>
  members: number
}
