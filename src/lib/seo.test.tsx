import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { SEOHead, SITE_URL, RestaurantSchema } from '@/lib/seo'

afterEach(() => {
  cleanup()
  // Explicitly remove hoisted metadata between tests to guard against jsdom persistence
  document.head
    .querySelectorAll(
      'title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="preload"], script[type="application/ld+json"]',
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

  it('renders og:url when ogUrl prop is provided', () => {
    render(<SEOHead title="Home" description="desc" ogUrl="https://trinicanjam.ca" />)
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe('https://trinicanjam.ca')
  })

  it('omits og:url when ogUrl is not provided', () => {
    render(<SEOHead title="Home" description="desc" />)
    expect(document.querySelector('meta[property="og:url"]')).toBeNull()
  })

  it('renders twitter:image when ogImage is provided', () => {
    render(
      <SEOHead
        title="Home"
        description="desc"
        ogImage="https://trinicanjam.ca/assets/og-image.jpg"
      />,
    )
    expect(
      document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
    ).toBe('https://trinicanjam.ca/assets/og-image.jpg')
  })

  it('omits twitter:image when ogImage is not provided', () => {
    render(<SEOHead title="Home" description="desc" />)
    expect(document.querySelector('meta[name="twitter:image"]')).toBeNull()
  })

  it('renders og:type with custom value when ogType prop is provided', () => {
    render(<SEOHead title="Home" description="desc" ogType="article" />)
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article')
  })

  it('renders og:type as website by default', () => {
    render(<SEOHead title="Home" description="desc" />)
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('website')
  })

  it('renders twitter:card with custom value when twitterCard prop is provided', () => {
    render(<SEOHead title="Home" description="desc" twitterCard="summary" />)
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary')
  })

  it('exports SITE_URL constant as the production domain', () => {
    expect(SITE_URL).toBe('https://trinicanjam.ca')
  })
})

describe('RestaurantSchema', () => {
  it('renders a script tag with type application/ld+json', () => {
    render(<RestaurantSchema />)
    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
  })

  it('script content is valid JSON with @type Restaurant', () => {
    render(<RestaurantSchema />)
    const script = document.querySelector('script[type="application/ld+json"]')
    const parsed = JSON.parse(script?.textContent ?? '{}')
    expect(parsed['@type']).toBe('Restaurant')
  })

  it('schema has a non-empty name', () => {
    render(<RestaurantSchema />)
    const script = document.querySelector('script[type="application/ld+json"]')
    const parsed = JSON.parse(script?.textContent ?? '{}')
    expect(typeof parsed.name).toBe('string')
    expect(parsed.name.length).toBeGreaterThan(0)
  })

  it('openingHoursSpecification is an array with at least one entry', () => {
    render(<RestaurantSchema />)
    const script = document.querySelector('script[type="application/ld+json"]')
    const parsed = JSON.parse(script?.textContent ?? '{}')
    expect(Array.isArray(parsed.openingHoursSpecification)).toBe(true)
    expect(parsed.openingHoursSpecification.length).toBeGreaterThanOrEqual(1)
  })
})
