import { useState } from 'react';
import { apiClient, trackEvent } from '@/lib/api';

export type NewsletterLocale = 'en' | 'es';

interface NewsletterStrings {
  placeholder: string;
  subscribe: string;
  subscribing: string;
  successTitle: string;
  successBody: string;
  genericError: string;
}

const STRINGS_EN: NewsletterStrings = {
  placeholder: 'Enter your email address',
  subscribe: 'Subscribe',
  subscribing: 'Subscribing...',
  successTitle: "You're subscribed!",
  successBody:
    "Thank you for subscribing. You'll receive the latest billing insights and industry updates.",
  genericError: 'Failed to subscribe. Please try again.',
};

const STRINGS_ES: NewsletterStrings = {
  placeholder: 'Ingrese su correo electrónico',
  subscribe: 'Suscribirse',
  subscribing: 'Suscribiendo...',
  successTitle: '¡Suscripción exitosa!',
  successBody:
    'Gracias por suscribirse. Recibirá las últimas novedades sobre facturación y el sector.',
  genericError: 'No se pudo suscribir. Intente de nuevo.',
};

function stringsFor(locale: NewsletterLocale): NewsletterStrings {
  return locale === 'es' ? STRINGS_ES : STRINGS_EN;
}

export function NewsletterForm({ locale = 'en' }: { locale?: NewsletterLocale }) {
  const s = stringsFor(locale);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await apiClient.post('/newsletter', { email });
      setSuccess(true);
      setEmail('');
      trackEvent('newsletter_signup', { locale });
    } catch (err) {
      const message = (err as { message?: string })?.message || s.genericError;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto relative z-10 text-center">
        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <p className="text-white text-lg font-semibold">{s.successTitle}</p>
        <p className="text-slate-300 text-sm mt-1">{s.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto relative z-10">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder={s.placeholder}
          className="form-input flex-1"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{submitting ? s.subscribing : s.subscribe}</span>
          {!submitting && (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-300 text-sm mt-3 text-center">{error}</p>
      )}
    </form>
  );
}
