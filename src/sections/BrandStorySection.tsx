import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './BrandStorySection.module.css'

export function BrandStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return

    let ctx: any;
    
    // Set up scroll reveal animations
    const setupAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const element = sectionRef.current
      if (!element) return

      ctx = gsap.context(() => {
        // Text fade ups
        const texts = element.querySelectorAll('p')
        texts.forEach((text) => {
          gsap.fromTo(text, 
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        })

        // Elegant Title Reveal
        gsap.fromTo(element.querySelector('h2'),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: element.querySelector('h2'),
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
        
        // Parallax for images
        const images = element.querySelectorAll(`.${styles.imageWrapper}`)
        images.forEach((wrapper) => {
          const img = wrapper.querySelector('img')
          if (!img) return
          
          gsap.fromTo(img,
            { scale: 1.15, yPercent: -10 },
            {
              scale: 1,
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              }
            }
          )
        })
      }, element)
    }

    void setupAnimations()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} aria-labelledby="brand-story-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <div className="luxury-text-reveal">
             <h2 id="brand-story-heading" className={styles.heading}>
               Our Culinary Roots
             </h2>
          </div>
          
          <div className={styles.body}>
            <p>
              Born from the vibrant kitchens of Trinidad and Jamaica, Trinicanjam Cuisine brings the
              warmth of the Caribbean to Hamilton's culinary landscape. Every dish is a journey
              — from the crispy, saffron-laced doubles of Port-of-Spain street corners to the
              slow-braised oxtail that has nourished generations of Jamaican families. We are two
              islands, one table, and an unending celebration of flavour.
            </p>
            <p>
              We are a family affair, built over decades of Sunday dinners, spice-market mornings, and
              the unwavering belief that the best food is always made for someone you love. Trinicanjam
              is our Hamilton home, and it is yours too. Whether you are chasing the flavours of your
              childhood or discovering Caribbean cuisine for the first time — come as you are.
              The table is always set.
            </p>
          </div>
        </div>
        
        <div className={styles.imageGallery}>
          <div className={`${styles.imageWrapper} ${styles.primaryImage}`}>
            <img 
              src="/assets/images/restaurant-interior.png" 
              alt="Intimate warm Caribbean restaurant interior"
              loading="lazy"
            />
          </div>
          <div className={`${styles.imageWrapper} ${styles.secondaryImage}`}>
            <img 
              src="/images/chef_cooking_1773324679875.png" 
              alt="Chef cooking with dramatic flame in a Caribbean kitchen"
              loading="lazy" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}
