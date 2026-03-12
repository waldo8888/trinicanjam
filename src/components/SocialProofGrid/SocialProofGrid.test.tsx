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

  it('renders skeleton loading state initially', () => {
    render(<SocialProofGrid />)

    expect(screen.getByLabelText('Loading Instagram photos')).toBeInTheDocument()
  })

  it('renders six Instagram tile links', () => {
    render(<SocialProofGrid />)

    const links = screen.getAllByRole('link', { name: /View on Instagram/i })
    expect(links).toHaveLength(6)
  })

  it('all links have rel="noopener noreferrer"', () => {
    render(<SocialProofGrid />)

    const links = screen.getAllByRole('link', { name: /View on Instagram/i })
    links.forEach((link) => {
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    })
  })

  it('all links point to the Instagram profile URL', () => {
    render(<SocialProofGrid />)

    const links = screen.getAllByRole('link', { name: /View on Instagram/i })
    links.forEach((link) => {
      expect(link.getAttribute('href')).toBe('https://instagram.com/trinicanjam')
    })
  })

  it('all images have non-empty alt text and lazy loading', () => {
    render(<SocialProofGrid />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)

    images.forEach((image) => {
      expect(image.getAttribute('alt')).toBeTruthy()
      expect(image.getAttribute('alt')).not.toBe('')
      expect(image.getAttribute('loading')).toBe('lazy')
      expect(image.getAttribute('width')).toBe('400')
      expect(image.getAttribute('height')).toBe('400')
    })
  })

  it('uses descriptive alt copy for the curated Instagram tiles', () => {
    render(<SocialProofGrid />)

    expect(
      screen.getByRole('img', {
        name: 'Chef plating a Caribbean entree with fresh herbs at Trinicanjam Cuisine',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('img', {
        name: 'Dining room table set for service inside Trinicanjam Cuisine',
      }),
    ).toBeInTheDocument()
  })

  it('marks the grid as loaded after the first image fires onLoad', () => {
    render(<SocialProofGrid />)

    const firstImage = screen.getAllByRole('img')[0]
    fireEvent.load(firstImage)

    expect(screen.queryByLabelText('Loading Instagram photos')).not.toBeInTheDocument()
  })

  it('calls trackInstagramClick when a tile is clicked', () => {
    render(<SocialProofGrid />)

    const firstLink = screen.getAllByRole('link', { name: /View on Instagram/i })[0]
    fireEvent.click(firstLink)

    expect(mockTrackInstagramClick).toHaveBeenCalledTimes(1)
  })
})