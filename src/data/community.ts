import type { Club, FitItem, PostItem, RitualItem } from './types'
import { daysAgo } from './time'

export const CLUBS: Club[] = [
  { id: 'retro-jerseys', name: 'Retro Jerseys', blurb: 'Classic jerseys, game-day outfits, thrift finds.', tags: { soccer: 1, retrojerseys: 1, vintage: 0.4 }, members: 18400 },
  { id: 'stadium-travel', name: 'Stadium Travel', blurb: 'Stadiums, road trips, the best food at the game.', tags: { soccer: 0.8, travel: 0.8, stadiumtravel: 1 }, members: 4100 },
  { id: 'daily-stoic', name: 'Daily Stoic', blurb: 'One passage a day, and what it means to you.', tags: { stoicism: 1, reading: 0.4 }, members: 22700 },
  { id: 'monk-mode', name: 'Monk Mode', blurb: 'Early mornings, phone down, lights out at 11.', tags: { discipline: 1, recovery: 0.6, monkmode: 1 }, members: 15200 },
  { id: 'apothecary', name: 'Apothecary', blurb: 'Skincare and scent from small makers.', tags: { skincare: 0.8, fragrance: 0.8, grooming: 0.6, apothecary: 1 }, members: 9800 },
  { id: 'style', name: 'Style', blurb: 'Vintage, heavyweight basics, outfit of the day.', tags: { streetwear: 1, vintage: 0.8, sneakers: 0.5 }, members: 26300 },
  { id: 'buy-it-for-life', name: 'Buy It for Life', blurb: 'Watches, rings and things you only buy once.', tags: { watches: 1, accessories: 0.7, tailoring: 0.6, heirloom: 1 }, members: 7600 },
  { id: 'strength', name: 'Strength', blurb: 'Lifting, fight training, recovery.', tags: { lifting: 1, combat: 1, stoicathlete: 0.6 }, members: 12900 },
  { id: 'run-and-brew', name: 'Run & Brew', blurb: 'Saturday runs, then a small coffee shop.', tags: { running: 1, coffee: 0.8, runbrew: 1 }, members: 6300 },
  { id: 'analog-hours', name: 'Analog Hours', blurb: 'Records, books, slow coffee.', tags: { vinyl: 1, reading: 0.7, coffee: 0.4, analog: 1 }, members: 5400 },
  { id: 'outdoors', name: 'Outdoors', blurb: 'Hiking, packing light, carry-on only.', tags: { trail: 1, travel: 0.8, outdoorstyle: 1 }, members: 8800 },
  { id: 'home-cooks', name: 'Home Cooks', blurb: 'Good pans, good sauces, cooking for friends.', tags: { cooking: 1 }, members: 4700 },
]

export const CLUB_BY_ID: Record<string, Club> = Object.fromEntries(CLUBS.map((c) => [c.id, c]))

type P = Omit<PostItem, 'type' | 'createdAt' | 'popularity' | 'tags' | 'source'> & { hoursAgo: number }

