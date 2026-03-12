import { useEffect } from 'react'

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
    streetAddress: '123 King Street East',                // TODO: replace with real address
    addressLocality: 'Hamilton',
    addressRegion: 'ON',
    postalCode: 'L8N 1A1',                                // TODO: replace with real postal code
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

function upsertMeta(attributeName: 'name' | 'property', attributeValue: string, content?: string) {
  const selector = `meta[${attributeName}="${attributeValue}"]`
  const existing = document.head.querySelector(selector)

  if (!content) {
    existing?.remove()
    return
  }

  const meta = existing ?? document.createElement('meta')
  meta.setAttribute(attributeName, attributeValue)
  meta.setAttribute('content', content)

  if (!existing) {
    document.head.appendChild(meta)
  }
}

function upsertLink(selector: string, attributes: Record<string, string>, href?: string) {
  const existing = document.head.querySelector(selector)

  if (!href) {
    existing?.remove()
    return
  }

  const link = existing ?? document.createElement('link')

  Object.entries(attributes).forEach(([name, value]) => {
    link.setAttribute(name, value)
  })

  link.setAttribute('href', href)

  if (!existing) {
    document.head.appendChild(link)
  }
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

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:url', ogUrl)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('name', 'twitter:card', twitterCard)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    upsertLink('link[rel="canonical"]', { rel: 'canonical' }, canonical)
    upsertLink(
      'link[rel="alternate"][hreflang="en"]',
      { rel: 'alternate', hreflang: 'en' },
      canonical,
    )
    upsertLink(
      'link[rel="preload"][as="image"]',
      { rel: 'preload', as: 'image', fetchpriority: 'high' },
      preloadHeroImage,
    )
  }, [canonical, description, fullTitle, ogImage, ogType, ogUrl, preloadHeroImage, twitterCard])

  return null
}

export function RestaurantSchema() {
  useEffect(() => {
    const selector = 'script[type="application/ld+json"][data-schema="restaurant"]'
    const existing = document.head.querySelector(selector)
    const script = existing ?? document.createElement('script')

    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-schema', 'restaurant')
    script.textContent = JSON.stringify(RESTAURANT_SCHEMA)

    if (!existing) {
      document.head.appendChild(script)
    }

    return () => {
      script.remove()
    }
  }, [])

  return null
}
