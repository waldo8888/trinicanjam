# Launch Checklist

Sign-off date: 2026-03-12
Launch status: blocked (Safari app + Edge + canonical DNS remain open)

## Evidence Commands

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Launch audit snapshot | CLI against local preview and deployed site | Route, link, sitemap, and header evidence is repeatable | `npm run launch:audit` completed successfully after adding sitemap fallback handling | pass | 2026-03-12 | Command uses the checked-in `scripts/launch-audit.mjs` helper. |
| Browser and viewport matrix snapshot | Automated browser run against deployed site | Cross-browser and viewport smoke evidence is repeatable | `npm run launch:browser-matrix` completed successfully with all automated Chrome, Firefox, and WebKit route checks passing across `/`, `/menu`, and `/visit` | pass | 2026-03-12 | Command uses the checked-in `scripts/browser-matrix.mjs` helper with Playwright-driven browser coverage plus viewport checks at 375px, 390px, 428px, and 768px. |
| Repo validation stack | Local workspace | Tests, build, and lint all pass after launch-audit changes | `npm test -- --run`, `npm run build`, and `npm run lint` all passed | pass | 2026-03-12 | Validation completed after the new launch audit script, test file, and `vercel.json` cache-control fix were added. |

## Browser Matrix

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Home/menu/visit smoke test | Chrome 133.0.6943.127 / deployed site | Home, menu, and visit routes load with no broken layout, missing fonts, or JS console errors | All three routes passed in automated Chrome with loaded fonts, no horizontal overflow, no console errors, and working menu, directions, and phone interactions | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix` after the route-specific interaction assertions were tightened. |
| Home/menu/visit smoke test | Safari 17+ / deployed site | Home, menu, and visit routes load with no broken layout, missing fonts, or JS console errors | Safari app was not executed directly in this workflow; WebKit 26.0 engine automation passed all three routes as a proxy only | fail | 2026-03-12 | Actual Safari 17+ app validation is still required to close the browser-support requirement. |
| Home/menu/visit smoke test | Firefox 146.0.1 / deployed site | Home, menu, and visit routes load with no broken layout, missing fonts, or JS console errors | All three routes passed in automated Firefox with loaded fonts, no horizontal overflow, no console errors, and working menu, directions, and phone interactions | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix` after pinning `cookie_domain` to `location.hostname` in the GA4 bootstrap. |
| Home/menu/visit smoke test | WebKit 26.0 / deployed site | Home, menu, and visit routes load with no broken layout, missing fonts, or JS console errors | All three routes passed in automated WebKit with loaded fonts, no horizontal overflow, no console errors, and working menu, directions, and phone interactions | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix`; this is automation evidence only and does not replace direct Safari app validation. |
| Home/menu/visit smoke test | Edge 120+ / deployed site | Home, menu, and visit routes load with no broken layout, missing fonts, or JS console errors | Microsoft Edge is not installed on this machine, so no direct Edge smoke run was executed | fail | 2026-03-12 | Edge validation is still required on a machine with Edge available. |

## Automated Route Smoke Snapshot

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Home route shell | Local preview | `/` returns launch content markers for skip link, menu, and visit surfaces | Required markers present with a rendered map iframe | pass | 2026-03-12 | `npm run launch:audit` confirmed route markers and iframe markup at `http://127.0.0.1:4173/`. |
| Home route shell | Deployed site | `/` returns launch content markers for skip link, menu, and visit surfaces | Required markers present with a rendered map iframe | pass | 2026-03-12 | `npm run launch:audit` confirmed route markers and iframe markup at `https://trinicanjam.vercel.app/`. |
| Menu route shell | Local preview | `/menu` returns the menu page body in the fetched HTML response | Required markers present | pass | 2026-03-12 | `npm run launch:audit` confirmed the real menu surface after the route-shell fix. |
| Menu route shell | Deployed site | `/menu` returns the menu page body in the fetched HTML response | Required markers present | pass | 2026-03-12 | `npm run launch:audit` confirmed the real menu surface after the production redeploy. |
| Visit route shell | Local preview | `/visit` returns the visit page body in the fetched HTML response | Required markers present with a rendered map iframe | pass | 2026-03-12 | `npm run launch:audit` confirmed the real visit surface after the route-shell fix. |
| Visit route shell | Deployed site | `/visit` returns the visit page body in the fetched HTML response | Required markers present with a rendered map iframe | pass | 2026-03-12 | `npm run launch:audit` confirmed the real visit surface after the production redeploy. |
| About route shell | Local preview | `/about` returns the about page body in the fetched HTML response | Required markers present | pass | 2026-03-12 | `Our Story`, `Where We Come From`, and `Plan Your Visit` were present in fetched HTML. |
| About route shell | Deployed site | `/about` returns the about page body in the fetched HTML response | Required markers present | pass | 2026-03-12 | `Our Story`, `Where We Come From`, and `Plan Your Visit` were present in fetched HTML. |

