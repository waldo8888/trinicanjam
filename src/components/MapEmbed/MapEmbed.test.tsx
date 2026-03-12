import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapEmbed } from './MapEmbed'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('MapEmbed', () => {
  it('renders an iframe when VITE_MAPS_EMBED_KEY is set', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', 'test-api-key-123')

    render(<MapEmbed />)

    const iframe = screen.getByTitle('Trinicanjam Cuisine location map')
    expect(iframe.tagName).toBe('IFRAME')
    expect((iframe as HTMLIFrameElement).src).toContain('www.google.com/maps/embed/v1/place')
    expect((iframe as HTMLIFrameElement).src).toContain('test-api-key-123')
  })

  it('renders a placeholder when VITE_MAPS_EMBED_KEY is empty', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', '')

    render(<MapEmbed />)

    expect(screen.getByText('Map loading…')).toBeInTheDocument()
    expect(screen.queryByTitle('Trinicanjam Cuisine location map')).not.toBeInTheDocument()
  })

  it('renders a figcaption in both states', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', '')

    render(<MapEmbed />)

    expect(screen.getByText('Trinicanjam Cuisine — Hamilton, Ontario')).toBeInTheDocument()
  })

  it('sets lazy loading on the iframe when a key is provided', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', 'test-key')

    render(<MapEmbed />)

    const iframe = screen.getByTitle('Trinicanjam Cuisine location map')
    expect(iframe).toHaveAttribute('loading', 'lazy')
  })

  it('sets the required referrer policy on the iframe when a key is provided', () => {
    vi.stubEnv('VITE_MAPS_EMBED_KEY', 'test-key')

    render(<MapEmbed />)

    const iframe = screen.getByTitle('Trinicanjam Cuisine location map')
    expect(iframe).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade')
  })
})