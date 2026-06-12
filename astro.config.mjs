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
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
