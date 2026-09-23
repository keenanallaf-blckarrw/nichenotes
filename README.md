# NicheNotes

A For You feed for guys that learns your vibe and leads you to unknown, good stuff: niche finds and fits from small shops, words worth keeping (Caesar, Marcus Aurelius, Cruyff…), daily rituals, and crews of people into the same things.

This is a **working prototype**: a phone-first web app with a real recommendation engine, sample data and no backend. Everything a user does is stored on their device.

See [`docs/PRODUCT.md`](docs/PRODUCT.md) for the product vision, business model and roadmap.

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
  engine/        The vibe engine. Pure TypeScript, no React, fully unit-tested.
    taxonomy.ts    22 vibes in 6 worlds, plus 9 combo subcultures (e.g. Blokecore)
    profile.ts     Learning: signal weights, decay, combo unlocks
    rank.ts        Feed ranking: relevance, variety, exploration, partner slots
    explain.ts     "Why am I seeing this?" lines and the written vibe read
  data/          Sample catalog: quotes (with sources), shops, finds, fits, crews, posts, rituals
  state/         App state (React context) and local persistence
  components/    Cards, sheets, the app shell, drawn product art
  pages/         Onboarding, For You, Discover, vibe pages, Crews, profile, For Brands
```

## How the feed learns

Likes, saves, shop taps and time spent push a vibe up; "Not for me" pushes it down; mute removes it; anything ignored fades with a 30-day half-life. When two interests overlap strongly enough, a subculture unlocks: Football × Vintage becomes **Blokecore**, and retro kits start showing up. Two slots in every ten explore new vibes, and one can go to a paid partner, but only if the product genuinely matches you. Details in `docs/PRODUCT.md`.

## Sample data

Shops, products, handles and posts are invented for the prototype. Quotes are real and carry their sources; lines that are only popularly credited are marked "attributed".
