import { labelOf, topVibes, type Profile, type VibeId } from '../engine'

/** Nothing on NicheNotes costs more than this, including what we send people to find. */
export const MAX_PRICE = 500

/**
 * What to search Etsy and eBay for, per interest. Written the way sellers
 * actually title listings, so the results are one-off, vintage and handmade
 * things rather than the mass-market products the big stores already push.
 */
export const HUNTS: Record<VibeId, string[]> = {
  soccer: ['vintage 90s soccer jersey', 'retro soccer training jacket'],
  basketball: ['vintage basketball warm up jacket', 'vintage 90s basketball jersey'],
  baseball: ['vintage wool baseball cap', 'vintage flannel baseball jersey'],
  americanfootball: ['vintage football jersey', 'vintage starter jacket'],
  tennis: ['vintage tennis sweater', 'vintage wooden tennis racket'],
  golf: ['vintage golf cardigan', 'vintage leather golf bag'],
  running: ['vintage running shorts', 'vintage marathon shirt'],
  cycling: ['vintage wool cycling jersey', 'vintage cycling cap'],
  lifting: ['vintage leather weightlifting belt', 'vintage gym sweatshirt'],
  yoga: ['cork yoga block handmade', 'organic cotton yoga bag handmade'],
  combat: ['vintage boxing robe', 'vintage leather boxing gloves'],
  dance: ['vintage dance jacket', 'vintage leotard'],
  boardsports: ['vintage surf shirt', 'vintage skateboard deck'],

  streetwear: ['vintage single stitch tee', 'heavyweight cotton hoodie handmade'],
  vintage: ['vintage wool cardigan', 'vintage workwear chore coat'],
  tailoring: ['vintage lambswool sweater', 'vintage pleated wool trousers'],
  sneakers: ['vintage canvas sneakers deadstock', 'suede sneakers gum sole handmade'],
  accessories: ['sterling silver signet ring handmade', 'vintage leather belt brass buckle'],
  watches: ['vintage mechanical watch', 'vintage leather watch strap handmade'],
  makeup: ['natural lip tint handmade', 'vegan mineral makeup small batch'],
  haircare: ['herbal hair oil small batch', 'wooden hair comb handmade'],
  fragrance: ['natural perfume oil handmade', 'solid perfume botanical'],

  skincare: ['grass fed tallow balm', 'organic face oil small batch'],
  grooming: ['natural beard oil handmade', 'vintage safety razor'],
  recovery: ['organic buckwheat pillow', 'herbal sleep tea blend'],
  meditation: ['meditation cushion handmade', 'handmade mala beads'],
  mentalhealth: ['guided journal handmade', 'weighted blanket handmade'],
  nutrition: ['grass fed beef tallow cooking', 'handmade ceramic meal prep bowls'],

  philosophy: ['vintage stoic book', 'memento mori coin'],
  discipline: ['leather planner cover handmade', 'undated daily planner'],
  reading: ['vintage hardcover books', 'handmade leather bookmark'],
  writing: ['vintage fountain pen', 'leather journal handmade'],
  languages: ['vintage phrase book', 'vintage world map'],
  spirituality: ['handmade prayer beads', 'beeswax candle handmade'],
  money: ['vintage leather wallet', 'handmade budget planner'],
  entrepreneurship: ['leather notebook cover handmade', 'vintage desk organizer'],

  art: ['vintage art print', 'handmade sketchbook'],
  photography: ['vintage 35mm film camera', 'vintage camera strap'],
  musicmaking: ['vintage synthesizer', 'vintage guitar strap'],
  crafts: ['vintage wood hand tools', 'natural wool yarn hand dyed'],
  design: ['mid century modern lamp', 'vintage design book'],

  coffee: ['vintage coffee grinder', 'handmade ceramic pour over'],
  tea: ['handmade ceramic teapot', 'vintage tea set'],
  cooking: ['vintage cast iron skillet', 'handmade carbon steel pan'],
  baking: ['vintage bread box', 'banneton proofing basket'],
  plantbased: ['vintage vegetarian cookbook', 'handmade ceramic bowls'],

  gaming: ['vintage video game console', 'retro controller'],
  anime: ['vintage anime tee', 'vintage manga'],
  film: ['vintage movie poster', 'vintage film camera projector'],
  vinyl: ['vintage vinyl record', 'vintage record crate'],
  boardgames: ['vintage board game', 'handmade wooden chess set'],

  homedecor: ['vintage wool rug', 'handmade ceramic vase'],
  plants: ['handmade ceramic planter', 'vintage plant stand'],
  pets: ['handmade leather dog collar', 'handmade wool cat bed'],
  tech: ['vintage headphones', 'wooden phone stand handmade'],
  cars: ['vintage car poster', 'leather keychain handmade'],
  sustainability: ['beeswax food wraps', 'vintage glass jars'],

  trail: ['vintage hiking boots', 'vintage wool hiking sweater'],
  camping: ['vintage camping lantern', 'vintage wool blanket'],
  travel: ['vintage leather duffle bag', 'vintage travel poster'],

  // Where interests meet
  retrojerseys: ['vintage 90s goalkeeper jersey', 'vintage sports jersey'],
  courtstyle: ['vintage tennis polo', 'vintage basketball shorts'],
  stadiumtravel: ['vintage stadium pennant', 'vintage sports program'],
  outdoorstyle: ['vintage fleece jacket', 'vintage anorak'],
  apothecary: ['small batch tallow skincare', 'apothecary glass bottle vintage'],
  selfcaresunday: ['handmade bath soak', 'natural face mask small batch'],
  mindfulmovement: ['cork yoga mat', 'vintage running jacket'],
  stoicathlete: ['vintage leather jump rope', 'stoic quote print'],
  monkmode: ['vintage analog alarm clock', 'undated daily planner'],
  analog: ['vintage turntable', 'vintage typewriter'],
  cozyhome: ['vintage wool throw blanket', 'handmade beeswax candle'],
  creatorkit: ['vintage camera bag', 'handmade desk lamp'],
  gamenight: ['vintage board game', 'handmade card game'],
  animestyle: ['vintage anime jacket', 'anime art print'],
  sidehustle: ['leather portfolio handmade', 'vintage desk lamp'],
  greenliving: ['vintage glass storage jars', 'handmade reusable produce bags'],
  heirloom: ['vintage signet ring', 'vintage mechanical watch'],
  runbrew: ['vintage running shirt', 'handmade coffee mug'],
  roadtrip: ['vintage road map', 'vintage leather driving gloves'],
  petadventures: ['handmade leather dog leash', 'vintage dog travel bowl'],
}

export function etsyUrl(query: string): string {
  return `https://www.etsy.com/search?q=${encodeURIComponent(query)}&max=${MAX_PRICE}`
}

export function ebayUrl(query: string): string {
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_udhi=${MAX_PRICE}`
}

export interface Hunt {
  /** The interest this hunt is for. */
  vibe: VibeId
  label: string
  query: string
}

/** The first search for an interest, or its label if it has none. */
export function huntFor(vibe: VibeId, pick = 0): Hunt {
  const list = HUNTS[vibe] ?? [labelOf(vibe).toLowerCase()]
  return { vibe, label: labelOf(vibe), query: list[pick % list.length] }
}

/**
 * Hunts picked for one person: the niches where their interests meet come
 * first (they're the most specific), then their strongest interests. The
 * `day` rotates between each interest's searches so the list stays fresh.
 */
export function huntsForProfile(profile: Profile, day: number, max = 6): Hunt[] {
  const vibes = topVibes(profile, max).map((v) => v.id)
  const ids = [...new Set([...profile.unlocked, ...vibes])].filter((id) => !profile.muted.includes(id)).slice(0, max)
  return ids.map((id, i) => huntFor(id, day + i))
}
