# State-Page SEO Depth + Conversion Attribution + 50-State Coverage

**Date:** 2026-06-12
**Repo:** `cps-medical-billing` (Astro 5 static site, deployed to Azure Static Web Apps)
**Status:** Approved design — ready for implementation plan

## Summary

A three-phase program to strengthen the site's organic-search and conversion
performance, sequenced so each phase de-risks the next:

- **Phase A — State-page power-up.** Add per-state FAQ content + `FAQPage`
  JSON-LD, internal cross-linking between state pages, and an end-to-end
  conversion-attribution loop (state CTA → `/assessment?source=…` → tracked
  submit) on the existing 10 state pages.
- **Phase B — Sitewide conversion instrumentation.** Generalize the Phase-A
  CTA-tracking pattern into a reusable helper applied to primary CTAs across
  home, services, pricing, why-cps, contact, ROI calculator, header, and
  footer. Standardize on a `cta_click` event and add ROI-calculator engagement
  events.
- **Phase C — 50-state coverage.** Append the remaining 40 states to the
  `STATES` data array (intro, key payers, regulatory note, FAQs each). The
  dynamic route, schema, cross-linking, and CTAs all pick them up
  automatically.

## Background / Current State

The site already has a strong SEO foundation, so this program targets *gaps*,
not the basics:

- **Already present:** hreflang + canonical (`BaseLayout.astro`), per-page OG
  cards, sitewide `Organization` + `WebSite` JSON-LD, `Service` +
  `BreadcrumbList` JSON-LD on state pages, an i18n sitemap with changefreq/
  priority hints (`astro.config.mjs`), GA4 + Azure App Insights `trackEvent`
  (`src/lib/analytics.ts`), an ROI calculator island, and an assessment funnel.
- **`InquiryForm`** (`src/islands/InquiryForm.tsx`) already fires
  `trackEvent('inquiry_submitted', { service_type, locale })` on submit.

**Gaps this program closes:**

1. State pages (`src/pages/states/[slug].astro`, data in `src/data/states.ts`)
   are content-thin, have **no `FAQPage` schema**, and have **no internal
   cross-linking** to each other or back to `/states/`.
2. State-page CTAs are plain `<a href="/assessment">` — **no click tracking,
   no state context passed**, so conversions can't be attributed to the page
   that drove them.
3. Only 10 of 50 states have landing pages.

## Phase A — State-Page Power-Up

### A1. Data model: per-state FAQs

Extend the `StateData` interface in `src/data/states.ts`:

```ts
export interface StateData {
  // ...existing fields...
  /** 3–4 state-specific Q&As. Powers the on-page FAQ section + FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
}
```

Author 3–4 FAQs for each of the 10 existing states. Question themes (varied per
state, not boilerplate): does CPS handle `{medicaidProgram}` claims; NOE/NOA
submission timing for that state; dual-eligible Medicare/Medicaid coordination;
how to get started / what the free assessment covers. Answers reference
state-specific facts (program name, MCOs, regulatory note) so each FAQ set is
genuinely distinct.

### A2. On-page FAQ section + FAQPage JSON-LD

In `src/pages/states/[slug].astro`:

- Render an accessible FAQ section using native `<details>/<summary>` (no JS
  dependency, keyboard-accessible, expands by default for crawlers — verify the
  closed-`<details>` content is still in the DOM for indexing; it is).
- Build a `FAQPage` JSON-LD object from `state.faqs` and pass it through the
  existing `extraJsonLd` prop alongside `serviceJsonLd` and `breadcrumbJsonLd`.

```ts
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${pageUrl}#faq`,
  mainEntity: state.faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
