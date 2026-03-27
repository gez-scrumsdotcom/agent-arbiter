// Authority Arbiter — Reference Resolver
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
 * Weights are illustrative — replace with real authority model.
 */
function computeAuthority(agent: Agent, context: string): number {
  // TODO: implement full authority model per spec/authority-model.md
  const weights: Record<string, number> = {}
  return weights[agent] ?? 0
}

export { resolve, computeAuthority }
