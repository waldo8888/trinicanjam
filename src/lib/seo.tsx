export const SITE_URL = 'https://trinicanjam.ca'

// Restaurant JSON-LD schema — all fields are placeholder values marked TODO where real data is needed
const RESTAURANT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Trinicanjam Cuisine',                            // TODO: confirm legal name
  url: SITE_URL,
  telephone: '+19055551234',                              // TODO: replace with real phone
  servesCuisine: ['Caribbean', 'Trinidadian', 'Jamaican'],
  priceRange: '$$',
  image: `${SITE_URL}/assets/og-image.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 King St W',                       // TODO: replace with real address
    addressLocality: 'Hamilton',
    addressRegion: 'ON',
    postalCode: 'L8P 4W3',                               // TODO: replace with real postal code
    addressCountry: 'CA',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'],
      opens: '11:00',
      closes: '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '11:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '12:00',
      closes: '20:00',
    },
  ],
} as const

interface SEOHeadProps {
  title: string
  description: string
  ogImage?: string
  ogType?: string
  ogUrl?: string
  twitterCard?: string
  canonical?: string         // renders <link rel="canonical"> and <link rel="alternate" hreflang="en">
  noSuffix?: boolean         // when true, title is used as-is without "| Trinicanjam Cuisine" suffix
  preloadHeroImage?: string  // LCP optimization — renders <link rel="preload"> for hero image
}

export function SEOHead({
  title,
  description,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  canonical,
  noSuffix,
  preloadHeroImage,
}: SEOHeadProps) {
  const fullTitle = noSuffix ? title : `${title} | Trinicanjam Cuisine`
  if (import.meta.env.DEV && ogImage && !ogImage.startsWith('http')) {
    console.warn('[SEOHead] ogImage must be an absolute URL for OG/Twitter cards. Received:', ogImage)
  }
  if (import.meta.env.DEV && canonical && !canonical.startsWith('http')) {
    console.warn('[SEOHead] canonical must be an absolute URL. Received:', canonical)
  }
  return (
    <>
      {preloadHeroImage && (
        <link rel="preload" as="image" href={preloadHeroImage} fetchPriority="high" />
      )}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="en" href={canonical} />}
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

export function RestaurantSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_SCHEMA) }}
    />
  )
}
