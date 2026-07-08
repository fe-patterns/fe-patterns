# fe-patterns

## Package manager

Always use **pnpm** — this is a pnpm workspace (`pnpm-workspace.yaml`, `pnpm-lock.yaml`). Never run `npm`/`yarn`; they create competing lockfiles and desync `node_modules`. Add deps with `pnpm add`, install with `pnpm install`.

## Social cards / hero images

The site's OG cards are rendered at build time (`site/src/lib/og-card.ts`, canvaskit-wasm). A blog post's optional `hero` frontmatter — a **PNG/JPEG/WebP** filename in `site/src/assets/hero/` — drives both the in-page hero band and the "Variant B" OG card; without it the post gets the generated "Variant A" card. Brand primitives (logo path, wordmark, accent) live in `site/src/lib/brand.ts`.
