// Resolves every example scenario with the reference resolver and asserts
// it reaches the resolution declared in the file, independent of input order.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { resolve, EmptyConflictSetError, type AuthorityGraph } from './resolver.js'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const examplesDir = join(repoRoot, 'examples')

const loadExample = (file: string): AuthorityGraph =>
  JSON.parse(readFileSync(join(examplesDir, file), 'utf8')) as AuthorityGraph

/** Reverses every top-level array to check input-order independence. */
const permuted = (graph: AuthorityGraph): AuthorityGraph => ({
  ...graph,
  principals: [...graph.principals].reverse(),
  agents: [...graph.agents].reverse(),
  edges: [...graph.edges].reverse(),
  conflict: graph.conflict
    ? { ...graph.conflict, proposals: [...graph.conflict.proposals].reverse() }
    : undefined,
})

const exampleFiles = readdirSync(examplesDir)
  .filter((f) => f.endsWith('.json'))
  .sort()

describe('example scenarios', () => {
  it.each(exampleFiles)('%s resolves to its declared winner', (file) => {
    const graph = loadExample(file)
    const result = resolve(graph)
    expect(result.selected_agent).toBe(graph.resolution?.selected_agent)
    if (graph.resolution?.selected_action) {
      expect(result.selected_action).toBe(graph.resolution.selected_action)
    }
    if (graph.resolution?.selected_principal) {
      expect(result.selected_principal).toBe(graph.resolution.selected_principal)
    }
  })

  it.each(exampleFiles)('%s resolves identically under input permutation', (file) => {
    const graph = loadExample(file)
    const original = resolve(graph)
    const reversed = resolve(permuted(graph))
    expect(reversed.selected_agent).toBe(original.selected_agent)
    expect(reversed.selected_action).toBe(original.selected_action)
    expect(reversed.decided_by).toBe(original.decided_by)
  })
})

describe('resolver behavior', () => {
  it('throws a typed error on an empty conflict set', () => {
    const graph: AuthorityGraph = { principals: [], agents: [], edges: [] }
    expect(() => resolve(graph)).toThrow(EmptyConflictSetError)
    expect(() =>
      resolve({ ...graph, conflict: { domain: 'pricing', proposals: [] } }),
    ).toThrow(EmptyConflictSetError)
  })

  it('caps delegated authority at the minimum of the chain', () => {
    const graph = loadExample('contract-delegation.json')
    const result = resolve(graph)
    expect(result.scores['sales-agent']).toMatchObject({ layer: 'institutional', weight: 0.6 })
    expect(result.scores['legal-agent']).toMatchObject({ layer: 'institutional', weight: 0.9 })
    expect(result.decided_by).toBe('weight')
  })

  it('lets a higher layer override a higher weight', () => {
    const graph = loadExample('hvac-system.json')
    const result = resolve(graph)
    expect(result.scores['hvac-agent']?.layer).toBe('constitutional')
    expect(result.decided_by).toBe('layer')
  })

  it('records the granting path for auditability', () => {
    const result = resolve(loadExample('pricing-conflict.json'))
    expect(result.scores['billing-agent']?.path).toEqual(['org', 'billing-agent'])
    expect(result.scores['sales-agent']?.path).toEqual(['org', 'sales-agent'])
  })
})
