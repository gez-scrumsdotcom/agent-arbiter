# Resolution Specification

> Stub — to be completed.

Defines the algorithm for selecting a winning action from a set of conflicting proposals.

## Algorithm

```
selected_action = argmax(authority(agent, context))
```

## Steps

1. Collect all proposed actions from competing agents
2. Detect conflicts between proposals
3. Compute authority score for each agent in context
4. Select the action from the agent with the highest authority
5. Log the resolution with full traceability

## Tie-breaking

- If two agents have equal authority, the higher layer takes precedence
- If still equal, the most recently granted authority wins
- Ties must never produce non-deterministic output
