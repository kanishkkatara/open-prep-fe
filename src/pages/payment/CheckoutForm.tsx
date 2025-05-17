import React, { useState } from "react";
import { Plan } from "../../lib/types";
import { createOrder } from "../../lib/api";

interface CheckoutFormProps {
  plan: Plan;
  onBack: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError("Payment SDK not loaded. Please try again later.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create an order from the backend
      const order = await createOrder(plan.id);
      const { gateway_order_id, amount_cents, currency } = order;

      // 2️⃣ Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount_cents,
        currency,
        name: "OpenPrep",
        description: `${plan.name} Subscription`,
        order_id: gateway_order_id,
        handler: (response: any) => {
          setSucceeded(true);

          // ✅ Google Ads Conversion Tracking
          if (window.gtag) {
            window.gtag("event", "conversion", {
              send_to: "AW-17086379635/purchase", // Replace with your conversion label
              value: amount_cents / 100,
              currency,
              transaction_id: response.razorpay_payment_id,
            });
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment popup closed. Please complete payment to subscribe.");
          },
        },
      };

      // 3️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setError(resp.error.description || "Payment failed");
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => (window.location.href = "/app/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <button
        onClick={onBack}
        className="text-blue-600 underline mb-4 hover:text-blue-800"
      >
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
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default CheckoutForm;