// Sample community posts for the prototype. Usernames are invented.
const RAW_POSTS: P[] = [
  { id: 'p-thrift', author: 'thrift_tom', club: 'retro-jerseys', text: 'Found a lace-collar goalkeeper jersey at a flea market for $4. The seller had no idea. What is your best thrift find?', likes: 842, replies: 131, hoursAgo: 3 },
  { id: 'p-wedding', author: 'lagos_left_back', club: 'retro-jerseys', text: 'Wore a 1998 away jersey with pleated pants to a wedding. Mixed reviews. Would do it again.', likes: 1290, replies: 204, hoursAgo: 20 },
  { id: 'p-stadiums', author: 'stadium_ali', club: 'stadium-travel', text: 'Stadium count: 37. My rule: the smaller the club, the better the food.', likes: 388, replies: 72, hoursAgo: 9 },
  { id: 'p-layoff', author: 'stoic_steve', club: 'daily-stoic', text: 'Meditations V.20 got me through a layoff this week. "The obstacle is the way" is not a slogan. It is a practice.', likes: 2104, replies: 188, hoursAgo: 6 },
  { id: 'p-day41', author: 'quietgrind', club: 'monk-mode', text: 'Day 41 of waking at 5 and no phone until 9. I did not expect it to change my skin, but it did. Sleep is the secret.', likes: 1570, replies: 96, hoursAgo: 11 },
  { id: 'p-solidcologne', author: 'oud_hands', club: 'apothecary', text: 'Solid colognes are underrated. Tin in your pocket, reapply at lunch, no alcohol sting.', likes: 634, replies: 58, hoursAgo: 14 },
  { id: 'p-faceoil', author: 'field_notes_fin', club: 'apothecary', text: 'A four-ingredient face oil from a small farm beat my $90 serum. Unknown brands hit different.', likes: 921, replies: 110, hoursAgo: 30 },
  { id: 'p-razor', author: 'no_more_razorburn', club: 'apothecary', text: 'Switched to a safety razor six months ago. Razor bumps gone, and I save about $80 a year on cartridges.', likes: 512, replies: 64, hoursAgo: 40 },
  { id: 'p-mall', author: 'ring_finger', club: 'buy-it-for-life', text: 'Skip the mall jewelry. One silver chain, one signet ring, and wear them every day for ten years.', likes: 1188, replies: 143, hoursAgo: 8 },
  { id: 'p-microbrand', author: 'watch_nerd_noah', club: 'buy-it-for-life', text: 'Independent field watches under $200 are the best value in watches right now. Change my mind.', likes: 702, replies: 219, hoursAgo: 26 },
  { id: 'p-workjacket', author: 'vintage_vik', club: 'style', text: 'Unworn vintage French work jackets are getting hard to find. If you see one in your size, buy it.', likes: 954, replies: 77, hoursAgo: 5 },
  { id: 'p-heavytee', author: 'fourteen_oz', club: 'style', text: 'Once you wear a heavyweight tee you cannot go back. Everything else feels like paper.', likes: 1402, replies: 165, hoursAgo: 17 },
  { id: 'p-belt', author: 'the_iron_monk', club: 'strength', text: 'Hand-stitched lifting belts break in like a baseball glove. Mine is 8 years old and just getting good.', likes: 433, replies: 41, hoursAgo: 22 },
  { id: 'p-wraps', author: 'southpaw_sam', club: 'strength', text: 'Cotton hand wraps are better than gel inserts. Change my mind at the gym.', likes: 611, replies: 97, hoursAgo: 35 },
  { id: 'p-runclub', author: 'miles_before_coffee', club: 'run-and-brew', text: 'Our run club ends at a different small roaster every Saturday. 14 roasters in, Ethiopian Guji is still the best.', likes: 780, replies: 88, hoursAgo: 12 },
  { id: 'p-jazz', author: 'crate_digger_dan', club: 'analog-hours', text: 'Japanese jazz reissues are the move right now. Half the price of originals and they sound incredible.', likes: 566, replies: 71, hoursAgo: 28 },
  { id: 'p-20pages', author: 'bookmark_ben', club: 'analog-hours', text: '20 pages a night is about 25 books a year. That is the whole trick.', likes: 1830, replies: 120, hoursAgo: 48 },
  { id: 'p-merino', author: 'trail_dad', club: 'outdoors', text: 'Wore a merino hoodie 11 days straight on a trip. Still fresh. I am a believer.', likes: 690, replies: 83, hoursAgo: 16 },
  { id: 'p-toiletrybag', author: 'nomad_nate', club: 'outdoors', text: 'Waxed canvas toiletry bag: 6 years, 22 countries. Buy once, cry once.', likes: 402, replies: 39, hoursAgo: 60 },
  { id: 'p-pan', author: 'pan_handler', club: 'home-cooks', text: 'Three months of eggs in a carbon steel pan and it is finally non-stick. Seasoning is a hobby now.', likes: 520, replies: 66, hoursAgo: 19 },
  { id: 'p-plunge', author: 'chill_plunge', club: 'monk-mode', text: 'Three rounds of cold plunge then sauna. My sleep score jumped 12 points in a week. Ask me anything.', likes: 874, replies: 152, hoursAgo: 7 },
]

export function postFromRaw(p: P): PostItem {
  const club = CLUB_BY_ID[p.club]
  const { hoursAgo, ...rest } = p
  return {
    ...rest,
    type: 'post',
    tags: club.tags,
    source: p.club,
    createdAt: Date.now() - hoursAgo * 3_600_000,
    popularity: Math.min(1, p.likes / 2200),
  }
}

export const POSTS: PostItem[] = RAW_POSTS.map(postFromRaw)

