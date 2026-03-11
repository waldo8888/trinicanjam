// Analytics event wrappers — centralized per ARCH-12
// No raw gtag() calls allowed outside this file
// Full implementation: Story 1.5

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
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
