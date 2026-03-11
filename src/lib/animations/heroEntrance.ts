// src/lib/animations/heroEntrance.ts

export async function animateHeroEntrance(elements: {
  eyebrow: HTMLElement
  title: HTMLElement
  tagline: HTMLElement
  image: HTMLElement
}, options: {
  onReady?: () => void
}): Promise<void> {
  // Wait for custom fonts (font-display: optional may skip them)
  // 200ms cap — never block animation indefinitely
  await Promise.race([
    document.fonts.ready,
    new Promise<void>(r => setTimeout(r, 200)),
  ])

  // Dynamic import — GSAP MUST NOT appear in the initial bundle (ARCH-15, NFR-P4)
  const { gsap } = await import('gsap')

  // Set initial state IMMEDIATELY after GSAP loads (synchronous)
  // Prevents text flashing at full opacity during the async gap between
  // setLoaded(true) in HeroSection and the timeline executing
  gsap.set([elements.eyebrow, elements.title, elements.tagline], {
    opacity: 0,
    y: 24,
  })

  options.onReady?.()

  gsap
    .timeline()
    .from(elements.image, { opacity: 0.6, duration: 0.4, ease: 'none' })
    .fromTo(
      [elements.eyebrow, elements.title, elements.tagline],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.12,
      }
    )
}
