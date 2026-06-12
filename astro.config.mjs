import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cpshealthcarebilling.com',
  output: 'static',
  // English stays at root (/, /pricing, ...); Spanish nests under /es/.
  // prefixDefaultLocale=false keeps the existing English URLs unchanged so
  // every SEO/canonical URL we shipped in PR #1 remains stable.
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Pair each English page with its Spanish mirror via xhtml:link, so
      // Google groups EN/ES variants instead of treating them as duplicates.
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-US',
        },
      },
      // changefreq + priority give Google a crawl-prioritization hint.
      // Marketing pages change rarely; blog posts change a bit more often.
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname;
        item.lastmod = new Date().toISOString();
        if (path === '/' || path === '/es/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        } else if (path.includes('/blog/') && path !== '/blog/' && path !== '/es/blog/') {
          item.changefreq = 'monthly';
          item.priority = 0.6;
        } else if (path.endsWith('/blog/')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else if (path.endsWith('/privacy/') || path.endsWith('/terms/') || path.endsWith('/404/')) {
          item.changefreq = 'yearly';
          item.priority = 0.2;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
