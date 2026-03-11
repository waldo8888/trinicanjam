import { useRef, type ReactNode } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
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
      <StickyUtilityBar heroRef={heroZoneRef} />
      <ErrorBoundary>
        <section
          ref={(el) => {
            // heroZoneRef: used by StickyUtilityBar for bar visibility (Story 2.3)
            // darkRef: used by TonalZoneContext for zone detection (Story 2.5)
            // Two observers on the same element — coexist without conflict.
            heroZoneRef.current = el
            darkRef.current = el
          }}
          data-zone="dark"
          className={styles.zone}
        >
          {heroSlot}
        </section>
      </ErrorBoundary>
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
      <footer data-zone="gradient" className={styles.footer}>
        <p>© {new Date().getFullYear()} Trinicanjam Cuisine. Hamilton, Ontario.</p>
        <a
          href="https://www.instagram.com/trinicanjam"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Trinicanjam Cuisine on Instagram"
        >
          Instagram
        </a>
      </footer>
    </div>
  )
}
