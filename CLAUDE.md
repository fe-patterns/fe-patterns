# fe-patterns

## Package manager

Always use **pnpm** — this is a pnpm workspace (`pnpm-workspace.yaml`, `pnpm-lock.yaml`). Never run `npm`/`yarn`; they create competing lockfiles and desync `node_modules`. Add deps with `pnpm add`, install with `pnpm install`.

## Agent skills

### Issue tracker

Issues are tracked as GitHub issues via the `gh` CLI and organized on the org Project board [fe-patterns #1](https://github.com/orgs/fe-patterns/projects/1) (needs the `project` token scope). External PRs are not a triage surface (personal project). See `docs/agents/issue-tracker.md`.

### Triage labels

Active states are `ready-for-agent` and `ready-for-human`; the incoming-triage states are unused (no external reporter flow). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: the kernel `CONTEXT.md` at the repo root. See `docs/agents/domain.md`.
