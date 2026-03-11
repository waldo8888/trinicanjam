// src/lib/useIntersectionObserver.ts
import { type RefObject, useEffect, useState } from 'react'

/**
 * Observes a DOM element with IntersectionObserver and returns whether it is currently
 * intersecting the viewport.
 *
 * @note Passing an inline object literal as `options` will recreate it each render,
 * causing the observer to re-initialize. Define options as a stable `const` outside
 * the component or memoize with `useMemo`. Callers in Story 2.6 (GSAP) and
 * StickyUtilityBar must be aware of this.
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options,
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}
