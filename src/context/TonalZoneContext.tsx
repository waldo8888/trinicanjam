// src/context/TonalZoneContext.tsx
import { createContext, type ReactNode, type RefObject, useContext, useRef } from 'react'
import { useIntersectionObserver } from '@/lib/useIntersectionObserver'
import type { TonalZone } from '@/types'

// Stable options object — must be defined outside the component to avoid
// re-initializing the IntersectionObserver on every render.
const ZONE_OPTIONS: IntersectionObserverInit = { threshold: 0.3 }

interface TonalZoneContextValue {
  currentZone: TonalZone
  darkRef: RefObject<HTMLElement | null>
  warmRef: RefObject<HTMLElement | null>
  gradientRef: RefObject<HTMLElement | null>
}

const TonalZoneContext = createContext<TonalZoneContextValue | null>(null)

export function TonalZoneProvider({ children }: { children: ReactNode }) {
  const darkRef = useRef<HTMLElement>(null)
  const warmRef = useRef<HTMLElement>(null)
  const gradientRef = useRef<HTMLElement>(null)

  // Cast refs — useIntersectionObserver accepts RefObject<Element | null>;
  // HTMLElement extends Element so this cast is safe at runtime.
  // Dark zone is the default; only warm and gradient need observers for the ternary logic.
  const isWarmIntersecting = useIntersectionObserver(
    warmRef as RefObject<Element | null>,
    ZONE_OPTIONS,
  )
  const isGradientIntersecting = useIntersectionObserver(
    gradientRef as RefObject<Element | null>,
    ZONE_OPTIONS,
  )

  // Gradient wins if visible, then warm, default dark
  const currentZone: TonalZone = isGradientIntersecting
    ? 'gradient'
    : isWarmIntersecting
      ? 'warm'
      : 'dark'

  return (
    <TonalZoneContext.Provider value={{ currentZone, darkRef, warmRef, gradientRef }}>
      {children}
    </TonalZoneContext.Provider>
  )
}

/**
 * Use this only for scroll-driven UI changes (e.g., sticky bar colour).
 * Do NOT use this to re-render section content.
 */
// eslint-disable-next-line react-refresh/only-export-components -- context files intentionally co-export provider and hook
export function useTonalZone(): TonalZoneContextValue {
  const ctx = useContext(TonalZoneContext)
  if (!ctx) throw new Error('useTonalZone must be used within TonalZoneProvider')
  return ctx
}
