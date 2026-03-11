import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>Content renders fine</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('Content renders fine')).toBeTruthy()
  })

  it('renders default fallback when child throws a render error', () => {
    // Suppress React's expected console.error for error boundary tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BrokenComponent(): ReactNode {
      throw new Error('Test render error')
    }

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong.')).toBeTruthy()
    consoleSpy.mockRestore()
  })

  it('renders custom fallback when provided and child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BrokenComponent(): ReactNode {
      throw new Error('Test render error')
    }

    render(
      <ErrorBoundary fallback={<p>Custom error UI</p>}>
        <BrokenComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error UI')).toBeTruthy()
    consoleSpy.mockRestore()
  })
})
