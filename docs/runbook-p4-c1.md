# P4-C1 Runbook — cps-marketing

## What this is

Astro 5 static site hosting the CPS marketing surface (`/`, `/about`, `/pricing`, etc.). Deployed to Azure Static Web Apps. Cutover from cps Next.js handled by Azure Front Door route rules.

## Local dev

```bash
npm ci
npm run dev   # http://localhost:4321
npm run build # produces dist/
npm test      # vitest
npm run check:links
npm run check:seo-parity   # needs network to cps prod
```

## Routes shipped

17 marketing pages plus the blog:

| Route | Source |
|---|---|
| `/`, `/about`, `/pricing`, `/services`, `/why-cps`, `/case-studies`, `/developers`, `/faq`, `/marketplace`, `/privacy`, `/resources`, `/terms` | Static `.astro` pages, 1:1 ports |
| `/contact` | Static page + `InquiryForm` React island |
| `/roi-calculator` | Static page + `ROICalculator` React island |
| `/assessment` | Static page + `InquiryForm` React island |
| `/blog`, `/blog/<slug>` | Astro content collection (`src/content/blog/*.mdx`) |
| `/404` | Static 404 |

Plus auto-emitted `sitemap-index.xml`, `sitemap-0.xml`, `robots.txt`.

## React islands

4 islands at `src/islands/`:

- `InquiryForm.tsx` — used by `/contact` (`client:load`) and `/assessment` (`client:load`)
- `NewsletterForm.tsx` — used by `/blog` (`client:visible`)
- `ROICalculator.tsx` — used by `/roi-calculator` (`client:load`)

All islands POST to `/api/v2/<endpoint>` same-origin via Front Door (the cps-dotnet backend). `apiClient` and `trackEvent` live in `src/lib/api.ts`.

## Deploy

GitHub Actions builds and deploys on every push to `main`. Workflow: `.github/workflows/deploy.yml`. Pull requests get preview URLs.

**Required GitHub secret** (one-time ops setup):
```
AZURE_STATIC_WEB_APPS_API_TOKEN
```
The token is created when the Azure Static Web App resource is provisioned (via `az staticwebapp create` or the Azure portal).

## Cutover (Front Door rules)

After the cps-marketing PR is merged + deployed to the Static Web App:

1. Apply the Front Door rule update (cps-dotnet PR) routing the marketing URL set to the new origin.
2. Merge the cps Next.js redirect-stub PR so direct hits to cps Next.js bounce through Front Door to cps-marketing.

URL set routed to cps-marketing:
- `/`, `/about`, `/pricing`, `/services`, `/why-cps`, `/case-studies`, `/contact`, `/developers`, `/faq`, `/marketplace`, `/privacy`, `/resources`, `/roi-calculator`, `/assessment`, `/terms`
- `/blog`, `/blog/*`
- `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt`, `/images/*`

Everything else stays on its current Front Door target (cps-spa for `/spa/*`, cps-dotnet for `/api/*`, cps Next.js for the few non-marketing legacy routes).

## Sitemap URL change

cps Next.js served `/sitemap.xml`. cps-marketing emits `/sitemap-index.xml` + `/sitemap-0.xml` (Astro convention). The `robots.txt` Sitemap directive points at `/sitemap-index.xml`. If long-tail backlinks need to keep working, add a Front Door rewrite from `/sitemap.xml` to `/sitemap-index.xml`.

## Rollback

5-minute revert: `git revert <front-door-rules-pr>` in cps-dotnet, push, deploy infra. Front Door restores routing to cps Next.js.

1-day revert: also `git revert <redirect-stubs-pr>` in cps, push, deploy.

Long-term: delete the cps-marketing Static Web App via Azure portal. cps Next.js marketing pages remain until P4-C2.

## Blog content workflow

Blog posts are filesystem MDX files at `src/content/blog/*.mdx` with frontmatter validated by the Zod schema in `src/content/config.ts`. To add a new post: create a `.mdx` file with the required frontmatter (`title`, `publishedAt`, etc.), commit, push, Astro rebuilds at deploy time.

The one-shot Prisma → MDX migration (`scripts/migrate-blog.ts`) extracted the original 14 articles from cps's `prisma/seed-articles.js` + `seed-more-articles.js`. After P4-C2 retires the cps Prisma database, those source files go away — the migration is preserved in the MDX files.

## Known limitations

- **Azure resource creation is manual ops** — `az staticwebapp create` runs once outside this repo. The deploy workflow file ships with this PR, but it will fail until the `AZURE_STATIC_WEB_APPS_API_TOKEN` GitHub secret is set.
- **SEO parity script tolerates `canonical` drift** via the `IGNORED_KEYS_PER_ROUTE` map — pre-populate that during the cutover bake if you want intentional drift to not fail CI.
- **InquiryForm + NewsletterForm + ROICalculator all POST to `/api/v2/*`** on cps-dotnet via Front Door same-origin. When P4-C2 retires the rest of cps Next.js, double-check those endpoints stay reachable.
- **Newsletter signup pipeline not wired beyond the form POST.** The `/api/v2/newsletter` endpoint either needs to exist in cps-dotnet, or the form should be repointed at a third-party provider (Mailchimp, ConvertKit) in a follow-up.
- **`InquiryFormProps`** preserves all cps options (title, submitLabel, messageLabel, etc.) but the contact form on `/assessment` and `/contact` uses the defaults from the cps source. Verify the cps prod copy matches before cutover.
- **Image optimization not configured** — Astro's `astro:assets` pipeline would automatically resize/compress, but the initial port uses raw `<img>` tags for fidelity. Revisit after measuring real bundle size.
- **Tests** — Vitest covers the React islands (10 tests across InquiryForm + NewsletterForm + ROICalculator). Astro pages are smoke-tested by `astro check` + the build + `check:links` script. No Playwright/visual tests in this PR; that's a follow-up.
