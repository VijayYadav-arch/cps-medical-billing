/**
 * Standalone analytics helper. Lives in its own module (separate from
 * api.ts) so islands that only need analytics don't pull the axios HTTP
 * client into their bundle. Keeping the dependency surface narrow also
 * means a broken/slow axios optimization step in Vite can't block
 * hydration of analytics-only islands.
 */

interface AppInsightsLike {
  trackEvent: (event: { name: string; properties?: Record<string, unknown> }) => void;
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const ai = (window as unknown as { appInsights?: AppInsightsLike }).appInsights;
  if (ai?.trackEvent) {
    ai.trackEvent({ name, properties: props });
  } else if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[trackEvent]', name, props);
  }
}
