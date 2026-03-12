import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { MAIN_CONTENT_ID } from '@/components/SkipLink/SkipLink'
import { MarqueeStrip } from '@/components/MarqueeStrip/MarqueeStrip'
import { trackInstagramClick } from '@/lib/analytics'
import { businessInfo } from '@/data/siteContent'
import { StickyUtilityBar } from './StickyUtilityBar'
import { useTonalZone } from '@/context/TonalZoneContext'
import styles from './PageWrapper.module.css'

interface PageWrapperProps {
  heroSlot?: ReactNode
  contentSlot?: ReactNode
  visitSlot?: ReactNode
}

export function PageWrapper({ heroSlot, contentSlot, visitSlot }: PageWrapperProps) {
  const heroZoneRef = useRef<HTMLElement>(null)
  const { darkRef, warmRef, gradientRef } = useTonalZone()

  return (
    <div className={styles.wrapper}>
      <StickyUtilityBar />
      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <ErrorBoundary>
          <section
            ref={(el) => {
              heroZoneRef.current = el
              darkRef.current = el
            }}
            data-zone="dark"
            className={styles.zone}
          >
            {heroSlot}
          </section>
        </ErrorBoundary>
        
        {/* Awwwards marquee divider */}
        <MarqueeStrip variant="gold" />
        
        <ErrorBoundary>
          <section ref={warmRef} data-zone="warm" className={styles.zone}>
            {contentSlot}
          </section>
        </ErrorBoundary>
        <ErrorBoundary>
          <section ref={gradientRef} data-zone="gradient" className={styles.zone}>
            {visitSlot}
          </section>
        </ErrorBoundary>
      </main>
      
      <footer data-zone="gradient" className={styles.footer}>
        <div className={styles.footerInner}>
          {/* Gold divider */}
          <div className={styles.footerDivider} aria-hidden="true">
            <span className={styles.footerDividerLine} />
            <span className={styles.footerDividerDiamond} />
            <span className={styles.footerDividerLine} />
          </div>
          
          <img 
            src="/images/trinicanjam_logo.png" 
            alt="Trinicanjam Cuisine Logo" 
            className={styles.footerLogo} 
            loading="lazy" 
          />

          <nav aria-label="Footer navigation" className={styles.footerNav}>
            <Link to="/about" className={styles.footerLink}>Our Story</Link>
            <Link to="/menu" className={styles.footerLink}>Menu</Link>
            <Link to="/visit" className={styles.footerLink}>Visit</Link>
          </nav>
          
          <div className={styles.footerSocials}>
            <a
              href="https://www.instagram.com/trinicanjamcuisine"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trinicanjam Cuisine on Instagram"
              className={styles.socialIcon}
              onClick={trackInstagramClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php/?id=61561158214261"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trinicanjam Cuisine on Facebook"
              className={styles.socialIcon}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
          
          <address className={styles.footerAddress}>
            {businessInfo.addressInline}
          </address>
          
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Trinicanjam Cuisine. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
