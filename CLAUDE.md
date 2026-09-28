# NicheNotes

Vite + React 19 + TypeScript + Tailwind v4 prototype. No backend; state persists to localStorage.

Follow `docs/DESIGN.md` (Steve Jobs's principles): one primary action per card, system font plus one serif for quotes, one accent color, no uppercase labels or monospace, plain universal English (Soccer not Football, jersey not kit, Clubs not Crews), and copy that works for every kind of person.

- Accessibility: font sizes in rem only (never px), icon buttons at least 44px, every control labeled.
- Every interest must lead to real content; `src/data/catalog.test.ts` enforces it. When adding an interest, add finds, a club and posts in the same change.

- `npm test` runs the engine tests (vitest). `npm run build` typechecks then builds. `npm run deploy` publishes `dist/` to the `gh-pages` branch (GitHub Pages).
- `public/sw.js` makes the hosted site work offline; bump its `CACHE` name when changing what it caches. It is never registered in dev or in the artifact build.
- Use `dayKey()` / `dayNumber()` from `src/data/time.ts` for anything daily; never `toISOString()` dates (UTC puts evenings on the wrong day).
- `src/engine/` must stay free of React and browser APIs so it can move to a server or React Native app.
- Colors come from CSS tokens in `src/styles.css` (light on `:root`, dark via `prefers-color-scheme` and `[data-theme]`). Use the Tailwind token classes (`bg-surface`, `text-ink-2`, `text-accent-text`…) and the type classes (`t-large`, `t-title2`, `t-sub`…), never raw colors in components. Exception: `ObjectArt` product drawings use each find's own palette.
- Every quote needs a real source; mark popular-but-untraceable lines `attributed: true`.
- Location: store only `approximate()` positions, show distances only through `formatDistance()`, and never display anyone's coordinates. Events must be at public places and always offer Report.
- Sponsored items are always labeled Partner and only ranked when relevance ≥ `PARTNER_MIN_RELEVANCE`.
