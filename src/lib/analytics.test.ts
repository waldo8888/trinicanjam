import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  trackMenuView,
  trackDirectionsClick,
  trackInstagramClick,
  trackHoursView,
  trackPhoneClick,
} from '@/lib/analytics'

describe('analytics', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-ga4-id', 'G-TEST123456')
    window.gtag = vi.fn()
  })

  it('exports trackMenuView as a function', () => {
    expect(typeof trackMenuView).toBe('function')
  })

  it('exports trackDirectionsClick as a function', () => {
    expect(typeof trackDirectionsClick).toBe('function')
  })

  it('exports trackInstagramClick as a function', () => {
    expect(typeof trackInstagramClick).toBe('function')
  })

  it('exports trackHoursView as a function', () => {
    expect(typeof trackHoursView).toBe('function')
  })

  it('exports trackPhoneClick as a function', () => {
    expect(typeof trackPhoneClick).toBe('function')
  })

  it('calls window.gtag with the menu_view event contract', () => {
    trackMenuView()

    expect(window.gtag).toHaveBeenCalledWith('event', 'menu_view', { debug_mode: true })
  })

  it('calls window.gtag with the directions_click event contract', () => {
    trackDirectionsClick()

    expect(window.gtag).toHaveBeenCalledWith('event', 'directions_click', { debug_mode: true })
  })

  it('calls window.gtag with the instagram_click event contract', () => {
    trackInstagramClick()

    expect(window.gtag).toHaveBeenCalledWith('event', 'instagram_click', { debug_mode: true })
  })

  it('calls window.gtag with the hours_view event contract', () => {
    trackHoursView()

    expect(window.gtag).toHaveBeenCalledWith('event', 'hours_view', { debug_mode: true })
  })

  it('calls window.gtag with the phone_click event contract', () => {
    trackPhoneClick()

    expect(window.gtag).toHaveBeenCalledWith('event', 'phone_click', { debug_mode: true })
  })

  it('degrades to a silent no-op when the GA4 ID is absent', () => {
    window.gtag = vi.fn()
    document.documentElement.setAttribute('data-ga4-id', '')

    expect(() => {
      trackMenuView()
      trackDirectionsClick()
      trackInstagramClick()
      trackHoursView()
      trackPhoneClick()
    }).not.toThrow()

    expect(window.gtag).not.toHaveBeenCalled()
  })

  it('degrades to a silent no-op when gtag is unavailable', () => {
    document.documentElement.setAttribute('data-ga4-id', 'G-TEST123456')
    window.gtag = undefined

    expect(() => {
      trackMenuView()
      trackDirectionsClick()
      trackInstagramClick()
      trackHoursView()
      trackPhoneClick()
    }).not.toThrow()
  })
})
