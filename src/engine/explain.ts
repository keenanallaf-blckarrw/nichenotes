import { COMBO_BY_ID, comboRecipe, labelOf } from './taxonomy'
import { effectiveAffinity, topVibes } from './profile'
import type { Profile, Reason } from './types'

function list(ids: string[]): string {
  return ids.slice(0, 2).map(labelOf).join(' and ')
}

/** One short line saying why the feed picked an item. */
export function explain(reason: Reason, profile: Profile, anchorName?: string): string {
  switch (reason.kind) {
    case 'combo': {
      const combo = COMBO_BY_ID[reason.combo!]
      return `${combo.label} · ${comboRecipe(combo, effectiveAffinity(profile))}`
    }
    case 'match':
      return `Because you like ${list(reason.tags)}`
    case 'explore': {
      const [vibe, anchor] = reason.tags
      return anchor ? `Something new: ${labelOf(vibe)}, since you like ${labelOf(anchor)}` : `Something new: ${labelOf(vibe)}`
    }
    case 'partner':
      return reason.tags.length ? `Partner · Matches your interest in ${list(reason.tags)}` : 'Partner'
    case 'similar':
      return anchorName ? `Because you saved ${anchorName}` : 'Because of something you saved'
    case 'popular':
      return 'Popular right now'
  }
}

/** Reasons worth showing on the card itself. The rest stay one tap away. */
export function isNotable(reason: Reason): boolean {
  return reason.kind === 'similar' || reason.kind === 'explore' || reason.kind === 'combo' || reason.kind === 'partner'
}

export interface VibeRead {
  headline: string
  sub: string
}

function sentence(labels: string[]): string {
  if (labels.length < 2) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

/** A plain-language summary of what the feed has learned. */
export function vibeRead(profile: Profile): VibeRead {
  const top = topVibes(profile, 3)
  if (!top.length) return { headline: 'Still learning your taste', sub: 'Like and save a few things. Your feed gets sharper fast.' }

  const headline = sentence(top.map((v) => labelOf(v.id)))
  const rising = topVibes(profile, 12)
    .filter((v) => v.trend > 0.08)
    .sort((a, b) => b.trend - a.trend)[0]
  const combo = profile.unlocked.length ? COMBO_BY_ID[profile.unlocked[profile.unlocked.length - 1]] : undefined
  const sub = rising ? `Lately, more ${labelOf(rising.id)}.` : combo ? `Where they meet: ${combo.label}.` : 'The more you use NicheNotes, the better this gets.'
  return { headline, sub }
}
