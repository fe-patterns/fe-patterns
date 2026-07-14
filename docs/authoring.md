# Authoring

How ideas become published patterns in this repo. Informal how-to, not a spec — the
kernel model (what a complete Pattern must contain) lives in `CONTEXT.md` and
`docs/adr/`; this doc covers only the *flow*.

## The pipeline

**idea → draft → pattern.** Two stages, one boundary:

1. **Draft** — anything pre-publication lives in `drafts/` (gitignored, local only).
   A draft starts as a rough fragment and grows a name and shape. No sub-stages and no
   ceremony — a `drafts/` file stays private until you decide it's ready.
2. **Pattern** — publishing is moving the finished draft into `patterns/` and
   committing it, plus adding its Projections (Library, Skill, Guard, Blog post) under
   `libs/`, `skills/`, `guards/`, `blog/` as the kernel model requires — a Pattern
   needs a Skill and at least one Guard (see `CONTEXT.md` and `docs/adr/`).

**The `.gitignore` line is the publish boundary.** A draft is private because
`drafts/` is ignored; the commit that moves it into the tracked catalog *is*
publishing — no automation, no atomic closure, just a git commit.

## Drafting in Obsidian (provisional)

Drafts are authored locally in an Obsidian vault over `drafts/`: wikilinks are the
`uses` / `implemented-by` edges, the folder is the kind. This is **author convenience
only** — `.obsidian/` is gitignored, the committed catalog is plain markdown +
frontmatter, and nothing (contributors, the site build, CI) needs Obsidian to read or
build the repo. Provisional; may change once there are real patterns to learn from.
