# State-Page SEO Depth + Conversion Attribution + 50-State Coverage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the `cps-medical-billing` Astro site's organic search and conversion by adding per-state FAQ content + `FAQPage` schema, internal cross-linking, an end-to-end CTA→assessment→submit attribution loop, sitewide CTA instrumentation, and landing pages for all 50 states.

**Architecture:** All state pages derive from a single `STATES` data array (`src/data/states.ts`) rendered by the dynamic route `src/pages/states/[slug].astro`. We extend the data model with FAQs, add a dependency-free delegated click-tracking helper imported once in `BaseLayout.astro`, thread a `source` param through the assessment funnel into `InquiryForm`, then scale content to 50 states purely by appending data entries.

**Tech Stack:** Astro 5 (static output), React islands (`client:load`), Tailwind v4, TypeScript, Vitest + Testing Library (jsdom), axios (`apiClient`), GA4 + Azure App Insights via `trackEvent`.

**Spec:** `docs/superpowers/specs/2026-06-12-state-seo-conversion-design.md`

**Branch:** `feat/state-seo-conversion` (already created; spec already committed)

**Conventions:**
- Run a single test file: `npx vitest run src/path/to/file.test.ts`
- Run all tests: `npm test`
- Typecheck + build: `npm run build` (runs `astro check && astro build`)
- Commit messages end with the Co-Authored-By trailer used on the spec commit.

---

## Phase A — State-Page Power-Up

### Task A1: Extend `StateData` with `faqs` + author FAQs for the 10 existing states

**Files:**
- Modify: `src/data/states.ts` (interface + all 10 entries)
- Create: `src/data/states.test.ts`

- [ ] **Step 1: Write the failing data-integrity test**

Create `src/data/states.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { STATES } from '@/data/states';

describe('STATES data integrity', () => {
  it('has at least the 10 launch states', () => {
    expect(STATES.length).toBeGreaterThanOrEqual(10);
  });

  it('has unique slugs', () => {
    const slugs = STATES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has unique 2-letter uppercase abbreviations', () => {
    const abbrs = STATES.map((s) => s.abbr);
    expect(new Set(abbrs).size).toBe(abbrs.length);
    for (const abbr of abbrs) {
      expect(abbr).toMatch(/^[A-Z]{2}$/);
    }
  });

  it('every state has required non-empty copy fields', () => {
    for (const s of STATES) {
      expect(s.slug).toMatch(/^[a-z-]+$/);
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.medicaidProgram.length).toBeGreaterThan(0);
      expect(s.intro.length).toBeGreaterThan(40);
      expect(s.regulatoryNote.length).toBeGreaterThan(40);
      expect(s.keyPayers.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every state has at least 3 FAQs with non-empty question and answer', () => {
    for (const s of STATES) {
      expect(s.faqs.length).toBeGreaterThanOrEqual(3);
      for (const f of s.faqs) {
        expect(f.q.trim().length).toBeGreaterThan(0);
        expect(f.a.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/states.test.ts`
Expected: FAIL — `faqs` does not exist on the existing entries (TypeScript) / `s.faqs.length` reads `undefined`.

- [ ] **Step 3: Add the `faqs` field to the interface**

In `src/data/states.ts`, add to the `StateData` interface (after `regulatoryNote`):

```ts
  /**
   * 3-4 state-specific Q&As. Powers the on-page FAQ section and the
   * FAQPage JSON-LD block. Keep answers state-specific (reference the
   * program name, MCOs, or regulatory note) so each set is distinct.
   */
  faqs: { q: string; a: string }[];
```

- [ ] **Step 4: Author FAQs for all 10 existing states**

Add a `faqs` array to each of the 10 existing entries. Use state-specific facts already present in each entry (`medicaidProgram`, `keyPayers`, `regulatoryNote`). Example for Utah (author equivalents for texas, california, florida, new-york, arizona, north-carolina, georgia, pennsylvania, illinois):

```ts
    faqs: [
      {
        q: 'Does CPS handle Utah Medicaid claims for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Utah Medicaid claims for hospice, home-health, and palliative-care providers, including the coordination-of-benefits sequencing required for dually-eligible Medicare/Medicaid beneficiaries.',
      },
      {
        q: 'How quickly must a Utah hospice submit a Notice of Election?',
        a: 'Medicare requires the hospice Notice of Election (NOE) within 5 calendar days of admission. CPS batches NOEs daily so Utah agencies avoid the payment reductions that follow a late filing.',
      },
      {
        q: 'Which Utah payers does CPS work with?',
        a: 'CPS works with Utah Medicaid, SelectHealth, Regence BlueCross, University of Utah Health Plans, Molina Healthcare of Utah, Medicare, and every commercial carrier a Utah practice contracts with.',
      },
      {
        q: 'How do we get started with CPS in Utah?',
        a: 'Request a free assessment. CPS reviews your current revenue cycle, identifies recoverable revenue, and shows you exactly what a Utah hospice or home-health agency can expect — at no cost and no obligation.',
      },
    ],
```

