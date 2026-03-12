import { useEffect, useRef } from 'react'
import { MapEmbed } from '@/components/MapEmbed/MapEmbed'
import { SocialProofGrid } from '@/components/SocialProofGrid/SocialProofGrid'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { businessInfo } from '@/data/siteContent'
import { trackDirectionsClick, trackHoursView, trackPhoneClick } from '@/lib/analytics'
import styles from './VisitBlock.module.css'

export function VisitBlock() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return

    let ctx: any
    const setupAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const element = sectionRef.current
      if (!element) return

      ctx = gsap.context(() => {
        // Glass card reveal
        gsap.fromTo(element.querySelector(`.${styles.contactCard}`),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element.querySelector(`.${styles.splitLayout}`),
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // Staggered info group reveal
        const infoGroups = element.querySelectorAll(`.${styles.infoGroup}`)
        if (infoGroups.length) {
          gsap.fromTo(infoGroups,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.15,
              ease: 'power2.out',
              delay: 0.3,
              scrollTrigger: {
                trigger: element.querySelector(`.${styles.splitLayout}`),
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }

        // Parallax for map to give it luxury movement
        gsap.fromTo(element.querySelector(`.${styles.mapWrapper}`),
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: element.querySelector(`.${styles.splitLayout}`),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            }
          }
        )
      }, element)
    }

    void setupAnimations()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (window.location.pathname === '/visit') {
      trackHoursView()
    }
  }, [])

  return (
    <section id="visit" ref={sectionRef} aria-labelledby="visit-heading" className={styles.section}>
      <div className={styles.container}>
        
        {/* Centered heading */}
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Find Us</p>
          <div className="luxury-text-reveal">
            <h2 id="visit-heading" className={styles.heading}>
              Dine With Us
            </h2>
          </div>
          <div className={styles.ornamentDivider} aria-hidden="true">
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentDiamond} />
            <span className={styles.ornamentLine} />
          </div>
        </div>

        <div className={styles.splitLayout}>
          {/* Map Side */}
          <div className={styles.mapSide}>
            <div className={styles.mapWrapper}>
               <MapEmbed location={businessInfo.mapQuery} />
            </div>
          </div>
          
          {/* Contact Card Side */}
          <div className={styles.contactSide}>
            <div className={styles.contactCard}>
              
              <div className={styles.infoGroup}>
                <h3 className={styles.subheading}>Location</h3>
                <address className={styles.address}>
                  {businessInfo.addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </address>
                <a 
                  href={businessInfo.directionsHref}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.textLink}
                  onClick={trackDirectionsClick}
                >
                  Get Directions →
                </a>
              </div>

              <div className={styles.infoGroup}>
                <h3 className={styles.subheading}>Contact</h3>
                <a 
                  href={businessInfo.phoneHref}
                  className={styles.phoneLink}
                  onClick={trackPhoneClick}
                >
                  {businessInfo.phoneDisplay}
                </a>
              </div>

              <div className={styles.infoGroup}>
                <h3 className={styles.subheading}>Hours</h3>
                <ul className={styles.serviceList}>
                  {businessInfo.serviceNotes.map((note) => (
                    <li key={note} className={styles.serviceItem}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.socialProofSection}>
           <SocialProofGrid />
        </div>
        
      </div>
    </section>
  )
}
