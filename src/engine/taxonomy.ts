import type { VibeId } from './types'

export type WorldId = 'sport' | 'threads' | 'selfcare' | 'mind' | 'taste' | 'outside'

export interface World {
  id: WorldId
  label: string
  blurb: string
}

export interface Vibe {
  id: VibeId
  label: string
  world: WorldId
  blurb: string
  /** Neighboring vibes. Exploration tries these first ("you like X, try Y"). */
  adjacent: VibeId[]
}

/**
 * A combo is a niche that only exists where two interests overlap:
 * soccer + vintage = retro jerseys. Combos are never picked directly;
 * they unlock once both halves are strong enough.
 */
export interface Combo {
  id: VibeId
  label: string
  /** Each inner list is "any of"; every group must be satisfied. */
  requires: VibeId[][]
  blurb: string
}

export const WORLDS: World[] = [
  { id: 'sport', label: 'Sports', blurb: 'The games you play and watch.' },
  { id: 'threads', label: 'Style', blurb: 'What you wear every day.' },
  { id: 'selfcare', label: 'Self-Care', blurb: 'Skin, scent and sleep.' },
  { id: 'mind', label: 'Mind', blurb: 'Discipline, philosophy, books.' },
  { id: 'taste', label: 'Taste', blurb: 'Coffee, cooking, records.' },
  { id: 'outside', label: 'Outdoors', blurb: 'Hikes, trips, new places.' },
]

export const VIBES: Vibe[] = [
  { id: 'soccer', label: 'Soccer', world: 'sport', blurb: 'Game days, pickup games, retro jerseys.', adjacent: ['running', 'vintage', 'travel'] },
  { id: 'combat', label: 'Combat Sports', world: 'sport', blurb: 'Boxing, Muay Thai, jiu-jitsu.', adjacent: ['lifting', 'discipline', 'recovery'] },
  { id: 'running', label: 'Running', world: 'sport', blurb: 'Early miles and the coffee after.', adjacent: ['coffee', 'recovery', 'trail'] },
  { id: 'lifting', label: 'Lifting', world: 'sport', blurb: 'Barbells, belts, chalk.', adjacent: ['discipline', 'recovery', 'combat'] },

  { id: 'streetwear', label: 'Streetwear', world: 'threads', blurb: 'Heavy tees, relaxed fits, small runs.', adjacent: ['sneakers', 'accessories', 'vintage'] },
  { id: 'vintage', label: 'Vintage', world: 'threads', blurb: 'Deadstock, workwear, things with a past.', adjacent: ['streetwear', 'watches', 'vinyl'] },
  { id: 'tailoring', label: 'Tailoring', world: 'threads', blurb: 'Linen, knit ties, a good overshirt.', adjacent: ['watches', 'accessories', 'fragrance'] },
  { id: 'sneakers', label: 'Sneakers', world: 'threads', blurb: 'Gum soles, suede, small-batch releases.', adjacent: ['streetwear', 'running'] },
  { id: 'accessories', label: 'Accessories', world: 'threads', blurb: 'Chains, rings, caps, bags.', adjacent: ['watches', 'streetwear'] },
  { id: 'watches', label: 'Watches', world: 'threads', blurb: 'Independent brands, field watches, straps.', adjacent: ['accessories', 'tailoring', 'vintage'] },

  { id: 'skincare', label: 'Skincare', world: 'selfcare', blurb: 'Small-batch oils, mineral sunscreen, short ingredient lists.', adjacent: ['grooming', 'recovery', 'fragrance'] },
  { id: 'grooming', label: 'Grooming', world: 'selfcare', blurb: 'Safety razors, hair clay, beard care.', adjacent: ['skincare', 'fragrance'] },
  { id: 'fragrance', label: 'Fragrance', world: 'selfcare', blurb: 'Independent perfumers and solid colognes.', adjacent: ['grooming', 'tailoring', 'skincare'] },
  { id: 'recovery', label: 'Recovery', world: 'selfcare', blurb: 'Sleep, sauna, cold plunge.', adjacent: ['discipline', 'lifting', 'skincare'] },

  { id: 'stoicism', label: 'Stoicism', world: 'mind', blurb: 'Marcus Aurelius, Seneca, Epictetus.', adjacent: ['discipline', 'reading'] },
  { id: 'discipline', label: 'Discipline', world: 'mind', blurb: 'Mornings, habits, focus.', adjacent: ['stoicism', 'lifting', 'recovery'] },
  { id: 'reading', label: 'Reading', world: 'mind', blurb: 'Twenty pages a night.', adjacent: ['stoicism', 'vinyl', 'coffee'] },

  { id: 'coffee', label: 'Coffee', world: 'taste', blurb: 'Small roasters and hand grinders.', adjacent: ['running', 'reading', 'cooking'] },
  { id: 'cooking', label: 'Cooking', world: 'taste', blurb: 'Carbon steel pans, chili crisp, cooking for friends.', adjacent: ['coffee', 'travel'] },
  { id: 'vinyl', label: 'Vinyl & Audio', world: 'taste', blurb: 'Reissues, record stores, good speakers.', adjacent: ['vintage', 'reading'] },

  { id: 'trail', label: 'Hiking', world: 'outside', blurb: 'Merino, daypacks, miles outside.', adjacent: ['running', 'travel', 'streetwear'] },
  { id: 'travel', label: 'Travel', world: 'outside', blurb: 'Carry-on only, new cities, road trips.', adjacent: ['trail', 'soccer', 'cooking'] },
]

