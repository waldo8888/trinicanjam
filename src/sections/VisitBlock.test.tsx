import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisitBlock } from './VisitBlock'

vi.mock('@/lib/analytics', () => ({
  trackHoursView: vi.fn(),
  trackPhoneClick: vi.fn(),
  trackDirectionsClick: vi.fn(),
}))

describe('VisitBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders restaurant address', () => {
    render(<VisitBlock />)

    expect(screen.getByText('Trinicanjam Cuisine')).toBeInTheDocument()
  })

  it('renders a tappable phone link', () => {
    render(<VisitBlock />)

    const link = screen.getByRole('link', { name: /905/i })
    expect(link.getAttribute('href')).toMatch(/^tel:/)
  })

  it("highlights today's hours row", () => {
    render(<VisitBlock />)

    const todayIndex = new Date().getDay()
    const todayRow = document.querySelector(`[data-testid="hours-row-${todayIndex}"]`)
    expect(todayRow?.className).toContain('todayRow')
  })

  it('Get Directions link has noopener noreferrer', () => {
    render(<VisitBlock />)

    const link = screen.getByRole('link', { name: /Get Directions/i })
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(link.getAttribute('rel')).toContain('noreferrer')
  })
})
