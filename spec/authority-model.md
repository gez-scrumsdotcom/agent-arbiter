# Authority Model

> Stub — to be completed.

Defines how authority is computed for an agent within a given context.

## Formula

```
A(agent, context) =
  hierarchy +
  contract +
  system_of_record +
  learned_signals
```

## Components

- **hierarchy** — weight derived from organizational position
- **contract** — weight derived from contractual relationships
- **system_of_record** — weight derived from ownership of canonical data
- **learned_signals** — weight derived from observed behaviour and trust over time
