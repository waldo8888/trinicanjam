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
    // Provide a mock gtag on window to avoid "not a function" errors
    vi.stubGlobal('gtag', vi.fn())
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

  it('calls window.gtag when trackMenuView is invoked and gtag is available', () => {
    trackMenuView()
    expect(window.gtag).toHaveBeenCalledWith('event', 'menu_view', undefined)
  })
})
