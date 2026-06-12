// Generates per-page Open Graph cards (1200x630 PNG) for CPS Medical Billing.
//
// Layout pattern: cream background, brand mark + wordmark top-left, large
// serif headline center-left, subline below, trust pills bottom. Per Spec
// guidance, each high-impact page gets its own card in EN + ES.
//
// Run: npm run generate:og
// Output: public/og/*.png
//
// To add a new page: append an entry to `pages` below, then re-run the
// script. Wire the page's BaseLayout `og.image` prop to the new path.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'og');
mkdirSync(outDir, { recursive: true });

// XML-escape so quotes / ampersands in copy don't break the SVG.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// One OG card. 1200x630, brand colors, no external assets.
const cardSvg = ({ headline, subline, badges, locale }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fefcf7"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Top-left brand block -->
  <g transform="translate(80, 80)">
    <!-- mark: stylized C -->
    <circle cx="32" cy="32" r="32" fill="url(#accent)"/>
    <text x="32" y="46" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="40" fill="#ffffff">C</text>
    <!-- wordmark -->
    <text x="84" y="30" font-family="Georgia, serif" font-weight="700" font-size="26" fill="#0f172a">CPS</text>
    <text x="84" y="56" font-family="Inter, sans-serif" font-weight="500" font-size="16" fill="#64748b" letter-spacing="1">${locale === 'es' ? 'FACTURACIÓN MÉDICA' : 'MEDICAL BILLING'}</text>
  </g>

  <!-- Accent divider -->
  <rect x="80" y="200" width="80" height="4" fill="url(#accent)"/>

  <!-- Headline -->
  <foreignObject x="80" y="220" width="1040" height="220">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, 'DM Serif Display', serif; font-weight: 700; font-size: 64px; line-height: 1.1; color: #0f172a; letter-spacing: -1px;">
      ${esc(headline)}
    </div>
  </foreignObject>

  <!-- Subline -->
  <foreignObject x="80" y="455" width="1040" height="60">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, system-ui, sans-serif; font-weight: 400; font-size: 24px; line-height: 1.4; color: #475569;">
      ${esc(subline)}
    </div>
  </foreignObject>

  <!-- Trust badges row -->
  <g transform="translate(80, 540)">
    ${badges.map((b, i) => `
      <g transform="translate(${i * 230}, 0)">
        <rect x="0" y="0" width="210" height="44" rx="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="105" y="29" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#0d9488">${esc(b)}</text>
      </g>`).join('')}
  </g>

  <!-- Bottom-right URL -->
  <text x="1120" y="595" text-anchor="end" font-family="Inter, sans-serif" font-weight="500" font-size="14" fill="#94a3b8" letter-spacing="0.5">cpshealthcarebilling.com</text>
</svg>
`;

const trustEN = ['HIPAA Compliant', '98% Collection Rate', '10+ Years'];
const trustES = ['Conformidad HIPAA', '98 % de cobranza', '10+ años'];

const pages = [
  {
    slug: 'default',
    en: { headline: 'Complete medical billing for healthcare practices.', subline: 'Hospice, home health, and palliative care billing across all 50 states.' },
    es: { headline: 'Facturación médica completa para profesionales de salud.', subline: 'Hospicio, salud en el hogar y cuidados paliativos en los 50 estados.' },
  },
  {
    slug: 'about',
    en: { headline: 'Your trusted medical billing partner.', subline: '10+ years specializing in home-based healthcare services.' },
    es: { headline: 'Su socio de confianza en facturación médica.', subline: '10+ años especializados en servicios de salud a domicilio.' },
  },
  {
    slug: 'services',
    en: { headline: 'End-to-end revenue cycle management.', subline: 'Claims submission, payer follow-up, denial management, and reporting.' },
    es: { headline: 'Gestión integral del ciclo de ingresos.', subline: 'Envío de reclamos, seguimiento de pagadores, denegaciones e informes.' },
  },
  {
    slug: 'pricing',
    en: { headline: 'Pricing that fits your practice.', subline: 'No hidden fees. No long-term contracts. Just results.' },
    es: { headline: 'Precios que se ajustan a su consultorio.', subline: 'Sin cargos ocultos. Sin contratos a largo plazo. Solo resultados.' },
  },
  {
    slug: 'contact',
    en: { headline: 'Get in touch with CPS.', subline: 'We reply within one business day. Call 801-341-9304.' },
    es: { headline: 'Comuníquese con CPS.', subline: 'Respondemos en un día hábil. Llame al 801-341-9304.' },
  },
  {
    slug: 'why-cps',
    en: { headline: 'Why agencies choose CPS.', subline: 'Daily billing, payer expertise, recovered revenue, faster collections.' },
    es: { headline: 'Por qué las agencias eligen CPS.', subline: 'Facturación diaria, expertos en pagadores, recuperación de ingresos.' },
  },
  {
    slug: 'case-studies',
    en: { headline: 'Real results from real practices.', subline: 'See how CPS transforms revenue cycles for hospice and home health agencies.' },
    es: { headline: 'Resultados reales de consultorios reales.', subline: 'Vea cómo CPS transforma el ciclo de ingresos para agencias.' },
  },
  {
    slug: 'faq',
    en: { headline: 'Common questions about medical billing.', subline: 'Everything you need to know about working with CPS.' },
    es: { headline: 'Preguntas comunes sobre facturación médica.', subline: 'Todo lo que necesita saber sobre trabajar con CPS.' },
  },
  {
    slug: 'blog',
    en: { headline: 'Billing insights and industry analysis.', subline: 'Practical guidance for hospice, home health, and palliative billing.' },
    es: { headline: 'Análisis del sector y consejos de facturación.', subline: 'Orientación práctica para hospicio, salud en el hogar y paliativos.' },
  },
  {
    slug: 'assessment',
    en: { headline: 'Get a free revenue assessment.', subline: 'Most practices we evaluate find 15-25% in recoverable revenue.' },
    es: { headline: 'Obtenga una evaluación gratuita de ingresos.', subline: 'La mayoría descubre entre 15 % y 25 % de ingresos recuperables.' },
  },
  {
    slug: 'roi-calculator',
    en: { headline: 'See how much CPS can recover for you.', subline: 'A free calculator that projects additional revenue your practice could capture.' },
    es: { headline: 'Vea cuántos ingresos puede recuperar CPS.', subline: 'Calculadora gratuita que proyecta ingresos adicionales para su consultorio.' },
  },
  {
    slug: 'resources',
    en: { headline: 'Free guides and downloads.', subline: 'Expert checklists, reference sheets, and playbooks for billing teams.' },
    es: { headline: 'Guías y descargas gratuitas.', subline: 'Listas de verificación, hojas de referencia y manuales para facturación.' },
  },
];

let count = 0;
for (const page of pages) {
  for (const locale of ['en', 'es']) {
    const copy = page[locale];
    const badges = locale === 'es' ? trustES : trustEN;
    const svg = cardSvg({
      headline: copy.headline,
      subline: copy.subline,
      badges,
      locale,
    });
    const filename = locale === 'es' ? `${page.slug}.es.png` : `${page.slug}.png`;
    const outPath = join(outDir, filename);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    count++;
    console.log(`✓ ${filename} (1200×630)`);
  }
}
console.log(`\nGenerated ${count} OG cards in ${outDir}`);
