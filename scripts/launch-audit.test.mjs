import { describe, expect, it } from 'vitest'
import {
  collectSameOriginLinks,
  extractHrefTargets,
  hasExpectedHtmlCacheControl,
} from './launch-audit.mjs'

describe('launch audit helpers', () => {
  it('extracts href targets from anchor tags', () => {
    const html = '<a href="/menu">Menu</a><a href="https://instagram.com/trinicanjam">Instagram</a>'

    expect(extractHrefTargets(html)).toEqual(['/menu', 'https://instagram.com/trinicanjam'])
  })

  it('collects only same-origin navigable links', () => {
    const hrefs = [
      '/',
      '/menu',
      '/visit#hours',
      '#main-content',
      'tel:+19055551234',
      'https://instagram.com/trinicanjam',
    ]

    expect(collectSameOriginLinks(hrefs, 'https://trinicanjam.vercel.app')).toEqual([
      'https://trinicanjam.vercel.app/',
      'https://trinicanjam.vercel.app/menu',
      'https://trinicanjam.vercel.app/visit',
    ])
  })

  it('recognizes the required launch html cache directives', () => {
    expect(
      hasExpectedHtmlCacheControl('no-cache, stale-while-revalidate=86400, stale-if-error=86400'),
    ).toBe(true)
    expect(hasExpectedHtmlCacheControl('no-cache')).toBe(false)
  })
})