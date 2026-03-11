import { render } from '@testing-library/react'
import { BrandStorySection } from './BrandStorySection'

describe('BrandStorySection', () => {
  it('renders an h2 with id="brand-story-heading" and non-empty text content', () => {
    render(<BrandStorySection />)
    const heading = document.getElementById('brand-story-heading')
    expect(heading).not.toBeNull()
    expect(heading?.tagName).toBe('H2')
    expect(heading?.textContent?.trim()).not.toBe('')
  })

  it('the section has aria-labelledby="brand-story-heading"', () => {
    const { container } = render(<BrandStorySection />)
    const section = container.querySelector('section')
    expect(section).not.toBeNull()
    expect(section?.getAttribute('aria-labelledby')).toBe('brand-story-heading')
  })

  it('renders at least two paragraphs each with at least 50 characters of text content', () => {
    const { container } = render(<BrandStorySection />)
    const paragraphs = Array.from(container.querySelectorAll('p'))
    expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    paragraphs.forEach((p) => {
      expect(p.textContent?.length).toBeGreaterThanOrEqual(50)
    })
  })
})
