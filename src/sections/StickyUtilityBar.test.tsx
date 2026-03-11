import { render, screen, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useRef } from 'react'
import { StickyUtilityBar } from './StickyUtilityBar'

// Mock useReducedMotion — default to no preference
vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}))

import { useReducedMotion } from '@/lib/useReducedMotion'

// IntersectionObserver mock — capture the callback for manual triggering
let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {}
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: vi.fn((callback: (entries: IntersectionObserverEntry[]) => void) => {
    intersectionCallback = callback
    return { observe: mockObserve, disconnect: mockDisconnect }
  }),
})

/**
 * Renders StickyUtilityBar with a real ref attached to a <section> element.
 * Required so the useEffect guard (`if (!el) return`) doesn't bail out,
 * letting the IntersectionObserver get created and its callback captured.
 */
function renderWithRef() {
  const Wrapper = () => {
    const ref = useRef<HTMLElement>(null)
    return (
      <>
        <section ref={ref} data-testid="hero-zone" />
        <StickyUtilityBar heroRef={ref} />
      </>
    )
  }
  return render(<Wrapper />)
}

// Null ref for tests that only check static rendering (no observer needed)
const nullHeroRef = { current: null } as unknown as React.RefObject<HTMLElement>

describe('StickyUtilityBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    intersectionCallback = () => {}
    ;(useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false)
  })

  it('renders with opacity 0 (hidden) on initial mount', () => {
    renderWithRef()
    const nav = screen.getByRole('navigation', { name: 'Utility navigation' })
    expect(nav).toHaveStyle({ opacity: 0, pointerEvents: 'none' })
  })

  it('becomes visible when hero exits viewport (isIntersecting: false)', () => {
    renderWithRef()
    act(() => {
      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry])
    })
    const nav = screen.getByRole('navigation', { name: 'Utility navigation' })
    expect(nav).toHaveStyle({ opacity: 1, pointerEvents: 'auto' })
  })

  it('hides when hero re-enters viewport (isIntersecting: true)', () => {
    renderWithRef()
    act(() => {
      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry])
    })
    act(() => {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry])
    })
    const nav = screen.getByRole('navigation', { name: 'Utility navigation' })
    expect(nav).toHaveStyle({ opacity: 0 })
  })

  it('Menu link navigates to /#menu', () => {
    render(<StickyUtilityBar heroRef={nullHeroRef} />)
    const menuLink = screen.getByRole('link', { name: 'Menu' })
    expect(menuLink).toHaveAttribute('href', '/#menu')
  })

  it('Visit link navigates to /#visit', () => {
    render(<StickyUtilityBar heroRef={nullHeroRef} />)
    const visitLink = screen.getByRole('link', { name: 'Visit' })
    expect(visitLink).toHaveAttribute('href', '/#visit')
  })

  it('applies transitionDuration 0ms when useReducedMotion returns true', () => {
    ;(useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true)
    render(<StickyUtilityBar heroRef={nullHeroRef} />)
    const nav = screen.getByRole('navigation', { name: 'Utility navigation' })
    expect(nav).toHaveStyle({ transitionDuration: '0ms' })
  })

  it('nav has aria-label "Utility navigation"', () => {
    render(<StickyUtilityBar heroRef={nullHeroRef} />)
    expect(screen.getByRole('navigation', { name: 'Utility navigation' })).toBeInTheDocument()
  })

  it('calls IntersectionObserver.disconnect() on unmount', () => {
    const { unmount } = renderWithRef()
    unmount()
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
