import { describe, it, expect } from 'vitest';
import { STATES } from '@/data/states';

describe('STATES data integrity', () => {
  it('has at least the 10 launch states', () => {
    expect(STATES.length).toBeGreaterThanOrEqual(10);
  });

  it('has unique slugs', () => {
    const slugs = STATES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has unique 2-letter uppercase abbreviations', () => {
    const abbrs = STATES.map((s) => s.abbr);
    expect(new Set(abbrs).size).toBe(abbrs.length);
    for (const abbr of abbrs) {
      expect(abbr).toMatch(/^[A-Z]{2}$/);
    }
  });

  it('every state has required non-empty copy fields', () => {
    for (const s of STATES) {
      expect(s.slug).toMatch(/^[a-z-]+$/);
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.medicaidProgram.length).toBeGreaterThan(0);
      expect(s.intro.length).toBeGreaterThan(40);
      expect(s.regulatoryNote.length).toBeGreaterThan(40);
      expect(s.keyPayers.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every state has at least 3 FAQs with non-empty question and answer', () => {
    for (const s of STATES) {
      expect(s.faqs.length).toBeGreaterThanOrEqual(3);
      for (const f of s.faqs) {
        expect(f.q.trim().length).toBeGreaterThan(0);
        expect(f.a.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
