// Agent Arbiter — Reference Resolver
//
// Implements the resolution steps of spec/resolution.md over an authority
// graph as defined by schema/authority-graph.json:
//
//   1. Identify the conflict set              → graph.conflict.proposals
//   2. Evaluate authority for each agent      → authorityOf()
//   3. Apply layer precedence                 → LAYER_RANK, compareScores()
//   4. Apply delegation rules and bounds      → delegation traversal below
//   5. Select the highest-authority agent     → selection + tie-break

export type Layer = 'constitutional' | 'institutional' | 'system' | 'agent'

export type Relationship =
  | 'governs'
  | 'delegates'
  | 'owns_truth'
  | 'constrains'
  | 'represents'

export interface Principal {
  id: string
  type: string
  name: string
  /** Domains where this principal is eligible; omitted = all domains. */
  domain?: string[]
  metadata?: Record<string, unknown>
}

export interface AgentNode {
  id: string
  principal_id: string
  name: string
  /** Domains where this agent is eligible; omitted = all domains. */
  domain?: string[]
  metadata?: Record<string, unknown>
}

export interface DelegationScope {
  actions?: string[]
  time_window?: string
  constraints?: string[]
}

export interface Edge {
  from: string
  to: string
  layer: Layer
  /** The single domain in which this relationship applies (exact match). */
  domain: string
  relationship: Relationship
  weight?: number
  scope?: DelegationScope
  metadata?: Record<string, unknown>
}

export interface Context {
  domain?: string
  system_of_record?: string
  constraints?: string[]
  metadata?: Record<string, unknown>
}

export interface Proposal {
  id: string
  agent: string
  action: string
}

export interface Conflict {
  domain: string
  proposals: Proposal[]
}

export type ExpectedError = 'empty_conflict_set' | 'delegation_cycle'

export interface DeclaredResolution {
  rule?: string
  authority_scores?: Record<string, number>
  selected_agent?: string
  selected_principal?: string
  selected_action?: string
  reason?: string
  rejected?: { proposal_id: string; reason: string }[]
  /** For negative-path scenarios: the error the resolver must raise. */
  expected_error?: ExpectedError
}

export interface AuthorityGraph {
  scenario?: string
  description?: string
  principals: Principal[]
  agents: AgentNode[]
  edges: Edge[]
  context?: Context
  conflict?: Conflict
  resolution?: DeclaredResolution
}

/** Layer precedence: a higher rank always overrides a lower rank. */
export const LAYER_RANK: Record<Layer, number> = {
  constitutional: 4,
  institutional: 3,
  system: 2,
  agent: 1,
}

/** Recommended limit from spec/delegation-rules.md. */
export const MAX_DELEGATION_DEPTH = 3

/**
 * Effective authority of a node: the lexicographic tuple
 * `A(agent, context) = (L, s)` from spec/authority-model.md — the highest
 * applicable layer and the within-layer weight — plus the granting path
 * for auditability. `layer: null` means the node holds no authority in
 * the active domain.
 */
export interface AuthorityScore {
  layer: Layer | null
  weight: number
  /** Node ids along the granting path, origin first. */
  path: string[]
}

/** Which tie-break stage decided the outcome (see spec/resolution.md). */
export type DecisionStage = 'layer' | 'weight' | 'agent_id'

export interface CandidateTrace {
  agent: string
  score: AuthorityScore
  notes: string[]
}

export interface Resolution {
  selected_agent: string
  selected_principal: string | null
  selected_action: string
  selected_proposal: string
  scores: Record<string, AuthorityScore>
  decided_by: DecisionStage
  trace: CandidateTrace[]
}

/** The conflict set is empty or missing; there is nothing to resolve. */
export class EmptyConflictSetError extends Error {
  constructor() {
    super('conflict set is empty: at least one proposal is required')
    this.name = 'EmptyConflictSetError'
  }
}

/** A delegation chain revisits a node; delegation must terminate. */
export class DelegationCycleError extends Error {
  readonly cycle: string[]
  constructor(cycle: string[]) {
    super(`delegation cycle detected: ${cycle.join(' → ')}`)
    this.name = 'DelegationCycleError'
    this.cycle = cycle
  }
}

/**
 * Compares two authority tuples `(L, s)` lexicographically. Positive when
 * `a` outranks `b`. Any authority at a higher layer outranks all authority
 * at lower layers regardless of weight, so strict layer override holds by
 * construction. Authority is override-based, not additive: no sum of lower
 * grants can outrank a single higher one.
 */
export function compareScores(a: AuthorityScore, b: AuthorityScore): number {
  const rank = (s: AuthorityScore): number => (s.layer ? LAYER_RANK[s.layer] : 0)
  return rank(a) - rank(b) || a.weight - b.weight
}

/**
 * Resolves a conflict set to a single proposal.
 *
 * Deterministic: the result is independent of the order of agents,
 * edges, and proposals in the input.
 *
 * @throws EmptyConflictSetError when the conflict set is empty
 * @throws DelegationCycleError when a candidate's authority depends on a
 *   circular delegation chain
 */
