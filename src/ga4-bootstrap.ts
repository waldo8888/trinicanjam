declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
}

const GA4_ID_ATTRIBUTE = 'data-ga4-id'
const GA4_LOADER_ATTRIBUTE = 'data-ga4-loader'
const GTAG_JS_ORIGIN = 'https://www.googletagmanager.com/gtag/js'

function shouldEnableDebugMode() {
  const hostname = window.location.hostname

  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
}

function injectGtagScript(measurementId: string) {
  if (document.querySelector(`script[${GA4_LOADER_ATTRIBUTE}="true"]`)) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `${GTAG_JS_ORIGIN}?id=${encodeURIComponent(measurementId)}`
  script.setAttribute(GA4_LOADER_ATTRIBUTE, 'true')
  document.head.appendChild(script)
}

function ensureGtagProxy() {
  window.dataLayer = window.dataLayer ?? []

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args)
    }
  }
}

function bootstrapGa4() {
  const measurementId = __GA4_ID__.trim()

  if (!measurementId) {
    return
  }

  document.documentElement.setAttribute(GA4_ID_ATTRIBUTE, measurementId)
  ensureGtagProxy()
  injectGtagScript(measurementId)

  const queueCommand = window.gtag

  queueCommand?.('js', new Date())
  queueCommand?.('config', measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    debug_mode: shouldEnableDebugMode(),
  })
}

bootstrapGa4()