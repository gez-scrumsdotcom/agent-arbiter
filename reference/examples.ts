// Agent Arbiter — Reference Examples
// See examples/ for full JSON scenario files.

import { resolve } from './resolver'

// Example: Pricing conflict
// See examples/pricing-conflict.json
const pricingAgents = ['billing-agent', 'sales-agent', 'customer-agent']
const pricingAuthority = (agent: string): number => {
  const scores: Record<string, number> = {
    'billing-agent': 0.9,
    'sales-agent': 0.6,
    'customer-agent': 0.4,
  }
  return scores[agent] ?? 0
}

const winner = resolve(pricingAgents, pricingAuthority)
console.log(`Selected agent: ${winner}`) // → billing-agent
