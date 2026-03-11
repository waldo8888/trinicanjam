import { useState, useEffect } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './StickyUtilityBar.module.css'

interface StickyUtilityBarProps {
  heroRef: React.RefObject<HTMLElement | null>
}

export function StickyUtilityBar({ heroRef }: StickyUtilityBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const el = heroRef.current
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
  }, [heroRef])

  return (
    <nav
      aria-label="Utility navigation"
      data-zone="dark"
      className={styles.bar}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transitionDuration: prefersReducedMotion ? '0ms' : '300ms',
      }}
    >
      <span className={styles.wordmark}>Trinicanjam</span>
      <div className={styles.actions}>
        <a href="/#menu" className={styles.ctaGhost}>Menu</a>
        <a href="/#visit" className={styles.ctaCrimson}>Visit</a>
      </div>
    </nav>
  )
}
