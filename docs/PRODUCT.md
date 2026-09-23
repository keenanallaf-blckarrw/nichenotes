# NicheNotes: product & business plan

**One line:** a For You feed for guys that learns your vibe and leads you to unknown, good stuff (finds, fits, rituals, words worth keeping) and to the small shops that make it.

## Why this can win

- **TikTok and Amazon flatten everything.** People search TikTok for niche products and get the same 50 viral, often dropshipped, items. Nobody owns *curated and niche*.
- **Men's self-improvement is huge but has no home.** Stoicism, monk mode, men's skincare and blokecore all live scattered across TikTok, Reddit and YouTube. There's no single place built around them.
- **Small brands can't reach their people.** Meta ads are broad and expensive. A shop selling 4,000 retro football shirts needs the 20,000 guys who care, not a million who don't.

The moat is **taste + trust**: an engine that actually gets you, and a feed that never feels like an ad catalog.

## What the prototype does (v0.1)

| Feature | What it proves |
|---|---|
| Vibe check onboarding (vibes, this-or-that, pick your "corner man") | Cold start in under a minute |
| For You feed mixing finds, fits, quotes, crew posts and rituals | The hub: shopping, wellness and social in one scroll |
| Learning engine: likes, saves, shop taps, dwell, "not for me" | The feed visibly changes as you use it |
| **Subculture unlocks** (Football × Vintage = Blokecore → retro kits) | Your exact example: the app discovers the soccer guy is into fashion and surfaces retro jerseys |
| "Because you saved X" instant injections | TikTok-style responsiveness |
| "Why am I seeing this?" line on every card | Trust, and a differentiator vs TikTok |
| Daily Word with Roman-numeral date, cited sources | A reason to open the app every day, even when not shopping |
| Rituals + streaks | Wellness habit loop |
| Crews (communities) with posting | The social layer |
| Scout a find | Community-sourced supply |
| Partner slots with hard rules + sample brand dashboard | How brands pay, without ruining the feed |

## How the vibe engine works

`src/engine/` is pure TypeScript with no UI, so the same code can run in a mobile app or on a server.

1. **Signals.** Every interaction nudges vibe scores. Weights: seed 3, follow 3, shop tap 2, save 1.5, share 1.2, like 1, post 1, open 0.6, 10-second view 0.15. "Not for me" is −2.5 and mute is −4.
2. **Decay.** Interests halve every 30 days without engagement, so the feed follows who you are *now*.
3. **Combos.** Nine subcultures light up where two interests overlap (geometric mean, so both halves must be there). Unlocking one is a moment: toast, feed card, badge.
4. **Ranking.** Relevance + learned content-type preference + popularity + freshness, then a re-ranking pass for variety: no three of a kind in a row, spaced sources, type quotas.
5. **Exploration.** Two slots in every ten go to vibes you haven't touched, preferring neighbours of what you love ("you like Football, try Run Club"). This is how the app finds new sides of you.
6. **Partners.** One slot in ten, and only filled when the product scores ≥ 25/100 on *your* match. Always labelled. Cold-start users see none.

Everything is covered by unit tests (`npm test`).

## Business model, in order of when it switches on

1. **Affiliate commissions (day one).** Every "Shop" tap is a tracked link. Small brands pay 10–20% through Shopify Collabs, Impact, Awin or direct deals. Zero cost to users.
2. **Partner placements (once there's traffic).** Pay per click-out or per sale, vibe-matched only. This is exactly your "shops will want to promote on our app" idea, built so it doesn't wreck trust.
3. **Drops.** Brands launch limited runs to matched crews ("Terrace Archive drops 40 deadstock keeper shirts to Blokecore, Sunday 7pm"). Charge a launch fee.
4. **NicheNotes+** (later): early drop access, member pricing from partners, a monthly vibe report. ~$5/month.
5. **Trend reports for brands.** Aggregated only ("Apothecary saves up 40% this month"). Never individual data.

## Ideas I'd add

- **Scouts program (in the prototype).** Users submit unknown brands; if the crew saves it enough it goes live and the Scout earns a cut of affiliate revenue. It solves supply, rewards taste, and makes finding things social. This is the thing TikTok can't copy easily.
- **Monthly Vibe Card**, like Spotify Wrapped: a shareable image of your vibe read and unlocked subcultures. It's the biggest growth lever, because every share is an ad aimed at someone with the same vibe.
- **Unlock share cards.** "I unlocked Blokecore" as a story-sized image.
- **Grail alerts.** Save a search ("lace-collar keeper, XL") and get pinged when a shop or Scout lists one.
- **Fit checks.** Users post fits and tag the pieces, which turns the community into shoppable content.
- **Morning push with your corner man's line.** The daily quote is the retention hook; make it a 7am notification.
- **Independent-shop badge.** Makes "unknown cool stuff" a visible promise.
- **AI where it earns its place:** auto-tagging brand catalogs into the vibe map (so brands can self-serve), an "ask the plug" gift finder ("guy into football and cooking, under $60"), and written vibe summaries. Keep ranking behavioral; that's what makes For You pages work.
- **Local layer (later):** run clubs, five-a-side, barbers and vintage shops near you.

## Go-to-market

- **Start narrow.** Launch with three subcultures: Blokecore, Apothecary (men's small-batch skincare and scent) and Monk Mode (stoicism and discipline). Own those communities before expanding.
- **Curate supply first.** Hand-pick 300–500 finds from ~100 small shops, sign them to affiliate programs, and offer the first 100 a founding-partner deal (free partner placement for three months).
- **Content funnel.** Post TikTok/IG pieces in each niche ("5 retro kit shops nobody knows about"). The quote cards are shareable content on their own.
- **Waitlist = vibe check.** The onboarding flow works as a web waitlist that already knows what each person wants.

## Metrics that matter

- D1 / D7 / D30 retention and daily-word opens (habit)
- Saves per session (taste match)
- **Shop taps per daily user** (the money metric) and click-out → purchase rate
- Partner click-through vs organic, and the "not for me" rate on partner posts (the trust alarm)

## Roadmap

**Phase 0 (this repo):** clickable prototype, engine, tests.

**Phase 1, MVP (~6–8 weeks):**
- Expo / React Native app reusing `src/engine`
- Supabase (Postgres, auth, storage) for accounts, follows, posts with photos
- Catalog admin and affiliate link tracking
- Push notifications
- Server-side ranking using the same engine

**Phase 2:**
- Brand portal: Shopify app, self-serve products, partner campaigns, the real dashboard
- Scouts revenue share and AI auto-tagging
- Collaborative filtering ("guys with your vibe saved…") layered on the content-based engine

**Phase 3:** drops, NicheNotes+, local layer, trend reports.

## Risks and how to handle them

- **Chicken and egg.** Curate supply before launch; launch narrow.
- **Ads eroding trust.** The partner rules are product rules, not guidelines. Watch the "not for me" rate on partner posts.
- **Thin affiliate margins.** Partners and drops carry the business; affiliate proves demand.
- **Community moderation.** Crews need reporting, moderators, and clear rules from day one.
- **Fake quotes.** Misattribution is everywhere online. Every quote carries a source and is flagged "attributed" when it can't be traced.
- **Name.** Check the "NicheNotes" trademark and handles before spending on the brand.
