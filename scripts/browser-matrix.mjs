import { chromium, firefox, webkit } from 'playwright'

const BASE_URL = process.env.BROWSER_MATRIX_URL ?? 'https://trinicanjam.vercel.app'

const smokeRoutes = [
  {
    label: 'Homepage',
    path: '/',
    markers: ['Our Menu', 'Find Us', 'Trinicanjam Cuisine'],
    checks: [],
  },
  {
    label: 'Menu route',
    path: '/menu',
    markers: ['Our Menu', 'Plan Your Visit', 'Menu categories'],
    checks: ['menu-tablist'],
  },
  {
    label: 'Visit route',
    path: '/visit',
    markers: ['Find Us', 'Get Directions', '(905) 555-1234'],
    checks: [],
  },
]

const viewportProfiles = [
  { label: '375px', width: 375, height: 667 },
  { label: '390px', width: 390, height: 844 },
  { label: '428px', width: 428, height: 926 },
  { label: '768px', width: 768, height: 1024 },
]

const browserConfigs = [
  {
    label: 'Chrome',
    launch: () => chromium.launch({ channel: 'chrome', headless: true }),
  },
  {
    label: 'Firefox',
    launch: () => firefox.launch({ headless: true }),
  },
  {
    label: 'WebKit',
    launch: () => webkit.launch({ headless: true }),
  },
]

function toUrl(path) {
  return new URL(path, BASE_URL).toString()
}

function passLabel(pass) {
  return pass ? 'pass' : 'fail'
}

function markdownTable(headers, rows) {
  const headerRow = `| ${headers.join(' | ')} |`
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`
  const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`).join('\n')

  return [headerRow, separatorRow, bodyRows].filter(Boolean).join('\n')
}

async function capturePageDiagnostics(page) {
  return page.evaluate(() => {
    const bodyText = document.body.innerText
    const stickyBar = document.querySelector('nav[aria-label="Utility navigation"]')
    const mapFrame = document.querySelector('iframe[title="Trinicanjam Cuisine location map"]')

    return {
      bodyText,
      title: document.title,
      fontStatus: document.fonts.status,
      fontCount: document.fonts.size,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      stickyBarHidden: stickyBar?.getAttribute('aria-hidden') ?? 'missing',
      mapVisible: Boolean(mapFrame),
      mapHeight: mapFrame?.getBoundingClientRect().height ?? 0,
    }
  })
}

async function evaluateSmokeRoute(browserLabel, browser, route) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
  const page = await context.newPage()
  const consoleErrors = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message)
  })

  await page.goto(toUrl(route.path), { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)

  const diagnostics = await capturePageDiagnostics(page)
  const missingMarkers = route.markers.filter((marker) => {
    if (marker === 'Menu categories' && route.checks.includes('menu-tablist')) {
      return false
    }

    return !diagnostics.bodyText.includes(marker)
  })

  const semanticCheckFailures = []

  if (route.checks.includes('menu-tablist')) {
    const hasMenuTablist = await page.locator('[role="tablist"][aria-label="Menu categories"]').count()

    if (hasMenuTablist === 0) {
      semanticCheckFailures.push('menu tablist missing')
    }
  }

  let interactionPass = true
  const interactionNotes = []

  if (route.path === '/' || route.path === '/menu') {
    const selectedBefore = await page.locator('[role="tab"][aria-selected="true"]').textContent()
    await page.locator('[role="tab"][aria-selected="true"]').press('ArrowRight')
    await page.waitForTimeout(150)
    const selectedAfterArrow = await page.locator('[role="tab"][aria-selected="true"]').textContent()
    const planVisitHref = await page.getByRole('link', { name: 'Plan Your Visit' }).getAttribute('href')

    interactionPass = selectedBefore === 'Starters'
      && selectedAfterArrow === 'Mains'
      && Boolean(planVisitHref?.includes('/#visit'))

    interactionNotes.push(`tabs: ${selectedBefore} -> ${selectedAfterArrow}`)
    interactionNotes.push(`plan visit: ${planVisitHref ?? 'missing'}`)
  }

  if (route.path === '/' || route.path === '/visit') {
    const directionsHref = await page.getByRole('link', { name: 'Get Directions' }).getAttribute('href')
    const phoneHref = await page.getByRole('link', { name: /\(905\) 555-1234/i }).getAttribute('href')

    interactionPass = interactionPass
      && Boolean(directionsHref?.includes('maps.google.com'))
      && phoneHref === 'tel:+19055551234'

    interactionNotes.push(`directions: ${directionsHref ?? 'missing'}`)
    interactionNotes.push(`phone: ${phoneHref ?? 'missing'}`)
  }

  await context.close()

  return {
    browser: `${browserLabel} ${browser.version()}`,
    route: route.label,
    url: toUrl(route.path),
    pass: missingMarkers.length === 0
      && semanticCheckFailures.length === 0
      && !diagnostics.hasHorizontalOverflow
      && diagnostics.fontStatus === 'loaded'
      && consoleErrors.length === 0
      && interactionPass,
    missingMarkers,
    semanticCheckFailures,
    hasHorizontalOverflow: diagnostics.hasHorizontalOverflow,
    fontStatus: diagnostics.fontStatus,
    fontCount: diagnostics.fontCount,
    consoleErrors,
    interactionNotes: interactionNotes.length > 0 ? interactionNotes.join('; ') : 'n/a',
  }
}

