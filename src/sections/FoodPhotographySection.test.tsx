// vi.mock calls MUST be at the top, before named imports — Vitest hoists them
vi.mock('@/assets/images/food-1.jpg', () => ({ default: '/mock/food-1.webp' }))
vi.mock('@/assets/images/food-2.jpg', () => ({ default: '/mock/food-2.webp' }))
vi.mock('@/assets/images/food-3.jpg', () => ({ default: '/mock/food-3.webp' }))
vi.mock('@/assets/images/food-4.jpg', () => ({ default: '/mock/food-4.webp' }))
vi.mock('@/assets/images/food-5.jpg', () => ({ default: '/mock/food-5.webp' }))
vi.mock('@/assets/images/food-6.jpg', () => ({ default: '/mock/food-6.webp' }))

import { render, screen } from '@testing-library/react'
import { FoodPhotographySection } from './FoodPhotographySection'

describe('FoodPhotographySection', () => {
  it('renders between 3 and 6 food images', () => {
    const { container } = render(<FoodPhotographySection />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThanOrEqual(3)
    expect(images.length).toBeLessThanOrEqual(6)
  })

  it('all images have non-empty alt attributes', () => {
    render(<FoodPhotographySection />)
    const images = screen.getAllByRole('img')
    images.forEach((img) => {
      const alt = img.getAttribute('alt')
      expect(alt).not.toBeNull()
      expect(alt).not.toBe('')
    })
  })

  it('first image is eager-loaded; all remaining images are lazy-loaded', () => {
    const { container } = render(<FoodPhotographySection />)
    const images = Array.from(container.querySelectorAll('img'))
    expect(images[0].getAttribute('loading')).toBe('eager')
    images.slice(1).forEach((img) => {
      expect(img.getAttribute('loading')).toBe('lazy')
    })
  })

  it('grid container has the CSS module class applied', () => {
    const { container } = render(<FoodPhotographySection />)
    const grid = container.querySelector('[class*="grid"]')
    expect(grid).not.toBeNull()
  })

  it('all images have explicit width=800 and height=600 to prevent CLS', () => {
    const { container } = render(<FoodPhotographySection />)
    const images = Array.from(container.querySelectorAll('img'))
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '800')
      expect(img).toHaveAttribute('height', '600')
    })
  })
})
