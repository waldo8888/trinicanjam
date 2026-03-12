import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import Lenis from 'lenis'
import { SkipLink } from '@/components/SkipLink/SkipLink'
import { GrainOverlay } from '@/components/GrainOverlay/GrainOverlay'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { router } from './router'
import { useReducedMotion } from '@/lib/useReducedMotion'

export default function App() {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Disable smooth scrolling if user prefers reduced motion
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium easing
    })

    return () => {
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return (
    <>
      <SkipLink />
      <GrainOverlay />
      <AudioPlayer />
      <RouterProvider router={router} />
    </>
  )
}