async function runBrowserSmokeMatrix() {
  const results = []

  for (const config of browserConfigs) {
    const browser = await config.launch()

    try {
      for (const route of smokeRoutes) {
        results.push(await evaluateSmokeRoute(config.label, browser, route))
      }
    } finally {
      await browser.close()
    }
  }

  return results
}

async function runViewportMatrix() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const results = []

  try {
    for (const profile of viewportProfiles) {
      const context = await browser.newContext({
        viewport: { width: profile.width, height: profile.height },
        isMobile: profile.width <= 428,
      })
      const page = await context.newPage()

      await page.goto(toUrl('/'), { waitUntil: 'networkidle' })
      await page.waitForTimeout(250)

      const beforeScroll = await capturePageDiagnostics(page)
      await page.evaluate(() => {
        const darkZone = document.querySelector('section[data-zone="dark"]')
        const darkZoneHeight = darkZone?.getBoundingClientRect().height ?? window.innerHeight

        window.scrollTo({ top: darkZoneHeight + 64, behavior: 'instant' })
      })
      await page.waitForTimeout(350)

      const afterScroll = await capturePageDiagnostics(page)
      const utilityLinkTabIndexes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('nav[aria-label="Utility navigation"] a')).map((link) => link.getAttribute('tabindex'))
      })

      const visitReadable = await page.evaluate(() => {
        return document.body.innerText.includes('Find Us')
          && document.body.innerText.includes('Get Directions')
          && document.body.innerText.includes('(905) 555-1234')
      })

      results.push({
        viewport: profile.label,
        pass: !beforeScroll.hasHorizontalOverflow
          && !afterScroll.hasHorizontalOverflow
          && beforeScroll.fontStatus === 'loaded'
          && afterScroll.stickyBarHidden === 'false'
          && utilityLinkTabIndexes.every((value) => value === '0')
          && afterScroll.mapVisible
          && afterScroll.mapHeight > 0
          && visitReadable,
        beforeScrollOverflow: beforeScroll.hasHorizontalOverflow,
        afterScrollOverflow: afterScroll.hasHorizontalOverflow,
        stickyBarHidden: afterScroll.stickyBarHidden,
        utilityLinkTabIndexes,
        mapVisible: afterScroll.mapVisible,
        mapHeight: afterScroll.mapHeight,
        visitReadable,
      })

      await context.close()
    }
  } finally {
    await browser.close()
  }

  return results
}

async function main() {
  const browserSmoke = await runBrowserSmokeMatrix()
  const viewportMatrix = await runViewportMatrix()

  const browserRows = browserSmoke.map((result) => [
    result.browser,
    result.route,
    passLabel(result.pass),
    result.missingMarkers.length > 0 || result.semanticCheckFailures.length > 0
      ? [...result.missingMarkers, ...result.semanticCheckFailures].join(', ')
      : 'none',
    result.hasHorizontalOverflow ? 'yes' : 'no',
    result.fontStatus,
    result.consoleErrors.length > 0 ? result.consoleErrors.join(' || ') : 'none',
    result.interactionNotes,
  ])

  const viewportRows = viewportMatrix.map((result) => [
    result.viewport,
    passLabel(result.pass),
    result.beforeScrollOverflow || result.afterScrollOverflow ? 'yes' : 'no',
    result.stickyBarHidden,
    result.utilityLinkTabIndexes.join(', '),
    result.mapVisible ? `${result.mapHeight}` : 'missing',
    result.visitReadable ? 'yes' : 'no',
  ])

  process.stdout.write('# Browser Matrix Snapshot\n\n')
  process.stdout.write(`Base URL: ${BASE_URL}\n\n`)
  process.stdout.write('## Browser Smoke Matrix\n\n')
  process.stdout.write(markdownTable(
    ['Browser', 'Route', 'Status', 'Missing Markers', 'Horizontal Overflow', 'Fonts', 'Console Errors', 'Interaction Notes'],
    browserRows,
  ))
  process.stdout.write('\n\n## Viewport Matrix\n\n')
  process.stdout.write(markdownTable(
    ['Viewport', 'Status', 'Horizontal Overflow', 'Sticky Bar Hidden', 'Utility Link TabIndex', 'Map Height', 'Visit Surface Readable'],
    viewportRows,
  ))
  process.stdout.write('\n')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})