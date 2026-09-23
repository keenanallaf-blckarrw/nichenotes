# NicheNotes

Vite + React 19 + TypeScript + Tailwind v4 prototype. No backend; state persists to localStorage.

- `npm test` runs the engine tests (vitest). `npm run build` typechecks then builds.
- `src/engine/` must stay free of React and browser APIs so it can move to a server or React Native app.
- Colors come from CSS tokens in `src/styles.css` (light on `:root`, dark via `prefers-color-scheme` and `[data-theme]`). Use the Tailwind token classes (`bg-surface`, `text-ink-2`, `bg-slab`…), never raw colors in components. Exception: `ObjectArt` product drawings use each find's own palette.
- Every quote needs a real source; mark popular-but-untraceable lines `attributed: true`.
- Sponsored items are always labelled Partner and only ranked when relevance ≥ `PARTNER_MIN_RELEVANCE`.
