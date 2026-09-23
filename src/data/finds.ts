import type { FindItem, Shop } from './types'
import { daysAgo } from './time'

// Prototype catalog: every shop and product here is invented sample data.
// In production these come from partner feeds and community "scout" submissions.
export const SHOPS: Shop[] = [
  { id: 'terrace-archive', name: 'Terrace Archive', blurb: 'Two collectors, one lock-up, 4,000 pre-2000 football shirts.', location: 'Leeds, UK', url: 'https://example.com/terrace-archive' },
  { id: 'kit-room', name: 'Kit Room Co.', blurb: 'Retro football mystery boxes, graded by condition.', location: 'Manchester, UK', url: 'https://example.com/kit-room' },
  { id: 'dog-ear', name: 'Dog-Ear Press', blurb: 'Pocket books and notebooks, bound by hand.', location: 'Portland, OR', url: 'https://example.com/dog-ear' },
  { id: 'loopwheel-lab', name: 'Loopwheel Lab', blurb: 'Heavyweight basics knit slow on vintage machines.', location: 'Los Angeles, CA', url: 'https://example.com/loopwheel-lab' },
  { id: 'second-life', name: 'Second Life Surplus', blurb: 'Deadstock European workwear and military surplus.', location: 'Lyon, FR', url: 'https://example.com/second-life' },
  { id: 'low-profile', name: 'Low Profile Supply', blurb: 'Small-run trainers from a family factory.', location: 'Porto, PT', url: 'https://example.com/low-profile' },
  { id: 'brass-loop', name: 'Brass Loop', blurb: 'Recycled silver and brass, cast in a garage studio.', location: 'Austin, TX', url: 'https://example.com/brass-loop' },
  { id: 'second-hand', name: 'Second Hand Society', blurb: 'A three-person watch micro-brand. Field watches under $200.', location: 'Brooklyn, NY', url: 'https://example.com/second-hand' },
  { id: 'field-apothecary', name: 'Field Apothecary', blurb: 'Farm-grown botanicals, bottled in batches of 200.', location: 'Vermont', url: 'https://example.com/field-apothecary' },
  { id: 'salt-hollow', name: 'Salt Hollow', blurb: 'Minimal-ingredient skincare and sleep care.', location: 'Big Sur, CA', url: 'https://example.com/salt-hollow' },
  { id: 'keen-edge', name: 'Keen Edge Co.', blurb: 'Shaving hardware machined to last decades.', location: 'Sheffield, UK', url: 'https://example.com/keen-edge' },
  { id: 'cedar-office', name: 'Cedar Office', blurb: 'An indie perfumer working out of a converted office.', location: 'Kyoto, JP', url: 'https://example.com/cedar-office' },
  { id: 'iron-monk', name: 'Iron Monk Supply', blurb: 'Hand-stitched lifting gear from a garage gym.', location: 'Columbus, OH', url: 'https://example.com/iron-monk' },
  { id: 'early-miles', name: 'Early Miles', blurb: 'Run club kit designed by a run club.', location: 'Melbourne, AU', url: 'https://example.com/early-miles' },
  { id: 'southpaw', name: 'Southpaw Goods', blurb: 'Fight gear sourced direct from Thai camps.', location: 'Chiang Mai, TH', url: 'https://example.com/southpaw' },
  { id: 'low-fire', name: 'Low Fire Roasters', blurb: 'Roasts 12kg a week. Sells out most of them.', location: 'Oakland, CA', url: 'https://example.com/low-fire' },
  { id: 'crate-theory', name: 'Crate Theory', blurb: 'Reissues and record care, picked by one obsessive.', location: 'Osaka, JP', url: 'https://example.com/crate-theory' },
  { id: 'ridgeback', name: 'Ridgeback Supply', blurb: 'Merino and trail gear that works in town too.', location: 'Boulder, CO', url: 'https://example.com/ridgeback' },
  { id: 'hearth-steel', name: 'Hearth & Steel', blurb: 'Carbon steel cookware spun by hand.', location: 'Minneapolis, MN', url: 'https://example.com/hearth-steel' },
]

