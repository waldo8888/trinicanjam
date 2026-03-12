import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readVercelConfig() {
  const configPath = resolve(process.cwd(), 'vercel.json')
  const configContents = readFileSync(configPath, 'utf8')

  return JSON.parse(configContents) as {
    headers: Array<{
      source: string
      headers: Array<{
        key: string
        value: string
      }>
    }>
  }
}

describe('launch readiness headers', () => {
  it('applies stale cache directives to the primary HTML route rule', () => {
    const config = readVercelConfig()
    const rootHeaders = config.headers.find((entry) => entry.source === '/(.*)')
    const cacheControl = rootHeaders?.headers.find((header) => header.key === 'Cache-Control')?.value

    expect(cacheControl).toContain('stale-while-revalidate=86400')
    expect(cacheControl).toContain('stale-if-error=86400')
  })
})