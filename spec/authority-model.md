# Authority Model

## Purpose

Agent Arbiter resolves conflicts in multi-agent systems by selecting the highest-authority action within a given context.

It replaces negotiation, convergence, and optimization with deterministic precedence-based selection grounded in real-world structures.

---

## Core Definition

> **Authority** is the precedence assigned to an agent within a specific context.

Authority may derive from:

- organizational hierarchy
- contractual relationships
- system-of-record ownership
- regulatory constraints
- bounded learned signals

Authority is always:

- context-dependent
- domain-scoped
- deterministic
- bounded

---

## Resolution Rule

Given a set of conflicting candidate actions:

```
selected_action = argmax(authority(agent, context))
```

Where:

- `agent` is the actor proposing an action
- `context` defines the active domain and constraints
- `authority(agent, context)` returns the precedence score

---

## Authority as a Lexicographic Tuple

Authority is a pair, compared lexicographically:

```
A(agent, context) = (L, s)
```

Where:

- `L` is the **highest layer** at which the agent holds applicable authority (constitutional > institutional > system > agent)
- `s ∈ [0, 1]` is the **within-layer score**

Comparison is lexicographic: any authority at a higher layer outranks all authority at lower layers, regardless of score. This makes strict layer override true **by construction** — no combination of lower-layer components can numerically exceed a higher-layer constraint.

The resolution rule is preserved verbatim: `argmax` is taken under the tuple ordering.

---

## Authority Components

The five authority components feed the within-layer score `s`:

```
s = f(hierarchy, contract, system_of_record, regulatory, learned_signals)
```

where `f` combines the components into a bounded score in `[0, 1]`. A simple additive combination (clamped to `[0, 1]`) is a valid choice of `f`; implementations may substitute any deterministic, bounded combination.

| Component | Description |
|---|---|
| `hierarchy` | Authority inherited from organizational or institutional structure |
| `contract` | Authority derived from contractual rights and obligations |
| `system_of_record` | Authority held by the system that owns factual truth |
| `regulatory` | Authority imposed by laws or non-overridable constraints |
| `learned_signals` | Bounded signals such as expertise or reliability |

`learned_signals` is the canonical name for the learned component. It is a bounded score in `[0, 1]` derived from observed signals such as expertise, reliability, or historical accuracy. It may adjust precedence within a layer but can never create authority that overrides a higher layer.

---

## Authority Layers

Authority is resolved through layered precedence. Higher layers always override lower layers.

| Layer | Description |
|---|---|
| **Constitutional** | Non-overridable legal or regulatory constraints |
| **Institutional** | Organizational, contractual, or policy authority |
| **System** | System-of-record ownership and operational control |
| **Agent** | Local agent discretion or optimization |

---

## Core Properties

| Property | Definition |
|---|---|
| **Deterministic** | The same inputs must produce the same output |
| **Domain-scoped** | Authority applies only within the active domain |
| **Bounded** | Authority must not recurse indefinitely |
| **Explainable** | Every decision must be attributable to authority sources |
| **Traceable** | Every action must map back to a principal |

---

## Principals and Agents

Agent Arbiter distinguishes between:

- **Principal** — a real-world identity (organization, role, or contract party)
- **Agent** — a computational actor representing a principal

Each agent must map to exactly one principal.

---

## Context

Authority is evaluated within a context. A context must define:

- active domain
- applicable constraints
- participating agents
- authority relationships
- system-of-record

Examples of domains:

- pricing
- billing
- contracts
- infrastructure
- environmental control

---

## Resolution Constraints

Agent Arbiter enforces the following invariants:

- higher layers override lower layers
- authority must be domain-scoped
- delegation must terminate
- constitutional constraints cannot be overridden
- system-of-record dominates factual conflicts

---

## Non-Goals

Agent Arbiter does not:

- model all influence relationships
- replace decentralized consensus systems
- learn unconstrained authority
- remove the need for policy design

---

## Summary

Agent Arbiter defines authority as a deterministic, context-aware precedence relation over agents.

This transforms multi-agent conflict resolution from:

> a search problem

into:

> a selection problem

---

## Related Specifications

- [Authority Layers](authority-layers.md) — layered precedence order
- [Delegation Rules](delegation-rules.md) — bounds on delegated authority
- [Resolution](resolution.md) — resolution steps and tie-break
