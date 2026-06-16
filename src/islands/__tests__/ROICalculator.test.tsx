/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ROICalculator } from '@/islands/ROICalculator';

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from '@/lib/analytics';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ROICalculator', () => {
  it('renders the input fields and calculate button', () => {
    render(<ROICalculator />);
    expect(screen.getByLabelText(/monthly charges submitted/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current collection rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current denial rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/average days in a\/r/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /calculate/i })
    ).toBeInTheDocument();
  });

  it('does not render the results section before calculate is clicked', () => {
    render(<ROICalculator />);
    expect(screen.queryByTestId('roi-projected-savings')).toBeNull();
  });

  it('computes a non-zero projected savings on calculate', () => {
    render(<ROICalculator />);

    fireEvent.change(screen.getByLabelText(/monthly charges submitted/i), {
      target: { value: '200000' },
    });
    fireEvent.change(screen.getByLabelText(/current collection rate/i), {
      target: { value: '80' },
    });

    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    const result = screen.queryByTestId('roi-projected-savings');
    expect(result).not.toBeNull();
    // 200,000 * (0.98 - 0.80) = 36,000/month -> annual = 432,000
    expect(result?.textContent).toMatch(/\$432,000/);
  });

  it('fires a roi_calculated analytics event on calculate', () => {
    render(<ROICalculator />);
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    expect(trackEvent).toHaveBeenCalledWith(
      'roi_calculated',
      expect.objectContaining({ monthly_charges: expect.any(Number), locale: 'en' })
    );
  });

  it('fires roi_calculated after filling inputs and clicking calculate', async () => {
    render(<ROICalculator />);

    fireEvent.change(screen.getByLabelText(/monthly charges submitted/i), {
      target: { value: '180000' },
    });
    fireEvent.change(screen.getByLabelText(/current collection rate/i), {
      target: { value: '82' },
    });

    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => {
      expect(vi.mocked(trackEvent)).toHaveBeenCalledWith(
        'roi_calculated',
        expect.objectContaining({ locale: expect.any(String) })
      );
    });
  });

  it('tags the result CTA with cta_click tracking attributes', () => {
    render(<ROICalculator />);
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    const cta = screen.getByText(/get your free assessment/i).closest('a');
    expect(cta).toHaveAttribute('data-track-cta', 'assessment');
    expect(cta).toHaveAttribute('data-cta-source', 'roi-calculator');
  });

  it('renders Spanish strings when locale="es" is passed', () => {
    render(<ROICalculator locale="es" />);
    expect(screen.getByLabelText(/cargos enviados al mes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tasa de cobranza actual/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calcular/i })).toBeInTheDocument();
  });

  it('renders Spanish results copy on calculate', () => {
    render(<ROICalculator locale="es" />);
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));
    expect(screen.getByText(/Su mejora proyectada con CPS/)).toBeInTheDocument();
    // CTA link routes to /es/contact on the Spanish surface, not /assessment.
    const cta = screen.getByText(/Solicitar evaluación gratuita/);
    expect(cta.closest('a')).toHaveAttribute('href', '/es/contact');
  });

  it('analytics event records the active locale', () => {
    render(<ROICalculator locale="es" />);
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));
    expect(trackEvent).toHaveBeenCalledWith(
      'roi_calculated',
      expect.objectContaining({ locale: 'es' })
    );
  });
});
