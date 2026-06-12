/**
 * Standalone analytics helper. Lives in its own module (separate from
 * api.ts) so islands that only need analytics don't pull the axios HTTP
 * client into their bundle.
 *
 * Fires to whichever analytics backends are present on the page:
 *   - GA4 via window.gtag (loaded by <Analytics /> when PUBLIC_GA4_MEASUREMENT_ID is set)
 *   - Azure Application Insights via window.appInsights (when present)
 *   - console.log in dev when neither is present
 *
 * Calls are best-effort and fail silently -- analytics must never break a click handler.
 */

interface AppInsightsLike {
  trackEvent: (event: { name: string; properties?: Record<string, unknown> }) => void;
}

type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const w = window as unknown as {
    gtag?: Gtag;
    appInsights?: AppInsightsLike;
  };

  try {
    if (w.gtag) {
      w.gtag('event', name, props);
    }
    if (w.appInsights?.trackEvent) {
      w.appInsights.trackEvent({ name, properties: props });
    }
    if (!w.gtag && !w.appInsights && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[trackEvent]', name, props);
    }
  } catch {
    // Analytics never breaks the page.
  }
}
