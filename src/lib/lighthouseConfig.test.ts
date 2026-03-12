import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type LhciAssertion = [string, { minScore?: number; maxNumericValue?: number }]

function readLighthouseConfig() {
  const configPath = resolve(process.cwd(), '.lighthouserc.json')
  const configContents = readFileSync(configPath, 'utf8')

  return JSON.parse(configContents) as {
    ci: {
      collect: {
        numberOfRuns: number
        settings: {
          preset?: string
          formFactor?: string
        }
      }
      assert: {
        assertions: Record<string, LhciAssertion>
      }
    }
  }
}

describe('Lighthouse launch gate configuration', () => {
  it('uses a mobile collection profile instead of the desktop bootstrap preset', () => {
    const config = readLighthouseConfig()

    expect(config.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(1)
    expect(config.ci.collect.settings.preset).not.toBe('desktop')
    expect(config.ci.collect.settings.formFactor).toBe('mobile')
  })

  it('treats the launch thresholds as hard failures', () => {
    const config = readLighthouseConfig()
    const { assertions } = config.ci.assert

    expect(assertions['categories:performance']).toEqual(['error', { minScore: 0.9 }])
    expect(assertions['categories:accessibility']).toEqual(['error', { minScore: 0.95 }])
    expect(assertions['categories:best-practices']).toEqual(['error', { minScore: 0.9 }])
    expect(assertions['categories:seo']).toEqual(['error', { minScore: 0.9 }])
    expect(assertions['largest-contentful-paint']).toEqual(['error', { maxNumericValue: 2500 }])
    expect(assertions['cumulative-layout-shift']).toEqual(['error', { maxNumericValue: 0.1 }])
    expect(assertions['interaction-to-next-paint']).toEqual(['error', { maxNumericValue: 200 }])
  })
})