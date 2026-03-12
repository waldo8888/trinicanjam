import { pathToFileURL } from 'node:url'

const DEFAULT_DEPLOYED_URL = process.env.LAUNCH_AUDIT_DEPLOYED_URL ?? 'https://trinicanjam.vercel.app'
const DEFAULT_PREVIEW_URL = process.env.LAUNCH_AUDIT_PREVIEW_URL ?? 'http://127.0.0.1:4173'
const DEFAULT_SITEMAP_URL = process.env.LAUNCH_AUDIT_SITEMAP_URL ?? 'https://trinicanjam.ca/sitemap.xml'

const ROUTE_EXPECTATIONS = [
  {
    route: '/',
    markers: ['Skip to main content', 'Our Menu', 'Find Us'],
  },
  {
    route: '/menu',
    markers: ['Our Menu', 'Plan Your Visit', 'Menu categories'],
  },
  {
    route: '/visit',
    markers: ['Find Us', 'Get Directions', '(905) 555-1234'],
  },
  {
    route: '/about',
    markers: ['Our Story', 'Where We Come From', 'Plan Your Visit'],
  },
]

const OUTBOUND_LINKS = [
  {
    name: 'Google Maps directions URL',
    url: 'https://maps.google.com/?q=Trinicanjam+Cuisine+Hamilton+Ontario',
  },
  {
    name: 'Instagram profile URL',
    url: 'https://instagram.com/trinicanjam',
  },
]

function currentDate() {
  return new Date().toISOString().slice(0, 10)
}

function toAbsoluteUrl(baseUrl, route) {
  return new URL(route, baseUrl).toString()
}

export function extractHrefTargets(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)].map((match) => match[1])
}

export function collectSameOriginLinks(hrefs, baseUrl) {
  const base = new URL(baseUrl)
  const normalized = new Set()

  for (const href of hrefs) {
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      continue
    }

    const url = new URL(href, base)

    if (url.origin !== base.origin) {
      continue
    }

    url.hash = ''
    normalized.add(url.toString())
  }

  return [...normalized].sort()
}

export function hasExpectedHtmlCacheControl(value) {
  const normalized = value.toLowerCase()

  return (
    normalized.includes('stale-while-revalidate=86400')
    && normalized.includes('stale-if-error=86400')
  )
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'launch-audit/1.0',
    },
  })

  return {
    url,
    finalUrl: response.url,
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    text: await response.text(),
  }
}

async function fetchStatus(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'launch-audit/1.0',
    },
  })

  await response.arrayBuffer()

  return {
    url,
    finalUrl: response.url,
    ok: response.ok,
    status: response.status,
  }
}

async function tryFetchStatus(url) {
  try {
    return await fetchStatus(url)
  } catch (error) {
    return {
      url,
      finalUrl: error instanceof Error ? error.message : 'Request failed',
      ok: false,
      status: 0,
    }
  }
}

async function tryFetchText(url) {
  try {
    return await fetchText(url)
  } catch {
    return null
  }
}

async function auditEnvironment(name, baseUrl) {
  const routeResults = []

  for (const expectation of ROUTE_EXPECTATIONS) {
    const url = toAbsoluteUrl(baseUrl, expectation.route)
    const page = await fetchText(url)
    const missingMarkers = expectation.markers.filter((marker) => !page.text.includes(marker))

    routeResults.push({
      route: expectation.route,
      url,
      status: page.status,
      ok: page.ok && missingMarkers.length === 0,
      missingMarkers,
      containsMapPlaceholder: page.text.includes('Map loading…'),
      containsMapIframe: page.text.includes('title="Trinicanjam Cuisine location map"') || page.text.includes('maps.google.com'),
      containsSkipLink: page.text.includes('Skip to main content'),
      links: extractHrefTargets(page.text),
      cacheControl: page.headers['cache-control'] ?? '',
    })
  }

  const expectedRouteUrls = ROUTE_EXPECTATIONS.map((expectation) => toAbsoluteUrl(baseUrl, expectation.route))
  const internalLinks = [...new Set([
    ...expectedRouteUrls,
    ...collectSameOriginLinks(routeResults.flatMap((result) => result.links), baseUrl),
  ])].sort()
  const linkResults = []

  for (const url of internalLinks) {
    const response = await fetchStatus(url)
    linkResults.push(response)
  }

  return {
    name,
    baseUrl,
    routeResults,
    linkResults,
  }
}

async function auditOutboundLinks() {
  const results = []

  for (const link of OUTBOUND_LINKS) {
    const response = await tryFetchStatus(link.url)
    results.push({
      ...link,
      ...response,
    })
  }

  return results
}

