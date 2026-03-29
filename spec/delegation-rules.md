# Delegation Rules

## Purpose

Agent Arbiter supports delegated authority, but only within explicit bounds.

Delegation allows an agent or principal to pass limited authority to another agent within a defined domain and context. These rules ensure that delegation remains computable, explainable, and bounded.

---

## Core Definition

> **Delegation** is the transfer or inheritance of authority from one principal or agent to another.

A delegation relationship has the form:

```
delegates(from, to, domain, scope)
```

Where:

- `from` is the delegating principal or agent
- `to` is the receiving principal or agent
- `domain` defines where the delegation applies
- `scope` defines the bounds of that delegation

Delegation does not create new authority from nothing. It only passes authority that already exists.

---

## Principles

### 1. Delegation Must Be Explicit

Delegation must be represented as an explicit relationship.

It must not be inferred from proximity, similarity, or repeated behavior alone.

### 2. Delegation Must Be Domain-Scoped

Delegation only applies within the specified domain.

Examples:

- a finance delegation applies in billing, not infrastructure
- a contract delegation applies to amendment rules, not access control

### 3. Delegation Must Be Bounded

Delegation must include clear limits.

Examples of bounds:

- domain
- action type
- time window
- approval threshold
- policy constraints

### 4. Delegation Must Terminate

Delegation chains must be finite.

Agent Arbiter must reject or truncate delegation graphs that recurse indefinitely or exceed system limits.

### 5. Delegation Cannot Exceed Source Authority

A delegating principal or agent cannot delegate authority it does not hold.

Delegation preserves upper bounds from the source.

---

## Delegation Inheritance

Delegated authority may be inherited along directed edges.

Example:

```
Organization → Finance Lead → Billing Agent
```

The Billing Agent may inherit authority from the Finance Lead, which in turn may inherit authority from the Organization.

Inherited authority must remain:

- domain-scoped
- bounded
- explainable

---

## Delegation Constraints

Agent Arbiter enforces the following constraints:

- delegation must be explicit
- delegation must be finite
- delegation must be domain-scoped
- delegation must not bypass higher layers
- delegation must not override constitutional constraints
- delegation must preserve institutional and system limits

---

## Layer Interaction

Delegation operates within authority layers.

| Layer | Example |
|---|---|
| **Institutional** | A manager delegates approval authority to a finance lead |
| **System** | A billing system delegates enforcement to a billing agent within invoice rules |
| **Agent** | A user agent delegates a local preference to a room controller |

Delegation may not elevate lower-layer authority above higher-layer constraints.

---

## Resolution Behavior

When delegated authority is present, Agent Arbiter must:

1. Identify the source authority
2. Verify the delegation is valid in the current domain
3. Apply delegation bounds
4. Resolve the action using the inherited authority

If delegation is invalid, the delegated authority must not be applied.

---

## Invalid Delegation Examples

### Example 1: Cross-Domain Leakage

A legal agent delegates pricing authority to a sales agent.

**Result:** invalid, unless pricing is explicitly in scope.

### Example 2: Infinite Chain

```
A → B → C → A
```

**Result:** invalid, because delegation does not terminate.

### Example 3: Upward Override

A local agent attempts to delegate authority that overrides a constitutional or institutional constraint.

**Result:** invalid.

---

## Business Examples

### Pricing Approval

```
Organization → Finance Policy → Billing Agent
Sales Agent → proposes discount
```

Billing Agent inherits institutional pricing authority. Sales Agent does not override it.

### Contract Amendment

```
Organization → Legal Policy → Legal Agent
Sales Agent → requests term change
```

Legal Agent inherits authority for compliant contract structures. Sales Agent may propose but not decide outside that scope.

### HVAC Preference

```
Building Policy → HVAC System → Room Controller
User Agent → sets preferred temperature
```

User preference is valid only within system bounds. The Room Controller inherits enforceable authority from the HVAC system.

---

## Recommended Limits

Implementations should define:

- maximum delegation depth
- valid delegation domains
- allowed delegation types
- required audit fields

Example limits:

- max depth = 3
- no circular delegation
- no cross-domain delegation without explicit mapping

---

## Auditability

Every delegated decision should be traceable to:

- source principal
- delegated principal or agent
- active domain
- scope of delegation
- constraint checks applied

This ensures delegated authority remains explainable and reviewable.

---

## Summary

Delegation in Agent Arbiter is:

- **explicit** — always declared, never inferred
- **domain-scoped** — bounded to the active context
- **bounded** — limits on type, depth, and time
- **terminating** — no infinite or circular chains
- **non-escalatory** — cannot exceed the source authority

These rules ensure that delegated authority remains practical, safe, and computable in real systems.
