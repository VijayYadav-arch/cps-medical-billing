import { describe, it, expect } from 'vitest';
import { ctaEventProps } from '@/lib/cta-tracking';

function el(attrs: Record<string, string>): HTMLElement {
  const a = document.createElement('a');
  for (const [k, v] of Object.entries(attrs)) a.setAttribute(k, v);
  return a;
}

describe('ctaEventProps', () => {
  it('reads cta + source from data attributes and adds locale', () => {
    const props = ctaEventProps(
      el({ 'data-track-cta': 'assessment', 'data-cta-source': 'state-utah' }),
      'en'
    );
    expect(props).toEqual({ cta: 'assessment', source: 'state-utah', locale: 'en' });
  });

  it('includes the optional state attribute when present', () => {
    const props = ctaEventProps(
      el({ 'data-track-cta': 'assessment', 'data-cta-source': 'state-texas', 'data-cta-state': 'Texas' }),
      'es'
    );
    expect(props).toEqual({ cta: 'assessment', source: 'state-texas', state: 'Texas', locale: 'es' });
  });

  it('falls back to "unknown" source when not provided', () => {
    const props = ctaEventProps(el({ 'data-track-cta': 'contact' }), 'en');
    expect(props).toEqual({ cta: 'contact', source: 'unknown', locale: 'en' });
  });
});
