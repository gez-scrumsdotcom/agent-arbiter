# Agent Arbiter

**Agent Arbiter** resolves conflicts in multi-agent systems by deterministically selecting the agent with explicit authority, grounded in real-world structures such as roles, contracts, and system ownership.

It replaces negotiation, convergence, and optimization with precedence-based selection grounded in real-world structures.

This standard is introduced in *Authority is All You Need: Multi-Agent Conflict Resolution from Real-World Structures*.

---

## Overview

Multi-agent systems typically resolve conflicts through:

- negotiation
- iterative convergence
- optimization

Agent Arbiter takes a different approach:

> **Conflict is not solved through interaction. It is resolved through precedence.**

Instead of agents negotiating, the system selects the single winning action based on authority derived from real-world structures.

---

## Core Concept

Given a set of conflicting actions:

```
selected_action = argmax(authority(agent, context))
```

Authority is a lexicographic tuple `(layer, within-layer score)` — higher layers override lower layers by construction. See [spec/authority-model.md](spec/authority-model.md).

Authority is derived from:

- organizational hierarchy
- contractual relationships
- system-of-record ownership
- regulatory constraints

### Entity Consistency

Agent Arbiter ensures that agents, principals, and decisions are consistently represented across systems.

- Each agent maps to a real-world principal (organization, role, or contract party)
- Authority relationships are stable and context-aware
- The same inputs produce the same decision across systems

This makes every resolution:

- traceable
- explainable
- repeatable

---

## Why Agent Arbiter

| Problem | Traditional Systems | Agent Arbiter |
|---|---|---|
| Conflict resolution | Iterative | Deterministic |
| Latency | High | Low |
| Interpretability | Medium | High |
| Real-world alignment | Weak | Strong |

---

## When to Use Agent Arbiter

Use Agent Arbiter when:

- multiple agents can propose conflicting actions
- authority can be defined from real-world structures
- deterministic outcomes are required

Avoid using it when:

- no clear authority structure exists
- fully decentralized consensus is required

---

## Key Principles

- **Deterministic** — no randomness, no negotiation loops
- **Precedence-based** — authority defines resolution
- **Layered authority** — constitutional > institutional > system > agent
- **Domain-scoped** — authority applies within context
- **Bounded delegation** — no infinite authority stacking

---

## Architecture

### System Flow

```mermaid
flowchart LR
    A1[Agent 1] --> P[Proposals]
    A2[Agent 2] --> P
    A3[Agent N] --> P

    P --> C[Conflict Detection]
    C --> AA[Agent Arbiter]
    AA --> E[Execution]
```

### Authority Graph

```mermaid
graph TD
    Org[Organization] --> Finance[Finance System]
    Org --> Sales[Sales Agent]
    Contract[Contract] --> Customer[Customer Agent]
    Finance --> Billing[Billing Agent]
```

- **Nodes** = agents mapped to principals
- **Edges** = authority relationships
- **Context** determines active authority

---

## Quick Example

### Scenario: Pricing Conflict

**Agents:**

- Sales Agent → proposes discount
- Billing Agent → enforces pricing rules
- Customer Agent → requests concession

**Resolution**

```
authority(Sales)    = 0.6
authority(Billing)  = 0.9
authority(Customer) = 0.4

→ selected = Billing
```

✔ No negotiation — ✔ No iteration — ✔ Deterministic outcome

---

## Example: Contract Amendment Conflict

A customer requests a change to payment terms mid-deal. Three agents have competing positions.

### Agents

- **Sales Agent** → accepts amended terms to close the deal
- **Legal Agent** → enforces standard compliance clauses
- **Finance Agent** → validates payment schedule against policy

### Authority Layers

| Layer | Authority |
|---|---|
| Constitutional | Minimum compliance clauses |
| Institutional | Finance payment policy |
| Agent | Sales discretion |

### Resolution

```
authority(Sales)   = 0.5   # discretionary, deal-motivated
authority(Legal)   = 0.85  # compliance-bound
authority(Finance) = 0.75  # policy-bound

→ selected = Legal
```

Sales proposes net-90 terms → rejected (violates minimum compliance clause)
Legal enforces net-30 with standard liability language.

No back-and-forth. No escalation loop. One resolution.

---

## Reference Implementation

[`reference/resolver.ts`](reference/resolver.ts) implements the resolution steps of [spec/resolution.md](spec/resolution.md): domain filtering, direct and delegated authority (bounded depth, cycle detection, non-escalation), layer precedence, and the deterministic tie-break — with a trace explaining every decision.

```typescript
import { resolve } from './reference/resolver.js'

const result = resolve(authorityGraph) // any examples/*.json scenario
result.selected_agent // → "billing-agent"
result.decided_by     // → "weight" (which tie-break stage decided)
result.scores         // → effective (layer, weight, path) per candidate
```

```bash
npm ci
npm run typecheck   # tsc --noEmit
npm run validate    # every example validates against the schema
npm test            # every example resolves to its declared winner
```

---

## Authority Model

The formal definitions live in the specs — they are the single source of truth:

- [Authority Model](spec/authority-model.md) — components (`hierarchy`, `contract`, `system_of_record`, `regulatory`, `learned_signals`) and core properties
- [Authority Layers](spec/authority-layers.md) — constitutional → institutional → system → agent precedence
- [Delegation Rules](spec/delegation-rules.md) — bounded, domain-scoped, terminating delegation
- [Resolution](spec/resolution.md) — resolution steps and the deterministic tie-break

---

## Use Cases

- Billing and pricing systems
- Contract and approval workflows
- Infrastructure orchestration
- Autonomous agent coordination
- Resource allocation systems

---

## Repository Structure

```
agent-arbiter/
├── spec/        # formal definitions of authority and resolution
├── schema/      # authority graph schema
├── reference/   # reference implementation and tests
├── examples/    # real-world scenarios
├── docs/        # paper and supporting material
└── README.md
```

The repository is organized to separate specification, schema, implementation, and real-world examples. CI validates every example against the schema and resolves it with the reference implementation on each push.

---

## Paper

*Authority is All You Need: Multi-Agent Conflict Resolution from Real-World Structures*

- Read in repo: [docs/paper.md](docs/paper.md)
- Download PDF: [paper.pdf](docs/authority-is-all-you-need-multi-agent-conflict-resolution.pdf)

---

## Author

Created by **Gerald Neves** at [Scrums.com](https://www.scrums.com), Software Engineering Orchestration Platform (SEOP), orchestrating tools, teams and AI agents.

---

## License

Apache License 2.0
