import { createBrowserRouter } from 'react-router-dom'
import { SEOHead } from '@/lib/seo'
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
        title="Home"
        description="Trinicanjam Cuisine — Authentic Trinidadian and Jamaican food in Hamilton, Ontario. Caribbean Soul. Hamilton Table."
        preloadHeroImage="/assets/images/hero.webp"
      />
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
      <h1>Menu</h1>
    </main>
  )
}

function VisitPage() {
  return (
    <main>
      <h1>Visit</h1>
    </main>
  )
}

function AboutPage() {
  return (
    <main>
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
