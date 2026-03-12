/* eslint-disable react-refresh/only-export-components -- page components are intentionally co-located with router config (ARCH-9) */
import { createBrowserRouter } from 'react-router-dom'
import { SEOHead, SITE_URL, RestaurantSchema } from '@/lib/seo'
import { PageWrapper } from '@/sections/PageWrapper'
import { HeroSection } from '@/sections/HeroSection'
import { BrandStorySection } from '@/sections/BrandStorySection'
import { FoodPhotographySection } from '@/sections/FoodPhotographySection'
import { MenuSection } from '@/sections/MenuSection'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Epic 2: HomePage now uses HeroSection (Story 2.2)
function HomePage() {
  return (
    <>
      <SEOHead
        title="Trinicanjam Cuisine — Caribbean Soul, Hamilton Table"
        description="Premium Caribbean cuisine in Hamilton, Ontario. Trinidadian and Jamaican flavours, family-owned. Open Tuesday–Sunday."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogType="website"
        ogUrl={SITE_URL}
        preloadHeroImage="/assets/images/hero.webp"
      />
      <RestaurantSchema />
      <PageWrapper
        heroSlot={<HeroSection />}
        contentSlot={
          <>
            <BrandStorySection />
            <FoodPhotographySection />
            <ErrorBoundary>
              <MenuSection />
            </ErrorBoundary>
          </>
        }
      />
    </>
  )
}

function MenuPage() {
  return (
    <main>
      <SEOHead
        title="Menu"
        description="Browse the full Trinicanjam Cuisine menu — Trinidadian & Jamaican starters, mains, and drinks in Hamilton, Ontario."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/menu`}
      />
      <h1>Menu</h1>
    </main>
  )
}

function VisitPage() {
  return (
    <main>
      <SEOHead
        title="Visit"
        description="Find Trinicanjam Cuisine in Hamilton, Ontario — address, opening hours, directions, and contact information."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/visit`}
      />
      <h1>Visit</h1>
    </main>
  )
}

function AboutPage() {
  return (
    <main>
      <SEOHead
        title="About"
        description="The story behind Trinicanjam Cuisine — Caribbean culinary roots, Hamilton Ontario, and a table for everyone."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/about`}
      />
      <h1>About</h1>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main>
      <h1>404 — Page Not Found</h1>
    </main>
  )
}

// Exported for use in tests via createMemoryRouter
export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/menu', element: <MenuPage /> },
  { path: '/visit', element: <VisitPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
