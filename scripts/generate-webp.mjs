/**
 * Generates .webp versions of every JPG/PNG in public/images/.
 *
 * Modern browsers (95%+ market share) get the WebP version via the
 * <picture> element in templates; legacy browsers fall back to the
 * existing JPG/PNG. WebP is typically 25-35% smaller at the same
 * perceived quality, so this is a free LCP / data-transfer win.
 *
 * Idempotent: existing .webp files are overwritten so re-running the
 * script after replacing a source JPG produces a fresh WebP.
 *
 * Run: npm run generate:webp
 */
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

const RASTER_EXTS = new Set(['.jpg', '.jpeg', '.png']);

const entries = readdirSync(imagesDir).filter((name) => {
  const ext = extname(name).toLowerCase();
  return RASTER_EXTS.has(ext) && statSync(join(imagesDir, name)).isFile();
});

let totalSrcBytes = 0;
let totalWebpBytes = 0;

for (const filename of entries) {
  const srcPath = join(imagesDir, filename);
  const webpPath = join(imagesDir, `${basename(filename, extname(filename))}.webp`);
  const srcBytes = statSync(srcPath).size;
  totalSrcBytes += srcBytes;

  await sharp(srcPath)
    .webp({ quality: 82, effort: 4 })
    .toFile(webpPath);

  const webpBytes = statSync(webpPath).size;
  totalWebpBytes += webpBytes;
  const pct = ((1 - webpBytes / srcBytes) * 100).toFixed(0);
  console.log(`${filename.padEnd(28)} ${(srcBytes / 1024).toFixed(0).padStart(4)} KB -> ${(webpBytes / 1024).toFixed(0).padStart(4)} KB  (-${pct}%)`);
}

const savedPct = ((1 - totalWebpBytes / totalSrcBytes) * 100).toFixed(0);
console.log(`\nTotal: ${(totalSrcBytes / 1024).toFixed(0)} KB -> ${(totalWebpBytes / 1024).toFixed(0)} KB  (-${savedPct}%)`);
console.log(`Generated ${entries.length} .webp files in ${imagesDir}`);
