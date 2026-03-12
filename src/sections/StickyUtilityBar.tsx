import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useReducedMotion } from '@/lib/useReducedMotion'
import styles from './StickyUtilityBar.module.css'

export function StickyUtilityBar() {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.75)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={[
        styles.utilityBar,
        isVisible ? styles.visible : '',
        prefersReducedMotion ? styles.reducedMotion : '',
      ]
        .join(' ')
        .trim()}
      aria-hidden={!isVisible}
    >
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logomarkLink} tabIndex={isVisible ? 0 : -1}>
            <img 
              src="/images/trinicanjam_logo-preview.png" 
              alt="Trinicanjam Cuisine Logo" 
              className={styles.navLogo}
            />
          </Link>
        </div>

        <nav aria-label="Quick Actions" className={styles.actions}>
          <Link
            to="/about"
            className={styles.ghostButton}
            tabIndex={isVisible ? 0 : -1}
          >
            Our Story
          </Link>
          <Link
            to="/menu"
            className={styles.ghostButton}
            tabIndex={isVisible ? 0 : -1}
          >
            Menu
          </Link>
          <Link
            to="/visit"
            className={styles.primaryCTA}
            tabIndex={isVisible ? 0 : -1}
          >
            Plan Your Visit
          </Link>
        </nav>
      </div>
    </div>
  )
}
