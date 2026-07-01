# fe-patterns

The shared language for frontend Patterns and the Libraries, Skills, and Blog posts
that realize them. The **public kernel**: every term here is consumer- and
contributor-facing.

## Goals

**Goal**:
A quality of good code that Patterns exist to advance — the *end* a Pattern is
justified by (e.g. testability, maintainability, comprehensibility, decoupling).
The most abstract entity: it sits *above* the Pattern layer, and the only edge into
it points up — `Pattern -contributes-to-> Goal` (1..many). A Goal never lists its
Patterns; they are derived. Goals are a **flat set** — no Goal→Goal edges. They all
serve one north star, stated in prose, not modelled as a node: **help humans and AI
agents produce high-quality code, fast.** A *means* (e.g. layered or feature
slicing) is a Pattern, not a Goal.
_Avoid_: principle, quality, property, value (for the canonical term); requirement

## Patterns

**Pattern**:
A named, reusable solution to a recurring frontend problem — the central unit of
the project. A Pattern may compose other Patterns (`uses`) and **must serve at least
one Goal** (`contributes-to`, 1..many) — the quality that justifies its existence.
It is made usable by a Skill (`applies`) and protected by at least one Guard
(`guards`); a Pattern with no Skill is merely theoretical. Its reference
implementation, if any, is a Library (`implemented-by`, 0..1).
_Avoid_: technique, recipe, approach (for the canonical unit)

## Artifacts

**Library**:
A standalone, independently-named code package (e.g. `tea.ts`) that may be a
Pattern's own implementation (`implemented-by`, 0..1). Named for itself, not for
the Pattern. A Pattern reaches *another* Pattern's Library transitively
(`uses` → `implemented-by`), never by a direct usage edge — see ADR-0001.
_Avoid_: package, module (as the domain term)

**Skill**:
An agent skill bound to exactly one Pattern (`Skill -applies-> Pattern`) — a
consumer-facing Projection. It operates in modes: **apply** (generate conformant
code), **assess** (run the Pattern's Guards over existing code), and **refactor-to**
(apply to existing code). When applying, it also installs and configures the
Pattern's Guards. Reaches composed Patterns' Skills transitively, mirroring Library
deps. The first-order skill, beneath a Higher-order Skill. In this project "Skill"
always means this; authoring/workflow tooling is outside the taxonomy.
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

**Guard**:
A consumer-facing, customizable check that continuously protects a Pattern's
integrity in real code (`Guard -guards-> Pattern`, ≥1) — an ongoing constraint, not
a one-time test that a Skill "worked." Three kinds, in descending strength: a test,
a lint rule, or an LLM-judge (the always-available fallback). The consumer tunes it
to local conventions (e.g. `FooVM` vs `FooViewModel`). A Pattern's Skill installs
and configures its Guards; a Pattern needs no Library but always has Guards.
_Avoid_: check, validation, assertion (as the canonical term); test (only one kind)

**Projection**:
A consumer-facing deliverable that realizes a Pattern — a Blog post, Library, Skill,
or Guard.
_Avoid_: output, export, derivation
