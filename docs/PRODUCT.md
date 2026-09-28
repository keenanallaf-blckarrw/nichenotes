# NicheNotes: product & business plan

**One line:** a For You feed for anyone that learns your taste and leads you to great things nobody has heard of yet (products, outfits, daily habits, words worth keeping) and to the small shops that make them.

How it looks and reads is set by [`DESIGN.md`](DESIGN.md): Steve Jobs's principles, in plain English that anyone in the world understands.

## Why this can win

- **TikTok and Amazon flatten everything.** People search TikTok for niche products and get the same 50 viral, often dropshipped, items. Nobody owns *curated and niche*.
- **Self-improvement and niche hobbies are huge but have no home.** Stoicism, skincare, sourdough, retro jerseys, houseplants and indie games are scattered across TikTok, Reddit and YouTube. There's no single place built around them.
- **Small brands can't reach their people.** Social media ads are broad and expensive. A shop selling 4,000 retro soccer jerseys needs the 20,000 people who care, not a million who don't.

The moat is **taste + trust**: an engine that actually gets you, and a feed that never feels like an ad catalog.

## What the prototype does (v0.4)

| Feature | What it proves |
|---|---|
| 60 interests in 9 groups, with search, editable any time | There's something for everyone, not just one type of person |
| Two-step onboarding: pick your interests, then any quote themes (or a mix of all) | Cold start in under 30 seconds |
| For You feed mixing finds, outfits, quotes, club posts and daily habits | The hub: shopping, wellness and social in one scroll |
| Learning engine: likes, saves, shop taps, time spent, "Not interested" | The feed visibly changes as you use it |
| **20 unlocks where interests meet** (Soccer + Vintage = Retro Jerseys, Plants + Tea = Cozy Home) | Your original example: the app discovers a soccer fan is into fashion and shows them retro jerseys |
| "Because you saved X" instant additions | TikTok-style responsiveness |
| "Why am I seeing this?" on every card, shown on the card only when the reason is interesting | Trust, and a differentiator vs TikTok |
| A daily quote from themes you choose (philosophers, athletes, artists and writers, founders and scientists, leaders, mindfulness), always with its source | A reason to open the app every day, even when not shopping |
| Daily habits and streaks | Wellness habit loop |
| 51 clubs (communities) with posting | The social layer |
| **Clubs near you:** choose an area and a radius, see pickup games and meetups on a radar and by day, RSVP, chat in each event's discussion, post "near me" questions, host your own | Online communities turn into real-life ones, which is what keeps people coming back |
| Display settings: text size, light or dark, plus the device's own accessibility settings | Usable by more people, including anyone who needs larger text |
| Suggest a find | Community-sourced supply |
| Partner slots with hard rules + sample brand dashboard | How brands pay, without ruining the feed |

## How the engine works

`src/engine/` is pure TypeScript with no UI, so the same code can run in a mobile app or on a server.

1. **Signals.** Every interaction nudges interest scores.
   - Positive weights: onboarding pick 3, "See more" 3, shop tap 2, save 1.5, share 1.2, like 1, post 1, open 0.6, a short view 0.15.
   - Negative weights: "Not interested" −2.5, hiding an interest −4.
2. **Decay.** Interests halve every 30 days without engagement, so the feed follows who you are *now*.
3. **Unlocks.** Twenty niches unlock where two interests overlap. They use a geometric mean, so both halves must be there. Each unlock is a moment: a message, one feed card, and a place on your profile.
4. **Ranking.** The score combines relevance, learned content-type preference, popularity and freshness. A second pass then adds variety: no three of a kind in a row, sources spaced out, and a cap per content type.
5. **Exploration.** Two slots in every ten go to interests you haven't touched, preferring neighbors of what you love ("you like Soccer, try Running"). This is how the app finds new sides of you.
6. **Partners.** One slot in ten, and only filled when the product scores ≥ 25/100 on *your* match. Always labeled. Cold-start users see none.

Everything is covered by unit tests (`npm test`).

## Business model, in order of when it switches on

