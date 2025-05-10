// src/components/PricingPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlans, startFreeTrial, fetchMySubscription } from "../../lib/api";
import { Plan, Subscription } from "../../lib/types";
import { Loader } from "lucide-react";

const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load paid plans
    fetchPlans()
      .then(setPlans)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Check if user has already used their free trial
    fetchMySubscription()
      .then((sub: Subscription | null) => {
        if (sub && sub.plan_id === null) {
          setHasUsedTrial(true);
        }
      })
      .catch((err: any) => {
        // on network/server errors, surface it; null means “no subscription” so we ignore
        if (!err.message.includes("404")) {
          setError(err.message);
        }
      });
  }, []);

  const handleTrial = async () => {
    try {
      await startFreeTrial();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={48} className="animate-spin text-gray-500" />
      </div>
    );
  }
  if (error)   return <div className="text-red-600 p-8">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 5-Day Free Trial */}
        {!hasUsedTrial && (
          <div className="relative border rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-4">5-Day Free Trial</h2>
            <p className="text-5xl font-bold mb-4">Free</p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>✅ Unlimited AI Chat</li>
              <li>✅ Unlimited Access to 500+ High-Quality Questions</li>
              <li>✅ Full Platform Access</li>
            </ul>
            <button
              onClick={handleTrial}
              className="mt-auto w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Start Free Trial
            </button>
          </div>
        )}

        {/* Paid Plans */}
        {plans.map((plan) => {
          const price = (plan.price_cents / 100).toFixed(0);
          const strike = (plan.strike_price_cents / 100).toFixed(0);
          const intervalLabel =
            plan.billing_interval === "month"
              ? "/per month"
              : plan.billing_interval === "semiannual"
              ? "/per 6 months"
              : "/per year";
          const isPopular = plan.billing_interval === "semiannual";

          return (
            <div
              key={plan.id}
              className={`relative border rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition ${
                isPopular ? "border-blue-500" : ""
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-3 rounded-bl-lg text-sm">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold">${price}</span>
                <span className="ml-2 text-lg text-gray-600">{intervalLabel}</span>
              </div>
              <p className="line-through text-gray-400 mb-4">${strike}</p>
              <ul className="mb-6 space-y-2 text-gray-700">
                <li>✅ Unlimited AI Chat</li>
                <li>✅ Unlimited Access to 500+ High-Quality Questions</li>
                <li>
                  ✅ Priority Support
                  {plan.billing_interval !== "month" ? " (Long-term)" : ""}
                </li>
              </ul>
              <button
                onClick={() => navigate(`/app/checkout?planId=${plan.id}`)}
                className={`mt-auto w-full py-3 text-white rounded-lg font-semibold transition ${
                  isPopular
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;
