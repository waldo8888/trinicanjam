import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { trackDirectionsClick, trackHoursView, trackPhoneClick } from '@/lib/analytics'
import { VisitBlock } from './VisitBlock'

vi.mock('@/lib/analytics', () => ({
  trackHoursView: vi.fn(),
  trackPhoneClick: vi.fn(),
  trackDirectionsClick: vi.fn(),
  trackInstagramClick: vi.fn(),
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

  it('tracks hours view on mount', () => {
    render(<VisitBlock />)

    expect(trackHoursView).toHaveBeenCalledTimes(1)
  })

  it('Get Directions link has noopener noreferrer', () => {
    render(<VisitBlock />)

    const link = screen.getByRole('link', { name: /Get Directions/i })
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(link.getAttribute('rel')).toContain('noreferrer')
  })

  it('tracks directions clicks from the CTA', () => {
    render(<VisitBlock />)

    const directionsLink = screen.getByRole('link', { name: /Get Directions/i })
    directionsLink.addEventListener('click', event => event.preventDefault())

    fireEvent.click(directionsLink)

    expect(trackDirectionsClick).toHaveBeenCalledTimes(1)
  })

  it('tracks phone clicks from the phone link', () => {
    render(<VisitBlock />)

    const phoneLink = screen.getByRole('link', { name: /905/i })
    phoneLink.addEventListener('click', event => event.preventDefault())

    fireEvent.click(phoneLink)

    expect(trackPhoneClick).toHaveBeenCalledTimes(1)
  })

  it('renders the embedded map context before the CTAs', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', '')

    render(<VisitBlock />)

    const caption = screen.getByText('Trinicanjam Cuisine — Hamilton, Ontario')
    const directions = screen.getByRole('link', { name: /Get Directions/i })

    expect(screen.getByText('Map loading…')).toBeInTheDocument()
    expect(caption.compareDocumentPosition(directions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
