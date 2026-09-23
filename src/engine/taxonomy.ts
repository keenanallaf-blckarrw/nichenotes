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
  /** Neighbouring vibes. Exploration tries these first ("you like X, try Y"). */
  adjacent: VibeId[]
}

/**
 * A combo is a subculture that only exists where two interests overlap:
 * football + vintage = blokecore (retro kits). Combos are never picked
 * directly; they light up once both halves are strong enough.
 */
export interface Combo {
  id: VibeId
  label: string
  /** Each inner list is "any of"; every group must be satisfied. */
  requires: VibeId[][]
  blurb: string
}

export const WORLDS: World[] = [
  { id: 'sport', label: 'Pitch & Ring', blurb: 'The games you play and watch.' },
  { id: 'threads', label: 'Threads', blurb: 'Fits, kits and the stuff you wear every day.' },
  { id: 'selfcare', label: 'Self-Care', blurb: 'Skin, scent, sleep. The unknown stuff that works.' },
  { id: 'mind', label: 'Mind', blurb: 'Discipline, stoicism, pages turned.' },
  { id: 'taste', label: 'Taste', blurb: 'Coffee, kitchen, records.' },
  { id: 'outside', label: 'Outside', blurb: 'Trails, trips, away days.' },
]

export const VIBES: Vibe[] = [
  { id: 'soccer', label: 'Football', world: 'sport', blurb: 'Matchdays, Sunday league, the beautiful game.', adjacent: ['running', 'vintage', 'travel'] },
  { id: 'combat', label: 'Fight Game', world: 'sport', blurb: 'Boxing, Muay Thai, BJJ, the discipline of the ring.', adjacent: ['lifting', 'discipline', 'recovery'] },
  { id: 'running', label: 'Run Club', world: 'sport', blurb: 'Early miles and the coffee after.', adjacent: ['coffee', 'recovery', 'trail'] },
  { id: 'lifting', label: 'Iron', world: 'sport', blurb: 'Barbells, belts, chalk.', adjacent: ['discipline', 'recovery', 'combat'] },

  { id: 'streetwear', label: 'Streetwear', world: 'threads', blurb: 'Heavy tees, boxy fits, limited runs.', adjacent: ['sneakers', 'accessories', 'vintage'] },
  { id: 'vintage', label: 'Vintage', world: 'threads', blurb: 'Deadstock, workwear, things with a past.', adjacent: ['streetwear', 'watches', 'vinyl'] },
  { id: 'tailoring', label: 'Tailoring', world: 'threads', blurb: 'Linen, knit ties, a proper overshirt.', adjacent: ['watches', 'accessories', 'fragrance'] },
  { id: 'sneakers', label: 'Sneakers', world: 'threads', blurb: 'Gum soles, suede, small-run collabs.', adjacent: ['streetwear', 'running'] },
  { id: 'accessories', label: 'Accessories', world: 'threads', blurb: 'Chains, signets, caps, the finishing touch.', adjacent: ['watches', 'streetwear'] },
  { id: 'watches', label: 'Watches', world: 'threads', blurb: 'Micro-brands, field watches, straps.', adjacent: ['accessories', 'tailoring', 'vintage'] },

  { id: 'skincare', label: 'Skincare', world: 'selfcare', blurb: 'Small-batch oils, mineral SPF, 3-ingredient formulas.', adjacent: ['grooming', 'recovery', 'fragrance'] },
  { id: 'grooming', label: 'Grooming', world: 'selfcare', blurb: 'Safety razors, clay pomade, beard care.', adjacent: ['skincare', 'fragrance'] },
  { id: 'fragrance', label: 'Fragrance', world: 'selfcare', blurb: 'Indie perfumers, solid colognes, signature scents.', adjacent: ['grooming', 'tailoring', 'skincare'] },
  { id: 'recovery', label: 'Recovery', world: 'selfcare', blurb: 'Sleep, sauna, cold plunge.', adjacent: ['discipline', 'lifting', 'skincare'] },

  { id: 'stoicism', label: 'Stoicism', world: 'mind', blurb: 'Marcus, Seneca, Epictetus. Control what you can.', adjacent: ['discipline', 'reading'] },
  { id: 'discipline', label: 'Discipline', world: 'mind', blurb: 'Mornings, habits, monk mode.', adjacent: ['stoicism', 'lifting', 'recovery'] },
  { id: 'reading', label: 'Reading', world: 'mind', blurb: '20 pages a night.', adjacent: ['stoicism', 'vinyl', 'coffee'] },

  { id: 'coffee', label: 'Coffee', world: 'taste', blurb: 'Natural process, hand grinders, tiny roasters.', adjacent: ['running', 'reading', 'cooking'] },
  { id: 'cooking', label: 'Kitchen', world: 'taste', blurb: 'Carbon steel, chili crisp, cooking for people.', adjacent: ['coffee', 'travel'] },
  { id: 'vinyl', label: 'Vinyl & Audio', world: 'taste', blurb: 'Reissues, crate digging, a good pair of speakers.', adjacent: ['vintage', 'reading'] },

  { id: 'trail', label: 'Trail', world: 'outside', blurb: 'Merino, daypacks, miles outside.', adjacent: ['running', 'travel', 'streetwear'] },
  { id: 'travel', label: 'Travel', world: 'outside', blurb: 'Carry-on only, away days, new cities.', adjacent: ['trail', 'soccer', 'cooking'] },
]

