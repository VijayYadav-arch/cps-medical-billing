/**
 * cps-marketing i18n helpers.
 *
 * - English pages live at the root (e.g. /pricing); Spanish under /es/
 *   (e.g. /es/pricing). The home page is /es/ rather than /es/index.
 * - `getLocale(url)` -- detect from the URL pathname.
 * - `tr(locale, key)` -- look up a UI string in the shared dictionary.
 * - `pathFor(locale, enPath)` -- compute the localized counterpart of any
 *   English path; used by the language switcher to swap between mirror pages.
 *
 * The dictionary is intentionally small. Page bodies live in the page files
 * (/about.astro vs /es/about.astro) so that copy can flow naturally per
 * locale without forcing every paragraph through a key.
 */

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const UI = {
  brand: {
    en: 'CPS Medical Billing',
    es: 'CPS Facturación Médica',
  },
  tagline: {
    en: 'Complete Professional Solutions',
    es: 'Soluciones Profesionales Completas',
  },
  nav: {
    home: { en: 'Home', es: 'Inicio' },
    services: { en: 'Services', es: 'Servicios' },
    caseStudies: { en: 'Case Studies', es: 'Casos de éxito' },
    pricing: { en: 'Pricing', es: 'Precios' },
    about: { en: 'About', es: 'Acerca de' },
    blog: { en: 'Blog', es: 'Blog' },
    contact: { en: 'Contact', es: 'Contacto' },
  },
  cta: {
    freeAssessment: { en: 'Free Assessment', es: 'Evaluación gratuita' },
    signUpFree: { en: 'Sign Up Free', es: 'Registrarse gratis' },
    callUs: { en: 'Call us directly', es: 'Llámenos directamente' },
    learnMore: { en: 'Learn more', es: 'Más información' },
  },
  languagePicker: {
    label: { en: 'Language', es: 'Idioma' },
    english: { en: 'English', es: 'English' },
    spanish: { en: 'Español', es: 'Español' },
  },
  footer: {
    rights: { en: 'All Rights Reserved.', es: 'Todos los derechos reservados.' },
    description: {
      en: 'Specializing in hospice, home health, and palliative care billing across all 50 states.',
      es: 'Especialistas en facturación de cuidados paliativos, salud en el hogar y hospicio en los 50 estados.',
    },
    brandTagline: {
      en: 'Complete Professional Solutions for healthcare billing. Your trusted partner in revenue cycle management.',
      es: 'Soluciones profesionales completas para la facturación de salud. Su socio de confianza en la gestión del ciclo de ingresos.',
    },
    sisterBrand: { en: 'Sister brand', es: 'Marca hermana' },
    sisterBrandLink: { en: 'Mira — AI-native platform', es: 'Mira — plataforma con IA' },
    expertiseHeading: { en: 'Our Expertise', es: 'Nuestra experiencia' },
    servingHeading: { en: 'Proudly Serving', es: 'A quiénes servimos' },
    servicesHeading: { en: 'Our Services', es: 'Nuestros servicios' },
    expertise: {
      medicare: { en: 'Medicare', es: 'Medicare' },
      medicaid: { en: 'Medicaid', es: 'Medicaid' },
      privateInsurance: { en: 'Private Insurance', es: 'Seguros privados' },
      roomBoard: { en: 'Medicaid Room & Board', es: 'Medicaid – habitación y comida' },
    },
    serving: {
      hospice: { en: 'Hospice', es: 'Hospicio' },
      homeHealth: { en: 'Home Health', es: 'Salud en el hogar' },
      palliative: { en: 'Palliative Care', es: 'Cuidados paliativos' },
      privatePractices: { en: 'Private Practices', es: 'Consultorios privados' },
    },
    services: {
      collection: { en: 'Collection / Reimbursement', es: 'Cobranza y reembolso' },
      monthlyReporting: { en: 'Monthly Reporting', es: 'Informes mensuales' },
      caseStudies: { en: 'Case Studies', es: 'Casos de éxito' },
      pricing: { en: 'Pricing', es: 'Precios' },
      faq: { en: 'FAQ', es: 'Preguntas frecuentes' },
      roi: { en: 'ROI Calculator', es: 'Calculadora de ingresos' },
      resources: { en: 'Resources', es: 'Recursos' },
    },
    badges: {
      hipaa: { en: 'HIPAA Compliant', es: 'Conformidad HIPAA' },
      aapc: { en: 'AAPC Certified', es: 'Certificación AAPC' },
      soc2: { en: 'SOC 2 Compliant', es: 'Alineado con SOC 2' },
    },
    privacy: { en: 'Privacy Policy', es: 'Política de privacidad' },
    terms: { en: 'Terms of Service', es: 'Términos de servicio' },
    contact: { en: 'Contact Us', es: 'Contáctenos' },
  },
} as const;

type LeafLookup<T> = T extends { en: string; es: string }
  ? string
  : T extends Record<string, unknown>
    ? { [K in keyof T]: LeafLookup<T[K]> }
    : never;

/**
 * Returns the active locale based on URL pathname. The /es/* tree is Spanish;
 * everything else is English.
 */
export function getLocale(url: URL | { pathname: string }): Locale {
  return url.pathname.startsWith('/es/') || url.pathname === '/es' ? 'es' : 'en';
}

/**
 * Translate a UI key. `key` is dot-notated, e.g. `'nav.pricing'`.
 * Falls back to English if the Spanish value is missing.
 */
export function tr(locale: Locale, key: string): string {
  const parts = key.split('.');
  let cursor: unknown = UI;
  for (const part of parts) {
    if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (cursor && typeof cursor === 'object' && 'en' in (cursor as Record<string, unknown>)) {
    const bucket = cursor as { en: string; es: string };
    return bucket[locale] ?? bucket.en ?? key;
  }
  return key;
}

/**
 * Given an English route (e.g. "/pricing") and a target locale, return the
 * localized counterpart. English root path stays the same.
 */
export function pathFor(locale: Locale, enPath: string): string {
  if (locale === 'en') return enPath;
  if (enPath === '/') return '/es/';
  return `/es${enPath}`;
}

/**
 * Inverse of `pathFor`: given a localized URL (e.g. "/es/pricing"), return
 * the canonical English path. Useful for the language switcher when the
 * user is on a Spanish page and wants the matching English one.
 */
export function enPathOf(currentPath: string): string {
  if (!currentPath.startsWith('/es/') && currentPath !== '/es') return currentPath;
  if (currentPath === '/es' || currentPath === '/es/') return '/';
  return currentPath.slice(3); // strip leading "/es"
}

/** Pages that currently have a Spanish translation. The language picker
 *  routes to the home page when the current page has no Spanish mirror. */
export const SPANISH_TRANSLATED_PATHS = new Set<string>([
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/services',
  '/why-cps',
  '/faq',
  '/privacy',
  '/terms',
  '/case-studies',
  '/marketplace',
  '/resources',
  '/developers',
  '/roi-calculator',
  '/assessment',
  '/blog',
]);

export type UIType = LeafLookup<typeof UI>;
