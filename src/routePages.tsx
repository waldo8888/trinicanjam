import { MAIN_CONTENT_ID } from '@/components/SkipLink/SkipLink'
import { SEOHead, SITE_URL, RestaurantSchema } from '@/lib/seo'
import { PageWrapper } from '@/sections/PageWrapper'
import { HeroSection } from '@/sections/HeroSection'
import { BrandStorySection } from '@/sections/BrandStorySection'
import { FoodPhotographySection } from '@/sections/FoodPhotographySection'
import { MenuSection } from '@/sections/MenuSection'
import { VisitBlock } from '@/sections/VisitBlock'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function HomePage() {
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
            <ErrorBoundary>
              <MenuSection />
            </ErrorBoundary>
          </>
        }
        visitSlot={<VisitBlock />}
      />
    </>
  )
}

export function MenuPage() {
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

export function VisitPage() {
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

export function NotFoundPage() {
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