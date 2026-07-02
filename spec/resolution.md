# Resolution Specification

## Purpose

Agent Arbiter resolves conflicts by selecting a single action from a set of competing agent proposals.

It does not negotiate, iterate, or converge.

It selects.

---

## Input

A conflict set:

```
C = { a₁, a₂, ..., aₙ }
```

Where:

- each `aᵢ` is an agent proposing an action
- all agents in `C` are in conflict within the same context

Context `x` includes:

- domain
- constraints
- active authority relationships
- system-of-record

---

## Output

A single selected action:

```
a*
```

Where:

- `a*` is a member of `C`
- `a*` is the action proposed by the highest-authority agent in the given context

---

## Resolution Rule

```
selected = argmax(authority(agent, context))
```

---

## Resolution Steps

1. Identify the conflict set `C`
2. Evaluate authority for each agent in context `x`
3. Apply layer precedence: constitutional → institutional → system → agent
4. Apply delegation rules and bounds
5. Select the highest-authority agent

---

## Authority Aggregation

The effective authority of an agent is the **maximum** over its valid inbound authority sources, ordered lexicographically by `(layer, within-layer weight)`.

Authority is **override-based, not additive**: two weak grants (e.g. 0.4 and 0.4) never outrank a single stronger grant (0.9), and no combination of lower-layer authority can reach a higher layer.

Valid sources are:

- **Direct** — a non-delegation edge in the active domain grants `(edge.layer, edge.weight)`
- **Delegated** — a valid delegation chain (see [Delegation Rules](delegation-rules.md)) grants the **minimum** `(layer, weight)` along the chain, so delegation never escalates beyond its source

---

## Tie-Break

If multiple agents hold the highest authority, the tie is broken deterministically, in order:

1. **Higher layer** — constitutional → institutional → system → agent
2. **Higher within-layer weight** — the larger bounded weight wins
3. **Lexicographic agent id** — the smallest agent identifier (Unicode code point order) wins

This ordering is stable, auditable, and independent of input order: permuting the agents, edges, or proposals in the input must not change the outcome.

---

## Constraints

Resolution must be:

- **Deterministic** — the same inputs must produce the same output
- **Domain-scoped** — authority is evaluated within the active domain only
- **Bounded** — resolution must terminate
- **Explainable** — the selected agent and reason must be attributable

If multiple agents have equal authority, the tie-break defined above must be applied.

---

## Summary

Agent Arbiter resolves conflict by selecting the single highest-authority action within a defined context.

---

## Related Specifications

- [Authority Model](authority-model.md) — how authority is defined and computed
- [Authority Layers](authority-layers.md) — layered precedence order
- [Delegation Rules](delegation-rules.md) — bounds on delegated authority
