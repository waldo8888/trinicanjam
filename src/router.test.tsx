import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/router'
import { TonalZoneProvider } from '@/context/TonalZoneContext'

// Mock food photo imports so vite-imagetools does not run Sharp on placeholder images
vi.mock('@/assets/images/food-1.jpg', () => ({ default: '/mock/food-1.webp' }))
vi.mock('@/assets/images/food-2.jpg', () => ({ default: '/mock/food-2.webp' }))
vi.mock('@/assets/images/food-3.jpg', () => ({ default: '/mock/food-3.webp' }))
vi.mock('@/assets/images/food-4.jpg', () => ({ default: '/mock/food-4.webp' }))
vi.mock('@/assets/images/food-5.jpg', () => ({ default: '/mock/food-5.webp' }))
vi.mock('@/assets/images/food-6.jpg', () => ({ default: '/mock/food-6.webp' }))

function renderAt(path: string) {
  const testRouter = createMemoryRouter(routes, {
    initialEntries: [path],
  })
  render(
    <TonalZoneProvider>
      <RouterProvider router={testRouter} />
    </TonalZoneProvider>,
  )
}

describe('router', () => {
  it('renders PageWrapper three-zone shell at /', () => {
    renderAt('/')
    // PageWrapper renders three data-zone sections and a footer (Story 2.1)
    expect(document.querySelector('[data-zone="dark"]')).toBeTruthy()
    expect(document.querySelector('[data-zone="warm"]')).toBeTruthy()
    expect(document.querySelector('[data-zone="gradient"]')).toBeTruthy()
    // Footer renders below gradient zone with copyright text
    const footer = document.querySelector('footer[data-zone="gradient"]')
    expect(footer).toBeTruthy()
    expect(footer?.textContent).toContain('Trinicanjam Cuisine')
    // Brand h1 rendered in dark zone via HeroSection (Story 2.2)
    expect(screen.getByRole('heading', { level: 1, name: /Trinicanjam Cuisine/i })).toBeTruthy()
  })

  it('renders MenuPage heading at /menu', () => {
    renderAt('/menu')
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeTruthy()
  })

  it('renders VisitPage heading at /visit', () => {
    renderAt('/visit')
    expect(screen.getByRole('heading', { name: 'Visit' })).toBeTruthy()
  })

  it('renders AboutPage heading at /about', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { name: 'About' })).toBeTruthy()
  })

  it('renders NotFoundPage for unmatched routes', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { name: /404/i })).toBeTruthy()
  })
})