export function resolve(graph: AuthorityGraph): Resolution {
  const proposals = graph.conflict?.proposals ?? []
  if (proposals.length === 0) throw new EmptyConflictSetError()
  const domain = graph.conflict?.domain ?? graph.context?.domain ?? ''

  const agentsById = new Map(graph.agents.map((a) => [a.id, a]))
  const principalsById = new Map(graph.principals.map((p) => [p.id, p]))

  // Domain filter: only edges whose domain exactly matches are considered.
  const inbound = new Map<string, Edge[]>()
  for (const edge of graph.edges) {
    if (edge.domain !== domain) continue
    const list = inbound.get(edge.to)
    if (list) list.push(edge)
    else inbound.set(edge.to, [edge])
  }

  // Entity eligibility: a declared domain list must include the active domain.
  const eligible = (id: string): boolean => {
    const domains = agentsById.get(id)?.domain ?? principalsById.get(id)?.domain
    return !domains || domains.includes(domain)
  }

  // Effective authority of a node: MAX over its valid inbound sources.
  // Delegation is non-escalatory — a delegated grant is capped at the
  // minimum (layer, weight) along the chain — bounded by
  // MAX_DELEGATION_DEPTH, and must not revisit a node.
  const authorityOf = (
    node: string,
    path: string[],
    depth: number,
    notes: string[],
  ): AuthorityScore => {
    let best: AuthorityScore = { layer: null, weight: 0, path: [node] }
    for (const edge of inbound.get(node) ?? []) {
      let candidate: AuthorityScore
      if (edge.relationship !== 'delegates') {
        candidate = { layer: edge.layer, weight: edge.weight ?? 0, path: [edge.from, node] }
      } else {
        const cycleStart = path.indexOf(edge.from)
        if (cycleStart !== -1) {
          throw new DelegationCycleError([...path.slice(cycleStart), node, edge.from])
        }
        if (depth >= MAX_DELEGATION_DEPTH) {
          notes.push(`delegation via ${edge.from} truncated at max depth ${MAX_DELEGATION_DEPTH}`)
          continue
        }
        if (!eligible(edge.from)) {
          notes.push(`delegation from ${edge.from} skipped: source not eligible in domain "${domain}"`)
          continue
        }
        const source = authorityOf(edge.from, [...path, edge.from], depth + 1, notes)
        if (source.layer === null) {
          if (!principalsById.has(edge.from)) {
            // An agent cannot delegate authority it does not hold.
            notes.push(`delegation from ${edge.from} conveys nothing: source holds no authority in domain "${domain}"`)
            continue
          }
          // A principal with no inbound authority is an origin: the edge
          // itself constitutes the grant.
          candidate = { layer: edge.layer, weight: edge.weight ?? 0, path: [edge.from, node] }
        } else {
          const layer =
            LAYER_RANK[edge.layer] <= LAYER_RANK[source.layer] ? edge.layer : source.layer
          candidate = {
            layer,
            weight: Math.min(edge.weight ?? 0, source.weight),
            path: [...source.path, node],
          }
        }
      }
      if (compareScores(candidate, best) > 0) best = candidate
    }
    return best
  }

  const candidateIds = [...new Set(proposals.map((p) => p.agent))].sort()
  const scores: Record<string, AuthorityScore> = {}
  const trace: CandidateTrace[] = []
  for (const id of candidateIds) {
    const notes: string[] = []
    let score: AuthorityScore = { layer: null, weight: 0, path: [id] }
    if (!agentsById.has(id)) {
      notes.push(`agent "${id}" is not declared in the graph`)
    } else if (!eligible(id)) {
      notes.push(`agent not eligible in domain "${domain}"`)
    } else {
      score = authorityOf(id, [id], 0, notes)
      if (score.layer === null) notes.push(`no applicable authority in domain "${domain}"`)
    }
    scores[id] = score
    trace.push({ agent: id, score, notes })
  }

  // Selection: (layer, weight) descending, then lexicographic agent id.
  const ordered = [...candidateIds].sort((a, b) => {
    const byScore = compareScores(scores[b]!, scores[a]!)
    return byScore !== 0 ? byScore : a < b ? -1 : 1
  })
  const winner = ordered[0]!
  const runnerUp = ordered[1]

  let decidedBy: DecisionStage = 'layer'
  if (runnerUp !== undefined) {
    const w = scores[winner]!
    const r = scores[runnerUp]!
    if (w.layer !== r.layer) decidedBy = 'layer'
    else if (w.weight !== r.weight) decidedBy = 'weight'
    else decidedBy = 'agent_id'
  }

  const selectedProposal = proposals
    .filter((p) => p.agent === winner)
    .sort((a, b) => (a.id < b.id ? -1 : 1))[0]!

  return {
    selected_agent: winner,
    selected_principal: agentsById.get(winner)?.principal_id ?? null,
    selected_action: selectedProposal.action,
    selected_proposal: selectedProposal.id,
    scores,
    decided_by: decidedBy,
    trace,
  }
}
