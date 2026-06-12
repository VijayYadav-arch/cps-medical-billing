/**
 * Walks `dist/` and asserts every internal href resolves to either:
 *   - a built page (e.g. /blog/some-slug)
 *   - an allowed external prefix (delegated to cps-spa / cps-dotnet via Front Door)
 *   - a static asset under /images, /illustrations, /sitemap*, /robots.txt, /favicon.*, etc.
 *
 * Fails the build (exit 1) if any internal href dangles.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');

const ALLOWED_PREFIXES = ['/api/', '/login', '/admin', '/clinician', '/family', '/portal/', '/spa/', '/inquiry'];
const STATIC_PREFIXES = ['/images/', '/illustrations/', '/sitemap', '/_astro/'];
const STATIC_FILES = new Set(['/robots.txt', '/favicon.svg', '/apple-touch-icon.svg', '/manifest.json', '/logo.svg', '/logo-icon.svg', '/logo-white.svg']);

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

function normalize(href: string): string {
  return href.replace(/\?.*$/, '').replace(/#.*$/, '').replace(/\/$/, '') || '/';
}

async function collectInternalPages(): Promise<Set<string>> {
  const pages = new Set<string>();
  for await (const file of walk(DIST)) {
    const rel = '/' + file
      .substring(DIST.length + 1)
      .replace(/\\/g, '/')
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '');
    pages.add(normalize(rel));
  }
  return pages;
}

async function checkFile(file: string, pages: Set<string>): Promise<string[]> {
  const html = await readFile(file, 'utf8');
  const broken: string[] = [];
  const linkRegex = /href="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1];
    if (!href || href.startsWith('#')) continue;
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (ALLOWED_PREFIXES.some((p) => href.startsWith(p))) continue;
    if (STATIC_PREFIXES.some((p) => href.startsWith(p))) continue;
    if (STATIC_FILES.has(href)) continue;
    const normalized = normalize(href);
    if (!pages.has(normalized)) broken.push(`${file.substring(DIST.length + 1)} -> ${href}`);
  }
  return broken;
}

async function main(): Promise<void> {
  const pages = await collectInternalPages();
  console.log(`Found ${pages.size} pages in dist/`);
  const broken: string[] = [];
  for await (const file of walk(DIST)) {
    broken.push(...await checkFile(file, pages));
  }
  if (broken.length > 0) {
    console.error(`\n${broken.length} broken internal links:`);
    broken.forEach((b) => console.error(`  ${b}`));
    process.exit(1);
  }
  console.log('All internal links resolve.');
}

main().catch((e) => { console.error(e); process.exit(1); });
