// src/lib/useReducedMotion.test.ts
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  function createMqlMock(matches: boolean): MediaQueryList {
    return {
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  }

  it('returns false when prefers-reduced-motion: no-preference', () => {
    vi.mocked(window.matchMedia).mockReturnValue(createMqlMock(false))

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion: reduce', () => {
    vi.mocked(window.matchMedia).mockReturnValue(createMqlMock(true))

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(true)
  })

  it('cleans up the MediaQueryList listener on unmount', () => {
    const mql = createMqlMock(false)
    vi.mocked(window.matchMedia).mockReturnValue(mql)

    const { unmount } = renderHook(() => useReducedMotion())
    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
