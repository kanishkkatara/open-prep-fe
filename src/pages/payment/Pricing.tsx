import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlans, startFreeTrial, fetchMySubscription } from "../../lib/api";
import { Plan, Subscription } from "../../lib/types";
import { Loader, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetchMySubscription()
      .then((sub: Subscription | null) => {
        if (sub && sub.plan_id === null) setHasUsedTrial(true);
      })
      .catch((err: any) => {
        if (!err.message.includes("404")) setError(err.message);
      });
  }, []);

  const handleTrial = async () => {
    try {
      await startFreeTrial();
      navigate("/app/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const maxSavings = plans.length
    ? Math.max(
        ...plans.map((plan) => {
          const price = plan.price_cents;
          const strike = plan.strike_price_cents || 1;
          return Math.round((1 - price / strike) * 100);
        })
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={48} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-8">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Brand Identity Block */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center justify-center gap-3 mb-10"
      >
        <div className="bg-blue-600 p-3 rounded-full">
          <BookOpen size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">OpenPrep</h1>
      </motion.div>

      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Choose Your Plan</h1>

      {/* Trial or Limited Time Banner */}
      {!hasUsedTrial ? (
        <div className="mb-12 bg-green-50 border border-green-500 rounded-xl px-6 py-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left shadow-sm">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-green-700">Try all features free for 5 days</h2>
            <p className="text-green-600 text-sm mt-1">No card required. Full platform access. Cancel anytime.</p>
          </div>
          <button
            onClick={handleTrial}
            className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
          >
            Start Free Trial
          </button>
        </div>
      ) : (
        <div className="mb-10 max-w-7xl mx-auto rounded-2xl bg-yellow-400 px-8 py-5 text-center shadow-md ring-1 ring-yellow-600/50">
          <p className="text-lg font-bold text-yellow-900 leading-tight">
            <span role="img" aria-label="fire">🔥</span>
            <span className="underline underline-offset-4 decoration-yellow-700 decoration-2 mx-1">
              Limited Time Deal
            </span>
            :
            Save up to <span className="text-red-700 font-extrabold">{maxSavings}%</span> on your plan!
            <span className="ml-1" role="img" aria-label="alarm clock">⏰</span>
            <span className="ml-2 inline-block animate-bounce text-yellow-900">Offer ends soon!</span>
          </p>
        </div>
      )}

      {/* Paid Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = (plan.price_cents / 100).toFixed(0);
          const strike = (plan.strike_price_cents / 100).toFixed(0);
          const monthly = (
            parseInt(price) /
            (plan.billing_interval === "semiannual"
              ? 6
              : plan.billing_interval === "annual"
              ? 12
              : 1)
          ).toFixed(2);
          const savings = Math.round((1 - parseInt(price) / parseInt(strike)) * 100);
          const intervalLabel =
            plan.billing_interval === "month"
              ? "per month"
              : plan.billing_interval === "semiannual"
              ? "per 6 months"
              : "per year";
          const isPopular = plan.billing_interval === "semiannual";
          const isBestValue = plan.billing_interval === "annual";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col bg-white border-2 rounded-xl p-8 shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]
                ${isPopular ? "border-blue-600" : "border-gray-200"}`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold uppercase tracking-wide py-1 px-3 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
              {isBestValue && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold uppercase tracking-wide py-1 px-3 rounded-bl-lg rounded-tr-lg">
                  Best Value
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>

              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-extrabold text-gray-900">${price}</span>
                <span className="ml-2 text-lg text-gray-600">{intervalLabel}</span>
              </div>

              <div className="flex items-center space-x-4 mb-2">
                <span className="text-gray-400 line-through">${strike}</span>
                <span className="text-green-600 font-semibold">{savings}% off</span>
              </div>

              <p className="text-gray-700 mb-1">≈ ${monthly} /month</p>
              <p className="text-sm text-gray-500 mb-4 capitalize">Billed {intervalLabel}</p>

              <ul className="mb-6 space-y-2 text-gray-700 text-sm">
                <li>✅ Unlimited AI Chat</li>
                <li>✅ 500+ High-Quality Questions</li>
                <li>✅ Priority Support</li>
              </ul>

              <button
                onClick={() => navigate(`/app/checkout?planId=${plan.id}`)}
                className={`mt-auto w-full py-3 rounded-lg font-semibold text-white transition
                  ${isPopular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-900"}`}
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