export const COMBOS: Combo[] = [
  { id: 'retrojerseys', label: 'Retro Jerseys', requires: [['soccer'], ['vintage', 'streetwear']], blurb: 'Classic soccer jerseys worn as everyday style.' },
  { id: 'stadiumtravel', label: 'Stadium Travel', requires: [['soccer'], ['travel']], blurb: 'Seeing a game in every city you visit.' },
  { id: 'outdoorstyle', label: 'Outdoor Style', requires: [['trail'], ['streetwear', 'travel']], blurb: 'Hiking gear that looks good in the city.' },
  { id: 'apothecary', label: 'Apothecary', requires: [['skincare', 'grooming'], ['fragrance', 'recovery']], blurb: 'Self-care made by hand, in small batches.' },
  { id: 'stoicathlete', label: 'Stoic Athlete', requires: [['stoicism', 'discipline'], ['lifting', 'running', 'combat']], blurb: 'A calm mind and a strong body.' },
  { id: 'monkmode', label: 'Monk Mode', requires: [['discipline'], ['recovery', 'stoicism']], blurb: 'Phone down, early nights, deep focus.' },
  { id: 'analog', label: 'Analog Hours', requires: [['vinyl', 'reading'], ['coffee', 'vintage']], blurb: 'Records, books, slow coffee. Screens off.' },
  { id: 'heirloom', label: 'Buy It for Life', requires: [['watches', 'tailoring'], ['vintage', 'accessories']], blurb: 'Things made to last, and to pass down.' },
  { id: 'runbrew', label: 'Run & Brew', requires: [['running'], ['coffee']], blurb: 'Run clubs that end at a small coffee shop.' },
]

export const VIBE_BY_ID: Record<VibeId, Vibe> = Object.fromEntries(VIBES.map((v) => [v.id, v]))
export const COMBO_BY_ID: Record<VibeId, Combo> = Object.fromEntries(COMBOS.map((c) => [c.id, c]))

export function isCombo(id: VibeId): boolean {
  return id in COMBO_BY_ID
}

export function labelOf(id: VibeId): string {
  return VIBE_BY_ID[id]?.label ?? COMBO_BY_ID[id]?.label ?? id
}

/** "Soccer + Vintage": the halves the user actually has, strongest first. */
export function comboRecipe(combo: Combo, eff: Record<VibeId, number>): string {
  return combo.requires
    .map((group) => group.reduce((best, id) => ((eff[id] ?? 0) > (eff[best] ?? 0) ? id : best), group[0]))
    .map(labelOf)
    .join(' + ')
}
