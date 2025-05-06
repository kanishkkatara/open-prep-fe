// src/components/CheckoutForm.tsx
import React, { useState } from 'react';
import type { Plan } from '../../lib/types';

interface CheckoutFormProps {
  plan: Plan;
  onBack: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/subscriptions/create_intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id }),
      });
      if (!resp.ok) throw new Error('Payment failed');
      setSucceeded(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">🎉 Subscription Active!</h2>
        <p className="mb-6">
          You’ve successfully subscribed to the <strong>{plan.name}</strong> plan.
        </p>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <button onClick={onBack} className="text-blue-600 underline mb-4">
        ← Back to Plans
      </button>
      <h3 className="text-xl font-semibold mb-2">Confirm {plan.name}</h3>
      <p className="mb-4">
        Total: <strong>${(plan.price_cents / 100).toFixed(0)}</strong>
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default CheckoutForm;
