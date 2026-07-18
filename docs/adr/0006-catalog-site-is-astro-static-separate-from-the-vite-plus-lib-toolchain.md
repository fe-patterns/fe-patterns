# Catalog site is Astro (static), separate from the Vite+ lib toolchain

The public Catalog site lives in `site/` as its own workspace package,
built with **Astro** as a static site and deployed to **Netlify**. It renders the
Catalog's source-of-truth markdown *in place* (Astro content-collection glob loaders
point at `../patterns` and `../blog`) rather than duplicating it — the site is a
Projection. Deployment: Netlify installs at the repo root so the pnpm workspace
resolves, then builds only the site (`pnpm --filter fe-patterns-site build`) and
publishes `site/dist`.

## Why this is separate from ADR-0003

ADR-0003 scoped **Vite+ (`vp`)** to the `libs/*` packages. `vp` is a task
runner + library bundler + test/lint/format wrapper — it is not a site framework
(no routing, pages, or content collections). Astro is the right category for a
content site. Both embed Vite internally, but each is scoped to its own package
(the Astro site vs. the libs), so they never invoke one another — there is no
"two Vites" conflict, just an app-vs-libs split.

## Considered options

- **VitePress** (Vite team, same family as `vp`) — rejected: docs/sidebar-shaped by
  default, so matching the intended calm blog aesthetic (à la astro-chiri) is more
  custom work, and a blog listing needs a plugin.
- **Fork astro-chiri** — rejected: we want a top nav and a different type ramp;
  cheaper to build a minimal shell in its spirit than to diverge from a theme.

## Consequences

- The site carries its own dependency tree (Astro, Fontsource) under `site/`,
  independent of the libs' toolchain — expected for a monorepo app.
- Netlify deploys `fe-patterns` as a standalone repo; `netlify.toml` lives at the
  repo root.

## Amendment (2026-07-18): `vp test` runs the site's pure-TS unit tests

One carve-out to "they never invoke one another": plain TypeScript logic under
`site/src` (no Astro imports) is unit-tested by the root `vp test` glob
(`site/src/**/*.test.ts`), because Astro ships no test runner and a second
Vitest install just for the site would reintroduce the "two Vites" problem in
worse form. Astro remains the only thing that *builds* site code; `vp` only
runs its framework-free tests.
