# QA Report — CPS Medical Billing (live Azure deploy)

- **Target:** https://black-glacier-03946dd1e.7.azurestaticapps.net
- **Date:** 2026-07-09
- **Build:** Astro static, 98 pages, deployed via GitHub Actions → Azure Static Web Apps
- **Scope:** Full click-through (all pages, links, forms, calculator, mobile)

## Health: strong, one blocker

| Area | Result |
|------|--------|
| Page loads (16 core pages) | ✅ all 200, zero console errors |
| Blog posts (14) | ✅ 0 broken |
| State pages (50) | ✅ 0 broken |
| Homepage render + scroll animations | ✅ all sections reveal; content in DOM (SEO-safe) |
| ROI calculator | ✅ computes client-side ($19,500/mo on test inputs) |
| 404 page | ✅ branded, returns correct 404 status |
| Mobile (390px) | ✅ responsive, hamburger nav works |
| HTTPS / SSL / HSTS | ✅ valid, security headers present |
| **Lead-capture forms** | ❌ **fail — 405, leads lost** |

## Issues

### 🔴 CRITICAL — Contact / Assessment / Newsletter forms fail on submit
- **Repro:** /contact → fill form → Send Message
- **Result:** axios POST to `/api/v2/inquiries` returns **405**; user sees raw error "Request failed with status code 405"
- **Cause:** forms target the `cps-dotnet` backend (`/api/v2/*`), which isn't deployed. Static host has no such endpoint.
- **Impact:** every form submission is lost. Affects contact, assessment, and newsletter (shared `apiClient`).
- **Mitigation present:** contact page shows phone (801-341-9304) + email (completeprosolns@gmail.com) fallbacks.
- **Fix planned:** route forms to Web3Forms → email leads to completeprosolns@gmail.com until backend is live.

### 🟡 LOW — Footer "Mira — AI-native platform" sister-brand link
- Footer links to mira.ai as "SISTER BRAND — AI-native platform". Confirm this cross-brand link + the "AI-native platform" wording is intended on the CPS site.

### 🟡 LOW — 404 page is minimal
- Renders a correct branded 404 but only a short message; consider adding a "Back to home" link/nav for recovery.

## Verdict
Site is polished and production-quality. **Only real blocker before pointing cpshealthcarebilling.com here: the forms must capture leads.** Everything else is launch-ready.