```

Place the FAQ section before the final CTA section, following the existing
`ScrollReveal` + section styling already used on the page.

### A3. Internal cross-linking

Add an "Other states we serve" section to `[slug].astro`: a compact grid that
maps over `STATES.filter((s) => s.slug !== state.slug)` linking to
`/states/{slug}/`, plus a link back to `/states/`. Styled to match the existing
chip/card patterns. Automatically includes new states added in Phase C.

### A4. Conversion-attribution loop

**State CTAs (`[slug].astro`):**
- Change CTA hrefs to `/assessment?source=state-{slug}`.
- Fire `trackEvent('cta_click', { cta: 'assessment', source: 'state-{slug}', state: state.name })`
  on click. Implementation: a tiny dependency-free inline `<script>` that
  attaches a listener to elements carrying a `data-track-cta` attribute and
  reads `data-*` payload — or a minimal shared client helper. No new npm deps.

**Assessment page (`assessment.astro`):**
- Read `source` (and derive `state`) from `Astro.url.searchParams`.
- Pass a new `source?: string` prop into `<InquiryForm>`.

**InquiryForm (`src/islands/InquiryForm.tsx`):**
- Accept `source?: string` prop.
- Include `source` in the POST body to `/inquiries`.
- Add `source` to the existing `trackEvent('inquiry_submitted', …)` props.

This closes the attribution loop: **state page → assessment → submit**, fully
measurable in GA4.

### A5. Tests

The repo uses vitest (`vitest.config.ts`, existing `src/islands/__tests__`).
Add/extend tests:
- `states.ts` data integrity: every state has ≥3 FAQs; slugs unique; abbrs
  unique and 2 chars.
- `InquiryForm`: `source` prop flows into the submit payload and the
  `inquiry_submitted` event.
- Build assertion / snapshot that a state page emits a valid `FAQPage` block
  (can be a lightweight string check on rendered output if full SSR test is
  heavy).

## Phase B — Sitewide Conversion Instrumentation

Generalize the Phase-A CTA pattern:

- Extract a small reusable tracked-CTA mechanism (the `data-track-cta` +
  inline-script approach from A4, promoted to a shared snippet/component so
  every page uses the same code path). Keep it dependency-free and SSR-safe.
- Apply to primary CTAs on: home, services, pricing, why-cps, contact, ROI
  calculator, plus the header and footer CTAs.
- Standardize the event as `cta_click` with `{ cta, source, locale }`.
- ROI calculator (`src/islands/ROICalculator.tsx`): add a `roi_calculated`
  event when results render and a `roi_cta_click` event on its result CTA, so
  calculator engagement and its conversion are measurable.
- Apply equivalently to the Spanish (`/es/…`) mirrors of these pages so
  attribution works across locales.

## Phase C — 50-State Coverage

Append the remaining 40 states to the `STATES` array in `src/data/states.ts`.
Each entry includes all `StateData` fields, including Phase-A `faqs`. Content
authored to be accurate and distinct:

- `medicaidProgram`: the official program brand (e.g. "TennCare" for TN,
  "SoonerCare" for OK, "Apple Health" for WA, "Husky Health" for CT, etc.).
- `managedCareDominant`: correct per state.
- `intro`, `keyPayers`, `regulatoryNote`, `faqs`: state-specific, varied copy —
  deliberately distinct per state to avoid templated-doorway-page risk.

No code changes required beyond data — the dynamic route, Service/Breadcrumb/
FAQPage schema, cross-linking grid, sitemap entry, and tracked CTAs all derive
from `STATES`. Re-run `npm run build` to generate the 40 new static pages.

Phase-C tests: extend the `states.ts` data-integrity test to assert all 50
entries are present and well-formed (unique slugs/abbrs, required fields
non-empty, ≥3 FAQs each).

## Out of Scope (YAGNI)

- Spanish (`/es/`) translations of state landing pages (state pages are
  English-only today; translating 50 × content is a separate program).
- `LocalBusiness`/`ProfessionalService` schema with physical address (CPS
  serves all 50 states from a single Utah HQ; state-level `Service.areaServed`
  is the right model, not per-state physical locations).
- `AggregateRating`/`Review` schema (requires real, verifiable review data).
- Net-new pages beyond state landing pages.

## Risks & Mitigations

- **Doorway-page penalty (Phase C):** Mitigated by Phase A depth (FAQs,
  cross-linking) and deliberately distinct per-state copy. Depth-before-breadth
  sequencing is the core mitigation.
- **FAQ content accuracy:** Regulatory/program facts authored conservatively;
  flag any state where program structure is uncertain for human review before
  merge.
- **Analytics double-counting:** Standardize on a single `cta_click` event name
  and a single attach mechanism in Phase B to avoid overlapping listeners.

## Sequencing

A → B → C, each shippable independently. A proves the attribution loop and
content pattern; B scales the instrumentation; C scales the content once the
pattern is proven safe.
