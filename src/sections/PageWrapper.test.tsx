import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('@/lib/analytics', () => ({
  trackInstagramClick: vi.fn(),
}))

import { trackInstagramClick } from '@/lib/analytics'
import { MAIN_CONTENT_ID } from '@/components/SkipLink/SkipLink'
import { PageWrapper } from '@/sections/PageWrapper'
import { TonalZoneProvider } from '@/context/TonalZoneContext'

function renderWithProvider(ui: React.ReactElement) {
  return render(<TonalZoneProvider>{ui}</TonalZoneProvider>)
}

describe('PageWrapper', () => {
  it('renders a focusable main landmark around the three content zones', () => {
    renderWithProvider(<PageWrapper />)

    const main = document.querySelector(`main#${MAIN_CONTENT_ID}`)
    expect(main).toBeTruthy()
    expect(main?.getAttribute('tabindex')).toBe('-1')
    expect(main?.querySelector('[data-zone="dark"]')).toBeTruthy()
    expect(main?.querySelector('[data-zone="warm"]')).toBeTruthy()
    expect(main?.querySelector('section[data-zone="gradient"]')).toBeTruthy()
  })

  it('renders three zone sections with correct data-zone attributes', () => {
    renderWithProvider(<PageWrapper />)
    expect(document.querySelector('[data-zone="dark"]')).toBeTruthy()
    expect(document.querySelector('[data-zone="warm"]')).toBeTruthy()
    // gradient zone appears in both section and footer
    const gradientEls = document.querySelectorAll('[data-zone="gradient"]')
    expect(gradientEls.length).toBeGreaterThanOrEqual(2)
  })

  it('renders heroSlot content in the dark zone', () => {
    renderWithProvider(<PageWrapper heroSlot={<h1>Hero Content</h1>} />)
    const darkZone = document.querySelector('section[data-zone="dark"]')
    expect(darkZone?.textContent).toContain('Hero Content')
  })

  it('renders contentSlot content in the warm zone', () => {
    renderWithProvider(<PageWrapper contentSlot={<p>Main Content</p>} />)
    const warmZone = document.querySelector('[data-zone="warm"]')
    expect(warmZone?.textContent).toContain('Main Content')
  })

  it('renders visitSlot content in the gradient zone section', () => {
    renderWithProvider(<PageWrapper visitSlot={<p>Visit Info</p>} />)
    const gradientSection = document.querySelector('section[data-zone="gradient"]')
    expect(gradientSection?.textContent).toContain('Visit Info')
  })

  it('renders footer with dynamic copyright year and Instagram link', () => {
    renderWithProvider(<PageWrapper />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} Trinicanjam Cuisine. Hamilton, Ontario.`))).toBeTruthy()

    const instagramLink = screen.getByRole('link', { name: /instagram/i })
    expect(instagramLink).toBeTruthy()
    expect(instagramLink.getAttribute('href')).toBe('https://instagram.com/trinicanjam')
    expect(instagramLink.getAttribute('target')).toBe('_blank')
    expect(instagramLink.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('calls trackInstagramClick when the footer Instagram link is clicked', () => {
    renderWithProvider(<PageWrapper />)

    const instagramLink = screen.getByRole('link', { name: /instagram/i })
    fireEvent.click(instagramLink)

    expect(trackInstagramClick).toHaveBeenCalledTimes(1)
  })

  it('renders slots as empty when no props provided', () => {
    renderWithProvider(<PageWrapper />)
    const darkZone = document.querySelector('section[data-zone="dark"]')
    const warmZone = document.querySelector('[data-zone="warm"]')
    const gradientSection = document.querySelector('section[data-zone="gradient"]')
    // Zones exist but contain no user content (only the footer has text)
    expect(darkZone).toBeTruthy()
    expect(warmZone).toBeTruthy()
    expect(gradientSection).toBeTruthy()
    expect(darkZone?.textContent).toBe('')  // section[data-zone="dark"] has no slot content
    expect(warmZone?.textContent).toBe('')
    expect(gradientSection?.textContent).toBe('')
  })
})
