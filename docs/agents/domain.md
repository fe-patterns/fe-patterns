# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

**Layout: single-context.** This repo has one context — the kernel — defined in `CONTEXT.md` at the repo root.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the kernel glossary (Goal, Pattern, Library, Skill, Guard, Projection, and the edges).
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

```
/                          ← fe-patterns (the repo root)
├── CONTEXT.md             ← Kernel context (the single context)
├── docs/adr/              ← all decisions live here
├── docs/agents/           ← these agent docs
└── libs/<name>/CONTEXT.md ← per-library, created lazily
```

## Future: per-library contexts

The kernel is the only context today. When a Library under `libs/<name>/` grows its own vocabulary, it gets a `libs/<name>/CONTEXT.md`, and a repo-root `CONTEXT-MAP.md` is created lazily to list the kernel + per-library contexts. Maps are per-repo-root and flat — no map-of-maps. Create it only once the first lib earns a glossary.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0004 (Goals are the top kernel entity) — but worth reopening because…_