const RAW_FITS: Omit<FitItem, 'type' | 'createdAt' | 'popularity'>[] = [
  { id: 'fit-gameday', label: 'Outfit', name: 'Game Day to Dinner', blurb: 'Retro stripes, gum soles and a wool cap. From the field to the table.', findIds: ['f-striped', 'f-suedesneaker', 'f-sixpanel', 'f-woolscarf'], tags: { soccer: 0.7, streetwear: 0.5, vintage: 0.5, retrojerseys: 1 } },
  { id: 'fit-awaygame', label: 'Outfit', name: 'Away Game', blurb: 'Training top, crossbody bag, suede sneakers. Built for a road trip and a late night.', findIds: ['f-drill', 'f-crossbody', 'f-suedesneaker', 'f-stadiumpassport'], tags: { soccer: 0.6, travel: 0.6, streetwear: 0.5, stadiumtravel: 0.8, retrojerseys: 0.7 } },
  { id: 'fit-quietmonday', label: 'Outfit', name: 'Quiet Monday', blurb: 'Linen, a knit tie, a field watch. Dressed up without trying.', findIds: ['f-linen', 'f-silktie', 'f-fieldwatch', 'f-frames'], tags: { tailoring: 1, watches: 0.5, accessories: 0.4, heirloom: 0.8 } },
  { id: 'fit-trailtown', label: 'Outfit', name: 'Trail to Town', blurb: 'Merino, a packable daypack, a watch that can take a hit.', findIds: ['f-merinohood', 'f-daypack', 'f-timug', 'f-fieldwatch'], tags: { trail: 0.8, travel: 0.5, streetwear: 0.4, outdoorstyle: 1 } },
  { id: 'fit-basics', label: 'Outfit', name: 'The Basics', blurb: 'One great tee, one chain, one ring. Your everyday uniform.', findIds: ['f-boxytee', 'f-figaro', 'f-signet', 'f-sixpanel'], tags: { streetwear: 0.9, accessories: 0.8 } },
  { id: 'set-monk', label: 'Set', name: 'Monk Mode Set', blurb: 'A planner, pocket Meditations, a coin to remind you, and a balm to help you sleep.', findIds: ['f-planner', 'f-pocketmed', 'f-mementomori', 'f-sleepbalm'], tags: { discipline: 0.8, stoicism: 0.7, recovery: 0.4, monkmode: 1 } },
  { id: 'set-apothecary', label: 'Set', name: 'The Apothecary Shelf', blurb: 'Four small-batch products that replace ten from the mall.', findIds: ['f-faceoil', 'f-toner', 'f-spfstick', 'f-solidcologne'], tags: { skincare: 0.9, fragrance: 0.6, apothecary: 1 } },
  { id: 'set-runbrew', label: 'Set', name: 'Saturday Run & Brew', blurb: 'Split shorts, sunscreen, and fresh coffee for when you get home.', findIds: ['f-splitshorts', 'f-spfstick', 'f-guji', 'f-grinder'], tags: { running: 0.8, coffee: 0.7, runbrew: 1 } },
  { id: 'set-shave', label: 'Set', name: 'The Better Shave', blurb: 'Brass razor, rice toner, hair clay. Ten minutes, no razor bumps.', findIds: ['f-razor', 'f-toner', 'f-pomade', 'f-dopp'], tags: { grooming: 1, skincare: 0.5 } },
]

export const FITS: FitItem[] = RAW_FITS.map((f, i) => ({ ...f, type: 'fit', createdAt: daysAgo(3 + i * 2), popularity: 0.7 - i * 0.03 }))

const RAW_RITUALS: Omit<RitualItem, 'type' | 'createdAt' | 'popularity'>[] = [
  { id: 'r-cold', title: 'End your shower cold', detail: 'Two minutes of cold water. Breathe slowly through your nose.', minutes: 2, tags: { recovery: 0.9, discipline: 0.7, monkmode: 0.5 } },
  { id: 'r-pages', title: 'Read 10 pages before your phone', detail: 'Book first, feed later. Any book counts.', minutes: 15, tags: { reading: 1, discipline: 0.6 } },
  { id: 'r-spf', title: 'Wear sunscreen, even when it is cloudy', detail: 'UV goes straight through clouds. Face, neck, ears.', minutes: 1, tags: { skincare: 1 } },
  { id: 'r-walk', title: 'Walk 20 minutes without headphones', detail: 'Let your mind wander. Outside if you can.', minutes: 20, tags: { trail: 0.6, stoicism: 0.6, recovery: 0.4 } },
  { id: 'r-control', title: 'Write down what you control today', detail: 'One line. Let the rest go until lunch.', minutes: 2, tags: { stoicism: 1, discipline: 0.5 } },
  { id: 'r-touches', title: '100 touches on the ball', detail: 'Juggling, wall passes, anything. Just 100 touches.', minutes: 5, tags: { soccer: 1, discipline: 0.3 } },
  { id: 'r-shadow', title: 'Three rounds of shadowboxing', detail: 'Three minutes on, one off. Hands up, chin down.', minutes: 11, tags: { combat: 1, discipline: 0.4 } },
  { id: 'r-lights', title: 'Lights out by 11', detail: 'Charge your phone in another room.', minutes: 0, tags: { recovery: 1, discipline: 0.5, monkmode: 0.8 } },
  { id: 'r-pourover', title: 'Make coffee slowly, no screens', detail: 'Grind, bloom, pour. Four minutes of nothing else.', minutes: 5, tags: { coffee: 1, analog: 0.6 } },
  { id: 'r-pushups', title: 'One set of push-ups to failure', detail: 'Count them. Beat it next week.', minutes: 2, tags: { lifting: 0.9, discipline: 0.5 } },
]

export const RITUALS: RitualItem[] = RAW_RITUALS.map((r, i) => ({ ...r, type: 'ritual', createdAt: daysAgo(40 + i), popularity: 0.5 }))
