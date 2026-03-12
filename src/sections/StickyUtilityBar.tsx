import { useState, useEffect } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './StickyUtilityBar.module.css'

interface StickyUtilityBarProps {
  heroRef?: React.RefObject<HTMLElement | null>
  forceVisible?: boolean
  menuHref?: string
  visitHref?: string
}

export function StickyUtilityBar({
  heroRef,
  forceVisible = false,
  menuHref = '/#menu',
  visitHref = '/#visit',
}: StickyUtilityBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const shouldShow = forceVisible || isVisible

  useEffect(() => {
    if (forceVisible) {
      return
    }

    const el = heroRef?.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hero exits viewport (scrolling down) → show bar
        // Hero re-enters viewport (scrolling up) → hide bar
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [forceVisible, heroRef])

  return (
    <nav
      aria-label="Utility navigation"
      aria-hidden={!shouldShow}
      data-zone="dark"
      className={[
        styles.bar,
        shouldShow ? styles.visible : '',
        prefersReducedMotion ? styles.reducedMotion : '',
      ].filter(Boolean).join(' ')}
    >
      <span className={styles.wordmark}>Trinicanjam</span>
      <div className={styles.actions}>
        <a href={menuHref} className={styles.ctaGhost} tabIndex={shouldShow ? 0 : -1}>Menu</a>
        <a href={visitHref} className={styles.ctaCrimson} tabIndex={shouldShow ? 0 : -1}>Visit</a>
      </div>
    </nav>
  )
}
