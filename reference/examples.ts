// Authority Arbiter — Reference Examples
// Stub. See examples/ for JSON scenario files.

import { resolve } from './resolver'

// Example: Pricing conflict
const pricingAgents = ['Sales', 'Billing', 'Customer']
const pricingAuthority = (agent: string): number => {
  const scores: Record<string, number> = {
    Sales: 0.6,
    Billing: 0.9,
    Customer: 0.4,
  }
  return scores[agent] ?? 0
}

const winner = resolve(pricingAgents, pricingAuthority)
console.log(`Selected agent: ${winner}`) // → Billing
