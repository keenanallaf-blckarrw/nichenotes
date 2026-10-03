import type { FindItem, Shop } from './types'
import { REAL_FINDS, REAL_SHOPS } from './brands'

// Every shop and product in the app is a real, independent brand. They live in brands.ts.
export const SHOPS: Shop[] = REAL_SHOPS

export const SHOP_BY_ID: Record<string, Shop> = Object.fromEntries(SHOPS.map((s) => [s.id, s]))

export const FINDS: FindItem[] = REAL_FINDS

export const FIND_BY_ID: Record<string, FindItem> = Object.fromEntries(FINDS.map((f) => [f.id, f]))
