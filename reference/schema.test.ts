// Validates every example scenario against schema/authority-graph.json.
// Run alone via `npm run validate`.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { Ajv } from 'ajv'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const examplesDir = join(repoRoot, 'examples')

const schema = JSON.parse(readFileSync(join(repoRoot, 'schema', 'authority-graph.json'), 'utf8'))
const ajv = new Ajv({ allErrors: true, strict: true })
const validate = ajv.compile(schema)

const exampleFiles = readdirSync(examplesDir)
  .filter((f) => f.endsWith('.json'))
  .sort()

describe('schema validation', () => {
  it('finds example scenarios', () => {
    expect(exampleFiles.length).toBeGreaterThan(0)
  })

  it.each(exampleFiles)('%s validates against authority-graph.json', (file) => {
    const data = JSON.parse(readFileSync(join(examplesDir, file), 'utf8'))
    const valid = validate(data)
    expect(validate.errors ?? []).toEqual([])
    expect(valid).toBe(true)
  })
})
