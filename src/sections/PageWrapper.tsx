import type { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import styles from './PageWrapper.module.css'

interface PageWrapperProps {
  heroSlot?: ReactNode
  contentSlot?: ReactNode
  visitSlot?: ReactNode
}

export function PageWrapper({ heroSlot, contentSlot, visitSlot }: PageWrapperProps) {
  return (
    <div className={styles.wrapper}>
      <ErrorBoundary>
        <section data-zone="dark" className={styles.zone}>
          {heroSlot}
        </section>
      </ErrorBoundary>
      <ErrorBoundary>
        <section data-zone="warm" className={styles.zone}>
          {contentSlot}
        </section>
      </ErrorBoundary>
      <ErrorBoundary>
        <section data-zone="gradient" className={styles.zone}>
          {visitSlot}
        </section>
      </ErrorBoundary>
      <footer data-zone="gradient" className={styles.footer}>
        <p>© {new Date().getFullYear()} Trinicanjam Cuisine. Hamilton, Ontario.</p>
        <a
          href="#"
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
