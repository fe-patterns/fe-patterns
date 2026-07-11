# Catalog workspace toolchain: Vite+ (vp) + pnpm + Changesets

The public Catalog workspace uses **Vite+** — VoidZero's unified `vp` toolchain
(`vp run` for cached, dependency-aware monorepo tasks; `tsdown` for library builds;
Vitest; Oxlint/Oxfmt) — on **pnpm** workspaces, with **Changesets** for the
independent per-package versioning and publishing from ADR-0002. Pattern
scaffolding is a Workflow Skill, not a code generator.

## Why

- Vite+ consolidates the most tooling in one cohesive, Rust-fast stack from the
  Vite team: `vp run` covers what Turborepo would (so no separate task runner), and
  `tsdown` (the Rolldown-based successor to tsup) covers library bundling.
- **Changesets** fills the one gap Vite+ leaves — multi-package semver releases.
- **Scaffolding is a Workflow Skill** because creating a Pattern spans lib, skill,
  and note and writes Obsidian frontmatter — things a code generator can't do
  cleanly. This is why Nx's generators carried no weight here.

## Status / risk

- **Vite+ is alpha** — expect breaking changes. Accepted because stakes are low (no
  content, no users yet) and the choice is **reversible**: `vp run` mirrors
  `pnpm run`, so falling back to pnpm + Turborepo is cheap.
- Revisit if alpha churn becomes costly, or once Vite+ reaches stable.
