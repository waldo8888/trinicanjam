import { useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './HeroSection.module.css'

function notifyHeroReady() {
  window.dispatchEvent(new Event('trinicanjam:hero-ready'))
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()
  const [loaded, setLoaded] = useState(prefersReducedMotion)

  const imageRef = useRef<HTMLImageElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  const handleLoad = () => {
    if (prefersReducedMotion) {
      setLoaded(true)
      notifyHeroReady()
      return
    }

    if (
      !eyebrowRef.current ||
      !titleRef.current ||
      !taglineRef.current ||
      !imageRef.current
    ) {
      setLoaded(true)
      notifyHeroReady()
      return
    }

    notifyHeroReady()

    void (async () => {
      try {
        const { animateHeroEntrance } = await import('@/lib/animations/heroEntrance')

        await animateHeroEntrance(
          {
            eyebrow: eyebrowRef.current!,
            title: titleRef.current!,
            tagline: taglineRef.current!,
            image: imageRef.current!,
          },
          {
            onReady: () => setLoaded(true),
          }
        )
      } catch {
        setLoaded(true)
      }
    })()
  }

  const handleError = () => {
    // AC6: Never leave the section broken — show text immediately on image error
    setLoaded(true)
    notifyHeroReady()
  }

  const isTextHidden = !loaded && !prefersReducedMotion

  return (
    <section aria-labelledby="hero-title" data-zone="dark" className={styles.hero}>
      {/*
        TODO: ARCH-5 — wrap in <picture> with <source type="image/avif" srcSet="/assets/images/hero.avif" />
        when hero.avif is available pre-launch. Do NOT add the source tag without the actual AVIF file
        (causes an erroneous 404 network request).
      */}
      <img
        ref={imageRef}
        src="/assets/images/hero.webp"
        alt="Restaurant interior and food presentation at Trinicanjam Cuisine"
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        className={styles.heroImage}
        onLoad={handleLoad}
        onError={handleError}
      />
      {/* Decorative dark overlay for text contrast */}
      <div className={styles.overlay} aria-hidden="true" />
      {/* Shimmer loading state — hidden when loaded or reduced motion */}
      {isTextHidden && (
        <div className={styles.shimmer} aria-hidden="true" />
      )}
      <div
        className={[
          styles.textContent,
          isTextHidden ? styles.textHidden : '',
        ]
          .join(' ')
          .trim()}
      >
        <span ref={eyebrowRef} className={styles.eyebrow}>
          Authentic Caribbean Cuisine · Hamilton, Ontario
        </span>
        <h1 id="hero-title" ref={titleRef} className={styles.title}>
          Trinicanjam Cuisine
        </h1>
        <p ref={taglineRef} className={styles.tagline}>
          Caribbean Soul. Hamilton Table.
        </p>
      </div>
    </section>
  )
}
