import { vi, describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    })),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({
      kill: vi.fn(),
    })),
  },
}))

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
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

const heroImageAlt = 'Beautifully plated jerk chicken at Trinicanjam Cuisine'

describe('HeroSection', () => {
  it('renders a labelled hero region', () => {
    render(<HeroSection />)
    const region = screen.getByRole('region', { name: /Trinicanjam\s*Cuisine/i })
    expect(region).toBeTruthy()
    expect(region.tagName.toLowerCase()).toBe('section')
  })

  it('renders section with data-zone="dark"', () => {
    render(<HeroSection />)
    const region = screen.getByRole('region', { name: /Trinicanjam\s*Cuisine/i })
    expect(region.getAttribute('data-zone')).toBe('dark')
  })

  it('renders the hero image with the current production asset', () => {
    render(<HeroSection />)
    const img = screen.getByAltText(heroImageAlt)
    expect(img.getAttribute('src')).toBe('/assets/images/hero-food.png')
    expect(img.getAttribute('loading')).toBe('eager')
    expect(img.getAttribute('fetchpriority')).toBe('high')
  })

  it('renders the brand headline, message, and service highlights', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1, name: /Trinicanjam\s*Cuisine/i })).toBeTruthy()
    expect(screen.getByText(/Trinidadian and Jamaican comfort, plated with color, spice/i)).toBeTruthy()
    expect(screen.getByText('Open 7 days')).toBeTruthy()
    expect(screen.getByText('Takeout available')).toBeTruthy()
  })

  it('renders hero CTA links to menu and social sections', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: /Explore the Menu/i })).toHaveAttribute('href', '#menu')
    expect(screen.getByRole('link', { name: /See Today\'s Feed/i })).toHaveAttribute('href', '#social')
  })

  it('renders hero image with explicit width and height for CLS prevention', () => {
    render(<HeroSection />)
    const img = screen.getByAltText(heroImageAlt)
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

  it('hides text on initial render', () => {
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
    const img = screen.getByAltText(heroImageAlt)
    fireEvent.load(img)

    await waitFor(() => {
      const shimmer = container.querySelector('[class*="shimmer"]')
      expect(shimmer).not.toBeInTheDocument()
    })

    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).not.toMatch(/textHidden/)
  })

  it('calls animateHeroEntrance after onLoad', async () => {
    render(<HeroSection />)
    const img = screen.getByAltText(heroImageAlt)
    fireEvent.load(img)

    await waitFor(() => {
      expect(animateHeroEntrance).toHaveBeenCalledTimes(1)
    })
  })

  it('removes shimmer and shows text after onError', () => {
    const { container } = render(<HeroSection />)
    const img = screen.getByAltText(heroImageAlt)
    fireEvent.error(img)

    const shimmer = container.querySelector('[class*="shimmer"]')
    expect(shimmer).not.toBeInTheDocument()

    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).not.toMatch(/textHidden/)
  })
})

describe('HeroSection with prefers-reduced-motion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useReducedMotion).mockReturnValue(true)
  })

  it('shows text immediately with no shimmer when reduced motion is active', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('[class*="shimmer"]')).not.toBeInTheDocument()
    const textContent = container.querySelector('[class*="textContent"]')
    expect(textContent?.className).not.toMatch(/textHidden/)
  })

  it('does not call animateHeroEntrance when reduced motion is active', () => {
    render(<HeroSection />)
    const img = screen.getByAltText(heroImageAlt)
    fireEvent.load(img)
    expect(animateHeroEntrance).not.toHaveBeenCalled()
  })
})

describe('HeroSection performance guardrails', () => {
  it('does not use a gsap from() call on the hero image LCP path', () => {
    const sourcePath = resolve(process.cwd(), 'src/lib/animations/heroEntrance.ts')
    const source = readFileSync(sourcePath, 'utf8')
    expect(source).not.toContain('.from(elements.image')
  })
})
