import type { VibeId } from './types'

export type WorldId = 'sport' | 'style' | 'wellness' | 'mind' | 'create' | 'food' | 'play' | 'home' | 'outside'

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
  { id: 'sport', label: 'Sports & Fitness', blurb: 'The games you play, watch and train for.' },
  { id: 'style', label: 'Style & Beauty', blurb: 'What you wear and how you care for it.' },
  { id: 'wellness', label: 'Wellness', blurb: 'Body, mind and rest.' },
  { id: 'mind', label: 'Learning & Growth', blurb: 'Ideas, books, money and meaning.' },
  { id: 'create', label: 'Creativity', blurb: 'Making things with your hands and head.' },
  { id: 'food', label: 'Food & Drink', blurb: 'Cooking, baking and what is in your cup.' },
  { id: 'play', label: 'Entertainment', blurb: 'Games, stories, music and screens.' },
  { id: 'home', label: 'Home & Life', blurb: 'Your space, your pets, your stuff.' },
  { id: 'outside', label: 'Outdoors & Travel', blurb: 'Trails, campsites and new places.' },
]

export const VIBES: Vibe[] = [
  { id: 'soccer', label: 'Soccer', world: 'sport', blurb: 'Game days, pickup games, retro jerseys.', adjacent: ['running', 'vintage', 'travel'] },
  { id: 'basketball', label: 'Basketball', world: 'sport', blurb: 'Pickup runs, shoes, highlights.', adjacent: ['sneakers', 'streetwear', 'lifting'] },
  { id: 'baseball', label: 'Baseball', world: 'sport', blurb: 'Ballparks, box scores, wool caps.', adjacent: ['vintage', 'americanfootball', 'travel'] },
  { id: 'americanfootball', label: 'American Football', world: 'sport', blurb: 'Game days, tailgates, fantasy leagues.', adjacent: ['lifting', 'cooking', 'cars'] },
  { id: 'tennis', label: 'Racket Sports', world: 'sport', blurb: 'Tennis, padel and pickleball.', adjacent: ['sneakers', 'golf', 'running'] },
  { id: 'golf', label: 'Golf', world: 'sport', blurb: 'Early tee times and quiet courses.', adjacent: ['tailoring', 'watches', 'tennis'] },
  { id: 'running', label: 'Running', world: 'sport', blurb: 'Early miles and the coffee after.', adjacent: ['coffee', 'recovery', 'trail'] },
  { id: 'cycling', label: 'Cycling', world: 'sport', blurb: 'Commutes, long rides, bike repair.', adjacent: ['running', 'travel', 'sustainability'] },
  { id: 'lifting', label: 'Strength Training', world: 'sport', blurb: 'Weights, gyms, getting stronger.', adjacent: ['discipline', 'recovery', 'nutrition'] },
  { id: 'yoga', label: 'Yoga & Pilates', world: 'sport', blurb: 'Flexibility, balance, a calm body.', adjacent: ['meditation', 'recovery', 'dance'] },
  { id: 'combat', label: 'Combat Sports', world: 'sport', blurb: 'Boxing, Muay Thai, jiu-jitsu.', adjacent: ['lifting', 'discipline', 'recovery'] },
  { id: 'dance', label: 'Dance', world: 'sport', blurb: 'Classes, practice, every style.', adjacent: ['musicmaking', 'yoga', 'sneakers'] },
  { id: 'boardsports', label: 'Skate & Surf', world: 'sport', blurb: 'Boards, waves and skate parks.', adjacent: ['streetwear', 'travel', 'photography'] },

  { id: 'streetwear', label: 'Streetwear', world: 'style', blurb: 'Heavy tees, relaxed fits, small runs.', adjacent: ['sneakers', 'accessories', 'vintage'] },
  { id: 'vintage', label: 'Vintage & Thrift', world: 'style', blurb: 'Secondhand finds and things with a past.', adjacent: ['streetwear', 'sustainability', 'vinyl'] },
  { id: 'tailoring', label: 'Classic Style', world: 'style', blurb: 'Linen, knitwear, pieces that last.', adjacent: ['watches', 'accessories', 'fragrance'] },
  { id: 'sneakers', label: 'Sneakers', world: 'style', blurb: 'Gum soles, suede, small-batch releases.', adjacent: ['streetwear', 'basketball'] },
  { id: 'accessories', label: 'Jewelry & Accessories', world: 'style', blurb: 'Rings, chains, bags, caps.', adjacent: ['watches', 'streetwear', 'makeup'] },
  { id: 'watches', label: 'Watches', world: 'style', blurb: 'Independent brands and field watches.', adjacent: ['accessories', 'tailoring', 'vintage'] },
  { id: 'makeup', label: 'Makeup & Nails', world: 'style', blurb: 'Color for every skin tone.', adjacent: ['skincare', 'haircare', 'accessories'] },
  { id: 'haircare', label: 'Hair Care', world: 'style', blurb: 'For every hair type, curly to straight.', adjacent: ['skincare', 'makeup', 'grooming'] },
  { id: 'fragrance', label: 'Fragrance', world: 'style', blurb: 'Independent perfumers and solid scents.', adjacent: ['grooming', 'skincare', 'homedecor'] },

  { id: 'skincare', label: 'Skincare', world: 'wellness', blurb: 'Simple routines with short ingredient lists.', adjacent: ['haircare', 'recovery', 'fragrance'] },
  { id: 'grooming', label: 'Shaving & Grooming', world: 'wellness', blurb: 'Razors, beard care, hair clay.', adjacent: ['skincare', 'fragrance', 'haircare'] },
  { id: 'recovery', label: 'Sleep & Recovery', world: 'wellness', blurb: 'Better sleep, sauna, cold plunge.', adjacent: ['meditation', 'yoga', 'skincare'] },
  { id: 'meditation', label: 'Meditation', world: 'wellness', blurb: 'Breathing, stillness, slowing down.', adjacent: ['yoga', 'mentalhealth', 'spirituality'] },
  { id: 'mentalhealth', label: 'Mental Health', world: 'wellness', blurb: 'Tools and talk for how you really feel.', adjacent: ['meditation', 'writing', 'recovery'] },
  { id: 'nutrition', label: 'Healthy Eating', world: 'wellness', blurb: 'Simple meals and meal prep.', adjacent: ['plantbased', 'cooking', 'lifting'] },

  { id: 'philosophy', label: 'Philosophy', world: 'mind', blurb: 'Stoicism, Eastern thought, big questions.', adjacent: ['reading', 'discipline', 'meditation'] },
  { id: 'discipline', label: 'Habits & Focus', world: 'mind', blurb: 'Mornings, routines, getting things done.', adjacent: ['philosophy', 'lifting', 'money'] },
  { id: 'reading', label: 'Books & Reading', world: 'mind', blurb: 'Novels, nonfiction, twenty pages a night.', adjacent: ['writing', 'philosophy', 'tea'] },
  { id: 'writing', label: 'Writing & Journaling', world: 'mind', blurb: 'Journals, stories, poems, pens.', adjacent: ['reading', 'mentalhealth', 'art'] },
  { id: 'languages', label: 'Learning Languages', world: 'mind', blurb: 'New words, new places, new people.', adjacent: ['travel', 'reading', 'anime'] },
  { id: 'spirituality', label: 'Faith & Spirituality', world: 'mind', blurb: 'Prayer, reflection, every tradition.', adjacent: ['meditation', 'philosophy', 'writing'] },
  { id: 'money', label: 'Personal Finance', world: 'mind', blurb: 'Budgeting, saving, investing basics.', adjacent: ['entrepreneurship', 'discipline', 'tech'] },
  { id: 'entrepreneurship', label: 'Starting a Business', world: 'mind', blurb: 'Side projects and small businesses.', adjacent: ['money', 'design', 'tech'] },

  { id: 'art', label: 'Art & Drawing', world: 'create', blurb: 'Sketchbooks, paint, museums.', adjacent: ['design', 'photography', 'crafts'] },
  { id: 'photography', label: 'Photography', world: 'create', blurb: 'Film cameras and phone shots.', adjacent: ['art', 'travel', 'vintage'] },
  { id: 'musicmaking', label: 'Making Music', world: 'create', blurb: 'Beats, instruments, home studios.', adjacent: ['vinyl', 'tech', 'dance'] },
  { id: 'crafts', label: 'Crafts & DIY', world: 'create', blurb: 'Knitting, woodwork, fixing things.', adjacent: ['art', 'homedecor', 'sustainability'] },
  { id: 'design', label: 'Design', world: 'create', blurb: 'Type, color, objects, spaces.', adjacent: ['art', 'homedecor', 'tech'] },

  { id: 'coffee', label: 'Coffee', world: 'food', blurb: 'Small roasters and hand grinders.', adjacent: ['running', 'reading', 'baking'] },
  { id: 'tea', label: 'Tea', world: 'food', blurb: 'Loose leaf, teapots, slow mornings.', adjacent: ['reading', 'meditation', 'baking'] },
  { id: 'cooking', label: 'Cooking', world: 'food', blurb: 'Good pans, bold sauces, cooking for friends.', adjacent: ['baking', 'travel', 'nutrition'] },
  { id: 'baking', label: 'Baking', world: 'food', blurb: 'Bread, cakes, sourdough.', adjacent: ['cooking', 'coffee', 'tea'] },
  { id: 'plantbased', label: 'Plant-Based', world: 'food', blurb: 'Meals without meat that still satisfy.', adjacent: ['nutrition', 'cooking', 'sustainability'] },

  { id: 'gaming', label: 'Gaming', world: 'play', blurb: 'Console, PC, retro and indie.', adjacent: ['tech', 'anime', 'boardgames'] },
  { id: 'anime', label: 'Anime & Manga', world: 'play', blurb: 'What to watch and read next.', adjacent: ['art', 'gaming', 'languages'] },
  { id: 'film', label: 'Film & TV', world: 'play', blurb: 'Movie nights and great series.', adjacent: ['reading', 'photography', 'boardgames'] },
  { id: 'vinyl', label: 'Music & Vinyl', world: 'play', blurb: 'Records, playlists, good speakers.', adjacent: ['musicmaking', 'vintage', 'reading'] },
  { id: 'boardgames', label: 'Board Games & Puzzles', world: 'play', blurb: 'Game nights and quiet puzzles.', adjacent: ['gaming', 'film', 'tea'] },

  { id: 'homedecor', label: 'Home & Interiors', world: 'home', blurb: 'Small spaces, good light, cozy rooms.', adjacent: ['plants', 'design', 'crafts'] },
  { id: 'plants', label: 'Plants & Gardening', world: 'home', blurb: 'Houseplants, herbs, backyard gardens.', adjacent: ['homedecor', 'sustainability', 'cooking'] },
  { id: 'pets', label: 'Pets', world: 'home', blurb: 'Dogs, cats and everyone else.', adjacent: ['trail', 'homedecor', 'camping'] },
  { id: 'tech', label: 'Tech & Gadgets', world: 'home', blurb: 'Useful gadgets and clean setups.', adjacent: ['gaming', 'design', 'musicmaking'] },
  { id: 'cars', label: 'Cars & Motorcycles', world: 'home', blurb: 'Weekend drives and garage projects.', adjacent: ['travel', 'americanfootball', 'tech'] },
  { id: 'sustainability', label: 'Sustainable Living', world: 'home', blurb: 'Small swaps for a lighter footprint.', adjacent: ['vintage', 'plants', 'plantbased'] },

  { id: 'trail', label: 'Hiking', world: 'outside', blurb: 'Trails, daypacks, fresh air.', adjacent: ['camping', 'running', 'travel'] },
  { id: 'camping', label: 'Camping', world: 'outside', blurb: 'Tents, campfires, starry nights.', adjacent: ['trail', 'pets', 'cooking'] },
  { id: 'travel', label: 'Travel', world: 'outside', blurb: 'Carry-on only, new cities, road trips.', adjacent: ['languages', 'photography', 'soccer'] },
]