export const COMBOS: Combo[] = [
  { id: 'blokecore', label: 'Blokecore', requires: [['soccer'], ['vintage', 'streetwear']], blurb: 'Retro kits, terrace jackets, gum-sole trainers with jeans.' },
  { id: 'groundhopper', label: 'Groundhopper', requires: [['soccer'], ['travel']], blurb: 'Collecting stadiums like stamps. Best pie is always lower league.' },
  { id: 'gorpcore', label: 'Gorpcore', requires: [['trail'], ['streetwear', 'travel']], blurb: 'Trail gear worn to town. Merino everything.' },
  { id: 'apothecary', label: 'Apothecary', requires: [['skincare', 'grooming'], ['fragrance', 'recovery']], blurb: 'Small-batch self-care from people who make it by hand.' },
  { id: 'stoicathlete', label: 'Stoic Athlete', requires: [['stoicism', 'discipline'], ['lifting', 'running', 'combat']], blurb: 'Mind like water, body like iron.' },
  { id: 'monkmode', label: 'Monk Mode', requires: [['discipline'], ['recovery', 'stoicism']], blurb: 'Phone down, lights out at 11, up before the city.' },
  { id: 'analog', label: 'Analog Hours', requires: [['vinyl', 'reading'], ['coffee', 'vintage']], blurb: 'Records, paper, pour-over. Screens off.' },
  { id: 'heirloom', label: 'Heirloom', requires: [['watches', 'tailoring'], ['vintage', 'accessories']], blurb: 'Buy once. Hand it down.' },
  { id: 'runbrew', label: 'Run & Brew', requires: [['running'], ['coffee']], blurb: 'Run clubs that end at a tiny roaster.' },
]

export const VIBE_BY_ID: Record<VibeId, Vibe> = Object.fromEntries(VIBES.map((v) => [v.id, v]))
export const COMBO_BY_ID: Record<VibeId, Combo> = Object.fromEntries(COMBOS.map((c) => [c.id, c]))

export function isCombo(id: VibeId): boolean {
  return id in COMBO_BY_ID
}

export function labelOf(id: VibeId): string {
  return VIBE_BY_ID[id]?.label ?? COMBO_BY_ID[id]?.label ?? id
}

/** "Football × Vintage" — the halves the user actually has, strongest first. */
export function comboRecipe(combo: Combo, eff: Record<VibeId, number>): string {
  return combo.requires
    .map((group) => group.reduce((best, id) => ((eff[id] ?? 0) > (eff[best] ?? 0) ? id : best), group[0]))
    .map(labelOf)
    .join(' × ')
}