Author the remaining 9 states' FAQs the same way, each referencing that state's program name, MCOs, and the regulatory fact already in its entry. Vary the wording — do not copy Utah's answers verbatim into other states.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/data/states.test.ts`
Expected: PASS (all 5 specs green).

- [ ] **Step 6: Commit**

```bash
git add src/data/states.ts src/data/states.test.ts
git commit -m "feat(states): add per-state FAQ data + data-integrity test"
```

---

### Task A2: Render the FAQ section + `FAQPage` JSON-LD on state pages

**Files:**
- Modify: `src/pages/states/[slug].astro` (frontmatter: add `faqJsonLd`; body: add FAQ section before the CTA section; pass `faqJsonLd` into `extraJsonLd`)

- [ ] **Step 1: Build the `FAQPage` JSON-LD in the frontmatter**

In `src/pages/states/[slug].astro`, after the `breadcrumbJsonLd` declaration, add:

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

- [ ] **Step 2: Pass it into `extraJsonLd`**

Change the `<BaseLayout … extraJsonLd={[serviceJsonLd, breadcrumbJsonLd]}>` opening tag to:

```astro
  extraJsonLd={[serviceJsonLd, breadcrumbJsonLd, faqJsonLd]}
```

- [ ] **Step 3: Add the FAQ section to the page body**

Insert this section immediately before the `{/* ===== CTA ===== */}` section:

```astro
  {/* ===== FAQ ===== */}
  <section class="py-20 bg-cream">
    <div class="max-w-3xl mx-auto px-6 lg:px-8">
      <ScrollReveal>
        <div class="text-center mb-10">
          <span class="text-teal-600 text-sm font-semibold uppercase tracking-wider">
            {state.name} billing questions
          </span>
          <h2 class="font-serif text-3xl sm:text-4xl text-navy-900 mt-3 mb-4">
            Frequently asked questions
          </h2>
          <div class="section-line mx-auto" />
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div class="space-y-4">
          {state.faqs.map((faq) => (
            <details class="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex items-center justify-between cursor-pointer font-serif text-lg text-navy-900">
                <span>{faq.q}</span>
                <svg class="w-5 h-5 text-teal-600 flex-shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <p class="text-slate-600 leading-relaxed mt-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
```

(Native `<details>` keeps the answer text in the DOM for crawlers even when collapsed; no JS needed.)

- [ ] **Step 4: Verify the build typechecks and renders**

Run: `npm run build`
Expected: `astro check` passes (0 errors) and the build emits `dist/states/<slug>/index.html` for all 10 states. Confirm one page contains `"@type":"FAQPage"`:

Run: `npx tsx -e "const fs=require('fs');const h=fs.readFileSync('dist/states/utah/index.html','utf8');console.log(h.includes('\"FAQPage\"')?'FAQPage OK':'MISSING')"`
Expected: `FAQPage OK`

- [ ] **Step 5: Commit**

```bash
git add src/pages/states/[slug].astro
git commit -m "feat(states): render FAQ section + FAQPage JSON-LD on state pages"
```

---

### Task A3: Add the "Other states we serve" cross-link section

**Files:**
- Modify: `src/pages/states/[slug].astro` (frontmatter: compute `otherStates`; body: add cross-link section)

- [ ] **Step 1: Compute the sibling list in the frontmatter**

Add after the `faqJsonLd` declaration:

```ts
// All other states, alphabetical by name, for the cross-link grid.
const otherStates = STATES
  .filter((s) => s.slug !== state.slug)
  .sort((a, b) => a.name.localeCompare(b.name));
```

- [ ] **Step 2: Add the cross-link section to the body**

Insert immediately before the `{/* ===== CTA ===== */}` section (after the FAQ section from A2):

