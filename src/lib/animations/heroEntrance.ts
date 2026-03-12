export async function animateHeroEntrance(elements: {
  eyebrow: HTMLElement
  title: HTMLElement

  image: HTMLElement
}, options: {
  onReady?: () => void
}): Promise<void> {
  await Promise.race([
    document.fonts.ready,
    new Promise<void>(r => setTimeout(r, 200)),
  ])

  const { gsap } = await import('gsap')

  // Initial state setup
  gsap.set([elements.eyebrow, elements.title], {
    yPercent: 120, // push down for the clip-path reveal
    opacity: 0,
    rotateZ: 2, // slight rotation for luxury cinematic feel
  })

  gsap.set(elements.image, {
    scale: 1.15,
    filter: 'blur(12px)',
    opacity: 0,
  })

  options.onReady?.()

  // Master timeline
  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' }
  })

  // 1. Fade and scale the image in (Ken Burns start)
  tl.to(elements.image, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 2.5,
    ease: 'power3.out',
  }, 0)

  // 2. Continuous slow Ken Burns scale after initial fade in
  gsap.to(elements.image, {
    scale: 1.05,
    duration: 20,
    ease: 'none',
    repeat: -1,
    yoyo: true,
    delay: 2.5
  })

  // 3. Text reveal with elegant stagger
  // The first element is now the logomark image
  gsap.fromTo(elements.eyebrow,
    { yPercent: 120, opacity: 0, rotateZ: -15, scale: 0.8 },
    {
      yPercent: 0,
      opacity: 1,
      rotateZ: 0,
      scale: 1,
      duration: 1.6,
      ease: 'expo.out',
      delay: 0.5 // Start after image fade begins
    }
  )

  // Title
  gsap.fromTo(elements.title,
    { yPercent: 120, opacity: 0, rotateZ: 2 },
    {
      yPercent: 0,
      opacity: 1,
      rotateZ: 0,
      duration: 1.4,
      stagger: 0.15,
      ease: 'expo.out',
      delay: 0.65 // Staggered shortly after the crest
    }
  )
}
