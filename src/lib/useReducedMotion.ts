import { useState, useEffect } from 'react'

/**
 * Returns true when the user's system preference is prefers-reduced-motion: reduce.
 * Used as Layer 3 of the three-layer reduced-motion architecture (JS/GSAP layer).
 * Layer 1: CSS globals.css root @media override (already live from Story 1.2)
 * Layer 2: CSS tokens.css [data-zone] transition kill (already live from Story 1.2)
 * Layer 3: This hook — for GSAP timelines and JS-driven transitions (Stories 2.3 onwards)
 * Story 2.5 will add full test coverage and useIntersectionObserver companion hook.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return prefersReducedMotion
}
