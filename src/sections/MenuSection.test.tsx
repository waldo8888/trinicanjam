import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as analytics from '@/lib/analytics'
import { MenuSection } from './MenuSection'

// vi.mock is hoisted — inline data to avoid TDZ errors
vi.mock('@/data/menu', () => ({
  MENU_ITEMS: [
    { id: 'doubles', name: 'Doubles', description: 'Classic Trinidadian street food', price: '$8', category: 'starters', featured: false },
    { id: 'roti', name: 'Roti Featured', description: 'Soft buss-up-shut with curry', price: '$14', category: 'starters', featured: true },
    { id: 'jerk-chicken', name: 'Jerk Chicken', description: 'Wood-fired Jamaican jerk', price: '$28', category: 'mains', featured: false },
  ],
  MENU_CATEGORIES: ['starters', 'mains'],
}))

// Stub DishCard — outputs data-variant for sort/variant observability
vi.mock('@/components/DishCard/DishCard', () => ({
  DishCard: ({ item, variant = 'compact' }: { item: { name: string }, variant?: string }) => (
    <div data-testid="dish-card" data-variant={variant}>{item.name}</div>
  ),
}))

const MOCK_CATEGORIES = ['starters', 'mains'] as const

describe('MenuSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a tab button for each category', () => {
    render(<MenuSection />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(MOCK_CATEGORIES.length)
    expect(screen.getByRole('tab', { name: /starters/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /mains/i })).toBeTruthy()
  })

  it('first tab is selected by default; all others are deselected', () => {
    render(<MenuSection />)
    expect(screen.getByRole('tab', { name: /starters/i })).toHaveAttribute('aria-selected', 'true')
    // aria-selected="false" must be explicitly set on inactive tabs (not just absent)
    expect(screen.getByRole('tab', { name: /mains/i })).toHaveAttribute('aria-selected', 'false')
  })

  it('clicking the second tab shows only items from that category', () => {
    render(<MenuSection />)

    // Default: starters shown (2 items)
    expect(screen.getAllByTestId('dish-card')).toHaveLength(2)

    // Click mains tab
    fireEvent.click(screen.getByRole('tab', { name: /mains/i }))

    // Only mains items rendered (1 item)
    expect(screen.getAllByTestId('dish-card')).toHaveLength(1)
    expect(screen.getByText('Jerk Chicken')).toBeTruthy()
    expect(screen.queryByText('Doubles')).toBeNull()
  })

  it('calls trackMenuView once on mount', () => {
    const spy = vi.spyOn(analytics, 'trackMenuView').mockImplementation(() => {})
    render(<MenuSection />)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  // Featured ordering tests (AC8)
  it('renders featured items before non-featured items', () => {
    const { container } = render(<MenuSection />)
    const cards = container.querySelectorAll('[data-variant]')
    expect(cards[0]).toHaveAttribute('data-variant', 'featured')
    expect(cards[1]).toHaveAttribute('data-variant', 'compact')
  })

  it('renders featured items with variant="featured"', () => {
    const { container } = render(<MenuSection />)
    const featuredCard = container.querySelector('[data-variant="featured"]')
    expect(featuredCard).toBeTruthy()
  })
})