## Viewport Matrix

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Mobile viewport validation | 375px / deployed browser automation | Tonal zones, sticky utility bar, and map area remain usable | Passed with no horizontal overflow, sticky utility bar visible after hero exit, and rendered map iframe | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix` in Chrome 133 automation. |
| Mobile viewport validation | 390px / deployed browser automation | Tonal zones, sticky utility bar, and map area remain usable | Passed with no horizontal overflow, sticky utility bar visible after hero exit, and rendered map iframe | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix` in Chrome 133 automation. |
| Mobile viewport validation | 428px / deployed browser automation | Tonal zones, sticky utility bar, and map area remain usable | Passed with no horizontal overflow, sticky utility bar visible after hero exit, and rendered map iframe | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix` in Chrome 133 automation. |
| Mobile viewport validation | 768px / deployed browser automation | Tonal zones, sticky utility bar, and map area remain usable | Passed with no horizontal overflow, sticky utility bar visible after hero exit, and rendered map iframe | pass | 2026-03-12 | Verified by `npm run launch:browser-matrix` in Chrome 133 automation. |

## Accessibility / AODA Validation

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Skip link handoff | Local automated test coverage | Skip link moves focus to `#main-content` and supports first-action keyboard flow | Existing skip-link test suite passed | pass | 2026-03-12 | Covered by `src/components/SkipLink/SkipLink.test.tsx`. |
| Keyboard navigation coverage | Local automated test coverage | Sticky utility bar links, menu tabs, and visit CTAs remain keyboard-operable | Existing sticky-bar, menu, and visit test suites passed | pass | 2026-03-12 | Covered by `src/sections/StickyUtilityBar.test.tsx`, `src/sections/MenuSection.test.tsx`, and `src/sections/VisitBlock.test.tsx`. |
| Visible focus indicators | Source review | Focus ring remains visible across light, dark, and gradient zones | Global focus-visible rules are still present in `src/styles/globals.css` | pass | 2026-03-12 | Dark and gradient zones switch outline color to white. |
| Image alt text coverage | Local automated test coverage | Published imagery exposes descriptive alt text or decorative handling | Existing hero, food-photography, and social-proof image tests passed | pass | 2026-03-12 | Covered by `src/sections/HeroSection.test.tsx`, `src/sections/FoodPhotographySection.test.tsx`, and `src/components/SocialProofGrid/SocialProofGrid.test.tsx`. |
| Reduced-motion behavior | Local automated test coverage + source review | Non-essential motion is suppressed when reduced motion is enabled | Reduced-motion hook tests passed and the global CSS kill-switch remains in place | pass | 2026-03-12 | Covered by `src/lib/useReducedMotion.test.ts`, `src/sections/StickyUtilityBar.test.tsx`, `src/sections/HeroSection.test.tsx`, and `src/styles/globals.css`. |
| Contrast validation carry-forward | Adjacent launch-gate evidence | Contrast checks remain valid at launch | No visual-token changes were introduced in this story; Story 6.3 remains in `review` | pass | 2026-03-12 | This story consumed prior accessibility remediation evidence instead of reopening color-token work. |

