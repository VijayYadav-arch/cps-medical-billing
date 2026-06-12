import axios from 'axios';

// Same-origin /api/v2/* via Front Door (cps-dotnet backend).
export const apiClient = axios.create({
  baseURL: '/api/v2',
  withCredentials: true,
  timeout: 30000,
});

interface AppInsightsLike {
  trackEvent: (event: { name: string; properties?: Record<string, unknown> }) => void;
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  const ai = (window as unknown as { appInsights?: AppInsightsLike }).appInsights;
  if (ai?.trackEvent) {
    ai.trackEvent({ name, properties: props });
  } else if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[trackEvent]', name, props);
  }
}
