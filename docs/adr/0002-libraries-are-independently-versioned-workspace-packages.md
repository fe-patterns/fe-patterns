# Libraries are independently-versioned workspace packages

The Catalog is an npm/pnpm **workspace**. Each Library under `libs/*` is its own
package, **independently versioned** and published to npm, sharing the workspace's
tooling and CI. Inter-library dependencies (`tea.ts depends-on tagged-union`)
resolve through the workspace.

## Why

- The workspace resolves exactly the `Library -depends-on-> Library` shadow graph
  from ADR-0001 — the same dependency relationships, now as real package deps.
- **Independent versions** match the domain: Libraries are independently named and
  shared across Patterns, so they must release on their own cadence.
- Rejected: a single umbrella package (couples every Library's release cadence and
  ships everything for one Pattern) and fully standalone repos/packages (duplicated
  tooling, no first-class cross-library dep resolution).

## Consequences

- A consumer installs only the Libraries for the Patterns they want.
- Shared build/test/lint/release config lives once at the workspace root.
