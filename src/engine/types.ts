export type VibeId = string
export type ItemType = 'quote' | 'find' | 'fit' | 'post' | 'ritual'

/** Tag weights in 0..1 describing what an item is about. Keys are vibe or combo ids. */
export type Tags = Record<VibeId, number>

export interface CatalogItem {
  id: string
  type: ItemType
  tags: Tags
  /** Epoch ms. Newer items get a small freshness bump. */
  createdAt: number
  /** 0..1 global popularity across all users (seeded for the prototype). */
  popularity: number
  /** Paid partner placement. Only ever shown when it matches the viewer. */
  sponsored?: boolean
  /** Items from the same source (shop, crew) are spaced apart in the feed. */
  source?: string
}

export type EventKind =
  | 'seed'
  | 'view'
  | 'open'
  | 'like'
  | 'unlike'
  | 'save'
  | 'unsave'
  | 'shop'
  | 'share'
  | 'hide'
  | 'ritual_done'
  | 'ritual_skip'
  | 'post'
  | 'search'
  | 'follow'
  | 'mute'

export interface VibeEvent {
  kind: EventKind
  tags: Tags
  itemType?: ItemType
  /** Multiplier on the default event weight (onboarding seeds use this). */
  strength?: number
}

export interface Profile {
  /** Raw learned scores per vibe. Unbounded; read through `norm()`. */
  affinity: Record<VibeId, number>
  /** Learned preference for kinds of content (more quotes vs more finds...). */
  typeAffinity: Partial<Record<ItemType, number>>
  /** How much of each vibe the user has been shown; drives exploration. */
  exposure: Record<VibeId, number>
  /** Combo vibes the user has unlocked, in unlock order. */
  unlocked: VibeId[]
  muted: VibeId[]
  /** Normalized affinity at the start of the session, for "rising" / "cooling" trends. */
  snapshot: Record<VibeId, number>
  updatedAt: number
  eventCount: number
}

export type ReasonKind = 'match' | 'combo' | 'explore' | 'partner' | 'popular' | 'similar'

export interface Reason {
  kind: ReasonKind
  /** Vibes that drove the pick, strongest first. */
  tags: VibeId[]
  combo?: VibeId
  /** For `similar`: the item that triggered it. */
  anchorId?: string
}

export interface Ranked<T extends CatalogItem = CatalogItem> {
  item: T
  score: number
  reason: Reason
}
