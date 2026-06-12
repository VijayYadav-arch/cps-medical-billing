import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { NewsletterForm } from '@/islands/NewsletterForm';

vi.mock('@/lib/api', () => ({
  apiClient: { post: vi.fn() },
}));
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

import { apiClient } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('NewsletterForm', () => {
  it('renders the email input and Subscribe button', () => {
    render(<NewsletterForm />);
    expect(
      screen.getByPlaceholderText(/enter your email address/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /subscribe/i })
    ).toBeInTheDocument();
  });

  it('subscribes successfully on submit and shows confirmation', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 200, data: {} } as never);
    render(<NewsletterForm />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/you're subscribed/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/thank you for subscribing/i)).toBeInTheDocument();

    expect(apiClient.post).toHaveBeenCalledWith('/newsletter', {
      email: 'jane@example.com',
    });
    expect(trackEvent).toHaveBeenCalledWith(
      'newsletter_signup',
      expect.objectContaining({ locale: 'en' }),
    );
  });

  it('renders Spanish copy when locale="es" is passed', () => {
    render(<NewsletterForm locale="es" />);
    expect(screen.getByPlaceholderText(/ingrese su correo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /suscribirse/i })).toBeInTheDocument();
  });

  it('shows inline error on subscribe failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('subscription failed'));
    render(<NewsletterForm />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/subscription failed/i)).toBeInTheDocument();
    });
  });
});