1. **Affiliate commissions (day one).** Every "Shop" tap is a tracked link. Small brands pay 10–20% through Shopify Collabs, Impact, Awin or direct deals. Zero cost to users.
2. **Partner placements (once there's traffic).** Pay per store visit or per sale, shown only to matched people. This is exactly your "shops will want to promote on our app" idea, built so it doesn't wreck trust.
3. **Drops.** Brands launch limited runs to matched clubs, for example "Final Whistle Archive releases 40 unworn goalkeeper jerseys to the Retro Jerseys club, Sunday 7 p.m." Charge a launch fee.
4. **NicheNotes+** (later): early access to drops, member pricing from partners, and a monthly taste report. About $5/month.
5. **Trend reports for brands.** Aggregated only ("Apothecary saves up 40% this month"). Never individual data.

## Ideas I'd add

- **Scouts program ("Suggest a find" in the prototype).**
  - How it works: users submit unknown brands. If the club saves one enough, it goes live, and the person who suggested it earns a cut of affiliate revenue.
  - Why it matters: it solves supply, rewards taste, and makes finding things social. TikTok can't easily copy it.
- **Monthly taste card**, like Spotify Wrapped: a shareable image of your top interests and unlocks. It's the biggest growth lever, because every share is an ad aimed at someone with the same taste.
- **Unlock share cards.** "I unlocked Retro Jerseys" as a story-sized image.
- **Wish-list alerts.** Save a search ("lace-collar goalkeeper jersey, XL") and get notified when a shop or Scout lists one.
- **Outfit posts.** Users post outfits and tag the pieces, which turns the community into shoppable content.
- **Morning notification with the day's quote.** The daily quote is the retention hook; send it at 7 a.m.
- **Independent-shop badge.** Makes "great things nobody has heard of" a visible promise.
- **AI where it earns its place:**
  - sorting brand catalogs into interests automatically, so brands can sign themselves up
  - a gift finder ("a friend who loves soccer and cooking, under $60")
  - written taste summaries

  Keep ranking behavioral; that's what makes For You pages work.
- **Local shops (next):** the local layer is built for people; add independent shops and pop-ups near you, so "Shop" can also mean "walk there".

## Go-to-market

- **Start narrow.** Launch with three niches:
  - Retro Jerseys
  - Apothecary (small-batch skincare and scent)
  - Monk Mode (stoicism and discipline)

  Own those communities before expanding.
- **Curate supply first.** Hand-pick 300–500 finds from ~100 small shops and sign them to affiliate programs. Offer the first 100 a founding-partner deal: free partner placement for three months.
- **Content funnel.** Post TikTok/IG pieces in each niche ("5 retro jersey shops nobody knows about"). The quote cards are shareable content on their own.
- **Waitlist = onboarding.** The two-tap onboarding works as a web waitlist that already knows what each person wants.

## Metrics that matter

- D1 / D7 / D30 retention and daily-quote opens (habit)
- Saves per session (taste match)
- **Shop taps per daily user** (the money metric) and store visit → purchase rate
- Partner click-through vs organic, and the "Not interested" rate on partner posts (the trust alarm)

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
- Scouts revenue share and AI catalog sorting
- Collaborative filtering ("people with your taste saved…") layered on the content-based engine

**Phase 3:** drops, NicheNotes+, local layer, trend reports.

## Risks and how to handle them

- **Chicken and egg.** Curate supply before launch; launch narrow.
- **Ads eroding trust.** The partner rules are product rules, not guidelines. Watch the "Not interested" rate on partner posts.
- **Thin affiliate margins.** Partners and drops carry the business; affiliate proves demand.
- **Community moderation.** Clubs need reporting, moderators, and clear rules from day one.
- **Meeting in person.** Local events bring real safety duties:
  - Store only an approximate area (about 1 km), never exact locations.
  - Round shown distances so nobody can be pinpointed.
  - Ask hosts for public places, and show safety tips on every event.
  - Make reporting one tap, and review new hosts.
  - Keep age limits and verification in mind before launch.
- **Fake quotes.** Misattribution is everywhere online. Every quote carries a source and is flagged "attributed" when it can't be traced.
- **Name.** Check the "NicheNotes" trademark and handles before spending on the brand.
