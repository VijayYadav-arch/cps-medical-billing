import { useState } from 'react';
import { apiClient, trackEvent } from '@/lib/api';

export type InquiryLocale = 'en' | 'es';

/**
 * Locale-driven strings for the InquiryForm island. Callers may still
 * override the visible-headline-level strings (`title`, `submitLabel`,
 * `messageLabel`, `messagePlaceholder`, `serviceOptions`) via props --
 * that pre-existing surface stays so individual pages can customize
 * copy without flipping the whole locale. The `locale` prop drives
 * everything that wasn't already overrideable: field labels,
 * placeholders, the success page, the "Submitting..." spinner, and
 * the default service-option labels.
 */
interface InquiryStrings {
  /** Headline fallback when the page didn't pass a title prop. */
  defaultTitle: string;
  defaultSubmit: string;
  defaultMessageLabel: string;
  defaultMessagePlaceholder: string;
  /** Field labels (no override surface today). */
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  organization: string;
  organizationPlaceholder: string;
  serviceType: string;
  submitting: string;
  /** Inline error fallback when the server gave no message. */
  genericError: string;
  /** Success-page copy. */
  successTitle: string;
  successBody: string;
  backHome: string;
  viewServices: string;
  backHomeHref: string;
  viewServicesHref: string;
  /** Default service-option labels (overridable via serviceOptions prop). */
  serviceOptions: { value: string; label: string }[];
}

const STRINGS_EN: InquiryStrings = {
  defaultTitle: 'Inquiry Details',
  defaultSubmit: 'Submit Inquiry',
  defaultMessageLabel: 'Tell Us About Your Needs',
  defaultMessagePlaceholder:
    "Describe your practice size, current billing challenges, and what you're looking for in a billing partner...",
  firstName: 'First Name',
  firstNamePlaceholder: 'John',
  lastName: 'Last Name',
  lastNamePlaceholder: 'Doe',
  email: 'Email Address',
  emailPlaceholder: 'john@example.com',
  phone: 'Phone Number',
  phonePlaceholder: '(555) 123-4567',
  organization: 'Organization / Practice',
  organizationPlaceholder: 'Your Practice Name',
  serviceType: 'Service Needed',
  submitting: 'Submitting...',
  genericError: 'Failed to submit. Please try again.',
  successTitle: 'Inquiry Received',
  successBody:
    'Thank you for your interest in CPS Medical Billing. Our team will review your inquiry and get back to you within 1 business day.',
  backHome: 'Back to Home',
  viewServices: 'View Services',
  backHomeHref: '/',
  viewServicesHref: '/services',
  serviceOptions: [
    { value: '', label: 'Select a service...' },
    { value: 'hospice-billing', label: 'Hospice Billing Services' },
    { value: 'home-health-billing', label: 'Home Health Billing Services' },
    { value: 'palliative-care-billing', label: 'Palliative Care Billing Services' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'payer-setup', label: 'Payer Setup' },
    { value: 'other', label: 'Other' },
  ],
};

const STRINGS_ES: InquiryStrings = {
  defaultTitle: 'Detalles de la consulta',
  defaultSubmit: 'Enviar consulta',
  defaultMessageLabel: 'Cuéntenos sobre sus necesidades',
  defaultMessagePlaceholder:
    'Describa el tamaño de su consultorio, sus retos actuales de facturación y qué busca en un socio de facturación...',
  firstName: 'Nombre',
  firstNamePlaceholder: 'Juan',
  lastName: 'Apellido',
  lastNamePlaceholder: 'Pérez',
  email: 'Correo electrónico',
  emailPlaceholder: 'juan@ejemplo.com',
  phone: 'Teléfono',
  phonePlaceholder: '(555) 123-4567',
  organization: 'Organización / Consultorio',
  organizationPlaceholder: 'Nombre de su consultorio',
  serviceType: 'Servicio que necesita',
  submitting: 'Enviando...',
  genericError: 'No se pudo enviar. Intente de nuevo.',
  successTitle: 'Consulta recibida',
  successBody:
    'Gracias por su interés en CPS Facturación Médica. Nuestro equipo revisará su consulta y le responderá en un día hábil.',
  backHome: 'Volver al inicio',
  viewServices: 'Ver servicios',
  backHomeHref: '/es/',
  viewServicesHref: '/es/services',
  serviceOptions: [
    { value: '', label: 'Seleccione un servicio...' },
    { value: 'hospice-billing', label: 'Facturación de hospicio' },
    { value: 'home-health-billing', label: 'Facturación de salud en el hogar' },
    { value: 'palliative-care-billing', label: 'Facturación de cuidados paliativos' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'payer-setup', label: 'Configuración de pagadores' },
    { value: 'other', label: 'Otro' },
  ],
};

