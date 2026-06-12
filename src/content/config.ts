import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    author: z.string().default('CPS Team'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    hero: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Locale defaults to 'en'. Spanish articles set `locale: es` so the
    // blog index pages can filter their listings. The slug stays
    // identical between locales (e.g. 5-common-hospice-billing-errors)
    // but the file lives at a locale-specific path
    // (blog/es/5-common-hospice-billing-errors.mdx) so the article URLs
    // become /es/blog/{slug} via the per-locale dynamic route.
    locale: z.enum(['en', 'es']).default('en'),
    /** When set, links to the English original. Used on Spanish translations. */
    translationOfSlug: z.string().optional(),
  }),
});

export const collections = { blog };
