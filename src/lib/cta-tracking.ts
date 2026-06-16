/**
 * Dependency-free delegated CTA click tracking. A single listener attached
 * in BaseLayout catches clicks on any element carrying `data-track-cta` and
 * fires a standardized `cta_click` event through the shared analytics helper.
 *
 * Markup contract:
 *   <a href="..." data-track-cta="assessment"
 *      data-cta-source="state-utah" data-cta-state="Utah">...</a>
 *
 * `data-cta-state` is optional (only state pages set it). `data-cta-source`
 * defaults to "unknown" so a missing attribute never throws.
 */
import { trackEvent } from './analytics';

type Locale = 'en' | 'es';

export function ctaEventProps(el: HTMLElement, locale: Locale): Record<string, unknown> {
  const props: Record<string, unknown> = {
    cta: el.dataset.trackCta,
    source: el.dataset.ctaSource ?? 'unknown',
    locale,
  };
  if (el.dataset.ctaState) props.state = el.dataset.ctaState;
  return props;
}

function currentLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang.startsWith('es') ? 'es' : 'en';
}

export function initCtaTracking(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track-cta]');
    if (!target) return;
    trackEvent('cta_click', ctaEventProps(target, currentLocale()));
  });
}
