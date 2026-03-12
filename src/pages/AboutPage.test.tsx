import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutPage } from './AboutPage'

afterEach(() => {
  cleanup()
  document.head
    .querySelectorAll(
      'title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], link[rel="alternate"]',
    )
    .forEach((el) => el.remove())
})

function renderAbout() {
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  )
}

describe('AboutPage', () => {
  it('renders main content landmark with id main-content', () => {
    renderAbout()
    expect(document.getElementById('main-content')).toBeTruthy()
  })

  it('renders mini-hero header with data-zone="dark" and h1 "Our Story"', () => {
    renderAbout()
    const header = document.querySelector('header[data-zone="dark"]')
    expect(header).toBeTruthy()
    const h1 = screen.getByRole('heading', { level: 1, name: /Our Story/i })
    expect(h1).toBeTruthy()
    expect(header?.contains(h1)).toBe(true)
  })

  it('renders SEO title as "About — Trinicanjam Cuisine"', () => {
    renderAbout()
    expect(document.title).toBe('About — Trinicanjam Cuisine')
  })

  it('renders origin section with aria-labelledby and h2 "Where We Come From"', () => {
    renderAbout()
    const section = document.querySelector('section[aria-labelledby="origin-heading"]')
    expect(section).toBeTruthy()
    const h2 = screen.getByRole('heading', { level: 2, name: /Where We Come From/i })
    expect(h2).toBeTruthy()
    expect(h2.id).toBe('origin-heading')
  })

  it('renders BrandStorySection with its aria-labelled section', () => {
    renderAbout()
    const brandSection = document.querySelector('section[aria-labelledby="brand-story-heading"]')
    expect(brandSection).toBeTruthy()
    expect(brandSection?.closest('[data-zone="warm"]')).toBeTruthy()
  })

  it('renders About OG metadata for route sharing', () => {
    renderAbout()
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://trinicanjam.ca/about',
    )
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://trinicanjam.ca/assets/og-image.jpg',
    )
  })

  it('renders CTA section with menu and visit links', () => {
    renderAbout()
    const menuLink = screen.getByRole('link', { name: /Explore Our Menu/i })
    expect(menuLink.getAttribute('href')).toBe('/#menu')

    const visitLink = screen.getByRole('link', { name: /Plan Your Visit/i })
    expect(visitLink.getAttribute('href')).toBe('/#visit')
  })

  it('renders page navigation with back-to-home link', () => {
    renderAbout()
    const nav = document.querySelector('nav[aria-label="Page navigation"]')
    expect(nav).toBeTruthy()

    const backLink = screen.getByRole('link', { name: /Back to Home/i })
    expect(backLink.getAttribute('href')).toBe('/')
  })
})
