# Goals are the top kernel entity; Patterns serve them

We added **Goal** as a new top entity in the kernel taxonomy: a *quality of good
code* (testability, maintainability, comprehensibility, decoupling) that a Pattern
exists to advance. Every Pattern **must serve at least one Goal**
(`Pattern -contributes-to-> Goal`, 1..many) — the quality that justifies its
existence. Goals are a flat set serving one prose north star ("help humans and AI
agents produce high-quality code, fast"); they are not modelled as a node and have
no Goal→Goal edges.

## Considered options

- **A controlled vocabulary of tags on Patterns** — rejected: too weak to be a
  first-class thing Patterns are accountable to.
- **A kind of abstract Pattern** at the top of the `uses` graph — rejected: blurs
  the means/ends line (a Goal is an *end*, a Pattern is a *means*).

## Consequences

- The taxonomy now has an entity *above* Pattern, and the edge into it points **up**
  (toward higher abstraction) — the opposite direction from the downward abstraction
  stack in ADR-0001 (`orchestrates`/`applies`/`implemented-by`).
- A *means* (e.g. layered or feature slicing) is a Pattern, not a Goal — so some
  candidate "principles" resolve to Patterns.
- `contributes-to` is authored on the Pattern (frontmatter key); Goals never list
  their Patterns — that set is derived.
