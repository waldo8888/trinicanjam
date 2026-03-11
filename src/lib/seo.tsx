interface SEOHeadProps {
  title: string
  description: string
  ogImage?: string
  preloadHeroImage?: string // LCP optimization — renders <link rel="preload"> for hero image
}

export function SEOHead({ title, description, ogImage, preloadHeroImage }: SEOHeadProps) {
  const fullTitle = `${title} | Trinicanjam Cuisine`
  if (import.meta.env.DEV && ogImage && !ogImage.startsWith('http')) {
    console.warn('[SEOHead] ogImage must be an absolute URL for OG/Twitter cards. Received:', ogImage)
  }
  return (
    <>
      {preloadHeroImage && (
        <link rel="preload" as="image" href={preloadHeroImage} fetchPriority="high" />
      )}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
