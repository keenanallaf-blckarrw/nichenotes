import { FINDS, FIND_BY_ID, SHOPS, SHOP_BY_ID } from './finds'
import { QUOTES, MENTORS } from './quotes'
import { CLUBS, CLUB_BY_ID, FITS, POSTS, RITUALS } from './community'
import type { AnyItem } from './types'

export { FINDS, FIND_BY_ID, SHOPS, SHOP_BY_ID, QUOTES, MENTORS, CLUBS, CLUB_BY_ID, FITS, POSTS, RITUALS }

export const CATALOG: AnyItem[] = [...QUOTES, ...FINDS, ...FITS, ...POSTS, ...RITUALS]

const BY_ID: Record<string, AnyItem> = Object.fromEntries(CATALOG.map((i) => [i.id, i]))

export function itemById(id: string, extra: AnyItem[] = []): AnyItem | undefined {
  return BY_ID[id] ?? extra.find((i) => i.id === id)
}

/** Short human name for an item, used in "Because you saved …". */
export function itemName(item: AnyItem): string {
  switch (item.type) {
    case 'find':
    case 'fit':
      return item.name
    case 'quote':
      return `a line from ${item.author}`
    case 'post':
      return `@${item.author}'s post`
    case 'ritual':
      return item.title
  }
}
