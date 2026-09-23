import type { Crew, FitItem, PostItem, RitualItem } from './types'
import { daysAgo } from './time'

export const CREWS: Crew[] = [
  { id: 'terrace-club', name: 'Terrace Club', blurb: 'Retro kits, matchday fits, thrift finds.', tags: { soccer: 1, blokecore: 1, vintage: 0.4 }, members: 18400 },
  { id: 'groundhoppers', name: 'Groundhoppers', blurb: 'Stadium counts, away days, pie reviews.', tags: { soccer: 0.8, travel: 0.8, groundhopper: 1 }, members: 4100 },
  { id: 'morning-stoics', name: 'Morning Stoics', blurb: 'One passage a day. Talk about it.', tags: { stoicism: 1, reading: 0.4 }, members: 22700 },
  { id: 'monk-mode', name: 'Monk Mode', blurb: '5am, phone down, lights out at 11.', tags: { discipline: 1, recovery: 0.6, monkmode: 1 }, members: 15200 },
  { id: 'apothecary', name: 'Apothecary', blurb: 'Unknown skincare and scent that actually works.', tags: { skincare: 0.8, fragrance: 0.8, grooming: 0.6, apothecary: 1 }, members: 9800 },
  { id: 'threads', name: 'Threads', blurb: 'Deadstock, heavyweights, fits of the day.', tags: { streetwear: 1, vintage: 0.8, sneakers: 0.5 }, members: 26300 },
  { id: 'heirloom', name: 'Heirloom', blurb: 'Watches, signets, things you buy once.', tags: { watches: 1, accessories: 0.7, tailoring: 0.6, heirloom: 1 }, members: 7600 },
  { id: 'iron-and-ring', name: 'Iron & Ring', blurb: 'Lifting, fight camps, recovery.', tags: { lifting: 1, combat: 1, stoicathlete: 0.6 }, members: 12900 },
  { id: 'run-and-brew', name: 'Run & Brew', blurb: 'Saturday miles, then a tiny roaster.', tags: { running: 1, coffee: 0.8, runbrew: 1 }, members: 6300 },
  { id: 'analog-hours', name: 'Analog Hours', blurb: 'Records, paperbacks, pour-over.', tags: { vinyl: 1, reading: 0.7, coffee: 0.4, analog: 1 }, members: 5400 },
  { id: 'trail-mix', name: 'Trail Mix', blurb: 'Merino, daypacks, carry-on only.', tags: { trail: 1, travel: 0.8, gorpcore: 1 }, members: 8800 },
  { id: 'the-pass', name: 'The Pass', blurb: 'Carbon steel, chili crisp, cooking for people.', tags: { cooking: 1 }, members: 4700 },
]

export const CREW_BY_ID: Record<string, Crew> = Object.fromEntries(CREWS.map((c) => [c.id, c]))

type P = Omit<PostItem, 'type' | 'createdAt' | 'popularity' | 'tags' | 'source'> & { hoursAgo: number }

