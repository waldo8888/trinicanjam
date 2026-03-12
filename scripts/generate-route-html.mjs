import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const baseHtmlPath = path.join(distDir, 'index.html')

const siteUrl = 'https://trinicanjam.ca'
const defaultOgImage = `${siteUrl}/assets/og-image.jpg`

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Trinicanjam Cuisine',
  url: siteUrl,
  telephone: '+19055551234',
  servesCuisine: ['Caribbean', 'Trinidadian', 'Jamaican'],
  priceRange: '$$',
  image: defaultOgImage,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 King Street East',
    addressLocality: 'Hamilton',
    addressRegion: 'ON',
    postalCode: 'L8N 1A1',
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
}

const routes = [
  {
    routePath: '/',
    output: 'index.html',
    title: 'Trinicanjam Cuisine — Caribbean Soul, Hamilton Table',
    description:
      'Premium Caribbean cuisine in Hamilton, Ontario. Trinidadian and Jamaican flavours, family-owned. Open Tuesday–Sunday.',
    ogImage: defaultOgImage,
    ogType: 'website',
    ogUrl: siteUrl,
    canonical: siteUrl,
    noSuffix: true,
    preloadHeroImage: '/assets/images/hero.webp',
    schema: restaurantSchema,
  },
  {
    routePath: '/menu',
    output: 'menu.html',
    title: 'Menu',
    description:
      'Browse the full Trinicanjam Cuisine menu — Trinidadian & Jamaican starters, mains, and drinks in Hamilton, Ontario.',
    ogImage: defaultOgImage,
    ogType: 'website',
    ogUrl: `${siteUrl}/menu`,
    canonical: `${siteUrl}/menu`,
  },
  {
    routePath: '/visit',
    output: 'visit.html',
    title: 'Visit',
    description:
      'Find Trinicanjam Cuisine in Hamilton, Ontario — address, opening hours, directions, and contact information.',
    ogImage: defaultOgImage,
    ogType: 'website',
    ogUrl: `${siteUrl}/visit`,
    canonical: `${siteUrl}/visit`,
  },
  {
    routePath: '/about',
    output: 'about.html',
    title: 'About — Trinicanjam Cuisine',
    description:
      'The story behind Trinicanjam Cuisine — Caribbean culinary roots, Hamilton Ontario, and a table for everyone.',
    ogImage: defaultOgImage,
    ogType: 'website',
    ogUrl: `${siteUrl}/about`,
    canonical: `${siteUrl}/about`,
    noSuffix: true,
  },
]

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildHeadMarkup(route) {
  const fullTitle = route.noSuffix ? route.title : `${route.title} | Trinicanjam Cuisine`
  const tags = []

  if (route.preloadHeroImage) {
    tags.push(
      `<link rel="preload" as="image" href="${escapeHtml(route.preloadHeroImage)}" fetchpriority="high" />`,
    )
  }

  tags.push(`<title>${escapeHtml(fullTitle)}</title>`)
  tags.push(`<meta name="description" content="${escapeHtml(route.description)}" />`)

  if (route.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(route.canonical)}" />`)
    tags.push(`<link rel="alternate" hreflang="en" href="${escapeHtml(route.canonical)}" />`)
  }

  tags.push(`<meta property="og:title" content="${escapeHtml(fullTitle)}" />`)
  tags.push(`<meta property="og:description" content="${escapeHtml(route.description)}" />`)
  tags.push(`<meta property="og:type" content="${escapeHtml(route.ogType ?? 'website')}" />`)

  if (route.ogUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(route.ogUrl)}" />`)
  }

  if (route.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(route.ogImage)}" />`)
  }

  tags.push('<meta name="twitter:card" content="summary_large_image" />')
  tags.push(`<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`)
  tags.push(`<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)

  if (route.ogImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(route.ogImage)}" />`)
  }

  if (route.schema) {
    const schemaJson = JSON.stringify(route.schema).replaceAll('<', '\\u003c')
    tags.push(
      `<script type="application/ld+json">${schemaJson}</script>`,
    )
  }

  return tags.join('\n    ')
}

function buildRootMarkup(route) {
  return `<div id="root">${route.appHtml}</div>`
}

function injectMetadata(html, route) {
  const headMarkup = buildHeadMarkup(route)
  return html
    .replace(/<title>[\s\S]*?<\/title>/, headMarkup)
    .replace('<div id="root"></div>', buildRootMarkup(route))
}

const baseHtml = await readFile(baseHtmlPath, 'utf8')
const serverBundleDir = path.join(distDir, 'server')
const serverEntry = (await readdir(serverBundleDir)).find(fileName => /entry-server\.(m?js)$/.test(fileName))

if (!serverEntry) {
  throw new Error('Unable to find the prerender server bundle in dist/server')
}

const { renderRoute } = await import(pathToFileURL(path.join(serverBundleDir, serverEntry)).href)

await Promise.all(
  routes.map(async (route) => {
    const outputPath = path.join(distDir, route.output)
    const html = injectMetadata(baseHtml, {
      ...route,
      appHtml: renderRoute(route.routePath),
    })
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html)
  }),
)