import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { SEOHead } from '@/lib/seo'

afterEach(() => {
  cleanup()
  // Explicitly remove hoisted metadata between tests to guard against jsdom persistence
  document.head
    .querySelectorAll(
      'title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="preload"]',
    )
    .forEach((el) => el.remove())
})

describe('SEOHead', () => {
  it('sets document title with site name suffix', () => {
    render(<SEOHead title="Menu" description="Browse our Caribbean dishes" />)
    expect(document.title).toBe('Menu | Trinicanjam Cuisine')
  })

  it('renders description meta tag', () => {
    render(<SEOHead title="Menu" description="Browse our Caribbean dishes" />)
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe('Browse our Caribbean dishes')
  })

  it('renders og:type as website', () => {
    render(<SEOHead title="Menu" description="Browse our Caribbean dishes" />)
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'website',
    )
  })

  it('renders og:image when ogImage prop is provided', () => {
    render(
      <SEOHead
        title="Home"
        description="Trinicanjam home"
        ogImage="https://trinicanjam.ca/assets/og-image.jpg"
      />,
    )
    expect(
      document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    ).toBe('https://trinicanjam.ca/assets/og-image.jpg')
  })

  it('omits og:image when ogImage is not provided', () => {
    render(<SEOHead title="Menu" description="Browse our Caribbean dishes" />)
    expect(document.querySelector('meta[property="og:image"]')).toBeNull()
  })

  it('renders twitter:card as summary_large_image', () => {
    render(<SEOHead title="Menu" description="Browse our Caribbean dishes" />)
    expect(
      document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    ).toBe('summary_large_image')
  })

  it('renders preload link when preloadHeroImage is provided', () => {
    render(
      <SEOHead
        title="Home"
        description="Trinicanjam home"
        preloadHeroImage="/assets/images/hero.webp"
      />,
    )
    const preloadLink = document.querySelector('link[rel="preload"]')
    expect(preloadLink).toBeTruthy()
    expect(preloadLink?.getAttribute('as')).toBe('image')
    expect(preloadLink?.getAttribute('href')).toBe('/assets/images/hero.webp')
    expect(preloadLink?.getAttribute('fetchpriority')).toBe('high')
  })

  it('omits preload link when preloadHeroImage is not provided', () => {
    render(<SEOHead title="Menu" description="Browse our Caribbean dishes" />)
    expect(document.querySelector('link[rel="preload"]')).toBeNull()
  })
})
