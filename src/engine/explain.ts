import { COMBO_BY_ID, comboRecipe, labelOf } from './taxonomy'
import { effectiveAffinity, topVibes } from './profile'
import type { Profile, Reason } from './types'

function list(ids: string[]): string {
  const labels = ids.slice(0, 2).map(labelOf)
  return labels.join(' + ')
}

/** One line under every card: why the feed picked it. Transparency builds trust. */
export function explain(reason: Reason, profile: Profile, anchorName?: string): string {
  switch (reason.kind) {
    case 'combo': {
      const combo = COMBO_BY_ID[reason.combo!]
      return `${combo.label} pick · ${comboRecipe(combo, effectiveAffinity(profile))}`
    }
    case 'match':
      return `Because you're into ${list(reason.tags)}`
    case 'explore': {
      const [vibe, anchor] = reason.tags
      return anchor ? `New for you: ${labelOf(vibe)}, a neighbour of ${labelOf(anchor)}` : `Something new: ${labelOf(vibe)}. Like it if it's you`
    }
    case 'partner':
      return reason.tags.length ? `Partner · matched to your ${list(reason.tags)} vibe` : 'Partner'
    case 'similar':
      return anchorName ? `Because you saved ${anchorName}` : 'More like what you just saved'
    case 'popular':
      return 'Popular with the crew right now'
  }
}

const ARCHETYPE: Record<string, string> = {
  soccer: 'Terrace',
  combat: 'Fighter',
  running: 'Miles',
  lifting: 'Iron',
  streetwear: 'Streetwear',
  vintage: 'Vintage',
  tailoring: 'Tailored',
  sneakers: 'Sneakerhead',
  accessories: 'Details',
  watches: 'Watch',
  skincare: 'Skincare',
  grooming: 'Well-groomed',
  fragrance: 'Scent',
  recovery: 'Recovery',
  stoicism: 'Stoic',
  discipline: 'Disciplined',
  reading: 'Bookish',
  coffee: 'Coffee',
  cooking: 'Kitchen',
  vinyl: 'Crate-digging',
  trail: 'Trail',
  travel: 'Wandering',
}

export interface VibeRead {
  headline: string
  sub: string
}

/** A short, human summary of the profile — the "it gets me" moment. */
export function vibeRead(profile: Profile): VibeRead {
  const top = topVibes(profile, 4)
  const combo = profile.unlocked.length ? COMBO_BY_ID[profile.unlocked[profile.unlocked.length - 1]] : undefined
  if (!top.length) return { headline: 'Still reading your vibe', sub: 'Like, save and skip a few things. The feed sharpens fast.' }

  const lead = combo ? `${combo.label} guy` : `${ARCHETYPE[top[0].id] ?? labelOf(top[0].id)} guy`
  const streak = top.find((v, i) => (combo ? i >= 0 : i > 0) && !combo?.requires.flat().includes(v.id))
  const headline = streak ? `${lead} with a ${labelOf(streak.id).toLowerCase()} streak` : lead

  const rising = topVibes(profile, 12)
    .filter((v) => v.trend > 0.08)
    .sort((a, b) => b.trend - a.trend)[0]
  const sub = rising ? `Lately leaning into ${labelOf(rising.id)}.` : `Mostly ${top.slice(0, 3).map((v) => labelOf(v.id)).join(', ')}.`
  return { headline, sub }
}
