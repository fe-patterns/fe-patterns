# Frontend Patterns site

## Social cards / hero images

The site's OG cards are rendered at build time (`src/lib/og-card.ts`, canvaskit-wasm). A blog post's optional `hero` frontmatter — a **PNG/JPEG/WebP** filename in `src/assets/hero/` — drives both the in-page hero band and the "Variant B" OG card; without it the post gets the generated "Variant A" card. Brand primitives (logo path, wordmark, accent) live in `src/lib/brand.ts`.

## Formatting

`vp fmt` (oxfmt) is the only terminal formatter, and it covers **JS/TS/JSON/TOML only** — it does **not** touch `.astro` or `.css`. Indentation for those (and everything, as a baseline) is pinned to 2-space by the root `.editorconfig`, which editors apply on save. There is no terminal command that formats `.astro`/`.css`; if that's ever needed, add Prettier + `prettier-plugin-astro`.
