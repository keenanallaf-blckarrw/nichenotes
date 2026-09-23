# NicheNotes

A For You feed for anyone that learns your taste and leads you to great things nobody has heard of yet. You get:

- products and outfits from small shops
- a quote worth keeping each morning (philosophers, athletes, artists, founders, leaders)
- daily habits
- clubs of people into the same things

This is a **working prototype**: a phone-first web app with a real recommendation engine, sample data and no backend. Everything a user does is stored on their device.

- [`docs/PRODUCT.md`](docs/PRODUCT.md): product vision, business model and roadmap.
- [`docs/DESIGN.md`](docs/DESIGN.md): the design principles (after Steve Jobs) and the token system.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # engine unit tests
npm run build      # typecheck + production build to dist/
```

`npm run build:artifact` produces `dist-artifact/nichenotes.html`: the whole app as one self-contained file, handy for sharing a clickable demo.

## What's inside

```
src/
  engine/        The recommendation engine. Pure TypeScript, no React, fully unit-tested.
    taxonomy.ts    59 interests in 9 groups, plus 20 unlockable combinations (e.g. Retro Jerseys)
    profile.ts     Learning: signal weights, decay, unlocks
    rank.ts        Feed ranking: relevance, variety, exploration, partner slots
    explain.ts     "Why am I seeing this?" lines and the taste summary
  data/          Sample catalog: quotes (with sources), shops, finds, outfits, clubs, posts, daily habits.
                 catalog.test.ts checks that every interest leads to real content.
  state/         App state (React context) and local persistence
  components/    Cards, sheets, the app shell, drawn product images
  pages/         Onboarding, For You, Discover, interest pages, Clubs, You, For brands
```

## How the feed learns

These actions push an interest up:

- likes
- saves
- shop taps
- time spent

"Not interested" pushes an interest down, and hiding it removes it. Anything you ignore fades with a 30-day half-life.

When two interests overlap strongly enough, a new one unlocks. For example, Soccer + Vintage becomes **Retro Jerseys**, and retro jerseys start showing up.

In every ten items:

- two slots explore interests you haven't tried yet
- one slot can go to a paid partner, but only if the product genuinely matches you

## Sample data

Shops, products, usernames and posts are invented for the prototype. Quotes are real and carry their sources; lines that are only popularly credited are marked "Attributed".