```astro
  {/* ===== OTHER STATES ===== */}
  <section class="py-20 bg-white">
    <div class="max-w-5xl mx-auto px-6 lg:px-8">
      <ScrollReveal>
        <div class="text-center mb-10">
          <span class="text-teal-600 text-sm font-semibold uppercase tracking-wider">
            Nationwide coverage
          </span>
          <h2 class="font-serif text-3xl sm:text-4xl text-navy-900 mt-3 mb-4">
            Other states we serve
          </h2>
          <div class="section-line mx-auto" />
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div class="flex flex-wrap justify-center gap-3">
          {otherStates.map((s) => (
            <a
              href={`/states/${s.slug}/`}
              class="inline-flex items-center px-5 py-2.5 rounded-full bg-cream border border-slate-200 text-navy-900 font-medium text-sm hover:border-teal-400 hover:text-teal-600 transition-colors"
            >
              {s.name}
            </a>
          ))}
        </div>
        <p class="text-center mt-8">
          <a href="/states/" class="text-teal-600 font-semibold hover:text-teal-700">
            View all states we serve &rarr;
          </a>
        </p>
      </ScrollReveal>
    </div>
  </section>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: passes; `dist/states/utah/index.html` contains links to `/states/texas/` and `/states/`.

Run: `npx tsx -e "const fs=require('fs');const h=fs.readFileSync('dist/states/utah/index.html','utf8');console.log(h.includes('/states/texas/')&&h.includes('href=\"/states/\"')?'XLINK OK':'MISSING')"`
Expected: `XLINK OK`

- [ ] **Step 4: Commit**

```bash
git add src/pages/states/[slug].astro
git commit -m "feat(states): add cross-link grid to sibling state pages + /states"
```

---

### Task A4: Dependency-free CTA click-tracking helper

**Files:**
- Create: `src/lib/cta-tracking.ts`
- Create: `src/lib/cta-tracking.test.ts`
- Modify: `src/layouts/BaseLayout.astro` (import the helper once via a bundled `<script>`)

- [ ] **Step 1: Write the failing test for the payload builder**

Create `src/lib/cta-tracking.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { ctaEventProps } from '@/lib/cta-tracking';

function el(attrs: Record<string, string>): HTMLElement {
  const a = document.createElement('a');
  for (const [k, v] of Object.entries(attrs)) a.setAttribute(k, v);
  return a;
}

