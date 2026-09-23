import type { CatalogItem } from '../engine'

export type MentorId = 'caesar' | 'marcus' | 'musashi' | 'cruyff' | 'bruce' | 'jobs'

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

export type ShirtPattern = 'plain' | 'bands' | 'stripes' | 'pinstripe' | 'sash' | 'halves' | 'chevron'

export interface ArtSpec {
  kind: ArtKind
  /** [light accent, main object color, detail color] */
  colors: [string, string, string]
  pattern?: ShirtPattern
  /** Short text printed on the object (a jersey number, a label). */
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
}

export interface RitualItem extends CatalogItem {
  type: 'ritual'
  title: string
  detail: string
  minutes: number
}

export type AnyItem = QuoteItem | FindItem | FitItem | PostItem | RitualItem

export interface Club {
  id: string
  name: string
  blurb: string
  tags: Record<string, number>
  members: number
}
