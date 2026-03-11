// Mocks must be at file top — Vitest hoists these before imports
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    })),
  },
}))

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false), // default: no reduced motion
}))

vi.mock('@/lib/animations/heroEntrance', () => ({
  animateHeroEntrance: vi.fn((_, options?: { onReady?: () => void }) => {
    options?.onReady?.()
    return Promise.resolve()
  }),
}))

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { animateHeroEntrance } from '@/lib/animations/heroEntrance'
import { HeroSection } from '@/sections/HeroSection'

describe('HeroSection', () => {
  it('renders a section with role="banner"', () => {
    render(<HeroSection />)
    const banner = screen.getByRole('banner')
    expect(banner).toBeTruthy()
    expect(banner.tagName.toLowerCase()).toBe('section')
  })

  it('renders section with data-zone="dark"', () => {
    render(<HeroSection />)
    const banner = screen.getByRole('banner')
    expect(banner.getAttribute('data-zone')).toBe('dark')
  })

  it('renders hero image with correct src', () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toBe('/assets/images/hero.webp')
  })

  it('renders hero image with descriptive alt text', () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('alt')).toBe(
      'Restaurant interior and food presentation at Trinicanjam Cuisine',
    )
  })

  it('renders hero image with loading="eager" (not lazy)', () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('loading')).toBe('eager')
  })

  it('renders h1 with restaurant name', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Trinicanjam Cuisine')
  })

  it('renders brand tagline', () => {
    render(<HeroSection />)
    expect(screen.getByText('Caribbean Soul. Hamilton Table.')).toBeTruthy()
  })

  it('overlay div has aria-hidden="true"', () => {
    render(<HeroSection />)
    const banner = screen.getByRole('banner')
    const overlay = banner.querySelector('[aria-hidden="true"]')
    expect(overlay).toBeTruthy()
  })

  it('contains no buttons, nav, or anchor elements (AC5 — no UI controls)', () => {
    render(<HeroSection />)
    const banner = screen.getByRole('banner')
    expect(banner.querySelector('button')).toBeNull()
    expect(banner.querySelector('nav')).toBeNull()
    expect(banner.querySelector('a')).toBeNull()
  })

  it('renders hero image with explicit width and height for CLS prevention (AC6)', () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('width')).toBe('1920')
    expect(img.getAttribute('height')).toBe('1080')
  })
})

describe('HeroSection loading states', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useReducedMotion).mockReturnValue(false)
    vi.mocked(animateHeroEntrance).mockImplementation((_, options?: { onReady?: () => void }) => {
      options?.onReady?.()
      return Promise.resolve()
    })
  })

  it('hides text on initial render (visibility hidden)', () => {
    const { container } = render(<HeroSection />)
    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).toMatch(/textHidden/)
  })

  it('renders shimmer overlay on initial render', () => {
    const { container } = render(<HeroSection />)
    const shimmer = container.querySelector('[class*="shimmer"]')
    expect(shimmer).toBeInTheDocument()
    expect(shimmer).toHaveAttribute('aria-hidden', 'true')
  })

  it('removes shimmer and shows text after onLoad', async () => {
    const { container } = render(<HeroSection />)
    const img = screen.getByRole('img')
    fireEvent.load(img)

    await waitFor(() => {
      const shimmer = container.querySelector('[class*="shimmer"]')
      expect(shimmer).not.toBeInTheDocument()
    })

    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).not.toMatch(/textHidden/)
  })

  it('calls animateHeroEntrance after onLoad (normal motion)', async () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    fireEvent.load(img)

    await waitFor(() => {
      expect(animateHeroEntrance).toHaveBeenCalledTimes(1)
    })
  })

  it('removes shimmer and shows text after onError (broken image)', () => {
    const { container } = render(<HeroSection />)
    const img = screen.getByRole('img')
    fireEvent.error(img)

    const shimmer = container.querySelector('[class*="shimmer"]')
    expect(shimmer).not.toBeInTheDocument()

    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).not.toMatch(/textHidden/)
  })

  it('does NOT call animateHeroEntrance after onError', () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(animateHeroEntrance).not.toHaveBeenCalled()
  })
})

describe('HeroSection with prefers-reduced-motion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useReducedMotion).mockReturnValue(true)
  })

  it('shows text immediately with no shimmer when reduced motion is active', () => {
    const { container } = render(<HeroSection />)

    const shimmer = container.querySelector('[class*="shimmer"]')
    expect(shimmer).not.toBeInTheDocument()

    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).not.toMatch(/textHidden/)
  })

  it('does NOT call animateHeroEntrance when reduced motion is active', () => {
    render(<HeroSection />)
    const img = screen.getByRole('img')
    fireEvent.load(img)
    expect(animateHeroEntrance).not.toHaveBeenCalled()
  })
})
