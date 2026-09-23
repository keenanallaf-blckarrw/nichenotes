import type { MentorId, QuoteItem } from './types'
import { daysAgo } from './time'

type Q = Omit<QuoteItem, 'type' | 'createdAt' | 'popularity'> & { age?: number; pop?: number }

// Sources are cited so the app never ships a fake quote. Lines that are only
// popularly credited are flagged `attributed` and shown that way in the UI.
const RAW: Q[] = [
  { id: 'q-veni', text: 'Veni, vidi, vici.', translation: 'I came, I saw, I conquered.', author: 'Julius Caesar', source: 'After the Battle of Zela, 47 BC (Suetonius, Plutarch)', mentor: 'caesar', tags: { discipline: 0.6, stoicism: 0.2 }, pop: 0.9 },
  { id: 'q-alea', text: 'Alea iacta est.', translation: 'The die is cast.', author: 'Julius Caesar', source: 'Crossing the Rubicon, 49 BC (Suetonius)', mentor: 'caesar', tags: { discipline: 0.7 }, pop: 0.85 },
  { id: 'q-believe', text: 'Men willingly believe what they wish.', author: 'Julius Caesar', source: 'De Bello Gallico, III.18', mentor: 'caesar', tags: { stoicism: 0.6, reading: 0.4 }, pop: 0.5 },
  { id: 'q-experience', text: 'Experience is the teacher of all things.', author: 'Julius Caesar', source: 'De Bello Civili, II.8', mentor: 'caesar', tags: { discipline: 0.6, reading: 0.3 }, pop: 0.55 },
  { id: 'q-cowards', text: 'Cowards die many times before their deaths; the valiant never taste of death but once.', author: 'Caesar, in Shakespeare', source: 'Julius Caesar, Act II, Scene 2', mentor: 'caesar', tags: { discipline: 0.5, reading: 0.5, combat: 0.3 }, pop: 0.6 },
  { id: 'q-impediment', text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius', source: 'Meditations, V.20', mentor: 'marcus', tags: { stoicism: 1, discipline: 0.4 }, pop: 0.95 },
  { id: 'q-beone', text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius', source: 'Meditations, X.16', mentor: 'marcus', tags: { stoicism: 0.9, discipline: 0.6 }, pop: 0.9 },
  { id: 'q-littleneeded', text: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.', author: 'Marcus Aurelius', source: 'Meditations, VII.67', mentor: 'marcus', tags: { stoicism: 1, recovery: 0.2 }, pop: 0.7 },
  { id: 'q-notright', text: 'If it is not right, do not do it; if it is not true, do not say it.', author: 'Marcus Aurelius', source: 'Meditations, XII.17', mentor: 'marcus', tags: { stoicism: 0.9 }, pop: 0.6 },
  { id: 'q-imagination', text: 'We suffer more often in imagination than in reality.', author: 'Seneca', source: 'Letters to Lucilius, XIII', mentor: 'marcus', tags: { stoicism: 1, recovery: 0.3 }, pop: 0.85 },
  { id: 'q-shortlife', text: 'It is not that we have a short time to live, but that we waste a lot of it.', author: 'Seneca', source: 'On the Shortness of Life, I', mentor: 'marcus', tags: { discipline: 0.8, stoicism: 0.7 }, pop: 0.8 },
  { id: 'q-disturbed', text: 'Men are disturbed not by things, but by the views which they take of things.', author: 'Epictetus', source: 'Enchiridion, 5', mentor: 'marcus', tags: { stoicism: 1 }, pop: 0.7 },
  { id: 'q-saytoyourself', text: 'First say to yourself what you would be; and then do what you have to do.', author: 'Epictetus', source: 'Discourses, III.23', mentor: 'marcus', tags: { discipline: 0.9, lifting: 0.3, stoicism: 0.5 }, pop: 0.75 },
  { id: 'q-nouse', text: 'Do nothing that is of no use.', author: 'Miyamoto Musashi', source: 'The Book of Five Rings', mentor: 'musashi', tags: { discipline: 1, combat: 0.4 }, pop: 0.7 },
  { id: 'q-regret', text: 'Do not regret what you have done.', author: 'Miyamoto Musashi', source: 'Dokkōdō, The Path of Aloneness', mentor: 'musashi', tags: { stoicism: 0.7, combat: 0.3 }, pop: 0.5 },
  { id: 'q-winfirst', text: 'Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.', author: 'Sun Tzu', source: 'The Art of War, IV', mentor: 'musashi', tags: { discipline: 0.9, combat: 0.4 }, pop: 0.8 },
  { id: 'q-molon', text: 'Molon labe.', translation: 'Come and take them.', author: 'Leonidas', source: 'Thermopylae, 480 BC (Plutarch, Sayings of Spartans)', mentor: 'caesar', tags: { combat: 0.7, lifting: 0.5 }, pop: 0.65 },
  { id: 'q-simplefootball', text: 'Playing football is very simple, but playing simple football is the hardest thing there is.', author: 'Johan Cruyff', source: 'Interview, widely quoted', mentor: 'cruyff', tags: { soccer: 1, discipline: 0.3 }, pop: 0.9 },
  { id: 'q-disadvantage', text: 'Every disadvantage has its advantage.', author: 'Johan Cruyff', source: '"Elk nadeel heb z\'n voordeel"', mentor: 'cruyff', tags: { soccer: 0.8, stoicism: 0.5 }, pop: 0.7 },
  { id: 'q-lifedeath', text: 'Some people believe football is a matter of life and death. I can assure you it is much, much more important than that.', author: 'Bill Shankly', source: 'TV interview, 1981', mentor: 'cruyff', tags: { soccer: 1 }, pop: 0.85 },
  { id: 'q-noaccident', text: 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.', author: 'Pelé', source: 'Widely quoted', mentor: 'cruyff', tags: { soccer: 0.8, discipline: 0.7 }, pop: 0.8 },
  { id: 'q-absorb', text: 'Absorb what is useful, discard what is useless, and add what is specifically your own.', author: 'Bruce Lee', source: 'Tao of Jeet Kune Do', mentor: 'bruce', tags: { combat: 0.8, discipline: 0.6, streetwear: 0.2 }, pop: 0.9 },
  { id: 'q-champion', text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: 'Muhammad Ali', source: 'Widely quoted', mentor: 'bruce', tags: { combat: 1, lifting: 0.5, discipline: 0.7 }, pop: 0.9 },
  { id: 'q-plan', text: 'Everybody has a plan until they get punched in the mouth.', author: 'Mike Tyson', source: 'Widely quoted', mentor: 'bruce', tags: { combat: 1, stoicism: 0.3 }, pop: 0.85 },
  { id: 'q-arena', text: 'It is not the critic who counts… The credit belongs to the man who is actually in the arena.', author: 'Theodore Roosevelt', source: '"Citizenship in a Republic", Paris, 1910', mentor: 'caesar', tags: { discipline: 0.8, combat: 0.3, stoicism: 0.4 }, pop: 0.85 },
  { id: 'q-habit', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant', source: 'The Story of Philosophy, 1926 (summarising Aristotle; often misattributed to him)', mentor: 'marcus', tags: { discipline: 1, reading: 0.3, lifting: 0.2 }, pop: 0.8 },
  { id: 'q-findaway', text: 'I will either find a way or make one.', author: 'Hannibal', source: 'Traditional', attributed: true, mentor: 'caesar', tags: { discipline: 0.8, travel: 0.3 }, pop: 0.6 },
  { id: 'q-rise', text: 'Everything negative — pressure, challenges — is all an opportunity for me to rise.', author: 'Kobe Bryant', source: 'Widely quoted', mentor: 'bruce', tags: { discipline: 0.8, lifting: 0.4 }, pop: 0.75 },
  { id: 'q-buyless', text: 'Buy less, choose well, make it last.', author: 'Vivienne Westwood', source: 'Widely quoted', tags: { vintage: 0.8, tailoring: 0.5, streetwear: 0.4 }, pop: 0.7 },
  { id: 'q-pain', text: 'Pain is inevitable. Suffering is optional.', author: 'Haruki Murakami, quoting a runner', source: 'What I Talk About When I Talk About Running', tags: { running: 1, stoicism: 0.5 }, pop: 0.75 },
  { id: 'q-marathon', text: 'If you want to run, run a mile. If you want to experience a different life, run a marathon.', author: 'Emil Zátopek', source: 'Traditional', attributed: true, tags: { running: 1, discipline: 0.4 }, pop: 0.6 },
  { id: 'q-thousandlives', text: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.', author: 'George R. R. Martin', source: 'A Dance with Dragons', tags: { reading: 1 }, pop: 0.7 },
  { id: 'q-wander', text: 'Not all those who wander are lost.', author: 'J. R. R. Tolkien', source: 'The Fellowship of the Ring', tags: { travel: 1, trail: 0.6 }, pop: 0.7 },
  { id: 'q-muir', text: 'In every walk with nature one receives far more than he seeks.', author: 'John Muir', source: 'Widely quoted', tags: { trail: 1, recovery: 0.3 }, pop: 0.55 },
  { id: 'q-amusement', text: "Your body is not a temple, it's an amusement park. Enjoy the ride.", author: 'Anthony Bourdain', source: 'Kitchen Confidential', tags: { cooking: 1, travel: 0.5 }, pop: 0.7 },
  { id: 'q-music', text: 'Without music, life would be a mistake.', author: 'Friedrich Nietzsche', source: 'Twilight of the Idols', tags: { vinyl: 1, reading: 0.3 }, pop: 0.6 },
  { id: 'q-sleep', text: 'Sleep is that golden chain that ties health and our bodies together.', author: 'Thomas Dekker', source: "The Gull's Hornbook, 1609", tags: { recovery: 1, discipline: 0.3 }, pop: 0.5 },
  { id: 'q-thousandmiles', text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', source: 'Tao Te Ching, 64', tags: { travel: 0.6, discipline: 0.6, trail: 0.3 }, pop: 0.7 },
  { id: 'q-punctual', text: 'Punctuality is the soul of business.', author: 'Thomas Chandler Haliburton', source: 'Widely quoted', tags: { watches: 0.7, discipline: 0.5 }, pop: 0.4 },
]

export const QUOTES: QuoteItem[] = RAW.map(({ age, pop, ...q }) => ({
  ...q,
  type: 'quote',
  createdAt: daysAgo(age ?? 30),
  popularity: pop ?? 0.5,
}))

export const MENTORS: { id: MentorId; name: string; line: string; tags: Record<string, number> }[] = [
  { id: 'caesar', name: 'Caesar', line: 'Cross the Rubicon. No hedging.', tags: { discipline: 0.6, travel: 0.2 } },
  { id: 'marcus', name: 'Marcus Aurelius', line: 'Calm under pressure. Control what you can.', tags: { stoicism: 0.8 } },
  { id: 'musashi', name: 'Musashi', line: 'Master the craft. Waste nothing.', tags: { discipline: 0.6, combat: 0.4 } },
  { id: 'cruyff', name: 'Cruyff', line: 'Make the hard thing look simple.', tags: { soccer: 0.8 } },
  { id: 'bruce', name: 'Bruce Lee', line: 'Be water. Keep what works.', tags: { combat: 0.6, discipline: 0.4 } },
]
