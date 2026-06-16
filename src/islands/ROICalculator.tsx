import { useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export type ROILocale = 'en' | 'es';

/**
 * The Astro page renders the surrounding chrome in the active locale and
 * passes the matching string bundle in as a prop. The island has no
 * runtime locale detection of its own -- whatever the page chose at
 * render-time wins.
 */
interface ROIStrings {
  formTitle: string;
  monthlyCharges: string;
  collectionRate: string;
  denialRate: string;
  arDays: string;
  calculate: string;
  privacy: string;
  resultsTitle: string;
  additionalMonthly: string;
  annualIncrease: string;
  projectedCollection: string;
  projectedArDays: string;
  arDaysValue: string;
  summary: (params: {
    annual: string;
    fromRate: number;
    toRate: number;
    fromDays: number;
  }) => React.ReactNode;
  cta: string;
  ctaHref: string;
  ctaLink: string;
}

const STRINGS_EN: ROIStrings = {
  formTitle: 'Your Practice Details',
  monthlyCharges: 'Monthly Charges Submitted',
  collectionRate: 'Current Collection Rate (%)',
  denialRate: 'Current Denial Rate (%)',
  arDays: 'Average Days in A/R',
  calculate: 'Calculate',
  privacy: 'Your data is not stored or transmitted. All calculations happen in your browser.',
  resultsTitle: 'Your Projected Improvement with CPS',
  additionalMonthly: 'Additional Monthly Revenue',
  annualIncrease: 'Annual Revenue Increase',
  projectedCollection: 'Projected Collection Rate',
  projectedArDays: 'Projected Days in A/R',
  arDaysValue: '< 30 days',
  summary: ({ annual, fromRate, toRate, fromDays }) => (
    <>
      Based on your inputs, switching to CPS could recover an estimated{' '}
      <span className="font-semibold text-navy-900">{annual}</span> in
      additional annual revenue by improving your collection rate from{' '}
      <span className="font-semibold text-navy-900">{fromRate}%</span> to{' '}
      <span className="font-semibold text-navy-900">{toRate}%</span> and
      reducing your A/R days from{' '}
      <span className="font-semibold text-navy-900">{fromDays}</span> to under 30.
    </>
  ),
  cta: 'Ready to see these results?',
  ctaHref: '/assessment',
  ctaLink: 'Get Your Free Assessment',
};

const STRINGS_ES: ROIStrings = {
  formTitle: 'Datos de su consultorio',
  monthlyCharges: 'Cargos enviados al mes',
  collectionRate: 'Tasa de cobranza actual (%)',
  denialRate: 'Tasa de denegación actual (%)',
  arDays: 'Días promedio en A/R',
  calculate: 'Calcular',
  privacy: 'Sus datos no se almacenan ni se transmiten. Todos los cálculos se hacen en su navegador.',
  resultsTitle: 'Su mejora proyectada con CPS',
  additionalMonthly: 'Ingresos mensuales adicionales',
  annualIncrease: 'Aumento anual de ingresos',
  projectedCollection: 'Tasa de cobranza proyectada',
  projectedArDays: 'Días proyectados en A/R',
  arDaysValue: '< 30 días',
  summary: ({ annual, fromRate, toRate, fromDays }) => (
    <>
      Según sus datos, cambiar a CPS podría recuperar aproximadamente{' '}
      <span className="font-semibold text-navy-900">{annual}</span> en
      ingresos anuales adicionales, mejorando su tasa de cobranza del{' '}
      <span className="font-semibold text-navy-900">{fromRate} %</span> al{' '}
      <span className="font-semibold text-navy-900">{toRate} %</span> y
      reduciendo sus días en A/R de{' '}
      <span className="font-semibold text-navy-900">{fromDays}</span> a menos de 30.
    </>
  ),
  cta: '¿Listo para ver estos resultados?',
  ctaHref: '/es/contact',
  ctaLink: 'Solicitar evaluación gratuita',
};

function stringsFor(locale: ROILocale): ROIStrings {
  return locale === 'es' ? STRINGS_ES : STRINGS_EN;
}

/**
 * Currency stays USD regardless of locale -- CPS pricing and the ROI
 * projections are denominated in USD. Only the thousands/decimal
 * separators flip to match the active locale's expectations.
 */
function currencyFormatterFor(locale: ROILocale): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function ROICalculator({ locale = 'en' }: { locale?: ROILocale }) {
  const [monthlyCharges, setMonthlyCharges] = useState(150000);
  const [collectionRate, setCollectionRate] = useState(85);
  const [denialRate, setDenialRate] = useState(12);
  const [arDays, setArDays] = useState(45);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Guard against the divide-by-100 going negative when the user types a
  // collection rate higher than our 98% target -- then there's no recovery
  // headroom to project.
  const collectionGap = Math.max(0, 0.98 - collectionRate / 100);
  const additionalMonthly = monthlyCharges * collectionGap;
  const annualIncrease = additionalMonthly * 12;

  const s = stringsFor(locale);
  const currencyFormatter = currencyFormatterFor(locale);

  function handleCalculate() {
    setShowResults(true);
    trackEvent('roi_calculated', { monthly_charges: monthlyCharges, locale });
    // Scroll the results into view on mobile where they appear below the form.
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Until the user clicks Calculate, render the form full-width and centered.
  // After Calculate, switch to a 2-column grid (form left / results right) on
  // large screens; mobile stays stacked. This avoids the form being squeezed
  // into half the container with an empty right column on initial load.
  const wrapperClass = showResults
    ? 'grid lg:grid-cols-2 gap-16 items-start'
    : 'max-w-2xl mx-auto';

  return (
    <div className={wrapperClass}>
      {/* Left: Inputs */}
      <div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="font-serif text-2xl text-navy-900 mb-8">
            {s.formTitle}
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="monthlyCharges" className="block text-sm font-medium text-navy-900 mb-2">
                {s.monthlyCharges}
              </label>
              <input
                id="monthlyCharges"
                type="number"
                className="form-input w-full"
                value={monthlyCharges}
                onChange={(e) => setMonthlyCharges(Number(e.target.value))}
                step={1000}
              />
            </div>

            <div>
              <label htmlFor="collectionRate" className="block text-sm font-medium text-navy-900 mb-2">
                {s.collectionRate}
              </label>
              <input
                id="collectionRate"
                type="number"
                className="form-input w-full"
                value={collectionRate}
                onChange={(e) => setCollectionRate(Number(e.target.value))}
                min={0}
                max={100}
              />
            </div>

            <div>
              <label htmlFor="denialRate" className="block text-sm font-medium text-navy-900 mb-2">
                {s.denialRate}
              </label>
              <input
                id="denialRate"
                type="number"
                className="form-input w-full"
                value={denialRate}
                onChange={(e) => setDenialRate(Number(e.target.value))}
                min={0}
                max={100}
              />
            </div>

            <div>
              <label htmlFor="arDays" className="block text-sm font-medium text-navy-900 mb-2">
                {s.arDays}
              </label>
              <input
                id="arDays"
                type="number"
                className="form-input w-full"
                value={arDays}
                onChange={(e) => setArDays(Number(e.target.value))}
                min={0}
                max={180}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="btn-primary w-full justify-center mt-8"
          >
            {s.calculate}
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            {s.privacy}
          </p>
        </div>
      </div>

      {/* Right: Results */}
      {showResults && (
        <div ref={resultsRef} className="scroll-mt-24">
          <h2 className="font-serif text-2xl text-navy-900 mb-8">
            {s.resultsTitle}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-600 mb-2">
                {s.additionalMonthly}
              </p>
              <p className="font-serif text-2xl text-teal-600 font-bold">
                {currencyFormatter.format(additionalMonthly)}
              </p>
            </div>

            <div
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
              data-testid="roi-projected-savings"
            >
              <p className="text-sm text-slate-600 mb-2">
                {s.annualIncrease}
              </p>
              <p className="font-serif text-2xl text-teal-600 font-bold">
                {currencyFormatter.format(annualIncrease)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-600 mb-2">
                {s.projectedCollection}
              </p>
              <p className="font-serif text-2xl text-teal-600 font-bold">
                98%
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-600 mb-2">
                {s.projectedArDays}
              </p>
              <p className="font-serif text-2xl text-teal-600 font-bold">
                {s.arDaysValue}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
            <p className="text-slate-600 leading-relaxed">
              {s.summary({
                annual: currencyFormatter.format(annualIncrease),
                fromRate: collectionRate,
                toRate: 98,
                fromDays: arDays,
              })}
            </p>
          </div>

          <div className="text-center">
            <p className="text-navy-900 font-serif text-lg mb-4">
              {s.cta}
            </p>
            <a
              href={s.ctaHref}
              data-track-cta="assessment"
              data-cta-source="roi-calculator"
              className="btn-primary inline-flex"
            >
              <span>{s.ctaLink}</span>
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
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