export const SHOP_BY_ID: Record<string, Shop> = Object.fromEntries(SHOPS.map((s) => [s.id, s]))

type F = Omit<FindItem, 'type' | 'createdAt' | 'popularity' | 'source' | 'no'> & { age: number; pop: number }

const RAW: F[] = [
  // Football / blokecore
  { id: 'f-hoops', name: "Hooped '94-style home shirt", shop: 'terrace-archive', price: 68, blurb: 'Unbranded reissue of a classic hooped home kit. Heavy jacquard knit, lace-up collar, fits like the originals did.', art: { kind: 'shirt', colors: ['#DDE7DC', '#1F6B3A', '#F4F1E6'], pattern: 'hoops', mark: '7' }, tags: { soccer: 0.7, vintage: 0.8, streetwear: 0.4, blokecore: 1 }, age: 2, pop: 0.8 },
  { id: 'f-keeper', name: "Geo-print goalkeeper jersey, '90", shop: 'terrace-archive', price: 120, blurb: 'Loud keeper shirts are the grail of the terrace scene. Deadstock, never worn, tags still on.', art: { kind: 'shirt', colors: ['#F2E6C9', '#E0662A', '#1E2A5A'], pattern: 'chevron', mark: '1' }, tags: { soccer: 0.7, vintage: 1, streetwear: 0.5, blokecore: 1 }, age: 5, pop: 0.75 },
  { id: 'f-pinstripe', name: 'Pinstripe away shirt', shop: 'terrace-archive', price: 74, blurb: "Late-'90s Italian league energy. Navy pinstripe, button placket, wear it with pleated trousers.", art: { kind: 'shirt', colors: ['#E6E8EF', '#1C2B4F', '#E9EDF7'], pattern: 'pinstripe', mark: '10' }, tags: { soccer: 0.6, vintage: 0.7, streetwear: 0.5, tailoring: 0.3, blokecore: 1 }, age: 9, pop: 0.6 },
  { id: 'f-sash', name: 'Sash-front shirt', shop: 'terrace-archive', price: 70, blurb: 'The diagonal sash, South American style. One of the most copied shirt designs ever, done right.', art: { kind: 'shirt', colors: ['#F1ECE2', '#F7F5EF', '#C7302B'], pattern: 'sash', mark: '9' }, tags: { soccer: 0.8, vintage: 0.6, blokecore: 0.9 }, age: 14, pop: 0.55 },
  { id: 'f-drill', name: "Quarter-zip terrace drill top, '88", shop: 'second-life', price: 58, blurb: 'Training tops were never meant to be fashion. That is exactly why they are now.', art: { kind: 'jacket', colors: ['#E3E0EE', '#3A2F6B', '#E8C547'], pattern: 'halves' }, tags: { soccer: 0.6, vintage: 0.7, streetwear: 0.6, blokecore: 0.9 }, age: 3, pop: 0.6 },
  { id: 'f-barscarf', name: 'Wool bar scarf, club-neutral', shop: 'terrace-archive', price: 32, blurb: 'Matchday bar scarf in lambswool without a crest, so it goes with everything you own.', art: { kind: 'scarf', colors: ['#EEE3D6', '#7E1F2B', '#E7D7B4'] }, tags: { soccer: 0.7, vintage: 0.5, accessories: 0.5, blokecore: 0.7 }, age: 20, pop: 0.45 },
  { id: 'f-mysterybox', name: 'Mystery retro shirt box (3)', shop: 'kit-room', price: 99, sponsored: true, blurb: 'Three random pre-2000 shirts in your size, condition-graded. Collectors live for the unboxing.', art: { kind: 'shirt', colors: ['#E8E1F3', '#1B1B1B', '#E8C547'], pattern: 'stripes', mark: '?' }, tags: { soccer: 0.8, vintage: 0.8, blokecore: 1 }, age: 1, pop: 0.7 },
  { id: 'f-groundhop', name: "The Groundhopper's Notebook", shop: 'dog-ear', price: 18, blurb: 'Log every stadium you visit: capacity, pie rating, view from the away end. Pocket-sized.', art: { kind: 'book', colors: ['#E4ECE3', '#2E5E3F', '#F2E9D0'], mark: 'GROUNDS' }, tags: { soccer: 0.6, travel: 0.8, reading: 0.4, groundhopper: 1 }, age: 6, pop: 0.5 },

  // Threads
  { id: 'f-boxytee', name: '14oz loopwheel boxy tee', shop: 'loopwheel-lab', price: 64, blurb: 'Knit slow on old loopwheel machines, so there are no side seams. Heavy enough to hang like a jacket.', art: { kind: 'shirt', colors: ['#E9E6DF', '#2B2B2B', '#2B2B2B'], pattern: 'plain' }, tags: { streetwear: 1, vintage: 0.3 }, age: 4, pop: 0.8 },
  { id: 'f-workjacket', name: 'Deadstock French work jacket', shop: 'second-life', price: 145, blurb: "Moleskin chore coat from a '70s depot, never issued. Cobalt fades beautifully.", art: { kind: 'jacket', colors: ['#DEE3F2', '#2448C9', '#1A2E7A'], pattern: 'plain' }, tags: { vintage: 1, streetwear: 0.6, tailoring: 0.3, heirloom: 0.4 }, age: 8, pop: 0.75 },
  { id: 'f-terracetrainer', name: 'Suede terrace trainers, gum sole', shop: 'low-profile', price: 110, blurb: 'Low profile, soft suede, gum sole. The shoe the terraces wore before anyone called it a trend.', art: { kind: 'sneaker', colors: ['#EFE6DA', '#2F4E7A', '#C98B45'] }, tags: { sneakers: 1, streetwear: 0.6, soccer: 0.3, blokecore: 0.6 }, age: 2, pop: 0.85 },
  { id: 'f-bandana', name: 'Hand-dyed indigo bandana', shop: 'second-life', price: 22, blurb: 'Dipped 14 times by hand. Neck, pocket, bag handle, wherever.', art: { kind: 'scarf', colors: ['#E0E6EE', '#23395B', '#DCE3EC'] }, tags: { accessories: 0.8, vintage: 0.5, streetwear: 0.4 }, age: 18, pop: 0.4 },
  { id: 'f-crossbody', name: 'Military-issue nylon crossbody', shop: 'second-life', price: 48, blurb: 'Original surplus field bag, cut down and re-strapped. Fits phone, keys, a paperback.', art: { kind: 'bag', colors: ['#E6E8DD', '#4A5536', '#1E1E1E'] }, tags: { accessories: 0.7, streetwear: 0.6, travel: 0.4, gorpcore: 0.4 }, age: 11, pop: 0.55 },
  { id: 'f-figaro', name: 'Sterling Figaro chain, 3mm', shop: 'brass-loop', price: 85, blurb: 'Recycled sterling, cast in small batches. Thin enough for every day, heavy enough to feel.', art: { kind: 'chain', colors: ['#ECE9E4', '#A8ADB4', '#6E747C'] }, tags: { accessories: 1, streetwear: 0.4 }, age: 7, pop: 0.7 },
  { id: 'f-signet', name: 'Blank-face signet ring', shop: 'brass-loop', price: 120, blurb: 'Recycled silver with a flat face, ready for your initials or a crest you design yourself.', art: { kind: 'ring', colors: ['#EEEAE3', '#B7BCC2', '#7B8189'] }, tags: { accessories: 1, vintage: 0.4, heirloom: 0.6 }, age: 12, pop: 0.6 },
  { id: 'f-fieldwatch', name: 'Field watch, 38mm, sandwich dial', shop: 'second-hand', price: 189, blurb: 'Lume that glows through a cut-out dial, 100m water resistance, and a price the big brands laugh at.', art: { kind: 'watch', colors: ['#E4E7DE', '#2F3B2A', '#E9DDB4'] }, tags: { watches: 1, trail: 0.3, heirloom: 0.6, accessories: 0.3 }, age: 5, pop: 0.8 },
  { id: 'f-nato', name: 'Vintage-style strap pack (3)', shop: 'second-hand', price: 28, blurb: 'Three seatbelt-weave straps. Swapping straps is the cheapest way to get a new watch.', art: { kind: 'watch', colors: ['#EEE6DE', '#7A2E2E', '#DAD3C5'] }, tags: { watches: 0.8, accessories: 0.5 }, age: 25, pop: 0.45 },
  { id: 'f-sixpanel', name: 'Unstructured six-panel wool cap', shop: 'loopwheel-lab', price: 42, blurb: 'Soft crown, leather strap back, no logo. Breaks in like a baseball glove.', art: { kind: 'cap', colors: ['#EAE3D8', '#5B3A29', '#C9A27A'] }, tags: { accessories: 0.6, streetwear: 0.5, vintage: 0.4 }, age: 15, pop: 0.55 },
  { id: 'f-frames', name: 'Tortoiseshell acetate frames', shop: 'brass-loop', price: 95, blurb: 'Keyhole bridge, handmade acetate. Take them to any optician for your prescription.', art: { kind: 'glasses', colors: ['#EFE7DB', '#7A4A24', '#3B2413'] }, tags: { accessories: 0.7, tailoring: 0.5, vintage: 0.3 }, age: 22, pop: 0.5 },
  { id: 'f-linen', name: 'Unlined linen overshirt', shop: 'second-life', price: 118, blurb: 'Washed Belgian linen, patch pockets, boxy cut. Over a tee in summer, under a coat in autumn.', art: { kind: 'jacket', colors: ['#EDEAE2', '#C9BFA8', '#8A7F68'], pattern: 'plain' }, tags: { tailoring: 0.8, travel: 0.4, vintage: 0.3 }, age: 10, pop: 0.6 },
  { id: 'f-silktie', name: 'Knitted silk tie, square end', shop: 'second-life', price: 55, blurb: 'The one tie that works with an overshirt and jeans. Old-stock Italian knit.', art: { kind: 'scarf', colors: ['#E8E3EC', '#3B2A55', '#3B2A55'] }, tags: { tailoring: 1, heirloom: 0.5, accessories: 0.4 }, age: 30, pop: 0.4 },

  // Self-care
  { id: 'f-faceoil', name: 'Mugwort + birch sap face oil', shop: 'field-apothecary', price: 36, blurb: 'Four ingredients, all grown or tapped on the farm. Smells like a forest after rain. Batch of 200.', art: { kind: 'bottle', colors: ['#E2EADF', '#3F5E3A', '#E8D9A8'], mark: 'Nº 4' }, tags: { skincare: 1, apothecary: 1, recovery: 0.2 }, age: 3, pop: 0.7 },
  { id: 'f-spfstick', name: 'Mineral SPF 30 stick, no white cast', shop: 'salt-hollow', price: 24, blurb: 'Zinc stick that actually rubs in clear. Lives in your pocket, no excuses.', art: { kind: 'tube', colors: ['#EEE9DF', '#F4F1EA', '#D9A441'], mark: 'SPF 30' }, tags: { skincare: 0.9, trail: 0.3, running: 0.3 }, age: 6, pop: 0.75 },
  { id: 'f-toner', name: 'Three-ingredient rice water toner', shop: 'salt-hollow', price: 19, blurb: 'Fermented rice water, glycerin, green tea. That is it. Calms razor burn in seconds.', art: { kind: 'bottle', colors: ['#EDEBE4', '#E9E4D6', '#8C9A7E'], mark: 'RICE' }, tags: { skincare: 0.9, grooming: 0.4, apothecary: 0.6 }, age: 16, pop: 0.55 },
  { id: 'f-razor', name: 'Weighted brass safety razor', shop: 'keen-edge', price: 58, blurb: 'Machined from one bar of brass. Blades cost 10 cents. Razor bumps, gone.', art: { kind: 'tube', colors: ['#EFE8DA', '#B8913F', '#6E5623'], mark: '' }, tags: { grooming: 1, heirloom: 0.4 }, age: 13, pop: 0.65 },
  { id: 'f-pomade', name: 'Matte clay pomade', shop: 'keen-edge', price: 22, blurb: 'Bentonite clay, beeswax, no fragrance fighting your cologne. Holds all day, washes out easy.', art: { kind: 'jar', colors: ['#E8E6E1', '#2B2B2B', '#D8D2C4'], mark: 'CLAY' }, tags: { grooming: 1 }, age: 21, pop: 0.5 },
  { id: 'f-beardoil', name: 'Cedar & smoke beard oil', shop: 'field-apothecary', price: 21, blurb: 'Jojoba, cedarwood, a whisper of birch tar. Makes a beard feel like a decision.', art: { kind: 'bottle', colors: ['#ECE3D6', '#6B3F22', '#E3C48E'], mark: 'CEDAR' }, tags: { grooming: 0.9, fragrance: 0.4, apothecary: 0.5 }, age: 19, pop: 0.45 },
  { id: 'f-solidcologne', name: 'Hinoki & fig solid cologne', shop: 'cedar-office', price: 30, sponsored: true, blurb: 'Pocket tin, alcohol-free, lasts all day on the wrist. Smells like a Kyoto bathhouse.', art: { kind: 'jar', colors: ['#E6EBE3', '#A7B59A', '#3E4A36'], mark: 'HINOKI' }, tags: { fragrance: 1, apothecary: 0.7, travel: 0.3 }, age: 2, pop: 0.6 },
  { id: 'f-leatheredp', name: 'Leather & tobacco eau de parfum', shop: 'cedar-office', price: 88, blurb: 'One perfumer, 50ml bottles, 300 made a season. The kind of scent people stop you to ask about.', art: { kind: 'bottle', colors: ['#EEE4D9', '#5A2E1C', '#D9B98A'], mark: 'LTHR' }, tags: { fragrance: 1, tailoring: 0.3 }, age: 9, pop: 0.65 },
  { id: 'f-sleepbalm', name: 'Magnesium sleep balm', shop: 'salt-hollow', price: 26, sponsored: true, blurb: 'Rub on feet and shoulders 30 minutes before bed. Lavender-free, for people who hate lavender.', art: { kind: 'jar', colors: ['#E5E6F0', '#2C3160', '#C9CCE4'], mark: 'Mg' }, tags: { recovery: 1, monkmode: 0.5, skincare: 0.3 }, age: 1, pop: 0.6 },
  { id: 'f-plungetimer', name: 'Cold-plunge thermometer & timer', shop: 'salt-hollow', price: 34, blurb: 'Floats in the tub, shows water temp and your time in. Three minutes at 10°C is the sweet spot.', art: { kind: 'tube', colors: ['#DEE9EF', '#2E6E8E', '#E6F2F7'], mark: '10°' }, tags: { recovery: 0.9, discipline: 0.5, monkmode: 0.4 }, age: 12, pop: 0.5 },

  // Iron, run, fight
  { id: 'f-belt', name: 'Hand-stitched 10mm lifting belt', shop: 'iron-monk', price: 95, blurb: 'Vegetable-tanned leather, saddle-stitched in a garage gym. Breaks in over a year, lasts twenty.', art: { kind: 'belt', colors: ['#EDE3D6', '#6A3B1F', '#C8A15A'] }, tags: { lifting: 1, heirloom: 0.3, discipline: 0.3 }, age: 8, pop: 0.6 },
  { id: 'f-chalk', name: 'Chalk ball & canvas pouch', shop: 'iron-monk', price: 18, blurb: 'Refillable chalk ball in a waxed canvas drawstring. Less mess, better grip.', art: { kind: 'bag', colors: ['#EEEDE8', '#D8D5CC', '#3C3C3C'] }, tags: { lifting: 0.7, trail: 0.2 }, age: 28, pop: 0.35 },
  { id: 'f-splitshorts', name: '3" split running shorts', shop: 'early-miles', price: 58, blurb: 'Designed by a run club that meets at 5:45am. Liner that does not ride up, pocket that fits a key.', art: { kind: 'shorts', colors: ['#E4EDE9', '#0F5C4D', '#F2F0E8'] }, tags: { running: 1, streetwear: 0.3, runbrew: 0.5 }, age: 4, pop: 0.65 },
  { id: 'f-wraps', name: '180" Muay Thai hand wraps', shop: 'southpaw', price: 16, blurb: 'Cotton with a little stretch, straight from a camp in Chiang Mai. Wash them after every session.', art: { kind: 'scarf', colors: ['#F0E4E1', '#B3261E', '#F3EDE7'] }, tags: { combat: 1, discipline: 0.3 }, age: 17, pop: 0.5 },
  { id: 'f-rope', name: '1lb weighted jump rope', shop: 'southpaw', price: 38, blurb: 'Ball-bearing handles, weighted cable. Ten minutes and your shoulders know about it.', art: { kind: 'chain', colors: ['#EDEDED', '#1F1F1F', '#B3261E'] }, tags: { combat: 0.7, lifting: 0.4, discipline: 0.3, stoicathlete: 0.4 }, age: 10, pop: 0.5 },

  // Mind
  { id: 'f-pocketmed', name: 'Pocket Meditations, cloth-bound', shop: 'dog-ear', price: 22, blurb: 'Marcus Aurelius in a 3×5 cloth cover. Built for a jacket pocket and a bad day.', art: { kind: 'book', colors: ['#EBE5DA', '#5C1F24', '#D8B878'], mark: 'MEDITATIONS' }, tags: { stoicism: 1, reading: 0.7, stoicathlete: 0.4 }, age: 5, pop: 0.8 },
  { id: 'f-mementomori', name: 'Brass memento mori coin', shop: 'brass-loop', price: 29, blurb: 'Carry it. Touch it before you waste an hour. Heavier than it looks.', art: { kind: 'ring', colors: ['#EDE6D6', '#B38B3A', '#6B5222'], mark: 'MM' }, tags: { stoicism: 1, accessories: 0.4, monkmode: 0.4 }, age: 11, pop: 0.7 },
  { id: 'f-planner', name: 'Undated one-page-a-day planner', shop: 'dog-ear', price: 26, blurb: 'Three priorities, one workout, one line of gratitude. Nothing else fits on the page, on purpose.', art: { kind: 'book', colors: ['#E6E8EA', '#1F2933', '#E4E7EB'], mark: 'DAILY' }, tags: { discipline: 1, monkmode: 0.6 }, age: 7, pop: 0.6 },

  // Taste
  { id: 'f-guji', name: 'Ethiopia Guji natural, 250g', shop: 'low-fire', price: 21, blurb: 'Blueberry, cocoa, a little wine. Roasted Tuesday, shipped Wednesday, gone by Friday.', art: { kind: 'bag', colors: ['#F0E6DC', '#7A3E2A', '#E9CFA2'] }, tags: { coffee: 1, runbrew: 0.6, analog: 0.4 }, age: 1, pop: 0.7 },
  { id: 'f-grinder', name: 'Conical burr hand grinder', shop: 'low-fire', price: 79, blurb: 'Grinding by hand is 40 seconds of the only quiet you get all morning.', art: { kind: 'tube', colors: ['#E7E7E3', '#3C3C3A', '#A88B5A'], mark: '' }, tags: { coffee: 0.9, analog: 0.5 }, age: 20, pop: 0.5 },
  { id: 'f-carbonpan', name: 'Carbon steel pan, pre-seasoned', shop: 'hearth-steel', price: 85, blurb: 'Spun by hand, lighter than cast iron, non-stick after a month of eggs. Your grandkids will use it.', art: { kind: 'pan', colors: ['#E9E6E1', '#2B2A28', '#8A6B4E'] }, tags: { cooking: 1, heirloom: 0.4 }, age: 9, pop: 0.6 },
  { id: 'f-chilicrisp', name: 'Small-batch Sichuan chili crisp', shop: 'hearth-steel', price: 14, blurb: 'Made in 40-jar batches with a family recipe. Eggs, noodles, ice cream (trust us).', art: { kind: 'jar', colors: ['#F2E2DA', '#A2261A', '#F2C14E'], mark: 'HOT' }, tags: { cooking: 0.9 }, age: 3, pop: 0.65 },
  { id: 'f-jazzreissue', name: "Japanese jazz reissue, 180g", shop: 'crate-theory', price: 34, blurb: "A '70s Tokyo session nobody outside Japan heard until now. Half the price of an original, pressing is flawless.", art: { kind: 'record', colors: ['#E6E3EE', '#161616', '#D9A43B'] }, tags: { vinyl: 1, analog: 0.8, vintage: 0.3 }, age: 4, pop: 0.6 },
  { id: 'f-recordbrush', name: 'Goat-hair record brush', shop: 'crate-theory', price: 19, blurb: 'Two passes before every play. Your records will outlive you.', art: { kind: 'tube', colors: ['#ECE8E1', '#3A2A1E', '#CDBA9C'], mark: '' }, tags: { vinyl: 0.8, analog: 0.5 }, age: 26, pop: 0.35 },

  // Outside
  { id: 'f-merinohood', name: '180gsm merino hoodie', shop: 'ridgeback', price: 130, sponsored: true, blurb: 'Worn 11 days straight on a trip and still did not smell. Trail in the morning, dinner at night.', art: { kind: 'jacket', colors: ['#E2E6E3', '#3E4B45', '#C0CAC4'], pattern: 'plain' }, tags: { trail: 0.8, streetwear: 0.5, gorpcore: 1, travel: 0.4 }, age: 2, pop: 0.7 },
  { id: 'f-timug', name: 'Titanium mug & spork set', shop: 'ridgeback', price: 42, blurb: 'Weighs less than your phone. Boils water over a stove, holds coffee at the summit.', art: { kind: 'mug', colors: ['#E3E7EC', '#8C96A3', '#4E5763'] }, tags: { trail: 0.9, coffee: 0.3, gorpcore: 0.5 }, age: 14, pop: 0.5 },
  { id: 'f-daypack', name: '20L packable daypack', shop: 'ridgeback', price: 96, blurb: 'Folds into its own pocket. Carry-on friendly, rain-proof, does not look like a hiking bag.', art: { kind: 'bag', colors: ['#E6E4DC', '#C4552B', '#2B2B2B'] }, tags: { travel: 0.8, trail: 0.6, gorpcore: 0.6 }, age: 6, pop: 0.6 },
  { id: 'f-dopp', name: 'Waxed canvas dopp kit', shop: 'second-life', price: 45, blurb: 'Waxed canvas, brass zip, 22 countries and counting. Buy once.', art: { kind: 'bag', colors: ['#E6E6DA', '#5E5A3A', '#B8913F'] }, tags: { travel: 0.8, grooming: 0.4, heirloom: 0.3 }, age: 24, pop: 0.5 },
]

export const FINDS: FindItem[] = RAW.map(({ age, pop, ...f }, i) => ({
  ...f,
  type: 'find',
  no: 101 + i * 7,
  source: f.shop,
  createdAt: daysAgo(age),
  popularity: pop,
}))

export const FIND_BY_ID: Record<string, FindItem> = Object.fromEntries(FINDS.map((f) => [f.id, f]))
