// Analytics event wrappers — centralized per ARCH-12
// No raw gtag() calls allowed outside this file
// Full implementation: Story 1.5

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const GA4_ID_ATTRIBUTE = 'data-ga4-id'

function isDebugEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const hostname = window.location.hostname

  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.vercel.app')
  )
}

function getMeasurementId(): string {
  if (typeof document !== 'undefined') {
    const runtimeMeasurementId = document.documentElement.getAttribute(GA4_ID_ATTRIBUTE)

    if (typeof runtimeMeasurementId === 'string') {
      return runtimeMeasurementId.trim()
    }
  }

  return __GA4_ID__.trim()
}

function track(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !getMeasurementId()) {
    return
  }

  window.gtag('event', eventName, {
    ...params,
    ...(isDebugEnvironment() ? { debug_mode: true } : {}),
  })
}

export function trackMenuView(): void {
  track('menu_view')
}

export function trackDirectionsClick(): void {
  track('directions_click')
}

export function trackInstagramClick(): void {
  track('instagram_click')
}

export function trackHoursView(): void {
  track('hours_view')
}

export function trackPhoneClick(): void {
  track('phone_click')
}
