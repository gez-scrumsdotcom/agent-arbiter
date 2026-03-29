// Agent Arbiter — Reference Resolver
// Stub implementation. See spec/resolution.md for full specification.

type Agent = string

/**
 * Resolves a conflict by selecting the agent with the highest authority.
 */
function resolve(
  candidates: Agent[],
  authority: (agent: Agent) => number
): Agent {
  return candidates.reduce((best, current) =>
    authority(current) > authority(best) ? current : best
  )
}

/**
 * Computes an authority score for an agent within a given context.
 *
 * This is a stub implementation.
 * Implementers should replace this with a domain-specific authority model
 * as defined in spec/authority-model.md.
 *
 * The example below illustrates a simple fixed-weight lookup.
 */
function computeAuthority(agent: Agent, _context: any): number {
  // Example only — replace with real authority computation
  const weights: Record<string, number> = {
    "billing-agent": 0.9,
    "sales-agent": 0.6,
    "customer-agent": 0.4
  }

  return weights[agent] ?? 0
}

export { resolve, computeAuthority }