function stringsFor(locale: InquiryLocale): InquiryStrings {
  return locale === 'es' ? STRINGS_ES : STRINGS_EN;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  serviceType: string;
  message: string;
}

interface InquiryFormProps {
  /** Locale for non-overrideable strings (field labels, success page, etc). */
  locale?: InquiryLocale;
  /** Override the form heading. Falls back to the locale's defaultTitle. */
  title?: string;
  /** Override the submit button label. Falls back to the locale's defaultSubmit. */
  submitLabel?: string;
  /** Override the message field label. */
  messageLabel?: string;
  /** Override the message field placeholder. */
  messagePlaceholder?: string;
  /** Override the service-type select options entirely. */
  serviceOptions?: { value: string; label: string }[];
  className?: string;
}

export function InquiryForm({
  locale = 'en',
  title,
  submitLabel,
  messageLabel,
  messagePlaceholder,
  serviceOptions,
  className = '',
}: InquiryFormProps) {
  const s = stringsFor(locale);
  const effectiveTitle = title ?? s.defaultTitle;
  const effectiveSubmit = submitLabel ?? s.defaultSubmit;
  const effectiveMessageLabel = messageLabel ?? s.defaultMessageLabel;
  const effectivePlaceholder = messagePlaceholder ?? s.defaultMessagePlaceholder;
  const effectiveOptions = serviceOptions ?? s.serviceOptions;

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    serviceType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await apiClient.post('/inquiries', form);
      setSubmitted(true);
      trackEvent('inquiry_submitted', { service_type: form.serviceType, locale });
    } catch (err) {
      const message = (err as { message?: string })?.message || s.genericError;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-navy-900 mb-4">{s.successTitle}</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">{s.successBody}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={s.backHomeHref} className="btn-primary justify-center">
            <span>{s.backHome}</span>
          </a>
          <a href={s.viewServicesHref} className="btn-outline-dark justify-center">
            {s.viewServices}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-100 ${className}`}
    >
      <h3 className="font-serif text-xl text-navy-900 mb-6">{effectiveTitle}</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-navy-900 mb-1.5">
              {s.firstName} <span className="text-red-400">*</span>
            </label>
            <input
              type="text" id="firstName" name="firstName"
              value={form.firstName} onChange={handleChange}
              placeholder={s.firstNamePlaceholder} className="form-input" required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-navy-900 mb-1.5">
              {s.lastName} <span className="text-red-400">*</span>
            </label>
            <input
              type="text" id="lastName" name="lastName"
              value={form.lastName} onChange={handleChange}
              placeholder={s.lastNamePlaceholder} className="form-input" required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-900 mb-1.5">
            {s.email} <span className="text-red-400">*</span>
          </label>
          <input
            type="email" id="email" name="email"
            value={form.email} onChange={handleChange}
            placeholder={s.emailPlaceholder} className="form-input" required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-navy-900 mb-1.5">
              {s.phone}
            </label>
            <input
              type="tel" id="phone" name="phone"
              value={form.phone} onChange={handleChange}
              placeholder={s.phonePlaceholder} className="form-input"
            />
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-navy-900 mb-1.5">
              {s.organization}
            </label>
            <input
              type="text" id="organization" name="organization"
              value={form.organization} onChange={handleChange}
              placeholder={s.organizationPlaceholder} className="form-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-navy-900 mb-1.5">
            {s.serviceType} <span className="text-red-400">*</span>
          </label>
          <select
            id="serviceType" name="serviceType"
            value={form.serviceType} onChange={handleChange}
            className="form-input" required
          >
            {effectiveOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-navy-900 mb-1.5">
            {effectiveMessageLabel} <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message" name="message"
            value={form.message} onChange={handleChange}
            rows={5} placeholder={effectivePlaceholder}
            className="form-input" required
          />
        </div>

        <button
          type="submit" disabled={submitting}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{submitting ? s.submitting : effectiveSubmit}</span>
          {!submitting && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
