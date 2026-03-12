import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './FoodPhotographySection.module.css'

const GALLERY_IMAGES = [
  { src: '/assets/images/gallery/oxtail.png', alt: 'Oxtail stew' },
  { src: '/assets/images/gallery/rum-punch.png', alt: 'Rum punch cocktail' },
  { src: '/assets/images/gallery/doubles.png', alt: 'Trinidadian doubles' },
  { src: '/assets/images/gallery/food-spread.png', alt: 'Caribbean food spread' },
  { src: '/assets/images/gallery/curry-goat.png', alt: 'Curry goat' },
  { src: '/assets/images/gallery/plantains.png', alt: 'Fried plantains' },
]

export function FoodPhotographySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return

    let ctx: any;
    
    const setupAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const element = sectionRef.current
      if (!element) return

      ctx = gsap.context(() => {
        // Text reveals
        gsap.fromTo(element.querySelector('h2'),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: element.querySelector('.header'),
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
        
        gsap.fromTo(element.querySelector('p'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element.querySelector('.header'),
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // Parallax columns
        const columns = element.querySelectorAll(`.${styles.column}`)
        
        // Mobile fallback ignores parallax to save performance
        if (window.innerWidth >= 768 && columns.length === 3) {
          // Column 1 moves fast up
          gsap.to(columns[0], {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
              trigger: element.querySelector(`.${styles.grid}`),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          })
          
          // Column 2 moves down
          gsap.fromTo(columns[1],
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: element.querySelector(`.${styles.grid}`),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              }
            }
          )

          // Column 3 moves slowly up
          gsap.to(columns[2], {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: element.querySelector(`.${styles.grid}`),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          })
        }
      }, element)
    }

    void setupAnimations()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} aria-labelledby="food-photography-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={`header ${styles.header}`}>
          <div className="luxury-text-reveal">
            <h2 id="food-photography-heading" className={styles.heading}>
              A Feast for the Senses
            </h2>
          </div>
          <p className={styles.subtext}>
            Every plate is a canvas of vibrant colors, rich textures, and centuries of tradition inherited from the islands.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Column 1 */}
          <div className={styles.column}>
            <div className={styles.imageCard}>
              <img src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} loading="lazy" />
            </div>
            <div className={styles.imageCard}>
              <img src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} loading="lazy" />
            </div>
          </div>
          
          {/* Column 2 */}
          <div className={styles.column}>
            <div className={styles.imageCard}>
              <img src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} loading="lazy" />
            </div>
            <div className={styles.imageCard}>
              <img src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} loading="lazy" />
            </div>
          </div>
          
          {/* Column 3 */}
          <div className={styles.column}>
            <div className={styles.imageCard}>
              <img src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} loading="lazy" />
            </div>
            <div className={styles.imageCard}>
              <img src={GALLERY_IMAGES[5].src} alt={GALLERY_IMAGES[5].alt} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
