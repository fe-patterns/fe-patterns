# Guards are the fourth Projection; a Pattern needs a Skill and Guards

We added **Guard** as a fourth Projection (beside Blog post, Library, Skill): a
consumer-facing, customizable check that *continuously protects a Pattern's
integrity* in real code (`Guard -guards-> Pattern`, ≥1) — an ongoing constraint, not
a one-time test that a Skill "worked." Guards come in three kinds, descending in
strength: a test, a lint rule, or an LLM-judge (the always-available fallback). We
also tightened the Pattern's operational edges: every Pattern **must** be made
usable by a **Skill** (else it is merely theoretical) and protected by **≥1 Guard**;
Library remains optional (0..1). The Skill gains modes — **apply**, **assess** (=
run the Pattern's Guards), **refactor-to** — and installs/configures the Guards when
applying.

## Considered options

- **Guard owned by the Skill** — rejected: guards are continuous, consumer-side, and
  customizable, and must be shareable across a Pattern's Skills; that is
  Pattern-integrity, not Skill-internal state. (The Skill still *installs* them.)
- **Guard as its own top entity verifying the Skill** — rejected as too heavy; a
  Guard realizes a Pattern like the other Projections.

## Consequences

- A Pattern with no Library is normal (e.g. `ui-model-separation`) — but it always
  has a Skill and Guards. The Catalog gains a `guards/` location alongside
  `patterns/`, `libs/`, `skills/`, `blog/`.
- **Provisional / TBD:** whether each Pattern has its own multi-mode Skill or a
  Higher-order Skill operationalizes many Patterns in those modes is unsettled and
  will be decided from real examples. The durable invariant is only "a Pattern with
  no Skill is theoretical."
- The reference-template-files idea (`Foo.ts` / `FooVM.ts` / `toFooVM` skeletons as
  a Skill's apply templates) is likewise deferred until examples force the call.
