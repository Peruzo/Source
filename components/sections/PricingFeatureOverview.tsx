'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import {
  PLAN_NAMES,
  PLAN_ORDER,
  includedIn,
  pricingFeatureCategories,
  type PlanId,
} from '@/lib/data/pricing-features';

function Check() {
  return (
    <svg className="h-5 w-5 text-teal-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Dash() {
  return <span className="block h-px w-3 bg-gray-300" aria-hidden="true" />;
}

function Mark({ on }: { on: boolean }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center">
      {on ? <Check /> : <Dash />}
      <span className="sr-only">{on ? 'Ingår' : 'Ingår inte'}</span>
    </span>
  );
}

export function PricingFeatureOverview() {
  const [plan, setPlan] = useState<PlanId>('core');

  return (
    <section className="bg-white pb-20 md:pb-32" aria-labelledby="funktionsoversikt">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h2 id="funktionsoversikt" className="text-section-subtitle text-black text-center mb-4">
            Allt som ingår
          </h2>
          <p className="text-body text-gray-600 text-center mb-10 md:mb-12">
            Varje paket innehåller allt i paketet före.
          </p>

          {/* Mobil: välj paket och se listan för det */}
          <div className="md:hidden">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1" role="group" aria-label="Välj paket">
              {PLAN_ORDER.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  aria-pressed={plan === p}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                    plan === p ? 'bg-white text-black shadow-sm' : 'text-gray-600'
                  }`}
                >
                  {PLAN_NAMES[p]}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-8">
              {pricingFeatureCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {category.title}
                  </h3>
                  <ul className="divide-y divide-gray-200 border-y border-gray-200">
                    {category.features.map((feature) => {
                      const on = includedIn(feature, plan);
                      return (
                        <li key={feature.name} className="flex items-start gap-3 py-3">
                          <span className="mt-0.5">
                            <Mark on={on} />
                          </span>
                          <span className={on ? 'text-black' : 'text-gray-400'}>
                            <span className="block text-sm font-medium">{feature.name}</span>
                            {feature.detail && (
                              <span className={`block text-sm ${on ? 'text-gray-600' : 'text-gray-400'}`}>
                                {feature.detail}
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Från md: en rad per funktion med bockar per paket */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-sm font-semibold text-black">
                    Funktion
                  </th>
                  {PLAN_ORDER.map((p) => (
                    <th key={p} scope="col" className="w-28 px-4 py-4 text-center text-sm font-semibold text-black">
                      {PLAN_NAMES[p]}
                    </th>
                  ))}
                </tr>
              </thead>
              {pricingFeatureCategories.map((category) => (
                <tbody key={category.title} className="border-t border-gray-200">
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={4}
                      className="px-6 pt-6 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {category.title}
                    </th>
                  </tr>
                  {category.features.map((feature) => (
                    <tr key={feature.name} className="border-t border-gray-100 first:border-t-0">
                      <th scope="row" className="px-6 py-3 font-normal">
                        <span className="block text-sm font-medium text-black">{feature.name}</span>
                        {feature.detail && <span className="block text-sm text-gray-600">{feature.detail}</span>}
                      </th>
                      {PLAN_ORDER.map((p) => (
                        <td key={p} className="px-4 py-3 text-center">
                          <Mark on={includedIn(feature, p)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
