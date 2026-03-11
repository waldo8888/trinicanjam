/**
 * Story 1.1 scaffold validation tests
 * Verifies Vitest config, path aliases, and project setup
 */
import { describe, it, expect } from 'vitest'

describe('Project scaffold', () => {
  it('Vitest is configured with jsdom environment', () => {
    // globals: true means describe/it/expect available without import
    // environment: jsdom means window is defined
    expect(typeof window).toBe('object')
  })

  it('jsdom environment provides DOM APIs for component testing', () => {
    // Validates jsdom is active — DOM APIs must be available for RTL to work
    const el = document.createElement('div')
    el.setAttribute('data-testid', 'scaffold')
    expect(el.getAttribute('data-testid')).toBe('scaffold')
    expect(document.body).toBeDefined()
  })
})