describe('ctaEventProps', () => {
  it('reads cta + source from data attributes and adds locale', () => {
    const props = ctaEventProps(
      el({ 'data-track-cta': 'assessment', 'data-cta-source': 'state-utah' }),
      'en'
    );
    expect(props).toEqual({ cta: 'assessment', source: 'state-utah', locale: 'en' });
  });

  it('includes the optional state attribute when present', () => {
    const props = ctaEventProps(
      el({ 'data-track-cta': 'assessment', 'data-cta-source': 'state-texas', 'data-cta-state': 'Texas' }),
      'es'
    );
    expect(props).toEqual({ cta: 'assessment', source: 'state-texas', state: 'Texas', locale: 'es' });
  });

  it('falls back to "unknown" source when not provided', () => {
    const props = ctaEventProps(el({ 'data-track-cta': 'contact' }), 'en');
    expect(props).toEqual({ cta: 'contact', source: 'unknown', locale: 'en' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cta-tracking.test.ts`
Expected: FAIL — module `@/lib/cta-tracking` not found.

- [ ] **Step 3: Implement the helper**

Create `src/lib/cta-tracking.ts`:

```ts
/**
 * Dependency-free delegated CTA click tracking. A single listener attached
 * in BaseLayout catches clicks on any element carrying `data-track-cta` and
 * fires a standardized `cta_click` event through the shared analytics helper.
 *
 * Markup contract:
 *   <a href="..." data-track-cta="assessment"
 *      data-cta-source="state-utah" data-cta-state="Utah">...</a>
 *
 * `data-cta-state` is optional (only state pages set it). `data-cta-source`
 * defaults to "unknown" so a missing attribute never throws.
 */
import { trackEvent } from './analytics';

type Locale = 'en' | 'es';

export function ctaEventProps(el: HTMLElement, locale: Locale): Record<string, unknown> {
  const props: Record<string, unknown> = {
    cta: el.dataset.trackCta,
    source: el.dataset.ctaSource ?? 'unknown',
    locale,
  };
  if (el.dataset.ctaState) props.state = el.dataset.ctaState;
  return props;
}

function currentLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang.startsWith('es') ? 'es' : 'en';
}

export function initCtaTracking(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track-cta]');
    if (!target) return;
    trackEvent('cta_click', ctaEventProps(target, currentLocale()));
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/cta-tracking.test.ts`
Expected: PASS (3 specs).

- [ ] **Step 5: Wire the helper into BaseLayout**

In `src/layouts/BaseLayout.astro`, add a bundled module script just before the closing `</body>` tag (after `<Footer />`). Astro bundles `<script>` imports automatically:

```astro
    <script>
      import { initCtaTracking } from '@/lib/cta-tracking';
      initCtaTracking();
    </script>
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: passes; the bundled script is emitted and referenced in `dist/index.html`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/cta-tracking.ts src/lib/cta-tracking.test.ts src/layouts/BaseLayout.astro
git commit -m "feat(analytics): dependency-free delegated cta_click tracking helper"
```

---

### Task A5: Wire state-page CTAs to the attribution loop

**Files:**
- Modify: `src/pages/states/[slug].astro` (CTA `<a>` tags: add `?source=` href + `data-track-cta` attributes)

- [ ] **Step 1: Update the assessment CTA in the CTA section**

In the `{/* ===== CTA ===== */}` section, change the assessment link from:

```astro
        <a href="/assessment" class="btn-primary">
```

to:

```astro
        <a
          href={`/assessment?source=state-${state.slug}`}
          data-track-cta="assessment"
          data-cta-source={`state-${state.slug}`}
          data-cta-state={state.name}
          class="btn-primary"
        >
```

- [ ] **Step 2: Tag the phone CTA too**

Change the `tel:` link in the same section from:

```astro
        <a href="tel:801-341-9304" class="btn-outline-dark text-white border-white hover:bg-white hover:text-navy-900">
```

to:

```astro
        <a
          href="tel:801-341-9304"
          data-track-cta="call"
          data-cta-source={`state-${state.slug}`}
          data-cta-state={state.name}
          class="btn-outline-dark text-white border-white hover:bg-white hover:text-navy-900"
        >
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: passes; `dist/states/utah/index.html` contains `href="/assessment?source=state-utah"` and `data-track-cta="assessment"`.

Run: `npx tsx -e "const fs=require('fs');const h=fs.readFileSync('dist/states/utah/index.html','utf8');console.log(h.includes('/assessment?source=state-utah')&&h.includes('data-track-cta=\"assessment\"')?'CTA OK':'MISSING')"`
Expected: `CTA OK`

- [ ] **Step 4: Commit**

```bash
git add src/pages/states/[slug].astro
git commit -m "feat(states): attribute state CTAs with source + cta_click tracking"
```

---

### Task A6: Thread `source` through the assessment funnel into `InquiryForm`

**Files:**
- Modify: `src/islands/InquiryForm.tsx` (add `source` prop → POST body + `inquiry_submitted` event)
- Modify: `src/islands/__tests__/InquiryForm.test.tsx` (add a test for source passthrough)
- Modify: `src/pages/assessment.astro` (read `source` from query, pass to `InquiryForm`)

- [ ] **Step 1: Write the failing test for source passthrough**

In `src/islands/__tests__/InquiryForm.test.tsx`, add (import `trackEvent` mock reference at top alongside the existing `apiClient` import):

```ts
import { trackEvent } from '@/lib/analytics';
```

Then add this test inside the `describe('InquiryForm', …)` block:

```ts
  it('includes the source prop in the POST body and the inquiry_submitted event', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 200, data: {} } as never);
    render(<InquiryForm source="state-utah" />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/service needed/i), { target: { value: 'hospice-billing' } });
    fireEvent.change(screen.getByLabelText(/tell us about your needs/i), { target: { value: 'Hello.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    await waitFor(() => {
      expect(screen.getByText(/inquiry received/i)).toBeInTheDocument();
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/inquiries',
      expect.objectContaining({ source: 'state-utah' })
    );
    expect(vi.mocked(trackEvent)).toHaveBeenCalledWith(
      'inquiry_submitted',
      expect.objectContaining({ source: 'state-utah', service_type: 'hospice-billing', locale: 'en' })
    );
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/islands/__tests__/InquiryForm.test.tsx`
Expected: FAIL — `source` not in POST body / event (prop ignored).

- [ ] **Step 3: Add the `source` prop to `InquiryForm`**

In `src/islands/InquiryForm.tsx`:

3a. Add to `InquiryFormProps`:

```ts
  /** Attribution source (e.g. "state-utah") carried into the submit payload + analytics. */
  source?: string;
```

3b. Add `source` to the destructured props in the function signature:

```ts
export function InquiryForm({
  locale = 'en',
  title,
  submitLabel,
  messageLabel,
  messagePlaceholder,
  serviceOptions,
  className = '',
  source,
}: InquiryFormProps) {
```

3c. In `handleSubmit`, change the POST + track calls:

```ts
      await apiClient.post('/inquiries', { ...form, source });
      setSubmitted(true);
      trackEvent('inquiry_submitted', { service_type: form.serviceType, locale, source });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/islands/__tests__/InquiryForm.test.tsx`
Expected: PASS (all existing tests + the new one).

- [ ] **Step 5: Read `source` in the assessment page and pass it down**

In `src/pages/assessment.astro`, add to the end of the frontmatter (before the closing `---`):

```ts
const source = Astro.url.searchParams.get('source') ?? undefined;
```

Then update the `<InquiryForm … />` usage to pass it:

```astro
            <InquiryForm
              client:load
              title="Practice Details"
              submitLabel="Request Free Assessment"
              messageLabel="Tell us about your current billing challenges"
              messagePlaceholder="Describe your practice size, current billing setup, and any specific pain points..."
              source={source}
            />
```

Note: `assessment.astro` is statically rendered; `Astro.url.searchParams` is read at request time in the static HTML only if prerendered with query awareness. Because this is a static site, the query string is read client-side by the island instead. To keep behavior correct on a static host, ALSO have the island fall back to `window.location` — see Step 6.

- [ ] **Step 6: Make the island read the query string client-side (static-host correctness)**

In `src/islands/InquiryForm.tsx`, compute an effective source that prefers the prop but falls back to the URL query at mount. Replace the direct use of `source` in `handleSubmit` with a resolved value:

```ts
  const resolvedSource =
    source ??
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('source') ?? undefined
      : undefined);
```

Place this right after the `const s = stringsFor(locale);` line. Then use `resolvedSource` in `handleSubmit`:

```ts
      await apiClient.post('/inquiries', { ...form, source: resolvedSource });
      setSubmitted(true);
      trackEvent('inquiry_submitted', { service_type: form.serviceType, locale, source: resolvedSource });
```

Update the Step-1 test to keep passing (it passes `source` as a prop, so `resolvedSource === 'state-utah'` — no test change needed).

- [ ] **Step 7: Run tests + build**

Run: `npx vitest run src/islands/__tests__/InquiryForm.test.tsx`
Expected: PASS.

Run: `npm run build`
Expected: passes.

- [ ] **Step 8: Commit**

```bash
git add src/islands/InquiryForm.tsx src/islands/__tests__/InquiryForm.test.tsx src/pages/assessment.astro
git commit -m "feat(assessment): thread attribution source into InquiryForm submit + analytics"
```

---

### Task A7: Phase A verification

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: all suites PASS.

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: `astro check` 0 errors; build succeeds; `dist/states/<slug>/index.html` exists for all 10 states with FAQPage, cross-links, and attributed CTAs.

- [ ] **Step 3: Manual smoke (optional, dev server)**

Run: `npm run dev`, open `http://localhost:4321/states/utah/`, confirm: FAQ accordion expands, "Other states" links work, the assessment button points to `/assessment?source=state-utah`, and the dev console logs `[trackEvent] cta_click {...}` on click (since no GA4 key in dev).

---

## Phase B — Sitewide Conversion Instrumentation

The tracking mechanism already exists (Task A4). Phase B applies the `data-track-cta` markup contract to primary CTAs across the rest of the site (EN + ES) and adds ROI-calculator engagement events.

### Task B1: Instrument primary CTAs on core marketing pages (EN + ES)

**Files (modify — add `data-track-cta` + `data-cta-source` to the primary/hero CTA `<a>` on each):**
- `src/pages/index.astro` and `src/pages/es/index.astro` (`source: "home"`)
- `src/pages/services.astro` and `src/pages/es/services.astro` (`source: "services"`)
- `src/pages/pricing.astro` and `src/pages/es/pricing.astro` (`source: "pricing"`)
- `src/pages/why-cps.astro` and `src/pages/es/why-cps.astro` (`source: "why-cps"`)
- `src/pages/contact.astro` and `src/pages/es/contact.astro` (`source: "contact"`)

- [ ] **Step 1: For each page above, tag the primary assessment/contact CTA**

Find each page's main hero CTA (the `<a class="btn-primary" href="/assessment">` or `/es/assessment`, or the contact CTA). Add the two attributes. Example (EN home):

```astro
        <a href="/assessment" data-track-cta="assessment" data-cta-source="home" class="btn-primary">
```

Example (ES home — note the Spanish destination is also `/assessment`, the funnel is shared):

```astro
        <a href="/assessment" data-track-cta="assessment" data-cta-source="home" class="btn-primary">
```

Apply the matching `source` value per the file list above. Tag at most the ONE primary CTA per page (avoid double-counting secondary links).

- [ ] **Step 2: Verify build + spot-check attributes**

Run: `npm run build`
Expected: passes.

Run: `npx tsx -e "const fs=require('fs');for(const p of ['dist/index.html','dist/services/index.html','dist/pricing/index.html']){const h=fs.readFileSync(p,'utf8');console.log(p, h.includes('data-track-cta=\"assessment\"')||h.includes('data-track-cta=\"contact\"')?'OK':'MISSING')}"`
Expected: each line prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages
git commit -m "feat(analytics): instrument primary CTAs on core pages (EN+ES)"
```

---

### Task B2: Instrument header + footer CTAs

**Files:**
- Modify: `src/components/Header.astro` (the nav "Free Assessment" CTA → `source: "header"`)
- Modify: `src/components/Footer.astro` (any primary CTA → `source: "footer"`)

- [ ] **Step 1: Tag the header CTA**

In `src/components/Header.astro`, find the primary nav CTA (the Free Assessment button) and add:

```astro
data-track-cta="assessment" data-cta-source="header"
```

- [ ] **Step 2: Tag the footer CTA (if present)**

In `src/components/Footer.astro`, if there is a primary assessment/contact CTA link, add:

```astro
data-track-cta="assessment" data-cta-source="footer"
```

If the footer has no such CTA (only nav links), skip — do NOT tag plain footer navigation links.

- [ ] **Step 3: Verify build + commit**

Run: `npm run build`
Expected: passes; `dist/index.html` contains `data-cta-source="header"`.

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat(analytics): instrument header + footer assessment CTAs"
```

---

### Task B3: ROI calculator engagement events

**Files:**
- Modify: `src/islands/ROICalculator.tsx` (fire `roi_calculated` when results render; `roi_cta_click` on the result CTA)
- Modify: `src/islands/__tests__/ROICalculator.test.tsx` (assert the events fire)

- [ ] **Step 1: Read the calculator to find the calculate handler + result CTA**

Run: `sed -n '1,80p' src/islands/ROICalculator.tsx` (or open it) to locate (a) where results become visible / the calculate action, and (b) the result CTA link to `/assessment`.

- [ ] **Step 2: Write the failing test**

In `src/islands/__tests__/ROICalculator.test.tsx`, ensure the analytics mock exists at the top:

```ts
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
import { trackEvent } from '@/lib/analytics';
```

Add a test that fills the inputs, triggers the calculate action (match the existing test's interaction pattern in this file), and asserts:

```ts
  it('fires roi_calculated when results are shown', async () => {
    // ...render + fill inputs + click calculate exactly as the existing
    // "calculates" test in this file does...
    await waitFor(() => {
      expect(vi.mocked(trackEvent)).toHaveBeenCalledWith(
        'roi_calculated',
        expect.objectContaining({ locale: expect.any(String) })
      );
    });
  });
```

(Mirror the input-filling steps from the existing passing test in the same file so the calculate path is exercised correctly.)

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/islands/__tests__/ROICalculator.test.tsx`
Expected: FAIL — `roi_calculated` never fired.

- [ ] **Step 4: Implement the events**

In `src/islands/ROICalculator.tsx`:
- Import the helper if not already: `import { trackEvent } from '@/lib/analytics';`
- In the function that computes/show results, after results are set, call:

```ts
trackEvent('roi_calculated', { locale });
```

(If the component has no `locale` prop, use the value it already uses for copy; if none, pass `{}`. Match the existing prop surface — do not invent a `locale` prop if the component is locale-agnostic; in that case use `trackEvent('roi_calculated', {})` and adjust the test's `objectContaining` to `{}`.)

- On the result CTA `<a>` to `/assessment`, add the standard tracking attributes so the global listener catches it:

```tsx
data-track-cta="assessment" data-cta-source="roi-calculator"
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/islands/__tests__/ROICalculator.test.tsx`
Expected: PASS.

- [ ] **Step 6: Build + commit**

Run: `npm run build`
Expected: passes.

```bash
git add src/islands/ROICalculator.tsx src/islands/__tests__/ROICalculator.test.tsx
git commit -m "feat(analytics): ROI calculator roi_calculated + result-CTA tracking"
```

---

### Task B4: Phase B verification

- [ ] **Step 1:** Run `npm test` → all PASS.
- [ ] **Step 2:** Run `npm run build` → 0 check errors, build succeeds.

---

## Phase C — 50-State Coverage

Append the remaining 40 states to `STATES` in `src/data/states.ts`. No code changes — the dynamic route, Service/Breadcrumb/FAQPage schema, cross-link grid, sitemap, and tracked CTAs all derive from the data.

### Task C1: Tighten the data-integrity test to require all 50 states

**Files:**
- Modify: `src/data/states.test.ts`

- [ ] **Step 1: Change the count assertion to require 50**

Replace the first `it(...)` in `src/data/states.test.ts` with:

```ts
  it('covers all 50 states', () => {
    expect(STATES.length).toBe(50);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/states.test.ts`
Expected: FAIL — only 10 states present.

- [ ] **Step 3: Commit the failing-gate first**

```bash
git add src/data/states.test.ts
git commit -m "test(states): require all 50 states in data-integrity test"
```

---

### Task C2: Author the remaining 40 states

**Files:**
- Modify: `src/data/states.ts` (append 40 entries)

- [ ] **Step 1: Append 40 entries following the exact `StateData` shape**

For each state below, add an entry with: `slug` (lowercase kebab), `name`, `abbr`, `medicaidProgram` (use the program brand in the table), `managedCareDominant`, `intro` (2 sentences, state-specific), `keyPayers` (≥4 — start from the table's known MCOs, add Medicare + the state Medicaid + 1-2 commercial Blues), `regulatoryNote` (1 state-specific operational/regulatory fact), and `faqs` (≥3, state-specific per Task A1's pattern). **Vary the prose per state** — distinct intros, payers, and FAQ wording — to avoid templated-doorway-page risk.

Reference table (program name + managed-care status + anchor payers). These are the factual anchors; author the prose around them:

| slug | name | abbr | medicaidProgram | managedCare | anchor payers |
|------|------|------|-----------------|-------------|---------------|
| ohio | Ohio | OH | Ohio Medicaid (managed care) | true | CareSource, Buckeye, Molina, UnitedHealthcare CP, Anthem BCBS |
| michigan | Michigan | MI | Michigan Medicaid (Comprehensive Health Care) | true | Meridian, Molina, Blue Cross Complete, Priority Health, McLaren |
| new-jersey | New Jersey | NJ | NJ FamilyCare | true | Horizon NJ Health, Amerigroup, UnitedHealthcare CP, WellCare, Aetna |
| virginia | Virginia | VA | Cardinal Care | true | Anthem HealthKeepers, Aetna Better Health, Molina, Sentara, UnitedHealthcare |
| washington | Washington | WA | Apple Health | true | Molina, Coordinated Care, Community Health Plan of WA, UnitedHealthcare, Amerigroup |
| massachusetts | Massachusetts | MA | MassHealth | true | Tufts Health, WellSense, Mass General Brigham, BMC HealthNet, Fallon |
| tennessee | Tennessee | TN | TennCare | true | BlueCare (BCBS TN), Amerigroup, UnitedHealthcare CP, TennCare Select |
| indiana | Indiana | IN | Indiana Health Coverage (Hoosier Care) | true | Anthem, MDwise, MHS, CareSource, UnitedHealthcare |
| missouri | Missouri | MO | MO HealthNet | true | Home State Health, Healthy Blue, UnitedHealthcare CP |
| maryland | Maryland | MD | Maryland Medicaid (HealthChoice) | true | Priority Partners, Amerigroup, Maryland Physicians Care, CareFirst, UnitedHealthcare |
| wisconsin | Wisconsin | WI | BadgerCare Plus | true | UnitedHealthcare CP, Molina, Anthem, Quartz, Network Health |
| colorado | Colorado | CO | Health First Colorado | false | Denver Health, Rocky Mountain Health Plans, Colorado Access |
| minnesota | Minnesota | MN | Medical Assistance (MA) | true | UCare, Blue Plus, HealthPartners, Medica, Hennepin Health |
| south-carolina | South Carolina | SC | Healthy Connections | true | Select Health (First Choice), Molina, Humana Healthy Horizons, BlueChoice, Absolute Total Care |
| alabama | Alabama | AL | Alabama Medicaid | false | Alabama Medicaid Agency, BCBS of Alabama, Viva Health |
| louisiana | Louisiana | LA | Healthy Louisiana | true | Healthy Blue, AmeriHealth Caritas, Louisiana Healthcare Connections, Aetna, UnitedHealthcare |
| kentucky | Kentucky | KY | Kentucky Medicaid | true | Passport (Molina), Anthem, Aetna Better Health, Humana CareSource, WellCare |
| oregon | Oregon | OR | Oregon Health Plan | true | CareOregon, PacificSource, Trillium, Moda, Health Share of Oregon |
| oklahoma | Oklahoma | OK | SoonerCare | true | SoonerSelect (Aetna, Humana, Oklahoma Complete, BCBS OK) |
| connecticut | Connecticut | CT | HUSKY Health | false | Connecticut Medical Assistance Program, Anthem BCBS, ConnectiCare |
| iowa | Iowa | IA | IA Health Link | true | Amerigroup Iowa, Iowa Total Care, Molina |
| mississippi | Mississippi | MS | Mississippi Medicaid (MississippiCAN) | true | Magnolia Health, Molina, UnitedHealthcare CP |
| arkansas | Arkansas | AR | Arkansas Medicaid (ARHOME) | true | Arkansas Blue Cross, Empower, Summit, Ambetter |
| kansas | Kansas | KS | KanCare | true | Sunflower Health, Aetna Better Health, UnitedHealthcare CP, Healthy Blue |
| nevada | Nevada | NV | Nevada Medicaid (Nevada Check Up) | true | Anthem, Health Plan of Nevada, SilverSummit, Molina |
| new-mexico | New Mexico | NM | Turquoise Care | true | Presbyterian, BCBS NM, Molina, UnitedHealthcare CP |
| nebraska | Nebraska | NE | Heritage Health | true | Nebraska Total Care, Healthy Blue, UnitedHealthcare CP, Molina |
| west-virginia | West Virginia | WV | WV Medicaid (Mountain Health Trust) | true | The Health Plan, UniCare, Aetna Better Health |
| idaho | Idaho | ID | Idaho Medicaid | false | Idaho Department of Health and Welfare, Blue Cross of Idaho, PacificSource |
| hawaii | Hawaii | HI | Med-QUEST | true | HMSA, Kaiser, AlohaCare, UnitedHealthcare CP, Ohana Health Plan |
| maine | Maine | ME | MaineCare | false | MaineCare (DHHS), Anthem, Community Health Options |
| new-hampshire | New Hampshire | NH | NH Medicaid Care Management | true | AmeriHealth Caritas NH, NH Healthy Families, WellSense |
| montana | Montana | MT | Montana Medicaid (Healthy Montana Kids) | false | Montana DPHHS, BCBS of Montana, PacificSource |
| rhode-island | Rhode Island | RI | RIte Care | true | Neighborhood Health Plan of RI, UnitedHealthcare CP, Tufts |
| delaware | Delaware | DE | Delaware Medicaid (Diamond State Health Plan) | true | Highmark Health Options, AmeriHealth Caritas DE |
| south-dakota | South Dakota | SD | South Dakota Medicaid | false | SD DSS, Avera Health Plans, Sanford Health Plan |
| north-dakota | North Dakota | ND | North Dakota Medicaid | false | ND DHHS, Blue Cross Blue Shield of ND, Sanford Health Plan |
| alaska | Alaska | AK | Alaska Medicaid (DenaliCare) | false | Alaska DHSS, Premera Blue Cross, Moda Health |
| vermont | Vermont | VT | Green Mountain Care | false | Vermont DVHA, Blue Cross Blue Shield of Vermont, MVP |
| wyoming | Wyoming | WY | Wyoming Medicaid | false | Wyoming Department of Health, Blue Cross Blue Shield of Wyoming |

(That table is exactly 40 rows — the 40 states not already covered by the launch 10 of UT, TX, CA, FL, NY, AZ, NC, GA, PA, IL.)

- [ ] **Step 2: Run the data-integrity test**

Run: `npx vitest run src/data/states.test.ts`
Expected: PASS — `STATES.length === 50`, unique slugs/abbrs, every state has ≥3 FAQs and non-empty fields.

- [ ] **Step 3: Build all 50 pages**

Run: `npm run build`
Expected: `astro check` 0 errors; build emits `dist/states/<slug>/index.html` for all 50. Confirm a new state built with full schema:

Run: `npx tsx -e "const fs=require('fs');const h=fs.readFileSync('dist/states/ohio/index.html','utf8');console.log(h.includes('\"FAQPage\"')&&h.includes('/assessment?source=state-ohio')?'OHIO OK':'MISSING')"`
Expected: `OHIO OK`

- [ ] **Step 4: Confirm the cross-link grid scales**

Run: `npx tsx -e "const fs=require('fs');const h=fs.readFileSync('dist/states/utah/index.html','utf8');const n=(h.match(/href=\"\/states\/[a-z-]+\/\"/g)||[]).length;console.log('xlinks on utah:', n)"`
Expected: ~49 sibling links + the all-states link.

- [ ] **Step 5: Commit**

```bash
git add src/data/states.ts
git commit -m "feat(states): expand state landing pages to all 50 states"
```

---

### Task C3: Final verification

- [ ] **Step 1:** Run `npm test` → all PASS.
- [ ] **Step 2:** Run `npm run build` → 0 check errors; 50 state pages emitted.
- [ ] **Step 3:** Run `npm run check:links` (existing script) → no broken internal links introduced by the cross-link grid.
- [ ] **Step 4:** Run `npm run check:seo-parity` (existing script) → confirm no SEO regression.

---

## Self-Review Notes

- **Spec coverage:** Phase A (A1 FAQ data, A2 FAQPage schema + section, A3 cross-linking, A4 tracking helper, A5 state CTAs, A6 source passthrough) ✓; Phase B (B1 page CTAs, B2 header/footer, B3 ROI events) ✓; Phase C (C1 test gate, C2 40 states, C3 verify) ✓. Out-of-scope items (ES state translations, LocalBusiness, AggregateRating) intentionally excluded ✓.
- **Static-host correctness:** A6 Step 6 handles the static-site case where `Astro.url.searchParams` isn't available at request time by resolving `source` from `window.location` client-side in the island.
- **Type consistency:** `faqs: { q; a }[]`, `ctaEventProps(el, locale)`, `initCtaTracking()`, and `InquiryForm` `source` prop names are used identically across all tasks.
- **No double-counting:** Phase B tags exactly one primary CTA per page; the single delegated listener (A4) is the only tracking code path.
