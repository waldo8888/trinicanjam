export const SITE_URL = 'https://trinicanjam.ca'

interface SEOHeadProps {
  title: string
  description: string
  ogImage?: string
  ogType?: string
  ogUrl?: string
  twitterCard?: string
  preloadHeroImage?: string // LCP optimization — renders <link rel="preload"> for hero image
}

export function SEOHead({
  title,
  description,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  preloadHeroImage,
}: SEOHeadProps) {
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
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </>
  )
}