## Link Validation

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Google Maps directions URL | Deployed URL check | Directions link resolves to the intended destination | HTTP `200` after redirect to Google Maps | pass | 2026-03-12 | Verified by `npm run launch:audit`. |
| Instagram profile URL | Deployed URL check | Instagram links resolve to the intended profile | HTTP `200` after redirect to Instagram profile | pass | 2026-03-12 | Verified by `npm run launch:audit`. |
| Phone link | Source review + automated test coverage | Phone CTA uses a valid `tel:` target | `tel:+19055551234` remains present in the visit block | pass | 2026-03-12 | Covered by `src/sections/VisitBlock.tsx` and `src/sections/VisitBlock.test.tsx`. |
| Broken internal link scan | Local preview and deployed site | Public routes return `200` with no broken internal destinations | `/`, `/menu`, `/visit`, and `/about` all returned HTTP `200` on both targets | pass | 2026-03-12 | Verified by `npm run launch:audit`. |
| Sitemap entry resolution | Canonical production domain | All sitemap URLs resolve successfully | `https://trinicanjam.ca/`, `/menu`, `/visit`, and `/about` all failed from this shell with `fetch failed` | fail | 2026-03-12 | The canonical domain was not resolvable from this environment, so production-domain verification remains open. |

## Deployed-Header Verification

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Primary HTML route cache-control | Deployed `/` response | `cache-control` includes `stale-while-revalidate=86400` and `stale-if-error=86400` | `https://trinicanjam.vercel.app/` now returns `cache-control: no-cache, stale-while-revalidate=86400, stale-if-error=86400` | pass | 2026-03-12 | Verified after the production redeploy with `curl -sSI https://trinicanjam.vercel.app/` and `npm run launch:audit`. |
| Static HTML file cache-control | Deployed `/index.html` response | `cache-control` includes `stale-while-revalidate=86400` and `stale-if-error=86400` | `https://trinicanjam.vercel.app/index.html` already returns both stale directives | pass | 2026-03-12 | Verified with `curl -sSI https://trinicanjam.vercel.app/index.html`. |
| CSP and security header baseline | Deployed `/` response | Current launch header state is captured in the sign-off artifact | CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` were captured | pass | 2026-03-12 | Current CSP reflects the GA4 bootstrap hardening and no longer requires `unsafe-inline` in `script-src` or `style-src`. |
| Deployed map embed configuration | Deployed `/` response | Visit surface renders a live map embed | Current deployed homepage renders a Google Maps iframe via the no-key embed fallback | pass | 2026-03-12 | Verified after redeploy with `curl -s https://trinicanjam.vercel.app/ | grep -E 'Trinicanjam Cuisine location map|maps.google.com'` and `npm run launch:audit`. |

## Final Readiness Gaps

| Check Name | Environment/Browser | Expected Result | Actual Result | Status | Date | Evidence Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Browser matrix completion | Safari 17+, Firefox, and Edge | Browser matrix is fully completed with no console errors | Chrome, Firefox, and WebKit automation all pass across `/`, `/menu`, and `/visit`. Actual Safari app was not run, and Edge was unavailable locally. | fail | 2026-03-12 | Launch remains blocked until Safari app and Edge gaps are resolved or explicitly accepted. |
| Viewport matrix completion | 375px, 390px, 428px, 768px | Viewport matrix is fully completed | Completed successfully through automated Chrome browser emulation | pass | 2026-03-12 | No remaining viewport blocker after `npm run launch:browser-matrix`. |
| Canonical domain sitemap resolution | `https://trinicanjam.ca` | All canonical sitemap URLs resolve successfully | Canonical-domain requests still fail from this shell with `fetch failed` | fail | 2026-03-12 | Launch evidence still needs confirmation from an environment that can resolve the canonical domain. |
| Firefox analytics console health | Firefox on deployed alias | No JS console errors appear during route loads | All three routes now load with zero console errors after pinning `cookie_domain: location.hostname` in the GA4 bootstrap | pass | 2026-03-12 | Root cause: gtag.js set cookies on `.vercel.app` (a public suffix) which Firefox rejected. Fixed by pinning cookie domain to the exact hostname. |