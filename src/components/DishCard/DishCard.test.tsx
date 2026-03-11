import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { MenuItem } from '@/types'
import { DishCard } from './DishCard'

const mockItem: MenuItem = {
  id: '1',
  name: 'Jerk Chicken',
  description: 'Slow-smoked chicken marinated in our signature jerk blend with scotch bonnet peppers.',
  price: '$28',
  category: 'mains',
  // imageSrc intentionally omitted to test AC3 baseline
}

const mockFeaturedItem: MenuItem = {
  id: '2',
  name: 'Oxtail Stew',
  description: 'Slow-braised Jamaican oxtail with butter beans, reduced to a deeply savoury, gelatinous glory.',
  price: '$32',
  category: 'mains',
  imageSrc: '/images/oxtail-stew.jpg',
  featured: true,
}

const mockItemNoImage: MenuItem = {
  id: '3',
  name: 'Doubles',
  description: "Trinidad's most iconic street food.",
  price: '$9',
  category: 'starters',
}

describe('DishCard', () => {
  it('renders the dish name', () => {
    render(<DishCard item={mockItem} />)
    expect(screen.getByRole('heading', { name: 'Jerk Chicken' })).toBeTruthy()
  })

  it('renders the price', () => {
    render(<DishCard item={mockItem} />)
    expect(screen.getByText('$28')).toBeTruthy()
  })

  it('renders no <img> when imageSrc is undefined', () => {
    const { container } = render(<DishCard item={mockItem} />)
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it('renders an <img> when imageSrc is provided', () => {
    const itemWithImage: MenuItem = { ...mockItem, imageSrc: '/images/jerk-chicken.jpg' }
    render(<DishCard item={itemWithImage} />)
    expect(screen.getByRole('img', { name: 'Jerk Chicken' })).toBeTruthy()
  })

  // Featured variant tests (AC7)
  it('renders with data-variant="featured" when variant is featured', () => {
    const { container } = render(<DishCard item={mockFeaturedItem} variant="featured" />)
    expect(container.querySelector('[data-variant="featured"]')).toBeTruthy()
  })

  it('renders featured image with 800x450 dimensions', () => {
    const { getByRole } = render(<DishCard item={mockFeaturedItem} variant="featured" />)
    const img = getByRole('img')
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '450')
  })

  it('renders compact image with 400x300 dimensions (regression)', () => {
    const { getByRole } = render(<DishCard item={mockFeaturedItem} variant="compact" />)
    const img = getByRole('img')
    expect(img).toHaveAttribute('width', '400')
    expect(img).toHaveAttribute('height', '300')
  })

  it('renders placeholder (no img) when imageSrc absent in featured variant', () => {
    const { container } = render(<DishCard item={mockItemNoImage} variant="featured" />)
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it('featured variant description applies descriptionFeatured class (removes line-clamp)', () => {
    // AC7(3): when variant="featured", the <p> must carry the descriptionFeatured CSS class,
    // which sets display:block and -webkit-line-clamp:unset — removing the compact 2-line clamp
    const { container } = render(<DishCard item={mockFeaturedItem} variant="featured" />)
    const description = container.querySelector('p')
    expect(description).toBeTruthy()
    expect(description!.className).toContain('descriptionFeatured')
  })
})
