# Authority Layers

## Purpose

Agent Arbiter resolves conflicts through layered precedence.

These layers define the order in which authority applies and prevent ambiguous or recursive resolution across agents, systems, and institutions.

---

## Layer Model

Authority is evaluated across four ordered layers:

1. Constitutional
2. Institutional
3. System
4. Agent

Higher layers override lower layers.

---

## 1. Constitutional

The constitutional layer contains non-overridable constraints.

Examples:

- laws and regulations
- safety constraints
- mandatory compliance rules
- foundational system limits

This layer defines what is permitted before any lower-layer authority is considered.

### Rule

No lower layer may override a constitutional constraint.

---

## 2. Institutional

The institutional layer contains authority derived from formal structures.

Examples:

- organizational hierarchy
- contractual rights and obligations
- internal policy
- delegated managerial authority

This layer determines who has decision precedence within an institution or agreement.

### Rule

Institutional authority may override system and agent layers, but may not override constitutional constraints.

---

## 3. System

The system layer contains authority derived from operational ownership and system-of-record control.

Examples:

- billing system controls invoice truth
- ERP controls financial record truth
- HVAC controller enforces temperature limits
- identity system controls access state

This layer resolves conflicts where a specific system owns factual or operational truth within a domain.

### Rule

System authority applies only within its domain and may not override higher layers.

---

## 4. Agent

The agent layer contains local decision-making authority.

Examples:

- optimization choices
- user preferences
- local workflow suggestions
- discretionary agent actions

This is the lowest authority layer.

### Rule

Agent authority may operate only within the bounds imposed by higher layers.

---

## Resolution Order

Agent Arbiter resolves conflicts in this order:

1. Check constitutional constraints
2. Apply institutional authority
3. Apply system authority
4. Apply agent authority

If a higher layer determines the outcome, lower layers are not consulted for override.

---

## Layer Properties

### Ordered

Layers must always be evaluated in the same order.

### Bounded

Authority must terminate within the defined layers.

### Domain-Scoped

A layer only applies where its authority is relevant to the active domain.

### Explainable

Every resolution must identify the layer that determined the outcome.

---

## Example

### Contract Amendment Conflict

A sales agent proposes amended payment terms.

| Layer | Application |
|---|---|
| **Constitutional** | Minimum legal compliance requirements apply |
| **Institutional** | Finance policy limits allowable payment terms |
| **System** | Contract system enforces valid term structures |
| **Agent** | Sales agent proposes a discretionary change |

**Outcome:** The first valid higher-precedence layer determines the decision. If the proposal violates legal or policy constraints, agent preference is irrelevant.

---

## Design Constraints

Authority layers must satisfy the following:

- no upward override
- no skipped higher-layer constraints
- no unbounded cross-layer recursion
- no global authority outside context

---

## Summary

Authority layers provide a bounded and deterministic order for conflict resolution.

They ensure that multi-agent decisions follow real-world precedence rather than uncontrolled interaction.

---

## Related Specifications

- [Authority Model](authority-model.md) — how authority is defined and computed
- [Delegation Rules](delegation-rules.md) — bounds on delegated authority
- [Resolution](resolution.md) — resolution steps and tie-break