export const COMBOS: Combo[] = [
  { id: 'retrojerseys', label: 'Retro Jerseys', requires: [['soccer', 'basketball', 'baseball', 'americanfootball'], ['vintage', 'streetwear']], blurb: 'Classic sports jerseys worn as everyday style.' },
  { id: 'courtstyle', label: 'Court Style', requires: [['basketball', 'tennis'], ['sneakers', 'streetwear']], blurb: 'What people wear on the court, worn everywhere else.' },
  { id: 'stadiumtravel', label: 'Stadium Travel', requires: [['soccer', 'basketball', 'baseball', 'americanfootball'], ['travel']], blurb: 'Seeing a game in every city you visit.' },
  { id: 'outdoorstyle', label: 'Outdoor Style', requires: [['trail', 'camping'], ['streetwear', 'travel']], blurb: 'Hiking gear that looks good in the city.' },
  { id: 'apothecary', label: 'Apothecary', requires: [['skincare', 'grooming', 'haircare'], ['fragrance', 'recovery']], blurb: 'Self-care made by hand, in small batches.' },
  { id: 'selfcaresunday', label: 'Self-Care Sunday', requires: [['skincare', 'haircare', 'makeup'], ['meditation', 'recovery', 'tea']], blurb: 'A slow day to look after yourself.' },
  { id: 'mindfulmovement', label: 'Mindful Movement', requires: [['yoga', 'meditation'], ['running', 'trail', 'dance', 'cycling']], blurb: 'Moving your body to calm your mind.' },
  { id: 'stoicathlete', label: 'Stoic Athlete', requires: [['philosophy', 'discipline'], ['lifting', 'running', 'combat']], blurb: 'A calm mind and a strong body.' },
  { id: 'monkmode', label: 'Monk Mode', requires: [['discipline'], ['recovery', 'philosophy', 'meditation']], blurb: 'Phone down, early nights, deep focus.' },
  { id: 'analog', label: 'Analog Hours', requires: [['vinyl', 'reading', 'writing'], ['coffee', 'tea', 'vintage']], blurb: 'Records, books, slow mornings. Screens off.' },
  { id: 'cozyhome', label: 'Cozy Home', requires: [['homedecor', 'plants'], ['tea', 'baking', 'reading']], blurb: 'Warm light, good books, something in the oven.' },
  { id: 'creatorkit', label: 'Creator Kit', requires: [['photography', 'art', 'musicmaking', 'design'], ['tech', 'writing']], blurb: 'Tools for making and sharing your work.' },
  { id: 'gamenight', label: 'Game Night', requires: [['gaming', 'boardgames'], ['cooking', 'baking', 'film']], blurb: 'Friends, snacks and one more round.' },
  { id: 'animestyle', label: 'Anime Style', requires: [['anime'], ['streetwear', 'art']], blurb: 'Art, prints and outfits inspired by anime.' },
  { id: 'sidehustle', label: 'Side Hustle', requires: [['entrepreneurship', 'money'], ['tech', 'design', 'writing', 'crafts']], blurb: 'Turning something you love into income.' },
  { id: 'greenliving', label: 'Green Living', requires: [['sustainability', 'plants'], ['vintage', 'plantbased', 'cycling']], blurb: 'Buying less, reusing more, growing your own.' },
  { id: 'heirloom', label: 'Buy It for Life', requires: [['watches', 'tailoring'], ['vintage', 'accessories']], blurb: 'Things made to last, and to pass down.' },
  { id: 'runbrew', label: 'Run & Brew', requires: [['running', 'cycling'], ['coffee']], blurb: 'Morning workouts that end at a small coffee shop.' },
  { id: 'roadtrip', label: 'Road Trip', requires: [['cars'], ['travel', 'camping']], blurb: 'Long drives and wherever the road goes.' },
  { id: 'petadventures', label: 'Pet Adventures', requires: [['pets'], ['trail', 'camping', 'travel']], blurb: 'Hikes and trips with your best friend.' },
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
