# NicheNotes

A For You feed for anyone that learns your taste and leads you to great things nobody has heard of yet. You get:

- products and outfits from small shops
- a quote worth keeping each morning (philosophers, athletes, artists, founders, leaders)
- daily habits
- clubs of people into the same things, with pickup games and meetups near you

This is a **working prototype**: a phone-first web app with a real recommendation engine, sample data and no backend. Everything a user does is stored on their device.

- [`docs/PRODUCT.md`](docs/PRODUCT.md): product vision, business model and roadmap.
- [`docs/DESIGN.md`](docs/DESIGN.md): the design principles (after Steve Jobs) and the token system.

## Run it

You need [Node.js](https://nodejs.org) (version 20 or newer) installed once.

1. Open Terminal and go to the project: `cd ~/nichenotes`
2. Install the building blocks (first time only): `npm install`
3. Start the app: `npm run dev`
4. Open http://localhost:5173 in your browser. Press Control + C in Terminal to stop.

Other commands:

```bash
npm test               # run the automated tests
npm run build          # check types and build the site into dist/
npm run deploy         # test, build and publish to GitHub Pages
npm run build:artifact # the whole app as one file: dist-artifact/nichenotes.html
```

## Demo tips

- **Live link:** https://keenanallaf-blckarrw.github.io/nichenotes/ (after `npm run deploy`).
- **Put it on your phone's home screen.** Open the link in Safari, tap Share, then *Add to Home Screen*. It opens full screen with its own icon, like an app.
- **Works offline.** After one visit, the hosted version keeps working with no connection.
- **Fresh start for each demo.** You › *Start over* resets onboarding; *Skip* on the first screen loads a sample taste.

## What's inside

```
src/
  engine/        The recommendation engine. Pure TypeScript, no React, fully unit-tested.
    taxonomy.ts    59 interests in 9 groups, plus 20 unlockable combinations (e.g. Retro Jerseys)
    profile.ts     Learning: signal weights, decay, unlocks
    rank.ts        Feed ranking: relevance, variety, exploration, partner slots
    explain.ts     "Why am I seeing this?" lines and the taste summary
    geo.ts         Distances, directions and privacy rounding for local features
  data/          Sample catalog: quotes (with sources), shops, finds, outfits, clubs, posts, daily habits.
                 local.ts generates sample events and posts around any area.
                 catalog.test.ts checks that every interest leads to real content.
  state/         App state (React context) and local persistence
  components/    Cards, sheets, the app shell, drawn product images
  pages/         Onboarding, For You, Discover, interest pages, Clubs, Near you, You, For brands
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
