/* eslint-disable react-refresh/only-export-components -- page components are intentionally co-located with router config (ARCH-9) */
import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MAIN_CONTENT_ID } from '@/components/SkipLink/SkipLink'
import { SEOHead, SITE_URL, RestaurantSchema } from '@/lib/seo'
import { PageWrapper } from '@/sections/PageWrapper'
import { HeroSection } from '@/sections/HeroSection'
import { BrandStorySection } from '@/sections/BrandStorySection'
import { FoodPhotographySection } from '@/sections/FoodPhotographySection'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AboutPage } from '@/pages/AboutPage'

const LazyMenuSection = lazy(async () => ({
  default: (await import('@/sections/MenuSection')).MenuSection,
}))

const LazyVisitBlock = lazy(async () => ({
  default: (await import('@/sections/VisitBlock')).VisitBlock,
}))

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
        canonical={SITE_URL}
        noSuffix
        preloadHeroImage="/assets/images/hero.webp"
      />
      <RestaurantSchema />
      <PageWrapper
        heroSlot={<HeroSection />}
        contentSlot={
          <>
            <BrandStorySection />
            <FoodPhotographySection />
            <Suspense fallback={null}>
              <ErrorBoundary>
                <LazyMenuSection />
              </ErrorBoundary>
            </Suspense>
          </>
        }
        visitSlot={
          <Suspense fallback={null}>
            <LazyVisitBlock />
          </Suspense>
        }
      />
    </>
  )
}

function MenuPage() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <SEOHead
        title="Menu"
        description="Browse the full Trinicanjam Cuisine menu — Trinidadian & Jamaican starters, mains, and drinks in Hamilton, Ontario."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/menu`}
        canonical={`${SITE_URL}/menu`}
      />
      <h1>Menu</h1>
    </main>
  )
}

function VisitPage() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <SEOHead
        title="Visit"
        description="Find Trinicanjam Cuisine in Hamilton, Ontario — address, opening hours, directions, and contact information."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/visit`}
        canonical={`${SITE_URL}/visit`}
      />
      <h1>Visit</h1>
    </main>
  )
}

// AboutPage is a dedicated file under src/pages/ (Story 5.4)

function NotFoundPage() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <SEOHead
        title="Page Not Found — Trinicanjam Cuisine"
        description="The page you are looking for does not exist."
        noSuffix
      />
      <h1>404 — Page Not Found</h1>
      <p>
        <a href="/">← Back to Home</a>
      </p>
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
