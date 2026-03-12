import { useRef, useState, useEffect } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

import styles from './HeroSection.module.css'

function notifyHeroReady() {
  window.dispatchEvent(new Event('trinicanjam:hero-ready'))
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()
  const [loaded, setLoaded] = useState(prefersReducedMotion)

  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const eyebrowRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !imageWrapperRef.current) return

    let st: any

    const setupParallax = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(imageWrapperRef.current, {
          yPercent: 30,
          ease: 'none',
        }),
      })
    }

    void setupParallax()

    return () => {
      if (st) st.kill()
    }
  }, [prefersReducedMotion])

  const handleLoad = () => {
    if (prefersReducedMotion) {
      setLoaded(true)
      notifyHeroReady()
      return
    }

    if (
      !eyebrowRef.current ||
      !titleRef.current ||
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
            image: imageRef.current!,
          },
          {
            onReady: () => {
              setLoaded(true)
              // Animate extra elements after main entrance
              void (async () => {
                const { gsap } = await import('gsap')
                const extras = [
                  dividerRef.current,
                  ctaRef.current,
                  scrollRef.current,
                ].filter(Boolean)
                gsap.fromTo(extras, { opacity: 0, y: 20 }, {
                  opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'expo.out', delay: 0.3,
                })
              })()
            },
          }
        )
      } catch {
        setLoaded(true)
      }
    })()
  }

  const handleError = () => {
    setLoaded(true)
    notifyHeroReady()
  }

  const isTextHidden = !loaded && !prefersReducedMotion

  return (
    <section ref={sectionRef} aria-labelledby="hero-title" data-zone="dark" className={styles.hero}>
      <div ref={imageWrapperRef} className={styles.imageWrapper}>
        <img
          ref={imageRef}
          src="/assets/images/hero-food.png"
          alt="Beautifully plated jerk chicken at Trinicanjam Cuisine"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          className={[styles.heroImage, isTextHidden ? styles.imageHidden : ''].join(' ').trim()}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
      
      {/* Luxury multi-stop gradient overlay */}
      <div className={styles.overlay} aria-hidden="true" />
      
      {/* Vignette edges */}
      <div className={styles.vignette} aria-hidden="true" />
      
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
        <div className="luxury-text-reveal">
          <img 
            ref={eyebrowRef}
            src="/images/trinicanjam_logomark.png" 
            alt="Trinicanjam Cuisine emblem"
            className={styles.heroLogomark}
          />
        </div>
        
        {/* Gold ornamental divider */}
        <div ref={dividerRef} className={styles.ornamentDivider} aria-hidden="true">
          <span className={styles.ornamentLine} />
          <span className={styles.ornamentDiamond} />
          <span className={styles.ornamentLine} />
        </div>
        
        <div className="luxury-text-reveal">
          <h1 id="hero-title" ref={titleRef} className={styles.title}>
            Trinicanjam<br />Cuisine
          </h1>
        </div>
        
        {/* Hero CTA */}
        <div ref={ctaRef} className={styles.heroCta}>
          <a href="#menu" className={styles.heroCtaPrimary}>Explore the Menu</a>
          <a href="#social" className={styles.heroCtaGhost}>See Today's Feed</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollText}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  )
}
