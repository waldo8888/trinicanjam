import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { trackInstagramClick } from '@/lib/analytics'
import { SocialProofGrid } from './SocialProofGrid'

vi.mock('@/lib/analytics', () => ({
  trackInstagramClick: vi.fn(),
}))

const mockTrackInstagramClick = vi.mocked(trackInstagramClick)

describe('SocialProofGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the social proof header and profile actions', () => {
    render(<SocialProofGrid />)

    expect(screen.getByRole('heading', { name: /Fresh from @trinicanjamcuisine/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Follow on Instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/trinicanjamcuisine/',
    )
    expect(screen.getByRole('link', { name: /View Facebook/i })).toHaveAttribute(
      'href',
      'https://www.facebook.com/profile.php/?id=61561158214261',
    )
  })

  it('renders six linked social cards', () => {
    render(<SocialProofGrid />)

    const links = screen.getAllByRole('link')
    expect(links.filter((link) => link.getAttribute('href')?.includes('instagram.com/trinicanjamcuisine'))).toHaveLength(7)
  })

  it('renders local curated images with non-empty alt text', () => {
    render(<SocialProofGrid />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)
    images.forEach((image) => {
      expect(image.getAttribute('src')).toMatch(/^\/assets\/images\/social\//)
      expect(image.getAttribute('alt')).toBeTruthy()
      expect(image.getAttribute('loading')).toBe('lazy')
    })
  })

  it('shows the featured reel and a doubles-related card', () => {
    render(<SocialProofGrid />)

    expect(screen.getByText('Now Open 7 Days')).toBeInTheDocument()
    expect(screen.getByText('Toonie Tuesday Doubles')).toBeInTheDocument()
  })

  it('tracks Instagram clicks when a social card is clicked', () => {
    render(<SocialProofGrid />)

    const firstInstagramCard = screen.getByRole('link', { name: /Now Open 7 Days/i })
    fireEvent.click(firstInstagramCard)

    expect(mockTrackInstagramClick).toHaveBeenCalledTimes(1)
  })
})