// Sample community posts for the prototype. Handles are invented.
const RAW_POSTS: P[] = [
  { id: 'p-carboot', author: 'terrace_tom', crew: 'terrace-club', text: 'Found a lace-collar keeper shirt at a car boot sale for £4. Seller had no idea. Best thrift kit find, go.', likes: 842, replies: 131, hoursAgo: 3 },
  { id: 'p-wedding', author: 'lagos_left_back', crew: 'terrace-club', text: "Wore a '98 away shirt with pleated trousers to a wedding. Mixed reviews. Would do it again.", likes: 1290, replies: 204, hoursAgo: 20 },
  { id: 'p-grounds', author: 'away_days_ali', crew: 'groundhoppers', text: 'Stadium count: 37. Rule I live by: the lower the league, the better the pie.', likes: 388, replies: 72, hoursAgo: 9 },
  { id: 'p-layoff', author: 'stoic_steve', crew: 'morning-stoics', text: 'Meditations V.20 got me through a layoff this week. "The obstacle is the way" is not a slogan. It is a practice.', likes: 2104, replies: 188, hoursAgo: 6 },
  { id: 'p-day41', author: 'quietgrind', crew: 'monk-mode', text: 'Day 41 of 5am and no phone until 9. Did not expect it to change my skin, but it did. Sleep is the cheat code.', likes: 1570, replies: 96, hoursAgo: 11 },
  { id: 'p-solidcologne', author: 'oud_hands', crew: 'apothecary', text: 'PSA: solid colognes are criminally slept on. Tin in the pocket, reapply at lunch, zero alcohol burn.', likes: 634, replies: 58, hoursAgo: 14 },
  { id: 'p-faceoil', author: 'field_notes_fin', crew: 'apothecary', text: 'A 4-ingredient face oil from a farm in Vermont beat my $90 serum. Unknown brands hit different.', likes: 921, replies: 110, hoursAgo: 30 },
  { id: 'p-razor', author: 'no_more_razorburn', crew: 'apothecary', text: 'Switched to a safety razor six months ago. Bumps gone, saving about $80 a year on cartridges.', likes: 512, replies: 64, hoursAgo: 40 },
  { id: 'p-mall', author: 'ring_finger', crew: 'heirloom', text: 'Stop buying mall jewelry. One sterling chain, one signet, wear them every day for ten years.', likes: 1188, replies: 143, hoursAgo: 8 },
  { id: 'p-microbrand', author: 'watch_nerd_noah', crew: 'heirloom', text: 'Micro-brand field watches under $200 are the best value in watches right now. Change my mind.', likes: 702, replies: 219, hoursAgo: 26 },
  { id: 'p-workjacket', author: 'vintage_vik', crew: 'threads', text: 'Deadstock French work jackets are drying up. If you see a moleskin one in your size, do not think, just buy.', likes: 954, replies: 77, hoursAgo: 5 },
  { id: 'p-heavytee', author: 'fourteen_oz', crew: 'threads', text: 'Once you wear a 14oz tee you cannot go back. Everything else feels like a napkin.', likes: 1402, replies: 165, hoursAgo: 17 },
  { id: 'p-belt', author: 'the_iron_monk', crew: 'iron-and-ring', text: 'Hand-stitched belts break in like a baseball glove. Mine is 8 years old and just getting good.', likes: 433, replies: 41, hoursAgo: 22 },
  { id: 'p-wraps', author: 'southpaw_sam', crew: 'iron-and-ring', text: 'Cotton wraps over gel inners. Fight me (in the gym).', likes: 611, replies: 97, hoursAgo: 35 },
  { id: 'p-runclub', author: 'miles_before_coffee', crew: 'run-and-brew', text: 'Our run club ends at a different indie roaster every Saturday. 14 roasters in, Guji naturals still undefeated.', likes: 780, replies: 88, hoursAgo: 12 },
  { id: 'p-jazz', author: 'crate_digger_dan', crew: 'analog-hours', text: 'Japanese jazz reissues are the move right now. Half the price of originals and the pressings are unreal.', likes: 566, replies: 71, hoursAgo: 28 },
  { id: 'p-20pages', author: 'bookmark_ben', crew: 'analog-hours', text: '20 pages a night is about 25 books a year. That is the whole trick.', likes: 1830, replies: 120, hoursAgo: 48 },
  { id: 'p-merino', author: 'gorp_dad', crew: 'trail-mix', text: 'Merino hoodie, 11 days straight on a trip. Does not smell. I am a believer.', likes: 690, replies: 83, hoursAgo: 16 },
  { id: 'p-dopp', author: 'nomad_nate', crew: 'trail-mix', text: 'Waxed canvas dopp kit: 6 years, 22 countries. Buy once, cry once.', likes: 402, replies: 39, hoursAgo: 60 },
  { id: 'p-pan', author: 'pan_handler', crew: 'the-pass', text: 'Carbon steel pan: 3 months of eggs and it is properly non-stick now. Seasoning is a hobby.', likes: 520, replies: 66, hoursAgo: 19 },
  { id: 'p-plunge', author: 'chill_plunge', crew: 'monk-mode', text: '3 minutes cold plunge, then sauna, three rounds. Sleep score jumped 12 points in a week. AMA.', likes: 874, replies: 152, hoursAgo: 7 },
]

export function postFromRaw(p: P): PostItem {
  const crew = CREW_BY_ID[p.crew]
  const { hoursAgo, ...rest } = p
  return {
    ...rest,
    type: 'post',
    tags: crew.tags,
    source: p.crew,
    createdAt: Date.now() - hoursAgo * 3_600_000,
    popularity: Math.min(1, p.likes / 2200),
  }
}

export const POSTS: PostItem[] = RAW_POSTS.map(postFromRaw)