async function auditSitemap() {
  const fallbackUrl = toAbsoluteUrl(DEFAULT_DEPLOYED_URL, '/sitemap.xml')
  const sitemap = (await tryFetchText(DEFAULT_SITEMAP_URL)) ?? (await fetchText(fallbackUrl))
  const entries = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const checks = []

  for (const entry of entries) {
    const response = await tryFetchStatus(entry)
    checks.push(response)
  }

  return {
    url: sitemap.url,
    entries,
    checks,
  }
}

function statusLabel(ok) {
  return ok ? 'pass' : 'fail'
}

function markdownTable(headers, rows) {
  const headerRow = `| ${headers.join(' | ')} |`
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`
  const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`).join('\n')

  return [headerRow, separatorRow, bodyRows].filter(Boolean).join('\n')
}

async function main() {
  const date = currentDate()
  const preview = await auditEnvironment('Local production preview', DEFAULT_PREVIEW_URL)
  const deployed = await auditEnvironment('Deployed site', DEFAULT_DEPLOYED_URL)
  const outbound = await auditOutboundLinks()
  const sitemap = await auditSitemap()
  const deployedRoot = deployed.routeResults.find((result) => result.route === '/')
  const deployedMapPlaceholder = deployed.routeResults.some((result) => result.containsMapPlaceholder)
  const deployedMapIframe = deployed.routeResults.some((result) => result.containsMapIframe)

  const routeRows = [preview, deployed].flatMap((environment) => {
    return environment.routeResults.map((result) => [
      `${environment.name} ${result.route}`,
      result.url,
      result.missingMarkers.length === 0 ? 'Required markers present' : `Missing: ${result.missingMarkers.join(', ')}`,
      statusLabel(result.ok),
      date,
      result.containsMapPlaceholder
        ? 'Map placeholder rendered instead of live embed.'
        : result.containsMapIframe
          ? 'Route responded 200 with a rendered map iframe and expected content markers.'
        : 'Route responded 200 with expected content markers.',
    ])
  })

  const internalLinkRows = [preview, deployed].flatMap((environment) => {
    return environment.linkResults.map((result) => [
      environment.name,
      result.url,
      String(result.status),
      statusLabel(result.ok),
      date,
      result.finalUrl,
    ])
  })

  const outboundRows = outbound.map((result) => [
    result.name,
    result.url,
    String(result.status),
    statusLabel(result.ok),
    date,
    result.finalUrl,
  ])

  const sitemapRows = sitemap.checks.map((result) => [
    result.url,
    String(result.status),
    statusLabel(result.ok),
    date,
    result.finalUrl,
  ])

  const headerRows = [
    [
      'Deployed / response cache-control',
      deployedRoot?.cacheControl ?? '',
      hasExpectedHtmlCacheControl(deployedRoot?.cacheControl ?? '') ? 'pass' : 'fail',
      date,
      'Primary launch route should include stale-while-revalidate=86400 and stale-if-error=86400.',
    ],
    [
      'Deployed /visit map state',
      deployedMapPlaceholder ? 'Map loading… placeholder rendered' : deployedMapIframe ? 'Rendered map iframe detected' : 'Map state could not be confirmed from fetched HTML',
      deployedMapPlaceholder ? 'fail' : deployedMapIframe ? 'pass' : 'fail',
      date,
      deployedMapPlaceholder
        ? 'Current deployed environment appears to be missing VITE_MAPS_EMBED_KEY.'
        : deployedMapIframe
          ? 'A usable map iframe rendered on the fetched launch surfaces.'
          : 'Fetched HTML did not expose the expected map iframe state.',
    ],
  ]

  process.stdout.write(`# Launch Audit Snapshot\n\n`)
  process.stdout.write(`Generated: ${date}\n\n`)
  process.stdout.write(`Command: npm run launch:audit\n\n`)
  process.stdout.write(`## Route Smoke Checks\n\n`)
  process.stdout.write(markdownTable(
    ['Check', 'URL', 'Actual Result', 'Status', 'Date', 'Evidence Notes'],
    routeRows,
  ))
  process.stdout.write(`\n\n## Internal Link Checks\n\n`)
  process.stdout.write(markdownTable(
    ['Environment', 'URL', 'HTTP Status', 'Status', 'Date', 'Resolved URL'],
    internalLinkRows,
  ))
  process.stdout.write(`\n\n## Outbound Link Checks\n\n`)
  process.stdout.write(markdownTable(
    ['Check', 'URL', 'HTTP Status', 'Status', 'Date', 'Resolved URL'],
    outboundRows,
  ))
  process.stdout.write(`\n\n## Sitemap Entry Checks\n\n`)
  process.stdout.write(markdownTable(
    ['URL', 'HTTP Status', 'Status', 'Date', 'Resolved URL'],
    sitemapRows,
  ))
  process.stdout.write(`\n\n## Header And Environment Checks\n\n`)
  process.stdout.write(markdownTable(
    ['Check', 'Actual Result', 'Status', 'Date', 'Evidence Notes'],
    headerRows,
  ))
  process.stdout.write('\n')
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}