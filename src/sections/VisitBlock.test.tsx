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
    window.history.replaceState({}, '', '/')
  })

  it('renders the updated restaurant address and phone', () => {
    render(<VisitBlock />)

    expect(screen.getByText('355 Main St E')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /\(905\) 524-0004/i })).toHaveAttribute(
      'href',
      'tel:+19055240004',
    )
  })

  it('renders service notes sourced from social profiles', () => {
    render(<VisitBlock />)

    expect(screen.getByText('Open 7 days a week')).toBeInTheDocument()
    expect(screen.getByText('Takeout available')).toBeInTheDocument()
    expect(screen.getByText(/Daily specials announced on Instagram and Facebook/i)).toBeInTheDocument()
  })

  it('tracks service view on the dedicated visit route', () => {
    window.history.replaceState({}, '', '/visit')
    render(<VisitBlock />)
    expect(trackHoursView).toHaveBeenCalledTimes(1)
  })

  it('tracks directions clicks from the CTA', () => {
    render(<VisitBlock />)

    const directionsLink = screen.getByRole('link', { name: /Get Directions/i })
    directionsLink.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(directionsLink)

    expect(trackDirectionsClick).toHaveBeenCalledTimes(1)
  })

  it('tracks phone clicks from the phone link', () => {
    render(<VisitBlock />)

    const phoneLink = screen.getByRole('link', { name: /\(905\) 524-0004/i })
    phoneLink.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(phoneLink)

    expect(trackPhoneClick).toHaveBeenCalledTimes(1)
  })

  it('renders the embedded map context before the visit details', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', '')
    render(<VisitBlock />)

    const caption = screen.getByText('Trinicanjam Cuisine — Hamilton, Ontario')
    const directions = screen.getByRole('link', { name: /Get Directions/i })
    const iframe = screen.getByTitle('Trinicanjam Cuisine location map')

    expect(iframe).toBeInTheDocument()
    expect(caption.compareDocumentPosition(directions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
