import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
