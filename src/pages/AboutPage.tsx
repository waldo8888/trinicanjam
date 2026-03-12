import { SEOHead, SITE_URL } from '@/lib/seo'
import { BrandStorySection } from '@/sections/BrandStorySection'
import styles from './AboutPage.module.css'

export function AboutPage() {
  return (
    <main id="main-content">
      <SEOHead
        title="About — Trinicanjam Cuisine"
        description="The story behind Trinicanjam Cuisine — Caribbean culinary roots, Hamilton Ontario, and a table for everyone."
        canonical={`${SITE_URL}/about`}
        noSuffix
      />
      <header data-zone="dark" className={styles.miniHero}>
        <p className={styles.eyebrow}>Trinicanjam Cuisine · Hamilton, Ontario</p>
        <h1 className={styles.heroHeading}>Our Story</h1>
      </header>

      <section
        aria-labelledby="origin-heading"
        data-zone="warm"
        className={styles.originSection}
      >
        <h2 id="origin-heading" className={styles.sectionHeading}>Where We Come From</h2>
        <p className={styles.body}>
          Born from the vibrant kitchens of Trinidad and Jamaica, Trinicanjam Cuisine unites two
          culinary traditions under one roof. From the crispy, saffron-laced doubles of
          Port-of-Spain to the slow-braised oxtail that has nourished generations of Jamaican
          families, every dish we make carries a story and an island&apos;s worth of flavour.
        </p>
        <p className={styles.body}>
          We are rooted in Hamilton, Ontario — a city as layered and vibrant as the food we serve.
          Our kitchen is our contribution to this community: a space where Caribbean heritage meets
          Hamilton&apos;s welcoming spirit, and where every plate is made with the honest intention
          of feeding someone you care about.
        </p>
        <p className={styles.body}>
          Trinicanjam is a family business and a labour of love. Whether you are chasing the
          flavours of your childhood or discovering Caribbean cuisine for the very first time —
          come as you are. The table is always set.
        </p>
      </section>

      <BrandStorySection />

      <section data-zone="warm" className={styles.ctaSection}>
        <h2 className={styles.sectionHeading}>Come to the Table</h2>
        <p className={styles.body}>
          Your seat is already waiting. Trinicanjam is open Tuesday through Sunday and ready to
          welcome you with the warmth and flavour of the Caribbean.
        </p>
        <div className={styles.ctaRow}>
          <a href="/#menu" className={styles.ctaPrimary}>Explore Our Menu →</a>
          <a href="/#visit" className={styles.ctaSecondary}>Plan Your Visit</a>
        </div>
      </section>

      <nav aria-label="Page navigation" className={styles.pageNav}>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </nav>
    </main>
  )
}
