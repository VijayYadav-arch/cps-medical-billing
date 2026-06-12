/**
 * SEO meta parity gate — fetches each marketing route from cps prod and
 * compares <title>, description, canonical, OG, twitter against the locally
 * built `dist/` output. Exit code 1 on any mismatch (CI gate before the
 * Front Door cutover PR merges).
 *
 * Per-route per-key exemptions: set entries in IGNORED_KEYS_PER_ROUTE for
 * keys where cps prod and cps-marketing legitimately differ (e.g. canonical
 * during the cutover window). Each exemption should carry a brief comment.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');
const CPS_BASE = process.env.CPS_BASE_URL ?? 'https://cpshealthcarebilling.com';

type MetaKey = 'title' | 'description' | 'canonical' | 'ogTitle' | 'ogDescription' | 'ogImage' | 'twitterCard';

interface MetaSet {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
}

const ROUTES = [
  '/', '/about', '/pricing', '/services', '/why-cps', '/case-studies',
  '/contact', '/developers', '/faq', '/marketplace', '/privacy',
  '/resources', '/terms', '/roi-calculator', '/assessment', '/blog',
];

// Per-route allowances. The cps-marketing canonical may differ from cps prod
// during the bake window; we still expect titles + descriptions + OG to match.
const IGNORED_KEYS_PER_ROUTE: Record<string, MetaKey[]> = {
  // example: '/blog': ['canonical'],
};

function extract(html: string): MetaSet {
  const get = (re: RegExp): string => (html.match(re)?.[1] ?? '').trim();
  return {
    title: get(/<title>([^<]*)<\/title>/),
    description: get(/<meta\s+name="description"\s+content="([^"]*)"/),
    canonical: get(/<link\s+rel="canonical"\s+href="([^"]*)"/),
    ogTitle: get(/<meta\s+property="og:title"\s+content="([^"]*)"/),
    ogDescription: get(/<meta\s+property="og:description"\s+content="([^"]*)"/),
    ogImage: get(/<meta\s+property="og:image"\s+content="([^"]*)"/),
    twitterCard: get(/<meta\s+name="twitter:card"\s+content="([^"]*)"/),
  };
}

async function fetchCps(path: string): Promise<MetaSet> {
  const r = await fetch(`${CPS_BASE}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return extract(await r.text());
}

async function loadLocal(path: string): Promise<MetaSet> {
  const file = path === '/'
    ? join(DIST, 'index.html')
    : join(DIST, path.replace(/^\//, ''), 'index.html');
  return extract(await readFile(file, 'utf8'));
}

async function main(): Promise<void> {
  const keys: MetaKey[] = ['title', 'description', 'canonical', 'ogTitle', 'ogDescription', 'ogImage', 'twitterCard'];
  const failures: string[] = [];

  for (const route of ROUTES) {
    let cps: MetaSet;
    let local: MetaSet;
    try {
      [cps, local] = await Promise.all([fetchCps(route), loadLocal(route)]);
    } catch (e) {
      failures.push(`${route}: FETCH ERROR — ${(e as Error).message}`);
      continue;
    }
    const ignored = new Set(IGNORED_KEYS_PER_ROUTE[route] ?? []);
    for (const k of keys) {
      if (ignored.has(k)) continue;
      if (cps[k] !== local[k]) {
        failures.push(
          `${route} ${k}:\n  cps:   ${JSON.stringify(cps[k])}\n  local: ${JSON.stringify(local[k])}`
        );
      }
    }
  }

  if (failures.length > 0) {
    console.error(`\nSEO parity FAILED on ${failures.length} mismatches:\n`);
    failures.forEach((f) => console.error(f));
    process.exit(1);
  }
  console.log(`SEO parity OK for ${ROUTES.length} routes`);
}

main().catch((e) => { console.error(e); process.exit(1); });
