import type { ReactNode } from 'react'
import { MAIN_CONTENT_ID } from '@/components/SkipLink/SkipLink'
import { SEOHead, SITE_URL, RestaurantSchema } from '@/lib/seo'
import { MarqueeStrip } from '@/components/MarqueeStrip/MarqueeStrip'
import { trackInstagramClick } from '@/lib/analytics'
import { PageWrapper } from '@/sections/PageWrapper'
import { HeroSection } from '@/sections/HeroSection'
import { BrandStorySection } from '@/sections/BrandStorySection'
import { FoodPhotographySection } from '@/sections/FoodPhotographySection'
import { MenuSection } from '@/sections/MenuSection'
import { VisitBlock } from '@/sections/VisitBlock'
import { StickyUtilityBar } from '@/sections/StickyUtilityBar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { businessInfo } from '@/data/siteContent'
import pageWrapperStyles from '@/sections/PageWrapper.module.css'

function RouteFrame({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div>
      <StickyUtilityBar />
      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {children}
      </main>
      <footer data-zone="gradient" className={pageWrapperStyles.footer}>
        <div className={pageWrapperStyles.footerInner}>
          <p className={pageWrapperStyles.footerCopy}>© {new Date().getFullYear()} Trinicanjam Cuisine. Hamilton, Ontario.</p>
          <div className={pageWrapperStyles.footerSocials}>
            <a
              href="https://www.instagram.com/trinicanjamcuisine"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trinicanjam Cuisine on Instagram"
              className={pageWrapperStyles.socialIcon}
              onClick={trackInstagramClick}
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/profile.php/?id=61561158214261"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trinicanjam Cuisine on Facebook"
              className={pageWrapperStyles.socialIcon}
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function HomePage() {
  return (
    <>
      <SEOHead
        title="Trinicanjam Cuisine — Caribbean Soul, Hamilton Table"
        description={`Premium Caribbean cuisine in ${businessInfo.city}. Trinidadian and Jamaican flavours, open 7 days with daily specials.`}
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogType="website"
        ogUrl={SITE_URL}
        canonical={SITE_URL}
        noSuffix
        preloadHeroImage="/assets/images/hero-food.png"
      />
      <RestaurantSchema />
      <PageWrapper
        heroSlot={<HeroSection />}
        contentSlot={
          <>
            <BrandStorySection />
            <FoodPhotographySection />
            <MarqueeStrip 
              text="Doubles · Jerk Chicken · Oxtail · Curry Goat · Rum Punch · Plantains · Roti" 
              separator=" ✦ " 
              variant="warm" 
            />
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
    <RouteFrame>
      <SEOHead
        title="Menu"
        description="Browse the full Trinicanjam Cuisine menu — Trinidadian & Jamaican starters, mains, and drinks in Hamilton, Ontario."
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/menu`}
        canonical={`${SITE_URL}/menu`}
      />
      <h1>Menu</h1>
      <ErrorBoundary>
        <MenuSection />
      </ErrorBoundary>
    </RouteFrame>
  )
}

export function VisitPage() {
  return (
    <RouteFrame>
      <SEOHead
        title="Visit"
        description={`Find ${businessInfo.name} in ${businessInfo.city} — address, service details, directions, and contact information.`}
        ogImage={`${SITE_URL}/assets/og-image.jpg`}
        ogUrl={`${SITE_URL}/visit`}
        canonical={`${SITE_URL}/visit`}
      />
      <h1>Visit</h1>
      <ErrorBoundary>
        <VisitBlock />
      </ErrorBoundary>
    </RouteFrame>
  )
}

export function NotFoundPage() {
  return (
    <RouteFrame>
      <SEOHead
        title="Page Not Found — Trinicanjam Cuisine"
        description="The page you are looking for does not exist."
        noSuffix
      />
      <h1>404 — Page Not Found</h1>
      <p>
        <a href="/">← Back to Home</a>
      </p>
    </RouteFrame>
  )
}
