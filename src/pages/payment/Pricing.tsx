// src/components/PricingPage.tsx
import React, { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import type { Plan } from '../../lib/types';

type BillingInterval = 'month' | 'semiannual' | 'annual';
const plans: Plan[] = [
  { id: 1, name: 'Monthly', price_cents: 5000, strike_price_cents: 20000, billing_interval: 'month' },
  { id: 2, name: 'Semi-Annual', price_cents: 25000, strike_price_cents: 120000, billing_interval: 'semiannual' },
  { id: 3, name: 'Annual', price_cents: 40000, strike_price_cents: 160000, billing_interval: 'annual' },
];

const BillingLabel: Record<BillingInterval, string> = {
  month: 'per month',
  semiannual: 'per 6 months',
  annual: 'per year',
};

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  if (selectedPlan) {
    return <CheckoutForm plan={selectedPlan} onBack={() => setSelectedPlan(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="mt-4 text-gray-600">
          Simple, transparent pricing for{' '}
          <span className="font-semibold">unlimited AI chat</span> and{' '}
          <span className="font-semibold">500+ premium questions</span>.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`p-8 border rounded-lg flex flex-col justify-between transition-shadow hover:shadow-lg ${
              plan.name === 'Semi-Annual' ? 'border-blue-600 shadow-xl' : ''
            }`}
          >
            {/* Badge */}
            {plan.name === 'Semi-Annual' && (
              <span className="self-start bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </span>
            )}

            {/* Plan Info */}
            <div>
              <h3 className="text-2xl font-semibold mt-4">{plan.name}</h3>
              <div className="mt-6 text-5xl font-bold">
                ${(plan.price_cents / 100).toFixed(0)}
                <span className="text-lg font-normal text-gray-500">/{BillingLabel[plan.billing_interval]}</span>
              </div>
              <p className="mt-2 line-through text-gray-400">
                ${(plan.strike_price_cents / 100).toFixed(0)}
              </p>
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-2 text-gray-700 flex-1">
              <li>✅ Unlimited AI Chat</li>
              <li>✅ Unlimited Access to 500+ High-Quality Questions</li>
              <li>✅ Detailed Performance Analytics</li>
              {plan.billing_interval === 'month' ? (
                <li>✅ Standard Email Support</li>
              ) : (
                <li>✅ Priority Support</li>
              )}
            </ul>

            {/* CTA */}
            <button
              className="mt-8 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setSelectedPlan(plan)}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
