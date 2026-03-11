import styles from './HeroSection.module.css'

export function HeroSection() {
  return (
    <section role="banner" data-zone="dark" className={styles.hero}>
      {/*
        TODO: ARCH-5 — wrap in <picture> with <source type="image/avif" srcSet="/assets/images/hero.avif" />
        when hero.avif is available pre-launch. Do NOT add the source tag without the actual AVIF file
        (causes an erroneous 404 network request).
      */}
      <img
        src="/assets/images/hero.webp"
        alt="Restaurant interior and food presentation at Trinicanjam Cuisine"
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        className={styles.heroImage}
      />
      {/* Decorative dark overlay for text contrast — aria-hidden per AC6 */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.textContent}>
        {/*
          eyebrow, title, tagline are animation targets for Story 2.6 (GSAP entrance).
          These elements must remain as separate DOM nodes — Story 2.6 needs individual refs.
          GSAP entrance animation — see Story 2.6; import dynamically only, never at module level.
          useReducedMotion hook — see Story 2.5; wired into HeroSection in Story 2.6.
        */}
        <span className={styles.eyebrow}>
          Authentic Caribbean Cuisine · Hamilton, Ontario
        </span>
        <h1 className={styles.title}>Trinicanjam Cuisine</h1>
        <p className={styles.tagline}>Caribbean Soul. Hamilton Table.</p>
      </div>
    </section>
  )
}
