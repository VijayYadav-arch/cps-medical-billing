/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { InquiryForm } from '@/islands/InquiryForm';

vi.mock('@/lib/api', () => ({
  apiClient: { post: vi.fn() },
  trackEvent: vi.fn(),
}));

import { apiClient } from '@/lib/api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('InquiryForm', () => {
  it('renders the form with the expected fields', () => {
    render(<InquiryForm />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service needed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tell us about your needs/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /submit inquiry/i })
    ).toBeInTheDocument();
  });

  it('submits and shows success on 200', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 200, data: {} } as never);
    render(<InquiryForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/service needed/i), {
      target: { value: 'hospice-billing' },
    });
    fireEvent.change(screen.getByLabelText(/tell us about your needs/i), {
      target: { value: 'We need help with hospice billing.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    await waitFor(() => {
      expect(screen.getByText(/inquiry received/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    expect(screen.getByText(/within 1 business day/i)).toBeInTheDocument();

    expect(apiClient.post).toHaveBeenCalledWith(
      '/inquiries',
      expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        serviceType: 'hospice-billing',
        message: 'We need help with hospice billing.',
      })
    );
  });

  it('shows inline error on submit failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('network failed'));
    render(<InquiryForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/service needed/i), {
      target: { value: 'other' },
    });
    fireEvent.change(screen.getByLabelText(/tell us about your needs/i), {
      target: { value: 'Test message.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    await waitFor(() => {
      expect(screen.getByText(/network failed/i)).toBeInTheDocument();
    });
  });

  it('renders Spanish field labels when locale="es" is passed', () => {
    render(<InquiryForm locale="es" />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servicio que necesita/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar consulta/i })).toBeInTheDocument();
  });

  it('shows Spanish success page after submit when locale="es"', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 200, data: {} } as never);
    render(<InquiryForm locale="es" />);

    fireEvent.change(screen.getByLabelText(/^nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'juan@ejemplo.com' },
    });
    fireEvent.change(screen.getByLabelText(/servicio que necesita/i), {
      target: { value: 'hospice-billing' },
    });
    fireEvent.change(screen.getByLabelText(/cuéntenos sobre sus necesidades/i), {
      target: { value: 'necesitamos ayuda con facturación de hospicio.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText(/consulta recibida/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Gracias por su interés/)).toBeInTheDocument();
    // Spanish success page CTAs route to /es/ destinations.
    expect(screen.getByText(/volver al inicio/i).closest('a')).toHaveAttribute('href', '/es/');
    expect(screen.getByText(/ver servicios/i).closest('a')).toHaveAttribute('href', '/es/services');
  });
});
