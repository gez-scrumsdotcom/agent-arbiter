# Resolution Specification

## Purpose

Authority Arbiter resolves conflicts by selecting a single action from a set of competing agent proposals.

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

## Constraints

Resolution must be:

- **Deterministic** — the same inputs must produce the same output
- **Domain-scoped** — authority is evaluated within the active domain only
- **Bounded** — resolution must terminate
- **Explainable** — the selected agent and reason must be attributable

If multiple agents have equal authority, a deterministic tie-break must be applied.

---

## Summary

Authority Arbiter resolves conflict by selecting the single highest-authority action within a defined context.