const RAW_FITS: Omit<FitItem, 'type' | 'createdAt' | 'popularity'>[] = [
  { id: 'fit-sundayleague', label: 'Fit', name: 'Sunday League to Sunday Roast', blurb: 'Retro hoops, gum soles, a wool cap. Straight from the pitch to the pub.', findIds: ['f-hoops', 'f-terracetrainer', 'f-sixpanel', 'f-barscarf'], tags: { soccer: 0.7, streetwear: 0.5, vintage: 0.5, blokecore: 1 } },
  { id: 'fit-awayday', label: 'Fit', name: 'Away Day', blurb: 'Drill top, crossbody, suede. Built for a train, a terrace and a late one.', findIds: ['f-drill', 'f-crossbody', 'f-terracetrainer', 'f-groundhop'], tags: { soccer: 0.6, travel: 0.6, streetwear: 0.5, groundhopper: 0.8, blokecore: 0.7 } },
  { id: 'fit-quietmonday', label: 'Fit', name: 'Quiet Monday', blurb: 'Linen, a knit tie, a field watch. Dressed up without trying.', findIds: ['f-linen', 'f-silktie', 'f-fieldwatch', 'f-frames'], tags: { tailoring: 1, watches: 0.5, accessories: 0.4, heirloom: 0.8 } },
  { id: 'fit-trailtown', label: 'Fit', name: 'Trail to Town', blurb: 'Merino, a packable daypack, a watch that can take a knock.', findIds: ['f-merinohood', 'f-daypack', 'f-timug', 'f-fieldwatch'], tags: { trail: 0.8, travel: 0.5, streetwear: 0.4, gorpcore: 1 } },
  { id: 'fit-heavyweight', label: 'Fit', name: 'Heavyweight Basics', blurb: 'One great tee, one chain, one ring. The uniform.', findIds: ['f-boxytee', 'f-figaro', 'f-signet', 'f-sixpanel'], tags: { streetwear: 0.9, accessories: 0.8 } },
  { id: 'kit-monk', label: 'Kit', name: 'Monk Mode Kit', blurb: 'Planner, pocket Meditations, a coin to remind you, a balm to knock you out.', findIds: ['f-planner', 'f-pocketmed', 'f-mementomori', 'f-sleepbalm'], tags: { discipline: 0.8, stoicism: 0.7, recovery: 0.4, monkmode: 1 } },
  { id: 'kit-apothecary', label: 'Kit', name: 'The Apothecary Shelf', blurb: 'Four small-batch things that replace ten mall things.', findIds: ['f-faceoil', 'f-toner', 'f-spfstick', 'f-solidcologne'], tags: { skincare: 0.9, fragrance: 0.6, apothecary: 1 } },
  { id: 'kit-runbrew', label: 'Kit', name: 'Saturday Run & Brew', blurb: 'Split shorts, SPF, a bag of Guji for when you get home.', findIds: ['f-splitshorts', 'f-spfstick', 'f-guji', 'f-grinder'], tags: { running: 0.8, coffee: 0.7, runbrew: 1 } },
  { id: 'kit-shave', label: 'Kit', name: 'The Proper Shave', blurb: 'Brass razor, rice toner, clay for after. Ten minutes, zero bumps.', findIds: ['f-razor', 'f-toner', 'f-pomade', 'f-dopp'], tags: { grooming: 1, skincare: 0.5 } },
]

export const FITS: FitItem[] = RAW_FITS.map((f, i) => ({ ...f, type: 'fit', createdAt: daysAgo(3 + i * 2), popularity: 0.7 - i * 0.03 }))

const RAW_RITUALS: Omit<RitualItem, 'type' | 'createdAt' | 'popularity'>[] = [
  { id: 'r-cold', title: 'Two-minute cold finish', detail: 'End your shower on full cold. Breathe slow through the nose.', minutes: 2, tags: { recovery: 0.9, discipline: 0.7, monkmode: 0.5 } },
  { id: 'r-pages', title: '10 pages before your phone', detail: 'Book first, feed later. Any book counts.', minutes: 15, tags: { reading: 1, discipline: 0.6 } },
  { id: 'r-spf', title: 'SPF, even when it is cloudy', detail: 'UV goes straight through clouds. Face, neck, ears.', minutes: 1, tags: { skincare: 1 } },
  { id: 'r-walk', title: 'Walk 20 minutes, no headphones', detail: 'Let your head wander. Outside if you can.', minutes: 20, tags: { trail: 0.6, stoicism: 0.6, recovery: 0.4 } },
  { id: 'r-control', title: 'One line: what is in your control today?', detail: 'Write it down. Ignore everything else until lunch.', minutes: 2, tags: { stoicism: 1, discipline: 0.5 } },
  { id: 'r-touches', title: '100 touches', detail: 'Keepy-uppies, wall passes, whatever. Just 100 touches.', minutes: 5, tags: { soccer: 1, discipline: 0.3 } },
  { id: 'r-shadow', title: 'Three rounds of shadowboxing', detail: 'Three minutes on, one off. Hands up, chin down.', minutes: 11, tags: { combat: 1, discipline: 0.4 } },
  { id: 'r-lights', title: 'Lights out by 11', detail: 'Phone charging in another room.', minutes: 0, tags: { recovery: 1, discipline: 0.5, monkmode: 0.8 } },
  { id: 'r-pourover', title: 'Slow brew, no screens', detail: 'Grind, bloom, pour. Four minutes of nothing else.', minutes: 5, tags: { coffee: 1, analog: 0.6 } },
  { id: 'r-pushups', title: 'One set of push-ups to failure', detail: 'Count them. Beat it next week.', minutes: 2, tags: { lifting: 0.9, discipline: 0.5 } },
]

export const RITUALS: RitualItem[] = RAW_RITUALS.map((r, i) => ({ ...r, type: 'ritual', createdAt: daysAgo(40 + i), popularity: 0.5 }))
