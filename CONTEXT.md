# fe-patterns

The shared language for frontend Patterns and the Libraries, Skills, and Blog posts
that realize them. The **public kernel**: every term here is consumer- and
contributor-facing.

## Patterns

**Pattern**:
A named, reusable solution to a recurring frontend problem — the central unit of
the project. A Pattern may compose other Patterns (`uses`).
_Avoid_: technique, recipe, approach (for the canonical unit)

## Artifacts

**Library**:
A standalone, independently-named code package (e.g. `tea.ts`) that may be a
Pattern's own implementation (`implemented-by`, 0..1). Named for itself, not for
the Pattern. A Pattern reaches *another* Pattern's Library transitively
(`uses` → `implemented-by`), never by a direct usage edge — see ADR-0001.
_Avoid_: package, module (as the domain term)

**Skill**:
An agent skill that applies exactly one Pattern (`Skill -applies-> Pattern`) — a
consumer-facing deliverable and a Projection, shipped alongside the Pattern's
Library. Reaches composed Patterns' Skills transitively, mirroring Library deps.
The first-order skill, beneath a Higher-order Skill. In this project "Skill" always
means this; authoring/workflow tooling is outside the taxonomy.
_Avoid_: pattern skill (just say "Skill"), command, prompt

**Higher-order Skill**:
A consumer-facing skill that assesses code and orchestrates Skills (e.g. a
`refactor` skill that proposes and applies the patterns that fit). Cross-cutting —
bound to no single Pattern — it sits one layer above Skills
(`Higher-order Skill -orchestrates-> Skill`). The higher-order counterpart to the
first-order Skill.
_Avoid_: macro, meta-skill

**Blog post**:
A narrative, public deliverable that introduces or explores one or more Patterns.
Prose, not code.
_Avoid_: article, essay

**Projection**:
A consumer-facing deliverable that realizes a Pattern — a Blog post, Library, or
Skill.
_Avoid_: output, export, derivation
