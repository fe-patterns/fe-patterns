# Patterns and Libraries are distinct, linked entities (not bundled)

We considered bundling a Pattern's definition, Library, and Skill into a single
co-located unit (one folder per Pattern). We rejected that: a **Pattern** (a
concept), a **Library** (a standalone code package), and a **Skill** are distinct
entities, joined by explicit, named edges.

## Why

- **Libraries are shared and independently named.** `tea.ts` is used by the
  `managed-effects` Pattern *and* others, and is named for itself, not its
  Pattern. It can't live inside one Pattern's folder.
- **Patterns compose.** `managed-effects` uses `tagged-union`, which is *itself* a
  Pattern. The relationships are many-to-many, which a 1:1:1 bundle can't model.
- **Pure utility libraries** implement no Pattern at all; a bundle would force a
  hollow Pattern around them.

## The layer stack (vertical edges)

The kinds form a downward abstraction stack, each edge pointing to the next-lower
layer:

```
Higher-order Skill  --orchestrates-->  Skill
Skill               --applies-->       Pattern
Pattern             --implemented-by-->Library
```

| From | Arrow | To | Card. | Meaning |
|------|-------|----|-------|---------|
| Higher-order Skill | `orchestrates` | Skill | many | composition over skills |
| Skill | `applies` | Pattern | 1 (Pattern has 0..1) | a Skill applies one Pattern |
| Pattern | `implemented-by` | Library | 0..1 | a Pattern's **own** canonical implementation |

**`implemented-by` is an *identity* relation** — it points a Pattern at *its own*
Library. It is **not** a dependency.

## Horizontal edges (within a layer)

| From | Arrow | To | Card. | Meaning |
|------|-------|----|-------|---------|
| Pattern | `uses` | Pattern | many | conceptual dependency / composition — **the only dependency edge** |
| Library | `depends-on` | Library | many | real code dependency (see shadow rule) |

## The forbidden edge

- **`Pattern -uses-> Library` does not exist.** A Pattern never depends directly
  on another Pattern's Library. To reach one, traverse
  `Pattern -uses-> Pattern -implemented-by-> Library`. The library dependency is
  *transitive*, never authored directly.

## Consequences

- The conceptual dependency graph is **pattern → pattern only** (`uses`).
- `Library -depends-on-> Library` code deps are the **shadow** of the
  `Pattern -uses-> Pattern` graph, plus pure-utility deps that stay below the
  Pattern abstraction (invisible to the conceptual graph).
- Skills mirror Libraries: each `applies` exactly one Pattern, reaching composed
  Patterns' Skills transitively. Higher-order Skills sit one layer above,
  orchestrating Skills.
- Edge names double as Obsidian frontmatter keys (`uses:`, `implemented-by:`,
  `applies:`, `orchestrates:`, `depends-on:`).
