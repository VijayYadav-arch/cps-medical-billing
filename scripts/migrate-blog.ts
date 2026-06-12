/**
 * One-shot migration: cps `Article` seed sources -> cps-marketing MDX files.
 *
 * cps stores blog content in two seed files:
 *   cps/prisma/seed-articles.js
 *   cps/prisma/seed-more-articles.js
 *
 * Each declares `const articles = [...]` as a JS array of objects. We extract
 * those arrays by parsing the source text (no Prisma / sqlite dependency)
 * and write one MDX file per article into `src/content/blog/`.
 *
 * Output is committed; this script is run exactly once.
 *
 * Usage:
 *   npm run migrate:blog
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import JSON5 from 'json5';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT_DIR = join(ROOT, 'src', 'content', 'blog');
const CPS_PRISMA = join(ROOT, '..', 'cps', 'prisma');
const SEED_FILES = ['seed-articles.js', 'seed-more-articles.js'];

interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
}

/**
 * Extract the `const articles = [...]` array literal from a seed file's
 * source text. Parses with JSON5 (data-only — supports unquoted keys,
 * double-quoted strings, trailing commas) so we do NOT execute any code
 * from the seed file.
 */
function extractArticles(source: string): Article[] {
  const marker = 'const articles =';
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`marker "${marker}" not found`);
  const arrayStart = source.indexOf('[', start);
  if (arrayStart < 0) throw new Error('opening [ not found after marker');

  // Walk forward counting brackets to find the matching close, ignoring
  // brackets inside string literals.
  let depth = 0;
  let inString: '"' | "'" | '`' | null = null;
  let escapeNext = false;
  let arrayEnd = -1;
  for (let i = arrayStart; i < source.length; i++) {
    const ch = source[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (inString) {
      if (ch === '\\') { escapeNext = true; continue; }
      if (ch === inString) { inString = null; }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) { arrayEnd = i; break; }
    }
  }
  if (arrayEnd < 0) throw new Error('matching ] not found');

  const arrayText = source.slice(arrayStart, arrayEnd + 1);
  return JSON5.parse<Article[]>(convertTemplateLiteralsToStrings(arrayText));
}

/**
 * Convert backtick-delimited template literals into JSON-compatible
 * double-quoted strings so JSON5 can parse them. The seed files use template
 * literals only for multi-line content (no `${...}` interpolations); a hard
 * error is thrown if an interpolation is encountered so we never silently
 * drop dynamic content.
 */
function convertTemplateLiteralsToStrings(text: string): string {
  let result = '';
  let i = 0;
  let inString: '"' | "'" | null = null;
  let escapeNext = false;

  while (i < text.length) {
    const ch = text[i];
    if (escapeNext) { result += ch; escapeNext = false; i++; continue; }
    if (inString) {
      if (ch === '\\') { result += ch; escapeNext = true; i++; continue; }
      if (ch === inString) { inString = null; }
      result += ch;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") { inString = ch; result += ch; i++; continue; }
    if (ch !== '`') { result += ch; i++; continue; }

    // Found a backtick — scan to the closing backtick, collecting body.
    let body = '';
    i++;
    while (i < text.length && text[i] !== '`') {
      if (text[i] === '\\') {
        body += text[i] + text[i + 1];
        i += 2;
        continue;
      }
      if (text[i] === '$' && text[i + 1] === '{') {
        throw new Error('template literal interpolation `${...}` is not supported by this migration');
      }
      body += text[i];
      i++;
    }
    if (i >= text.length) throw new Error('unterminated template literal');
    i++; // consume closing backtick

    // Escape for JSON double-quoted string.
    const escaped = body
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    result += `"${escaped}"`;
  }

  return result;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function buildFrontmatter(a: Article, publishedAt: Date): string {
  const lines = ['---'];
  lines.push(`title: ${yamlString(a.title)}`);
  lines.push(`slug: ${yamlString(a.slug)}`);
  lines.push(`excerpt: ${yamlString(a.excerpt)}`);
  lines.push(`author: ${yamlString('CPS Team')}`);
  lines.push(`publishedAt: ${publishedAt.toISOString()}`);
  lines.push(`updatedAt: ${publishedAt.toISOString()}`);
  if (a.imageUrl) lines.push(`hero: ${yamlString(a.imageUrl)}`);
  if (a.category) lines.push(`tags:\n  - ${yamlString(a.category)}`);
  lines.push('---', '');
  return lines.join('\n');
}

async function main(): Promise<void> {
  const all: Article[] = [];
  for (const file of SEED_FILES) {
    const fullPath = join(CPS_PRISMA, file);
    console.log(`reading ${fullPath}`);
    const source = await readFile(fullPath, 'utf8');
    const articles = extractArticles(source);
    console.log(`  found ${articles.length} articles`);
    all.push(...articles);
  }

  await mkdir(OUT_DIR, { recursive: true });

  // Stagger publication dates so the blog list orders consistently:
  // first article in the merged array = newest, last = oldest, one day apart.
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  let ok = 0;
  const failures: { slug: string; error: string }[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < all.length; i++) {
    const a = all[i];
    if (seen.has(a.slug)) {
      failures.push({ slug: a.slug, error: 'duplicate slug across seed files' });
      continue;
    }
    seen.add(a.slug);
    const publishedAt = new Date(today);
    publishedAt.setDate(today.getDate() - i);
    try {
      const mdx = buildFrontmatter(a, publishedAt) + (a.content ?? '') + '\n';
      const file = join(OUT_DIR, `${a.slug}.mdx`);
      await writeFile(file, mdx, 'utf8');
      console.log(`  wrote ${a.slug}.mdx`);
      ok++;
    } catch (e) {
      failures.push({ slug: a.slug, error: (e as Error).message });
    }
  }

  console.log(`\n${ok}/${all.length} migrated`);
  if (failures.length > 0) {
    console.log('Failures:');
    failures.forEach((f) => console.log(`  ${f.slug}: ${f.error}`));
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
